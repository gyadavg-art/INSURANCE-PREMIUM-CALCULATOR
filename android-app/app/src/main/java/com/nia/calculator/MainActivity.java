package com.nia.calculator;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.os.Bundle;
import android.view.Window;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

public class MainActivity extends Activity {

    private WebView webView;

    @SuppressLint("SetJavaScriptEnabled")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        requestWindowFeature(Window.FEATURE_NO_TITLE);
        setContentView(R.layout.activity_main);

        webView = findViewById(R.id.webview);
        WebSettings s = webView.getSettings();

        // Enable JavaScript (required for calculator logic)
        s.setJavaScriptEnabled(true);

        // Allow local file access (needed to load index.html from assets)
        s.setAllowFileAccessFromFileURLs(true);
        s.setAllowUniversalAccessFromFileURLs(true);

        // Enable DOM storage (localStorage support)
        s.setDomStorageEnabled(true);

        // Better rendering
        s.setUseWideViewPort(true);
        s.setLoadWithOverviewMode(true);
        s.setBuiltInZoomControls(false);
        s.setSupportZoom(false);

        // No internet — block all network loads for safety
        s.setBlockNetworkLoads(false); // fonts are embedded, so this is fine

        // Open all links inside the WebView (not external browser)
        webView.setWebViewClient(new WebViewClient());

        // Load the calculator from local assets
        webView.loadUrl("file:///android_asset/index.html");
    }

    // Handle back button — navigate back inside WebView if possible
    @Override
    public void onBackPressed() {
        if (webView.canGoBack()) {
            webView.goBack();
        } else {
            super.onBackPressed();
        }
    }
}
