
import React from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface RequestDetailsProps {
  requestDetails: any;
  teacherConnected: boolean;
  teacherProfile: any;
  onCancel: () => void;
}

export const RequestDetails = ({
  requestDetails,
  teacherConnected,
  teacherProfile,
  onCancel
}: RequestDetailsProps) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Waiting Room</h1>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onCancel}
        >
          <X className="mr-1 h-4 w-4" />
          Cancel Request
        </Button>
      </div>

      <h2 className="text-xl font-semibold mb-4">Your Help Request</h2>
      
      <div className="mb-6">
        <p className="text-gray-600">
          <span className="font-medium">Skill Category:</span> {requestDetails.skill_category}
        </p>
        <p className="text-gray-600">
          <span className="font-medium">Specific Need:</span> {requestDetails.specific_need}
        </p>
        <p className="text-gray-600 mt-2">
          <span className="font-medium">Status:</span> {teacherConnected ? 'Teacher connected' : 'Waiting for a teacher'}
        </p>
      </div>
      
      {teacherConnected && teacherProfile && (
        <div className="mb-6">
          <h3 className="font-medium mb-2">Connected Teacher:</h3>
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden mr-4">
              {teacherProfile?.avatar_url ? (
                <img 
                  src={teacherProfile.avatar_url} 
                  alt={teacherProfile.username} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-primary text-white font-bold text-lg">
                  {teacherProfile?.username?.charAt(0).toUpperCase() || 'T'}
                </div>
              )}
            </div>
            <div>
              <p className="font-medium">{teacherProfile.username}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
