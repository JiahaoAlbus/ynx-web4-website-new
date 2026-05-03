import SwiftUI

struct AISettlementView: View {
    @State private var activeStep = 0

    var body: some View {
        NavigationStack {
            ZStack {
                AnimatedBackdrop()

                ScrollView {
                    VStack(alignment: .leading, spacing: 20) {
                        SectionHeader(
                            eyebrow: "Machine Settlement",
                            title: "Policy-bounded autonomy",
                            subtitle: "The AI layer is not a chatbot. It is a verifiable job and payment workflow for bounded agents."
                        )

                        GlassCard {
                            VStack(spacing: 18) {
                                ZStack {
                                    ForEach(Array(settlementSteps.enumerated()), id: \.element.id) { index, step in
                                        SettlementNode(step: step, index: index, active: index == activeStep)
                                            .offset(nodeOffset(index: index))
                                    }
                                }
                                .frame(height: 280)
                                .animation(YNXTheme.softSpring, value: activeStep)

                                VStack(alignment: .leading, spacing: 6) {
                                    Text(settlementSteps[activeStep].title)
                                        .font(.title2.weight(.bold))
                                    Text(settlementSteps[activeStep].detail)
                                        .font(.callout)
                                        .foregroundStyle(.secondary)
                                }
                                .frame(maxWidth: .infinity, alignment: .leading)
                            }
                        }

                        GlassCard {
                            VStack(alignment: .leading, spacing: 12) {
                                Text("Official demo")
                                    .font(.headline)
                                Text("./scripts/ai_web4_settlement_demo.sh")
                                    .font(.callout.monospaced().weight(.semibold))
                                    .foregroundStyle(YNXTheme.klein)
                                    .padding(12)
                                    .frame(maxWidth: .infinity, alignment: .leading)
                                    .background(YNXTheme.klein.opacity(0.08), in: RoundedRectangle(cornerRadius: 14))
                                Text("Workflow: policy creation, session issuance, vault funding, job execution, result commit, finalization, settlement.")
                                    .font(.callout)
                                    .foregroundStyle(.secondary)
                            }
                        }
                    }
                    .padding(20)
                }
            }
            .navigationTitle("AI/Web4")
            .toolbar {
                ToolbarItem(placement: .automatic) {
                    Button {
                        withAnimation(YNXTheme.spring) {
                            activeStep = (activeStep + 1) % settlementSteps.count
                        }
                    } label: {
                        Image(systemName: "forward.end.fill")
                    }
                }
            }
        }
    }

    private func nodeOffset(index: Int) -> CGSize {
        let radius: CGFloat = 98
        let angle = (Double(index) / Double(settlementSteps.count)) * Double.pi * 2 - Double.pi / 2
        return CGSize(width: CGFloat(Darwin.cos(angle)) * radius, height: CGFloat(Darwin.sin(angle)) * radius)
    }
}

struct SettlementNode: View {
    let step: SettlementStep
    let index: Int
    let active: Bool

    var body: some View {
        Button {
        } label: {
            VStack(spacing: 7) {
                Image(systemName: step.symbol)
                    .font(.system(size: active ? 24 : 18, weight: .semibold))
                Text("\(index + 1)")
                    .font(.caption2.monospaced().weight(.bold))
            }
            .foregroundStyle(active ? .white : YNXTheme.klein)
            .frame(width: active ? 76 : 58, height: active ? 76 : 58)
            .background(active ? YNXTheme.klein : .white.opacity(0.66), in: Circle())
            .overlay(Circle().stroke(YNXTheme.klein.opacity(active ? 0.2 : 0.22), lineWidth: 1))
            .shadow(color: YNXTheme.klein.opacity(active ? 0.35 : 0.12), radius: active ? 22 : 8, x: 0, y: 10)
        }
        .buttonStyle(.plain)
    }
}
