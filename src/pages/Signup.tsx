import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';

const Signup: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await authAPI.signup(formData);
      login(response.data.token, response.data.user);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-8">
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center mb-4">
              <span className="text-white font-bold text-xl">SS</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Join SlotSwapper
            </h2>
            <p className="text-gray-600">Create your account to start swapping</p>
          </div>
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border-l-4 border-red-400 text-red-700 px-4 py-3 rounded-r animate-pulse">
                <div className="flex items-center">
                  <span className="mr-2">⚠️</span>
                  {error}
                </div>
              </div>
            )}
            
            <div className="space-y-4">
              <div className="relative">
                <input
                  type="text"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 pl-12"
                  placeholder="Full name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
                <span className="absolute left-4 top-3.5 text-gray-400">👤</span>
              </div>
              <div className="relative">
                <input
                  type="email"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 pl-12"
                  placeholder="Email address"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
                <span className="absolute left-4 top-3.5 text-gray-400">📧</span>
              </div>
              <div className="relative">
                <input
                  type="password"
                  required
                  minLength={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 pl-12"
                  placeholder="Password (min 6 characters)"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <span className="absolute left-4 top-3.5 text-gray-400">🔒</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-4 rounded-xl font-medium hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Creating account...
                </div>
              ) : (
                'Create Account ✨'
              )}
            </button>

            <div className="text-center">
              <Link to="/login" className="text-purple-600 hover:text-purple-700 font-medium transition-colors">
                Already have an account? <span className="underline">Sign in</span>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;