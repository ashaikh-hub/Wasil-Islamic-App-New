package com.wasilislamicapp;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.util.Log;

public class AzanReceiver extends BroadcastReceiver {
    @Override
    public void onReceive(Context context, Intent intent) {
        if (intent != null && "PLAY_AZAN".equals(intent.getAction())) {
            String prayerName = intent.getStringExtra("prayer");
            Log.d("AzanReceiver", "🔔 Received alarm for: " + prayerName);

            Intent serviceIntent = new Intent(context, AzanService.class);
            serviceIntent.putExtra("prayer", prayerName);
            context.startForegroundService(serviceIntent);
        }
    }
}
