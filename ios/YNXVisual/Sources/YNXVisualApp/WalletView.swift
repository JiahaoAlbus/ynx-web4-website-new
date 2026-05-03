import SwiftUI

struct WalletView: View {
    @EnvironmentObject private var walletStore: WalletStore
    @State private var seedPhrase = ""
    @State private var showImport = false

    var body: some View {
        PageContainer {
            ScreenHeader(
                eyebrow: "Public Testnet Entry",
                title: "Wallet",
                subtitle: "Create a local YNX testnet profile, prepare test transactions, and connect to Web4 flows."
            )
            .staggered(0)

            if let wallet = walletStore.wallet {
                walletCard(wallet)
                    .staggered(1)
                walletActions
                    .staggered(2)
                permissionsCard
                    .staggered(3)
                SecurityCenterView()
                    .staggered(4)
                securityNotice
                    .staggered(5)
            } else {
                onboardingCard
                    .staggered(1)
                importCard
                    .staggered(2)
            }
        }
    }

    private func walletCard(_ wallet: YNXWallet) -> some View {
        GlassCard(padding: 18, radius: 30) {
            VStack(alignment: .leading, spacing: 18) {
                HStack {
                    YNXLogoMark(size: 56)
                    Spacer()
                    StatusPill(label: "TESTNET", color: .orange, systemImage: "testtube.2")
                }
                Text(wallet.name)
                    .font(.system(size: 24, weight: .bold, design: .rounded))
                Text(wallet.address)
                    .font(.callout.monospaced().weight(.semibold))
                    .foregroundStyle(YNXTheme.klein)
                    .lineLimit(2)
                    .textSelection(.enabled)
                HStack {
                    WalletStat(label: "Balance", value: "Connect RPC")
                    WalletStat(label: "Denom", value: YNX.denom)
                }
            }
        }
    }

    private var onboardingCard: some View {
        GlassCard(padding: 18, radius: 30) {
            VStack(alignment: .leading, spacing: 16) {
                LivePulse(symbol: "wallet.pass", color: YNXTheme.klein)
                Text("Create your YNX entry wallet")
                    .font(.system(size: 24, weight: .bold, design: .rounded))
                Text("This creates a local encrypted testnet identity for app flows. Testnet tokens have no mainnet value and are used for trials only.")
                    .font(.callout)
                    .foregroundStyle(YNXTheme.muted)
                    .fixedSize(horizontal: false, vertical: true)
                Button {
                    withAnimation(YNXTheme.standard) {
                        walletStore.createWallet()
                    }
                } label: {
                    Label("Create Testnet Wallet", systemImage: "plus.circle.fill")
                        .font(.headline)
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 14)
                        .background(YNXTheme.klein, in: Capsule())
                        .foregroundStyle(.white)
                }
                .buttonStyle(PressableButtonStyle())
            }
        }
    }

    private var importCard: some View {
        GlassCard {
            VStack(alignment: .leading, spacing: 12) {
                Button {
                    withAnimation(YNXTheme.standard) {
                        showImport.toggle()
                    }
                } label: {
                    ActionCard(title: "Import testnet identity", detail: "Paste a seed phrase for local test flows.", symbol: "square.and.arrow.down")
                }
                .buttonStyle(PressableButtonStyle())

                if showImport {
                    TextField("Seed phrase", text: $seedPhrase, axis: .vertical)
                        .textFieldStyle(.roundedBorder)
                        .lineLimit(2...4)
                    Button {
                        walletStore.importWallet(seedPhrase: seedPhrase)
                        seedPhrase = ""
                    } label: {
                        Text("Import")
                            .font(.headline)
                            .frame(maxWidth: .infinity)
                            .padding(.vertical, 12)
                            .background(YNXTheme.klein.opacity(0.12), in: Capsule())
                    }
                    .buttonStyle(PressableButtonStyle())
                    .foregroundStyle(YNXTheme.klein)
                }
            }
        }
    }

    private var walletActions: some View {
        VStack(spacing: 11) {
            ActionCard(title: "Receive", detail: walletStore.shortAddress, symbol: "qrcode")
            ActionCard(title: "Session Keys", detail: "Grant bounded AI/Web4 actions.", symbol: "key.radiowaves.forward")
            Button(role: .destructive) {
                withAnimation(YNXTheme.standard) {
                    walletStore.forgetWallet()
                }
            } label: {
                ActionCard(title: "Remove local wallet", detail: "Deletes this device profile.", symbol: "trash", accent: .red)
            }
            .buttonStyle(PressableButtonStyle())
        }
    }

    private var permissionsCard: some View {
        GlassCard {
            VStack(alignment: .leading, spacing: 12) {
                HStack {
                    Text("DApp permissions")
                        .font(.headline)
                    Spacer()
                    StatusPill(label: "\(walletStore.dappPermissions.count)", color: YNXTheme.klein, systemImage: "globe")
                }

                if walletStore.dappPermissions.isEmpty {
                    Text("No connected dApps yet. Open YNX Browser and tap the YNX mark to connect a site.")
                        .font(.callout)
                        .foregroundStyle(YNXTheme.muted)
                        .fixedSize(horizontal: false, vertical: true)
                } else {
                    ForEach(walletStore.dappPermissions) { permission in
                        HStack(spacing: 10) {
                            Image(systemName: "globe")
                                .foregroundStyle(YNXTheme.klein)
                            VStack(alignment: .leading, spacing: 3) {
                                Text(permission.origin)
                                    .font(.subheadline.weight(.semibold))
                                Text(permission.scopes.joined(separator: ", "))
                                    .font(.caption)
                                    .foregroundStyle(YNXTheme.muted)
                                    .lineLimit(2)
                            }
                            Spacer()
                            Button {
                                walletStore.revokePermission(permission)
                            } label: {
                                Image(systemName: "xmark.circle.fill")
                                    .foregroundStyle(.red)
                            }
                        }
                    }
                }
            }
        }
    }

    private var securityNotice: some View {
        GlassCard {
            VStack(alignment: .leading, spacing: 8) {
                Text("Security boundary")
                    .font(.headline)
                Text("This testnet app stores local identity material in Keychain. Before enabling any real-value network, signing, backup, biometric lock, transaction simulation, and external review must be completed.")
                    .font(.callout)
                    .foregroundStyle(YNXTheme.muted)
                    .fixedSize(horizontal: false, vertical: true)
            }
        }
    }
}

struct WalletStat: View {
    let label: String
    let value: String

    var body: some View {
        VStack(alignment: .leading, spacing: 4) {
            Text(label)
                .font(.caption)
                .foregroundStyle(YNXTheme.muted)
            Text(value)
                .font(.callout.monospaced().weight(.semibold))
                .foregroundStyle(YNXTheme.ink)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
    }
}
