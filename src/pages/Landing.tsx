import { Link } from 'react-router-dom';
import { Building2, Users, ArrowRight, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/30 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-12">
          <div className="w-14 h-14 rounded-xl gradient-warm flex items-center justify-center shadow-warm">
            <Home className="w-7 h-7 text-primary-foreground" />
          </div>
          <span className="font-display text-3xl font-bold text-foreground">StayRooms</span>
        </div>

        {/* Main Content */}
        <div className="text-center mb-12">
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4">
            Welcome to StayRooms
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Your trusted platform for booking hostel and PG rooms, or managing your property listings
          </p>
        </div>

        {/* Login Options */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Customer Login Card */}
          <Card className="border-2 border-border/50 hover:border-primary/50 transition-all hover:shadow-lg">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="font-display text-2xl">I'm a Customer</CardTitle>
              <CardDescription className="text-base">
                Looking for a room to rent? Browse and book rooms instantly.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="text-sm text-muted-foreground space-y-2 text-left">
                <li className="flex items-center gap-2">
                  <span className="text-primary">✓</span>
                  Browse verified rooms
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-primary">✓</span>
                  Filter by city and budget
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-primary">✓</span>
                  Direct contact with managers
                </li>
              </ul>
              <Link to="/auth?role=customer" className="block">
                <Button className="w-full gradient-warm text-primary-foreground shadow-warm hover:shadow-premium font-semibold h-12">
                  Customer Login
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Staff Login Card */}
          <Card className="border-2 border-border/50 hover:border-primary/50 transition-all hover:shadow-lg">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Building2 className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="font-display text-2xl">I'm Staff/Manager</CardTitle>
              <CardDescription className="text-base">
                Manage your property listings and respond to customer inquiries.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="text-sm text-muted-foreground space-y-2 text-left">
                <li className="flex items-center gap-2">
                  <span className="text-primary">✓</span>
                  Add and manage room listings
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-primary">✓</span>
                  Track customer inquiries
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-primary">✓</span>
                  Update availability status
                </li>
              </ul>
              <Link to="/auth?role=manager" className="block">
                <Button className="w-full gradient-warm text-primary-foreground shadow-warm hover:shadow-premium font-semibold h-12">
                  Staff Login
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Browse as Guest Option */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-2">
            Just browsing? You can explore rooms without logging in
          </p>
          <Link to="/rooms">
            <Button variant="outline" className="font-medium">
              Browse Rooms as Guest
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Landing;

