import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { RoomForm } from '@/components/rooms/RoomForm';
import { useAuth } from '@/hooks/useAuth';
import { useUserRole, isManager } from '@/hooks/useUserRole';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { LogIn, Building2, Users } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const AddRoom = () => {
  const { user, loading } = useAuth();
  const { data: userRole, isLoading: roleLoading } = useUserRole(user?.id);
  const navigate = useNavigate();

  if (loading || roleLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <Skeleton className="h-10 w-48 mb-4" />
            <Skeleton className="h-6 w-64 mb-8" />
            <Skeleton className="h-96 w-full rounded-lg" />
          </div>
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
                You need to sign in as a manager to add room listings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Link to="/auth?role=manager">
                <Button className="gradient-warm text-primary-foreground shadow-warm w-full">
                  <Building2 className="w-4 h-4 mr-2" />
                  Sign Up as Manager
                </Button>
              </Link>
              <Link to="/auth">
                <Button variant="outline" className="w-full">
                  <LogIn className="w-4 h-4 mr-2" />
                  Already have an account? Sign In
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  if (!isManager(userRole)) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-[60vh]">
          <Card className="max-w-md w-full text-center">
            <CardHeader>
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-muted-foreground" />
              </div>
              <CardTitle className="font-display text-2xl">Customer Account</CardTitle>
              <CardDescription>
                You're signed in as a customer. Only managers can add room listings.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                If you want to list rooms, please create a new account as a manager.
              </p>
              <Link to="/rooms">
                <Button className="gradient-warm text-primary-foreground shadow-warm">
                  Browse Rooms Instead
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
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-3xl mx-auto">
          {/* Header Section */}
          <div className="mb-8 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
              <Building2 className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-primary">Manager Dashboard</span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-3">
              Add New Room Listing
            </h1>
            <p className="text-muted-foreground text-lg">
              Fill in the details below to list your room. Once added, it will be visible to all customers browsing rooms.
            </p>
          </div>

          {/* Form Card */}
          <Card className="shadow-lg border-2 border-border/50">
            <CardContent className="pt-8 pb-8">
              <RoomForm 
                onSuccess={() => {
                  navigate('/my-rooms');
                }} 
              />
            </CardContent>
          </Card>

          {/* Info Box */}
          <div className="mt-6 p-4 rounded-lg bg-primary/5 border border-primary/20">
            <p className="text-sm text-muted-foreground">
              <strong className="text-foreground">What happens next?</strong> After you submit this form, your room will be:
            </p>
            <ul className="mt-2 space-y-1 text-sm text-muted-foreground ml-4 list-disc">
              <li>Added to your "My Listings" page for management</li>
              <li>Made visible to all customers browsing rooms</li>
              <li>Searchable by city, price, and property type</li>
              <li>Available for customers to send inquiries</li>
            </ul>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AddRoom;
