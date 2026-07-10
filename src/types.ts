/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface AppWindow {
  id: string; // matches application ids like 'layerly', 'ethernote', 'aboutme', etc.
  title: string;
  isOpen: boolean;
  isFocused: boolean;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  icon: string; // path to the generated miniature artwork file
}

export interface Project {
  id: string;
  name: string;
  desc: string;
  longDesc: string;
  tech: string[];
  screenshot: string; // Unsplash preview or mock screenshot URL
  liveUrl: string;
  githubUrl: string;
  features: string[];
  panelSection?: 'Studio' | 'Game';
}

export interface TrashItem {
  id: string;
  name: string;
  type: 'project' | 'experiment' | 'design';
  description: string;
  deletedAt: string;
  retainable?: boolean;
}

export interface NotificationItem {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning';
  time: string;
}

export interface SearchResult {
  id: string;
  type: 'app' | 'project' | 'skill' | 'action';
  title: string;
  subtitle: string;
  targetAppId: string;
}

export type ThemeId = 'dark_glass' | 'cyberpunk' | 'forest' | 'sunset' | 'monochrome';

export interface ThemeConfig {
  id: ThemeId;
  name: string;
  bgClass: string; // ambient backdrop coloring
  primaryColor: string; // custom buttons, accents
  borderColor: string; // border glass outline styling
  textColor: string;
  cardBg: string; // card container color (glass)
  accentGlow: string; // shadow/glow effect styling
}

export type WallpaperId = 'samsung_monitor' | 'samsung_phone' | 'purple_galaxy' | 'cyberpunk_city' | 'minimal_dark' | 'sunset_landscape';

export interface WallpaperConfig {
  id: WallpaperId;
  name: string;
  url: string;
}

export interface TerminalLine {
  text: string;
  type: 'input' | 'output' | 'error' | 'success';
}
