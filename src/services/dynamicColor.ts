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
  geometric_balance: {
    name: 'Geometric Balance',
    colorName: 'Pixel Geometric Purple',
    hex: '#6750A4',
    light: {
      id: 'geometric_balance',
      name: 'Geometric Balance',
      colorName: 'Geometric Balance',
      primary: '#6750A4',
      onPrimary: '#FFFFFF',
      primaryContainer: '#EADDFF',
      onPrimaryContainer: '#21005D',
      secondary: '#625B71',
      secondaryContainer: '#E8DEF8',
      onSecondaryContainer: '#1D192B',
      tertiary: '#7D5260',
      surface: '#FFFBFE',
      surfaceVariant: '#E7E0EC',
      surfaceContainer: '#F3EDF7',
      surfaceContainerHigh: '#ECE6F0',
      onSurface: '#1D1B20',
      onSurfaceVariant: '#49454F',
      outline: '#79747E',
      outlineVariant: '#CAC4D0',
    },
    dark: {
      id: 'geometric_balance',
      name: 'Geometric Balance',
      colorName: 'Geometric Balance',
      primary: '#D0BCFF',
      onPrimary: '#381E72',
      primaryContainer: '#4F378B',
      onPrimaryContainer: '#EADDFF',
      secondary: '#CCC2DC',
      secondaryContainer: '#4A4458',
      onSecondaryContainer: '#E8DEF8',
      tertiary: '#EFB8C8',
      surface: '#141218',
      surfaceVariant: '#49454F',
      surfaceContainer: '#211F26',
      surfaceContainerHigh: '#2B2930',
      onSurface: '#E6E1E5',
      onSurfaceVariant: '#CAC4D0',
      outline: '#938F99',
      outlineVariant: '#49454F',
    },
  },
  bay: {
    name: 'Bay Blue',
    colorName: 'Pixel Bay',
    hex: '#3F88C5',
    light: {
      id: 'bay',
      name: 'Bay Blue',
      colorName: 'Pixel Bay',
      primary: '#1A608F',
      onPrimary: '#FFFFFF',
      primaryContainer: '#CCE5FF',
      onPrimaryContainer: '#001D33',
      secondary: '#50606E',
      secondaryContainer: '#D3E5F5',
      onSecondaryContainer: '#0C1D29',
      tertiary: '#65587B',
      surface: '#F8F9FC',
      surfaceVariant: '#DEE3EB',
      surfaceContainer: '#EDF0F5',
      surfaceContainerHigh: '#E7EBF1',
      onSurface: '#191C1E',
      onSurfaceVariant: '#42474E',
      outline: '#72777F',
      outlineVariant: '#C2C7CF',
    },
    dark: {
      id: 'bay',
      name: 'Bay Blue',
      colorName: 'Pixel Bay',
      primary: '#92CCFF',
      onPrimary: '#003353',
      primaryContainer: '#004B76',
      onPrimaryContainer: '#CCE5FF',
      secondary: '#B7C9D9',
      secondaryContainer: '#384856',
      onSecondaryContainer: '#D3E5F5',
      tertiary: '#CFC0E8',
      surface: '#111416',
      surfaceVariant: '#42474E',
      surfaceContainer: '#1D2023',
      surfaceContainerHigh: '#282A2D',
      onSurface: '#E1E2E5',
      onSurfaceVariant: '#C2C7CF',
      outline: '#8C9199',
      outlineVariant: '#42474E',
    },
  },
  hazel: {
    name: 'Hazel Green',
    colorName: 'Pixel Hazel',
    hex: '#6B7A6A',
    light: {
      id: 'hazel',
      name: 'Hazel Green',
      colorName: 'Pixel Hazel',
      primary: '#4D644F',
      onPrimary: '#FFFFFF',
      primaryContainer: '#CFE9CF',
      onPrimaryContainer: '#0B200F',
      secondary: '#546353',
      secondaryContainer: '#D7E8D5',
      onSecondaryContainer: '#121F13',
      tertiary: '#386567',
      surface: '#F7FBF3',
      surfaceVariant: '#DEE5DA',
      surfaceContainer: '#ECEFE8',
      surfaceContainerHigh: '#E6EAE2',
      onSurface: '#181D18',
      onSurfaceVariant: '#424941',
      outline: '#72796F',
      outlineVariant: '#C2C9BE',
    },
    dark: {
      id: 'hazel',
      name: 'Hazel Green',
      colorName: 'Pixel Hazel',
      primary: '#B3CDB4',
      onPrimary: '#203522',
      primaryContainer: '#364C37',
      onPrimaryContainer: '#CFE9CF',
      secondary: '#BCCBB9',
      secondaryContainer: '#3D4B3C',
      onSecondaryContainer: '#D7E8D5',
      tertiary: '#A1CED0',
      surface: '#101410',
      surfaceVariant: '#424941',
      surfaceContainer: '#1D211D',
      surfaceContainerHigh: '#272B26',
      onSurface: '#E1E4DE',
      onSurfaceVariant: '#C2C9BE',
      outline: '#8C9388',
      outlineVariant: '#424941',
    },
  },
  peony: {
    name: 'Peony Rose',
    colorName: 'Pixel Peony',
    hex: '#D95B83',
    light: {
      id: 'peony',
      name: 'Peony Rose',
      colorName: 'Pixel Peony',
      primary: '#90425D',
      onPrimary: '#FFFFFF',
      primaryContainer: '#FFD9E2',
      onPrimaryContainer: '#3B001B',
      secondary: '#74565F',
      secondaryContainer: '#FFD9E2',
      onSecondaryContainer: '#2B151C',
      tertiary: '#7C5635',
      surface: '#FFF8F8',
      surfaceVariant: '#F2DDE1',
      surfaceContainer: '#F7EBED',
      surfaceContainerHigh: '#F1E5E7',
      onSurface: '#211A1B',
      onSurfaceVariant: '#514347',
      outline: '#837377',
      outlineVariant: '#D5C2C6',
    },
    dark: {
      id: 'peony',
      name: 'Peony Rose',
      colorName: 'Pixel Peony',
      primary: '#FFB0C8',
      onPrimary: '#58112F',
      primaryContainer: '#732A45',
      onPrimaryContainer: '#FFD9E2',
      secondary: '#E2BDC6',
      secondaryContainer: '#5B3F47',
      onSecondaryContainer: '#FFD9E2',
      tertiary: '#EFBD94',
      surface: '#191113',
      surfaceVariant: '#514347',
      surfaceContainer: '#261D20',
      surfaceContainerHigh: '#31282B',
      onSurface: '#EFE0E2',
      onSurfaceVariant: '#D5C2C6',
      outline: '#9E8C90',
      outlineVariant: '#514347',
    },
  },
  lemongrass: {
    name: 'Lemongrass',
    colorName: 'Pixel Lemongrass',
    hex: '#A0A95A',
    light: {
      id: 'lemongrass',
      name: 'Lemongrass',
      colorName: 'Pixel Lemongrass',
      primary: '#5E641B',
      onPrimary: '#FFFFFF',
      primaryContainer: '#E4EB93',
      onPrimaryContainer: '#1C1F00',
      secondary: '#606143',
      secondaryContainer: '#E6E6C0',
      onSecondaryContainer: '#1C1D06',
      tertiary: '#3C6657',
      surface: '#FAF9EE',
      surfaceVariant: '#E5E4D2',
      surfaceContainer: '#EFEFE3',
      surfaceContainerHigh: '#EAE9DD',
      onSurface: '#1B1C15',
      onSurfaceVariant: '#47473B',
      outline: '#78786A',
      outlineVariant: '#C9C8B6',
    },
    dark: {
      id: 'lemongrass',
      name: 'Lemongrass',
      colorName: 'Pixel Lemongrass',
      primary: '#C8CF7A',
      onPrimary: '#303400',
      primaryContainer: '#464C00',
      onPrimaryContainer: '#E4EB93',
      secondary: '#C9C9A5',
      secondaryContainer: '#48492D',
      onSecondaryContainer: '#E6E6C0',
      tertiary: '#A3D0BE',
      surface: '#13140E',
      surfaceVariant: '#47473B',
      surfaceContainer: '#202119',
      surfaceContainerHigh: '#2A2B23',
      onSurface: '#E5E4D8',
      onSurfaceVariant: '#C9C8B6',
      outline: '#939281',
      outlineVariant: '#47473B',
    },
  },
  coral: {
    name: 'Coral Sunset',
    colorName: 'Pixel Coral',
    hex: '#E06D53',
    light: {
      id: 'coral',
      name: 'Coral Sunset',
      colorName: 'Pixel Coral',
      primary: '#8F4C38',
      onPrimary: '#FFFFFF',
      primaryContainer: '#FFDBD1',
      onPrimaryContainer: '#3B0900',
      secondary: '#77574E',
      secondaryContainer: '#FFDBD1',
      onSecondaryContainer: '#2C150F',
      tertiary: '#6C5D2F',
      surface: '#FFF8F6',
      surfaceVariant: '#F5DED8',
      surfaceContainer: '#F7ECE8',
      surfaceContainerHigh: '#F1E6E2',
      onSurface: '#231917',
      onSurfaceVariant: '#53433F',
      outline: '#85736E',
      outlineVariant: '#D8C2BC',
    },
    dark: {
      id: 'coral',
      name: 'Coral Sunset',
      colorName: 'Pixel Coral',
      primary: '#FFB5A0',
      onPrimary: '#561E0F',
      primaryContainer: '#723523',
      onPrimaryContainer: '#FFDBD1',
      secondary: '#E7BDB2',
      secondaryContainer: '#5D3F37',
      onSecondaryContainer: '#FFDBD1',
      tertiary: '#D9C58D',
      surface: '#1A110F',
      surfaceVariant: '#53433F',
      surfaceContainer: '#271D1B',
      surfaceContainerHigh: '#322825',
      onSurface: '#F1DFDA',
      onSurfaceVariant: '#D8C2BC',
      outline: '#A08C87',
      outlineVariant: '#53433F',
    },
  },
  obsidian: {
    name: 'Obsidian',
    colorName: 'Pixel Obsidian',
    hex: '#303036',
    light: {
      id: 'obsidian',
      name: 'Obsidian',
      colorName: 'Pixel Obsidian',
      primary: '#424754',
      onPrimary: '#FFFFFF',
      primaryContainer: '#D3E4FF',
      onPrimaryContainer: '#001C38',
      secondary: '#565E71',
      secondaryContainer: '#DBE2F9',
      onSecondaryContainer: '#131B2C',
      tertiary: '#705574',
      surface: '#FDFBFF',
      surfaceVariant: '#E1E2EC',
      surfaceContainer: '#ECEEF3',
      surfaceContainerHigh: '#E6E8EE',
      onSurface: '#1A1B1F',
      onSurfaceVariant: '#44474F',
      outline: '#74777F',
      outlineVariant: '#C5C6D0',
    },
    dark: {
      id: 'obsidian',
      name: 'Obsidian',
      colorName: 'Pixel Obsidian',
      primary: '#A5C8FE',
      onPrimary: '#0F315D',
      primaryContainer: '#284775',
      onPrimaryContainer: '#D3E4FF',
      secondary: '#BFC6DC',
      secondaryContainer: '#3E4658',
      onSecondaryContainer: '#DBE2F9',
      tertiary: '#DCBCE0',
      surface: '#101216',
      surfaceVariant: '#44474F',
      surfaceContainer: '#1C1F25',
      surfaceContainerHigh: '#272A30',
      onSurface: '#E3E2E6',
      onSurfaceVariant: '#C5C6D0',
      outline: '#8E9099',
      outlineVariant: '#44474F',
    },
  },
};

