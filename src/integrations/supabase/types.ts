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
      a1organizations: {
        Row: {
          created_at: string
          organization_id: string
          organization_industry: string | null
          organization_name: string
          organization_wordmark: string | null
        }
        Insert: {
          created_at?: string
          organization_id?: string
          organization_industry?: string | null
          organization_name: string
          organization_wordmark?: string | null
        }
        Update: {
          created_at?: string
          organization_id?: string
          organization_industry?: string | null
          organization_name?: string
          organization_wordmark?: string | null
        }
        Relationships: []
      }
      b1offerings: {
        Row: {
          created_at: string
          offering_id: string
          offering_keysellingpoints: string | null
          offering_name: string
          offering_objective: Database["public"]["Enums"]["offering_objective"]
          offering_problemsolved: string | null
          offering_specialcategory: Database["public"]["Enums"]["offering_specialcategory"]
          offering_uniqueadvantages: string | null
          organization_id: string
        }
        Insert: {
          created_at?: string
          offering_id?: string
          offering_keysellingpoints?: string | null
          offering_name: string
          offering_objective: Database["public"]["Enums"]["offering_objective"]
          offering_problemsolved?: string | null
          offering_specialcategory?: Database["public"]["Enums"]["offering_specialcategory"]
          offering_uniqueadvantages?: string | null
          organization_id: string
        }
        Update: {
          created_at?: string
          offering_id?: string
          offering_keysellingpoints?: string | null
          offering_name?: string
          offering_objective?: Database["public"]["Enums"]["offering_objective"]
          offering_problemsolved?: string | null
          offering_specialcategory?: Database["public"]["Enums"]["offering_specialcategory"]
          offering_uniqueadvantages?: string | null
          organization_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "b1offerings_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "a1organizations"
            referencedColumns: ["organization_id"]
          },
        ]
      }
      c1personas: {
        Row: {
          created_at: string
          offering_id: string
          persona_agemax: number
          persona_agemin: number
          persona_behaviors: Json | null
          persona_demographics: Json | null
          persona_gender: Database["public"]["Enums"]["persona_gender"]
          persona_id: string
          persona_interests: Json | null
          persona_name: string
        }
        Insert: {
          created_at?: string
          offering_id: string
          persona_agemax: number
          persona_agemin: number
          persona_behaviors?: Json | null
          persona_demographics?: Json | null
          persona_gender: Database["public"]["Enums"]["persona_gender"]
          persona_id?: string
          persona_interests?: Json | null
          persona_name: string
        }
        Update: {
          created_at?: string
          offering_id?: string
          persona_agemax?: number
          persona_agemin?: number
          persona_behaviors?: Json | null
          persona_demographics?: Json | null
          persona_gender?: Database["public"]["Enums"]["persona_gender"]
          persona_id?: string
          persona_interests?: Json | null
          persona_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "c1personas_offering_id_fkey"
            columns: ["offering_id"]
            isOneToOne: false
            referencedRelation: "b1offerings"
            referencedColumns: ["offering_id"]
          },
        ]
      }
      d1messages: {
        Row: {
          created_at: string
          message_id: string
          message_name: string
          message_status: Database["public"]["Enums"]["asset_status"]
          message_type: Database["public"]["Enums"]["message_type"]
          message_url: string
          persona_id: string
        }
        Insert: {
          created_at?: string
          message_id?: string
          message_name: string
          message_status: Database["public"]["Enums"]["asset_status"]
          message_type: Database["public"]["Enums"]["message_type"]
          message_url: string
          persona_id: string
        }
        Update: {
          created_at?: string
          message_id?: string
          message_name?: string
          message_status?: Database["public"]["Enums"]["asset_status"]
          message_type?: Database["public"]["Enums"]["message_type"]
          message_url?: string
          persona_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "d1messages_persona_id_fkey"
            columns: ["persona_id"]
            isOneToOne: false
            referencedRelation: "c1personas"
            referencedColumns: ["persona_id"]
          },
        ]
      }
      e1images: {
        Row: {
          created_at: string
          image_format: Database["public"]["Enums"]["image_format"]
          image_id: string
          image_inputprompt: string | null
          image_magicprompt: string | null
          image_model: string | null
          image_resolution: Database["public"]["Enums"]["image_resolution"]
          image_status: Database["public"]["Enums"]["asset_status"]
          image_storage: string
          image_style: string | null
          message_id: string
        }
        Insert: {
          created_at?: string
          image_format: Database["public"]["Enums"]["image_format"]
          image_id?: string
          image_inputprompt?: string | null
          image_magicprompt?: string | null
          image_model?: string | null
          image_resolution: Database["public"]["Enums"]["image_resolution"]
          image_status: Database["public"]["Enums"]["asset_status"]
          image_storage: string
          image_style?: string | null
          message_id: string
        }
        Update: {
          created_at?: string
          image_format?: Database["public"]["Enums"]["image_format"]
          image_id?: string
          image_inputprompt?: string | null
          image_magicprompt?: string | null
          image_model?: string | null
          image_resolution?: Database["public"]["Enums"]["image_resolution"]
          image_status?: Database["public"]["Enums"]["asset_status"]
          image_storage?: string
          image_style?: string | null
          message_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "e1images_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "d1messages"
            referencedColumns: ["message_id"]
          },
        ]
      }
      e2captions: {
        Row: {
          behavioral_hook: string
          brand_voice: string
          caption_id: string
          caption_name: string
          caption_status: Database["public"]["Enums"]["asset_status"]
          caption_type: Database["public"]["Enums"]["caption_type"]
          created_at: string
          message_id: string
        }
        Insert: {
          behavioral_hook: string
          brand_voice: string
          caption_id?: string
          caption_name: string
          caption_status: Database["public"]["Enums"]["asset_status"]
          caption_type: Database["public"]["Enums"]["caption_type"]
          created_at?: string
          message_id: string
        }
        Update: {
          behavioral_hook?: string
          brand_voice?: string
          caption_id?: string
          caption_name?: string
          caption_status?: Database["public"]["Enums"]["asset_status"]
          caption_type?: Database["public"]["Enums"]["caption_type"]
          created_at?: string
          message_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "e2captions_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "d1messages"
            referencedColumns: ["message_id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      asset_status: "Generated" | "Approved" | "Rejected" | "Archived"
      campaign_bidstrategy:
        | "Highest Volume"
        | "Cost Per Result"
        | "Return On Ad Spend"
      campaign_platform: "Google" | "Meta"
      caption_type: "PrimaryText" | "Headline" | "Description" | "LongHeadline"
      image_format: "Graphic" | "POV"
      image_resolution:
        | "RESOLUTION_1024_1024"
        | "RESOLUTION_896_1120"
        | "RESOLUTION_720_1280"
        | "RESOLUTION_1280_720"
        | "RESOLUTION_1344_704"
      message_type:
        | "0nocategory"
        | "1painpoint"
        | "2uniqueoffering"
        | "3valueprop"
        | "9clientprovided"
      offering_objective: "Sales" | "App"
      offering_specialcategory:
        | "None"
        | "Financial products and services"
        | "Employment"
        | "Housing"
        | "Social issues, elections or politics"
      persona_gender: "Women" | "Men" | "Both"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
