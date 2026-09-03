import React from 'react';
import { motion } from 'motion/react';
import { Home, Library, Search, Settings } from 'lucide-react';
import { DynamicPalette, NavigationTab } from '../types';

interface NavigationBarProps {
  currentTab: NavigationTab;
  onTabChange: (tab: NavigationTab) => void;
  palette: DynamicPalette;
}

export const NavigationBar: React.FC<NavigationBarProps> = ({
  currentTab,
  onTabChange,
  palette,
}) => {
  const tabs: { id: NavigationTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'library', label: 'Libreria', icon: Library },
    { id: 'search', label: 'Cerca', icon: Search },
    { id: 'settings', label: 'Impostazioni', icon: Settings },
  ];

  return (
    <nav
      id="pixel-bottom-navigation"
      className="w-full h-16 flex items-center justify-around px-2 select-none border-t border-[#CAC4D0]/60 transition-colors duration-300 shrink-0"
      style={{
        backgroundColor: palette.surfaceContainer,
        color: palette.onSurfaceVariant,
      }}
    >
      {tabs.map((tab) => {
        const isActive = currentTab === tab.id;
        const IconComponent = tab.icon;

        return (
          <button
            key={tab.id}
            id={`nav-tab-${tab.id}`}
            onClick={() => onTabChange(tab.id)}
            className="flex-1 flex flex-col items-center justify-center py-1 relative group cursor-pointer focus:outline-none transition-transform active:scale-95"
          >
            {/* Pill Active Indicator */}
            <div className="relative flex items-center justify-center px-5 py-1 rounded-full mb-1">
              {isActive && (
                <motion.div
                  layoutId="m3-nav-pill-indicator"
                  className="absolute inset-0 rounded-full"
                  style={{ backgroundColor: palette.secondaryContainer }}
                  transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                />
              )}
              <span
                className="relative z-10 transition-colors duration-200"
                style={{
                  color: isActive ? palette.onSecondaryContainer : palette.onSurfaceVariant,
                }}
              >
                <IconComponent className="w-5 h-5" />
              </span>
            </div>

            {/* Label */}
            <span
              className="text-[11px] font-medium tracking-tight transition-colors duration-200"
              style={{
                color: isActive ? palette.onSurface : palette.onSurfaceVariant,
                fontWeight: isActive ? 700 : 500,
              }}
            >
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
