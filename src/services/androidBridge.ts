import { Capacitor } from '@capacitor/core';
import { LocalNotifications } from '@capacitor/local-notifications';
import { Track } from '../types';

export const ANDROID_CHANNEL_ID = 'pixel_music_playback';

export class AndroidBridgeService {
  private static instance: AndroidBridgeService;
  private channelCreated = false;
  private hasPermission = false;

  public static getInstance(): AndroidBridgeService {
    if (!AndroidBridgeService.instance) {
      AndroidBridgeService.instance = new AndroidBridgeService();
    }
    return AndroidBridgeService.instance;
  }

  public isNative(): boolean {
    return Capacitor.isNativePlatform();
  }

  /**
   * Initializes notification permissions and creates the Android 13+ Notification Channel.
   * This is what turns "L'app non manda notifiche" into "Notifiche consentite" on Android.
   */
  public async initPermissions(promptIfDefault = true): Promise<boolean> {
    if (this.isNative()) {
      try {
        const check = await LocalNotifications.checkPermissions();
        if (check.display === 'granted') {
          this.hasPermission = true;
        } else if (promptIfDefault) {
          const req = await LocalNotifications.requestPermissions();
          this.hasPermission = req.display === 'granted';
        }

        // Create the public notification channel for lockscreen visibility
        await this.ensureNotificationChannel();
        return this.hasPermission;
      } catch (err) {
        console.warn('AndroidBridge: error requesting Capacitor permissions', err);
        return false;
      }
    } else if (typeof Notification !== 'undefined') {
      if (Notification.permission === 'granted') {
        this.hasPermission = true;
        return true;
      }
      if (promptIfDefault && Notification.permission === 'default') {
        try {
          const result = await Notification.requestPermission();
          this.hasPermission = result === 'granted';
          return this.hasPermission;
        } catch {
          return false;
        }
      }
    }
    return false;
  }

  public async ensureNotificationChannel() {
    if (!this.isNative() || this.channelCreated) return;
    try {
      await LocalNotifications.createChannel({
        id: ANDROID_CHANNEL_ID,
        name: 'Riproduzione Musicale',
        description: 'Controlli per la schermata di blocco e la barra delle notifiche',
        importance: 4, // IMPORTANCE_HIGH (Shows on lockscreen & alert)
        visibility: 1, // VISIBILITY_PUBLIC (Shows on Lock Screen)
        vibration: false,
        lights: false,
      });
      this.channelCreated = true;
    } catch (err) {
      console.warn('AndroidBridge: failed to create channel', err);
    }
  }

  /**
   * Updates or posts native Android ongoing notification for the active track.
   */
  public async syncPlaybackNotification(track: Track | null, isPlaying: boolean) {
    if (!this.isNative() || !track) return;

    try {
      if (isPlaying) {
        await this.ensureNotificationChannel();
        await LocalNotifications.schedule({
          notifications: [
            {
              id: 9999,
              title: track.title,
              body: `${track.artist} • Pixel Music`,
              channelId: ANDROID_CHANNEL_ID,
              ongoing: true, // Cannot be dismissed while playing
              autoCancel: false,
              smallIcon: 'ic_stat_icon_config_sample',
              extra: {
                trackId: track.id,
              },
            },
          ],
        });
      } else {
        await LocalNotifications.cancel({
          notifications: [{ id: 9999 }],
        });
      }
    } catch (err) {
      console.warn('AndroidBridge: error updating notification', err);
    }
  }

  public async getPermissionStatus(): Promise<'granted' | 'denied' | 'prompt'> {
    if (this.isNative()) {
      try {
        const check = await LocalNotifications.checkPermissions();
        if (check.display === 'granted') return 'granted';
        if (check.display === 'denied') return 'denied';
        return 'prompt';
      } catch {
        return 'denied';
      }
    } else if (typeof Notification !== 'undefined') {
      if (Notification.permission === 'granted') return 'granted';
      if (Notification.permission === 'denied') return 'denied';
      return 'prompt';
    }
    return 'granted';
  }
}

export const androidBridge = AndroidBridgeService.getInstance();
