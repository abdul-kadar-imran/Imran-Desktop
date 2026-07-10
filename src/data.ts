/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Project, ThemeConfig, WallpaperConfig, TrashItem } from './types';

// Import our custom-generated miniature 3D artwork assets
import layerlyIcon from './assets/images/layerly.png';
import ethernoteIcon from './assets/images/Ethernotes.png';
import qrnestIcon from './assets/images/Qr nest.png';
import tstrikeIcon from './assets/images/Tstirke.png';
import keysmithIcon from './assets/images/keysmith.png';
import layoutlabIcon from './assets/images/layoutlab.png';
import recycleIcon from './assets/images/trash.png';
import optiqoIcon from './assets/images/optiqo.png';
import phoneWallpaper from './assets/images/phone wallpaper.jpeg';
import laptopWallpaper from './assets/images/laptop wallpaper.jpeg';
import hisIcon from './assets/images/HIS.png';
import scmIcon from './assets/images/SCM.png';
import wfIcon from './assets/images/wf.png';

export const ICONS = {
  layerly: layerlyIcon,
  ethernote: ethernoteIcon,
  qrnest: qrnestIcon,
  tstrike: tstrikeIcon,
  keysmith: keysmithIcon,
  layoutlab: layoutlabIcon,
  optiqo: optiqoIcon,        // Map optiqo to shiny optics lens miniature artwork
  recycle: recycleIcon,
  his: hisIcon,
  scm: scmIcon,
  wf: wfIcon,
};

export const DESKTOP_PANEL_APPS = [
  { id: 'his', title: 'Health Care', icon: ICONS.his, url: 'https://hospital-info-system.vercel.app/' },
  { id: 'scm', title: 'Logistics', icon: ICONS.scm, url: 'https://invoicely-demo.vercel.app/' },
  { id: 'wf', title: 'Workflow', icon: ICONS.wf, url: 'https://work-flow-mu-two.vercel.app/' },
];

