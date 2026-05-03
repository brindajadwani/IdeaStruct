import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useMapStore, type Phase } from './store/useMapStore';
import { IdeaInput } from './components/IdeaInput';
import { QuestionsPanel } from './components/QuestionsPanel';
import {
  BrainCircuit,
  FolderOpen,
  Clock,
  Lightbulb,
  Plus,
  Bell,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Layout,
  Download,
  ChevronDown
} from 'lucide-react';

function App() {
  const [health, setHealth] = useState<{ status: string; message: string } | null>(null);
  const phase = useMapStore((state) => state.phase);

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const response = await axios.get('http://localhost:8000/health');
        setHealth(response.data);
      } catch (err) {
        console.error(err);
      }
    };
    checkHealth();
  }, []);

  return (
    <div className="flex h-screen w-full font-sans text-slate-100 bg-slate-900 bg-[url('https://images.unsplash.com/photo-1514565131-fce0801e5785?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center overflow-hidden selection:bg-cyan-500/30">
      {/* Dark Overlay for better contrast */}
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[3px]"></div>

      {/* Sidebar */}
      <div className="relative w-[260px] flex-shrink-0 bg-slate-900/80 backdrop-blur-2xl border-r border-white/10 flex flex-col z-10 shadow-2xl">
        <div className="p-6 flex items-center gap-3">
          <BrainCircuit className="w-8 h-8 text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
          <h1 className="text-xl font-bold tracking-wide text-white">IdeaStruct</h1>
        </div>

        <div className="flex-1 px-4 py-2 flex flex-col gap-2">
          <div className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl cursor-pointer transition-colors">
            <FolderOpen className="w-5 h-5" />
            <span className="font-medium text-sm">Projects</span>
          </div>
          <div className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl cursor-pointer transition-colors">
            <Clock className="w-5 h-5" />
            <span className="font-medium text-sm">Recents</span>
          </div>
          <div className="flex items-center gap-3 px-4 py-3 text-white bg-white/10 rounded-xl cursor-pointer shadow-inner border border-white/5">
            <Lightbulb className="w-5 h-5 text-cyan-400" />
            <span className="font-medium text-sm">Brainstorming Hub</span>
          </div>

          <button className="mt-4 flex items-center justify-center gap-2 px-4 py-3 bg-slate-700/50 hover:bg-slate-700/80 border border-slate-600/50 text-white rounded-xl text-sm font-bold tracking-wide transition-colors shadow-lg cursor-pointer">
            Create New Map
          </button>
        </div>

        {/* Bottom Sidebar - Health Status */}
        <div className="p-6 mt-auto">
          <div className="flex items-center gap-2 text-xs font-medium px-3 py-2 rounded-lg bg-black/30 border border-white/5">
            <div className={`w-2 h-2 rounded-full ${health ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]' : 'bg-rose-500 animate-pulse'}`}></div>
            <span className="text-slate-300">
              {health ? 'API Connected' : 'API Offline'}
            </span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="relative flex-1 flex flex-col z-10 p-6 overflow-hidden">

        {/* Top Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold tracking-wide text-white drop-shadow-md">Input Area</h2>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3 bg-black/20 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full shadow-lg">
              <span className="text-sm font-medium text-slate-300">Map Theme:</span>
              <button className="flex items-center gap-1 text-sm font-bold text-cyan-300 bg-cyan-500/10 px-3 py-1 rounded-full cursor-pointer">
                Glass <ChevronDown className="w-4 h-4 ml-1" />
              </button>
              <button className="text-sm font-medium text-slate-400 hover:text-white cursor-pointer transition-colors">Woven</button>
              <button className="text-sm font-medium text-slate-400 hover:text-white cursor-pointer transition-colors">Classic</button>
            </div>

            {/* Top Right Profile (mock) */}
            <div className="flex items-center gap-4">
              <Bell className="w-5 h-5 text-slate-300 hover:text-white cursor-pointer transition-colors" />
              <div className="flex items-center gap-2 cursor-pointer bg-black/20 backdrop-blur-md border border-white/10 rounded-full pl-1 pr-4 py-1">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-sm font-bold">U</div>
                <span className="text-sm font-medium">Profile</span>
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Columns Container */}
        <div className="flex flex-1 gap-6 overflow-hidden">

          {/* Left Column (Input & Clarify) */}
          <div className="w-[450px] flex flex-col gap-6 overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent pr-2 pb-10">
            <IdeaInput />
            <QuestionsPanel />
          </div>

          {/* Right Column (Canvas) */}
          <div className="flex-1 bg-slate-50/90 backdrop-blur-2xl rounded-2xl border border-white/40 p-5 shadow-2xl flex flex-col transition-all duration-500">

            {/* Canvas Header & Toolbar */}
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xs font-bold uppercase text-slate-500 tracking-widest mb-1">STEP 3: YOUR STRUCTURED MAP</h2>
                <h3 className="text-2xl font-black text-slate-800">
                  {phase === 'Agent' || phase === 'Done' ? 'Map Generation in Progress...' : 'Waiting for Input...'}
                </h3>
              </div>

              {/* Toolbar Icons matching image */}
              <div className="flex gap-4">
                <button className="flex flex-col items-center gap-1 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer">
                  <ZoomIn className="w-5 h-5" />
                  <span className="text-[10px] font-bold">Zoom In</span>
                </button>
                <button className="flex flex-col items-center gap-1 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer">
                  <ZoomOut className="w-5 h-5" />
                  <span className="text-[10px] font-bold">Zoom Out</span>
                </button>
                <button className="flex flex-col items-center gap-1 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer">
                  <RotateCcw className="w-5 h-5" />
                  <span className="text-[10px] font-bold">Reset</span>
                </button>
                <button className="flex flex-col items-center gap-1 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer">
                  <Layout className="w-5 h-5" />
                  <span className="text-[10px] font-bold">Auto-Layout</span>
                </button>
                <button className="flex flex-col items-center gap-1 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer">
                  <Download className="w-5 h-5" />
                  <span className="text-[10px] font-bold">Export</span>
                </button>
              </div>
            </div>

            {/* Canvas Placeholder & Agent Log UI */}
            <div className="flex-1 relative rounded-xl bg-white/60 border border-slate-200/60 shadow-inner flex flex-col items-center justify-center overflow-hidden p-6">

              {phase === 'Agent' || phase === 'Done' ? (
                <div className="w-full max-w-2xl flex flex-col h-full bg-slate-900/90 backdrop-blur-md rounded-2xl border border-slate-700 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
                  <div className="p-4 border-b border-slate-700 bg-slate-800/50 flex justify-between items-center">
                    <div className="flex items-center gap-2 text-indigo-300">
                      <BrainCircuit className={`w-5 h-5 ${phase === 'Agent' ? 'animate-spin' : ''}`} />
                      <span className="font-bold text-sm tracking-wider uppercase">
                        {phase === 'Agent' ? 'Agentic ReAct Loop Running' : 'Generation Complete'}
                      </span>
                    </div>
                    {phase === 'Done' && (
                      <div className="px-3 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-1">
                        Score: {useMapStore.getState().score}/100
                      </div>
                    )}
                  </div>

                  {/* Log Stream */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                    {useMapStore.getState().logs.map((log, i) => (
                      <div key={i} className="flex flex-col animate-in slide-in-from-right-4 fade-in">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">
                          {log.type}
                        </span>
                        <div className={`p-3 rounded-lg border text-sm shadow-sm ${
                          log.type === 'reasoner' ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-100' :
                          log.type === 'generator' ? 'bg-cyan-500/10 border-cyan-500/20 text-cyan-100' :
                          log.type === 'tester' ? 'bg-fuchsia-500/10 border-fuchsia-500/20 text-fuchsia-100' :
                          'bg-slate-800 border-slate-700 text-slate-300'
                        }`}>
                          {log.message}
                        </div>
                      </div>
                    ))}
                    {phase === 'Agent' && (
                      <div className="flex gap-1 items-center p-2 text-slate-500">
                        <div className="w-2 h-2 bg-indigo-500 rounded-full animate-ping"></div>
                        <span className="text-xs italic ml-2">Waiting for next action...</span>
                      </div>
                    )}
                  </div>

                  {/* Final Evaluation Feedback */}
                  {phase === 'Done' && (
                     <div className="p-4 bg-slate-800/80 border-t border-slate-700">
                       <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Tester Final Feedback</h4>
                       <p className="text-sm text-slate-200">{useMapStore.getState().feedback}</p>
                       <div className="mt-4 p-3 bg-black/40 border border-white/5 rounded-lg">
                         <pre className="text-[10px] text-emerald-400 font-mono overflow-hidden truncate">
                            {JSON.stringify(useMapStore.getState().finalMap, null, 2).substring(0, 200)}...
                         </pre>
                         <p className="text-xs text-slate-500 mt-2 text-center">Interactive Canvas coming in Iteration 4!</p>
                       </div>
                     </div>
                  )}
                </div>
              ) : (
                <div className="text-center opacity-30">
                  <BrainCircuit className="w-32 h-32 text-slate-400 mx-auto mb-6" />
                  <p className="text-slate-500 font-bold text-xl tracking-wide uppercase">Interactive Canvas Area</p>
                </div>
              )}

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default App;
