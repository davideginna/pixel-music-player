import { Track } from '../types';

export function generatePixelArtwork(title: string, color1: string, color2: string, color3: string): string {
  const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
    <defs>
      <linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${color1}"/>
        <stop offset="50%" stop-color="${color2}"/>
        <stop offset="100%" stop-color="${color3}"/>
      </linearGradient>
      <radialGradient id="r1" cx="30%" cy="30%" r="70%">
        <stop offset="0%" stop-color="#ffffff" stop-opacity="0.35"/>
        <stop offset="100%" stop-color="#000000" stop-opacity="0.25"/>
      </radialGradient>
      <filter id="blur" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="30"/>
      </filter>
    </defs>
    <rect width="400" height="400" rx="36" fill="url(#g1)"/>
    <circle cx="120" cy="120" r="140" fill="${color2}" opacity="0.6" filter="url(#blur)"/>
    <circle cx="290" cy="270" r="120" fill="${color1}" opacity="0.6" filter="url(#blur)"/>
    <!-- Geometric Material 3 Shapes -->
    <rect x="50" y="50" width="300" height="300" rx="28" fill="none" stroke="rgba(255,255,255,0.18)" stroke-width="2"/>
    <circle cx="200" cy="190" r="68" fill="none" stroke="rgba(255,255,255,0.4)" stroke-width="4"/>
    <path d="M 160 270 Q 200 310 240 270" fill="none" stroke="rgba(255,255,255,0.4)" stroke-width="4" stroke-linecap="round"/>
    <circle cx="200" cy="190" r="24" fill="rgba(255,255,255,0.7)"/>
    <!-- Minimal typographic branding -->
    <text x="50" y="340" fill="#ffffff" font-family="-apple-system, BlinkMacSystemFont, 'Plus Jakarta Sans', sans-serif" font-weight="700" font-size="20" letter-spacing="-0.5">${title}</text>
    <text x="50" y="362" fill="rgba(255,255,255,0.75)" font-family="-apple-system, BlinkMacSystemFont, 'Plus Jakarta Sans', sans-serif" font-weight="500" font-size="12" letter-spacing="1.5">PIXEL AUDIO ENGINE</text>
  </svg>
  `;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export const INITIAL_TRACKS: Track[] = [
  {
    id: 'track-1',
    title: 'Pixel Dawn (Morning Bloom)',
    artist: 'Tensor Sound',
    album: 'Pixel Soundscapes',
    duration: 184,
    genre: 'Ambient',
    year: 2025,
    trackNumber: 1,
    coverUrl: generatePixelArtwork('Pixel Dawn', '#1A608F', '#3F88C5', '#92CCFF'),
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112191.mp3',
    folderName: 'Musica/Pixel Originali',
    filePath: '/storage/emulated/0/Music/Pixel Originali/Pixel Dawn.mp3',
    fileSize: '4.3 MB',
    format: 'MP3 • 320 kbps',
    bitrate: '320 kbps',
    playCount: 14,
    lastPlayed: Date.now() - 3600000 * 2,
    dateAdded: Date.now() - 86400000 * 5,
    isFavorite: true,
    lyrics: `[00:12.00] Risveglio mattutino con la luce soffusa del display Pixel
[00:28.00] Il Dynamic Color sfuma tra i toni freddi dell'alba
[00:45.00] Suoni caldi e sintetizzatori analogici che viaggiano nell'aria
[01:10.00] La città prende forma tra le ombre e la quiete
[01:35.00] Vibrazioni leggere, battiti morbidi, ritmo costante
[02:05.00] Pixel Soundscapes ti accompagna verso il giorno`,
  },
  {
    id: 'track-2',
    title: 'Mountain View Sunset',
    artist: 'Material Groove',
    album: 'Silicon Valley Tapes',
    duration: 212,
    genre: 'Lo-Fi',
    year: 2024,
    trackNumber: 2,
    coverUrl: generatePixelArtwork('Mountain View', '#8F4C38', '#E06D53', '#FFB5A0'),
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=chill-abstract-intention-12099.mp3',
    folderName: 'Musica/Lo-Fi',
    filePath: '/storage/emulated/0/Music/Lo-Fi/Mountain View Sunset.mp3',
    fileSize: '5.1 MB',
    format: 'FLAC • 24-bit',
    bitrate: '980 kbps',
    playCount: 22,
    lastPlayed: Date.now() - 3600000 * 5,
    dateAdded: Date.now() - 86400000 * 12,
    isFavorite: true,
    lyrics: `[00:15.00] Raggi caldi di un tramonto californiano
[00:32.00] Tasti d'avorio e vinile che scricchiola piano
[00:54.00] Pixel 11 posato sul tavolo in legno scuro
[01:22.00] La melodia scivola fluida a 120 hertz
[01:50.00] Chiudi gli occhi e ascolta il riverbero`,
  },
  {
    id: 'track-3',
    title: 'Dynamic Colorwave',
    artist: 'Android Horizons',
    album: 'Expressive M3',
    duration: 240,
    genre: 'Synthwave',
    year: 2025,
    trackNumber: 3,
    coverUrl: generatePixelArtwork('Colorwave', '#90425D', '#D95B83', '#FFB0C8'),
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/10/14/audio_9939f792cb.mp3?filename=tuesday-glitch-12563.mp3',
    folderName: 'Musica/Electronic',
    filePath: '/storage/emulated/0/Music/Electronic/Dynamic Colorwave.flac',
    fileSize: '7.8 MB',
    format: 'FLAC • Hi-Res',
    bitrate: '1411 kbps',
    playCount: 19,
    lastPlayed: Date.now() - 3600000 * 20,
    dateAdded: Date.now() - 86400000 * 2,
    isFavorite: false,
    lyrics: `[00:20.00] Frequenze dinamiche che mutano ad ogni tocco
[00:44.00] Tonalità pastello, superfici fluide e rotonde
[01:12.00] Basso pulsante in simbiosi con il sistema operativo
[01:40.00] Un'esperienza pura senza interruzioni`,
  },
  {
    id: 'track-4',
    title: 'Night Sight Lounge',
    artist: 'Astrophotography',
    album: 'Long Exposure',
    duration: 195,
    genre: 'Chillout',
    year: 2024,
    trackNumber: 4,
    coverUrl: generatePixelArtwork('Night Sight', '#4D644F', '#6B7A6A', '#B3CDB4'),
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73467.mp3?filename=solitude-dark-ambient-electronic-10959.mp3',
    folderName: 'Musica/Ambient',
    filePath: '/storage/emulated/0/Music/Ambient/Night Sight Lounge.mp3',
    fileSize: '4.6 MB',
    format: 'MP3 • 320 kbps',
    bitrate: '320 kbps',
    playCount: 9,
    lastPlayed: Date.now() - 86400000 * 1,
    dateAdded: Date.now() - 86400000 * 7,
    isFavorite: true,
  },
  {
    id: 'track-5',
    title: 'Super Res Groove',
    artist: 'Google Hardware Collective',
    album: 'Bay Reflections',
    duration: 228,
    genre: 'Indie Pop',
    year: 2025,
    trackNumber: 5,
    coverUrl: generatePixelArtwork('Super Res', '#424754', '#303036', '#A5C8FE'),
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/08/02/audio_884fe92c21.mp3?filename=reflected-light-14797.mp3',
    folderName: 'Musica/Pixel Originali',
    filePath: '/storage/emulated/0/Music/Pixel Originali/Super Res Groove.mp3',
    fileSize: '5.4 MB',
    format: 'AAC • 256 kbps',
    bitrate: '256 kbps',
    playCount: 31,
    lastPlayed: Date.now() - 3600000 * 1,
    dateAdded: Date.now() - 86400000 * 20,
    isFavorite: true,
  },
  {
    id: 'track-6',
    title: 'Tensor Flow Beats',
    artist: 'TPU Core',
    album: 'Deep Neural Jazz',
    duration: 176,
    genre: 'Jazz Hop',
    year: 2024,
    trackNumber: 6,
    coverUrl: generatePixelArtwork('Tensor Flow', '#5E641B', '#A0A95A', '#C8CF7A'),
    audioUrl: 'https://cdn.pixabay.com/download/audio/2021/08/09/audio_8842d54e44.mp3?filename=jazzy-abstract-beat-11254.mp3',
    folderName: 'Musica/Jazz',
    filePath: '/storage/emulated/0/Music/Jazz/Tensor Flow Beats.mp3',
    fileSize: '4.1 MB',
    format: 'MP3 • 320 kbps',
    bitrate: '320 kbps',
    playCount: 17,
    lastPlayed: Date.now() - 3600000 * 48,
    dateAdded: Date.now() - 86400000 * 14,
    isFavorite: false,
  },
  {
    id: 'track-7',
    title: 'Magic Eraser',
    artist: 'Clean Slate',
    album: 'Frequency Shift',
    duration: 205,
    genre: 'Electronic',
    year: 2025,
    trackNumber: 7,
    coverUrl: generatePixelArtwork('Magic Eraser', '#386567', '#50606E', '#CFC0E8'),
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/11/06/audio_c0c326084a.mp3?filename=electronic-future-beats-117997.mp3',
    folderName: 'Musica/Electronic',
    filePath: '/storage/emulated/0/Music/Electronic/Magic Eraser.mp3',
    fileSize: '4.9 MB',
    format: 'MP3 • 320 kbps',
    bitrate: '320 kbps',
    playCount: 8,
    lastPlayed: Date.now() - 86400000 * 3,
    dateAdded: Date.now() - 86400000 * 8,
    isFavorite: false,
  },
];
