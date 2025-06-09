
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

type MainLayoutProps = {
  children: ReactNode;
};

export function MainLayout({ children }: MainLayoutProps) {
  const pathname = usePathname();
  const isMobile = useIsMobile();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Define pages where the main app shell (sidebar, header, mobile nav) should be hidden
  const pagesWithoutAppShell = ['/', '/login', '/register'];
  const isAppShellHidden = pagesWithoutAppShell.includes(pathname);

  if (isAppShellHidden) {
    // Render only children for these pages
    return <main className="flex-1">{children}</main>;
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <Sidebar collapsible="icon" variant="sidebar" side="left" className="border-r border-sidebar-border shadow-md bg-sidebar text-sidebar-foreground">
        <SidebarHeader className="p-4 border-b border-sidebar-border">
          <Logo className="text-sidebar-foreground" />
        </SidebarHeader>
        <SidebarContent className="p-2">
          <SidebarNav />
        </SidebarContent>
        <SidebarFooter className="p-2 border-t border-sidebar-border">
          <Button variant="ghost" className="w-full justify-start gap-2 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
            <Settings className="h-5 w-5" />
            <span className="group-data-[collapsible=icon]:hidden">Settings</span>
          </Button>
          <LogoutButton />
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <Header />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 bg-secondary/50 pb-20 md:pb-8"> {/* Added padding-bottom for mobile nav */}
          {children}
        </main>
        {/* Render MobileBottomNavigation only on mobile and if mounted and not an auth page */}
        {isMobile && mounted && !isAppShellHidden && <MobileBottomNavigation />}
      </SidebarInset>
    </SidebarProvider>
  );
}
