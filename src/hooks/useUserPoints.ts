
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Database } from "@/integrations/supabase/types";

export interface UserPoints {
  points_balance: number;
  total_earned: number;
  total_spent: number;
  last_updated: string;
}

export interface PointTransaction {
  id: string;
  amount: number;
  transaction_type: string;
  description: string | null;
  created_at: string;
}

export const useUserPoints = () => {
  const { user } = useAuth();

  const { data: points, ...pointsQuery } = useQuery({
    queryKey: ['userPoints', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_points')
        .select('*')
        .eq('user_id', user?.id as any)
        .single<UserPoints>();

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const { data: transactions, ...transactionsQuery } = useQuery({
    queryKey: ['pointTransactions', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('point_transactions')
        .select('*')
        .eq('user_id', user?.id as any)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []) as unknown as PointTransaction[];
    },
    enabled: !!user,
  });

  return {
    points,
    transactions,
    isLoading: pointsQuery.isLoading || transactionsQuery.isLoading,
    error: pointsQuery.error || transactionsQuery.error,
  };
};
