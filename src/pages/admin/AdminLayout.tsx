import { Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "./AdminSidebar";
import { AdminTopbar } from "./AdminTopbar";
import { Loader2 } from "lucide-react";
import { isAdminAuthed } from "./AdminLogin";

export default function AdminLayout() {
  const navigate = useNavigate();
  const [ok, setOk] = useState<boolean | null>(null);

  useEffect(() => {
    if (isAdminAuthed()) {
      setOk(true);
    } else {
      navigate("/admin-login", { replace: true });
    }
  }, [navigate]);

  if (!ok) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
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
