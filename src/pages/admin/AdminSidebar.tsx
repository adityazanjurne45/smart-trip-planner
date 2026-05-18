import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard, Users, Map, Activity, BarChart3, Bell, Settings, Shield, ArrowLeft,
  CalendarCheck, Hotel, Tag, Star, Heart,
} from "lucide-react";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar,
} from "@/components/ui/sidebar";

const items = [
  { title: "Dashboard", url: "/admin", icon: LayoutDashboard, end: true },
  { title: "Users", url: "/admin/users", icon: Users },
  { title: "Trips", url: "/admin/trips", icon: Map },
  { title: "Activity Feed", url: "/admin/activity", icon: Activity },
  { title: "Analytics", url: "/admin/analytics", icon: BarChart3 },
  { title: "Notifications", url: "/admin/notifications", icon: Bell },
  { title: "Settings", url: "/admin/settings", icon: Settings },
];

export function AdminSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { pathname } = useLocation();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b">
        <div className="flex items-center gap-2 px-2 py-2">
          <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center shrink-0">
            <Shield className="w-5 h-5 text-primary-foreground" />
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="font-bold text-sm truncate">Travello AI</p>
              <p className="text-xs text-muted-foreground truncate">Admin Panel</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Manage</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const active = item.end ? pathname === item.url : pathname.startsWith(item.url);
                return (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton asChild isActive={active} tooltip={item.title}>
                      <NavLink to={item.url} end={item.end}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Back to App">
                  <NavLink to="/dashboard">
                    <ArrowLeft className="h-4 w-4" />
                    <span>Back to App</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
