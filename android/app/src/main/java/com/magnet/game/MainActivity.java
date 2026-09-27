package com.magnet.game;

import android.app.Activity;
import android.content.ClipData;
import android.content.ClipboardManager;
import android.content.Context;
import android.graphics.Color;
import android.graphics.Typeface;
import android.os.Build;
import android.os.Bundle;
import android.util.Log;
import android.view.Gravity;
import android.view.View;
import android.view.ViewGroup;
import android.view.WindowInsets;
import android.view.WindowInsetsController;
import android.webkit.ConsoleMessage;
import android.webkit.RenderProcessGoneDetail;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Button;
import android.widget.LinearLayout;
import android.widget.ScrollView;
import android.widget.TextView;

import java.io.File;
import java.io.FileInputStream;
import java.io.ByteArrayOutputStream;
import java.nio.charset.StandardCharsets;

public class MainActivity extends Activity {
    private static final String TAG = "MAGNET";
    private static final int BG = Color.rgb(7, 11, 17);
    private static int rendererCrashes = 0;
    private WebView web;

    @Override public void onCreate(Bundle state) {
        super.onCreate(state);

        // 1) A previous launch crashed: show the report instead of crashing again.
        String lastCrash = readAndDeleteCrash();
        if (lastCrash != null) { showError("MAGNET önceki açılışta çöktü", lastCrash); return; }

        // 2) Create the WebView defensively (it throws if Android System WebView is missing/disabled/updating).
        try {
            startGame();
        } catch (Throwable e) {
            Log.e(TAG, "startGame failed", e);
            showError("Oyun başlatılamadı", MagnetApp.describe("WebView başlatılamadı. Play Store'dan \"Android System WebView\" ve Chrome'u güncelleyip etkin olduğundan emin olun.", e));
        }
    }

    private void startGame() {
        web = new WebView(this);
        web.setBackgroundColor(BG);
        WebSettings s = web.getSettings();
        s.setJavaScriptEnabled(true);
        s.setDomStorageEnabled(true);
        s.setMediaPlaybackRequiresUserGesture(false);
        s.setBuiltInZoomControls(false);
        s.setDisplayZoomControls(false);
        s.setSupportZoom(false);
        s.setAllowFileAccess(true);
        s.setCacheMode(WebSettings.LOAD_DEFAULT);
        web.setWebViewClient(new WebViewClient() {
            @Override public boolean onRenderProcessGone(WebView view, RenderProcessGoneDetail detail) {
                boolean crashed = Build.VERSION.SDK_INT >= 26 && detail != null && detail.didCrash();
                Log.e(TAG, "WebView renderer gone, crashed=" + crashed);
                destroyWeb();
                rendererCrashes++;
                if (rendererCrashes <= 1) {
                    try { startGame(); return true; } catch (Throwable e) { Log.e(TAG, "restart failed", e); }
                }
                showError("Oyun motoru durdu", MagnetApp.describe(
                        "WebView renderer süreci sonlandı (crashed=" + crashed + ", deneme=" + rendererCrashes + ").", null));
                return true; // handled: do not let the system kill the app
            }
        });
        web.setWebChromeClient(new WebChromeClient() {
            @Override public boolean onConsoleMessage(ConsoleMessage m) {
                // JS console -> logcat (adb logcat -s MAGNET)
                Log.println(m.messageLevel() == ConsoleMessage.MessageLevel.ERROR ? Log.ERROR : Log.INFO, TAG,
                        m.message() + " @" + m.sourceId() + ":" + m.lineNumber());
                return true;
            }
        });
        web.setOverScrollMode(View.OVER_SCROLL_NEVER);
        web.setVerticalScrollBarEnabled(false);
        web.setHorizontalScrollBarEnabled(false);
        setContentView(web);
        applyImmersive();
        web.loadUrl("file:///android_asset/index.html");
    }

    private void destroyWeb() {
        if (web == null) return;
        try {
            if (web.getParent() instanceof ViewGroup) ((ViewGroup) web.getParent()).removeView(web);
            web.destroy();
        } catch (Throwable e) { Log.e(TAG, "destroyWeb", e); }
        web = null;
    }

