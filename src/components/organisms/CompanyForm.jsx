import { useState, useEffect } from 'react';
import FormField from '@/components/molecules/FormField';
import Button from '@/components/atoms/Button';

const CompanyForm = ({ company, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
name: "",
    industry: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    phone: "",
    website: "",
    employeeCount: "",
    companyEmailAddress: ""
  });

  useEffect(() => {
    if (company) {
      setFormData({
name: company.name || "",
        industry: company.industry || "",
        address: company.address || "",
        city: company.city || "",
        state: company.state || "",
        zipCode: company.zipCode || "",
        phone: company.phone || "",
        website: company.website || "",
        employeeCount: company.employeeCount || "",
        companyEmailAddress: company.companyEmailAddress || ""
      });
    }
  }, [company]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          label="Company Name"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          placeholder="Acme Corporation"
        />
        
        <FormField
          label="Industry"
          id="industry"
          name="industry"
          component="select"
          value={formData.industry}
          onChange={handleChange}
          required
        >
          <option value="">Select Industry</option>
          <option value="Technology">Technology</option>
          <option value="Healthcare">Healthcare</option>
          <option value="Finance">Finance</option>
          <option value="Education">Education</option>
          <option value="Retail">Retail</option>
          <option value="Manufacturing">Manufacturing</option>
          <option value="Other">Other</option>
        </FormField>
        
        <FormField
          label="Phone"
          id="phone"
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={handleChange}
          placeholder="+1 (555) 000-0000"
        />
        
        <FormField
          label="Website"
          id="website"
          name="website"
          type="url"
          value={formData.website}
          onChange={handleChange}
placeholder="https://company.com"
        />
      </div>

      <FormField
        label="Employee Count"
        name="employeeCount"
        type="number"
        value={formData.employeeCount}
        onChange={handleChange}
        placeholder="e.g., 50"
      />

      <FormField
        label="Company Email Address"
        name="companyEmailAddress"
        type="email"
        value={formData.companyEmailAddress}
        onChange={handleChange}
        placeholder="info@company.com"
      />

      <FormField
        label="Address"
        id="address"
        name="address"
        component="textarea"
        value={formData.address}
        onChange={handleChange}
        placeholder="123 Business Ave"
        rows={3}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <FormField
          label="City"
          id="city"
          name="city"
          value={formData.city}
          onChange={handleChange}
          placeholder="New York"
        />
        
        <FormField
          label="State"
          id="state"
          name="state"
          value={formData.state}
          onChange={handleChange}
          placeholder="NY"
        />
        
        <FormField
          label="Zip Code"
          id="zipCode"
          name="zipCode"
          value={formData.zipCode}
          onChange={handleChange}
          placeholder="10001"
        />
      </div>

      <div className="flex justify-end space-x-3 pt-6">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="primary">
          {company ? "Update Company" : "Add Company"}
        </Button>
      </div>
    </form>
  );
};

export default CompanyForm;