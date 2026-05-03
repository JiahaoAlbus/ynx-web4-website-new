import SwiftUI

@main
struct YNXVisualApp: App {
    @StateObject private var viewModel = YNXNetworkViewModel()

    var body: some Scene {
        WindowGroup {
            RootView()
                .environmentObject(viewModel)
        }
    }
}
