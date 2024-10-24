import { FC, PropsWithChildren, useState } from "react";
import { CrossContext } from "../libs/CrossContext";
import { TaskType } from "@/entities/Task/types/TaskType";

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
