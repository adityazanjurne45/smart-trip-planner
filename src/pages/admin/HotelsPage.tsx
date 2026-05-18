import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Hotel, TrendingUp } from "lucide-react";
import { EmptyState } from "./EmptyState";

interface Row { name: string; location: string; bookings: number; revenue: number; }

export default function HotelsPage() {
  const [rows, setRows] = useState<Row[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("travello_bookings");
      const bookings = raw ? JSON.parse(raw) : [];
      const map = new Map<string, Row>();
      bookings.filter((b: any) => b.type === "hotel").forEach((b: any) => {
        const key = b.itemName;
        const existing = map.get(key);
        if (existing) {
          existing.bookings += 1;
          existing.revenue += b.total || 0;
        } else {
          map.set(key, { name: b.itemName, location: b.location, bookings: 1, revenue: b.total || 0 });
        }
      });
      setRows([...map.values()].sort((a, b) => b.bookings - a.bookings));
    } catch {}
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Hotels</h1>
        <p className="text-sm text-muted-foreground">Most booked hotels across the platform</p>
      </div>

      {rows.length === 0 ? (
        <EmptyState icon={Hotel} title="No hotel bookings yet" description="Once users book hotels, top properties appear here." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {rows.map((r, i) => (
            <Card key={r.name} className="hover:shadow-md transition">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-base flex items-center gap-2"><Hotel className="w-4 h-4 text-primary" />{r.name}</CardTitle>
                  {i < 3 && <Badge className="bg-amber-500 hover:bg-amber-500">#{i + 1}</Badge>}
                </div>
                <p className="text-xs text-muted-foreground">{r.location}</p>
              </CardHeader>
              <CardContent className="flex justify-between items-end">
                <div>
                  <p className="text-2xl font-bold">{r.bookings}</p>
                  <p className="text-xs text-muted-foreground">Bookings</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold flex items-center gap-1"><TrendingUp className="w-4 h-4 text-green-600" />₹{r.revenue.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Revenue</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