export const PROJECTS: Project[] = [

  {
    id: 'ethernote',
    name: 'EtherNote',
    desc: 'Holographic markdown workspace with neural graph linkages.',
    longDesc: 'EtherNote merges linear notebook logs with visual brain mapping. Connect notes with real-time link graphs, autocomplete tags using embedded semantic search, and work absolutely serverless.',
    tech: ['Next.js', 'TypeScript', 'D23.js', 'LocalForage', 'Tailwind CSS'],
    screenshot: 'https://images.unsplash.com/photo-1517842645767-c639042777db?q=80&w=800&auto=format&fit=crop',
    liveUrl: 'https://ethernote.vercel.app',
    githubUrl: 'https://github.com/imran/ethernote',
    features: ['Interactive force-directed node linking', 'Instant PDF and raw Markdown exporting', 'Full offline operational queueing', 'Secure peer-to-peer sync protocols']
  },
  {
    id: 'qrnest',
    name: 'QR Nest',
    desc: 'Artistic QR code generation platform with deep semantic pattern framing.',
    longDesc: 'QR Nest elevates standard structural barcodes into visually expressive designer marketing items. It applies cellular automata algorithms to nest QR grids elegantly inside user-submitted illustrations and vector silhouettes.',
    tech: ['React', 'WebAssembly', 'Rust', 'Tailwind CSS', 'Canvas API'],
    screenshot: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?q=80&w=800&auto=format&fit=crop',
    liveUrl: 'https://qr-nest-app.vercel.app/',
    githubUrl: 'https://github.com/imran/qrnest',
    features: ['Custom rust image pattern styling', 'High-speed local WASM compiling', 'Dynamic redundancy testing ratios', 'High-res vector SVG downloads']
  },
  {
    id: 'keysmith',
    name: 'KeySmith',
    desc: 'Hardware-level secure password and cryptographic vault controller.',
    longDesc: 'KeySmith is a specialized vault dashboard configuring portable crypto-modules. It controls hardware-key access lists, generates isolated seed-phrases, and audits local terminal session credentials.',
    tech: ['React', 'WebAuthn', 'TypeScript', 'WebCrypto API', 'Tailwind CSS'],
    screenshot: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=800&auto=format&fit=crop',
    liveUrl: 'https://key-smith-security-agent.vercel.app/',
    githubUrl: 'https://key-smith-security-agent.vercel.app/',
    features: ['Passkey/FIDO2 hardware-key auditing', 'Strict sandboxed local memory decryption', 'Dynamic credential rotation timelines', 'Interactive session audit logs']
  },
  {
    id: 'layoutlab',
    name: 'Layout Lab',
    desc: 'Bento-style layout sandbox featuring smooth visual animations.',
    longDesc: 'Layout Lab allows designers and frontend developers to construct intricate responsive bento grids visually. Drag panels to resize, click to align, fine-tune spacing parameters on a fluid scale, and copy production Tailwind code.',
    tech: ['React', 'Tailwind CSS', 'Framer Motion', 'TypeScript', 'Zustand'],
    screenshot: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=800&auto=format&fit=crop',
    liveUrl: 'https://layout-lab-five.vercel.app/',
    githubUrl: 'https://github.com/imran/layoutlab',
    features: ['Interactive dynamic drag-to-resize panel controls', 'Auto-generated adaptive Tailwind grid code', 'Multi-preset canvas dimension testing', 'Pre-baked rich structural layouts']
  },
  {
    id: 'layerly',
    name: 'Layerly',
    desc: 'Interactive multi-layered design playground with real-time vector grouping.',
    longDesc: 'Layerly is a state-of-the-art vector layout sandboxing tool allowing non-destructive overlapping, pathing calculations, real-time bounding updates, and instant code exports.',
    tech: ['React', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'Canvas API'],
    screenshot: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop',
    liveUrl: 'https://layerly-app.vercel.app/',
    githubUrl: 'https://github.com/imran/layerly',
    features: ['Dynamic bounding calculations', 'Export to SVG & Custom JSON', 'State timeline undo/redo', 'Intelligent layer snapping grid']
  },
  {
    id: 'tstrike',
    name: 'T-Strike',
    desc: 'Sleek sports telemetry and training visualizer.',
    longDesc: 'T-Strike connects with lightweight accelerometer clusters to map live sporting equipment trajectories. High-frequency coordinates stream into premium, visually dense charts to isolate grip torque and strike alignment.',
    tech: ['React', 'Chart.js', 'RxJS', 'WebSockets', 'Tailwind CSS'],
    screenshot: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=800&auto=format&fit=crop',
    liveUrl: 'https://t-strike.vercel.app/',
    githubUrl: 'https://github.com/imran/tstrike',
    features: ['High-frequency real-time graphing', 'Bi-directional sensor calibrated logs', 'Custom slow-motion playback analytics', 'Instant session summary sharing'],
    panelSection: 'Game'
  },
  {
    id: 'optiqo',
    name: 'Optiqo',
    desc: 'Interactive UI/UX design training platform for designers.',
    longDesc: 'Optiqo is a gamified learning platform that helps designers sharpen their UI and UX skills through engaging challenges. Players complete interactive mini-games focused on color theory, typography, spacing, layouts, and visual hierarchy while tracking their progress across multiple difficulty levels.',
    tech: ['React', 'TypeScript', 'Framer Motion', 'Tailwind CSS', 'Vite'],
    screenshot: 'https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=800&auto=format&fit=crop',
    liveUrl: 'https://optiqo-game.vercel.app/',
    githubUrl: 'https://github.com/imran/optiqo',
    features: [
      'Interactive UI and UX design mini-games',
      'Typography, color, and layout challenges',
      'Progress tracking with multiple difficulty levels',
      'Responsive desktop and mobile experience'
    ],
  },
  {
    id: 'salesflow',
    name: 'SalesFlow',
    desc: 'Business CRM and sales pipeline workspace for growing teams.',
    longDesc: 'SalesFlow helps teams manage leads, deals, and follow-ups in one organized workspace.',
    tech: ['React', 'TypeScript', 'Supabase', 'Tailwind CSS', 'Vite'],
    screenshot: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=800&auto=format&fit=crop',
    liveUrl: 'https://salesflow-demo.vercel.app/',
    githubUrl: 'https://github.com/imran/salesflow',
    features: ['Lead tracking', 'Deal forecasting', 'Team activity views', 'Automated reminders']
  },
  {
    id: 'invoicely',
    name: 'InvoiceLy',
    desc: 'Fast invoicing and payment workflow for freelancers and agencies.',
    longDesc: 'InvoiceLy simplifies invoice generation, tracking payments, and sending professional receipts.',
    tech: ['React', 'Next.js', 'Stripe', 'Tailwind CSS', 'TypeScript'],
    screenshot: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=800&auto=format&fit=crop',
    liveUrl: 'https://invoicely-demo.vercel.app/',
    githubUrl: 'https://github.com/imran/invoicely',
    features: ['Invoice templates', 'Payment tracking', 'Recurring billing', 'Client history']
  },
  {
    id: 'hrdock',
    name: 'HR Dock',
    desc: 'HR operations dashboard for onboarding, attendance, and approvals.',
    longDesc: 'HR Dock centralizes employee onboarding, attendance records, and internal approvals for modern teams.',
    tech: ['React', 'Node.js', 'PostgreSQL', 'Tailwind CSS', 'TypeScript'],
    screenshot: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=800&auto=format&fit=crop',
    liveUrl: 'https://hrdock-demo.vercel.app/',
    githubUrl: 'https://github.com/imran/hrdock',
    features: ['Onboarding workflows', 'Attendance reports', 'Approval queues', 'Team directory']
  },
];

