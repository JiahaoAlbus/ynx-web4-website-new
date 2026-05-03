import SwiftUI

struct ValidatorsView: View {
    @EnvironmentObject private var viewModel: YNXNetworkViewModel

    var body: some View {
        PageContainer {
            ScreenHeader(
                eyebrow: "Consensus",
                title: "Validator field",
                subtitle: "Track bonded validators and the remaining gates before mainnet readiness."
            )
            .staggered(0)

            GlassCard {
                HStack(spacing: 14) {
                    LivePulse(symbol: "shield.checkered", color: .green)
                    VStack(alignment: .leading, spacing: 5) {
                        Text("\(viewModel.bondedValidators) active bonded")
                            .font(.system(size: 22, weight: .bold, design: .rounded))
                        Text("External validator expansion remains a mainnet gate.")
                            .font(.callout)
                            .foregroundStyle(YNXTheme.muted)
                    }
                }
            }
            .staggered(1)

            VStack(spacing: 11) {
                ForEach(Array(viewModel.validators.enumerated()), id: \.element.id) { index, validator in
                    ValidatorCard(validator: validator)
                        .staggered(index + 2)
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
            .staggered(7)
        }
    }
}

struct ValidatorCard: View {
    let validator: ValidatorInfo

    var body: some View {
        Button {} label: {
            GlassCard(padding: 14, radius: 22) {
                HStack(spacing: 12) {
                    Image(systemName: "server.rack")
                        .font(.title3.weight(.semibold))
                        .foregroundStyle(YNXTheme.klein)
                        .frame(width: 42, height: 42)
                        .background(YNXTheme.klein.opacity(0.1), in: Circle())

                    VStack(alignment: .leading, spacing: 4) {
                        Text(validator.moniker)
                            .font(.subheadline.weight(.semibold))
                            .foregroundStyle(YNXTheme.ink)
                        Text(validator.id)
                            .font(.caption2.monospaced())
                            .foregroundStyle(YNXTheme.muted)
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
                            .foregroundStyle(YNXTheme.muted)
                    }
                }
            }
        }
        .buttonStyle(PressableButtonStyle())
    }
}

struct GateRow: View {
    let text: String

    var body: some View {
        HStack(alignment: .top, spacing: 10) {
            Image(systemName: "circle.dashed")
                .font(.caption.weight(.bold))
                .foregroundStyle(YNXTheme.klein)
                .padding(.top, 4)
            Text(text)
                .font(.callout)
                .foregroundStyle(YNXTheme.ink)
                .fixedSize(horizontal: false, vertical: true)
            Spacer()
        }
    }
}
