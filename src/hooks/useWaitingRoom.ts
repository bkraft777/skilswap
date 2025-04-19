
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

interface WaitingRoomState {
  isLoading: boolean;
  requestDetails: any;
  teacherConnected: boolean;
  teacherProfile: any;
  teacherId: string | undefined;
}

export const useWaitingRoom = (requestId: string | undefined) => {
  const [state, setState] = useState<WaitingRoomState>({
    isLoading: true,
    requestDetails: null,
    teacherConnected: false,
    teacherProfile: null,
    teacherId: undefined,
  });
  
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    const fetchRequestDetails = async () => {
      try {
        const { data, error } = await supabase
          .from('skill_help_requests')
          .select('*')
          .eq('id', requestId)
          .single();

        if (error) throw error;

        const { data: connectionData, error: connectionError } = await supabase
          .from('teacher_connections')
          .select('teacher_id, status')
          .eq('request_id', requestId)
          .eq('status', 'connected')
          .single();

        if (!connectionError && connectionData) {
          const { data: teacherData, error: teacherError } = await supabase
            .from('profiles')
            .select('username, avatar_url')
            .eq('id', connectionData.teacher_id)
            .single();
            
          if (!teacherError) {
            setState(prev => ({
              ...prev,
              teacherConnected: true,
              teacherProfile: teacherData,
              teacherId: connectionData.teacher_id,
            }));
          }
        }

        setState(prev => ({
          ...prev,
          requestDetails: data,
          isLoading: false,
        }));
      } catch (error) {
        console.error('Error fetching request details:', error);
        toast({
          title: 'Error',
          description: 'Could not load request details',
          variant: 'destructive',
        });
        navigate('/dashboard');
      }
    };

    fetchRequestDetails();

    const connectionsChannel = supabase
      .channel('waiting-room-connections')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'teacher_connections',
          filter: `request_id=eq.${requestId}`,
        },
        async (payload) => {
          const newConnection = payload.new as any;
          
          if (newConnection.status === 'connected') {
            const { data: teacherData, error: teacherError } = await supabase
              .from('profiles')
              .select('username, avatar_url')
              .eq('id', newConnection.teacher_id)
              .single();
              
            if (!teacherError) {
              setState(prev => ({
                ...prev,
                teacherConnected: true,
                teacherProfile: teacherData,
                teacherId: newConnection.teacher_id,
              }));
              
              toast({
                title: 'Teacher connected',
                description: `${teacherData.username} has joined your help request`,
              });
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(connectionsChannel);
    };
  }, [requestId, user, navigate, toast]);

  const cancelRequest = async () => {
    try {
      await supabase
        .from('skill_help_requests')
        .update({ status: 'cancelled' })
        .eq('id', requestId);

      toast({
        title: 'Request cancelled',
        description: 'Your help request has been cancelled',
      });
      navigate('/dashboard');
    } catch (error) {
      console.error('Error cancelling request:', error);
      toast({
        title: 'Error',
        description: 'Failed to cancel request',
        variant: 'destructive',
      });
    }
  };

  return {
    ...state,
    cancelRequest
  };
};
