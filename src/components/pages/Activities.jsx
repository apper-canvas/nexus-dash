import { useState, useEffect } from "react";
import ActivityFeed from "@/components/organisms/ActivityFeed";
import SearchBar from "@/components/molecules/SearchBar";
import Button from "@/components/atoms/Button";
import Select from "@/components/atoms/Select";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { activityService } from "@/services/api/activityService";
import { contactService } from "@/services/api/contactService";
import { motion } from "framer-motion";

const Activities = () => {
  const [activities, setActivities] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [filteredActivities, setFilteredActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");

  useEffect(() => {
    loadActivities();
  }, []);

  useEffect(() => {
    filterActivities();
  }, [activities, searchQuery, filterType]);

  const loadActivities = async () => {
    try {
      setLoading(true);
      setError("");
      const [activitiesData, contactsData] = await Promise.all([
        activityService.getAll(),
        contactService.getAll()
      ]);
      setActivities(activitiesData);
      setContacts(contactsData);
    } catch (err) {
      setError(err.message || "Failed to load activities");
    } finally {
      setLoading(false);
    }
  };

  const filterActivities = () => {
    let filtered = [...activities];

    if (filterType !== "all") {
      filtered = filtered.filter((activity) => activity.type === filterType);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((activity) => {
        const contact = contacts.find((c) => c.Id === activity.contactId);
        return (
          activity.description.toLowerCase().includes(query) ||
          (contact && contact.name.toLowerCase().includes(query))
        );
      });
    }

    setFilteredActivities(filtered);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadActivities} />;

  const activityTypes = [
    { value: "all", label: "All Activities" },
    { value: "call", label: "Calls" },
    { value: "email", label: "Emails" },
    { value: "meeting", label: "Meetings" },
    { value: "note", label: "Notes" },
    { value: "deal_created", label: "Deals Created" },
    { value: "deal_updated", label: "Deals Updated" }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-indigo-600 bg-clip-text text-transparent mb-2">
            Activities
          </h1>
          <p className="text-gray-600">Track all interactions and updates</p>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
      >
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <SearchBar
              placeholder="Search activities by description or contact..."
              onSearch={handleSearch}
            />
          </div>
          <div className="w-full md:w-64">
            <Select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
              {activityTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </Select>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
      >
        {filteredActivities.length === 0 ? (
          <Empty
            icon="Activity"
            title="No Activities Found"
            message={
              searchQuery || filterType !== "all"
                ? "No activities match your filters. Try adjusting your search."
                : "No activities recorded yet. Activities will appear here as you interact with contacts and deals."
            }
          />
        ) : (
          <ActivityFeed activities={filteredActivities} contacts={contacts} />
        )}
      </motion.div>
    </div>
  );
};

export default Activities;