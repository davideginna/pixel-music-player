import React from 'react';
import { motion } from 'motion/react';
import { Play, Pause, SkipForward, Heart } from 'lucide-react';
import { DynamicPalette, Track } from '../types';

interface MiniPlayerProps {
  currentTrack: Track | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  palette: DynamicPalette;
  onOpenFullPlayer: () => void;
  onTogglePlay: (e: React.MouseEvent) => void;
  onNext: (e: React.MouseEvent) => void;
  onToggleFavorite: (trackId: string, e: React.MouseEvent) => void;
}

export const MiniPlayer: React.FC<MiniPlayerProps> = ({
  currentTrack,
  isPlaying,
  currentTime,
  duration,
  palette,
  onOpenFullPlayer,
  onTogglePlay,
  onNext,
  onToggleFavorite,
}) => {
  if (!currentTrack) return null;

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="w-full px-3 pb-2 select-none">
      <motion.div
        id="pixel-mini-player"
        onClick={onOpenFullPlayer}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 20, opacity: 0 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="relative w-full rounded-2xl p-3 flex items-center justify-between cursor-pointer shadow-sm overflow-hidden border border-[#CAC4D0]/50 active:scale-[0.99] transition-all"
        style={{
          backgroundColor: palette.primaryContainer,
          color: palette.onPrimaryContainer,
        }}
      >
        {/* Subtle background progress bar on card bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/10 dark:bg-white/10">
          <motion.div
            className="h-full"
            style={{
              width: `${progressPercent}%`,
              backgroundColor: palette.primary,
            }}
            transition={{ duration: 0.2 }}
          />
        </div>

        {/* Left Side: Artwork & Info */}
        <div className="flex items-center gap-3 min-w-0 flex-1 mr-2">
          <div className="relative w-11 h-11 rounded-xl overflow-hidden shadow-inner shrink-0 border border-white/15 bg-[#6750A4]">
            <img
              src={currentTrack.coverUrl}
              alt={currentTrack.title}
              className={`w-full h-full object-cover transition-transform duration-700 ${
                isPlaying ? 'scale-105' : 'scale-100'
              }`}
            />
            {isPlaying && (
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center gap-0.5">
                <span className="w-1 h-3 bg-white rounded-full animate-wave-1" />
                <span className="w-1 h-4 bg-white rounded-full animate-wave-2" />
                <span className="w-1 h-2.5 bg-white rounded-full animate-wave-3" />
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <h4 className="text-xs font-bold truncate leading-tight tracking-tight text-[#21005D] dark:text-[#EADDFF]">
              {currentTrack.title}
            </h4>
            <p className="text-[11px] text-[#49454F] dark:text-[#CAC4D0] truncate mt-0.5 font-medium">
              {currentTrack.artist}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            id="mini-player-fav-btn"
            onClick={(e) => onToggleFavorite(currentTrack.id, e)}
            className="p-2 rounded-full hover:bg-black/10 active:scale-90 transition"
            title={currentTrack.isFavorite ? 'Rimuovi dai preferiti' : 'Aggiungi ai preferiti'}
          >
            <Heart
              className={`w-4 h-4 transition-colors ${
                currentTrack.isFavorite ? 'fill-red-500 text-red-500' : 'opacity-70'
              }`}
            />
          </button>

          <button
            id="mini-player-play-btn"
            onClick={onTogglePlay}
            className="w-10 h-10 rounded-full flex items-center justify-center shadow-sm active:scale-90 transition-transform"
            style={{
              backgroundColor: palette.primary,
              color: palette.onPrimary,
            }}
            title={isPlaying ? 'Pausa' : 'Riproduci'}
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 fill-current" />
            ) : (
              <Play className="w-5 h-5 fill-current ml-0.5" />
            )}
          </button>

          <button
            id="mini-player-next-btn"
            onClick={onNext}
            className="p-2 rounded-full hover:bg-black/10 active:scale-90 transition"
            title="Brano successivo"
          >
            <SkipForward className="w-5 h-5 opacity-85" />
          </button>
        </div>
      </motion.div>
    </div>
  );
};
