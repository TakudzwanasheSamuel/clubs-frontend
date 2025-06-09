
"use client";

import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Bell, Search, Settings, UserCircle, LogOut } from "lucide-react";
import { Logo } from "@/components/logo";
import { useRouter } from 'next/navigation'; // Import useRouter

export function Header() {
  const { isMobile } = useSidebar();
  const router = useRouter(); // Initialize useRouter

  const handleLogout = () => {
    // In a real app, you'd also clear any auth tokens/session here
    router.push('/login');
  };

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 shadow-sm">
      {isMobile && (
        <>
          <SidebarTrigger className="text-foreground" />
          <Logo className="text-lg md:hidden" />
        </>
      )}
      {!isMobile && <div className="w-8" />} {/* Spacer for desktop when sidebar is icon only */}
      
      <div className="flex w-full items-center justify-end gap-4 md:ml-auto md:gap-2 lg:gap-4">
        {/* Search - Placeholder */}
        <Button variant="ghost" size="icon" className="rounded-full">
          <Search className="h-5 w-5 text-muted-foreground" />
          <span className="sr-only">Search</span>
        </Button>

        {/* Notifications - Placeholder */}
        <Button variant="ghost" size="icon" className="rounded-full">
          <Bell className="h-5 w-5 text-muted-foreground" />
          <span className="sr-only">Notifications</span>
        </Button>

        {/* User Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src="https://placehold.co/50x50.png" alt="User Avatar" data-ai-hint="user avatar small" />
                <AvatarFallback>
                  <UserCircle className="h-6 w-6 text-muted-foreground" />
                </AvatarFallback>
              </Avatar>
              <span className="sr-only">User menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <UserCircle className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}> {/* Add onClick handler */}
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
