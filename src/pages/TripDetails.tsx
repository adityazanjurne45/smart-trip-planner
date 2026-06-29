import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/layout/Navbar";
import PlaceImageGallery from "@/components/ui/PlaceImageGallery";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft, Calendar, Clock, Wallet, MapPin, Navigation,
  Hotel, Plane, Share2, Trash2, Copy, Loader2, Star, Sparkles
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface PastTrip {
  id: string;
  user_id: string;
  destination: string;
  boarding_point: string;
  duration: number;
  budget: number;
  trip_date: string;
  title?: string | null;
  status?: string | null;
  rating?: number | null;
  notes?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  created_at: string;
}

const fmtDate = (d?: string | null) =>
  d ? new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : "-";

const TripDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [trip, setTrip] = useState<PastTrip | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      const { data, error } = await supabase
        .from("past_trips")
        .select("*")
        .eq("id", id)
        .maybeSingle();
      if (error || !data) {
        setNotFound(true);
      } else {
        setTrip(data as PastTrip);
        setNotes((data as PastTrip).notes || "");
      }
      setLoading(false);
    };
    load();
  }, [id]);

  const saveNotes = async () => {
    if (!trip) return;
    const { error } = await supabase.from("past_trips").update({ notes }).eq("id", trip.id);
    if (error) toast({ title: "Couldn't save notes", variant: "destructive" });
    else toast({ title: "Notes saved" });
  };

  const deleteTrip = async () => {
    if (!trip || !confirm("Delete this trip permanently?")) return;
    await supabase.from("past_trips").delete().eq("id", trip.id);
    toast({ title: "Trip deleted" });
    navigate("/my-trips");
  };

  const shareTrip = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) await navigator.share({ title: `Trip to ${trip?.destination}`, url });
      else { await navigator.clipboard.writeText(url); toast({ title: "Link copied" }); }
    } catch {}
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  if (notFound || !trip) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 pt-32 pb-20 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
              <MapPin className="w-10 h-10 text-muted-foreground" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Trip Not Found</h1>
            <p className="text-muted-foreground mb-6">
              This trip may have been deleted or the link is invalid.
            </p>
            <Link to="/my-trips">
              <Button variant="travel" className="gap-2"><ArrowLeft className="w-4 h-4" />Back to My Trips</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Status
  const tripStart = new Date(trip.start_date || trip.trip_date);
  const tripEnd = new Date(trip.end_date || tripStart);
  if (!trip.end_date) tripEnd.setDate(tripEnd.getDate() + trip.duration);
  const now = new Date(); now.setHours(0, 0, 0, 0);
  const status = now < tripStart ? "Upcoming" : now > tripEnd ? "Completed" : "Ongoing";
  const daysLeft = Math.ceil((tripStart.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  const statusColor = {
    Upcoming: "bg-primary/10 text-primary border-primary/20",
    Ongoing: "bg-travel-coral/10 text-travel-coral border-travel-coral/20",
    Completed: "bg-travel-forest/10 text-travel-forest border-travel-forest/20",
  }[status];

  const mapsUrl = `https://www.google.com/maps/dir/${encodeURIComponent(trip.boarding_point)}/${encodeURIComponent(trip.destination)}`;

  return (
    <div className="min-h-screen bg-secondary/20">
      <Navbar />
      <main className="pt-20 pb-12 animate-fade-in">
        {/* Hero */}
        <div className="relative h-[380px] md:h-[460px] overflow-hidden">
          <PlaceImageGallery query={trip.destination} type="destination" aspectRatio={16/7} className="absolute inset-0 w-full h-full" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          <div className="container mx-auto px-4 absolute inset-0 flex flex-col justify-between py-6">
            <Button variant="secondary" size="sm" onClick={() => navigate("/my-trips")} className="self-start gap-2 bg-white/90 backdrop-blur hover:bg-white">
              <ArrowLeft className="w-4 h-4" />Back
            </Button>
            <div className="text-white max-w-3xl">
              <Badge className={cn("border mb-3", statusColor)}>{status}</Badge>
              <h1 className="text-4xl md:text-6xl font-bold mb-3 drop-shadow-lg">{trip.destination}</h1>
              <p className="flex items-center gap-2 text-white/90 text-lg">
                <MapPin className="w-5 h-5" />From {trip.boarding_point}
              </p>
              <div className="flex flex-wrap gap-3 mt-4">
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 backdrop-blur border border-white/20">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm font-medium">{fmtDate(trip.start_date || trip.trip_date)} - {fmtDate(trip.end_date) !== "-" ? fmtDate(trip.end_date) : `+${trip.duration} days`}</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 backdrop-blur border border-white/20">
                  <Clock className="w-4 h-4" /><span className="text-sm font-medium">{trip.duration} days</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 backdrop-blur border border-white/20">
                  <Wallet className="w-4 h-4" /><span className="text-sm font-medium">${trip.budget.toLocaleString()}</span>
                </div>
                {status === "Upcoming" && daysLeft > 0 && (
                  <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-travel-gold text-foreground">
                    <Sparkles className="w-4 h-4" />
                    <span className="text-sm font-bold">{daysLeft} day{daysLeft !== 1 ? "s" : ""} to go!</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 -mt-8 relative z-10">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main */}
            <div className="lg:col-span-2 space-y-6">
              {/* Overview */}
              <Card className="shadow-medium">
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><MapPin className="w-5 h-5 text-primary" />Trip Overview</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { label: "From", value: trip.boarding_point },
                      { label: "To", value: trip.destination },
                      { label: "Start", value: fmtDate(trip.start_date || trip.trip_date) },
                      { label: "End", value: fmtDate(trip.end_date) !== "-" ? fmtDate(trip.end_date) : `+${trip.duration} days` },
                      { label: "Duration", value: `${trip.duration} days` },
                      { label: "Budget", value: `$${trip.budget.toLocaleString()}` },
                      { label: "Status", value: status },
                      { label: "Trip ID", value: trip.id.slice(0, 8).toUpperCase() },
                    ].map((f, i) => (
                      <div key={i} className="p-3 rounded-lg bg-muted/40">
                        <div className="text-xs text-muted-foreground mb-1">{f.label}</div>
                        <div className="text-sm font-semibold truncate">{f.value}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Route */}
              <Card className="shadow-medium overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold flex items-center gap-2"><Navigation className="w-5 h-5 text-primary" />Route</h2>
                    <a href={mapsUrl} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" size="sm" className="gap-2"><Navigation className="w-4 h-4" />Open in Google Maps</Button>
                    </a>
                  </div>
                  <div className="aspect-video rounded-xl overflow-hidden border">
                    <iframe
                      title="route"
                      width="100%" height="100%"
                      loading="lazy"
                      src={`https://maps.google.com/maps?q=${encodeURIComponent(trip.destination)}&output=embed`}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Notes */}
              <Card className="shadow-medium">
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold mb-4">Trip Notes</h2>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    onBlur={saveNotes}
                    placeholder="Add notes, packing reminders, things to remember..."
                    className="w-full min-h-[140px] p-4 rounded-lg border bg-background resize-y focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <p className="text-xs text-muted-foreground mt-2">Auto-saves when you click outside.</p>
                </CardContent>
              </Card>

              {/* Completed extras */}
              {status === "Completed" && (
                <Card className="shadow-medium bg-gradient-to-br from-travel-forest/10 to-primary/5">
                  <CardContent className="p-6">
                    <h2 className="text-xl font-bold mb-2 flex items-center gap-2"><Star className="w-5 h-5 text-travel-gold" />Trip Completed</h2>
                    <p className="text-muted-foreground mb-4">Hope you had an amazing time in {trip.destination}!</p>
                    {trip.rating && (
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={cn("w-5 h-5", i < (trip.rating || 0) ? "fill-travel-gold text-travel-gold" : "text-muted")} />
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card className="shadow-medium">
                <CardContent className="p-6 space-y-3">
                  <h3 className="font-bold mb-2">Quick Actions</h3>
                  <Link to="/plan-trip"><Button variant="travel" className="w-full gap-2"><Copy className="w-4 h-4" />Plan Similar Trip</Button></Link>
                  <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="block"><Button variant="outline" className="w-full gap-2"><Navigation className="w-4 h-4" />Directions</Button></a>
                  <Button variant="outline" className="w-full gap-2" onClick={shareTrip}><Share2 className="w-4 h-4" />Share Trip</Button>
                  <Link to="/my-bookings"><Button variant="outline" className="w-full gap-2"><Hotel className="w-4 h-4" />View Bookings</Button></Link>
                  <Button variant="outline" className="w-full gap-2 text-destructive hover:text-destructive" onClick={deleteTrip}><Trash2 className="w-4 h-4" />Delete Trip</Button>
                </CardContent>
              </Card>

              <Card className="shadow-medium">
                <CardContent className="p-6">
                  <h3 className="font-bold mb-3 flex items-center gap-2"><Wallet className="w-4 h-4 text-primary" />Budget Snapshot</h3>
                  <div className="space-y-2 text-sm">
                    {[
                      ["Hotel (40%)", trip.budget * 0.4],
                      ["Transport (25%)", trip.budget * 0.25],
                      ["Food (20%)", trip.budget * 0.2],
                      ["Activities (10%)", trip.budget * 0.1],
                      ["Misc (5%)", trip.budget * 0.05],
                    ].map(([l, v]) => (
                      <div key={l as string} className="flex justify-between">
                        <span className="text-muted-foreground">{l}</span>
                        <span className="font-medium">${(v as number).toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                      </div>
                    ))}
                    <div className="flex justify-between pt-2 border-t font-bold">
                      <span>Total</span><span>${trip.budget.toLocaleString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-medium">
                <CardContent className="p-6">
                  <h3 className="font-bold mb-3">Trip Info</h3>
                  <div className="text-sm space-y-2 text-muted-foreground">
                    <div>Created {fmtDate(trip.created_at)}</div>
                    {trip.title && <div>Title: <span className="text-foreground">{trip.title}</span></div>}
                    <div>Status: <span className="text-foreground capitalize">{trip.status || status.toLowerCase()}</span></div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TripDetails;
