import SwiftUI

enum ChainActionMode: String, CaseIterable, Identifiable {
    case transfer = "Transfer"
    case broadcast = "Broadcast"
    case faucet = "Faucet"
    case message = "Message"
    case session = "Session"
    case thirdParty = "Third-party"

    var id: String { rawValue }
}

struct ChainActionsView: View {
    @EnvironmentObject private var walletStore: WalletStore
    @State private var recipient = ""
    @State private var amount = ""
    @State private var memo = ""
    @State private var signedTxBytes = ""
    @State private var broadcastMode = BroadcastMode.sync
    @State private var faucetAddress = ""
    @State private var faucetStatus = "Ready to request testnet tokens."
    @State private var isRequestingFaucet = false
    @State private var messageRecipient = ""
    @State private var message = ""
    @State private var spendLimit = "10"
    @State private var sessionDuration = "1 hour"
    @State private var thirdPartyURL = "https://httpbin.org/get"
    @State private var thirdPartyAction = "service.invoke"
    @State private var thirdPartyAmount = "1"
    @Binding var selectedMode: ChainActionMode
    @State private var showReview = false

    var body: some View {
        PageContainer {
            ScreenHeader(
                eyebrow: "Operate YNX",
                title: "Actions",
                subtitle: "Prepare transfers, broadcast signed transactions, request faucet tokens, and run live Web4 actions."
            )
            .staggered(0)

            Picker("Mode", selection: $selectedMode) {
                ForEach(ChainActionMode.allCases) { mode in
                    Text(mode.rawValue).tag(mode)
                }
            }
            .pickerStyle(.segmented)
            .staggered(1)

            if selectedMode == .transfer {
                transferCard.staggered(2)
            } else if selectedMode == .broadcast {
                broadcastCard.staggered(2)
            } else if selectedMode == .faucet {
                faucetCard.staggered(2)
            } else if selectedMode == .message {
                messageCard.staggered(2)
            } else if selectedMode == .thirdParty {
                thirdPartyCard.staggered(2)
            } else {
                sessionCard.staggered(2)
            }

            if let tx = walletStore.lastPreparedTransaction {
                preparedTransaction(tx).staggered(3)
            }

            if let encrypted = walletStore.lastEncryptedMessage {
                encryptedMessage(encrypted).staggered(4)
            }

            if let job = walletStore.lastAIJob {
                liveAIJob(job).staggered(5)
            }
        }
        .onAppear {
            if faucetAddress.isEmpty, let address = walletStore.wallet?.address {
                faucetAddress = address
            }
        }
    }

