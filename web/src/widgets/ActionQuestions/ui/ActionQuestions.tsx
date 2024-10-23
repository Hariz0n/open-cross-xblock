import { TaskQuestionType } from "@/entities/Task/types/TaskQuestionType";
import { ActionQuestion } from "@/features/ActionQuestion";
import { Badge } from "@/shared/ui";
import { FC } from "react";

type ActionQuestionsProps = {
  questions: TaskQuestionType[];
  isHorizontal?: boolean;
};

export const ActionQuestions: FC<ActionQuestionsProps> = ({
  questions,
  isHorizontal,
}) => {
  return (
    <section className="flex flex-col items-start gap-6">
      <Badge
        char={isHorizontal ? "2" : "1"}
        title={isHorizontal ? "Вопросы по горизонтали" : "Вопросы по вертикали"}
      />
      <ul className="flex flex-col gap-8 list-decimal">
        {questions.map((question, index) => (
          <ActionQuestion
            key={index}
            index={index}
            question={question}
            isHorizontal={isHorizontal}
          />
        ))}
      </ul>
    </section>
  );
};
