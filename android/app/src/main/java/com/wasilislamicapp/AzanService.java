package com.wasilislamicapp;

import android.app.Service;
import android.content.Intent;
import android.os.IBinder;
import android.util.Log;

import androidx.annotation.Nullable;

import androidx.media3.common.MediaItem;
import androidx.media3.common.Player;
import androidx.media3.exoplayer.ExoPlayer;

public class AzanService extends Service {

    private static final String TAG = "AzanService";
    private ExoPlayer player;

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        if ("STOP_AZAN".equals(intent.getAction())) {
            Log.d(TAG, "Received STOP_AZAN intent. Stopping service.");
            stopSelf();
            return START_NOT_STICKY;
        }

        String prayer = intent.getStringExtra("prayer");
        Log.d(TAG, "Starting AzanService for: " + prayer);

        // Create notification channel and start foreground notification
        NotificationHelper.createChannel(this);
        startForeground(1, NotificationHelper.buildAzanNotification(this, prayer));

        // Initialize ExoPlayer and play azan from asset
        player = new ExoPlayer.Builder(this).build();
        MediaItem mediaItem = MediaItem.fromUri("asset:///azan.mp3");
        player.setMediaItem(mediaItem);
        player.prepare();
        player.play();

        player.addListener(new Player.Listener() {
            @Override
            public void onPlaybackStateChanged(int playbackState) {
                if (playbackState == Player.STATE_ENDED || playbackState == Player.STATE_IDLE) {
                    Log.d(TAG, "Azan playback finished. Stopping service.");
                    stopSelf();
                }
            }
        });

        return START_NOT_STICKY;
    }

    @Override
    public void onDestroy() {
        Log.d(TAG, "AzanService destroyed.");
        if (player != null) {
            player.release();
            player = null;
        }
        NotificationHelper.clearNotification(this);
        super.onDestroy();
    }

    @Nullable
    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }
}
