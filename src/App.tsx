/**
 * Pixel Music Player (com.pixel.musicplayer)
 * Android 13+ / Pixel 11 UI with Material You, Dynamic Color, and MediaSession
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { AnimatePresence } from 'motion/react';
import {
  DynamicPalette,
  EqualizerSettings,
  NavigationTab,
  Playlist,
  RepeatMode,
  ThemeMode,
  Track,
} from './types';
import { audioEngine } from './services/audioEngine';
import { storage } from './services/storage';
import { extractPaletteFromImageUrl, getEffectivePalette } from './services/dynamicColor';
import { INITIAL_TRACKS } from './services/sampleLibrary';

import { AndroidStatusBar } from './components/AndroidStatusBar';
import { AndroidGestureBar } from './components/AndroidGestureBar';
import { AndroidLockscreenModal } from './components/AndroidLockscreenModal';
import { NavigationBar } from './components/NavigationBar';
import { MiniPlayer } from './components/MiniPlayer';
import { FullPlayerModal } from './components/FullPlayerModal';
import { HomeTab } from './components/HomeTab';
import { LibraryTab } from './components/LibraryTab';
import { SearchTab } from './components/SearchTab';
import { SettingsTab } from './components/SettingsTab';
import { TrackInfoModal } from './components/TrackInfoModal';
import { FolderScannerModal } from './components/FolderScannerModal';
import { PlaylistModal } from './components/PlaylistModal';
import { PixelDeviceFrame } from './components/PixelDeviceFrame';
import { ConfirmDialog } from './components/ConfirmDialog';
import { Toast, ToastData } from './components/Toast';

export default function App() {
  // Persistence state
  const [tracks, setTracks] = useState<Track[]>(INITIAL_TRACKS);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [currentTab, setCurrentTab] = useState<NavigationTab>('home');
  const [toast, setToast] = useState<ToastData | null>(null);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  // Playback state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(180);
  const [volume, setVolume] = useState(1);
  const [isShuffle, setIsShuffle] = useState(false);
  const [repeatMode, setRepeatMode] = useState<RepeatMode>('off');
  const [currentTrackId, setCurrentTrackId] = useState<string | null>('track-1');
  const [queue, setQueue] = useState<string[]>(INITIAL_TRACKS.map((t) => t.id));
  const [audioOutputRoute, setAudioOutputRoute] = useState<'speaker' | 'pixel_buds' | 'headphones'>('pixel_buds');

  // Theme & Appearance
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => storage.getSettings('theme_mode', 'system'));
  const [paletteId, setPaletteId] = useState<string>(() => storage.getSettings('palette_id', 'geometric_balance'));
  const [extractedPalette, setExtractedPalette] = useState<DynamicPalette | null>(null);

  // Equalizer
  const [equalizerSettings, setEqualizerSettings] = useState<EqualizerSettings>(() =>
    storage.getSettings('equalizer', {
      enabled: true,
      preset: 'flat',
      bands: [0, 0, 0, 0, 0],
      bassBoost: 20,
    })
  );

  // Pixel Hardware & UX simulation
  const [showPixelFrame, setShowPixelFrame] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth > 768;
    }
    return false;
  });
  const [hapticsEnabled, setHapticsEnabled] = useState(true);

  // Modals & Drawers
  const [isFullPlayerOpen, setIsFullPlayerOpen] = useState(false);
  const [isLockscreenOpen, setIsLockscreenOpen] = useState(false);
  const [isFolderScannerOpen, setIsFolderScannerOpen] = useState(false);
  const [playlistModalTarget, setPlaylistModalTarget] = useState<Playlist | null>(null);
  const [isPlaylistModalOpen, setIsPlaylistModalOpen] = useState(false);
  const [trackInfoTarget, setTrackInfoTarget] = useState<Track | null>(null);

  // Compute active dynamic palette
  const activePalette = useMemo(() => {
    return getEffectivePalette(paletteId, themeMode, extractedPalette || undefined);
  }, [paletteId, themeMode, extractedPalette]);

  // Current active track
  const currentTrack = useMemo(() => {
    return tracks.find((t) => t.id === currentTrackId) || tracks[0] || null;
  }, [tracks, currentTrackId]);

  // Haptic feedback simulator
  const triggerHaptic = useCallback(() => {
    if (!hapticsEnabled) return;
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(10);
      } catch {
        // ignore
      }
    }
  }, [hapticsEnabled]);

  // Load saved data on startup
  useEffect(() => {
    async function loadData() {
      const storedTracks = await storage.getTracks();
      if (storedTracks && storedTracks.length > 0) {
        setTracks(storedTracks);
        setQueue(storedTracks.map((t) => t.id));
        setCurrentTrackId(storedTracks[0].id);
      }
      const storedPlaylists = await storage.getPlaylists();
      setPlaylists(storedPlaylists);
    }
    loadData();
  }, []);

  // Update theme color meta tag to match dynamic color
  useEffect(() => {
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
      meta.setAttribute('content', activePalette.surface);
    }
  }, [activePalette]);

  // Extract dynamic color from album art whenever current track changes
  useEffect(() => {
    if (!currentTrack) return;

    const isDark =
      themeMode === 'dark' ||
      (themeMode === 'system' &&
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-color-scheme: dark)').matches);

    extractPaletteFromImageUrl(currentTrack.coverUrl, isDark).then((pal) => {
      if (pal) setExtractedPalette(pal);
    });
  }, [currentTrack, themeMode]);

  // Apply equalizer to AudioEngine whenever settings change
  useEffect(() => {
    audioEngine.applyEqualizer(equalizerSettings);
    storage.saveSettings('equalizer', equalizerSettings);
  }, [equalizerSettings]);

  // Next Track Logic
  const handleNextTrack = useCallback(() => {
    triggerHaptic();
    if (queue.length === 0) return;

    if (repeatMode === 'one' && currentTrack) {
      audioEngine.playTrack(currentTrack, 0);
      return;
    }

    const currentIndex = queue.indexOf(currentTrackId || '');
    let nextIndex = 0;

    if (isShuffle) {
      nextIndex = Math.floor(Math.random() * queue.length);
    } else if (currentIndex >= 0 && currentIndex < queue.length - 1) {
      nextIndex = currentIndex + 1;
    } else if (repeatMode === 'all') {
      nextIndex = 0;
    } else {
      // End of queue
      setIsPlaying(false);
      return;
    }

    const nextTrackId = queue[nextIndex];
    const nextTrack = tracks.find((t) => t.id === nextTrackId);
    if (nextTrack) {
      setCurrentTrackId(nextTrackId);
      audioEngine.playTrack(nextTrack, 0);
      setIsPlaying(true);
      // Increment play count
      const updated = { ...nextTrack, playCount: nextTrack.playCount + 1, lastPlayed: Date.now() };
      storage.updateTrack(updated);
      setTracks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
    }
  }, [queue, currentTrackId, isShuffle, repeatMode, currentTrack, tracks, triggerHaptic]);

  // Previous Track Logic
  const handlePrevTrack = useCallback(() => {
    triggerHaptic();
    if (queue.length === 0) return;

    // If more than 3 seconds in, restart current track
    if (currentTime > 3 && currentTrack) {
      audioEngine.seek(0);
      setCurrentTime(0);
      return;
    }

    const currentIndex = queue.indexOf(currentTrackId || '');
    const prevIndex = currentIndex > 0 ? currentIndex - 1 : queue.length - 1;
    const prevTrackId = queue[prevIndex];
    const prevTrack = tracks.find((t) => t.id === prevTrackId);

    if (prevTrack) {
      setCurrentTrackId(prevTrackId);
      audioEngine.playTrack(prevTrack, 0);
      setIsPlaying(true);
    }
  }, [queue, currentTime, currentTrack, currentTrackId, tracks, triggerHaptic]);

  // Setup AudioEngine callbacks
  useEffect(() => {
    audioEngine.setCallbacks({
      onTimeUpdate: (time, dur) => {
        setCurrentTime(time);
        if (dur > 0) setDuration(dur);
      },
      onEnded: () => {
        handleNextTrack();
      },
      onPlayPause: (playing) => {
        setIsPlaying(playing);
      },
      onTrackChangeRequest: (direction) => {
        if (direction === 'next') handleNextTrack();
        else handlePrevTrack();
      },
    });
  }, [handleNextTrack, handlePrevTrack]);

  // Select and Play a specific Track
  const handleSelectTrack = useCallback((track: Track) => {
    triggerHaptic();
    setCurrentTrackId(track.id);
    // Ensure track is in queue
    if (!queue.includes(track.id)) {
      setQueue((prev) => [track.id, ...prev]);
    }
    audioEngine.playTrack(track, 0);
    setIsPlaying(true);

    const updated = { ...track, playCount: track.playCount + 1, lastPlayed: Date.now() };
    storage.updateTrack(updated);
    setTracks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
  }, [queue, triggerHaptic]);

  // Toggle Play / Pause
  const handleTogglePlay = useCallback((e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    triggerHaptic();
    if (!currentTrack) return;
    audioEngine.togglePlay(isPlaying, currentTrack);
  }, [currentTrack, isPlaying, triggerHaptic]);

  // Seek
  const handleSeek = useCallback((time: number) => {
    setCurrentTime(time);
    audioEngine.seek(time);
  }, []);

  // Shuffle All
  const handleShuffleAll = useCallback(() => {
    triggerHaptic();
    if (tracks.length === 0) return;
    const shuffled = [...tracks].sort(() => Math.random() - 0.5);
    setQueue(shuffled.map((t) => t.id));
    setIsShuffle(true);
    handleSelectTrack(shuffled[0]);
  }, [tracks, handleSelectTrack, triggerHaptic]);

  // Toggle Favorite
  const handleToggleFavorite = useCallback((trackId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    triggerHaptic();
    setTracks((prev) =>
      prev.map((t) => {
        if (t.id === trackId) {
          const updated = { ...t, isFavorite: !t.isFavorite };
          storage.updateTrack(updated);
          return updated;
        }
        return t;
      })
    );
  }, [triggerHaptic]);

  // Delete Track with undo and playlist cleanup
  const handleDeleteTrack = useCallback((trackId: string) => {
    triggerHaptic();
    const trackToDelete = tracks.find((t) => t.id === trackId);
    storage.deleteTrack(trackId);

    // Remove from tracks and queue
    const remainingTracks = tracks.filter((t) => t.id !== trackId);
    setTracks(remainingTracks);
    setQueue((prev) => prev.filter((id) => id !== trackId));

    // Remove from all playlists and persist
    setPlaylists((prev) => {
      const updated = prev.map((pl) => ({
        ...pl,
        trackIds: pl.trackIds.filter((id) => id !== trackId),
      }));
      storage.savePlaylists(updated);
      return updated;
    });

    // If deleting currently playing track
    if (currentTrackId === trackId) {
      if (remainingTracks.length > 0) {
        handleNextTrack();
      } else {
        audioEngine.pause();
        setIsPlaying(false);
        setCurrentTrackId(null);
        setCurrentTime(0);
      }
    }

    if (trackToDelete) {
      setToast({
        message: `"${trackToDelete.title}" rimosso`,
        actionLabel: 'Annulla',
        onAction: () => {
          storage.saveTracks([trackToDelete]);
          setTracks((prev) => [trackToDelete, ...prev]);
          setQueue((prev) => [...prev, trackToDelete.id]);
        },
      });
    }
  }, [currentTrackId, handleNextTrack, tracks, triggerHaptic]);

  // Batch Delete Tracks
  const handleDeleteTracks = useCallback((trackIds: string[]) => {
    triggerHaptic();
    const tracksToRemove = tracks.filter((t) => trackIds.includes(t.id));
    const idsSet = new Set(trackIds);

    storage.deleteTracks(trackIds);
    setTracks((prev) => prev.filter((t) => !idsSet.has(t.id)));
    setQueue((prev) => prev.filter((id) => !idsSet.has(id)));

    if (currentTrackId && idsSet.has(currentTrackId)) {
      handleNextTrack();
      if (tracks.length <= trackIds.length) {
        audioEngine.pause();
        setIsPlaying(false);
        setCurrentTrackId(null);
        setCurrentTime(0);
      }
    }

    setToast({
      message: `${trackIds.length} ${trackIds.length === 1 ? 'brano rimosso' : 'brani rimossi'} dalla libreria`,
      actionLabel: 'Annulla',
      onAction: () => {
        storage.saveTracks(tracksToRemove);
        setTracks((prev) => [...tracksToRemove, ...prev]);
        setQueue((prev) => [...prev, ...tracksToRemove.map((t) => t.id)]);
      },
    });
  }, [currentTrackId, handleNextTrack, tracks, triggerHaptic]);

  // Add Track to Queue
  const handleAddToQueue = useCallback((track: Track) => {
    triggerHaptic();
    setQueue((prev) => [...prev, track.id]);
    setToast({
      message: `"${track.title}" aggiunto alla coda`,
    });
  }, [triggerHaptic]);

  // Batch Add Tracks to Queue
  const handleAddTracksToQueue = useCallback((tracksToAdd: Track[]) => {
    triggerHaptic();
    const newIds = tracksToAdd.map((t) => t.id);
    setQueue((prev) => [...prev, ...newIds]);
    setToast({
      message: `${tracksToAdd.length} ${tracksToAdd.length === 1 ? 'brano aggiunto' : 'brani aggiunti'} alla coda`,
    });
  }, [triggerHaptic]);

  // Batch Toggle Favorites
  const handleBatchToggleFavorite = useCallback((trackIds: string[]) => {
    triggerHaptic();
    const idsSet = new Set(trackIds);
    const someNotFavorite = tracks.some((t) => idsSet.has(t.id) && !t.isFavorite);
    const targetState = someNotFavorite;

    setTracks((prev) =>
      prev.map((t) => {
        if (idsSet.has(t.id)) {
          const updated = { ...t, isFavorite: targetState };
          storage.updateTrack(updated);
          return updated;
        }
        return t;
      })
    );

    setToast({
      message: `${trackIds.length} ${trackIds.length === 1 ? 'brano' : 'brani'} ${targetState ? 'aggiunti ai preferiti' : 'rimossi dai preferiti'}`,
    });
  }, [tracks, triggerHaptic]);

  // Remove Track from Queue
  const handleRemoveFromQueue = useCallback((trackId: string) => {
    triggerHaptic();
    setQueue((prev) => prev.filter((id) => id !== trackId));
  }, [triggerHaptic]);

  // Clear Queue
  const handleClearQueue = useCallback(() => {
    triggerHaptic();
    if (currentTrackId) {
      setQueue([currentTrackId]);
    } else {
      setQueue([]);
    }
  }, [currentTrackId, triggerHaptic]);

  // Play whole playlist
  const handlePlayPlaylist = useCallback((playlist: Playlist) => {
    triggerHaptic();
    if (playlist.trackIds.length === 0) return;
    setQueue(playlist.trackIds);
    const firstTrack = tracks.find((t) => t.id === playlist.trackIds[0]);
    if (firstTrack) {
      handleSelectTrack(firstTrack);
    }
  }, [tracks, handleSelectTrack, triggerHaptic]);

  // Save Playlist
  const handleSavePlaylist = useCallback((playlist: Playlist) => {
    storage.savePlaylist(playlist);
    setPlaylists((prev) => {
      const idx = prev.findIndex((p) => p.id === playlist.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = playlist;
        return next;
      }
      return [...prev, playlist];
    });
  }, []);

  // Delete Playlist with undo
  const handleDeletePlaylist = useCallback((id: string) => {
    triggerHaptic();
    const plToDelete = playlists.find((p) => p.id === id);
    storage.deletePlaylist(id);
    setPlaylists((prev) => prev.filter((p) => p.id !== id));
    if (plToDelete) {
      setToast({
        message: `Playlist "${plToDelete.title}" eliminata`,
        actionLabel: 'Annulla',
        onAction: () => {
          storage.savePlaylist(plToDelete);
          setPlaylists((prev) => [...prev, plToDelete]);
        },
      });
    }
  }, [playlists, triggerHaptic]);

  // Imported tracks handler
  const handleTracksImported = useCallback((newTracks: Track[]) => {
    storage.saveTracks(newTracks);
    setTracks((prev) => [...newTracks, ...prev]);
    setQueue((prev) => [...newTracks.map((t) => t.id), ...prev]);
    if (newTracks.length > 0) {
      handleSelectTrack(newTracks[0]);
    }
    setToast({
      message: `${newTracks.length} brani importati nella libreria`,
    });
  }, [handleSelectTrack]);

  // Reset library to default (invoked via confirm dialog)
  const handleConfirmResetLibrary = useCallback(() => {
    localStorage.removeItem('pixel_music_tracks_seeded');
    localStorage.removeItem('pixel_music_playlists_seeded');
    storage.saveTracks(INITIAL_TRACKS);
    setTracks(INITIAL_TRACKS);
    setQueue(INITIAL_TRACKS.map((t) => t.id));
    setCurrentTrackId(INITIAL_TRACKS[0].id);
    audioEngine.playTrack(INITIAL_TRACKS[0], 0);
    setIsPlaying(true);
    setToast({
      message: 'Libreria musicale ripristinata ai valori iniziali',
    });
  }, []);

  // Theme handlers
  const handleChangeThemeMode = (mode: ThemeMode) => {
    triggerHaptic();
    setThemeMode(mode);
    storage.saveSettings('theme_mode', mode);
  };

  const handleChangePaletteId = (id: string) => {
    triggerHaptic();
    setPaletteId(id);
    storage.saveSettings('palette_id', id);
  };

  // Approximate storage calculation
  const totalSizeMb = useMemo(() => {
    const total = tracks.reduce((acc, t) => {
      const mb = parseFloat(t.fileSize || '4.5');
      return acc + (isNaN(mb) ? 4.5 : mb);
    }, 0);
    return total.toFixed(1);
  }, [tracks]);

  return (
    <PixelDeviceFrame
      showFrame={showPixelFrame}
      palette={activePalette}
      currentTrack={currentTrack}
      isPlaying={isPlaying}
      currentTime={currentTime}
      duration={duration}
      isShuffle={isShuffle}
      repeatMode={repeatMode}
      onTogglePlay={handleTogglePlay}
      onNext={handleNextTrack}
      onPrev={handlePrevTrack}
      onSeek={handleSeek}
      onToggleShuffle={() => {
        triggerHaptic();
        setIsShuffle(!isShuffle);
      }}
      onToggleRepeat={() => {
        triggerHaptic();
        setRepeatMode((prev) => (prev === 'off' ? 'all' : prev === 'all' ? 'one' : 'off'));
      }}
      onToggleFavorite={handleToggleFavorite}
      onOpenFullPlayer={() => setIsFullPlayerOpen(true)}
    >
      {/* Edge-to-Edge Android 13+ Status Bar */}
      <AndroidStatusBar
        palette={activePalette}
        isPlaying={isPlaying}
        onOpenNotificationPanel={() => setIsLockscreenOpen(true)}
      />

      {/* Main Tab View */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {currentTab === 'home' && (
          <HomeTab
            tracks={tracks}
            palette={activePalette}
            currentTrackId={currentTrackId}
            isPlaying={isPlaying}
            onSelectTrack={handleSelectTrack}
            onShuffleAll={handleShuffleAll}
            onNavigateToSearch={() => setCurrentTab('search')}
            onOpenFolderScanner={() => setIsFolderScannerOpen(true)}
            onToggleFavorite={handleToggleFavorite}
          />
        )}

        {currentTab === 'library' && (
          <LibraryTab
            tracks={tracks}
            playlists={playlists}
            palette={activePalette}
            currentTrackId={currentTrackId}
            isPlaying={isPlaying}
            onSelectTrack={handleSelectTrack}
            onAddToQueue={handleAddToQueue}
            onToggleFavorite={handleToggleFavorite}
            onDeleteTrack={handleDeleteTrack}
            onDeleteTracks={handleDeleteTracks}
            onAddTracksToQueue={handleAddTracksToQueue}
            onBatchToggleFavorite={handleBatchToggleFavorite}
            onDeletePlaylist={handleDeletePlaylist}
            onOpenFolderScanner={() => setIsFolderScannerOpen(true)}
            onCreatePlaylist={() => {
              setPlaylistModalTarget(null);
              setIsPlaylistModalOpen(true);
            }}
            onSelectPlaylist={(pl) => {
              setPlaylistModalTarget(pl);
              setIsPlaylistModalOpen(true);
            }}
            onShowTrackInfo={(t) => setTrackInfoTarget(t)}
          />
        )}

        {currentTab === 'search' && (
          <SearchTab
            tracks={tracks}
            palette={activePalette}
            currentTrackId={currentTrackId}
            isPlaying={isPlaying}
            onSelectTrack={handleSelectTrack}
            onToggleFavorite={handleToggleFavorite}
          />
        )}

        {currentTab === 'settings' && (
          <SettingsTab
            themeMode={themeMode}
            paletteId={paletteId}
            palette={activePalette}
            showPixelFrame={showPixelFrame}
            hapticsEnabled={hapticsEnabled}
            equalizerSettings={equalizerSettings}
            tracksCount={tracks.length}
            totalSizeMb={totalSizeMb}
            onChangeThemeMode={handleChangeThemeMode}
            onChangePaletteId={handleChangePaletteId}
            onTogglePixelFrame={() => setShowPixelFrame(!showPixelFrame)}
            onToggleHaptics={() => setHapticsEnabled(!hapticsEnabled)}
            onOpenEqualizer={() => setIsFullPlayerOpen(true)}
            onOpenFolderScanner={() => setIsFolderScannerOpen(true)}
            onOpenLockscreenPreview={() => setIsLockscreenOpen(true)}
            onResetLibrary={() => setIsResetConfirmOpen(true)}
          />
        )}
      </main>

      {/* Floating Pixel Mini Player (above bottom nav bar) */}
      <AnimatePresence>
        {currentTrack && !isFullPlayerOpen && (
          <MiniPlayer
            currentTrack={currentTrack}
            isPlaying={isPlaying}
            currentTime={currentTime}
            duration={duration}
            palette={activePalette}
            onOpenFullPlayer={() => {
              triggerHaptic();
              setIsFullPlayerOpen(true);
            }}
            onTogglePlay={handleTogglePlay}
            onNext={(e) => {
              e.stopPropagation();
              handleNextTrack();
            }}
            onToggleFavorite={handleToggleFavorite}
          />
        )}
      </AnimatePresence>

      {/* Material 3 Bottom Navigation Bar */}
      <NavigationBar
        currentTab={currentTab}
        onTabChange={(tab) => {
          triggerHaptic();
          setCurrentTab(tab);
        }}
        palette={activePalette}
      />

      {/* Android 13+ Gesture Navigation Pill */}
      <AndroidGestureBar
        palette={activePalette}
        onHomeClick={() => {
          triggerHaptic();
          setCurrentTab('home');
        }}
      />

      {/* Modals and Drawers */}

      {/* 1. Full Player Modal */}
      <FullPlayerModal
        isOpen={isFullPlayerOpen}
        onClose={() => setIsFullPlayerOpen(false)}
        track={currentTrack}
        isPlaying={isPlaying}
        currentTime={currentTime}
        duration={duration}
        isShuffle={isShuffle}
        repeatMode={repeatMode}
        queue={queue}
        allTracks={tracks}
        palette={activePalette}
        equalizerSettings={equalizerSettings}
        audioOutputRoute={audioOutputRoute}
        onTogglePlay={handleTogglePlay}
        onNext={handleNextTrack}
        onPrev={handlePrevTrack}
        onSeek={handleSeek}
        onToggleShuffle={() => {
          triggerHaptic();
          setIsShuffle(!isShuffle);
        }}
        onToggleRepeat={() => {
          triggerHaptic();
          setRepeatMode((prev) => (prev === 'off' ? 'all' : prev === 'all' ? 'one' : 'off'));
        }}
        onToggleFavorite={handleToggleFavorite}
        onSelectTrack={handleSelectTrack}
        onRemoveFromQueue={handleRemoveFromQueue}
        onClearQueue={handleClearQueue}
        onUpdateEqualizer={setEqualizerSettings}
        onChangeAudioOutputRoute={setAudioOutputRoute}
      />

      {/* 2. Android Lockscreen & Media Notification Preview */}
      <AndroidLockscreenModal
        isOpen={isLockscreenOpen}
        onClose={() => setIsLockscreenOpen(false)}
        currentTrack={currentTrack}
        isPlaying={isPlaying}
        currentTime={currentTime}
        duration={duration}
        palette={activePalette}
        onTogglePlay={handleTogglePlay}
        onNext={handleNextTrack}
        onPrev={handlePrevTrack}
        onSeek={handleSeek}
        onToggleFavorite={handleToggleFavorite}
      />

      {/* 3. Folder Scanner & Import Modal */}
      <FolderScannerModal
        isOpen={isFolderScannerOpen}
        onClose={() => setIsFolderScannerOpen(false)}
        onTracksImported={handleTracksImported}
        palette={activePalette}
      />

      {/* 4. Playlist Creator & Detail Modal */}
      <PlaylistModal
        playlist={playlistModalTarget}
        isOpen={isPlaylistModalOpen}
        onClose={() => {
          setIsPlaylistModalOpen(false);
          setPlaylistModalTarget(null);
        }}
        allTracks={tracks}
        palette={activePalette}
        onPlayPlaylist={handlePlayPlaylist}
        onSavePlaylist={handleSavePlaylist}
        onDeletePlaylist={handleDeletePlaylist}
      />

      {/* 5. Track Information & Metadata Details Modal */}
      <TrackInfoModal
        track={trackInfoTarget}
        isOpen={trackInfoTarget !== null}
        onClose={() => setTrackInfoTarget(null)}
        onAddToQueue={handleAddToQueue}
        onToggleFavorite={handleToggleFavorite}
        onDeleteTrack={handleDeleteTrack}
        palette={activePalette}
      />

      {/* 6. Confirm Dialog: Reset Library */}
      <ConfirmDialog
        isOpen={isResetConfirmOpen}
        title="Ripristinare libreria?"
        description="Vuoi ripristinare la libreria iniziale di brani demo Pixel? Tutti i file importati e le playlist create manualmente verranno rimossi."
        confirmLabel="Ripristina"
        cancelLabel="Annulla"
        isDestructive={true}
        onConfirm={() => {
          handleConfirmResetLibrary();
          setIsResetConfirmOpen(false);
        }}
        onClose={() => setIsResetConfirmOpen(false)}
        palette={activePalette}
      />

      {/* 7. Floating Material 3 Toast / Snackbar */}
      <Toast
        toast={toast}
        onDismiss={() => setToast(null)}
        palette={activePalette}
      />
    </PixelDeviceFrame>
  );
}
