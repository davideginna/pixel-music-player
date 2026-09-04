import React, { useState, useEffect } from 'react';
import {
  Palette,
  Sun,
  Moon,
  Monitor,
  FolderOpen,
  Sliders,
  Smartphone,
  RotateCcw,
  Sparkles,
  Bell,
  CheckCircle2,
} from 'lucide-react';
import { DynamicPalette, ThemeMode } from '../types';

interface SettingsTabProps {
  themeMode: ThemeMode;
  paletteId: string;
  palette: DynamicPalette;
  showPixelFrame: boolean;
  hapticsEnabled: boolean;
  tracksCount: number;
  totalSizeMb: string;
  onChangeThemeMode: (mode: ThemeMode) => void;
  onChangePaletteId: (id: string) => void;
  onTogglePixelFrame: () => void;
  onToggleHaptics: () => void;
  onOpenFolderScanner: () => void;
  onResetLibrary: () => void;
}

export const SettingsTab: React.FC<SettingsTabProps> = ({
  themeMode,
  paletteId,
  palette,
  showPixelFrame,
  hapticsEnabled,
  tracksCount,
  totalSizeMb,
  onChangeThemeMode,
  onChangePaletteId,
  onTogglePixelFrame,
  onToggleHaptics,
  onOpenFolderScanner,
  onResetLibrary,
}) => {
  return (
    <div className="w-full flex-1 overflow-y-auto px-5 pt-3 pb-24 select-none" id="pixel-settings-tab">
      <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-5">Impostazioni</h1>

      {/* SECTION: TEMA GEMINI */}
      <section className="mb-7">
        <div className="flex items-center gap-2 mb-3">
          <Palette className="w-4 h-4 opacity-75" />
          <h2 className="text-sm font-bold uppercase tracking-wider opacity-80">
            Tema Gemini & Dynamic Color
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

        {/* Gemini Aurora Theme Banner */}
        <div
          className="p-4 rounded-2xl flex items-center justify-between border border-black/5"
          style={{ backgroundColor: palette.surfaceContainer }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center shadow-md shrink-0"
              style={{
                background: 'linear-gradient(135deg, #4285F4 0%, #9B72CF 50%, #D96570 100%)',
              }}
            >
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="text-sm font-bold">Gemini Aurora</h4>
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full text-white bg-gradient-to-r from-[#4285F4] to-[#9B72CF]">
                  Tema Esclusivo
                </span>
              </div>
              <p className="text-xs opacity-70">
                Palette dinamica Material You ispirata a Google Gemini
              </p>
            </div>
          </div>
          <div
            className="w-4 h-4 rounded-full shrink-0"
            style={{ backgroundColor: palette.primary }}
            title="Colore d'accento primario"
          />
        </div>
      </section>

      {/* SECTION: INTEGRAZIONE SISTEMA ANDROID & BLUETOOTH */}
      <section className="mb-7">
        <div className="flex items-center gap-2 mb-3">
          <Smartphone className="w-4 h-4 opacity-75" />
          <h2 className="text-sm font-bold uppercase tracking-wider opacity-80">
            Controlli di Sistema & Lockscreen
          </h2>
        </div>

        <div
          className="p-4 rounded-2xl space-y-3 border border-black/5"
          style={{ backgroundColor: palette.surfaceContainer }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Smartphone className="w-4 h-4 opacity-80" />
              <h4 className="text-xs font-bold">Integrazione di Sistema</h4>
            </div>
            <span
              className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full flex items-center gap-1"
              style={{ backgroundColor: palette.primaryContainer, color: palette.onPrimaryContainer }}
            >
              <CheckCircle2 className="w-3 h-3" />
              Attivo
            </span>
          </div>
          <p className="text-[11px] opacity-75 leading-relaxed">
            I controlli multimediali sono automaticamente integrati con la schermata di blocco, i dispositivi Bluetooth e il centro di controllo del tuo dispositivo.
          </p>
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

      {/* SECTION: PIXEL EXPERIENCE */}
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
          {/* Toggle Haptics */}
          <div className="flex items-center justify-between">
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

      {/* SECTION: INFO APP CON ICONA GOOGLE PIXEL BUDS */}
      <section className="p-5 rounded-3xl border border-black/5 text-xs space-y-3" style={{ backgroundColor: palette.surfaceContainer }}>
        <div className="flex items-center gap-3.5 pb-2 border-b border-black/5">
          <img
            src="/app-icon.svg"
            alt="Pixel Music Icon"
            className="w-14 h-14 rounded-2xl shadow-sm border border-black/5 shrink-0"
          />
          <div>
            <h3 className="text-sm font-bold">Pixel Music Player</h3>
            <p className="text-[11px] opacity-75">Icona Pixel Buds &bull; Material You Google</p>
          </div>
        </div>

        <div className="space-y-1.5 opacity-80 pt-1">
          <div className="flex items-center justify-between">
            <span className="font-semibold">Versione:</span>
            <span className="font-bold">2.4.0 (Material 3)</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-semibold">Tema Dinamico:</span>
            <span className="font-semibold text-blue-500">Gemini Aurora</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-semibold">Package Android:</span>
            <span className="font-mono">com.pixel.musicplayer</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-semibold">Controlli Lockscreen:</span>
            <span className="text-emerald-500 font-bold">Attivo OS & Bluetooth</span>
          </div>
        </div>
      </section>
    </div>
  );
};
