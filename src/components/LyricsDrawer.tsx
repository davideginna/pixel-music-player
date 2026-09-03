import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mic2 } from 'lucide-react';
import { DynamicPalette, Track } from '../types';

interface LyricsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  track: Track | null;
  currentTime: number;
  palette: DynamicPalette;
}

export const LyricsDrawer: React.FC<LyricsDrawerProps> = ({
  isOpen,
  onClose,
  track,
  currentTime,
  palette,
}) => {
  if (!isOpen || !track) return null;

  const lines = track.lyrics
    ? track.lyrics.split('\n').filter((l) => l.trim().length > 0)
    : [];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/65 backdrop-blur-md">
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
          id="pixel-lyrics-drawer"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-black/10">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ backgroundColor: palette.primaryContainer, color: palette.onPrimaryContainer }}
              >
                <Mic2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold">Testo del brano</h3>
                <p className="text-xs opacity-70 truncate max-w-[200px]">{track.title}</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-black/10 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Lyrics Content */}
          <div className="overflow-y-auto flex-1 py-6 space-y-5 text-center px-4">
            {lines.length > 0 ? (
              lines.map((line, idx) => {
                // Parse optional timestamp [mm:ss.xx]
                const match = line.match(/^\[(\d+):(\d+\.\d+)\]\s*(.*)$/);
                const text = match ? match[3] : line;
                const lineTime = match ? parseInt(match[1], 10) * 60 + parseFloat(match[2]) : null;
                const isCurrent = lineTime !== null && currentTime >= lineTime && currentTime < lineTime + 20;

                return (
                  <p
                    key={idx}
                    className={`text-lg sm:text-xl font-bold transition-all duration-300 ${
                      isCurrent
                        ? 'scale-105 opacity-100'
                        : 'opacity-40 hover:opacity-80'
                    }`}
                    style={{
                      color: isCurrent ? palette.primary : undefined,
                    }}
                  >
                    {text}
                  </p>
                );
              })
            ) : (
              <div className="py-12 text-center text-sm opacity-60">
                Testo non disponibile per questo file locale.
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
