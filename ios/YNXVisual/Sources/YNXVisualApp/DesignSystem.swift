import SwiftUI

enum YNXTheme {
    static let klein = Color(red: 0.0, green: 0.184, blue: 0.655)
    static let klein2 = Color(red: 0.02, green: 0.30, blue: 1.0)
    static let ink = Color(red: 0.03, green: 0.045, blue: 0.09)
    static let muted = Color(red: 0.42, green: 0.45, blue: 0.52)
    static let cloud = Color(red: 0.965, green: 0.975, blue: 1.0)
    static let hairline = Color.black.opacity(0.07)

    static let quick = Animation.interactiveSpring(response: 0.22, dampingFraction: 0.82, blendDuration: 0.08)
    static let standard = Animation.spring(response: 0.46, dampingFraction: 0.86, blendDuration: 0.12)
    static let slow = Animation.spring(response: 0.72, dampingFraction: 0.88, blendDuration: 0.18)
}

enum YNXTab: String, CaseIterable, Identifiable {
    case home = "Home"
    case network = "Network"
    case validators = "Validators"
    case ai = "AI"
    case docs = "Docs"

    var id: String { rawValue }

    var symbol: String {
        switch self {
        case .home: "sparkles"
        case .network: "point.3.connected.trianglepath.dotted"
        case .validators: "shield.lefthalf.filled"
        case .ai: "cpu"
        case .docs: "doc.text.magnifyingglass"
        }
    }
}

struct PhoneBackground: View {
    @Environment(\.accessibilityReduceMotion) private var reduceMotion
    @State private var phase = false

    var body: some View {
        ZStack {
            LinearGradient(
                colors: [.white, YNXTheme.cloud, Color(red: 0.91, green: 0.94, blue: 1)],
                startPoint: .top,
                endPoint: .bottom
            )

            Circle()
                .fill(YNXTheme.klein.opacity(0.16))
                .frame(width: 260, height: 260)
                .blur(radius: 42)
                .offset(x: phase ? 128 : 82, y: phase ? -330 : -286)

            Circle()
                .fill(Color.cyan.opacity(0.12))
                .frame(width: 190, height: 190)
                .blur(radius: 34)
                .offset(x: phase ? -130 : -86, y: phase ? 310 : 270)

            FlowLines(phase: phase)
                .opacity(0.34)
        }
        .ignoresSafeArea()
        .onAppear {
            guard !reduceMotion else { return }
            withAnimation(.easeInOut(duration: 7.2).repeatForever(autoreverses: true)) {
                phase.toggle()
            }
        }
    }
}

struct FlowLines: View {
    let phase: Bool

    var body: some View {
        Canvas { context, size in
            for i in 0..<9 {
                var path = Path()
                let y = CGFloat(i) * size.height / 8
                path.move(to: CGPoint(x: -40, y: y + (phase ? 12 : -12)))
                path.addCurve(
                    to: CGPoint(x: size.width + 40, y: y + (phase ? -16 : 16)),
                    control1: CGPoint(x: size.width * 0.28, y: y - 42),
                    control2: CGPoint(x: size.width * 0.72, y: y + 42)
                )
                context.stroke(path, with: .color(YNXTheme.klein.opacity(0.08)), lineWidth: 1)
            }
        }
    }
}

struct YNXLogoMark: View {
    var size: CGFloat = 44

    var body: some View {
        Text("YNX")
            .font(.system(size: size * 0.36, weight: .black, design: .default))
            .tracking(size * 0.02)
            .foregroundStyle(YNXTheme.klein)
            .frame(width: size, height: size)
            .background(.white, in: RoundedRectangle(cornerRadius: size * 0.24, style: .continuous))
            .overlay(
                RoundedRectangle(cornerRadius: size * 0.24, style: .continuous)
                    .stroke(.white.opacity(0.65), lineWidth: 1)
            )
            .shadow(color: YNXTheme.klein.opacity(0.12), radius: 18, x: 0, y: 10)
    }
}

struct GlassCard<Content: View>: View {
    var padding: CGFloat = 16
    var radius: CGFloat = 24
    let content: Content

    init(padding: CGFloat = 16, radius: CGFloat = 24, @ViewBuilder content: () -> Content) {
        self.padding = padding
        self.radius = radius
        self.content = content()
    }

