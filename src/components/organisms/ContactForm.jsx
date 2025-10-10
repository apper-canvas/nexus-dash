import { useState, useEffect } from "react";
import FormField from "@/components/molecules/FormField";
import Button from "@/components/atoms/Button";

const ContactForm = ({ contact, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    position: "",
    status: "Lead",
    notes: "",
    dealValue: 0
  });

  useEffect(() => {
    if (contact) {
      setFormData(contact);
    }
  }, [contact]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "dealValue" ? parseFloat(value) || 0 : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          label="Full Name"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          placeholder="John Doe"
        />
        
        <FormField
          label="Email"
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
          placeholder="john@company.com"
        />
        
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
          label="Company"
          id="company"
          name="company"
          value={formData.company}
          onChange={handleChange}
          placeholder="Acme Corporation"
        />
        
        <FormField
          label="Position"
          id="position"
          name="position"
          value={formData.position}
          onChange={handleChange}
          placeholder="Sales Manager"
        />
        
        <FormField
          label="Status"
          id="status"
          name="status"
          component="select"
          value={formData.status}
          onChange={handleChange}
          required
        >
          <option value="Lead">Lead</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </FormField>
        
        <FormField
          label="Deal Value"
          id="dealValue"
          name="dealValue"
          type="number"
          value={formData.dealValue}
          onChange={handleChange}
          placeholder="50000"
        />
      </div>
      
      <FormField
        label="Notes"
        id="notes"
        name="notes"
        component="textarea"
        value={formData.notes}
        onChange={handleChange}
        placeholder="Additional notes about this contact..."
        rows={4}
      />

      <div className="flex justify-end space-x-3 pt-4">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="primary">
          {contact ? "Update Contact" : "Add Contact"}
        </Button>
      </div>
    </form>
  );
};

export default ContactForm;