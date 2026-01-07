import { MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useAvailableCities } from '@/hooks/useRooms';
import { Skeleton } from '@/components/ui/skeleton';
import { Link } from 'react-router-dom';

export function AvailableLocations() {
  const { data: cities, isLoading } = useAvailableCities();

  if (isLoading) {
    return (
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <Skeleton className="h-8 w-64 mx-auto mb-4" />
            <Skeleton className="h-4 w-96 mx-auto" />
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-10 w-32 rounded-full" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!cities || cities.length === 0) {
    return null;
  }

  return (
    <section className="py-12 bg-muted/30 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-1/4 w-40 h-40 bg-secondary/5 rounded-full blur-2xl animate-float" />
      <div className="absolute bottom-0 left-1/4 w-32 h-32 bg-primary/5 rounded-full blur-2xl animate-float" style={{ animationDelay: '2s' }} />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-8 animate-slide-up">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-3">
            <span className="gradient-text-animated">Available Locations</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Find rooms in these cities across the country
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          {cities.map((cityData, index) => (
            <Link
              key={cityData.city}
              to={`/rooms?city=${encodeURIComponent(cityData.city)}`}
              style={{ animationDelay: `${index * 0.1}s` }}
              className="animate-slide-up"
            >
              <Badge
                variant="outline"
                className="px-4 py-2 text-sm font-medium bg-card hover:bg-primary hover:text-primary-foreground transition-all cursor-pointer border-border hover:scale-105 hover:shadow-warm glow-effect"
              >
                <MapPin className="w-4 h-4 mr-2" />
                {cityData.city}
                <span className="ml-2 text-xs opacity-70">
                  ({cityData.room_count} {cityData.room_count === 1 ? 'room' : 'rooms'})
                </span>
              </Badge>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
