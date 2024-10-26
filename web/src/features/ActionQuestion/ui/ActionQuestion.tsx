import { useCross } from "@/entities/Cross/hooks/useCross";
import { useTaskCheck } from "@/entities/Task";
import { TaskQuestionType } from "@/entities/Task/types/TaskQuestionType";
import { cn } from "@/shared/libs";
import { Input } from "@/shared/ui";
import { FC, useEffect } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

type ActionQuestionProps = {
  question: TaskQuestionType;
  index: number;
  isHorizontal?: boolean;
};

const qSchema = z.object({
  value: z.string().regex(/^[^<_>]+$/gi),
});

type FormValues = z.infer<typeof qSchema>;

export const ActionQuestion: FC<ActionQuestionProps> = ({
  index,
  question,
  isHorizontal = false,
}) => {
  const { mutateAsync } = useTaskCheck();
  const cross = useCross();
  const form = useForm<FormValues>({
    defaultValues: {
      value: question.value || "",
    },
    mode: "onChange",
    resolver: zodResolver(qSchema),
  });

  const submitHandler: SubmitHandler<FormValues> = async ({ value }) => {
    await mutateAsync({ index, isHorizontal, value });
  };

  const isDirty = form.getFieldState("value").isDirty;
  const isCorrectSet = typeof question.isCorrect === "boolean";
  const isCorrect = question.isCorrect;
  const isSubbmitted = form.formState.isSubmitted;
  const isSubmitting = form.formState.isSubmitting;

  const shouldShowCorrectness =
    !isDirty &&
    !isSubmitting &&
    isCorrectSet &&
    isCorrect &&
    !form.formState.errors.value;

  const shouldShowErrorness =
    !isDirty &&
    !isSubbmitted &&
    isCorrectSet &&
    !isCorrect &&
    !form.formState.errors.value;

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (isSubbmitted) {
      timeoutId = setTimeout(() => {
        form.reset({}, { keepValues: true, keepErrors: true });
      }, 100);
    }

    () => clearTimeout(timeoutId);
  }, [isSubbmitted]);

  return (
    <form
      onSubmit={form.handleSubmit(submitHandler)}
      className="flex flex-col items-start gap-4"
    >
      <li className="ml-6 text-lg">{question.question}</li>
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center gap-2">
          <Controller
            control={form.control}
            name="value"
            render={({ field: { onChange, ...rest } }) => (
              <Input
                {...rest}
                mask={"*".repeat(question.length)}
                disabled={
                  isSubmitting ||
                  (question.max_attempts !== 0 &&
                    (question.attempts ?? 0) >=
                      (question.max_attempts ?? 99999))
                }
                onChange={(e) => {
                  const ffVal = e.target.value;
                  onChange(ffVal);

                  cross?.setState((prev) => {
                    const res = { ...prev };

                    if (isHorizontal) {
                      res.horizontal[index].value = ffVal;
                    } else {
                      res.vertical[index].value = ffVal;
                    }

                    return res;
                  });
                }}
                className={cn(
                  "w-64",
                  shouldShowErrorness &&
                    "bg-our-light-red border-our-red text-our-red",
                  shouldShowCorrectness &&
                    "bg-our-light-green border-our-green text-our-green"
                )}
              />
            )}
          />
          {shouldShowCorrectness && (
            <div className="flex h-12 w-12 rounded-lg items-center justify-center">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M20 6L9 17L4 12"
                  stroke="#159300"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          )}
          {shouldShowErrorness && (
            <button
              type="button"
              className="flex h-12 w-12 rounded-lg items-center justify-center"
              onClick={() => {
                form.resetField("value", {
                  defaultValue: "",
                  keepTouched: true,
                });
              }}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clipPath="url(#clip0_852_203)">
                  <path
                    d="M1 4V10M1 10H7M1 10L5.64 5.64C7.02091 4.26142 8.81245 3.36897 10.7447 3.09712C12.6769 2.82527 14.6451 3.18874 16.3528 4.13277C18.0605 5.0768 19.4152 6.55025 20.2126 8.3311C21.0101 10.112 21.2072 12.1037 20.7742 14.0064C20.3413 15.909 19.3017 17.6193 17.8121 18.8798C16.3226 20.1402 14.4637 20.8824 12.5157 20.9945C10.5677 21.1066 8.63598 20.5826 7.01166 19.5014C5.38734 18.4202 4.15839 16.8404 3.51 15"
                    stroke="#126F9A"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>
              </svg>
            </button>
          )}
        </div>
        {typeof question.attempts === "number" &&
          typeof question.max_attempts === "number" &&
          question.attempts > 0 &&
          question.max_attempts > 0 && (
            <span className="font-bold text-sm">
              Попытка {question.attempts} из {question.max_attempts}
            </span>
          )}
      </div>
    </form>
  );
};
