# :rocket: Run application for local testing
## Fix fingerprint library
Before to run the application replace these lines inside `node_modules -> react-native-fingerprint-scanner -> android -> build.gradle`
```gradle
// implementation "com.wei.android.lib:fingerprintidentify:${safeExtGet("fingerprintidentify", "1.2.6")}"
   implementation "com.github.uccmawei:FingerprintIdentify:1.2.6"
```
Then you can run the application
```bash
react-native run-android
```

# :gear: Build apk
```bash
cd android && ./gradlew assembleRelease
```