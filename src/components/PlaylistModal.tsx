import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ListMusic, Play, Trash2, Plus, Music } from 'lucide-react';
import { DynamicPalette, Playlist, Track } from '../types';

interface PlaylistModalProps {
  playlist: Playlist | null;
  isOpen: boolean;
  onClose: () => void;
  allTracks: Track[];
  palette: DynamicPalette;
  onPlayPlaylist: (playlist: Playlist) => void;
  onSavePlaylist: (playlist: Playlist) => void;
  onDeletePlaylist: (id: string) => void;
}

export const PlaylistModal: React.FC<PlaylistModalProps> = ({
  playlist,
  isOpen,
  onClose,
  allTracks,
  palette,
  onPlayPlaylist,
  onSavePlaylist,
  onDeletePlaylist,
}) => {
  const [title, setTitle] = useState(playlist?.title || '');
  const [description, setDescription] = useState(playlist?.description || '');
  const [selectedTrackIds, setSelectedTrackIds] = useState<string[]>(playlist?.trackIds || []);
  const [isEditingTracks, setIsEditingTracks] = useState(false);

  if (!isOpen) return null;

  const isCreating = !playlist || playlist.id.startsWith('new-');

  const playlistTracks = selectedTrackIds
    .map((id) => allTracks.find((t) => t.id === id))
    .filter((t): t is Track => !!t);

  const handleSave = () => {
    if (!title.trim()) return;

    const newPl: Playlist = {
      id: playlist?.id || `pl-${Date.now()}`,
      title: title.trim(),
      description: description.trim(),
      coverUrl: playlistTracks[0]?.coverUrl || allTracks[0]?.coverUrl,
      trackIds: selectedTrackIds,
      createdAt: playlist?.createdAt || Date.now(),
      updatedAt: Date.now(),
    };

    onSavePlaylist(newPl);
    onClose();
  };

  const toggleTrackSelection = (trackId: string) => {
    if (selectedTrackIds.includes(trackId)) {
      setSelectedTrackIds(selectedTrackIds.filter((id) => id !== trackId));
    } else {
      setSelectedTrackIds([...selectedTrackIds, trackId]);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 28, stiffness: 300 }}
          className="w-full max-h-[85vh] rounded-t-[32px] p-6 flex flex-col shadow-2xl select-none"
          style={{
            backgroundColor: palette.surfaceContainerHigh,
            color: palette.onSurface,
          }}
          id="pixel-playlist-modal"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-black/10">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ backgroundColor: palette.primaryContainer, color: palette.onPrimaryContainer }}
              >
                <ListMusic className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold">
                  {isCreating ? 'Nuova Playlist' : playlist.title}
                </h3>
                <p className="text-xs opacity-70">{selectedTrackIds.length} brani inseriti</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {!isCreating && playlist && (
                <button
                  onClick={() => {
                    if (confirm('Vuoi eliminare questa playlist?')) {
                      onDeletePlaylist(playlist.id);
                      onClose();
                    }
                  }}
                  className="p-2 rounded-full hover:bg-red-500/10 text-red-500 transition"
                  title="Elimina playlist"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              )}
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-black/10 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Form / Content */}
          <div className="overflow-y-auto py-4 space-y-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider opacity-70 block mb-1">
                Nome Playlist
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Es. Allenamento, Viaggio, Focus..."
                className="w-full px-4 py-2.5 rounded-xl border border-black/10 text-sm font-semibold outline-none focus:ring-2 focus:ring-current"
                style={{
                  backgroundColor: palette.surfaceContainer,
                  color: palette.onSurface,
                }}
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider opacity-70 block mb-1">
                Descrizione facoltativa
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Breve descrizione..."
                className="w-full px-4 py-2.5 rounded-xl border border-black/10 text-xs font-medium outline-none focus:ring-2 focus:ring-current"
                style={{
                  backgroundColor: palette.surfaceContainer,
                  color: palette.onSurface,
                }}
              />
            </div>

            {/* Quick Play Button if existing */}
            {!isCreating && playlist && selectedTrackIds.length > 0 && (
              <button
                onClick={() => {
                  onPlayPlaylist(playlist);
                  onClose();
                }}
                className="w-full py-3 rounded-2xl flex items-center justify-center gap-2 text-xs font-bold shadow-sm transition active:scale-95"
                style={{
                  backgroundColor: palette.primary,
                  color: palette.onPrimary,
                }}
              >
                <Play className="w-4 h-4 fill-current ml-0.5" />
                <span>Riproduci tutti i brani</span>
              </button>
            )}

            {/* Tracks Section */}
            <div className="pt-2">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider opacity-70">
                  Brani ({selectedTrackIds.length})
                </span>
                <button
                  onClick={() => setIsEditingTracks(!isEditingTracks)}
                  className="text-xs font-bold"
                  style={{ color: palette.primary }}
                >
                  {isEditingTracks ? 'Fatto' : '+ Aggiungi / Modifica brani'}
                </button>
              </div>

              {isEditingTracks ? (
                <div className="max-h-60 overflow-y-auto space-y-1 p-2 rounded-2xl bg-black/5">
                  {allTracks.map((t) => {
                    const isSelected = selectedTrackIds.includes(t.id);
                    return (
                      <div
                        key={t.id}
                        onClick={() => toggleTrackSelection(t.id)}
                        className={`flex items-center justify-between p-2 rounded-xl cursor-pointer transition text-xs ${
                          isSelected ? 'font-bold bg-black/10' : 'hover:bg-black/5 opacity-80'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <img src={t.coverUrl} alt={t.title} className="w-8 h-8 rounded-lg object-cover" />
                          <div className="truncate">
                            <p className="truncate">{t.title}</p>
                            <p className="text-[10px] opacity-60 truncate">{t.artist}</p>
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          readOnly
                          className="w-4 h-4 rounded cursor-pointer accent-current"
                          style={{ color: palette.primary }}
                        />
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="space-y-1.5 max-h-52 overflow-y-auto">
                  {playlistTracks.map((t, index) => (
                    <div
                      key={t.id}
                      className="flex items-center gap-3 p-2 rounded-xl bg-black/5 text-xs"
                    >
                      <span className="w-4 text-center opacity-50 font-mono">{index + 1}</span>
                      <img src={t.coverUrl} alt={t.title} className="w-8 h-8 rounded-lg object-cover" />
                      <div className="flex-1 min-w-0">
                        <p className="font-bold truncate">{t.title}</p>
                        <p className="text-[10px] opacity-70 truncate">{t.artist}</p>
                      </div>
                    </div>
                  ))}
                  {playlistTracks.length === 0 && (
                    <p className="text-center py-6 text-xs opacity-50">
                      Nessun brano nella playlist. Clicca &quot;+ Aggiungi / Modifica brani&quot; sopra.
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Save Button */}
            <div className="pt-3">
              <button
                onClick={handleSave}
                disabled={!title.trim()}
                className="w-full py-3 rounded-2xl text-xs font-bold shadow-sm transition active:scale-95 disabled:opacity-40"
                style={{
                  backgroundColor: palette.primary,
                  color: palette.onPrimary,
                }}
              >
                Salva Playlist
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
