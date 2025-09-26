import * as React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type = "text", ...props }, ref) => {
    return (
      <input
        type={type}
        ref={ref}
        className={cn(
          // base
          "flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-base shadow-sm transition-colors md:text-sm",
          // kill outlines/rings/shadows from browser and tailwind/forms
          "outline-none focus:outline-none focus-visible:outline-none",
          "appearance-none [-webkit-appearance:none]",
          "focus:ring-0 focus-visible:ring-0 focus:shadow-none",
          // keep border steady on focus
          "focus:border-input",
          // file/input resets
          "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
          // disabled
          "disabled:cursor-not-allowed disabled:opacity-50",
          // placeholder
          "placeholder:text-muted-foreground",
          className
        )}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
