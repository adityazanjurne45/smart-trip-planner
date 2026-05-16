import { useEffect, useState } from "react";
import { Bell, Check, UserPlus, Map, Sparkles, FileDown, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { formatDistanceToNow } from "date-fns";
import { Link } from "react-router-dom";
import { toast } from "sonner";

type Notif = {
  id: string;
  type: string;
  message: string;
  read: boolean;
  created_at: string;
};

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

export function NotificationBell() {
  const [items, setItems] = useState<Notif[]>([]);

  const load = async () => {
    const { data } = await supabase
      .from("admin_notifications" as any)
      .select("*")
      .order("created_at", { ascending: false })
      .limit(20);
    if (data) setItems(data as any);
  };

  useEffect(() => {
    load();
    const channel = supabase
      .channel("admin-notif-bell")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "admin_notifications" }, (payload) => {
        setItems((prev) => [payload.new as Notif, ...prev].slice(0, 20));
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  const unread = items.filter((i) => !i.read).length;

  const markAllRead = async () => {
    const ids = items.filter((i) => !i.read).map((i) => i.id);
    if (!ids.length) return;
    const { error } = await supabase.from("admin_notifications" as any).update({ read: true }).in("id", ids);
    if (error) toast.error("Failed to mark read");
    else {
      setItems((prev) => prev.map((i) => ({ ...i, read: true })));
      toast.success("All marked as read");
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          {unread > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 min-w-5 px-1 flex items-center justify-center text-[10px] bg-destructive text-destructive-foreground">
              {unread > 9 ? "9+" : unread}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0 bg-popover">
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <p className="font-semibold text-sm">Notifications</p>
          <Button variant="ghost" size="sm" onClick={markAllRead} className="text-xs h-7 gap-1">
            <Check className="w-3 h-3" /> Mark all read
          </Button>
        </div>
        <ScrollArea className="h-80">
          {items.length === 0 ? (
            <div className="text-center text-muted-foreground text-sm py-12">No notifications yet</div>
          ) : (
            <ul className="divide-y">
              {items.map((n) => {
                const Icon = iconFor(n.type);
                return (
                  <li key={n.id} className={`px-4 py-3 flex gap-3 ${!n.read ? "bg-primary/5" : ""}`}>
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4 text-primary" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm leading-snug">{n.message}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {formatDistanceToNow(new Date(n.created_at), { addSuffix: true })}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </ScrollArea>
        <div className="border-t p-2">
          <Button asChild variant="ghost" size="sm" className="w-full">
            <Link to="/admin/notifications">View all</Link>
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
