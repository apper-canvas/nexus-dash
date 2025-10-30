import React, { useState } from "react";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/layouts/Root";
import ApperIcon from "@/components/ApperIcon";
import SearchBar from "@/components/molecules/SearchBar";

export default function Header({ onMenuToggle }) {
  const { user } = useSelector(state => state.user);
  const { logout } = useAuth();

  const UserMenu = () => {
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
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-20 shadow-sm">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            {/* Mobile menu toggle */}
            <button
              onClick={onMenuToggle}
              className="md:hidden p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ApperIcon name="Menu" className="w-5 h-5" />
            </button>
            {/* Search and Profile */}
            <SearchBar 
              placeholder="Search contacts, deals..." 
              onSearch={() => {}} 
              className="w-64 lg:w-80"
            />
          </div>
          
          <div className="flex items-center space-x-4">
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
        </div>
      </div>
    </header>
);
}