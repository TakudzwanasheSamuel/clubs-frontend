
"use client"; // Make this a client component to use hooks

import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation'; // For checking current route
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarInset,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/header";
import { SidebarNav } from "@/components/layout/sidebar-nav";
import { Logo } from "@/components/logo";
import { Settings } from "lucide-react";
import { LogoutButton } from "./logout-button";
import { MobileBottomNavigation } from './mobile-bottom-nav'; // Import mobile nav
import { useIsMobile } from '@/hooks/use-mobile'; // Import useIsMobile
import { useEffect, useState } from 'react'; // For mounted state
import { useAuth } from '@/contexts/auth-context';

type MainLayoutProps = {
  children: ReactNode;
};

export function MainLayout({ children }: MainLayoutProps) {
  const pathname = usePathname();
  const isMobile = useIsMobile();
  const [mounted, setMounted] = useState(false);
  const { user, isLoading } = useAuth();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Define public pages that can be viewed without authentication
  const publicPages = [
    '/',
    '/login', 
    '/register',
    '/clubs-directory',
    '/events',
    '/news'
  ];
  
  // Check if current path matches public page patterns (including dynamic routes)
  // Exclude creation pages from being treated as public so full navigation shows
  const isEventCreate = pathname === '/events/create' || pathname.startsWith('/events/create');
  const isClubCreate = pathname === '/clubs/create' || pathname.startsWith('/clubs/create');
  const isNewsCreate = pathname === '/news/create' || pathname.startsWith('/news/create');

  const isPublicDynamic = (
    (pathname.startsWith('/clubs/') && !isClubCreate) ||
    (pathname.startsWith('/events/') && !isEventCreate) ||
    (pathname.startsWith('/news/') && !isNewsCreate)
  );

  const isPublicPage = publicPages.includes(pathname) || isPublicDynamic;

  // Navigation Logic:
  // - Unauthenticated users: No navigation on any page
  // - Authenticated users: Full navigation (sidebar + header + mobile nav) on ALL pages
  const shouldHideNavigation = !user && !isLoading;

  // If user is not authenticated and on a public page, show only the content without navigation
  if (shouldHideNavigation && isPublicPage) {
    return <main className="flex-1">{children}</main>;
  }

  // If user is not authenticated and on a private page, redirect to login (this shouldn't happen with route protection)
  if (shouldHideNavigation && !isPublicPage) {
    return <main className="flex-1">{children}</main>;
  }



  return (
    <SidebarProvider defaultOpen={true}>
      <Sidebar collapsible="icon" variant="sidebar" side="left" className="border-r border-sidebar-border shadow-lg bg-sidebar text-sidebar-foreground">
        <SidebarHeader className="p-4 border-b border-sidebar-border">
          <Logo className="text-sidebar-foreground" />
        </SidebarHeader>
        <SidebarContent className="p-2">
          <SidebarNav />
        </SidebarContent>
        <SidebarFooter className="p-2 border-t border-sidebar-border">
          <Button variant="ghost" className="w-full justify-start gap-2 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors duration-200">
            <Settings className="h-5 w-5" />
            <span className="group-data-[collapsible=icon]:hidden">Settings</span>
          </Button>
          <LogoutButton />
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <Header />
        <main className={`flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 bg-secondary/50 ${isMobile && user ? 'pb-20' : 'md:pb-8'}`}>
          {children}
        </main>
        {/* Render MobileBottomNavigation only on mobile, if mounted, and user is authenticated */}
        {isMobile && mounted && user && <MobileBottomNavigation />}
      </SidebarInset>
    </SidebarProvider>
  );
}
