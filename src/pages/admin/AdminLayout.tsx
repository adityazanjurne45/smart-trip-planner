import { Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAdminRole } from "@/hooks/useAdminRole";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "./AdminSidebar";
import { AdminTopbar } from "./AdminTopbar";
import { Loader2, Shield } from "lucide-react";
import { toast } from "sonner";

export default function AdminLayout() {
  const { isAdmin, loading, user } = useAdminRole();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;
    if (!user) { navigate("/auth"); return; }
    if (isAdmin === false) {
      toast.error("Access denied — admin only");
      navigate("/dashboard");
    }
  }, [isAdmin, loading, user, navigate]);

  if (loading || isAdmin !== true) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        {loading ? (
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
        ) : (
          <div className="text-center">
            <Shield className="w-12 h-12 text-destructive mx-auto mb-3" />
            <p className="text-muted-foreground">Redirecting…</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-secondary/20">
        <AdminSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 sticky top-0 z-30 flex items-center gap-2 border-b bg-background/95 backdrop-blur px-3">
            <SidebarTrigger />
            <AdminTopbar />
          </header>
          <main className="flex-1 p-4 md:p-6 overflow-x-hidden">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
