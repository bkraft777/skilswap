
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from '@/hooks/useAuth';

interface Message {
  id: string;
  content: string;
  created_at: string;
  sender_id: string;
  recipient_id: string;
  read_at: string | null;
  conversation_id: string;
}

export const useMessages = (conversationId: string) => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const { data: messages, isLoading } = useQuery({
    queryKey: ['messages', conversationId],
    queryFn: async (): Promise<Message[]> => {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data || [];
    },
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
