import { toast } from 'react-toastify';

const { ApperClient } = window.ApperSDK;

const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

const tableName = 'quotes_c';

// Get all quotes with lookup field data
const getAll = async () => {
  try {
    const params = {
      fields: [
        {"field": {"Name": "Id"}},
        {"field": {"Name": "Name"}},
        {"field": {"Name": "quote_date_c"}},
        {"field": {"Name": "status_c"}},
        {"field": {"Name": "delivery_method_c"}},
        {"field": {"Name": "expires_on_c"}},
        {"field": {"Name": "company_id_c"}},
        {"field": {"Name": "contact_id_c"}},
        {"field": {"Name": "deal_id_c"}},
        {"field": {"Name": "billing_address_name_c"}},
        {"field": {"Name": "shipping_address_name_c"}}
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
    console.error("Error fetching quotes:", error?.response?.data?.message || error);
    toast.error("Failed to fetch quotes");
    return [];
  }
};

// Get quote by ID with all fields
const getById = async (id) => {
  try {
    const params = {
      fields: [
        {"field": {"Name": "Id"}},
        {"field": {"Name": "Name"}},
        {"field": {"Name": "quote_date_c"}},
        {"field": {"Name": "status_c"}},
        {"field": {"Name": "delivery_method_c"}},
        {"field": {"Name": "expires_on_c"}},
        {"field": {"Name": "company_id_c"}},
        {"field": {"Name": "contact_id_c"}},
        {"field": {"Name": "deal_id_c"}},
        {"field": {"Name": "billing_address_name_c"}},
        {"field": {"Name": "billing_address_street_c"}},
        {"field": {"Name": "billing_address_city_c"}},
        {"field": {"Name": "billing_address_state_c"}},
        {"field": {"Name": "billing_address_country_c"}},
        {"field": {"Name": "billing_address_pincode_c"}},
        {"field": {"Name": "shipping_address_name_c"}},
        {"field": {"Name": "shipping_address_street_c"}},
        {"field": {"Name": "shipping_address_city_c"}},
        {"field": {"Name": "shipping_address_state_c"}},
        {"field": {"Name": "shipping_address_country_c"}},
        {"field": {"Name": "shipping_address_pincode_c"}}
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
    console.error(`Error fetching quote ${id}:`, error?.response?.data?.message || error);
    toast.error("Failed to fetch quote");
    return null;
  }
};

// Create new quote
const create = async (data) => {
  try {
    // Only include updateable fields
    const quoteData = {
      Name: data.Name,
      quote_date_c: data.quote_date_c,
      status_c: data.status_c,
      delivery_method_c: data.delivery_method_c,
      expires_on_c: data.expires_on_c,
      company_id_c: parseInt(data.company_id_c),
      contact_id_c: parseInt(data.contact_id_c),
      deal_id_c: parseInt(data.deal_id_c),
      billing_address_name_c: data.billing_address_name_c,
      billing_address_street_c: data.billing_address_street_c,
      billing_address_city_c: data.billing_address_city_c,
      billing_address_state_c: data.billing_address_state_c,
      billing_address_country_c: data.billing_address_country_c,
      billing_address_pincode_c: data.billing_address_pincode_c,
      shipping_address_name_c: data.shipping_address_name_c,
      shipping_address_street_c: data.shipping_address_street_c,
      shipping_address_city_c: data.shipping_address_city_c,
      shipping_address_state_c: data.shipping_address_state_c,
      shipping_address_country_c: data.shipping_address_country_c,
      shipping_address_pincode_c: data.shipping_address_pincode_c
    };

    const params = {
      records: [quoteData]
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
        console.error(`Failed to create ${failed.length} quotes:`, JSON.stringify(failed));
        failed.forEach(record => {
          record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
          if (record.message) toast.error(record.message);
        });
      }

      if (successful.length > 0) {
        toast.success("Quote created successfully");
        return successful[0].data;
      }
    }

    return null;
  } catch (error) {
    console.error("Error creating quote:", error?.response?.data?.message || error);
    toast.error("Failed to create quote");
    return null;
  }
};

// Update existing quote
const update = async (id, data) => {
  try {
    // Only include updateable fields
    const quoteData = {
      Id: parseInt(id),
      Name: data.Name,
      quote_date_c: data.quote_date_c,
      status_c: data.status_c,
      delivery_method_c: data.delivery_method_c,
      expires_on_c: data.expires_on_c,
      company_id_c: parseInt(data.company_id_c),
      contact_id_c: parseInt(data.contact_id_c),
      deal_id_c: parseInt(data.deal_id_c),
      billing_address_name_c: data.billing_address_name_c,
      billing_address_street_c: data.billing_address_street_c,
      billing_address_city_c: data.billing_address_city_c,
      billing_address_state_c: data.billing_address_state_c,
      billing_address_country_c: data.billing_address_country_c,
      billing_address_pincode_c: data.billing_address_pincode_c,
      shipping_address_name_c: data.shipping_address_name_c,
      shipping_address_street_c: data.shipping_address_street_c,
      shipping_address_city_c: data.shipping_address_city_c,
      shipping_address_state_c: data.shipping_address_state_c,
      shipping_address_country_c: data.shipping_address_country_c,
      shipping_address_pincode_c: data.shipping_address_pincode_c
    };

    const params = {
      records: [quoteData]
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
        console.error(`Failed to update ${failed.length} quotes:`, JSON.stringify(failed));
        failed.forEach(record => {
          record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
          if (record.message) toast.error(record.message);
        });
      }

      if (successful.length > 0) {
        toast.success("Quote updated successfully");
        return successful[0].data;
      }
    }

    return null;
  } catch (error) {
    console.error("Error updating quote:", error?.response?.data?.message || error);
    toast.error("Failed to update quote");
    return null;
  }
};

// Delete quote
const deleteQuote = async (id) => {
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
        console.error(`Failed to delete ${failed.length} quotes:`, JSON.stringify(failed));
        failed.forEach(record => {
          if (record.message) toast.error(record.message);
        });
      }

      if (successful.length > 0) {
        toast.success("Quote deleted successfully");
        return true;
      }
    }

    return false;
  } catch (error) {
    console.error("Error deleting quote:", error?.response?.data?.message || error);
    toast.error("Failed to delete quote");
    return false;
  }
};

export default {
  getAll,
  getById,
  create,
  update,
  delete: deleteQuote
};