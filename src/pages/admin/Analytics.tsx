import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ResponsiveContainer, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
} from "recharts";
import { format, subDays, startOfDay } from "date-fns";

const RANGES = { "7": 7, "30": 30, "90": 90, all: 3650 } as const;
type RangeKey = keyof typeof RANGES;

export default function Analytics() {
  const [range, setRange] = useState<RangeKey>("30");
  const [loading, setLoading] = useState(true);
  const [trips, setTrips] = useState<any[]>([]);
  const [profiles, setProfiles] = useState<any[]>([]);
  const [activity, setActivity] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const days = RANGES[range];
      const since = subDays(new Date(), days).toISOString();
      const [{ data: t }, { data: p }, { data: a }] = await Promise.all([
        supabase.from("past_trips").select("destination, user_id, created_at").gte("created_at", since),
        supabase.from("profiles").select("user_id, created_at"),
        supabase.from("admin_activity_log" as any).select("action_type, created_at").gte("created_at", since),
      ]);
      setTrips(t ?? []);
      setProfiles(p ?? []);
      setActivity((a as any) ?? []);
      setLoading(false);
    })();
  }, [range]);

  const topDestinations = useMemo(() => {
    const m: Record<string, number> = {};
    trips.forEach((t) => { m[t.destination] = (m[t.destination] ?? 0) + 1; });
    return Object.entries(m).sort((a, b) => b[1] - a[1]).slice(0, 10).map(([name, count]) => ({ name, count }));
  }, [trips]);

  const aiOverTime = useMemo(() => bucketByDay(activity.filter((a) => a.action_type === "ai_generated"), RANGES[range]), [activity, range]);
  const pdfOverTime = useMemo(() => bucketByDay(activity.filter((a) => a.action_type === "pdf_exported"), RANGES[range]), [activity, range]);

  const avgTripsPerUser = profiles.length ? (trips.length / profiles.length).toFixed(2) : "0";
  const repeatUsers = useMemo(() => {
    const counts: Record<string, number> = {};
    trips.forEach((t) => { counts[t.user_id] = (counts[t.user_id] ?? 0) + 1; });
    const repeats = Object.values(counts).filter((c) => c > 1).length;
    return profiles.length ? Math.round((repeats / profiles.length) * 100) : 0;
  }, [trips, profiles]);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-bold">Analytics</h2>
          <p className="text-sm text-muted-foreground">Deep insights into platform usage</p>
        </div>
        <Select value={range} onValueChange={(v) => setRange(v as RangeKey)}>
          <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
          <SelectContent className="bg-popover">
            <SelectItem value="7">Last 7 days</SelectItem>
            <SelectItem value="30">Last 30 days</SelectItem>
            <SelectItem value="90">Last 90 days</SelectItem>
            <SelectItem value="all">All time</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground">Avg trips / user</p><p className="text-2xl font-bold mt-1">{avgTripsPerUser}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground">Repeat users</p><p className="text-2xl font-bold mt-1">{repeatUsers}%</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground">AI generations</p><p className="text-2xl font-bold mt-1">{activity.filter((a) => a.action_type === "ai_generated").length}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground">PDF exports</p><p className="text-2xl font-bold mt-1">{activity.filter((a) => a.action_type === "pdf_exported").length}</p></CardContent></Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Top 10 destinations</CardTitle></CardHeader>
        <CardContent className="h-80">
          {loading ? <Skeleton className="h-full w-full" /> : topDestinations.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-12">No trip data in range</p>
          ) : (
            <ResponsiveContainer>
              <BarChart data={topDestinations} layout="vertical" margin={{ left: 60 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" tick={{ fontSize: 11 }} allowDecimals={false} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={100} />
                <Tooltip contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
                <Bar dataKey="count" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ChartCard title="AI itineraries over time" data={aiOverTime} color="hsl(var(--primary))" loading={loading} />
        <ChartCard title="PDF exports over time" data={pdfOverTime} color="hsl(var(--accent))" loading={loading} />
      </div>
    </div>
  );
}

function ChartCard({ title, data, color, loading }: { title: string; data: any[]; color: string; loading: boolean }) {
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">{title}</CardTitle></CardHeader>
      <CardContent className="h-64">
        {loading ? <Skeleton className="h-full w-full" /> : (
          <ResponsiveContainer>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} interval="preserveStartEnd" />
              <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
              <Tooltip contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
              <Line type="monotone" dataKey="count" stroke={color} strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}

function bucketByDay(rows: any[], days: number) {
  const limited = Math.min(days, 90);
  const map: Record<string, number> = {};
  for (let i = limited - 1; i >= 0; i--) map[format(subDays(new Date(), i), "MMM d")] = 0;
  rows.forEach((r) => {
    const k = format(startOfDay(new Date(r.created_at)), "MMM d");
    if (k in map) map[k]++;
  });
  return Object.entries(map).map(([date, count]) => ({ date, count }));
}
