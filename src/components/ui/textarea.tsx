import * as React from "react";

import { cn } from "@/lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[50px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-[#939EA9] focus-visible:outline-none focus-visible:ring-1  focus-visible:ring-[#009E74] hover:ring-1 hover:ring-[#879099] disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };
