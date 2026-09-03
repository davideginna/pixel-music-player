import React from 'react';
import { Play, Heart, Search, Shuffle, FolderPlus, Sparkles, Clock, Music } from 'lucide-react';
import { DynamicPalette, Track } from '../types';

interface HomeTabProps {
  tracks: Track[];
  palette: DynamicPalette;
  currentTrackId: string | null;
  isPlaying: boolean;
  onSelectTrack: (track: Track) => void;
  onShuffleAll: () => void;
  onNavigateToSearch: () => void;
  onOpenFolderScanner: () => void;
  onToggleFavorite: (trackId: string) => void;
}

export const HomeTab: React.FC<HomeTabProps> = ({
  tracks,
  palette,
  currentTrackId,
  isPlaying,
  onSelectTrack,
  onShuffleAll,
  onNavigateToSearch,
  onOpenFolderScanner,
  onToggleFavorite,
}) => {
  // Time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Buongiorno';
    if (hour < 18) return 'Buon pomeriggio';
    return 'Buonasera';
  };

  // Recent tracks (sorted by lastPlayed or fallback)
  const recentTracks = [...tracks]
    .sort((a, b) => (b.lastPlayed || 0) - (a.lastPlayed || 0))
    .slice(0, 6);

  // Favorite tracks
  const favoriteTracks = tracks.filter((t) => t.isFavorite).slice(0, 5);

  // Recently added tracks
  const newlyAddedTracks = [...tracks]
    .sort((a, b) => b.dateAdded - a.dateAdded)
    .slice(0, 6);

  return (
    <div className="w-full flex-1 overflow-y-auto px-5 pt-3 pb-24 select-none" id="pixel-home-tab">
      {/* Pixel Header & Greeting */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h1 className="text-3xl font-medium tracking-tight text-[#1D1B20] dark:text-[#E6E1E5]">
            {getGreeting()}
          </h1>
          <p className="text-[#49454F] dark:text-[#CAC4D0] text-sm mt-1">
            Tuffati nei tuoi brani preferiti.
          </p>
        </div>

        {/* Quick Shuffle All Button */}
        <button
          id="home-shuffle-all-btn"
          onClick={onShuffleAll}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold shadow-sm transition active:scale-95 cursor-pointer mt-1"
          style={{
            backgroundColor: palette.secondaryContainer,
            color: palette.onSecondaryContainer,
          }}
          title="Riproduci tutti i brani in ordine casuale"
        >
          <Shuffle className="w-4 h-4" />
          <span>Casuale</span>
        </button>
      </div>

      {/* Search Bar Pill Shortcut */}
      <div
        id="home-search-pill"
        onClick={onNavigateToSearch}
        className="w-full rounded-full px-5 py-3 flex items-center gap-3 mb-8 border cursor-pointer transition-all shadow-sm hover:shadow active:scale-[0.99]"
        style={{
          backgroundColor: palette.surfaceContainerHigh,
          color: palette.onSurfaceVariant,
          borderColor: palette.outlineVariant,
        }}
      >
        <Search className="w-5 h-5 opacity-70" />
        <span className="text-sm">Cerca nella tua musica</span>
      </div>

      {/* Top Picks Grid */}
      {recentTracks.length >= 2 && (
        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-4" style={{ color: palette.onSurface }}>
            Ascolti recenti
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div
              onClick={() => onSelectTrack(recentTracks[0])}
              className="rounded-3xl p-4 aspect-square flex flex-col justify-end relative cursor-pointer group shadow-sm transition-transform active:scale-95 border"
              style={{
                backgroundColor: palette.secondaryContainer,
                color: palette.onSecondaryContainer,
                borderColor: palette.outlineVariant,
              }}
            >
              <div
                className="w-9 h-9 rounded-xl mb-auto flex items-center justify-center shadow-sm"
                style={{
                  backgroundColor: palette.secondary,
                  color: palette.surface,
                }}
              >
                <Play className="w-4 h-4 fill-current ml-0.5 text-white" />
              </div>
              <p className="text-xs font-bold leading-tight truncate">
                {recentTracks[0].title}
              </p>
              <p className="text-[10px] opacity-75 truncate mt-0.5">
                {recentTracks[0].artist}
              </p>
            </div>

            <div
              onClick={() => onSelectTrack(recentTracks[1])}
              className="rounded-3xl p-4 aspect-square flex flex-col justify-end relative cursor-pointer group shadow-sm transition-transform active:scale-95 border"
              style={{
                backgroundColor: palette.primaryContainer,
                color: palette.onPrimaryContainer,
                borderColor: palette.outlineVariant,
              }}
            >
              <div
                className="w-9 h-9 rounded-xl mb-auto flex items-center justify-center shadow-sm"
                style={{
                  backgroundColor: palette.primary,
                  color: palette.onPrimary,
                }}
              >
                <Play className="w-4 h-4 fill-current ml-0.5 text-white" />
              </div>
              <p className="text-xs font-bold leading-tight truncate">
                {recentTracks[1].title}
              </p>
              <p className="text-[10px] opacity-75 truncate mt-0.5">
                {recentTracks[1].artist}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Riprodotti recentemente Carousel */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-3.5">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 opacity-70" />
            <h2 className="text-base sm:text-lg font-bold">Tutti i recenti</h2>
          </div>
          <span className="text-xs opacity-60 font-semibold">{recentTracks.length} brani</span>
        </div>

        <div className="flex items-center gap-3.5 overflow-x-auto pb-2 no-scrollbar -mx-1 px-1">
          {recentTracks.map((track) => {
            const isCurrent = track.id === currentTrackId;
            return (
              <div
                key={track.id}
                onClick={() => onSelectTrack(track)}
                className="group shrink-0 w-36 sm:w-40 flex flex-col cursor-pointer transition-transform active:scale-95"
              >
                <div className="relative aspect-square w-full rounded-2xl overflow-hidden shadow-md mb-2 border border-black/5">
                  <img
                    src={track.coverUrl}
                    alt={track.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div
                    className={`absolute inset-0 bg-black/30 flex items-center justify-center transition-opacity ${
                      isCurrent && isPlaying ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                    }`}
                  >
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center shadow-lg"
                      style={{
                        backgroundColor: palette.primary,
                        color: palette.onPrimary,
                      }}
                    >
                      <Play className="w-5 h-5 fill-current ml-0.5" />
                    </div>
                  </div>
                </div>
                <h4 className="text-xs font-bold truncate leading-tight">{track.title}</h4>
                <p className="text-[11px] opacity-70 truncate mt-0.5">{track.artist}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Preferiti Section */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-3.5">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-red-500 fill-red-500" />
            <h2 className="text-base sm:text-lg font-bold">La tua Libreria & Preferiti</h2>
          </div>
          <span className="text-xs opacity-60 font-semibold">{favoriteTracks.length} salvati</span>
        </div>

        {/* Liked Songs quick banner */}
        <div
          onClick={favoriteTracks.length > 0 ? () => onSelectTrack(favoriteTracks[0]) : undefined}
          className="flex items-center gap-4 mb-4 p-3.5 rounded-2xl border shadow-sm cursor-pointer hover:shadow transition-all active:scale-[0.99]"
          style={{
            backgroundColor: palette.surfaceContainer,
            borderColor: palette.outlineVariant,
            color: palette.onSurface,
          }}
        >
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold shadow-sm shrink-0"
            style={{
              backgroundColor: palette.primaryContainer,
              color: palette.onPrimaryContainer,
            }}
          >
            ♥
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold">Brani piaciuti</p>
            <p className="text-xs opacity-75">{favoriteTracks.length} tracce sincronizzate</p>
          </div>
        </div>

        {favoriteTracks.length > 0 ? (
          <div className="space-y-2">
            {favoriteTracks.map((track) => {
              const isCurrent = track.id === currentTrackId;
              return (
                <div
                  key={track.id}
                  onClick={() => onSelectTrack(track)}
                  className={`flex items-center gap-3.5 p-3 rounded-2xl cursor-pointer transition-all border border-black/5 ${
                    isCurrent ? 'shadow-sm' : 'hover:bg-black/5'
                  }`}
                  style={{
                    backgroundColor: isCurrent ? palette.secondaryContainer : palette.surfaceContainer,
                    color: isCurrent ? palette.onSecondaryContainer : palette.onSurface,
                  }}
                >
                  <img
                    src={track.coverUrl}
                    alt={track.title}
                    className="w-12 h-12 rounded-xl object-cover shadow-sm shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold truncate">{track.title}</h4>
                    <p className="text-xs opacity-75 truncate">{track.artist} • {track.album}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(track.id);
                      }}
                      className="p-2 rounded-full hover:bg-black/10 transition active:scale-90"
                      title="Rimuovi dai preferiti"
                    >
                      <Heart className="w-4 h-4 fill-red-500 text-red-500" />
                    </button>
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center shadow-sm shrink-0"
                      style={{
                        backgroundColor: palette.primary,
                        color: palette.onPrimary,
                      }}
                    >
                      <Play className="w-4 h-4 fill-current ml-0.5" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div
            className="p-5 rounded-2xl text-center text-xs opacity-70"
            style={{ backgroundColor: palette.surfaceContainer }}
          >
            Non hai ancora aggiunto brani ai preferiti. Tocca l'icona del cuore durante l'ascolto!
          </div>
        )}
      </section>

      {/* Aggiunti recentemente Section */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-3.5">
          <div className="flex items-center gap-2">
            <Music className="w-4 h-4 opacity-70" />
            <h2 className="text-base sm:text-lg font-bold">Aggiunti recentemente</h2>
          </div>
          <button
            onClick={onOpenFolderScanner}
            className="flex items-center gap-1 text-xs font-bold"
            style={{ color: palette.primary }}
          >
            <FolderPlus className="w-3.5 h-3.5" />
            <span>Aggiungi musica</span>
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {newlyAddedTracks.map((track) => (
            <div
              key={track.id}
              onClick={() => onSelectTrack(track)}
              className="p-3 rounded-2xl flex flex-col cursor-pointer transition-all hover:shadow-sm border border-black/5 active:scale-95"
              style={{ backgroundColor: palette.surfaceContainer }}
            >
              <div className="relative aspect-square w-full rounded-xl overflow-hidden mb-2">
                <img
                  src={track.coverUrl}
                  alt={track.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <h4 className="text-xs font-bold truncate">{track.title}</h4>
              <p className="text-[11px] opacity-70 truncate">{track.artist}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Banner Scansione Locale Material 3 */}
      <div
        className="p-5 rounded-[24px] flex items-center justify-between shadow-sm cursor-pointer hover:shadow transition border border-black/5"
        style={{
          backgroundColor: palette.primaryContainer,
          color: palette.onPrimaryContainer,
        }}
        onClick={onOpenFolderScanner}
      >
        <div className="flex items-center gap-3.5">
          <div
            className="w-11 h-11 rounded-2xl flex items-center justify-center shadow-sm"
            style={{ backgroundColor: palette.primary, color: palette.onPrimary }}
          >
            <FolderPlus className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold">Scansione memoria locale</h4>
            <p className="text-xs opacity-80">Importa file MP3, FLAC, WAV dal dispositivo</p>
          </div>
        </div>
      </div>
    </div>
  );
};
