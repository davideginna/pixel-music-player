export interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number; // in seconds
  genre: string;
  year?: number;
  trackNumber?: number;
  coverUrl: string;
  audioUrl?: string; // object URL or synthesized or stream
  audioBlob?: Blob; // raw Blob stored in IndexedDB for permanent local playback
  filePath?: string;
  folderName?: string;
  fileSize?: string;
  format?: string;
  bitrate?: string;
  playCount: number;
  lastPlayed?: number; // timestamp
  dateAdded: number; // timestamp
  isFavorite: boolean;
  lyrics?: string;
  palette?: {
    dominant: string;
    accent: string;
    container: string;
    onContainer: string;
  };
}

export interface Album {
  id: string;
  title: string;
  artist: string;
  coverUrl: string;
  year?: number;
  trackCount: number;
  duration: number;
  trackIds: string[];
}

export interface Artist {
  id: string;
  name: string;
  coverUrl: string;
  trackCount: number;
  albumCount: number;
  trackIds: string[];
}

export interface Playlist {
  id: string;
  title: string;
  description?: string;
  coverUrl?: string;
  trackIds: string[];
  createdAt: number;
  updatedAt: number;
}

export type ThemeMode = 'system' | 'light' | 'dark';

export interface DynamicPalette {
  id: string;
  name: string;
  colorName: string;
  primary: string;
  onPrimary: string;
  primaryContainer: string;
  onPrimaryContainer: string;
  secondary: string;
  secondaryContainer: string;
  onSecondaryContainer: string;
  tertiary: string;
  surface: string;
  surfaceVariant: string;
  surfaceContainer: string;
  surfaceContainerHigh: string;
  onSurface: string;
  onSurfaceVariant: string;
  outline: string;
  outlineVariant: string;
}

export type RepeatMode = 'off' | 'all' | 'one';

export interface PlaybackState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  isShuffle: boolean;
  repeatMode: RepeatMode;
  currentTrackId: string | null;
  queue: string[]; // array of track IDs
  queueIndex: number;
  playbackRate: number;
  audioOutputRoute: 'speaker' | 'pixel_buds' | 'headphones';
}

export type NavigationTab = 'home' | 'library' | 'search' | 'settings';

export type LibrarySubTab = 'songs' | 'albums' | 'artists' | 'genres' | 'folders' | 'favorites' | 'playlists';

export type LibrarySortBy = 'title' | 'artist' | 'duration' | 'playCount' | 'dateAdded';
export type LibrarySortOrder = 'asc' | 'desc';

export type EqualizerPreset = 'flat' | 'bass-boost' | 'vocal' | 'rock' | 'pop' | 'electronic';

export interface EqualizerSettings {
  enabled: boolean;
  preset: EqualizerPreset;
  bands: [number, number, number, number, number]; // 60Hz, 230Hz, 910Hz, 3.6kHz, 14kHz (-12 to +12 dB)
  bassBoost: number; // 0 to 100
}
