import SwiftUI
import WebKit

struct YNXBrowserView: View {
    @EnvironmentObject private var walletStore: WalletStore
    @State private var urlText = "https://ynxweb4.com"
    @State private var currentURL = URL(string: "https://ynxweb4.com")!
    @State private var selectedShortcut = 0
    @State private var showConnect = false

    private let shortcuts: [(String, String, URL)] = [
        ("Portal", "ynxweb4.com", URL(string: "https://ynxweb4.com")!),
        ("Explorer", "explorer", URL(string: "https://explorer.ynxweb4.com")!),
        ("Faucet", "faucet", URL(string: "https://faucet.ynxweb4.com")!),
        ("AI", "gateway", URL(string: "https://ai.ynxweb4.com")!),
        ("Web4", "hub", URL(string: "https://web4.ynxweb4.com")!)
    ]

    var body: some View {
        VStack(spacing: 12) {
            VStack(alignment: .leading, spacing: 10) {
                HStack {
                    VStack(alignment: .leading, spacing: 4) {
                        Text("YNX Browser")
                            .font(.system(size: 30, weight: .bold, design: .rounded))
                            .foregroundStyle(YNXTheme.ink)
                        Text("Open dApps and Web4 services.")
                            .font(.caption)
                            .foregroundStyle(YNXTheme.muted)
                    }
                    Spacer()
                    Button {
                        showConnect = true
                    } label: {
                        YNXLogoMark(size: 42)
                    }
                    .buttonStyle(PressableButtonStyle())
                }

                HStack(spacing: 8) {
                    Image(systemName: "lock.fill")
                        .foregroundStyle(.green)
                    TextField("URL", text: $urlText)
                        .textFieldStyle(.plain)
                        .ynxNoAutocapitalization()
                        #if os(iOS)
                        .keyboardType(.URL)
                        #endif
                    Button {
                        openTypedURL()
                    } label: {
                        Image(systemName: "arrow.right.circle.fill")
                            .font(.title3)
                            .foregroundStyle(YNXTheme.klein)
                    }
                    .buttonStyle(PressableButtonStyle())
                }
                .padding(.horizontal, 12)
                .padding(.vertical, 11)
                .background(.white.opacity(0.72), in: Capsule())
                .overlay(Capsule().stroke(YNXTheme.hairline, lineWidth: 1))

                ScrollView(.horizontal, showsIndicators: false) {
                    HStack(spacing: 8) {
                        ForEach(Array(shortcuts.enumerated()), id: \.offset) { index, shortcut in
                            Button {
                                selectedShortcut = index
                                currentURL = shortcut.2
                                urlText = shortcut.2.absoluteString
                            } label: {
                                VStack(alignment: .leading, spacing: 2) {
                                    Text(shortcut.0)
                                        .font(.caption.weight(.bold))
                                    Text(shortcut.1)
                                        .font(.caption2)
                                }
                                .foregroundStyle(selectedShortcut == index ? .white : YNXTheme.klein)
                                .padding(.horizontal, 13)
                                .padding(.vertical, 9)
                                .background(selectedShortcut == index ? YNXTheme.klein : YNXTheme.klein.opacity(0.09), in: Capsule())
                            }
                            .buttonStyle(PressableButtonStyle())
                        }
                    }
                }
            }
            .padding(.horizontal, 18)
            .padding(.top, 12)

            YNXWebView(url: currentURL)
                .clipShape(RoundedRectangle(cornerRadius: 26, style: .continuous))
                .overlay(RoundedRectangle(cornerRadius: 26, style: .continuous).stroke(.white.opacity(0.72), lineWidth: 1))
                .shadow(color: YNXTheme.klein.opacity(0.12), radius: 20, x: 0, y: 10)
                .padding(.horizontal, 14)
                .padding(.bottom, 104)
        }
        .background(PhoneBackground())
        .sheet(isPresented: $showConnect) {
            DAppPermissionSheet(origin: currentURL.host ?? currentURL.absoluteString)
                .environmentObject(walletStore)
                .presentationDetents([.medium])
        }
    }

    private func openTypedURL() {
        let raw = urlText.trimmingCharacters(in: .whitespacesAndNewlines)
        guard !raw.isEmpty else { return }
        let normalized = raw.hasPrefix("http://") || raw.hasPrefix("https://") ? raw : "https://\(raw)"
        if let url = URL(string: normalized) {
            currentURL = url
            urlText = normalized
        }
    }
}

struct DAppPermissionSheet: View {
    @EnvironmentObject private var walletStore: WalletStore
    @Environment(\.dismiss) private var dismiss
    let origin: String
    @State private var account = true
    @State private var signatures = false
    @State private var encryptedMessages = true
    @State private var sessions = false

    var body: some View {
        ZStack {
            PhoneBackground()
            VStack(alignment: .leading, spacing: 18) {
                Capsule()
                    .fill(YNXTheme.hairline)
                    .frame(width: 46, height: 5)
                    .frame(maxWidth: .infinity)
                ScreenHeader(
                    eyebrow: "DApp Permission",
                    title: "Connect \(origin)",
                    subtitle: "Grant only the capabilities this Web4 app needs. You can revoke permissions from Wallet."
                )
                GlassCard {
                    VStack(spacing: 12) {
                        Toggle("Read wallet address", isOn: $account)
                        Toggle("Request signatures", isOn: $signatures)
                        Toggle("Encrypted messages", isOn: $encryptedMessages)
                        Toggle("Session keys", isOn: $sessions)
                    }
                    .font(.callout.weight(.semibold))
                }
                Button {
                    var scopes: [String] = []
                    if account { scopes.append("account.read") }
                    if signatures { scopes.append("signature.request") }
                    if encryptedMessages { scopes.append("message.encrypt") }
                    if sessions { scopes.append("session.issue") }
                    walletStore.grantDAppPermission(origin: origin, scopes: scopes)
                    dismiss()
                } label: {
                    Label("Grant Permission", systemImage: "checkmark.seal.fill")
                        .font(.headline)
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 14)
                        .background(YNXTheme.klein, in: Capsule())
                        .foregroundStyle(.white)
                }
                .buttonStyle(PressableButtonStyle())
                Spacer()
            }
            .padding(20)
        }
    }
}

struct YNXWebView: View {
    let url: URL

    var body: some View {
        PlatformWebView(url: url)
    }
}

#if os(iOS)
struct PlatformWebView: UIViewRepresentable {
    let url: URL

    func makeUIView(context: Context) -> WKWebView {
        let configuration = WKWebViewConfiguration()
        configuration.allowsInlineMediaPlayback = true
        let webView = WKWebView(frame: .zero, configuration: configuration)
        webView.scrollView.contentInsetAdjustmentBehavior = .never
        return webView
    }

    func updateUIView(_ webView: WKWebView, context: Context) {
        if webView.url != url {
            webView.load(URLRequest(url: url))
        }
    }
}
#else
struct PlatformWebView: NSViewRepresentable {
    let url: URL

    func makeNSView(context: Context) -> WKWebView {
        WKWebView()
    }

    func updateNSView(_ webView: WKWebView, context: Context) {
        if webView.url != url {
            webView.load(URLRequest(url: url))
        }
    }
}
#endif
