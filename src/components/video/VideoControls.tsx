
import React from 'react';
import { Button } from '@/components/ui/button';
import { Camera, CameraOff, Mic, MicOff, Monitor, MonitorOff, Video, X } from 'lucide-react';

interface VideoControlsProps {
  isLive: boolean;
  isCameraOn: boolean;
  isMicOn: boolean;
  isScreenSharing?: boolean;
  onStartLive: () => void;
  onEndLive: () => void;
  onToggleCamera: () => void;
  onToggleMic: () => void;
  onStartScreenShare?: () => void;
  onStopScreenShare?: () => void;
}

const VideoControls = ({
  isLive,
  isCameraOn,
  isMicOn,
  isScreenSharing = false,
  onStartLive,
  onEndLive,
  onToggleCamera,
  onToggleMic,
  onStartScreenShare,
  onStopScreenShare,
}: VideoControlsProps) => {
  if (!isLive) {
    return (
      <Button onClick={onStartLive} className="w-full">
        <Video className="mr-2 h-4 w-4" />
        Go Live
      </Button>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      <Button 
        onClick={onToggleCamera}
        variant="outline"
        className="flex-1"
        size="sm"
      >
        {isCameraOn ? <Camera className="mr-2 h-4 w-4" /> : <CameraOff className="mr-2 h-4 w-4" />}
        {isCameraOn ? 'Camera On' : 'Camera Off'}
      </Button>
      
      <Button 
        onClick={onToggleMic}
        variant="outline"
        className="flex-1"
        size="sm"
      >
        {isMicOn ? <Mic className="mr-2 h-4 w-4" /> : <MicOff className="mr-2 h-4 w-4" />}
        {isMicOn ? 'Mic On' : 'Mic Off'}
      </Button>
      
      {onStartScreenShare && onStopScreenShare && (
        <Button 
          onClick={isScreenSharing ? onStopScreenShare : onStartScreenShare}
          variant={isScreenSharing ? "secondary" : "outline"}
          className="flex-1"
          size="sm"
        >
          {isScreenSharing ? <MonitorOff className="mr-2 h-4 w-4" /> : <Monitor className="mr-2 h-4 w-4" />}
          {isScreenSharing ? 'Stop Sharing' : 'Share Screen'}
        </Button>
      )}
      
      <Button 
        onClick={onEndLive}
        variant="destructive"
        className="flex-1"
        size="sm"
      >
        <X className="mr-2 h-4 w-4" />
        End Live Session
      </Button>
    </div>
  );
};

export default VideoControls;
