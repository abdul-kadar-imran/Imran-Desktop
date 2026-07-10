/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipForward, CloudSun, Calendar, Quote, CheckSquare, Music, RefreshCw, Sparkles } from 'lucide-react';

// Quotes bank
const QUOTES = [
  { text: "Simplicity is the ultimate sophistication.", author: "Leonardo da Vinci" },
  { text: "Make it simple, but significant.", author: "Don Draper" },
  { text: "Design is not just what it looks like. Design is how it works.", author: "Steve Jobs" },
  { text: "Good design is as little design as possible.", author: "Dieter Rams" },
  { text: "Digital design is like painting, except the paint never dries.", author: "Neville Brody" }
];

// Music Playlist
const PLAYLIST = [
  { 
    title: "The Life of Ram", 
    artist: "Pradeep Kumar ('96')", 
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" 
  },
  { 
    title: "Synthetic Horizons", 
    artist: "M83 Resonance", 
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" 
  },
  { 
    title: "Midnight Code Logic", 
    artist: "Lofi Architect", 
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" 
  },
  { 
    title: "Ambient Workspace", 
    artist: "Subtle Depth", 
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3" 
  }
];

export function ClockWidget({ isCompact = false }: { isCompact?: boolean }) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const timeStr = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: isCompact ? undefined : '2-digit' });
  const dateStr = time.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });

  const hours = time.getHours();
  let greeting = "Good Evening 🌙";
  if (hours < 12) greeting = "Good Morning ☀️";
  else if (hours < 17) greeting = "Good Afternoon 🌤️";

  if (isCompact) {
    return (
      <div className="text-right select-none font-sans">
        <div className="text-sm font-semibold tracking-wide text-white/95">{timeStr}</div>
        <div className="text-[10px] text-white/60 tracking-wider uppercase font-mono">{dateStr}</div>
      </div>
    );
  }

  return (
    <div className="p-4 rounded-2xl bg-slate-950/40 border border-white/10 backdrop-blur-md select-none">
      <div className="text-xs font-mono text-white/40 mb-1">{greeting}</div>
      <div className="text-3xl font-light tracking-tight text-white">{timeStr}</div>
      <div className="text-xs font-medium text-white/70 mt-1 flex items-center gap-1">
        <Calendar className="w-3.5 h-3.5 text-emerald-400" />
        {dateStr}
      </div>
    </div>
  );
}

export function WeatherWidget({ isCompact = false }: { isCompact?: boolean }) {
  const [temp, setTemp] = useState(24);
  const [condition, setCondition] = useState('Sunny');

  useEffect(() => {
    // Dynamic simulated shift according to hour
    const hr = new Date().getHours();
    if (hr > 18 || hr < 6) {
      setTemp(18);
      setCondition('Clear');
    } else {
      setTemp(25 + Math.floor(Math.random() * 3));
      setCondition('Cloudy');
    }
  }, []);

  if (isCompact) {
    return (
      <div className="p-4 rounded-2xl bg-slate-950/40 border border-white/10 backdrop-blur-md select-none flex flex-col items-center justify-center text-center h-full">
        <CloudSun className="w-6 h-6 text-amber-400 animate-pulse mb-1.5" />
        <div className="text-xl font-bold tracking-tight text-white">{temp}°C</div>
        <div className="text-[9px] text-white/50 font-mono tracking-wider uppercase mt-1">{condition}</div>
      </div>
    );
  }

  return (
    <div className="p-4 rounded-2xl bg-slate-950/40 border border-white/10 backdrop-blur-md select-none flex items-center justify-between">
      <div>
        <div className="text-[10px] font-mono tracking-wider text-white/40 uppercase">Dev Environment</div>
        <div className="text-lg font-medium text-white/90">India</div>
        <div className="text-xs text-white/60 mt-0.5">{condition}</div>
      </div>
      <div className="text-right">
        <div className="flex items-center gap-1.5 justify-end">
          <CloudSun className="w-5 h-5 text-amber-400 animate-pulse" />
          <span className="text-2xl font-semibold tracking-tight text-white">{temp}°C</span>
        </div>
        <div className="text-[10px] text-white/40 font-mono mt-0.5">Wind: 8 mph</div>
      </div>
    </div>
  );
}

