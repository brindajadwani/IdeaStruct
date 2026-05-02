import React from 'react';
import { useMapStore } from '../store/useMapStore';
import { ArrowRight } from 'lucide-react';

export const QuestionsPanel: React.FC = () => {
  const { questions, answers, setAnswer, setPhase, phase } = useMapStore();

  const isActive = phase === 'Clarify';

  const handleNext = () => {
    setPhase('Agent');
  };

  // Only render the wrapper if there are questions or we are in Clarify phase
  if (questions.length === 0 && !isActive) return null;

  return (
    <div className={`relative rounded-2xl bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-500 p-[2px] shadow-[0_0_25px_rgba(45,212,191,0.3)] transition-all duration-500 ${!isActive ? 'opacity-70 grayscale-[30%]' : 'animate-in slide-in-from-top-4'}`}>
      <div className="bg-slate-900/80 backdrop-blur-xl rounded-[14px] p-5 h-full flex flex-col gap-4">
        <h2 className="text-sm font-bold uppercase text-white tracking-wider">
          STEP 2: CLARIFY IDEAS
        </h2>
        <p className="text-xs text-slate-300 font-medium">
          System-generated clarification questions based on the input.
        </p>
        
        <div className="space-y-3">
          {questions.map((q, index) => (
            <div key={q.id} className="bg-slate-200/95 backdrop-blur-sm rounded-xl p-3 shadow-inner">
              <label className="block text-sm font-bold text-slate-800 mb-2">
                Q{index + 1}: {q.text}
              </label>
              <input
                type="text"
                className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all shadow-sm"
                placeholder="Type your answer..."
                value={answers[q.id] || ''}
                onChange={(e) => setAnswer(q.id, e.target.value)}
                disabled={!isActive}
              />
            </div>
          ))}
        </div>

        <button
          onClick={handleNext}
          disabled={!isActive}
          className="self-end px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 disabled:opacity-50 text-white text-sm font-bold rounded-full flex items-center gap-2 transition-all shadow-lg border border-emerald-400/50 uppercase tracking-wider mt-2 cursor-pointer"
        >
          Refine & Generate Map <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
