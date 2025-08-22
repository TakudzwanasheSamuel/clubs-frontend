
"use client";

import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';

export function LogoutButton() {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <Button 
      variant="ghost" 
      onClick={handleLogout} 
      className="w-full justify-start gap-2 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors duration-200"
    >
      <LogOut className="h-5 w-5" />
      <span className="group-data-[collapsible=icon]:hidden">Logout</span>
    </Button>
  );
}
