
import React from 'react';
import { Button } from '@/components/ui/button';
import { Video } from 'lucide-react';
import VideoControls from '@/components/video/VideoControls';
import VideoDisplay from '@/components/video/VideoDisplay';
import SessionInfo from '@/components/video/SessionInfo';

interface VideoSectionProps {
  teacherConnected: boolean;
  isLive: boolean;
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  screenStream: MediaStream | null;
  isCameraOn: boolean;
  isMicOn: boolean;
  isScreenSharing: boolean;
  connectionStatus: 'connected' | 'connecting' | 'disconnected';
  sessionDetails: any;
  onStartLive: () => Promise<void>;
  onEndLive: () => void;
  onToggleCamera: () => void;
  onToggleMic: () => void;
  onStartScreenShare: () => Promise<void>;
  onStopScreenShare: () => void;
}

export const VideoSection = ({
  teacherConnected,
  isLive,
  localStream,
  remoteStream,
  screenStream,
  isCameraOn,
  isMicOn,
  isScreenSharing,
  connectionStatus,
  sessionDetails,
  onStartLive,
  onEndLive,
  onToggleCamera,
  onToggleMic,
  onStartScreenShare,
  onStopScreenShare,
}: VideoSectionProps) => {
  if (!teacherConnected) return null;

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          {isLive ? (
            <VideoControls
              isLive={isLive}
              isCameraOn={isCameraOn}
              isMicOn={isMicOn}
              isScreenSharing={isScreenSharing}
              onStartLive={onStartLive}
              onEndLive={onEndLive}
              onToggleCamera={onToggleCamera}
              onToggleMic={onToggleMic}
              onStartScreenShare={onStartScreenShare}
              onStopScreenShare={onStopScreenShare}
            />
          ) : (
            <Button 
              onClick={onStartLive} 
              className="w-full"
              size="lg"
            >
              <Video className="mr-2 h-5 w-5" />
              Go Live
            </Button>
          )}
        </div>
        
        <div>
          {connectionStatus !== 'disconnected' && (
            <SessionInfo
              startTime={sessionDetails.startTime}
              duration={sessionDetails.duration}
              connectionStatus={connectionStatus}
              participantType={sessionDetails.participantType}
            />
          )}
        </div>
      </div>

      {isLive && (
        <div className="grid grid-cols-1 gap-4 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          
          {isScreenSharing && (
            <VideoDisplay
              stream={screenStream}
              isMuted={true}
              title="Your Screen Share"
              isScreenShare={true}
            />
          )}
        </div>
      )}
    </>
  );
};
