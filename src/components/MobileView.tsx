/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Download } from 'lucide-react';
import { ICONS, PROJECTS, ABOUT_TEXT, DESKTOP_PANEL_APPS } from '../data';
import { AppWindow, ThemeConfig, WallpaperConfig, TrashItem } from '../types';
import Window from './Window';
import { audioSynth } from '../utils/audio';
import whatsappIcon from '../assets/images/whatsapp.jpg';
import emailIcon from '../assets/images/email.jpg';
import linkedinIcon from '../assets/images/linkedin.jpg';
import photo from '../assets/images/photo.jpg';
import image from '../assets/images/image.png';
import { clientProjectIcons } from '../assets/images/client-projects';
interface MobileViewProps {
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
}

export default function MobileView({
  theme,
  wallpaper,
  windows,
  setWindows,
  showToast,
  trash,
  setTrash,
  addNotification,
}: MobileViewProps) {
  const [openFolderId, setOpenFolderId] = useState<string | null>(null);
  const [showRecyclePopup, setShowRecyclePopup] = useState(false);
  const [selectedIconId, setSelectedIconId] = useState<string | null>(null);

  const desktopPanelItems = DESKTOP_PANEL_APPS.map((item) => ({
    id: item.id,
    title: item.title,
    icon: item.icon,
    url: item.url,
  }));

  const clientProjectPanelItems = [
    { id: 'crescent-connect', title: 'Crescent Connect', icon: clientProjectIcons['crescent-connect'], url: 'https://college-website-henna-phi.vercel.app/' },
    { id: 'aditya-skill-gate', title: 'Aditya Skill Gate', icon: clientProjectIcons['aditya-skill-gate'], url: 'https://adityaskillgate-itsolution.vercel.app/' },
    { id: 'echoes', title: 'Echoes', icon: clientProjectIcons['echoes'], url: 'https://website-rho-roan-86.vercel.app/' },
    { id: 'digirfu', title: 'Digirfu', icon: clientProjectIcons['digirfu'], url: 'https://www.digirfu.com/' },
  ];



  const projectStripItems = PROJECTS.filter((project) =>
    ['qrnest', 'ethernote', 'layoutlab', 'layerly', 'keysmith', 'optiqo'].includes(project.id)
  ).map((project) => ({
    id: project.id,
    title: project.name,
    icon: (ICONS as Record<string, string>)[project.id] ?? ICONS.layerly,
    url: project.liveUrl,
  }));

  const handleOpenProjectLink = (url: string, title: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
    audioSynth.playClick();
    showToast(`Opening ${title}...`, 'success');
  };

  const handleOpenApp = (appId: string) => {
    if (appId === 'tstrike') {
      audioSynth.playTick();
      showToast('Not applicable for mobile', 'info');
      return;
    }
    audioSynth.playClick();
    setOpenFolderId(null);
    setWindows(prev =>
      prev.map(w => {
        if (w.id === appId) return { ...w, isOpen: true, isFocused: true, zIndex: 99 };
        return { ...w, isFocused: false };
      })
    );
    showToast(`Launching ${appId.toUpperCase()}...`, 'success');
  };

  const currentOpenApp = windows.find(w => w.isOpen);

  // Bottom dock — social / contact quick-launch links (mobile only)
  const dockLinks = [
    {
      id: 'whatsapp',
      label: 'WhatsApp',
      href: 'https://wa.me/919363001680',
      icon: whatsappIcon,
      isImage: true,
    },
    {
      id: 'email',
      label: 'Email',
      href: 'mailto:abdulkadarimran@gmail.com',
      icon: emailIcon,
      isImage: true,
    },
    {
      id: 'linkedin',
      label: 'LinkedIn',
      href: 'https://linkedin.com/in/abdulkadarimran',
      icon: linkedinIcon,
      isImage: true,
    },
    {
      id: 'phone',
      label: 'Phone',
      href: 'tel:+919363001680',
      icon: null,
      isImage: false,
    },
  ];

  return (
    <div
      id="mobile_stage"
      className="relative w-full h-full overflow-x-hidden overflow-y-hidden flex flex-col pointer-events-auto bg-slate-950 font-sans"
      style={{ backgroundImage: `url(${wallpaper.url})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      <div className="absolute inset-0 bg-black/40 pointer-events-none" />

      {/* App Launch Overlay */}
      <AnimatePresence>
        {currentOpenApp && (
          <motion.div
            initial={{ scale: 0.9, y: '100%', opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 28, stiffness: 240 }}
            className="fixed inset-0 z-40 bg-slate-950 flex flex-col"
          >
            <Window
              id={currentOpenApp.id}
              title={currentOpenApp.title}
              isOpen={currentOpenApp.isOpen}
              isFocused={true}
              x={0}
              y={0}
              width={0}
              height={0}
              zIndex={100}
              icon={currentOpenApp.icon}
              onClose={(appId) => {
                setWindows(prev => prev.map(w => (w.id === appId ? { ...w, isOpen: false, isFocused: false } : w)));
              }}
              onFocus={() => { }}
              onMove={() => { }}
              onOpenApp={handleOpenApp}
              theme={theme}
              showToast={showToast}
              isMobile={true}
              trash={trash}
              setTrash={setTrash}
              addNotification={addNotification}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Home Screen Swipe Layer */}
      <div className="flex-1 flex overflow-x-auto snap-x snap-mandatory no-scrollbar relative z-10 select-none">
        {/* Slide 1: About Me */}
        <div className="w-full min-w-full h-full flex-shrink-0 snap-center px-4 py-5 flex flex-col">
          {/* Inner wrapper: fills the full slide height, never overflows */}
          <div className="w-full max-w-[420px] mx-auto flex flex-col flex-1 min-h-0">
            {/* Glass panel grows to fill available height */}
            <div className="flex-1 min-h-0 rounded-3xl border border-white/15 bg-slate-900/35 p-5 shadow-[0_16px_45px_rgba(0,0,0,0.25)] backdrop-blur-2xl flex flex-col">
              <div className="mb-2 text-center shrink-0">
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-300">
                  About Me
                </p>
              </div>

              <div className="flex items-center gap-4 mb-4 shrink-0">
                <img
                  src={photo}
                  alt="Imran"
                  className="w-14 h-14 rounded-2xl object-cover border border-white/15 shadow-lg"
                />

                <div>
                  <h2 className="text-base font-bold text-white leading-tight">
                    Abdul Kadar Imran
                  </h2>
                  <p className="text-xs text-emerald-400 font-medium mt-0.5">
                    AI App Developer | Frontend Architect
                  </p>
                </div>
              </div>

              {/* Bio text scrolls invisibly inside the panel if too long */}
              <div className="flex-1 min-h-0 overflow-y-auto pr-2 no-scrollbar">
                <p className="text-[13px] leading-relaxed text-white/75 text-justify">
                  {ABOUT_TEXT}
                </p>
              </div>
            </div>

            <a
              href="/Imran.cv.pdf"
              download="Imran-cv.pdf"
              onClick={() => audioSynth.playTick()}
              className="group flex flex-row items-center justify-center gap-2 text-center transition-all bg-sky-500 hover:bg-sky-600 rounded-2xl py-3 px-4 shadow-lg shadow-sky-500/20 text-slate-950 font-bold cursor-pointer w-full mt-3 shrink-0"
            >
              <Download className="w-4 h-4" />
              <span className="text-xs tracking-wide">Download Resume</span>
            </a>

            <div className="mt-3 text-center animate-pulse shrink-0">
              <p className="text-[11px] font-mono text-emerald-400 tracking-widest flex items-center justify-center gap-2">
                <span>SWIPE RIGHT TO VIEW PROJECTS</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </p>
            </div>
          </div>
        </div>

        {/* Slide 2: Skillset & Projects */}
        <div className="w-full min-w-full h-full flex-shrink-0 snap-center px-4 py-4 flex flex-col">
          <div className="flex flex-col gap-3 w-full max-w-[420px] mx-auto flex-1 min-h-0">
            {/* Glossy Skill Set Panel — fixed height */}
            <div className="w-full rounded-3xl border border-white/15 bg-slate-900/35 p-3 shadow-[0_16px_45px_rgba(0,0,0,0.25)] backdrop-blur-2xl flex flex-col shrink-0">
              <div className="mb-2 text-center">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-300">Skill Set</p>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 justify-items-center items-center py-1">
                {/* React */}
                <div className="group flex flex-col items-center gap-1.5 cursor-pointer">
                  <div className="w-12 h-12 rounded-2xl border border-white/10 bg-slate-950/40 flex items-center justify-center transition-all duration-300 shadow-[0_0_15px_rgba(97,218,251,0.0)]">
                    <svg viewBox="-11.5 -10.23174 23 20.46348" className="w-7 h-7 text-[#61dafb] fill-none stroke-current" strokeWidth="1.2">
                      <ellipse rx="11" ry="4.2" />
                      <ellipse rx="11" ry="4.2" transform="rotate(60)" />
                      <ellipse rx="11" ry="4.2" transform="rotate(120)" />
                      <circle r="2" className="fill-[#61dafb]" />
                    </svg>
                  </div>
                  <span className="text-[9px] font-mono text-white/70">React</span>
                </div>
                {/* TypeScript */}
                <div className="group flex flex-col items-center gap-1.5 cursor-pointer">
                  <div className="w-12 h-12 rounded-2xl border border-white/10 bg-slate-950/40 flex items-center justify-center transition-all duration-300 shadow-[0_0_15px_rgba(49,120,198,0.0)]">
                    <svg viewBox="0 0 24 24" className="w-6 h-6 text-[#3178c6] fill-current">
                      <path d="M0 0h24v24H0V0zm22.034 18.268c-.147-1.258-1.127-2.316-2.91-2.91-1.78-.6-2.887-.872-2.887-1.8 0-.66.528-.962 1.1-.962.83 0 1.34.394 1.705 1.135l1.9-1.218c-.62-1.183-1.68-1.938-3.357-1.938-2.612 0-3.95 1.55-3.95 3.39 0 2.682 2.378 3.486 4.6 4.19 1.78.583 2.213.992 2.213 1.72 0 .866-.81 1.258-1.843 1.258-1.464 0-2.268-.788-2.69-1.765l-1.938 1.156c.64 1.488 2.052 2.457 4.542 2.457 3.39 0 4.168-1.95 4.168-3.482zM8.347 10.428H3.344v2.158H5.85v9.117h2.49v-9.117h2.507v-2.158z" />
                    </svg>
                  </div>
                  <span className="text-[9px] font-mono text-white/70">TypeScript</span>
                </div>
                {/* Tailwind CSS */}
                <div className="group flex flex-col items-center gap-1.5 cursor-pointer">
                  <div className="w-12 h-12 rounded-2xl border border-white/10 bg-slate-950/40 flex items-center justify-center transition-all duration-300 shadow-[0_0_15px_rgba(56,189,248,0.0)]">
                    <svg viewBox="0 0 24 24" className="w-6 h-6 text-[#38bdf8] fill-current">
                      <path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.337 6.182 14.976 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C7.666 17.818 9.027 19 12.001 19c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.337 13.382 8.976 12 6.001 12z" />
                    </svg>
                  </div>
                  <span className="text-[9px] font-mono text-white/70">Tailwind</span>
                </div>
                {/* Figma */}
                <div className="group flex flex-col items-center gap-1.5 cursor-pointer">
                  <div className="w-12 h-12 rounded-2xl border border-white/10 bg-slate-950/40 flex items-center justify-center transition-all duration-300 shadow-[0_0_15px_rgba(255,255,255,0.0)]">
                    <svg viewBox="0 0 38 57" fill="none" className="w-5 h-5">
                      <path d="M19 28.5C19 33.7467 14.7467 38 9.5 38C4.25329 38 0 33.7467 0 28.5C0 23.2533 4.25329 19 9.5 19L19 19L19 28.5Z" fill="#1ABCFE" />
                      <path d="M19 47.5C19 52.7467 14.7467 57 9.5 57C4.25329 57 0 52.7467 0 47.5C0 42.2533 4.25329 38 9.5 38L19 38L19 47.5Z" fill="#0ACF83" />
                      <path d="M19 19L28.5 19C33.7467 19 38 14.7467 38 9.5C38 4.2533 33.7467 0 28.5 0L19 0L19 19Z" fill="#FF7262" />
                      <path d="M0 9.5C0 14.7467 4.25329 19 9.5 19L19 19L19 0L9.5 0C4.25329 0 0 4.2533 0 9.5Z" fill="#F24E1E" />
                      <path d="M19 28.5C19 23.2533 23.2533 19 28.5 19C33.7467 19 38 23.2533 38 28.5C38 33.7467 33.7467 38 28.5 38C23.2533 38 19 33.7467 19 28.5Z" fill="#A259FF" />
                    </svg>
                  </div>
                  <span className="text-[9px] font-mono text-white/70">Figma</span>
                </div>
                {/* GitHub */}
                <div className="group flex flex-col items-center gap-1.5 cursor-pointer">
                  <div className="w-12 h-12 rounded-2xl border border-white/10 bg-slate-950/40 flex items-center justify-center transition-all duration-300 shadow-[0_0_15px_rgba(255,255,255,0.0)]">
                    <svg viewBox="0 0 24 24" className="w-6 h-6 text-white fill-current">
                      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                    </svg>
                  </div>
                  <span className="text-[9px] font-mono text-white/70">GitHub</span>
                </div>
                {/* Vercel */}
                <div className="group flex flex-col items-center gap-1.5 cursor-pointer">
                  <div className="w-12 h-12 rounded-2xl border border-white/10 bg-slate-950/40 flex items-center justify-center transition-all duration-300 shadow-[0_0_15px_rgba(255,255,255,0.0)]">
                    <svg viewBox="0 0 24 24" className="w-5 h-5 text-white fill-current">
                      <polygon points="12,2 2,22 22,22" />
                    </svg>
                  </div>
                  <span className="text-[9px] font-mono text-white/70">Vercel</span>
                </div>
              </div>
            </div>

            {/* My Projects — grows to fill remaining slide height */}
            <div className="flex-1 min-h-0 rounded-3xl border border-white/15 bg-slate-900/40 p-4 shadow-[0_20px_60px_rgba(0,0,0,0.3)] backdrop-blur-2xl flex flex-col">
              <div className="mb-3 text-center shrink-0">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-300">My Projects</p>
              </div>
              <div className="grid grid-cols-3 gap-3 content-start">
                {projectStripItems.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      if (item.id === 'tstrike') {
                        audioSynth.playTick();
                        showToast('Not applicable for mobile', 'info');
                      } else {
                        handleOpenProjectLink(item.url, item.title);
                      }
                    }}
                    className="group flex flex-col items-center gap-2 text-center transition-all hover:border-emerald-400/40 hover:bg-emerald-500/10"
                  >
                    <img src={item.icon} alt={item.title} className="h-14 w-14 rounded-[18px] object-cover border border-white/15 bg-slate-900/70 p-1 shadow-lg transition-transform group-hover:scale-105" referrerPolicy="no-referrer" />
                    <span className="text-[9px] font-medium leading-tight text-white/90 truncate max-w-full">{item.title}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Slide 3: Business Apps, Client Projects & Recycle Bin */}
        <div className="w-full min-w-full h-full flex-shrink-0 snap-center px-4 py-4 flex flex-col">
          <div className="flex flex-col gap-3 w-full max-w-[420px] mx-auto flex-1 min-h-0">
            {/* Business Apps — compact padding so everything fits */}
            <div className="w-full rounded-3xl border border-white/15 bg-slate-900/40 p-3 shadow-[0_20px_60px_rgba(0,0,0,0.3)] backdrop-blur-2xl shrink-0">
              <div className="mb-2 text-center">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-green-300">Business Apps</p>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {desktopPanelItems.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      if (item.url) {
                        window.open(item.url, '_blank', 'noopener,noreferrer');
                        audioSynth.playClick();
                        showToast(`Opening ${item.title}...`, 'success');
                      } else {
                        handleOpenApp(item.id);
                      }
                    }}
                    className="group flex flex-col items-center gap-2 text-center transition-all hover:border-emerald-400/40 hover:bg-emerald-500/10"
                  >
                    <img src={item.icon} alt={item.title} className="h-13 w-13 rounded-[18px] object-cover border border-white/15 bg-slate-900/70 p-1 shadow-lg transition-transform group-hover:scale-105" referrerPolicy="no-referrer" />
                    <span className="text-[9px] font-medium leading-tight text-white/90 truncate max-w-full">{item.title}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Client Projects — compact padding */}
            <div className="flex-1 min-h-0 rounded-3xl border border-white/15 bg-slate-900/35 p-3 shadow-[0_16px_45px_rgba(0,0,0,0.25)] backdrop-blur-2xl flex flex-col">
              <div className="mb-2 text-center shrink-0">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300">Client Projects</p>
              </div>
              <div className="grid grid-cols-2 gap-3 content-start">
                {clientProjectPanelItems.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      if (item.url) {
                        window.open(item.url, '_blank', 'noopener,noreferrer');
                        audioSynth.playClick();
                        showToast(`Opening ${item.title}...`, 'success');
                      } else {
                        handleOpenApp(item.id);
                      }
                    }}
                    className="group flex flex-col items-center justify-center gap-2 text-center transition-all hover:border-emerald-400/40 hover:bg-emerald-500/10"
                  >
                    <img src={item.icon} alt={item.title} className="h-14 w-14 rounded-[18px] object-cover border border-white/15 bg-slate-900/70 p-1 shadow-lg transition-transform group-hover:scale-105" referrerPolicy="no-referrer" />
                    <span className="text-[9px] font-medium leading-tight text-white/90 truncate max-w-full">{item.title}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Bottom Icons: T-Strike & Recycle Bin — shrink-0 so they never push content out */}
            <div className="flex items-center justify-end gap-6 shrink-0 relative pb-1">
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  audioSynth.playTick();
                  showToast('Not applicable for mobile', 'info');
                }}
                className="flex flex-col items-center justify-center gap-1.5 cursor-pointer group select-none p-2 rounded-2xl transition-all duration-300 border border-transparent hover:bg-white/5 hover:shadow-[0_0_20px_rgba(16,185,129,0.12)]"
                title="Not applicable for mobile"
              >
                <div className="w-14 h-14 rounded-2xl bg-slate-950/35 p-1.5 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:-translate-y-0.5">
                  <img
                    src={(ICONS as any).tstrike}
                    alt="T-Strike"
                    className="w-full h-full object-cover rounded-[10px]"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <span className="text-[10px] font-mono text-white/80 group-hover:text-emerald-300 transition-colors drop-shadow">T-Strike</span>
              </div>

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
                <div className="w-14 h-14 rounded-2xl bg-slate-950/35 p-2 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:-translate-y-0.5">
                  <img
                    src={ICONS.recycle}
                    alt="Recycle Bin"
                    className="w-full h-full object-contain rounded-lg"
                  />
                </div>
                <span className="text-[10px] font-mono text-white/80 group-hover:text-emerald-300 transition-colors drop-shadow">Recycle Bin</span>
              </div>

              {/* Recycle Bin Popup Panel for Mobile */}
              {showRecyclePopup && (
                <div
                  className="absolute bottom-[calc(100%+8px)] right-0 w-64 rounded-2xl border border-white/15 bg-slate-900/90 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-3 z-50 animate-fade-in"
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
                      className="text-white/40 hover:text-white/80 text-xs leading-none transition-colors p-1"
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
      </div>

      {/* ── Bottom Dock — WhatsApp · Email · LinkedIn · Phone ── */}
      <div className="relative z-50 px-4 pb-5 select-none">
        <div className="w-full max-w-[420px] mx-auto rounded-3xl bg-white/15 border border-white/15 backdrop-blur-xl p-3 grid grid-cols-4 gap-2 items-center shadow-2xl">
          {dockLinks.map(link => (
            <a
              key={link.id}
              href={link.href}
              target={link.href.startsWith('mailto') || link.href.startsWith('tel') ? '_self' : '_blank'}
              rel="noopener noreferrer"
              id={`mobile_dock_${link.id}`}
              onClick={() => audioSynth.playTick()}
              className="flex flex-col items-center gap-1 cursor-pointer group"
              title={link.label}
            >
              <div className="w-12 h-12 rounded-2xl border border-white/10 bg-black/30 shadow-lg overflow-hidden flex items-center justify-center transition-transform group-hover:scale-110 group-active:scale-95">
                {link.isImage ? (
                  <img
                    src={link.icon as string}
                    alt={link.label}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  /* Phone SVG icon */
                  <svg
                    viewBox="0 0 24 24"
                    className="w-7 h-7 text-emerald-400 fill-current drop-shadow"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M6.62 10.79c1.44 2.83 3.76 5.15 6.59 6.59l2.2-2.2c.28-.28.67-.36 1.02-.25 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02L6.62 10.79z" />
                  </svg>
                )}
              </div>
              <span className="text-[9px] font-mono text-white/75 group-hover:text-white transition-colors">
                {link.label}
              </span>
            </a>
          ))}
        </div>
      </div>

      {/* Projects Nested Folder Full Screen Overlay Drawer */}
      <AnimatePresence>
        {openFolderId === 'projects' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="absolute inset-0 z-[100] bg-slate-950/85 backdrop-blur-xl flex flex-col justify-center items-center p-4 select-none"
            onClick={() => setOpenFolderId(null)}
          >
            <div
              className="w-[88%] max-w-sm max-h-[80%] rounded-[28px] bg-slate-900/95 border border-white/10 p-5 flex flex-col relative shadow-2xl select-none"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4 shrink-0">
                <h3 className="text-sm font-bold text-white tracking-tight">Launch Projects</h3>
                <span className="text-[9px] font-mono text-emerald-400 font-semibold uppercase">{PROJECTS.length} Apps</span>
              </div>

              <div className="overflow-y-auto flex-1 pr-1 pb-1 scrollbar-none">
                <div className="grid grid-cols-3 gap-y-4 gap-x-2 justify-items-center py-1">
                  {PROJECTS.map(p => {
                    let artwork = ICONS.layerly;
                    if (p.id === 'ethernote') artwork = ICONS.ethernote;
                    else if (p.id === 'qrnest') artwork = ICONS.qrnest;
                    else if (p.id === 'tstrike') artwork = ICONS.tstrike;
                    else if (p.id === 'keysmith') artwork = ICONS.keysmith;
                    else if (p.id === 'layoutlab') artwork = ICONS.layoutlab;

                    return (
                      <button
                        key={p.id}
                        type="button"
                        id={`folder_project_${p.id}`}
                        onClick={() => handleOpenApp(p.id)}
                        className="flex flex-col items-center cursor-pointer p-1"
                      >
                        <div className="w-11 h-11 p-1 bg-black/35 rounded-xl border border-white/5 shadow-md shrink-0">
                          <img src={artwork} alt={p.name} className="w-full h-full object-contain rounded-lg" referrerPolicy="no-referrer" />
                        </div>
                        <span className="text-[9px] font-medium text-white tracking-tight mt-1.5 truncate text-center max-w-[70px]">
                          {p.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                type="button"
                id="folder_close_btn"
                onClick={() => setOpenFolderId(null)}
                className="w-full mt-4 py-2.5 bg-white/10 hover:bg-white/15 border border-white/10 text-white font-mono text-[10px] rounded-xl cursor-pointer font-bold tracking-wider shrink-0"
              >
                CLOSE DRAWER
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
