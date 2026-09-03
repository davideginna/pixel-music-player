import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { DynamicPalette } from '../types';

export interface ToastData {
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  duration?: number;
}

interface ToastProps {
  toast: ToastData | null;
  onDismiss: () => void;
  palette: DynamicPalette;
}

export const Toast: React.FC<ToastProps> = ({ toast, onDismiss, palette }) => {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onDismiss();
    }, toast.duration || 4000);
    return () => clearTimeout(timer);
  }, [toast, onDismiss]);

  if (!toast) return null;

  return (
    <AnimatePresence>
      <div className="fixed bottom-20 sm:bottom-24 left-1/2 -translate-x-1/2 z-50 px-4 w-full max-w-sm pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 15, scale: 0.95 }}
          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          className="pointer-events-auto flex items-center justify-between gap-3 px-4 py-3 rounded-2xl shadow-xl border border-black/10 select-none"
          style={{
            backgroundColor: palette.inverseSurface,
            color: palette.inverseOnSurface,
          }}
          id="pixel-toast-snackbar"
        >
          <span className="text-xs font-medium truncate">{toast.message}</span>
          {toast.actionLabel && toast.onAction && (
            <button
              onClick={() => {
                toast.onAction?.();
                onDismiss();
              }}
              className="px-3 py-1 rounded-full text-xs font-bold shrink-0 transition active:scale-95"
              style={{
                backgroundColor: palette.inversePrimary,
                color: palette.primary,
              }}
            >
              {toast.actionLabel}
            </button>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
