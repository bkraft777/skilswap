
import React, { useEffect, useRef } from 'react';

interface VideoDisplayProps {
  stream: MediaStream | null;
  isMuted?: boolean;
  title: string;
  placeholderText?: string;
}

const VideoDisplay = ({ 
  stream, 
  isMuted = false,
  title,
  placeholderText = "Waiting for video..."
}: VideoDisplayProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      <div className="aspect-video bg-gray-100 rounded-md overflow-hidden">
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
