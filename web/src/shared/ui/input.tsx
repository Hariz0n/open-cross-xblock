import * as React from "react";
import InputMask from "react-input-mask";

import { cn } from "@/shared/libs";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  mask: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <InputMask
        inputRef={ref}
        type={type}
        className={cn(
          "flex h-12 w-full rounded-xl border border-input bg-transparent px-3 py-1 text-lg shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
