import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/layout/Navbar";
import { useBookings } from "@/contexts/BookingContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Ticket, MapPin, Calendar, Users, Loader2, Ban } from "lucide-react";
import { toast } from "sonner";

const MyBookings = () => {
  const { bookings, cancelBooking } = useBookings();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session?.user) navigate("/auth");
      setLoading(false);
    });
  }, [navigate]);

  if (loading) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <Loader2 className="w-10 h-10 animate-spin text-primary" />
    </div>
  );

  return (
    <div className="min-h-screen bg-secondary/20">
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-8 animate-fade-in">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Ticket className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">My Bookings</h1>
              <p className="text-muted-foreground">{bookings.length} booking{bookings.length !== 1 ? "s" : ""}</p>
            </div>
          </div>

          {bookings.length === 0 ? (
            <Card className="border-border shadow-soft">
              <CardContent className="p-12 text-center">
                <Ticket className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No bookings yet</h3>
                <p className="text-muted-foreground mb-4">Plan a trip and book hotels or transport to see them here.</p>
                <Button variant="travel" onClick={() => navigate("/plan-trip")}>Plan a Trip</Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4 animate-fade-in">
              {bookings.map(b => (
                <Card key={b.id} className={`border-border shadow-soft transition-all ${b.status === "cancelled" ? "opacity-60" : "hover:shadow-medium"}`}>
                  <CardContent className="p-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold text-lg text-foreground">{b.itemName}</h3>
                          <Badge variant={b.status === "confirmed" ? "default" : "destructive"} className="capitalize">
                            {b.status}
                          </Badge>
                          <Badge variant="secondary" className="capitalize">{b.type}</Badge>
                        </div>
                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{b.location}</span>
                          <span className="flex items-center gap-1"><Users className="w-3 h-3" />{b.travelers} traveler{b.travelers > 1 ? "s" : ""}</span>
                          {b.travelDates && <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{b.travelDates}</span>}
                        </div>
                        <p className="text-xs text-muted-foreground">Booking ID: {b.id} • Booked {new Date(b.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p className="text-2xl font-bold text-primary">${b.total}</p>
                          {b.discount > 0 && <p className="text-xs text-green-600">Saved ${b.discount}</p>}
                        </div>
                        {b.status === "confirmed" && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-destructive"
                            onClick={() => { cancelBooking(b.id); toast("Booking cancelled"); }}
                          >
                            <Ban className="w-3 h-3 mr-1" /> Cancel
                          </Button>
                        )}
                      </div>
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

export default MyBookings;
