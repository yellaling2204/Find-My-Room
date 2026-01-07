import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export function HeroSection() {
  const [searchCity, setSearchCity] = useState('');
  const navigate = useNavigate();

  const handleSearch = () => {
    navigate(`/rooms${searchCity ? `?city=${encodeURIComponent(searchCity)}` : ''}`);
  };

  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1920&auto=format&fit=crop')`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-foreground/70 via-foreground/50 to-foreground/80" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto animate-slide-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-xs md:text-sm text-white/80 mb-4 backdrop-blur-md">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            Trusted by guests & hostel owners across India
          </div>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight drop-shadow-lg">
            Book Cozy
            <span className="block bg-gradient-to-r from-white via-primary/90 to-white bg-clip-text text-transparent animate-pulse">
              Hostel & PG Rooms Instantly
            </span>
          </h1>
          <p className="text-lg md:text-xl text-white/90 mb-10 max-w-2xl mx-auto font-medium drop-shadow-md">
            Browse verified rooms, filter by city and budget, and connect directly with hostel managers—no broker hassle.
          </p>

          {/* Search Box */}
          <div className="bg-white/98 backdrop-blur-xl rounded-2xl p-5 md:p-7 shadow-premium max-w-2xl mx-auto border border-white/20 glow-effect hover:shadow-premium transition-all">
            <div className="flex flex-col md:flex-row gap-4 items-stretch">
              <div className="flex-1 relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary z-10" />
                <Input
                  placeholder="Enter city name..."
                  value={searchCity}
                  onChange={(e) => setSearchCity(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="pl-12 h-14 text-lg bg-background border-2 border-border/50 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>
              <Button
                onClick={handleSearch}
                className="h-14 px-8 text-lg gradient-warm text-primary-foreground shadow-warm hover:scale-[1.02] active:scale-100 transition-all hover:shadow-premium font-semibold"
              >
                <Search className="w-5 h-5 mr-2" />
                Search
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 mt-12">
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-bold text-white">500+</p>
              <p className="text-white/70">Rooms Listed</p>
            </div>
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-bold text-white">50+</p>
              <p className="text-white/70">Cities Covered</p>
            </div>
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-bold text-white">1000+</p>
              <p className="text-white/70">Happy Tenants</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M0 120L60 110C120 100 240 80 360 75C480 70 600 80 720 85C840 90 960 90 1080 85C1200 80 1320 70 1380 65L1440 60V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
            className="fill-background"
          />
        </svg>
      </div>
    </section>
  );
}