export const WALLPAPERS: WallpaperConfig[] = [
  {
    id: 'samsung_monitor',
    name: 'Samsung Curved Monitor Setup',
    url: laptopWallpaper
  },
  {
    id: 'samsung_phone',
    name: 'Samsung Galaxy Fluid S24',
    url: phoneWallpaper
  },
  {
    id: 'purple_galaxy',
    name: 'Purple Galaxy',
    url: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=1600&auto=format&fit=crop'
  },
  {
    id: 'cyberpunk_city',
    name: 'Cyberpunk City',
    url: 'https://images.unsplash.com/photo-1515621061946-eff1c2a352bd?q=80&w=1600&auto=format&fit=crop'
  },
  {
    id: 'minimal_dark',
    name: 'Minimal Dark',
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1600&auto=format&fit=crop'
  },
  {
    id: 'sunset_landscape',
    name: 'Sunset Landscape',
    url: 'https://images.unsplash.com/photo-1472214222541-d510753a4907?q=80&w=1600&auto=format&fit=crop'
  }
];

export const THEMES: ThemeConfig[] = [
  {
    id: 'dark_glass',
    name: 'Dark Glass',
    bgClass: 'backdrop-blur-xl bg-slate-950/40 text-slate-100',
    primaryColor: 'bg-emerald-500 hover:bg-emerald-600 text-slate-950',
    borderColor: 'border-slate-800/80',
    textColor: 'text-slate-200',
    cardBg: 'bg-slate-900/60 border border-slate-700/30 backdrop-blur-md',
    accentGlow: 'shadow-[0_0_30px_rgba(16,185,129,0.15)] bg-slate-950/70',
  },
  {
    id: 'cyberpunk',
    name: 'Cyberpunk',
    bgClass: 'backdrop-blur-md bg-zinc-950/60 text-yellow-300',
    primaryColor: 'bg-fuchsia-500 hover:bg-fuchsia-600 text-black',
    borderColor: 'border-fuchsia-500/50',
    textColor: 'text-yellow-400 font-mono',
    cardBg: 'bg-black/85 border border-fuchsia-500/50 backdrop-blur-md',
    accentGlow: 'shadow-[0_0_20px_rgba(240,46,170,0.3)] bg-black/90 border-2 border-fuchsia-500',
  },
  {
    id: 'forest',
    name: 'Forest',
    bgClass: 'backdrop-blur-lg bg-stone-900/40 text-emerald-100',
    primaryColor: 'bg-lime-600 hover:bg-lime-700 text-white',
    borderColor: 'border-emerald-800/40',
    textColor: 'text-stone-200',
    cardBg: 'bg-stone-950/65 border border-stone-800/30 backdrop-blur-md',
    accentGlow: 'shadow-[0_0_30px_rgba(101,163,13,0.15)] bg-stone-950/80',
  },
  {
    id: 'sunset',
    name: 'Sunset',
    bgClass: 'backdrop-blur-xl bg-orange-950/30 text-amber-50',
    primaryColor: 'bg-rose-500 hover:bg-rose-600 text-white',
    borderColor: 'border-rose-900/45',
    textColor: 'text-amber-100',
    cardBg: 'bg-orange-950/70 border border-rose-800/30 backdrop-blur-md',
    accentGlow: 'shadow-[0_0_35px_rgba(244,63,94,0.2)] bg-orange-950/80',
  },
  {
    id: 'monochrome',
    name: 'Monochrome',
    bgClass: 'backdrop-blur-md bg-neutral-900/30 text-neutral-100',
    primaryColor: 'bg-neutral-100 hover:bg-neutral-200 text-neutral-950',
    borderColor: 'border-neutral-700/60',
    textColor: 'text-neutral-200',
    cardBg: 'bg-neutral-900/80 border border-neutral-700/60 backdrop-blur-lg',
    accentGlow: 'shadow-lg bg-neutral-900/90',
  }
];

