/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Download } from 'lucide-react';
import { ICONS, PROJECTS, THEMES, DEFAULT_TRASH, DESKTOP_PANEL_APPS, ABOUT_TEXT } from '../data';
import { AppWindow, ThemeConfig, WallpaperConfig, TrashItem } from '../types';
import Window from './Window';
import SearchModal from './SearchModal';
import { audioSynth } from '../utils/audio';
import { clientProjectIcons } from '../assets/images/client-projects';
import whatsappIcon from '../assets/images/whatsapp.jpg';
import emailIcon from '../assets/images/email.jpg';
import linkedinIcon from '../assets/images/linkedin.jpg';
import photo from '../assets/images/photo.jpg';
import image from '../assets/images/image.png';
interface DesktopViewProps {
  theme: ThemeConfig;
  setTheme: (t: ThemeConfig) => void;
  wallpaper: WallpaperConfig;
  windows: AppWindow[];
  setWindows: React.Dispatch<React.SetStateAction<AppWindow[]>>;
  showToast: (msg: string, type?: 'success' | 'info') => void;
  trash: TrashItem[];
  setTrash: React.Dispatch<React.SetStateAction<TrashItem[]>>;
  addNotification: (msg: string, type?: 'success' | 'info') => void;
  soundEnabled: boolean;
  setSoundEnabled: (b: boolean) => void;
  searchOpen: boolean;
  setSearchOpen: (b: boolean) => void;
}

