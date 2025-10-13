import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import SearchBar from "@/components/molecules/SearchBar";
import Modal from "@/components/molecules/Modal";
import Loading from "@/components/ui/Loading";
import Empty from "@/components/ui/Empty";
import Error from "@/components/ui/Error";
import SalesOrderForm from "@/components/organisms/SalesOrderForm";
import salesOrderService from "@/services/api/salesOrderService";
import { contactService } from "@/services/api/contactService";

const SalesOrders = () => {
  const [salesOrders, setSalesOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSalesOrder, setSelectedSalesOrder] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [salesOrdersData, customersData] = await Promise.all([
        salesOrderService.getAll(),
        contactService.getAll()
      ]);

      setSalesOrders(salesOrdersData || []);
      setCustomers(customersData || []);
    } catch (err) {
      setError("Failed to load data");
      console.error("Error loading sales orders data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSalesOrder = () => {
    setSelectedSalesOrder(null);
    setIsModalOpen(true);
  };

  const handleEditSalesOrder = async (salesOrder) => {
    setModalLoading(true);
    setSelectedSalesOrder(null);
    setIsModalOpen(true);

    try {
      const fullSalesOrder = await salesOrderService.getById(salesOrder.Id);
      if (fullSalesOrder) {
        setSelectedSalesOrder(fullSalesOrder);
      }
    } catch (error) {
      console.error("Error loading sales order details:", error);
    } finally {
      setModalLoading(false);
    }
  };

  const handleDeleteSalesOrder = async (salesOrderId) => {
    if (window.confirm("Are you sure you want to delete this sales order?")) {
      const success = await salesOrderService.delete(salesOrderId);
      if (success) {
        loadData();
      }
    }
  };

  const handleSubmitSalesOrder = async (data) => {
    try {
      if (selectedSalesOrder) {
        await salesOrderService.update(selectedSalesOrder.Id, data);
      } else {
        await salesOrderService.create(data);
      }
      setIsModalOpen(false);
      loadData();
    } catch (error) {
      console.error("Error saving sales order:", error);
    }
  };

  const getStatusBadgeVariant = (status) => {
    switch (status?.toLowerCase()) {
      case "draft": return "secondary";
      case "confirmed": return "info";
      case "shipped": return "warning";
      case "delivered": return "success";
      case "cancelled": return "error";
      default: return "secondary";
    }
  };

  const getCustomerName = (customerId) => {
    if (!customerId || typeof customerId !== "object") return "No Customer";
    return customerId.Name || "Unknown Customer";
  };

  const filteredSalesOrders = salesOrders.filter(salesOrder => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      salesOrder.Name?.toLowerCase().includes(searchLower) ||
      salesOrder.order_number_c?.toLowerCase().includes(searchLower) ||
      getCustomerName(salesOrder.customer_id_c).toLowerCase().includes(searchLower) ||
      salesOrder.status_c?.toLowerCase().includes(searchLower)
    );
  });

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Sales Orders</h1>
          <p className="text-gray-600 mt-1">Manage your sales orders</p>
        </div>
        <Button onClick={handleCreateSalesOrder} className="flex items-center gap-2">
          <ApperIcon name="Plus" size={16} />
          Create Sales Order
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <SearchBar
          placeholder="Search sales orders..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onSearch={() => {}}
          className="flex-1 max-w-md"
        />
      </div>

      {filteredSalesOrders.length === 0 ? (
        <Empty
          title="No sales orders found"
          description={searchTerm ? "No sales orders match your search criteria." : "Start by creating your first sales order."}
          action={!searchTerm ? { label: "Create Sales Order", onClick: handleCreateSalesOrder } : null}
        />
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order Number
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Amount
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredSalesOrders.map((salesOrder) => (
                  <motion.tr
                    key={salesOrder.Id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {salesOrder.Name || "Untitled Order"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {salesOrder.order_number_c || "No Number"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {getCustomerName(salesOrder.customer_id_c)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={getStatusBadgeVariant(salesOrder.status_c)}>
                        {salesOrder.status_c || "Draft"}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {salesOrder.order_date_c 
                        ? format(new Date(salesOrder.order_date_c), "MMM dd, yyyy")
                        : "No date"
                      }
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {salesOrder.total_amount_c 
                        ? `$${parseFloat(salesOrder.total_amount_c).toLocaleString()}`
                        : "$0.00"
                      }
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditSalesOrder(salesOrder)}
                        >
                          <ApperIcon name="Edit" size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteSalesOrder(salesOrder.Id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <ApperIcon name="Trash2" size={16} />
                        </Button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <AnimatePresence>
        {isModalOpen && (
          <Modal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            title={selectedSalesOrder ? "Edit Sales Order" : "Create Sales Order"}
            maxWidth="4xl"
          >
            {modalLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loading />
              </div>
            ) : (
              <SalesOrderForm
                salesOrder={selectedSalesOrder}
                customers={customers}
                onSubmit={handleSubmitSalesOrder}
                onCancel={() => setIsModalOpen(false)}
              />
            )}
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SalesOrders;