import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { DynamicPalette } from '../types';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
  onConfirm: () => void;
  onClose: () => void;
  palette: DynamicPalette;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  description,
  confirmLabel = 'Elimina',
  cancelLabel = 'Annulla',
  isDestructive = true,
  onConfirm,
  onClose,
  palette,
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm select-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 12 }}
          transition={{ type: 'spring', damping: 26, stiffness: 320 }}
          className="w-full max-w-sm rounded-[28px] p-6 shadow-2xl border border-black/10 overflow-hidden"
          style={{
            backgroundColor: palette.surfaceContainerHigh,
            color: palette.onSurface,
          }}
          id="pixel-confirm-dialog"
        >
          {/* Icon Header */}
          <div className="flex items-center gap-3 mb-3">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0"
              style={{
                backgroundColor: isDestructive ? 'rgba(239, 68, 68, 0.15)' : palette.primaryContainer,
                color: isDestructive ? '#EF4444' : palette.onPrimaryContainer,
              }}
            >
              {isDestructive ? <Trash2 className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
            </div>
            <h3 className="text-base font-bold leading-tight">{title}</h3>
          </div>

          <p className="text-xs opacity-75 leading-relaxed mb-6">
            {description}
          </p>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2.5">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-full text-xs font-semibold hover:bg-black/5 active:scale-95 transition"
              style={{ color: palette.onSurfaceVariant }}
            >
              {cancelLabel}
            </button>

            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className="px-5 py-2 rounded-full text-xs font-bold shadow-sm active:scale-95 transition flex items-center gap-1.5"
              style={{
                backgroundColor: isDestructive ? '#DC2626' : palette.primary,
                color: '#FFFFFF',
              }}
            >
              {isDestructive && <Trash2 className="w-3.5 h-3.5" />}
              <span>{confirmLabel}</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
