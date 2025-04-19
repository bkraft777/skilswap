
import { useEffect, useRef, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';

export interface WebRTCState {
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  screenStream: MediaStream | null;
  isCameraOn: boolean;
  isMicOn: boolean;
  isScreenSharing: boolean;
  isLive: boolean;
  connectionStatus: 'disconnected' | 'connecting' | 'connected';
  sessionDetails: {
    startTime: string | null;
    duration: number; // in seconds
    participantId: string | null;
    participantType: 'teacher' | 'learner' | null;
  };
}

const configuration = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
  ],
};

export const useWebRTC = (requestId: string, role: 'teacher' | 'learner') => {
  const [state, setState] = useState<WebRTCState>({
    localStream: null,
    remoteStream: null,
    screenStream: null,
    isCameraOn: true,
    isMicOn: true,
    isScreenSharing: false,
    isLive: false,
    connectionStatus: 'disconnected',
    sessionDetails: {
      startTime: null,
      duration: 0,
      participantId: null,
      participantType: null,
    },
  });
  
  const peerConnection = useRef<RTCPeerConnection | null>(null);
  const signalingConnection = useRef<WebSocket | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const screenStreamRef = useRef<MediaStream | null>(null);
  const clientId = useRef<string>(uuidv4());
  const sessionIntervalRef = useRef<number | null>(null);
  const { toast } = useToast();

  // Initialize WebRTC
  useEffect(() => {
    return () => {
      // Clean up on unmount
      stopLocalStream();
      if (peerConnection.current) {
        peerConnection.current.close();
        peerConnection.current = null;
      }
      if (signalingConnection.current) {
        signalingConnection.current.close();
        signalingConnection.current = null;
      }
      if (sessionIntervalRef.current) {
        window.clearInterval(sessionIntervalRef.current);
        sessionIntervalRef.current = null;
      }
    };
  }, []);

  // Connect to signaling server
  const connectSignaling = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: 'Authentication required',
          description: 'You need to be logged in to use video chat',
          variant: 'destructive',
        });
        return false;
      }
      
      const { data: { token } } = await supabase.functions.invoke('get-token');

      // Create signaling connection - using the SUPABASE_URL constant instead of accessing protected property
      const projectId = "qavxzwmkjpjbpbtxtoqb"; // Using the project ID directly from our Supabase config
      const url = `wss://${projectId}.supabase.co/functions/v1/signaling?room=${requestId}&clientId=${clientId.current}`;
      
      signalingConnection.current = new WebSocket(url);
      
      signalingConnection.current.onopen = () => {
        console.log('Connected to signaling server');
        setState(prev => ({ ...prev, connectionStatus: 'connecting' }));
      };
      
      signalingConnection.current.onmessage = (event) => {
        const message = JSON.parse(event.data);
        handleSignalingMessage(message);
      };
      
      signalingConnection.current.onclose = () => {
        console.log('Disconnected from signaling server');
        setState(prev => ({ ...prev, connectionStatus: 'disconnected' }));
      };
      
      signalingConnection.current.onerror = (error) => {
        console.error('Signaling server error:', error);
        toast({
          title: 'Connection error',
          description: 'Error connecting to signaling server',
          variant: 'destructive',
        });
      };
      
      return true;
    } catch (error) {
      console.error('Error connecting to signaling server:', error);
      toast({
        title: 'Connection error',
        description: 'Error connecting to signaling server',
        variant: 'destructive',
      });
      return false;
    }
  };

  // Handle incoming signaling messages
  const handleSignalingMessage = async (message: any) => {
    console.log('Received signaling message:', message.type);
    
    switch (message.type) {
      case 'connected':
        // We've connected to the signaling server
        if (message.peers && message.peers.length > 0) {
          console.log('Peers in room:', message.peers);
          if (role === 'learner') {
            // Learner waits for teacher to initiate
          } else {
            // Teacher creates offer for each peer
            createPeerConnection();
            createOffer();
          }
        }
        break;
        
      case 'offer':
        // Received an offer from a peer
        if (!peerConnection.current) {
          createPeerConnection();
        }
        
        await peerConnection.current!.setRemoteDescription(new RTCSessionDescription(message.sdp));
        const answer = await peerConnection.current!.createAnswer();
        await peerConnection.current!.setLocalDescription(answer);
        
        sendSignalingMessage({
          type: 'answer',
          targetId: message.senderId,
          sdp: peerConnection.current!.localDescription
        });
        break;
        
      case 'answer':
        // Received an answer to our offer
        await peerConnection.current!.setRemoteDescription(new RTCSessionDescription(message.sdp));
        break;
        
      case 'ice-candidate':
        // Received an ICE candidate from a peer
        if (peerConnection.current && message.candidate) {
          try {
            await peerConnection.current.addIceCandidate(new RTCIceCandidate(message.candidate));
          } catch (error) {
            console.error('Error adding ICE candidate:', error);
          }
        }
        break;
        
      case 'screen-share-start':
        // Peer started screen sharing
        toast({
          title: 'Screen sharing',
          description: `${role === 'teacher' ? 'Learner' : 'Teacher'} started sharing their screen`,
        });
        break;
        
      case 'screen-share-stop':
        // Peer stopped screen sharing
        toast({
          title: 'Screen sharing stopped',
          description: `${role === 'teacher' ? 'Learner' : 'Teacher'} stopped sharing their screen`,
        });
        break;
        
      case 'peer-disconnected':
        // A peer disconnected
        toast({
          title: 'User disconnected',
          description: role === 'teacher' ? 'Learner has left the session' : 'Teacher has left the session',
        });
        
        // Close the peer connection
        if (peerConnection.current) {
          peerConnection.current.close();
          peerConnection.current = null;
        }
        
        // Stop the session timer
        if (sessionIntervalRef.current) {
          window.clearInterval(sessionIntervalRef.current);
          sessionIntervalRef.current = null;
        }
        
        // Log session data
        const sessionData = {
          request_id: requestId,
          participant_role: role,
          duration_seconds: state.sessionDetails.duration,
          ended_at: new Date().toISOString(),
        };
        
        try {
          await supabase.from('session_logs').insert(sessionData);
        } catch (error) {
          console.error('Error logging session data:', error);
        }
        
        // Reset remote stream
        setState(prev => ({ 
          ...prev, 
          remoteStream: null,
          connectionStatus: 'disconnected',
          sessionDetails: {
            ...prev.sessionDetails,
            participantId: null,
          }
        }));
        break;
    }
  };

  // Send message through signaling server
  const sendSignalingMessage = (message: any) => {
    if (signalingConnection.current && signalingConnection.current.readyState === WebSocket.OPEN) {
      signalingConnection.current.send(JSON.stringify(message));
    } else {
      console.error('Signaling connection not open');
    }
  };

  // Create peer connection
  const createPeerConnection = () => {
    console.log('Creating peer connection');
    peerConnection.current = new RTCPeerConnection(configuration);
    
    // Add local stream tracks to peer connection
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => {
        if (peerConnection.current) {
          peerConnection.current.addTrack(track, localStreamRef.current!);
        }
      });
    }
    
    // Handle ICE candidates
    peerConnection.current.onicecandidate = (event) => {
      if (event.candidate) {
        sendSignalingMessage({
          type: 'ice-candidate',
          candidate: event.candidate
        });
      }
    };
    
    // Handle connection state changes
    peerConnection.current.onconnectionstatechange = () => {
      console.log('Connection state:', peerConnection.current?.connectionState);
      if (peerConnection.current?.connectionState === 'connected') {
        setState(prev => ({ 
          ...prev, 
          connectionStatus: 'connected',
          sessionDetails: {
            ...prev.sessionDetails,
            startTime: new Date().toISOString(),
            participantType: role,
          }
        }));
        
        // Start the session timer
        if (sessionIntervalRef.current === null) {
          sessionIntervalRef.current = window.setInterval(() => {
            setState(prev => ({
              ...prev,
              sessionDetails: {
                ...prev.sessionDetails,
                duration: prev.sessionDetails.duration + 1
              }
            }));
          }, 1000);
        }
        
        toast({
          title: 'Connected',
          description: `You are now connected with the ${role === 'teacher' ? 'learner' : 'teacher'}`,
        });
      } else if (peerConnection.current?.connectionState === 'disconnected' || 
                peerConnection.current?.connectionState === 'failed') {
        setState(prev => ({ ...prev, connectionStatus: 'disconnected' }));
        
        // Stop the session timer
        if (sessionIntervalRef.current) {
          window.clearInterval(sessionIntervalRef.current);
          sessionIntervalRef.current = null;
        }
      }
    };
    
    // Handle tracks from remote peer
    peerConnection.current.ontrack = (event) => {
      console.log('Received remote track');
      const remoteStream = new MediaStream();
      event.streams[0].getTracks().forEach(track => {
        remoteStream.addTrack(track);
      });
      setState(prev => ({ ...prev, remoteStream }));
    };
  };

  // Create and send an offer
  const createOffer = async () => {
    if (!peerConnection.current) return;
    
    try {
      const offer = await peerConnection.current.createOffer();
      await peerConnection.current.setLocalDescription(offer);
      
      sendSignalingMessage({
        type: 'offer',
        sdp: peerConnection.current.localDescription
      });
    } catch (error) {
      console.error('Error creating offer:', error);
      toast({
        title: 'Error',
        description: 'Could not create connection offer',
        variant: 'destructive',
      });
    }
  };

  const startLocalStream = async () => {
    try {
      // First connect to signaling server
      const connected = await connectSignaling();
      if (!connected) return null;
      
      // Then get local media
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      localStreamRef.current = stream;
      
      setState(prev => ({
        ...prev,
        localStream: stream,
        isLive: true,
      }));

      // Create peer connection if role is teacher
      if (role === 'teacher') {
        createPeerConnection();
        createOffer();
      }

      return stream;
    } catch (error) {
      console.error('Error accessing media devices:', error);
      toast({
        title: 'Error',
        description: 'Could not access camera or microphone',
        variant: 'destructive',
      });
      return null;
    }
  };

  const stopLocalStream = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
      localStreamRef.current = null;
      setState(prev => ({
        ...prev,
        localStream: null,
        isLive: false,
      }));
    }
    
    // Stop screen sharing if active
    stopScreenSharing();
    
    // Close signaling connection
    if (signalingConnection.current) {
      signalingConnection.current.close();
      signalingConnection.current = null;
    }
    
    // Stop the session timer
    if (sessionIntervalRef.current) {
      window.clearInterval(sessionIntervalRef.current);
      sessionIntervalRef.current = null;
      
      // Log session data if we were connected
      if (state.connectionStatus === 'connected') {
        const sessionData = {
          request_id: requestId,
          participant_role: role,
          duration_seconds: state.sessionDetails.duration,
          ended_at: new Date().toISOString(),
        };
        
        try {
          supabase.from('session_logs').insert(sessionData);
        } catch (error) {
          console.error('Error logging session data:', error);
        }
      }
    }
  };

  const toggleCamera = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getVideoTracks().forEach(track => {
        track.enabled = !state.isCameraOn;
      });
      setState(prev => ({
        ...prev,
        isCameraOn: !prev.isCameraOn,
      }));
    }
  };

  const toggleMicrophone = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getAudioTracks().forEach(track => {
        track.enabled = !state.isMicOn;
      });
      setState(prev => ({
        ...prev,
        isMicOn: !prev.isMicOn,
      }));
    }
  };
  
  const startScreenSharing = async () => {
    try {
      if (screenStreamRef.current) {
        // Already sharing screen
        return;
      }
      
      // Get screen media stream
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true
      });
      
      screenStreamRef.current = stream;
      
      // Replace video track in peer connection
      if (peerConnection.current) {
        const videoTrack = stream.getVideoTracks()[0];
        
        const senders = peerConnection.current.getSenders();
        const videoSender = senders.find(sender => 
          sender.track && sender.track.kind === 'video'
        );
        
        if (videoSender) {
          videoSender.replaceTrack(videoTrack);
        } else {
          peerConnection.current.addTrack(videoTrack, stream);
        }
      }
      
      // Notify peer that we're screen sharing
      sendSignalingMessage({
        type: 'screen-share-start'
      });
      
      // Set up track ended event
      stream.getVideoTracks()[0].onended = () => {
        stopScreenSharing();
      };
      
      setState(prev => ({
        ...prev,
        screenStream: stream,
        isScreenSharing: true
      }));
      
      return stream;
    } catch (error) {
      console.error('Error starting screen sharing:', error);
      toast({
        title: 'Error',
        description: 'Could not start screen sharing',
        variant: 'destructive',
      });
      return null;
    }
  };
  
  const stopScreenSharing = () => {
    if (screenStreamRef.current) {
      // Stop all tracks
      screenStreamRef.current.getTracks().forEach(track => track.stop());
      
      // Replace video track back to camera
      if (peerConnection.current && localStreamRef.current) {
        const videoTrack = localStreamRef.current.getVideoTracks()[0];
        
        const senders = peerConnection.current.getSenders();
        const videoSender = senders.find(sender => 
          sender.track && sender.track.kind === 'video'
        );
        
        if (videoSender && videoTrack) {
          videoSender.replaceTrack(videoTrack);
        }
      }
      
      // Notify peer that we stopped screen sharing
      sendSignalingMessage({
        type: 'screen-share-stop'
      });
      
      screenStreamRef.current = null;
      setState(prev => ({
        ...prev,
        screenStream: null,
        isScreenSharing: false
      }));
    }
  };

  return {
    ...state,
    startLocalStream,
    stopLocalStream,
    toggleCamera,
    toggleMicrophone,
    startScreenSharing,
    stopScreenSharing,
  };
};
