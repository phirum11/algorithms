import React, { useMemo } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ALGORITHMS } from '../data/algorithms';
import MetricsChart from '../components/dashboard/MetricsChart';
import CodePreview from '../components/dashboard/CodePreview';
import { analyzeAlgorithm, generateAiImage } from '../services/gemini';
import heroBgDefault from '../assets/hero-bg.png';

import { Clock, Box, ShieldCheck, Target, Sparkles, Loader2 } from 'lucide-react';

export default function AlgoDetail() {
  const { algoSlug } = useParams();
  const [customData, setCustomData] = React.useState(null);
  const [revision, setRevision] = React.useState(0);
  const [heroBgUrl, setHeroBgUrl] = React.useState(heroBgDefault);
  const [isGenerating, setIsGenerating] = React.useState(false);
  
  // Reset custom data and background when user switches preset algorithm
  React.useEffect(() => {
    setCustomData(null);
    setRevision(r => r + 1);
    setHeroBgUrl(heroBgDefault); // Reset to original default
  }, [algoSlug]);

  const baseAlgo = useMemo(() => {
    return ALGORITHMS.find(a => a.slug === algoSlug) || ALGORITHMS[0];
  }, [algoSlug]);

  const selectedAlgo = customData || baseAlgo;

  const handleAnalyze = async (code) => {
    const result = await analyzeAlgorithm(code);
    setCustomData({
      ...baseAlgo,
      ...result,
      slug: result.visualizer_type || baseAlgo.slug,
      code
    });
    setRevision(r => r + 1);
  };

  const handleGenerateBackground = async () => {
    if (isGenerating) return;
    setIsGenerating(true);
    try {
      const prompt = `Dynamic network nodes, cyberpunk glowing lines, connection graph visualization representing ${selectedAlgo.name}, 4k abstract high-tech web background, blue theme`;
      const newUrl = await generateAiImage(prompt);
      setHeroBgUrl(newUrl);
    } catch (err) {
      alert("AI Generation is currently offline. Ensure ComfyUI is running on 127.0.0.1:8188.");
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <>
      <section className="flex flex-col gap-5 overflow-y-auto custom-scrollbar pb-10 pr-1">
        {/* TOP BANNER CARD */}
        <div 
          key={selectedAlgo.name}
          className="relative h-[140px] rounded-2xl bg-slate-900 dark:bg-slate-900 flex items-center px-8 shadow-sm border border-slate-800 overflow-hidden group flex-shrink-0"
          style={{ position: 'relative' }}
        >
          <div 
            className="absolute inset-0 opacity-40 bg-cover bg-center mix-blend-screen pointer-events-none z-0 transition-opacity duration-500" 
            style={{ backgroundImage: `url(${heroBgUrl})`, position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/70 to-transparent z-10"></div>
          
          <div className="relative z-20 flex w-full items-center justify-between gap-5">
            <div className="flex items-center gap-5">
              <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50 text-cyan-400">
                <Target size={28} />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white tracking-tight mb-1">{selectedAlgo.name}</h1>
                <p className="text-sm text-slate-300/90 max-w-xl line-clamp-2 leading-relaxed">{selectedAlgo.desc}</p>
              </div>
            </div>

            <button 
              onClick={handleGenerateBackground}
              disabled={isGenerating}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600/80 hover:bg-indigo-500 text-white rounded-lg border border-indigo-500/50 text-xs font-semibold shadow-sm transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 backdrop-blur-sm"
            >
              {isGenerating ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Sparkles size={14} />
              )}
              {isGenerating ? "Generating AI..." : "Gen-AI Theme"}
            </button>
          </div>
        </div>

        {/* 4-CARD STATS ROW */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200/70 dark:border-slate-700 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-500 flex-shrink-0">
              <Clock size={22} />
            </div>
            <div>
              <div className="text-[0.65rem] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Time Complexity</div>
              <div className="text-xl font-bold text-blue-600 dark:text-blue-400 leading-tight">{selectedAlgo.complexity}</div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200/70 dark:border-slate-700 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-full bg-cyan-50 dark:bg-cyan-900/20 flex items-center justify-center text-cyan-500 flex-shrink-0">
              <Box size={22} />
            </div>
            <div>
              <div className="text-[0.65rem] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Space Complexity</div>
              <div className="text-xl font-bold text-slate-800 dark:text-slate-200 leading-tight">{selectedAlgo.space}</div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200/70 dark:border-slate-700 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-500 flex-shrink-0">
              <ShieldCheck size={22} />
            </div>
            <div>
              <div className="text-[0.65rem] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Safety Status</div>
              <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400 leading-tight">{selectedAlgo.status}</div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200/70 dark:border-slate-700 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-full bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-500 flex-shrink-0">
              <Target size={22} />
            </div>
            <div>
              <div className="text-[0.65rem] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Best Use Case</div>
              <div className="text-[0.8rem] leading-snug font-medium text-slate-600 dark:text-slate-400 mt-0.5 line-clamp-2">
                {selectedAlgo.best_case || 'General execution environments.'}
              </div>
            </div>
          </div>
        </div>

        {/* MAIN VISUALIZER WINDOW */}
        <MetricsChart slug={selectedAlgo.slug} revision={revision} />
      </section>

      <CodePreview code={selectedAlgo.code} onAnalyze={handleAnalyze} feedback={selectedAlgo.feedback} />
    </>
  );
}