    private var transferCard: some View {
        GlassCard(padding: 18, radius: 28) {
            VStack(alignment: .leading, spacing: 14) {
                HStack {
                    LivePulse(symbol: "arrow.left.arrow.right", color: YNXTheme.klein)
                    VStack(alignment: .leading, spacing: 4) {
                        Text("Send \(YNX.denom)")
                            .font(.headline)
                        Text(walletStore.wallet == nil ? "Create a wallet first" : "\(walletStore.shortAddress) • prepare only")
                            .font(.caption.monospaced())
                            .foregroundStyle(YNXTheme.muted)
                    }
                }
                TextField("Recipient ynx1...", text: $recipient)
                    .textFieldStyle(.roundedBorder)
                    .ynxNoAutocapitalization()
                TextField("Amount", text: $amount)
                    .textFieldStyle(.roundedBorder)
                    #if os(iOS)
                    .keyboardType(.decimalPad)
                    #endif
                TextField("Memo", text: $memo)
                    .textFieldStyle(.roundedBorder)
                Button {
                    walletStore.prepareTransfer(to: recipient, amount: amount, memo: memo)
                    showReview = true
                } label: {
                    Label("Prepare Transfer Draft", systemImage: "checkmark.seal.fill")
                        .font(.headline)
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 13)
                        .background(walletStore.wallet == nil ? Color.gray.opacity(0.18) : YNXTheme.klein, in: Capsule())
                        .foregroundStyle(walletStore.wallet == nil ? YNXTheme.muted : .white)
                }
                .buttonStyle(PressableButtonStyle())
                .disabled(walletStore.wallet == nil)
            }
        }
        .sheet(isPresented: $showReview) {
            if let tx = walletStore.lastPreparedTransaction {
                TransactionReviewSheet(tx: tx)
                    .presentationDetents([.medium, .large])
            }
        }
    }

    private var broadcastCard: some View {
        GlassCard(padding: 18, radius: 28) {
            VStack(alignment: .leading, spacing: 14) {
                HStack {
                    LivePulse(symbol: "antenna.radiowaves.left.and.right", color: YNXTheme.klein)
                    VStack(alignment: .leading, spacing: 4) {
                        Text("Broadcast signed transaction")
                            .font(.headline)
                        Text("Submit base64 tx_bytes to the live YNX REST broadcast endpoint.")
                            .font(.caption)
                            .foregroundStyle(YNXTheme.muted)
                    }
                }

                TextField("Signed tx_bytes base64", text: $signedTxBytes, axis: .vertical)
                    .textFieldStyle(.roundedBorder)
                    .lineLimit(4...8)
                    .ynxNoAutocapitalization()

                Picker("Broadcast mode", selection: $broadcastMode) {
                    ForEach(BroadcastMode.allCases) { mode in
                        Text(mode.label).tag(mode)
                    }
                }
                .pickerStyle(.segmented)

                GlassCard(padding: 12, radius: 18) {
                    HStack(alignment: .top, spacing: 10) {
                        Image(systemName: walletStore.broadcastStatus.hasPrefix("Broadcast accepted") ? "checkmark.seal.fill" : "info.circle.fill")
                            .foregroundStyle(walletStore.broadcastStatus.hasPrefix("Broadcast accepted") ? .green : YNXTheme.klein)
                        Text(walletStore.broadcastStatus)
                            .font(.caption)
                            .foregroundStyle(YNXTheme.muted)
                            .fixedSize(horizontal: false, vertical: true)
                    }
                }

                Button {
                    Task {
                        await walletStore.broadcastSignedTransaction(
                            txBytesBase64: signedTxBytes,
                            mode: broadcastMode
                        )
                    }
                } label: {
                    Label(walletStore.isBroadcasting ? "Broadcasting..." : "Broadcast to Testnet", systemImage: "paperplane.fill")
                        .font(.headline)
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 13)
                        .background(canBroadcast ? YNXTheme.klein : Color.gray.opacity(0.18), in: Capsule())
                        .foregroundStyle(canBroadcast ? .white : YNXTheme.muted)
                }
                .buttonStyle(PressableButtonStyle())
                .disabled(!canBroadcast || walletStore.isBroadcasting)

                if let result = walletStore.lastBroadcastResult {
                    broadcastResult(result)
                }
            }
        }
    }

    private var faucetCard: some View {
        GlassCard(padding: 18, radius: 28) {
            VStack(alignment: .leading, spacing: 14) {
                HStack {
                    LivePulse(symbol: "drop.fill", color: .cyan)
                    VStack(alignment: .leading, spacing: 4) {
                        Text("Testnet faucet")
                            .font(.headline)
                        Text("Request \(YNX.denom) for transfers, AI jobs, and validator test flows.")
                            .font(.caption)
                            .foregroundStyle(YNXTheme.muted)
                    }
                }

                HStack(spacing: 10) {
                    TextField("Recipient ynx1...", text: $faucetAddress)
                        .textFieldStyle(.roundedBorder)
                        .ynxNoAutocapitalization()
                    Button {
                        if let address = walletStore.wallet?.address {
                            faucetAddress = address
                        }
                    } label: {
                        Image(systemName: "wallet.pass")
                            .font(.headline)
                            .frame(width: 42, height: 38)
                            .background(YNXTheme.klein.opacity(0.1), in: RoundedRectangle(cornerRadius: 12, style: .continuous))
                    }
                    .buttonStyle(PressableButtonStyle())
                    .foregroundStyle(YNXTheme.klein)
                    .disabled(walletStore.wallet == nil)
                }

                Button {
                    Task { await requestFaucet() }
                } label: {
                    Label(isRequestingFaucet ? "Requesting..." : "Request Test Tokens", systemImage: isRequestingFaucet ? "arrow.triangle.2.circlepath" : "drop.fill")
                        .font(.headline)
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 13)
                        .background(canRequestFaucet ? YNXTheme.klein : Color.gray.opacity(0.18), in: Capsule())
                        .foregroundStyle(canRequestFaucet ? .white : YNXTheme.muted)
                }
                .buttonStyle(PressableButtonStyle())
                .disabled(!canRequestFaucet || isRequestingFaucet)

                GlassCard(padding: 12, radius: 18) {
                    HStack(alignment: .top, spacing: 10) {
                        Image(systemName: faucetStatus.hasPrefix("Success") ? "checkmark.seal.fill" : "info.circle.fill")
                            .foregroundStyle(faucetStatus.hasPrefix("Success") ? .green : YNXTheme.klein)
                        Text(faucetStatus)
                            .font(.caption)
                            .foregroundStyle(YNXTheme.muted)
                            .fixedSize(horizontal: false, vertical: true)
                    }
                }
            }
        }
    }

    private var messageCard: some View {
        GlassCard(padding: 18, radius: 28) {
            VStack(alignment: .leading, spacing: 14) {
                HStack {
                    LivePulse(symbol: "lock.doc", color: .indigo)
                    VStack(alignment: .leading, spacing: 4) {
                        Text("Encrypted Web4 message")
                            .font(.headline)
                        Text("Local CryptoKit envelope for Web4 policy messages.")
                            .font(.caption)
                            .foregroundStyle(YNXTheme.muted)
                    }
                }
                TextField("Recipient identity", text: $messageRecipient)
                    .textFieldStyle(.roundedBorder)
                    .ynxNoAutocapitalization()
                TextField("Message", text: $message, axis: .vertical)
                    .textFieldStyle(.roundedBorder)
                    .lineLimit(3...6)
                Button {
                    walletStore.encryptMessage(message, recipient: messageRecipient)
                } label: {
                    Label("Encrypt Message", systemImage: "lock.fill")
                        .font(.headline)
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 13)
                        .background(.indigo, in: Capsule())
                        .foregroundStyle(.white)
                }
                .buttonStyle(PressableButtonStyle())
            }
        }
    }

    private var sessionCard: some View {
        GlassCard(padding: 18, radius: 28) {
            VStack(alignment: .leading, spacing: 14) {
                HStack {
                    LivePulse(symbol: "key.radiowaves.forward", color: .green)
                    VStack(alignment: .leading, spacing: 4) {
                        Text("Web4 session")
                            .font(.headline)
                        Text("Owner > Policy > Session Key > Agent Action")
                            .font(.caption.monospaced())
                            .foregroundStyle(YNXTheme.muted)
                    }
                }
                TextField("Spend limit (\(YNX.denom))", text: $spendLimit)
                    .textFieldStyle(.roundedBorder)
                TextField("Duration", text: $sessionDuration)
                    .textFieldStyle(.roundedBorder)
                ForEach(Array(settlementSteps.enumerated()), id: \.element.id) { index, step in
                    HStack(spacing: 12) {
                        Text("\(index + 1)")
                            .font(.caption.monospaced().weight(.bold))
                            .foregroundStyle(.white)
                            .frame(width: 26, height: 26)
                            .background(YNXTheme.klein, in: Circle())
                        VStack(alignment: .leading, spacing: 2) {
                            Text(step.title)
                                .font(.subheadline.weight(.semibold))
                            Text(step.detail)
                                .font(.caption)
                                .foregroundStyle(YNXTheme.muted)
                        }
                    }
                }
                GlassCard(padding: 12, radius: 18) {
                    HStack(alignment: .top, spacing: 10) {
                        Image(systemName: walletStore.liveActionStatus.hasPrefix("Live") ? "checkmark.seal.fill" : "info.circle.fill")
                            .foregroundStyle(walletStore.liveActionStatus.hasPrefix("Live") ? .green : YNXTheme.klein)
                        Text(walletStore.liveActionStatus)
                            .font(.caption)
                            .foregroundStyle(YNXTheme.muted)
                            .fixedSize(horizontal: false, vertical: true)
                    }
                }

                Button {
                    Task {
                        await walletStore.issueLiveSessionPolicy(
                            spendLimit: spendLimit,
                            actions: ["ai.job.create", "ai.job.commit", "ai.job.finalize", "ai.payment.charge"]
                        )
                    }
                } label: {
                    Label(walletStore.isRunningLiveAction ? "Issuing..." : "Issue Live Session", systemImage: "key.fill")
                        .font(.headline)
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 13)
                        .background(walletStore.wallet == nil ? Color.gray.opacity(0.18) : .green, in: Capsule())
                        .foregroundStyle(walletStore.wallet == nil ? YNXTheme.muted : .white)
                }
                .buttonStyle(PressableButtonStyle())
                .disabled(walletStore.wallet == nil || walletStore.isRunningLiveAction)

                Button {
                    Task { await walletStore.createLiveAIJob() }
                } label: {
                    Label(walletStore.isRunningLiveAction ? "Creating..." : "Create Live AI Job", systemImage: "cpu.fill")
                        .font(.headline)
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 13)
                        .background(walletStore.wallet == nil ? Color.gray.opacity(0.18) : YNXTheme.klein, in: Capsule())
                        .foregroundStyle(.white)
                }
                .buttonStyle(PressableButtonStyle())
                .disabled(walletStore.wallet == nil || walletStore.isRunningLiveAction)
            }
        }
    }

    private var thirdPartyCard: some View {
        GlassCard(padding: 18, radius: 28) {
            VStack(alignment: .leading, spacing: 14) {
                HStack {
                    LivePulse(symbol: "network", color: .teal)
                    VStack(alignment: .leading, spacing: 4) {
                        Text("Any third-party API")
                            .font(.headline)
                        Text("Authorize first via Web4 policy/session, then call the real endpoint.")
                            .font(.caption)
                            .foregroundStyle(YNXTheme.muted)
                    }
                }

                TextField("Service URL", text: $thirdPartyURL)
                    .textFieldStyle(.roundedBorder)
                    .ynxNoAutocapitalization()
                TextField("Action", text: $thirdPartyAction)
                    .textFieldStyle(.roundedBorder)
                    .ynxNoAutocapitalization()
                TextField("Amount", text: $thirdPartyAmount)
                    .textFieldStyle(.roundedBorder)
                    #if os(iOS)
                    .keyboardType(.decimalPad)
                    #endif

                Button {
                    Task {
                        await walletStore.testThirdPartyAPI(
                            serviceURL: thirdPartyURL,
                            action: thirdPartyAction,
                            amount: thirdPartyAmount
                        )
                    }
                } label: {
                    Label(walletStore.isRunningLiveAction ? "Testing..." : "Authorize and Test API", systemImage: "bolt.shield.fill")
                        .font(.headline)
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 13)
                        .background(walletStore.wallet == nil ? Color.gray.opacity(0.18) : .teal, in: Capsule())
                        .foregroundStyle(walletStore.wallet == nil ? YNXTheme.muted : .white)
                }
                .buttonStyle(PressableButtonStyle())
                .disabled(walletStore.wallet == nil || walletStore.isRunningLiveAction)

                GlassCard(padding: 12, radius: 18) {
                    Text(walletStore.thirdPartyStatus)
                        .font(.caption)
                        .foregroundStyle(YNXTheme.muted)
                        .fixedSize(horizontal: false, vertical: true)
                }
                if !walletStore.thirdPartyAuditTrail.isEmpty {
                    GlassCard(padding: 12, radius: 18) {
                        VStack(alignment: .leading, spacing: 8) {
                            Text("Latest audit trail")
                                .font(.caption.weight(.semibold))
                                .foregroundStyle(YNXTheme.ink)
                            Text(walletStore.thirdPartyAuditTrail)
                                .font(.caption2.monospaced())
                                .foregroundStyle(YNXTheme.muted)
                                .fixedSize(horizontal: false, vertical: true)
                        }
                    }
                }
            }
        }
    }

    private func preparedTransaction(_ tx: PreparedTransaction) -> some View {
        GlassCard {
            VStack(alignment: .leading, spacing: 10) {
                Text("Prepared transaction")
                    .font(.headline)
                FactRow(label: "From", value: short(tx.from))
                FactRow(label: "To", value: short(tx.to))
                FactRow(label: "Amount", value: "\(tx.amount) \(YNX.denom)")
                FactRow(label: "Fee", value: "\(tx.estimatedFee) \(YNX.denom)")
                FactRow(label: "Total", value: "\(tx.total) \(YNX.denom)")
                FactRow(label: "Risk", value: tx.risk)
                FactRow(label: "Status", value: tx.status)
            }
        }
    }

    private func encryptedMessage(_ encrypted: EncryptedMessage) -> some View {
        GlassCard {
            VStack(alignment: .leading, spacing: 10) {
                Text("Encrypted message")
                    .font(.headline)
                FactRow(label: "Recipient", value: short(encrypted.recipient))
                FactRow(label: "Cipher preview", value: encrypted.preview)
                FactRow(label: "Status", value: encrypted.status)
            }
        }
    }

    private func liveAIJob(_ job: LiveAIJob) -> some View {
        GlassCard {
            VStack(alignment: .leading, spacing: 10) {
                Text("Live AI job")
                    .font(.headline)
                FactRow(label: "Job", value: job.jobID)
                FactRow(label: "Status", value: job.status)
                FactRow(label: "Gateway", value: "ai.ynxweb4.com")
            }
        }
    }

    private func broadcastResult(_ result: BroadcastResult) -> some View {
        GlassCard(padding: 12, radius: 18) {
            VStack(alignment: .leading, spacing: 8) {
                FactRow(label: "Tx hash", value: result.txhash)
                FactRow(label: "Code", value: "\(result.code)")
                FactRow(label: "Height", value: result.height)
                FactRow(label: "Log", value: result.rawLog.isEmpty ? "Accepted" : result.rawLog)
            }
        }
    }

    private var canRequestFaucet: Bool {
        faucetAddress.trimmingCharacters(in: .whitespacesAndNewlines).hasPrefix("ynx1")
    }

    private var canBroadcast: Bool {
        !signedTxBytes.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty
    }

    private func requestFaucet() async {
        let address = faucetAddress.trimmingCharacters(in: .whitespacesAndNewlines)
        guard let encoded = address.addingPercentEncoding(withAllowedCharacters: .urlQueryAllowed),
              let url = URL(string: "https://faucet.ynxweb4.com/faucet?address=\(encoded)")
        else {
            faucetStatus = "Enter a valid ynx1 testnet address."
            return
        }

        isRequestingFaucet = true
        defer { isRequestingFaucet = false }

        do {
            var request = URLRequest(url: url)
            request.timeoutInterval = 10
            let (data, response) = try await URLSession.shared.data(for: request)
            let statusCode = (response as? HTTPURLResponse)?.statusCode ?? 0
            let body = String(data: data, encoding: .utf8) ?? "No response body"
            if (200..<300).contains(statusCode) {
                faucetStatus = "Success. Faucet accepted the request for \(short(address))."
                await walletStore.refreshBalance()
            } else if statusCode == 429 {
                faucetStatus = "Rate limited. This IP has already requested faucet tokens recently. Wait for the faucet window to reset, then try again or refresh balance."
            } else {
                faucetStatus = "Faucet returned HTTP \(statusCode): \(body.prefix(120))"
            }
        } catch {
            faucetStatus = "Faucet request failed: \(error.localizedDescription)"
        }
    }

    private func short(_ value: String) -> String {
        guard value.count > 16 else { return value }
        return "\(value.prefix(8))...\(value.suffix(6))"
    }
}