export function getEffectivePalette(
  paletteId: string,
  mode: ThemeMode,
  extractedPalette?: DynamicPalette
): DynamicPalette {
  if (paletteId === 'album_art' && extractedPalette) {
    return extractedPalette;
  }

  const selected = PIXEL_PALETTES[paletteId] || PIXEL_PALETTES['geometric_balance'];
  const isDark =
    mode === 'dark' ||
    (mode === 'system' &&
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-color-scheme: dark)').matches);

  return isDark ? selected.dark : selected.light;
}

// Convert hex to RGB array
function hexToRgb(hex: string): [number, number, number] {
  let c = hex.replace('#', '');
  if (c.length === 3) c = c.split('').map((x) => x + x).join('');
  const num = parseInt(c, 16);
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

// Simple color extraction from image URL / canvas
export async function extractPaletteFromImageUrl(imageUrl: string, isDark: boolean): Promise<DynamicPalette | null> {
  return new Promise((resolve) => {
    try {
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 32;
        canvas.height = 32;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(null);
          return;
        }
        ctx.drawImage(img, 0, 0, 32, 32);
        const data = ctx.getImageData(0, 0, 32, 32).data;
        let r = 0, g = 0, b = 0, count = 0;
        for (let i = 0; i < data.length; i += 16) {
          r += data[i];
          g += data[i + 1];
          b += data[i + 2];
          count++;
        }
        r = Math.floor(r / count);
        g = Math.floor(g / count);
        b = Math.floor(b / count);

        const hex = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
        const primary = isDark
          ? `rgb(${Math.min(255, r + 70)}, ${Math.min(255, g + 70)}, ${Math.min(255, b + 70)})`
          : `rgb(${Math.max(20, r - 30)}, ${Math.max(20, g - 30)}, ${Math.max(20, b - 30)})`;
        const primaryContainer = isDark
          ? `rgb(${Math.floor(r * 0.45)}, ${Math.floor(g * 0.45)}, ${Math.floor(b * 0.45)})`
          : `rgb(${Math.min(255, r + 130)}, ${Math.min(255, g + 130)}, ${Math.min(255, b + 130)})`;

        resolve({
          id: 'album_art',
          name: 'Copertina Brano',
          colorName: 'Dynamic Artwork',
          primary: primary,
          onPrimary: isDark ? '#000000' : '#FFFFFF',
          primaryContainer: primaryContainer,
          onPrimaryContainer: isDark ? '#E5EEF5' : '#0B1B2B',
          secondary: isDark ? '#C0CAD5' : '#4E5F6E',
          secondaryContainer: isDark ? '#3B4854' : '#D1E3F5',
          onSecondaryContainer: isDark ? '#D5E4F5' : '#0B1B28',
          tertiary: isDark ? '#D5C0E6' : '#69557C',
          surface: isDark ? '#111317' : '#F7F9FC',
          surfaceVariant: isDark ? '#40454E' : '#DFE3EB',
          surfaceContainer: isDark ? '#1D2026' : '#ECEEF4',
          surfaceContainerHigh: isDark ? '#272B33' : '#E6E9EF',
          onSurface: isDark ? '#E1E2E8' : '#191C20',
          onSurfaceVariant: isDark ? '#C2C6D0' : '#42474F',
          outline: isDark ? '#8C919B' : '#727780',
          outlineVariant: isDark ? '#42474E' : '#C2C7D0',
        });
      };
      img.onerror = () => resolve(null);
      img.src = imageUrl;
    } catch {
      resolve(null);
    }
  });
}
