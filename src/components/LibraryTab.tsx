import React, { useState, useMemo } from 'react';
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
} from 'lucide-react';
import {
  DynamicPalette,
  LibrarySortBy,
  LibrarySortOrder,
  LibrarySubTab,
  Playlist,
  Track,
} from '../types';

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
  onOpenFolderScanner,
  onCreatePlaylist,
  onSelectPlaylist,
  onShowTrackInfo,
}) => {
  const [subTab, setSubTab] = useState<LibrarySubTab>('songs');
  const [sortBy, setSortBy] = useState<LibrarySortBy>('title');
  const [sortOrder, setSortOrder] = useState<LibrarySortOrder>('asc');
  const [isGridView, setIsGridView] = useState(false);
  const [activeMenuTrackId, setActiveMenuTrackId] = useState<string | null>(null);

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
            onClick={() => setIsGridView(!isGridView)}
            className="p-2 rounded-full hover:bg-black/5 active:scale-95 transition"
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
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center shadow-sm"
                style={{ backgroundColor: palette.primary, color: palette.onPrimary }}
              >
                <Play className="w-4 h-4 fill-current ml-0.5" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* VIEW: FOLDERS */}
      {subTab === 'folders' && !selectedFolder && (
        <div className="space-y-2.5">
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
                  <p className="text-xs opacity-70">{folder.count} file audio</p>
                </div>
              </div>
              <span className="text-xs font-semibold opacity-60">Apri →</span>
            </div>
          ))}
        </div>
      )}

      {/* VIEW: TRACKS LIST / GRID (Used for Songs, Favorites, Album drill-down, Artist drill-down, Folder drill-down) */}
      {(subTab === 'songs' || subTab === 'favorites' || selectedAlbum || selectedArtist || selectedGenre || selectedFolder) && (
        <>
          {isGridView ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {filteredSortedTracks.map((track) => {
                const isCurrent = track.id === currentTrackId;
                return (
                  <div
                    key={track.id}
                    onClick={() => onSelectTrack(track)}
                    className="p-3 rounded-2xl flex flex-col cursor-pointer transition-all hover:shadow-sm border border-black/5 active:scale-95"
                    style={{
                      backgroundColor: isCurrent ? palette.secondaryContainer : palette.surfaceContainer,
                      color: isCurrent ? palette.onSecondaryContainer : palette.onSurface,
                    }}
                  >
                    <div className="relative aspect-square w-full rounded-xl overflow-hidden mb-2">
                      <img
                        src={track.coverUrl}
                        alt={track.title}
                        className="w-full h-full object-cover"
                      />
                      {isCurrent && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <Play className="w-6 h-6 fill-white text-white" />
                        </div>
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
                return (
                  <div
                    key={track.id}
                    onClick={() => onSelectTrack(track)}
                    className={`flex items-center gap-3 p-2.5 rounded-2xl cursor-pointer transition-all border border-black/5 ${
                      isCurrent ? 'font-bold shadow-sm' : 'hover:bg-black/5'
                    }`}
                    style={{
                      backgroundColor: isCurrent ? palette.secondaryContainer : palette.surfaceContainer,
                      color: isCurrent ? palette.onSecondaryContainer : palette.onSurface,
                    }}
                  >
                    <span className="w-5 text-center text-xs opacity-50 font-mono">
                      {index + 1}
                    </span>

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
                          onShowTrackInfo(track);
                        }}
                        className="p-1.5 rounded-full hover:bg-black/10 transition opacity-70 hover:opacity-100"
                        title="Dettagli e opzioni"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
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
    </div>
  );
};
