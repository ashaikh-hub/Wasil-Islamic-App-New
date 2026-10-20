package com.wasilislamicapp;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.os.Build;

import androidx.core.app.NotificationCompat;

public class NotificationHelper {
    private static final String CHANNEL_ID = "azan_channel";

    public static Notification buildAzanNotification(Context context, String prayer) {
        createChannel(context);

        Intent stopIntent = new Intent(context, AzanService.class);
        stopIntent.setAction("STOP_AZAN");

        PendingIntent stopPendingIntent = PendingIntent.getService(
                context, 1, stopIntent,
                PendingIntent.FLAG_UPDATE_CURRENT | (Build.VERSION.SDK_INT >= 23 ? PendingIntent.FLAG_IMMUTABLE : 0)
        );

        return new NotificationCompat.Builder(context, CHANNEL_ID)
                .setContentTitle("Azan is Playing")
                .setContentText("Time for " + prayer + " prayer")
                .setSmallIcon(android.R.drawable.ic_lock_idle_alarm)
                .addAction(android.R.drawable.ic_media_pause, "Stop", stopPendingIntent)
                .setPriority(NotificationCompat.PRIORITY_HIGH)
                .setOnlyAlertOnce(true)
                .setOngoing(true)
                .build();
    }

    public static void createChannel(Context context) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel channel = new NotificationChannel(
                    CHANNEL_ID, "Azan Playback", NotificationManager.IMPORTANCE_HIGH
            );
            NotificationManager manager = context.getSystemService(NotificationManager.class);
            if (manager != null) manager.createNotificationChannel(channel);
        }
    }

    public static void clearNotification(Context context) {
        NotificationManager manager = (NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE);
        manager.cancelAll();
    }

    // ✅ This was missing and is needed by AzanSchedulerModule
    public static void showNotification(Context context, String prayerName) {
        createChannel(context);
        Notification notification = new NotificationCompat.Builder(context, CHANNEL_ID)
                .setSmallIcon(android.R.drawable.ic_lock_idle_alarm)
                .setContentTitle("Prayer Time")
                .setContentText("Time for " + prayerName + " prayer.")
                .setAutoCancel(true)
                .setPriority(NotificationCompat.PRIORITY_HIGH)
                .build();

        NotificationManager manager = (NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE);
        if (manager != null) {
            manager.notify(prayerName.hashCode(), notification);
        }
    }
}
