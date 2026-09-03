import fs from 'fs';
import path from 'path';

console.log('--- Configuring Android Native Files for Lockscreen Media & Notifications ---');

const projectRoot = process.cwd();
const androidDir = path.join(projectRoot, 'android');
const manifestPath = path.join(androidDir, 'app', 'src', 'main', 'AndroidManifest.xml');

if (!fs.existsSync(manifestPath)) {
  console.log('Android folder not initialized yet. Skipping manifest patch.');
} else {
  let manifest = fs.readFileSync(manifestPath, 'utf8');

  const permissionsToAdd = [
    '<uses-permission android:name="android.permission.INTERNET" />',
    '<uses-permission android:name="android.permission.WAKE_LOCK" />',
    '<uses-permission android:name="android.permission.FOREGROUND_SERVICE" />',
    '<uses-permission android:name="android.permission.FOREGROUND_SERVICE_MEDIA_PLAYBACK" />',
    '<uses-permission android:name="android.permission.POST_NOTIFICATIONS" />',
    '<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" android:maxSdkVersion="32" />',
    '<uses-permission android:name="android.permission.READ_MEDIA_AUDIO" />',
  ];

  const missing = permissionsToAdd.filter(perm => !manifest.includes(perm));

  if (missing.length > 0) {
    manifest = manifest.replace(
      '<application',
      `${missing.join('\n    ')}\n\n    <application`
    );
    console.log(`Added ${missing.length} missing permissions to AndroidManifest.xml`);
  }

  // Ensure application attributes
  if (!manifest.includes('android:usesCleartextTraffic')) {
    manifest = manifest.replace(
      '<application',
      '<application\n        android:usesCleartextTraffic="true"'
    );
  }

  fs.writeFileSync(manifestPath, manifest, 'utf8');
  console.log('Android Manifest successfully updated!');
}

// Find and patch MainActivity.java for continuous background audio
function findMainActivity(dir) {
  if (!fs.existsSync(dir)) return null;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const full = path.join(dir, file);
    if (fs.statSync(full).isDirectory()) {
      const found = findMainActivity(full);
      if (found) return found;
    } else if (file === 'MainActivity.java') {
      return full;
    }
  }
  return null;
}

const javaSrcDir = path.join(androidDir, 'app', 'src', 'main', 'java');
const mainActivityPath = findMainActivity(javaSrcDir);

if (mainActivityPath) {
  const javaCode = `package com.google.pixel.music;

import android.os.Bundle;
import android.webkit.WebSettings;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        try {
            if (this.bridge != null && this.bridge.getWebView() != null) {
                WebSettings settings = this.bridge.getWebView().getSettings();
                settings.setMediaPlaybackRequiresUserGesture(false);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
`;
  fs.writeFileSync(mainActivityPath, javaCode, 'utf8');
  console.log(`MainActivity.java configured at: ${mainActivityPath}`);
} else {
  console.log('MainActivity.java not found or not created yet.');
}

console.log('--- Android native configuration completed ---');
