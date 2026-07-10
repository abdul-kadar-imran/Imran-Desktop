/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { PROJECTS, SKILLS, ABOUT_TEXT, CERTIFICATES } from '../data';
import { TerminalLine } from '../types';

interface TerminalProps {
  onOpenApp?: (appId: string) => void;
  themeClass?: string;
}

export default function Terminal({ onOpenApp, themeClass = '' }: TerminalProps) {
  const [history, setHistory] = useState<TerminalLine[]>([
    {
      text: 'imran OS Kernel v2.4.0 Online.', type: 'success'
    },
    { text: "Type 'help' to check available terminal instructions.\n", type: 'output' },
  ]);
  const [inputVal, setInputVal] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  // Focus terminal input on container click
  const handleContainerClick = () => {
    inputRef.current?.focus();
  };

  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cmdClean = inputVal.trim();
    if (!cmdClean) return;

    const lowerCmd = cmdClean.toLowerCase();
    const args = lowerCmd.split(' ');
    const mainCommand = args[0];

    // Add input to history
    const newHistory: TerminalLine[] = [...history, { text: `Guest@ImranOS:~$ ${cmdClean}`, type: 'input' }];

    switch (mainCommand) {
      case 'clear':
        setHistory([]);
        setInputVal('');
        return;

      case 'help':
        newHistory.push({
          text: `Available instruction sets:
  about       - Get detailed biography of Imran
  projects    - Show modular design & engineering projects
  skills      - List structural technology proficiencies
  resume      - Display CV checkpoints & certifications
  optiqo      - Open the interactive holographic camera optics simulator
  open <name> - Fire the OS runtime to expand a workspace (e.g. 'open layerly')
  github      - Fetch Imran's GitHub code repository channel
  linkedin    - Fetch professional experience networking portal
  clear       - Wipe the terminal output buffer`,
          type: 'output',
        });
        break;

      case 'about':
      case 'me':
        newHistory.push({
          text: ABOUT_TEXT,
          type: 'success',
        });
        break;

      case 'projects':
      case 'apps':
        newHistory.push({
          text: `Active Portfolio Showcases:\n` +
            PROJECTS.map(p => `• [${p.name}] - ${p.desc}\n  Tech: ${p.tech.join(', ')}\n`).join('\n') +
            `\nUse 'open [project_id]' (e.g., 'open layerly') to launch project dashboard.`,
          type: 'success',
        });
        break;

      case 'skills':
      case 'tech': {
        const skillsText = SKILLS.map(cat =>
          `[${cat.category}]\n  ${cat.items.join('  •  ')}`
        ).join('\n\n');
        newHistory.push({ text: skillsText, type: 'output' });
        break;
      }

      case 'resume':
      case 'cv': {
        const resumeText = `Name: ABDULKADAR IMRAN\nRole: Senior Frontend Architect / Engineer
--------------------------------------------------
Exp 1: SDE - UI Framework Architect (2024 - Present)
   Constructed multi-threaded dashboard engines, canvas graphs, and complex OS portfolio designs.
Exp 2: SDE II - React Native Core (2022 - 2024)
   Authored hardware camera abstractions and offline token stores.

Certifications:\n` +
          CERTIFICATES.map(c => `• ${c.title} (${c.issuer}, ${c.year})`).join('\n');
        newHistory.push({ text: resumeText, type: 'output' });
        break;
      }

      case 'optiqo':
        newHistory.push({
          text: `optiqo Lens Studio:
  A holographic camera lens and depth-of-field simulator.
  Controls: Aperture, Focal Length, ISO Noising, Prism Filter.
  Run 'open optiqo' to launch the interactive canvas environment!`,
          type: 'success',
        });
        break;

      case 'contact':
        newHistory.push({
          text: `Channeled Comms Interface:
  Direct secure transit conduits to Abdulkadar Imran.
  Available channels: WhatsApp, Email, LinkedIn.
  Run 'open contact' to open the secure communications panel!`,
          type: 'success',
        });
        break;

      case 'github':
        newHistory.push({ text: 'Redirecting to GitHub: https://github.com/abdulkadarimran ...', type: 'success' });
        if (typeof window !== 'undefined') {
          setTimeout(() => {
            window.open('https://github.com/abdulkadarimran', '_blank');
          }, 800);
        }
        break;

      case 'linkedin':
        newHistory.push({ text: 'Redirecting to LinkedIn: https://linkedin.com/in/imran ...', type: 'success' });
        if (typeof window !== 'undefined') {
          setTimeout(() => {
            window.open('https://linkedin.com/in/imran', '_blank');
          }, 800);
        }
        break;

      case 'open':
      case 'run':
      case 'launch': {
        const target = args[1];
        if (!target) {
          newHistory.push({ text: 'Error: Please specify app or project name to open. E.g. "open layerly"', type: 'error' });
        } else {
          // Check if valid app or project
          const validIds = ['layerly', 'ethernote', 'qrnest', 'tstrike', 'keysmith', 'layoutlab', 'aboutme', 'resume', 'certificates', 'optiqo', 'contact', 'recycle'];
          if (validIds.includes(target) && onOpenApp) {
            newHistory.push({ text: `Initializing launch engine for: ${target}...`, type: 'success' });
            setTimeout(() => onOpenApp(target), 200);
          } else {
            newHistory.push({ text: `Error: App "${target}" not identified. Type "projects" to view available IDs.`, type: 'error' });
          }
        }
        break;
      }

      default:
        newHistory.push({
          text: `Command not found: "${mainCommand}". Type "help" or "projects" to query recognized operational arguments.`,
          type: 'error',
        });
        break;
    }

    setHistory(newHistory);
    setInputVal('');
  };

  return (
    <div
      id="terminal_container"
      onClick={handleContainerClick}
      className={`w-full h-full min-h-[250px] bg-black/90 p-4 font-mono text-xs overflow-y-auto flex flex-col cursor-text ${themeClass}`}
    >
      <div className="flex-1 space-y-2 whitespace-pre-wrap select-text leading-relaxed">
        {history.map((line, idx) => {
          let color = 'text-white/80';
          if (line.type === 'input') color = 'text-sky-400 font-semibold';
          else if (line.type === 'error') color = 'text-rose-400';
          else if (line.type === 'success') color = 'text-emerald-400';
          return (
            <div key={idx} className={color}>
              {line.text}
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleCommandSubmit} className="flex items-center gap-1.5 mt-3 shrink-0 select-none">
        <span className="text-sky-400 font-semibold">Guest@ImranOS:~$</span>
        <input
          ref={inputRef}
          type="text"
          id="terminal_input"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          className="flex-1 bg-transparent border-none outline-none text-emerald-400 font-semibold caret-emerald-400 focus:ring-0 p-0"
          autoFocus
          autoComplete="off"
          spellCheck={false}
        />
      </form>
    </div>
  );
}
