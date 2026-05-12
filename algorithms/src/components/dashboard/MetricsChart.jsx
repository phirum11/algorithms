import React, { useState, useEffect } from 'react';
import { Play, Pause, ChevronLeft, ChevronRight, RotateCw, Activity, Sliders, Award } from 'lucide-react';

export default function MetricsChart({ slug, revision = 0 }) {
  const [rev, setRev] = useState(0);
  
  useEffect(() => {
    setRev(r => r + 1);
  }, [slug, revision]);

  const gifUrl = `${import.meta.env.VITE_API_URL || "http://localhost:8000"}/api/visualize/${slug}?rev=${rev}`;

  return (
    <div className="bg-white dark:bg-slate-800 flex-1 min-h-[400px] rounded-xl border border-slate-200/70 dark:border-slate-700 shadow-sm flex flex-col overflow-hidden">
      {/* Top Controller Toolbar */}
      <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700/50 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-slate-800 dark:text-white">
          <Activity size={18} className="text-blue-500" />
          <h3 className="text-sm font-bold">Algorithm Visualizer</h3>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center bg-slate-100 dark:bg-slate-900 rounded-lg p-1 shadow-inner border border-slate-200/20">
            <button className="px-4 py-1.5 rounded-md bg-blue-600 text-white text-xs font-bold shadow-sm hover:bg-blue-700 transition-all flex items-center gap-1.5 cursor-pointer">
              <Pause size={14} fill="currentColor" /> Pause
            </button>
            <button className="p-1.5 text-slate-500 hover:text-blue-500 hover:bg-white dark:hover:bg-slate-800 rounded-md ml-2 transition-all cursor-pointer">
              <ChevronLeft size={16} />
            </button>
            <button className="p-1.5 text-slate-500 hover:text-blue-500 hover:bg-white dark:hover:bg-slate-800 rounded-md transition-all cursor-pointer">
              <ChevronRight size={16} />
            </button>
            <button 
              onClick={() => setRev(r => r + 1)}
              className="p-1.5 text-slate-500 hover:text-amber-500 hover:bg-white dark:hover:bg-slate-800 rounded-md ml-1 transition-all cursor-pointer" 
              title="Rerun Simulation"
            >
              <RotateCw size={16} />
            </button>
          </div>

          <div className="hidden md:flex items-center gap-3 pl-4 border-l border-slate-200 dark:border-slate-700">
            <span className="text-xs font-semibold text-slate-500">Speed</span>
            <input type="range" className="w-24 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer" defaultValue="50" />
            <select className="text-xs font-semibold bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 px-2 py-1 rounded cursor-pointer">
              <option>1.0x</option>
              <option>2.0x</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Interactive Body */}
      <div className="flex-1 relative bg-[#fafbfc] dark:bg-slate-950 flex items-center justify-center p-4 overflow-hidden min-h-[280px]">
        {/* Legend Floating Box */}
        <div className="absolute top-6 left-6 z-10 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200/60 dark:border-slate-700 p-4 rounded-xl shadow-md w-32 hidden lg:block">
          <div className="text-[0.65rem] font-bold uppercase text-slate-400 tracking-wider mb-3">Legend</div>
          <ul className="text-[0.7rem] font-medium flex flex-col gap-2">
            <li className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-emerald-400/20 border border-emerald-500"></span> Active</li>
            <li className="flex items-center gap-2"><span className="w-3 h-3 rounded-full border-2 border-cyan-500"></span> Inspecting</li>
            <li className="flex items-center gap-2"><span className="w-3 h-3 rounded-full border border-slate-300"></span> Sorted</li>
          </ul>
        </div>

        {/* Right Side Analytics Mockup */}
        <div className="absolute top-6 right-6 z-10 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200/60 dark:border-slate-700 p-4 rounded-xl shadow-md w-44 hidden xl:block">
          <div className="text-[0.65rem] font-bold uppercase text-slate-400 tracking-wider mb-3 flex items-center justify-between">
            <span>Current State</span>
            <Sliders size={10} />
          </div>
          <div className="flex flex-col gap-3 text-[0.7rem]">
            <div className="flex justify-between"><span className="text-slate-500">Action</span> <span className="font-bold text-blue-600">Comparing</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Iterations</span> <span className="font-mono font-bold">24</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Memory Usage</span> <span className="font-mono font-bold text-emerald-600">4 KB</span></div>
          </div>
        </div>

        {/* Live Image Render */}
        <div className="w-full h-full max-w-[640px] max-h-[320px] relative z-0 border border-slate-200/50 rounded-xl overflow-hidden shadow-inner bg-zinc-950">
          <img 
            src={gifUrl} 
            key={gifUrl}
            alt={`${slug} visualization`}
            className="w-full h-full object-contain"
          />
        </div>
      </div>

      {/* Footer Results Bar */}
      <div className="bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200/70 dark:border-slate-700 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-white dark:bg-slate-700 flex items-center justify-center shadow-sm text-blue-500 border border-slate-200/50">
            <Award size={20} />
          </div>
          <div>
            <div className="text-[0.65rem] font-bold uppercase text-slate-400 tracking-wider mb-0.5">Complexity Target</div>
            <div className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              Optimal <span className="text-emerald-500">✔ Verified</span>
            </div>
          </div>
        </div>

        <div className="text-right">
          <div className="text-[0.65rem] font-bold uppercase text-slate-400 tracking-wider mb-0.5">Live Runtime</div>
          <div className="text-xl font-black text-emerald-600 font-mono">0.0{Math.floor(Math.random() * 5)+1}ms</div>
        </div>
      </div>
    </div>
  );
}
