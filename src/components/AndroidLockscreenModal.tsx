import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, SkipBack, SkipForward, Heart, Smartphone, Headphones, X } from 'lucide-react';
import { DynamicPalette, Track } from '../types';

interface AndroidLockscreenModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTrack: Track | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  palette: DynamicPalette;
  onTogglePlay: () => void;
  onNext: () => void;
  onPrev: () => void;
  onSeek: (time: number) => void;
  onToggleFavorite: (trackId: string) => void;
}

export const AndroidLockscreenModal: React.FC<AndroidLockscreenModalProps> = ({
  isOpen,
  onClose,
  currentTrack,
  isPlaying,
  currentTime,
  duration,
  palette,
  onTogglePlay,
  onNext,
  onPrev,
  onSeek,
  onToggleFavorite,
}) => {
  if (!isOpen) return null;

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const now = new Date();
  const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  const dateStr = now.toLocaleDateString('it-IT', { weekday: 'short', day: 'numeric', month: 'short' });

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="fixed inset-0 z-50 flex flex-col justify-between bg-black/85 backdrop-blur-xl text-white p-6 select-none"
        id="pixel-lockscreen-modal"
      >
        {/* Top: Close button & Android notification header */}
        <div className="flex items-center justify-between pt-4">
          <div className="flex items-center gap-2 text-neutral-400 text-xs uppercase tracking-widest font-bold">
            <span>Pixel 11 OS • Media Notification</span>
          </div>
          <button
            id="close-lockscreen-btn"
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            title="Chiudi schermata di blocco"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Big Pixel Clock */}
        <div className="my-auto flex flex-col items-center justify-center text-center">
          <div className="text-7xl font-bold tracking-tight mb-1 text-neutral-100 font-sans">
            {timeStr}
          </div>
          <div className="text-sm font-medium text-neutral-300 capitalize tracking-wide">
            {dateStr}
          </div>
        </div>

        {/* Android 13/14/15 Media Player Notification Card */}
        {currentTrack ? (
          <div
            className="w-full max-w-md mx-auto rounded-[28px] p-5 shadow-2xl relative overflow-hidden border border-white/10"
            style={{
              backgroundColor: palette.surfaceContainerHigh,
              color: palette.onSurface,
            }}
          >
            {/* Background ambient art tint */}
            <div
              className="absolute -right-10 -bottom-10 w-44 h-44 rounded-full opacity-25 blur-2xl pointer-events-none"
              style={{ backgroundColor: palette.primary }}
            />

            {/* Top row: Output device switcher chip & favorite */}
            <div className="flex items-center justify-between mb-3 relative z-10">
              <div
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
                style={{
                  backgroundColor: palette.secondaryContainer,
                  color: palette.onSecondaryContainer,
                }}
              >
                <Headphones className="w-3.5 h-3.5" />
                <span>Pixel Buds Pro</span>
              </div>
              <button
                onClick={() => onToggleFavorite(currentTrack.id)}
                className="p-1.5 rounded-full hover:bg-white/10 transition"
              >
                <Heart
                  className={`w-5 h-5 transition-colors ${
                    currentTrack.isFavorite ? 'fill-red-500 text-red-500' : 'text-neutral-400'
                  }`}
                />
              </button>
            </div>

            {/* Track info & Cover */}
            <div className="flex items-center gap-4 relative z-10 mb-4">
              <img
                src={currentTrack.coverUrl}
                alt={currentTrack.title}
                className="w-16 h-16 rounded-2xl object-cover shadow-md border border-white/10 shrink-0"
              />
              <div className="min-w-0 flex-1">
                <h3 className="text-base font-bold truncate">{currentTrack.title}</h3>
                <p className="text-xs opacity-75 truncate">{currentTrack.artist}</p>
                <p className="text-[11px] opacity-50 truncate">{currentTrack.album}</p>
              </div>
            </div>

            {/* Android Signature Wavy Progress Bar */}
            <div className="relative z-10 mb-2">
              <div className="relative h-6 flex items-center cursor-pointer">
                <input
                  type="range"
                  min={0}
                  max={duration || 100}
                  value={currentTime}
                  onChange={(e) => onSeek(Number(e.target.value))}
                  className="w-full h-1.5 appearance-none rounded-full cursor-pointer accent-current"
                  style={{
                    color: palette.primary,
                    background: `linear-gradient(to right, ${palette.primary} ${progressPercent}%, rgba(255,255,255,0.2) ${progressPercent}%)`,
                  }}
                />
              </div>
              <div className="flex justify-between text-[11px] font-semibold opacity-70">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between pt-1 relative z-10">
              <button
                onClick={onPrev}
                className="p-2.5 rounded-full hover:bg-white/10 transition active:scale-95"
                title="Brano precedente"
              >
                <SkipBack className="w-5 h-5" />
              </button>

              <button
                onClick={onTogglePlay}
                className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg active:scale-90 transition-transform"
                style={{
                  backgroundColor: palette.primary,
                  color: palette.onPrimary,
                }}
                title={isPlaying ? 'Pausa' : 'Riproduci'}
              >
                {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-0.5" />}
              </button>

              <button
                onClick={onNext}
                className="p-2.5 rounded-full hover:bg-white/10 transition active:scale-95"
                title="Brano successivo"
              >
                <SkipForward className="w-5 h-5" />
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-6 text-neutral-400 text-sm">
            Nessun brano in riproduzione
          </div>
        )}

        {/* Bottom unlock hint */}
        <div className="text-center pb-3 text-neutral-400 text-xs">
          Tocca la X o la barra inferiore per sbloccare
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
