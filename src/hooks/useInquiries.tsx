import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface RoomInquiry {
  id: string;
  room_id: string;
  customer_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  message: string;
  // Inquiry/booking status (internal values)
  // pending   -> inquiry received, not yet confirmed
  // contacted -> booked / in progress
  // resolved  -> cancelled / closed
  status: 'pending' | 'contacted' | 'resolved';
  created_at: string;
  updated_at: string;
}

export interface CreateInquiryData {
  room_id: string;
  customer_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  message: string;
}

// Fetch inquiries for a customer with real-time updates
export function useMyInquiries(userId?: string) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['my-inquiries', userId],
    queryFn: async () => {
      if (!userId) return [];
      
      const { data, error } = await supabase
        .from('room_inquiries')
        .select('*')
        .eq('customer_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as RoomInquiry[];
    },
    enabled: !!userId,
    // Enable automatic refetching for real-time feel
    refetchInterval: 3000, // Refetch every 3 seconds
  });

  // Set up real-time subscription
  useEffect(() => {
    if (!userId) return;

    const channel = supabase
      .channel(`my-inquiries-changes-${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'room_inquiries',
          filter: `customer_id=eq.${userId}`,
        },
        () => {
          // Invalidate queries when customer's inquiries change
          queryClient.invalidateQueries({ queryKey: ['my-inquiries', userId] });
        }
      )
      .subscribe();

    // Cleanup subscription on unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, queryClient]);

  return query;
}

// Fetch inquiries for a manager's rooms with real-time updates
export function useManagerInquiries(userId?: string) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['manager-inquiries', userId],
    queryFn: async () => {
      if (!userId) return [];
      
      // First get the manager's rooms
      const { data: rooms, error: roomsError } = await supabase
        .from('rooms')
        .select('id')
        .eq('owner_id', userId);

      if (roomsError) throw roomsError;
      if (!rooms || rooms.length === 0) return [];

      const roomIds = rooms.map(r => r.id);

      // Then get inquiries for those rooms
      const { data, error } = await supabase
        .from('room_inquiries')
        .select('*')
        .in('room_id', roomIds)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as RoomInquiry[];
    },
    enabled: !!userId,
    // Enable automatic refetching for real-time feel
    refetchInterval: 3000, // Refetch every 3 seconds
  });

  // Set up real-time subscription
  useEffect(() => {
    if (!userId) return;

    const channel = supabase
      .channel(`manager-inquiries-changes-${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'room_inquiries',
        },
        () => {
          // Invalidate queries when inquiries change
          queryClient.invalidateQueries({ queryKey: ['manager-inquiries', userId] });
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'rooms',
          filter: `owner_id=eq.${userId}`,
        },
        () => {
          // Also invalidate when manager's rooms change (new rooms might have inquiries)
          queryClient.invalidateQueries({ queryKey: ['manager-inquiries', userId] });
        }
      )
      .subscribe();

    // Cleanup subscription on unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, queryClient]);

  return query;
}

// Create an inquiry
export function useCreateInquiry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (inquiry: CreateInquiryData) => {
      const { data, error } = await supabase
        .from('room_inquiries')
        .insert(inquiry)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      // Invalidate all related queries to update all users immediately
      queryClient.invalidateQueries({ queryKey: ['my-inquiries', variables.customer_id] });
      queryClient.invalidateQueries({ queryKey: ['manager-inquiries'] });
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
    },
  });
}

// Update inquiry status (for managers)
export function useUpdateInquiryStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: 'pending' | 'contacted' | 'resolved' }) => {
      const { data, error } = await supabase
        .from('room_inquiries')
        .update({ status })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      // Invalidate all related queries to update all users
      queryClient.invalidateQueries({ queryKey: ['manager-inquiries'] });
      queryClient.invalidateQueries({ queryKey: ['my-inquiries'] });
    },
  });
}
