import { useState, useEffect } from "react";
import FormField from "@/components/molecules/FormField";
import Button from "@/components/atoms/Button";

const QuoteForm = ({ quote, companies, contacts, deals, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    Name: "",
    quote_date_c: "",
    status_c: "Draft",
    delivery_method_c: "Email",
    expires_on_c: "",
    company_id_c: "",
    contact_id_c: "",
    deal_id_c: "",
    billing_address_name_c: "",
    billing_address_street_c: "",
    billing_address_city_c: "",
    billing_address_state_c: "",
    billing_address_country_c: "",
    billing_address_pincode_c: "",
    shipping_address_name_c: "",
    shipping_address_street_c: "",
    shipping_address_city_c: "",
    shipping_address_state_c: "",
    shipping_address_country_c: "",
    shipping_address_pincode_c: ""
  });

  useEffect(() => {
    if (quote) {
      setFormData({
        Name: quote.Name || "",
        quote_date_c: quote.quote_date_c ? new Date(quote.quote_date_c).toISOString().split("T")[0] : "",
        status_c: quote.status_c || "Draft",
        delivery_method_c: quote.delivery_method_c || "Email",
        expires_on_c: quote.expires_on_c ? new Date(quote.expires_on_c).toISOString().split("T")[0] : "",
        company_id_c: quote.company_id_c?.Id || "",
        contact_id_c: quote.contact_id_c?.Id || "",
        deal_id_c: quote.deal_id_c?.Id || "",
        billing_address_name_c: quote.billing_address_name_c || "",
        billing_address_street_c: quote.billing_address_street_c || "",
        billing_address_city_c: quote.billing_address_city_c || "",
        billing_address_state_c: quote.billing_address_state_c || "",
        billing_address_country_c: quote.billing_address_country_c || "",
        billing_address_pincode_c: quote.billing_address_pincode_c || "",
        shipping_address_name_c: quote.shipping_address_name_c || "",
        shipping_address_street_c: quote.shipping_address_street_c || "",
        shipping_address_city_c: quote.shipping_address_city_c || "",
        shipping_address_state_c: quote.shipping_address_state_c || "",
        shipping_address_country_c: quote.shipping_address_country_c || "",
        shipping_address_pincode_c: quote.shipping_address_pincode_c || ""
      });
    }
  }, [quote]);

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
      quote_date_c: isValidDate(formData.quote_date_c) ? new Date(formData.quote_date_c).toISOString() : null,
      expires_on_c: isValidDate(formData.expires_on_c) ? new Date(formData.expires_on_c).toISOString() : null
    };

    onSubmit(submitData);
  };

  const copyBillingToShipping = () => {
    setFormData(prev => ({
      ...prev,
      shipping_address_name_c: prev.billing_address_name_c,
      shipping_address_street_c: prev.billing_address_street_c,
      shipping_address_city_c: prev.billing_address_city_c,
      shipping_address_state_c: prev.billing_address_state_c,
      shipping_address_country_c: prev.billing_address_country_c,
      shipping_address_pincode_c: prev.billing_address_pincode_c
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Basic Information */}
      <div className="space-y-6">
        <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Quote Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            label="Quote Name"
            id="Name"
            name="Name"
            value={formData.Name}
            onChange={handleChange}
            required
            placeholder="Q4 2024 Enterprise Quote"
          />
          
          <FormField
            label="Quote Date"
            id="quote_date_c"
            name="quote_date_c"
            type="date"
            value={formData.quote_date_c}
            onChange={handleChange}
            required
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
            <option value="Sent">Sent</option>
            <option value="Accepted">Accepted</option>
            <option value="Rejected">Rejected</option>
            <option value="Expired">Expired</option>
          </FormField>
          
          <FormField
            label="Delivery Method"
            id="delivery_method_c"
            name="delivery_method_c"
            component="select"
            value={formData.delivery_method_c}
            onChange={handleChange}
            required
          >
            <option value="Email">Email</option>
            <option value="Courier">Courier</option>
            <option value="In Person">In Person</option>
          </FormField>
          
          <FormField
            label="Expires On"
            id="expires_on_c"
            name="expires_on_c"
            type="date"
            value={formData.expires_on_c}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* Relationship Fields */}
      <div className="space-y-6">
        <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Related Records</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FormField
            label="Company"
            id="company_id_c"
            name="company_id_c"
            component="select"
            value={formData.company_id_c}
            onChange={handleChange}
            required
          >
            <option value="">Select Company</option>
            {companies.map((company) => (
              <option key={company.Id} value={company.Id}>
                {company.name_c || company.Name}
              </option>
            ))}
          </FormField>
          
          <FormField
            label="Contact"
            id="contact_id_c"
            name="contact_id_c"
            component="select"
            value={formData.contact_id_c}
            onChange={handleChange}
            required
          >
            <option value="">Select Contact</option>
            {contacts.map((contact) => (
              <option key={contact.Id} value={contact.Id}>
                {contact.name_c || contact.Name}
              </option>
            ))}
          </FormField>
          
          <FormField
            label="Deal"
            id="deal_id_c"
            name="deal_id_c"
            component="select"
            value={formData.deal_id_c}
            onChange={handleChange}
            required
          >
            <option value="">Select Deal</option>
            {deals.map((deal) => (
              <option key={deal.Id} value={deal.Id}>
                {deal.title_c || deal.Name}
              </option>
            ))}
          </FormField>
        </div>
      </div>

      {/* Billing Address */}
      <div className="space-y-6">
        <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Billing Address</h3>
        
        <div className="space-y-4">
          <FormField
            label="Bill To Name"
            id="billing_address_name_c"
            name="billing_address_name_c"
            value={formData.billing_address_name_c}
            onChange={handleChange}
            placeholder="Company Name or Person"
          />
          
          <FormField
            label="Street Address"
            id="billing_address_street_c"
            name="billing_address_street_c"
            component="textarea"
            value={formData.billing_address_street_c}
            onChange={handleChange}
            placeholder="123 Business Street"
            rows={3}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <FormField
              label="City"
              id="billing_address_city_c"
              name="billing_address_city_c"
              value={formData.billing_address_city_c}
              onChange={handleChange}
              placeholder="New York"
            />
            
            <FormField
              label="State"
              id="billing_address_state_c"
              name="billing_address_state_c"
              value={formData.billing_address_state_c}
              onChange={handleChange}
              placeholder="NY"
            />
            
            <FormField
              label="Country"
              id="billing_address_country_c"
              name="billing_address_country_c"
              value={formData.billing_address_country_c}
              onChange={handleChange}
              placeholder="USA"
            />
            
            <FormField
              label="Pincode"
              id="billing_address_pincode_c"
              name="billing_address_pincode_c"
              value={formData.billing_address_pincode_c}
              onChange={handleChange}
              placeholder="10001"
            />
          </div>
        </div>
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
        
        <div className="space-y-4">
          <FormField
            label="Ship To Name"
            id="shipping_address_name_c"
            name="shipping_address_name_c"
            value={formData.shipping_address_name_c}
            onChange={handleChange}
            placeholder="Company Name or Person"
          />
          
          <FormField
            label="Street Address"
            id="shipping_address_street_c"
            name="shipping_address_street_c"
            component="textarea"
            value={formData.shipping_address_street_c}
            onChange={handleChange}
            placeholder="123 Shipping Street"
            rows={3}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <FormField
              label="City"
              id="shipping_address_city_c"
              name="shipping_address_city_c"
              value={formData.shipping_address_city_c}
              onChange={handleChange}
              placeholder="New York"
            />
            
            <FormField
              label="State"
              id="shipping_address_state_c"
              name="shipping_address_state_c"
              value={formData.shipping_address_state_c}
              onChange={handleChange}
              placeholder="NY"
            />
            
            <FormField
              label="Country"
              id="shipping_address_country_c"
              name="shipping_address_country_c"
              value={formData.shipping_address_country_c}
              onChange={handleChange}
              placeholder="USA"
            />
            
            <FormField
              label="Pincode"
              id="shipping_address_pincode_c"
              name="shipping_address_pincode_c"
              value={formData.shipping_address_pincode_c}
              onChange={handleChange}
              placeholder="10001"
            />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-3 pt-6 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="primary">
          {quote ? "Update Quote" : "Create Quote"}
        </Button>
      </div>
    </form>
  );
};

export default QuoteForm;