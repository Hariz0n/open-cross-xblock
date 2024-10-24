import { baseAxiosApi } from "@/shared/api";
import { MutationFunction } from "@tanstack/react-query";
import { TaskCheckBody, TaskCheckResponse } from "../types/TaskCheckType";

export const useTaskCheckFetcher = (
  url?: string
): MutationFunction<TaskCheckResponse, TaskCheckBody> | undefined => {
  if (!url) {
    return;
  }

  const fetcher: MutationFunction<TaskCheckResponse, TaskCheckBody> = async (
    body
  ) => {
    const response = await baseAxiosApi.post<TaskCheckResponse>(
      url,
      JSON.stringify(body)
    );

    if (response.status !== 200) {
      throw new Error("Task fetch error");
    }

    return response.data;
  };

  return fetcher;
};
