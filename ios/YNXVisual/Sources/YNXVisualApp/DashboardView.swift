import SwiftUI

struct DashboardView: View {
    @EnvironmentObject private var viewModel: YNXNetworkViewModel
    @EnvironmentObject private var walletStore: WalletStore
    @Environment(\.accessibilityReduceMotion) private var reduceMotion
    @Binding var selectedTab: YNXTab
    @Binding var selectedActionMode: ChainActionMode
    @State private var heroLift = false

    var body: some View {
        PageContainer {
            hero.staggered(0)

            walletStrip.staggered(1)

            LazyVGrid(columns: [GridItem(.flexible()), GridItem(.flexible())], spacing: 12) {
                MetricTile(title: "Network", value: "\(viewModel.onlineCount)/\(viewModel.endpoints.count)", footnote: "Reachable services", symbol: "waveform.path.ecg", accent: .green)
                    .staggered(2)
                MetricTile(title: "Validators", value: "\(viewModel.bondedValidators)", footnote: "Active bonded", symbol: "shield.checkered", accent: .indigo)
                    .staggered(3)
                MetricTile(title: "Chain", value: YNX.chainID, footnote: "Public testnet", symbol: "network")
                    .staggered(4)
                MetricTile(title: "EVM", value: "9102", footnote: "0x238e", symbol: "hexagon")
                    .staggered(5)
            }

            VStack(spacing: 11) {
                ActionCard(title: "Create or import wallet", detail: "Non-custodial YNX entry profile.", symbol: "wallet.pass") {
                    select(.wallet)
                }
                ActionCard(title: "Request test tokens", detail: "Open the YNX faucet for \(YNX.denom).", symbol: "drop.fill", accent: .cyan) {
                    select(.actions, mode: .faucet)
                }
                ActionCard(title: "Transfer and broadcast", detail: "Draft transfers, then broadcast signed tx bytes.", symbol: "paperplane") {
                    select(.actions, mode: .transfer)
                }
                ActionCard(title: "Open YNX Browser", detail: "Use dApps, faucet, explorer, AI Gateway and Web4 Hub.", symbol: "globe") {
                    select(.browser)
                }
                ActionCard(title: "AI agent sessions", detail: "Issue bounded policies for machine actions.", symbol: "key.radiowaves.forward") {
                    select(.actions, mode: .session)
                }
                ActionCard(title: "Test any third-party API", detail: "Authorize and execute arbitrary endpoints under policy guard.", symbol: "network", accent: .teal) {
                    select(.actions, mode: .thirdParty)
                }
            }
            .staggered(6)

            blockCard.staggered(7)
        }
    }

    private func select(_ tab: YNXTab, mode: ChainActionMode? = nil) {
        withAnimation(YNXTheme.standard) {
            if let mode {
                selectedActionMode = mode
            }
            selectedTab = tab
        }
    }

    private var hero: some View {
        GlassCard(padding: 18, radius: 30) {
            VStack(alignment: .leading, spacing: 20) {
                HStack(alignment: .top) {
                    VStack(alignment: .leading, spacing: 7) {
                        Text("YNX")
                            .font(.system(size: 40, weight: .black, design: .rounded))
                            .foregroundStyle(YNXTheme.ink)
                            .lineLimit(1)
                        Text("Your Web4 command app")
                            .font(.system(size: 20, weight: .bold, design: .rounded))
                            .foregroundStyle(YNXTheme.klein)
                    }
                    Spacer()
                    StatusPill(label: "TESTNET", color: .orange, systemImage: "testtube.2")
                }

                Text("Wallet, transaction, encrypted messaging, dApp browser, AI/Web4 sessions, and chain monitoring in one native entry point.")
                    .font(.callout)
                    .foregroundStyle(YNXTheme.muted)
                    .fixedSize(horizontal: false, vertical: true)

                HStack(spacing: 8) {
                    StatusPill(label: "No mainnet value", color: .orange, systemImage: "exclamationmark.triangle.fill")
                    StatusPill(label: "\(YNX.denom)", color: YNXTheme.klein, systemImage: "diamond.fill")
                }
            }
        }
        .offset(y: heroLift ? -3 : 0)
        .onAppear {
            guard !reduceMotion else { return }
            withAnimation(.easeInOut(duration: 2.4).repeatForever(autoreverses: true)) {
                heroLift = true
            }
        }
    }

    private var walletStrip: some View {
        GlassCard {
            HStack(spacing: 14) {
                LivePulse(symbol: walletStore.wallet == nil ? "wallet.pass" : "checkmark.seal.fill", color: walletStore.wallet == nil ? YNXTheme.klein : .green)
                VStack(alignment: .leading, spacing: 5) {
                    Text(walletStore.wallet == nil ? "No wallet yet" : "Wallet ready")
                        .font(.headline)
                    Text(walletStore.wallet == nil ? "Open Wallet to create your YNX testnet profile." : "\(walletStore.shortAddress) • \(walletStore.balanceText) \(YNX.denom)")
                        .font(.caption.monospaced())
                        .foregroundStyle(YNXTheme.muted)
                }
                Spacer()
            }
        }
    }

    private var blockCard: some View {
        GlassCard {
            HStack(spacing: 14) {
                LivePulse(symbol: "cube.transparent", color: YNXTheme.klein)
                VStack(alignment: .leading, spacing: 5) {
                    Text("Latest block")
                        .font(.subheadline.weight(.semibold))
                    Text(viewModel.latestBlockHeight)
                        .font(.system(size: 24, weight: .bold, design: .rounded))
                        .foregroundStyle(YNXTheme.klein)
                        .lineLimit(1)
                        .minimumScaleFactor(0.7)
                }
                Spacer()
                Button {
                    Task { await viewModel.refresh() }
                } label: {
                    Image(systemName: viewModel.isRefreshing ? "arrow.triangle.2.circlepath" : "arrow.clockwise")
                        .font(.headline)
                        .frame(width: 44, height: 44)
                        .background(YNXTheme.klein, in: Circle())
                        .foregroundStyle(.white)
                }
                .buttonStyle(PressableButtonStyle())
            }
        }
    }
}

struct LivePulse: View {
    let symbol: String
    let color: Color
    @Environment(\.accessibilityReduceMotion) private var reduceMotion
    @State private var pulse = false

    var body: some View {
        ZStack {
            Circle()
                .stroke(color.opacity(0.18), lineWidth: 1)
                .scaleEffect(pulse ? 1.35 : 0.84)
                .opacity(pulse ? 0.08 : 0.78)
            Circle()
                .fill(color.opacity(0.12))
            Image(systemName: symbol)
                .font(.system(size: 19, weight: .semibold))
                .foregroundStyle(color)
        }
        .frame(width: 52, height: 52)
        .onAppear {
            guard !reduceMotion else { return }
            withAnimation(.easeInOut(duration: 1.7).repeatForever(autoreverses: true)) {
                pulse = true
            }
        }
    }
}
