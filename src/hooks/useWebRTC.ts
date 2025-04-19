import { useEffect, useRef, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';

export interface WebRTCState {
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  isCameraOn: boolean;
  isMicOn: boolean;
  isLive: boolean;
  connectionStatus: 'disconnected' | 'connecting' | 'connected';
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
    isCameraOn: true,
    isMicOn: true,
    isLive: false,
    connectionStatus: 'disconnected',
  });
  
  const peerConnection = useRef<RTCPeerConnection | null>(null);
  const signalingConnection = useRef<WebSocket | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const clientId = useRef<string>(uuidv4());
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
        
        // Reset remote stream
        setState(prev => ({ 
          ...prev, 
          remoteStream: null,
          connectionStatus: 'disconnected'
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
        setState(prev => ({ ...prev, connectionStatus: 'connected' }));
        toast({
          title: 'Connected',
          description: `You are now connected with the ${role === 'teacher' ? 'learner' : 'teacher'}`,
        });
      } else if (peerConnection.current?.connectionState === 'disconnected' || 
                peerConnection.current?.connectionState === 'failed') {
        setState(prev => ({ ...prev, connectionStatus: 'disconnected' }));
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
    
    // Close signaling connection
    if (signalingConnection.current) {
      signalingConnection.current.close();
      signalingConnection.current = null;
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

  return {
    ...state,
    startLocalStream,
    stopLocalStream,
    toggleCamera,
    toggleMicrophone,
  };
};
