import React, { useState, useEffect } from 'react';
import { format, subDays, startOfWeek, endOfWeek } from 'date-fns';
import { Event, SwapRequest } from '../types';
import { eventsAPI, swapsAPI } from '../services/api';

interface Analytics {
  totalEvents: number;
  swappableEvents: number;
  completedSwaps: number;
  pendingSwaps: number;
  swapSuccessRate: number;
  weeklyActivity: { date: string; swaps: number }[];
  topSwapPartners: { name: string; swaps: number }[];
}

const Analytics: React.FC = () => {
  const [analytics, setAnalytics] = useState<Analytics>({
    totalEvents: 0,
    swappableEvents: 0,
    completedSwaps: 0,
    pendingSwaps: 0,
    swapSuccessRate: 0,
    weeklyActivity: [],
    topSwapPartners: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const [eventsResponse, incomingResponse, outgoingResponse] = await Promise.all([
        eventsAPI.getMyEvents(),
        swapsAPI.getIncomingRequests(),
        swapsAPI.getOutgoingRequests()
      ]);

      const events = eventsResponse.data;
      const incoming = incomingResponse.data;
      const outgoing = outgoingResponse.data;
      const allSwaps = [...incoming, ...outgoing];

      const completedSwaps = allSwaps.filter(swap => swap.status === 'ACCEPTED').length;
      const totalSwapRequests = allSwaps.length;
      const swapSuccessRate = totalSwapRequests > 0 ? (completedSwaps / totalSwapRequests) * 100 : 0;

      // Weekly activity (last 7 days)
      const weeklyActivity = Array.from({ length: 7 }, (_, i) => {
        const date = subDays(new Date(), i);
        const daySwaps = allSwaps.filter(swap => 
          new Date(swap.createdAt).toDateString() === date.toDateString()
        ).length;
        return {
          date: format(date, 'MMM dd'),
          swaps: daySwaps
        };
      }).reverse();

      // Top swap partners
      const partnerCounts: { [key: string]: number } = {};
      allSwaps.forEach(swap => {
        if (swap.status === 'ACCEPTED') {
          const partnerName = swap.requesterUserId.name === swap.targetUserId.name 
            ? swap.targetUserId.name 
            : swap.requesterUserId.name;
          partnerCounts[partnerName] = (partnerCounts[partnerName] || 0) + 1;
        }
      });

      const topSwapPartners = Object.entries(partnerCounts)
        .map(([name, swaps]) => ({ name, swaps }))
        .sort((a, b) => b.swaps - a.swaps)
        .slice(0, 5);

      setAnalytics({
        totalEvents: events.length,
        swappableEvents: events.filter(e => e.status === 'SWAPPABLE').length,
        completedSwaps,
        pendingSwaps: allSwaps.filter(swap => swap.status === 'PENDING').length,
        swapSuccessRate,
        weeklyActivity,
        topSwapPartners
      });
    } catch (error) {
      console.error('Failed to fetch analytics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">📊 Analytics Dashboard</h1>
          <p className="text-gray-600">Track your swapping activity and performance</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Events</p>
                <p className="text-3xl font-bold text-gray-900">{analytics.totalEvents}</p>
              </div>
              <div className="text-4xl">📅</div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Swappable Events</p>
                <p className="text-3xl font-bold text-gray-900">{analytics.swappableEvents}</p>
              </div>
              <div className="text-4xl">🔄</div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed Swaps</p>
                <p className="text-3xl font-bold text-gray-900">{analytics.completedSwaps}</p>
              </div>
              <div className="text-4xl">✅</div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Success Rate</p>
                <p className="text-3xl font-bold text-gray-900">{analytics.swapSuccessRate.toFixed(1)}%</p>
              </div>
              <div className="text-4xl">🎯</div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Weekly Activity Chart */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">📈 Weekly Activity</h3>
            <div className="space-y-4">
              {analytics.weeklyActivity.map((day, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <div className="w-16 text-sm text-gray-600">{day.date}</div>
                  <div className="flex-1 bg-gray-200 rounded-full h-4 relative">
                    <div 
                      className="bg-gradient-to-r from-indigo-500 to-purple-500 h-4 rounded-full transition-all duration-500"
                      style={{ width: `${Math.max((day.swaps / Math.max(...analytics.weeklyActivity.map(d => d.swaps), 1)) * 100, 5)}%` }}
                    ></div>
                  </div>
                  <div className="w-8 text-sm font-medium text-gray-900">{day.swaps}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Swap Partners */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">🤝 Top Swap Partners</h3>
            {analytics.topSwapPartners.length > 0 ? (
              <div className="space-y-4">
                {analytics.topSwapPartners.map((partner, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{partner.name}</p>
                    </div>
                    <div className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium">
                      {partner.swaps} swaps
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <div className="text-4xl mb-2">🤝</div>
                <p>No swap partners yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Insights */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">💡 Insights & Tips</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-blue-50 rounded-xl p-4">
              <h4 className="font-semibold text-blue-900 mb-2">🎯 Optimization Tip</h4>
              <p className="text-blue-800 text-sm">
                {analytics.swappableEvents === 0 
                  ? "Make some events swappable to start receiving swap requests!"
                  : analytics.swapSuccessRate < 50
                  ? "Consider being more flexible with your swap requests to improve success rate."
                  : "Great job! Your swap success rate is excellent."
                }
              </p>
            </div>
            <div className="bg-green-50 rounded-xl p-4">
              <h4 className="font-semibold text-green-900 mb-2">📊 Activity Level</h4>
              <p className="text-green-800 text-sm">
                {analytics.completedSwaps === 0
                  ? "Complete your first swap to unlock more insights!"
                  : analytics.completedSwaps < 5
                  ? "You're getting started! Keep swapping to build your network."
                  : "You're an active swapper! Your network is growing strong."
                }
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;