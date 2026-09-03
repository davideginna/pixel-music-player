import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
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
  const onDismissRef = useRef(onDismiss);
  onDismissRef.current = onDismiss;

  useEffect(() => {
    if (!toast) return;
    const duration = toast.duration || 3200;
    const timer = setTimeout(() => {
      onDismissRef.current();
    }, duration);
    return () => clearTimeout(timer);
  }, [toast]);

  return (
    <AnimatePresence>
      {toast && (
        <div className="fixed bottom-20 sm:bottom-24 left-1/2 -translate-x-1/2 z-50 px-4 w-full max-w-sm pointer-events-none">
          <motion.div
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.6}
            onDragEnd={(_, info) => {
              if (Math.abs(info.offset.x) > 50 || Math.abs(info.velocity.x) > 250) {
                onDismiss();
              }
            }}
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.92, transition: { duration: 0.15 } }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="pointer-events-auto flex items-center justify-between gap-2.5 px-4 py-3 rounded-2xl shadow-xl border border-black/10 select-none cursor-grab active:cursor-grabbing touch-pan-y"
            style={{
              backgroundColor: palette.inverseSurface,
              color: palette.inverseOnSurface,
            }}
            id="pixel-toast-snackbar"
          >
            <span className="text-xs font-medium truncate flex-1">{toast.message}</span>

            {toast.actionLabel && toast.onAction && (
              <button
                onClick={() => {
                  toast.onAction?.();
                  onDismiss();
                }}
                className="px-3 py-1 rounded-full text-xs font-bold shrink-0 transition active:scale-95 cursor-pointer shadow-sm"
                style={{
                  backgroundColor: palette.inversePrimary,
                  color: palette.primary,
                }}
              >
                {toast.actionLabel}
              </button>
            )}

            <button
              onClick={onDismiss}
              className="p-1 rounded-full hover:bg-white/10 active:scale-90 transition opacity-70 hover:opacity-100 cursor-pointer shrink-0 ml-1"
              title="Chiudi"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
