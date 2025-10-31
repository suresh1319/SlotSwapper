import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Event } from '../types';
import { swapsAPI, eventsAPI } from '../services/api';

const Marketplace: React.FC = () => {
  const [availableSlots, setAvailableSlots] = useState<Event[]>([]);
  const [mySwappableSlots, setMySwappableSlots] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSwapModal, setShowSwapModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<Event | null>(null);
  const [selectedMySlot, setSelectedMySlot] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [slotsResponse, myEventsResponse] = await Promise.all([
        swapsAPI.getSwappableSlots(),
        eventsAPI.getMyEvents()
      ]);
      
      setAvailableSlots(slotsResponse.data);
      setMySwappableSlots(myEventsResponse.data.filter(event => event.status === 'SWAPPABLE'));
    } catch (error) {
      console.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleRequestSwap = (slot: Event) => {
    setSelectedSlot(slot);
    setShowSwapModal(true);
  };

  const handleSubmitSwap = async () => {
    if (!selectedSlot || !selectedMySlot) return;

    try {
      await swapsAPI.createSwapRequest({
        mySlotId: selectedMySlot,
        theirSlotId: selectedSlot._id
      });
      
      setShowSwapModal(false);
      setSelectedSlot(null);
      setSelectedMySlot('');
      fetchData();
      alert('🎉 Swap request sent successfully!');
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to send swap request');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading marketplace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="max-w-6xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">🏪 Marketplace</h1>
          <p className="text-gray-600">Discover and request swappable slots from other users</p>
        </div>

        {availableSlots.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-white rounded-2xl shadow-lg p-12 max-w-md mx-auto">
              <div className="text-6xl mb-4">🏪</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No slots available</h3>
              <p className="text-gray-600">No swappable slots are available at the moment. Check back later!</p>
            </div>
          </div>
        ) : (
          <div className="grid gap-6">
            {availableSlots.map((slot) => (
              <div key={slot._id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <h3 className="text-xl font-semibold text-gray-900">{slot.title}</h3>
                      <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 border border-green-200">
                        🔄 Available
                      </span>
                    </div>
                    <div className="flex items-center text-gray-600 mb-2">
                      <span className="mr-2">🕒</span>
                      <p className="text-sm">
                        {format(new Date(slot.startTime), 'EEEE, MMM dd, yyyy')} • {format(new Date(slot.startTime), 'HH:mm')} - {format(new Date(slot.endTime), 'HH:mm')}
                      </p>
                    </div>
                    <div className="flex items-center text-gray-500">
                      <span className="mr-2">👤</span>
                      <p className="text-sm">
                        Owner: {typeof slot.userId === 'object' ? slot.userId.name : 'Unknown'}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRequestSwap(slot)}
                    disabled={mySwappableSlots.length === 0}
                    className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:from-green-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100"
                  >
                    🔄 Request Swap
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {mySwappableSlots.length === 0 && availableSlots.length > 0 && (
          <div className="mt-8 bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-r-xl">
            <div className="flex items-center">
              <span className="text-2xl mr-3">⚠️</span>
              <div>
                <h3 className="text-yellow-800 font-medium">No swappable slots</h3>
                <p className="text-yellow-700 text-sm mt-1">
                  You need to have swappable slots to request swaps. Go to your calendar and make some events swappable.
                </p>
              </div>
            </div>
          </div>
        )}

        {showSwapModal && selectedSlot && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">🔄 Request Swap</h2>
              
              <div className="mb-6">
                <p className="text-sm font-medium text-gray-700 mb-3">You want to swap:</p>
                <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl">
                  <p className="font-semibold text-blue-900">{selectedSlot.title}</p>
                  <p className="text-sm text-blue-700">
                    {format(new Date(selectedSlot.startTime), 'EEEE, MMM dd, yyyy')} • {format(new Date(selectedSlot.startTime), 'HH:mm')} - {format(new Date(selectedSlot.endTime), 'HH:mm')}
                  </p>
                </div>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Select your slot to offer:
                </label>
                <select
                  value={selectedMySlot}
                  onChange={(e) => setSelectedMySlot(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                >
                  <option value="">Choose a slot...</option>
                  {mySwappableSlots.map((slot) => (
                    <option key={slot._id} value={slot._id}>
                      {slot.title} - {format(new Date(slot.startTime), 'MMM dd, HH:mm')}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={handleSubmitSwap}
                  disabled={!selectedMySlot}
                  className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 text-white py-3 rounded-xl font-medium hover:from-green-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 disabled:hover:scale-100"
                >
                  Send Request 🚀
                </button>
                <button
                  onClick={() => {
                    setShowSwapModal(false);
                    setSelectedSlot(null);
                    setSelectedMySlot('');
                  }}
                  className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-xl font-medium hover:bg-gray-300 transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Marketplace;