export default function DesktopView({
  theme,
  setTheme,
  wallpaper,
  windows,
  setWindows,
  showToast,
  trash,
  setTrash,
  addNotification,
  soundEnabled,
  setSoundEnabled,
  searchOpen,
  setSearchOpen,
}: DesktopViewProps) {
  // Desktop selection state
  const [selectedIconId, setSelectedIconId] = useState<string | null>(null);
  const [windowHistory, setWindowHistory] = useState<string[]>([]);
  const [showRecyclePopup, setShowRecyclePopup] = useState(false);

  const projectPanelItems = PROJECTS.filter((project) => ['qrnest', 'ethernote', 'layoutlab', 'layerly', 'keysmith', 'tstrike', 'optiqo'].includes(project.id)).map((project) => ({
    id: project.id,
    title: project.name,
    icon: (ICONS as Record<string, string>)[project.id] ?? ICONS.layerly,
    url: project.liveUrl,
  }));

  const clientProjectPanelItems = [
    { id: 'crescent-connect', title: 'Crescent Connect', icon: clientProjectIcons['crescent-connect'], url: 'https://college-website-henna-phi.vercel.app/' },
    { id: 'aditya-skill-gate', title: 'Aditya Skill Gate', icon: clientProjectIcons['aditya-skill-gate'], url: 'https://adityaskillgate-itsolution.vercel.app/' },
    { id: 'echoes', title: 'Echoes', icon: clientProjectIcons['echoes'], url: 'https://website-rho-roan-86.vercel.app/' },
    { id: 'digirfu', title: 'Digirfu', icon: clientProjectIcons['digirfu'], url: 'https://www.digirfu.com/' },
  ];

  type DesktopIcon = {
    id: string;
    title: string;
    icon: string;
    count?: number;
    url?: string;
  };

  const desktopIcons: DesktopIcon[] = [];

  const desktopPanelItems = DESKTOP_PANEL_APPS.map((item) => ({
    id: item.id,
    title: item.title,
    icon: item.icon,
    url: item.url,
  }));

  const handleOpenProjectLink = (url: string, title: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
    audioSynth.playClick();
    showToast(`Opening ${title}...`, 'success');
  };

  const handleDesktopIconClick = (icon: DesktopIcon) => {
    if (icon.url) {
      window.open(icon.url, '_blank', 'noopener,noreferrer');
      audioSynth.playClick();
      showToast(`Opening ${icon.title}...`, 'success');
      return;
    }
    setSelectedIconId(icon.id);
  };

  const handleDesktopIconDoubleClick = (icon: DesktopIcon) => {
    if (icon.url) {
      window.open(icon.url, '_blank', 'noopener,noreferrer');
      audioSynth.playClick();
      showToast(`Opening ${icon.title}...`, 'success');
      return;
    }
    handleOpenApp(icon.id);
  };

  const handleProjectPanelClick = (item: { id: string; title: string; url?: string }) => {
    if (item.url) {
      window.open(item.url, '_blank', 'noopener,noreferrer');
      audioSynth.playClick();
      showToast(`Opening ${item.title}...`, 'success');
      return;
    }
    handleOpenApp(item.id);
  };

  // Mouse selection container click clear
  const handleDesktopClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (!target.closest('.desktop-icon')) {
      setSelectedIconId(null);
    }
    setShowRecyclePopup(false);
  };

  // Keyboard navigation on desktop
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Escape closes current focused window
      if (e.key === 'Escape') {
        const focused = windows.find(w => w.isFocused);
        if (focused) {
          audioSynth.playPop();
          setWindows(prev => prev.map(w => w.id === focused.id ? { ...w, isOpen: false, isFocused: false } : w));
          showToast(`Closed "${focused.title}"`, 'info');
        }
        return;
      }

      // Enter launches selected icon
      if (e.key === 'Enter' && selectedIconId) {
        handleOpenApp(selectedIconId);
        return;
      }

      // Arrow keys navigation
      if (['ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
        const currentIndex = desktopIcons.findIndex(icon => icon.id === selectedIconId);
        let nextIndex = 0;

        if (currentIndex === -1) {
          setSelectedIconId(desktopIcons[0].id);
        } else {
          if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
            nextIndex = (currentIndex + 1) % desktopIcons.length;
          } else {
            nextIndex = (currentIndex - 1 + desktopIcons.length) % desktopIcons.length;
          }
          setSelectedIconId(desktopIcons[nextIndex].id);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIconId, windows]);

  // Handle right click on desktop: prevent the menu and keep the UI clean
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  const handleOpenApp = (appId: string) => {
    audioSynth.playClick();
    setSelectedIconId(appId);

    setWindows(prev => {
      const elevatedZIndex = Math.max(...prev.map(w => w.zIndex), 10) + 1;

      return prev.map(w => {
        if (w.id === appId) {
          return {
            ...w,
            isOpen: true,
            isFocused: true,
            zIndex: elevatedZIndex
          };
        }
        return { ...w, isFocused: false };
      });
    });

    setWindowHistory(prev => {
      if (prev[prev.length - 1] === appId) return prev;
      return [...prev, appId];
    });

    const target = desktopIcons.find(icon => icon.id === appId);
    if (target) {
      showToast(`Launching ${target.title}...`, 'success');
    }
  };

  const handleCloseApp = (appId: string) => {
    setWindows(prev => prev.map(w => w.id === appId ? { ...w, isOpen: false, isFocused: false } : w));
    setWindowHistory(prev => prev.filter(id => id !== appId));
  };

  const handleWindowBack = (appId: string) => {
    setWindowHistory(prev => {
      const currentIndex = prev.lastIndexOf(appId);
      if (currentIndex <= 0) return prev;

      const previousAppId = prev[currentIndex - 1];
      setWindows(ws => ws.map(w => ({
        ...w,
        isFocused: w.id === previousAppId,
        isOpen: w.id === previousAppId || w.id === appId ? true : w.isOpen
      })));

      return prev.slice(0, currentIndex);
    });
  };

  const handleFocusApp = (appId: string) => {
    setWindows(prev => {
      const active = prev.find(w => w.id === appId);
      if (active?.isFocused) return prev; // Already focused

      const elevatedZIndex = Math.max(...prev.map(w => w.zIndex), 10) + 1;
      return prev.map(w => {
        if (w.id === appId) {
          return { ...w, isFocused: true, zIndex: elevatedZIndex };
        }
        return { ...w, isFocused: false };
      });
    });
  };

  const handleMoveApp = (appId: string, x: number, y: number) => {
    setWindows(prev => prev.map(w => w.id === appId ? { ...w, x, y } : w));
  };

  // Parallax backdrop effect
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const handleMouseMove = (e: React.MouseEvent) => {
    const factor = 18; // parallax divisor speed
    const xOffset = (e.clientX - window.innerWidth / 2) / factor;
    const yOffset = (e.clientY - window.innerHeight / 2) / factor;
    setMousePos({ x: xOffset, y: yOffset });
  };

  return (
    <div
      id="desktop_stage"
      className="relative w-full h-[100dvh] overflow-hidden flex select-none pointer-events-auto"
      onClick={handleDesktopClick}
      onContextMenu={handleContextMenu}
      onMouseMove={handleMouseMove}
    >
      {/* High-res Wallpapers Back Drop */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-1000 scale-105"
        style={{
          backgroundImage: `url(${wallpaper.url})`,
          transform: `translate(${mousePos.x}px, ${mousePos.y}px) scale(1.05)`
        }}
      />
      <div className="absolute inset-x-0 bottom-0 top-0 bg-black/35 pointer-events-none" />

      {/* Main Grid View */}
      <div className="flex-1 h-full p-8 relative flex flex-col justify-between">
        {/* Content Row: Projects Panels + Desktop Icons */}
        <div className="flex gap-8 items-start">
          <div className="flex flex-col gap-6 items-start shrink-0">
            <div className="w-64 rounded-3xl border border-white/15 bg-slate-900/40 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.3)] backdrop-blur-2xl">
              <div className="mb-4 text-center">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-300">My Projects</p>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {projectPanelItems.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleProjectPanelClick(item)}
                    className="group flex flex-col items-center gap-2 text-center transition-all hover:border-emerald-400/40 hover:bg-emerald-500/10"
                  >
                    <img src={item.icon} alt={item.title} className="h-16 w-16 rounded-[18px] object-cover border border-white/15 bg-slate-900/70 p-1 shadow-lg transition-transform group-hover:scale-105" referrerPolicy="no-referrer" />
                    <span className="text-[9px] font-medium leading-tight text-white/90 truncate max-w-full">{item.title}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="w-64 rounded-3xl border border-white/15 bg-slate-900/40 p-4 shadow-[0_20px_60px_rgba(0,0,0,0.3)] backdrop-blur-2xl">
              <div className="mb-3 text-center">
                <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-green-300">BUSINESS APPS</p>
              </div>
              <div className="grid grid-cols-3 gap-2.5">
                {desktopPanelItems.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleProjectPanelClick(item)}
                    className="group flex flex-col items-center gap-2 text-center transition-all hover:border-emerald-400/40 hover:bg-emerald-500/10"
                  >
                    <img src={item.icon} alt={item.title} className="h-12 w-12 rounded-[14px] object-cover border border-white/15 bg-slate-900/70 p-1 shadow-lg transition-transform group-hover:scale-105" referrerPolicy="no-referrer" />
                    <span className="text-[8px] font-medium leading-tight text-white/90 truncate max-w-full">{item.title}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            {/* Smaller Client Projects Panel */}
            <div className="w-56 rounded-3xl border border-white/15 bg-slate-900/35 p-4 shadow-[0_16px_45px_rgba(0,0,0,0.25)] backdrop-blur-2xl">
              <div className="mb-3 text-center">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300">Client Projects</p>
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                {clientProjectPanelItems.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleProjectPanelClick(item)}
                    className="group flex flex-col items-center justify-center gap-2 text-center transition-all hover:border-emerald-400/40 hover:bg-emerald-500/10"
                  >
                    <img src={item.icon} alt={item.title} className="h-16 w-16 rounded-[18px] object-cover border border-white/15 bg-slate-900/70 p-1 shadow-lg transition-transform group-hover:scale-105" referrerPolicy="no-referrer" />
                    <span className="text-[9px] font-medium leading-tight text-white/90 truncate max-w-full">{item.title}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2.5">
              <a
                href="https://wa.me/919363001680"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => audioSynth.playTick()}
                className="group flex flex-col items-center justify-center gap-2 text-center transition-all"
                title="WhatsApp"
              >
                <img
                  src={whatsappIcon}
                  alt="WhatsApp"
                  className="h-16 w-16 rounded-[18px] object-cover border border-white/15 bg-slate-900/70 p-1 shadow-lg transition-transform group-hover:scale-105"
                />
                <span className="text-[9px] font-medium leading-tight text-white/90 truncate max-w-full">WhatsApp</span>
              </a>

              <a
                href="mailto:abdulkadarimran@gmail.com"
                onClick={() => audioSynth.playTick()}
                className="group flex flex-col items-center justify-center gap-2 text-center transition-all"
                title="Email"
              >
                <img
                  src={emailIcon}
                  alt="Email"
                  className="h-16 w-16 rounded-[18px] object-cover border border-white/15 bg-slate-900/70 p-1 shadow-lg transition-transform group-hover:scale-105"
                />
                <span className="text-[9px] font-medium leading-tight text-white/90 truncate max-w-full">Email</span>
              </a>

              <a
                href="https://linkedin.com/in/abdulkadarimran"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => audioSynth.playTick()}
                className="group flex flex-col items-center justify-center gap-2 text-center transition-all"
                title="LinkedIn"
              >
                <img
                  src={linkedinIcon}
                  alt="LinkedIn"
                  className="h-16 w-16 rounded-[18px] object-cover border border-white/15 bg-slate-900/70 p-1 shadow-lg transition-transform group-hover:scale-105"
                />
                <span className="text-[9px] font-medium leading-tight text-white/90 truncate max-w-full">LinkedIn</span>
              </a>
            </div>

            {/* Resume Download Button */}
            <a
              href="/resume/Imran-cv.pdf"
              download="Imran-cv.pdf"
              onClick={() => audioSynth.playTick()}
              className="group flex flex-row items-center justify-center gap-2 text-center transition-all bg-sky-500 hover:bg-sky-600 rounded-2xl py-3 px-4 shadow-lg shadow-sky-500/20 text-slate-950 font-bold cursor-pointer w-full mt-2"
            >
              <Download className="w-4 h-4" />
              <span className="text-xs tracking-wide">Download Resume</span>
            </a>

          </div>
        </div>

        {/* Desktop Workspace Grid (icons arranged in neat vertical columns) */}
        <div className="grid grid-flow-col auto-cols-max grid-rows-6 sm:grid-rows-5 md:grid-rows-6 gap-x-6 gap-y-4 max-h-[80vh] items-start justify-start z-10" />
      </div>

      {/* Floating Windows Stack */}
      <div className="absolute inset-0 z-30 pointer-events-none">
        {windows.map((w) => (
          <Window
            key={w.id}
            {...w}
            onClose={handleCloseApp}
            onFocus={handleFocusApp}
            onMove={handleMoveApp}
            onOpenApp={handleOpenApp}
            onBack={() => handleWindowBack(w.id)}
            canGoBack={windowHistory.length > 1 && windowHistory[windowHistory.length - 1] === w.id}
            theme={theme}
            showToast={showToast}
            isMobile={false}
            trash={trash}
            setTrash={setTrash}
            addNotification={addNotification}
          />
        ))}
      </div>

      {/* Elegant glossy self introduction panel */}
      <div className="hidden lg:flex w-[700px] h-full p-8 select-none z-20 shrink-0 flex-col justify-start items-end">
        <div className="w-full rounded-3xl border border-white/15 bg-slate-900/35 p-6 shadow-[0_16px_45px_rgba(0,0,0,0.25)] backdrop-blur-2xl h-[360px] flex flex-col">

          <div className="mb-2 text-center">
            <p className="text-m font-semibold uppercase tracking-[0.22em] text-emerald-300">
              About Me
            </p>
          </div>

          <div className="flex items-center gap-4 mb-5 shrink-0">
            <img
              src={photo}
              alt="Imran"
              className="w-20 h-20 rounded-2xl object-cover border border-white/15 shadow-lg"
            />

            <div>
              <h2 className="text-xl font-bold text-white leading-tight">
                Abdul Kadar Imran
              </h2>

              <p className="text-sm text-emerald-400 font-medium">
                Frontend Architect
              </p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
            <p className="text-[15px] leading-8 text-white/75 text-justify">
              {ABOUT_TEXT}
            </p>
          </div>

        </div>

        {/* Skill Set Panel + Recycle Bin (side by side, Skill Set left, Trash right) */}
        <div className="w-full mt-6 flex flex-row gap-3 items-center">

          {/* Glossy Skill Set Panel */}
          <div className="flex-1 rounded-3xl border border-white/15 bg-slate-900/35 p-2 shadow-[0_16px_45px_rgba(0,0,0,0.25)] backdrop-blur-2xl flex flex-col">
            <div className="mb-1 text-center">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-300">Skill Set</p>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-1 justify-items-center items-center py-1">
              {/* React */}
              <div className="group flex flex-col items-center gap-2 cursor-pointer">
                <div className="w-14 h-14 rounded-2xl border border-white/10 bg-slate-950/40 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:border-cyan-400/50 group-hover:bg-cyan-500/10 shadow-[0_0_15px_rgba(97,218,251,0.0)] group-hover:shadow-[0_0_15px_rgba(97,218,251,0.3)]">
                  <svg viewBox="-11.5 -10.23174 23 20.46348" className="w-8 h-8 text-[#61dafb] fill-none stroke-current" strokeWidth="1.2">
                    <ellipse rx="11" ry="4.2" />
                    <ellipse rx="11" ry="4.2" transform="rotate(60)" />
                    <ellipse rx="11" ry="4.2" transform="rotate(120)" />
                    <circle r="2" className="fill-[#61dafb]" />
                  </svg>
                </div>
                <span className="text-[10px] font-mono text-white/70 group-hover:text-[#61dafb] transition-colors">React</span>
              </div>
              {/* TypeScript */}
              <div className="group flex flex-col items-center gap-2 cursor-pointer">
                <div className="w-14 h-14 rounded-2xl border border-white/10 bg-slate-950/40 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:border-blue-400/50 group-hover:bg-blue-500/10 shadow-[0_0_15px_rgba(49,120,198,0.0)] group-hover:shadow-[0_0_15px_rgba(49,120,198,0.3)]">
                  <svg viewBox="0 0 24 24" className="w-7 h-7 text-[#3178c6] fill-current">
                    <path d="M0 0h24v24H0V0zm22.034 18.268c-.147-1.258-1.127-2.316-2.91-2.91-1.78-.6-2.887-.872-2.887-1.8 0-.66.528-.962 1.1-.962.83 0 1.34.394 1.705 1.135l1.9-1.218c-.62-1.183-1.68-1.938-3.357-1.938-2.612 0-3.95 1.55-3.95 3.39 0 2.682 2.378 3.486 4.6 4.19 1.78.583 2.213.992 2.213 1.72 0 .866-.81 1.258-1.843 1.258-1.464 0-2.268-.788-2.69-1.765l-1.938 1.156c.64 1.488 2.052 2.457 4.542 2.457 3.39 0 4.168-1.95 4.168-3.482zM8.347 10.428H3.344v2.158H5.85v9.117h2.49v-9.117h2.507v-2.158z" />
                  </svg>
                </div>
                <span className="text-[10px] font-mono text-white/70 group-hover:text-[#3178c6] transition-colors">TypeScript</span>
              </div>
              {/* Tailwind CSS */}
              <div className="group flex flex-col items-center gap-2 cursor-pointer">
                <div className="w-14 h-14 rounded-2xl border border-white/10 bg-slate-950/40 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:border-sky-400/50 group-hover:bg-sky-500/10 shadow-[0_0_15px_rgba(56,189,248,0.0)] group-hover:shadow-[0_0_15px_rgba(56,189,248,0.3)]">
                  <svg viewBox="0 0 24 24" className="w-7 h-7 text-[#38bdf8] fill-current">
                    <path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.337 6.182 14.976 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C7.666 17.818 9.027 19 12.001 19c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.337 13.382 8.976 12 6.001 12z" />
                  </svg>
                </div>
                <span className="text-[10px] font-mono text-white/70 group-hover:text-[#38bdf8] transition-colors">Tailwind</span>
              </div>
              {/* Figma */}
              <div className="group flex flex-col items-center gap-2 cursor-pointer">
                <div className="w-14 h-14 rounded-2xl border border-white/10 bg-slate-950/40 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:border-white/30 group-hover:bg-white/5 shadow-[0_0_15px_rgba(255,255,255,0.0)] group-hover:shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                  <svg viewBox="0 0 38 57" fill="none" className="w-6 h-6">
                    <path d="M19 28.5C19 33.7467 14.7467 38 9.5 38C4.25329 38 0 33.7467 0 28.5C0 23.2533 4.25329 19 9.5 19L19 19L19 28.5Z" fill="#1ABCFE" />
                    <path d="M19 47.5C19 52.7467 14.7467 57 9.5 57C4.25329 57 0 52.7467 0 47.5C0 42.2533 4.25329 38 9.5 38L19 38L19 47.5Z" fill="#0ACF83" />
                    <path d="M19 19L28.5 19C33.7467 19 38 14.7467 38 9.5C38 4.2533 33.7467 0 28.5 0L19 0L19 19Z" fill="#FF7262" />
                    <path d="M0 9.5C0 14.7467 4.25329 19 9.5 19L19 19L19 0L9.5 0C4.25329 0 0 4.2533 0 9.5Z" fill="#F24E1E" />
                    <path d="M19 28.5C19 23.2533 23.2533 19 28.5 19C33.7467 19 38 23.2533 38 28.5C38 33.7467 33.7467 38 28.5 38C23.2533 38 19 33.7467 19 28.5Z" fill="#A259FF" />
                  </svg>
                </div>
                <span className="text-[10px] font-mono text-white/70 group-hover:text-white transition-colors">Figma</span>
              </div>
              {/* GitHub */}
              <div className="group flex flex-col items-center gap-2 cursor-pointer">
                <div className="w-14 h-14 rounded-2xl border border-white/10 bg-slate-950/40 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:border-white/30 group-hover:bg-white/5 shadow-[0_0_15px_rgba(255,255,255,0.0)] group-hover:shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                  <svg viewBox="0 0 24 24" className="w-7 h-7 text-white fill-current">
                    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                  </svg>
                </div>
                <span className="text-[10px] font-mono text-white/70 group-hover:text-white transition-colors">GitHub</span>
              </div>
              {/* Vercel */}
              <div className="group flex flex-col items-center gap-2 cursor-pointer">
                <div className="w-14 h-14 rounded-2xl border border-white/10 bg-slate-950/40 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:border-white/30 group-hover:bg-white/5 shadow-[0_0_15px_rgba(255,255,255,0.0)] group-hover:shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                  <svg viewBox="0 0 24 24" className="w-6 h-6 text-white fill-current">
                    <polygon points="12,2 2,22 22,22" />
                  </svg>
                </div>
                <span className="text-[10px] font-mono text-white/70 group-hover:text-white transition-colors">Vercel</span>
              </div>
            </div>
          </div>

          {/* Recycle Bin — standalone icon to the RIGHT of Skill Set panel */}
          <div className="relative shrink-0 self-center ml-6">
            <div
              onClick={(e) => {
                e.stopPropagation();
                setSelectedIconId('recycle');
                setShowRecyclePopup(prev => !prev);
              }}
              className={`flex flex-col items-center justify-center gap-1.5 cursor-pointer group select-none p-2 rounded-2xl transition-all duration-300 ${selectedIconId === 'recycle'
                ? 'bg-slate-900/60 border border-emerald-400/40 shadow-[0_0_18px_rgba(16,185,129,0.25)]'
                : 'border border-transparent hover:bg-white/5 hover:shadow-[0_0_20px_rgba(16,185,129,0.12)]'
                }`}
              title="Click to open Recycle Bin"
            >
              <div className="w-18 h-18 rounded-2xl bg-slate-950/35 p-2 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:-translate-y-0.5">
                <img
                  src={ICONS.recycle}
                  alt="Recycle Bin"
                  className="w-full h-full object-contain rounded-lg"
                />
              </div>
              <span className="text-[11px] font-mono text-white/80 group-hover:text-emerald-300 transition-colors drop-shadow">Recycle Bin</span>
            </div>

            {/* Popup panel */}
            {showRecyclePopup && (
              <div
                className="absolute bottom-[calc(100%+12px)] right-0 w-64 rounded-2xl border border-white/15 bg-slate-900/90 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-3 z-50 animate-fade-in"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <img src={ICONS.recycle} alt="Recycle Bin" className="w-4 h-4 object-contain" />
                    <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-300">Recycle Bin</span>
                  </div>
                  <button
                    onClick={() => setShowRecyclePopup(false)}
                    className="text-white/40 hover:text-white/80 text-xs leading-none transition-colors"
                  >✕</button>
                </div>

                {/* Project list */}
                <div className="flex flex-col gap-2">
                  {[
                    { name: 'Imran Portfolio', url: 'https://imran-portfolio-ebon-ten.vercel.app/', icon: image },
                    { name: 'Kuruthi-kavi', url: 'https://kuruthi-kavi.vercel.app/', icon: image },
                    { name: 'Build-space', url: 'https://imran-build-space.vercel.app/', icon: image },
                    { name: 'Tuition Website', url: 'https://tution-website-seven.vercel.app/', icon: image },
                  ].map((project, idx) => (
                    <a
                      key={idx}
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => { audioSynth.playTick(); setShowRecyclePopup(false); }}
                      className="group flex items-center gap-3 rounded-xl border border-white/5 bg-slate-950/50 p-2.5 hover:border-emerald-500/40 hover:bg-slate-950/80 transition-all duration-200 cursor-pointer"
                    >
                      <img
                        src={project.icon}
                        alt={project.name}
                        className="w-8 h-8 rounded-lg object-contain border border-white/10 bg-slate-900/80 p-1 shrink-0 transition-transform duration-200 group-hover:scale-105"
                      />
                      <span className="text-[11px] font-medium text-white/80 group-hover:text-emerald-300 transition-colors truncate flex-1">{project.name}</span>
                      <svg className="w-3.5 h-3.5 text-white/30 group-hover:text-emerald-400 transition-colors shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>

      </div>

      {/* Spotlight command search overlays */}
      <SearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        onSelectResult={(appId) => {
          setSearchOpen(false);
          handleOpenApp(appId);
        }}
      />

    </div>
  );
}

