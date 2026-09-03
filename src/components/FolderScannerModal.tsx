import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, FolderOpen, UploadCloud, CheckCircle2, Music, Sparkles } from 'lucide-react';
import { DynamicPalette, Track } from '../types';
import { parseAudioFile } from '../services/localFileScanner';

interface FolderScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTracksImported: (tracks: Track[]) => void;
  palette: DynamicPalette;
}

export const FolderScannerModal: React.FC<FolderScannerModalProps> = ({
  isOpen,
  onClose,
  onTracksImported,
  palette,
}) => {
  const [isScanning, setIsScanning] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [importedCount, setImportedCount] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dirInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFiles = async (files: FileList | File[], folderName = 'Musica Locale') => {
    setIsScanning(true);
    setStatusMessage('Analisi dei file audio e metadati in corso...');
    const newTracks: Track[] = [];

    const audioExtensions = ['.mp3', '.flac', '.wav', '.m4a', '.aac', '.ogg', '.opus'];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const name = file.name.toLowerCase();
      const isAudio = audioExtensions.some((ext) => name.endsWith(ext)) || file.type.startsWith('audio/');

      if (isAudio) {
        setStatusMessage(`Elaborazione: ${file.name}`);
        const track = await parseAudioFile(file, folderName);
        newTracks.push(track);
      }
    }

    setIsScanning(false);
    if (newTracks.length > 0) {
      setImportedCount(newTracks.length);
      onTracksImported(newTracks);
    } else {
      setStatusMessage('Nessun file audio compatibile trovato nella selezione.');
    }
  };

  // Handle picking directory or files
  const handlePickDirectory = async () => {
    // If desktop Chromium with showDirectoryPicker
    if ('showDirectoryPicker' in window && !/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
      try {
        setIsScanning(true);
        setStatusMessage('Accesso alla cartella autorizzato...');
        const win = window as unknown as { showDirectoryPicker: () => Promise<FileSystemDirectoryHandle> };
        const dirHandle = await win.showDirectoryPicker();
        const collectedFiles: File[] = [];

        // Iterate directory entries
        for await (const entry of (dirHandle as unknown as { values: () => AsyncIterable<FileSystemHandle> }).values()) {
          if (entry.kind === 'file') {
            const file = await (entry as FileSystemFileHandle).getFile();
            collectedFiles.push(file);
          }
        }

        await handleFiles(collectedFiles, dirHandle.name);
      } catch (err: unknown) {
        setIsScanning(false);
        if ((err as Error)?.name !== 'AbortError') {
          // Fallback to standard multi-file picker
          fileInputRef.current?.click();
        }
      }
    } else {
      // Android / mobile: trigger native multi-audio picker directly
      fileInputRef.current?.click();
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files, 'File Trascinati');
    }
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
          id="pixel-folder-scanner-modal"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-black/10">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ backgroundColor: palette.primaryContainer, color: palette.onPrimaryContainer }}
              >
                <FolderOpen className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold">Scansione Musica Locale</h3>
                <p className="text-xs opacity-70">Android 13+ Storage Access Framework</p>
              </div>
            </div>

            <button
              onClick={() => {
                setImportedCount(null);
                setStatusMessage('');
                onClose();
              }}
              className="p-2 rounded-full hover:bg-black/10 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="py-5 space-y-4">
            {/* Drag & Drop Target Area */}
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              className="border-2 border-dashed rounded-3xl p-8 flex flex-col items-center justify-center text-center transition-all hover:border-current cursor-pointer"
              style={{ borderColor: palette.primary }}
              onClick={handlePickDirectory}
            >
              <UploadCloud className="w-12 h-12 mb-3 opacity-80" style={{ color: palette.primary }} />
              <h4 className="text-sm font-bold mb-1">
                Seleziona cartella o trascina file audio qui
              </h4>
              <p className="text-xs opacity-70 max-w-xs">
                Supporta file MP3, FLAC, WAV, M4A, AAC, OGG. Scansione rapida con generazione metadati.
              </p>
            </div>

            {/* Hidden native inputs for maximum device compatibility */}
            <input
              type="file"
              ref={fileInputRef}
              multiple
              accept="audio/*,.mp3,.flac,.wav,.m4a,.aac,.ogg"
              className="hidden"
              onChange={(e) => {
                if (e.target.files) handleFiles(e.target.files);
              }}
            />
            {/* Directory picker fallback */}
            <input
              type="file"
              ref={dirInputRef}
              {...({ webkitdirectory: '' } as React.InputHTMLAttributes<HTMLInputElement>)}
              multiple
              className="hidden"
              onChange={(e) => {
                if (e.target.files) handleFiles(e.target.files, 'Cartella Selezionata');
              }}
            />

            {/* Android specific help tip */}
            <div
              className="p-3.5 rounded-2xl text-xs flex items-start gap-2.5 border border-black/5"
              style={{ backgroundColor: palette.surfaceContainer, color: palette.onSurface }}
            >
              <FolderOpen className="w-4 h-4 shrink-0 mt-0.5" style={{ color: palette.primary }} />
              <div className="space-y-1">
                <p className="font-bold">Come importare cartelle su Android:</p>
                <p className="opacity-80 leading-relaxed text-[11px]">
                  Tocca <strong>"Scegli cartella / brani"</strong>. Nel gestore file di sistema, naviga nella tua cartella musicale, tieni premuto un brano e tocca i tre puntini ⋮ &gt; <strong>"Seleziona tutto"</strong> per importare l'intero album o cartella.
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <button
                onClick={handlePickDirectory}
                disabled={isScanning}
                className="py-3.5 px-4 rounded-2xl text-xs font-bold shadow-sm flex items-center justify-center gap-2 transition active:scale-95 disabled:opacity-50 cursor-pointer"
                style={{
                  backgroundColor: palette.primary,
                  color: palette.onPrimary,
                }}
              >
                <FolderOpen className="w-4 h-4 shrink-0" />
                <span className="truncate">Scegli cartella / brani</span>
              </button>

              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isScanning}
                className="py-3.5 px-4 rounded-2xl text-xs font-bold shadow-sm flex items-center justify-center gap-2 transition active:scale-95 border border-black/10 disabled:opacity-50 cursor-pointer"
                style={{
                  backgroundColor: palette.surfaceContainer,
                  color: palette.onSurface,
                }}
              >
                <Music className="w-4 h-4 shrink-0" />
                <span className="truncate">Seleziona file</span>
              </button>
            </div>

            {/* Progress / Status feedback */}
            {isScanning && (
              <div className="p-4 rounded-2xl bg-black/5 flex items-center gap-3 text-xs">
                <div className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin shrink-0" />
                <span className="font-semibold truncate">{statusMessage}</span>
              </div>
            )}

            {importedCount !== null && (
              <div
                className="p-4 rounded-2xl flex items-center gap-3 text-xs"
                style={{
                  backgroundColor: palette.secondaryContainer,
                  color: palette.onSecondaryContainer,
                }}
              >
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                <span>
                  Operazione completata: <strong>{importedCount}</strong> brani aggiunti alla tua libreria locale!
                </span>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
