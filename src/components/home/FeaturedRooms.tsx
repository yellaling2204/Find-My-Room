import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { RoomCard } from '@/components/rooms/RoomCard';
import { useRooms } from '@/hooks/useRooms';
import { Skeleton } from '@/components/ui/skeleton';

export function FeaturedRooms() {
  const { data: rooms, isLoading } = useRooms();
  const featuredRooms = rooms?.slice(0, 6) || [];

  return (
    <section className="py-16 md:py-24 bg-transparent relative overflow-hidden">
      {/* Decorative floating elements */}
      <div className="absolute top-20 right-10 w-32 h-32 bg-primary/10 rounded-full blur-2xl animate-float" style={{ animationDelay: '0s' }} />
      <div className="absolute bottom-20 left-10 w-40 h-40 bg-secondary/10 rounded-full blur-2xl animate-float" style={{ animationDelay: '2s' }} />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
          <div className="animate-slide-up">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              <span className="gradient-text-animated">Featured Rooms</span>
            </h2>
            <p className="text-muted-foreground max-w-xl text-lg">
              Explore our handpicked selection of rooms available for rent across various cities.
            </p>
          </div>
          <Link to="/rooms" className="mt-6 md:mt-0">
            <Button variant="outline" className="group border-2 border-primary/20 hover:border-primary/40 hover:bg-primary/5 font-semibold">
              View All Rooms
              <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="h-48 w-full rounded-lg" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : featuredRooms.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredRooms.map((room) => (
              <RoomCard key={room.id} room={room} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No rooms listed yet. Be the first to add one!</p>
            <Link to="/add-room">
              <Button className="mt-4 gradient-warm text-primary-foreground">
                Add Your Room
              </Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
