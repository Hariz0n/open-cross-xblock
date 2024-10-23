import { useQuery } from "@tanstack/react-query";
import { TASK_FETCH_KEY } from "../lib/constants";
import { useTaskFetcher } from "./useTaskFetcher";
import { useXBlock } from "@/entities/XBlock";

export const useTask = () => {
  const xblock = useXBlock();

  const url = xblock?.runtime.handlerUrl(xblock.element, "getTask");

  const queryFn = useTaskFetcher(url);

  return useQuery({
    queryKey: [TASK_FETCH_KEY],
    queryFn,
    enabled: Boolean(queryFn),
  });
};
