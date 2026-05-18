import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, MapPin } from "lucide-react";
import { EmptyState } from "./EmptyState";

interface Item { id: string; name: string; type?: string; location?: string; }

export default function WishlistPage() {
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("travello_wishlist");
      setItems(raw ? JSON.parse(raw) : []);
    } catch {}
  }, []);

  const grouped = items.reduce((acc: Record<string, number>, it) => {
    const key = it.name;
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
  const popular = Object.entries(grouped).sort((a, b) => b[1] - a[1]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Wishlist Monitoring</h1>
        <p className="text-sm text-muted-foreground">Most saved destinations and hotels</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground">Saved Items</p><p className="text-2xl font-bold">{items.length}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground">Unique Places</p><p className="text-2xl font-bold">{Object.keys(grouped).length}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground">Top Place</p><p className="text-lg font-bold truncate">{popular[0]?.[0] || "—"}</p></CardContent></Card>
      </div>

      {items.length === 0 ? (
        <EmptyState icon={Heart} title="No wishlist activity yet" description="Items saved by users will show up here." />
      ) : (
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Heart className="w-5 h-5 text-rose-500" />Most Wishlisted</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {popular.map(([name, count], i) => (
              <div key={name} className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/30 transition">
                <div className="flex items-center gap-3">
                  <Badge variant="secondary">#{i + 1}</Badge>
                  <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-muted-foreground" /><span className="font-medium">{name}</span></div>
                </div>
                <Badge>{count} {count === 1 ? "save" : "saves"}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
