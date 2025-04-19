
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

// Use a more explicit typing approach with a simple function declaration
async function fetchMessagesForConversation(conversationId: string): Promise<Message[]> {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true });

  if (error) throw error;
  // Explicitly cast data to Message[] and handle null case
  return (data || []) as Message[];
}

export const useMessages = (conversationId: string) => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  // Use explicit typing for the query result
  const { data: messages, isLoading } = useQuery({
    queryKey: ['messages', conversationId],
    // Reference the standalone function directly
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
    messages,
    isLoading,
    sendMessage,
  };
};
