import React from 'react';
import { useMapStore } from '../store/useMapStore';
import { apiClient } from '../api/client';
import { Sparkles, Loader2 } from 'lucide-react';

export const IdeaInput: React.FC = () => {
  const { rawIdeas, setRawIdeas, setQuestions, setPhase, isClassifying, setIsClassifying, phase } = useMapStore();

  const isActive = phase === 'Ideas';

  const handleClassify = async () => {
    if (!rawIdeas.trim()) return;
    
    setIsClassifying(true);
    try {
      const response = await apiClient.post('/classify', { ideas: rawIdeas });
      setQuestions(response.data.questions);
      setPhase('Clarify');
    } catch (error) {
      console.error("Classification failed:", error);
      setQuestions([
        { id: 'q1', text: 'What specific dates are you looking to travel?', type: 'text' },
        { id: 'q2', text: 'Do you have preference for accommodation?', type: 'text' },
        { id: 'q3', text: 'Are there any must-see landmarks?', type: 'text' }
      ]);
      setPhase('Clarify');
    } finally {
      setIsClassifying(false);
    }
  };

  return (
    <div className={`relative rounded-2xl bg-gradient-to-br from-cyan-400 via-indigo-500 to-purple-500 p-[2px] shadow-[0_0_25px_rgba(99,102,241,0.3)] transition-all duration-500 ${!isActive ? 'opacity-70 grayscale-[30%]' : ''}`}>
      <div className="bg-slate-900/80 backdrop-blur-xl rounded-[14px] p-5 h-full flex flex-col gap-3">
        <h2 className="text-sm font-bold uppercase text-white tracking-wider flex items-center gap-2">
          STEP 1: CAPTURE THOUGHTS
        </h2>
        
        <textarea
          className="w-full h-40 bg-white/5 border border-white/20 rounded-xl p-4 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-all resize-none placeholder:text-slate-500"
          placeholder="Type your raw, unstructured thoughts here..."
          value={rawIdeas}
          onChange={(e) => setRawIdeas(e.target.value)}
          disabled={!isActive}
        />
        
        <button
          onClick={handleClassify}
          disabled={!rawIdeas.trim() || isClassifying || !isActive}
          className="self-end px-5 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:opacity-50 text-white text-sm font-bold rounded-full flex items-center gap-2 transition-all shadow-lg border border-cyan-400/30 uppercase tracking-wider cursor-pointer"
        >
          {isClassifying ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          {isClassifying ? 'Generating...' : 'Generate Questions'}
        </button>
      </div>
    </div>
  );
};
