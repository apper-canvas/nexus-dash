const { ApperClient } = window.ApperSDK;

const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

export const activityService = {
  getAll: async () => {
    try {
      const response = await apperClient.fetchRecords('activity_c', {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "timestamp_c"}},
          {"field": {"Name": "user_id_c"}},
          {
            "field": {"name": "contact_id_c"}, 
            "referenceField": {"field": {"Name": "name_c"}}
          },
          {
            "field": {"name": "deal_id_c"}, 
            "referenceField": {"field": {"Name": "title_c"}}
          }
        ],
        orderBy: [{"fieldName": "timestamp_c", "sorttype": "DESC"}]
      });

      if (!response.success) {
        console.error("Error fetching activities:", response.message);
        throw new Error(response.message);
      }

      return response.data.map(activity => ({
        Id: activity.Id,
        type: activity.type_c || '',
        description: activity.description_c || '',
        timestamp: activity.timestamp_c ? new Date(activity.timestamp_c).getTime() : Date.now(),
        userId: activity.user_id_c || '',
        contactId: activity.contact_id_c?.Id || activity.contact_id_c || null,
        dealId: activity.deal_id_c?.Id || activity.deal_id_c || null
      }));
    } catch (error) {
      console.error("Error in activityService.getAll:", error.message);
      throw error;
    }
  },

  getById: async (id) => {
    try {
      const response = await apperClient.getRecordById('activity_c', parseInt(id), {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "timestamp_c"}},
          {"field": {"Name": "user_id_c"}},
          {
            "field": {"name": "contact_id_c"}, 
            "referenceField": {"field": {"Name": "name_c"}}
          },
          {
            "field": {"name": "deal_id_c"}, 
            "referenceField": {"field": {"Name": "title_c"}}
          }
        ]
      });

      if (!response.success) {
        console.error("Error fetching activity:", response.message);
        throw new Error(response.message);
      }

      if (!response.data) {
        throw new Error("Activity not found");
      }

      const activity = response.data;
      return {
        Id: activity.Id,
        type: activity.type_c || '',
        description: activity.description_c || '',
        timestamp: activity.timestamp_c ? new Date(activity.timestamp_c).getTime() : Date.now(),
        userId: activity.user_id_c || '',
        contactId: activity.contact_id_c?.Id || activity.contact_id_c || null,
        dealId: activity.deal_id_c?.Id || activity.deal_id_c || null
      };
    } catch (error) {
      console.error("Error in activityService.getById:", error.message);
      throw error;
    }
  },

  getByContactId: async (contactId) => {
    try {
      const response = await apperClient.fetchRecords('activity_c', {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "timestamp_c"}},
          {"field": {"Name": "user_id_c"}},
          {
            "field": {"name": "contact_id_c"}, 
            "referenceField": {"field": {"Name": "name_c"}}
          },
          {
            "field": {"name": "deal_id_c"}, 
            "referenceField": {"field": {"Name": "title_c"}}
          }
        ],
        where: [{
          "FieldName": "contact_id_c", 
          "Operator": "EqualTo", 
          "Values": [parseInt(contactId)]
        }],
        orderBy: [{"fieldName": "timestamp_c", "sorttype": "DESC"}]
      });

      if (!response.success) {
        console.error("Error fetching activities by contact:", response.message);
        return [];
      }

      return response.data.map(activity => ({
        Id: activity.Id,
        type: activity.type_c || '',
        description: activity.description_c || '',
        timestamp: activity.timestamp_c ? new Date(activity.timestamp_c).getTime() : Date.now(),
        userId: activity.user_id_c || '',
        contactId: activity.contact_id_c?.Id || activity.contact_id_c || null,
        dealId: activity.deal_id_c?.Id || activity.deal_id_c || null
      }));
    } catch (error) {
      console.error("Error in activityService.getByContactId:", error.message);
      return [];
    }
  },

  getByDealId: async (dealId) => {
    try {
      const response = await apperClient.fetchRecords('activity_c', {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "timestamp_c"}},
          {"field": {"Name": "user_id_c"}},
          {
            "field": {"name": "contact_id_c"}, 
            "referenceField": {"field": {"Name": "name_c"}}
          },
          {
            "field": {"name": "deal_id_c"}, 
            "referenceField": {"field": {"Name": "title_c"}}
          }
        ],
        where: [{
          "FieldName": "deal_id_c", 
          "Operator": "EqualTo", 
          "Values": [parseInt(dealId)]
        }],
        orderBy: [{"fieldName": "timestamp_c", "sorttype": "DESC"}]
      });

      if (!response.success) {
        console.error("Error fetching activities by deal:", response.message);
        return [];
      }

      return response.data.map(activity => ({
        Id: activity.Id,
        type: activity.type_c || '',
        description: activity.description_c || '',
        timestamp: activity.timestamp_c ? new Date(activity.timestamp_c).getTime() : Date.now(),
        userId: activity.user_id_c || '',
        contactId: activity.contact_id_c?.Id || activity.contact_id_c || null,
        dealId: activity.deal_id_c?.Id || activity.deal_id_c || null
      }));
    } catch (error) {
      console.error("Error in activityService.getByDealId:", error.message);
      return [];
    }
  },

  create: async (activityData) => {
    try {
      const dbActivityData = {
        type_c: activityData.type || '',
        description_c: activityData.description || '',
        timestamp_c: new Date().toISOString(),
        user_id_c: activityData.userId || 'system',
        contact_id_c: activityData.contactId ? parseInt(activityData.contactId) : null,
        deal_id_c: activityData.dealId ? parseInt(activityData.dealId) : null
      };

      const response = await apperClient.createRecord('activity_c', {
        records: [dbActivityData]
      });

      if (!response.success) {
        console.error("Error creating activity:", response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} activities:`, failed);
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
            type: created.type_c || '',
            description: created.description_c || '',
            timestamp: created.timestamp_c ? new Date(created.timestamp_c).getTime() : Date.now(),
            userId: created.user_id_c || '',
            contactId: created.contact_id_c || null,
            dealId: created.deal_id_c || null
          };
        }
      }
      
      throw new Error("No successful record creation");
    } catch (error) {
      console.error("Error in activityService.create:", error.message);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const response = await apperClient.deleteRecord('activity_c', {
        RecordIds: [parseInt(id)]
      });

      if (!response.success) {
        console.error("Error deleting activity:", response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} activities:`, failed);
          failed.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        
        return successful.length > 0;
      }
      
      return true;
    } catch (error) {
      console.error("Error in activityService.delete:", error.message);
      throw error;
    }
  }
};