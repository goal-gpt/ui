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
        Relationships: [
          {
            foreignKeyName: "chat_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
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
        Relationships: [
          {
            foreignKeyName: "chat_line_chat_fkey";
            columns: ["chat"];
            referencedRelation: "chat";
            referencedColumns: ["id"];
          }
        ];
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
        Relationships: [
          {
            foreignKeyName: "content_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      document: {
        Row: {
          content: number | null;
          embedding: string | null;
          id: number;
          inserted_at: string;
          raw_content: string;
          updated_at: string;
        };
        Insert: {
          content?: number | null;
          embedding?: string | null;
          id?: number;
          inserted_at?: string;
          raw_content: string;
          updated_at?: string;
        };
        Update: {
          content?: number | null;
          embedding?: string | null;
          id?: number;
          inserted_at?: string;
          raw_content?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "document_content_fkey";
            columns: ["content"];
            referencedRelation: "content";
            referencedColumns: ["id"];
          }
        ];
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
        Relationships: [
          {
            foreignKeyName: "plan_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
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
        Relationships: [
          {
            foreignKeyName: "profile_id_fkey";
            columns: ["id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      match_documents: {
        Args: {
          query_embedding: string;
          match_threshold: number;
          match_count: number;
        };
        Returns: {
          id: number;
          content: number;
          raw_content: string;
          similarity: number;
          link: string;
          title: string;
        }[];
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
