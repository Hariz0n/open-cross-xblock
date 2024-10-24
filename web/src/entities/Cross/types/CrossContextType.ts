import { TaskQuestionType } from "@/entities/Task/types/TaskQuestionType"
import { TaskType } from "@/entities/Task/types/TaskType"

export type CrossContextType = {
  horizontal: TaskQuestionType[]
  vertical: TaskQuestionType[]
  setState: React.Dispatch<React.SetStateAction<Pick<TaskType, "horizontal" | "vertical">>>
}