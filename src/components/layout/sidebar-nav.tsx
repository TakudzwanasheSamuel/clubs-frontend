"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/auth-context';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSkeleton,
} from '@/components/ui/sidebar';
import { 
  LayoutGrid, 
  CalendarDays, 
  Newspaper, 
  ShieldCheck,
  Users,
  Settings, // Using Settings icon for Club Management
  PlusCircle,
  Building2
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import React from 'react';

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  tooltip?: string;
  role?: 'student' | 'club_lead' | 'super_admin' | 'sdo_admin'; // Role-based visibility
}

const navItems: NavItem[] = [
  // Super Admin section (highest priority)
  { href: '/admin/dashboard', label: 'Super Admin Dashboard', icon: ShieldCheck, tooltip: 'Super Admin Area', role: 'super_admin' },
  { href: '/admin/users', label: 'User Management', icon: Users, tooltip: 'Manage All Users', role: 'super_admin' },
  { href: '/admin/manage-clubs', label: 'Manage Existing Clubs', icon: Building2, tooltip: 'Assign Leaders to Existing Clubs', role: 'super_admin' },
  
  // SDO Admin section
  { href: '/admin/sdo-dashboard', label: 'SDO Dashboard', icon: Building2, tooltip: 'SDO Admin Area', role: 'sdo_admin' },
  { href: '/admin/users', label: 'User Management', icon: Users, tooltip: 'Manage Users', role: 'sdo_admin' },
  { href: '/clubs/create', label: 'Create Club', icon: PlusCircle, tooltip: 'Create New Club', role: 'sdo_admin' },
  { href: '/admin/manage-clubs', label: 'Manage Existing Clubs', icon: Building2, tooltip: 'Assign Leaders to Existing Clubs', role: 'sdo_admin' },
  
  // Regular user section
  { href: '/clubs-directory', label: 'Club Directory', icon: LayoutGrid, tooltip: 'Browse Clubs', role: 'student' },
  { href: '/events', label: 'Event Calendar', icon: CalendarDays, tooltip: 'Upcoming Events', role: 'student' },
  { href: '/news', label: 'Newsfeed', icon: Newspaper, tooltip: 'Latest Updates', role: 'student' },
  { href: '/my-memberships', label: 'My Memberships', icon: Users, tooltip: 'Your Clubs', role: 'student' },
  { href: '/my-club-management', label: 'My Club Mgmt', icon: Settings, tooltip: 'Manage Your Club', role: 'club_lead' },
];

export function SidebarNav() {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = React.useState(true); 

  React.useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500); 
    return () => clearTimeout(timer);
  }, []);

  const { user } = useAuth();
  const userRole = user?.role || 'student'; 

  const filteredNavItems = navItems.filter(item => {
    if (item.role === 'student') return true; // All users see student links
    if (item.role === 'club_lead' && (userRole === 'club_lead' || userRole === 'super_admin' || userRole === 'sdo_admin')) return true;
    if (item.role === 'super_admin' && userRole === 'super_admin') return true;
    if (item.role === 'sdo_admin' && userRole === 'sdo_admin') return true;
    return false;
  });

  if (isLoading) {
    return (
      <SidebarMenu>
        {[...Array(5)].map((_, i) => (
          <SidebarMenuItem key={i}>
             <SidebarMenuSkeleton showIcon />
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    );
  }
  
  return (
    <SidebarMenu>
      {filteredNavItems.map((item, index) => (
        <React.Fragment key={item.href}>
          {/* Add separator after admin section */}
          {(index === 2 && userRole === 'super_admin') || (index === 3 && userRole === 'sdo_admin') ? (
            <div className="px-3 py-2">
              <div className="h-px bg-sidebar-border/50" />
            </div>
          ) : null}
          
          <SidebarMenuItem>
            <Link href={item.href} passHref legacyBehavior>
              <SidebarMenuButton
                isActive={pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))}
                tooltip={{ children: item.tooltip || item.label, className: "bg-sidebar-accent text-sidebar-accent-foreground" }}
                className={cn(
                  (pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href)))
                    ? "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90 font-medium" 
                    : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-sidebar-foreground",
                  "text-sm transition-colors duration-200"
                )}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        </React.Fragment>
      ))}
    </SidebarMenu>
  );
}