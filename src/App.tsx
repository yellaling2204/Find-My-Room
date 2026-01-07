import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { AuthProvider } from "@/hooks/auth-provider";
import Landing from "./pages/Landing";
import Index from "./pages/Index";
import Rooms from "./pages/Rooms";
import AddRoom from "./pages/AddRoom";
import MyRooms from "./pages/MyRooms";
import Auth from "./pages/Auth";
import MyInquiries from "./pages/MyInquiries";
import Inquiries from "./pages/Inquiries";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Enable automatic refetching when window regains focus
      refetchOnWindowFocus: true,
      // Enable automatic refetching on reconnect
      refetchOnReconnect: true,
      // Stale time - data is considered fresh for 30 seconds
      staleTime: 30000,
      // Cache time - keep unused data in cache for 5 minutes
      gcTime: 300000,
    },
  },
});

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactElement }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/home" element={<Index />} />
            <Route path="/rooms" element={<Rooms />} />
            <Route path="/auth" element={<Auth />} />
            <Route 
              path="/add-room" 
              element={
                <ProtectedRoute>
                  <AddRoom />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/my-rooms" 
              element={
                <ProtectedRoute>
                  <MyRooms />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/my-inquiries" 
              element={
                <ProtectedRoute>
                  <MyInquiries />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/inquiries" 
              element={
                <ProtectedRoute>
                  <Inquiries />
                </ProtectedRoute>
              } 
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
