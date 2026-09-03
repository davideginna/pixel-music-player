import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sliders, Volume2, Sparkles, RotateCcw } from 'lucide-react';
import { DynamicPalette, EqualizerPreset, EqualizerSettings } from '../types';

interface EqualizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: EqualizerSettings;
  onUpdateSettings: (settings: EqualizerSettings) => void;
  palette: DynamicPalette;
}

const PRESETS: Record<EqualizerPreset, { name: string; bands: [number, number, number, number, number]; bassBoost: number }> = {
  flat: { name: 'Piatto', bands: [0, 0, 0, 0, 0], bassBoost: 0 },
  'bass-boost': { name: 'Bassi Rinforzati', bands: [8, 5, 1, 0, 0], bassBoost: 75 },
  vocal: { name: 'Voce Chiara', bands: [-2, 1, 5, 4, 1], bassBoost: 15 },
  rock: { name: 'Rock Energico', bands: [6, 3, -1, 3, 6], bassBoost: 50 },
  pop: { name: 'Pop Brillante', bands: [3, 2, 4, 3, 2], bassBoost: 35 },
  electronic: { name: 'Elettronica / Club', bands: [7, 4, 0, 4, 7], bassBoost: 60 },
};

const FREQ_LABELS = ['60 Hz', '230 Hz', '910 Hz', '3.6 kHz', '14 kHz'];

export const EqualizerModal: React.FC<EqualizerModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  palette,
}) => {
  if (!isOpen) return null;

  const handleToggle = () => {
    onUpdateSettings({ ...settings, enabled: !settings.enabled });
  };

  const handlePresetSelect = (preset: EqualizerPreset) => {
    const p = PRESETS[preset];
    onUpdateSettings({
      ...settings,
      preset,
      bands: [...p.bands],
      bassBoost: p.bassBoost,
    });
  };

  const handleBandChange = (index: number, val: number) => {
    const newBands = [...settings.bands] as [number, number, number, number, number];
    newBands[index] = val;
    onUpdateSettings({
      ...settings,
      preset: 'flat', // custom
      bands: newBands,
    });
  };

  const handleBassBoostChange = (val: number) => {
    onUpdateSettings({
      ...settings,
      bassBoost: val,
    });
  };

  const handleReset = () => {
    handlePresetSelect('flat');
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
          id="pixel-equalizer-modal"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-black/10">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ backgroundColor: palette.primaryContainer, color: palette.onPrimaryContainer }}
              >
                <Sliders className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold">Equalizzatore Pixel</h3>
                <p className="text-xs opacity-70">Elaborazione audio a 5 bande</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleReset}
                className="p-2 rounded-full hover:bg-black/10 transition"
                title="Ripristina valori"
              >
                <RotateCcw className="w-4 h-4 opacity-70" />
              </button>
              {/* Material 3 Switch */}
              <button
                onClick={handleToggle}
                className={`w-12 h-7 rounded-full transition-colors relative p-1 cursor-pointer flex items-center ${
                  settings.enabled ? 'bg-current' : 'bg-neutral-600'
                }`}
                style={{ color: settings.enabled ? palette.primary : undefined }}
                title={settings.enabled ? 'Disattiva equalizzatore' : 'Attiva equalizzatore'}
              >
                <motion.div
                  className="w-5 h-5 rounded-full bg-white shadow-sm"
                  animate={{ x: settings.enabled ? 20 : 0 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              </button>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-black/10 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="overflow-y-auto py-4 space-y-6">
            {/* Presets Chips */}
            <div>
              <span className="text-xs font-bold uppercase tracking-wider opacity-70 block mb-2">
                Preset audio
              </span>
              <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                {(Object.keys(PRESETS) as EqualizerPreset[]).map((key) => {
                  const isSelected = settings.preset === key;
                  return (
                    <button
                      key={key}
                      onClick={() => handlePresetSelect(key)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                        isSelected ? 'shadow-sm font-bold' : 'opacity-70 hover:opacity-100'
                      }`}
                      style={{
                        backgroundColor: isSelected ? palette.primary : palette.surfaceContainer,
                        color: isSelected ? palette.onPrimary : palette.onSurface,
                      }}
                    >
                      {PRESETS[key].name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 5-Band Slider Vertical Sliders */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-bold uppercase tracking-wider opacity-70">
                  Bande di frequenza
                </span>
                <span className="text-xs font-mono opacity-50">+12 dB / -12 dB</span>
              </div>

              <div className="grid grid-cols-5 gap-2 h-44 items-center px-2 py-3 rounded-2xl bg-black/5">
                {settings.bands.map((gain, index) => (
                  <div key={index} className="flex flex-col items-center h-full justify-between">
                    <span className="text-[10px] font-mono font-bold">
                      {gain > 0 ? `+${gain}` : gain}dB
                    </span>
                    <div className="relative flex-1 flex items-center justify-center my-2">
                      <input
                        type="range"
                        min={-12}
                        max={12}
                        step={1}
                        value={gain}
                        disabled={!settings.enabled}
                        onChange={(e) => handleBandChange(index, Number(e.target.value))}
                        className="h-28 w-2 appearance-none rounded-full accent-current cursor-pointer disabled:opacity-30 [writing-mode:vertical-lr] [direction:rtl]"
                        style={{ color: palette.primary }}
                      />
                    </div>
                    <span className="text-[10px] font-medium opacity-70 whitespace-nowrap">
                      {FREQ_LABELS[index]}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bass Boost Slider */}
            <div className="p-4 rounded-2xl bg-black/5">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Volume2 className="w-4 h-4 text-current" style={{ color: palette.primary }} />
                  <span className="text-sm font-bold">Bass Boost Dinamico</span>
                </div>
                <span className="text-xs font-mono font-bold">{settings.bassBoost}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={settings.bassBoost}
                disabled={!settings.enabled}
                onChange={(e) => handleBassBoostChange(Number(e.target.value))}
                className="w-full h-2 rounded-full appearance-none cursor-pointer accent-current disabled:opacity-30"
                style={{ color: palette.primary }}
              />
            </div>

            {/* Pixel Spatial Audio info badge */}
            <div
              className="p-3.5 rounded-2xl flex items-center gap-3 text-xs"
              style={{
                backgroundColor: palette.secondaryContainer,
                color: palette.onSecondaryContainer,
              }}
            >
              <Sparkles className="w-5 h-5 shrink-0" />
              <span>
                Audio spaziale e Clear Audio ottimizzati per <strong>Google Pixel Buds</strong> e speaker integrati.
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
