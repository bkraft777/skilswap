
import React from 'react';
import { Button } from '@/components/ui/button';
import { Camera, CameraOff, Mic, MicOff, Video, X } from 'lucide-react';

interface VideoControlsProps {
  isLive: boolean;
  isCameraOn: boolean;
  isMicOn: boolean;
  onStartLive: () => void;
  onEndLive: () => void;
  onToggleCamera: () => void;
  onToggleMic: () => void;
}

const VideoControls = ({
  isLive,
  isCameraOn,
  isMicOn,
  onStartLive,
  onEndLive,
  onToggleCamera,
  onToggleMic,
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
    <div className="flex gap-4">
      <Button 
        onClick={onToggleCamera}
        variant="outline"
        className="flex-1"
      >
        {isCameraOn ? <Camera className="mr-2 h-4 w-4" /> : <CameraOff className="mr-2 h-4 w-4" />}
        {isCameraOn ? 'Camera On' : 'Camera Off'}
      </Button>
      <Button 
        onClick={onToggleMic}
        variant="outline"
        className="flex-1"
      >
        {isMicOn ? <Mic className="mr-2 h-4 w-4" /> : <MicOff className="mr-2 h-4 w-4" />}
        {isMicOn ? 'Mic On' : 'Mic Off'}
      </Button>
      <Button 
        onClick={onEndLive}
        variant="destructive"
        className="flex-1"
      >
        <X className="mr-2 h-4 w-4" />
        End Live Session
      </Button>
    </div>
  );
};

export default VideoControls;
