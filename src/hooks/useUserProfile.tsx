import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface UserProfile {
  id: string;
  full_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export function useUserProfile() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['user-profile', user?.id],
    queryFn: async () => {
      if (!user) return null;

      // First try to get from profiles table
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        // If profile doesn't exist, try to get from user metadata
        const fullName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'User';
        
        // Try to create profile if it doesn't exist
        const { data: newProfile, error: insertError } = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            full_name: fullName,
          })
          .select()
          .single();

        if (insertError) {
          // If insert fails, return a fallback profile
          return {
            id: user.id,
            full_name: fullName,
            phone: null,
            avatar_url: null,
            created_at: null,
            updated_at: null,
          } as UserProfile;
        }

        return newProfile as UserProfile;
      }

      // If profile exists but no full_name, use metadata or email
      if (data && !data.full_name) {
        const fullName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'User';
        return {
          ...data,
          full_name: fullName,
        } as UserProfile;
      }

      return data as UserProfile;
    },
    enabled: !!user,
  });
}

