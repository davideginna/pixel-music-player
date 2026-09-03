import React from 'react';
import {
  Palette,
  Sun,
  Moon,
  Monitor,
  FolderOpen,
  Sliders,
  Smartphone,
  Check,
  RotateCcw,
  Sparkles,
  Info,
  ShieldCheck,
  Disc,
  Layers,
} from 'lucide-react';
import { DynamicPalette, EqualizerSettings, ThemeMode } from '../types';
import { PIXEL_PALETTES } from '../services/dynamicColor';

interface SettingsTabProps {
  themeMode: ThemeMode;
  paletteId: string;
  palette: DynamicPalette;
  showPixelFrame: boolean;
  hapticsEnabled: boolean;
  equalizerSettings: EqualizerSettings;
  tracksCount: number;
  totalSizeMb: string;
  onChangeThemeMode: (mode: ThemeMode) => void;
  onChangePaletteId: (id: string) => void;
  onTogglePixelFrame: () => void;
  onToggleHaptics: () => void;
  onOpenEqualizer: () => void;
  onOpenFolderScanner: () => void;
  onOpenLockscreenPreview: () => void;
  onResetLibrary: () => void;
}

export const SettingsTab: React.FC<SettingsTabProps> = ({
  themeMode,
  paletteId,
  palette,
  showPixelFrame,
  hapticsEnabled,
  equalizerSettings,
  tracksCount,
  totalSizeMb,
  onChangeThemeMode,
  onChangePaletteId,
  onTogglePixelFrame,
  onToggleHaptics,
  onOpenEqualizer,
  onOpenFolderScanner,
  onOpenLockscreenPreview,
  onResetLibrary,
}) => {
  return (
    <div className="w-full flex-1 overflow-y-auto px-5 pt-3 pb-24 select-none" id="pixel-settings-tab">
      <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-5">Impostazioni</h1>

      {/* SECTION: TEMA & DYNAMIC COLOR */}
      <section className="mb-7">
        <div className="flex items-center gap-2 mb-3">
          <Palette className="w-4 h-4 opacity-75" />
          <h2 className="text-sm font-bold uppercase tracking-wider opacity-80">
            Material You & Dynamic Color
          </h2>
        </div>

        {/* Theme mode: Sistema, Chiaro, Scuro */}
        <div
          className="p-1.5 rounded-2xl flex items-center gap-1 mb-4 border border-black/5"
          style={{ backgroundColor: palette.surfaceContainer }}
        >
          {[
            { id: 'system', label: 'Sistema', icon: Monitor },
            { id: 'light', label: 'Chiaro', icon: Sun },
            { id: 'dark', label: 'Scuro', icon: Moon },
          ].map((item) => {
            const isSelected = themeMode === item.id;
            const IconC = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onChangeThemeMode(item.id as ThemeMode)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  isSelected ? 'shadow-sm' : 'opacity-70 hover:opacity-100'
                }`}
                style={{
                  backgroundColor: isSelected ? palette.primary : 'transparent',
                  color: isSelected ? palette.onPrimary : palette.onSurface,
                }}
              >
                <IconC className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Pixel Wallpaper Palettes */}
        <span className="text-xs font-bold opacity-70 block mb-2.5">
          Tonalità Pixel Wallpaper
        </span>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 mb-3">
          {Object.keys(PIXEL_PALETTES).map((key) => {
            const p = PIXEL_PALETTES[key];
            const isSelected = paletteId === key;
            const isGeminiKey = key === 'gemini';
            return (
              <button
                key={key}
                onClick={() => onChangePaletteId(key)}
                className={`p-3 rounded-2xl flex flex-col items-center justify-center gap-1.5 text-center transition border relative ${
                  isSelected ? 'border-2 shadow-sm font-bold' : 'border-black/5 opacity-85 hover:opacity-100'
                }`}
                style={{
                  backgroundColor: palette.surfaceContainer,
                  borderColor: isSelected ? palette.primary : 'transparent',
                }}
              >
                {isGeminiKey && (
                  <span className="absolute -top-1.5 -right-1 bg-gradient-to-r from-[#4285F4] to-[#9B72CF] text-[8px] text-white font-black px-1.5 py-0.5 rounded-full shadow-xs">
                    NEW
                  </span>
                )}
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center shadow-sm"
                  style={{
                    background: isGeminiKey
                      ? 'linear-gradient(135deg, #4285F4 0%, #9B72CF 50%, #D96570 100%)'
                      : p.hex,
                  }}
                >
                  {isSelected && <Check className="w-4 h-4 text-white" />}
                </div>
                <span className="text-[11px] truncate w-full flex items-center justify-center gap-0.5">
                  {isGeminiKey && <Sparkles className="w-2.5 h-2.5 text-[#4285F4]" />}
                  {p.name}
                </span>
              </button>
            );
          })}

          {/* Auto Dynamic from Album Art */}
          <button
            onClick={() => onChangePaletteId('album_art')}
            className={`p-3 rounded-2xl flex flex-col items-center justify-center gap-1.5 text-center transition border ${
              paletteId === 'album_art' ? 'border-2 shadow-sm font-bold' : 'border-black/5 opacity-85 hover:opacity-100'
            }`}
            style={{
              backgroundColor: palette.surfaceContainer,
              borderColor: paletteId === 'album_art' ? palette.primary : 'transparent',
            }}
          >
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center shadow-sm bg-gradient-to-tr from-pink-500 via-purple-500 to-cyan-400"
            >
              {paletteId === 'album_art' && <Check className="w-4 h-4 text-white" />}
            </div>
            <span className="text-[11px] truncate w-full">Dalla copertina</span>
          </button>
        </div>
      </section>

      {/* SECTION: AUDIO & EQUALIZZATORE */}
      <section className="mb-7">
        <div className="flex items-center gap-2 mb-3">
          <Sliders className="w-4 h-4 opacity-75" />
          <h2 className="text-sm font-bold uppercase tracking-wider opacity-80">
            Audio & Elaborazione Sonora
          </h2>
        </div>

        <div
          onClick={onOpenEqualizer}
          className="p-4 rounded-2xl flex items-center justify-between cursor-pointer transition hover:shadow-sm border border-black/5 mb-3"
          style={{ backgroundColor: palette.surfaceContainer }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: palette.primaryContainer, color: palette.onPrimaryContainer }}
            >
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold">Equalizzatore Pixel</h4>
              <p className="text-xs opacity-70">
                Stato: {equalizerSettings.enabled ? 'Attivo' : 'Disattivato'} • Preset: {equalizerSettings.preset}
              </p>
            </div>
          </div>
          <span className="text-xs font-bold" style={{ color: palette.primary }}>
            Configura →
          </span>
        </div>
      </section>

      {/* SECTION: MEMORIA & SCANSIONE LOCALE */}
      <section className="mb-7">
        <div className="flex items-center gap-2 mb-3">
          <FolderOpen className="w-4 h-4 opacity-75" />
          <h2 className="text-sm font-bold uppercase tracking-wider opacity-80">
            Memoria & Scansione Locale
          </h2>
        </div>

        <div
          className="p-4 rounded-2xl space-y-3 border border-black/5"
          style={{ backgroundColor: palette.surfaceContainer }}
        >
          <div className="flex items-center justify-between text-xs">
            <span className="opacity-70">Brani totali indicizzati:</span>
            <span className="font-bold">{tracksCount} brani</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="opacity-70">Dimensione approssimativa:</span>
            <span className="font-bold">{totalSizeMb} MB</span>
          </div>

          <div className="pt-2 flex flex-col gap-2">
            <button
              onClick={onOpenFolderScanner}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-bold shadow-sm flex items-center justify-center gap-2 transition active:scale-95"
              style={{
                backgroundColor: palette.primary,
                color: palette.onPrimary,
              }}
            >
              <FolderOpen className="w-4 h-4" />
              <span>Scansiona nuova cartella / file</span>
            </button>

            <button
              onClick={onResetLibrary}
              className="w-full py-2 px-4 rounded-xl text-xs font-semibold hover:bg-black/5 opacity-75 hover:opacity-100 flex items-center justify-center gap-2 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Ripristina brani originali Pixel</span>
            </button>
          </div>
        </div>
      </section>

      {/* SECTION: PIXEL EXPERIENCE & ANDROID 13+ */}
      <section className="mb-7">
        <div className="flex items-center gap-2 mb-3">
          <Smartphone className="w-4 h-4 opacity-75" />
          <h2 className="text-sm font-bold uppercase tracking-wider opacity-80">
            Esperienza Google Pixel
          </h2>
        </div>

        <div
          className="p-4 rounded-2xl space-y-4 border border-black/5"
          style={{ backgroundColor: palette.surfaceContainer }}
        >
          {/* Toggle Cornice Pixel */}
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold">Mostra scocca Google Pixel</h4>
              <p className="text-[11px] opacity-70">Simula la scocca hardware Pixel con fotocamera</p>
            </div>
            <button
              onClick={onTogglePixelFrame}
              className={`w-11 h-6 rounded-full transition-colors relative p-1 cursor-pointer flex items-center ${
                showPixelFrame ? 'bg-current' : 'bg-neutral-600'
              }`}
              style={{ color: showPixelFrame ? palette.primary : undefined }}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${
                  showPixelFrame ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Android Lockscreen / Notification Preview */}
          <div className="flex items-center justify-between pt-2 border-t border-black/5">
            <div>
              <h4 className="text-xs font-bold">Lockscreen & Notifica Android 13+</h4>
              <p className="text-[11px] opacity-70">Simula il widget multimediale ondulato di Android 13/14</p>
            </div>
            <button
              onClick={onOpenLockscreenPreview}
              className="px-3 py-1.5 rounded-xl text-xs font-bold transition hover:bg-black/10"
              style={{ color: palette.primary }}
            >
              Anteprima →
            </button>
          </div>

          {/* Toggle Haptics */}
          <div className="flex items-center justify-between pt-2 border-t border-black/5">
            <div>
              <h4 className="text-xs font-bold">Feedback tattile Pixel</h4>
              <p className="text-[11px] opacity-70">Vibrazione e clic tattile sui controlli</p>
            </div>
            <button
              onClick={onToggleHaptics}
              className={`w-11 h-6 rounded-full transition-colors relative p-1 cursor-pointer flex items-center ${
                hapticsEnabled ? 'bg-current' : 'bg-neutral-600'
              }`}
              style={{ color: hapticsEnabled ? palette.primary : undefined }}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${
                  hapticsEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </section>

      {/* SECTION: INFO APP */}
      <section className="p-4 rounded-2xl border border-black/5 text-xs opacity-75 space-y-1.5" style={{ backgroundColor: palette.surfaceContainer }}>
        <div className="flex items-center justify-between">
          <span className="font-semibold">Nome applicazione:</span>
          <span className="font-bold">Pixel Music Player</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-semibold">Package:</span>
          <span className="font-mono">com.pixel.musicplayer</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-semibold">Versione build:</span>
          <span>11.0.0 (Pixel 11 Edition)</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-semibold">Target SDK:</span>
          <span>Android 13+ (API 34/35)</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-semibold">MediaSession & Storage:</span>
          <span className="text-emerald-500 font-bold">Attivo e conforme</span>
        </div>
      </section>
    </div>
  );
};
