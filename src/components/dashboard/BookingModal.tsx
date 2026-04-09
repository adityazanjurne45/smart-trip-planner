import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useBookings } from "@/contexts/BookingContext";
import { toast } from "sonner";
import { CreditCard, Smartphone, Building2, CheckCircle2, Loader2, Tag } from "lucide-react";

interface BookingModalProps {
  open: boolean;
  onClose: () => void;
  item: {
    name: string;
    type: "hotel" | "transport";
    location: string;
    price: string;
  };
  destination: string;
}

type Step = "details" | "payment" | "confirmed";

const BookingModal = ({ open, onClose, item, destination }: BookingModalProps) => {
  const { addBooking } = useBookings();
  const [step, setStep] = useState<Step>("details");
  const [processing, setProcessing] = useState(false);
  const [booking, setBooking] = useState<ReturnType<typeof addBooking> | null>(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    travelers: "1",
    dates: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("upi");

  // Parse price
  const basePrice = parseFloat(item.price.replace(/[^0-9.]/g, "")) || 100;
  const tax = Math.round(basePrice * 0.12);

  // Check for applied coupons
  const getDiscount = () => {
    try {
      const coupons = JSON.parse(localStorage.getItem("travello_applied_coupons") || "[]");
      if (coupons.length > 0) {
        const coupon = coupons[0];
        return { code: coupon.code, percent: coupon.discount || 10, amount: Math.round(basePrice * (coupon.discount || 10) / 100) };
      }
    } catch {}
    return null;
  };
  const discount = getDiscount();
  const total = basePrice + tax - (discount?.amount || 0);

  const handleSubmit = () => {
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
        type: item.type,
        itemName: item.name,
        location: destination,
        price: basePrice,
        tax,
        discount: discount?.amount || 0,
        total,
        travelerName: form.name,
        email: form.email,
        phone: form.phone,
        travelers: parseInt(form.travelers) || 1,
        travelDates: form.dates,
        paymentMethod,
      });
      setBooking(b);
      setProcessing(false);
      setStep("confirmed");
      toast.success("Booking Confirmed! 🎉");
    }, 2000);
  };

  const handleClose = () => {
    setStep("details");
    setForm({ name: "", email: "", phone: "", travelers: "1", dates: "" });
    setPaymentMethod("upi");
    setBooking(null);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        {step === "details" && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-primary" />
                Book {item.name}
              </DialogTitle>
            </DialogHeader>

            {/* Price Breakdown */}
            <Card className="bg-secondary/30">
              <CardContent className="p-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Base Price</span>
                  <span className="font-medium">${basePrice}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Taxes & Fees (12%)</span>
                  <span className="font-medium">${tax}</span>
                </div>
                {discount && (
                  <div className="flex justify-between text-green-600">
                    <span className="flex items-center gap-1">
                      <Tag className="w-3 h-3" />
                      Coupon: {discount.code} (-{discount.percent}%)
                    </span>
                    <span>-${discount.amount}</span>
                  </div>
                )}
                <div className="flex justify-between border-t pt-2 font-bold text-base">
                  <span>Total</span>
                  <span className="text-primary">${total}</span>
                </div>
              </CardContent>
            </Card>

            {/* Form */}
            <div className="space-y-3">
              <div>
                <Label>Full Name *</Label>
                <Input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="John Doe" />
              </div>
              <div>
                <Label>Email *</Label>
                <Input type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} placeholder="john@example.com" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Phone *</Label>
                  <Input value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} placeholder="+91 9876543210" />
                </div>
                <div>
                  <Label>Travelers</Label>
                  <Input type="number" min="1" max="20" value={form.travelers} onChange={e => setForm(p => ({ ...p, travelers: e.target.value }))} />
                </div>
              </div>
              <div>
                <Label>Travel Dates</Label>
                <Input type="text" value={form.dates} onChange={e => setForm(p => ({ ...p, dates: e.target.value }))} placeholder="e.g. Dec 25 - Dec 30" />
              </div>
            </div>

            <Button className="w-full" onClick={handleSubmit}>Proceed to Payment</Button>
          </>
        )}

        {step === "payment" && (
          <>
            <DialogHeader>
              <DialogTitle>Select Payment Method</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              {[
                { id: "upi", label: "UPI", icon: Smartphone, desc: "Google Pay, PhonePe, etc." },
                { id: "card", label: "Credit/Debit Card", icon: CreditCard, desc: "Visa, Mastercard, etc." },
                { id: "netbanking", label: "Net Banking", icon: Building2, desc: "All major banks" },
              ].map(m => (
                <Card
                  key={m.id}
                  className={`cursor-pointer transition-all ${paymentMethod === m.id ? "ring-2 ring-primary bg-primary/5" : "hover:bg-muted/50"}`}
                  onClick={() => setPaymentMethod(m.id)}
                >
                  <CardContent className="p-4 flex items-center gap-3">
                    <m.icon className={`w-5 h-5 ${paymentMethod === m.id ? "text-primary" : "text-muted-foreground"}`} />
                    <div className="flex-1">
                      <p className="font-medium">{m.label}</p>
                      <p className="text-xs text-muted-foreground">{m.desc}</p>
                    </div>
                    {paymentMethod === m.id && <CheckCircle2 className="w-5 h-5 text-primary" />}
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="flex justify-between items-center pt-2">
              <span className="text-lg font-bold">Total: <span className="text-primary">${total}</span></span>
              <Button onClick={handlePayment} disabled={processing} className="gap-2">
                {processing ? <><Loader2 className="w-4 h-4 animate-spin" /> Processing...</> : "Pay Now (Demo)"}
              </Button>
            </div>
            <p className="text-xs text-center text-muted-foreground">This is a simulated payment. No real charges.</p>
          </>
        )}

        {step === "confirmed" && booking && (
          <>
            <div className="text-center space-y-4 py-4">
              <div className="w-20 h-20 mx-auto rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">Booking Confirmed! 🎉</h2>
              <Badge variant="secondary" className="text-base px-4 py-1">ID: {booking.id}</Badge>
            </div>
            <Card className="bg-secondary/30">
              <CardContent className="p-4 space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Item</span><span className="font-medium">{booking.itemName}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Location</span><span>{booking.location}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Travelers</span><span>{booking.travelers}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Payment</span><span className="capitalize">{booking.paymentMethod}</span></div>
                <div className="flex justify-between border-t pt-2 font-bold"><span>Total Paid</span><span className="text-primary">${booking.total}</span></div>
              </CardContent>
            </Card>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={handleClose}>Close</Button>
              <Button className="flex-1" onClick={() => { handleClose(); window.location.href = "/my-bookings"; }}>View My Bookings</Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default BookingModal;
