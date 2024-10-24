export type TaskCheckBody = {
  isHorizontal: boolean;
  index: number;
  value: string;
};
export type TaskCheckResponse = {
  isCorrect: boolean;
  attempts: number;
};
