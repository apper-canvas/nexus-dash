import { useState, useEffect } from "react";
import ContactTable from "@/components/organisms/ContactTable";
import ContactForm from "@/components/organisms/ContactForm";
import Modal from "@/components/molecules/Modal";
import SearchBar from "@/components/molecules/SearchBar";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { contactService } from "@/services/api/contactService";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

const Contacts = () => {
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadContacts();
  }, []);

  useEffect(() => {
    filterContacts();
  }, [contacts, searchQuery]);

  const loadContacts = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await contactService.getAll();
      setContacts(data);
    } catch (err) {
      setError(err.message || "Failed to load contacts");
    } finally {
      setLoading(false);
    }
  };

  const filterContacts = () => {
    if (!searchQuery.trim()) {
      setFilteredContacts(contacts);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = contacts.filter(
      (contact) =>
        contact.name.toLowerCase().includes(query) ||
        contact.email.toLowerCase().includes(query) ||
        contact.company.toLowerCase().includes(query) ||
        contact.phone.toLowerCase().includes(query)
    );
    setFilteredContacts(filtered);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleAddContact = () => {
    setEditingContact(null);
    setIsModalOpen(true);
  };

  const handleEditContact = (contact) => {
    setEditingContact(contact);
    setIsModalOpen(true);
  };

  const handleDeleteContact = async (id) => {
    try {
      await contactService.delete(id);
      setContacts((prev) => prev.filter((c) => c.Id !== id));
    } catch (err) {
      toast.error(err.message || "Failed to delete contact");
    }
  };

  const handleSubmit = async (contactData) => {
    try {
      if (editingContact) {
        const updated = await contactService.update(editingContact.Id, contactData);
        setContacts((prev) => prev.map((c) => (c.Id === updated.Id ? updated : c)));
        toast.success("Contact updated successfully");
      } else {
        const created = await contactService.create(contactData);
        setContacts((prev) => [...prev, created]);
        toast.success("Contact added successfully");
      }
      setIsModalOpen(false);
      setEditingContact(null);
    } catch (err) {
      toast.error(err.message || "Failed to save contact");
    }
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadContacts} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-indigo-600 bg-clip-text text-transparent mb-2">
            Contacts
          </h1>
          <p className="text-gray-600">Manage your customer relationships</p>
        </div>
        <Button variant="primary" onClick={handleAddContact}>
          <ApperIcon name="UserPlus" className="w-4 h-4 mr-2" />
          Add Contact
        </Button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
      >
        <SearchBar
          placeholder="Search contacts by name, email, company, or phone..."
          onSearch={handleSearch}
        />
      </motion.div>

      {filteredContacts.length === 0 ? (
        <Empty
          icon="Users"
          title="No Contacts Found"
          message={
            searchQuery
              ? "No contacts match your search. Try adjusting your filters."
              : "Get started by adding your first contact to begin tracking relationships."
          }
          actionLabel={!searchQuery ? "Add Your First Contact" : undefined}
          onAction={!searchQuery ? handleAddContact : undefined}
        />
      ) : (
        <ContactTable
          contacts={filteredContacts}
          onEdit={handleEditContact}
          onDelete={handleDeleteContact}
        />
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingContact(null);
        }}
        title={editingContact ? "Edit Contact" : "Add New Contact"}
        size="lg"
      >
        <ContactForm
          contact={editingContact}
          onSubmit={handleSubmit}
          onCancel={() => {
            setIsModalOpen(false);
            setEditingContact(null);
          }}
        />
      </Modal>
    </div>
  );
};

export default Contacts;