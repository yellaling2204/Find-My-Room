import { Link } from 'react-router-dom';
import { Plus, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

export function CTASection() {
  const { user } = useAuth();

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-background to-muted/30 relative overflow-hidden">
      {/* Floating decorative elements */}
      <div className="absolute top-10 left-10 w-48 h-48 bg-primary/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-10 right-10 w-56 h-56 bg-accent/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }} />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="relative overflow-hidden rounded-3xl gradient-premium p-8 md:p-16 shadow-premium border border-primary/20 glow-effect">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 animate-pulse" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 animate-pulse" style={{ animationDelay: '1s' }} />
            <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 animate-pulse" style={{ animationDelay: '2s' }} />
          </div>
          
          {/* Shimmer overlay */}
          <div className="absolute inset-0 shimmer rounded-3xl" />

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left">
              <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4 drop-shadow-md">
                Have a Room to Rent?
              </h2>
              <p className="text-white/95 max-w-md text-lg font-medium">
                List your property for free and connect with thousands of potential tenants looking for their next home.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              {user ? (
                <Link to="/add-room">
                  <Button
                    size="lg"
                    className="bg-white text-foreground hover:bg-white/95 shadow-lg hover:shadow-xl transition-all font-semibold"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Add Your Room
                  </Button>
                </Link>
              ) : (
                <Link to="/auth">
                  <Button
                    size="lg"
                    className="bg-white text-foreground hover:bg-white/95 shadow-lg hover:shadow-xl transition-all font-semibold"
                  >
                    Get Started
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
