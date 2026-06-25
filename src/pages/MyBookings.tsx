import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/layout/Navbar";
import { useBookings, type Booking } from "@/contexts/BookingContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Ticket, MapPin, Calendar, Users, Loader2, Ban, Eye, CheckCircle2, CreditCard,
  Wifi, Waves, UtensilsCrossed, Car, Dumbbell, Plane, Phone, Mail, Star,
  BedDouble, Clock, ShieldCheck, Mountain, Building2,
} from "lucide-react";
import { toast } from "sonner";
import PlaceImageGallery from "@/components/ui/PlaceImageGallery";

type Bucket = "upcoming" | "current" | "completed" | "cancelled";

const parseRange = (s?: string): { start?: Date; end?: Date } => {
  if (!s) return {};
  const parts = s.split(/\s*(?:to|-|–|—|→)\s*/i);
  const d1 = parts[0] ? new Date(parts[0]) : null;
  const d2 = parts[1] ? new Date(parts[1]) : null;
  return {
    start: d1 && !isNaN(d1.getTime()) ? d1 : undefined,
    end: d2 && !isNaN(d2.getTime()) ? d2 : undefined,
  };
};

const bucketOf = (b: Booking): Bucket => {
  if (b.status === "cancelled") return "cancelled";
  const { start, end } = parseRange(b.travelDates);
  const now = new Date(); now.setHours(0, 0, 0, 0);
  if (start && end) {
    if (now < start) return "upcoming";
    if (now > end) return "completed";
    return "current";
  }
  // No parseable dates: confirmed booking sits in upcoming by default
  return "upcoming";
};

const nightsOf = (b: Booking): number => {
  const { start, end } = parseRange(b.travelDates);
  if (!start || !end) return 1;
  return Math.max(1, Math.round((end.getTime() - start.getTime()) / 86400000));
};

const fmt = (d?: Date) => d ? d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" }) : "—";

const destIcon = (loc: string) => {
  const l = loc.toLowerCase();
  if (/(beach|bali|goa|phuket|maldives|miami|cancun)/.test(l)) return Waves;
  if (/(manali|shimla|kasol|alps|swiss|mountain|ladakh|interlaken|himalaya)/.test(l)) return Mountain;
  return Building2;
};

const AMENITIES = [
  { icon: Wifi, label: "Free WiFi" },
  { icon: Waves, label: "Swimming Pool" },
  { icon: UtensilsCrossed, label: "Restaurant" },
  { icon: Car, label: "Free Parking" },
  { icon: Dumbbell, label: "Fitness Center" },
  { icon: Plane, label: "Airport Pickup" },
];

const ROOM_TYPES = ["Deluxe King Room", "Executive Suite", "Premium Twin", "Family Suite", "Garden View Room"];

