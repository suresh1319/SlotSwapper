import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Event } from '../types';
import { eventsAPI } from '../services/api';

const Dashboard: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    startTime: '',
    endTime: ''
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await eventsAPI.getMyEvents();
      setEvents(response.data);
    } catch (error) {
      console.error('Failed to fetch events');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await eventsAPI.createEvent(formData);
      setFormData({ title: '', startTime: '', endTime: '' });
      setShowForm(false);
      fetchEvents();
    } catch (error) {
      console.error('Failed to create event');
    }
  };

  const handleStatusChange = async (eventId: string, status: string) => {
    try {
      await eventsAPI.updateEventStatus(eventId, status);
      fetchEvents();
    } catch (error) {
      console.error('Failed to update status');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'BUSY': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'SWAPPABLE': return 'bg-green-100 text-green-800 border-green-200';
      case 'SWAP_PENDING': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'BUSY': return '🔒';
      case 'SWAPPABLE': return '🔄';
      case 'SWAP_PENDING': return '⏳';
      default: return '📅';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your calendar...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">📅 My Calendar</h1>
            <p className="text-gray-600">Manage your events and make them swappable</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            ➕ Add Event
          </button>
        </div>

        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">✨ Create New Event</h2>
              <form onSubmit={handleCreateEvent} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Event Title</label>
                  <input
                    type="text"
                    placeholder="e.g., Team Meeting"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Start Time</label>
                  <input
                    type="datetime-local"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">End Time</label>
                  <input
                    type="datetime-local"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                  />
                </div>
                <div className="flex space-x-3 pt-4">
                  <button 
                    type="submit" 
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105"
                  >
                    Create Event
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-xl font-medium hover:bg-gray-300 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="grid gap-6">
          {events.map((event) => (
            <div key={event._id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <h3 className="text-xl font-semibold text-gray-900">{event.title}</h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(event.status)}`}>
                      {getStatusIcon(event.status)} {event.status}
                    </span>
                  </div>
                  <div className="flex items-center text-gray-600 mb-2">
                    <span className="mr-2">🕒</span>
                    <p className="text-sm">
                      {format(new Date(event.startTime), 'EEEE, MMM dd, yyyy')} • {format(new Date(event.startTime), 'HH:mm')} - {format(new Date(event.endTime), 'HH:mm')}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col space-y-2">
                  {event.status === 'BUSY' && (
                    <button
                      onClick={() => handleStatusChange(event._id, 'SWAPPABLE')}
                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all transform hover:scale-105"
                    >
                      🔄 Make Swappable
                    </button>
                  )}
                  {event.status === 'SWAPPABLE' && (
                    <button
                      onClick={() => handleStatusChange(event._id, 'BUSY')}
                      className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all transform hover:scale-105"
                    >
                      🔒 Make Busy
                    </button>
                  )}
                  {event.status === 'SWAP_PENDING' && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg px-3 py-2">
                      <p className="text-yellow-800 text-sm font-medium">⏳ Swap Pending</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {events.length === 0 && (
            <div className="text-center py-16">
              <div className="bg-white rounded-2xl shadow-lg p-12 max-w-md mx-auto">
                <div className="text-6xl mb-4">📅</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No events yet</h3>
                <p className="text-gray-600 mb-6">Create your first event to get started with slot swapping!</p>
                <button
                  onClick={() => setShowForm(true)}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105"
                >
                  ➕ Create First Event
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;