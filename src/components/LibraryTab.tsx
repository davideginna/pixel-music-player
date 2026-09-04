import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Music,
  Disc3,
  Users,
  Layers,
  Folder,
  Heart,
  ListMusic,
  ArrowUpDown,
  LayoutGrid,
  List,
  MoreVertical,
  Play,
  Plus,
  FolderPlus,
  Trash2,
  Info,
  Clock,
  ListPlus,
  X,
  Check,
  CheckSquare,
} from 'lucide-react';
import {
  DynamicPalette,
  LibrarySortBy,
  LibrarySortOrder,
  LibrarySubTab,
  Playlist,
  Track,
} from '../types';
import { ConfirmDialog } from './ConfirmDialog';

interface LibraryTabProps {
  tracks: Track[];
  playlists: Playlist[];
  palette: DynamicPalette;
  currentTrackId: string | null;
  isPlaying: boolean;
  onSelectTrack: (track: Track) => void;
  onAddToQueue: (track: Track) => void;
  onToggleFavorite: (trackId: string) => void;
  onDeleteTrack: (trackId: string) => void;
  onDeleteTracks?: (trackIds: string[]) => void;
  onAddTracksToQueue?: (tracks: Track[]) => void;
  onBatchToggleFavorite?: (trackIds: string[]) => void;
  onDeletePlaylist?: (playlistId: string) => void;
  onOpenFolderScanner: () => void;
  onCreatePlaylist: () => void;
  onSelectPlaylist: (playlist: Playlist) => void;
  onShowTrackInfo: (track: Track) => void;
}

