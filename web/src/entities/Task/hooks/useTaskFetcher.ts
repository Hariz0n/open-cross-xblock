import { baseAxiosApi } from "@/shared/api"
import { QueryFunction } from "@tanstack/react-query";
import { TaskType } from "../types/TaskType";

export const useTaskFetcher = (url?: string): QueryFunction<TaskType> | undefined => {
  if (!url) {
    return
  }

  const fetcher: QueryFunction<TaskType> = async ({signal}) => {
    const response = await baseAxiosApi.post<TaskType>(url, '{}', {
      signal
    })

    if (response.status !== 200) {
      throw new Error("Task fetch error");
    }

    return response.data
  }

  return fetcher
}