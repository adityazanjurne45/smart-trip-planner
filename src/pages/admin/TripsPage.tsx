import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Map as MapIcon, Search, Eye, Trash2, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { EmptyState } from "./EmptyState";
import { toast } from "sonner";
import { format } from "date-fns";

const PAGE_SIZE = 10;

type Trip = {
  id: string;
  user_id: string;
  destination: string;
  boarding_point: string;
  trip_date: string;
  start_date: string | null;
  end_date: string | null;
  duration: number;
  budget: number;
  status: string;
  ai_generated: boolean;
  title: string | null;
  created_at: string;
  user_name?: string;
};

export default function TripsPage() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Trip | null>(null);

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    const [{ data: t }, { data: profs }] = await Promise.all([
      supabase.from("past_trips").select("*").order("created_at", { ascending: false }),
      supabase.from("profiles").select("user_id, full_name, email"),
    ]);
    const nameMap: Record<string, string> = {};
    (profs ?? []).forEach((p: any) => { nameMap[p.user_id] = p.full_name ?? p.email ?? "Unknown"; });
    setTrips((t ?? []).map((r: any) => ({ ...r, user_name: nameMap[r.user_id] ?? "Unknown" })));
    setLoading(false);
  }

  const filtered = useMemo(() => trips.filter((r) => {
    if (q) {
      const s = q.toLowerCase();
      if (!r.destination.toLowerCase().includes(s) && !r.user_name?.toLowerCase().includes(s)) return false;
    }
    if (statusFilter !== "all" && r.status !== statusFilter) return false;
    return true;
  }), [trips, q, statusFilter]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const rows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const deleteTrip = async (id: string) => {
    const { error } = await supabase.from("past_trips").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Trip deleted");
    setTrips((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold">Trips</h2>
        <p className="text-sm text-muted-foreground">{trips.length} total trips · {trips.filter((t) => t.ai_generated).length} AI-generated</p>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
            <CardTitle className="text-base flex items-center gap-2"><MapIcon className="w-4 h-4" /> All Trips</CardTitle>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Destination or user…" value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} className="pl-9 w-full sm:w-64" />
              </div>
              <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); }}>
                <SelectTrigger className="w-full sm:w-36"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-popover">
                  <SelectItem value="all">All status</SelectItem>
                  <SelectItem value="planned">Planned</SelectItem>
                  <SelectItem value="ongoing">Ongoing</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-2">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}</div>
          ) : filtered.length === 0 ? (
            <EmptyState icon={MapIcon} title="No trips found" />
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Destination</TableHead>
                      <TableHead>Created by</TableHead>
                      <TableHead>Dates</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>AI</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rows.map((t) => (
                      <TableRow key={t.id}>
                        <TableCell className="font-medium">{t.title ?? `Trip to ${t.destination}`}</TableCell>
                        <TableCell>{t.destination}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{t.user_name}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {t.start_date ? `${format(new Date(t.start_date), "MMM d")} → ${t.end_date ? format(new Date(t.end_date), "MMM d") : "?"}` : format(new Date(t.trip_date), "MMM d, yyyy")}
                        </TableCell>
                        <TableCell>
                          <Badge variant={t.status === "completed" ? "secondary" : t.status === "ongoing" ? "default" : "outline"} className="capitalize">{t.status}</Badge>
                        </TableCell>
                        <TableCell>
                          {t.ai_generated ? <Badge className="bg-primary/10 text-primary hover:bg-primary/10"><Sparkles className="w-3 h-3 mr-1" />Yes</Badge> : <span className="text-xs text-muted-foreground">No</span>}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button size="icon" variant="ghost" onClick={() => setSelected(t)}><Eye className="w-4 h-4" /></Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button size="icon" variant="ghost" className="text-destructive"><Trash2 className="w-4 h-4" /></Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete this trip?</AlertDialogTitle>
                                <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => deleteTrip(t.id)} className="bg-destructive">Delete</AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div className="flex items-center justify-between mt-4">
                <p className="text-xs text-muted-foreground">Page {page} of {pageCount}</p>
                <div className="flex gap-1">
                  <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage((p) => p - 1)}><ChevronLeft className="w-4 h-4" /></Button>
                  <Button variant="outline" size="sm" disabled={page === pageCount} onClick={() => setPage((p) => p + 1)}><ChevronRight className="w-4 h-4" /></Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle>{selected.title ?? `Trip to ${selected.destination}`}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-2">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-lg border p-3"><p className="text-xs text-muted-foreground">Destination</p><p className="font-semibold">{selected.destination}</p></div>
                  <div className="rounded-lg border p-3"><p className="text-xs text-muted-foreground">Boarding</p><p className="font-semibold">{selected.boarding_point}</p></div>
                  <div className="rounded-lg border p-3"><p className="text-xs text-muted-foreground">Duration</p><p className="font-semibold">{selected.duration} days</p></div>
                  <div className="rounded-lg border p-3"><p className="text-xs text-muted-foreground">Budget</p><p className="font-semibold">₹{selected.budget?.toLocaleString()}</p></div>
                  <div className="rounded-lg border p-3"><p className="text-xs text-muted-foreground">Status</p><Badge variant="outline" className="capitalize mt-1">{selected.status}</Badge></div>
                  <div className="rounded-lg border p-3"><p className="text-xs text-muted-foreground">Created by</p><p className="font-semibold">{selected.user_name}</p></div>
                </div>
                {selected.ai_generated && (
                  <div className="rounded-lg bg-primary/5 border border-primary/20 p-3 flex items-center gap-2 text-sm">
                    <Sparkles className="w-4 h-4 text-primary" />
                    AI-generated itinerary
                  </div>
                )}
                <div className="rounded-lg border overflow-hidden">
                  <iframe
                    title="map"
                    className="w-full h-48"
                    src={`https://www.google.com/maps?q=${encodeURIComponent(selected.destination)}&output=embed`}
                  />
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
