
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface Notification {
  id: string;
  teacher_id: string;
  message: string;
  status: string;
  created_at: string;
  request_id: string;
}

const TeacherNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;

    // Fetch initial notifications
    fetchNotifications();

    // Subscribe to new notifications
    const notificationsChannel = supabase
      .channel('teacher-notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'teacher_notifications',
          filter: `teacher_id=eq.${user.id}`,
        },
        (payload) => {
          const newNotification = payload.new as Notification;
          setNotifications((prev) => [newNotification, ...prev]);
          setUnreadCount((prev) => prev + 1);
          
          // Show a toast for new notifications
          toast({
            title: 'New help request',
            description: newNotification.message,
          });
        }
      )
      .subscribe();

    // Clean up subscription
    return () => {
      supabase.removeChannel(notificationsChannel);
    };
  }, [user, toast]);

  const fetchNotifications = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('teacher_notifications')
        .select('*')
        .eq('teacher_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;

      setNotifications(data || []);
      setUnreadCount(data?.filter(n => n.status === 'unread').length || 0);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      await supabase
        .from('teacher_notifications')
        .update({ status: 'read' })
        .eq('id', notificationId);

      // Update local state
      setNotifications(notifications.map(n => 
        n.id === notificationId ? { ...n, status: 'read' } : n
      ));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleNotificationClick = async (notification: Notification) => {
    // Mark as read
    await markAsRead(notification.id);

    // Connect to the help request
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

      // Navigate to the waiting room
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
            <DropdownMenuItem
              key={notification.id}
              className={`p-3 cursor-pointer ${
                notification.status === 'unread' ? 'bg-gray-50' : ''
              }`}
              onClick={() => handleNotificationClick(notification)}
            >
              <div className="flex flex-col">
                <p className="text-sm">
                  {notification.message}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(notification.created_at).toLocaleString()}
                </p>
              </div>
            </DropdownMenuItem>
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
