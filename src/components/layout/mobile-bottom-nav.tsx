
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { LayoutGrid, CalendarDays, Newspaper, Users } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

const mobileNavItems: NavItem[] = [
  { href: '/', label: 'Directory', icon: LayoutGrid },
  { href: '/events', label: 'Events', icon: CalendarDays },
  { href: '/news', label: 'News', icon: Newspaper },
  { href: '/my-memberships', label: 'My Clubs', icon: Users },
];

export function MobileBottomNavigation() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/95 backdrop-blur-sm md:hidden">
      <div className="flex h-16 items-center justify-around">
        {mobileNavItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 p-2 rounded-md text-xs font-medium",
                isActive ? "text-primary" : "text-muted-foreground hover:text-primary"
              )}
            >
              <item.icon className={cn("h-5 w-5", isActive ? "text-primary" : "text-muted-foreground")} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
