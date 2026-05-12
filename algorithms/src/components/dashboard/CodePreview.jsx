import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { 
  Triangle,
  BrainCircuit, 
  CheckCircle2, 
  Info, 
  AlertTriangle, 
  ChevronRight, 
  Database, 
  Loader2, 
  Sparkles,
  Maximize2
} from 'lucide-react';

export default function CodePreview({ code, onAnalyze, feedback = [] }) {
  const [editableCode, setEditableCode] = useState(code);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    setEditableCode(code);
  }, [code]);

  const handleAnalyze = async () => {
    if (!editableCode.trim()) return;
    setIsAnalyzing(true);
    try {
      await onAnalyze(editableCode);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getIconForType = (type) => {
    switch(type) {
      case 'success': return <CheckCircle2 size={16} className="text-emerald-500 mt-0.5" />;
      case 'warning': return <AlertTriangle size={16} className="text-amber-500 mt-0.5" />;
      default: return <Info size={16} className="text-blue-500 mt-0.5" />;
    }
  };

  return (
    <aside className="hidden xl:flex flex-col gap-5 overflow-y-auto custom-scrollbar pb-6 h-full">
      {/* 1. SOURCE EDITOR CARD */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/70 dark:border-slate-700 shadow-sm flex flex-col overflow-hidden shrink-0">
        <div className="px-5 py-3 border-b border-slate-100 dark:border-slate-700/50 flex justify-between items-center bg-white dark:bg-slate-800">
          <div className="flex items-center gap-2">
            <Triangle size={16} className="text-slate-500 fill-slate-500/20 rotate-90" />
            <span className="text-sm font-bold text-slate-700 dark:text-slate-200">Source Editor</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 border border-slate-200 rounded-md px-1 dark:border-slate-700">
              <select className="text-[0.7rem] bg-transparent text-slate-600 font-semibold px-1.5 py-1 outline-none cursor-pointer dark:text-slate-300">
                <option>Python</option>
                <option>JavaScript</option>
              </select>
            </div>
            <button className="p-1 border border-slate-200 rounded-md text-slate-500 hover:bg-slate-50 dark:border-slate-700 cursor-pointer">
              <Maximize2 size={14} />
            </button>
          </div>
        </div>
        
        <div className="bg-[#1a1c23] p-3">
          <div className="h-[260px] w-full rounded-xl overflow-hidden bg-[#1e1e2e] relative">
            <Editor
              height="260px"
              defaultLanguage="python"
              theme="vs-dark"
              value={editableCode}
              onChange={(val) => setEditableCode(val || '')}
              options={{
                minimap: { enabled: false },
                fontSize: 13,
                fontFamily: "'JetBrains Mono', monospace",
                lineHeight: 21,
                padding: { top: 16, bottom: 16 },
                scrollBeyondLastLine: false,
                automaticLayout: true,
                tabSize: 2,
                wordWrap: 'on',
                renderLineHighlight: 'all',
                hideCursorInOverviewRuler: true,
                overviewRulerBorder: false,
                bracketPairColorization: { enabled: true }
              }}
            />
          </div>
        </div>

        <div className="p-5 bg-white dark:bg-slate-800">
          <button 
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className={`w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm font-bold shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer ${isAnalyzing ? 'opacity-75 pointer-events-none' : ''}`}
          >
            {isAnalyzing ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} className="opacity-80" />}
            {isAnalyzing ? 'Processing Algorithm...' : 'Analyze Code'}
          </button>
        </div>
      </div>

      {/* 2. AI FEEDBACK CONSOLE */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200/70 dark:border-slate-700 shadow-sm flex flex-col overflow-hidden shrink-0 min-h-[200px]">
        <div className="px-5 py-3.5 border-b border-slate-100 dark:border-slate-700/50 bg-white dark:bg-slate-800 flex items-center gap-2">
          <BrainCircuit size={16} className="text-slate-500" />
          <span className="text-xs font-bold tracking-wide text-slate-700 dark:text-slate-200">AI Feedback Console</span>
        </div>
        
        <div className="p-4 flex flex-col gap-3">
          {feedback && feedback.length > 0 ? (
            feedback.map((item, idx) => (
              <div key={idx} className="flex gap-3 text-[0.75rem] leading-relaxed">
                {getIconForType(item.type)}
                <span className="text-slate-600 dark:text-slate-300 font-medium">{item.text}</span>
              </div>
            ))
          ) : (
            <div className="text-slate-400 text-[0.75rem] italic flex items-center gap-2 px-1 pt-2">
              <Info size={14} /> Run analyze to populate feedback logs.
            </div>
          )}

          <div className="mt-auto pt-3 border-t border-slate-100 dark:border-slate-700/50 flex justify-end">
            <button className="text-[0.7rem] font-bold text-blue-500 hover:text-blue-600 flex items-center gap-0.5 cursor-pointer">
              View Full Report <ChevronRight size={12} />
            </button>
          </div>
        </div>
      </div>

      {/* 3. INPUT GRAPH / TEST CASE */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200/70 dark:border-slate-700 shadow-sm p-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-blue-600 dark:text-blue-400 border border-slate-200/50 dark:border-slate-600">
            <Database size={18} />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-700 dark:text-slate-200">Test Case Configuration</div>
            <div className="text-[0.65rem] font-semibold text-slate-400 uppercase mt-0.5 tracking-wider">Elements: 12 | Mode: Random</div>
          </div>
        </div>
        <button className="text-[0.7rem] font-bold text-blue-500 hover:text-blue-600 cursor-pointer">
          Configure
        </button>
      </div>
    </aside>
  );
}
