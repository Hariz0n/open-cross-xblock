import { TaskQuestionType } from "@/entities/Task/types/TaskQuestionType";
import { Size } from "@/shared/types/Size";

export const calcGridSize = (
  vertical: TaskQuestionType[],
  horizontal: TaskQuestionType[]
): Size => {
  let xSize = 0;
  let ySize = 0;

  for (const { x, y, length } of horizontal) {
    xSize = Math.max(xSize, x + length);
    ySize = Math.max(ySize, y);
  }
  for (const { x, y, length } of vertical) {
    ySize = Math.max(ySize, y + length);
    xSize = Math.max(xSize, x);
  }

  return {
    x: xSize,
    y: ySize,
  };
};
