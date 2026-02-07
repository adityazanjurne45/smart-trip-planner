import { useState, useEffect, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import Navbar from "@/components/layout/Navbar";
import { useProfile } from "@/hooks/useProfile";
import { Loader2, Plus, Compass, GitCompare, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import TripComparison from "@/components/dashboard/TripComparison";
import TripCard from "@/components/mytrips/TripCard";
import TripFilters from "@/components/mytrips/TripFilters";
import { useToast } from "@/hooks/use-toast";

const MyTrips = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showComparison, setShowComparison] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [yearFilter, setYearFilter] = useState("all");
  const navigate = useNavigate();
  const { toast } = useToast();

  const { pastTrips, loading: profileLoading, deletePastTrip } = useProfile(user?.id);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
        if (!session?.user) {
          navigate("/auth");
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
      if (!session?.user) {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  // Get available years from trips
  const availableYears = useMemo(() => {
    if (!pastTrips) return [];
    const years = new Set(pastTrips.map(trip => new Date(trip.trip_date).getFullYear().toString()));
    return Array.from(years).sort((a, b) => parseInt(b) - parseInt(a));
  }, [pastTrips]);

  // Get trip status
  const getTripStatus = (trip: typeof pastTrips[0]) => {
    const tripDate = new Date(trip.trip_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const endDate = new Date(tripDate);
    endDate.setDate(endDate.getDate() + trip.duration);
    
    if (today < tripDate) return "upcoming";
    if (today >= tripDate && today <= endDate) return "ongoing";
    return "completed";
  };

  // Filter trips
  const filteredTrips = useMemo(() => {
    if (!pastTrips) return [];
    
    return pastTrips.filter(trip => {
      // Search filter
      const matchesSearch = searchQuery === "" || 
        trip.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
        trip.boarding_point.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Status filter
      const status = getTripStatus(trip);
      const matchesStatus = statusFilter === "all" || status === statusFilter;
      
      // Year filter
      const tripYear = new Date(trip.trip_date).getFullYear().toString();
      const matchesYear = yearFilter === "all" || tripYear === yearFilter;
      
      return matchesSearch && matchesStatus && matchesYear;
    });
  }, [pastTrips, searchQuery, statusFilter, yearFilter]);

  // Separate upcoming and past trips
  const { upcomingTrips, pastTripsList } = useMemo(() => {
    const upcoming = filteredTrips.filter(trip => getTripStatus(trip) !== "completed");
    const past = filteredTrips.filter(trip => getTripStatus(trip) === "completed");
    return { upcomingTrips: upcoming, pastTripsList: past };
  }, [filteredTrips]);

  const handleDuplicate = (trip: typeof pastTrips[0]) => {
    toast({
      title: "Trip duplicated!",
      description: `Creating a new trip based on your ${trip.destination} itinerary.`,
    });
    navigate("/plan-trip");
  };

  if (loading || profileLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your trips...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary/20">
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 animate-fade-up">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Compass className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                  My Trips
                </h1>
                <p className="text-muted-foreground">
                  Your travel history and saved trips
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              {pastTrips && pastTrips.length >= 2 && (
                <Button
                  variant="outline"
                  className="gap-2"
                  onClick={() => setShowComparison(!showComparison)}
                >
                  <GitCompare className="w-4 h-4" />
                  Compare Trips
                </Button>
              )}
              <Link to="/plan-trip">
                <Button variant="travel" className="gap-2">
                  <Plus className="w-4 h-4" />
                  Plan New Trip
                </Button>
              </Link>
            </div>
          </div>

          {/* Trip Comparison */}
          {showComparison && pastTrips && pastTrips.length >= 2 && (
            <TripComparison
              trips={pastTrips}
              onClose={() => setShowComparison(false)}
            />
          )}

          {/* Filters */}
          {pastTrips && pastTrips.length > 0 && (
            <TripFilters
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              statusFilter={statusFilter}
              onStatusChange={setStatusFilter}
              yearFilter={yearFilter}
              onYearChange={setYearFilter}
              availableYears={availableYears}
            />
          )}

          {/* Trips List or Empty State */}
          {!pastTrips || pastTrips.length === 0 ? (
            <Card className="border-border shadow-soft animate-fade-up">
              <CardContent className="p-12 text-center">
                <div className="w-20 h-20 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-6">
                  <Compass className="w-10 h-10 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  No Trips Yet
                </h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  You haven't planned any trips yet. Start planning your first adventure and let our AI create the perfect travel plan for you!
                </p>
                <Link to="/plan-trip">
                  <Button variant="travel" size="lg" className="gap-2">
                    <Plus className="w-5 h-5" />
                    Plan Your First Trip
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : filteredTrips.length === 0 ? (
            <Card className="border-border shadow-soft animate-fade-up">
              <CardContent className="p-12 text-center">
                <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  No trips found
                </h3>
                <p className="text-muted-foreground">
                  Try adjusting your search or filters
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-8">
              {/* Upcoming Trips */}
              {upcomingTrips.length > 0 && (
                <div className="animate-fade-up">
                  <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    Upcoming Trips ({upcomingTrips.length})
                  </h2>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {upcomingTrips.map((trip, index) => (
                      <TripCard
                        key={trip.id}
                        trip={trip}
                        onDelete={deletePastTrip}
                        onDuplicate={handleDuplicate}
                        index={index}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Past Trips */}
              {pastTripsList.length > 0 && (
                <div className="animate-fade-up" style={{ animationDelay: "0.1s" }}>
                  <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-travel-forest" />
                    Past Trips ({pastTripsList.length})
                  </h2>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {pastTripsList.map((trip, index) => (
                      <TripCard
                        key={trip.id}
                        trip={trip}
                        onDelete={deletePastTrip}
                        onDuplicate={handleDuplicate}
                        index={index}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default MyTrips;
