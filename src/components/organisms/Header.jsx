import { useState } from "react";
import { NavLink } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import SearchBar from "@/components/molecules/SearchBar";
import { motion, AnimatePresence } from "framer-motion";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { path: "/", label: "Dashboard", icon: "LayoutDashboard" },
    { path: "/contacts", label: "Contacts", icon: "Users" },
    { path: "/pipeline", label: "Pipeline", icon: "TrendingUp" },
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
          </div>

          <div className="hidden md:block flex-1 max-w-md mx-8">
            <SearchBar placeholder="Search contacts, deals..." />
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100"
          >
            <ApperIcon name={mobileMenuOpen ? "X" : "Menu"} className="w-6 h-6" />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-gray-200 bg-white"
          >
            <div className="px-4 py-4 space-y-2">
              <SearchBar placeholder="Search..." className="mb-4" />
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === "/"}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-4 py-3 rounded-md text-sm font-semibold transition-all duration-200 ${
                      isActive
                        ? "bg-gradient-to-r from-primary to-indigo-600 text-white shadow-md"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    }`
                  }
                >
                  <ApperIcon name={item.icon} className="w-5 h-5" />
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;