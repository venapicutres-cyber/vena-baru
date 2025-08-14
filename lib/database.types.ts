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
      users: {
        Row: {
          id: string
          email: string
          password: string
          full_name: string
          role: string
          permissions: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          password: string
          full_name: string
          role?: string
          permissions?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          password?: string
          full_name?: string
          role?: string
          permissions?: Json
          created_at?: string
          updated_at?: string
        }
      }
      clients: {
        Row: {
          id: string
          name: string
          email: string
          phone: string
          instagram: string | null
          since: string
          status: string
          client_type: string
          last_contact: string
          portal_access_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          phone: string
          instagram?: string | null
          since?: string
          status?: string
          client_type?: string
          last_contact?: string
          portal_access_id?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          phone?: string
          instagram?: string | null
          since?: string
          status?: string
          client_type?: string
          last_contact?: string
          portal_access_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      packages: {
        Row: {
          id: string
          name: string
          price: number
          physical_items: Json
          digital_items: Json
          processing_time: string
          photographers: string | null
          videographers: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          price?: number
          physical_items?: Json
          digital_items?: Json
          processing_time?: string
          photographers?: string | null
          videographers?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          price?: number
          physical_items?: Json
          digital_items?: Json
          processing_time?: string
          photographers?: string | null
          videographers?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      add_ons: {
        Row: {
          id: string
          name: string
          price: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          price?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          price?: number
          created_at?: string
          updated_at?: string
        }
      }
      team_members: {
        Row: {
          id: string
          name: string
          role: string
          email: string
          phone: string
          standard_fee: number
          no_rek: string | null
          reward_balance: number
          rating: number
          portal_access_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          role: string
          email: string
          phone: string
          standard_fee?: number
          no_rek?: string | null
          reward_balance?: number
          rating?: number
          portal_access_id?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          role?: string
          email?: string
          phone?: string
          standard_fee?: number
          no_rek?: string | null
          reward_balance?: number
          rating?: number
          portal_access_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      projects: {
        Row: {
          id: string
          project_name: string
          client_name: string
          client_id: string
          project_type: string
          package_name: string
          package_id: string | null
          add_ons: Json
          date: string
          deadline_date: string | null
          location: string
          progress: number
          status: string
          active_sub_statuses: Json
          total_cost: number
          amount_paid: number
          payment_status: string
          team: Json
          notes: string | null
          accommodation: string | null
          drive_link: string | null
          client_drive_link: string | null
          final_drive_link: string | null
          start_time: string | null
          end_time: string | null
          image: string | null
          promo_code_id: string | null
          discount_amount: number
          shipping_details: string | null
          dp_proof_url: string | null
          printing_cost: number
          transport_cost: number
          is_editing_confirmed_by_client: boolean
          is_printing_confirmed_by_client: boolean
          is_delivery_confirmed_by_client: boolean
          confirmed_sub_statuses: Json
          client_sub_status_notes: Json
          sub_status_confirmation_sent_at: Json
          completed_digital_items: Json
          invoice_signature: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_name: string
          client_name: string
          client_id: string
          project_type: string
          package_name: string
          package_id?: string | null
          add_ons?: Json
          date: string
          deadline_date?: string | null
          location: string
          progress?: number
          status?: string
          active_sub_statuses?: Json
          total_cost?: number
          amount_paid?: number
          payment_status?: string
          team?: Json
          notes?: string | null
          accommodation?: string | null
          drive_link?: string | null
          client_drive_link?: string | null
          final_drive_link?: string | null
          start_time?: string | null
          end_time?: string | null
          image?: string | null
          promo_code_id?: string | null
          discount_amount?: number
          shipping_details?: string | null
          dp_proof_url?: string | null
          printing_cost?: number
          transport_cost?: number
          is_editing_confirmed_by_client?: boolean
          is_printing_confirmed_by_client?: boolean
          is_delivery_confirmed_by_client?: boolean
          confirmed_sub_statuses?: Json
          client_sub_status_notes?: Json
          sub_status_confirmation_sent_at?: Json
          completed_digital_items?: Json
          invoice_signature?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          project_name?: string
          client_name?: string
          client_id?: string
          project_type?: string
          package_name?: string
          package_id?: string | null
          add_ons?: Json
          date?: string
          deadline_date?: string | null
          location?: string
          progress?: number
          status?: string
          active_sub_statuses?: Json
          total_cost?: number
          amount_paid?: number
          payment_status?: string
          team?: Json
          notes?: string | null
          accommodation?: string | null
          drive_link?: string | null
          client_drive_link?: string | null
          final_drive_link?: string | null
          start_time?: string | null
          end_time?: string | null
          image?: string | null
          promo_code_id?: string | null
          discount_amount?: number
          shipping_details?: string | null
          dp_proof_url?: string | null
          printing_cost?: number
          transport_cost?: number
          is_editing_confirmed_by_client?: boolean
          is_printing_confirmed_by_client?: boolean
          is_delivery_confirmed_by_client?: boolean
          confirmed_sub_statuses?: Json
          client_sub_status_notes?: Json
          sub_status_confirmation_sent_at?: Json
          completed_digital_items?: Json
          invoice_signature?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      // Add other table types as needed...
      [key: string]: {
        Row: { [key: string]: any }
        Insert: { [key: string]: any }
        Update: { [key: string]: any }
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