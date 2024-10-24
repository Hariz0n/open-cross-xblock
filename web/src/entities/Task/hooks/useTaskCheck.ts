import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TASK_FETCH_KEY } from "../lib/constants";
import { useXBlock } from "@/entities/XBlock";
import { useTaskCheckFetcher } from "./useTaskCheckFetcher";
import { TaskType } from "../types/TaskType";
import { TaskQuestionType } from "../types/TaskQuestionType";

export const useTaskCheck = () => {
  const xblock = useXBlock();
  const queryClient = useQueryClient();

  const url = xblock?.runtime.handlerUrl(xblock.element, "check");

  const mutationFn = useTaskCheckFetcher(url);

  return useMutation({
    mutationKey: [TASK_FETCH_KEY],
    mutationFn,
    onMutate: async ({ index, isHorizontal, value }) => {
      await queryClient.cancelQueries({ queryKey: [TASK_FETCH_KEY] });

      const prevTask = queryClient.getQueryData<TaskType>([
        TASK_FETCH_KEY,
      ]) as TaskType;

      let questions: TaskQuestionType[];

      if (isHorizontal) {
        questions = prevTask.horizontal;
      } else {
        questions = prevTask.vertical;
      }

      questions[index].value = value;

      queryClient.setQueryData<TaskType>([TASK_FETCH_KEY], {
        ...prevTask,
        horizontal: isHorizontal ? questions : prevTask.horizontal,
        vertical: !isHorizontal ? questions : prevTask.vertical,
      });

      return { prevTask };
    },
    onError: (_1, _2, context) => {
      queryClient.setQueryData([TASK_FETCH_KEY], context?.prevTask);
    },
    onSettled: (response, _2, { index, isHorizontal }) => {
      if (response) {
        const prevTask = queryClient.getQueryData<TaskType>([
          TASK_FETCH_KEY,
        ]) as TaskType;

        let questions: TaskQuestionType[];

        if (isHorizontal) {
          questions = prevTask.horizontal;
        } else {
          questions = prevTask.vertical;
        }

        questions[index].isCorrect = response.isCorrect;

        queryClient.setQueryData<TaskType>([TASK_FETCH_KEY], {
          ...prevTask,
          horizontal: isHorizontal ? questions : prevTask.horizontal,
          vertical: !isHorizontal ? questions : prevTask.vertical,
        });
      }

      queryClient.invalidateQueries({ queryKey: [TASK_FETCH_KEY] });
    },
  });
};
