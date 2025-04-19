
import { useEffect, useRef, useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface WebRTCState {
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  isCameraOn: boolean;
  isMicOn: boolean;
  isLive: boolean;
}

const configuration = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
  ],
};

export const useWebRTC = (requestId: string) => {
  const [state, setState] = useState<WebRTCState>({
    localStream: null,
    remoteStream: null,
    isCameraOn: true,
    isMicOn: true,
    isLive: false,
  });
  
  const peerConnection = useRef<RTCPeerConnection | null>(null);
  const { toast } = useToast();

  const startLocalStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      setState(prev => ({
        ...prev,
        localStream: stream,
        isLive: true,
      }));

      // Add tracks to peer connection if it exists
      if (peerConnection.current) {
        stream.getTracks().forEach(track => {
          if (peerConnection.current) {
            peerConnection.current.addTrack(track, stream);
          }
        });
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
    if (state.localStream) {
      state.localStream.getTracks().forEach(track => track.stop());
      setState(prev => ({
        ...prev,
        localStream: null,
        isLive: false,
      }));
    }
  };

  const toggleCamera = () => {
    if (state.localStream) {
      state.localStream.getVideoTracks().forEach(track => {
        track.enabled = !state.isCameraOn;
      });
      setState(prev => ({
        ...prev,
        isCameraOn: !prev.isCameraOn,
      }));
    }
  };

  const toggleMicrophone = () => {
    if (state.localStream) {
      state.localStream.getAudioTracks().forEach(track => {
        track.enabled = !state.isMicOn;
      });
      setState(prev => ({
        ...prev,
        isMicOn: !prev.isMicOn,
      }));
    }
  };

  useEffect(() => {
    return () => {
      stopLocalStream();
      if (peerConnection.current) {
        peerConnection.current.close();
        peerConnection.current = null;
      }
    };
  }, []);

  return {
    ...state,
    startLocalStream,
    stopLocalStream,
    toggleCamera,
    toggleMicrophone,
  };
};
