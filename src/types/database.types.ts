export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          role: 'customer' | 'staff' | 'super_admin'
          first_name: string | null
          last_name: string | null
          email: string
          phone: string | null
          avatar_url: string | null
          gender: string | null
          date_of_birth: string | null
          is_active: boolean
          email_verified: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          role?: 'customer' | 'staff' | 'super_admin'
          first_name?: string | null
          last_name?: string | null
          email: string
          phone?: string | null
          avatar_url?: string | null
          gender?: string | null
          date_of_birth?: string | null
          is_active?: boolean
          email_verified?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          role?: 'customer' | 'staff' | 'super_admin'
          first_name?: string | null
          last_name?: string | null
          email?: string
          phone?: string | null
          avatar_url?: string | null
          gender?: string | null
          date_of_birth?: string | null
          is_active?: boolean
          email_verified?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedSchema: "auth"
            columnsRange: []
            referencedColumns: ["id"]
          }
        ]
      }
      addresses: {
        Row: {
          id: string
          user_id: string
          recipient_name: string
          phone: string
          address_line1: string
          address_line2: string | null
          city: string
          state: string
          postal_code: string | null
          country: string
          landmark: string | null
          is_default: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          recipient_name: string
          phone: string
          address_line1: string
          address_line2?: string | null
          city: string
          state: string
          postal_code?: string | null
          country?: string
          landmark?: string | null
          is_default?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          recipient_name?: string
          phone?: string
          address_line1?: string
          address_line2?: string | null
          city?: string
          state?: string
          postal_code?: string | null
          country?: string
          landmark?: string | null
          is_default?: boolean
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "addresses_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profiles"
            referencedSchema: "public"
            columnsRange: []
            referencedColumns: ["id"]
          }
        ]
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          title: string
          message: string
          type: string
          is_read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          message: string
          type?: string
          is_read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title: string
          message?: string
          type?: string
          is_read?: boolean
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profiles"
            referencedSchema: "public"
            columnsRange: []
            referencedColumns: ["id"]
          }
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
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
