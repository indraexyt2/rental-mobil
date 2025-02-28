import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    (<input
      type={type}
      className={cn(
        "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      )}
      ref={ref}
      {...props} />)
  );
})
Input.displayName = "Input"

const InputCar = React.forwardRef(({ className, type, ...props }, ref) => {
    return (
        <input
            type={type}
            className={cn(
                "flex h-9 w-full bg-transparent px-3 py-1 text-base md:text-sm",
                "border-b md:border-none shadow-none",
                "focus:outline-none focus:ring-0 focus:ring-offset-0 focus:shadow-none",
                "focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0",
                "hover:shadow-none",
                className
            )}
            ref={ref}
            {...props}
        />
    );
});

InputCar.displayName = "InputCar";

export { Input, InputCar }
