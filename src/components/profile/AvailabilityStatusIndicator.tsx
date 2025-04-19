
import { CircleCheck, MessageSquare, CircleX, WifiOff } from 'lucide-react';
import { AvailabilityStatus } from '@/lib/constants';

interface AvailabilityStatusIndicatorProps {
  status: AvailabilityStatus;
}

export const AvailabilityStatusIndicator = ({ status }: AvailabilityStatusIndicatorProps) => {
  // Define the status configurations
  const statusConfig = {
    live: {
      icon: <CircleCheck className="h-4 w-4 text-green-500 mr-1" />,
      label: "Available for Live Session",
      textColor: "text-green-600"
    },
    messaging: {
      icon: <MessageSquare className="h-4 w-4 text-blue-500 mr-1" />,
      label: "Available for Messaging",
      textColor: "text-blue-600"
    },
    busy: {
      icon: <CircleX className="h-4 w-4 text-orange-500 mr-1" />,
      label: "Busy",
      textColor: "text-orange-600"
    },
    offline: {
      icon: <WifiOff className="h-4 w-4 text-gray-500 mr-1" />,
      label: "Offline",
      textColor: "text-gray-600"
    }
  };

  // Ensure we have a valid status or default to 'messaging'
  const validStatus = (status && statusConfig[status]) ? status : 'messaging';
  const config = statusConfig[validStatus];

  return (
    <div className="mt-2 flex items-center">
      <span className="text-sm text-gray-500 mr-2">Current status:</span>
      <div className="flex items-center">
        {config.icon}
        <span className={config.textColor}>{config.label}</span>
      </div>
    </div>
  );
};
