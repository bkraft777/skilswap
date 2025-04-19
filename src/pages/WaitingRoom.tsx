
import React from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Loader2 } from 'lucide-react';
import { useWebRTC } from '@/hooks/useWebRTC';
import { useWaitingRoom } from '@/hooks/useWaitingRoom';
import { RequestDetails } from '@/components/waiting-room/RequestDetails';
import { VideoSection } from '@/components/waiting-room/VideoSection';
import PreSessionChat from '@/components/video/PreSessionChat';
import { useToast } from '@/hooks/use-toast';

const WaitingRoom = () => {
  const { requestId } = useParams();
  const {
    isLoading,
    requestDetails,
    teacherConnected,
    teacherProfile,
    teacherId,
    cancelRequest
  } = useWaitingRoom(requestId);

  const { toast } = useToast();

  const {
    localStream,
    remoteStream,
    screenStream,
    isCameraOn,
    isMicOn,
    isScreenSharing,
    isLive,
    connectionStatus,
    sessionDetails,
    startLocalStream,
    stopLocalStream,
    toggleCamera,
    toggleMicrophone,
    startScreenSharing,
    stopScreenSharing,
  } = useWebRTC(requestId || '', 'learner');

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
          <RequestDetails
            requestDetails={requestDetails}
            teacherConnected={teacherConnected}
            teacherProfile={teacherProfile}
            onCancel={async () => {
              stopLocalStream();
              await cancelRequest();
            }}
          />
          
          <VideoSection
            teacherConnected={teacherConnected}
            isLive={isLive}
            localStream={localStream}
            remoteStream={remoteStream}
            screenStream={screenStream}
            isCameraOn={isCameraOn}
            isMicOn={isMicOn}
            isScreenSharing={isScreenSharing}
            connectionStatus={connectionStatus}
            sessionDetails={sessionDetails}
            onStartLive={async () => {
              const stream = await startLocalStream();
              if (stream) {
                toast({
                  title: 'Live session started',
                  description: 'Your camera and microphone are now active',
                });
              }
            }}
            onEndLive={() => {
              stopLocalStream();
              toast({
                title: 'Live session ended',
                description: 'Your camera and microphone have been turned off',
              });
            }}
            onToggleCamera={toggleCamera}
            onToggleMic={toggleMicrophone}
            onStartScreenShare={async () => {
              const stream = await startScreenSharing();
              if (stream) {
                toast({
                  title: 'Screen sharing started',
                  description: 'You are now sharing your screen with the teacher',
                });
              }
            }}
            onStopScreenShare={() => {
              stopScreenSharing();
              toast({
                title: 'Screen sharing stopped',
                description: 'You have stopped sharing your screen',
              });
            }}
          />
          
          {teacherConnected && !isLive && teacherId && (
            <div className="mb-8">
              <PreSessionChat 
                requestId={requestId || ''}
                otherParticipantId={teacherId}
                otherParticipantName={teacherProfile?.username}
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
