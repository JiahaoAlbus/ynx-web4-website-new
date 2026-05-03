import SwiftUI

struct ValidatorsView: View {
    @EnvironmentObject private var viewModel: YNXNetworkViewModel

    var body: some View {
        NavigationStack {
            ZStack {
                AnimatedBackdrop()

                ScrollView {
                    VStack(alignment: .leading, spacing: 20) {
                        SectionHeader(
                            eyebrow: "Consensus",
                            title: "Validator field",
                            subtitle: "Track bonded validators and surface what remains before mainnet readiness."
                        )

                        GlassCard {
                            HStack(spacing: 16) {
                                PulsingGlyph(systemName: "shield.checkered", color: .green)
                                VStack(alignment: .leading, spacing: 5) {
                                    Text("\(viewModel.bondedValidators) active bonded validators")
                                        .font(.title3.weight(.bold))
                                    Text("Public testnet status. External validator expansion remains a mainnet gate.")
                                        .font(.callout)
                                        .foregroundStyle(.secondary)
                                }
                            }
                        }

                        VStack(spacing: 12) {
                            ForEach(viewModel.validators) { validator in
                                ValidatorCard(validator: validator)
                            }
                        }

                        GlassCard {
                            VStack(alignment: .leading, spacing: 12) {
                                Text("Mainnet gates")
                                    .font(.headline)
                                GateRow(text: "Independent external validators")
                                GateRow(text: "Additional public RPC/sentry outside current provider/account")
                                GateRow(text: "Real alerting and on-call")
                                GateRow(text: "Restore drill")
                                GateRow(text: "External security review")
                            }
                        }
                    }
                    .padding(20)
                }
            }
            .navigationTitle("Validators")
        }
    }
}

struct ValidatorCard: View {
    let validator: ValidatorInfo

    var body: some View {
        GlassCard(padding: 16) {
            HStack(spacing: 14) {
                Image(systemName: "server.rack")
                    .font(.title3.weight(.semibold))
                    .foregroundStyle(YNXTheme.klein)
                    .frame(width: 42, height: 42)
                    .background(YNXTheme.klein.opacity(0.1), in: Circle())

                VStack(alignment: .leading, spacing: 4) {
                    Text(validator.moniker)
                        .font(.headline)
                    Text(validator.id)
                        .font(.caption.monospaced())
                        .foregroundStyle(.secondary)
                        .lineLimit(1)
                        .truncationMode(.middle)
                }

                Spacer()

                VStack(alignment: .trailing, spacing: 4) {
                    Text(validator.status)
                        .font(.caption.weight(.bold))
                        .foregroundStyle(.green)
                    Text(validator.commission)
                        .font(.caption2.monospaced())
                        .foregroundStyle(.secondary)
                }
            }
        }
    }
}

struct GateRow: View {
    let text: String

    var body: some View {
        HStack(alignment: .top, spacing: 10) {
            Image(systemName: "circle.dashed")
                .foregroundStyle(YNXTheme.klein)
                .padding(.top, 2)
            Text(text)
                .font(.callout)
            Spacer()
        }
    }
}
