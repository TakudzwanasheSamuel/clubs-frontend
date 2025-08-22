"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound, useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, MapPin, Users, Info, Clock, Loader2, Check } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import type { Event } from '@/types';

export default function EventDetailPage() {
  const params = useParams();
  const slug = typeof params.slug === 'string' ? params.slug : '';
  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isRsvpd, setIsRsvpd] = useState(false);
  const [isProcessingRsvp, setIsProcessingRsvp] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (!slug) return;
    const fetchEvent = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/events/${slug}`);
        if (!res.ok) {
          if (res.status === 404) notFound();
          throw new Error('Failed to fetch event data');
        }
        const data: Event = await res.json();
        setEvent(data);
        // RSVP status would be fetched from a user-specific endpoint in a real app
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setIsLoading(false);
      }
    };
    fetchEvent();
  }, [slug]);

  const handleRsvpClick = async () => {
    if (!event) return;
    setIsProcessingRsvp(true);
    // Simulate API call for now
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsRsvpd(!isRsvpd);
    setIsProcessingRsvp(false);
    toast({
      title: !isRsvpd ? "Successfully RSVP'd!" : "RSVP Cancelled",
      description: `Your RSVP status for "${event.title}" has been updated.`,
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="container mx-auto py-8 text-center">
        <h1 className="text-2xl font-bold text-foreground">Event Not Found</h1>
        <p className="text-muted-foreground">{error || 'The event you are looking for does not exist.'}</p>
        <Button asChild className="mt-4">
          <Link href="/events">Back to Events</Link>
        </Button>
      </div>
    );
  }

  const eventDate = new Date(event.date);
  const formattedDate = eventDate.toLocaleDateString(undefined, {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  return (
    <div className="container mx-auto py-8">
      {event.coverImageUrl && (
        <div className="relative w-full h-64 md:h-96 rounded-lg overflow-hidden shadow-xl mb-8">
          <Image
            src={event.coverImageUrl}
            alt={`${event.title} cover image`}
            fill
            style={{ objectFit: 'cover' }}
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent p-6 flex flex-col justify-end">
            <h1 className="text-3xl md:text-4xl font-bold text-white shadow-text">{event.title}</h1>
            {event.status && (
              <Badge
                variant={event.status === 'upcoming' ? 'default' : event.status === 'past' ? 'secondary' : 'outline'}
                className="mt-2 w-fit bg-opacity-80 backdrop-blur-sm"
              >
                {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
              </Badge>
            )}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="shadow-lg">
            {!event.coverImageUrl && (
                <CardHeader>
                    <CardTitle className="text-3xl font-bold text-primary">{event.title}</CardTitle>
                     {event.status && (
                        <Badge
                            variant={event.status === 'upcoming' ? 'default' : event.status === 'past' ? 'secondary' : 'outline'}
                            className="mt-2 w-fit"
                        >
                            {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                        </Badge>
                    )}
                </CardHeader>
            )}
            <CardContent className="p-6 space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-foreground mb-2 flex items-center">
                  <Info className="w-5 h-5 mr-2 text-primary" />
                  Event Description
                </h2>
                <p className="text-muted-foreground leading-relaxed">{event.description}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2 flex items-center">
                    <CalendarDays className="w-5 h-5 mr-2 text-primary" /> Date
                  </h3>
                  <p className="text-muted-foreground">{formattedDate}</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2 flex items-center">
                    <Clock className="w-5 h-5 mr-2 text-primary" /> Time
                  </h3>
                  <p className="text-muted-foreground">{event.time}</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2 flex items-center">
                    <MapPin className="w-5 h-5 mr-2 text-primary" /> Location
                  </h3>
                  <p className="text-muted-foreground">{event.location}</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2 flex items-center">
                    <Users className="w-5 h-5 mr-2 text-primary" /> Hosted By
                  </h3>
                  <Link href={`/clubs/${event.clubId}`} className="text-primary hover:underline font-medium">
                    {event.clubName}
                  </Link>
                </div>
              </div>

              <div className="mt-8">
                <Button
                  size="lg"
                  className="w-full md:w-auto"
                  variant={isRsvpd ? "outline" : "default"}
                  onClick={handleRsvpClick}
                  disabled={isProcessingRsvp || event.status === 'past' || event.status === 'cancelled'}
                >
                  {isProcessingRsvp ? (
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  ) : isRsvpd ? (
                    <Check className="mr-2 h-5 w-5" />
                  ) : null}
                  {isProcessingRsvp
                    ? (isRsvpd ? "Cancelling..." : "RSVPing...")
                    : isRsvpd
                      ? "Cancel RSVP"
                      : "RSVP to this Event"}
                </Button>
                {(event.status === 'past' || event.status === 'cancelled') && (
                  <p className="text-sm text-muted-foreground mt-2">
                    RSVPs are closed for this event as it is {event.status}.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">About {event.clubName}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">
                This event is hosted by {event.clubName}.
              </p>
              <Button variant="outline" size="sm" asChild>
                <Link href={`/clubs/${event.clubId}`}>Visit Club Page</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
    

    