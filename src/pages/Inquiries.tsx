import { Layout } from '@/components/layout/Layout';
import { useAuth } from '@/hooks/useAuth';
import { useUserRole, isManager } from '@/hooks/useUserRole';
import { useManagerInquiries, useUpdateInquiryStatus } from '@/hooks/useInquiries';
import { useMyRooms } from '@/hooks/useRooms';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { MessageSquare, MapPin, Calendar, Mail, Phone, User } from 'lucide-react';
import { Navigate } from 'react-router-dom';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

const Inquiries = () => {
  const { user, loading: authLoading } = useAuth();
  const { data: userRole, isLoading: roleLoading } = useUserRole(user?.id);
  const { data: inquiries, isLoading } = useManagerInquiries(user?.id);
  const { data: rooms } = useMyRooms(user?.id);
  const updateStatus = useUpdateInquiryStatus();
  const { toast } = useToast();

  if (authLoading || roleLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-10 w-48 mb-8" />
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-40 w-full" />
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  if (!user) {
    return <Navigate to="/auth" />;
  }

  if (!isManager(userRole)) {
    return <Navigate to="/" />;
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

  const handleStatusChange = async (inquiryId: string, status: 'pending' | 'contacted' | 'resolved') => {
    try {
      await updateStatus.mutateAsync({ id: inquiryId, status });
      toast({
        title: 'Status updated',
        description: `Inquiry marked as ${status}`,
      });
    } catch (error: unknown) {
      toast({
        title: 'Failed to update status',
        description: error instanceof Error ? error.message : 'Unable to update status',
        variant: 'destructive',
      });
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
            Room Inquiries
          </h1>
          <p className="text-muted-foreground">
            Manage inquiries from customers interested in your rooms
          </p>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-40 w-full rounded-lg" />
            ))}
          </div>
        ) : inquiries && inquiries.length > 0 ? (
          <div className="space-y-4">
            {inquiries.map((inquiry) => {
              const room = getRoom(inquiry.room_id);
              return (
                <Card key={inquiry.id} className="hover:shadow-card-hover transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between flex-wrap gap-2">
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
                      <Select
                        value={inquiry.status}
                        onValueChange={(value: 'pending' | 'contacted' | 'resolved') => 
                          handleStatusChange(inquiry.id, value)
                        }
                      >
                        <SelectTrigger className={`w-32 ${getStatusColor(inquiry.status)}`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending – waiting for confirmation</SelectItem>
                          <SelectItem value="contacted">Booked – room confirmed</SelectItem>
                          <SelectItem value="resolved">Cancelled – not moving forward</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-muted/50 rounded-lg p-4 mb-4">
                      <p className="text-foreground">{inquiry.message}</p>
                    </div>
                    
                    <div className="flex flex-wrap gap-4 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <User className="w-4 h-4" />
                        <span className="font-medium text-foreground">{inquiry.customer_name}</span>
                      </div>
                      <a 
                        href={`mailto:${inquiry.customer_email}`}
                        className="flex items-center gap-2 text-primary hover:underline"
                      >
                        <Mail className="w-4 h-4" />
                        {inquiry.customer_email}
                      </a>
                      {inquiry.customer_phone && (
                        <a 
                          href={`tel:${inquiry.customer_phone}`}
                          className="flex items-center gap-2 text-primary hover:underline"
                        >
                          <Phone className="w-4 h-4" />
                          {inquiry.customer_phone}
                        </a>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mt-4">
                      <Calendar className="w-3 h-3" />
                      Received on {format(new Date(inquiry.created_at), 'MMM d, yyyy h:mm a')}
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
              When customers inquire about your rooms, they'll appear here
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Inquiries;
