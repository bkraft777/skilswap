
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from '@/hooks/useAuth';

// Define a simpler Message interface
export interface Message {
  id: string;
  content: string;
  created_at: string;
  sender_id: string;
  recipient_id: string;
  read_at: string | null;
  conversation_id: string;
}

// Create a standalone function with explicit return type
const fetchMessagesForConversation = async (conversationId: string): Promise<Message[]> => {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true });
    
  if (error) throw error;
  return (data || []) as Message[];
};

export const useMessages = (conversationId: string) => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  // Use the function reference directly to avoid complex type inference
  const messageQuery = useQuery({
    queryKey: ['messages', conversationId],
    queryFn: () => fetchMessagesForConversation(conversationId),
    enabled: !!conversationId && !!user,
  });

  const sendMessage = useMutation({
    mutationFn: async ({ content, recipientId }: { content: string, recipientId: string }) => {
      if (!user) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('messages')
        .insert({
          content, 
          recipient_id: recipientId,
          sender_id: user.id,
          conversation_id: conversationId
        });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages', conversationId] });
    },
  });

  return {
    messages: messageQuery.data,
    isLoading: messageQuery.isLoading,
    sendMessage,
  };
};
