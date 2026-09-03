import { DynamicPalette, ThemeMode } from '../types';

export const PIXEL_PALETTES: Record<string, { name: string; colorName: string; hex: string; light: DynamicPalette; dark: DynamicPalette }> = {
  gemini: {
    name: 'Gemini Aurora',
    colorName: 'Gemini Spark',
    hex: '#4285F4',
    light: {
      id: 'gemini',
      name: 'Gemini Aurora',
      colorName: 'Gemini Spark',
      primary: '#1A73E8',
      onPrimary: '#FFFFFF',
      primaryContainer: '#D3E3FD',
      onPrimaryContainer: '#041E49',
      secondary: '#7C3AED',
      secondaryContainer: '#EDE7F6',
      onSecondaryContainer: '#21005D',
      tertiary: '#00639B',
      surface: '#FFFFFF',
      surfaceVariant: '#E1E3E1',
      surfaceContainer: '#F0F4F9',
      surfaceContainerHigh: '#E9EEF6',
      onSurface: '#1F1F1F',
      onSurfaceVariant: '#444746',
      outline: '#747775',
      outlineVariant: '#C4C7C5',
    },
    dark: {
      id: 'gemini',
      name: 'Gemini Aurora',
      colorName: 'Gemini Spark',
      primary: '#8AB4F8',
      onPrimary: '#041E49',
      primaryContainer: '#0B3A60',
      onPrimaryContainer: '#D3E3FD',
      secondary: '#C5B4E3',
      secondaryContainer: '#382952',
      onSecondaryContainer: '#EDE7F6',
      tertiary: '#7C3AED',
      surface: '#131314',
      surfaceVariant: '#444746',
      surfaceContainer: '#1E1F20',
      surfaceContainerHigh: '#282A2C',
      onSurface: '#E3E3E3',
      onSurfaceVariant: '#C4C7C5',
      outline: '#8E918F',
      outlineVariant: '#444746',
    },
  },
};

export function getEffectivePalette(
  _paletteId: string,
  mode: ThemeMode,
  _extractedPalette?: DynamicPalette
): DynamicPalette {
  const selected = PIXEL_PALETTES['gemini'];
  const isDark =
    mode === 'dark' ||
    (mode === 'system' &&
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-color-scheme: dark)').matches);

  return isDark ? selected.dark : selected.light;
}

// Convert hex to RGB array
export function hexToRgb(hex: string): [number, number, number] {
  let c = hex.replace('#', '');
  if (c.length === 3) c = c.split('').map((x) => x + x).join('');
  const num = parseInt(c, 16);
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

// Color extraction from image URL
export async function extractPaletteFromImageUrl(_imageUrl: string, _isDark: boolean): Promise<DynamicPalette | null> {
  return null;
}
