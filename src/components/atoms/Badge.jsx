import { cn } from "@/utils/cn";

const Badge = ({ children, variant = "default", className }) => {
  const variants = {
    default: "bg-gray-100 text-gray-800 border-gray-200",
    success: "bg-gradient-to-r from-success to-green-600 text-white shadow-sm",
    warning: "bg-gradient-to-r from-warning to-yellow-600 text-white shadow-sm",
    error: "bg-gradient-to-r from-error to-red-600 text-white shadow-sm",
    info: "bg-gradient-to-r from-info to-blue-600 text-white shadow-sm",
    purple: "bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-sm",
    teal: "bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-sm"
  };

  return (
    <span className={cn(
      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
      variants[variant],
      className
    )}>
      {children}
    </span>
  );
};

export default Badge;