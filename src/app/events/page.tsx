"use client";

import { useState, useEffect } from 'react';
import { EventCard } from '@/components/events/event-card';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PlusCircle, Search, Filter, CalendarDays } from 'lucide-react';
import type { Event } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/contexts/auth-context';
import { Logo } from '@/components/logo';

export default function EventCalendarPage() {
  const { user } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/events/public');
        if (!response.ok) {
          throw new Error('Failed to fetch events');
        }
        const data: Event[] = await response.json();
        setEvents(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setIsLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const upcomingEvents = events.filter(event => new Date(event.date) >= new Date() && event.status !== 'past' && event.status !== 'cancelled').sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const pastEvents = events.filter(event => new Date(event.date) < new Date() || event.status === 'past').sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const renderLoadingState = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="flex flex-col space-y-3">
          <Skeleton className="h-[200px] w-full rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );

  const renderEventsList = (eventList: Event[], emptyMessage: string) => {
    if (eventList.length === 0) {
      return <p className="text-muted-foreground">{emptyMessage}</p>;
    }
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {eventList.map(event => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    );
  };

  const PublicHeader = () => (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center justify-between">
        <Logo />
        <nav className="flex items-center gap-4">
          <Button variant="ghost" asChild>
            <Link href="/">Home</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/clubs-directory">Clubs</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/news">News</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/login">Login</Link>
          </Button>
          <Button asChild>
            <Link href="/register">Sign Up</Link>
          </Button>
        </nav>
      </div>
    </header>
  );

  return (
    <div className="min-h-screen bg-background">
      {!user && <PublicHeader />}
      <div className="container mx-auto py-2">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <CalendarDays className="h-8 w-8 text-primary mr-3" />
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Event Calendar</h1>
          </div>
          {user && (user.role === 'super_admin' || user.role === 'sdo_admin') && (
            <Button asChild variant="default">
              <Link href="/events/create">
                <PlusCircle className="mr-2 h-5 w-5" /> Create Event
              </Link>
            </Button>
          )}
        </div>
      <p className="text-muted-foreground mb-6">
        Find out what's happening on campus. Join events, workshops, and more!
      </p>

      {/* Filters Placeholder */}
      <div className="mb-8 p-4 bg-card rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div className="md:col-span-2">
            <label htmlFor="search-events" className="block text-sm font-medium text-foreground mb-1">Search Events</label>
            <div className="relative">
              <Input id="search-events" type="text" placeholder="Search by title or description..." className="pl-10" />
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            </div>
          </div>
          <div>
            <label htmlFor="filter-event-type" className="block text-sm font-medium text-foreground mb-1">Filter by Type</label>
            <Select>
              <SelectTrigger id="filter-event-type">
                <Filter className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <SelectValue placeholder="All Event Types"  className="pl-5"/>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Event Types</SelectItem>
                <SelectItem value="workshop">Workshop</SelectItem>
                <SelectItem value="seminar">Seminar</SelectItem>
                <SelectItem value="social">Social</SelectItem>
                <SelectItem value="competition">Competition</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      
      <section>
        <h2 className="text-2xl font-semibold text-foreground mb-4">Upcoming Events</h2>
        {isLoading ? renderLoadingState() : error ? <p className="text-red-500">{error}</p> : renderEventsList(upcomingEvents, "No upcoming events scheduled at the moment. Check back soon!")}
      </section>

      <Separator className="my-10" />

      <section>
        <h2 className="text-2xl font-semibold text-foreground mb-4">Past Events</h2>
        {isLoading ? renderLoadingState() : error ? <p className="text-red-500">{error}</p> : renderEventsList(pastEvents, "No past events to display.")}
      </section>
      </div>
    </div>
  );
}
