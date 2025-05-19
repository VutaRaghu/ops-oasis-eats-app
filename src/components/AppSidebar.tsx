
import { 
  Sidebar, 
  SidebarContent, 
  SidebarFooter, 
  SidebarHeader, 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent
} from "@/components/ui/sidebar";

import { 
  Home, 
  Calendar, 
  User, 
  Menu, 
  Settings, 
  Plus,
  Search,
  LogOut
} from "lucide-react";

import { useLocation, Link } from "react-router-dom";

export function AppSidebar() {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <Sidebar>
      <SidebarHeader>
        <h2 className="text-xl font-bold px-4 py-2">Restaurant Ops</h2>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild className={isActive('/') ? 'bg-sidebar-accent' : ''}>
                  <Link to="/">
                    <Home className="w-5 h-5 mr-2" />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild className={isActive('/sales') ? 'bg-sidebar-accent' : ''}>
                  <Link to="/sales">
                    <Plus className="w-5 h-5 mr-2" />
                    <span>New Order</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild className={isActive('/catalog') ? 'bg-sidebar-accent' : ''}>
                  <Link to="/catalog">
                    <Menu className="w-5 h-5 mr-2" />
                    <span>Catalog</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild className={isActive('/expenses') ? 'bg-sidebar-accent' : ''}>
                  <Link to="/expenses">
                    <Calendar className="w-5 h-5 mr-2" />
                    <span>Expenses</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild className={isActive('/staff') ? 'bg-sidebar-accent' : ''}>
                  <Link to="/staff">
                    <User className="w-5 h-5 mr-2" />
                    <span>Staff</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <SidebarGroup>
          <SidebarGroupLabel>Admin</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild className={isActive('/reports') ? 'bg-sidebar-accent' : ''}>
                  <Link to="/reports">
                    <Search className="w-5 h-5 mr-2" />
                    <span>Reports</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild className={isActive('/settings') ? 'bg-sidebar-accent' : ''}>
                  <Link to="/settings">
                    <Settings className="w-5 h-5 mr-2" />
                    <span>Settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="p-4">
          <SidebarMenuButton asChild>
            <button className="w-full">
              <LogOut className="w-5 h-5 mr-2" />
              <span>Logout</span>
            </button>
          </SidebarMenuButton>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
