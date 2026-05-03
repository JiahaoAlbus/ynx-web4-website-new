import Foundation

@MainActor
final class YNXNetworkViewModel: ObservableObject {
    @Published var endpoints: [EndpointStatus] = EndpointKind.allCases.map { EndpointStatus(kind: $0, health: .checking) }
    @Published var validators: [ValidatorInfo] = []
    @Published var latestBlockHeight: String = "Syncing"
    @Published var bondedValidators: Int = YNX.validatorTarget
    @Published var lastRefresh: Date?
    @Published var isRefreshing = false

    private let client = YNXNetworkClient()

    var onlineCount: Int {
        endpoints.filter {
            switch $0.health {
            case .online, .slow, .reachable:
                return true
            case .checking, .timeout, .offline:
                return false
            }
        }.count
    }

    func refresh() async {
        guard !isRefreshing else { return }
        isRefreshing = true
        defer {
            isRefreshing = false
            lastRefresh = Date()
        }

        async let endpointResults = client.checkEndpoints()
        async let block = client.fetchLatestBlockHeight()
        async let validatorList = client.fetchValidators()

        endpoints = await endpointResults
        latestBlockHeight = await block ?? "Unavailable"

        let fetchedValidators = await validatorList
        validators = fetchedValidators
        if !fetchedValidators.isEmpty {
            bondedValidators = fetchedValidators.count
        }
    }
}

struct YNXNetworkClient {
    func checkEndpoints() async -> [EndpointStatus] {
        await withTaskGroup(of: EndpointStatus.self) { group in
            for kind in EndpointKind.allCases {
                group.addTask { await check(kind) }
            }

            var results: [EndpointStatus] = []
            for await result in group {
                results.append(result)
            }

            return results.sorted { lhs, rhs in
                EndpointKind.allCases.firstIndex(of: lhs.kind)! < EndpointKind.allCases.firstIndex(of: rhs.kind)!
            }
        }
    }

    func fetchLatestBlockHeight() async -> String? {
        guard let url = URL(string: "https://rpc.ynxweb4.com/status") else { return nil }

        do {
            var request = URLRequest(url: url)
            request.timeoutInterval = 3.5
            let (data, response) = try await URLSession.shared.data(for: request)
            guard (response as? HTTPURLResponse)?.statusCode ?? 0 < 500 else { return nil }
            let status = try JSONDecoder().decode(TendermintStatusResponse.self, from: data)
            return status.result.syncInfo.latestBlockHeight
        } catch {
            return nil
        }
    }

    func fetchValidators() async -> [ValidatorInfo] {
        guard let url = URL(string: "https://rest.ynxweb4.com/cosmos/staking/v1beta1/validators?status=BOND_STATUS_BONDED") else {
            return fallbackValidators
        }

        do {
            var request = URLRequest(url: url)
            request.timeoutInterval = 3.5
            let (data, _) = try await URLSession.shared.data(for: request)
            let response = try JSONDecoder().decode(ValidatorsResponse.self, from: data)
            let validators = response.validators.prefix(8).map { validator in
                ValidatorInfo(
                    id: validator.operatorAddress,
                    moniker: validator.description.moniker.isEmpty ? shortAddress(validator.operatorAddress) : validator.description.moniker,
                    votingPower: formatToken(validator.tokens),
                    commission: "\(formatRate(validator.commission.commissionRates.rate))%",
                    status: "Bonded"
                )
            }
            return validators.isEmpty ? fallbackValidators : validators
        } catch {
            return fallbackValidators
        }
    }

    private func check(_ kind: EndpointKind) async -> EndpointStatus {
        let start = ContinuousClock.now

        do {
            var request = URLRequest(url: kind.url)
            request.timeoutInterval = 3.5

            if kind == .evm {
                request.httpMethod = "POST"
                request.setValue("application/json", forHTTPHeaderField: "Content-Type")
                request.httpBody = #"{"jsonrpc":"2.0","method":"eth_chainId","params":[],"id":1}"#.data(using: .utf8)
            }

            let (_, response) = try await URLSession.shared.data(for: request)
            let latency = start.duration(to: .now).milliseconds
            let statusCode = (response as? HTTPURLResponse)?.statusCode ?? 0

            if (200..<400).contains(statusCode) {
                let ms = Int(latency)
                return EndpointStatus(kind: kind, health: ms > 2_500 ? .slow(ms) : .online(ms))
            }

            if statusCode == 404 && (kind == .aiGateway || kind == .web4Hub) {
                return EndpointStatus(kind: kind, health: .reachable(Int(latency)))
            }
            return EndpointStatus(kind: kind, health: .offline("HTTP \(statusCode)"))
        } catch {
            return EndpointStatus(kind: kind, health: .timeout)
        }
    }

    private var fallbackValidators: [ValidatorInfo] {
        [
            ValidatorInfo(id: "validator-1", moniker: "YNX Genesis 01", votingPower: "Live", commission: "Testnet", status: "Bonded"),
            ValidatorInfo(id: "validator-2", moniker: "YNX Genesis 02", votingPower: "Live", commission: "Testnet", status: "Bonded"),
            ValidatorInfo(id: "validator-3", moniker: "YNX Genesis 03", votingPower: "Live", commission: "Testnet", status: "Bonded"),
            ValidatorInfo(id: "validator-4", moniker: "YNX Genesis 04", votingPower: "Live", commission: "Testnet", status: "Bonded")
        ]
    }
}

private extension Duration {
    var milliseconds: Int64 {
        let components = components
        return components.seconds * 1_000 + components.attoseconds / 1_000_000_000_000_000
    }
}

private func shortAddress(_ address: String) -> String {
    guard address.count > 12 else { return address }
    return "\(address.prefix(8))...\(address.suffix(4))"
}

private func formatToken(_ value: String) -> String {
    guard let amount = Double(value) else { return value }
    let formatter = NumberFormatter()
    formatter.numberStyle = .decimal
    formatter.maximumFractionDigits = 0
    return formatter.string(from: NSNumber(value: amount)) ?? value
}

private func formatRate(_ value: String) -> String {
    guard let rate = Double(value) else { return "0" }
    return String(format: "%.2f", rate * 100)
}

private struct TendermintStatusResponse: Decodable {
    let result: Result

    struct Result: Decodable {
        let syncInfo: SyncInfo

        enum CodingKeys: String, CodingKey {
            case syncInfo = "sync_info"
        }
    }

    struct SyncInfo: Decodable {
        let latestBlockHeight: String

        enum CodingKeys: String, CodingKey {
            case latestBlockHeight = "latest_block_height"
        }
    }
}

private struct ValidatorsResponse: Decodable {
    let validators: [Validator]

    struct Validator: Decodable {
        let operatorAddress: String
        let tokens: String
        let description: Description
        let commission: Commission

        enum CodingKeys: String, CodingKey {
            case operatorAddress = "operator_address"
            case tokens
            case description
            case commission
        }
    }

    struct Description: Decodable {
        let moniker: String
    }

    struct Commission: Decodable {
        let commissionRates: Rates

        enum CodingKeys: String, CodingKey {
            case commissionRates = "commission_rates"
        }
    }

    struct Rates: Decodable {
        let rate: String
    }
}
