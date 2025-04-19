
import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Loader2, MessageSquare, Video, X, Camera, Mic, MicOff, CameraOff } from 'lucide-react';

const TeacherRoom = () => {
  const { requestId } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [requestDetails, setRequestDetails] = useState<any>(null);
  const [learnerProfile, setLearnerProfile] = useState<any>(null);
  const [isLiveSession, setIsLiveSession] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);

  // Refs for video elements
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  
  // Refs for streams
  const localStreamRef = useRef<MediaStream | null>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);

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

        // Fetch learner profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('username, avatar_url')
          .eq('id', data.learner_id)
          .single();

        if (profileError) throw profileError;
        setLearnerProfile(profileData);

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
  }, [requestId, user, navigate, toast]);

  const leaveRoom = async () => {
    try {
      // Stop any active streams
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(track => track.stop());
        localStreamRef.current = null;
      }
      
      // Close peer connection
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
        peerConnectionRef.current = null;
      }

      setIsLiveSession(false);

      // Update connection status
      await supabase
        .from('teacher_connections')
        .update({ status: 'disconnected' })
        .eq('request_id', requestId)
        .eq('teacher_id', user?.id);

      toast({
        title: 'Disconnected',
        description: 'You have left the room',
      });
      navigate('/dashboard');
    } catch (error) {
      console.error('Error leaving room:', error);
      toast({
        title: 'Error',
        description: 'Failed to leave room',
        variant: 'destructive',
      });
    }
  };

  const startChat = async () => {
    // In a future implementation, this would start a chat session
    toast({
      title: 'Coming soon!',
      description: 'Chat functionality will be implemented in the next phase',
    });
  };

  const toggleCamera = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getVideoTracks().forEach(track => {
        track.enabled = !isCameraOn;
      });
      setIsCameraOn(!isCameraOn);
    }
  };

  const toggleMicrophone = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getAudioTracks().forEach(track => {
        track.enabled = !isMicOn;
      });
      setIsMicOn(!isMicOn);
    }
  };

  const startLiveSession = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      });
      
      localStreamRef.current = stream;
      
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
      
      setIsLiveSession(true);
      
      toast({
        title: 'Live session started',
        description: 'Your camera and microphone are now active',
      });
      
      // In a real implementation, we would set up WebRTC here
      // and connect to the other user
      
    } catch (error) {
      console.error('Error starting live session:', error);
      toast({
        title: 'Error',
        description: 'Could not access camera or microphone',
        variant: 'destructive',
      });
    }
  };

  const endLiveSession = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
      localStreamRef.current = null;
    }
    
    setIsLiveSession(false);
    setIsCameraOn(true);
    setIsMicOn(true);
    
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
            <h1 className="text-3xl font-bold">Teacher Room</h1>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={leaveRoom}
            >
              <X className="mr-1 h-4 w-4" />
              Leave Room
            </Button>
          </div>
          
          {requestDetails && (
            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
              <h2 className="text-xl font-semibold mb-4">Help Request Details</h2>
              
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden mr-4">
                  {learnerProfile?.avatar_url ? (
                    <img 
                      src={learnerProfile.avatar_url} 
                      alt={learnerProfile.username} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-primary text-white font-bold text-lg">
                      {learnerProfile?.username?.charAt(0).toUpperCase() || 'U'}
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="font-medium">{learnerProfile?.username || 'Learner'}</h3>
                  <p className="text-sm text-gray-500">Requested {new Date(requestDetails.created_at).toLocaleString()}</p>
                </div>
              </div>
              
              <div className="mb-6">
                <p className="text-gray-600">
                  <span className="font-medium">Skill Category:</span> {requestDetails.skill_category}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Specific Need:</span> {requestDetails.specific_need}
                </p>
              </div>
              
              {!isLiveSession ? (
                <div className="flex gap-4">
                  <Button 
                    onClick={startChat}
                    variant="outline"
                    className="flex-1"
                  >
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Start Chat
                  </Button>
                  <Button 
                    onClick={startLiveSession}
                    className="flex-1"
                  >
                    <Video className="mr-2 h-4 w-4" />
                    Go Live
                  </Button>
                </div>
              ) : (
                <div className="flex gap-4">
                  <Button 
                    onClick={toggleCamera}
                    variant="outline"
                    className="flex-1"
                  >
                    {isCameraOn ? <Camera className="mr-2 h-4 w-4" /> : <CameraOff className="mr-2 h-4 w-4" />}
                    {isCameraOn ? 'Camera On' : 'Camera Off'}
                  </Button>
                  <Button 
                    onClick={toggleMicrophone}
                    variant="outline"
                    className="flex-1"
                  >
                    {isMicOn ? <Mic className="mr-2 h-4 w-4" /> : <MicOff className="mr-2 h-4 w-4" />}
                    {isMicOn ? 'Mic On' : 'Mic Off'}
                  </Button>
                  <Button 
                    onClick={endLiveSession}
                    variant="destructive"
                    className="flex-1"
                  >
                    <X className="mr-2 h-4 w-4" />
                    End Live Session
                  </Button>
                </div>
              )}
            </div>
          )}
          
          {isLiveSession && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div className="bg-white p-4 rounded-lg shadow-md">
                <h3 className="text-lg font-medium mb-2">Your Camera</h3>
                <div className="aspect-video bg-gray-100 rounded-md overflow-hidden">
                  <video 
                    ref={localVideoRef} 
                    autoPlay 
                    muted 
                    playsInline
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-md">
                <h3 className="text-lg font-medium mb-2">Learner's Camera</h3>
                <div className="aspect-video bg-gray-100 rounded-md overflow-hidden flex items-center justify-center">
                  <video 
                    ref={remoteVideoRef} 
                    autoPlay 
                    playsInline
                    className="w-full h-full object-cover"
                  />
                  <p className="text-gray-500">Waiting for learner to join...</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TeacherRoom;
