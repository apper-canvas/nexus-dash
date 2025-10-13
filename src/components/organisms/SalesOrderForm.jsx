import { useState, useEffect } from "react";
import FormField from "@/components/molecules/FormField";
import Button from "@/components/atoms/Button";

const SalesOrderForm = ({ salesOrder, customers, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    Name: "",
    order_number_c: "",
    order_date_c: "",
    total_amount_c: "",
    status_c: "Draft",
    customer_id_c: "",
    shipping_address_c: "",
    billing_address_c: "",
    description_c: ""
  });

  useEffect(() => {
    if (salesOrder) {
      setFormData({
        Name: salesOrder.Name || "",
        order_number_c: salesOrder.order_number_c || "",
        order_date_c: salesOrder.order_date_c ? new Date(salesOrder.order_date_c).toISOString().split("T")[0] : "",
        total_amount_c: salesOrder.total_amount_c || "",
        status_c: salesOrder.status_c || "Draft",
        customer_id_c: salesOrder.customer_id_c?.Id || "",
        shipping_address_c: salesOrder.shipping_address_c || "",
        billing_address_c: salesOrder.billing_address_c || "",
        description_c: salesOrder.description_c || ""
      });
    }
  }, [salesOrder]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Helper function to validate date before conversion
    const isValidDate = (dateString) => {
      if (!dateString || dateString.trim() === '') return false;
      const date = new Date(dateString);
      return !isNaN(date.getTime());
    };

    const submitData = {
      ...formData,
      order_date_c: isValidDate(formData.order_date_c) ? new Date(formData.order_date_c).toISOString() : null
    };

    onSubmit(submitData);
  };

  const copyBillingToShipping = () => {
    setFormData(prev => ({
      ...prev,
      shipping_address_c: prev.billing_address_c
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Basic Information */}
      <div className="space-y-6">
        <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Order Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            label="Order Name"
            id="Name"
            name="Name"
            value={formData.Name}
            onChange={handleChange}
            required
            placeholder="Q4 2024 Enterprise Order"
          />
          
          <FormField
            label="Order Number"
            id="order_number_c"
            name="order_number_c"
            value={formData.order_number_c}
            onChange={handleChange}
            required
            placeholder="SO-2024-001"
          />
          
          <FormField
            label="Order Date"
            id="order_date_c"
            name="order_date_c"
            type="date"
            value={formData.order_date_c}
            onChange={handleChange}
            required
          />
          
          <FormField
            label="Total Amount"
            id="total_amount_c"
            name="total_amount_c"
            type="number"
            step="0.01"
            value={formData.total_amount_c}
            onChange={handleChange}
            required
            placeholder="0.00"
          />
          
          <FormField
            label="Status"
            id="status_c"
            name="status_c"
            component="select"
            value={formData.status_c}
            onChange={handleChange}
            required
          >
            <option value="Draft">Draft</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </FormField>
          
          <FormField
            label="Customer"
            id="customer_id_c"
            name="customer_id_c"
            component="select"
            value={formData.customer_id_c}
            onChange={handleChange}
            required
          >
            <option value="">Select Customer</option>
            {customers.map((customer) => (
              <option key={customer.Id} value={customer.Id}>
                {customer.name || customer.Name}
              </option>
            ))}
          </FormField>
        </div>
      </div>

      {/* Description */}
      <div className="space-y-6">
        <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Description</h3>
        
        <FormField
          label="Description"
          id="description_c"
          name="description_c"
          component="textarea"
          value={formData.description_c}
          onChange={handleChange}
          placeholder="Order details and notes..."
          rows={4}
        />
      </div>

      {/* Billing Address */}
      <div className="space-y-6">
        <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Billing Address</h3>
        
        <FormField
          label="Billing Address"
          id="billing_address_c"
          name="billing_address_c"
          component="textarea"
          value={formData.billing_address_c}
          onChange={handleChange}
          placeholder="123 Business Street&#10;Suite 100&#10;City, State 12345"
          rows={4}
        />
      </div>

      {/* Shipping Address */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b pb-2">
          <h3 className="text-lg font-medium text-gray-900">Shipping Address</h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={copyBillingToShipping}
          >
            Copy from Billing
          </Button>
        </div>
        
        <FormField
          label="Shipping Address"
          id="shipping_address_c"
          name="shipping_address_c"
          component="textarea"
          value={formData.shipping_address_c}
          onChange={handleChange}
          placeholder="123 Shipping Street&#10;Suite 200&#10;City, State 12345"
          rows={4}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-3 pt-6 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="primary">
          {salesOrder ? "Update Sales Order" : "Create Sales Order"}
        </Button>
      </div>
    </form>
  );
};

export default SalesOrderForm;