import { EventCard } from '@/components/events/event-card';
import { mockEvents } from '@/lib/mock-data';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PlusCircle, Search, Filter } from 'lucide-react';

export default function EventCalendarPage() {
  // Simple separation, in real app this would be more robust
  const upcomingEvents = mockEvents.filter(event => new Date(event.date) >= new Date() && event.status !== 'past' && event.status !== 'cancelled').sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const pastEvents = mockEvents.filter(event => new Date(event.date) < new Date() || event.status === 'past').sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="container mx-auto py-2">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Event Calendar</h1>
         <Button asChild variant="default">
          <Link href="/events/create"> {/* Placeholder for create event page */}
            <PlusCircle className="mr-2 h-5 w-5" /> Create Event
          </Link>
        </Button>
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
        {upcomingEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No upcoming events scheduled at the moment. Check back soon!</p>
        )}
      </section>

      <Separator className="my-10" />

      <section>
        <h2 className="text-2xl font-semibold text-foreground mb-4">Past Events</h2>
        {pastEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pastEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No past events to display.</p>
        )}
      </section>
    </div>
  );
}
