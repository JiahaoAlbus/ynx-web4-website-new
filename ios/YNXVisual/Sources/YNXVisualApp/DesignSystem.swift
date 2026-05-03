import SwiftUI

enum YNXTheme {
    static let klein = Color(red: 0.0, green: 0.184, blue: 0.655)
    static let kleinLight = Color(red: 0.1, green: 0.36, blue: 1.0)
    static let ink = Color(red: 0.04, green: 0.06, blue: 0.12)
    static let cloud = Color(red: 0.96, green: 0.975, blue: 1.0)
    static let line = Color.black.opacity(0.08)

    static let spring = Animation.spring(response: 0.42, dampingFraction: 0.82, blendDuration: 0.12)
    static let softSpring = Animation.spring(response: 0.7, dampingFraction: 0.86, blendDuration: 0.2)
}

struct GlassCard<Content: View>: View {
    let padding: CGFloat
    let content: Content

    init(padding: CGFloat = 18, @ViewBuilder content: () -> Content) {
        self.padding = padding
        self.content = content()
    }

    var body: some View {
        content
            .padding(padding)
            .background(.ultraThinMaterial, in: RoundedRectangle(cornerRadius: 28, style: .continuous))
            .overlay(
                RoundedRectangle(cornerRadius: 28, style: .continuous)
                    .stroke(
                        LinearGradient(
                            colors: [.white.opacity(0.72), YNXTheme.klein.opacity(0.16), .white.opacity(0.18)],
                            startPoint: .topLeading,
                            endPoint: .bottomTrailing
                        ),
                        lineWidth: 1
                    )
            )
            .shadow(color: YNXTheme.klein.opacity(0.12), radius: 24, x: 0, y: 14)
    }
}

struct StatusPill: View {
    let label: String
    let color: Color
    var systemImage: String = "circle.fill"

    var body: some View {
        Label(label, systemImage: systemImage)
            .font(.caption.weight(.semibold))
            .foregroundStyle(color)
            .padding(.horizontal, 11)
            .padding(.vertical, 7)
            .background(color.opacity(0.12), in: Capsule())
            .overlay(Capsule().stroke(color.opacity(0.18), lineWidth: 1))
    }
}

struct MetricTile: View {
    let title: String
    let value: String
    let footnote: String
    let symbol: String
    var accent: Color = YNXTheme.klein

    var body: some View {
        GlassCard(padding: 16) {
            VStack(alignment: .leading, spacing: 14) {
                HStack {
                    Image(systemName: symbol)
                        .font(.system(size: 18, weight: .semibold))
                        .foregroundStyle(accent)
                        .frame(width: 34, height: 34)
                        .background(accent.opacity(0.12), in: Circle())
                    Spacer()
                    Circle()
                        .fill(accent)
                        .frame(width: 7, height: 7)
                        .shadow(color: accent.opacity(0.8), radius: 8)
                }

                VStack(alignment: .leading, spacing: 4) {
                    Text(value)
                        .font(.system(.title2, design: .rounded, weight: .bold))
                        .foregroundStyle(YNXTheme.ink)
                        .lineLimit(1)
                        .minimumScaleFactor(0.72)
                    Text(title)
                        .font(.subheadline.weight(.semibold))
                        .foregroundStyle(.primary)
                    Text(footnote)
                        .font(.caption)
                        .foregroundStyle(.secondary)
                        .lineLimit(2)
                }
            }
        }
    }
}

struct SectionHeader: View {
    let eyebrow: String
    let title: String
    let subtitle: String

    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text(eyebrow.uppercased())
                .font(.caption2.monospaced().weight(.bold))
                .tracking(1.2)
                .foregroundStyle(YNXTheme.klein)
            Text(title)
                .font(.system(.largeTitle, design: .rounded, weight: .bold))
                .foregroundStyle(YNXTheme.ink)
                .lineLimit(2)
                .minimumScaleFactor(0.78)
            Text(subtitle)
                .font(.callout)
                .foregroundStyle(.secondary)
                .fixedSize(horizontal: false, vertical: true)
        }
    }
}

struct AnimatedBackdrop: View {
    @Environment(\.accessibilityReduceMotion) private var reduceMotion
    @State private var phase = false

    var body: some View {
        ZStack {
            LinearGradient(
                colors: [.white, YNXTheme.cloud, Color(red: 0.9, green: 0.94, blue: 1.0)],
                startPoint: .topLeading,
                endPoint: .bottomTrailing
            )
            Circle()
                .fill(YNXTheme.klein.opacity(0.18))
                .frame(width: 280, height: 280)
                .blur(radius: 42)
                .offset(x: phase ? 120 : 72, y: phase ? -290 : -250)
            Circle()
                .fill(.cyan.opacity(0.14))
                .frame(width: 220, height: 220)
                .blur(radius: 36)
                .offset(x: phase ? -140 : -86, y: phase ? 250 : 290)
            GridOverlay()
                .opacity(0.28)
        }
        .ignoresSafeArea()
        .onAppear {
            guard !reduceMotion else { return }
            withAnimation(.easeInOut(duration: 8).repeatForever(autoreverses: true)) {
                phase.toggle()
            }
        }
    }
}

struct GridOverlay: View {
    var body: some View {
        Canvas { context, size in
            let spacing: CGFloat = 28
            var path = Path()
            var x: CGFloat = 0
            while x <= size.width {
                path.move(to: CGPoint(x: x, y: 0))
                path.addLine(to: CGPoint(x: x, y: size.height))
                x += spacing
            }

            var y: CGFloat = 0
            while y <= size.height {
                path.move(to: CGPoint(x: 0, y: y))
                path.addLine(to: CGPoint(x: size.width, y: y))
                y += spacing
            }
            context.stroke(path, with: .color(YNXTheme.klein.opacity(0.08)), lineWidth: 0.5)
        }
    }
}

struct PulsingGlyph: View {
    let systemName: String
    var color: Color = YNXTheme.klein
    @Environment(\.accessibilityReduceMotion) private var reduceMotion
    @State private var pulse = false

    var body: some View {
        ZStack {
            Circle()
                .stroke(color.opacity(0.2), lineWidth: 1)
                .scaleEffect(pulse ? 1.2 : 0.82)
                .opacity(pulse ? 0.1 : 0.8)
            Circle()
                .fill(color.opacity(0.12))
            Image(systemName: systemName)
                .font(.system(size: 20, weight: .semibold))
                .foregroundStyle(color)
        }
        .frame(width: 52, height: 52)
        .onAppear {
            guard !reduceMotion else { return }
            withAnimation(.easeInOut(duration: 1.8).repeatForever(autoreverses: true)) {
                pulse.toggle()
            }
        }
    }
}
