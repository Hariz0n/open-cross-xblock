import { useXBlock } from "@/entities/XBlock";
import { FC } from "react";

export const MainPage: FC = () => {
  const data = useXBlock()

  console.log({data})
  
  return <main className="w-full h-full p-5 flex flex-col gap-8">
    hi
  </main>;
};
