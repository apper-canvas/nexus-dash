import React, { useContext, useState } from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { AuthContext } from "../../App";
import { AnimatePresence, motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import SearchBar from "@/components/molecules/SearchBar";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

const navItems = [
{ path: "/", label: "Dashboard", icon: "LayoutDashboard" },
    { path: "/contacts", label: "Contacts", icon: "Users" },
    { path: "/companies", label: "Companies", icon: "Building" },
{ path: "/pipeline", label: "Deals-Madhuri", icon: "TrendingUp" },
    { path: "/quotes", label: "Quotes", icon: "FileText" },
    { path: "/sales-orders", label: "Sales Orders", icon: "ShoppingCart" },
    { path: "/activities", label: "Activities", icon: "Activity" }
  ];

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-indigo-600 rounded-lg flex items-center justify-center shadow-md">
                <ApperIcon name="Zap" className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-indigo-600 bg-clip-text text-transparent">
                Nexus CRM
              </span>
            </div>
            
            <nav className="hidden md:flex space-x-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === "/"}
                  className={({ isActive }) =>
                    `flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-semibold transition-all duration-200 ${
                      isActive
                        ? "bg-gradient-to-r from-primary to-indigo-600 text-white shadow-md"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    }`
                  }
                >
                  <ApperIcon name={item.icon} className="w-4 h-4" />
                  <span>{item.label}</span>
</NavLink>
              ))}
            </nav>
            
            {/* Search and Profile */}
            <div className="hidden md:flex items-center space-x-4">
              <SearchBar 
                placeholder="Search contacts, deals..." 
                onSearch={() => {}} 
                className="w-80"
              />
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors relative"
              >
                <ApperIcon name="Bell" className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </motion.button>
              
              <UserMenu />
            </div>
            
            {/* Mobile menu button */}
            <div className="md:hidden">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <ApperIcon name="Menu" className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

function UserMenu() {
  const { logout } = useContext(AuthContext);
  const { user } = useSelector((state) => state.user);
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    setIsOpen(false);
  };

  const userInitials = user?.firstName && user?.lastName 
    ? `${user.firstName[0]}${user.lastName[0]}` 
    : user?.emailAddress?.[0]?.toUpperCase() || 'U';

  const displayName = user?.firstName && user?.lastName 
    ? `${user.firstName} ${user.lastName}` 
    : user?.emailAddress || 'User';

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <div className="w-8 h-8 bg-gradient-to-br from-primary to-indigo-600 rounded-full flex items-center justify-center">
          <span className="text-xs font-bold text-white">{userInitials}</span>
        </div>
        <span className="hidden lg:block font-medium">{displayName}</span>
        <ApperIcon name="ChevronDown" className="w-4 h-4" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50"
          >
            <div className="px-4 py-2 border-b border-gray-100">
              <p className="text-sm font-medium text-gray-900">{displayName}</p>
              <p className="text-xs text-gray-500">{user?.emailAddress}</p>
            </div>
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors flex items-center space-x-2"
            >
              <ApperIcon name="LogOut" className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </motion.div>
        )}
</AnimatePresence>
    </div>
  );
}

export default Header;