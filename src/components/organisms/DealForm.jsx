import { useState, useEffect } from "react";
import FormField from "@/components/molecules/FormField";
import Button from "@/components/atoms/Button";

const DealForm = ({ deal, contacts, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: "",
    contactId: "",
    value: 0,
    stage: "Lead",
    probability: 10,
    expectedCloseDate: "",
    notes: "",
    status: "Open"
  });

  useEffect(() => {
    if (deal) {
      setFormData({
        ...deal,
        expectedCloseDate: deal.expectedCloseDate ? new Date(deal.expectedCloseDate).toISOString().split("T")[0] : ""
      });
    }
  }, [deal]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "value" || name === "probability" ? parseFloat(value) || 0 : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      expectedCloseDate: formData.expectedCloseDate ? new Date(formData.expectedCloseDate).getTime() : Date.now()
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          label="Deal Title"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          placeholder="Q4 Enterprise Package"
        />
        
        <FormField
          label="Contact"
          id="contactId"
          name="contactId"
          component="select"
          value={formData.contactId}
          onChange={handleChange}
          required
        >
          <option value="">Select a contact</option>
          {contacts.map((contact) => (
            <option key={contact.Id} value={contact.Id}>
              {contact.name} - {contact.company}
            </option>
          ))}
        </FormField>
        
        <FormField
          label="Deal Value"
          id="value"
          name="value"
          type="number"
          value={formData.value}
          onChange={handleChange}
          required
          placeholder="50000"
        />
        
        <FormField
          label="Stage"
          id="stage"
          name="stage"
          component="select"
          value={formData.stage}
          onChange={handleChange}
          required
        >
          <option value="Lead">Lead</option>
          <option value="Qualified">Qualified</option>
          <option value="Proposal">Proposal</option>
          <option value="Negotiation">Negotiation</option>
          <option value="Closed Won">Closed Won</option>
          <option value="Closed Lost">Closed Lost</option>
        </FormField>
        
        <FormField
          label="Probability (%)"
          id="probability"
          name="probability"
          type="number"
          min="0"
          max="100"
          value={formData.probability}
          onChange={handleChange}
          placeholder="50"
        />
        
        <FormField
          label="Expected Close Date"
          id="expectedCloseDate"
          name="expectedCloseDate"
          type="date"
          value={formData.expectedCloseDate}
          onChange={handleChange}
        />
      </div>
      
      <FormField
        label="Notes"
        id="notes"
        name="notes"
        component="textarea"
        value={formData.notes}
        onChange={handleChange}
        placeholder="Additional notes about this deal..."
        rows={4}
      />

      <div className="flex justify-end space-x-3 pt-4">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="primary">
          {deal ? "Update Deal" : "Create Deal"}
        </Button>
      </div>
    </form>
  );
};

export default DealForm;