import { toast } from 'react-toastify';

const { ApperClient } = window.ApperSDK;

const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

const tableName = 'sales_orders_c';

// Get all sales orders with lookup field data
const getAll = async () => {
  try {
    const params = {
      fields: [
        {"field": {"Name": "Id"}},
        {"field": {"Name": "Name"}},
        {"field": {"Name": "order_number_c"}},
        {"field": {"Name": "order_date_c"}},
        {"field": {"Name": "total_amount_c"}},
        {"field": {"Name": "status_c"}},
        {"field": {"Name": "customer_id_c"}},
        {"field": {"Name": "shipping_address_c"}},
        {"field": {"Name": "billing_address_c"}},
        {"field": {"Name": "description_c"}}
      ],
      orderBy: [{"fieldName": "Id", "sorttype": "DESC"}],
      pagingInfo: {"limit": 50, "offset": 0}
    };

    const response = await apperClient.fetchRecords(tableName, params);

    if (!response.success) {
      console.error(response.message);
      toast.error(response.message);
      return [];
    }

    return response.data || [];
  } catch (error) {
    console.error("Error fetching sales orders:", error?.response?.data?.message || error);
    toast.error("Failed to fetch sales orders");
    return [];
  }
};

// Get sales order by ID with all fields
const getById = async (id) => {
  try {
    const params = {
      fields: [
        {"field": {"Name": "Id"}},
        {"field": {"Name": "Name"}},
        {"field": {"Name": "order_number_c"}},
        {"field": {"Name": "order_date_c"}},
        {"field": {"Name": "total_amount_c"}},
        {"field": {"Name": "status_c"}},
        {"field": {"Name": "customer_id_c"}},
        {"field": {"Name": "shipping_address_c"}},
        {"field": {"Name": "billing_address_c"}},
        {"field": {"Name": "description_c"}}
      ]
    };

    const response = await apperClient.getRecordById(tableName, id, params);

    if (!response.success) {
      console.error(response.message);
      toast.error(response.message);
      return null;
    }

    return response.data;
  } catch (error) {
    console.error(`Error fetching sales order ${id}:`, error?.response?.data?.message || error);
    toast.error("Failed to fetch sales order");
    return null;
  }
};

// Create new sales order
const create = async (data) => {
  try {
    // Only include updateable fields
    const salesOrderData = {
      Name: data.Name,
      order_number_c: data.order_number_c,
      order_date_c: data.order_date_c,
      total_amount_c: parseFloat(data.total_amount_c) || 0,
      status_c: data.status_c,
      customer_id_c: parseInt(data.customer_id_c),
      shipping_address_c: data.shipping_address_c,
      billing_address_c: data.billing_address_c,
      description_c: data.description_c
    };

    const params = {
      records: [salesOrderData]
    };

    const response = await apperClient.createRecord(tableName, params);

    if (!response.success) {
      console.error(response.message);
      toast.error(response.message);
      return null;
    }

    if (response.results) {
      const successful = response.results.filter(r => r.success);
      const failed = response.results.filter(r => !r.success);
      
      if (failed.length > 0) {
        console.error(`Failed to create ${failed.length} sales orders:`, JSON.stringify(failed));
        failed.forEach(record => {
          record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
          if (record.message) toast.error(record.message);
        });
      }

      if (successful.length > 0) {
        toast.success("Sales order created successfully");
        return successful[0].data;
      }
    }

    return null;
  } catch (error) {
    console.error("Error creating sales order:", error?.response?.data?.message || error);
    toast.error("Failed to create sales order");
    return null;
  }
};

// Update existing sales order
const update = async (id, data) => {
  try {
    // Only include updateable fields
    const salesOrderData = {
      Id: parseInt(id),
      Name: data.Name,
      order_number_c: data.order_number_c,
      order_date_c: data.order_date_c,
      total_amount_c: parseFloat(data.total_amount_c) || 0,
      status_c: data.status_c,
      customer_id_c: parseInt(data.customer_id_c),
      shipping_address_c: data.shipping_address_c,
      billing_address_c: data.billing_address_c,
      description_c: data.description_c
    };

    const params = {
      records: [salesOrderData]
    };

    const response = await apperClient.updateRecord(tableName, params);

    if (!response.success) {
      console.error(response.message);
      toast.error(response.message);
      return null;
    }

    if (response.results) {
      const successful = response.results.filter(r => r.success);
      const failed = response.results.filter(r => !r.success);
      
      if (failed.length > 0) {
        console.error(`Failed to update ${failed.length} sales orders:`, JSON.stringify(failed));
        failed.forEach(record => {
          record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
          if (record.message) toast.error(record.message);
        });
      }

      if (successful.length > 0) {
        toast.success("Sales order updated successfully");
        return successful[0].data;
      }
    }

    return null;
  } catch (error) {
    console.error("Error updating sales order:", error?.response?.data?.message || error);
    toast.error("Failed to update sales order");
    return null;
  }
};

// Delete sales order
const deleteSalesOrder = async (id) => {
  try {
    const params = {
      RecordIds: [parseInt(id)]
    };

    const response = await apperClient.deleteRecord(tableName, params);

    if (!response.success) {
      console.error(response.message);
      toast.error(response.message);
      return false;
    }

    if (response.results) {
      const successful = response.results.filter(r => r.success);
      const failed = response.results.filter(r => !r.success);
      
      if (failed.length > 0) {
        console.error(`Failed to delete ${failed.length} sales orders:`, JSON.stringify(failed));
        failed.forEach(record => {
          if (record.message) toast.error(record.message);
        });
      }

      if (successful.length > 0) {
        toast.success("Sales order deleted successfully");
        return true;
      }
    }

    return false;
  } catch (error) {
    console.error("Error deleting sales order:", error?.response?.data?.message || error);
    toast.error("Failed to delete sales order");
    return false;
  }
};

export default {
  getAll,
  getById,
  create,
  update,
  delete: deleteSalesOrder
};