import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Badge from "@/components/atoms/Badge";
import Modal from "@/components/molecules/Modal";
import { toast } from "react-toastify";

const FilterPanel = ({ 
type = "contacts", 
  onFiltersChange, 
  initialFilters = {}, 
  className = "" 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState({
    status: "",
    company: "",
    dealValueMin: "",
    dealValueMax: "",
    stage: "",
    industry: "",
    city: "",
    state: "",
    dateFrom: "",
    dateTo: "",
    ...initialFilters
  });
  const [savedViews, setSavedViews] = useState([]);
  const [activeView, setActiveView] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [newViewName, setNewViewName] = useState("");
  const [editingView, setEditingView] = useState(null);

  // Load saved views from localStorage
  useEffect(() => {
    const storageKey = `${type}_saved_views`;
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        setSavedViews(JSON.parse(saved));
      } catch (error) {
        console.error("Error loading saved views:", error);
      }
    }
  }, [type]);

  // Save views to localStorage
  const saveViewsToStorage = (views) => {
    const storageKey = `${type}_saved_views`;
    localStorage.setItem(storageKey, JSON.stringify(views));
  };

  // Apply filters
  useEffect(() => {
    if (onFiltersChange) {
      const activeFilters = Object.entries(filters).reduce((acc, [key, value]) => {
        if (value && value !== "") {
          acc[key] = value;
        }
        return acc;
      }, {});
      onFiltersChange(activeFilters);
    }
  }, [filters, onFiltersChange]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setActiveView(null); // Clear active view when manually changing filters
  };

  const clearFilters = () => {
    setFilters({
status: "",
      company: "",
      dealValueMin: "",
      dealValueMax: "",
      stage: "",
      industry: "",
      city: "",
      state: "",
      dateFrom: "",
      dateTo: ""
    });
    setActiveView(null);
  };

  const hasActiveFilters = Object.values(filters).some(value => value && value !== "");

  const handleSaveView = () => {
    if (!newViewName.trim()) {
      toast.error("Please enter a view name");
      return;
    }

    const newView = {
      id: Date.now(),
      name: newViewName,
      filters: { ...filters },
      createdAt: new Date().toISOString()
    };

    if (editingView) {
      const updatedViews = savedViews.map(view => 
        view.id === editingView.id 
          ? { ...newView, id: editingView.id, createdAt: editingView.createdAt }
          : view
      );
      setSavedViews(updatedViews);
      saveViewsToStorage(updatedViews);
      toast.success("View updated successfully");
    } else {
      const updatedViews = [...savedViews, newView];
      setSavedViews(updatedViews);
      saveViewsToStorage(updatedViews);
      toast.success("View saved successfully");
    }

    setNewViewName("");
    setEditingView(null);
    setIsViewModalOpen(false);
  };

  const loadView = (view) => {
    setFilters(view.filters);
    setActiveView(view.id);
    toast.success(`Applied view: ${view.name}`);
  };

  const deleteView = (viewId) => {
    const updatedViews = savedViews.filter(view => view.id !== viewId);
    setSavedViews(updatedViews);
    saveViewsToStorage(updatedViews);
    if (activeView === viewId) {
      setActiveView(null);
    }
    toast.success("View deleted successfully");
  };

  const editView = (view) => {
    setEditingView(view);
    setNewViewName(view.name);
    setIsViewModalOpen(true);
  };

