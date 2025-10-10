import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Select = forwardRef(({ 
  children,
  className,
  error,
  ...props 
}, ref) => {
  return (
    <select
      ref={ref}
      className={cn(
        "w-full px-4 py-2.5 bg-white border-2 rounded-md transition-all duration-200",
        "text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary",
        error ? "border-error focus:ring-error" : "border-gray-300 hover:border-gray-400",
        className
      )}
      {...props}
    >
      {children}
    </select>
  );
});

Select.displayName = "Select";

export default Select;