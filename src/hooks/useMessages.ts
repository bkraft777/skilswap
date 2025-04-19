
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";

export const useMessages = (conversationId: string) => {
  const queryClient = useQueryClient();

  const { data: messages, isLoading } = useQuery({
    queryKey: ['messages', conversationId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data;
    },
  });

  const sendMessage = useMutation({
    mutationFn: async ({ content, recipientId }: { content: string, recipientId: string }) => {
      const { data, error } = await supabase
        .from('messages')
        .insert([{ content, recipient_id: recipientId }]);

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
