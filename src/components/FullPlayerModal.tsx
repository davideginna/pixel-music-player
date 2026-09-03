import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ChevronDown,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Repeat1,
  Heart,
  ListMusic,
  Sliders,
  Mic2,
  Share2,
  Headphones,
  Smartphone,
  Info,
  MoreVertical,
} from 'lucide-react';
import { DynamicPalette, EqualizerSettings, RepeatMode, Track } from '../types';
import { QueueDrawer } from './QueueDrawer';
import { EqualizerModal } from './EqualizerModal';
import { LyricsDrawer } from './LyricsDrawer';
import { audioEngine } from '../services/audioEngine';

interface FullPlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  track: Track | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  isShuffle: boolean;
  repeatMode: RepeatMode;
  queue: string[];
  allTracks: Track[];
  palette: DynamicPalette;
  equalizerSettings: EqualizerSettings;
  audioOutputRoute: 'speaker' | 'pixel_buds' | 'headphones';
  onTogglePlay: () => void;
  onNext: () => void;
  onPrev: () => void;
  onSeek: (time: number) => void;
  onToggleShuffle: () => void;
  onToggleRepeat: () => void;
  onToggleFavorite: (trackId: string) => void;
  onSelectTrack: (track: Track) => void;
  onRemoveFromQueue: (trackId: string) => void;
  onClearQueue: () => void;
  onUpdateEqualizer: (settings: EqualizerSettings) => void;
  onChangeAudioOutputRoute: (route: 'speaker' | 'pixel_buds' | 'headphones') => void;
}

