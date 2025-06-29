
import React, { useEffect, useRef } from 'react';

interface VideoDisplayProps {
  stream: MediaStream | null;
  isMuted?: boolean;
  title: string;
  placeholderText?: string;
  isScreenShare?: boolean;
  className?: string;
}

const VideoDisplay = ({ 
  stream, 
  isMuted = false,
  title,
  placeholderText = "Waiting for video...",
  isScreenShare = false,
  className = ""
}: VideoDisplayProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <div className={`bg-white p-4 rounded-lg shadow-md ${className}`}>
      <h3 className="text-lg font-medium mb-2 flex items-center">
        {title}
        {isScreenShare && (
          <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded">
            Screen
          </span>
        )}
      </h3>
      <div className={`aspect-video bg-gray-100 rounded-md overflow-hidden`}>
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted={isMuted}
          className="w-full h-full object-cover"
        />
        {!stream && (
          <div className="w-full h-full flex items-center justify-center text-gray-500">
            {placeholderText}
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoDisplay;
