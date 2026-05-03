import SwiftUI

struct DashboardView: View {
    @EnvironmentObject private var viewModel: YNXNetworkViewModel
    @Environment(\.accessibilityReduceMotion) private var reduceMotion
    @State private var selectedStep = 0

    var body: some View {
        NavigationStack {
            ZStack {
                AnimatedBackdrop()

                ScrollView {
                    VStack(alignment: .leading, spacing: 22) {
                        hero

                        LazyVGrid(columns: [GridItem(.flexible()), GridItem(.flexible())], spacing: 14) {
                            MetricTile(
                                title: "Public Testnet",
                                value: YNX.chainID,
                                footnote: "Mainnet is not live yet",
                                symbol: "network"
                            )
                            MetricTile(
                                title: "EVM Chain",
                                value: YNX.evmChainID,
                                footnote: "Denom \(YNX.denom)",
                                symbol: "hexagon"
                            )
                            MetricTile(
                                title: "Endpoints Online",
                                value: "\(viewModel.onlineCount)/\(viewModel.endpoints.count)",
                                footnote: "Live public service checks",
                                symbol: "dot.radiowaves.left.and.right",
                                accent: .green
                            )
                            MetricTile(
                                title: "Bonded Validators",
                                value: "\(viewModel.bondedValidators)",
                                footnote: "Public testnet target: 4 active",
                                symbol: "shield.checkered",
                                accent: .indigo
                            )
                        }

                        settlementPreview

                        GlassCard {
                            HStack(spacing: 16) {
                                PulsingGlyph(systemName: "cube.transparent")
                                VStack(alignment: .leading, spacing: 6) {
                                    Text("Latest block")
                                        .font(.headline)
                                    Text(viewModel.latestBlockHeight)
                                        .font(.system(.title2, design: .rounded, weight: .bold))
                                        .foregroundStyle(YNXTheme.klein)
                                }
                                Spacer()
                                Button {
                                    Task { await viewModel.refresh() }
                                } label: {
                                    Image(systemName: "arrow.clockwise")
                                        .font(.headline)
                                }
                                .buttonStyle(.borderedProminent)
                                .tint(YNXTheme.klein)
                            }
                        }
                    }
                    .padding(.horizontal, 20)
                    .padding(.top, 18)
                    .padding(.bottom, 32)
                }
            }
            .navigationTitle("YNX Visual")
            .toolbar {
                ToolbarItem(placement: .automatic) {
                    StatusPill(label: "Testnet", color: YNXTheme.klein, systemImage: "bolt.circle.fill")
                }
            }
        }
    }

    private var hero: some View {
        GlassCard(padding: 22) {
            VStack(alignment: .leading, spacing: 18) {
                HStack(alignment: .top) {
                    VStack(alignment: .leading, spacing: 8) {
                        Text("AI-native sovereign execution")
                            .font(.caption.monospaced().weight(.bold))
                            .tracking(1.1)
                            .foregroundStyle(YNXTheme.klein)
                        Text("Visual command center for YNX Web4")
                            .font(.system(.largeTitle, design: .rounded, weight: .bold))
                            .foregroundStyle(YNXTheme.ink)
                            .minimumScaleFactor(0.76)
                    }
                    Spacer()
                    PulsingGlyph(systemName: "sparkles", color: YNXTheme.klein)
                }

                Text("Monitor the public testnet, inspect validators, and understand how policy-bounded AI agents settle work through YNX.")
                    .font(.callout)
                    .foregroundStyle(.secondary)

                HStack {
                    StatusPill(label: "No mainnet value", color: .orange, systemImage: "exclamationmark.triangle.fill")
                    StatusPill(label: "4 validators", color: .green, systemImage: "checkmark.seal.fill")
                }
            }
        }
    }

    private var settlementPreview: some View {
        GlassCard {
            VStack(alignment: .leading, spacing: 16) {
                HStack {
                    VStack(alignment: .leading, spacing: 5) {
                        Text("AI/Web4 settlement")
                            .font(.title3.weight(.bold))
                        Text("Owner > Policy > Session Key > Agent Action")
                            .font(.caption.monospaced())
                            .foregroundStyle(.secondary)
                    }
                    Spacer()
                    Text("\(selectedStep + 1)/\(settlementSteps.count)")
                        .font(.caption.weight(.bold))
                        .foregroundStyle(YNXTheme.klein)
                }

                SettlementRibbon(selectedStep: $selectedStep)

                VStack(alignment: .leading, spacing: 5) {
                    Text(settlementSteps[selectedStep].title)
                        .font(.headline)
                    Text(settlementSteps[selectedStep].detail)
                        .font(.callout)
                        .foregroundStyle(.secondary)
                }
            }
        }
        .onAppear {
            guard !reduceMotion else { return }
            Timer.scheduledTimer(withTimeInterval: 2.2, repeats: true) { _ in
                withAnimation(YNXTheme.softSpring) {
                    selectedStep = (selectedStep + 1) % settlementSteps.count
                }
            }
        }
    }
}

struct SettlementRibbon: View {
    @Binding var selectedStep: Int

    var body: some View {
        HStack(spacing: 8) {
            ForEach(Array(settlementSteps.enumerated()), id: \.element.id) { index, step in
                Button {
                    withAnimation(YNXTheme.spring) {
                        selectedStep = index
                    }
                } label: {
                    VStack(spacing: 8) {
                        Image(systemName: step.symbol)
                            .font(.system(size: selectedStep == index ? 19 : 16, weight: .semibold))
                        Capsule()
                            .fill(selectedStep == index ? YNXTheme.klein : YNXTheme.klein.opacity(0.16))
                            .frame(height: selectedStep == index ? 5 : 3)
                    }
                    .frame(maxWidth: .infinity)
                    .foregroundStyle(selectedStep == index ? YNXTheme.klein : .secondary)
                    .padding(.vertical, 10)
                    .background(selectedStep == index ? YNXTheme.klein.opacity(0.08) : .clear, in: RoundedRectangle(cornerRadius: 16))
                }
                .buttonStyle(.plain)
            }
        }
    }
}
