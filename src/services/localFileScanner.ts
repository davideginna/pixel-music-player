import { Track } from '../types';
import { generateFallbackCover } from './sampleLibrary';

export async function parseAudioFile(file: File, folderName = 'Musica Locale'): Promise<Track> {
  const fileNameWithoutExt = file.name.replace(/\.[^/.]+$/, '');
  let title = fileNameWithoutExt;
  let artist = 'Artista sconosciuto';

  let computedFolder = folderName;
  if (file.webkitRelativePath && file.webkitRelativePath.includes('/')) {
    const parts = file.webkitRelativePath.split('/');
    if (parts.length > 1 && parts[0]) {
      computedFolder = parts[0];
    }
  }

  let album = computedFolder || 'Album sconosciuto';

  // Check if filename is "Artist - Title"
  if (fileNameWithoutExt.includes(' - ')) {
    const parts = fileNameWithoutExt.split(' - ');
    artist = parts[0].trim();
    title = parts.slice(1).join(' - ').trim();
  }

  // Create object URL
  const objectUrl = URL.createObjectURL(file);

  // Read audio duration
  const duration = await getAudioDuration(objectUrl);

  // Generate nice dynamic artwork for this track
  const coverUrl = generateFallbackCover();

  const fileSizeMb = (file.size / (1024 * 1024)).toFixed(1);
  const ext = file.name.split('.').pop()?.toUpperCase() || 'AUDIO';

  const newTrack: Track = {
    id: 'local-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6),
    title,
    artist,
    album,
    duration: Math.round(duration) || 180,
    genre: 'Locale',
    year: new Date().getFullYear(),
    coverUrl,
    audioUrl: objectUrl,
    audioBlob: file,
    filePath: `local://${computedFolder}/${file.name}`,
    folderName: computedFolder,
    fileSize: `${fileSizeMb} MB`,
    format: `${ext} • Locale`,
    bitrate: '320 kbps',
    playCount: 0,
    dateAdded: Date.now(),
    isFavorite: false,
  };

  return newTrack;
}

function getAudioDuration(url: string): Promise<number> {
  return new Promise((resolve) => {
    const audio = new Audio();
    audio.src = url;
    audio.preload = 'metadata';
    audio.onloadedmetadata = () => {
      resolve(audio.duration || 180);
    };
    audio.onerror = () => {
      resolve(180);
    };
    // timeout fallback
    setTimeout(() => resolve(180), 1500);
  });
}
