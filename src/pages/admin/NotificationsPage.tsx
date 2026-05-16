import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, Check, X, UserPlus, Map, Sparkles, FileDown, ShieldAlert } from "lucide-react";
import { EmptyState } from "./EmptyState";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";

type Notif = { id: string; type: string; message: string; read: boolean; created_at: string };

const iconFor = (t: string) => {
  switch (t) {
    case "signup": return UserPlus;
    case "trip_created": return Map;
    case "ai_generated": return Sparkles;
    case "pdf_exported": return FileDown;
    case "user_suspended":
    case "login_failed": return ShieldAlert;
    default: return Bell;
  }
};

export default function NotificationsPage() {
  const [items, setItems] = useState<Notif[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("admin_notifications" as any)
        .select("*")
        .order("created_at", { ascending: false })
        .limit(200);
      setItems((data as any) ?? []);
      setLoading(false);
    })();
    const channel = supabase
      .channel("admin-notif-page")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "admin_notifications" }, (payload) => {
        setItems((p) => [payload.new as Notif, ...p]);
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  const markRead = async (id: string) => {
    await supabase.from("admin_notifications" as any).update({ read: true }).eq("id", id);
    setItems((p) => p.map((n) => n.id === id ? { ...n, read: true } : n));
  };

  const dismiss = async (id: string) => {
    await supabase.from("admin_notifications" as any).delete().eq("id", id);
    setItems((p) => p.filter((n) => n.id !== id));
  };

  const markAll = async () => {
    const ids = items.filter((n) => !n.read).map((n) => n.id);
    if (!ids.length) return;
    await supabase.from("admin_notifications" as any).update({ read: true }).in("id", ids);
    setItems((p) => p.map((n) => ({ ...n, read: true })));
    toast.success("All marked as read");
  };

  const unread = items.filter((n) => !n.read).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-bold">Notifications</h2>
          <p className="text-sm text-muted-foreground">{unread} unread · {items.length} total</p>
        </div>
        <Button onClick={markAll} disabled={unread === 0} variant="outline" size="sm" className="gap-1">
          <Check className="w-4 h-4" /> Mark all as read
        </Button>
      </div>

      <Card className="p-4">
        {loading ? (
          <p className="text-center text-muted-foreground py-12">Loading…</p>
        ) : items.length === 0 ? (
          <EmptyState icon={Bell} title="No notifications" message="Real-time updates will appear here." />
        ) : (
          <ul className="divide-y">
            {items.map((n) => {
              const Icon = iconFor(n.type);
              return (
                <li key={n.id} className={`py-3 px-2 flex gap-3 items-start ${!n.read ? "bg-primary/5 rounded" : ""}`}>
                  <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm">{n.message}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {formatDistanceToNow(new Date(n.created_at), { addSuffix: true })}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    {!n.read && <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => markRead(n.id)}><Check className="w-3.5 h-3.5" /></Button>}
                    <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive" onClick={() => dismiss(n.id)}><X className="w-3.5 h-3.5" /></Button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </Card>
    </div>
  );
}
