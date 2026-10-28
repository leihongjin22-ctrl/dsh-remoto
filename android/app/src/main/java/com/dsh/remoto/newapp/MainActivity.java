package com.dsh.remoto.newapp;

import android.app.Activity;
import android.content.ContentValues;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Color;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.Environment;
import android.provider.MediaStore;
import android.util.Base64;
import android.view.View;
import android.view.Window;
import android.view.WindowManager;
import android.webkit.JavascriptInterface;
import android.webkit.PermissionRequest;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Toast;

import com.google.zxing.BinaryBitmap;
import com.google.zxing.MultiFormatReader;
import com.google.zxing.RGBLuminanceSource;
import com.google.zxing.Result;
import com.google.zxing.common.HybridBinarizer;

import org.json.JSONObject;

import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.OutputStream;

/**
 * Minimal WebView shell for the independent DSH Remoto client. All protocol,
 * crypto and UI logic lives in the bundled JavaScript; this class only provides
 * the file picker, back handling, screen-on and lifecycle hooks.
 */
public class MainActivity extends Activity {
    private static final int REQUEST_FILE = 1001;
    private static final int REQUEST_QR = 1002;

    private WebView webView;
    private ValueCallback<Uri[]> fileCallback;
    private Uri qrOutputUri;
    private long pausedAt = 0L;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        Window window = getWindow();
        window.setStatusBarColor(Color.WHITE);
        window.setNavigationBarColor(Color.WHITE);
        int flags = View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            flags |= View.SYSTEM_UI_FLAG_LIGHT_NAVIGATION_BAR;
        }
        window.getDecorView().setSystemUiVisibility(flags);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
            window.setNavigationBarDividerColor(Color.parseColor("#ececee"));
        }

        WebView.setWebContentsDebuggingEnabled(true);
        webView = new WebView(this);
        setContentView(webView, new android.view.ViewGroup.LayoutParams(
                android.view.ViewGroup.LayoutParams.MATCH_PARENT,
                android.view.ViewGroup.LayoutParams.MATCH_PARENT));

        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setDatabaseEnabled(true);
        settings.setAllowFileAccess(true);
        settings.setAllowContentAccess(true);
        settings.setLoadWithOverviewMode(false);
        settings.setUseWideViewPort(false);
        settings.setSupportZoom(false);
        settings.setBuiltInZoomControls(false);
        settings.setMediaPlaybackRequiresUserGesture(false);
        settings.setMixedContentMode(WebSettings.MIXED_CONTENT_ALWAYS_ALLOW);
        settings.setCacheMode(WebSettings.LOAD_DEFAULT);
        settings.setUserAgentString(settings.getUserAgentString() + " DSHRemoto/0.3.0");

        webView.setOverScrollMode(View.OVER_SCROLL_NEVER);
        webView.setBackgroundColor(Color.parseColor("#0b0d10"));

        webView.setWebChromeClient(new WebChromeClient() {
            @Override
            public boolean onShowFileChooser(WebView view, ValueCallback<Uri[]> callback,
                                             FileChooserParams params) {
                if (fileCallback != null) {
                    fileCallback.onReceiveValue(null);
                }
                fileCallback = callback;
                Intent intent = params.createIntent();
                intent.addCategory(Intent.CATEGORY_OPENABLE);
                intent.putExtra(Intent.EXTRA_ALLOW_MULTIPLE,
                        params.getMode() == FileChooserParams.MODE_OPEN_MULTIPLE);
                try {
                    startActivityForResult(intent, REQUEST_FILE);
                    return true;
                } catch (Exception error) {
                    fileCallback = null;
                    Toast.makeText(MainActivity.this, "无法打开文件选择器", Toast.LENGTH_SHORT).show();
                    return false;
                }
            }

            @Override
            public void onPermissionRequest(PermissionRequest request) {
                request.grant(request.getResources());
            }
        });

        webView.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                Uri uri = request.getUrl();
                String scheme = uri.getScheme();
                if ("http".equals(scheme) || "https".equals(scheme)) {
                    try {
                        startActivity(new Intent(Intent.ACTION_VIEW, uri));
                    } catch (Exception ignored) {
                    }
                    return true;
                }
                return false;
            }
        });

        webView.addJavascriptInterface(new Bridge(), "AndroidBridge");
        webView.loadUrl("file:///android_asset/www/index.html");
    }

    public class Bridge {
        @JavascriptInterface
        public String info() {
            return "{\"version\":\"0.4.0\",\"sdk\":" + Build.VERSION.SDK_INT
                    + ",\"model\":\"" + escape(Build.MODEL) + "\"}";
        }

        @JavascriptInterface
        public void toast(final String text) {
            runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    Toast.makeText(MainActivity.this, text, Toast.LENGTH_SHORT).show();
                }
            });
        }

        @JavascriptInterface
        public void scanQr() {
            runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    try {
                        ContentValues values = new ContentValues();
                        values.put(MediaStore.Images.Media.TITLE, "dsh-qr-" + System.currentTimeMillis());
                        values.put(MediaStore.Images.Media.MIME_TYPE, "image/jpeg");
                        qrOutputUri = getContentResolver().insert(MediaStore.Images.Media.EXTERNAL_CONTENT_URI, values);
                        Intent intent = new Intent(MediaStore.ACTION_IMAGE_CAPTURE);
                        intent.putExtra(MediaStore.EXTRA_OUTPUT, qrOutputUri);
                        intent.addFlags(Intent.FLAG_GRANT_WRITE_URI_PERMISSION);
                        startActivityForResult(intent, REQUEST_QR);
                    } catch (Exception error) {
                        Toast.makeText(MainActivity.this, "无法打开相机：" + error.getMessage(), Toast.LENGTH_LONG).show();
                    }
                }
            });
        }

        @JavascriptInterface
        public void saveBase64(final String rawName, final String mime, final String base64) {
            runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    String name = String.valueOf(rawName == null ? "file" : rawName)
                            .replaceAll("[\\\\/:*?\"<>|]", "_");
                    if (name.trim().isEmpty()) name = "file";
                    try {
                        byte[] bytes = Base64.decode(base64, Base64.DEFAULT);
                        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                            ContentValues values = new ContentValues();
                            values.put(MediaStore.MediaColumns.DISPLAY_NAME, name);
                            values.put(MediaStore.MediaColumns.MIME_TYPE, mime);
                            values.put(MediaStore.MediaColumns.RELATIVE_PATH, Environment.DIRECTORY_DOWNLOADS);
                            Uri uri = getContentResolver().insert(MediaStore.Downloads.EXTERNAL_CONTENT_URI, values);
                            if (uri == null) throw new IllegalStateException("无法创建下载项");
                            try (OutputStream out = getContentResolver().openOutputStream(uri)) {
                                if (out == null) throw new IllegalStateException("无法打开下载项");
                                out.write(bytes);
                            }
                            Toast.makeText(MainActivity.this, "已保存到下载目录", Toast.LENGTH_SHORT).show();
                        } else {
                            File dir = getExternalFilesDir(Environment.DIRECTORY_DOWNLOADS);
                            if (dir == null) dir = getFilesDir();
                            File file = new File(dir, name);
                            try (FileOutputStream out = new FileOutputStream(file)) {
                                out.write(bytes);
                            }
                            Toast.makeText(MainActivity.this, "已保存到 " + file.getAbsolutePath(), Toast.LENGTH_LONG).show();
                        }
                    } catch (Exception error) {
                        Toast.makeText(MainActivity.this, "保存失败：" + error.getMessage(), Toast.LENGTH_LONG).show();
                    }
                }
            });
        }

        @JavascriptInterface
        public void keepScreenOn(final boolean on) {
            runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    if (on) {
                        getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
                    } else {
                        getWindow().clearFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
                    }
                }
            });
        }
    }

    private static String escape(String value) {
        if (value == null) {
            return "";
        }
        return value.replace("\\", "\\\\").replace("\"", "\\\"");
    }

    private void decodeQrImage(final Uri uri) {
        if (uri == null) return;
        new Thread(new Runnable() {
            @Override
            public void run() {
                Bitmap bitmap = null;
                try {
                    BitmapFactory.Options bounds = new BitmapFactory.Options();
                    bounds.inJustDecodeBounds = true;
                    try (InputStream in = getContentResolver().openInputStream(uri)) {
                        BitmapFactory.decodeStream(in, null, bounds);
                    }
                    int sample = 1;
                    while (bounds.outWidth / sample > 1600 || bounds.outHeight / sample > 1600) sample *= 2;
                    BitmapFactory.Options options = new BitmapFactory.Options();
                    options.inSampleSize = sample;
                    try (InputStream in = getContentResolver().openInputStream(uri)) {
                        bitmap = BitmapFactory.decodeStream(in, null, options);
                    }
                    if (bitmap == null) throw new IllegalStateException("无法读取照片");
                    int width = bitmap.getWidth();
                    int height = bitmap.getHeight();
                    int[] pixels = new int[width * height];
                    bitmap.getPixels(pixels, 0, width, 0, 0, width, height);
                    RGBLuminanceSource source = new RGBLuminanceSource(width, height, pixels);
                    Result result = new MultiFormatReader().decode(new BinaryBitmap(new HybridBinarizer(source)));
                    final String script = "window.DRCRemote && window.DRCRemote.onScan("
                            + JSONObject.quote(result.getText()) + ")";
                    webView.post(new Runnable() {
                        @Override
                        public void run() {
                            webView.evaluateJavascript(script, null);
                        }
                    });
                } catch (Exception error) {
                    final String message = "未识别到二维码：" + error.getMessage();
                    runOnUiThread(new Runnable() {
                        @Override
                        public void run() {
                            Toast.makeText(MainActivity.this, message, Toast.LENGTH_LONG).show();
                        }
                    });
                } finally {
                    if (bitmap != null) bitmap.recycle();
                    try { getContentResolver().delete(uri, null, null); } catch (Exception ignored) {}
                }
            }
        }).start();
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        if (requestCode == REQUEST_QR) {
            if (resultCode == RESULT_OK) decodeQrImage(qrOutputUri);
            return;
        }
        if (requestCode == REQUEST_FILE) {
            if (fileCallback != null) {
                Uri[] results = null;
                if (resultCode == RESULT_OK && data != null) {
                    if (data.getClipData() != null) {
                        int count = data.getClipData().getItemCount();
                        results = new Uri[count];
                        for (int index = 0; index < count; index += 1) {
                            results[index] = data.getClipData().getItemAt(index).getUri();
                        }
                    } else if (data.getData() != null) {
                        results = new Uri[] { data.getData() };
                    }
                }
                fileCallback.onReceiveValue(results);
                fileCallback = null;
            }
            return;
        }
        super.onActivityResult(requestCode, resultCode, data);
    }

    @Override
    protected void onPause() {
        pausedAt = System.currentTimeMillis();
        if (webView != null) {
            webView.evaluateJavascript("window.__drcPause && window.__drcPause()", null);
        }
        super.onPause();
    }

    @Override
    protected void onResume() {
        super.onResume();
        if (webView != null) {
            webView.evaluateJavascript("window.__drcResume && window.__drcResume()", null);
        }
    }

    @Override
    public void onBackPressed() {
        if (webView == null) {
            super.onBackPressed();
            return;
        }
        webView.evaluateJavascript(
                "(function(){ try { return window.DRCApp && window.DRCApp.onBack(); } catch (e) { return false; } })()",
                new ValueCallback<String>() {
                    @Override
                    public void onReceiveValue(String value) {
                        if (!"true".equals(value)) {
                            finish();
                        }
                    }
                });
    }

    @Override
    protected void onDestroy() {
        if (webView != null) {
            webView.destroy();
            webView = null;
        }
        super.onDestroy();
    }
}
