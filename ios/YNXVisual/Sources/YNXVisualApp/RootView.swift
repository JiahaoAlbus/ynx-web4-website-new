import SwiftUI

struct RootView: View {
    @EnvironmentObject private var viewModel: YNXNetworkViewModel
    @Environment(\.scenePhase) private var scenePhase

    var body: some View {
        TabView {
            DashboardView()
                .tabItem { Label("Home", systemImage: "sparkles") }

            NetworkView()
                .tabItem { Label("Network", systemImage: "point.3.connected.trianglepath.dotted") }

            ValidatorsView()
                .tabItem { Label("Validators", systemImage: "shield.lefthalf.filled") }

            AISettlementView()
                .tabItem { Label("AI/Web4", systemImage: "cpu") }

            DocsView()
                .tabItem { Label("Docs", systemImage: "doc.text.magnifyingglass") }
        }
        .tint(YNXTheme.klein)
        .task {
            await viewModel.refresh()
        }
        .onChange(of: scenePhase) { _, phase in
            if phase == .active {
                Task { await viewModel.refresh() }
            }
        }
    }
}
