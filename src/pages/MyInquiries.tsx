import { Layout } from '@/components/layout/Layout';
import { useAuth } from '@/hooks/useAuth';
import { useMyInquiries } from '@/hooks/useInquiries';
import { useRooms } from '@/hooks/useRooms';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { MessageSquare, MapPin, Calendar } from 'lucide-react';
import { Navigate } from 'react-router-dom';
import { format } from 'date-fns';

const MyInquiries = () => {
  const { user, loading: authLoading } = useAuth();
  const { data: inquiries, isLoading } = useMyInquiries(user?.id);
  const { data: rooms } = useRooms();

  if (authLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-10 w-48 mb-8" />
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-32 w-full" />
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  if (!user) {
    return <Navigate to="/auth" />;
  }

  const getRoom = (roomId: string) => rooms?.find(r => r.id === roomId);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20';
      case 'contacted': return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
      case 'resolved': return 'bg-red-500/10 text-red-600 border-red-500/20';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
            My Booked Rooms
          </h1>
          <p className="text-muted-foreground">
            View all the rooms you've inquired about and track their status
          </p>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-32 w-full rounded-lg" />
            ))}
          </div>
        ) : inquiries && inquiries.length > 0 ? (
          <div className="space-y-4">
            {inquiries.map((inquiry) => {
              const room = getRoom(inquiry.room_id);
              return (
                <Card key={inquiry.id} className="hover:shadow-card-hover transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">
                          {room?.title || 'Room'}
                        </CardTitle>
                        {room && (
                          <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                            <MapPin className="w-3 h-3" />
                            {room.location}, {room.city}
                          </div>
                        )}
                      </div>
                      <Badge className={getStatusColor(inquiry.status)}>
                        {inquiry.status === 'pending' && 'Pending'}
                        {inquiry.status === 'contacted' && 'Booked'}
                        {inquiry.status === 'resolved' && 'Cancelled'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-3">{inquiry.message}</p>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                      Sent on {format(new Date(inquiry.created_at), 'MMM d, yyyy')}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16">
            <MessageSquare className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="font-display text-xl font-semibold text-foreground mb-2">
              No inquiries yet
            </h3>
            <p className="text-muted-foreground">
              Browse rooms and send inquiries to property managers
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default MyInquiries;
