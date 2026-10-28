# Keep JavaScript interface methods reachable from WebView.
-keepclassmembers class com.dsh.remoto.newapp.MainActivity$Bridge {
    public *;
}
