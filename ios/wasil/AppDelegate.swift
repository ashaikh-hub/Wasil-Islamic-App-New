import UIKit
import UserNotifications
import React
import React_RCTAppDelegate
import ReactAppDependencyProvider

@main
class AppDelegate: RCTAppDelegate, UNUserNotificationCenterDelegate {

    // MARK: - Application Launch
    override func application(
        _ application: UIApplication,
        didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil
    ) -> Bool {

        // React Native setup
        self.moduleName = "wasil"
        self.initialProps = [:]
        self.dependencyProvider = RCTAppDependencyProvider()

        // Call superclass
        let ret = super.application(application, didFinishLaunchingWithOptions: launchOptions)

        if ret {
            // Show splash screen (bridging header exposes RNSplashScreen)
            RNSplashScreen.show()
        }

        // Setup notifications
        let center = UNUserNotificationCenter.current()
        center.delegate = self

        let options: UNAuthorizationOptions = [.alert, .sound, .badge]
        center.requestAuthorization(options: options) { granted, error in
            if granted {
                print("✅ Notification permission granted")
            } else {
                print("⚠️ Notification permission not granted")
            }
        }

        // Stop Azan action
        let stopAction = UNNotificationAction(identifier: "STOP_AZAN",
                                              title: "Stop Azan",
                                              options: [.foreground])
        let azanCategory = UNNotificationCategory(identifier: "AZAN_CATEGORY",
                                                  actions: [stopAction],
                                                  intentIdentifiers: [],
                                                  options: [.customDismissAction])
        center.setNotificationCategories([azanCategory])

        return ret
    }

    // MARK: - Bundle URL
    override func sourceURL(for bridge: RCTBridge) -> URL? {
        return bundleURL()
    }

    /// Helper method, not an override
  override func bundleURL() -> URL? {
        #if DEBUG
        return RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index")
        #else
        return Bundle.main.url(forResource: "main", withExtension: "jsbundle")
        #endif
    }

    // MARK: - UNUserNotificationCenterDelegate

    // Foreground notification handler
    func userNotificationCenter(
        _ center: UNUserNotificationCenter,
        willPresent notification: UNNotification,
        withCompletionHandler completionHandler: @escaping (UNNotificationPresentationOptions) -> Void
    ) {
        print("📩 Notification received in foreground: \(notification.request.content.body)")
        completionHandler([.banner, .sound])
    }

    // Notification tapped / action triggered
    func userNotificationCenter(
        _ center: UNUserNotificationCenter,
        didReceive response: UNNotificationResponse,
        withCompletionHandler completionHandler: @escaping () -> Void
    ) {
        print("📲 Notification tapped: \(response.notification.request.content.body)")

        if response.actionIdentifier == "STOP_AZAN" {
            print("🛑 Stop Azan action tapped")
            if let AzanSchedulerClass = NSClassFromString("AzanScheduler") as AnyObject?,
               AzanSchedulerClass.responds(to: Selector(("stopAzanFromNotification"))) {
                AzanSchedulerClass.perform(Selector(("stopAzanFromNotification")))
                print("✅ Azan stopped successfully via notification")
            } else {
                print("❌ Could not find AzanScheduler.stopAzanFromNotification")
            }
        }

        completionHandler()
    }
}
