import React from 'react';
import { useMapStore } from '../store/useMapStore';
import { ArrowRight } from 'lucide-react';

export const QuestionsPanel: React.FC = () => {
  const { questions, answers, setAnswer, setPhase, phase } = useMapStore();

  const isActive = phase === 'Clarify';

  const handleNext = async () => {
    setPhase('Agent');
    const { rawIdeas, answers, addLog, setGenerationResult, clearLogs } = useMapStore.getState();
    clearLogs();

    try {
      const response = await fetch('http://localhost:8000/api/generate/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ raw_ideas: rawIdeas, user_answers: answers }),
      });

      if (!response.body) throw new Error("No readable stream");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        buffer += decoder.decode(value, { stream: true });
        const parts = buffer.split('\r\n\r\n');
        buffer = parts.pop() || ''; // keep the last incomplete chunk

        for (const block of parts) {
          const lines = block.split('\r\n');
          let eventType = 'message';
          let data = '';

          for (const line of lines) {
            if (line.startsWith('event: ')) eventType = line.substring(7);
            if (line.startsWith('data: ')) data = line.substring(6);
          }

          if (data) {
            if (eventType === 'log') {
              addLog(JSON.parse(data));
            } else if (eventType === 'complete') {
              const res = JSON.parse(data);
              if (res.needs_clarification && res.clarification_question) {
                const store = useMapStore.getState();
                store.setQuestions([
                  ...store.questions,
                  { id: `clarify_${Date.now()}`, text: `AMBIGUITY DETECTED: ${res.clarification_question}`, type: 'text' }
                ]);
                store.setPhase('Clarify');
              } else {
                setGenerationResult(res.map, res.score, res.feedback);
                useMapStore.getState().setPhase('Done');
              }
            } else if (eventType === 'error') {
              console.error("Generator error:", data);
            }
          }
        }
      }
    } catch (e) {
      console.error("Failed to generate map:", e);
    }
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
              <label className="block text-sm font-bold text-slate-800 mb-3">
                Q{index + 1}: {q.text}
              </label>

              {q.type === 'mcq' && q.options ? (
                <div className="flex flex-wrap gap-2 mb-1">
                  {q.options.map((opt) => {
                    const isSelected = answers[q.id] === opt;
                    return (
                      <button
                        key={opt}
                        onClick={() => setAnswer(q.id, opt)}
                        disabled={!isActive}
                        className={`text-sm px-4 py-2 rounded-full border transition-all duration-300 cursor-pointer ${isSelected
                          ? 'bg-gradient-to-r from-teal-500 to-emerald-500 text-white border-transparent shadow-md shadow-teal-500/30'
                          : 'bg-white text-slate-700 border-slate-300 hover:border-teal-400 hover:bg-teal-50'
                          }`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <textarea
                  className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all shadow-sm resize-none"
                  placeholder="Type your answer..."
                  rows={2}
                  value={answers[q.id] || ''}
                  onChange={(e) => setAnswer(q.id, e.target.value)}
                  disabled={!isActive}
                />
              )}
            </div>
          ))}

          {/* Global Other Answer / Additional Context at the bottom */}
          <div className="bg-slate-200/95 backdrop-blur-sm rounded-xl p-3 shadow-inner">
            <label className="block text-sm font-bold text-slate-800 mb-2">
              Other Answers / Additional Context
            </label>
            <textarea
              className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all shadow-sm resize-none"
              placeholder="Type any other answers or context here..."
              rows={2}
              value={answers['additional_context'] || ''}
              onChange={(e) => setAnswer('additional_context', e.target.value)}
              disabled={!isActive}
            />
          </div>
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
