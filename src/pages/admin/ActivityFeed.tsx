import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Activity, UserPlus, Map, Sparkles, FileDown, ShieldAlert, ArrowUp } from "lucide-react";
import { EmptyState } from "./EmptyState";
import { formatDistanceToNow } from "date-fns";

type Event = {
  id: string;
  user_id: string | null;
  action_type: string;
  description: string;
  created_at: string;
};

const iconFor = (t: string) => {
  switch (t) {
    case "signup": return { Icon: UserPlus, tint: "bg-green-500/10 text-green-600" };
    case "trip_created": return { Icon: Map, tint: "bg-blue-500/10 text-blue-600" };
    case "ai_generated": return { Icon: Sparkles, tint: "bg-primary/10 text-primary" };
    case "pdf_exported": return { Icon: FileDown, tint: "bg-accent/10 text-accent" };
    case "user_suspended":
    case "login_failed": return { Icon: ShieldAlert, tint: "bg-destructive/10 text-destructive" };
    default: return { Icon: Activity, tint: "bg-muted text-muted-foreground" };
  }
};

export default function ActivityFeed() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState<Event[]>([]);
  const topRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("admin_activity_log" as any)
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100);
      setEvents((data as any) ?? []);
      setLoading(false);
    })();

    const channel = supabase
      .channel("admin-activity-feed")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "admin_activity_log" }, (payload) => {
        setPending((p) => [payload.new as Event, ...p]);
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  const showNew = () => {
    setEvents((prev) => [...pending, ...prev]);
    setPending([]);
    topRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="space-y-4">
      <div ref={topRef}>
        <h2 className="text-2xl font-bold">Activity Feed</h2>
        <p className="text-sm text-muted-foreground">Real-time stream of what users are doing</p>
      </div>

      {pending.length > 0 && (
        <div className="sticky top-16 z-20 flex justify-center">
          <Button size="sm" onClick={showNew} className="gap-1 shadow-lg animate-bounce">
            <ArrowUp className="w-3 h-3" /> {pending.length} new {pending.length === 1 ? "activity" : "activities"}
          </Button>
        </div>
      )}

      <Card className="p-4">
        {loading ? (
          <p className="text-center text-muted-foreground py-12">Loading…</p>
        ) : events.length === 0 ? (
          <EmptyState icon={Activity} title="No activity yet" message="As users interact with the app, events will appear here in real time." />
        ) : (
          <ul className="space-y-3">
            {events.map((e) => {
              const { Icon, tint } = iconFor(e.action_type);
              return (
                <li key={e.id} className="flex gap-3 p-3 rounded-lg hover:bg-muted/40 transition-colors">
                  <Avatar className="w-9 h-9 shrink-0">
                    <AvatarFallback className={tint}>
                      <Icon className="w-4 h-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm">{e.description}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {formatDistanceToNow(new Date(e.created_at), { addSuffix: true })}
                    </p>
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