export const DEFAULT_TRASH: TrashItem[] = [
  {
    id: 'scrap_v1',
    name: 'FocusFlow V1 (Deprecated Mock)',
    type: 'project',
    description: 'Initial client-side timer flow. Overridden by modular multi-threaded synth loop.',
    deletedAt: '2025-11-12'
  },
  {
    id: 'exp_09',
    name: 'Autonomous Web Scraping Daemon',
    type: 'experiment',
    description: 'A node web crawler that got rate-limited inside 2 minutes. Failed experiment.',
    deletedAt: '2026-02-04'
  },
  {
    id: 'design_3',
    name: 'Brutalist Neo-Pink Dashboard Design Layout',
    type: 'design',
    description: 'Extremely aggressive hot-pink styling. Deemed eye-stretching and promptly discarded.',
    deletedAt: '2026-05-30'
  }
];

export const SKILLS = [
  { category: 'Frontend Architecture', items: ['React 19', 'Next.js', 'TypeScript', 'Zustand', 'RxJS', 'D3.js', 'Tailwind CSS v4', 'Framer Motion'] },
  { category: 'Backend & Operations', items: ['Node.js', 'Express', 'PostgreSQL', 'Firebase / Firestore', 'Docker', 'Vercel / Cloud Run', 'GitHub Actions'] },
  { category: 'Creative Tech & Tooling', items: ['Figma Grid Design', 'Canvas Vector Math', 'WebAudio API / Synthesis', 'VASM compiles', 'WebCrypto / Security'] }
];

export const ABOUT_TEXT = `Hello, I'm Imran. I'm a passionate design-focused Frontend Architect on a mission to build highly refined, functional digital systems that are a joy to experience. 

Through my work in computer interfaces, graphics math, and secure protocols, I merge rigorous engineering with editorial-style layouts, glassmorphic depths, and robust responsive structures. 

Currently, I design web kernels, vector grids, and modular platforms. Welcome to my custom operating workspace: imran OS. Open any app on the grid or drop a query into my terminal tool to explore my journey.`;

export const CERTIFICATES = [
  { title: 'Advanced Frontend Architecture with WebAssembly', issuer: 'WASM Alliance', year: '2025' },
  { title: 'Interactive Data Visualizations & Complex Logic', issuer: 'D3 Masterclass Group', year: '2024' },
  { title: 'Micro-interactions & UX Physics', issuer: 'Framer Motion Lab', year: '2024' },
  { title: 'Production Scaled Cloud Orchestrations', issuer: 'Google Cloud Platform Certified', year: '2023' }
];
