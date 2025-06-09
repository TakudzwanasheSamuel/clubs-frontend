import type { Event } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarDays, MapPin, Tag, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

type EventCardProps = {
  event: Event;
};

export function EventCard({ event }: EventCardProps) {
  const eventDate = new Date(event.date);
  const formattedDate = eventDate.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Card className="flex flex-col h-full shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg overflow-hidden">
      {event.coverImageUrl && (
        <div className="w-full h-48 relative">
          <Image
            src={event.coverImageUrl}
            alt={`${event.title} cover image`}
            layout="fill"
            objectFit="cover"
            className="rounded-t-lg"
            data-ai-hint="event cover"
          />
        </div>
      )}
      <CardHeader className="p-4">
        <Link href={`/events/${event.slug}`}>
          <CardTitle className="text-xl font-semibold text-primary hover:underline line-clamp-2">
            {event.title}
          </CardTitle>
        </Link>
        {event.status && (
          <Badge 
            variant={event.status === 'upcoming' ? 'default' : event.status === 'past' ? 'secondary' : 'outline'} 
            className="mt-1 w-fit"
          >
            {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
          </Badge>
        )}
      </CardHeader>
      <CardContent className="p-4 flex-grow space-y-2">
        <div className="flex items-center text-sm text-muted-foreground">
          <CalendarDays className="w-4 h-4 mr-2 text-accent" />
          <span>{formattedDate} at {event.time}</span>
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <MapPin className="w-4 h-4 mr-2 text-accent" />
          <span>{event.location}</span>
        </div>
         <div className="flex items-center text-sm text-muted-foreground">
          <Tag className="w-4 h-4 mr-2 text-accent" />
          <span>Hosted by: <Link href={`/clubs/${event.clubId}`} className="text-primary hover:underline">{event.clubName}</Link></span>
        </div>
        <CardDescription className="text-sm text-muted-foreground line-clamp-3 pt-2">
          {event.description}
        </CardDescription>
      </CardContent>
      <CardFooter className="p-4 border-t">
        <div className="flex justify-between items-center w-full">
          <Button variant="default" size="sm" className="bg-primary hover:bg-primary/90">
             <Link href={`/events/${event.slug}`}>View Details</Link>
          </Button>
          <Button variant="outline" size="sm">
            RSVP
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
