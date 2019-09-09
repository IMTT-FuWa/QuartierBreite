# Create release on Windows
- ionic cordova platform rm android
- ionic cordova platform add android
- cordova build --release android

- jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore release-key.keystore app-release.apk aliasName
- enter the password: 

navigate with windows prompt to: C:\Users\...\platforms\android\app\release
- C:\...\Android\sdk\build-tools\25.0.2\zipalign -v 4 app-release.apk android.app.apk

for more information about publishing your app https://ionicframework.com/docs/v1/guide/publishing.html

