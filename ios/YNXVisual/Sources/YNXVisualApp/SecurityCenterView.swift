import SwiftUI

struct SecurityCenterView: View {
    @EnvironmentObject private var walletStore: WalletStore
    @State private var biometricLock = true
    @State private var hideBalances = false
    @State private var requireSimulation = true
    @State private var developerMode = false

    var body: some View {
        GlassCard {
            VStack(alignment: .leading, spacing: 14) {
                HStack {
                    Text("Security center")
                        .font(.headline)
                    Spacer()
                    StatusPill(label: "Release Gate", color: .orange, systemImage: "lock.shield")
                }
                Toggle("Biometric unlock before signing", isOn: $biometricLock)
                Toggle("Hide balances in app switcher", isOn: $hideBalances)
                Toggle("Require tx simulation before broadcast", isOn: $requireSimulation)
                Toggle("Developer testnet mode", isOn: $developerMode)
                Text("Mainnet release gate: audited wallet signing, backup verification, transaction simulation, dApp permission isolation, privacy policy, and external security review.")
                    .font(.caption)
                    .foregroundStyle(YNXTheme.muted)
                    .fixedSize(horizontal: false, vertical: true)
            }
            .font(.callout.weight(.semibold))
        }
    }
}
