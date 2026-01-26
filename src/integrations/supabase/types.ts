export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      past_trips: {
        Row: {
          boarding_point: string
          budget: number
          created_at: string
          destination: string
          duration: number
          id: string
          notes: string | null
          rating: number | null
          trip_date: string
          user_id: string
        }
        Insert: {
          boarding_point: string
          budget: number
          created_at?: string
          destination: string
          duration: number
          id?: string
          notes?: string | null
          rating?: number | null
          trip_date?: string
          user_id: string
        }
        Update: {
          boarding_point?: string
          budget?: number
          created_at?: string
          destination?: string
          duration?: number
          id?: string
          notes?: string | null
          rating?: number | null
          trip_date?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          accommodation_type:
            | Database["public"]["Enums"]["accommodation_type"]
            | null
          avatar_url: string | null
          budget_range_max: number | null
          budget_range_min: number | null
          created_at: string
          email: string | null
          food_preference: Database["public"]["Enums"]["food_preference"] | null
          full_name: string | null
          home_city: string | null
          id: string
          language_preference: string | null
          phone: string | null
          preferred_destinations: string[] | null
          traffic_sensitivity:
            | Database["public"]["Enums"]["traffic_sensitivity"]
            | null
          transportation_choice:
            | Database["public"]["Enums"]["transportation_choice"]
            | null
          travel_style: Database["public"]["Enums"]["travel_style"] | null
          trip_duration_preference: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          accommodation_type?:
            | Database["public"]["Enums"]["accommodation_type"]
            | null
          avatar_url?: string | null
          budget_range_max?: number | null
          budget_range_min?: number | null
          created_at?: string
          email?: string | null
          food_preference?:
            | Database["public"]["Enums"]["food_preference"]
            | null
          full_name?: string | null
          home_city?: string | null
          id?: string
          language_preference?: string | null
          phone?: string | null
          preferred_destinations?: string[] | null
          traffic_sensitivity?:
            | Database["public"]["Enums"]["traffic_sensitivity"]
            | null
          transportation_choice?:
            | Database["public"]["Enums"]["transportation_choice"]
            | null
          travel_style?: Database["public"]["Enums"]["travel_style"] | null
          trip_duration_preference?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          accommodation_type?:
            | Database["public"]["Enums"]["accommodation_type"]
            | null
          avatar_url?: string | null
          budget_range_max?: number | null
          budget_range_min?: number | null
          created_at?: string
          email?: string | null
          food_preference?:
            | Database["public"]["Enums"]["food_preference"]
            | null
          full_name?: string | null
          home_city?: string | null
          id?: string
          language_preference?: string | null
          phone?: string | null
          preferred_destinations?: string[] | null
          traffic_sensitivity?:
            | Database["public"]["Enums"]["traffic_sensitivity"]
            | null
          transportation_choice?:
            | Database["public"]["Enums"]["transportation_choice"]
            | null
          travel_style?: Database["public"]["Enums"]["travel_style"] | null
          trip_duration_preference?: number | null
          updated_at?: string
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
      accommodation_type:
        | "budget"
        | "mid_range"
        | "luxury"
        | "hostel"
        | "homestay"
        | "resort"
      food_preference:
        | "vegetarian"
        | "vegan"
        | "non_vegetarian"
        | "halal"
        | "kosher"
        | "no_preference"
      traffic_sensitivity: "low" | "medium" | "high"
      transportation_choice:
        | "public_transport"
        | "rental_car"
        | "bike"
        | "walking"
        | "taxi"
        | "private_driver"
      travel_style: "solo" | "couple" | "family" | "group"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      accommodation_type: [
        "budget",
        "mid_range",
        "luxury",
        "hostel",
        "homestay",
        "resort",
      ],
      food_preference: [
        "vegetarian",
        "vegan",
        "non_vegetarian",
        "halal",
        "kosher",
        "no_preference",
      ],
      traffic_sensitivity: ["low", "medium", "high"],
      transportation_choice: [
        "public_transport",
        "rental_car",
        "bike",
        "walking",
        "taxi",
        "private_driver",
      ],
      travel_style: ["solo", "couple", "family", "group"],
    },
  },
} as const
