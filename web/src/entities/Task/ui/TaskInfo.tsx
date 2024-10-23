import { FC } from "react";
import { useTask } from "../hooks/useTask";

export const TaskInfo: FC = () => {
  const { data } = useTask();

  return (
    <section className={"flex flex-col gap-4"}>
      <h1 className="font-bold text-3xl">{data?.title}</h1>
      <p className="font-medium text-lg">{data?.description}</p>
    </section>
  );
};
