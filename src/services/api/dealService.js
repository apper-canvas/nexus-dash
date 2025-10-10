const { ApperClient } = window.ApperSDK;

const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

export const dealService = {
  getAll: async () => {
    try {
      const response = await apperClient.fetchRecords('deal_c', {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "value_c"}},
          {"field": {"Name": "stage_c"}},
          {"field": {"Name": "probability_c"}},
          {"field": {"Name": "expected_close_date_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "updated_at_c"}},
          {
            "field": {"name": "contact_id_c"}, 
            "referenceField": {"field": {"Name": "name_c"}}
          }
        ],
        orderBy: [{"fieldName": "Id", "sorttype": "DESC"}]
      });

      if (!response.success) {
        console.error("Error fetching deals:", response.message);
        throw new Error(response.message);
      }

      // Transform database field names to UI field names
      return response.data.map(deal => ({
        Id: deal.Id,
        title: deal.title_c || '',
        value: parseFloat(deal.value_c) || 0,
        stage: deal.stage_c || 'Lead',
        probability: parseInt(deal.probability_c) || 0,
        expectedCloseDate: deal.expected_close_date_c ? new Date(deal.expected_close_date_c).getTime() : Date.now(),
        notes: deal.notes_c || '',
        status: deal.status_c || 'Open',
        contactId: deal.contact_id_c?.Id || deal.contact_id_c || null,
        createdAt: deal.created_at_c ? new Date(deal.created_at_c).getTime() : Date.now(),
        updatedAt: deal.updated_at_c ? new Date(deal.updated_at_c).getTime() : Date.now(),
        description: deal.notes_c || ''
      }));
    } catch (error) {
      console.error("Error in dealService.getAll:", error.message);
      throw error;
    }
  },

  search: async (filters = {}) => {
    try {
      const whereConditions = [];

      if (filters.stage) {
        whereConditions.push({
          "FieldName": "stage_c", 
          "Operator": "EqualTo", 
          "Values": [filters.stage]
        });
      }

      if (filters.dealValueMin !== undefined) {
        whereConditions.push({
          "FieldName": "value_c", 
          "Operator": "GreaterThanOrEqualTo", 
          "Values": [parseFloat(filters.dealValueMin)]
        });
      }

      if (filters.dealValueMax !== undefined) {
        whereConditions.push({
          "FieldName": "value_c", 
          "Operator": "LessThanOrEqualTo", 
          "Values": [parseFloat(filters.dealValueMax)]
        });
      }

      if (filters.dateFrom) {
        whereConditions.push({
          "FieldName": "expected_close_date_c", 
          "Operator": "GreaterThanOrEqualTo", 
          "Values": [new Date(filters.dateFrom).toISOString()]
        });
      }

      if (filters.dateTo) {
        whereConditions.push({
          "FieldName": "expected_close_date_c", 
          "Operator": "LessThanOrEqualTo", 
          "Values": [new Date(filters.dateTo).toISOString()]
        });
      }

      const response = await apperClient.fetchRecords('deal_c', {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "value_c"}},
          {"field": {"Name": "stage_c"}},
          {"field": {"Name": "probability_c"}},
          {"field": {"Name": "expected_close_date_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "updated_at_c"}},
          {
            "field": {"name": "contact_id_c"}, 
            "referenceField": {"field": {"Name": "name_c"}}
          }
        ],
        where: whereConditions,
        orderBy: [{"fieldName": "Id", "sorttype": "DESC"}]
      });

      if (!response.success) {
        console.error("Error searching deals:", response.message);
        throw new Error(response.message);
      }

      return response.data.map(deal => ({
        Id: deal.Id,
        title: deal.title_c || '',
        value: parseFloat(deal.value_c) || 0,
        stage: deal.stage_c || 'Lead',
        probability: parseInt(deal.probability_c) || 0,
        expectedCloseDate: deal.expected_close_date_c ? new Date(deal.expected_close_date_c).getTime() : Date.now(),
        notes: deal.notes_c || '',
        status: deal.status_c || 'Open',
        contactId: deal.contact_id_c?.Id || deal.contact_id_c || null,
        createdAt: deal.created_at_c ? new Date(deal.created_at_c).getTime() : Date.now(),
        updatedAt: deal.updated_at_c ? new Date(deal.updated_at_c).getTime() : Date.now(),
        description: deal.notes_c || ''
      }));
    } catch (error) {
      console.error("Error in dealService.search:", error.message);
      throw error;
    }
  },

  getById: async (id) => {
    try {
      const response = await apperClient.getRecordById('deal_c', parseInt(id), {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "value_c"}},
          {"field": {"Name": "stage_c"}},
          {"field": {"Name": "probability_c"}},
          {"field": {"Name": "expected_close_date_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "updated_at_c"}},
          {
            "field": {"name": "contact_id_c"}, 
            "referenceField": {"field": {"Name": "name_c"}}
          }
        ]
      });

      if (!response.success) {
        console.error("Error fetching deal:", response.message);
        throw new Error(response.message);
      }

      if (!response.data) {
        throw new Error("Deal not found");
      }

      const deal = response.data;
      return {
        Id: deal.Id,
        title: deal.title_c || '',
        value: parseFloat(deal.value_c) || 0,
        stage: deal.stage_c || 'Lead',
        probability: parseInt(deal.probability_c) || 0,
        expectedCloseDate: deal.expected_close_date_c ? new Date(deal.expected_close_date_c).getTime() : Date.now(),
        notes: deal.notes_c || '',
        status: deal.status_c || 'Open',
        contactId: deal.contact_id_c?.Id || deal.contact_id_c || null,
        createdAt: deal.created_at_c ? new Date(deal.created_at_c).getTime() : Date.now(),
        updatedAt: deal.updated_at_c ? new Date(deal.updated_at_c).getTime() : Date.now(),
        description: deal.notes_c || ''
      };
    } catch (error) {
      console.error("Error in dealService.getById:", error.message);
      throw error;
    }
  },

  getByContactId: async (contactId) => {
    try {
      const response = await apperClient.fetchRecords('deal_c', {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "value_c"}},
          {"field": {"Name": "stage_c"}},
          {"field": {"Name": "probability_c"}},
          {"field": {"Name": "expected_close_date_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "updated_at_c"}},
          {
            "field": {"name": "contact_id_c"}, 
            "referenceField": {"field": {"Name": "name_c"}}
          }
        ],
        where: [{
          "FieldName": "contact_id_c", 
          "Operator": "EqualTo", 
          "Values": [parseInt(contactId)]
        }],
        orderBy: [{"fieldName": "Id", "sorttype": "DESC"}]
      });

      if (!response.success) {
        console.error("Error fetching deals by contact:", response.message);
        return [];
      }

      return response.data.map(deal => ({
        Id: deal.Id,
        title: deal.title_c || '',
        value: parseFloat(deal.value_c) || 0,
        stage: deal.stage_c || 'Lead',
        probability: parseInt(deal.probability_c) || 0,
        expectedCloseDate: deal.expected_close_date_c ? new Date(deal.expected_close_date_c).getTime() : Date.now(),
        notes: deal.notes_c || '',
        status: deal.status_c || 'Open',
        contactId: deal.contact_id_c?.Id || deal.contact_id_c || null,
        createdAt: deal.created_at_c ? new Date(deal.created_at_c).getTime() : Date.now(),
        updatedAt: deal.updated_at_c ? new Date(deal.updated_at_c).getTime() : Date.now(),
        description: deal.notes_c || ''
      }));
    } catch (error) {
      console.error("Error in dealService.getByContactId:", error.message);
      return [];
    }
  },

  create: async (dealData) => {
    try {
      const dbDealData = {
        title_c: dealData.title || '',
        value_c: parseFloat(dealData.value) || 0,
        stage_c: dealData.stage || 'Lead',
        probability_c: parseInt(dealData.probability) || 0,
        expected_close_date_c: dealData.expectedCloseDate ? new Date(dealData.expectedCloseDate).toISOString() : new Date().toISOString(),
        notes_c: dealData.notes || '',
        status_c: dealData.status || 'Open',
        contact_id_c: parseInt(dealData.contactId),
        created_at_c: new Date().toISOString(),
        updated_at_c: new Date().toISOString()
      };

      const response = await apperClient.createRecord('deal_c', {
        records: [dbDealData]
      });

      if (!response.success) {
        console.error("Error creating deal:", response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} deals:`, failed);
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
          return {
            Id: created.Id,
            title: created.title_c || '',
            value: parseFloat(created.value_c) || 0,
            stage: created.stage_c || 'Lead',
            probability: parseInt(created.probability_c) || 0,
            expectedCloseDate: created.expected_close_date_c ? new Date(created.expected_close_date_c).getTime() : Date.now(),
            notes: created.notes_c || '',
            status: created.status_c || 'Open',
            contactId: created.contact_id_c || null,
            createdAt: created.created_at_c ? new Date(created.created_at_c).getTime() : Date.now(),
            updatedAt: created.updated_at_c ? new Date(created.updated_at_c).getTime() : Date.now(),
            description: created.notes_c || ''
          };
        }
      }
      
      throw new Error("No successful record creation");
    } catch (error) {
      console.error("Error in dealService.create:", error.message);
      throw error;
    }
  },

  update: async (id, dealData) => {
    try {
      const dbDealData = {
        Id: parseInt(id),
        title_c: dealData.title || '',
        value_c: parseFloat(dealData.value) || 0,
        stage_c: dealData.stage || 'Lead',
        probability_c: parseInt(dealData.probability) || 0,
        expected_close_date_c: dealData.expectedCloseDate ? new Date(dealData.expectedCloseDate).toISOString() : new Date().toISOString(),
        notes_c: dealData.notes || '',
        status_c: dealData.status || 'Open',
        contact_id_c: parseInt(dealData.contactId),
        updated_at_c: new Date().toISOString()
      };

      const response = await apperClient.updateRecord('deal_c', {
        records: [dbDealData]
      });

      if (!response.success) {
        console.error("Error updating deal:", response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} deals:`, failed);
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
          return {
            Id: updated.Id,
            title: updated.title_c || '',
            value: parseFloat(updated.value_c) || 0,
            stage: updated.stage_c || 'Lead',
            probability: parseInt(updated.probability_c) || 0,
            expectedCloseDate: updated.expected_close_date_c ? new Date(updated.expected_close_date_c).getTime() : Date.now(),
            notes: updated.notes_c || '',
            status: updated.status_c || 'Open',
            contactId: updated.contact_id_c || null,
            createdAt: updated.created_at_c ? new Date(updated.created_at_c).getTime() : Date.now(),
            updatedAt: updated.updated_at_c ? new Date(updated.updated_at_c).getTime() : Date.now(),
            description: updated.notes_c || ''
          };
        }
      }
      
      throw new Error("No successful record update");
    } catch (error) {
      console.error("Error in dealService.update:", error.message);
      throw error;
    }
  },

  updateStage: async (id, stage) => {
    try {
      const dbDealData = {
        Id: parseInt(id),
        stage_c: stage,
        updated_at_c: new Date().toISOString()
      };

      const response = await apperClient.updateRecord('deal_c', {
        records: [dbDealData]
      });

      if (!response.success) {
        console.error("Error updating deal stage:", response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} deal stages:`, failed);
          failed.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        
        if (successful.length > 0) {
          const updated = successful[0].data;
          return {
            Id: updated.Id,
            title: updated.title_c || '',
            value: parseFloat(updated.value_c) || 0,
            stage: updated.stage_c || 'Lead',
            probability: parseInt(updated.probability_c) || 0,
            expectedCloseDate: updated.expected_close_date_c ? new Date(updated.expected_close_date_c).getTime() : Date.now(),
            notes: updated.notes_c || '',
            status: updated.status_c || 'Open',
            contactId: updated.contact_id_c || null,
            createdAt: updated.created_at_c ? new Date(updated.created_at_c).getTime() : Date.now(),
            updatedAt: updated.updated_at_c ? new Date(updated.updated_at_c).getTime() : Date.now(),
            description: updated.notes_c || ''
          };
        }
      }
      
      throw new Error("No successful stage update");
    } catch (error) {
      console.error("Error in dealService.updateStage:", error.message);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const response = await apperClient.deleteRecord('deal_c', {
        RecordIds: [parseInt(id)]
      });

      if (!response.success) {
        console.error("Error deleting deal:", response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} deals:`, failed);
          failed.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        
        return successful.length > 0;
      }
      
      return true;
    } catch (error) {
      console.error("Error in dealService.delete:", error.message);
      throw error;
    }
  }
};