import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { StatCard } from "./StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Map, Sparkles, FileDown } from "lucide-react";
import {
  ResponsiveContainer, LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip,
  PieChart, Pie, Cell, CartesianGrid, Legend,
} from "recharts";
import { format, subDays, startOfDay } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

const COLORS = ["hsl(var(--primary))", "hsl(var(--accent))", "hsl(var(--travel-coral))", "hsl(var(--muted-foreground))"];

export default function Overview() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    users: 0, trips: 0, ai: 0, pdf: 0,
    usersChange: 0, tripsChange: 0,
  });
  const [signups, setSignups] = useState<{ date: string; count: number }[]>([]);
  const [tripsPerDay, setTripsPerDay] = useState<{ date: string; count: number }[]>([]);
  const [statusBreakdown, setStatusBreakdown] = useState<{ name: string; value: number }[]>([]);

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    const now = new Date();
    const d30 = subDays(now, 30).toISOString();
    const d60 = subDays(now, 60).toISOString();

    const [{ count: users }, { count: trips }, profiles30, profilesPrev, trips30, tripsPrev, aiCount, pdfCount, statuses] = await Promise.all([
      supabase.from("profiles").select("*", { count: "exact", head: true }),
      supabase.from("past_trips").select("*", { count: "exact", head: true }),
      supabase.from("profiles").select("created_at").gte("created_at", d30),
      supabase.from("profiles").select("created_at").gte("created_at", d60).lt("created_at", d30),
      supabase.from("past_trips").select("created_at").gte("created_at", subDays(now, 14).toISOString()),
      supabase.from("past_trips").select("created_at").gte("created_at", d60).lt("created_at", d30),
      supabase.from("admin_activity_log" as any).select("*", { count: "exact", head: true }).eq("action_type", "ai_generated"),
      supabase.from("admin_activity_log" as any).select("*", { count: "exact", head: true }).eq("action_type", "pdf_exported"),
      supabase.from("past_trips").select("status"),
    ]);

    const recentUsers = profiles30.data?.length ?? 0;
    const prevUsers = profilesPrev.data?.length ?? 0;
    const recentTrips = trips30.data?.length ?? 0;
    const prevTrips = tripsPrev.data?.length ?? 0;

    setStats({
      users: users ?? 0,
      trips: trips ?? 0,
      ai: aiCount.count ?? 0,
      pdf: pdfCount.count ?? 0,
      usersChange: prevUsers ? ((recentUsers - prevUsers) / prevUsers) * 100 : recentUsers > 0 ? 100 : 0,
      tripsChange: prevTrips ? ((recentTrips - prevTrips) / prevTrips) * 100 : recentTrips > 0 ? 100 : 0,
    });

    // Signups per day - last 30
    const sMap: Record<string, number> = {};
    for (let i = 29; i >= 0; i--) sMap[format(subDays(now, i), "MMM d")] = 0;
    (profiles30.data ?? []).forEach((r: any) => {
      const k = format(startOfDay(new Date(r.created_at)), "MMM d");
      if (k in sMap) sMap[k]++;
    });
    setSignups(Object.entries(sMap).map(([date, count]) => ({ date, count })));

    // Trips per day - last 14
    const tMap: Record<string, number> = {};
    for (let i = 13; i >= 0; i--) tMap[format(subDays(now, i), "MMM d")] = 0;
    (trips30.data ?? []).forEach((r: any) => {
      const k = format(startOfDay(new Date(r.created_at)), "MMM d");
      if (k in tMap) tMap[k]++;
    });
    setTripsPerDay(Object.entries(tMap).map(([date, count]) => ({ date, count })));

    // Status breakdown
    const counts: Record<string, number> = { planned: 0, ongoing: 0, completed: 0 };
    (statuses.data ?? []).forEach((r: any) => {
      const s = r.status ?? "planned";
      counts[s] = (counts[s] ?? 0) + 1;
    });
    setStatusBreakdown(
      Object.entries(counts).filter(([, v]) => v > 0).map(([name, value]) => ({ name, value }))
    );

    setLoading(false);
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Overview</h2>
        <p className="text-sm text-muted-foreground">Real-time insights for Travello AI</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Users" value={stats.users} icon={Users} change={stats.usersChange} loading={loading} />
        <StatCard label="Total Trips" value={stats.trips} icon={Map} change={stats.tripsChange} loading={loading} tint="bg-accent/10 text-accent" />
        <StatCard label="AI Itineraries" value={stats.ai} icon={Sparkles} loading={loading} change={null} tint="bg-primary/10 text-primary" />
        <StatCard label="PDFs Exported" value={stats.pdf} icon={FileDown} loading={loading} change={null} tint="bg-travel-coral/10 text-travel-coral" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader><CardTitle className="text-base">New signups — last 30 days</CardTitle></CardHeader>
          <CardContent className="h-72">
            {loading ? <Skeleton className="h-full w-full" /> : (
              <ResponsiveContainer>
                <LineChart data={signups}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} interval={4} />
                  <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                  <Tooltip contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
                  <Line type="monotone" dataKey="count" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Trips created — last 14 days</CardTitle></CardHeader>
          <CardContent className="h-72">
            {loading ? <Skeleton className="h-full w-full" /> : (
              <ResponsiveContainer>
                <BarChart data={tripsPerDay}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                  <Tooltip contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
                  <Bar dataKey="count" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Trip status breakdown</CardTitle></CardHeader>
        <CardContent className="h-72">
          {loading ? <Skeleton className="h-full w-full" /> : statusBreakdown.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-12">No trip data yet</p>
          ) : (
            <ResponsiveContainer>
              <PieChart>
                <Pie data={statusBreakdown} dataKey="value" nameKey="name" innerRadius={50} outerRadius={90} paddingAngle={2}>
                  {statusBreakdown.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
