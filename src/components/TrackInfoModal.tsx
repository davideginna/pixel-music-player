import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Info, Music, Disc3, Calendar, FileText, HardDrive, ListPlus, Heart, Trash2 } from 'lucide-react';
import { DynamicPalette, Track } from '../types';
import { ConfirmDialog } from './ConfirmDialog';

interface TrackInfoModalProps {
  track: Track | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToQueue: (track: Track) => void;
  onToggleFavorite: (trackId: string) => void;
  onDeleteTrack: (trackId: string) => void;
  palette: DynamicPalette;
}

export const TrackInfoModal: React.FC<TrackInfoModalProps> = ({
  track,
  isOpen,
  onClose,
  onAddToQueue,
  onToggleFavorite,
  onDeleteTrack,
  palette,
}) => {
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  if (!isOpen || !track) return null;

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <>
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
            id="pixel-track-info-modal"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-black/10">
              <div className="flex items-center gap-3">
                <img
                  src={track.coverUrl}
                  alt={track.title}
                  className="w-12 h-12 rounded-xl object-cover shadow-sm"
                />
                <div className="min-w-0 flex-1">
                  <h3 className="text-base font-bold truncate">{track.title}</h3>
                  <p className="text-xs opacity-75 truncate">{track.artist}</p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-black/10 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-3 gap-2 py-4 border-b border-black/10">
              <button
                onClick={() => {
                  onAddToQueue(track);
                  onClose();
                }}
                className="flex flex-col items-center justify-center p-3 rounded-2xl hover:bg-black/5 transition text-center cursor-pointer"
              >
                <ListPlus className="w-5 h-5 mb-1 opacity-80" />
                <span className="text-[11px] font-semibold">Metti in coda</span>
              </button>

              <button
                onClick={() => {
                  onToggleFavorite(track.id);
                }}
                className="flex flex-col items-center justify-center p-3 rounded-2xl hover:bg-black/5 transition text-center cursor-pointer"
              >
                <Heart
                  className={`w-5 h-5 mb-1 ${
                    track.isFavorite ? 'fill-red-500 text-red-500' : 'opacity-80'
                  }`}
                />
                <span className="text-[11px] font-semibold">
                  {track.isFavorite ? 'Nei Preferiti' : 'Preferito'}
                </span>
              </button>

              <button
                onClick={() => {
                  setShowConfirmDelete(true);
                }}
                className="flex flex-col items-center justify-center p-3 rounded-2xl hover:bg-red-500/10 text-red-500 transition text-center cursor-pointer"
                title="Elimina dalla libreria"
              >
                <Trash2 className="w-5 h-5 mb-1" />
                <span className="text-[11px] font-semibold">Elimina</span>
              </button>
            </div>

            {/* Metadata Table */}
            <div className="overflow-y-auto py-4 space-y-3 text-xs">
              <div className="flex items-center justify-between py-1 border-b border-black/5">
                <span className="opacity-60 flex items-center gap-1.5">
                  <Music className="w-3.5 h-3.5" /> Titolo
                </span>
                <span className="font-semibold text-right">{track.title}</span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-black/5">
                <span className="opacity-60 flex items-center gap-1.5">
                  <Disc3 className="w-3.5 h-3.5" /> Album
                </span>
                <span className="font-semibold text-right">{track.album}</span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-black/5">
                <span className="opacity-60 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5" /> Genere
                </span>
                <span className="font-semibold text-right">{track.genre}</span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-black/5">
                <span className="opacity-60 flex items-center gap-1.5">
                  <HardDrive className="w-3.5 h-3.5" /> Formato & Bitrate
                </span>
                <span className="font-semibold text-right">{track.format || 'MP3 • 320 kbps'}</span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-black/5">
                <span className="opacity-60 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" /> Durata
                </span>
                <span className="font-semibold text-right">{formatTime(track.duration)}</span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-black/5">
                <span className="opacity-60">Riproduzioni</span>
                <span className="font-semibold text-right">{track.playCount} volte</span>
              </div>

              {track.filePath && (
                <div className="py-2">
                  <span className="opacity-60 block mb-1">Percorso di archiviazione:</span>
                  <span className="font-mono text-[10px] break-all opacity-80 block p-2 rounded-xl bg-black/5">
                    {track.filePath}
                  </span>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </AnimatePresence>

      <ConfirmDialog
        isOpen={showConfirmDelete}
        title="Rimuovere brano?"
        description={`Sei sicuro di voler rimuovere "${track.title}" (${track.artist}) dalla tua libreria musicale e dalla coda?`}
        confirmLabel="Elimina"
        cancelLabel="Annulla"
        isDestructive={true}
        onConfirm={() => {
          setShowConfirmDelete(false);
          onDeleteTrack(track.id);
          onClose();
        }}
        onClose={() => setShowConfirmDelete(false)}
        palette={palette}
      />
    </>
  );
};
