import { Search, Home, Phone } from 'lucide-react';

const steps = [
  {
    icon: Search,
    title: 'Search',
    description: 'Browse through our extensive collection of rooms based on your location and preferences.',
  },
  {
    icon: Home,
    title: 'Select',
    description: 'Find a room that matches your budget, property type, and tenant requirements.',
  },
  {
    icon: Phone,
    title: 'Connect',
    description: 'Contact the owner directly and schedule a visit to see your potential new home.',
  },
];

export function HowItWorks() {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-muted/50 to-transparent relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-secondary/5 rounded-full blur-3xl" />
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12 animate-slide-up">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            <span className="gradient-text-animated">How It Works</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-lg">
            Finding your perfect room is easy with StayRooms
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className="relative text-center group"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-12 left-1/2 w-full h-0.5 bg-border" />
              )}

              {/* Icon */}
              <div className="relative z-10 w-24 h-24 mx-auto mb-6 rounded-2xl gradient-warm flex items-center justify-center shadow-warm transition-all group-hover:scale-110 group-hover:shadow-premium glow-effect">
                <step.icon className="w-10 h-10 text-primary-foreground transition-transform group-hover:scale-110" />
              </div>

              {/* Step Number */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 w-8 h-8 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center text-sm font-bold">
                {index + 1}
              </div>

              {/* Content */}
              <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                {step.title}
              </h3>
              <p className="text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
