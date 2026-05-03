import SwiftUI

struct DashboardView: View {
    @EnvironmentObject private var viewModel: YNXNetworkViewModel
    @Environment(\.accessibilityReduceMotion) private var reduceMotion
    @State private var selectedStep = 0
    @State private var heroLift = false

    var body: some View {
        PageContainer {
            hero.staggered(0)

            LazyVGrid(columns: [GridItem(.flexible()), GridItem(.flexible())], spacing: 12) {
                MetricTile(title: "Chain", value: YNX.chainID, footnote: "Public testnet", symbol: "network")
                    .staggered(1)
                MetricTile(title: "EVM", value: YNX.evmChainID, footnote: "Denom \(YNX.denom)", symbol: "hexagon")
                    .staggered(2)
                MetricTile(title: "Endpoints", value: "\(viewModel.onlineCount)/\(viewModel.endpoints.count)", footnote: "Live checks", symbol: "dot.radiowaves.left.and.right", accent: .green)
                    .staggered(3)
                MetricTile(title: "Validators", value: "\(viewModel.bondedValidators)", footnote: "Active bonded", symbol: "shield.checkered", accent: .indigo)
                    .staggered(4)
            }

            settlementPreview.staggered(5)
            blockCard.staggered(6)
        }
    }

    private var hero: some View {
        GlassCard(padding: 18, radius: 30) {
            VStack(alignment: .leading, spacing: 20) {
                HStack(alignment: .top) {
                    Spacer()
                    StatusPill(label: "TESTNET LIVE", color: .green, systemImage: "bolt.circle.fill")
                }

                VStack(alignment: .leading, spacing: 9) {
                    Text("YNX")
                        .font(.system(size: 48, weight: .black, design: .rounded))
                        .foregroundStyle(YNXTheme.ink)
                        .lineLimit(1)
                    Text("AI-native sovereign execution layer")
                        .font(.system(size: 22, weight: .bold, design: .rounded))
                        .foregroundStyle(YNXTheme.klein)
                        .fixedSize(horizontal: false, vertical: true)
                    Text("Monitor the public testnet, inspect validators, and follow policy-bounded AI settlement from your phone.")
                        .font(.callout)
                        .foregroundStyle(YNXTheme.muted)
                        .fixedSize(horizontal: false, vertical: true)
                }

                HStack(spacing: 8) {
                    StatusPill(label: "No mainnet value", color: .orange, systemImage: "exclamationmark.triangle.fill")
                    StatusPill(label: "4 bonded", color: YNXTheme.klein, systemImage: "checkmark.seal.fill")
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

    private var settlementPreview: some View {
        GlassCard {
            VStack(alignment: .leading, spacing: 16) {
                HStack {
                    VStack(alignment: .leading, spacing: 4) {
                        Text("AI/Web4 Settlement")
                            .font(.headline)
                        Text("Owner > Policy > Session > Action")
                            .font(.caption.monospaced())
                            .foregroundStyle(YNXTheme.muted)
                    }
                    Spacer()
                    Text("\(selectedStep + 1)/\(settlementSteps.count)")
                        .font(.caption.monospaced().weight(.bold))
                        .foregroundStyle(YNXTheme.klein)
                }

                SettlementRibbon(selectedStep: $selectedStep)

                VStack(alignment: .leading, spacing: 5) {
                    Text(settlementSteps[selectedStep].title)
                        .font(.system(size: 20, weight: .bold, design: .rounded))
                    Text(settlementSteps[selectedStep].detail)
                        .font(.callout)
                        .foregroundStyle(YNXTheme.muted)
                        .fixedSize(horizontal: false, vertical: true)
                }
            }
        }
        .onAppear {
            guard !reduceMotion else { return }
            Timer.scheduledTimer(withTimeInterval: 2.2, repeats: true) { _ in
                withAnimation(YNXTheme.standard) {
                    selectedStep = (selectedStep + 1) % settlementSteps.count
                }
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

struct SettlementRibbon: View {
    @Binding var selectedStep: Int

    var body: some View {
        HStack(spacing: 7) {
            ForEach(Array(settlementSteps.enumerated()), id: \.element.id) { index, step in
                Button {
                    withAnimation(YNXTheme.quick) {
                        selectedStep = index
                    }
                } label: {
                    VStack(spacing: 8) {
                        Image(systemName: step.symbol)
                            .font(.system(size: selectedStep == index ? 17 : 14, weight: .semibold))
                            .frame(height: 18)
                        Capsule()
                            .fill(selectedStep == index ? YNXTheme.klein : YNXTheme.klein.opacity(0.14))
                            .frame(height: selectedStep == index ? 5 : 3)
                    }
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 9)
                    .foregroundStyle(selectedStep == index ? YNXTheme.klein : YNXTheme.muted)
                    .background(selectedStep == index ? YNXTheme.klein.opacity(0.08) : .clear, in: RoundedRectangle(cornerRadius: 15, style: .continuous))
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
