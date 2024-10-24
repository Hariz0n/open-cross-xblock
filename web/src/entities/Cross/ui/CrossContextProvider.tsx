import { FC, PropsWithChildren, useState } from "react";
import { CrossContext } from "../libs/CrossContext";
import { useTask } from "@/entities/Task";
import { TaskType } from "@/entities/Task/types/TaskType";
import { CrossContextType } from "../types/CrossContextType";

type CrossContextProviderProps = PropsWithChildren &
  Pick<TaskType, "horizontal" | "vertical">;

export const CrossContextProvider: FC<CrossContextProviderProps> = ({
  children,
  horizontal,
  vertical,
}) => {
  const [data, setState] = useState<Pick<TaskType, "horizontal" | "vertical">>({
    horizontal,
    vertical,
  });

  return (
    <CrossContext.Provider
      value={{
        horizontal: data.horizontal,
        vertical: data.vertical,
        setState,
      }}
    >
      {children}
    </CrossContext.Provider>
  );
};
