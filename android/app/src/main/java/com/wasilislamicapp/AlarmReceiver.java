package com.wasilislamicapp;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.os.Build;

public class AlarmReceiver extends BroadcastReceiver {
    @Override
    public void onReceive(Context context, Intent intent) {
        String prayer = intent.getStringExtra("prayer");

        if (!AzanPlayerState.isPlaying(context)) {
            Intent serviceIntent = new Intent(context, AzanService.class);
            serviceIntent.putExtra("prayer", prayer);

            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                context.startForegroundService(serviceIntent);
            } else {
                context.startService(serviceIntent);
            }
        }
    }
}

