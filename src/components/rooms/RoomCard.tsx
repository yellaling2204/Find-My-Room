import { MapPin, Home, Users, Phone, IndianRupee, Lock, Send } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PublicRoom, useRoomContact } from '@/hooks/useRooms';
import { useAuth } from '@/hooks/useAuth';
import { useUserRole, isCustomer } from '@/hooks/useUserRole';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { InquiryDialog } from './InquiryDialog';

interface RoomCardProps {
  room: PublicRoom;
  onClick?: () => void;
}

export function RoomCard({ room, onClick }: RoomCardProps) {
  const imageUrl = room.images?.[0] || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&auto=format&fit=crop';
  const { user } = useAuth();
  const { data: userRole, isLoading: roleLoading } = useUserRole(user?.id);
  const [showContact, setShowContact] = useState(false);
  
  const { data: contactNumber, isLoading: contactLoading } = useRoomContact(
    room.id,
    !!user && showContact
  );

  const handleShowContact = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (user) {
      setShowContact(true);
    }
  };

  // Only show "Book Room" if user is explicitly a customer
  // If role is null/undefined or manager, show contact option
  const isUserCustomer = userRole === 'customer';
  const isUserManager = userRole === 'manager';

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't trigger card click if clicking on interactive elements
    const target = e.target as HTMLElement;
    if (target.closest('button, a, [role="dialog"]')) {
      return;
    }
    if (onClick) {
      onClick();
    }
  };

  return (
    <Card
      className="group overflow-hidden bg-white border border-border/50 shadow-sm hover:shadow-premium hover:border-primary/40 transition-all duration-300 h-full flex flex-col glow-effect hover:scale-[1.02]"
      onClick={onClick ? handleCardClick : undefined}
    >
      {/* Compact Image */}
      <div className="relative h-36 overflow-hidden bg-muted">
        <img
          src={imageUrl}
          alt={room.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
        <Badge className="absolute top-2 right-2 bg-primary text-primary-foreground shadow-md border-0 text-xs font-semibold px-2 py-0.5">
          {room.property_type}
        </Badge>
        <div className="absolute bottom-2 left-2 right-2">
          <div className="flex items-center gap-0.5 text-white drop-shadow-md">
            <IndianRupee className="w-4 h-4" />
            <span className="text-xl font-bold">{room.rent_price.toLocaleString()}</span>
            <span className="text-xs opacity-90">/mo</span>
          </div>
        </div>
      </div>

      {/* Compact Content */}
      <CardContent className="p-3 flex-1 flex flex-col">
        <h3 className="font-display text-base font-bold text-foreground mb-2 line-clamp-1">
          {room.title}
        </h3>

        <div className="space-y-1.5 mb-3 flex-1">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <MapPin className="w-3.5 h-3.5 text-primary flex-shrink-0" />
            <span className="text-xs font-medium line-clamp-1">{room.location}, {room.city}</span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Users className="w-3.5 h-3.5 text-primary flex-shrink-0" />
            <span className="text-xs font-medium">{room.tenant_preference}</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-border/50 gap-2">
          {user && isUserCustomer && !isUserManager ? (
            <div onClick={(e) => e.stopPropagation()} className="flex-1">
              <InquiryDialog
                room={room}
                trigger={
                  <Button
                    size="sm"
                    className="gradient-warm text-primary-foreground w-full shadow-warm hover:shadow-premium text-xs h-8 font-semibold"
                  >
                    <Send className="w-3 h-3 mr-1" />
                    Book
                  </Button>
                }
              />
            </div>
          ) : user && isUserManager ? (
            <div className="flex items-center gap-1.5 text-muted-foreground flex-1">
              <Phone className="w-3 h-3 text-secondary" />
              {showContact && contactNumber ? (
                <span className="text-xs font-medium">{contactNumber}</span>
              ) : contactLoading ? (
                <span className="text-xs">Loading...</span>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2 text-xs"
                  onClick={handleShowContact}
                >
                  Contact
                </Button>
              )}
            </div>
          ) : user && !roleLoading ? (
            <div onClick={(e) => e.stopPropagation()} className="flex-1">
              <InquiryDialog
                room={room}
                trigger={
                  <Button
                    size="sm"
                    className="gradient-warm text-primary-foreground w-full shadow-warm hover:shadow-premium text-xs h-8 font-semibold"
                  >
                    <Send className="w-3 h-3 mr-1" />
                    Book
                  </Button>
                }
              />
            </div>
          ) : (
            <Link 
              to="/auth?role=customer" 
              className="flex items-center gap-1 text-xs text-primary hover:underline"
              onClick={(e) => e.stopPropagation()}
            >
              <Lock className="w-3 h-3" />
              Login
            </Link>
          )}
          <Badge variant="outline" className="text-xs shrink-0 px-1.5 py-0.5">
            {room.is_available ? '✓' : '✗'}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
