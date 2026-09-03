import React, { useState, useEffect } from 'react';
import { Wifi, Battery, Volume2, Bell } from 'lucide-react';
import { DynamicPalette } from '../types';

interface AndroidStatusBarProps {
  palette: DynamicPalette;
  isPlaying: boolean;
  onOpenNotificationPanel?: () => void;
}

export const AndroidStatusBar: React.FC<AndroidStatusBarProps> = ({
  palette,
  isPlaying,
  onOpenNotificationPanel,
}) => {
  const [time, setTime] = useState('');

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      setTime(`${hours}:${minutes}`);
    };
    update();
    const interval = setInterval(update, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header
      id="pixel-status-bar"
      onClick={onOpenNotificationPanel}
      className="w-full h-8 px-6 pt-2 pb-1 flex items-center justify-between text-xs font-semibold select-none z-30 cursor-pointer transition-colors duration-300"
      style={{ color: palette.onSurface }}
      title="Tocca per visualizzare la notifica multimediale Android 13+"
    >
      {/* Left: Time & notification icons */}
      <div className="flex items-center gap-2">
        <span className="tracking-tight text-[13px] font-bold">{time || '09:41'}</span>
        {isPlaying && (
          <span
            className="flex items-center justify-center p-0.5 rounded-full"
            style={{ backgroundColor: palette.primaryContainer, color: palette.onPrimaryContainer }}
            title="Riproduzione musicale attiva"
          >
            <Volume2 className="w-3 h-3 animate-pulse" />
          </span>
        )}
      </div>

      {/* Center: Camera punch hole */}
      <div className="w-3.5 h-3.5 rounded-full bg-black border border-neutral-700 shadow-inner"></div>

      {/* Right: Connectivity and Battery */}
      <div className="flex items-center gap-2 text-xs opacity-90">
        <span className="text-[10px] font-bold tracking-wider">5G</span>
        <Wifi className="w-3.5 h-3.5" />
        <div className="flex items-center gap-1">
          <Battery className="w-4 h-4 fill-current" />
          <span className="text-[10px] font-bold">88%</span>
        </div>
      </div>
    </header>
  );
};
