import React from 'react';
import { DynamicPalette } from '../types';

interface AndroidGestureBarProps {
  palette: DynamicPalette;
  onHomeClick?: () => void;
}

export const AndroidGestureBar: React.FC<AndroidGestureBarProps> = ({
  palette,
  onHomeClick,
}) => {
  return (
    <div
      id="pixel-gesture-navigation"
      className="w-full h-5 flex items-center justify-center cursor-pointer select-none pb-1 transition-colors duration-300"
      onClick={onHomeClick}
      title="Android Gesture Navigation Bar"
    >
      <div
        className="w-24 h-1 rounded-full opacity-45 hover:opacity-80 transition-opacity"
        style={{ backgroundColor: palette.onSurface }}
      />
    </div>
  );
};
