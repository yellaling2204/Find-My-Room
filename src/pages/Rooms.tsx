import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { RoomCard } from '@/components/rooms/RoomCard';
import { RoomFilters } from '@/components/rooms/RoomFilters';
import { useRooms, RoomFilters as RoomFiltersType } from '@/hooks/useRooms';
import { Skeleton } from '@/components/ui/skeleton';

const Rooms = () => {
  const [searchParams] = useSearchParams();
  const initialCity = searchParams.get('city') || '';
  const [filters, setFilters] = useState<RoomFiltersType>({
    city: initialCity || undefined,
  });
  const { data: rooms, isLoading } = useRooms(filters);

  useEffect(() => {
    if (initialCity) {
      setFilters((prev) => ({ ...prev, city: initialCity }));
    }
  }, [initialCity]);

  return (
    <Layout>
      <div className="h-[calc(100vh-4rem)] flex flex-col overflow-hidden">
        <div className="container mx-auto px-4 py-4 flex-1 flex flex-col min-h-0">
          {/* Compact Header */}
          <div className="flex items-center justify-between mb-4 flex-shrink-0">
            <div>
              <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">
                Browse Rooms
              </h1>
              {rooms && (
                <p className="text-sm text-muted-foreground mt-1">
                  {rooms.length} room{rooms.length !== 1 ? 's' : ''} available
                </p>
              )}
            </div>
          </div>

          {/* Compact Filters */}
          <div className="mb-4 flex-shrink-0">
            <RoomFilters onFilterChange={setFilters} />
          </div>

          {/* Scrollable Room Grid */}
          <div className="flex-1 overflow-y-auto min-h-0 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent hover:scrollbar-thumb-primary/30">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="space-y-3">
                    <Skeleton className="h-40 w-full rounded-lg" />
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                ))}
              </div>
            ) : rooms && rooms.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {rooms.map((room) => (
                  <RoomCard key={room.id} room={room} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 h-full flex items-center justify-center">
                <div>
                  <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                    No rooms found
                  </h3>
                  <p className="text-muted-foreground">
                    Try adjusting your filters or search in a different location
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Rooms;
