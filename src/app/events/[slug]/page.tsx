
"use client";

import { useState, useEffect } from 'react';
import { mockEvents, mockClubs } from '@/lib/mock-data';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, notFound } from 'next/navigation'; 
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, MapPin, Users, Info, Clock, Loader2, Check } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

export default function EventDetailPage() {
  const params = useParams();
  const slug = typeof params.slug === 'string' ? params.slug : '';

  const [isRsvpd, setIsRsvpd] = useState(false);
  const [isProcessingRsvp, setIsProcessingRsvp] = useState(false);
  const [formattedDate, setFormattedDate] = useState('');
  const { toast } = useToast();

  const event = mockEvents.find(e => e.slug === slug || e.id === slug);

  useEffect(() => {
    if (!event) {
      notFound();
    } else {
      const eventDate = new Date(event.date);
      setFormattedDate(eventDate.toLocaleDateString(undefined, {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
      }));
    }
  }, [event]);

  if (!event) {
    return (
      <div className="container mx-auto py-8 text-center">
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
             <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  const club = mockClubs.find(c => c.id === event.clubId);

  const handleRsvpClick = async () => {
    setIsProcessingRsvp(true);
    await new Promise(resolve => setTimeout(resolve, 1000));

    setIsRsvpd(!isRsvpd);
    setIsProcessingRsvp(false);

    toast({
      title: !isRsvpd ? "Successfully RSVP'd!" : "RSVP Cancelled",
      description: !isRsvpd
        ? `You are now attending "${event.title}".`
        : `Your RSVP for "${event.title}" has been cancelled.`,
      variant: "default",
    });
  };

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
            data-ai-hint="event detail cover"
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
                  <p className="text-muted-foreground">{formattedDate || 'Loading date...'}</p>
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
                {club && (
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2 flex items-center">
                      <Users className="w-5 h-5 mr-2 text-primary" /> Hosted By
                    </h3>
                    <Link href={`/clubs/${club.slug}`} className="text-primary hover:underline font-medium">
                      {club.name}
                    </Link>
                  </div>
                )}
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
          {club && (
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-semibold">About {club.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3 mb-3">
                  <Image src={club.logoUrl} alt={`${club.name} logo`} width={50} height={50} className="rounded-md" data-ai-hint="club logo small"/>
                  <p className="text-sm text-muted-foreground line-clamp-3">{club.description.substring(0,100)}...</p>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/clubs/${club.slug}`}>Visit Club Page</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