export function MusicWidget() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [trackIndex, setTrackIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState("0:00");
  const [durationStr, setDurationStr] = useState("3:00");
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const track = PLAYLIST[trackIndex];

  useEffect(() => {
    // Clean up previous audio instance
    if (audioRef.current) {
      audioRef.current.pause();
    }

    const audio = new Audio(track.url);
    audioRef.current = audio;
    setProgress(0);
    setCurrentTime("0:00");

    const onTimeUpdate = () => {
      if (audio.duration) {
        const prog = (audio.currentTime / audio.duration) * 100;
        setProgress(prog);

        const curMins = Math.floor(audio.currentTime / 60);
        const curSecs = Math.floor(audio.currentTime % 60);
        setCurrentTime(`${curMins}:${String(curSecs).padStart(2, '0')}`);
      }
    };

    const onLoadedMetadata = () => {
      if (audio.duration) {
        const durMins = Math.floor(audio.duration / 60);
        const durSecs = Math.floor(audio.duration % 60);
        setDurationStr(`${durMins}:${String(durSecs).padStart(2, '0')}`);
      }
    };

    const onEnded = () => {
      setIsPlaying(false);
      setTrackIndex((prev) => (prev + 1) % PLAYLIST.length);
    };

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('ended', onEnded);

    if (isPlaying) {
      audio.play().catch(e => console.log("Playback error: ", e));
    }

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('ended', onEnded);
      audio.pause();
    };
  }, [trackIndex]);

  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play().catch(e => {
        console.log("Playback blocked or interrupted: ", e);
        setIsPlaying(false);
      });
    } else {
      audioRef.current?.pause();
    }
  }, [isPlaying]);

  const togglePlay = () => setIsPlaying(!isPlaying);
  const skipTrack = () => {
    setTrackIndex((prev) => (prev + 1) % PLAYLIST.length);
  };

  return (
    <div className="p-4 rounded-2xl bg-slate-950/40 border border-white/10 backdrop-blur-md select-none">
      <div className="flex items-start justify-between">
        <div className="overflow-hidden pr-2">
          <div className="text-[10px] font-mono uppercase tracking-wider text-white/40 flex items-center gap-1">
            <Music className="w-3 h-3 text-fuchsia-400" /> Currently Playing
          </div>
          <div className="text-sm font-semibold tracking-tight text-white mt-1 truncate">{track.title}</div>
          <div className="text-[11px] text-white/60 truncate">{track.artist}</div>
        </div>
        <div className="flex gap-2 shrink-0">
          <button 
            type="button"
            id="play_button"
            onClick={togglePlay} 
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 flex items-center justify-center transition-all cursor-pointer"
          >
            {isPlaying ? <Pause className="w-4 h-4 text-emerald-400" /> : <Play className="w-4 h-4 text-white pl-0.5" />}
          </button>
          <button 
            type="button"
            id="skip_button"
            onClick={skipTrack} 
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 flex items-center justify-center transition-all cursor-pointer"
          >
            <SkipForward className="w-3.5 h-3.5 text-white/80" />
          </button>
        </div>
      </div>

      {/* Progress Track */}
      <div className="mt-3">
        <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
          <div className="h-full bg-emerald-400 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
        <div className="flex justify-between text-[9px] text-white/40 font-mono mt-1">
          <span>{currentTime}</span>
          <span>{durationStr}</span>
        </div>
      </div>

      {/* Real-time looking bar indicators */}
      {isPlaying && (
        <div className="flex items-end justify-center gap-0.5 mt-2 h-4">
          {[...Array(12)].map((_, i) => (
            <div 
              key={i} 
              className="w-0.5 bg-emerald-500 rounded-full animate-pulse" 
              style={{ 
                height: `${20 + Math.sin(i + progress * 0.5) * 80}%`,
                animationDelay: `${i * 0.1}s`,
                animationDuration: '0.8s'
              }} 
              id={`equalizer_bar_${i}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function GithubStatsWidget() {
  const [commits, setCommits] = useState(142);

  return (
    <div className="p-4 rounded-2xl bg-slate-950/40 border border-white/10 backdrop-blur-md select-none">
      <div className="flex items-center justify-between font-sans mb-1.5">
        <div>
          <div className="text-[10px] font-mono uppercase tracking-wider text-white/40">Contribution Grid</div>
          <div className="text-sm font-semibold text-white flex items-center gap-1 mt-0.5">
            <Sparkles className="w-3.5 h-3.5 text-yellow-400 animate-spin-slow" />
            GitHub Engine
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs font-mono font-semibold text-emerald-400">+{commits} commits</div>
          <div className="text-[9px] text-white/40 font-mono">last 30 days</div>
        </div>
      </div>

      {/* Simulated commit landscape grid */}
      <div className="grid gap-1 mt-2" style={{ gridTemplateColumns: 'repeat(15, minmax(0, 1fr))' }}>
        {[...Array(60)].map((_, i) => {
          // generate elegant green shades
          let bg = 'bg-slate-900/40 border border-white/5';
          if (i % 7 === 1) bg = 'bg-emerald-950/60 border border-emerald-900/40';
          else if (i % 5 === 2) bg = 'bg-emerald-800/60 border border-emerald-700/40';
          else if (i % 9 === 4) bg = 'bg-emerald-500/80 border border-emerald-400/30 shadow-[0_0_8px_rgba(16,185,129,0.3)]';
          else if (i % 11 === 0) bg = 'bg-emerald-400 border border-emerald-300 shadow-[0_0_12px_rgba(52,211,153,0.4)]';
          
          return (
            <div 
              key={i} 
              className={`w-2.5 h-2.5 rounded-sm transition-all duration-300 hover:scale-125 ${bg}`} 
              title={`${Math.floor(Math.random() * 8)} Commits`} 
            />
          );
        })}
      </div>
    </div>
  );
}

export function QuoteWidget() {
  const [index, setIndex] = useState(0);

  const rotateQuote = () => {
    setIndex((prev) => (prev + 1) % QUOTES.length);
  };

  const current = QUOTES[index];

  return (
    <div className="p-4 rounded-2xl bg-slate-950/40 border border-white/10 backdrop-blur-md select-none relative group">
      <div className="text-[10px] font-mono uppercase tracking-wider text-white/40 flex items-center justify-between">
        <span className="flex items-center gap-1">
          <Quote className="w-3 h-3 text-emerald-400" /> Quote of the Day
        </span>
        <button 
          type="button"
          id="rotate_quote_button"
          onClick={rotateQuote} 
          className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded hover:bg-white/10 cursor-pointer"
        >
          <RefreshCw className="w-3 h-3 text-white/70" />
        </button>
      </div>
      <div className="text-sm font-medium italic text-white/95 tracking-tight leading-relaxed mt-2 pr-2">
        "{current.text}"
      </div>
      <div className="text-[10px] text-emerald-400/90 font-mono tracking-wider mt-1.5 text-right font-medium">
        — {current.author}
      </div>
    </div>
  );
}
