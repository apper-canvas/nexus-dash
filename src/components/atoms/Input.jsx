import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Input = forwardRef(({ 
  className, 
  type = "text",
  error,
  ...props 
}, ref) => {
  return (
    <input
      type={type}
      ref={ref}
      className={cn(
        "w-full px-4 py-2.5 bg-white border-2 rounded-md transition-all duration-200",
        "text-gray-900 placeholder:text-gray-400",
        "focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary",
        error ? "border-error focus:ring-error" : "border-gray-300 hover:border-gray-400",
        className
      )}
      {...props}
    />
  );
});

Input.displayName = "Input";

export default Input;