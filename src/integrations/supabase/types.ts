export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      featured_teachers: {
        Row: {
          avatar_url: string | null
          bio: string
          created_at: string | null
          display_order: number | null
          id: string
          is_active: boolean
          name: string
          rating: number
          skills: string[]
        }
        Insert: {
          avatar_url?: string | null
          bio: string
          created_at?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean
          name: string
          rating?: number
          skills: string[]
        }
        Update: {
          avatar_url?: string | null
          bio?: string
          created_at?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean
          name?: string
          rating?: number
          skills?: string[]
        }
        Relationships: []
      }
      point_transactions: {
        Row: {
          amount: number
          created_at: string | null
          description: string | null
          id: string
          related_offering_id: string | null
          transaction_type: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          description?: string | null
          id?: string
          related_offering_id?: string | null
          transaction_type: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          description?: string | null
          id?: string
          related_offering_id?: string | null
          transaction_type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "point_transactions_related_offering_id_fkey"
            columns: ["related_offering_id"]
            isOneToOne: false
            referencedRelation: "skill_offerings"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          availability_status: string | null
          avatar_url: string | null
          bio: string | null
          created_at: string
          id: string
          interests: string[] | null
          rating: number | null
          skills: string[] | null
          total_ratings: number | null
          updated_at: string
          username: string | null
        }
        Insert: {
          availability_status?: string | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          id: string
          interests?: string[] | null
          rating?: number | null
          skills?: string[] | null
          total_ratings?: number | null
          updated_at?: string
          username?: string | null
        }
        Update: {
          availability_status?: string | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          id?: string
          interests?: string[] | null
          rating?: number | null
          skills?: string[] | null
          total_ratings?: number | null
          updated_at?: string
          username?: string | null
        }
        Relationships: []
      }
      skill_offerings: {
        Row: {
          availability: string[]
          created_at: string | null
          description: string
          experience_level: string
          id: string
          is_active: boolean | null
          points_cost: number
          skill: string
          teacher_id: string
        }
        Insert: {
          availability?: string[]
          created_at?: string | null
          description: string
          experience_level: string
          id?: string
          is_active?: boolean | null
          points_cost: number
          skill: string
          teacher_id: string
        }
        Update: {
          availability?: string[]
          created_at?: string | null
          description?: string
          experience_level?: string
          id?: string
          is_active?: boolean | null
          points_cost?: number
          skill?: string
          teacher_id?: string
        }
        Relationships: []
      }
      skill_sessions: {
        Row: {
          completed_at: string | null
          created_at: string | null
          duration_minutes: number
          id: string
          learner_id: string
          offering_id: string
          points_amount: number
          scheduled_time: string
          status: string
          teacher_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          duration_minutes?: number
          id?: string
          learner_id: string
          offering_id: string
          points_amount: number
          scheduled_time: string
          status?: string
          teacher_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          duration_minutes?: number
          id?: string
          learner_id?: string
          offering_id?: string
          points_amount?: number
          scheduled_time?: string
          status?: string
          teacher_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "skill_sessions_offering_id_fkey"
            columns: ["offering_id"]
            isOneToOne: false
            referencedRelation: "skill_offerings"
            referencedColumns: ["id"]
          },
        ]
      }
      teacher_applications: {
        Row: {
          created_at: string | null
          email: string
          experience_years: number
          expertise: string[]
          full_name: string
          id: string
          motivation: string
          status: string
          teaching_style: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          experience_years: number
          expertise: string[]
          full_name: string
          id?: string
          motivation: string
          status?: string
          teaching_style: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          experience_years?: number
          expertise?: string[]
          full_name?: string
          id?: string
          motivation?: string
          status?: string
          teaching_style?: string
          user_id?: string | null
        }
        Relationships: []
      }
      user_points: {
        Row: {
          last_updated: string | null
          points_balance: number
          total_earned: number
          total_spent: number
          user_id: string
        }
        Insert: {
          last_updated?: string | null
          points_balance?: number
          total_earned?: number
          total_spent?: number
          user_id: string
        }
        Update: {
          last_updated?: string | null
          points_balance?: number
          total_earned?: number
          total_spent?: number
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
