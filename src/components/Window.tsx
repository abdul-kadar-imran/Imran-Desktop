/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ArrowLeft, ExternalLink, Github, Send, RefreshCw, Trash2, ShieldCheck, Download, Mail, Building, Laptop, Code, Camera, Sliders, Eye, Aperture, Sparkles, Filter, MessageCircle, Linkedin } from 'lucide-react';
import { Project, TrashItem, ThemeConfig } from '../types';
import { PROJECTS, SKILLS, ABOUT_TEXT, CERTIFICATES, ICONS } from '../data';
import Terminal from './Terminal';
import { audioSynth } from '../utils/audio';
import image from '../assets/images/image.png';

interface WindowProps {
  id: string;
  title: string;
  isOpen: boolean;
  isFocused: boolean;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  icon: string;
  onClose: (id: string) => void;
  onFocus: (id: string) => void;
  onMove: (id: string, x: number, y: number) => void;
  onOpenApp?: (appId: string) => void;
  onBack?: () => void;
  canGoBack?: boolean;
  theme: ThemeConfig;
  showToast: (msg: string, type?: 'success' | 'info') => void;
  isMobile: boolean;
  trash: TrashItem[];
  setTrash: React.Dispatch<React.SetStateAction<TrashItem[]>>;
  addNotification: (msg: string, type?: 'success' | 'info') => void;
  key?: string;
}

