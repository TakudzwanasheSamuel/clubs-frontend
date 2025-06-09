
"use client";

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

export function LogoutButton() {
  const router = useRouter();

  const handleLogout = () => {
    // In a real app, you'd also clear any auth tokens/session here
    router.push('/login');
  };

  return (
    <Button 
      variant="ghost" 
      onClick={handleLogout} 
      className="w-full justify-start gap-2 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
    >
      <LogOut className="h-5 w-5" />
      <span className="group-data-[collapsible=icon]:hidden">Logout</span>
    </Button>
  );
}
