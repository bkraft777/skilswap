
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useTeacherNotifications } from '@/hooks/useTeacherNotifications';
import NotificationItem from './NotificationItem';
import type { TeacherNotification } from '@/types/teacher';

const TeacherNotifications = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { notifications, unreadCount, markAsRead } = useTeacherNotifications(user?.id);

  const handleNotificationClick = async (notification: TeacherNotification) => {
    await markAsRead(notification.id);

    try {
      const { data, error } = await supabase
        .from('teacher_connections')
        .insert({
          teacher_id: user?.id,
          request_id: notification.request_id,
          status: 'connected'
        })
        .select()
        .single();

      if (error) throw error;

      navigate(`/teacher-room/${notification.request_id}`);
      setIsOpen(false);
    } catch (error) {
      console.error('Error connecting to help request:', error);
      toast({
        title: 'Error',
        description: 'Failed to connect to help request',
        variant: 'destructive',
      });
    }
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel>
          Notifications ({notifications.length})
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onClick={handleNotificationClick}
            />
          ))
        ) : (
          <div className="p-4 text-center text-gray-500">
            No notifications yet
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default TeacherNotifications;
