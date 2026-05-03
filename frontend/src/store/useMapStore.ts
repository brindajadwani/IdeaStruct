import { create } from 'zustand';

export type Phase = 'Ideas' | 'Clarify' | 'Agent' | 'Done';

export interface Question {
  id: string;
  text: string;
  type: string;
  options?: string[];
}

interface MapState {
  phase: Phase;
  rawIdeas: string;
  questions: Question[];
  answers: Record<string, string>;
  isClassifying: boolean;
  setPhase: (phase: Phase) => void;
  setRawIdeas: (ideas: string) => void;
  setQuestions: (questions: Question[]) => void;
  setAnswer: (questionId: string, answer: string) => void;
  setIsClassifying: (status: boolean) => void;
}

export const useMapStore = create<MapState>((set) => ({
  phase: 'Ideas',
  rawIdeas: '',
  questions: [],
  answers: {},
  isClassifying: false,
  setPhase: (phase) => set({ phase }),
  setRawIdeas: (ideas) => set({ rawIdeas: ideas }),
  setQuestions: (questions) => set({ questions }),
  setAnswer: (id, answer) =>
    set((state) => ({ answers: { ...state.answers, [id]: answer } })),
  setIsClassifying: (status) => set({ isClassifying: status }),
}));
