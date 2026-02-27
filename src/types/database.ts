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
                    id: number
                    name: string
                    role: 'customer' | 'admin' | 'team_member'
                    email: string
                    password?: string
                    avatar_url: string | null
                    created_at: string
                }
                Insert: {
                    id?: number
                    name: string
                    role?: 'customer' | 'admin' | 'team_member'
                    email: string
                    password?: string
                    avatar_url?: string | null
                    created_at?: string
                }
                Update: {
                    id?: number
                    name?: string
                    role?: 'customer' | 'admin' | 'team_member'
                    email?: string
                    password?: string
                    avatar_url?: string | null
                }
                Relationships: []
            }
            tickets: {
                Row: {
                    id: number
                    ticket_type: 'Technical Issue' | 'Billing' | 'Feature Request' | 'Bug Report' | 'Account Management'
                    description: string
                    status: 'open' | 'progress' | 'review' | 'resolved'
                    created_by: number | null
                    assign_to: number | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: number
                    ticket_type: 'Technical Issue' | 'Billing' | 'Feature Request' | 'Bug Report' | 'Account Management'
                    description: string
                    status?: 'open' | 'progress' | 'review' | 'resolved'
                    created_by?: number | null
                    assign_to?: number | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: number
                    ticket_type?: 'Technical Issue' | 'Billing' | 'Feature Request' | 'Bug Report' | 'Account Management'
                    description?: string
                    status?: 'open' | 'progress' | 'review' | 'resolved'
                    created_by?: number | null
                    assign_to?: number | null
                    updated_at?: string
                }
                Relationships: [
                    {
                        foreignKeyName: 'tickets_assign_to_fkey'
                        columns: ['assign_to']
                        isOneToOne: false
                        referencedRelation: 'users'
                        referencedColumns: ['id']
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
