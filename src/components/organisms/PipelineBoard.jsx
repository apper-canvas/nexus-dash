import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import { format } from "date-fns";

const PipelineBoard = ({ deals, contacts, onDealClick, onStageChange }) => {
  const stages = ["Lead", "Qualified", "Proposal", "Negotiation", "Closed Won", "Closed Lost"];
  
  const stageColors = {
    Lead: "from-blue-100 to-blue-200",
    Qualified: "from-yellow-100 to-yellow-200",
    Proposal: "from-orange-100 to-orange-200",
    Negotiation: "from-purple-100 to-purple-200",
    "Closed Won": "from-green-100 to-green-200",
    "Closed Lost": "from-red-100 to-red-200"
  };

  const [draggedDeal, setDraggedDeal] = useState(null);

  const getContactName = (contactId) => {
    const contact = contacts.find((c) => c.Id === contactId);
    return contact ? contact.name : "Unknown";
  };

  const getDealsByStage = (stage) => {
    return deals.filter((deal) => deal.stage === stage);
  };

  const handleDragStart = (deal) => {
    setDraggedDeal(deal);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (stage) => {
    if (draggedDeal && draggedDeal.stage !== stage) {
      onStageChange(draggedDeal.Id, stage);
    }
    setDraggedDeal(null);
  };

  const calculateStageValue = (stage) => {
    const stageDeals = getDealsByStage(stage);
    return stageDeals.reduce((sum, deal) => sum + deal.value, 0);
  };

  return (
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
      {stages.map((stage) => {
        const stageDeals = getDealsByStage(stage);
        const stageValue = calculateStageValue(stage);
        
        return (
<div
            key={stage}
            onDragOver={handleDragOver}
            onDrop={() => handleDrop(stage)}
            className="bg-white rounded-lg shadow-sm border-2 border-gray-200 overflow-hidden min-h-[400px] flex flex-col"
          >
            <div className={`bg-gradient-to-r ${stageColors[stage]} p-3 border-b border-gray-200 flex-shrink-0`}>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-bold text-gray-900">{stage}</h3>
                <Badge variant="default" className="bg-white text-gray-900 text-xs px-2 py-1">
                  {stageDeals.length}
                </Badge>
              </div>
              <p className="text-xs font-semibold text-gray-700">
                ${stageValue.toLocaleString()}
              </p>
            </div>
            
            <div className="p-4 space-y-3 min-h-[400px] max-h-[600px] overflow-y-auto">
              <AnimatePresence>
{stageDeals.map((deal, index) => (
                  <motion.div
                    key={deal.Id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: index * 0.05 }}
                    draggable
                    onDragStart={() => handleDragStart(deal)}
                    onClick={() => onDealClick(deal)}
                    className="bg-gray-50 p-3 rounded-lg border border-gray-200 shadow-sm hover:shadow-md hover:border-primary transition-all duration-200 cursor-move group mx-2 mb-3"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-gray-900 text-xs group-hover:text-primary transition-colors leading-tight">
                        {deal.title}
                      </h4>
                      <Button size="sm" variant="ghost" className="opacity-0 group-hover:opacity-100 transition-opacity p-1">
                        <ApperIcon name="MoreVertical" className="w-3 h-3" />
                      </Button>
                    </div>
                    
                    <div className="space-y-1 mb-2">
                      <div className="flex items-center text-xs text-gray-600">
                        <ApperIcon name="User" className="w-3 h-3 mr-1 flex-shrink-0" />
                        <span className="truncate">{getContactName(deal.contactId)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-gray-900">
                          ${deal.value.toLocaleString()}
                        </span>
                        <Badge variant="info" className="text-xs px-1.5 py-0.5">
                          {deal.probability}%
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                      <span className="text-xs text-gray-500 truncate">
                        {format(new Date(deal.expectedCloseDate), "MMM d")}
                      </span>
                      <ApperIcon name="GripVertical" className="w-3 h-3 text-gray-400 flex-shrink-0" />
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PipelineBoard;