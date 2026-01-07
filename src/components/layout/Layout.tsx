import { ReactNode } from 'react';
import { Navbar } from './Navbar';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background via-background to-muted/30 relative overflow-hidden">
      <Navbar />
      <main className="flex-1 relative">
        {/* Enhanced background with floating elements */}
        <div className="pointer-events-none fixed inset-0 -z-10 opacity-60">
          {/* Animated gradient orbs */}
          <div className="absolute top-20 left-10 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '8s' }} />
          <div className="absolute top-1/2 right-20 w-80 h-80 bg-secondary/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }} />
          <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-accent/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '12s', animationDelay: '4s' }} />
          
          {/* Radial gradients */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_hsl(8_75%_95%),_transparent_60%),radial-gradient(circle_at_bottom,_hsl(180_45%_95%),_transparent_55%)]" />
          
          {/* Grain texture */}
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-soft-light opacity-30" />
          
          {/* Grid pattern overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />
        </div>
        {children}
      </main>
    </div>
  );
}