    var body: some View {
        content
            .padding(padding)
            .background(.ultraThinMaterial, in: RoundedRectangle(cornerRadius: radius, style: .continuous))
            .overlay(
                RoundedRectangle(cornerRadius: radius, style: .continuous)
                    .stroke(
                        LinearGradient(colors: [.white.opacity(0.78), YNXTheme.klein.opacity(0.12), .white.opacity(0.2)], startPoint: .topLeading, endPoint: .bottomTrailing),
                        lineWidth: 1
                    )
            )
            .shadow(color: YNXTheme.klein.opacity(0.1), radius: 18, x: 0, y: 10)
    }
}

struct PressableButtonStyle: ButtonStyle {
    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .scaleEffect(configuration.isPressed ? 0.965 : 1)
            .brightness(configuration.isPressed ? -0.02 : 0)
            .animation(YNXTheme.quick, value: configuration.isPressed)
    }
}

struct StatusPill: View {
    let label: String
    let color: Color
    var systemImage: String = "circle.fill"

    var body: some View {
        Label(label, systemImage: systemImage)
            .font(.system(size: 12, weight: .semibold, design: .rounded))
            .foregroundStyle(color)
            .lineLimit(1)
            .padding(.horizontal, 10)
            .padding(.vertical, 7)
            .background(color.opacity(0.11), in: Capsule())
            .overlay(Capsule().stroke(color.opacity(0.18), lineWidth: 1))
    }
}

struct ScreenHeader: View {
    let eyebrow: String
    let title: String
    let subtitle: String

    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text(eyebrow.uppercased())
                .font(.caption2.monospaced().weight(.bold))
                .tracking(1.1)
                .foregroundStyle(YNXTheme.klein)
            Text(title)
                .font(.system(size: 32, weight: .bold, design: .rounded))
                .foregroundStyle(YNXTheme.ink)
                .lineLimit(2)
                .minimumScaleFactor(0.76)
            Text(subtitle)
                .font(.callout)
                .foregroundStyle(YNXTheme.muted)
                .fixedSize(horizontal: false, vertical: true)
        }
    }
}

struct MetricTile: View {
    let title: String
    let value: String
    let footnote: String
    let symbol: String
    var accent: Color = YNXTheme.klein

    var body: some View {
        GlassCard(padding: 14, radius: 22) {
            VStack(alignment: .leading, spacing: 13) {
                HStack {
                    Image(systemName: symbol)
                        .font(.system(size: 15, weight: .semibold))
                        .foregroundStyle(accent)
                        .frame(width: 32, height: 32)
                        .background(accent.opacity(0.11), in: Circle())
                    Spacer()
                    Circle()
                        .fill(accent)
                        .frame(width: 7, height: 7)
                        .shadow(color: accent.opacity(0.7), radius: 8)
                }

                VStack(alignment: .leading, spacing: 4) {
                    Text(value)
                        .font(.system(size: 20, weight: .bold, design: .rounded))
                        .foregroundStyle(YNXTheme.ink)
                        .lineLimit(1)
                        .minimumScaleFactor(0.62)
                    Text(title)
                        .font(.system(size: 13, weight: .semibold))
                    Text(footnote)
                        .font(.caption2)
                        .foregroundStyle(YNXTheme.muted)
                        .lineLimit(2)
                }
            }
            .frame(maxWidth: .infinity, alignment: .leading)
        }
    }
}

struct PageContainer<Content: View>: View {
    let content: Content

    init(@ViewBuilder content: () -> Content) {
        self.content = content()
    }

    var body: some View {
        ScrollView(.vertical, showsIndicators: false) {
            VStack(alignment: .leading, spacing: 18) {
                content
            }
            .padding(.horizontal, 18)
            .padding(.top, 14)
            .padding(.bottom, 110)
        }
    }
}

struct StaggeredAppear: ViewModifier {
    let index: Int
    @Environment(\.accessibilityReduceMotion) private var reduceMotion
    @State private var visible = false

    func body(content: Content) -> some View {
        content
            .opacity(visible ? 1 : 0)
            .offset(y: visible ? 0 : 16)
            .scaleEffect(visible ? 1 : 0.985)
            .onAppear {
                guard !reduceMotion else {
                    visible = true
                    return
                }
                withAnimation(YNXTheme.standard.delay(Double(index) * 0.045)) {
                    visible = true
                }
            }
    }
}

extension View {
    func staggered(_ index: Int) -> some View {
        modifier(StaggeredAppear(index: index))
    }
}
