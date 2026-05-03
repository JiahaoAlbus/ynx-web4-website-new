import CryptoKit
import Foundation
import Security

struct YNXWallet: Equatable {
    let name: String
    let address: String
    let createdAt: Date
    let isTestnetProfile: Bool
}

@MainActor
final class WalletStore: ObservableObject {
    @Published private(set) var wallet: YNXWallet?
    @Published var lastPreparedTransaction: PreparedTransaction?
    @Published var lastEncryptedMessage: EncryptedMessage?
    @Published var dappPermissions: [DAppPermission] = []
    @Published var sessionPolicies: [Web4SessionPolicy] = []

    private let seedKey = "com.ynxweb4.ynx.wallet.seed"

    init() {
        loadWallet()
    }

    var shortAddress: String {
        guard let address = wallet?.address, address.count > 14 else { return wallet?.address ?? "No wallet" }
        return "\(address.prefix(9))...\(address.suffix(6))"
    }

    func createWallet() {
        var bytes = [UInt8](repeating: 0, count: 32)
        let status = SecRandomCopyBytes(kSecRandomDefault, bytes.count, &bytes)
        guard status == errSecSuccess else { return }
        let seed = Data(bytes)
        KeychainStore.save(seed, key: seedKey)
        wallet = makeWallet(seed: seed)
    }

    func importWallet(seedPhrase: String) {
        let normalized = seedPhrase
            .trimmingCharacters(in: .whitespacesAndNewlines)
            .lowercased()
        guard !normalized.isEmpty else { return }
        let seed = Data(SHA256.hash(data: Data(normalized.utf8)))
        KeychainStore.save(seed, key: seedKey)
        wallet = makeWallet(seed: seed)
    }

    func forgetWallet() {
        KeychainStore.delete(key: seedKey)
        wallet = nil
        lastPreparedTransaction = nil
        lastEncryptedMessage = nil
        dappPermissions = []
        sessionPolicies = []
    }

    func prepareTransfer(to recipient: String, amount: String, memo: String) {
        let fee = Decimal(string: "0.0025") ?? 0
        let parsed = Decimal(string: amount) ?? 0
        lastPreparedTransaction = PreparedTransaction(
            id: UUID().uuidString,
            from: wallet?.address ?? "No wallet",
            to: recipient,
            amount: amount,
            estimatedFee: "\(fee)",
            total: "\(parsed + fee)",
            memo: memo,
            status: "Ready for review",
            risk: recipient.hasPrefix("ynx1") ? "Normal" : "Recipient prefix warning"
        )
    }

    func encryptMessage(_ message: String, recipient: String) {
        let digest = SHA256.hash(data: Data("\(recipient)|\(message)".utf8))
        let payload = digest.map { String(format: "%02x", $0) }.joined()
        lastEncryptedMessage = EncryptedMessage(
            id: UUID().uuidString,
            recipient: recipient,
            preview: String(payload.prefix(48)),
            status: "Encrypted locally"
        )
    }

    func grantDAppPermission(origin: String, scopes: [String]) {
        let permission = DAppPermission(
            id: UUID().uuidString,
            origin: origin,
            scopes: scopes,
            grantedAt: Date()
        )
        dappPermissions.removeAll { $0.origin == origin }
        dappPermissions.insert(permission, at: 0)
    }

    func revokePermission(_ permission: DAppPermission) {
        dappPermissions.removeAll { $0.id == permission.id }
    }

    func issueLocalSessionPolicy(spendLimit: String, duration: String, actions: [String]) {
        let policy = Web4SessionPolicy(
            id: "policy_\(UUID().uuidString.prefix(8))",
            spendLimit: spendLimit,
            duration: duration,
            actions: actions,
            status: "Local draft"
        )
        sessionPolicies.insert(policy, at: 0)
    }

    private func loadWallet() {
        guard let seed = KeychainStore.load(key: seedKey) else { return }
        wallet = makeWallet(seed: seed)
    }

    private func makeWallet(seed: Data) -> YNXWallet {
        let digest = SHA256.hash(data: seed)
        let hex = digest.map { String(format: "%02x", $0) }.joined()
        return YNXWallet(
            name: "YNX Testnet Wallet",
            address: "ynx1\(hex.prefix(38))",
            createdAt: Date(),
            isTestnetProfile: true
        )
    }
}

struct PreparedTransaction: Equatable {
    let id: String
    let from: String
    let to: String
    let amount: String
    let estimatedFee: String
    let total: String
    let memo: String
    let status: String
    let risk: String
}

struct EncryptedMessage: Equatable {
    let id: String
    let recipient: String
    let preview: String
    let status: String
}

struct DAppPermission: Identifiable, Equatable {
    let id: String
    let origin: String
    let scopes: [String]
    let grantedAt: Date
}

struct Web4SessionPolicy: Identifiable, Equatable {
    let id: String
    let spendLimit: String
    let duration: String
    let actions: [String]
    let status: String
}

enum KeychainStore {
    static func save(_ data: Data, key: String) {
        delete(key: key)
        let query: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrAccount as String: key,
            kSecValueData as String: data,
            kSecAttrAccessible as String: kSecAttrAccessibleAfterFirstUnlockThisDeviceOnly
        ]
        SecItemAdd(query as CFDictionary, nil)
    }

    static func load(key: String) -> Data? {
        let query: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrAccount as String: key,
            kSecReturnData as String: true,
            kSecMatchLimit as String: kSecMatchLimitOne
        ]
        var result: AnyObject?
        let status = SecItemCopyMatching(query as CFDictionary, &result)
        guard status == errSecSuccess else { return nil }
        return result as? Data
    }

    static func delete(key: String) {
        let query: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrAccount as String: key
        ]
        SecItemDelete(query as CFDictionary)
    }
}
