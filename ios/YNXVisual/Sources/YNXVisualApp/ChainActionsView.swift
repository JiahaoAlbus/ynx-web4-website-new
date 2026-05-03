import SwiftUI

struct ChainActionsView: View {
    @EnvironmentObject private var walletStore: WalletStore
    @State private var recipient = ""
    @State private var amount = ""
    @State private var memo = ""
    @State private var messageRecipient = ""
    @State private var message = ""
    @State private var spendLimit = "10"
    @State private var sessionDuration = "1 hour"
    @State private var selectedMode = 0
    @State private var showReview = false

    var body: some View {
        PageContainer {
            ScreenHeader(
                eyebrow: "Operate YNX",
                title: "Actions",
                subtitle: "Prepare testnet transfers, encrypt messages, and issue policy-bounded Web4 sessions."
            )
            .staggered(0)

            Picker("Mode", selection: $selectedMode) {
                Text("Transfer").tag(0)
                Text("Message").tag(1)
                Text("Session").tag(2)
            }
            .pickerStyle(.segmented)
            .staggered(1)

            if selectedMode == 0 {
                transferCard.staggered(2)
            } else if selectedMode == 1 {
                messageCard.staggered(2)
            } else {
                sessionCard.staggered(2)
            }

            if let tx = walletStore.lastPreparedTransaction {
                preparedTransaction(tx).staggered(3)
            }

            if let encrypted = walletStore.lastEncryptedMessage {
                encryptedMessage(encrypted).staggered(4)
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
                        Text(walletStore.wallet == nil ? "Create a wallet first" : walletStore.shortAddress)
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
                    Label("Prepare Transaction", systemImage: "checkmark.seal.fill")
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

    private var messageCard: some View {
        GlassCard(padding: 18, radius: 28) {
            VStack(alignment: .leading, spacing: 14) {
                HStack {
                    LivePulse(symbol: "lock.doc", color: .indigo)
                    VStack(alignment: .leading, spacing: 4) {
                        Text("Encrypted Web4 message")
                            .font(.headline)
                        Text("Local encryption preview for policy messages.")
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
                Button {
                    walletStore.issueLocalSessionPolicy(
                        spendLimit: spendLimit,
                        duration: sessionDuration,
                        actions: ["agent.job", "vault.spend", "settlement.finalize"]
                    )
                } label: {
                    Label("Draft Session Policy", systemImage: "key.fill")
                        .font(.headline)
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 13)
                        .background(.green, in: Capsule())
                        .foregroundStyle(.white)
                }
                .buttonStyle(PressableButtonStyle())
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
                    title: "Confirm test transfer",
                    subtitle: "A production path must simulate, sign, broadcast, and wait for receipt before showing success."
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
