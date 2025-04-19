import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Loader2, X } from 'lucide-react';
import { useWebRTC } from '@/hooks/useWebRTC';
import VideoControls from '@/components/video/VideoControls';
import VideoDisplay from '@/components/video/VideoDisplay';

const WaitingRoom = () => {
  const { requestId } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [requestDetails, setRequestDetails] = useState<any>(null);
  const [teacherConnected, setTeacherConnected] = useState(false);
  const [teacherProfile, setTeacherProfile] = useState<any>(null);

  const {
    localStream,
    remoteStream,
    isCameraOn,
    isMicOn,
    isLive,
    connectionStatus,
    startLocalStream,
    stopLocalStream,
    toggleCamera,
    toggleMicrophone,
  } = useWebRTC(requestId || '', 'learner');

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
        setRequestDetails(data);

        const { data: connectionData, error: connectionError } = await supabase
          .from('teacher_connections')
          .select('teacher_id, status')
          .eq('request_id', requestId)
          .eq('status', 'connected')
          .single();

        if (!connectionError && connectionData) {
          setTeacherConnected(true);
          
          const { data: teacherData, error: teacherError } = await supabase
            .from('profiles')
            .select('username, avatar_url')
            .eq('id', connectionData.teacher_id)
            .single();
            
          if (!teacherError) {
            setTeacherProfile(teacherData);
          }
        }
      } catch (error) {
        console.error('Error fetching request details:', error);
        toast({
          title: 'Error',
          description: 'Could not load request details',
          variant: 'destructive',
        });
        navigate('/dashboard');
      } finally {
        setIsLoading(false);
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
            setTeacherConnected(true);
            
            const { data: teacherData, error: teacherError } = await supabase
              .from('profiles')
              .select('username, avatar_url')
              .eq('id', newConnection.teacher_id)
              .single();
              
            if (!teacherError) {
              setTeacherProfile(teacherData);
              
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
      stopLocalStream();

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

  const handleStartLive = async () => {
    const stream = await startLocalStream();
    if (stream) {
      toast({
        title: 'Live session started',
        description: 'Your camera and microphone are now active',
      });
    }
  };

  const handleEndLive = () => {
    stopLocalStream();
    toast({
      title: 'Live session ended',
      description: 'Your camera and microphone have been turned off',
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
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Waiting Room</h1>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={cancelRequest}
            >
              <X className="mr-1 h-4 w-4" />
              Cancel Request
            </Button>
          </div>
          
          {requestDetails && (
            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
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
                {connectionStatus === 'connected' && (
                  <p className="text-green-600 font-medium mt-2">
                    Video connection established
                  </p>
                )}
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

              {teacherConnected && (
                <VideoControls
                  isLive={isLive}
                  isCameraOn={isCameraOn}
                  isMicOn={isMicOn}
                  onStartLive={handleStartLive}
                  onEndLive={handleEndLive}
                  onToggleCamera={toggleCamera}
                  onToggleMic={toggleMicrophone}
                />
              )}
              
              {!teacherConnected && (
                <div className="flex justify-center items-center p-4 bg-gray-50 rounded-md">
                  <Loader2 className="h-5 w-5 animate-spin text-primary mr-2" />
                  <p>Waiting for a teacher to connect...</p>
                </div>
              )}
            </div>
          )}
          
          {isLive && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <VideoDisplay
                stream={localStream}
                isMuted={true}
                title="Your Camera"
              />
              <VideoDisplay
                stream={remoteStream}
                title="Teacher's Camera"
                placeholderText={
                  connectionStatus === 'connecting' 
                    ? "Connecting to teacher..." 
                    : "Waiting for teacher to go live..."
                }
              />
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default WaitingRoom;
