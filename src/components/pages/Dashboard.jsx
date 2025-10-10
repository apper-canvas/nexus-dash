import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MetricCard from "@/components/molecules/MetricCard";
import ActivityFeed from "@/components/organisms/ActivityFeed";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { contactService } from "@/services/api/contactService";
import { dealService } from "@/services/api/dealService";
import { activityService } from "@/services/api/activityService";
import { motion } from "framer-motion";
import Chart from "react-apexcharts";

const Dashboard = () => {
  const navigate = useNavigate();
  const [contacts, setContacts] = useState([]);
  const [deals, setDeals] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError("");
      const [contactsData, dealsData, activitiesData] = await Promise.all([
        contactService.getAll(),
        dealService.getAll(),
        activityService.getAll()
      ]);
      setContacts(contactsData);
      setDeals(dealsData);
      setActivities(activitiesData.slice(0, 6));
    } catch (err) {
      setError(err.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadDashboardData} />;

  const totalPipelineValue = deals
    .filter((d) => d.status === "Open")
    .reduce((sum, deal) => sum + deal.value, 0);

  const wonDeals = deals.filter((d) => d.stage === "Closed Won").length;
  const openDeals = deals.filter((d) => d.status === "Open").length;
  const activeContacts = contacts.filter((c) => c.status === "Active").length;

  const dealsByStage = {
    Lead: deals.filter((d) => d.stage === "Lead").length,
    Qualified: deals.filter((d) => d.stage === "Qualified").length,
    Proposal: deals.filter((d) => d.stage === "Proposal").length,
    Negotiation: deals.filter((d) => d.stage === "Negotiation").length,
    "Closed Won": deals.filter((d) => d.stage === "Closed Won").length,
    "Closed Lost": deals.filter((d) => d.stage === "Closed Lost").length
  };

  const chartOptions = {
    chart: {
      type: "bar",
      toolbar: { show: false }
    },
    colors: ["#2563eb"],
    plotOptions: {
      bar: {
        borderRadius: 8,
        columnWidth: "60%",
        distributed: false
      }
    },
    dataLabels: { enabled: false },
    xaxis: {
      categories: Object.keys(dealsByStage),
      labels: {
        style: { colors: "#475569", fontSize: "12px", fontWeight: 600 }
      }
    },
    yaxis: {
      labels: {
        style: { colors: "#475569", fontSize: "12px", fontWeight: 600 }
      }
    },
    grid: {
      borderColor: "#e5e7eb",
      strokeDashArray: 4
    },
    tooltip: {
      y: {
        formatter: (val) => `${val} deals`
      }
    }
  };

  const chartSeries = [
    {
      name: "Deals",
      data: Object.values(dealsByStage)
    }
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-indigo-600 bg-clip-text text-transparent mb-2">
            Dashboard
          </h1>
          <p className="text-gray-600">Track your sales performance and pipeline</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="secondary" onClick={() => navigate("/contacts")}>
            <ApperIcon name="Users" className="w-4 h-4 mr-2" />
            View Contacts
          </Button>
          <Button variant="primary" onClick={() => navigate("/pipeline")}>
            <ApperIcon name="TrendingUp" className="w-4 h-4 mr-2" />
View Deals
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          icon="DollarSign"
title="Deal Value"
          value={`$${(totalPipelineValue / 1000).toFixed(0)}K`}
          change="+12.5%"
          trend="up"
          gradient="from-blue-500 to-indigo-600"
        />
        <MetricCard
          icon="TrendingUp"
          title="Open Deals"
          value={openDeals}
          change="+8"
          trend="up"
          gradient="from-purple-500 to-purple-600"
        />
        <MetricCard
          icon="CheckCircle"
          title="Closed Won"
          value={wonDeals}
          change="+3"
          trend="up"
          gradient="from-green-500 to-green-600"
        />
        <MetricCard
          icon="Users"
          title="Active Contacts"
          value={activeContacts}
          change="+15%"
          trend="up"
          gradient="from-orange-500 to-orange-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
<h2 className="text-xl font-bold text-gray-900 mb-6">Deals by Stage</h2>
          <Chart options={chartOptions} series={chartSeries} type="bar" height={300} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Quick Stats</h2>
            <ApperIcon name="BarChart2" className="w-5 h-5 text-primary" />
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
              <div>
                <p className="text-sm text-gray-600 font-medium">Avg Deal Size</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${(totalPipelineValue / openDeals / 1000).toFixed(0)}K
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-indigo-600 rounded-lg flex items-center justify-center shadow-md">
                <ApperIcon name="DollarSign" className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
              <div>
                <p className="text-sm text-gray-600 font-medium">Win Rate</p>
                <p className="text-2xl font-bold text-gray-900">
                  {((wonDeals / deals.length) * 100).toFixed(0)}%
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-success to-green-600 rounded-lg flex items-center justify-center shadow-md">
                <ApperIcon name="Target" className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-violet-50 rounded-lg">
              <div>
                <p className="text-sm text-gray-600 font-medium">Total Contacts</p>
                <p className="text-2xl font-bold text-gray-900">{contacts.length}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center shadow-md">
                <ApperIcon name="Users" className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Recent Activities</h2>
          <Button variant="ghost" onClick={() => navigate("/activities")}>
            View All
            <ApperIcon name="ArrowRight" className="w-4 h-4 ml-2" />
          </Button>
        </div>
        <ActivityFeed activities={activities} contacts={contacts} />
      </motion.div>
    </div>
  );
};

export default Dashboard;