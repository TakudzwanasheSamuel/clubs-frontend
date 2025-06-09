"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
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
  Settings // Using Settings icon for Club Management
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import React from 'react';

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  tooltip?: string;
  role?: 'student' | 'club_lead' | 'admin'; // Role-based visibility
}

const navItems: NavItem[] = [
  { href: '/clubs-directory', label: 'Club Directory', icon: LayoutGrid, tooltip: 'Browse Clubs', role: 'student' },
  { href: '/events', label: 'Event Calendar', icon: CalendarDays, tooltip: 'Upcoming Events', role: 'student' },
  { href: '/news', label: 'Newsfeed', icon: Newspaper, tooltip: 'Latest Updates', role: 'student' },
  { href: '/my-memberships', label: 'My Memberships', icon: Users, tooltip: 'Your Clubs', role: 'student' },
  { href: '/my-club-management', label: 'My Club Mgmt', icon: Settings, tooltip: 'Manage Your Club', role: 'club_lead' },
  { href: '/admin/dashboard', label: 'Admin Dashboard', icon: ShieldCheck, tooltip: 'Admin Area', role: 'admin' },
];

export function SidebarNav() {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = React.useState(true); 

  React.useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500); 
    return () => clearTimeout(timer);
  }, []);

  // Simulate user role. In a real app, this would come from an auth context.
  // For demonstration, let's assume the user is a 'club_lead' to show more links.
  // Change to 'student' or 'admin' to test role-based visibility.
  const userRole: 'student' | 'club_lead' | 'admin' = 'club_lead'; 

  const filteredNavItems = navItems.filter(item => {
    if (item.role === 'student') return true; // All users see student links
    if (item.role === 'club_lead' && (userRole === 'club_lead' || userRole === 'admin')) return true;
    if (item.role === 'admin' && userRole === 'admin') return true;
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
      {filteredNavItems.map((item) => (
        <SidebarMenuItem key={item.href}>
          <Link href={item.href} passHref legacyBehavior>
            <SidebarMenuButton
              isActive={pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))}
              tooltip={{ children: item.tooltip || item.label, className: "bg-sidebar-accent text-sidebar-accent-foreground" }}
              className={cn(
                (pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href)))
                  ? "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90" 
                  : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                "text-sm"
              )}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}