export default function Window({
  id,
  title,
  isOpen,
  isFocused,
  x,
  y,
  width,
  height,
  zIndex,
  icon,
  onClose,
  onFocus,
  onMove,
  onOpenApp,
  onBack,
  canGoBack,
  theme,
  showToast,
  isMobile,
  trash,
  setTrash,
  addNotification,
}: WindowProps) {
  const [position, setPosition] = useState({ x, y });
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  // optiqo Lens Simulator States
  const [focalLength, setFocalLength] = useState(50); // 18mm (wide) - 200mm (telephoto)
  const [apertureVal, setApertureVal] = useState(2.8); // f/1.2 (wide open, high blur) - f/16 (crisp)
  const [isoVal, setIsoVal] = useState(400); // ISO 100 - 6400
  const [prismMode, setPrismMode] = useState<'cyan' | 'amber' | 'crimson' | 'mono'>('cyan');
  const [flashOn, setFlashOn] = useState(false);
  const [snaps, setSnaps] = useState<{ id: string; fl: number; ap: number; iso: number; prism: string; time: string }[]>([
    { id: 'snap_0', fl: 85, ap: 1.4, iso: 100, prism: 'cyan', time: '11:24:02' }
  ]);

  useEffect(() => {
    setPosition({ x, y });
  }, [x, y]);

  if (!isOpen) return null;

  // Handle Dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    if (isMobile) return; // Disable drag on mobile phone view
    // Only drag via header
    const target = e.target as HTMLElement;
    if (target.closest('.window-header-drag')) {
      onFocus(id);
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
      e.preventDefault();
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const newX = e.clientX - dragStart.x;
      const newY = e.clientY - dragStart.y;

      // Limit slightly so window doesn't go offscreen
      const boundedX = Math.max(-200, Math.min(window.innerWidth - 100, newX));
      const boundedY = Math.max(0, Math.min(window.innerHeight - 80, newY));

      setPosition({ x: boundedX, y: boundedY });
    };

    const handleMouseUp = () => {
      if (isDragging) {
        setIsDragging(false);
        onMove(id, position.x, position.y);
      }
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragStart, id, position, onMove]);

  const handleCloseClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    audioSynth.playPop();
    onClose(id);
  };

  // optiqo Snapshot Shutter Action
  const handleCaptureSnapshot = () => {
    audioSynth.playClick();
    setFlashOn(true);
    setTimeout(() => setFlashOn(false), 200);

    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0];
    const newSnap = {
      id: `snap_${Date.now()}`,
      fl: focalLength,
      ap: apertureVal,
      iso: isoVal,
      prism: prismMode,
      time: timeStr
    };
    setSnaps(prev => [newSnap, ...prev].slice(0, 10)); // keep up to 10 latest snapshots
    showToast('Lens frame captured inside memory roll! 📸', 'success');
    addNotification(`optiqo Snapshot compiled at FL ${focalLength}mm, f/${apertureVal}`, 'success');
  };

  // Restore Trash Item Action
  const restoreTrashItem = (itemId: string, itemName: string) => {
    audioSynth.playTick();
    setTrash(prev => prev.filter(item => item.id !== itemId));
    showToast(`Restored "${itemName}" from state decay.`, 'success');
    addNotification(`Experiment "${itemName}" restored successfully.`, 'info');
  };

  // Empty Recycle Bin
  const emptyRecycleBin = () => {
    audioSynth.playPop();
    setTrash([]);
    showToast('Recycle bin completely formatted.', 'success');
    addNotification('Local trash buffer cleared.', 'info');
  };

  // Simulate CV Download
  const handleDownloadCV = () => {
    audioSynth.playTick();
    showToast('Initiating Imran_Architect_CV.pdf compiling...', 'success');
    setTimeout(() => {
      // Simulate static pdf prompt
      const link = document.createElement('a');
      link.href = 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf';
      link.target = '_blank';
      link.download = 'Imran_Developer_Resume.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }, 1000);
  };

  // Render Window Inner Content
  const renderContent = () => {
    // Check if it's a project ID
    const project = PROJECTS.find(p => p.id === id);

    if (project) {
      return (
        <div className="flex flex-col h-full bg-slate-950/70 text-slate-100 overflow-y-auto select-text font-sans">
          {/* Project Header Banner Art */}
          <div className="relative w-full h-[180px] shrink-0 overflow-hidden">
            <img
              src={project.screenshot}
              alt={project.name}
              className="w-full h-full object-cover brightness-75 hover:scale-105 transition-transform duration-700"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
            <div className="absolute bottom-4 left-6 flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-black/40 border border-white/10 p-1 backdrop-blur-md">
                <img
                  src={(ICONS as any)[project.id]}
                  alt={project.name}
                  className="w-full h-full object-contain rounded-lg"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div>
                <h2 className="text-xl font-bold tracking-tight text-white mb-0.5">{project.name}</h2>
                <div className="flex flex-wrap gap-1.5">
                  {project.tech.slice(0, 3).map(t => (
                    <span key={t} className="text-[9px] font-mono tracking-wider uppercase bg-white/10 text-white/85 px-1.5 py-0.5 rounded">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-6">
            <div>
              <h3 className="text-xs font-mono text-emerald-400 uppercase tracking-widest mb-1.5">Executive Summary</h3>
              <p className="text-sm text-slate-300 leading-relaxed font-light">{project.longDesc}</p>
            </div>

            <div>
              <h3 className="text-xs font-mono text-emerald-400 uppercase tracking-widest mb-2.5">Key Architecture Features</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {project.features.map(f => (
                  <div key={f} className="flex items-start gap-2 bg-slate-900/60 border border-white/5 p-2.5 rounded-xl text-xs text-slate-300">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xs font-mono text-emerald-400 uppercase tracking-widest mb-2.5">Full Stack Stack</h3>
              <div className="flex flex-wrap gap-1.5">
                {project.tech.map(t => (
                  <span key={t} className="text-xs bg-slate-900 border border-white/10 text-emerald-300 font-mono px-3 py-1 rounded-full">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-2 flex items-center gap-3 border-t border-white/10 shrink-0">
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 transition-all font-semibold text-slate-950 rounded-xl text-xs shadow-lg shadow-emerald-500/10 cursor-pointer"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Live Engine Demo
              </a>
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-white/10 transition-all font-semibold text-white rounded-xl text-xs cursor-pointer"
              >
                <Github className="w-3.5 h-3.5" />
                Retrieve Codebase
              </a>
            </div>
          </div>
        </div>
      );
    }

    switch (id) {
      case 'terminal':
        return (
          <Terminal
            onOpenApp={onOpenApp}
            themeClass={theme.id === 'cyberpunk' ? 'border-t border-fuchsia-500/50 text-yellow-300 bg-black' : ''}
          />
        );

      case 'aboutme':
        return (
          <div className="flex flex-col h-full bg-slate-950/70 text-slate-100 overflow-y-auto p-6 font-sans select-text">
            <div className="flex flex-col md:flex-row gap-6 items-start pb-6 border-b border-white/10">
              <div className="w-24 h-24 rounded-2xl border-2 border-emerald-400 p-1 shrink-0 bg-slate-900/60 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                <img
                  src={(ICONS as any).aboutme}
                  alt="Imran bio profile artwork icon"
                  className="w-full h-full object-cover rounded-xl"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div>
                <div className="text-[10px] font-mono tracking-widest uppercase text-emerald-400 mb-1">Architecture Dossier</div>
                <h2 className="text-2xl font-bold tracking-tight text-white mb-1">Abdulkadar Imran</h2>
                <div className="text-sm font-semibold text-white/70 font-mono mb-2 flex items-center gap-1.5">
                  <Laptop className="w-4 h-4 text-emerald-400" />
                  Frontend Framework Architect • SDE II
                </div>
                <p className="text-xs text-white/50 flex flex-wrap gap-x-4 gap-y-1">
                  <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> abdulkadarimran@gmail.com</span>
                  <span className="flex items-center gap-1"><Building className="w-3 h-3" /> India</span>
                </p>
              </div>
            </div>

            <div className="py-6 space-y-6">
              <div>
                <h3 className="text-xs font-mono uppercase tracking-widest text-emerald-400 mb-2.5">Biography</h3>
                <p className="text-sm text-slate-350 leading-relaxed font-light whitespace-pre-line">{ABOUT_TEXT}</p>
              </div>

              <div>
                <h3 className="text-xs font-mono uppercase tracking-widest text-emerald-400 mb-3">Academic Base & Focus</h3>
                <div className="bg-slate-900/40 border border-white/5 p-4 rounded-2xl text-xs space-y-3 font-light text-slate-300">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-semibold text-white">B.S. in Computer Science and Engineering</div>
                      <div className="text-white/60 text-[11px] mt-0.5">Focus: Software Layout Kernels, Interaction Design Mechanics</div>
                    </div>
                    <span className="text-[10px] font-mono bg-white/5 px-2 py-0.5 rounded text-white/70">2019 - 2023</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'resume':
        return (
          <div className="flex flex-col h-full bg-slate-950/70 text-slate-100 overflow-y-auto p-6 font-sans select-text">
            <div className="flex justify-between items-center pb-4 border-b border-white/10 select-none">
              <h2 className="text-lg font-bold tracking-tight text-white">System Curriculum Vitae</h2>
              <button
                type="button"
                id="download_cv_button"
                onClick={handleDownloadCV}
                className="flex items-center gap-2 px-3 py-1.5 bg-white/10 hover:bg-white/15 border border-white/10 text-white font-mono rounded-xl text-[10px] cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                Download PDF Resume
              </button>
            </div>

            <div className="py-6 space-y-6">
              {/* Working Station Timeline */}
              <div>
                <h3 className="text-xs font-mono uppercase tracking-widest text-emerald-400 mb-4">Enterprise Engineering Timeline</h3>
                <div className="border-l border-emerald-500/20 ml-2.5 pl-5 space-y-5">
                  <div className="relative">
                    <div className="absolute w-2.5 h-2.5 rounded-full bg-emerald-500 -left-[25.5px] top-1.5 ring-4 ring-emerald-500/10" />
                    <div className="flex items-start justify-between">
                      <h4 className="text-sm font-semibold text-white">Senior UI Framework Architect / SDE II</h4>
                      <span className="text-[10px] font-mono bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded">2024 - PRESENT</span>
                    </div>
                    <div className="text-[11px] text-white/50 mt-0.5 font-mono">Imran Studio Workspace</div>
                    <p className="text-xs font-light text-slate-300 mt-2 leading-relaxed">
                      Constructed heavy interaction dashboards and custom operating workspace layouts incorporating layered canvas libraries and multi-tab state management. Optimized JS render frames to target 60fps on mobile.
                    </p>
                  </div>

                  <div className="relative">
                    <div className="absolute w-2.5 h-2.5 rounded-full bg-emerald-400 -left-[25.5px] top-1.5 ring-4 ring-emerald-400/10" />
                    <div className="flex items-start justify-between">
                      <h4 className="text-sm font-semibold text-white">Software Development Engineer</h4>
                      <span className="text-[10px] font-mono bg-white/5 text-white/60 px-2 py-0.5 rounded">2022 - 2024</span>
                    </div>
                    <div className="text-[11px] text-white/50 mt-0.5 font-mono">PixelCraft Tech Operations</div>
                    <p className="text-xs font-light text-slate-300 mt-2 leading-relaxed">
                      Authored robust custom UI structures, cryptographic hardware keys controllers, and vector layout components using React Native and Web Crypto APIs.
                    </p>
                  </div>
                </div>
              </div>

              {/* Skill Matrix Grid */}
              <div>
                <h3 className="text-xs font-mono uppercase tracking-widest text-emerald-400 mb-4">Core Technology Matrix</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {SKILLS.map((cat, idx) => (
                    <div key={idx} className="bg-slate-900/60 border border-white/5 p-4 rounded-2xl">
                      <div className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <Code className="w-3.5 h-3.5" />
                        {cat.category}
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {cat.items.map(s => (
                          <span key={s} className="text-[10px] font-mono bg-black/40 border border-white/5 text-white/80 px-2 py-1 rounded">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 'certificates':
        return (
          <div className="flex flex-col h-full bg-slate-950/70 text-slate-100 overflow-y-auto p-6 font-sans select-text">
            <h2 className="text-lg font-bold tracking-tight text-white mb-1">Credentials & Certifications</h2>
            <p className="text-xs text-white/50 mb-6">Fully authenticated training benchmarks and specialization structures.</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {CERTIFICATES.map((cert) => (
                <div key={cert.title} className="p-4 rounded-2xl bg-slate-900/40 border border-white/5 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-white leading-normal">{cert.title}</h4>
                    <p className="text-[10px] text-white/50 mt-1">{cert.issuer}</p>
                    <p className="text-[9px] font-mono text-emerald-400 mt-1">ISSUED: Year {cert.year} • verified</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'contact':
        return (
          <div className="flex flex-col h-full bg-slate-950/70 text-slate-100 overflow-y-auto p-6 font-sans select-none items-center justify-center text-center">
            <div className="mb-6 max-w-sm">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3 shadow-[0_0_15px_rgba(16,185,129,0.15)]">
                <Mail className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-bold tracking-tight text-white">Channeled Comms Interface</h2>
              <p className="text-xs text-white/50 mt-1">Get in touch directly with Imran via secured transit conduits.</p>
            </div>

            <div className="grid grid-cols-1 gap-4 w-full max-w-sm pb-8">
              {/* WhatsApp Button */}
              <a
                href="https://wa.me/917358245131"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => audioSynth.playClick()}
                className="flex items-center gap-4 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 hover:border-emerald-500/50 hover:bg-emerald-500/20 transition-all duration-300 text-left group cursor-pointer shadow-lg"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center shrink-0 shadow-[0_0_12px_rgba(16,185,129,0.3)] transition-transform group-hover:scale-110">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-white tracking-wide">WhatsApp Encryption Line</h4>
                  <p className="text-[10px] text-emerald-400 font-mono mt-0.5">Shatter-proof direct secure link</p>
                </div>
              </a>

              {/* Email Button */}
              <a
                href="mailto:abdulkadarimran@gmail.com"
                onClick={() => audioSynth.playClick()}
                className="flex items-center gap-4 p-4 rounded-2xl bg-sky-500/10 border border-sky-500/20 hover:border-sky-500/50 hover:bg-sky-500/20 transition-all duration-300 text-left group cursor-pointer shadow-lg"
              >
                <div className="w-10 h-10 rounded-xl bg-sky-500 text-slate-950 flex items-center justify-center shrink-0 shadow-[0_0_12px_rgba(14,165,233,0.3)] transition-transform group-hover:scale-110">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-white tracking-wide">Secured Email Transit</h4>
                  <p className="text-[10px] text-sky-400 font-mono mt-0.5">abdulkadarimran@gmail.com</p>
                </div>
              </a>

              {/* LinkedIn Button */}
              <a
                href="https://linkedin.com/in/abdulkadarimran"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => audioSynth.playClick()}
                className="flex items-center gap-4 p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 hover:border-blue-500/50 hover:bg-blue-500/20 transition-all duration-300 text-left group cursor-pointer shadow-lg"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-500 text-slate-950 flex items-center justify-center shrink-0 shadow-[0_0_12px_rgba(59,130,246,0.3)] transition-transform group-hover:scale-110">
                  <Linkedin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-white tracking-wide">LinkedIn Professional Grid</h4>
                  <p className="text-[10px] text-blue-400 font-mono mt-0.5">Connect on the expert mesh</p>
                </div>
              </a>

              {/* Resume Download Button */}
              <a
                href="/resume/Imran-cv.pdf"
                download="Imran-cv.pdf"
                onClick={() => audioSynth.playClick()}
                className="mt-10 flex h-24 w-full items-center justify-center gap-4 rounded-2xl bg-sky-500 text-slate-950 text-base font-semibold shadow-lg shadow-sky-500/20 transition-all duration-300 hover:bg-sky-600 hover:scale-[1.02] cursor-pointer"
              >
                <Download className="w-6 h-6" />
                Download Resume
              </a>
            </div>

          </div>
        );

      case 'optiqo': {
        // Dynamic bokeh rendering points (preset arrangement for consistent, high-end organic alignment)
        const BOKEH_POINTS = [
          { cx: '35%', cy: '42%', r: 1.2, opacity: 0.15 },
          { cx: '55%', cy: '32%', r: 0.8, opacity: 0.22 },
          { cx: '42%', cy: '58%', r: 1.5, opacity: 0.18 },
          { cx: '65%', cy: '52%', r: 1.0, opacity: 0.25 },
          { cx: '22%', cy: '55%', r: 0.9, opacity: 0.12 },
          { cx: '72%', cy: '28%', r: 1.4, opacity: 0.16 },
          { cx: '32%', cy: '28%', r: 0.7, opacity: 0.20 },
          { cx: '50%', cy: '50%', r: 2.2, opacity: 0.10 },
          { cx: '28%', cy: '32%', r: 1.1, opacity: 0.17 },
          { cx: '62%', cy: '68%', r: 1.3, opacity: 0.21 },
        ];

        // Colors mapping for lens filter prism modes
        const prismColorsMap = {
          cyan: {
            bg: 'bg-cyan-950/25',
            glow: 'from-cyan-500/10 to-pink-500/10',
            stroke: 'stroke-cyan-500/40',
            bubble: 'fill-cyan-400 group-hover:fill-pink-400',
            hud: 'text-cyan-400',
            border: 'border-cyan-500/20'
          },
          amber: {
            bg: 'bg-amber-950/25',
            glow: 'from-amber-600/10 to-yellow-500/10',
            stroke: 'stroke-amber-400/50',
            bubble: 'fill-amber-400 group-hover:fill-yellow-300',
            hud: 'text-amber-400',
            border: 'border-amber-500/20'
          },
          crimson: {
            bg: 'bg-rose-950/25',
            glow: 'from-red-600/10 to-rose-600/10',
            stroke: 'stroke-red-500/40',
            bubble: 'fill-red-400 group-hover:fill-rose-400',
            hud: 'text-red-400',
            border: 'border-red-500/20'
          },
          mono: {
            bg: 'bg-neutral-900/25',
            glow: 'from-neutral-700/10 to-neutral-500/10',
            stroke: 'stroke-neutral-400/40',
            bubble: 'fill-neutral-300 group-hover:fill-white',
            hud: 'text-neutral-300',
            border: 'border-neutral-500/20'
          }
        };

        const activeColors = prismColorsMap[prismMode];

        return (
          <div className="flex flex-col h-full bg-slate-950/70 text-slate-100 overflow-y-auto p-5 font-sans select-none">
            {/* Window title and description */}
            <div className="flex justify-between items-center mb-4 select-none">
              <div>
                <h2 className="text-base font-bold tracking-tight text-white flex items-center gap-1.5">
                  <Camera className="w-4.5 h-4.5 text-emerald-400" />
                  optiqo Lens Simulator
                </h2>
                <p className="text-[10px] text-white/50 mt-0.5">Simulate optical glass physics: bokeh circle expansion, focal length framing, and high-frequency ISO digital noise formatting.</p>
              </div>
            </div>

            {/* General optiqo Interactive Grid */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 flex-1 items-stretch">

              {/* Left Column: Viewfinder (Simulated lens preview canvas) */}
              <div className="md:col-span-3 rounded-2xl bg-black/80 border border-white/10 relative overflow-hidden flex flex-col justify-between p-3.5 shadow-xl select-none group">

                {/* 1. Pure White Exposure Flash overlay */}
                <AnimatePresence>
                  {flashOn && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.1 }}
                      className="absolute inset-0 bg-white z-50 pointer-events-none"
                    />
                  )}
                </AnimatePresence>

                {/* 2. Concentric glass-refraction ambient lighting */}
                <div className={`absolute inset-0 bg-gradient-to-tr ${activeColors.glow} mix-blend-screen pointer-events-none opacity-60`} />

                {/* 3. Simulated Film/Digital Grain Overlay depending on ISO */}
                <div
                  className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-35 bg-repeat animate-pulse"
                  style={{
                    backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)`,
                    backgroundSize: `${2 + (isoVal / 1000)}px ${2 + (isoVal / 1000)}px`,
                    opacity: Math.min(0.4, (isoVal - 100) / 6300 * 0.4)
                  }}
                />

                {/* Top Viewfinder indicators */}
                <div className="flex justify-between items-center text-[9px] font-mono tracking-wider text-white/50 z-10">
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-ping" />
                    LIVE
                  </span>
                  <span>AF-S SINGLE PORTRAIT</span>
                  <span>100% QUALITY</span>
                </div>

                {/* Center SVG Lens Elements Rendering (Circles) */}
                <div className="flex-1 flex items-center justify-center relative my-4">
                  {/* Outer mechanical barrel lines */}
                  <svg className="w-full h-48 select-none pointer-events-none absolute inset-0 z-10" viewBox="0 0 100 100" preserveAspectRatio="none">
                    {/* Centered target crosshair grid */}
                    <line x1="50" y1="20" x2="50" y2="80" className={`${activeColors.stroke} opacity-20`} strokeWidth="0.15" strokeDasharray="2 2" />
                    <line x1="20" y1="50" x2="80" y2="50" className={`${activeColors.stroke} opacity-20`} strokeWidth="0.15" strokeDasharray="2 2" />

                    {/* Camera Focus Brackets [  ] */}
                    <path d="M 40,43 L 40,40 L 43,40" stroke="#10b981" strokeWidth="0.5" fill="none" className="opacity-70" />
                    <path d="M 60,43 L 60,40 L 57,40" stroke="#10b981" strokeWidth="0.5" fill="none" className="opacity-70" />
                    <path d="M 40,57 L 40,60 L 43,60" stroke="#10b981" strokeWidth="0.5" fill="none" className="opacity-70" />
                    <path d="M 60,57 L 60,60 L 57,60" stroke="#10b981" strokeWidth="0.5" fill="none" className="opacity-70" />

                    {/* Focal concentric scale rings */}
                    <circle cx="50" cy="50" r="18" fill="none" className={`${activeColors.stroke} opacity-15`} strokeWidth="0.25" />
                    <circle cx="50" cy="50" r="32" fill="none" className={`${activeColors.stroke} opacity-10`} strokeWidth="0.15" strokeDasharray="1 1" />

                    {/* Simulated Aperture Blade Hexagon helper lines */}
                    <polygon
                      points="50,22 74,36 74,64 50,78 26,64 26,36"
                      fill="none"
                      className={`${activeColors.stroke} opacity-15`}
                      strokeWidth="0.2"
                      style={{
                        transform: `rotate(${focalLength / 2}deg)`,
                        transformOrigin: '50% 50%',
                        transition: 'transform 0.4s ease'
                      }}
                    />
                  </svg>

                  {/* Dynamic Bokeh Circle elements layer */}
                  <div className="absolute inset-0 flex items-center justify-center overflow-hidden z-0">
                    <div
                      className="w-full h-full flex items-center justify-center relative transition-transform duration-500"
                      style={{ transform: `scale(${1 + (focalLength - 50) / 300})` }}
                    >
                      {BOKEH_POINTS.map((pt, index) => {
                        // Formula to calculate visual bokeh blur radius:
                        // wider aperture (lower apertureVal f/) combined with longer focal length mm multiplies circle radius!
                        const calculatedRadius = (pt.r * (250 / apertureVal) * (focalLength / 50)) * 0.16;
                        const finalRadius = Math.max(2, Math.min(90, calculatedRadius));

                        // dynamic blur value based on wide aperture (smaller f/ means focus decays, causing heavy background blur)
                        const focusBlur = Math.max(0, Math.min(12, (16 / apertureVal) * (focalLength / 80)));

                        return (
                          <div
                            key={index}
                            className="absolute rounded-full transition-all duration-300 pointer-events-none mix-blend-screen"
                            style={{
                              left: pt.cx,
                              top: pt.cy,
                              width: `${finalRadius * 2}px`,
                              height: `${finalRadius * 2}px`,
                              marginLeft: `-${finalRadius}px`,
                              marginTop: `-${finalRadius}px`,
                              opacity: pt.opacity,
                              filter: `blur(${focusBlur}px)`,
                              background: prismMode === 'cyan'
                                ? 'radial-gradient(circle, rgba(6,182,212,0.9) 0%, rgba(236,72,153,0.3) 70%, transparent 100%)'
                                : prismMode === 'amber'
                                  ? 'radial-gradient(circle, rgba(245,158,11,0.9) 0%, rgba(217,119,6,0.2) 75%, transparent 100%)'
                                  : prismMode === 'crimson'
                                    ? 'radial-gradient(circle, rgba(239,68,68,0.9) 0%, rgba(190,18,60,0.3) 75%, transparent 100%)'
                                    : 'radial-gradient(circle, rgba(243,244,246,0.9) 0%, rgba(107,114,128,0.2) 70%, transparent 100%)'
                            }}
                          />
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Bottom Viewfinder digital HUD overlay panel (Just like standard DSLRs/Mirrorless cameras!) */}
                <div className={`p-2 bg-slate-950/80 border border-white/5 rounded-xl flex items-center justify-between font-mono text-[10px] uppercase tracking-wider z-10 ${activeColors.hud}`}>
                  <span>FL: <strong className="text-white">{focalLength}mm</strong></span>
                  <span>AV: <strong className="text-white">f/{apertureVal.toFixed(1)}</strong></span>
                  <span>ISO: <strong className="text-white">{isoVal}</strong></span>
                  <span>EXP: <strong className="text-white">1/{Math.round(4000 / (isoVal / 100 + focalLength / 5))}s</strong></span>
                  <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded font-bold font-mono">
                    <span className="w-1 h-1 rounded-full bg-emerald-400 animate-ping" />
                    AF-S SAFE
                  </div>
                </div>
              </div>

              {/* Right Column: Interactive Optics Board (sliders and toggles) */}
              <div className="md:col-span-2 flex flex-col justify-between gap-4">

                {/* Control Panel Glassbox */}
                <div className="p-4 rounded-2xl bg-slate-900/40 border border-white/15 space-y-4 font-sans select-none flex-1">
                  <div className="flex items-center gap-1.5 border-b border-white/5 pb-2">
                    <Sliders className="w-4 h-4 text-emerald-400" />
                    <h3 className="text-xs font-bold uppercase tracking-widest text-white">Optics Controller</h3>
                  </div>

                  {/* 1. Focal Length (mm) */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center select-none">
                      <label className="text-[10px] font-mono uppercase tracking-wider text-white/40">Focal Zoom (FL)</label>
                      <span className="text-xs font-semibold text-white font-mono">{focalLength}mm</span>
                    </div>
                    <input
                      type="range"
                      min="18"
                      max="200"
                      value={focalLength}
                      onChange={(e) => {
                        setFocalLength(Number(e.target.value));
                        audioSynth.playTick();
                      }}
                      className="w-full accent-emerald-400 bg-slate-950 h-1.5 rounded-lg cursor-pointer"
                    />
                    <div className="flex justify-between text-[8px] font-mono text-white/30">
                      <span>18mm (WIDE)</span>
                      <span>50mm (STANDARD)</span>
                      <span>200mm (TELE)</span>
                    </div>
                  </div>

                  {/* 2. Aperture Diameter (f-stop) */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center select-none">
                      <label className="text-[10px] font-mono uppercase tracking-wider text-white/40">Lens Aperture (AV)</label>
                      <span className="text-xs font-semibold text-white font-mono">f/{apertureVal.toFixed(1)}</span>
                    </div>
                    {/* Slider mapping 1.2 to 16 */}
                    <input
                      type="range"
                      min="1.2"
                      max="16"
                      step="0.2"
                      value={apertureVal}
                      onChange={(e) => {
                        setApertureVal(Number(e.target.value));
                        audioSynth.playTick();
                      }}
                      className="w-full accent-emerald-400 bg-slate-950 h-1.5 rounded-lg cursor-pointer"
                    />
                    <div className="flex justify-between text-[8px] font-mono text-white/30">
                      <span>f/1.2 (heavy blur bokeh)</span>
                      <span>f/2.8</span>
                      <span>f/16 (crisp sharp DOF)</span>
                    </div>
                  </div>

                  {/* 3. ISO (Digital Sensitivity) */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center select-none">
                      <label className="text-[10px] font-mono uppercase tracking-wider text-white/40">ISO Sensitivity</label>
                      <span className="text-xs font-semibold text-white font-mono">{isoVal}</span>
                    </div>
                    <input
                      type="range"
                      min="100"
                      max="6400"
                      step="100"
                      value={isoVal}
                      onChange={(e) => {
                        setIsoVal(Number(e.target.value));
                        audioSynth.playTick();
                      }}
                      className="w-full accent-emerald-400 bg-slate-950 h-1.5 rounded-lg cursor-pointer"
                    />
                    <div className="flex justify-between text-[8px] font-mono text-white/30">
                      <span>100 (clean)</span>
                      <span>1600 (organic grain)</span>
                      <span>6400 (heavy digital noise)</span>
                    </div>
                  </div>

                  {/* 4. Prism Mode Filters */}
                  <div className="space-y-1.5 pt-1">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-white/40 block">Prism Spectrum filters</label>
                    <div className="grid grid-cols-4 gap-1.5">
                      {(['cyan', 'amber', 'crimson', 'mono'] as const).map((mode) => (
                        <button
                          key={mode}
                          type="button"
                          onClick={() => {
                            setPrismMode(mode);
                            audioSynth.playTick();
                          }}
                          className={`py-1.5 text-[9px] font-mono font-bold tracking-wider upper absolute-center rounded-xl border text-center cursor-pointer transition-all ${prismMode === mode
                            ? 'border-emerald-400 bg-emerald-500/10 text-emerald-400'
                            : 'border-white/5 bg-black/20 text-white/50 hover:text-white'
                            }`}
                        >
                          {mode}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Shutter snapshot action button */}
                <button
                  type="button"
                  id="optiqo_shutter_btn"
                  onClick={handleCaptureSnapshot}
                  className="w-full py-3 bg-gradient-to-tr from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 font-bold text-slate-950 rounded-2xl text-xs transition-all shadow-[0_0_20px_rgba(16,185,129,0.25)] cursor-pointer flex items-center justify-center gap-2 uppercase tracking-widest font-mono"
                >
                  <Camera className="w-4 h-4 text-slate-950" />
                  SHUTTER TRIGGER SNAP
                </button>
              </div>
            </div>

            {/* Bottom snap history catalog panel */}
            <div className="mt-4 border-t border-white/5 pt-4">
              <h4 className="text-[10px] font-mono uppercase tracking-wider text-white/40 mb-2.5">Snapshot memory roll ({snaps.length})</h4>
              <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
                {snaps.map((snp) => (
                  <div key={snp.id} className="p-2 border border-white/10 rounded-xl bg-slate-900/60 flex items-center gap-3 shrink-0 select-none">
                    {/* Simulated visual lens blueprint thumbnail */}
                    <div className={`w-8 h-8 rounded-lg bg-black border border-white/5 flex items-center justify-center relative overflow-hidden shrink-0`}>
                      <div className="w-3 h-3 rounded-full border border-emerald-400/30 bg-emerald-500/10 absolute animate-pulse" />
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400/80" />
                    </div>
                    <div>
                      <div className="text-[9px] font-mono font-semibold text-white/90">IMG_{snp.time.replace(/:/g, '')}.RAW</div>
                      <div className="text-[8px] font-mono text-white/40 mt-0.5">
                        {snp.fl}mm • f/{snp.ap.toFixed(1)} • ISO {snp.iso} • {snp.prism.toUpperCase()}
                      </div>
                    </div>
                  </div>
                ))}
                {snaps.length === 0 && (
                  <div className="text-[9px] font-mono text-white/30 py-3 block">
                    Memory roll buffer empty. Click 'Shutter Trigger Snap' to record.
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      }

      case 'recycle': {
        const archivedProjects = [
          {
            id: 'archive_portfolio',
            name: 'imran portfolio',
            icon: image,
            url: 'https://imran-portfolio-ebon-ten.vercel.app'
          },
          {
            id: 'archive_kuruthi',
            name: 'Kuruthi-kavi',
            icon: ICONS.layerly,
            url: 'https://kuruthi-kavi.vercel.app/'
          },
          {
            id: 'archive_buildspace',
            name: 'Build-space',
            icon: ICONS.layoutlab,
            url: 'https://imran-build-space.vercel.app/'
          },
          {
            id: 'archive_tuition',
            name: 'Tuition',
            icon: image,
            url: 'https://tution-website-seven.vercel.app'
          }
        ];

        const openArchivedProject = (url: string) => {
          window.open(url, '_blank', 'noopener,noreferrer');
          audioSynth.playTick();
          showToast('Opening archived project...', 'success');
        };

        return (
          <div className="flex flex-col h-full bg-slate-950/70 text-slate-100 overflow-y-auto p-6 font-sans">
            <div className="flex justify-between items-center pb-4 border-b border-white/10 select-none mb-6">
              <div>
                <h2 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
                  <img src={ICONS.recycle} alt="Recycle Bin" className="w-6 h-6 object-contain" />
                  Recycle Buffer (Trash)
                </h2>
                <span className="text-[10px] text-white/50 font-mono">Archived projects from previous development iterations.</span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {archivedProjects.map((project) => (
                <div
                  key={project.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => openArchivedProject(project.url)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      openArchivedProject(project.url);
                    }
                  }}
                  className="group rounded-2xl border border-white/10 bg-slate-900/45 p-4 shadow-[0_10px_30px_rgba(0,0,0,0.25)] backdrop-blur-xl transition-all duration-300 hover:border-emerald-500/30 hover:bg-slate-900/70 hover:shadow-[0_0_20px_rgba(16,185,129,0.12)] cursor-pointer"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={project.icon}
                        alt={project.name}
                        className="w-12 h-12 rounded-xl object-contain bg-slate-950/80 border border-white/10 p-1.5 shadow-md transition-transform duration-300 group-hover:scale-105"
                        referrerPolicy="no-referrer"
                      />
                      <div className="min-w-0">
                        <h4 className="text-sm font-semibold text-white group-hover:text-emerald-400 transition-colors truncate">{project.name}</h4>
                        <p className="text-[10px] uppercase tracking-[0.25em] text-emerald-400/80 mt-1">Archived Project</p>
                      </div>
                    </div>
                    <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[9px] font-mono uppercase tracking-[0.2em] text-white/50">
                      Demo
                    </span>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-xs text-white/60">Placeholder archive entry</span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        openArchivedProject(project.url);
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 transition-all font-semibold text-slate-950 rounded-xl text-[10px] cursor-pointer shadow-md shrink-0"
                    >
                      Open Project
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      }

      default:
        return <div className="p-6 text-sm">App template missing loading relays.</div>;
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        drag={!isMobile} // React drag trigger bounds
        dragMomentum={false}
        onDragStart={() => onFocus(id)}
        initial={isMobile ? { y: '100%' } : { scale: 0.9, opacity: 0, x: position.x, y: position.y }}
        animate={isMobile ? { y: 0 } : { scale: 1, opacity: 1, x: position.x, y: position.y }}
        exit={isMobile ? { y: '100%' } : { scale: 0.95, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 220 }}
        style={{
          position: 'absolute',
          width: isMobile ? '100%' : width,
          height: isMobile ? 'calc(100% - 44px)' : height,
          zIndex,
          top: isMobile ? '44px' : undefined,
          left: isMobile ? 0 : undefined,
        }}
        onClick={() => onFocus(id)}
        className={`flex flex-col rounded-2xl overflow-hidden pointer-events-auto ${isFocused
          ? 'ring-1 ring-emerald-500/50 shadow-[0_15px_45px_rgba(0,0,0,0.8)] shadow-emerald-500/5 bg-slate-900/90'
          : 'border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.6)] bg-slate-900/60'
          } backdrop-blur-xl transition-[box-shadow,background]`}
      >
        {/* Window Top Navigation Frame (Header) */}
        <div
          onMouseDown={handleMouseDown}
          className={`window-header-drag flex items-center justify-between px-4 py-3 border-b select-none shrink-0 ${isFocused ? 'bg-white/5 border-white/15' : 'bg-black/10 border-white/10'
            } ${isMobile ? 'h-11' : 'cursor-grab active:cursor-grabbing'}`}
        >
          <div className="flex items-center gap-2.5">
            {canGoBack && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  audioSynth.playTick();
                  onBack?.();
                }}
                className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/15 flex items-center justify-center text-white/80 transition-all"
                title="Go back"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <div className="w-5 h-5">
              <img
                src={icon}
                alt={`${title} miniature artwork icon icon`}
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <span className="text-xs font-semibold tracking-tight text-white/90">{title}</span>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Close button only (No mock minimize or maximize) */}
            <button
              type="button"
              id={`close_window_${id}`}
              onClick={handleCloseClick}
              className="w-5.5 h-5.5 rounded-full bg-rose-500/20 hover:bg-rose-500 text-rose-300 hover:text-white flex items-center justify-center transition-all cursor-pointer"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Window Contents Area */}
        <div className="flex-1 overflow-hidden">
          {renderContent()}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
