import { Link, useNavigate } from 'react-router-dom';
import { Home, Plus, User, LogOut, Menu, X, MessageSquare, Building2 } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { useUserRole, isManager } from '@/hooks/useUserRole';
import { useUserProfile } from '@/hooks/useUserProfile';

export function Navbar() {
  const { user, signOut } = useAuth();
  const { data: userRole, isLoading: roleLoading } = useUserRole(user?.id);
  const { data: userProfile } = useUserProfile();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const displayName = userProfile?.full_name || user?.email?.split('@')[0] || 'User';

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  // Only show manager if role is explicitly 'manager'
  // If role is null/undefined or 'customer', treat as customer
  const isUserManager = userRole === 'manager';

  return (
    <nav className="sticky top-0 z-50 bg-card/95 backdrop-blur-lg border-b border-border/50 shadow-sm relative">
      {/* Subtle glow effect */}
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/home" className="flex items-center gap-2.5 group">
            <div className="w-11 h-11 rounded-xl gradient-warm flex items-center justify-center shadow-warm group-hover:scale-105 transition-transform duration-200">
              <Home className="w-5.5 h-5.5 text-primary-foreground" />
            </div>
            <span className="font-display text-xl font-bold text-foreground tracking-tight">
              StayRooms
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              to="/rooms"
              className="text-muted-foreground hover:text-foreground transition-colors font-medium"
            >
              Browse Rooms
            </Link>
            {user ? (
              <>
                {isUserManager ? (
                  <>
                    <Link
                      to="/add-room"
                      className="text-muted-foreground hover:text-foreground transition-colors font-medium flex items-center gap-1"
                    >
                      <Plus className="w-4 h-4" />
                      Add Room
                    </Link>
                    <Link
                      to="/my-rooms"
                      className="text-muted-foreground hover:text-foreground transition-colors font-medium"
                    >
                      My Listings
                    </Link>
                    <Link
                      to="/inquiries"
                      className="text-muted-foreground hover:text-foreground transition-colors font-medium flex items-center gap-1"
                    >
                      <MessageSquare className="w-4 h-4" />
                      Inquiries
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      to="/my-inquiries"
                      className="text-muted-foreground hover:text-foreground transition-colors font-medium flex items-center gap-1"
                    >
                      <MessageSquare className="w-4 h-4" />
                      My Booked Rooms
                    </Link>
                  </>
                )}
                <div className="flex items-center gap-3">
                  <div className="text-sm font-semibold text-foreground bg-primary/5 px-3 py-1.5 rounded-lg border border-primary/10">
                    Hi, {displayName.split(' ')[0]}! 👋
                  </div>
                  <Badge variant="outline" className="text-xs border-primary/20 bg-primary/5">
                    {isUserManager ? (
                      <><Building2 className="w-3 h-3 mr-1" />Manager</>
                    ) : (
                      <><User className="w-3 h-3 mr-1" />Customer</>
                    )}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleSignOut}
                    className="text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/auth?role=customer">
                  <Button variant="outline" className="hover:opacity-90 transition-opacity">
                    <User className="w-4 h-4 mr-2" />
                    Customer Login
                  </Button>
                </Link>
                <Link to="/auth?role=manager">
                  <Button className="gradient-warm text-primary-foreground shadow-warm hover:opacity-90 transition-opacity">
                    <Building2 className="w-4 h-4 mr-2" />
                    Staff Login
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-foreground" />
            ) : (
              <Menu className="w-6 h-6 text-foreground" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border animate-fade-in">
            <div className="flex flex-col gap-4">
              <Link
                to="/rooms"
                className="text-muted-foreground hover:text-foreground transition-colors font-medium py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Browse Rooms
              </Link>
              {user ? (
                <>
                  {isUserManager ? (
                    <>
                      <Link
                        to="/add-room"
                        className="text-muted-foreground hover:text-foreground transition-colors font-medium py-2 flex items-center gap-1"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Plus className="w-4 h-4" />
                        Add Room
                      </Link>
                      <Link
                        to="/my-rooms"
                        className="text-muted-foreground hover:text-foreground transition-colors font-medium py-2"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        My Listings
                      </Link>
                      <Link
                        to="/inquiries"
                        className="text-muted-foreground hover:text-foreground transition-colors font-medium py-2 flex items-center gap-1"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <MessageSquare className="w-4 h-4" />
                        Inquiries
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/my-inquiries"
                        className="text-muted-foreground hover:text-foreground transition-colors font-medium py-2 flex items-center gap-1"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <MessageSquare className="w-4 h-4" />
                        My Booked Rooms
                      </Link>
                    </>
                  )}
                  <div className="py-2 space-y-2">
                    <div className="text-sm font-medium text-foreground">
                      Hi, {displayName.split(' ')[0]}!
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {isUserManager ? (
                        <><Building2 className="w-3 h-3 mr-1" />Manager</>
                      ) : (
                        <><User className="w-3 h-3 mr-1" />Customer</>
                      )}
                    </Badge>
                  </div>
                  <button
                    onClick={() => {
                      handleSignOut();
                      setMobileMenuOpen(false);
                    }}
                    className="text-muted-foreground hover:text-foreground transition-colors font-medium py-2 flex items-center gap-1 text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-3">
                  <Link to="/auth?role=customer" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full">
                      <User className="w-4 h-4 mr-2" />
                      Customer Login
                    </Button>
                  </Link>
                  <Link to="/auth?role=manager" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="gradient-warm text-primary-foreground shadow-warm w-full">
                      <Building2 className="w-4 h-4 mr-2" />
                      Staff Login
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
