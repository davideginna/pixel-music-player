import { Track } from '../types';

export function generateFallbackCover(): string {
  const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
    <rect width="400" height="400" rx="36" fill="#F1F3F4"/>
    <circle cx="200" cy="200" r="140" fill="#E8EAED"/>
    
    <g transform="translate(100, 80) scale(1.3)">
      <!-- Red Beam -->
      <path d="M 50 10 C 120 -10, 150 20, 150 60 C 130 10, 80 10, 50 30 Z" fill="#EA4335" />
      <!-- Yellow circle in beam -->
      <circle cx="130" cy="35" r="15" fill="#FBBC04" />
      <!-- Green Stem -->
      <rect x="50" y="15" width="24" height="130" rx="12" fill="#34A853" />
      <!-- Blue Note Head -->
      <circle cx="38" cy="140" r="38" fill="#4285F4" />
    </g>
  </svg>
  `;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

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

