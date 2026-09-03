import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Play, Music, Trash2, ListMusic } from 'lucide-react';
import { DynamicPalette, Track } from '../types';

interface QueueDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  queueTracks: Track[];
  currentTrackId: string | null;
  onSelectTrack: (track: Track) => void;
  onRemoveFromQueue: (trackId: string) => void;
  onClearQueue: () => void;
  palette: DynamicPalette;
}

export const QueueDrawer: React.FC<QueueDrawerProps> = ({
  isOpen,
  onClose,
  queueTracks,
  currentTrackId,
  onSelectTrack,
  onRemoveFromQueue,
  onClearQueue,
  palette,
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 28, stiffness: 300 }}
          className="w-full max-h-[80vh] rounded-t-[32px] p-6 flex flex-col shadow-2xl select-none"
          style={{
            backgroundColor: palette.surfaceContainerHigh,
            color: palette.onSurface,
          }}
          id="pixel-queue-drawer"
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
                <h3 className="text-lg font-bold">Coda di riproduzione</h3>
                <p className="text-xs opacity-70">{queueTracks.length} brani</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {queueTracks.length > 1 && (
                <button
                  onClick={onClearQueue}
                  className="px-3 py-1.5 rounded-full text-xs font-semibold hover:bg-red-500/10 text-red-500 flex items-center gap-1 transition"
                  title="Svuota la coda"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Svuota</span>
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

          {/* List of tracks in queue */}
          <div className="overflow-y-auto flex-1 py-3 space-y-1.5 max-h-[55vh]">
            {queueTracks.map((track, index) => {
              const isCurrent = track.id === currentTrackId;
              return (
                <div
                  key={`${track.id}-${index}`}
                  className={`flex items-center gap-3 p-2.5 rounded-2xl cursor-pointer transition-colors ${
                    isCurrent ? 'font-bold' : 'hover:bg-black/5 opacity-85'
                  }`}
                  style={{
                    backgroundColor: isCurrent ? palette.secondaryContainer : 'transparent',
                    color: isCurrent ? palette.onSecondaryContainer : palette.onSurface,
                  }}
                  onClick={() => onSelectTrack(track)}
                >
                  <span className="w-5 text-center text-xs opacity-60 font-mono">
                    {index + 1}
                  </span>
                  <img
                    src={track.coverUrl}
                    alt={track.title}
                    className="w-10 h-10 rounded-xl object-cover shadow-sm"
                  />
                  <div className="flex-1 min-w-0">
                    <h5 className="text-sm truncate">{track.title}</h5>
                    <p className="text-xs opacity-75 truncate">{track.artist}</p>
                  </div>
                  {isCurrent && (
                    <span className="px-2 py-0.5 text-[10px] rounded-full uppercase tracking-wider font-bold bg-white/20">
                      In corso
                    </span>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveFromQueue(track.id);
                    }}
                    className="p-1.5 rounded-full hover:bg-black/10 opacity-60 hover:opacity-100"
                    title="Rimuovi dalla coda"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
