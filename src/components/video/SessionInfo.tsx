
import React from 'react';
import { formatDuration } from '@/lib/utils';

interface SessionInfoProps {
  startTime: string | null;
  duration: number;
  connectionStatus: 'disconnected' | 'connecting' | 'connected';
  participantType: string | null;
}

const SessionInfo = ({ 
  startTime, 
  duration, 
  connectionStatus,
  participantType
}: SessionInfoProps) => {
  // Format the start time
  const formattedStartTime = startTime 
    ? new Date(startTime).toLocaleTimeString() 
    : 'Not started';

  // Get connection status label and color
  const getStatusDetails = () => {
    switch (connectionStatus) {
      case 'connected':
        return { label: 'Connected', color: 'text-green-600' };
      case 'connecting':
        return { label: 'Connecting...', color: 'text-amber-600' };
      case 'disconnected':
        return { label: 'Disconnected', color: 'text-red-600' };
      default:
        return { label: 'Unknown', color: 'text-gray-600' };
    }
  };

  const statusDetails = getStatusDetails();

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <h3 className="text-lg font-medium mb-2">Session Information</h3>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Status:</span>
          <span className={`font-medium ${statusDetails.color}`}>{statusDetails.label}</span>
        </div>
        
        {connectionStatus === 'connected' && (
          <>
            <div className="flex justify-between">
              <span className="text-gray-600">Started:</span>
              <span>{formattedStartTime}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Duration:</span>
              <span>{formatDuration(duration)}</span>
            </div>
            
            {participantType && (
              <div className="flex justify-between">
                <span className="text-gray-600">Role:</span>
                <span className="capitalize">{participantType}</span>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SessionInfo;
