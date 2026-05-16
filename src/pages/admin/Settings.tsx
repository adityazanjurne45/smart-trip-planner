import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Shield, Sparkles, FileDown, UserPlus, Trash2, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

export default function Settings() {
  const [settings, setSettings] = useState<any>(null);
  const [admins, setAdmins] = useState<any[]>([]);
  const [storageStats, setStorageStats] = useState({ users: 0, trips: 0 });

  useEffect(() => { load(); }, []);

  async function load() {
    const [{ data: s }, { data: roles }, { data: profs }, { count: tripCount }] = await Promise.all([
      supabase.from("admin_settings" as any).select("*").limit(1).single(),
      supabase.from("user_roles").select("user_id").eq("role", "admin"),
      supabase.from("profiles").select("user_id, full_name, email"),
      supabase.from("past_trips").select("*", { count: "exact", head: true }),
    ]);
    setSettings(s);
    const adminIds = new Set((roles ?? []).map((r: any) => r.user_id));
    setAdmins((profs ?? []).filter((p: any) => adminIds.has(p.user_id)));
    setStorageStats({ users: profs?.length ?? 0, trips: tripCount ?? 0 });
  }

  const updateFlag = async (key: string, value: boolean) => {
    if (!settings) return;
    const { error } = await supabase.from("admin_settings" as any).update({ [key]: value, updated_at: new Date().toISOString() }).eq("id", settings.id);
    if (error) return toast.error(error.message);
    setSettings({ ...settings, [key]: value });
    toast.success("Setting updated");
  };

  const removeAdmin = async (userId: string) => {
    const { error } = await supabase.from("user_roles").delete().eq("user_id", userId).eq("role", "admin");
    if (error) return toast.error(error.message);
    toast.success("Admin removed");
    setAdmins((p) => p.filter((a) => a.user_id !== userId));
  };

  const wipeAllTrips = async () => {
    const { error } = await supabase.from("past_trips").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    if (error) return toast.error(error.message);
    toast.success("All trips wiped");
    load();
  };

  if (!settings) return <div className="text-muted-foreground">Loading…</div>;

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-bold">Settings</h2>
        <p className="text-sm text-muted-foreground">Platform configuration & admin controls</p>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base flex items-center gap-2"><Shield className="w-4 h-4" /> Admin Accounts</CardTitle></CardHeader>
        <CardContent>
          {admins.length === 0 ? (
            <p className="text-sm text-muted-foreground">No admins configured. Promote a user from the Users page.</p>
          ) : (
            <ul className="space-y-2">
              {admins.map((a) => (
                <li key={a.user_id} className="flex items-center justify-between border rounded-lg p-3">
                  <div>
                    <p className="font-medium text-sm">{a.full_name ?? "Unnamed"}</p>
                    <p className="text-xs text-muted-foreground">{a.email}</p>
                  </div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild><Button size="sm" variant="ghost" className="text-destructive">Remove</Button></AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Remove admin role?</AlertDialogTitle>
                        <AlertDialogDescription>{a.email} will lose admin access.</AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => removeAdmin(a.user_id)} className="bg-destructive">Remove</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Feature Flags</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <FlagRow icon={Sparkles} label="AI Itinerary Generation" enabled={settings.ai_enabled} onChange={(v) => updateFlag("ai_enabled", v)} />
          <FlagRow icon={FileDown} label="PDF Export" enabled={settings.pdf_enabled} onChange={(v) => updateFlag("pdf_enabled", v)} />
          <FlagRow icon={UserPlus} label="New User Signups" enabled={settings.signups_enabled} onChange={(v) => updateFlag("signups_enabled", v)} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">App Stats</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Stat label="Total Users" value={storageStats.users} />
            <Stat label="Total Trips" value={storageStats.trips} />
            <Stat label="DB Storage" value="—" hint="Available in Cloud" />
            <Stat label="API Calls" value="—" hint="Available in Cloud" />
          </div>
        </CardContent>
      </Card>

      <Card className="border-destructive/40">
        <CardHeader><CardTitle className="text-base flex items-center gap-2 text-destructive"><AlertTriangle className="w-4 h-4" /> Danger Zone</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between border border-destructive/30 rounded-lg p-3">
            <div>
              <p className="font-medium text-sm">Wipe all trip data</p>
              <p className="text-xs text-muted-foreground">Permanently deletes every trip across all users.</p>
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild><Button variant="destructive" size="sm" className="gap-1"><Trash2 className="w-4 h-4" /> Wipe</Button></AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Wipe ALL trips?</AlertDialogTitle>
                  <AlertDialogDescription>This permanently deletes every trip in the database. This cannot be undone.</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={wipeAllTrips} className="bg-destructive">Yes, wipe everything</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function FlagRow({ icon: Icon, label, enabled, onChange }: any) {
  return (
    <div className="flex items-center justify-between border rounded-lg p-3">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center"><Icon className="w-4 h-4 text-primary" /></div>
        <div>
          <p className="font-medium text-sm">{label}</p>
          <Badge variant={enabled ? "default" : "secondary"} className="mt-1 text-[10px]">{enabled ? "Enabled" : "Disabled"}</Badge>
        </div>
      </div>
      <Switch checked={enabled} onCheckedChange={onChange} />
    </div>
  );
}

function Stat({ label, value, hint }: { label: string; value: number | string; hint?: string }) {
  return (
    <div className="rounded-lg border p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-xl font-bold mt-1">{value}</p>
      {hint && <p className="text-[10px] text-muted-foreground mt-0.5">{hint}</p>}
    </div>
  );
}
