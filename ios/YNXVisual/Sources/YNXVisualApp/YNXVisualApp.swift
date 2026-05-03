import SwiftUI

@main
struct YNXVisualApp: App {
    @StateObject private var viewModel = YNXNetworkViewModel()

    var body: some Scene {
        WindowGroup {
            RootView()
                .environmentObject(viewModel)
                #if os(macOS)
                .frame(width: 393, height: 852)
                #endif
        }
        #if os(macOS)
        .windowResizability(.contentSize)
        #endif
    }
}
