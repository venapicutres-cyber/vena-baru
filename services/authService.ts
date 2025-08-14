import { supabase } from '../lib/supabase';
import { User } from '../types';

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  role: 'Admin' | 'Member';
  permissions?: string[];
}

export const authService = {
  async signIn(email: string, password: string): Promise<AuthUser | null> {
    try {
      // First, authenticate with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (authError) throw authError;

      // Then get user details from our users table
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

      if (userError) throw userError;

      return {
        id: userData.id,
        email: userData.email,
        fullName: userData.full_name,
        role: userData.role,
        permissions: userData.permissions || []
      };
    } catch (error) {
      console.error('Sign in error:', error);
      return null;
    }
  },

  async signUp(email: string, password: string, fullName: string, role: 'Admin' | 'Member' = 'Member'): Promise<AuthUser | null> {
    try {
      // First, create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password
      });

      if (authError) throw authError;

      // Then create user record in our users table
      const { data: userData, error: userError } = await supabase
        .from('users')
        .insert({
          email,
          password, // In production, this should be hashed
          full_name: fullName,
          role,
          permissions: role === 'Admin' ? [] : []
        })
        .select()
        .single();

      if (userError) throw userError;

      return {
        id: userData.id,
        email: userData.email,
        fullName: userData.full_name,
        role: userData.role,
        permissions: userData.permissions || []
      };
    } catch (error) {
      console.error('Sign up error:', error);
      return null;
    }
  },

  async signOut(): Promise<void> {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error('Sign out error:', error);
    }
  },

  async getCurrentUser(): Promise<AuthUser | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data: userData, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', user.email)
        .single();

      if (error) throw error;

      return {
        id: userData.id,
        email: userData.email,
        fullName: userData.full_name,
        role: userData.role,
        permissions: userData.permissions || []
      };
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  }
};