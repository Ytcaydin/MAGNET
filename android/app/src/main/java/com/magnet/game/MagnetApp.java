package com.magnet.game;

import android.app.Application;
import android.os.Build;

import java.io.File;
import java.io.FileOutputStream;
import java.io.PrintWriter;
import java.io.StringWriter;
import java.nio.charset.StandardCharsets;

/**
 * Installs a crash recorder before any Activity starts. If the app crashes,
 * the stack trace is written to files/last_crash.txt and MainActivity shows it
 * on the next launch, so crashes can be diagnosed without adb.
 */
public class MagnetApp extends Application {
    static final String CRASH_FILE = "last_crash.txt";

    @Override public void onCreate() {
        super.onCreate();
        final Thread.UncaughtExceptionHandler previous = Thread.getDefaultUncaughtExceptionHandler();
        Thread.setDefaultUncaughtExceptionHandler(new Thread.UncaughtExceptionHandler() {
            @Override public void uncaughtException(Thread t, Throwable e) {
                try { writeCrash(MagnetApp.this, "Uncaught exception in thread " + t.getName(), e); } catch (Throwable ignored) { }
                if (previous != null) previous.uncaughtException(t, e);
                else { android.os.Process.killProcess(android.os.Process.myPid()); System.exit(10); }
            }
        });
    }

    static String describe(String title, Throwable e) {
        StringWriter sw = new StringWriter();
        PrintWriter pw = new PrintWriter(sw);
        pw.println(title);
        pw.println("App: " + BuildInfo.VERSION + " | Android " + Build.VERSION.RELEASE + " (API " + Build.VERSION.SDK_INT + ")");
        pw.println("Device: " + Build.MANUFACTURER + " " + Build.MODEL);
        pw.println();
        if (e != null) e.printStackTrace(pw);
        pw.flush();
        return sw.toString();
    }

    static void writeCrash(Application app, String title, Throwable e) throws Exception {
        File f = new File(app.getFilesDir(), CRASH_FILE);
        FileOutputStream out = new FileOutputStream(f, false);
        try { out.write(describe(title, e).getBytes(StandardCharsets.UTF_8)); } finally { out.close(); }
    }

    /** Version label without depending on generated BuildConfig. */
    static final class BuildInfo { static final String VERSION = "5.7.1"; }
}