export const FullPlayerModal: React.FC<FullPlayerModalProps> = ({
  isOpen,
  onClose,
  track,
  isPlaying,
  currentTime,
  duration,
  isShuffle,
  repeatMode,
  queue,
  allTracks,
  palette,
  equalizerSettings,
  audioOutputRoute,
  onTogglePlay,
  onNext,
  onPrev,
  onSeek,
  onToggleShuffle,
  onToggleRepeat,
  onToggleFavorite,
  onSelectTrack,
  onRemoveFromQueue,
  onClearQueue,
  onUpdateEqualizer,
  onChangeAudioOutputRoute,
}) => {
  const [isQueueOpen, setIsQueueOpen] = useState(false);
  const [isEqualizerOpen, setIsEqualizerOpen] = useState(false);
  const [isLyricsOpen, setIsLyricsOpen] = useState(false);
  const [isRouteMenuOpen, setIsRouteMenuOpen] = useState(false);
  const [visualizerBars, setVisualizerBars] = useState<number[]>([12, 24, 18, 30, 20, 16, 28, 14]);

  // Read visualizer data from AudioEngine during playback
  useEffect(() => {
    if (!isPlaying || !isOpen) return;

    const interval = setInterval(() => {
      const data = audioEngine.getVisualizerData();
      if (data && data.length >= 8) {
        const sample = [
          data[1] || 12,
          data[3] || 24,
          data[5] || 18,
          data[7] || 30,
          data[9] || 22,
          data[11] || 16,
          data[13] || 28,
          data[15] || 14,
        ].map((val) => Math.max(8, Math.min(48, Math.round(val / 5))));
        setVisualizerBars(sample);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [isPlaying, isOpen]);

  if (!isOpen || !track) return null;

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const isGeometric = palette.id === 'geometric_balance';
  const isGemini = palette.id === 'gemini';
  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;
  const queueTracks = queue
    .map((id) => allTracks.find((t) => t.id === id))
    .filter((t): t is Track => !!t);

  const modalBg = isGeometric ? '#21005D' : isGemini ? '#131314' : palette.surface;
  const modalText = isGeometric || isGemini ? '#FFFFFF' : palette.onSurface;
  const auraColor = isGeometric ? '#6750A4' : isGemini ? '#1A73E8' : palette.primary;
  const accentColor = isGeometric ? '#D0BCFF' : isGemini ? '#8AB4F8' : palette.primary;
  const fabBg = isGeometric
    ? '#D0BCFF'
    : isGemini
    ? 'linear-gradient(135deg, #8AB4F8 0%, #C5B4E3 100%)'
    : palette.primary;
  const fabText = isGeometric ? '#21005D' : isGemini ? '#041E49' : palette.onPrimary;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: '100%', opacity: 0.9 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: '100%', opacity: 0.9 }}
        transition={{ type: 'spring', damping: 30, stiffness: 320 }}
        className="fixed inset-0 z-40 flex flex-col justify-between overflow-hidden select-none transition-colors duration-500"
        style={{
          backgroundColor: modalBg,
          color: modalText,
        }}
        id="pixel-full-player-modal"
      >
        {/* Soft atmospheric dynamic ambient aura behind cover */}
        <div
          className="absolute -top-32 left-1/2 -translate-x-1/2 w-[120%] h-96 rounded-full opacity-25 blur-[90px] pointer-events-none transition-all duration-700"
          style={{ backgroundColor: auraColor }}
        />

        {/* Top App Bar */}
        <div className="w-full px-6 pt-4 pb-2 flex items-center justify-between z-10">
          <button
            id="full-player-dismiss-btn"
            onClick={onClose}
            className="p-2.5 -ml-2 rounded-full hover:bg-black/5 active:scale-95 transition"
            title="Chiudi player"
          >
            <ChevronDown className="w-6 h-6 opacity-85" />
          </button>

          <div className="text-center">
            <span className="text-[10px] uppercase font-bold tracking-widest opacity-60 block">
              In riproduzione
            </span>
            <span className="text-xs font-semibold opacity-90 truncate max-w-[180px] inline-block">
              {track.album || 'Pixel Music'}
            </span>
          </div>

          <div className="relative">
            <button
              onClick={() => setIsRouteMenuOpen(!isRouteMenuOpen)}
              className="p-2.5 -mr-2 rounded-full hover:bg-black/5 active:scale-95 transition"
              title="Dispositivo audio di output"
            >
              <MoreVertical className="w-5 h-5 opacity-85" />
            </button>

            {/* Audio Route Selector Popover */}
            {isRouteMenuOpen && (
              <div
                className="absolute right-0 top-12 w-56 rounded-2xl p-2 shadow-2xl z-50 border border-black/10"
                style={{
                  backgroundColor: palette.surfaceContainerHigh,
                  color: palette.onSurface,
                }}
              >
                <div className="px-3 py-1.5 text-[11px] font-bold uppercase opacity-60 tracking-wider">
                  Uscita Audio
                </div>
                <button
                  onClick={() => {
                    onChangeAudioOutputRoute('pixel_buds');
                    setIsRouteMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition ${
                    audioOutputRoute === 'pixel_buds' ? 'bg-black/10 font-bold' : 'hover:bg-black/5'
                  }`}
                >
                  <Headphones className="w-4 h-4" />
                  <span>Pixel Buds Pro (Attivo)</span>
                </button>
                <button
                  onClick={() => {
                    onChangeAudioOutputRoute('speaker');
                    setIsRouteMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition ${
                    audioOutputRoute === 'speaker' ? 'bg-black/10 font-bold' : 'hover:bg-black/5'
                  }`}
                >
                  <Smartphone className="w-4 h-4" />
                  <span>Altoparlante Pixel</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Center Artwork Container */}
        <div className="flex-1 flex flex-col items-center justify-center px-8 py-2 z-10">
          <motion.div
            className={`relative w-64 h-64 sm:w-80 sm:h-80 ${
              isGemini
                ? 'rounded-[52px] sm:rounded-[64px] bg-gradient-to-br from-[#8AB4F8] via-[#7C3AED] to-[#D96570] p-3'
                : isGeometric
                ? 'rounded-[52px] sm:rounded-[64px] bg-gradient-to-br from-[#D0BCFF] to-[#6750A4] p-3'
                : 'rounded-[32px]'
            } overflow-hidden shadow-2xl border border-white/15`}
            animate={{
              scale: isPlaying ? [1, 1.015, 1] : 0.98,
            }}
            transition={{
              repeat: isPlaying ? Infinity : 0,
              duration: 4,
              ease: 'easeInOut',
            }}
          >
            <img
              src={track.coverUrl}
              alt={track.title}
              className={`w-full h-full object-cover select-none pointer-events-none ${
                isGeometric || isGemini ? 'rounded-[40px] sm:rounded-[52px]' : 'rounded-none'
              }`}
            />
          </motion.div>

          {/* Audio Visualizer Wave */}
          <div className="flex items-center gap-1.5 h-6 mt-4 opacity-75">
            {visualizerBars.map((height, i) => (
              <div
                key={i}
                className="w-1 rounded-full transition-all duration-100"
                style={{
                  height: isPlaying ? `${height}px` : '4px',
                  backgroundColor: accentColor,
                }}
              />
            ))}
          </div>
        </div>

        {/* Bottom Panel: Track Info, Scrubber & Controls */}
        <div className="w-full px-7 pb-8 pt-2 z-10 max-w-md mx-auto">
          {/* Title, Artist and Heart Favorite */}
          <div className="flex items-center justify-between mb-5">
            <div className="min-w-0 flex-1 pr-4">
              <h2 className="text-xl sm:text-2xl font-bold truncate tracking-tight">
                {track.title}
              </h2>
              <p className="text-sm sm:text-base opacity-75 truncate mt-0.5 font-medium">
                {track.artist}
              </p>
              <div className="flex items-center gap-2 mt-1">
                {track.format && (
                  <span className="text-[10px] uppercase font-bold tracking-wider opacity-60 px-2 py-0.5 rounded-full bg-black/5 dark:bg-white/10">
                    {track.format}
                  </span>
                )}
                {track.genre && (
                  <span className="text-[10px] uppercase font-bold tracking-wider opacity-60 px-2 py-0.5 rounded-full bg-black/5 dark:bg-white/10">
                    {track.genre}
                  </span>
                )}
              </div>
            </div>

            <button
              id="full-player-favorite-btn"
              onClick={() => onToggleFavorite(track.id)}
              className="p-3 rounded-full hover:bg-black/5 active:scale-90 transition"
              title={track.isFavorite ? 'Rimuovi dai preferiti' : 'Aggiungi ai preferiti'}
            >
              <Heart
                className={`w-6 h-6 transition-colors ${
                  track.isFavorite ? 'fill-red-500 text-red-500' : 'opacity-80'
                }`}
                style={{
                  color: track.isFavorite ? undefined : accentColor,
                }}
              />
            </button>
          </div>

          {/* Interactive Progress Slider */}
          <div className="mb-4">
            <div className="relative h-6 flex items-center">
              <input
                id="full-player-scrubber"
                type="range"
                min={0}
                max={duration || 100}
                value={currentTime}
                onChange={(e) => onSeek(Number(e.target.value))}
                className="w-full h-2 rounded-full appearance-none cursor-pointer accent-current"
                style={{
                  color: accentColor,
                  background: `linear-gradient(to right, ${accentColor} ${progressPercent}%, rgba(255,255,255,0.2) ${progressPercent}%)`,
                }}
              />
            </div>
            <div className="flex justify-between text-xs font-semibold opacity-70 tracking-wide font-mono">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Main Playback Controls: Shuffle, Prev, Play/Pause, Next, Repeat */}
          <div className="flex items-center justify-between py-2 mb-6">
            <button
              id="full-player-shuffle-btn"
              onClick={onToggleShuffle}
              className={`p-3 rounded-full transition active:scale-90 ${
                isShuffle ? 'font-bold' : 'opacity-60'
              }`}
              style={{
                color: isShuffle ? accentColor : undefined,
                backgroundColor: isShuffle ? (isGeometric || isGemini ? 'rgba(255,255,255,0.15)' : palette.secondaryContainer) : 'transparent',
              }}
              title={isShuffle ? 'Riproduzione casuale attiva' : 'Riproduzione sequenziale'}
            >
              <Shuffle className="w-5 h-5" />
            </button>

            <button
              id="full-player-prev-btn"
              onClick={onPrev}
              className="p-3 rounded-full hover:bg-black/5 active:scale-90 transition"
              title="Brano precedente"
            >
              <SkipBack className="w-6 h-6 fill-current opacity-90" />
            </button>

            {/* Big Material 3 Primary Play Button */}
            <button
              id="full-player-play-btn"
              onClick={onTogglePlay}
              className="w-20 h-20 rounded-full flex items-center justify-center shadow-xl active:scale-95 transition-transform"
              style={{
                background: fabBg,
                color: fabText,
              }}
              title={isPlaying ? 'Pausa' : 'Riproduci'}
            >
              {isPlaying ? (
                <Pause className="w-8 h-8 fill-current" />
              ) : (
                <Play className="w-8 h-8 fill-current ml-1" />
              )}
            </button>

            <button
              id="full-player-next-btn"
              onClick={onNext}
              className="p-3 rounded-full hover:bg-black/5 active:scale-90 transition"
              title="Brano successivo"
            >
              <SkipForward className="w-6 h-6 fill-current opacity-90" />
            </button>

            <button
              id="full-player-repeat-btn"
              onClick={onToggleRepeat}
              className={`p-3 rounded-full transition active:scale-90 ${
                repeatMode !== 'off' ? 'font-bold' : 'opacity-60'
              }`}
              style={{
                color: repeatMode !== 'off' ? palette.primary : undefined,
                backgroundColor: repeatMode !== 'off' ? palette.secondaryContainer : 'transparent',
              }}
              title={`Ripeti: ${repeatMode}`}
            >
              {repeatMode === 'one' ? <Repeat1 className="w-5 h-5" /> : <Repeat className="w-5 h-5" />}
            </button>
          </div>

          {/* Auxiliary Row: Equalizer, Lyrics, Queue, Device Output */}
          <div className="flex items-center justify-around pt-2 border-t border-black/5">
            <button
              id="full-player-eq-btn"
              onClick={() => setIsEqualizerOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold hover:bg-black/5 transition"
              title="Apri Equalizzatore"
            >
              <Sliders className="w-4 h-4 opacity-75" />
              <span className="hidden sm:inline">EQ</span>
            </button>

            <button
              id="full-player-lyrics-btn"
              onClick={() => setIsLyricsOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold hover:bg-black/5 transition"
              title="Visualizza Testo"
            >
              <Mic2 className="w-4 h-4 opacity-75" />
              <span className="hidden sm:inline">Testo</span>
            </button>

            <button
              id="full-player-queue-btn"
              onClick={() => setIsQueueOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold hover:bg-black/5 transition"
              title="Visualizza Coda"
            >
              <ListMusic className="w-4 h-4 opacity-75" />
              <span>Coda ({queue.length})</span>
            </button>
          </div>
        </div>

        {/* Drawers */}
        <QueueDrawer
          isOpen={isQueueOpen}
          onClose={() => setIsQueueOpen(false)}
          queueTracks={queueTracks}
          currentTrackId={track.id}
          onSelectTrack={(t) => {
            onSelectTrack(t);
            setIsQueueOpen(false);
          }}
          onRemoveFromQueue={onRemoveFromQueue}
          onClearQueue={onClearQueue}
          palette={palette}
        />

        <EqualizerModal
          isOpen={isEqualizerOpen}
          onClose={() => setIsEqualizerOpen(false)}
          settings={equalizerSettings}
          onUpdateSettings={onUpdateEqualizer}
          palette={palette}
        />

        <LyricsDrawer
          isOpen={isLyricsOpen}
          onClose={() => setIsLyricsOpen(false)}
          track={track}
          currentTime={currentTime}
          palette={palette}
        />
      </motion.div>
    </AnimatePresence>
  );
};
