import { useState } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Badge from '@/components/atoms/Badge';
import Button from '@/components/atoms/Button';
import { toast } from 'react-toastify';

const CompanyTable = ({ companies, onEdit, onDelete, onView }) => {
  const [sortField, setSortField] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleDeleteClick = (company) => {
    if (window.confirm(`Are you sure you want to delete ${company.name}?`)) {
      onDelete(company.Id);
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

  const sortedCompanies = [...companies].sort((a, b) => {
    const aValue = a[sortField] || '';
    const bValue = b[sortField] || '';
    
    if (typeof aValue === 'string') {
      const comparison = aValue.localeCompare(bValue);
      return sortDirection === "asc" ? comparison : -comparison;
    } else {
      return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
    }
  });

const columns = [
    { field: "name", label: "Company", sortable: true },
    { field: "industry", label: "Industry", sortable: true },
    { field: "city", label: "City", sortable: true },
    { field: "state", label: "State", sortable: true },
    { field: "phone", label: "Phone", sortable: false },
    { field: "website", label: "Website", sortable: false },
    { field: "employeeCount", label: "Employee Count", sortable: true },
    { field: "companyEmailAddress", label: "Email", sortable: false }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.field}
                  className={`px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider ${
                    column.sortable ? "cursor-pointer hover:bg-gray-200 transition-colors" : ""
                  }`}
                  onClick={() => column.sortable && handleSort(column.field)}
                >
                  <div className="flex items-center space-x-1">
                    <span>{column.label}</span>
                    {column.sortable && sortField === column.field && (
                      <ApperIcon
                        name={sortDirection === "asc" ? "ChevronUp" : "ChevronDown"}
                        className="w-4 h-4"
                      />
                    )}
                  </div>
                </th>
              ))}
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedCompanies.map((company, index) => (
<motion.tr
                key={company.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200 cursor-pointer"
                onClick={(e) => {
                  // Prevent navigation when clicking on action buttons
                  if (!e.target.closest('button')) {
                    onView?.(company);
                  }
                }}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary to-indigo-600 rounded-full flex items-center justify-center text-white font-bold shadow-md">
                      {company.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-semibold text-gray-900">{company.name}</div>
                      {company.address && (
                        <div className="text-xs text-gray-500">{company.address}</div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge variant={getIndustryColor(company.industry)}>{company.industry || 'Not specified'}</Badge>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                  {company.city || 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                  {company.state || 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {company.phone ? (
                    <a href={`tel:${company.phone}`} className="hover:text-primary transition-colors">
                      {company.phone}
                    </a>
                  ) : (
                    'N/A'
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {company.website ? (
                    <a 
                      href={company.website.startsWith('http') ? company.website : `https://${company.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-primary transition-colors flex items-center"
                    >
                      <ApperIcon name="ExternalLink" className="w-3 h-3 mr-1" />
                      Visit
                    </a>
                  ) : (
                    'N/A'
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onEdit(company)}
                    >
                      <ApperIcon name="Edit" className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDeleteClick(company)}
                      className="text-error hover:bg-red-50"
                    >
                      <ApperIcon name="Trash2" className="w-4 h-4" />
                    </Button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CompanyTable;