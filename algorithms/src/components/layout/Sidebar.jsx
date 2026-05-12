import React from 'react';
import { Layers, ChevronRight, Cpu } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { ALGORITHMS } from '../../data/algorithms';

export default function Sidebar() {
  return (
    <aside className="flex flex-col gap-6 overflow-y-auto custom-scrollbar hidden md:flex">
      <div className="glass-panel p-5 h-full flex flex-col overflow-hidden">
        <div className="text-xs font-bold tracking-wider uppercase text-text-secondary flex items-center gap-2 mb-4">
          <Layers size={16} />
          Libraries
        </div>
        <ul className="list-none p-0 m-0 flex flex-col gap-2 overflow-y-auto custom-scrollbar pr-1">
          {ALGORITHMS.map(algo => (
            <li key={algo.id}>
              <NavLink 
                to={`/algo/${algo.slug}`} 
                className={({ isActive }) => 
                  `block no-underline p-3 rounded-xl transition-all duration-200 border cursor-pointer ${
                    isActive 
                      ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-600 dark:text-cyan-400' 
                      : 'bg-transparent border-transparent hover:bg-black/5 dark:hover:bg-white/5 text-text-secondary hover:text-text-primary'
                  }`
                }
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium text-[0.9rem]">{algo.name}</span>
                  <ChevronRight size={14} className="opacity-50" />
                </div>
                <div className="text-[0.7rem] opacity-60 mt-0.5 uppercase font-semibold">{algo.category}</div>
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
      

    </aside>
  );
}
