import { FC } from "react";

type BadgeProps = {
  char: string;
  title: string;
};

export const Badge: FC<BadgeProps> = ({ char, title }) => {
  return (
    <div className="bg-our-light-blue rounded-xl flex items-center p-1">
      <div className="bg-our-blue font-semibold h-8 w-8 flex items-center justify-center text-our-white rounded-lg">
        {char}
      </div>
      <span className="text-sm font-semibold text-our-blue ml-2 mr-1">{title}</span>
    </div>
  );
};
