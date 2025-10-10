import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CompanyTable from "@/components/organisms/CompanyTable";
import CompanyForm from "@/components/organisms/CompanyForm";
import Modal from "@/components/molecules/Modal";
import SearchBar from "@/components/molecules/SearchBar";
import FilterPanel from "@/components/molecules/FilterPanel";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { companyService } from "@/services/api/companyService";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

const Companies = () => {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState([]);
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState({});

  useEffect(() => {
    loadCompanies();
  }, []);

  useEffect(() => {
    filterCompanies();
  }, [companies, searchQuery, activeFilters]);

  const loadCompanies = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await companyService.getAll();
      setCompanies(data);
    } catch (err) {
      setError(err.message || "Failed to load companies");
    } finally {
      setLoading(false);
    }
  };

  const filterCompanies = () => {
    let filtered = [...companies];

    // Apply search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (company) =>
          company.name.toLowerCase().includes(query) ||
          company.industry.toLowerCase().includes(query) ||
          company.city.toLowerCase().includes(query) ||
          company.state.toLowerCase().includes(query) ||
          company.phone.toLowerCase().includes(query) ||
          (company.website && company.website.toLowerCase().includes(query))
      );
    }

    // Apply advanced filters
    if (activeFilters.industry) {
      filtered = filtered.filter(company => company.industry === activeFilters.industry);
    }

    if (activeFilters.city) {
      const cityQuery = activeFilters.city.toLowerCase();
      filtered = filtered.filter(company => 
        company.city.toLowerCase().includes(cityQuery)
      );
    }

    if (activeFilters.state) {
      const stateQuery = activeFilters.state.toLowerCase();
      filtered = filtered.filter(company => 
        company.state.toLowerCase().includes(stateQuery)
      );
    }

    if (activeFilters.company) {
      const companyQuery = activeFilters.company.toLowerCase();
      filtered = filtered.filter(company => 
        company.name.toLowerCase().includes(companyQuery)
      );
    }

    setFilteredCompanies(filtered);
  };

  const handleFiltersChange = (filters) => {
    setActiveFilters(filters);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleAddCompany = () => {
    setEditingCompany(null);
    setIsModalOpen(true);
  };

  const handleEditCompany = (company) => {
    setEditingCompany(company);
    setIsModalOpen(true);
  };

const handleViewCompany = (company) => {
    navigate(`/companies/${company.Id}`);
  };

  const handleDeleteCompany = async (id) => {
    try {
      await companyService.delete(id);
      setCompanies((prev) => prev.filter((c) => c.Id !== id));
      toast.success("Company deleted successfully");
    } catch (err) {
      toast.error(err.message || "Failed to delete company");
    }
  };

  const handleSubmit = async (companyData) => {
    try {
      if (editingCompany) {
        const updated = await companyService.update(editingCompany.Id, companyData);
        setCompanies((prev) => prev.map((c) => (c.Id === updated.Id ? updated : c)));
        toast.success("Company updated successfully");
      } else {
        const created = await companyService.create(companyData);
        setCompanies((prev) => [...prev, created]);
        toast.success("Company added successfully");
      }
      setIsModalOpen(false);
      setEditingCompany(null);
    } catch (err) {
      toast.error(err.message || "Failed to save company");
    }
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadCompanies} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-indigo-600 bg-clip-text text-transparent mb-2">
            Companies
          </h1>
          <p className="text-gray-600">Manage your business relationships</p>
        </div>
        <Button variant="primary" onClick={handleAddCompany}>
          <ApperIcon name="Building" className="w-4 h-4 mr-2" />
          Add Company
        </Button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
      >
        <SearchBar
          placeholder="Search companies by name, industry, location, phone, or website..."
          onSearch={handleSearch}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <FilterPanel
          type="companies"
          onFiltersChange={handleFiltersChange}
        />
      </motion.div>

      {filteredCompanies.length === 0 ? (
        <Empty
          icon="Building"
          title="No Companies Found"
          message={
            searchQuery
              ? "No companies match your search. Try adjusting your filters."
              : "Get started by adding your first company to begin tracking business relationships."
          }
          actionLabel={!searchQuery ? "Add Your First Company" : undefined}
          onAction={!searchQuery ? handleAddCompany : undefined}
        />
      ) : (
        <CompanyTable
companies={filteredCompanies}
          onEdit={handleEditCompany}
          onDelete={handleDeleteCompany}
          onView={handleViewCompany}
          showingFiltered={Object.keys(activeFilters).length > 0 || searchQuery.trim() !== ""}
        />
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingCompany(null);
        }}
        title={editingCompany ? "Edit Company" : "Add New Company"}
        size="lg"
      >
        <CompanyForm
          company={editingCompany}
          onSubmit={handleSubmit}
          onCancel={() => {
            setIsModalOpen(false);
            setEditingCompany(null);
          }}
        />
      </Modal>
    </div>
  );
};

export default Companies;