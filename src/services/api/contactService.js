const { ApperClient } = window.ApperSDK;

const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

export const contactService = {
  getAll: async () => {
    try {
      const response = await apperClient.fetchRecords('contact_c', {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "company_c"}},
          {"field": {"Name": "position_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "deal_value_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "last_contact_c"}},
          {"field": {"Name": "tags_c"}}
        ],
        orderBy: [{"fieldName": "Id", "sorttype": "DESC"}]
      });

      if (!response.success) {
        console.error("Error fetching contacts:", response.message);
        throw new Error(response.message);
      }

      // Transform database field names to UI field names
      return response.data.map(contact => ({
        Id: contact.Id,
        name: contact.name_c || '',
        email: contact.email_c || '',
        phone: contact.phone_c || '',
        company: contact.company_c || '',
        position: contact.position_c || '',
        status: contact.status_c || 'Lead',
        dealValue: parseFloat(contact.deal_value_c) || 0,
        notes: contact.notes_c || '',
        createdAt: contact.created_at_c ? new Date(contact.created_at_c).getTime() : Date.now(),
        lastContact: contact.last_contact_c ? new Date(contact.last_contact_c).getTime() : Date.now(),
        tags: contact.tags_c || ''
      }));
    } catch (error) {
      console.error("Error in contactService.getAll:", error.message);
      throw error;
    }
  },

  getById: async (id) => {
    try {
      const response = await apperClient.getRecordById('contact_c', parseInt(id), {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "company_c"}},
          {"field": {"Name": "position_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "deal_value_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "last_contact_c"}},
          {"field": {"Name": "tags_c"}}
        ]
      });

      if (!response.success) {
        console.error("Error fetching contact:", response.message);
        throw new Error(response.message);
      }

      if (!response.data) {
        throw new Error("Contact not found");
      }

      // Transform database field names to UI field names
      const contact = response.data;
      return {
        Id: contact.Id,
        name: contact.name_c || '',
        email: contact.email_c || '',
        phone: contact.phone_c || '',
        company: contact.company_c || '',
        position: contact.position_c || '',
        status: contact.status_c || 'Lead',
        dealValue: parseFloat(contact.deal_value_c) || 0,
        notes: contact.notes_c || '',
        createdAt: contact.created_at_c ? new Date(contact.created_at_c).getTime() : Date.now(),
        lastContact: contact.last_contact_c ? new Date(contact.last_contact_c).getTime() : Date.now(),
        tags: contact.tags_c || ''
      };
    } catch (error) {
      console.error("Error in contactService.getById:", error.message);
      throw error;
    }
  },

  create: async (contactData) => {
    try {
      // Transform UI field names to database field names
      const dbContactData = {
        name_c: contactData.name || '',
        email_c: contactData.email || '',
        phone_c: contactData.phone || '',
        company_c: contactData.company || '',
        position_c: contactData.position || '',
        status_c: contactData.status || 'Lead',
        deal_value_c: parseFloat(contactData.dealValue) || 0,
        notes_c: contactData.notes || '',
        created_at_c: new Date().toISOString(),
        last_contact_c: new Date().toISOString(),
        tags_c: contactData.tags || ''
      };

      const response = await apperClient.createRecord('contact_c', {
        records: [dbContactData]
      });

      if (!response.success) {
        console.error("Error creating contact:", response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} contacts:`, failed);
          failed.forEach(record => {
            if (record.errors) {
              record.errors.forEach(error => {
                throw new Error(`${error.fieldLabel}: ${error.message}`);
              });
            }
            if (record.message) throw new Error(record.message);
          });
        }
        
        if (successful.length > 0) {
          const created = successful[0].data;
          // Transform back to UI field names
          return {
            Id: created.Id,
            name: created.name_c || '',
            email: created.email_c || '',
            phone: created.phone_c || '',
            company: created.company_c || '',
            position: created.position_c || '',
            status: created.status_c || 'Lead',
            dealValue: parseFloat(created.deal_value_c) || 0,
            notes: created.notes_c || '',
            createdAt: created.created_at_c ? new Date(created.created_at_c).getTime() : Date.now(),
            lastContact: created.last_contact_c ? new Date(created.last_contact_c).getTime() : Date.now(),
            tags: created.tags_c || ''
          };
        }
      }
      
      throw new Error("No successful record creation");
    } catch (error) {
      console.error("Error in contactService.create:", error.message);
      throw error;
    }
  },

  update: async (id, contactData) => {
    try {
      // Transform UI field names to database field names
      const dbContactData = {
        Id: parseInt(id),
        name_c: contactData.name || '',
        email_c: contactData.email || '',
        phone_c: contactData.phone || '',
        company_c: contactData.company || '',
        position_c: contactData.position || '',
        status_c: contactData.status || 'Lead',
        deal_value_c: parseFloat(contactData.dealValue) || 0,
        notes_c: contactData.notes || '',
        last_contact_c: new Date().toISOString(),
        tags_c: contactData.tags || ''
      };

      const response = await apperClient.updateRecord('contact_c', {
        records: [dbContactData]
      });

      if (!response.success) {
        console.error("Error updating contact:", response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} contacts:`, failed);
          failed.forEach(record => {
            if (record.errors) {
              record.errors.forEach(error => {
                throw new Error(`${error.fieldLabel}: ${error.message}`);
              });
            }
            if (record.message) throw new Error(record.message);
          });
        }
        
        if (successful.length > 0) {
          const updated = successful[0].data;
          // Transform back to UI field names
          return {
            Id: updated.Id,
            name: updated.name_c || '',
            email: updated.email_c || '',
            phone: updated.phone_c || '',
            company: updated.company_c || '',
            position: updated.position_c || '',
            status: updated.status_c || 'Lead',
            dealValue: parseFloat(updated.deal_value_c) || 0,
            notes: updated.notes_c || '',
            createdAt: updated.created_at_c ? new Date(updated.created_at_c).getTime() : Date.now(),
            lastContact: updated.last_contact_c ? new Date(updated.last_contact_c).getTime() : Date.now(),
            tags: updated.tags_c || ''
          };
        }
      }
      
      throw new Error("No successful record update");
    } catch (error) {
      console.error("Error in contactService.update:", error.message);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const response = await apperClient.deleteRecord('contact_c', {
        RecordIds: [parseInt(id)]
      });

      if (!response.success) {
        console.error("Error deleting contact:", response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} contacts:`, failed);
          failed.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        
        return successful.length > 0;
      }
      
      return true;
    } catch (error) {
      console.error("Error in contactService.delete:", error.message);
      throw error;
    }
  },

// Advanced filtering support
  search: async (filters = {}) => {
    try {
      // Build filter conditions for ApperClient
      const filterConditions = [];
      
      if (filters.status) {
        filterConditions.push({
          field: "status_c",
          operator: "equals",
          value: filters.status
        });
      }

      if (filters.company) {
        filterConditions.push({
          field: "company_c",
          operator: "contains",
          value: filters.company
        });
      }

      if (filters.dealValueMin !== undefined) {
        filterConditions.push({
          field: "deal_value_c",
          operator: "greaterThanOrEqual",
          value: parseFloat(filters.dealValueMin)
        });
      }

      if (filters.dealValueMax !== undefined) {
        filterConditions.push({
          field: "deal_value_c",
          operator: "lessThanOrEqual",
          value: parseFloat(filters.dealValueMax)
        });
      }

      if (filters.dateFrom) {
        filterConditions.push({
          field: "last_contact_c",
          operator: "greaterThanOrEqual",
          value: new Date(filters.dateFrom).toISOString()
        });
      }

      if (filters.dateTo) {
        filterConditions.push({
          field: "last_contact_c",
          operator: "lessThanOrEqual",
          value: new Date(filters.dateTo).toISOString()
        });
      }

      const response = await apperClient.fetchRecords('contact_c', {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "company_c"}},
          {"field": {"Name": "position_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "deal_value_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "last_contact_c"}},
          {"field": {"Name": "tags_c"}}
        ],
        filters: filterConditions.length > 0 ? filterConditions : undefined,
        orderBy: [{"fieldName": "Id", "sorttype": "DESC"}]
      });

      if (!response.success) {
        console.error("Error searching contacts:", response.message);
        throw new Error(response.message);
      }

      // Transform database field names to UI field names
      return response.data.map(contact => ({
        Id: contact.Id,
        name: contact.name_c || '',
        email: contact.email_c || '',
        phone: contact.phone_c || '',
        company: contact.company_c || '',
        position: contact.position_c || '',
        status: contact.status_c || 'Lead',
        dealValue: parseFloat(contact.deal_value_c) || 0,
        notes: contact.notes_c || '',
        createdAt: contact.created_at_c ? new Date(contact.created_at_c).getTime() : Date.now(),
        lastContact: contact.last_contact_c ? new Date(contact.last_contact_c).getTime() : Date.now(),
        tags: contact.tags_c || ''
      }));
    } catch (error) {
      console.error("Error in contactService.search:", error.message);
      throw error;
    }
  }
};