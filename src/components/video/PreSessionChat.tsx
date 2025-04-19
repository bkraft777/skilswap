
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { formatDistanceToNow } from 'date-fns';

interface ChatMessage {
  id: string;
  sender_id: string;
  content: string;
  created_at: string;
  senderName: string;
}

interface PreSessionChatProps {
  requestId: string;
  otherParticipantId: string | undefined;
  otherParticipantName: string | undefined;
}

const PreSessionChat = ({ 
  requestId, 
  otherParticipantId,
  otherParticipantName 
}: PreSessionChatProps) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user?.id || !otherParticipantId) return;

    setIsLoading(true);
    
    // Create subscription
    const channel = supabase
      .channel(`session-chat-${requestId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `recipient_id=eq.${user.id}`,
        },
        async (payload) => {
          const newMessage = payload.new as any;
          
          // Get sender name
          const { data } = await supabase
            .from('profiles')
            .select('username')
            .eq('id', newMessage.sender_id)
            .single();
            
          setMessages(prev => [...prev, {
            ...newMessage,
            senderName: data?.username || 'Unknown user'
          }]);
        }
      )
      .subscribe();

    // Load existing messages
    const loadMessages = async () => {
      try {
        // Get messages where user is sender or recipient
        const { data: messageData, error } = await supabase
          .from('messages')
          .select('*')
          .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
          .or(`sender_id.eq.${otherParticipantId},recipient_id.eq.${otherParticipantId}`)
          .order('created_at', { ascending: true });
          
        if (error) throw error;
        
        if (messageData) {
          // Get usernames for all messages
          const userIds = [...new Set(messageData.map(m => m.sender_id))];
          const { data: profiles } = await supabase
            .from('profiles')
            .select('id, username')
            .in('id', userIds);
            
          const userMap = profiles ? profiles.reduce((acc, profile) => {
            acc[profile.id] = profile.username || 'Unknown user';
            return acc;
          }, {} as Record<string, string>) : {};
          
          // Add sender name to each message
          const messagesWithNames = messageData.map(msg => ({
            ...msg,
            senderName: userMap[msg.sender_id] || 'Unknown user'
          }));
          
          setMessages(messagesWithNames);
        }
      } catch (error) {
        console.error('Error loading messages:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadMessages();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, otherParticipantId, requestId]);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!message.trim() || !user?.id || !otherParticipantId) return;
    
    try {
      const newMessage = {
        sender_id: user.id,
        recipient_id: otherParticipantId,
        content: message
      };
      
      await supabase.from('messages').insert([newMessage]);
      
      // Optimistically add message to UI
      const { data: userData } = await supabase
        .from('profiles')
        .select('username')
        .eq('id', user.id)
        .single();
        
      setMessages(prev => [...prev, {
        ...newMessage,
        id: Date.now().toString(), // temporary ID
        created_at: new Date().toISOString(),
        senderName: userData?.username || 'Me'
      }]);
      
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden h-full flex flex-col">
      <div className="p-4 bg-gray-50 border-b">
        <h3 className="font-medium">
          Chat with {otherParticipantName || 'Participant'}
        </h3>
        <p className="text-xs text-gray-500">
          Use this chat to communicate before going live
        </p>
      </div>
      
      <div className="flex-grow overflow-y-auto p-4 space-y-3" style={{ maxHeight: '300px' }}>
        {isLoading ? (
          <div className="text-center py-4 text-gray-500">Loading messages...</div>
        ) : messages.length === 0 ? (
          <div className="text-center py-4 text-gray-500">No messages yet. Start the conversation!</div>
        ) : (
          messages.map(msg => (
            <div 
              key={msg.id}
              className={`flex flex-col ${msg.sender_id === user?.id ? 'items-end' : 'items-start'}`}
            >
              <div 
                className={`px-3 py-2 rounded-lg max-w-[80%] ${
                  msg.sender_id === user?.id 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {msg.content}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {msg.sender_id === user?.id ? 'You' : msg.senderName} • {
                  formatDistanceToNow(new Date(msg.created_at), { addSuffix: true })
                }
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="p-3 border-t">
        <form 
          className="flex items-center gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage();
          }}
        >
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-grow"
          />
          <Button 
            type="submit" 
            size="sm" 
            disabled={!message.trim() || !otherParticipantId}
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default PreSessionChat;
