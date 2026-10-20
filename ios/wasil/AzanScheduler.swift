import Foundation
import UserNotifications
import AVFoundation
import React
import UIKit

@objc(AzanScheduler)
class AzanScheduler: NSObject {

    private static var sharedPlayer: AVAudioPlayer?

    override init() {
        super.init()
        setupNotificationCategory()
    }

    @objc static func requiresMainQueueSetup() -> Bool { return true }

    private func setupNotificationCategory() {
        let stopAction = UNNotificationAction(
            identifier: "STOP_AZAN",
            title: "Stop Azan",
            options: [.destructive]
        )
        let category = UNNotificationCategory(
            identifier: "AZAN_CATEGORY",
            actions: [stopAction],
            intentIdentifiers: [],
            options: []
        )
        UNUserNotificationCenter.current().setNotificationCategories([category])
    }

    // MARK: - Notification Permission (includes critical alert option)
    @objc(requestNotificationPermission:rejecter:)
    func requestNotificationPermission(_ resolve: @escaping RCTPromiseResolveBlock,
                                       _ reject: @escaping RCTPromiseRejectBlock) {
        let center = UNUserNotificationCenter.current()
        // Request regular + critical alert permission (critical requires entitlement)
        center.requestAuthorization(options: [.alert, .sound, .badge, .criticalAlert]) { granted, error in
            if let error = error { reject("PERMISSION_ERROR", "Failed to request permission", error) }
            else { resolve(granted) }
        }
    }
    // MARK: - Schedule Azan Notification
@objc func scheduleAzan(_ prayerName: NSString, timeFull: NSString) {
    let content = UNMutableNotificationContent()
    content.title = "Prayer Time"
    content.body = "Time for \(prayerName) prayer."
    content.categoryIdentifier = "AZAN_CATEGORY"

    // ✅ Always attach zanies.mp3 when app might be killed or inactive
    if #available(iOS 15.0, *) {
        content.interruptionLevel = .critical
        content.sound = UNNotificationSound.criticalSoundNamed(
            UNNotificationSoundName("zanies.mp3")
        )
        print("🔊 Attached zanies.mp3 as critical sound for \(prayerName)")
    } else {
        content.sound = UNNotificationSound(named: UNNotificationSoundName("zanies.mp3"))
        print("🔊 Attached zanies.mp3 as normal sound for \(prayerName) (iOS < 15)")
    }

    // Parse time string
    let formatter = DateFormatter()
    formatter.dateFormat = "yyyy-MM-dd HH:mm:ss"
    guard let date = formatter.date(from: timeFull as String) else {
        print("❌ scheduleAzan: invalid date string: \(timeFull)")
        return
    }

    let triggerDate = Calendar.current.dateComponents(
        [.year, .month, .day, .hour, .minute, .second],
        from: date
    )

    let trigger = UNCalendarNotificationTrigger(dateMatching: triggerDate, repeats: false)
    let request = UNNotificationRequest(identifier: prayerName as String, content: content, trigger: trigger)

    UNUserNotificationCenter.current().add(request) { error in
        if let error = error {
            print("❌ Failed scheduling Azan (\(prayerName)): \(error)")
        } else {
            print("✅ Scheduled Azan: \(prayerName) at \(timeFull)")
        }
    }
}

    // MARK: - Check App State
    private func isAppRunningInForegroundOrBackground() -> Bool {
        let state = UIApplication.shared.applicationState
        return state == .active || state == .background
    }

    // MARK: - Play Full Azan (Manual)
    @objc func playAzanManually(_ prayerName: NSString) {
        guard let url = Bundle.main.url(forResource: "azan", withExtension: "mp3") else {
            print("❌ azan.mp3 not found")
            return
        }

        do {
            try AVAudioSession.sharedInstance().setCategory(.playback)
            try AVAudioSession.sharedInstance().setActive(true)
            AzanScheduler.sharedPlayer = try AVAudioPlayer(contentsOf: url)
            AzanScheduler.sharedPlayer?.play()
            print("🎵 Playing full Azan for \(prayerName) — azan.mp3")
        } catch {
            print("❌ Failed to play Azan: \(error)")
        }
    }

    // MARK: - Stop Azan Playback
    @objc func stopAzan() {
        if let player = AzanScheduler.sharedPlayer, player.isPlaying {
            player.stop()
            AzanScheduler.sharedPlayer = nil
            print("⏹ Azan stopped manually")
        }
    }

    // MARK: - Stop Azan via Notification Button
    @objc static func stopAzanFromNotification() {
        if let player = sharedPlayer, player.isPlaying {
            player.stop()
            sharedPlayer = nil
            print("🛑 Azan stopped via notification")
        } else {
            print("🛑 Stop action received - no active player")
        }
    }

    // MARK: - Clear All Notifications
    @objc func clearAllNotifications() {
        UNUserNotificationCenter.current().removeAllPendingNotificationRequests()
        print("🧹 Cleared all pending notifications")
    }
}