const options = useMemo(() => {
    if (type === "contacts") {
      return {
        statusOptions: [
          { value: "", label: "All Statuses" },
          { value: "Lead", label: "Lead" },
          { value: "Customer", label: "Customer" },
          { value: "Prospect", label: "Prospect" }
        ]
      };
    } else if (type === "companies") {
      return {
        industryOptions: [
          { value: "", label: "All Industries" },
          { value: "Technology", label: "Technology" },
          { value: "Healthcare", label: "Healthcare" },
          { value: "Finance", label: "Finance" },
          { value: "Education", label: "Education" },
          { value: "Retail", label: "Retail" },
          { value: "Manufacturing", label: "Manufacturing" },
          { value: "Other", label: "Other" }
        ]
      };
    } else {
      return {
        stageOptions: [
          { value: "", label: "All Stages" },
          { value: "Lead", label: "Lead" },
          { value: "Qualified", label: "Qualified" },
          { value: "Proposal", label: "Proposal" },
          { value: "Negotiation", label: "Negotiation" },
          { value: "Closed Won", label: "Closed Won" },
          { value: "Closed Lost", label: "Closed Lost" }
        ]
      };
    }
  }, [type]);

  return (
    <div className={className}>
      {/* Saved Views */}
      {savedViews.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-2">
          {savedViews.map((view) => (
            <Button
              key={view.id}
              size="sm"
              variant={activeView === view.id ? "primary" : "outline"}
              onClick={() => loadView(view)}
              className="relative group"
            >
              {view.name}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  editView(view);
                }}
                className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ApperIcon name="Edit2" className="w-3 h-3" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteView(view.id);
                }}
                className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity text-red-500"
              >
                <ApperIcon name="X" className="w-3 h-3" />
              </button>
            </Button>
          ))}
        </div>
      )}

      {/* Filter Toggle Button */}
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="outline"
          onClick={() => setIsOpen(!isOpen)}
          className="relative"
        >
          <ApperIcon name="Filter" className="w-4 h-4 mr-2" />
          Filters
          {hasActiveFilters && (
            <Badge variant="primary" className="ml-2 px-1.5 py-0.5 text-xs">
              {Object.values(filters).filter(v => v && v !== "").length}
            </Badge>
          )}
        </Button>

        <div className="flex gap-2">
          {hasActiveFilters && (
            <Button size="sm" variant="ghost" onClick={clearFilters}>
              <ApperIcon name="X" className="w-4 h-4 mr-1" />
              Clear
            </Button>
          )}
          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsViewModalOpen(true)}
            disabled={!hasActiveFilters}
          >
            <ApperIcon name="Save" className="w-4 h-4 mr-1" />
            Save View
          </Button>
        </div>
      </div>

      {/* Filter Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white rounded-lg border border-gray-200 p-4 mb-4 overflow-hidden"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Status/Stage Filter */}
<div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
{type === "contacts" ? "Status" : type === "companies" ? "Industry" : "Deal Stage"}
                </label>
                <Select
value={type === "contacts" ? filters.status : type === "companies" ? filters.industry : filters.stage}
                  onChange={(e) => handleFilterChange(
type === "contacts" ? "status" : type === "companies" ? "industry" : "stage",
                    e.target.value
                  )}
options={type === "contacts" ? options.statusOptions : type === "companies" ? options.industryOptions : options.stageOptions}
                />
              </div>

              {/* Company Filter */}
              {type === "contacts" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company
                  </label>
                  <Input
                    type="text"
                    value={filters.company}
                    onChange={(e) => handleFilterChange("company", e.target.value)}
                    placeholder="Filter by company..."
                  />
                </div>
)}

              {type === "companies" && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City
                    </label>
                    <Input
                      value={filters.city}
                      onChange={(e) => handleFilterChange("city", e.target.value)}
                      placeholder="Enter city..."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      State
                    </label>
                    <Input
                      value={filters.state}
                      onChange={(e) => handleFilterChange("state", e.target.value)}
                      placeholder="Enter state..."
                    />
                  </div>
                </>
              )}

              {/* Deal Value Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Min Deal Value
                </label>
                <Input
                  type="number"
                  value={filters.dealValueMin}
                  onChange={(e) => handleFilterChange("dealValueMin", e.target.value)}
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max Deal Value
                </label>
                <Input
                  type="number"
                  value={filters.dealValueMax}
                  onChange={(e) => handleFilterChange("dealValueMax", e.target.value)}
                  placeholder="No limit"
                />
              </div>

              {/* Date Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date From
                </label>
                <Input
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) => handleFilterChange("dateFrom", e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date To
                </label>
                <Input
                  type="date"
                  value={filters.dateTo}
                  onChange={(e) => handleFilterChange("dateTo", e.target.value)}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Save View Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setNewViewName("");
          setEditingView(null);
        }}
        title={editingView ? "Edit View" : "Save Filter View"}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              View Name
            </label>
            <Input
              type="text"
              value={newViewName}
              onChange={(e) => setNewViewName(e.target.value)}
              placeholder="Enter view name..."
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSaveView();
                }
              }}
            />
          </div>
          
          <div className="bg-gray-50 rounded-lg p-3">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Current Filters:</h4>
            <div className="space-y-1">
              {Object.entries(filters).map(([key, value]) => {
                if (!value || value === "") return null;
                return (
                  <div key={key} className="text-sm text-gray-600">
                    <span className="font-medium">{key}:</span> {value}
                  </div>
                );
              })}
              {!hasActiveFilters && (
                <div className="text-sm text-gray-500 italic">No active filters</div>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setIsViewModalOpen(false);
                setNewViewName("");
                setEditingView(null);
              }}
            >
              Cancel
            </Button>
            <Button 
              variant="primary" 
              onClick={handleSaveView}
              disabled={!hasActiveFilters || !newViewName.trim()}
            >
              {editingView ? "Update View" : "Save View"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default FilterPanel;