import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, CalendarCheck, XCircle, Eye, Hotel } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { EmptyState } from "./EmptyState";

interface Booking {
  id: string; type: string; itemName: string; location: string; total: number;
  travelerName: string; email: string; travelers: number; travelDates: string;
  status: "confirmed" | "cancelled"; createdAt: string;
}

const STORAGE_KEY = "travello_bookings";

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState<Booking | null>(null);

  const load = () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      setBookings(raw ? JSON.parse(raw) : []);
    } catch { setBookings([]); }
  };

  useEffect(() => { load(); }, []);

  const persist = (next: Booking[]) => {
    setBookings(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const cancel = (id: string) => {
    persist(bookings.map(b => b.id === id ? { ...b, status: "cancelled" } : b));
    toast.success("Booking cancelled");
  };

  const filtered = bookings.filter(b => {
    const s = q.toLowerCase();
    return !s || b.id.toLowerCase().includes(s) || b.travelerName?.toLowerCase().includes(s)
      || b.itemName?.toLowerCase().includes(s) || b.email?.toLowerCase().includes(s);
  });

  const totalRevenue = bookings.filter(b => b.status === "confirmed").reduce((s, b) => s + (b.total || 0), 0);
  const confirmedCount = bookings.filter(b => b.status === "confirmed").length;
  const cancelledCount = bookings.filter(b => b.status === "cancelled").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Bookings</h1>
        <p className="text-sm text-muted-foreground">Manage all hotel and transport bookings</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground">Total</p><p className="text-2xl font-bold">{bookings.length}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground">Confirmed</p><p className="text-2xl font-bold text-green-600">{confirmedCount}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground">Cancelled</p><p className="text-2xl font-bold text-destructive">{cancelledCount}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground">Revenue (demo)</p><p className="text-2xl font-bold">₹{totalRevenue.toLocaleString()}</p></CardContent></Card>
      </div>

      <Card>
        <CardHeader className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <CardTitle className="flex items-center gap-2"><CalendarCheck className="w-5 h-5" /> All Bookings</CardTitle>
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search ID, name, hotel..." value={q} onChange={(e) => setQ(e.target.value)} className="pl-9" />
          </div>
        </CardHeader>
        <CardContent>
          {filtered.length === 0 ? (
            <EmptyState icon={CalendarCheck} title="No bookings yet" message="Bookings made by users will appear here." />
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Booking ID</TableHead><TableHead>User</TableHead><TableHead>Hotel/Item</TableHead>
                    <TableHead>Dates</TableHead><TableHead>Total</TableHead><TableHead>Status</TableHead><TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map(b => (
                    <TableRow key={b.id}>
                      <TableCell className="font-mono text-xs">{b.id}</TableCell>
                      <TableCell>{b.travelerName}<div className="text-xs text-muted-foreground">{b.email}</div></TableCell>
                      <TableCell className="flex items-center gap-1"><Hotel className="w-3 h-3 text-muted-foreground" /> {b.itemName}</TableCell>
                      <TableCell className="text-sm">{b.travelDates}</TableCell>
                      <TableCell>₹{b.total?.toLocaleString()}</TableCell>
                      <TableCell><Badge variant={b.status === "confirmed" ? "default" : "destructive"}>{b.status}</Badge></TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button size="sm" variant="ghost" onClick={() => setSelected(b)}><Eye className="w-4 h-4" /></Button>
                          {b.status === "confirmed" && (
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button size="sm" variant="ghost" className="text-destructive"><XCircle className="w-4 h-4" /></Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Cancel this booking?</AlertDialogTitle>
                                  <AlertDialogDescription>Booking {b.id} will be marked cancelled. This cannot be undone.</AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Keep</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => cancel(b.id)}>Yes, cancel</AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Booking Details</DialogTitle></DialogHeader>
          {selected && (
            <div className="space-y-2 text-sm">
              <p><b>ID:</b> {selected.id}</p>
              <p><b>Traveler:</b> {selected.travelerName} ({selected.email})</p>
              <p><b>Item:</b> {selected.itemName} — {selected.location}</p>
              <p><b>Dates:</b> {selected.travelDates}</p>
              <p><b>Travelers:</b> {selected.travelers}</p>
              <p><b>Total:</b> ₹{selected.total?.toLocaleString()}</p>
              <p><b>Status:</b> <Badge variant={selected.status === "confirmed" ? "default" : "destructive"}>{selected.status}</Badge></p>
              <p className="text-muted-foreground">Created {new Date(selected.createdAt).toLocaleString()}</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
