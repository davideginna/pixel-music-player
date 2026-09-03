import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { DynamicPalette } from '../types';

export interface ToastData {
  id?: string | number;
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

  const touchStartX = useRef<number>(0);
  const touchStartY = useRef<number>(0);
  const [isDismissing, setIsDismissing] = useState(false);

  // Key the auto-dismiss timer on the toast message or id, not generic object identity
  const toastKey = toast ? `${toast.id || ''}-${toast.message}` : '';

  useEffect(() => {
    if (!toast) {
      setIsDismissing(false);
      return;
    }

    setIsDismissing(false);
    // Faster dismiss: 2400ms for standard messages, 3000ms if there is an undo action
    const duration = toast.duration || (toast.actionLabel ? 3000 : 2400);

    const timer = setTimeout(() => {
      onDismissRef.current();
    }, duration);

    return () => clearTimeout(timer);
  }, [toastKey, toast?.actionLabel, toast?.duration]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    const deltaY = e.changedTouches[0].clientY - touchStartY.current;

    // If swiped horizontally or downward by more than 35px, dismiss immediately
    if (Math.abs(deltaX) > 35 || deltaY > 35) {
      setIsDismissing(true);
      onDismissRef.current();
    }
  };

  return (
    <AnimatePresence>
      {toast && !isDismissing && (
        <div
          className="fixed bottom-20 sm:bottom-24 left-1/2 -translate-x-1/2 z-50 px-4 w-full max-w-sm pointer-events-none"
          id="pixel-toast-container"
        >
          <motion.div
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.5}
            onDragEnd={(_, info) => {
              if (Math.abs(info.offset.x) > 40 || Math.abs(info.velocity.x) > 200) {
                setIsDismissing(true);
                onDismiss();
              }
            }}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.92, transition: { duration: 0.15 } }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="pointer-events-auto flex flex-col rounded-2xl shadow-xl border border-black/10 select-none cursor-grab active:cursor-grabbing overflow-hidden"
            style={{
              backgroundColor: palette.inverseSurface,
              color: palette.inverseOnSurface,
            }}
            id="pixel-toast-snackbar"
          >
            <div className="flex items-center justify-between gap-2.5 px-4 py-3">
              <span className="text-xs font-medium truncate flex-1">{toast.message}</span>

              {toast.actionLabel && toast.onAction && (
                <button
                  onClick={() => {
                    toast.onAction?.();
                    setIsDismissing(true);
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
                onClick={() => {
                  setIsDismissing(true);
                  onDismiss();
                }}
                className="p-1.5 rounded-full hover:bg-white/10 active:scale-90 transition opacity-70 hover:opacity-100 cursor-pointer shrink-0 ml-1"
                title="Chiudi avviso"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Subtle duration countdown indicator */}
            <motion.div
              initial={{ scaleX: 1 }}
              animate={{ scaleX: 0 }}
              transition={{
                duration: (toast.duration || (toast.actionLabel ? 3000 : 2400)) / 1000,
                ease: 'linear',
              }}
              style={{
                originX: 0,
                backgroundColor: palette.inversePrimary,
                height: '2px',
                opacity: 0.6,
              }}
            />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
