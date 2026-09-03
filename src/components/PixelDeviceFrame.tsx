import React from 'react';
import { motion } from 'motion/react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Heart,
  Maximize2,
  MoreVertical,
  Disc,
  Sparkles,
} from 'lucide-react';
import { DynamicPalette, RepeatMode, Track } from '../types';

interface PixelDeviceFrameProps {
  children: React.ReactNode;
  showFrame: boolean;
  palette: DynamicPalette;
  currentTrack?: Track | null;
  isPlaying?: boolean;
  currentTime?: number;
  duration?: number;
  isShuffle?: boolean;
  repeatMode?: RepeatMode;
  onTogglePlay?: (e?: React.MouseEvent) => void;
  onNext?: (e?: React.MouseEvent) => void;
  onPrev?: (e?: React.MouseEvent) => void;
  onSeek?: (time: number) => void;
  onToggleShuffle?: () => void;
  onToggleRepeat?: () => void;
  onToggleFavorite?: (trackId: string, e?: React.MouseEvent) => void;
  onOpenFullPlayer?: () => void;
}

export const PixelDeviceFrame: React.FC<PixelDeviceFrameProps> = ({
  children,
  showFrame,
  palette,
  currentTrack,
  isPlaying = false,
  currentTime = 0,
  duration = 180,
  isShuffle = false,
  repeatMode = 'off',
  onTogglePlay,
  onNext,
  onPrev,
  onSeek,
  onToggleShuffle,
  onToggleRepeat,
  onToggleFavorite,
  onOpenFullPlayer,
}) => {
  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds < 0) return '0:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const progressPercent = duration > 0 ? Math.min(100, (currentTime / duration) * 100) : 0;
  const isGeometric = palette.id === 'geometric_balance';
  const isGemini = palette.id === 'gemini';

  const viewportBg = isGeometric ? '#EADDFF' : isGemini ? '#0C0E14' : '#120F1D';
  const rightPaneBg = isGeometric ? '#21005D' : isGemini ? '#131314' : '#1E1B2E';
  const accentColor = isGeometric ? '#D0BCFF' : isGemini ? '#8AB4F8' : palette.primary;
  const fabBg = isGeometric
    ? '#D0BCFF'
    : isGemini
    ? 'linear-gradient(135deg, #8AB4F8 0%, #C5B4E3 100%)'
    : palette.primary;
  const fabText = isGeometric ? '#21005D' : isGemini ? '#041E49' : palette.onPrimary;

  if (!showFrame) {
    return (
      <div
        className="w-full h-screen overflow-hidden flex flex-col relative transition-colors duration-500"
        style={{
          backgroundColor: palette.surface,
          color: palette.onSurface,
        }}
      >
        {children}
      </div>
    );
  }

  return (
    <div
      id="geometric-balance-viewport"
      className="w-full min-h-screen flex items-center justify-center p-3 sm:p-6 overflow-hidden transition-colors duration-500 font-sans"
      style={{
        backgroundColor: viewportBg,
        color: '#1D1B20',
      }}
    >
      <div className="flex w-full max-w-[960px] h-[92vh] max-h-[890px] gap-6 xl:gap-10 items-stretch justify-center">
        {/* LEFT PANE: Pixel Handset with Full Native App inside */}
        <div
          id="pixel-chassis-left"
          className="relative w-full max-w-[400px] lg:w-[380px] xl:w-[390px] shrink-0 rounded-[48px] border-[10px] border-[#1D1B20] overflow-hidden flex flex-col shadow-2xl transition-all duration-300"
          style={{
            backgroundColor: palette.surface,
            color: palette.onSurface,
            boxShadow: isGemini
              ? '0 25px 60px -15px rgba(66, 133, 244, 0.25), 0 0 0 1px rgba(138, 180, 248, 0.2)'
              : '0 25px 60px -15px rgba(29, 27, 32, 0.45), 0 0 0 1px rgba(29, 27, 32, 0.1)',
          }}
        >
          {/* Subtle Pixel Hardware Button simulations on outer edge */}
          <div className="absolute -left-[14px] top-28 w-1.5 h-12 bg-[#1D1B20] rounded-l-md pointer-events-none" />
          <div className="absolute -left-[14px] top-44 w-1.5 h-20 bg-[#1D1B20] rounded-l-md pointer-events-none" />
          <div className="absolute -right-[14px] top-36 w-1.5 h-16 bg-[#1D1B20] rounded-r-md pointer-events-none" />

          {/* Screen Content */}
          <div className="relative w-full h-full overflow-hidden flex flex-col">
            {children}
          </div>
        </div>

        {/* RIGHT PANE: Geometric Balance / Gemini Companion "Now Playing" Pane (on wide screens) */}
        <div
          id="geometric-balance-right-pane"
          className="hidden lg:flex flex-1 rounded-[48px] border-[10px] border-[#1D1B20] overflow-hidden flex-col p-8 xl:p-10 text-white shadow-2xl justify-between relative select-none transition-all duration-300"
          style={{
            backgroundColor: rightPaneBg,
            boxShadow: isGemini
              ? '0 25px 60px -15px rgba(27, 114, 232, 0.35), 0 0 0 1px rgba(138, 180, 248, 0.15)'
              : '0 25px 60px -15px rgba(33, 0, 93, 0.5), 0 0 0 1px rgba(29, 27, 32, 0.1)',
          }}
        >
          {/* Top Bar */}
          <div className="flex justify-between items-center w-full">
            <button
              onClick={onOpenFullPlayer}
              className="bg-white/10 hover:bg-white/20 p-3 rounded-full transition active:scale-90 cursor-pointer"
              title="Espandi lettore a schermo intero"
            >
              <Maximize2 className="w-5 h-5 text-white" />
            </button>
            <div className="flex items-center gap-2">
              {isGemini ? (
                <>
                  <Sparkles className="w-4 h-4 text-[#8AB4F8] animate-pulse" />
                  <span className="text-xs font-bold tracking-[0.2em] uppercase text-[#8AB4F8]">
                    Gemini Aurora
                  </span>
                </>
              ) : (
                <>
                  <span className="w-2 h-2 rounded-full bg-[#D0BCFF] animate-pulse" />
                  <span className="text-xs font-bold tracking-[0.2em] uppercase text-[#D0BCFF]">
                    Now Playing
                  </span>
                </>
              )}
            </div>
            <button
              onClick={onOpenFullPlayer}
              className="bg-white/10 hover:bg-white/20 p-3 rounded-full transition active:scale-90 cursor-pointer"
              title="Dettagli e opzioni"
            >
              <MoreVertical className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Center Showcase: Geometric / Gemini Vinyl / Cover */}
          <div className="flex-1 flex flex-col items-center justify-center my-4">
            <motion.div
              onClick={onOpenFullPlayer}
              className={`w-[260px] h-[260px] xl:w-[300px] xl:h-[300px] ${
                isGemini
                  ? 'bg-gradient-to-br from-[#8AB4F8] via-[#7C3AED] to-[#D96570]'
                  : 'bg-gradient-to-br from-[#D0BCFF] to-[#6750A4]'
              } rounded-[52px] xl:rounded-[64px] shadow-2xl mb-8 flex items-center justify-center p-6 xl:p-7 overflow-hidden relative cursor-pointer group`}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              {currentTrack?.coverUrl ? (
                <div className="relative w-full h-full rounded-[40px] xl:rounded-[48px] overflow-hidden shadow-inner flex items-center justify-center">
                  <img
                    src={currentTrack.coverUrl}
                    alt={currentTrack.title}
                    className={`w-full h-full object-cover transition-transform duration-700 ${
                      isPlaying ? 'scale-105' : 'scale-100'
                    }`}
                  />
                  {/* Subtle vinyl groove overlay */}
                  <div className="absolute inset-0 bg-black/20 rounded-full border-[14px] border-white/10 pointer-events-none flex items-center justify-center">
                    <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center shadow-md">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: rightPaneBg }}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="w-full h-full bg-black/20 rounded-full flex items-center justify-center border-[20px] border-white/10">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg">
                    <Disc className="w-8 h-8" style={{ color: rightPaneBg }} />
                  </div>
                </div>
              )}
            </motion.div>

            {/* Track Info */}
            <div className="w-full text-center px-4">
              <h3 className="text-3xl xl:text-4xl font-extrabold tracking-tight mb-2 truncate max-w-sm mx-auto text-white">
                {currentTrack?.title || 'Seleziona un brano'}
              </h3>
              <p className="text-lg xl:text-xl font-medium text-white/70 truncate max-w-sm mx-auto">
                {currentTrack?.artist || 'Pixel Music Player'}
              </p>
              {currentTrack?.album && (
                <p
                  className="text-xs font-semibold tracking-wider uppercase mt-1 opacity-85"
                  style={{ color: accentColor }}
                >
                  {currentTrack.album}
                </p>
              )}
            </div>
          </div>

          {/* Scrubber / Progress Bar */}
          <div className="w-full mb-6 px-2">
            <div
              className="relative h-2 bg-white/20 hover:bg-white/30 rounded-full mb-2.5 cursor-pointer flex items-center transition-colors"
              onClick={(e) => {
                if (!onSeek) return;
                const rect = e.currentTarget.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                const ratio = Math.max(0, Math.min(1, clickX / rect.width));
                onSeek(ratio * duration);
              }}
            >
              <div
                className="absolute h-full rounded-full flex items-center justify-end"
                style={{
                  width: `${progressPercent}%`,
                  backgroundColor: accentColor,
                }}
              >
                <div
                  className="w-4 h-4 bg-white rounded-full -mr-2 shadow-lg ring-2 ring-black/20"
                />
              </div>
            </div>
            <div className="flex justify-between text-xs font-mono font-medium text-white/60 tracking-wider">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between px-4 mb-2">
            <button
              onClick={onToggleShuffle}
              className={`p-2.5 rounded-full transition active:scale-90 cursor-pointer ${
                isShuffle ? 'font-bold' : 'text-white/50 hover:text-white'
              }`}
              style={{ color: isShuffle ? accentColor : undefined }}
              title={isShuffle ? 'Casuale attivo' : 'Casuale disattivato'}
            >
              <Shuffle className="w-6 h-6" />
            </button>

            <button
              onClick={onPrev}
              className="p-2.5 rounded-full text-white hover:scale-110 active:scale-90 transition cursor-pointer"
              title="Precedente"
            >
              <SkipBack className="w-8 h-8 fill-current" />
            </button>

            {/* Oversized Primary FAB Button */}
            <button
              onClick={onTogglePlay}
              className="w-20 h-20 rounded-full flex items-center justify-center shadow-xl hover:scale-105 active:scale-95 transition-transform cursor-pointer"
              style={{
                background: fabBg,
                color: fabText,
              }}
              title={isPlaying ? 'Pausa' : 'Riproduci'}
            >
              {isPlaying ? (
                <Pause className="w-9 h-9 fill-current" />
              ) : (
                <Play className="w-9 h-9 fill-current ml-1" />
              )}
            </button>

            <button
              onClick={onNext}
              className="p-2.5 rounded-full text-white hover:scale-110 active:scale-90 transition cursor-pointer"
              title="Successivo"
            >
              <SkipForward className="w-8 h-8 fill-current" />
            </button>

            <button
              onClick={(e) => {
                if (currentTrack && onToggleFavorite) {
                  onToggleFavorite(currentTrack.id, e);
                }
              }}
              className="p-2.5 rounded-full transition active:scale-90 cursor-pointer"
              title={currentTrack?.isFavorite ? 'Rimuovi dai preferiti' : 'Aggiungi ai preferiti'}
            >
              <Heart
                className={`w-6 h-6 transition-colors ${
                  currentTrack?.isFavorite
                    ? 'fill-red-400 text-red-400'
                    : 'hover:opacity-100 opacity-80'
                }`}
                style={{
                  color: currentTrack?.isFavorite ? undefined : accentColor,
                }}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
