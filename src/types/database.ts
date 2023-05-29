export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[];

export interface Database {
  public: {
    Tables: {
      chat: {
        Row: {
          id: number;
          inserted_at: string;
          updated_at: string;
          user_id: string | null;
        };
        Insert: {
          id?: number;
          inserted_at?: string;
          updated_at?: string;
          user_id?: string | null;
        };
        Update: {
          id?: number;
          inserted_at?: string;
          updated_at?: string;
          user_id?: string | null;
        };
      };
      chat_line: {
        Row: {
          chat: number | null;
          id: number;
          inserted_at: string;
          message: string | null;
          sender: string | null;
        };
        Insert: {
          chat?: number | null;
          id?: number;
          inserted_at?: string;
          message?: string | null;
          sender?: string | null;
        };
        Update: {
          chat?: number | null;
          id?: number;
          inserted_at?: string;
          message?: string | null;
          sender?: string | null;
        };
      };
      chat_line_duplicate_public: {
        Row: {
          chat: number | null;
          id: number;
          inserted_at: string;
          message: string | null;
          sender: string | null;
        };
        Insert: {
          chat?: number | null;
          id?: number;
          inserted_at?: string;
          message?: string | null;
          sender?: string | null;
        };
        Update: {
          chat?: number | null;
          id?: number;
          inserted_at?: string;
          message?: string | null;
          sender?: string | null;
        };
      };
      content: {
        Row: {
          id: number;
          inserted_at: string;
          link: string;
          media_type: string | null;
          raw_content: string | null;
          shareable: boolean | null;
          source: string | null;
          title: string | null;
          updated_at: string;
          user_id: string | null;
        };
        Insert: {
          id?: number;
          inserted_at?: string;
          link: string;
          media_type?: string | null;
          raw_content?: string | null;
          shareable?: boolean | null;
          source?: string | null;
          title?: string | null;
          updated_at?: string;
          user_id?: string | null;
        };
        Update: {
          id?: number;
          inserted_at?: string;
          link?: string;
          media_type?: string | null;
          raw_content?: string | null;
          shareable?: boolean | null;
          source?: string | null;
          title?: string | null;
          updated_at?: string;
          user_id?: string | null;
        };
      };
      document: {
        Row: {
          content: number | null;
          embedding: string | null;
          id: number;
          inserted_at: string;
          updated_at: string;
        };
        Insert: {
          content?: number | null;
          embedding?: string | null;
          id?: number;
          inserted_at?: string;
          updated_at?: string;
        };
        Update: {
          content?: number | null;
          embedding?: string | null;
          id?: number;
          inserted_at?: string;
          updated_at?: string;
        };
      };
      plan: {
        Row: {
          id: number;
          inserted_at: string;
          status: string | null;
          steps: Json | null;
          title: string | null;
          updated_at: string;
          user_id: string | null;
        };
        Insert: {
          id?: number;
          inserted_at?: string;
          status?: string | null;
          steps?: Json | null;
          title?: string | null;
          updated_at?: string;
          user_id?: string | null;
        };
        Update: {
          id?: number;
          inserted_at?: string;
          status?: string | null;
          steps?: Json | null;
          title?: string | null;
          updated_at?: string;
          user_id?: string | null;
        };
      };
      profile: {
        Row: {
          avatar_url: string | null;
          background: Json | null;
          email: string | null;
          first_name: string | null;
          id: string;
          inserted_at: string;
          last_name: string | null;
          updated_at: string;
          username: string | null;
        };
        Insert: {
          avatar_url?: string | null;
          background?: Json | null;
          email?: string | null;
          first_name?: string | null;
          id: string;
          inserted_at?: string;
          last_name?: string | null;
          updated_at?: string;
          username?: string | null;
        };
        Update: {
          avatar_url?: string | null;
          background?: Json | null;
          email?: string | null;
          first_name?: string | null;
          id?: string;
          inserted_at?: string;
          last_name?: string | null;
          updated_at?: string;
          username?: string | null;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
