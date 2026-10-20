package com.wasilislamicapp;

import android.app.AlarmManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.os.Build;
import android.provider.Settings;
import android.util.Log;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Calendar;
import java.util.Locale;
import android.content.SharedPreferences;

public class AzanSchedulerModule extends ReactContextBaseJavaModule {
    private static final String TAG = "AzanScheduler";

    public AzanSchedulerModule(@NonNull ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @NonNull
    @Override
    public String getName() {
        return "AzanScheduler";
    }

    // ✅ Schedules one azan using full datetime
    @ReactMethod
    public void scheduleAzan(String prayerName, String timeFull) {
        try {
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss", Locale.getDefault());
            Date date = sdf.parse(timeFull);
            Calendar azanTime = Calendar.getInstance();
            azanTime.setTime(date);

            if (azanTime.before(Calendar.getInstance())) {
                azanTime.add(Calendar.DAY_OF_YEAR, 1);
            }

            long triggerAtMillis = azanTime.getTimeInMillis();
            Context context = getReactApplicationContext();

            Intent intent = new Intent(context, AzanReceiver.class);
            intent.setAction("PLAY_AZAN");
            intent.putExtra("prayer", prayerName);

            PendingIntent pendingIntent = PendingIntent.getBroadcast(
                    context,
                    prayerName.hashCode(),
                    intent,
                    PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
            );

            AlarmManager alarmManager = (AlarmManager) context.getSystemService(Context.ALARM_SERVICE);
            if (alarmManager != null) {
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S &&
                        !alarmManager.canScheduleExactAlarms()) {
                    Log.e(TAG, "❌ Exact alarm permission not granted.");
                    return;
                }

                alarmManager.setExactAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, triggerAtMillis, pendingIntent);
                Log.i(TAG, "⏰ Scheduled Azan for " + prayerName + " at " + timeFull);
                savePrayerTime(context, prayerName, timeFull); // Save for reboot
            }

        } catch (Exception e) {
            Log.e(TAG, "Failed to schedule azan", e);
        }
    }


    @ReactMethod
    public void showNotification(String prayerName) {
        Context context = getReactApplicationContext();
        NotificationHelper.createChannel(context);

        Intent serviceIntent = new Intent(context, AzanService.class);
        serviceIntent.putExtra("prayer", prayerName);
        context.startForegroundService(serviceIntent);
    }

    @ReactMethod
    public void openExactAlarmPermissionSettings() {
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
        Context context = getReactApplicationContext();
        AlarmManager alarmManager = (AlarmManager) context.getSystemService(Context.ALARM_SERVICE);

        if (!alarmManager.canScheduleExactAlarms()) {
            Intent intent = new Intent(Settings.ACTION_REQUEST_SCHEDULE_EXACT_ALARM);
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);

            // Optional: Only open if intent can be handled
            if (intent.resolveActivity(context.getPackageManager()) != null) {
                context.startActivity(intent);
            } else {
                Log.w("AzanScheduler", "⚠️ Cannot open exact alarm permission settings — intent not resolved.");
            }
        } else {
            Log.d("AzanScheduler", "✅ Exact alarm already granted — no need to open settings.");
        }
    }
    }


    @ReactMethod
    public void rescheduleAllAzans() {
        rescheduleAlarmsAfterReboot(getReactApplicationContext());
    }

    public static void rescheduleAlarmsAfterReboot(Context context) {
        SharedPreferences prefs = context.getSharedPreferences("azanPrefs", Context.MODE_PRIVATE);
        String[] prayers = {"Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"};

        for (String prayer : prayers) {
            String time = prefs.getString(prayer, null);
            if (time != null) {
                Log.d(TAG, "⏳ Rescheduling " + prayer + " at " + time);
                scheduleExactAzan(context, prayer, time);
            }
        }
    }

    public static void savePrayerTime(Context context, String prayerName, String time) {
        SharedPreferences prefs = context.getSharedPreferences("azanPrefs", Context.MODE_PRIVATE);
        prefs.edit().putString(prayerName, time).apply();
    }

    // ✅ Accept full datetime string for reboot rescheduling
    private static void scheduleExactAzan(Context context, String prayerName, String time) {
        try {
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss", Locale.getDefault());
            Date date = sdf.parse(time);
            Calendar calendar = Calendar.getInstance();
            calendar.setTime(date);

            if (calendar.before(Calendar.getInstance())) {
                calendar.add(Calendar.DAY_OF_YEAR, 1);
            }

            Intent intent = new Intent(context, AzanReceiver.class);
            intent.setAction("PLAY_AZAN");
            intent.putExtra("prayer", prayerName);

            PendingIntent pendingIntent = PendingIntent.getBroadcast(
                    context,
                    prayerName.hashCode(),
                    intent,
                    PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
            );

            AlarmManager alarmManager = (AlarmManager) context.getSystemService(Context.ALARM_SERVICE);
            if (alarmManager != null) {
                alarmManager.setExactAndAllowWhileIdle(
                        AlarmManager.RTC_WAKEUP,
                        calendar.getTimeInMillis(),
                        pendingIntent
                );
                Log.d(TAG, "📅 Scheduled " + prayerName + " at " + calendar.getTime());
            }

        } catch (Exception e) {
            Log.e(TAG, "❌ Failed to parse and reschedule azan: " + time, e);
        }
    }

    @ReactMethod
    public void cancelAzan(String prayerName) {
        Context context = getReactApplicationContext();

        Intent intent = new Intent(context, AzanReceiver.class);
        intent.setAction("PLAY_AZAN");
        intent.putExtra("prayer", prayerName);

        PendingIntent pendingIntent = PendingIntent.getBroadcast(
                context,
                prayerName.hashCode(),
                intent,
                PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
        );

        AlarmManager alarmManager = (AlarmManager) context.getSystemService(Context.ALARM_SERVICE);
        if (alarmManager != null) {
            alarmManager.cancel(pendingIntent);
            Log.i(TAG, "🔕 Canceled Azan for " + prayerName);
        }

        SharedPreferences prefs = context.getSharedPreferences("azanPrefs", Context.MODE_PRIVATE);
        prefs.edit().remove(prayerName).apply();
    }
    @ReactMethod
    public void canScheduleAlarms(com.facebook.react.bridge.Promise promise) {
    try {
        AlarmManager alarmManager = (AlarmManager) getReactApplicationContext().getSystemService(Context.ALARM_SERVICE);
        boolean allowed = true; // Default to true for Android < 31
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) { // API 31
            allowed = alarmManager != null && alarmManager.canScheduleExactAlarms();
        }
        Log.d(TAG, "✅ Native check — canScheduleExactAlarms: " + allowed);
        promise.resolve(allowed);
    } catch (Exception e) {
        Log.e(TAG, "❌ Error in canScheduleAlarms", e);
        promise.reject("ALARM_PERMISSION_ERROR", e);
    }
    }
}
