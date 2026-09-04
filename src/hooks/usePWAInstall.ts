import { useState, useEffect } from 'react';

// Extend the WindowEventMap to include beforeinstallprompt
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

declare global {
  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent;
  }
}

export function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if the user has previously dismissed the banner
    const dismissed = localStorage.getItem('pixel_music_pwa_dismissed');
    
    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
      setIsInstallable(true);
      
      if (dismissed !== 'true') {
        setShowBanner(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // If it's already installed, we might get an appinstalled event
    window.addEventListener('appinstalled', () => {
      setIsInstallable(false);
      setShowBanner(false);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const promptInstall = async () => {
    if (!deferredPrompt) return;
    
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setIsInstallable(false);
      setShowBanner(false);
    }
    
    // We can no longer use this prompt
    setDeferredPrompt(null);
  };

  const dismissBanner = () => {
    setShowBanner(false);
    localStorage.setItem('pixel_music_pwa_dismissed', 'true');
  };

  return {
    isInstallable,
    showBanner,
    promptInstall,
    dismissBanner,
  };
}
