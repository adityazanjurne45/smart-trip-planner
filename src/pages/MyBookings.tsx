import { useState, useEffect } from "react";
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
import {
  Ticket, MapPin, Calendar, Users, Loader2, Ban, Eye, CheckCircle2, CreditCard,
} from "lucide-react";
import { toast } from "sonner";
import PlaceImageGallery from "@/components/ui/PlaceImageGallery";

const MyBookings = () => {
  const { bookings, cancelBooking } = useBookings();
  const [loading, setLoading] = useState(true);
  const [viewBooking, setViewBooking] = useState<Booking | null>(null);
  const [cancelId, setCancelId] = useState<string | null>(null);
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
            <div className="grid sm:grid-cols-2 gap-4 animate-fade-in">
              {bookings.map(b => (
                <Card
                  key={b.id}
                  className={`group overflow-hidden border-border shadow-soft transition-all duration-300 ${
                    b.status === "cancelled"
                      ? "opacity-60"
                      : "hover:-translate-y-1 hover:shadow-[0_20px_40px_-12px_hsl(var(--primary)/0.25)]"
                  }`}
                >
                  <div className="relative overflow-hidden">
                    <div className="transition-transform duration-500 group-hover:scale-110">
                      <PlaceImageGallery
                        query={`${b.itemName} ${b.location}`}
                        type={b.type === "hotel" ? "hotel" : "transport"}
                        aspectRatio={16 / 9}
                        showAttribution={false}
                      />
                    </div>
                    <div className="absolute top-2 left-2 flex gap-1">
                      <Badge variant={b.status === "confirmed" ? "default" : "destructive"} className="capitalize gap-1 shadow-md">
                        {b.status === "confirmed" && <CheckCircle2 className="w-3 h-3" />}
                        {b.status}
                      </Badge>
                      <Badge variant="secondary" className="capitalize shadow-md">{b.type}</Badge>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                      <h3 className="font-semibold text-white line-clamp-1">{b.itemName}</h3>
                      <p className="text-white/80 text-xs flex items-center gap-1"><MapPin className="w-3 h-3" />{b.location}</p>
                    </div>
                  </div>

                  <CardContent className="p-4 space-y-3">
                    <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Users className="w-3 h-3" />{b.travelers} guest{b.travelers > 1 ? "s" : ""}</span>
                      {b.travelDates && <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{b.travelDates}</span>}
                    </div>
                    <p className="text-[11px] text-muted-foreground font-mono">{b.id}</p>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-2xl font-bold text-primary leading-none">${b.total}</p>
                        {b.discount > 0 && <p className="text-[10px] text-green-600 mt-0.5">Saved ${b.discount}</p>}
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => setViewBooking(b)}>
                          <Eye className="w-3 h-3 mr-1" /> View
                        </Button>
                        {b.status === "confirmed" && (
                          <Button variant="outline" size="sm" className="text-destructive" onClick={() => setCancelId(b.id)}>
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

      {/* View Details Dialog */}
      <Dialog open={!!viewBooking} onOpenChange={(o) => !o && setViewBooking(null)}>
        <DialogContent className="max-w-lg p-0 overflow-hidden">
          {viewBooking && (
            <>
              <PlaceImageGallery
                query={`${viewBooking.itemName} ${viewBooking.location}`}
                type={viewBooking.type === "hotel" ? "hotel" : "transport"}
                aspectRatio={16 / 9}
                showAttribution={false}
                className="rounded-b-none"
              />
              <div className="p-6 space-y-4">
                <DialogHeader>
                  <DialogTitle>{viewBooking.itemName}</DialogTitle>
                  <DialogDescription className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />{viewBooking.location}
                  </DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div><p className="text-muted-foreground text-xs">Booking ID</p><p className="font-mono font-medium">{viewBooking.id}</p></div>
                  <div><p className="text-muted-foreground text-xs">Status</p><Badge variant={viewBooking.status === "confirmed" ? "default" : "destructive"} className="capitalize">{viewBooking.status}</Badge></div>
                  <div><p className="text-muted-foreground text-xs">Traveler</p><p className="font-medium">{viewBooking.travelerName}</p></div>
                  <div><p className="text-muted-foreground text-xs">Guests</p><p className="font-medium">{viewBooking.travelers}</p></div>
                  <div><p className="text-muted-foreground text-xs">Email</p><p className="font-medium truncate">{viewBooking.email}</p></div>
                  <div><p className="text-muted-foreground text-xs">Phone</p><p className="font-medium">{viewBooking.phone}</p></div>
                  <div className="col-span-2"><p className="text-muted-foreground text-xs">Dates</p><p className="font-medium">{viewBooking.travelDates || "—"}</p></div>
                </div>
                <div className="bg-secondary/40 rounded-lg p-3 space-y-1 text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">Price</span><span>${viewBooking.price}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Tax</span><span>${viewBooking.tax}</span></div>
                  {viewBooking.discount > 0 && (
                    <div className="flex justify-between text-green-600"><span>Discount</span><span>-${viewBooking.discount}</span></div>
                  )}
                  <div className="flex justify-between border-t pt-1 font-bold"><span>Total Paid</span><span className="text-primary">${viewBooking.total}</span></div>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <CreditCard className="w-3 h-3" />
                  Paid via <span className="capitalize font-medium text-foreground">{viewBooking.paymentMethod}</span>
                </div>
              </div>
            </>
          )}
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
