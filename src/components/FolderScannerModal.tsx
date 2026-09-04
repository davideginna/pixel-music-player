import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle2, Music, Files, Monitor, Sparkles, AudioLines, FolderOpen } from 'lucide-react';
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

  // Separate refs for single file and multi-file selection to guarantee 100% reliability on mobile
  const singleFileInputRef = useRef<HTMLInputElement>(null);
  const multiFileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFiles = async (files: FileList | File[], defaultCategory = 'Memoria Telefono') => {
    if (!files || files.length === 0) return;
    setIsScanning(true);
    setStatusMessage('Analisi del file audio e lettura dei metadati...');
    const newTracks: Track[] = [];

    const audioExtensions = ['.mp3', '.flac', '.wav', '.m4a', '.aac', '.ogg', '.opus'];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const name = file.name.toLowerCase();
      const isAudio =
        audioExtensions.some((ext) => name.endsWith(ext)) ||
        file.type.startsWith('audio/') ||
        file.type === '';

      if (isAudio) {
        setStatusMessage(`Lettura: ${file.name}`);
        const track = await parseAudioFile(file, defaultCategory);
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

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/65 backdrop-blur-sm">
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 28, stiffness: 300 }}
          className="w-full max-h-[88vh] rounded-t-[32px] p-6 flex flex-col shadow-2xl select-none"
          style={{
            backgroundColor: palette.surfaceContainerHigh,
            color: palette.onSurface,
          }}
          id="pixel-audio-import-modal"
        >
          {/* Header with Pixel Buds Icon & Close */}
          <div className="flex items-center justify-between pb-4 border-b border-black/10">
            <div className="flex items-center gap-3">
              <img
                src="/app-icon.svg"
                alt="Pixel Music"
                className="w-11 h-11 rounded-2xl shadow-sm border border-black/5"
              />
              <div>
                <h3 className="text-lg font-bold flex items-center gap-1.5">
                  <span>Aggiungi Musica</span>
                  <Sparkles className="w-4 h-4 text-amber-500" />
                </h3>
                <p className="text-xs opacity-70">Memoria locale dispositivo</p>
              </div>
            </div>

            <button
              onClick={() => {
                setImportedCount(null);
                setStatusMessage('');
                onClose();
              }}
              className="p-2 rounded-full hover:bg-black/10 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="py-5 space-y-3.5">
            {/* Native Single Track Hidden Input */}
            <input
              type="file"
              ref={singleFileInputRef}
              accept="audio/*,.mp3,.flac,.wav,.m4a,.aac,.ogg,.opus"
              className="hidden"
              onChange={(e) => {
                if (e.target.files) handleFiles(e.target.files, 'Brano Singolo');
                e.target.value = '';
              }}
            />

            {/* Native Multi-File Hidden Input */}
            <input
              type="file"
              ref={multiFileInputRef}
              multiple
              {...{ webkitdirectory: "", directory: "" }}
              className="hidden"
              onChange={(e) => {
                if (e.target.files) handleFiles(e.target.files, 'Cartella Musicale');
                e.target.value = '';
              }}
            />

            {/* ACTION CARD 1: Scegli Singolo Brano */}
            <div
              onClick={() => singleFileInputRef.current?.click()}
              className="p-4 rounded-2xl flex items-center justify-between border border-black/10 cursor-pointer transition active:scale-[0.98] hover:shadow-md"
              style={{
                backgroundColor: palette.surfaceContainer,
                borderColor: palette.primary,
              }}
            >
              <div className="flex items-center gap-3.5">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm"
                  style={{
                    backgroundColor: palette.primary,
                    color: palette.onPrimary,
                  }}
                >
                  <Music className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold">Scegli singolo brano</h4>
                    <span
                      className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full"
                      style={{
                        backgroundColor: palette.primaryContainer,
                        color: palette.onPrimaryContainer,
                      }}
                    >
                      Immediato
                    </span>
                  </div>
                  <p className="text-xs opacity-75 mt-0.5">
                    Seleziona 1 canzone (.mp3, .flac, .wav, .m4a, .aac)
                  </p>
                </div>
              </div>
            </div>

            {/* ACTION CARD 2: Scegli Intera Cartella */}
            <div
              onClick={() => multiFileInputRef.current?.click()}
              className="p-4 rounded-2xl flex items-center justify-between border border-black/10 cursor-pointer transition active:scale-[0.98] hover:shadow-md"
              style={{
                backgroundColor: palette.surfaceContainer,
              }}
            >
              <div className="flex items-center gap-3.5">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm"
                  style={{
                    backgroundColor: palette.secondaryContainer,
                    color: palette.onSecondaryContainer,
                  }}
                >
                  <FolderOpen className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold">Scegli intera cartella</h4>
                  <p className="text-xs opacity-75 mt-0.5">
                    Seleziona una cartella per importare tutta la musica contenuta
                  </p>
                </div>
              </div>
            </div>

            {/* Usage Hint */}
            <div
              className="p-3.5 rounded-2xl text-xs flex items-start gap-2.5 border border-black/5"
              style={{ backgroundColor: palette.surfaceContainer, color: palette.onSurface }}
            >
              <AudioLines className="w-4 h-4 shrink-0 mt-0.5" style={{ color: palette.primary }} />
              <p className="opacity-80 leading-relaxed text-[11px]">
                I brani importati rimangono salvati nella memoria del browser e possono essere riprodotti offline.
              </p>
            </div>

            {/* Scanning progress spinner */}
            {isScanning && (
              <div className="p-4 rounded-2xl bg-black/5 flex items-center gap-3 text-xs">
                <div className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin shrink-0" />
                <span className="font-semibold truncate">{statusMessage}</span>
              </div>
            )}

            {/* Success notification */}
            {importedCount !== null && (
              <div
                className="p-4 rounded-2xl flex items-center gap-3 text-xs shadow-sm"
                style={{
                  backgroundColor: palette.secondaryContainer,
                  color: palette.onSecondaryContainer,
                }}
              >
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                <span>
                  Operazione completata: <strong>{importedCount}</strong> brani aggiunti alla tua libreria!
                </span>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
