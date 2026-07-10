/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Search, Compass, Cpu, FileText, ArrowRight, CornerDownLeft } from 'lucide-react';
import { PROJECTS, SKILLS } from '../data';
import { SearchResult } from '../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectResult: (appId: string) => void;
}

export default function SearchModal({ isOpen, onClose, onSelectResult }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      // Let standard browser focus fire
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Generate dynamic matching search pool
  const searchPool: SearchResult[] = [
    // Apps
    { id: 'aboutme', type: 'app', title: 'About Me', subtitle: 'Read Imran\'s developer bio and history', targetAppId: 'aboutme' },
    { id: 'resume', type: 'app', title: 'Resume', subtitle: 'Inspect professional milestones and CV', targetAppId: 'resume' },
    { id: 'certificates', type: 'app', title: 'Certificates ', subtitle: 'Credential archives and accomplishments', targetAppId: 'certificates' },
    { id: 'optiqo', type: 'app', title: 'optiqo', subtitle: 'Interactive holographic camera lens and optics lab simulator', targetAppId: 'optiqo' },
    { id: 'terminal', type: 'app', title: 'Terminal Console', subtitle: 'Execute raw keyboard commands', targetAppId: 'terminal' },
    { id: 'recycle', type: 'app', title: 'Recycle Bin', subtitle: 'Observe discarded drafts and failed projects', targetAppId: 'recycle' },

    // Custom Projects
    ...PROJECTS.map((proj) => ({
      id: proj.id,
      type: 'project' as const,
      title: proj.name,
      subtitle: `Project: ${proj.desc}`,
      targetAppId: proj.id
    })),

    // Custom Skills
    ...SKILLS.flatMap((cat) =>
      cat.items.map((skill) => ({
        id: `skill-${skill.toLowerCase().replace(/\s+/g, '-')}`,
        type: 'action' as const,
        title: `Skill: ${skill}`,
        subtitle: `Expertise in ${cat.category}`,
        targetAppId: 'resume' // Opens resume app
      }))
    )
  ];

  // Filtering results
  const filteredResults = searchPool.filter((item) => {
    const term = query.toLowerCase();
    return item.title.toLowerCase().includes(term) || item.subtitle.toLowerCase().includes(term);
  }).slice(0, 7);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev >= filteredResults.length - 1 ? 0 : prev + 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev <= 0 ? filteredResults.length - 1 : prev - 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredResults[selectedIndex]) {
          onSelectResult(filteredResults[selectedIndex].targetAppId);
        }
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredResults, selectedIndex, onClose, onSelectResult]);

  if (!isOpen) return null;

  return (
    <div
      id="search_modal_overlay"
      className="fixed inset-0 z-[1000] flex items-start justify-center pt-[15vh] px-4 bg-black/75 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={containerRef}
        className="w-full max-w-xl rounded-2xl bg-slate-900/90 border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10">
          <Search className="w-5 h-5 text-white/40 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            id="search_query_input"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Search projects, skills, documents... (or use Arrow keys & Enter)"
            className="w-full bg-transparent text-sm text-white/90 outline-none border-none focus:ring-0 p-0 placeholder-white/40"
            spellCheck={false}
          />
          <span className="text-[10px] font-mono bg-white/10 text-white/50 px-2 py-0.5 rounded uppercase select-none shrink-0">ESC</span>
        </div>

        {/* Results List */}
        <div className="max-h-[350px] overflow-y-auto p-2">
          {filteredResults.length > 0 ? (
            <div className="space-y-1">
              {filteredResults.map((item, index) => {
                const isSelected = index === selectedIndex;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onSelectResult(item.targetAppId)}
                    className={`w-full text-left p-3 rounded-xl flex items-center justify-between transition-all cursor-pointer ${isSelected
                      ? 'bg-emerald-500 text-slate-950 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                      : 'text-white/80 hover:bg-white/5'
                      }`}
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${isSelected ? 'bg-black/15 text-slate-950' : 'bg-slate-850 text-emerald-400'
                        }`}>
                        {item.type === 'app' && <Compass className="w-4 h-4" />}
                        {item.type === 'project' && <Cpu className="w-4 h-4" />}
                        {item.type === 'action' && <FileText className="w-4 h-4" />}
                      </div>
                      <div className="overflow-hidden">
                        <div className={`text-xs font-semibold tracking-tight ${isSelected ? 'text-slate-950' : 'text-white'}`}>
                          {item.title}
                        </div>
                        <div className={`text-[10px] truncate ${isSelected ? 'text-slate-950/70' : 'text-white/45'}`}>
                          {item.subtitle}
                        </div>
                      </div>
                    </div>

                    {isSelected && (
                      <div className="flex items-center gap-1 text-[10px] font-mono text-slate-900 shrink-0 font-medium">
                        <span>Open</span>
                        <CornerDownLeft className="w-3 h-3" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="p-8 text-center text-white/40 font-mono text-xs select-none">
              No index matches for "{query}" in imran OS modules.
            </div>
          )}
        </div>

        {/* Action guidelines footer */}
        <div className="px-4 py-2 bg-black/30 border-t border-white/5 text-[9px] text-white/30 font-mono flex items-center justify-between select-none">
          <span>🎯 Select App/Project & Press Enter to launch</span>
          <span className="flex items-center gap-1">
            <span>Query match results: {filteredResults.length}</span>
          </span>
        </div>
      </div>
    </div>
  );
}
