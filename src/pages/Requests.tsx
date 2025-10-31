import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { SwapRequest } from '../types';
import { swapsAPI } from '../services/api';

const Requests: React.FC = () => {
  const [incomingRequests, setIncomingRequests] = useState<SwapRequest[]>([]);
  const [outgoingRequests, setOutgoingRequests] = useState<SwapRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'incoming' | 'outgoing'>('incoming');

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const [incomingResponse, outgoingResponse] = await Promise.all([
        swapsAPI.getIncomingRequests(),
        swapsAPI.getOutgoingRequests()
      ]);
      
      setIncomingRequests(incomingResponse.data);
      setOutgoingRequests(outgoingResponse.data);
    } catch (error) {
      console.error('Failed to fetch requests');
    } finally {
      setLoading(false);
    }
  };

  const handleResponse = async (requestId: string, accept: boolean) => {
    try {
      await swapsAPI.respondToSwap(requestId, accept);
      fetchRequests(); // Refresh data
      alert(`Swap ${accept ? 'accepted' : 'rejected'} successfully!`);
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to respond to swap');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'ACCEPTED': return 'bg-green-100 text-green-800';
      case 'REJECTED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Swap Requests</h1>

      <div className="flex space-x-1 mb-6">
        <button
          onClick={() => setActiveTab('incoming')}
          className={`px-4 py-2 rounded-md ${
            activeTab === 'incoming'
              ? 'bg-primary text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Incoming ({incomingRequests.filter(r => r.status === 'PENDING').length})
        </button>
        <button
          onClick={() => setActiveTab('outgoing')}
          className={`px-4 py-2 rounded-md ${
            activeTab === 'outgoing'
              ? 'bg-primary text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Outgoing ({outgoingRequests.filter(r => r.status === 'PENDING').length})
        </button>
      </div>

      {activeTab === 'incoming' && (
        <div className="space-y-4">
          {incomingRequests.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No incoming requests.
            </div>
          ) : (
            incomingRequests.map((request) => (
              <div key={request._id} className="bg-white p-4 rounded-lg shadow border">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(request.status)}`}>
                        {request.status}
                      </span>
                      <span className="text-sm text-gray-600">
                        from {request.requesterUserId.name}
                      </span>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium text-sm text-gray-600 mb-1">They offer:</h4>
                        <div className="bg-blue-50 p-3 rounded">
                          <p className="font-medium">{request.requesterSlotId.title}</p>
                          <p className="text-sm text-gray-600">
                            {format(new Date(request.requesterSlotId.startTime), 'MMM dd, yyyy HH:mm')} - 
                            {format(new Date(request.requesterSlotId.endTime), 'HH:mm')}
                          </p>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-sm text-gray-600 mb-1">For your:</h4>
                        <div className="bg-green-50 p-3 rounded">
                          <p className="font-medium">{request.targetSlotId.title}</p>
                          <p className="text-sm text-gray-600">
                            {format(new Date(request.targetSlotId.startTime), 'MMM dd, yyyy HH:mm')} - 
                            {format(new Date(request.targetSlotId.endTime), 'HH:mm')}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {request.status === 'PENDING' && (
                    <div className="flex space-x-2 ml-4">
                      <button
                        onClick={() => handleResponse(request._id, true)}
                        className="bg-secondary text-white px-3 py-1 rounded text-sm hover:bg-green-600"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleResponse(request._id, false)}
                        className="bg-danger text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
                
                <p className="text-xs text-gray-500 mt-2">
                  Requested {format(new Date(request.createdAt), 'MMM dd, yyyy HH:mm')}
                </p>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'outgoing' && (
        <div className="space-y-4">
          {outgoingRequests.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No outgoing requests.
            </div>
          ) : (
            outgoingRequests.map((request) => (
              <div key={request._id} className="bg-white p-4 rounded-lg shadow border">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(request.status)}`}>
                        {request.status}
                      </span>
                      <span className="text-sm text-gray-600">
                        to {request.targetUserId.name}
                      </span>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium text-sm text-gray-600 mb-1">You offered:</h4>
                        <div className="bg-blue-50 p-3 rounded">
                          <p className="font-medium">{request.requesterSlotId.title}</p>
                          <p className="text-sm text-gray-600">
                            {format(new Date(request.requesterSlotId.startTime), 'MMM dd, yyyy HH:mm')} - 
                            {format(new Date(request.requesterSlotId.endTime), 'HH:mm')}
                          </p>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-sm text-gray-600 mb-1">For their:</h4>
                        <div className="bg-green-50 p-3 rounded">
                          <p className="font-medium">{request.targetSlotId.title}</p>
                          <p className="text-sm text-gray-600">
                            {format(new Date(request.targetSlotId.startTime), 'MMM dd, yyyy HH:mm')} - 
                            {format(new Date(request.targetSlotId.endTime), 'HH:mm')}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {request.status === 'PENDING' && (
                    <div className="ml-4">
                      <span className="text-sm text-gray-500">Waiting for response...</span>
                    </div>
                  )}
                </div>
                
                <p className="text-xs text-gray-500 mt-2">
                  Sent {format(new Date(request.createdAt), 'MMM dd, yyyy HH:mm')}
                  {request.respondedAt && (
                    <span> • Responded {format(new Date(request.respondedAt), 'MMM dd, yyyy HH:mm')}</span>
                  )}
                </p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Requests;