import SwiftUI

struct AISettlementView: View {
    @Environment(\.accessibilityReduceMotion) private var reduceMotion
    @State private var activeStep = 0
    @State private var orbit = false

    var body: some View {
        PageContainer {
            ScreenHeader(
                eyebrow: "Machine Settlement",
                title: "Bounded agent flow",
                subtitle: "YNX AI is a verifiable job and payment workflow, not a chatbot wrapper."
            )
            .staggered(0)

            GlassCard(padding: 16, radius: 30) {
                VStack(spacing: 20) {
                    ZStack {
                        Circle()
                            .stroke(YNXTheme.klein.opacity(0.12), lineWidth: 1)
                            .frame(width: 214, height: 214)
                            .rotationEffect(.degrees(orbit ? 18 : -10))
                        Circle()
                            .stroke(YNXTheme.klein.opacity(0.08), lineWidth: 1)
                            .frame(width: 146, height: 146)
                            .rotationEffect(.degrees(orbit ? -16 : 12))

                        ForEach(Array(settlementSteps.enumerated()), id: \.element.id) { index, step in
                            SettlementNode(step: step, index: index, active: index == activeStep) {
                                withAnimation(YNXTheme.standard) {
                                    activeStep = index
                                }
                            }
                            .offset(nodeOffset(index: index))
                        }

                        VStack(spacing: 6) {
                            Text("YNX")
                                .font(.system(size: 27, weight: .black, design: .rounded))
                                .foregroundStyle(YNXTheme.klein)
                            Text("settles")
                                .font(.caption.monospaced().weight(.bold))
                                .foregroundStyle(YNXTheme.muted)
                        }
                        .frame(width: 92, height: 92)
                        .background(.white.opacity(0.82), in: Circle())
                        .overlay(Circle().stroke(.white.opacity(0.72), lineWidth: 1))
                    }
                    .frame(maxWidth: .infinity)
                    .frame(height: 282)

                    VStack(alignment: .leading, spacing: 8) {
                        Text(settlementSteps[activeStep].title)
                            .font(.system(size: 24, weight: .bold, design: .rounded))
                        Text(settlementSteps[activeStep].detail)
                            .font(.callout)
                            .foregroundStyle(YNXTheme.muted)
                            .fixedSize(horizontal: false, vertical: true)
                    }
                    .frame(maxWidth: .infinity, alignment: .leading)
                }
            }
            .staggered(1)
            .onAppear {
                guard !reduceMotion else { return }
                withAnimation(.easeInOut(duration: 5.2).repeatForever(autoreverses: true)) {
                    orbit = true
                }
            }

            GlassCard {
                VStack(alignment: .leading, spacing: 12) {
                    HStack {
                        Text("Official demo")
                            .font(.headline)
                        Spacer()
                        StatusPill(label: "CLI", color: YNXTheme.klein, systemImage: "terminal.fill")
                    }
                    Text("./scripts/ai_web4_settlement_demo.sh")
                        .font(.callout.monospaced().weight(.semibold))
                        .foregroundStyle(YNXTheme.klein)
                        .padding(12)
                        .frame(maxWidth: .infinity, alignment: .leading)
                        .background(YNXTheme.klein.opacity(0.08), in: RoundedRectangle(cornerRadius: 15, style: .continuous))
                    Text("Policy creation, session issuance, vault funding, job execution, result commit, finalization, and settlement.")
                        .font(.callout)
                        .foregroundStyle(YNXTheme.muted)
                        .fixedSize(horizontal: false, vertical: true)
                }
            }
            .staggered(2)
        }
    }

    private func nodeOffset(index: Int) -> CGSize {
        let radius: CGFloat = 106
        let angle = (Double(index) / Double(settlementSteps.count)) * Double.pi * 2 - Double.pi / 2
        return CGSize(width: CGFloat(Darwin.cos(angle)) * radius, height: CGFloat(Darwin.sin(angle)) * radius)
    }
}

struct SettlementNode: View {
    let step: SettlementStep
    let index: Int
    let active: Bool
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            VStack(spacing: 6) {
                Image(systemName: step.symbol)
                    .font(.system(size: active ? 22 : 16, weight: .semibold))
                Text("\(index + 1)")
                    .font(.caption2.monospaced().weight(.bold))
            }
            .foregroundStyle(active ? .white : YNXTheme.klein)
            .frame(width: active ? 70 : 56, height: active ? 70 : 56)
            .background(active ? YNXTheme.klein : .white.opacity(0.78), in: Circle())
            .overlay(Circle().stroke(YNXTheme.klein.opacity(active ? 0.18 : 0.16), lineWidth: 1))
            .shadow(color: YNXTheme.klein.opacity(active ? 0.32 : 0.1), radius: active ? 18 : 7, x: 0, y: 9)
        }
        .buttonStyle(PressableButtonStyle())
    }
}
