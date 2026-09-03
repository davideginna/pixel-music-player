import React, { useState, useMemo } from 'react';
import { Search, X, Music, Disc3, Users, Play, Heart } from 'lucide-react';
import { DynamicPalette, Track } from '../types';

interface SearchTabProps {
  tracks: Track[];
  palette: DynamicPalette;
  currentTrackId: string | null;
  isPlaying: boolean;
  onSelectTrack: (track: Track) => void;
  onToggleFavorite: (trackId: string) => void;
}

export const SearchTab: React.FC<SearchTabProps> = ({
  tracks,
  palette,
  currentTrackId,
  isPlaying,
  onSelectTrack,
  onToggleFavorite,
}) => {
  const [query, setQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'songs' | 'artists' | 'albums'>('all');

  const filtered = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase().trim();

    return tracks.filter((t) => {
      const matchTitle = t.title.toLowerCase().includes(q);
      const matchArtist = t.artist.toLowerCase().includes(q);
      const matchAlbum = t.album.toLowerCase().includes(q);
      const matchGenre = t.genre.toLowerCase().includes(q);

      if (filterType === 'songs') return matchTitle;
      if (filterType === 'artists') return matchArtist;
      if (filterType === 'albums') return matchAlbum;
      return matchTitle || matchArtist || matchAlbum || matchGenre;
    });
  }, [tracks, query, filterType]);

  const quickGenres = ['Lo-Fi', 'Ambient', 'Synthwave', 'Chillout', 'Jazz Hop', 'Indie Pop'];

  return (
    <div className="w-full flex-1 overflow-y-auto px-5 pt-3 pb-24 select-none" id="pixel-search-tab">
      <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-4">Cerca</h1>

      {/* Material 3 Search Bar Input */}
      <div
        className="w-full flex items-center gap-3 px-4 py-3 rounded-full mb-4 shadow-sm border border-black/5"
        style={{
          backgroundColor: palette.surfaceContainerHigh,
          color: palette.onSurface,
        }}
      >
        <Search className="w-5 h-5 opacity-70" />
        <input
          id="pixel-search-input"
          type="text"
          placeholder="Cerca brani, artisti, album o generi..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full bg-transparent outline-none text-sm font-medium placeholder:text-current/50"
          autoFocus
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="p-1 rounded-full hover:bg-black/10 transition"
          >
            <X className="w-4 h-4 opacity-70" />
          </button>
        )}
      </div>

      {/* Filter Category Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6 no-scrollbar">
        {[
          { id: 'all', label: 'Tutti i risultati' },
          { id: 'songs', label: 'Brani' },
          { id: 'artists', label: 'Artisti' },
          { id: 'albums', label: 'Album' },
        ].map((chip) => {
          const isSelected = filterType === chip.id;
          return (
            <button
              key={chip.id}
              onClick={() => setFilterType(chip.id as 'all' | 'songs' | 'artists' | 'albums')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                isSelected ? 'shadow-sm' : 'opacity-70 hover:opacity-100'
              }`}
              style={{
                backgroundColor: isSelected ? palette.primary : palette.surfaceContainer,
                color: isSelected ? palette.onPrimary : palette.onSurface,
              }}
            >
              {chip.label}
            </button>
          );
        })}
      </div>

      {/* Results or Quick Suggestions */}
      {query.trim().length > 0 ? (
        <div className="space-y-2">
          <div className="text-xs font-bold opacity-60 uppercase tracking-wider mb-2">
            Risultati ({filtered.length})
          </div>

          {filtered.map((track) => {
            const isCurrent = track.id === currentTrackId;
            return (
              <div
                key={track.id}
                onClick={() => onSelectTrack(track)}
                className="flex items-center gap-3.5 p-3 rounded-2xl cursor-pointer transition hover:shadow-sm border border-black/5 active:scale-95"
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
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleFavorite(track.id);
                  }}
                  className="p-2 rounded-full hover:bg-black/10 transition active:scale-90"
                >
                  <Heart
                    className={`w-4 h-4 transition-colors ${
                      track.isFavorite ? 'fill-red-500 text-red-500' : 'opacity-40'
                    }`}
                  />
                </button>
              </div>
            );
          })}

          {filtered.length === 0 && (
            <div className="text-center py-16 opacity-60 text-xs">
              Nessun brano corrisponde a &quot;{query}&quot;. Prova un termine differente.
            </div>
          )}
        </div>
      ) : (
        <div>
          <h3 className="text-sm font-bold opacity-75 mb-3">Esplora per genere</h3>
          <div className="flex flex-wrap gap-2 mb-6">
            {quickGenres.map((genre) => (
              <button
                key={genre}
                onClick={() => setQuery(genre)}
                className="px-4 py-2 rounded-2xl text-xs font-bold transition hover:scale-105"
                style={{
                  backgroundColor: palette.surfaceContainer,
                  color: palette.onSurface,
                }}
              >
                {genre}
              </button>
            ))}
          </div>

          <div
            className="p-5 rounded-[24px] text-center text-xs opacity-70"
            style={{ backgroundColor: palette.surfaceContainer }}
          >
            Inizia a digitare per trovare istantaneamente qualsiasi file musicale locale indicizzato.
          </div>
        </div>
      )}
    </div>
  );
};