    private void applyImmersive() {
        try {
            getWindow().setStatusBarColor(BG);
            getWindow().setNavigationBarColor(BG);
            if (Build.VERSION.SDK_INT >= 30) {
                WindowInsetsController c = getWindow().getInsetsController();
                if (c != null) {
                    c.hide(WindowInsets.Type.statusBars() | WindowInsets.Type.navigationBars());
                    c.setSystemBarsBehavior(WindowInsetsController.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE);
                }
            } else {
                getWindow().getDecorView().setSystemUiVisibility(
                        View.SYSTEM_UI_FLAG_FULLSCREEN
                        | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
                        | View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY
                        | View.SYSTEM_UI_FLAG_LAYOUT_STABLE);
            }
        } catch (Throwable e) {
            Log.e(TAG, "applyImmersive failed (non-fatal)", e);
        }
    }

    private String readAndDeleteCrash() {
        try {
            File f = new File(getFilesDir(), MagnetApp.CRASH_FILE);
            if (!f.exists()) return null;
            FileInputStream in = new FileInputStream(f);
            ByteArrayOutputStream out = new ByteArrayOutputStream();
            try {
                byte[] buf = new byte[4096];
                int n;
                while ((n = in.read(buf)) > 0) out.write(buf, 0, n);
            } finally { in.close(); }
            //noinspection ResultOfMethodCallIgnored
            f.delete();
            return new String(out.toByteArray(), StandardCharsets.UTF_8);
        } catch (Throwable e) {
            return null;
        }
    }

    /** Plain native error screen (no WebView) with copy + retry. */
    private void showError(String title, final String details) {
        destroyWeb();
        LinearLayout root = new LinearLayout(this);
        root.setOrientation(LinearLayout.VERTICAL);
        root.setBackgroundColor(BG);
        int pad = (int) (20 * getResources().getDisplayMetrics().density);
        root.setPadding(pad, pad * 2, pad, pad);

        TextView h = new TextView(this);
        h.setText(title);
        h.setTextColor(Color.WHITE);
        h.setTextSize(20);
        h.setTypeface(Typeface.DEFAULT_BOLD);
        root.addView(h);

        TextView hint = new TextView(this);
        hint.setText("Aşağıdaki hata metnini KOPYALA ile kopyalayıp geliştiriciye gönder.");
        hint.setTextColor(Color.rgb(160, 175, 190));
        hint.setPadding(0, pad / 2, 0, pad / 2);
        root.addView(hint);

        LinearLayout buttons = new LinearLayout(this);
        buttons.setOrientation(LinearLayout.HORIZONTAL);
        buttons.setGravity(Gravity.START);
        Button copy = new Button(this);
        copy.setText("KOPYALA");
        copy.setOnClickListener(new View.OnClickListener() {
            @Override public void onClick(View v) {
                ClipboardManager cm = (ClipboardManager) getSystemService(Context.CLIPBOARD_SERVICE);
                if (cm != null) cm.setPrimaryClip(ClipData.newPlainText("MAGNET crash", details));
            }
        });
        Button retry = new Button(this);
        retry.setText("TEKRAR DENE");
        retry.setOnClickListener(new View.OnClickListener() {
            @Override public void onClick(View v) { rendererCrashes = 0; recreate(); }
        });
        buttons.addView(copy);
        buttons.addView(retry);
        root.addView(buttons);

        ScrollView scroll = new ScrollView(this);
        TextView body = new TextView(this);
        body.setText(details);
        body.setTextColor(Color.rgb(255, 200, 200));
        body.setTextSize(12);
        body.setTypeface(Typeface.MONOSPACE);
        body.setTextIsSelectable(true);
        body.setPadding(0, pad / 2, 0, 0);
        scroll.addView(body);
        root.addView(scroll, new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, 0, 1f));
        setContentView(root);
    }

    @Override public void onWindowFocusChanged(boolean hasFocus) {
        super.onWindowFocusChanged(hasFocus);
        if (hasFocus && web != null) applyImmersive();
    }

    @Override public void onBackPressed() {
        if (web != null && web.canGoBack()) web.goBack(); else super.onBackPressed();
    }

    @Override protected void onPause() {
        if (web != null) web.evaluateJavascript("window.MAGNET_APP_PAUSE && window.MAGNET_APP_PAUSE();", null);
        super.onPause();
    }

    @Override protected void onResume() {
        super.onResume();
        if (web != null) {
            applyImmersive();
            web.evaluateJavascript("window.MAGNET_APP_RESUME && window.MAGNET_APP_RESUME();", null);
        }
    }

    @Override protected void onDestroy() {
        if (web != null) { web.stopLoading(); destroyWeb(); }
        super.onDestroy();
    }
}
