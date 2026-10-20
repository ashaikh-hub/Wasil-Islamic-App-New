package com.wasilislamicapp;

import android.content.Context;
import android.content.SharedPreferences;

public class AzanPlayerState {
    private static final String PREF_NAME = "azan_prefs";
    private static final String IS_PLAYING = "is_playing";

    public static void setPlaying(Context context, boolean playing) {
        SharedPreferences prefs = context.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE);
        prefs.edit().putBoolean(IS_PLAYING, playing).apply();
    }

    public static boolean isPlaying(Context context) {
        SharedPreferences prefs = context.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE);
        return prefs.getBoolean(IS_PLAYING, false);
    }
}
