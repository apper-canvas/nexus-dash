import { cn } from "@/utils/cn";

const TabGroup = ({ tabs, activeTab, onChange, className = "" }) => {
  return (
    <div className={cn("border-b border-gray-200", className)}>
      <nav className="flex space-x-8">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => onChange(tab.value)}
            className={cn(
              "pb-4 px-1 border-b-2 font-semibold text-sm transition-all duration-200",
              activeTab === tab.value
                ? "border-primary text-primary"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            )}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default TabGroup;