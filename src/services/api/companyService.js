const { ApperClient } = window.ApperSDK;

const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

export const companyService = {
  getAll: async () => {
    try {
      const response = await apperClient.fetchRecords('companies_c', {
fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "industry_c"}},
          {"field": {"Name": "address_c"}},
          {"field": {"Name": "city_c"}},
          {"field": {"Name": "state_c"}},
          {"field": {"Name": "zip_code_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "website_c"}},
          {"field": {"Name": "employee_count_c"}},
          {"field": {"Name": "company_email_address_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ],
        orderBy: [{"fieldName": "Id", "sorttype": "DESC"}]
      });

      if (!response.success) {
        console.error("Error fetching companies:", response.message);
        throw new Error(response.message);
      }

      // Transform database field names to UI field names
return response.data.map(company => ({
        Id: company.Id,
        name: company.name_c || '',
        industry: company.industry_c || '',
        address: company.address_c || '',
        city: company.city_c || '',
        state: company.state_c || '',
        zipCode: company.zip_code_c || '',
        phone: company.phone_c || '',
        website: company.website_c || '',
        employeeCount: company.employee_count_c || '',
        companyEmailAddress: company.company_email_address_c || '',
        createdAt: company.CreatedOn ? new Date(company.CreatedOn).getTime() : Date.now(),
        updatedAt: company.ModifiedOn ? new Date(company.ModifiedOn).getTime() : Date.now()
      }));
    } catch (error) {
      console.error("Error in companyService.getAll:", error.message);
      throw error;
    }
  },

  search: async (filters = {}) => {
    try {
      const whereConditions = [];

      if (filters.industry) {
        whereConditions.push({
          "FieldName": "industry_c", 
          "Operator": "EqualTo", 
          "Values": [filters.industry]
        });
      }

      if (filters.city) {
        whereConditions.push({
          "FieldName": "city_c", 
          "Operator": "Contains", 
          "Values": [filters.city]
        });
      }

      if (filters.state) {
        whereConditions.push({
          "FieldName": "state_c", 
          "Operator": "Contains", 
          "Values": [filters.state]
        });
      }

      if (filters.company) {
        whereConditions.push({
          "FieldName": "name_c", 
          "Operator": "Contains", 
          "Values": [filters.company]
        });
      }

      const response = await apperClient.fetchRecords('companies_c', {
fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "industry_c"}},
          {"field": {"Name": "address_c"}},
          {"field": {"Name": "city_c"}},
          {"field": {"Name": "state_c"}},
          {"field": {"Name": "zip_code_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "website_c"}},
          {"field": {"Name": "employee_count_c"}},
          {"field": {"Name": "company_email_address_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ],
        where: whereConditions,
        orderBy: [{"fieldName": "Id", "sorttype": "DESC"}]
      });

      if (!response.success) {
        console.error("Error searching companies:", response.message);
        throw new Error(response.message);
      }

      return response.data.map(company => ({
Id: company.Id,
        name: company.name_c || '',
        industry: company.industry_c || '',
        address: company.address_c || '',
        city: company.city_c || '',
        state: company.state_c || '',
        zipCode: company.zip_code_c || '',
        phone: company.phone_c || '',
        website: company.website_c || '',
        employeeCount: company.employee_count_c || '',
        companyEmailAddress: company.company_email_address_c || '',
        createdAt: company.CreatedOn ? new Date(company.CreatedOn).getTime() : Date.now(),
        updatedAt: company.ModifiedOn ? new Date(company.ModifiedOn).getTime() : Date.now()
      }));
    } catch (error) {
      console.error("Error in companyService.search:", error.message);
      throw error;
    }
  },

  getById: async (id) => {
    try {
      const response = await apperClient.getRecordById('companies_c', parseInt(id), {
        fields: [
{"field": {"Name": "Id"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "industry_c"}},
          {"field": {"Name": "address_c"}},
          {"field": {"Name": "city_c"}},
          {"field": {"Name": "state_c"}},
          {"field": {"Name": "zip_code_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "website_c"}},
          {"field": {"Name": "employee_count_c"}},
          {"field": {"Name": "company_email_address_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ]
      });

      if (!response.success) {
        console.error("Error fetching company:", response.message);
        throw new Error(response.message);
      }

      if (!response.data) {
        throw new Error("Company not found");
      }

      const company = response.data;
return {
        Id: company.Id,
        name: company.name_c || '',
        industry: company.industry_c || '',
        address: company.address_c || '',
        city: company.city_c || '',
        state: company.state_c || '',
        zipCode: company.zip_code_c || '',
        phone: company.phone_c || '',
        website: company.website_c || '',
        employeeCount: company.employee_count_c || '',
        companyEmailAddress: company.company_email_address_c || '',
        createdAt: company.CreatedOn ? new Date(company.CreatedOn).getTime() : Date.now(),
        updatedAt: company.ModifiedOn ? new Date(company.ModifiedOn).getTime() : Date.now()
      };
    } catch (error) {
      console.error("Error in companyService.getById:", error.message);
      throw error;
    }
  },

  create: async (companyData) => {
    try {
const dbCompanyData = {
        name_c: companyData.name || '',
        industry_c: companyData.industry || '',
        address_c: companyData.address || '',
        city_c: companyData.city || '',
        state_c: companyData.state || '',
        zip_code_c: companyData.zipCode || '',
        phone_c: companyData.phone || '',
        website_c: companyData.website || '',
        employee_count_c: companyData.employeeCount ? parseInt(companyData.employeeCount) : null,
        company_email_address_c: companyData.companyEmailAddress || ''
      };
      const response = await apperClient.createRecord('companies_c', {
        records: [dbCompanyData]
      });

      if (!response.success) {
        console.error("Error creating company:", response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} companies:`, failed);
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
name: created.name_c || '',
            industry: created.industry_c || '',
            address: created.address_c || '',
            city: created.city_c || '',
            state: created.state_c || '',
            zipCode: created.zip_code_c || '',
            phone: created.phone_c || '',
            website: created.website_c || '',
            employeeCount: created.employee_count_c || '',
            companyEmailAddress: created.company_email_address_c || '',
            createdAt: created.CreatedOn ? new Date(created.CreatedOn).getTime() : Date.now(),
            updatedAt: created.ModifiedOn ? new Date(created.ModifiedOn).getTime() : Date.now()
          };
        }
      }
      
      throw new Error("No successful record creation");
    } catch (error) {
      console.error("Error in companyService.create:", error.message);
      throw error;
    }
  },

  update: async (id, companyData) => {
    try {
const dbCompanyData = {
        Id: parseInt(id),
        name_c: companyData.name || '',
        industry_c: companyData.industry || '',
        address_c: companyData.address || '',
        city_c: companyData.city || '',
        state_c: companyData.state || '',
        zip_code_c: companyData.zipCode || '',
        phone_c: companyData.phone || '',
        website_c: companyData.website || '',
        employee_count_c: companyData.employeeCount ? parseInt(companyData.employeeCount) : null,
        company_email_address_c: companyData.companyEmailAddress || ''
      };

      const response = await apperClient.updateRecord('companies_c', {
        records: [dbCompanyData]
      });

      if (!response.success) {
        console.error("Error updating company:", response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} companies:`, failed);
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
            name: updated.name_c || '',
            industry: updated.industry_c || '',
            address: updated.address_c || '',
            city: updated.city_c || '',
            state: updated.state_c || '',
            zipCode: updated.zip_code_c || '',
            phone: updated.phone_c || '',
            website: updated.website_c || '',
            employeeCount: updated.employee_count_c || '',
            companyEmailAddress: updated.company_email_address_c || '',
            createdAt: updated.CreatedOn ? new Date(updated.CreatedOn).getTime() : Date.now(),
            updatedAt: updated.ModifiedOn ? new Date(updated.ModifiedOn).getTime() : Date.now()
          };
        }
      }
      
      throw new Error("No successful record update");
    } catch (error) {
      console.error("Error in companyService.update:", error.message);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const response = await apperClient.deleteRecord('companies_c', {
        RecordIds: [parseInt(id)]
      });

      if (!response.success) {
        console.error("Error deleting company:", response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} companies:`, failed);
          failed.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        
        return successful.length > 0;
      }
      
      return true;
    } catch (error) {
      console.error("Error in companyService.delete:", error.message);
      throw error;
    }
  }
};