export const LibraryTab: React.FC<LibraryTabProps> = ({
  tracks,
  playlists,
  palette,
  currentTrackId,
  isPlaying,
  onSelectTrack,
  onAddToQueue,
  onToggleFavorite,
  onDeleteTrack,
  onDeleteTracks,
  onAddTracksToQueue,
  onBatchToggleFavorite,
  onDeletePlaylist,
  onOpenFolderScanner,
  onCreatePlaylist,
  onSelectPlaylist,
  onShowTrackInfo,
}) => {
  const [subTab, setSubTab] = useState<LibrarySubTab>('songs');
  const [sortBy, setSortBy] = useState<LibrarySortBy>('title');
  const [sortOrder, setSortOrder] = useState<LibrarySortOrder>('asc');
  const [isGridView, setIsGridView] = useState(false);
  const [actionTrack, setActionTrack] = useState<Track | null>(null);
  const [trackToDelete, setTrackToDelete] = useState<Track | null>(null);
  const [playlistToDelete, setPlaylistToDelete] = useState<Playlist | null>(null);

  // Multi-selection state
  const [isMultiSelectMode, setIsMultiSelectMode] = useState(false);
  const [selectedTrackIds, setSelectedTrackIds] = useState<Set<string>>(new Set());
  const [batchConfirmDeleteOpen, setBatchConfirmDeleteOpen] = useState(false);

  // Long press refs
  const longPressTimerRef = React.useRef<number | null>(null);
  const startPosRef = React.useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const didJustLongPressRef = React.useRef<boolean>(false);

  const startLongPress = (track: Track, clientX: number, clientY: number) => {
    if (isMultiSelectMode) return;
    startPosRef.current = { x: clientX, y: clientY };
    didJustLongPressRef.current = false;
    if (longPressTimerRef.current) clearTimeout(longPressTimerRef.current);

    longPressTimerRef.current = window.setTimeout(() => {
      didJustLongPressRef.current = true;
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        try {
          navigator.vibrate(40);
        } catch {
          // ignore
        }
      }
      setIsMultiSelectMode(true);
      setSelectedTrackIds(new Set([track.id]));
    }, 380);
  };

  const moveLongPress = (clientX: number, clientY: number) => {
    if (isMultiSelectMode) return;
    const dx = Math.abs(clientX - startPosRef.current.x);
    const dy = Math.abs(clientY - startPosRef.current.y);
    if (dx > 16 || dy > 16) {
      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current);
        longPressTimerRef.current = null;
      }
    }
  };

  const cancelLongPress = () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  };

  const handlePointerDown = (track: Track, e: React.PointerEvent) => {
    startLongPress(track, e.clientX, e.clientY);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    moveLongPress(e.clientX, e.clientY);
  };

  const handlePointerUp = () => {
    cancelLongPress();
  };

  const handleTouchStart = (track: Track, e: React.TouchEvent) => {
    if (e.touches.length > 0) {
      startLongPress(track, e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length > 0) {
      moveLongPress(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  const handleTouchEnd = () => {
    cancelLongPress();
  };

  const toggleTrackSelection = (trackId: string) => {
    setSelectedTrackIds((prev) => {
      const next = new Set(prev);
      if (next.has(trackId)) {
        next.delete(trackId);
      } else {
        next.add(trackId);
      }
      return next;
    });
  };

  const handleTrackClick = (track: Track) => {
    if (didJustLongPressRef.current) {
      didJustLongPressRef.current = false;
      return;
    }
    if (isMultiSelectMode) {
      toggleTrackSelection(track.id);
    } else {
      onSelectTrack(track);
    }
  };

  // Selected filter (for album/artist drill down)
  const [selectedAlbum, setSelectedAlbum] = useState<string | null>(null);
  const [selectedArtist, setSelectedArtist] = useState<string | null>(null);
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);

  const subTabs: { id: LibrarySubTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'songs', label: 'Brani', icon: Music },
    { id: 'albums', label: 'Album', icon: Disc3 },
    { id: 'artists', label: 'Artisti', icon: Users },
    { id: 'generes', label: 'Generi', icon: Layers } as unknown as { id: LibrarySubTab; label: string; icon: React.ComponentType<{ className?: string }> },
    { id: 'folders', label: 'Cartelle', icon: Folder },
    { id: 'favorites', label: 'Preferiti', icon: Heart },
    { id: 'playlists', label: 'Playlist', icon: ListMusic },
  ];

  // Helper formatting
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  // Groupings
  const albums = useMemo(() => {
    const map = new Map<string, { title: string; artist: string; coverUrl: string; count: number; duration: number }>();
    tracks.forEach((t) => {
      const existing = map.get(t.album);
      if (existing) {
        existing.count += 1;
        existing.duration += t.duration;
      } else {
        map.set(t.album, {
          title: t.album,
          artist: t.artist,
          coverUrl: t.coverUrl,
          count: 1,
          duration: t.duration,
        });
      }
    });
    return Array.from(map.values());
  }, [tracks]);

  const artists = useMemo(() => {
    const map = new Map<string, { name: string; coverUrl: string; count: number }>();
    tracks.forEach((t) => {
      const existing = map.get(t.artist);
      if (existing) {
        existing.count += 1;
      } else {
        map.set(t.artist, {
          name: t.artist,
          coverUrl: t.coverUrl,
          count: 1,
        });
      }
    });
    return Array.from(map.values());
  }, [tracks]);

  const genres = useMemo(() => {
    const map = new Map<string, number>();
    tracks.forEach((t) => {
      map.set(t.genre, (map.get(t.genre) || 0) + 1);
    });
    return Array.from(map.entries()).map(([genre, count]) => ({ genre, count }));
  }, [tracks]);

  const folders = useMemo(() => {
    const map = new Map<string, { name: string; count: number; tracks: Track[] }>();
    tracks.forEach((t) => {
      const fName = t.folderName || 'Root';
      const existing = map.get(fName);
      if (existing) {
        existing.count += 1;
        existing.tracks.push(t);
      } else {
        map.set(fName, {
          name: fName,
          count: 1,
          tracks: [t],
        });
      }
    });
    return Array.from(map.values());
  }, [tracks]);

  // Filtered & Sorted Tracks
  const filteredSortedTracks = useMemo(() => {
    let result = [...tracks];

    if (subTab === 'favorites') {
      result = result.filter((t) => t.isFavorite);
    } else if (subTab === 'albums' && selectedAlbum) {
      result = result.filter((t) => t.album === selectedAlbum);
    } else if (subTab === 'artists' && selectedArtist) {
      result = result.filter((t) => t.artist === selectedArtist);
    } else if (selectedGenre) {
      result = result.filter((t) => t.genre === selectedGenre);
    } else if (subTab === 'folders' && selectedFolder) {
      result = result.filter((t) => (t.folderName || 'Root') === selectedFolder);
    }

    result.sort((a, b) => {
      let cmp = 0;
      if (sortBy === 'title') cmp = a.title.localeCompare(b.title);
      else if (sortBy === 'artist') cmp = a.artist.localeCompare(b.artist);
      else if (sortBy === 'duration') cmp = a.duration - b.duration;
      else if (sortBy === 'playCount') cmp = a.playCount - b.playCount;
      else if (sortBy === 'dateAdded') cmp = a.dateAdded - b.dateAdded;
      return sortOrder === 'asc' ? cmp : -cmp;
    });

    return result;
  }, [tracks, subTab, selectedAlbum, selectedArtist, selectedGenre, selectedFolder, sortBy, sortOrder]);

  return (
    <div className="w-full flex-1 overflow-y-auto px-5 pt-3 pb-24 select-none" id="pixel-library-tab">
      {/* Multi-Selection Contextual Action Bar */}
      <AnimatePresence>
        {isMultiSelectMode && (
          <motion.div
            initial={{ opacity: 0, y: -16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.98 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="sticky top-0 z-30 mb-3 -mx-2 px-3.5 py-2.5 rounded-2xl shadow-lg border border-black/10 flex items-center justify-between gap-2 backdrop-blur-md"
            style={{
              backgroundColor: palette.primaryContainer,
              color: palette.onPrimaryContainer,
            }}
          >
            <div className="flex items-center gap-2 min-w-0">
              <button
                onClick={() => {
                  setIsMultiSelectMode(false);
                  setSelectedTrackIds(new Set());
                }}
                className="p-1.5 rounded-full hover:bg-black/10 transition cursor-pointer shrink-0"
                title="Chiudi selezione"
              >
                <X className="w-5 h-5" />
              </button>
              <span className="text-xs sm:text-sm font-bold truncate">
                {selectedTrackIds.size} {selectedTrackIds.size === 1 ? 'selezionato' : 'selezionati'}
              </span>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => {
                  if (selectedTrackIds.size === filteredSortedTracks.length) {
                    setSelectedTrackIds(new Set());
                  } else {
                    setSelectedTrackIds(new Set(filteredSortedTracks.map((t) => t.id)));
                  }
                }}
                className="px-2.5 py-1.5 rounded-full text-xs font-semibold hover:bg-black/10 transition cursor-pointer"
              >
                {selectedTrackIds.size === filteredSortedTracks.length ? 'Deseleziona' : 'Tutti'}
              </button>

              <button
                disabled={selectedTrackIds.size === 0}
                onClick={() => {
                  const selectedTracks = tracks.filter((t) => selectedTrackIds.has(t.id));
                  if (onAddTracksToQueue) {
                    onAddTracksToQueue(selectedTracks);
                  } else {
                    selectedTracks.forEach((t) => onAddToQueue(t));
                  }
                  setIsMultiSelectMode(false);
                  setSelectedTrackIds(new Set());
                }}
                className="p-2 rounded-full hover:bg-black/10 active:scale-90 transition disabled:opacity-30 cursor-pointer"
                title="Aggiungi in coda"
              >
                <ListPlus className="w-4 h-4" />
              </button>

              <button
                disabled={selectedTrackIds.size === 0}
                onClick={() => {
                  const ids = Array.from(selectedTrackIds);
                  if (onBatchToggleFavorite) {
                    onBatchToggleFavorite(ids);
                  } else {
                    ids.forEach((id) => onToggleFavorite(id));
                  }
                  setIsMultiSelectMode(false);
                  setSelectedTrackIds(new Set());
                }}
                className="p-2 rounded-full hover:bg-black/10 active:scale-90 transition disabled:opacity-30 cursor-pointer"
                title="Aggiungi / rimuovi preferiti"
              >
                <Heart className="w-4 h-4" />
              </button>

              <button
                disabled={selectedTrackIds.size === 0}
                onClick={() => setBatchConfirmDeleteOpen(true)}
                className="p-2 rounded-full hover:bg-red-500/20 active:scale-90 transition disabled:opacity-30 text-red-600 cursor-pointer"
                title="Elimina selezionati"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Header & Storage Scanner Button */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Libreria</h1>
          <p className="text-xs opacity-70 font-medium">{tracks.length} brani locali sincronizzati</p>
        </div>

        <button
          onClick={onOpenFolderScanner}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold shadow-sm transition active:scale-95 cursor-pointer"
          style={{
            backgroundColor: palette.primaryContainer,
            color: palette.onPrimaryContainer,
          }}
          title="Aggiungi file o cartella musicale"
        >
          <FolderPlus className="w-4 h-4" />
          <span>Aggiungi</span>
        </button>
      </div>

      {/* Sub-tab Chips (Horizontal Scroll) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-4 no-scrollbar -mx-1 px-1">
        {subTabs.map((tab) => {
          const isSelected = subTab === tab.id;
          const IconComp = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setSubTab(tab.id);
                setSelectedAlbum(null);
                setSelectedArtist(null);
                setSelectedGenre(null);
                setSelectedFolder(null);
              }}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all active:scale-95 cursor-pointer ${
                isSelected ? 'shadow-sm' : 'opacity-70 hover:opacity-100'
              }`}
              style={{
                backgroundColor: isSelected ? palette.primary : palette.surfaceContainer,
                color: isSelected ? palette.onPrimary : palette.onSurface,
              }}
            >
              <IconComp className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Controls Bar: Sort, Order, and Grid/List toggle */}
      <div className="flex items-center justify-between mb-4 text-xs">
        {/* Breadcrumb if filtered */}
        {(selectedAlbum || selectedArtist || selectedGenre || selectedFolder) ? (
          <button
            onClick={() => {
              setSelectedAlbum(null);
              setSelectedArtist(null);
              setSelectedGenre(null);
              setSelectedFolder(null);
            }}
            className="font-bold flex items-center gap-1 hover:underline"
            style={{ color: palette.primary }}
          >
            <span>← Torna a {subTab}</span>
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <span className="opacity-60 font-semibold">Ordina:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as LibrarySortBy)}
              className="bg-transparent font-bold cursor-pointer outline-none"
              style={{ color: palette.primary }}
            >
              <option value="title" className="text-black">Titolo</option>
              <option value="artist" className="text-black">Artista</option>
              <option value="duration" className="text-black">Durata</option>
              <option value="playCount" className="text-black">Più ascoltati</option>
              <option value="dateAdded" className="text-black">Aggiunti di recente</option>
            </select>
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="p-1 rounded-full hover:bg-black/5"
              title={sortOrder === 'asc' ? 'Crescente' : 'Decrescente'}
            >
              <ArrowUpDown className="w-3.5 h-3.5 opacity-70" />
            </button>
          </div>
        )}

        <div className="flex items-center gap-1">
          <button
            onClick={() => {
              setIsMultiSelectMode(!isMultiSelectMode);
              if (isMultiSelectMode) setSelectedTrackIds(new Set());
            }}
            className={`p-2 rounded-full transition active:scale-95 cursor-pointer ${
              isMultiSelectMode ? 'shadow-sm' : 'hover:bg-black/5 opacity-70 hover:opacity-100'
            }`}
            style={{
              backgroundColor: isMultiSelectMode ? palette.primary : 'transparent',
              color: isMultiSelectMode ? palette.onPrimary : 'inherit',
            }}
            title={isMultiSelectMode ? 'Termina selezione' : 'Selezione multipla'}
          >
            <CheckSquare className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsGridView(!isGridView)}
            className="p-2 rounded-full hover:bg-black/5 active:scale-95 transition cursor-pointer opacity-70 hover:opacity-100"
            title={isGridView ? 'Vista elenco' : 'Vista griglia'}
          >
            {isGridView ? <List className="w-4 h-4" /> : <LayoutGrid className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* VIEW: ALBUMS */}
      {subTab === 'albums' && !selectedAlbum && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
          {albums.map((album) => (
            <div
              key={album.title}
              onClick={() => setSelectedAlbum(album.title)}
              className="p-3 rounded-2xl flex flex-col cursor-pointer transition-all hover:shadow-sm border border-black/5 active:scale-95"
              style={{ backgroundColor: palette.surfaceContainer }}
            >
              <img
                src={album.coverUrl}
                alt={album.title}
                className="aspect-square w-full rounded-xl object-cover mb-2 shadow-sm"
              />
              <h4 className="text-xs font-bold truncate">{album.title}</h4>
              <p className="text-[11px] opacity-70 truncate">{album.artist}</p>
              <span className="text-[10px] opacity-50 mt-1">{album.count} brani</span>
            </div>
          ))}
        </div>
      )}

      {/* VIEW: ARTISTS */}
      {subTab === 'artists' && !selectedArtist && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
          {artists.map((artist) => (
            <div
              key={artist.name}
              onClick={() => setSelectedArtist(artist.name)}
              className="p-4 rounded-2xl flex flex-col items-center text-center cursor-pointer transition-all hover:shadow-sm border border-black/5 active:scale-95"
              style={{ backgroundColor: palette.surfaceContainer }}
            >
              <img
                src={artist.coverUrl}
                alt={artist.name}
                className="w-20 h-20 rounded-full object-cover mb-2 shadow-md border-2 border-white/20"
              />
              <h4 className="text-xs font-bold truncate w-full">{artist.name}</h4>
              <span className="text-[10px] opacity-60 mt-0.5">{artist.count} brani</span>
            </div>
          ))}
        </div>
      )}

      {/* VIEW: PLAYLISTS */}
      {subTab === 'playlists' && (
        <div className="space-y-3">
          <button
            onClick={onCreatePlaylist}
            className="w-full flex items-center justify-center gap-2 p-4 rounded-2xl border-2 border-dashed border-current/20 font-bold text-xs hover:bg-black/5 transition"
            style={{ color: palette.primary }}
          >
            <Plus className="w-4 h-4" />
            <span>Crea nuova playlist</span>
          </button>

          {playlists.map((pl) => (
            <div
              key={pl.id}
              onClick={() => onSelectPlaylist(pl)}
              className="p-3.5 rounded-2xl flex items-center justify-between cursor-pointer transition hover:shadow-sm border border-black/5 active:scale-95"
              style={{ backgroundColor: palette.surfaceContainer }}
            >
              <div className="flex items-center gap-3">
                <img
                  src={pl.coverUrl || tracks[0]?.coverUrl}
                  alt={pl.title}
                  className="w-12 h-12 rounded-xl object-cover shadow-sm"
                />
                <div>
                  <h4 className="text-sm font-bold">{pl.title}</h4>
                  <p className="text-xs opacity-70">{pl.trackIds.length} brani • {pl.description || 'Playlist creata'}</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                {onDeletePlaylist && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setPlaylistToDelete(pl);
                    }}
                    className="p-2 rounded-full hover:bg-red-500/10 text-red-500 transition opacity-70 hover:opacity-100"
                    title="Elimina playlist"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center shadow-sm"
                  style={{ backgroundColor: palette.primary, color: palette.onPrimary }}
                >
                  <Play className="w-4 h-4 fill-current ml-0.5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* VIEW: FOLDERS */}
      {subTab === 'folders' && !selectedFolder && (
        <div className="space-y-3">
          <button
            onClick={onOpenFolderScanner}
            className="w-full flex items-center justify-center gap-2.5 p-4 rounded-2xl border-2 border-dashed border-current/20 font-bold text-xs hover:bg-black/5 transition cursor-pointer"
            style={{ color: palette.primary }}
          >
            <FolderPlus className="w-4 h-4" />
            <span>Aggiungi brani dal dispositivo (singolo o multipli)</span>
          </button>

          {folders.map((folder) => (
            <div
              key={folder.name}
              onClick={() => setSelectedFolder(folder.name)}
              className="p-3.5 rounded-2xl flex items-center justify-between cursor-pointer transition hover:shadow-sm border border-black/5 active:scale-95"
              style={{ backgroundColor: palette.surfaceContainer }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: palette.primaryContainer, color: palette.onPrimaryContainer }}
                >
                  <Folder className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold">{folder.name}</h4>
                  <p className="text-xs opacity-70">{folder.count} {folder.count === 1 ? 'file audio' : 'file audio'}</p>
                </div>
              </div>
              <span className="text-xs font-semibold opacity-60">Apri →</span>
            </div>
          ))}

          {folders.length === 0 && (
            <div className="text-center py-10 text-xs opacity-60">
              Nessuna cartella trovata. Tocca il pulsante in alto per importare una cartella di brani dal tuo telefono.
            </div>
          )}
        </div>
      )}

      {/* FOLDER DRILL-DOWN HEADER */}
      {subTab === 'folders' && selectedFolder && (
        <div
          className="mb-3.5 p-4 rounded-2xl flex items-center justify-between border border-black/5"
          style={{ backgroundColor: palette.surfaceContainer }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: palette.primaryContainer, color: palette.onPrimaryContainer }}
            >
              <Folder className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold truncate max-w-[170px] sm:max-w-xs">{selectedFolder}</h3>
              <p className="text-xs opacity-70">{filteredSortedTracks.length} {filteredSortedTracks.length === 1 ? 'brano' : 'brani'}</p>
            </div>
          </div>

          {filteredSortedTracks.length > 0 && (
            <button
              onClick={() => {
                onSelectTrack(filteredSortedTracks[0]);
                if (onAddTracksToQueue) onAddTracksToQueue(filteredSortedTracks);
              }}
              className="px-3.5 py-2 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-sm transition active:scale-95 cursor-pointer"
              style={{ backgroundColor: palette.primary, color: palette.onPrimary }}
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Riproduci tutti</span>
            </button>
          )}
        </div>
      )}

      {/* VIEW: TRACKS LIST / GRID (Used for Songs, Favorites, Album drill-down, Artist drill-down, Folder drill-down) */}
      {(subTab === 'songs' || subTab === 'favorites' || selectedAlbum || selectedArtist || selectedGenre || selectedFolder) && (
        <>
          {isGridView ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {filteredSortedTracks.map((track) => {
                const isCurrent = track.id === currentTrackId;
                const isSelected = selectedTrackIds.has(track.id);
                return (
                  <div
                    key={track.id}
                    onPointerDown={(e) => handlePointerDown(track, e)}
                    onPointerMove={handlePointerMove}
                    onPointerUp={handlePointerUp}
                    onPointerCancel={handlePointerUp}
                    onTouchStart={(e) => handleTouchStart(track, e)}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                    onTouchCancel={handleTouchEnd}
                    onContextMenu={(e) => {
                      e.preventDefault();
                    }}
                    onClick={() => handleTrackClick(track)}
                    className={`p-3 rounded-2xl flex flex-col cursor-pointer transition-all hover:shadow-sm border active:scale-95 relative select-none ${
                      isSelected
                        ? 'ring-2 ring-offset-2'
                        : 'border-black/5'
                    }`}
                    style={{
                      backgroundColor: isSelected
                        ? palette.primaryContainer
                        : isCurrent
                        ? palette.secondaryContainer
                        : palette.surfaceContainer,
                      color: isSelected
                        ? palette.onPrimaryContainer
                        : isCurrent
                        ? palette.onSecondaryContainer
                        : palette.onSurface,
                      borderColor: isSelected ? palette.primary : undefined,
                    }}
                  >
                    <div className="relative aspect-square w-full rounded-xl overflow-hidden mb-2">
                      <img
                        src={track.coverUrl}
                        alt={track.title}
                        className="w-full h-full object-cover"
                      />
                      {isMultiSelectMode ? (
                        <div
                          className="absolute top-2 left-2 w-6 h-6 rounded-full flex items-center justify-center transition-all shadow-md z-10"
                          style={{
                            backgroundColor: isSelected ? palette.primary : 'rgba(0,0,0,0.5)',
                            color: palette.onPrimary,
                            border: isSelected ? 'none' : '2px solid white',
                          }}
                        >
                          {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                      ) : (
                        <>
                          {isCurrent && (
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                              <Play className="w-6 h-6 fill-white text-white" />
                            </div>
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setActionTrack(track);
                            }}
                            className="absolute top-1.5 right-1.5 p-1.5 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-sm transition cursor-pointer"
                            title="Opzioni brano"
                          >
                            <MoreVertical className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}
                    </div>
                    <h4 className="text-xs font-bold truncate">{track.title}</h4>
                    <p className="text-[11px] opacity-70 truncate">{track.artist}</p>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="space-y-1.5">
              {filteredSortedTracks.map((track, index) => {
                const isCurrent = track.id === currentTrackId;
                const isSelected = selectedTrackIds.has(track.id);
                return (
                  <div
                    key={track.id}
                    onPointerDown={(e) => handlePointerDown(track, e)}
                    onPointerMove={handlePointerMove}
                    onPointerUp={handlePointerUp}
                    onPointerCancel={handlePointerUp}
                    onTouchStart={(e) => handleTouchStart(track, e)}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                    onTouchCancel={handleTouchEnd}
                    onContextMenu={(e) => {
                      e.preventDefault();
                    }}
                    onClick={() => handleTrackClick(track)}
                    className={`flex items-center gap-3 p-2.5 rounded-2xl cursor-pointer transition-all border select-none ${
                      isSelected
                        ? 'ring-2 ring-offset-1 font-bold shadow-sm'
                        : isCurrent
                        ? 'font-bold shadow-sm border-black/10'
                        : 'hover:bg-black/5 border-black/5'
                    }`}
                    style={{
                      backgroundColor: isSelected
                        ? palette.primaryContainer
                        : isCurrent
                        ? palette.secondaryContainer
                        : palette.surfaceContainer,
                      color: isSelected
                        ? palette.onPrimaryContainer
                        : isCurrent
                        ? palette.onSecondaryContainer
                        : palette.onSurface,
                      borderColor: isSelected ? palette.primary : undefined,
                    }}
                  >
                    {isMultiSelectMode ? (
                      <div
                        className="w-5 h-5 rounded-full flex items-center justify-center transition-all shrink-0"
                        style={{
                          backgroundColor: isSelected ? palette.primary : 'transparent',
                          color: palette.onPrimary,
                          border: isSelected ? 'none' : '2px solid rgba(128, 128, 128, 0.4)',
                        }}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                    ) : (
                      <span className="w-5 text-center text-xs opacity-50 font-mono shrink-0">
                        {index + 1}
                      </span>
                    )}

                    <img
                      src={track.coverUrl}
                      alt={track.title}
                      className="w-11 h-11 rounded-xl object-cover shadow-sm shrink-0"
                    />

                    <div className="flex-1 min-w-0 pr-1">
                      <h4 className="text-sm truncate leading-tight">{track.title}</h4>
                      <p className="text-xs opacity-75 truncate leading-tight mt-0.5">
                        {track.artist} • {track.album}
                      </p>
                    </div>

                    {!isMultiSelectMode && (
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="text-xs opacity-60 font-mono pr-1">
                          {formatTime(track.duration)}
                        </span>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleFavorite(track.id);
                          }}
                          className="p-1.5 rounded-full hover:bg-black/10 transition active:scale-90"
                        >
                          <Heart
                            className={`w-4 h-4 transition-colors ${
                              track.isFavorite ? 'fill-red-500 text-red-500' : 'opacity-40'
                            }`}
                          />
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActionTrack(track);
                          }}
                          className="p-1.5 rounded-full hover:bg-black/10 transition opacity-70 hover:opacity-100 cursor-pointer"
                          title="Dettagli e opzioni"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {filteredSortedTracks.length === 0 && (
            <div className="text-center py-12 text-xs opacity-60">
              Nessun brano trovato in questa sezione.
            </div>
          )}
        </>
      )}

      {/* Material 3 Track Actions Bottom Sheet */}
      <AnimatePresence>
        {actionTrack && (
          <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 320 }}
              className="w-full rounded-t-[32px] p-5 shadow-2xl select-none"
              style={{
                backgroundColor: palette.surfaceContainerHigh,
                color: palette.onSurface,
              }}
            >
              {/* Sheet Header with Track info */}
              <div className="flex items-center justify-between pb-3 mb-2 border-b border-black/10">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <img
                    src={actionTrack.coverUrl}
                    alt={actionTrack.title}
                    className="w-12 h-12 rounded-xl object-cover shadow-sm shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <h4 className="text-sm font-bold truncate leading-tight">{actionTrack.title}</h4>
                    <p className="text-xs opacity-70 truncate leading-tight mt-0.5">{actionTrack.artist}</p>
                  </div>
                </div>
                <button
                  onClick={() => setActionTrack(null)}
                  className="p-2 rounded-full hover:bg-black/10 transition shrink-0 ml-2"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Action Buttons */}
              <div className="space-y-1">
                <button
                  onClick={() => {
                    onSelectTrack(actionTrack);
                    setActionTrack(null);
                  }}
                  className="w-full flex items-center gap-3.5 p-3 rounded-2xl hover:bg-black/5 active:scale-98 transition text-xs font-semibold"
                >
                  <Play className="w-4 h-4" style={{ color: palette.primary }} />
                  <span>Riproduci subito</span>
                </button>

                <button
                  onClick={() => {
                    onAddToQueue(actionTrack);
                    setActionTrack(null);
                  }}
                  className="w-full flex items-center gap-3.5 p-3 rounded-2xl hover:bg-black/5 active:scale-98 transition text-xs font-semibold"
                >
                  <ListPlus className="w-4 h-4" />
                  <span>Aggiungi alla coda</span>
                </button>

                <button
                  onClick={() => {
                    onToggleFavorite(actionTrack.id);
                  }}
                  className="w-full flex items-center gap-3.5 p-3 rounded-2xl hover:bg-black/5 active:scale-98 transition text-xs font-semibold"
                >
                  <Heart
                    className={`w-4 h-4 ${
                      actionTrack.isFavorite ? 'fill-red-500 text-red-500' : 'opacity-80'
                    }`}
                  />
                  <span>{actionTrack.isFavorite ? 'Rimuovi dai Preferiti' : 'Aggiungi ai Preferiti'}</span>
                </button>

                <button
                  onClick={() => {
                    const t = actionTrack;
                    setActionTrack(null);
                    onShowTrackInfo(t);
                  }}
                  className="w-full flex items-center gap-3.5 p-3 rounded-2xl hover:bg-black/5 active:scale-98 transition text-xs font-semibold"
                >
                  <Info className="w-4 h-4 opacity-80" />
                  <span>Informazioni brano & metadati</span>
                </button>

                <button
                  onClick={() => {
                    setTrackToDelete(actionTrack);
                    setActionTrack(null);
                  }}
                  className="w-full flex items-center gap-3.5 p-3 rounded-2xl hover:bg-red-500/10 active:scale-98 transition text-xs font-bold text-red-500"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Elimina dalla libreria locale</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Floating Material You Multi-Select Bottom Action Bar */}
      <AnimatePresence>
        {isMultiSelectMode && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="fixed bottom-20 sm:bottom-24 left-1/2 -translate-x-1/2 z-40 w-[94%] max-w-md rounded-3xl p-3 shadow-2xl border border-black/10 backdrop-blur-xl flex items-center justify-between gap-2 select-none"
            style={{
              backgroundColor: palette.surfaceContainerHigh,
              color: palette.onSurface,
            }}
            id="pixel-multi-select-bar"
          >
            <div className="flex items-center gap-2 pl-2">
              <span className="text-xs font-bold whitespace-nowrap">
                {selectedTrackIds.size} {selectedTrackIds.size === 1 ? 'selezionato' : 'selezionati'}
              </span>
              <button
                onClick={() => {
                  if (selectedTrackIds.size === filteredSortedTracks.length) {
                    setSelectedTrackIds(new Set());
                  } else {
                    setSelectedTrackIds(new Set(filteredSortedTracks.map((t) => t.id)));
                  }
                }}
                className="p-2 rounded-full hover:bg-black/10 transition flex items-center justify-center cursor-pointer"
                title={selectedTrackIds.size === filteredSortedTracks.length ? 'Deseleziona tutti' : 'Seleziona tutti'}
              >
                <CheckSquare className="w-4 h-4 opacity-80" />
              </button>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              {/* Add to Queue */}
              <button
                disabled={selectedTrackIds.size === 0}
                onClick={() => {
                  const selectedTracks = tracks.filter((t) => selectedTrackIds.has(t.id));
                  if (onAddTracksToQueue) {
                    onAddTracksToQueue(selectedTracks);
                  } else {
                    selectedTracks.forEach((t) => onAddToQueue(t));
                  }
                  setIsMultiSelectMode(false);
                  setSelectedTrackIds(new Set());
                }}
                className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-bold transition active:scale-95 disabled:opacity-30 cursor-pointer shadow-sm"
                style={{
                  backgroundColor: palette.primaryContainer,
                  color: palette.onPrimaryContainer,
                }}
                title="Aggiungi brani selezionati in coda"
              >
                <ListPlus className="w-3.5 h-3.5 shrink-0" />
                <span>Coda</span>
              </button>

              {/* Add to Favorites */}
              <button
                disabled={selectedTrackIds.size === 0}
                onClick={() => {
                  const ids = Array.from(selectedTrackIds);
                  if (onBatchToggleFavorite) {
                    onBatchToggleFavorite(ids);
                  } else {
                    ids.forEach((id) => onToggleFavorite(id));
                  }
                  setIsMultiSelectMode(false);
                  setSelectedTrackIds(new Set());
                }}
                className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-bold transition active:scale-95 disabled:opacity-30 cursor-pointer shadow-sm"
                style={{
                  backgroundColor: palette.secondaryContainer,
                  color: palette.onSecondaryContainer,
                }}
                title="Aggiungi o rimuovi dai preferiti"
              >
                <Heart className="w-3.5 h-3.5 shrink-0" />
                <span>Preferiti</span>
              </button>

              {/* Delete / Remove */}
              <button
                disabled={selectedTrackIds.size === 0}
                onClick={() => setBatchConfirmDeleteOpen(true)}
                className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-bold transition active:scale-95 disabled:opacity-30 bg-red-500/15 text-red-600 hover:bg-red-500/25 cursor-pointer shadow-sm"
                title="Elimina brani selezionati"
              >
                <Trash2 className="w-3.5 h-3.5 shrink-0" />
                <span>Cancella</span>
              </button>

              {/* Close */}
              <button
                onClick={() => {
                  setIsMultiSelectMode(false);
                  setSelectedTrackIds(new Set());
                }}
                className="p-2 rounded-full hover:bg-black/10 active:scale-90 transition opacity-70 hover:opacity-100 cursor-pointer"
                title="Annulla selezione"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirmation Dialog: Delete Track */}
      <ConfirmDialog
        isOpen={trackToDelete !== null}
        title="Rimuovere brano?"
        description={`Vuoi davvero eliminare "${trackToDelete?.title}" (${trackToDelete?.artist}) dalla libreria locale e dalla coda?`}
        confirmLabel="Elimina"
        cancelLabel="Annulla"
        isDestructive={true}
        onConfirm={() => {
          if (trackToDelete) {
            onDeleteTrack(trackToDelete.id);
            setTrackToDelete(null);
          }
        }}
        onClose={() => setTrackToDelete(null)}
        palette={palette}
      />

      {/* Confirmation Dialog: Delete Playlist */}
      <ConfirmDialog
        isOpen={playlistToDelete !== null}
        title="Eliminare playlist?"
        description={`Vuoi eliminare la playlist "${playlistToDelete?.title}"? I brani continueranno a rimanere nella libreria musicale.`}
        confirmLabel="Elimina"
        cancelLabel="Annulla"
        isDestructive={true}
        onConfirm={() => {
          if (playlistToDelete && onDeletePlaylist) {
            onDeletePlaylist(playlistToDelete.id);
            setPlaylistToDelete(null);
          }
        }}
        onClose={() => setPlaylistToDelete(null)}
        palette={palette}
      />
      {/* Confirmation Dialog: Delete Multiple Selected Tracks */}
      <ConfirmDialog
        isOpen={batchConfirmDeleteOpen}
        title={`Eliminare ${selectedTrackIds.size} ${selectedTrackIds.size === 1 ? 'brano' : 'brani'}?`}
        description={`Vuoi davvero eliminare ${selectedTrackIds.size} ${selectedTrackIds.size === 1 ? 'brano selezionato' : 'brani selezionati'} dalla libreria locale e dalla coda di riproduzione?`}
        confirmLabel="Elimina tutti"
        cancelLabel="Annulla"
        isDestructive={true}
        onConfirm={() => {
          const ids = Array.from(selectedTrackIds);
          if (onDeleteTracks) {
            onDeleteTracks(ids);
          } else {
            ids.forEach((id) => onDeleteTrack(id));
          }
          setSelectedTrackIds(new Set());
          setIsMultiSelectMode(false);
          setBatchConfirmDeleteOpen(false);
        }}
        onClose={() => setBatchConfirmDeleteOpen(false)}
        palette={palette}
      />
    </div>
  );
};