struct TransactionReviewSheet: View {
    let tx: PreparedTransaction
    @Environment(\.dismiss) private var dismiss
    @State private var armed = false

    var body: some View {
        ZStack {
            PhoneBackground()
            VStack(alignment: .leading, spacing: 18) {
                Capsule()
                    .fill(YNXTheme.hairline)
                    .frame(width: 46, height: 5)
                    .frame(maxWidth: .infinity)

                ScreenHeader(
                    eyebrow: "Testnet Review",
                    title: "Review transfer draft",
                    subtitle: "This draft uses live wallet data. Sign it with a Cosmos signer, then paste signed tx_bytes in Broadcast."
                )

                GlassCard {
                    VStack(alignment: .leading, spacing: 12) {
                        FactRow(label: "From", value: short(tx.from))
                        FactRow(label: "To", value: short(tx.to))
                        FactRow(label: "Amount", value: "\(tx.amount) \(YNX.denom)")
                        FactRow(label: "Estimated fee", value: "\(tx.estimatedFee) \(YNX.denom)")
                        FactRow(label: "Total", value: "\(tx.total) \(YNX.denom)")
                        FactRow(label: "Risk", value: tx.risk)
                    }
                }

                Toggle("I understand this is a testnet transaction flow", isOn: $armed)
                    .font(.callout.weight(.semibold))

                Button {
                    dismiss()
                } label: {
                    Label("Close Review", systemImage: armed ? "checkmark.seal.fill" : "lock.fill")
                        .font(.headline)
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 14)
                        .background(armed ? YNXTheme.klein : Color.gray.opacity(0.18), in: Capsule())
                        .foregroundStyle(armed ? .white : YNXTheme.muted)
                }
                .buttonStyle(PressableButtonStyle())

                Spacer()
            }
            .padding(20)
        }
    }

    private func short(_ value: String) -> String {
        guard value.count > 16 else { return value }
        return "\(value.prefix(8))...\(value.suffix(6))"
    }
}
