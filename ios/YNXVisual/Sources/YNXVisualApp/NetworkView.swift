import SwiftUI

struct NetworkView: View {
    @EnvironmentObject private var viewModel: YNXNetworkViewModel

    var body: some View {
        NavigationStack {
            ZStack {
                AnimatedBackdrop()

                ScrollView {
                    VStack(alignment: .leading, spacing: 20) {
                        SectionHeader(
                            eyebrow: "Live Mesh",
                            title: "Network health",
                            subtitle: "Public endpoint monitor for the YNX Web4 testnet mesh."
                        )

                        GlassCard {
                            VStack(spacing: 14) {
                                ForEach(viewModel.endpoints) { endpoint in
                                    EndpointRow(endpoint: endpoint)
                                    if endpoint.id != viewModel.endpoints.last?.id {
                                        Divider().opacity(0.5)
                                    }
                                }
                            }
                        }

                        GlassCard {
                            VStack(alignment: .leading, spacing: 12) {
                                Text("Canonical network facts")
                                    .font(.headline)
                                FactRow(label: "Cosmos Chain ID", value: YNX.chainID)
                                FactRow(label: "EVM Chain ID", value: YNX.evmChainID)
                                FactRow(label: "Denom", value: YNX.denom)
                                FactRow(label: "Token status", value: "Testnet only, no mainnet value")
                            }
                        }
                    }
                    .padding(20)
                }
            }
            .navigationTitle("Network")
            .toolbar {
                ToolbarItem(placement: .automatic) {
                    Button {
                        Task { await viewModel.refresh() }
                    } label: {
                        Image(systemName: viewModel.isRefreshing ? "arrow.triangle.2.circlepath" : "arrow.clockwise")
                    }
                }
            }
        }
    }
}

struct EndpointRow: View {
    let endpoint: EndpointStatus

    var body: some View {
        HStack(spacing: 14) {
            Circle()
                .fill(endpoint.health.tint)
                .frame(width: 10, height: 10)
                .shadow(color: endpoint.health.tint.opacity(0.7), radius: 8)

            VStack(alignment: .leading, spacing: 3) {
                Text(endpoint.kind.rawValue)
                    .font(.headline)
                Text(endpoint.kind.displayURL)
                    .font(.caption)
                    .foregroundStyle(.secondary)
            }

            Spacer()

            Text(endpoint.health.label)
                .font(.caption.monospaced().weight(.bold))
                .foregroundStyle(endpoint.health.tint)
                .padding(.horizontal, 10)
                .padding(.vertical, 6)
                .background(endpoint.health.tint.opacity(0.1), in: Capsule())
        }
        .contentShape(Rectangle())
    }
}

struct FactRow: View {
    let label: String
    let value: String

    var body: some View {
        HStack {
            Text(label)
                .foregroundStyle(.secondary)
            Spacer()
            Text(value)
                .font(.callout.monospaced().weight(.semibold))
                .foregroundStyle(YNXTheme.ink)
                .multilineTextAlignment(.trailing)
        }
    }
}
