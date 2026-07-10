/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AppWindow, ThemeConfig, WallpaperConfig, TrashItem, NotificationItem } from './types';
import { WALLPAPERS, THEMES, DEFAULT_TRASH, ICONS } from './data';
import DesktopView from './components/DesktopView';
import MobileView from './components/MobileView';
import { audioSynth } from './utils/audio';
import { Laptop, Smartphone, Terminal as TerminalIcon, Bell, X, ShieldAlert } from 'lucide-react';

export default function App() {
  // 1. Fast Startup Simulation States (exactly 0.9s duration target)
  const [isStartingUp, setIsStartingUp] = useState(true);

  // 2. Active Screen Layout Format (PC Desktop vs Smartphone phone)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Custom manual overwrite for user convenience (lets them inspect both views easily on any screen!)
  const [forceCompactMode, setForceCompactMode] = useState<boolean | null>(null);

  // 3. Systems Sound Feedback Preference
  const [soundEnabled, setSoundEnabled] = useState(true);

  // 4. Fixed wallpapers for each layout
  const desktopWallpaper: WallpaperConfig = WALLPAPERS.find(w => w.id === 'samsung_monitor') ?? WALLPAPERS[0];
  const mobileWallpaper: WallpaperConfig = WALLPAPERS.find(w => w.id === 'samsung_phone') ?? WALLPAPERS[1] ?? WALLPAPERS[0];

  // 5. Theme configs
  const [theme, setTheme] = useState<ThemeConfig>(THEMES[0]); // Default Dark Glass

  // 6. Trash logs
  const [trash, setTrash] = useState<TrashItem[]>(DEFAULT_TRASH);

  // 7. Spot light search state
  const [searchOpen, setSearchOpen] = useState(false);

  // 8. Custom active floating toast notification states
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info'; visible: boolean } | null>(null);

  // 9. Systems event alerts notifier logs
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'not_1', message: 'Welcome to imran OS v2.4!', type: 'success', time: 'Just now'
    },
    { id: 'not_2', message: 'Core layout engines fully operational.', type: 'info', time: '1m ago' }
  ]);
  const [showNotificationCenter, setShowNotificationCenter] = useState(false);

  // Active floating windows state configuration
  const [windows, setWindows] = useState<AppWindow[]>([
    // Custom projects
    { id: 'layerly', title: 'Layerly Project Workspace', isOpen: false, isFocused: false, x: 60, y: 50, width: 700, height: 520, zIndex: 10, icon: ICONS.layerly },
    { id: 'ethernote', title: 'EtherNote Knowledge Graph', isOpen: false, isFocused: false, x: 100, y: 80, width: 700, height: 520, zIndex: 10, icon: ICONS.ethernote },
    { id: 'qrnest', title: 'QR Nest Automation Dashboard', isOpen: false, isFocused: false, x: 140, y: 110, width: 700, height: 520, zIndex: 10, icon: ICONS.qrnest },
    { id: 'tstrike', title: 'T-Strike Telemetry System', isOpen: false, isFocused: false, x: 180, y: 140, width: 700, height: 520, zIndex: 10, icon: ICONS.tstrike },
    { id: 'keysmith', title: 'KeySmith Security Terminal', isOpen: false, isFocused: false, x: 220, y: 170, width: 700, height: 520, zIndex: 10, icon: ICONS.keysmith },
    { id: 'layoutlab', title: 'Layout Lab Bento Canvas', isOpen: false, isFocused: false, x: 260, y: 200, width: 700, height: 520, zIndex: 10, icon: ICONS.layoutlab },
  ]);

  // Handle fast startup load (0.9s duration target)
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsStartingUp(false);
      // Play brief high tick click when operational
      setTimeout(() => {
        audioSynth.playClick();
        showToast('Welcome to imran OS v2.4.0 • System Online', 'success');
      }, 100);
    }, 900);

    return () => clearTimeout(timer);
  }, []);

  // Window coordinates tracking on load & resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // System local storage backup restoration sync
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Fixed desktop/mobile wallpapers, no persistent wallpaper switching
      const storedTheme = localStorage.getItem('imranos_theme');
      if (storedTheme) {
        try { setTheme(JSON.parse(storedTheme)); } catch (e) { console.warn(e); }
      }

      const storedSound = localStorage.getItem('imranos_sound_enabled');
      if (storedSound !== null) {
        setSoundEnabled(storedSound !== 'false');
      }

      const storedTrash = localStorage.getItem('imranos_trash');
      if (storedTrash) {
        try { setTrash(JSON.parse(storedTrash)); } catch (e) { console.warn(e); }
      }
    }
  }, []);

  // Save changes to trash locally
  useEffect(() => {
    localStorage.setItem('imranos_trash', JSON.stringify(trash));
  }, [trash]);

  // Spotlight Ctrl + K monitoring trigger
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen(prev => !prev);
        audioSynth.playTick();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Dynamic status/greeting modifier depending on local timezone
  const getAmbientLapse = () => {
    const hour = new Date().getHours();
    if (hour < 6) return 'Night Ambient';
    if (hour < 12) return 'Morning Rise';
    if (hour < 18) return 'Daylight Core';
    return 'Evening Dim';
  };

  const showToast = (message: string, type: 'success' | 'info' = 'success') => {
    setToast({ message, type, visible: true });
  };

  // Auto clear active toasts
  useEffect(() => {
    if (toast?.visible) {
      const timer = setTimeout(() => {
        setToast(prev => prev ? { ...prev, visible: false } : null);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const addNotification = (message: string, type: 'success' | 'info' = 'info') => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setNotifications(prev => [
      { id: `not_${Date.now()}`, message, type, time: timeStr },
      ...prev.slice(0, 9) // Limit to 10 logs
    ]);
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const activeModeMobile = forceCompactMode !== null ? forceCompactMode : isMobile;

  return (
    <div className={`w-full h-[100dvh] overflow-hidden relative select-none bg-slate-950 text-slate-100 ${theme.textColor}`}>

      {/* 1. imran OS Fast Startup Simulator (Exactly 0.9s duration fade) */}
      <AnimatePresence>
        {isStartingUp && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 z-[99999] bg-slate-950 flex flex-col justify-center items-center select-none"
          >
            <div className="flex flex-col items-center gap-4 text-center">
              {/* Dynamic glowing core launcher logo */}
              <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-3 flex items-center justify-center shadow-[0_0_35px_rgba(16,185,129,0.3)] border border-emerald-400/20">
                <span className="text-2xl font-bold text-slate-955 tracking-tighter">I</span>
                <span className="text-2xl font-bold text-slate-955 tracking-tighter">O</span>
                <div className="absolute inset-x-0 bottom-0 top-0 bg-white/20 rounded-2xl border-b-2 border-white/25" />
              </div>
              <div>
                <h1 className="text-lg font-bold tracking-widest text-white uppercase font-sans">imran OS</h1>
                <p className="text-[10px] font-mono tracking-wider text-emerald-400/80 uppercase mt-1">Booting system engines...</p>
              </div>

              {/* Loader bars */}
              <div className="w-36 h-0.5 bg-white/10 rounded-full overflow-hidden mt-3">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 0.75, ease: 'easeInOut' }}
                  className="h-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. System Toast system alert elements */}
      <AnimatePresence>
        {toast && toast.visible && (
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            className="fixed top-14 left-1/2 -translate-x-1/2 z-[5000] px-4 py-2.5 rounded-2xl border backdrop-blur-xl shadow-2xl flex items-center gap-2.5 text-xs text-white/95 text-center bg-slate-950/90 border-emerald-500/30 font-sans tracking-wide"
          >
            <div className={`w-2 h-2 rounded-full ${toast.type === 'success' ? 'bg-emerald-400 animate-ping' : 'bg-sky-450'}`} />
            <span>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 4. Main Adapter Controller Output */}
      {activeModeMobile ? (
        <MobileView
          theme={theme}
          setTheme={setTheme}
          wallpaper={mobileWallpaper}
          windows={windows}
          setWindows={setWindows}
          showToast={showToast}
          trash={trash}
          setTrash={setTrash}
          addNotification={addNotification}
          soundEnabled={soundEnabled}
          setSoundEnabled={setSoundEnabled}
        />
      ) : (
        <DesktopView
          theme={theme}
          setTheme={setTheme}
          wallpaper={desktopWallpaper}
          windows={windows}
          setWindows={setWindows}
          showToast={showToast}
          trash={trash}
          setTrash={setTrash}
          addNotification={addNotification}
          soundEnabled={soundEnabled}
          setSoundEnabled={setSoundEnabled}
          searchOpen={searchOpen}
          setSearchOpen={setSearchOpen}
        />
      )}

      {/* 5. Notification Center Sidebar Slider */}
      <AnimatePresence>
        {showNotificationCenter && (
          <motion.div
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 26, stiffness: 220 }}
            className="fixed right-4 top-14 w-80 rounded-3xl bg-slate-950/85 border border-white/10 shadow-[0_15px_40px_rgba(0,0,0,0.8)] p-5 backdrop-blur-xl z-[400] text-slate-100 font-sans"
          >
            <div className="flex justify-between items-center pb-3 border-b border-white/5 mb-4 select-none">
              <h3 className="text-xs font-bold font-mono tracking-widest text-emerald-400 uppercase">System Logs</h3>
              <button
                type="button"
                id="close_notif_center"
                onClick={() => setShowNotificationCenter(false)}
                className="p-1 rounded-full hover:bg-white/10 text-white/40 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3.5 max-h-[400px] overflow-y-auto select-none pr-1">
              {notifications.length > 0 ? (
                notifications.map((not) => (
                  <div key={not.id} className="p-3 bg-white/5 border border-white/5 rounded-2xl flex items-start gap-3 relative group">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400/80 mt-1 shrink-0" />
                    <div className="overflow-hidden">
                      <p className="text-xs text-slate-205 leading-relaxed">{not.message}</p>
                      <span className="text-[9px] font-mono text-white/35 block mt-1">{not.time} • CPU verification passed</span>
                    </div>
                    <button
                      type="button"
                      id={`clear_notif_${not.id}`}
                      onClick={() => removeNotification(not.id)}
                      className="opacity-0 group-hover:opacity-100 p-0.5 rounded hover:bg-white/10 text-white/45 hover:text-red-405 absolute top-2 right-2 cursor-pointer transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center text-white/30 text-xs font-mono">
                  No system logs registered.
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-white/5 mt-4 text-[9px] font-mono text-slate-400/60 select-none flex justify-between">
              <span>Timezone: {getAmbientLapse()}</span>
              <span>UTC Synchronized</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
