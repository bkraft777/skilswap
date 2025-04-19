
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Loader2, MessageSquare, Video } from 'lucide-react';

const WaitingRoom = () => {
  const { requestId } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [requestDetails, setRequestDetails] = useState<any>(null);
  const [connectedTeachers, setConnectedTeachers] = useState<any[]>([]);
  const [selectedTeacherId, setSelectedTeacherId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    const fetchRequestDetails = async () => {
      try {
        const { data, error } = await supabase
          .from('skill_help_requests')
          .select('*, profiles:learner_id(username)')
          .eq('id', requestId)
          .single();

        if (error) throw error;
        setRequestDetails(data);
      } catch (error) {
        console.error('Error fetching request details:', error);
        toast({
          title: 'Error',
          description: 'Could not load request details',
          variant: 'destructive',
        });
        navigate('/find-teacher');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRequestDetails();

    // Subscribe to teacher connections
    const teachersChannel = supabase
      .channel('waiting-room')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'teacher_connections',
          filter: `request_id=eq.${requestId}`,
        },
        (payload) => {
          handleNewTeacherConnection(payload.new);
        }
      )
      .subscribe();

    // Clean up subscription
    return () => {
      supabase.removeChannel(teachersChannel);
    };
  }, [requestId, user, navigate, toast]);

  const handleNewTeacherConnection = async (connection: any) => {
    try {
      // Fetch teacher profile info
      const { data: teacherProfile, error: profileError } = await supabase
        .from('profiles')
        .select('username, avatar_url')
        .eq('id', connection.teacher_id)
        .single();

      if (profileError) throw profileError;

      setConnectedTeachers((prev) => [
        ...prev,
        {
          id: connection.teacher_id,
          connectionId: connection.id,
          username: teacherProfile.username,
          avatar_url: teacherProfile.avatar_url,
        },
      ]);

      toast({
        title: 'Teacher connected!',
        description: `${teacherProfile.username} has joined the waiting room`,
      });
    } catch (error) {
      console.error('Error processing teacher connection:', error);
    }
  };

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
      navigate('/find-teacher');
    } catch (error) {
      console.error('Error cancelling request:', error);
      toast({
        title: 'Error',
        description: 'Failed to cancel request',
        variant: 'destructive',
      });
    }
  };

  const startChat = async (teacherId: string) => {
    setSelectedTeacherId(teacherId);
    // In a future implementation, this would navigate to the chat room
    toast({
      title: 'Coming soon!',
      description: 'Chat functionality will be implemented in the next phase',
    });
  };

  const startLiveSession = async (teacherId: string) => {
    setSelectedTeacherId(teacherId);
    // In a future implementation, this would start a live video session
    toast({
      title: 'Coming soon!',
      description: 'Live video sessions will be implemented in the next phase',
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <span className="ml-2">Loading...</span>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-center">Waiting Room</h1>
          
          {requestDetails && (
            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
              <h2 className="text-xl font-semibold mb-2">Your Help Request</h2>
              <div className="mb-4">
                <p className="text-gray-600">
                  <span className="font-medium">Skill Category:</span> {requestDetails.skill_category}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Specific Need:</span> {requestDetails.specific_need}
                </p>
              </div>
              
              <Button onClick={cancelRequest} variant="destructive">
                Cancel Request
              </Button>
            </div>
          )}

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Available Teachers</h2>
            
            {connectedTeachers.length > 0 ? (
              <div className="space-y-4">
                {connectedTeachers.map((teacher) => (
                  <div key={teacher.id} className="border p-4 rounded-lg flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden">
                        {teacher.avatar_url ? (
                          <img 
                            src={teacher.avatar_url} 
                            alt={teacher.username} 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-primary text-white font-bold text-lg">
                            {teacher.username.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <h3 className="font-medium">{teacher.username}</h3>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        onClick={() => startChat(teacher.id)}
                        variant="outline"
                        size="sm"
                      >
                        <MessageSquare className="mr-1 h-4 w-4" />
                        Chat
                      </Button>
                      <Button 
                        onClick={() => startLiveSession(teacher.id)}
                        size="sm"
                      >
                        <Video className="mr-1 h-4 w-4" />
                        Go Live
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">Waiting for teachers to connect...</p>
                <p className="text-sm text-gray-400 mt-2">
                  Teachers who can help with your request will appear here
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default WaitingRoom;
