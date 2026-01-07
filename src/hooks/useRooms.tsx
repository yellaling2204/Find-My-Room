import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Tables, TablesInsert, TablesUpdate, Database } from '@/integrations/supabase/types';

export type Room = Tables<'rooms'>;
export type RoomInsert = TablesInsert<'rooms'>;
export type RoomUpdate = TablesUpdate<'rooms'>;

// Public room type without contact_number
export type PublicRoom = Omit<Room, 'contact_number'>;

type PropertyType = Database['public']['Enums']['property_type'];
type TenantPreference = Database['public']['Enums']['tenant_preference'];

export interface RoomFilters {
  city?: string;
  minPrice?: number;
  maxPrice?: number;
  propertyType?: PropertyType;
  tenantPreference?: TenantPreference;
}

// Fetch public rooms without contact information with real-time updates
export function useRooms(filters?: RoomFilters) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['rooms', filters],
    queryFn: async () => {
      let query = supabase
        .from('rooms')
        .select('id, title, description, location, city, rent_price, property_type, tenant_preference, images, is_available, owner_id, created_at, updated_at')
        .eq('is_available', true)
        .order('created_at', { ascending: false });

      if (filters?.city) {
        query = query.ilike('city', `%${filters.city}%`);
      }
      if (filters?.minPrice) {
        query = query.gte('rent_price', filters.minPrice);
      }
      if (filters?.maxPrice) {
        query = query.lte('rent_price', filters.maxPrice);
      }
      if (filters?.propertyType) {
        query = query.eq('property_type', filters.propertyType);
      }
      if (filters?.tenantPreference) {
        query = query.eq('tenant_preference', filters.tenantPreference);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as PublicRoom[];
    },
    // Enable automatic refetching for real-time feel
    refetchInterval: 3000, // Refetch every 3 seconds
  });

  // Set up real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel('rooms-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'rooms',
        },
        () => {
          // Invalidate queries when rooms change
          queryClient.invalidateQueries({ queryKey: ['rooms'] });
          queryClient.invalidateQueries({ queryKey: ['available-cities'] });
        }
      )
      .subscribe();

    // Cleanup subscription on unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return query;
}

// Fetch contact number for authenticated users only
export function useRoomContact(roomId: string, isAuthenticated: boolean) {
  return useQuery({
    queryKey: ['room-contact', roomId],
    queryFn: async () => {
      const { data, error } = await supabase
        .rpc('get_room_contact', { room_id: roomId });
      
      if (error) throw error;
      return data as string;
    },
    enabled: !!roomId && isAuthenticated,
  });
}

// Get available cities for location filter with real-time updates
export function useAvailableCities() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['available-cities'],
    queryFn: async () => {
      const { data, error } = await supabase
        .rpc('get_available_cities');
      
      if (error) throw error;
      return data as { city: string; room_count: number }[];
    },
    // Enable automatic refetching for real-time feel
    refetchInterval: 10000, // Refetch every 10 seconds
  });

  // Set up real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel('cities-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'rooms',
        },
        () => {
          // Invalidate cities query when rooms change
          queryClient.invalidateQueries({ queryKey: ['available-cities'] });
        }
      )
      .subscribe();

    // Cleanup subscription on unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return query;
}

export function useMyRooms(userId?: string) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['my-rooms', userId],
    queryFn: async () => {
      if (!userId) return [];
      
      const { data, error } = await supabase
        .from('rooms')
        .select('*')
        .eq('owner_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Room[];
    },
    enabled: !!userId,
    // Enable automatic refetching for real-time feel
    refetchInterval: 3000, // Refetch every 3 seconds
  });

  // Set up real-time subscription
  useEffect(() => {
    if (!userId) return;

    const channel = supabase
      .channel(`my-rooms-changes-${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'rooms',
          filter: `owner_id=eq.${userId}`,
        },
        () => {
          // Invalidate queries when user's rooms change
          queryClient.invalidateQueries({ queryKey: ['my-rooms', userId] });
          queryClient.invalidateQueries({ queryKey: ['rooms'] });
          queryClient.invalidateQueries({ queryKey: ['available-cities'] });
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

export function useCreateRoom() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (room: RoomInsert) => {
      const { data, error } = await supabase
        .from('rooms')
        .insert(room)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      // Invalidate all related queries to update all users immediately
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
      queryClient.invalidateQueries({ queryKey: ['my-rooms'] });
      queryClient.invalidateQueries({ queryKey: ['available-cities'] });
      queryClient.invalidateQueries({ queryKey: ['manager-inquiries'] });
    },
  });
}

export function useUpdateRoom() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: RoomUpdate & { id: string }) => {
      const { data, error } = await supabase
        .from('rooms')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      // Invalidate all related queries to update all users immediately
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
      queryClient.invalidateQueries({ queryKey: ['my-rooms'] });
      queryClient.invalidateQueries({ queryKey: ['available-cities'] });
      queryClient.invalidateQueries({ queryKey: ['manager-inquiries'] });
    },
  });
}

export function useDeleteRoom() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('rooms')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      // Invalidate all related queries to update all users immediately
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
      queryClient.invalidateQueries({ queryKey: ['my-rooms'] });
      queryClient.invalidateQueries({ queryKey: ['available-cities'] });
      queryClient.invalidateQueries({ queryKey: ['manager-inquiries'] });
    },
  });
}

export async function uploadRoomImages(files: File[]): Promise<string[]> {
  const uploadPromises = files.map(async (file) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${crypto.randomUUID()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error } = await supabase.storage
      .from('room-images')
      .upload(filePath, file);

    if (error) throw error;

    const { data } = supabase.storage
      .from('room-images')
      .getPublicUrl(filePath);

    return data.publicUrl;
  });

  return Promise.all(uploadPromises);
}
