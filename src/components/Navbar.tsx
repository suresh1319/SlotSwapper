import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import NotificationBell from './NotificationBell';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center space-x-2 text-white hover:text-blue-100 transition-colors">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <span className="text-blue-600 font-bold text-sm">SS</span>
              </div>
              <span className="text-xl font-bold">SlotSwapper</span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-1">
            <Link
              to="/dashboard"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive('/dashboard')
                  ? 'bg-white text-blue-600 shadow-md'
                  : 'text-white hover:bg-white/20'
              }`}
            >
              📅 My Calendar
            </Link>
            <Link
              to="/marketplace"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive('/marketplace')
                  ? 'bg-white text-blue-600 shadow-md'
                  : 'text-white hover:bg-white/20'
              }`}
            >
              🏪 Marketplace
            </Link>
            <Link
              to="/requests"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive('/requests')
                  ? 'bg-white text-blue-600 shadow-md'
                  : 'text-white hover:bg-white/20'
              }`}
            >
              📬 Requests
            </Link>
            <Link
              to="/analytics"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive('/analytics')
                  ? 'bg-white text-blue-600 shadow-md'
                  : 'text-white hover:bg-white/20'
              }`}
            >
              📊 Analytics
            </Link>
            
            <div className="flex items-center space-x-4 ml-6 pl-6 border-l border-white/30">
              <NotificationBell />
              <Link
                to="/profile"
                className="flex items-center space-x-2 text-white hover:text-blue-100 transition-colors"
              >
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">{user?.name?.charAt(0)}</span>
                </div>
                <span className="text-white text-sm">Hi, {user?.name}</span>
              </Link>
              <button
                onClick={logout}
                className="text-white/80 hover:text-white text-sm px-3 py-1 rounded-md hover:bg-white/20 transition-all"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;