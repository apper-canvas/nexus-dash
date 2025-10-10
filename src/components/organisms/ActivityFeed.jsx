import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import { format } from "date-fns";

const ActivityFeed = ({ activities, contacts }) => {
  const getActivityIcon = (type) => {
    switch (type) {
      case "call":
        return "Phone";
      case "email":
        return "Mail";
      case "meeting":
        return "Calendar";
      case "note":
        return "FileText";
      case "deal_created":
        return "Plus";
      case "deal_updated":
        return "Edit";
      case "contact_created":
        return "UserPlus";
      default:
        return "Activity";
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case "call":
        return "from-blue-500 to-blue-600";
      case "email":
        return "from-purple-500 to-purple-600";
      case "meeting":
        return "from-green-500 to-green-600";
      case "note":
        return "from-yellow-500 to-yellow-600";
      case "deal_created":
      case "deal_updated":
        return "from-indigo-500 to-indigo-600";
      case "contact_created":
        return "from-teal-500 to-teal-600";
      default:
        return "from-gray-500 to-gray-600";
    }
  };

  const getContactName = (contactId) => {
    const contact = contacts.find((c) => c.Id === contactId);
    return contact ? contact.name : "Unknown Contact";
  };

  return (
    <div className="space-y-4">
      {activities.map((activity, index) => (
        <motion.div
          key={activity.Id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 }}
          className="flex space-x-4 bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200"
        >
          <div className={`w-12 h-12 bg-gradient-to-br ${getActivityColor(activity.type)} rounded-lg flex items-center justify-center flex-shrink-0 shadow-md`}>
            <ApperIcon name={getActivityIcon(activity.type)} className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <h4 className="text-sm font-semibold text-gray-900">
                {getContactName(activity.contactId)}
              </h4>
              <span className="text-xs text-gray-500">
                {format(new Date(activity.timestamp), "MMM d, yyyy h:mm a")}
              </span>
            </div>
            <p className="text-sm text-gray-700 mb-2">{activity.description}</p>
            <Badge variant="default" className="text-xs">
              {activity.type.replace("_", " ").toUpperCase()}
            </Badge>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default ActivityFeed;