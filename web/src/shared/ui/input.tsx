import * as React from "react";
import { IMaskInput, IMaskInputProps } from 'react-imask';

import { cn } from "@/shared/libs";

type InputProps = IMaskInputProps<HTMLInputElement>

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <IMaskInput
        {...props}
        ref={ref}
        className={cn(
          "flex h-12 w-full rounded-xl border border-input bg-transparent px-3 py-1 text-lg shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
