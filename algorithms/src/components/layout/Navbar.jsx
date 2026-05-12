import React, { useState, useEffect, useRef } from 'react';
import { Activity, Moon, Sun, Search, BookOpen, BarChart3, UserCircle2, ChevronDown, Globe } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ALGORITHMS } from '../../data/algorithms';

export default function Navbar() {
  const navigate = useNavigate();
  const { algoSlug } = useParams();
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem('theme') === 'dark' || 
      (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });
  
  const [showDropdown, setShowDropdown] = useState(false);
  const dropRef = useRef(null);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  // Handle click-outside to close dropdown
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropRef.current && !dropRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (slug) => {
    navigate(`/algo/${slug}`);
    setShowDropdown(false);
  };

  return (
    <header className="flex items-center justify-between px-6 py-3 border-b border-slate-200/70 bg-white/90 backdrop-blur-md sticky top-0 z-50 dark:bg-slate-900/90 dark:border-slate-800">
      <div className="flex items-center gap-8">
        <Link to="/" className="no-underline text-inherit">
          <div className="flex items-center gap-2.5 text-lg font-extrabold tracking-tight text-slate-800 dark:text-white">
            <Activity size={22} className="text-blue-600" />
            <span>ALGO<span className="text-indigo-600">ANALYST</span></span>
          </div>
        </Link>

        {/* DYNAMIC ALGORITHM SELECTOR */}
        <div className="hidden md:block relative" ref={dropRef}>
          <button 
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-2.5 px-4 py-1.5 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/80 rounded-full text-sm font-semibold text-slate-600 dark:text-slate-300 transition-all cursor-pointer"
          >
            <Globe size={14} className="text-indigo-500" />
            Browse Algorithms
            <ChevronDown size={14} className={`transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
          </button>

          {showDropdown && (
            <div className="absolute left-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-100 dark:border-slate-700 overflow-hidden py-2 z-[100] animate-in fade-in slide-in-from-top-1 duration-100">
              <div className="px-3 py-1 text-[0.65rem] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-50 dark:border-slate-700/50 mb-1">
                Standard Library
              </div>
              {ALGORITHMS.map(algo => (
                <button 
                  key={algo.slug}
                  onClick={() => handleSelect(algo.slug)}
                  className="w-full text-left px-4 py-2.5 text-sm hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 font-medium flex flex-col transition-colors cursor-pointer"
                >
                  <span>{algo.name}</span>
                  <span className="text-[0.65rem] text-slate-400">{algo.complexity} | {algo.category}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <div className="flex items-center gap-1">
        <button className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer">
          <Search size={19} />
        </button>
        
        <button 
          onClick={() => setIsDark(!isDark)}
          className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
          aria-label="Toggle Theme"
        >
          {isDark ? <Sun size={19} /> : <Moon size={19} />}
        </button>

        <button className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer">
          <BookOpen size={19} />
        </button>

        <button className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer mr-2">
          <BarChart3 size={19} />
        </button>

        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold shadow-sm cursor-pointer hover:brightness-110 transition-all border border-blue-600/20">
          A
        </div>
      </div>
    </header>
  );
}
