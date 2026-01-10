export type CardKind = "vocab" | "sentence" | "phrase";

export type ChoiceKey = "A" | "B" | "C" | "D";

export interface QuizCard {
  id: string;
  kind: CardKind;
  pinyin: string;
  hanzi: string;
  choices: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  correct: ChoiceKey;
}

export interface AnswerState {
  selectedChoice: ChoiceKey | null;
  isCorrect: boolean | null;
}
