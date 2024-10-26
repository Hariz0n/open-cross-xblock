import { useCross } from "@/entities/Cross/hooks/useCross";
import { CSSProperties, FC } from "react";
import { calcGridSize } from "../libs/calcGridSize";
import { cn } from "../libs";

export const Crossword: FC = () => {
  const cross = useCross()

  if (!cross) {
    return null
  }

  const gridSize = calcGridSize(cross.vertical, cross.horizontal);

  const style = {
    gridTemplateColumns: `repeat(${gridSize.x},minmax(64px,1fr))`,
    gridTemplateRows: `repeat(${gridSize.y},minmax(64px,1fr))`,
  } satisfies CSSProperties;

  const tileMap = new Map<
    string,
    {
      char: string;
      secondChar?: string;
      rowLabel?: number;
      columnLabel?: number;
    }
  >();

  for (let i = 0; i < cross.horizontal.length; i++) {
    const question = cross.horizontal[i]
    const { x, y } = question;
    for (let j = 0; j < question.length; j++) {
      const key = `${x + j}-${y}`;
      if (!tileMap.get(key)?.char) {
        tileMap.set(key, {
          char: question.value?.[j] || '',
          rowLabel: j === 0 ? i + 1 : undefined,
        });
      }
    }
  }

  for (let i = 0; i < cross.vertical.length; i++) {
    const question = cross.vertical[i]
    const { x, y } = question;
    for (let j = 0; j < question.length; j++) {
      const key = `${x}-${y + j}`;
      if (!tileMap.has(key)) {
        tileMap.set(key, {
          char: question.value?.[j] || '',
          columnLabel: j === 0 ? i + 1 : undefined,
        });
      } else {
        const tile = tileMap.get(key)!;
        tileMap.set(key, {
          char: tile.char || question.value?.[j] || '',
          secondChar: tile.char && tile.char !== question.value?.[j] ? question.value?.[j] : undefined,
          columnLabel: j === 0 ? i + 1 : undefined,
          rowLabel: tile.rowLabel
        });
      }
    }
  }

  return (
    <div className="w-full p-16 flex items-center justify-center bg-our-light-blue rounded-3xl">
      <div style={style} className="grid">
        {[...tileMap.entries()].map(([strPos, { char, rowLabel, columnLabel, secondChar }]) => {
          const unprocessedPos = strPos.split("-");
          const x = Number(unprocessedPos[0]);
          const y = Number(unprocessedPos[1]);
          return (
            <div
              key={strPos}
              className="aspect-square relative border border-our-gray bg-our-white -m-[0.5px]"
              style={{
                gridColumnStart: x + 1,
                gridColumnEnd: x + 1,
                gridRow: y + 1,
                gridRowEnd: y + 1,
              }}
            >
              {rowLabel && (
                <svg
                  className="absolute w-8 h-5 top-1/2 -left-8 -translate-y-1/2"
                  viewBox="0 0 20 20"
                >
                  <text
                    className="uppercase font-bold text-[18px] fill-our-blue"
                    textAnchor="middle"
                    x="50%"
                    y="50%"
                    dominantBaseline="middle"
                  >
                    {rowLabel}
                  </text>
                </svg>
              )}
              {columnLabel && (
                <svg
                  className="absolute w-5 h-5 -top-5 left-1/2 -translate-x-1/2"
                  viewBox="0 0 20 20"
                >
                  <text
                    className="uppercase font-bold text-[18px] fill-our-blue"
                    textAnchor="middle"
                    x="50%"
                    y="50%"
                    dominantBaseline="middle"
                  >
                    {columnLabel}
                  </text>
                </svg>
              )}
              <svg className={cn("w-full h-full", Boolean(secondChar) && 'bg-our-red')} viewBox="0 0 48 48">
                <text
                  className={cn("uppercase font-bold text-[18px]", (!char || char === '_') && 'fill-our-light-gray')}
                  textAnchor="middle"
                  x="50%"
                  y="50%"
                  dominantBaseline="middle"
                >
                  {char || '_'}
                  {Boolean(secondChar) && ` / ${secondChar}` }
                </text>
              </svg>
            </div>
          );
        })}
      </div>
    </div>
  );
};