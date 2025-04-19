
import React from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { MessageList } from '@/components/messages/MessageList';
import { MessageInput } from '@/components/messages/MessageInput';
import { useMessages } from '@/hooks/useMessages';
import { useToast } from '@/components/ui/use-toast';

const Messages = () => {
  const { conversationId } = useParams();
  const { messages, isLoading, sendMessage } = useMessages(conversationId || '');
  const { toast } = useToast();

  const handleSendMessage = async (content: string) => {
    try {
      await sendMessage.mutateAsync({ 
        content, 
        recipientId: conversationId || '' 
      });
    } catch (error: any) {
      toast({
        title: "Error sending message",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Messages</h1>
          <div className="bg-white rounded-lg shadow">
            <MessageList messages={messages || []} />
            <MessageInput 
              onSend={handleSendMessage}
              isLoading={sendMessage.isPending}
            />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Messages;
