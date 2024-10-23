import { TaskInfo, useTask } from "@/entities/Task";
import { ActionQuestions } from "@/widgets/ActionQuestions";
import { FC } from "react";

export const MainPage: FC = () => {
  const { data } = useTask();

  if (!data) {
    return null;
  }

  return (
    <main className="w-full h-full p-5 flex flex-col gap-12">
      <TaskInfo />
      <ActionQuestions questions={data.vertical} />
      <ActionQuestions questions={data.horizontal} isHorizontal />
    </main>
  );
};