const MyBookings = () => {
  const { bookings, cancelBooking } = useBookings();
  const [loading, setLoading] = useState(true);
  const [viewBooking, setViewBooking] = useState<Booking | null>(null);
  const [cancelId, setCancelId] = useState<string | null>(null);
  const [tab, setTab] = useState<Bucket | "all">("all");
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session?.user) navigate("/auth");
      setLoading(false);
    });
  }, [navigate]);

  const grouped = useMemo(() => {
    const g: Record<Bucket, Booking[]> = { upcoming: [], current: [], completed: [], cancelled: [] };
    bookings.forEach(b => g[bucketOf(b)].push(b));
    return g;
  }, [bookings]);

  const visible = tab === "all" ? bookings : grouped[tab];

  if (loading) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <Loader2 className="w-10 h-10 animate-spin text-primary" />
    </div>
  );

  const statusBadge = (b: Booking) => {
    const bk = bucketOf(b);
    const map: Record<Bucket, { label: string; cls: string }> = {
      upcoming: { label: "Upcoming", cls: "bg-blue-500 text-white" },
      current: { label: "Ongoing", cls: "bg-green-500 text-white" },
      completed: { label: "Completed", cls: "bg-slate-500 text-white" },
      cancelled: { label: "Cancelled", cls: "bg-destructive text-destructive-foreground" },
    };
    return <Badge className={`${map[bk].cls} shadow-md`}>{map[bk].label}</Badge>;
  };

  const renderCards = (list: Booking[]) => {
    if (list.length === 0) {
      return (
        <Card className="border-dashed border-2 bg-secondary/10">
          <CardContent className="p-10 text-center">
            <Ticket className="w-12 h-12 mx-auto text-muted-foreground/40 mb-3" />
            <p className="text-muted-foreground">No bookings in this section yet.</p>
          </CardContent>
        </Card>
      );
    }
    return (
      <div className="grid sm:grid-cols-2 gap-5 animate-fade-in">
        {list.map(b => {
          const { start, end } = parseRange(b.travelDates);
          const nights = nightsOf(b);
          const DestIcon = destIcon(b.location);
          const room = ROOM_TYPES[Math.abs(b.id.charCodeAt(b.id.length - 1)) % ROOM_TYPES.length];
          const cancelled = b.status === "cancelled";
          return (
            <Card
              key={b.id}
              className={`group overflow-hidden border-border rounded-2xl backdrop-blur-sm bg-card/80 transition-all duration-500 ${
                cancelled ? "opacity-60" : "hover:-translate-y-1.5 hover:shadow-[0_25px_50px_-12px_hsl(var(--primary)/0.3)] shadow-soft"
              }`}
            >
              <div className="relative overflow-hidden h-52">
                <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-110">
                  <PlaceImageGallery
                    query={`${b.itemName} ${b.location}`}
                    type={b.type === "hotel" ? "hotel" : "transport"}
                    aspectRatio={16 / 9}
                    showAttribution={false}
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
                <div className="absolute top-3 left-3 flex gap-1.5">
                  {statusBadge(b)}
                  <Badge variant="secondary" className="capitalize shadow-md gap-1 backdrop-blur-md">
                    <DestIcon className="w-3 h-3" />{b.type}
                  </Badge>
                </div>
                <div className="absolute top-3 right-3 bg-white/95 backdrop-blur rounded-lg px-2 py-1 text-xs font-bold text-foreground shadow-md flex items-center gap-1">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />4.{(b.id.length % 9) + 1}
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <h3 className="font-bold text-lg leading-tight line-clamp-1 drop-shadow">{b.itemName}</h3>
                  <p className="text-white/90 text-xs flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3" />{b.location}
                  </p>
                </div>
              </div>

              <CardContent className="p-4 space-y-3">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-secondary/40 rounded-lg p-2">
                    <p className="text-muted-foreground text-[10px] uppercase tracking-wide">Check-in</p>
                    <p className="font-semibold">{fmt(start)}</p>
                  </div>
                  <div className="bg-secondary/40 rounded-lg p-2">
                    <p className="text-muted-foreground text-[10px] uppercase tracking-wide">Check-out</p>
                    <p className="font-semibold">{fmt(end)}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><BedDouble className="w-3 h-3" />{room}</span>
                  <span className="flex items-center gap-1"><Users className="w-3 h-3" />{b.travelers} guest{b.travelers > 1 ? "s" : ""}</span>
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{nights} night{nights > 1 ? "s" : ""}</span>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <div>
                    <p className="text-[10px] text-muted-foreground font-mono">{b.id}</p>
                    <p className="text-2xl font-bold text-primary leading-none mt-0.5">${b.total}</p>
                    {b.discount > 0 && <p className="text-[10px] text-green-600">You saved ${b.discount}</p>}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="travel" size="sm" onClick={() => setViewBooking(b)}>
                      <Eye className="w-3 h-3 mr-1" /> View Details
                    </Button>
                    {b.status === "confirmed" && bucketOf(b) !== "completed" && (
                      <Button variant="outline" size="sm" className="text-destructive" onClick={() => setCancelId(b.id)}>
                        <Ban className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary/30 via-background to-primary/5">
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8 animate-fade-in">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg">
                <Ticket className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">My Bookings</h1>
                <p className="text-muted-foreground">{bookings.length} total booking{bookings.length !== 1 ? "s" : ""}</p>
              </div>
            </div>
          </div>

          {bookings.length === 0 ? (
            <Card className="border-border shadow-soft rounded-3xl overflow-hidden">
              <CardContent className="p-16 text-center">
                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                  <Ticket className="w-12 h-12 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-2">No bookings yet</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  Plan a trip and book amazing hotels to see them appear here with full details and stunning visuals.
                </p>
                <Button variant="travel" size="lg" onClick={() => navigate("/plan-trip")}>
                  <Plane className="w-4 h-4 mr-2" /> Plan a Trip
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Tabs value={tab} onValueChange={(v) => setTab(v as any)} className="space-y-6">
              <TabsList className="bg-card/80 backdrop-blur p-1 shadow-soft">
                <TabsTrigger value="all">All ({bookings.length})</TabsTrigger>
                <TabsTrigger value="upcoming">Upcoming ({grouped.upcoming.length})</TabsTrigger>
                <TabsTrigger value="current">Ongoing ({grouped.current.length})</TabsTrigger>
                <TabsTrigger value="completed">Completed ({grouped.completed.length})</TabsTrigger>
                <TabsTrigger value="cancelled">Cancelled ({grouped.cancelled.length})</TabsTrigger>
              </TabsList>
              <TabsContent value={tab}>{renderCards(visible)}</TabsContent>
            </Tabs>
          )}
        </div>
      </main>

      {/* Premium View Details Modal */}
      <Dialog open={!!viewBooking} onOpenChange={(o) => !o && setViewBooking(null)}>
        <DialogContent className="max-w-3xl p-0 overflow-hidden max-h-[90vh] overflow-y-auto">
          {viewBooking && (() => {
            const { start, end } = parseRange(viewBooking.travelDates);
            const nights = nightsOf(viewBooking);
            const room = ROOM_TYPES[Math.abs(viewBooking.id.charCodeAt(viewBooking.id.length - 1)) % ROOM_TYPES.length];
            const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(viewBooking.itemName + " " + viewBooking.location)}`;
            return (
              <>
                <div className="relative h-64">
                  <PlaceImageGallery
                    query={`${viewBooking.itemName} ${viewBooking.location}`}
                    type={viewBooking.type === "hotel" ? "hotel" : "transport"}
                    aspectRatio={16 / 9}
                    showAttribution={false}
                    className="rounded-none h-full"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <div className="flex items-center gap-2 mb-2">
                      {statusBadge(viewBooking)}
                      <Badge className="bg-amber-500 text-white"><Star className="w-3 h-3 mr-0.5 fill-current" />Premium</Badge>
                    </div>
                    <h2 className="text-2xl font-bold drop-shadow">{viewBooking.itemName}</h2>
                    <p className="text-white/90 text-sm flex items-center gap-1"><MapPin className="w-3 h-3" />{viewBooking.location}</p>
                  </div>
                </div>

                <div className="p-6 space-y-5">
                  <DialogHeader className="sr-only">
                    <DialogTitle>{viewBooking.itemName}</DialogTitle>
                    <DialogDescription>Booking details</DialogDescription>
                  </DialogHeader>

                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Experience refined hospitality at {viewBooking.itemName}, a curated stay in the heart of {viewBooking.location}. Enjoy spacious rooms, modern amenities, and an unforgettable local experience designed around your travel style.
                  </p>

                  {/* Quick Actions */}
                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <a href={mapsUrl} target="_blank" rel="noopener noreferrer"><MapPin className="w-3 h-3 mr-1" />View on Maps</a>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <a href="tel:+911800123456"><Phone className="w-3 h-3 mr-1" />+91 1800 123 456</a>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <a href={`mailto:reservations@${viewBooking.itemName.toLowerCase().replace(/\s+/g, "")}.com`}><Mail className="w-3 h-3 mr-1" />Email Hotel</a>
                    </Button>
                  </div>

                  {/* Stay Info */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="bg-secondary/40 rounded-xl p-3">
                      <p className="text-[10px] uppercase text-muted-foreground tracking-wide flex items-center gap-1"><Clock className="w-3 h-3" />Check-in</p>
                      <p className="font-semibold text-sm">{fmt(start)}</p>
                      <p className="text-[10px] text-muted-foreground">After 2:00 PM</p>
                    </div>
                    <div className="bg-secondary/40 rounded-xl p-3">
                      <p className="text-[10px] uppercase text-muted-foreground tracking-wide flex items-center gap-1"><Clock className="w-3 h-3" />Check-out</p>
                      <p className="font-semibold text-sm">{fmt(end)}</p>
                      <p className="text-[10px] text-muted-foreground">Before 11:00 AM</p>
                    </div>
                    <div className="bg-secondary/40 rounded-xl p-3">
                      <p className="text-[10px] uppercase text-muted-foreground tracking-wide flex items-center gap-1"><BedDouble className="w-3 h-3" />Room</p>
                      <p className="font-semibold text-sm">{room}</p>
                      <p className="text-[10px] text-muted-foreground">{nights} night{nights > 1 ? "s" : ""}</p>
                    </div>
                    <div className="bg-secondary/40 rounded-xl p-3">
                      <p className="text-[10px] uppercase text-muted-foreground tracking-wide flex items-center gap-1"><Users className="w-3 h-3" />Guests</p>
                      <p className="font-semibold text-sm">{viewBooking.travelers} guest{viewBooking.travelers > 1 ? "s" : ""}</p>
                    </div>
                  </div>

                  {/* Amenities */}
                  <div>
                    <h4 className="font-semibold text-sm mb-2">Amenities</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {AMENITIES.map((a) => (
                        <div key={a.label} className="flex items-center gap-2 text-sm bg-secondary/30 rounded-lg p-2">
                          <a.icon className="w-4 h-4 text-primary" />{a.label}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Guest Details */}
                  <div>
                    <h4 className="font-semibold text-sm mb-2">Guest Details</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm bg-secondary/30 rounded-xl p-3">
                      <div><p className="text-xs text-muted-foreground">Name</p><p className="font-medium">{viewBooking.travelerName}</p></div>
                      <div><p className="text-xs text-muted-foreground">Phone</p><p className="font-medium">{viewBooking.phone}</p></div>
                      <div className="col-span-2"><p className="text-xs text-muted-foreground">Email</p><p className="font-medium truncate">{viewBooking.email}</p></div>
                    </div>
                  </div>

                  {/* Booking Summary */}
                  <div className="bg-gradient-to-br from-primary/5 to-secondary/40 rounded-xl p-4 space-y-1.5 text-sm border border-primary/10">
                    <h4 className="font-semibold mb-2">Booking Summary</h4>
                    <div className="flex justify-between"><span className="text-muted-foreground">Room rate × {nights}</span><span>${viewBooking.price}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Taxes & fees</span><span>${viewBooking.tax}</span></div>
                    {viewBooking.discount > 0 && (
                      <div className="flex justify-between text-green-600"><span>Discount applied</span><span>-${viewBooking.discount}</span></div>
                    )}
                    <div className="flex justify-between border-t border-border pt-2 mt-2 font-bold text-base">
                      <span>Total Paid</span><span className="text-primary">${viewBooking.total}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground pt-1">
                      <CreditCard className="w-3 h-3" />
                      Paid via <span className="capitalize font-medium text-foreground">{viewBooking.paymentMethod}</span>
                      <Badge variant="secondary" className="ml-auto gap-1"><CheckCircle2 className="w-3 h-3 text-green-600" />Payment Successful</Badge>
                    </div>
                  </div>

                  {/* Cancellation policy */}
                  <div className="flex items-start gap-2 text-xs text-muted-foreground bg-secondary/20 rounded-lg p-3">
                    <ShieldCheck className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-foreground">Cancellation Policy</p>
                      Free cancellation until 48 hours before check-in. After that, the first night will be charged.
                      Booking ID <span className="font-mono">{viewBooking.id}</span> — Confirmed on {new Date(viewBooking.createdAt).toLocaleDateString()}.
                    </div>
                  </div>
                </div>
              </>
            );
          })()}
        </DialogContent>
      </Dialog>

      {/* Cancel confirmation */}
      <AlertDialog open={!!cancelId} onOpenChange={(o) => !o && setCancelId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel this booking?</AlertDialogTitle>
            <AlertDialogDescription>
              This will mark the booking as cancelled. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep booking</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (cancelId) {
                  cancelBooking(cancelId);
                  toast.success("Booking cancelled");
                }
                setCancelId(null);
              }}
            >
              Yes, cancel
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default MyBookings;
