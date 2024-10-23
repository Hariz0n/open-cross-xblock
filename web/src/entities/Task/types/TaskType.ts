import { TaskQuestionType } from "./TaskQuestionType";

export type TaskType = {
  title: string;
  description: string;
  vertical: TaskQuestionType[];
  horizontal: TaskQuestionType[];
};
