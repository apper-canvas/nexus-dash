import contactsData from "@/services/mockData/contacts.json";

let contacts = [...contactsData];

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const contactService = {
  getAll: async () => {
    await delay(300);
    return [...contacts];
  },

  getById: async (id) => {
    await delay(200);
    const contact = contacts.find((c) => c.Id === parseInt(id));
    if (!contact) throw new Error("Contact not found");
    return { ...contact };
  },

  create: async (contactData) => {
    await delay(400);
    const maxId = contacts.reduce((max, c) => Math.max(max, c.Id), 0);
    const newContact = {
      ...contactData,
      Id: maxId + 1,
      createdAt: Date.now(),
      lastContact: Date.now()
    };
    contacts.push(newContact);
    return { ...newContact };
  },

  update: async (id, contactData) => {
    await delay(400);
    const index = contacts.findIndex((c) => c.Id === parseInt(id));
    if (index === -1) throw new Error("Contact not found");
    contacts[index] = { ...contacts[index], ...contactData };
    return { ...contacts[index] };
  },

  delete: async (id) => {
    await delay(300);
    const index = contacts.findIndex((c) => c.Id === parseInt(id));
    if (index === -1) throw new Error("Contact not found");
    contacts.splice(index, 1);
    return true;
  },

  // Advanced filtering support
  search: async (filters = {}) => {
    await delay(200);
    let filtered = [...contacts];

    if (filters.status) {
      filtered = filtered.filter(contact => contact.status === filters.status);
    }

    if (filters.company) {
      const companyQuery = filters.company.toLowerCase();
      filtered = filtered.filter(contact => 
        contact.company.toLowerCase().includes(companyQuery)
      );
    }

    if (filters.dealValueMin !== undefined) {
      const minValue = parseFloat(filters.dealValueMin);
      filtered = filtered.filter(contact => contact.dealValue >= minValue);
    }

    if (filters.dealValueMax !== undefined) {
      const maxValue = parseFloat(filters.dealValueMax);
      filtered = filtered.filter(contact => contact.dealValue <= maxValue);
    }

    if (filters.dateFrom) {
      const fromDate = new Date(filters.dateFrom);
      filtered = filtered.filter(contact => 
        new Date(contact.lastContact) >= fromDate
      );
    }

    if (filters.dateTo) {
      const toDate = new Date(filters.dateTo);
      filtered = filtered.filter(contact => 
        new Date(contact.lastContact) <= toDate
      );
    }

    return filtered;
  }
};