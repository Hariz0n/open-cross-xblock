export type TaskQuestionType = {
  question: string;
  value?: string;
  x: number;
  y: number;
  length: number;
  isCorrect?: boolean;
  attempts?: number;
  max_attempts?: number;
};
