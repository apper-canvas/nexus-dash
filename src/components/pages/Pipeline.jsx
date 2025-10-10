import { useState, useEffect } from "react";
import PipelineBoard from "@/components/organisms/PipelineBoard";
import DealForm from "@/components/organisms/DealForm";
import Modal from "@/components/molecules/Modal";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { dealService } from "@/services/api/dealService";
import { contactService } from "@/services/api/contactService";
import { activityService } from "@/services/api/activityService";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

const Pipeline = () => {
  const [deals, setDeals] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState(null);

  useEffect(() => {
    loadPipelineData();
  }, []);

  const loadPipelineData = async () => {
    try {
      setLoading(true);
      setError("");
      const [dealsData, contactsData] = await Promise.all([
        dealService.getAll(),
        contactService.getAll()
      ]);
      setDeals(dealsData.filter((d) => d.status === "Open"));
      setContacts(contactsData);
    } catch (err) {
      setError(err.message || "Failed to load pipeline data");
    } finally {
      setLoading(false);
    }
  };

  const handleAddDeal = () => {
    setSelectedDeal(null);
    setIsModalOpen(true);
  };

  const handleDealClick = (deal) => {
    setSelectedDeal(deal);
    setIsModalOpen(true);
  };

  const handleStageChange = async (dealId, newStage) => {
    try {
      const updated = await dealService.updateStage(dealId, newStage);
      setDeals((prev) => prev.map((d) => (d.Id === updated.Id ? updated : d)));
      
      await activityService.create({
        contactId: updated.contactId,
        dealId: updated.Id,
        type: "deal_updated",
        description: `Deal moved to ${newStage} stage`
      });
      
      toast.success(`Deal moved to ${newStage}`);
    } catch (err) {
      toast.error(err.message || "Failed to update deal stage");
    }
  };

  const handleSubmit = async (dealData) => {
    try {
      if (selectedDeal) {
        const updated = await dealService.update(selectedDeal.Id, dealData);
        setDeals((prev) => prev.map((d) => (d.Id === updated.Id ? updated : d)));
        toast.success("Deal updated successfully");
      } else {
        const created = await dealService.create(dealData);
        setDeals((prev) => [...prev, created]);
        
        await activityService.create({
          contactId: created.contactId,
          dealId: created.Id,
          type: "deal_created",
          description: `New deal created: ${created.title}`
        });
        
        toast.success("Deal created successfully");
      }
      setIsModalOpen(false);
      setSelectedDeal(null);
    } catch (err) {
      toast.error(err.message || "Failed to save deal");
    }
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadPipelineData} />;

  const totalValue = deals.reduce((sum, deal) => sum + deal.value, 0);
  const avgDealSize = deals.length > 0 ? totalValue / deals.length : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-indigo-600 bg-clip-text text-transparent mb-2">
            Sales Pipeline
          </h1>
          <p className="text-gray-600">Drag and drop deals between stages</p>
        </div>
        <Button variant="primary" onClick={handleAddDeal}>
          <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
          Add Deal
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-gray-600">Total Pipeline</h3>
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-indigo-600 rounded-lg flex items-center justify-center shadow-md">
              <ApperIcon name="TrendingUp" className="w-5 h-5 text-white" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">${(totalValue / 1000).toFixed(0)}K</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-gray-600">Active Deals</h3>
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center shadow-md">
              <ApperIcon name="Briefcase" className="w-5 h-5 text-white" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">{deals.length}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-gray-600">Avg Deal Size</h3>
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center shadow-md">
              <ApperIcon name="DollarSign" className="w-5 h-5 text-white" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">${(avgDealSize / 1000).toFixed(0)}K</p>
        </motion.div>
      </div>

      {deals.length === 0 ? (
        <Empty
          icon="TrendingUp"
          title="No Active Deals"
          message="Start building your pipeline by creating your first deal."
          actionLabel="Create Your First Deal"
          onAction={handleAddDeal}
        />
      ) : (
        <PipelineBoard
          deals={deals}
          contacts={contacts}
          onDealClick={handleDealClick}
          onStageChange={handleStageChange}
        />
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedDeal(null);
        }}
        title={selectedDeal ? "Edit Deal" : "Create New Deal"}
        size="lg"
      >
        <DealForm
          deal={selectedDeal}
          contacts={contacts}
          onSubmit={handleSubmit}
          onCancel={() => {
            setIsModalOpen(false);
            setSelectedDeal(null);
          }}
        />
      </Modal>
    </div>
  );
};

export default Pipeline;