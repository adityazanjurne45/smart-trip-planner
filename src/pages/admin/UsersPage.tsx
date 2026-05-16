import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Search, Users as UsersIcon, ChevronLeft, ChevronRight, Mail, MapPin } from "lucide-react";
import { EmptyState } from "./EmptyState";
import { toast } from "sonner";
import { formatDistanceToNow, format } from "date-fns";

const PAGE_SIZE = 10;

type Row = {
  user_id: string;
  full_name: string | null;
  email: string | null;
  home_city: string | null;
  created_at: string;
  status: string;
  last_active_at: string | null;
  trips: number;
  role: "admin" | "user";
};

export default function UsersPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Row | null>(null);
  const [selectedActivity, setSelectedActivity] = useState<any[]>([]);

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    const [{ data: profiles }, { data: roles }, { data: trips }] = await Promise.all([
      supabase.from("profiles").select("user_id, full_name, email, home_city, created_at, status, last_active_at").order("created_at", { ascending: false }),
      supabase.from("user_roles").select("user_id, role"),
      supabase.from("past_trips").select("user_id"),
    ]);
    const tripMap: Record<string, number> = {};
    (trips ?? []).forEach((t: any) => { tripMap[t.user_id] = (tripMap[t.user_id] ?? 0) + 1; });
    const roleMap: Record<string, "admin" | "user"> = {};
    (roles ?? []).forEach((r: any) => { roleMap[r.user_id] = r.role; });
    setRows((profiles ?? []).map((p: any) => ({
      ...p,
      trips: tripMap[p.user_id] ?? 0,
      role: roleMap[p.user_id] ?? "user",
    })));
    setLoading(false);
  }

  const filtered = useMemo(() => {
    return rows.filter((r) => {
      if (q) {
        const s = q.toLowerCase();
        if (!r.full_name?.toLowerCase().includes(s) && !r.email?.toLowerCase().includes(s)) return false;
      }
      if (roleFilter !== "all" && r.role !== roleFilter) return false;
      if (statusFilter !== "all" && r.status !== statusFilter) return false;
      return true;
    });
  }, [rows, q, roleFilter, statusFilter]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageRows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const setRole = async (row: Row, role: "admin" | "user") => {
    if (role === "admin") {
      const { error } = await supabase.from("user_roles").insert({ user_id: row.user_id, role: "admin" });
      if (error && !error.message.includes("duplicate")) return toast.error(error.message);
    } else {
      const { error } = await supabase.from("user_roles").delete().eq("user_id", row.user_id).eq("role", "admin");
      if (error) return toast.error(error.message);
    }
    toast.success(`Role updated to ${role}`);
    setRows((prev) => prev.map((r) => r.user_id === row.user_id ? { ...r, role } : r));
  };

  const toggleStatus = async (row: Row) => {
    const next = row.status === "active" ? "suspended" : "active";
    const { error } = await supabase.from("profiles").update({ status: next }).eq("user_id", row.user_id);
    if (error) return toast.error(error.message);
    await supabase.from("admin_notifications" as any).insert({
      type: "user_suspended",
      message: `${row.full_name ?? row.email} was ${next === "suspended" ? "suspended" : "reactivated"}`,
    });
    toast.success(`User ${next}`);
    setRows((prev) => prev.map((r) => r.user_id === row.user_id ? { ...r, status: next } : r));
  };

  const openProfile = async (row: Row) => {
    setSelected(row);
    const { data } = await supabase
      .from("admin_activity_log" as any)
      .select("*")
      .eq("user_id", row.user_id)
      .order("created_at", { ascending: false })
      .limit(20);
    setSelectedActivity((data as any) ?? []);
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold">Users</h2>
        <p className="text-sm text-muted-foreground">{rows.length} total · {rows.filter((r) => r.status === "active").length} active</p>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
            <CardTitle className="text-base flex items-center gap-2"><UsersIcon className="w-4 h-4" /> User Management</CardTitle>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Search name or email…" value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} className="pl-9 w-full sm:w-64" />
              </div>
              <Select value={roleFilter} onValueChange={(v) => { setRoleFilter(v); setPage(1); }}>
                <SelectTrigger className="w-full sm:w-32"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-popover">
                  <SelectItem value="all">All roles</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="user">User</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); }}>
                <SelectTrigger className="w-full sm:w-36"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-popover">
                  <SelectItem value="all">All status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-2">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}</div>
          ) : filtered.length === 0 ? (
            <EmptyState icon={UsersIcon} title="No users match your filters" />
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Trips</TableHead>
                      <TableHead>Last Active</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pageRows.map((r) => (
                      <TableRow key={r.user_id} className="cursor-pointer" onClick={() => openProfile(r)}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="w-8 h-8"><AvatarFallback className="text-xs bg-primary/10 text-primary">{(r.full_name ?? r.email ?? "?").slice(0, 2).toUpperCase()}</AvatarFallback></Avatar>
                            <span className="font-medium">{r.full_name ?? "—"}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm">{r.email}</TableCell>
                        <TableCell onClick={(e) => e.stopPropagation()}>
                          <Select value={r.role} onValueChange={(v) => setRole(r, v as any)}>
                            <SelectTrigger className="h-8 w-24"><SelectValue /></SelectTrigger>
                            <SelectContent className="bg-popover">
                              <SelectItem value="user">User</SelectItem>
                              <SelectItem value="admin">Admin</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell><Badge variant="outline">{r.trips}</Badge></TableCell>
                        <TableCell className="text-sm text-muted-foreground">{r.last_active_at ? formatDistanceToNow(new Date(r.last_active_at), { addSuffix: true }) : "—"}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{format(new Date(r.created_at), "MMM d, yyyy")}</TableCell>
                        <TableCell onClick={(e) => e.stopPropagation()}>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button size="sm" variant={r.status === "active" ? "outline" : "destructive"}>
                                {r.status === "active" ? "Active" : "Suspended"}
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>{r.status === "active" ? "Suspend user?" : "Reactivate user?"}</AlertDialogTitle>
                                <AlertDialogDescription>{r.full_name ?? r.email}</AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => toggleStatus(r)}>Confirm</AlertDialogAction>
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
                <p className="text-xs text-muted-foreground">Page {page} of {pageCount} · {filtered.length} results</p>
                <div className="flex gap-1">
                  <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage((p) => p - 1)}><ChevronLeft className="w-4 h-4" /></Button>
                  <Button variant="outline" size="sm" disabled={page === pageCount} onClick={() => setPage((p) => p + 1)}><ChevronRight className="w-4 h-4" /></Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Sheet open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <SheetContent className="w-full sm:max-w-md overflow-y-auto">
          {selected && (
            <>
              <SheetHeader>
                <SheetTitle>User Profile</SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-5">
                <div className="flex items-center gap-3">
                  <Avatar className="w-14 h-14"><AvatarFallback className="bg-primary text-primary-foreground text-lg">{(selected.full_name ?? selected.email ?? "?").slice(0, 2).toUpperCase()}</AvatarFallback></Avatar>
                  <div>
                    <p className="font-semibold">{selected.full_name ?? "Unnamed"}</p>
                    <p className="text-sm text-muted-foreground flex items-center gap-1"><Mail className="w-3 h-3" /> {selected.email}</p>
                    {selected.home_city && <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1"><MapPin className="w-3 h-3" /> {selected.home_city}</p>}
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="rounded-lg border p-3 text-center">
                    <p className="text-2xl font-bold">{selected.trips}</p>
                    <p className="text-[10px] text-muted-foreground uppercase">Trips</p>
                  </div>
                  <div className="rounded-lg border p-3 text-center">
                    <p className="text-2xl font-bold">{selectedActivity.filter((a) => a.action_type === "ai_generated").length}</p>
                    <p className="text-[10px] text-muted-foreground uppercase">AI Uses</p>
                  </div>
                  <div className="rounded-lg border p-3 text-center">
                    <p className="text-2xl font-bold">{selectedActivity.filter((a) => a.action_type === "pdf_exported").length}</p>
                    <p className="text-[10px] text-muted-foreground uppercase">PDFs</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1" onClick={() => setRole(selected, selected.role === "admin" ? "user" : "admin")}>
                    {selected.role === "admin" ? "Demote to User" : "Promote to Admin"}
                  </Button>
                  <Button size="sm" variant={selected.status === "active" ? "destructive" : "default"} className="flex-1" onClick={() => toggleStatus(selected)}>
                    {selected.status === "active" ? "Suspend" : "Reactivate"}
                  </Button>
                </div>

                <div>
                  <p className="text-sm font-semibold mb-2">Activity timeline</p>
                  {selectedActivity.length === 0 ? (
                    <p className="text-xs text-muted-foreground">No recent activity</p>
                  ) : (
                    <ul className="space-y-2">
                      {selectedActivity.map((a: any) => (
                        <li key={a.id} className="text-sm border-l-2 border-primary/30 pl-3 py-1">
                          <p>{a.description}</p>
                          <p className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(a.created_at), { addSuffix: true })}</p>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
