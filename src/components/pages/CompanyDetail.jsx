import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { companyService } from "@/services/api/companyService";
import { toast } from "react-toastify";

const CompanyDetail = () => {
  const { companyId } = useParams();
  const navigate = useNavigate();
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadCompany();
  }, [companyId]);

  const loadCompany = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await companyService.getById(parseInt(companyId));
      setCompany(data);
    } catch (err) {
      setError(err.message || "Failed to load company details");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    // Navigate back to companies page with edit modal open
    navigate('/companies', { state: { editCompany: company } });
  };

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete ${company.name}?`)) {
      try {
        await companyService.delete(company.Id);
        toast.success("Company deleted successfully");
        navigate('/companies');
      } catch (err) {
        toast.error(err.message || "Failed to delete company");
      }
    }
  };

  const getIndustryColor = (industry) => {
    const colors = {
      'Technology': 'info',
      'Healthcare': 'success',
      'Finance': 'warning',
      'Education': 'purple',
      'Retail': 'teal',
      'Manufacturing': 'default',
      'Other': 'default'
    };
    return colors[industry] || 'default';
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadCompany} />;
  if (!company) return <Error message="Company not found" />;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Breadcrumb Navigation */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center space-x-2 text-sm text-gray-600"
      >
        <button
          onClick={() => navigate('/companies')}
          className="flex items-center space-x-1 hover:text-primary transition-colors"
        >
          <ApperIcon name="ChevronLeft" className="w-4 h-4" />
          <span>Companies</span>
        </button>
        <ApperIcon name="ChevronRight" className="w-4 h-4" />
        <span className="text-gray-900 font-medium">{company.name}</span>
      </motion.div>

      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-8"
      >
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-6">
            {/* Company Avatar */}
            <div className="w-20 h-20 bg-gradient-to-br from-primary to-indigo-600 rounded-2xl flex items-center justify-center text-white text-3xl font-bold shadow-lg">
              {company.name.charAt(0).toUpperCase()}
            </div>
            
            {/* Company Info */}
            <div className="space-y-2">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-indigo-600 bg-clip-text text-transparent">
                {company.name}
              </h1>
              <div className="flex items-center space-x-4">
                <Badge variant={getIndustryColor(company.industry)}>
                  {company.industry || 'Industry not specified'}
                </Badge>
                {company.employeeCount && (
                  <span className="text-sm text-gray-600 flex items-center">
                    <ApperIcon name="Users" className="w-4 h-4 mr-1" />
                    {company.employeeCount} employees
                  </span>
                )}
              </div>
              {company.address && (
                <p className="text-gray-600 flex items-center">
                  <ApperIcon name="MapPin" className="w-4 h-4 mr-2" />
                  {company.address}
                </p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-3">
            <Button variant="outline" onClick={handleEdit}>
              <ApperIcon name="Edit" className="w-4 h-4 mr-2" />
              Edit
            </Button>
            <Button variant="outline" onClick={handleDelete} className="text-error border-red-200 hover:bg-red-50">
              <ApperIcon name="Trash2" className="w-4 h-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Contact Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <ApperIcon name="Phone" className="w-5 h-5 mr-2 text-primary" />
            Contact Information
          </h2>
          <div className="space-y-4">
            {company.phone && (
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Phone</span>
                <a href={`tel:${company.phone}`} className="text-primary hover:underline font-medium">
                  {company.phone}
                </a>
              </div>
            )}
            {company.companyEmailAddress && (
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Email</span>
                <a href={`mailto:${company.companyEmailAddress}`} className="text-primary hover:underline font-medium">
                  {company.companyEmailAddress}
                </a>
              </div>
            )}
            {company.website && (
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Website</span>
                <a 
                  href={company.website.startsWith('http') ? company.website : `https://${company.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline font-medium flex items-center"
                >
                  Visit Website
                  <ApperIcon name="ExternalLink" className="w-3 h-3 ml-1" />
                </a>
              </div>
            )}
          </div>
        </motion.div>

        {/* Location Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <ApperIcon name="MapPin" className="w-5 h-5 mr-2 text-primary" />
            Location
          </h2>
          <div className="space-y-4">
            {company.address && (
              <div className="flex items-start justify-between">
                <span className="text-gray-600">Address</span>
                <span className="text-gray-900 font-medium text-right max-w-xs">{company.address}</span>
              </div>
            )}
            {company.city && (
              <div className="flex items-center justify-between">
                <span className="text-gray-600">City</span>
                <span className="text-gray-900 font-medium">{company.city}</span>
              </div>
            )}
            {company.state && (
              <div className="flex items-center justify-between">
                <span className="text-gray-600">State</span>
                <span className="text-gray-900 font-medium">{company.state}</span>
              </div>
            )}
            {company.zipCode && (
              <div className="flex items-center justify-between">
                <span className="text-gray-600">ZIP Code</span>
                <span className="text-gray-900 font-medium">{company.zipCode}</span>
              </div>
            )}
          </div>
        </motion.div>

        {/* Business Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <ApperIcon name="Building" className="w-5 h-5 mr-2 text-primary" />
            Business Details
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Industry</span>
              <Badge variant={getIndustryColor(company.industry)}>
                {company.industry || 'Not specified'}
              </Badge>
            </div>
            {company.employeeCount && (
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Employee Count</span>
                <span className="text-gray-900 font-medium">{company.employeeCount}</span>
              </div>
            )}
            {company.founded && (
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Founded</span>
                <span className="text-gray-900 font-medium">{company.founded}</span>
              </div>
            )}
          </div>
        </motion.div>

        {/* Additional Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <ApperIcon name="Info" className="w-5 h-5 mr-2 text-primary" />
            Additional Details
          </h2>
          <div className="space-y-4">
            {company.description && (
              <div>
                <span className="text-gray-600 block mb-2">Description</span>
                <p className="text-gray-900 text-sm leading-relaxed">{company.description}</p>
              </div>
            )}
            {company.notes && (
              <div>
                <span className="text-gray-600 block mb-2">Notes</span>
                <p className="text-gray-900 text-sm leading-relaxed">{company.notes}</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CompanyDetail;