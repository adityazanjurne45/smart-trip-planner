import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useBookings } from "@/contexts/BookingContext";
import { toast } from "sonner";
import PlaceImageGallery from "@/components/ui/PlaceImageGallery";
import HotelFoodMenu from "./HotelFoodMenu";
import { Hotel } from "@/types/trip";
import {
  Star, MapPin, Wifi, Waves, Dumbbell, Leaf, Navigation, Check,
  CreditCard, Smartphone, Building2, CheckCircle2, Loader2, Tag,
  Users, Calendar, ShieldCheck, Coffee, Car, X,
} from "lucide-react";

type Step = "details" | "payment" | "confirmed";

interface HotelDetailModalProps {
  open: boolean;
  onClose: () => void;
  hotel: Hotel;
  destination: string;
}

const amenityIcons: Record<string, typeof Wifi> = {
  wifi: Wifi, internet: Wifi, pool: Waves, swim: Waves,
  gym: Dumbbell, fitness: Dumbbell, parking: Car, car: Car,
  breakfast: Coffee, coffee: Coffee,
};

const getAmenityIcon = (amenity: string) => {
  const lower = amenity.toLowerCase();
  for (const [key, Icon] of Object.entries(amenityIcons)) {
    if (lower.includes(key)) return Icon;
  }
  return Check;
};

