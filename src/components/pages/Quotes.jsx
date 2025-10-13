import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import SearchBar from "@/components/molecules/SearchBar";
import Modal from "@/components/molecules/Modal";
import Loading from "@/components/ui/Loading";
import Empty from "@/components/ui/Empty";
import Error from "@/components/ui/Error";
import QuoteForm from "@/components/organisms/QuoteForm";
import quoteService from "@/services/api/quoteService";
import { companyService } from "@/services/api/companyService";
import { contactService } from "@/services/api/contactService";
import dealService from "@/services/api/dealService";

const Quotes = () => {
  const [quotes, setQuotes] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [quotesData, companiesData, contactsData, dealsData] = await Promise.all([
        quoteService.getAll(),
        companyService.getAll(),
        contactService.getAll(),
        dealService.getAll()
      ]);

      setQuotes(quotesData || []);
      setCompanies(companiesData || []);
      setContacts(contactsData || []);
      setDeals(dealsData || []);
    } catch (err) {
      setError("Failed to load data");
      console.error("Error loading quotes data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateQuote = () => {
    setSelectedQuote(null);
    setIsModalOpen(true);
  };

  const handleEditQuote = async (quote) => {
    setModalLoading(true);
    setSelectedQuote(null);
    setIsModalOpen(true);

    try {
      const fullQuote = await quoteService.getById(quote.Id);
      if (fullQuote) {
        setSelectedQuote(fullQuote);
      }
    } catch (error) {
      console.error("Error loading quote details:", error);
    } finally {
      setModalLoading(false);
    }
  };

  const handleDeleteQuote = async (quoteId) => {
    if (window.confirm("Are you sure you want to delete this quote?")) {
      const success = await quoteService.delete(quoteId);
      if (success) {
        loadData();
      }
    }
  };

  const handleSubmitQuote = async (data) => {
    try {
      if (selectedQuote) {
        await quoteService.update(selectedQuote.Id, data);
      } else {
        await quoteService.create(data);
      }
      setIsModalOpen(false);
      loadData();
    } catch (error) {
      console.error("Error saving quote:", error);
    }
  };

  const getStatusBadgeVariant = (status) => {
    switch (status?.toLowerCase()) {
      case "draft": return "secondary";
      case "sent": return "info";
      case "accepted": return "success";
      case "rejected": return "error";
      case "expired": return "warning";
      default: return "secondary";
    }
  };

  const getCompanyName = (companyId) => {
    if (!companyId || typeof companyId !== "object") return "No Company";
    return companyId.Name || "Unknown Company";
  };

  const getContactName = (contactId) => {
    if (!contactId || typeof contactId !== "object") return "No Contact";
    return contactId.Name || "Unknown Contact";
  };

  const getDealName = (dealId) => {
    if (!dealId || typeof dealId !== "object") return "No Deal";
    return dealId.Name || "Unknown Deal";
  };

  const filteredQuotes = quotes.filter(quote => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      quote.Name?.toLowerCase().includes(searchLower) ||
      getCompanyName(quote.company_id_c).toLowerCase().includes(searchLower) ||
      getContactName(quote.contact_id_c).toLowerCase().includes(searchLower) ||
      quote.status_c?.toLowerCase().includes(searchLower)
    );
  });

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quotes</h1>
          <p className="text-gray-600 mt-1">Manage your sales quotes</p>
        </div>
        <Button onClick={handleCreateQuote} className="flex items-center gap-2">
          <ApperIcon name="Plus" size={16} />
          Create Quote
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <SearchBar
          placeholder="Search quotes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onSearch={() => {}}
          className="flex-1 max-w-md"
        />
      </div>

      {filteredQuotes.length === 0 ? (
        <Empty
          title="No quotes found"
          description={searchTerm ? "No quotes match your search criteria." : "Start by creating your first quote."}
          action={!searchTerm ? { label: "Create Quote", onClick: handleCreateQuote } : null}
        />
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quote
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Company
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Deal
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quote Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Expires On
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredQuotes.map((quote) => (
                  <motion.tr
                    key={quote.Id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {quote.Name || "Untitled Quote"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {getCompanyName(quote.company_id_c)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {getContactName(quote.contact_id_c)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {getDealName(quote.deal_id_c)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={getStatusBadgeVariant(quote.status_c)}>
                        {quote.status_c || "Draft"}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {quote.quote_date_c 
                        ? format(new Date(quote.quote_date_c), "MMM dd, yyyy")
                        : "No date"
                      }
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {quote.expires_on_c 
                        ? format(new Date(quote.expires_on_c), "MMM dd, yyyy")
                        : "No expiry"
                      }
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditQuote(quote)}
                        >
                          <ApperIcon name="Edit" size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteQuote(quote.Id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <ApperIcon name="Trash2" size={16} />
                        </Button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <AnimatePresence>
        {isModalOpen && (
          <Modal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            title={selectedQuote ? "Edit Quote" : "Create Quote"}
            maxWidth="4xl"
          >
            {modalLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loading />
              </div>
            ) : (
              <QuoteForm
                quote={selectedQuote}
                companies={companies}
                contacts={contacts}
                deals={deals}
                onSubmit={handleSubmitQuote}
                onCancel={() => setIsModalOpen(false)}
              />
            )}
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Quotes;