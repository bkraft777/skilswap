
import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import type { TeacherNotification } from '@/types/teacher';

interface NotificationItemProps {
  notification: TeacherNotification;
  onClick: (notification: TeacherNotification) => void;
}

const NotificationItem = ({ notification, onClick }: NotificationItemProps) => {
  return (
    <DropdownMenuItem
      key={notification.id}
      className={`p-3 cursor-pointer ${
        notification.status === 'unread' ? 'bg-gray-50' : ''
      }`}
      onClick={() => onClick(notification)}
    >
      <div className="flex flex-col">
        <p className="text-sm">
          {notification.message}
        </p>
        <p className="text-xs text-gray-500 mt-1">
          {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
        </p>
      </div>
    </DropdownMenuItem>
  );
};

export default NotificationItem;
