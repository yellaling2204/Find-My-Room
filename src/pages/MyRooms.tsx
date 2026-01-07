import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Pencil, Trash2, ToggleLeft, ToggleRight, LogIn, Building2 } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { useAuth } from '@/hooks/useAuth';
import { useMyRooms, useUpdateRoom, useDeleteRoom, Room } from '@/hooks/useRooms';
import { EditRoomDialog } from '@/components/rooms/EditRoomDialog';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';

const MyRooms = () => {
  const { user, loading: authLoading } = useAuth();
  const { data: rooms, isLoading } = useMyRooms(user?.id);
  const updateRoom = useUpdateRoom();
  const deleteRoom = useDeleteRoom();
  const { toast } = useToast();

  const toggleAvailability = async (room: Room) => {
    try {
      await updateRoom.mutateAsync({
        id: room.id,
        is_available: !room.is_available,
      });
      toast({
        title: room.is_available ? 'Room marked as rented' : 'Room marked as available',
      });
    } catch (error) {
      toast({
        title: 'Error updating room',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteRoom.mutateAsync(id);
      toast({
        title: 'Room deleted successfully',
      });
    } catch (error) {
      toast({
        title: 'Error deleting room',
        variant: 'destructive',
      });
    }
  };

  if (authLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[60vh]">
          <div className="animate-pulse text-muted-foreground">Loading...</div>
        </div>
      </Layout>
    );
  }

  if (!user) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-[60vh]">
          <Card className="max-w-md w-full text-center">
            <CardHeader>
              <CardTitle className="font-display text-2xl">Sign In Required</CardTitle>
              <CardDescription>
                You need to sign in to view your listings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/auth">
                <Button className="gradient-warm text-primary-foreground shadow-warm">
                  <LogIn className="w-4 h-4 mr-2" />
                  Sign In to Continue
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="h-[calc(100vh-4rem)] flex flex-col overflow-hidden">
        <div className="container mx-auto px-4 py-4 flex-1 flex flex-col min-h-0">
          {/* Compact Header */}
          <div className="mb-4 flex-shrink-0">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
                  <Building2 className="w-4 h-4 text-primary" />
                  <span className="text-xs font-semibold text-primary">Manager Dashboard</span>
                </div>
                <div>
                  <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">
                    My Listings
                  </h1>
                  {rooms && (
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {rooms.length} room{rooms.length !== 1 ? 's' : ''} listed
                    </p>
                  )}
                </div>
              </div>
              <Link to="/add-room">
                <Button size="sm" className="gradient-warm text-primary-foreground shadow-warm hover:shadow-premium font-semibold">
                  <Plus className="w-4 h-4 mr-1.5" />
                  Add Room
                </Button>
              </Link>
            </div>
          </div>

          {/* Scrollable Room List */}
          <div className="flex-1 overflow-y-auto min-h-0 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent hover:scrollbar-thumb-primary/30">
            {isLoading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-28 w-full rounded-lg" />
                ))}
              </div>
            ) : rooms && rooms.length > 0 ? (
              <div className="space-y-3">
                {rooms.map((room) => (
                  <Card key={room.id} className="overflow-hidden border border-border/50 shadow-sm hover:shadow-md transition-all">
                    <div className="flex flex-col sm:flex-row">
                      {/* Compact Image */}
                      <div className="w-full sm:w-32 h-32 sm:h-auto flex-shrink-0 bg-muted">
                        <img
                          src={room.images?.[0] || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&auto=format&fit=crop'}
                          alt={room.title}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Compact Content */}
                      <div className="flex-1 p-3 sm:p-4">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                              <h3 className="font-display text-base font-bold text-foreground line-clamp-1">
                                {room.title}
                              </h3>
                              <Badge 
                                variant={room.is_available ? 'default' : 'secondary'}
                                className={`text-xs ${room.is_available ? 'bg-primary text-primary-foreground' : ''}`}
                              >
                                {room.is_available ? '✓' : '✗'}
                              </Badge>
                            </div>
                            <p className="text-muted-foreground text-xs mb-2 font-medium line-clamp-1">
                              📍 {room.location}, {room.city}
                            </p>
                            <div className="flex flex-wrap gap-1.5 text-xs mb-2">
                              <Badge variant="outline" className="text-xs font-medium px-1.5 py-0">{room.property_type}</Badge>
                              <Badge variant="outline" className="text-xs font-medium px-1.5 py-0">{room.tenant_preference}</Badge>
                              <span className="text-primary font-bold">
                                ₹{room.rent_price.toLocaleString()}/mo
                              </span>
                            </div>
                            {room.description && (
                              <p className="text-xs text-muted-foreground line-clamp-1">
                                {room.description}
                              </p>
                            )}
                          </div>

                          {/* Compact Actions */}
                          <div className="flex flex-row sm:flex-col gap-1.5">
                            <EditRoomDialog
                              room={room}
                              trigger={
                                <Button variant="outline" size="sm" className="text-xs h-7 px-2 font-medium">
                                  <Pencil className="w-3 h-3 mr-1" />
                                  Edit
                                </Button>
                              }
                            />
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => toggleAvailability(room)}
                              className="text-xs h-7 px-2 font-medium"
                            >
                              {room.is_available ? (
                                <>
                                  <ToggleRight className="w-3 h-3 mr-1" />
                                  Rented
                                </>
                              ) : (
                                <>
                                  <ToggleLeft className="w-3 h-3 mr-1" />
                                  Available
                                </>
                              )}
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="outline" size="sm" className="text-destructive hover:text-destructive hover:bg-destructive/10 text-xs h-7 px-2">
                                  <Trash2 className="w-3 h-3 mr-1" />
                                  Delete
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Room Listing</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete "{room.title}"? This action cannot be undone and the room will be removed from customer view.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDelete(room.id)}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="h-full flex items-center justify-center">
                <Card className="text-center py-12 border-2 border-dashed border-border/50 max-w-md mx-auto">
                  <CardContent>
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <Building2 className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="font-display text-xl font-bold text-foreground mb-2">
                      No listings yet
                    </h3>
                    <p className="text-muted-foreground mb-4 text-sm">
                      Start by adding your first room listing. Once added, it will be visible to all customers.
                    </p>
                    <Link to="/add-room">
                      <Button size="sm" className="gradient-warm text-primary-foreground shadow-warm hover:shadow-premium font-semibold">
                        <Plus className="w-4 h-4 mr-1.5" />
                        Add Your First Room
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default MyRooms;
