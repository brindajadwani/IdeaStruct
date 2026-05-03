import { create } from 'zustand';

export type Phase = 'Ideas' | 'Clarify' | 'Agent' | 'Done';

export interface Question {
  id: string;
  text: string;
  type: string;
  options?: string[];
}

export interface LogEntry {
  type: string;
  message: string;
}

interface MapState {
  phase: Phase;
  rawIdeas: string;
  questions: Question[];
  answers: Record<string, string>;
  isClassifying: boolean;
  logs: LogEntry[];
  finalMap: any | null;
  score: number;
  feedback: string;
  setPhase: (phase: Phase) => void;
  setRawIdeas: (ideas: string) => void;
  setQuestions: (questions: Question[]) => void;
  setAnswer: (questionId: string, answer: string) => void;
  setIsClassifying: (status: boolean) => void;
  addLog: (log: LogEntry) => void;
  setGenerationResult: (map: any, score: number, feedback: string) => void;
  clearLogs: () => void;
}

export const useMapStore = create<MapState>((set) => ({
  phase: 'Ideas',
  rawIdeas: '',
  questions: [],
  answers: {},
  isClassifying: false,
  logs: [],
  finalMap: null,
  score: 0,
  feedback: '',
  setPhase: (phase) => set({ phase }),
  setRawIdeas: (ideas) => set({ rawIdeas: ideas }),
  setQuestions: (questions) => set({ questions }),
  setAnswer: (id, answer) =>
    set((state) => ({ answers: { ...state.answers, [id]: answer } })),
  setIsClassifying: (status) => set({ isClassifying: status }),
  addLog: (log) => set((state) => ({ logs: [...state.logs, log] })),
  setGenerationResult: (map, score, feedback) => set({ finalMap: map, score, feedback }),
  clearLogs: () => set({ logs: [], finalMap: null, score: 0, feedback: '' }),
}));
