import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { profileAPI } from '../services/api';

const Profile: React.FC = () => {
  const { user, login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name,
        email: user.email
      }));
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Validate password confirmation
    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      setError('New passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const updateData: any = {
        name: formData.name,
        email: formData.email
      };

      // Only include password fields if changing password
      if (formData.newPassword) {
        updateData.currentPassword = formData.currentPassword;
        updateData.newPassword = formData.newPassword;
      }

      const response = await profileAPI.updateProfile(updateData);
      
      // Update user context with new data
      if (user) {
        login(localStorage.getItem('token') || '', response.data);
      }

      setSuccess('Profile updated successfully!');
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="max-w-2xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">👤 Profile Settings</h1>
          <p className="text-gray-600">Update your personal information and security settings</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border-l-4 border-red-400 text-red-700 px-4 py-3 rounded-r animate-pulse">
                <div className="flex items-center">
                  <span className="mr-2">⚠️</span>
                  {error}
                </div>
              </div>
            )}

            {success && (
              <div className="bg-green-50 border-l-4 border-green-400 text-green-700 px-4 py-3 rounded-r animate-pulse">
                <div className="flex items-center">
                  <span className="mr-2">✅</span>
                  {success}
                </div>
              </div>
            )}

            {/* Personal Information */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2">
                Personal Information
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all pl-12"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                    <span className="absolute left-4 top-3.5 text-gray-400">👤</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all pl-12"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                    <span className="absolute left-4 top-3.5 text-gray-400">📧</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Password Change */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2">
                Change Password
              </h2>
              <p className="text-sm text-gray-600">Leave blank if you don't want to change your password</p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all pl-12"
                      value={formData.currentPassword}
                      onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                    />
                    <span className="absolute left-4 top-3.5 text-gray-400">🔒</span>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type="password"
                        minLength={6}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all pl-12"
                        value={formData.newPassword}
                        onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                      />
                      <span className="absolute left-4 top-3.5 text-gray-400">🔑</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <input
                        type="password"
                        minLength={6}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all pl-12"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      />
                      <span className="absolute left-4 top-3.5 text-gray-400">🔐</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-6 rounded-xl font-medium hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Updating Profile...
                  </div>
                ) : (
                  'Update Profile 💾'
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Account Info */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Member since:</span>
              <p className="font-medium">{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</p>
            </div>
            <div>
              <span className="text-gray-600">User ID:</span>
              <p className="font-medium font-mono text-xs">{user?.id}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;