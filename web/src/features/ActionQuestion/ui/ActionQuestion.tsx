import { TaskQuestionType } from "@/entities/Task/types/TaskQuestionType";
import { Input } from "@/shared/ui";
import { FC } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

type ActionQuestionProps = {
  question: TaskQuestionType;
  index: number;
  isHorizontal?: boolean;
};

type FormValues = {
  value: string;
};

export const ActionQuestion: FC<ActionQuestionProps> = ({
  index,
  question,
  isHorizontal = false,
}) => {
  const form = useForm<FormValues>({
    defaultValues: {
      value: "",
    },
  });

  const submitHandler: SubmitHandler<FormValues> = ({ value }) => {
    console.log({ value, isHorizontal, index });
  };

  return (
    <form
      onSubmit={form.handleSubmit(submitHandler)}
      className="flex flex-col items-start gap-4"
    >
      <li className="ml-6 text-lg">{question.question}</li>
      <Input {...form.register("value")} onSubmit={console.log} className="w-64" />
    </form>
  );
};