const HotelDetailModal = ({ open, onClose, hotel, destination }: HotelDetailModalProps) => {
  const { addBooking } = useBookings();
  const [step, setStep] = useState<Step>("details");
  const [processing, setProcessing] = useState(false);
  const [booking, setBooking] = useState<ReturnType<typeof addBooking> | null>(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "", rooms: "1", travelers: "2", dates: "" });
  const [paymentMethod, setPaymentMethod] = useState("upi");

  const basePrice = parseFloat(hotel.pricePerNight.replace(/[^0-9.]/g, "")) || 100;
  const rooms = parseInt(form.rooms) || 1;
  const roomCost = basePrice * rooms;
  const tax = Math.round(roomCost * 0.12);

  const getDiscount = () => {
    try {
      const coupons = JSON.parse(localStorage.getItem("travello_applied_coupons") || "[]");
      if (coupons.length > 0) {
        const c = coupons[0];
        return { code: c.code, percent: c.discount || 10, amount: Math.round(roomCost * (c.discount || 10) / 100) };
      }
    } catch {}
    return null;
  };
  const discount = getDiscount();
  const total = roomCost + tax - (discount?.amount || 0);

  const handleProceed = () => {
    if (!form.name || !form.email || !form.phone) {
      toast.error("Please fill all required fields");
      return;
    }
    setStep("payment");
  };

  const handlePayment = () => {
    setProcessing(true);
    setTimeout(() => {
      const b = addBooking({
        type: "hotel", itemName: hotel.name, location: destination,
        price: roomCost, tax, discount: discount?.amount || 0, total,
        travelerName: form.name, email: form.email, phone: form.phone,
        travelers: parseInt(form.travelers) || 2, travelDates: form.dates, paymentMethod,
      });
      setBooking(b);
      setProcessing(false);
      setStep("confirmed");
      toast.success("Hotel Booking Confirmed! 🎉");
    }, 2000);
  };

  const handleClose = () => {
    setStep("details");
    setForm({ name: "", email: "", phone: "", rooms: "1", travelers: "2", dates: "" });
    setBooking(null);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[92vh] overflow-y-auto p-0 gap-0">
        {step === "details" && (
          <>
            {/* Hero image gallery */}
            <div className="relative">
              <PlaceImageGallery
                query={`${hotel.name} hotel ${destination}`}
                type="hotel"
                showGallery
                aspectRatio={21 / 9}
                showAttribution={false}
                className="rounded-b-none"
              />
              <button onClick={handleClose} className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 z-10">
                <X className="w-4 h-4" />
              </button>
              {/* Badges overlay */}
              <div className="absolute bottom-3 left-3 flex gap-2">
                {hotel.isBestLocation && (
                  <Badge className="bg-green-500 text-white gap-1"><Navigation className="w-3 h-3" />Best Location</Badge>
                )}
                {hotel.isEcoFriendly && (
                  <Badge className="bg-emerald-600 text-white gap-1"><Leaf className="w-3 h-3" />Eco-Friendly</Badge>
                )}
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Hotel info header */}
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-foreground">{hotel.name}</h2>
                  <div className="flex items-center gap-2 mt-1 text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span>{hotel.location}</span>
                    {hotel.distanceToCenter && <span>• {hotel.distanceToCenter}</span>}
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 justify-end">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <span className="text-xl font-bold">{hotel.rating}</span>
                  </div>
                  <p className="text-2xl font-bold text-primary mt-1">{hotel.pricePerNight}<span className="text-sm font-normal text-muted-foreground">/night</span></p>
                </div>
              </div>

              {/* Amenities */}
              {hotel.amenities && hotel.amenities.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-3 text-foreground">Amenities</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {hotel.amenities.map((a, i) => {
                      const Icon = getAmenityIcon(a);
                      return (
                        <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-secondary/50 text-sm">
                          <Icon className="w-4 h-4 text-primary shrink-0" />
                          <span>{a}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Nearby Attractions */}
              {hotel.nearbyAttractions && hotel.nearbyAttractions.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2 text-foreground">Nearby Attractions</h3>
                  <div className="flex flex-wrap gap-2">
                    {hotel.nearbyAttractions.map((a, i) => (
                      <Badge key={i} variant="outline" className="gap-1"><MapPin className="w-3 h-3" />{a}</Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Booking form */}
              <Card className="border-primary/20">
                <CardContent className="p-5 space-y-4">
                  <h3 className="font-semibold text-lg flex items-center gap-2"><ShieldCheck className="w-5 h-5 text-primary" />Book This Hotel</h3>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div><Label>Full Name *</Label><Input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="John Doe" /></div>
                    <div><Label>Email *</Label><Input type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} placeholder="john@example.com" /></div>
                    <div><Label>Phone *</Label><Input value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} placeholder="+91 9876543210" /></div>
                    <div><Label>Travel Dates</Label><Input value={form.dates} onChange={e => setForm(p => ({ ...p, dates: e.target.value }))} placeholder="Dec 25 - Dec 30" /></div>
                    <div><Label>Rooms</Label><Input type="number" min="1" max="10" value={form.rooms} onChange={e => setForm(p => ({ ...p, rooms: e.target.value }))} /></div>
                    <div><Label>Guests</Label><Input type="number" min="1" max="20" value={form.travelers} onChange={e => setForm(p => ({ ...p, travelers: e.target.value }))} /></div>
                  </div>

                  {/* Price breakdown */}
                  <div className="bg-secondary/40 rounded-lg p-4 space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-muted-foreground">Room cost ({rooms} × {hotel.pricePerNight})</span><span className="font-medium">${roomCost}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Taxes & Fees (12%)</span><span className="font-medium">${tax}</span></div>
                    {discount && (
                      <div className="flex justify-between text-green-600">
                        <span className="flex items-center gap-1"><Tag className="w-3 h-3" />Coupon: {discount.code} (-{discount.percent}%)</span>
                        <span>-${discount.amount}</span>
                      </div>
                    )}
                    <div className="flex justify-between border-t pt-2 font-bold text-lg">
                      <span>Total</span>
                      <span className="text-primary">${total}</span>
                    </div>
                  </div>

                  <Button className="w-full" size="lg" onClick={handleProceed}>Proceed to Book</Button>
                  <p className="text-xs text-center text-muted-foreground">This is a demo booking. No real charges.</p>
                </CardContent>
              </Card>
            </div>
          </>
        )}

        {step === "payment" && (
          <div className="p-6 space-y-5">
            <h2 className="text-xl font-bold">Select Payment Method</h2>
            <div className="space-y-3">
              {[
                { id: "upi", label: "UPI", icon: Smartphone, desc: "Google Pay, PhonePe, etc." },
                { id: "card", label: "Credit/Debit Card", icon: CreditCard, desc: "Visa, Mastercard, etc." },
                { id: "netbanking", label: "Net Banking", icon: Building2, desc: "All major banks" },
              ].map(m => (
                <Card key={m.id} className={`cursor-pointer transition-all ${paymentMethod === m.id ? "ring-2 ring-primary bg-primary/5" : "hover:bg-muted/50"}`} onClick={() => setPaymentMethod(m.id)}>
                  <CardContent className="p-4 flex items-center gap-3">
                    <m.icon className={`w-5 h-5 ${paymentMethod === m.id ? "text-primary" : "text-muted-foreground"}`} />
                    <div className="flex-1"><p className="font-medium">{m.label}</p><p className="text-xs text-muted-foreground">{m.desc}</p></div>
                    {paymentMethod === m.id && <CheckCircle2 className="w-5 h-5 text-primary" />}
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="flex justify-between items-center pt-2">
              <span className="text-lg font-bold">Total: <span className="text-primary">${total}</span></span>
              <Button onClick={handlePayment} disabled={processing} className="gap-2">
                {processing ? <><Loader2 className="w-4 h-4 animate-spin" /> Processing...</> : "Confirm Booking"}
              </Button>
            </div>
            <p className="text-xs text-center text-muted-foreground">Simulated payment — no real charges.</p>
          </div>
        )}

        {step === "confirmed" && booking && (
          <div className="p-6 space-y-5">
            <div className="text-center space-y-4 py-4">
              <div className="w-20 h-20 mx-auto rounded-full bg-green-100 flex items-center justify-center animate-scale-in">
                <CheckCircle2 className="w-10 h-10 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">Booking Confirmed! 🎉</h2>
              <Badge variant="secondary" className="text-base px-4 py-1">ID: {booking.id}</Badge>
            </div>
            <Card className="bg-secondary/30">
              <CardContent className="p-4 space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Hotel</span><span className="font-medium">{booking.itemName}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Location</span><span>{booking.location}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Guests</span><span>{booking.travelers}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Dates</span><span>{booking.travelDates || "—"}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Payment</span><span className="capitalize">{booking.paymentMethod}</span></div>
                <div className="flex justify-between border-t pt-2 font-bold"><span>Total Paid</span><span className="text-primary">${booking.total}</span></div>
              </CardContent>
            </Card>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={handleClose}>Close</Button>
              <Button className="flex-1" onClick={() => { handleClose(); window.location.href = "/my-bookings"; }}>View My Bookings</Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default HotelDetailModal;
