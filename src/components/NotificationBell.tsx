import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { swapsAPI } from '../services/api';

const NotificationBell: React.FC = () => {
  const [count, setCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    fetchNotificationCount();
    
    // Poll for updates every 30 seconds
    const interval = setInterval(fetchNotificationCount, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchNotificationCount = async () => {
    try {
      const response = await swapsAPI.getIncomingRequests();
      const pendingCount = response.data.filter(req => req.status === 'PENDING').length;
      setCount(pendingCount);
    } catch (error) {
      console.error('Failed to fetch notification count:', error);
      setCount(0);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="relative p-2 text-white hover:text-blue-100 transition-colors"
        title="Notifications"
      >
        <span className="text-xl">🔔</span>
        {count > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
            {count > 9 ? '9+' : count}
          </span>
        )}
      </button>

      {showDropdown && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 z-50">
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900">🔔 Notifications</h3>
          </div>
          
          <div className="p-6 text-center">
            {count > 0 ? (
              <div>
                <div className="text-4xl mb-2">📥</div>
                <p className="text-gray-700 mb-4">You have {count} pending swap request{count > 1 ? 's' : ''}!</p>
                <Link
                  to="/requests"
                  onClick={() => setShowDropdown(false)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  View Requests
                </Link>
              </div>
            ) : (
              <div>
                <div className="text-4xl mb-2">🔕</div>
                <p className="text-gray-500">No new notifications</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;