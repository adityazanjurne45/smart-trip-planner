import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { WishlistProvider } from "@/contexts/WishlistContext";
import { BookingProvider } from "@/contexts/BookingContext";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import PlanTrip from "./pages/PlanTrip";
import MyTrips from "./pages/MyTrips";
import MyBookings from "./pages/MyBookings";
import Wishlist from "./pages/Wishlist";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminOverview from "./pages/admin/Overview";
import AdminUsers from "./pages/admin/UsersPage";
import AdminBookings from "./pages/admin/BookingsPage";
import AdminTrips from "./pages/admin/TripsPage";
import AdminHotels from "./pages/admin/HotelsPage";
import AdminOffers from "./pages/admin/OffersPage";
import AdminReviews from "./pages/admin/ReviewsPage";
import AdminWishlist from "./pages/admin/WishlistPage";
import AdminActivity from "./pages/admin/ActivityFeed";
import AdminAnalytics from "./pages/admin/Analytics";
import AdminNotifications from "./pages/admin/NotificationsPage";
import AdminSettings from "./pages/admin/Settings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <WishlistProvider>
        <BookingProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/plan-trip" element={<PlanTrip />} />
              <Route path="/my-trips" element={<MyTrips />} />
              <Route path="/my-bookings" element={<MyBookings />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin-login" element={<AdminLogin />} />
              <Route path="/admin-dashboard" element={<AdminLayout />}>
                <Route index element={<AdminOverview />} />
              </Route>
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminOverview />} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="bookings" element={<AdminBookings />} />
                <Route path="trips" element={<AdminTrips />} />
                <Route path="hotels" element={<AdminHotels />} />
                <Route path="offers" element={<AdminOffers />} />
                <Route path="reviews" element={<AdminReviews />} />
                <Route path="wishlist" element={<AdminWishlist />} />
                <Route path="activity" element={<AdminActivity />} />
                <Route path="analytics" element={<AdminAnalytics />} />
                <Route path="notifications" element={<AdminNotifications />} />
                <Route path="settings" element={<AdminSettings />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </BookingProvider>
      </WishlistProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
