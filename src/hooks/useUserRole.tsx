import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export type UserRole = 'customer' | 'manager';

export function useUserRole(userId?: string) {
  return useQuery({
    queryKey: ['user-role', userId],
    queryFn: async () => {
      if (!userId) return null;
      
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .single();

      if (error) {
        // If no role found, return null
        if (error.code === 'PGRST116') return null;
        throw error;
      }
      return data?.role as UserRole;
    },
    enabled: !!userId,
  });
}

export function useCreateUserRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: UserRole }) => {
      const { data, error } = await supabase
        .from('user_roles')
        .insert({ user_id: userId, role })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['user-role', variables.userId] });
    },
  });
}

export function isManager(role: UserRole | null | undefined): boolean {
  return role === 'manager';
}

export function isCustomer(role: UserRole | null | undefined): boolean {
  return role === 'customer';
}
