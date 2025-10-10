import ApperIcon from "@/components/ApperIcon";
import { motion } from "framer-motion";

const MetricCard = ({ icon, title, value, change, trend = "up", gradient = "from-blue-500 to-indigo-600" }) => {
  return (
    <motion.div
      whileHover={{ y: -4, shadow: "0 12px 24px rgba(0,0,0,0.1)" }}
      className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 transition-shadow duration-200"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 bg-gradient-to-br ${gradient} rounded-lg flex items-center justify-center shadow-md`}>
          <ApperIcon name={icon} className="w-6 h-6 text-white" />
        </div>
        {change && (
          <div className={`flex items-center text-sm font-semibold ${trend === "up" ? "text-success" : "text-error"}`}>
            <ApperIcon name={trend === "up" ? "TrendingUp" : "TrendingDown"} className="w-4 h-4 mr-1" />
            {change}
          </div>
        )}
      </div>
      <h3 className="text-sm font-medium text-gray-600 mb-1">{title}</h3>
      <p className="text-3xl font-bold text-gray-900 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
        {value}
      </p>
    </motion.div>
  );
};

export default MetricCard;