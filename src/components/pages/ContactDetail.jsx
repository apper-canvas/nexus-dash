import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { contactService } from "@/services/api/contactService";
import { dealService } from "@/services/api/dealService";
import { activityService } from "@/services/api/activityService";
import { format } from "date-fns";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import TabGroup from "@/components/molecules/TabGroup";
import Modal from "@/components/molecules/Modal";
import Error from "@/components/ui/Error";
import Loading from "@/components/ui/Loading";
import Contacts from "@/components/pages/Contacts";
import ActivityFeed from "@/components/organisms/ActivityFeed";
import ContactForm from "@/components/organisms/ContactForm";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";

const ContactDetail = () => {
  const { contactId } = useParams();
  const navigate = useNavigate();
  const [contact, setContact] = useState(null);
  const [deals, setDeals] = useState([]);
const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  useEffect(() => {
loadContactData();
  }, [contactId]);

  const loadContactData = async () => {
    try {
      setLoading(true);
      setError("");
      const [contactData, dealsData, activitiesData] = await Promise.all([
        contactService.getById(contactId),
        dealService.getByContactId(contactId),
        activityService.getByContactId(contactId)
      ]);
      setContact(contactData);
      setDeals(dealsData);
      setActivities(activitiesData);
    } catch (err) {
      setError(err.message || "Failed to load contact details");
    } finally {
      setLoading(false);
    }
  };

  const handleEditContact = () => {
    setEditingContact(contact);
    setIsModalOpen(true);
  };

  const handleSubmit = async (contactData) => {
    try {
      const updated = await contactService.update(contact.Id, contactData);
      setContact(updated);
      setIsModalOpen(false);
      setEditingContact(null);
      toast.success("Contact updated successfully");
      // Refresh the data to ensure all related information is up to date
      loadContactData();
    } catch (err) {
      toast.error(err.message || "Failed to update contact");
    }
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadContactData} />;
  if (!contact) return <Error message="Contact not found" />;

  const tabs = [
    { value: "overview", label: "Overview" },
    { value: "deals", label: `Deals (${deals.length})` },
    { value: "activities", label: `Activities (${activities.length})` }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "success";
      case "Inactive":
        return "default";
      case "Lead":
        return "info";
      default:
        return "default";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => navigate("/contacts")}>
          <ApperIcon name="ArrowLeft" className="w-4 h-4 mr-2" />
          Back to Contacts
        </Button>
<Button variant="primary" onClick={handleEditContact}>
          <ApperIcon name="Edit" className="w-4 h-4 mr-2" />
          Edit Contact
        </Button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-8"
      >
        <div className="flex items-start space-x-6">
          <div className="w-24 h-24 bg-gradient-to-br from-primary to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-4xl shadow-lg">
            {contact.name.charAt(0)}
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{contact.name}</h1>
                <p className="text-lg text-gray-600">
                  {contact.position} at {contact.company}
                </p>
              </div>
              <Badge variant={getStatusColor(contact.status)}>{contact.status}</Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <ApperIcon name="Mail" className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">Email</p>
                  <p className="text-sm font-semibold text-gray-900">{contact.email}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <ApperIcon name="Phone" className="w-5 h-5 text-success" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">Phone</p>
                  <p className="text-sm font-semibold text-gray-900">{contact.phone}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <ApperIcon name="DollarSign" className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">Deal Value</p>
                  <p className="text-sm font-semibold text-gray-900">
                    ${contact.dealValue.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <TabGroup tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {activeTab === "overview" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-4">Contact Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm font-semibold text-gray-500 mb-2">Company</p>
              <p className="text-base text-gray-900">{contact.company}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-500 mb-2">Position</p>
              <p className="text-base text-gray-900">{contact.position}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-500 mb-2">Created</p>
              <p className="text-base text-gray-900">
                {format(new Date(contact.createdAt), "MMM d, yyyy")}
              </p>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-500 mb-2">Last Contact</p>
              <p className="text-base text-gray-900">
                {format(new Date(contact.lastContact), "MMM d, yyyy")}
              </p>
            </div>
          </div>
          {contact.notes && (
            <div className="mt-6">
              <p className="text-sm font-semibold text-gray-500 mb-2">Notes</p>
              <p className="text-base text-gray-700">{contact.notes}</p>
            </div>
          )}
        </motion.div>
      )}

      {activeTab === "deals" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-4">Associated Deals</h2>
          {deals.length === 0 ? (
            <div className="text-center py-12">
              <ApperIcon name="Inbox" className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No deals associated with this contact</p>
            </div>
          ) : (
            <div className="space-y-4">
              {deals.map((deal) => (
                <div
                  key={deal.Id}
                  className="p-4 border-2 border-gray-200 rounded-lg hover:border-primary transition-colors cursor-pointer"
                  onClick={() => navigate(`/pipeline`)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">{deal.title}</h3>
                    <Badge variant="info">{deal.stage}</Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span className="font-bold text-lg text-gray-900">
                      ${deal.value.toLocaleString()}
                    </span>
                    <span>{deal.probability}% probability</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      )}

      {activeTab === "activities" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-4">Activity History</h2>
          {activities.length === 0 ? (
            <div className="text-center py-12">
              <ApperIcon name="Activity" className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No activities recorded for this contact</p>
            </div>
          ) : (
            <ActivityFeed activities={activities} contacts={[contact]} />
          )}
</motion.div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingContact(null);
        }}
        title="Edit Contact"
        size="lg"
      >
        <ContactForm
          contact={editingContact}
          onSubmit={handleSubmit}
          onCancel={() => {
            setIsModalOpen(false);
            setEditingContact(null);
          }}
        />
      </Modal>
    </div>
  );
};

export default ContactDetail;