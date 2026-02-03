import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import Navbar from "@/components/layout/Navbar";
import { useProfile } from "@/hooks/useProfile";
import { Loader2, MapPin, Calendar, Wallet, Star, Trash2, Plus, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
} from "@/components/ui/alert-dialog";

const MyTrips = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-secondary/20">
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8 animate-fade-up">
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
            <Link to="/plan-trip">
              <Button variant="travel" className="gap-2">
                <Plus className="w-4 h-4" />
                Plan New Trip
              </Button>
            </Link>
          </div>

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
          ) : (
            <div className="grid gap-4 animate-fade-up" style={{ animationDelay: "0.1s" }}>
              {pastTrips.map((trip, index) => (
                <Card 
                  key={trip.id} 
                  className="border-border shadow-soft hover:shadow-medium transition-all group"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <MapPin className="w-5 h-5 text-primary" />
                          <h3 className="text-lg font-semibold text-foreground">
                            {trip.boarding_point} → {trip.destination}
                          </h3>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-3">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {trip.duration} days
                          </span>
                          <span className="flex items-center gap-1">
                            <Wallet className="w-4 h-4" />
                            ${trip.budget.toLocaleString()}
                          </span>
                          <span>{formatDate(trip.trip_date)}</span>
                        </div>

                        {trip.rating && (
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < trip.rating!
                                    ? "text-travel-gold fill-travel-gold"
                                    : "text-muted"
                                }`}
                              />
                            ))}
                          </div>
                        )}

                        {trip.notes && (
                          <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                            {trip.notes}
                          </p>
                        )}
                      </div>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete this trip?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will permanently delete the trip to {trip.destination} from your history. This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => deletePastTrip(trip.id)}
                              className="bg-destructive hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default MyTrips;
