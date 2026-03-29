import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Users, UserCheck, UserPlus, Search, Shield, Loader2, MapPin,
  BarChart3, ArrowLeft, RefreshCw,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AdminUser {
  user_id: string;
  full_name: string | null;
  email: string | null;
  home_city: string | null;
  travel_style: string | null;
  created_at: string;
}

const Admin = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [tripCounts, setTripCounts] = useState<Record<string, number>>({});
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        if (session?.user) {
          checkAdmin(session.user.id);
        } else {
          setLoading(false);
          navigate("/auth");
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        checkAdmin(session.user.id);
      } else {
        setLoading(false);
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const checkAdmin = async (userId: string) => {
    const { data } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .eq("role", "admin")
      .maybeSingle();

    if (data) {
      setIsAdmin(true);
      await fetchUsers();
    } else {
      setIsAdmin(false);
      toast({
        title: "Access Denied",
        description: "You do not have admin privileges.",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  const fetchUsers = async () => {
    const { data: profiles } = await supabase
      .from("profiles")
      .select("user_id, full_name, email, home_city, travel_style, created_at")
      .order("created_at", { ascending: false });

    if (profiles) {
      setUsers(profiles);
      // Fetch trip counts
      const { data: trips } = await supabase
        .from("past_trips")
        .select("user_id");
      if (trips) {
        const counts: Record<string, number> = {};
        trips.forEach((t) => {
          counts[t.user_id] = (counts[t.user_id] || 0) + 1;
        });
        setTripCounts(counts);
      }
    }
  };

  const filteredUsers = users.filter((u) => {
    const q = searchQuery.toLowerCase();
    return (
      !q ||
      u.full_name?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      u.home_city?.toLowerCase().includes(q)
    );
  });

  const recentSignups = users.filter((u) => {
    const d = new Date(u.created_at);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return d > weekAgo;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="p-8 text-center">
            <Shield className="w-16 h-16 text-destructive mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-foreground mb-2">Access Denied</h2>
            <p className="text-muted-foreground mb-6">You don't have admin privileges to access this page.</p>
            <Button onClick={() => navigate("/dashboard")} className="gap-2">
              <ArrowLeft className="w-4 h-4" /> Go to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary/20">
      {/* Admin Header */}
      <header className="bg-background border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <Shield className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-bold text-foreground">Travello Admin</h1>
              <p className="text-xs text-muted-foreground">Management Panel</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-1" onClick={fetchUsers}>
              <RefreshCw className="w-4 h-4" /> Refresh
            </Button>
            <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")}>
              <ArrowLeft className="w-4 h-4 mr-1" /> Dashboard
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{users.length}</p>
                <p className="text-sm text-muted-foreground">Total Users</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                <UserCheck className="w-6 h-6 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {users.filter((u) => tripCounts[u.user_id]).length}
                </p>
                <p className="text-sm text-muted-foreground">Active Users</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-travel-forest/10 flex items-center justify-center">
                <UserPlus className="w-6 h-6 text-travel-forest" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{recentSignups.length}</p>
                <p className="text-sm text-muted-foreground">Recent Signups (7d)</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* User Management */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-primary" />
                User Management
              </CardTitle>
              <div className="relative w-full md:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 rounded-xl"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>City</TableHead>
                    <TableHead>Style</TableHead>
                    <TableHead>Trips</TableHead>
                    <TableHead>Joined</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                        No users found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredUsers.map((u) => (
                      <TableRow key={u.user_id}>
                        <TableCell className="font-medium">
                          {u.full_name || "—"}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {u.email || "—"}
                        </TableCell>
                        <TableCell>
                          {u.home_city ? (
                            <span className="flex items-center gap-1 text-sm">
                              <MapPin className="w-3 h-3" /> {u.home_city}
                            </span>
                          ) : "—"}
                        </TableCell>
                        <TableCell>
                          {u.travel_style ? (
                            <Badge variant="secondary" className="capitalize">
                              {u.travel_style}
                            </Badge>
                          ) : "—"}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{tripCounts[u.user_id] || 0}</Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm">
                          {new Date(u.created_at).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Admin;
