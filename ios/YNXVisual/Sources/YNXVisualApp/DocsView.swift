import SwiftUI

struct DocsView: View {
    private let docs: [(String, String, URL)] = [
        ("Public Testnet Join", "Join the testnet and configure endpoints.", URL(string: "https://ynxweb4.com/docs/en/public-testnet-join")!),
        ("AI/Web4 Official Demo", "Run the official policy/session/vault/job flow.", URL(string: "https://ynxweb4.com/docs/en/ai-web4-official-demo")!),
        ("Validator Onboarding", "External validator setup and responsibilities.", URL(string: "https://ynxweb4.com/docs/en/external-validator-onboarding")!),
        ("Web4 API", "Policy-bounded delegation API reference.", URL(string: "https://ynxweb4.com/docs/en/ynx-v2-web4-api")!),
        ("AI Settlement API", "Job, commit, finalize, and reward settlement API.", URL(string: "https://ynxweb4.com/docs/en/ynx-v2-ai-settlement-api")!)
    ]

    var body: some View {
        NavigationStack {
            ZStack {
                AnimatedBackdrop()

                ScrollView {
                    VStack(alignment: .leading, spacing: 20) {
                        SectionHeader(
                            eyebrow: "Canonical Docs",
                            title: "Build against YNX",
                            subtitle: "Fast entry points for users, builders, validators, and AI agent developers."
                        )

                        ForEach(docs, id: \.0) { item in
                            Link(destination: item.2) {
                                GlassCard(padding: 16) {
                                    HStack(spacing: 14) {
                                        Image(systemName: "doc.text")
                                            .foregroundStyle(YNXTheme.klein)
                                            .frame(width: 42, height: 42)
                                            .background(YNXTheme.klein.opacity(0.1), in: Circle())
                                        VStack(alignment: .leading, spacing: 4) {
                                            Text(item.0)
                                                .font(.headline)
                                                .foregroundStyle(YNXTheme.ink)
                                            Text(item.1)
                                                .font(.caption)
                                                .foregroundStyle(.secondary)
                                        }
                                        Spacer()
                                        Image(systemName: "arrow.up.right")
                                            .font(.caption.weight(.bold))
                                            .foregroundStyle(YNXTheme.klein)
                                    }
                                }
                            }
                            .buttonStyle(.plain)
                        }
                    }
                    .padding(20)
                }
            }
            .navigationTitle("Docs")
        }
    }
}
