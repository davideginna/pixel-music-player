import { EqualizerSettings, Playlist, ThemeMode, Track } from '../types';
import { INITIAL_TRACKS } from './sampleLibrary';

const DB_NAME = 'pixel_music_db';
const DB_VERSION = 1;

class StorageService {
  private db: IDBDatabase | null = null;
  private isOpening = false;

  private async openDB(): Promise<IDBDatabase> {
    if (this.db) return this.db;

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains('tracks')) {
          db.createObjectStore('tracks', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('playlists')) {
          db.createObjectStore('playlists', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('settings')) {
          db.createObjectStore('settings', { keyPath: 'key' });
        }
      };

      request.onsuccess = () => {
        this.db = request.result;
        resolve(this.db);
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  }

  public async getTracks(): Promise<Track[]> {
    try {
      const db = await this.openDB();
      return new Promise((resolve) => {
        const tx = db.transaction('tracks', 'readonly');
        const store = tx.objectStore('tracks');
        const req = store.getAll();
        req.onsuccess = () => {
          const result = req.result as Track[];
          if (!result || result.length === 0) {
            // Seed initial tracks
            this.saveTracks(INITIAL_TRACKS);
            resolve(INITIAL_TRACKS);
          } else {
            resolve(result);
          }
        };
        req.onerror = () => resolve(INITIAL_TRACKS);
      });
    } catch {
      return INITIAL_TRACKS;
    }
  }

  public async saveTracks(tracks: Track[]): Promise<void> {
    try {
      const db = await this.openDB();
      const tx = db.transaction('tracks', 'readwrite');
      const store = tx.objectStore('tracks');
      tracks.forEach((track) => store.put(track));
    } catch (e) {
      console.warn('Storage error on saveTracks', e);
    }
  }

  public async updateTrack(track: Track): Promise<void> {
    try {
      const db = await this.openDB();
      const tx = db.transaction('tracks', 'readwrite');
      const store = tx.objectStore('tracks');
      store.put(track);
    } catch (e) {
      console.warn('Storage error on updateTrack', e);
    }
  }

  public async deleteTrack(id: string): Promise<void> {
    try {
      const db = await this.openDB();
      const tx = db.transaction('tracks', 'readwrite');
      const store = tx.objectStore('tracks');
      store.delete(id);
    } catch (e) {
      console.warn('Storage error on deleteTrack', e);
    }
  }

  public async getPlaylists(): Promise<Playlist[]> {
    const defaultPlaylists: Playlist[] = [
      {
        id: 'pl-favorites',
        title: 'I tuoi Preferiti',
        description: 'Tutti i brani a cui hai lasciato un cuore',
        coverUrl: INITIAL_TRACKS[0].coverUrl,
        trackIds: ['track-1', 'track-2', 'track-4', 'track-5'],
        createdAt: Date.now() - 86400000 * 10,
        updatedAt: Date.now(),
      },
      {
        id: 'pl-pixel-chill',
        title: 'Pixel Focus & Chill',
        description: 'Musica lo-fi ed elettronica per concentrarsi',
        coverUrl: INITIAL_TRACKS[1].coverUrl,
        trackIds: ['track-1', 'track-2', 'track-6'],
        createdAt: Date.now() - 86400000 * 5,
        updatedAt: Date.now(),
      },
    ];

    try {
      const db = await this.openDB();
      return new Promise((resolve) => {
        const tx = db.transaction('playlists', 'readonly');
        const store = tx.objectStore('playlists');
        const req = store.getAll();
        req.onsuccess = () => {
          const result = req.result as Playlist[];
          if (!result || result.length === 0) {
            this.savePlaylists(defaultPlaylists);
            resolve(defaultPlaylists);
          } else {
            resolve(result);
          }
        };
        req.onerror = () => resolve(defaultPlaylists);
      });
    } catch {
      return defaultPlaylists;
    }
  }

  public async savePlaylists(playlists: Playlist[]): Promise<void> {
    try {
      const db = await this.openDB();
      const tx = db.transaction('playlists', 'readwrite');
      const store = tx.objectStore('playlists');
      playlists.forEach((pl) => store.put(pl));
    } catch (e) {
      console.warn('Storage error on savePlaylists', e);
    }
  }

  public async savePlaylist(playlist: Playlist): Promise<void> {
    try {
      const db = await this.openDB();
      const tx = db.transaction('playlists', 'readwrite');
      const store = tx.objectStore('playlists');
      store.put(playlist);
    } catch (e) {
      console.warn('Storage error on savePlaylist', e);
    }
  }

  public async deletePlaylist(id: string): Promise<void> {
    try {
      const db = await this.openDB();
      const tx = db.transaction('playlists', 'readwrite');
      const store = tx.objectStore('playlists');
      store.delete(id);
    } catch (e) {
      console.warn('Storage error on deletePlaylist', e);
    }
  }

  public getSettings<T>(key: string, defaultValue: T): T {
    try {
      const item = localStorage.getItem(`pixel_music_${key}`);
      return item ? (JSON.parse(item) as T) : defaultValue;
    } catch {
      return defaultValue;
    }
  }

  public saveSettings<T>(key: string, value: T): void {
    try {
      localStorage.setItem(`pixel_music_${key}`, JSON.stringify(value));
    } catch (e) {
      console.warn('LocalStorage save error', e);
    }
  }
}

export const storage = new StorageService();
