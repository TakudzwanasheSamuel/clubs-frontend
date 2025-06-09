
"use client";

import type { ChangeEvent } from 'react'; // Added for potential future use
import { useState, useEffect } from 'react';
import { mockEvents, mockClubs } from '@/lib/mock-data'; // Corrected: getEventById might not be needed if finding client-side. Ensure mockEvents is imported.
import Image from 'next/image';
import Link from 'next/link';
// `notFound` from `next/navigation` is for Server Components. Client components handle "not found" differently.
// We'll keep it for now but be mindful it won't work as expected on client-side navigation errors post-load.
import { notFound } from 'next/navigation'; 
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, MapPin, Users, Info, Clock, Loader2, Check } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

export default function EventDetailPage({ params }: { params: { slug: string } }) {
  const [isRsvpd, setIsRsvpd] = useState(false);
  const [isProcessingRsvp, setIsProcessingRsvp] = useState(false);
  const { toast } = useToast();

  // Find event client-side.
  // In a real app with a backend, you'd fetch this data, perhaps in a useEffect.
  const event = mockEvents.find(e => e.slug === params.slug || e.id === params.slug);

  // Handle case where event is not found after component mounts
  useEffect(() => {
    if (!event) {
      // This is a client-side "not found" state.
      // `notFound()` from next/navigation is primarily for server components.
      // For a client component, you might redirect or show a "not found" UI.
      console.error("Event not found on client side for slug:", params.slug);
      // Consider redirecting: router.push('/404'); or showing a message
    }
  }, [event, params.slug]);

  if (!event) {
     // Basic fallback if event is not found.
     // In a real app, you'd have better loading/error states.
    return (
      <div className="container mx-auto py-8 text-center">
        <h1 className="text-2xl font-bold text-foreground">Event Not Found</h1>
        <p className="text-muted-foreground">The event you are looking for does not exist or could not be loaded.</p>
        <Button asChild className="mt-4">
          <Link href="/events">Back to Events</Link>
        </Button>
      </div>
    );
  }

  const club = mockClubs.find(c => c.id === event.clubId);
  const eventDate = new Date(event.date);
  const formattedDate = eventDate.toLocaleDateString(undefined, {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  const handleRsvpClick = async () => {
    setIsProcessingRsvp(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    setIsRsvpd(!isRsvpd);
    setIsProcessingRsvp(false);

    toast({
      title: !isRsvpd ? "Successfully RSVP'd!" : "RSVP Cancelled", // Logic corrected: toast reflects the new state
      description: !isRsvpd
        ? `You are now attending "${event.title}".`
        : `Your RSVP for "${event.title}" has been cancelled.`,
      variant: "default",
    });
  };

  return (
    <div className="container mx-auto py-8">
      {/* Cover Image */}
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
        {/* Main Content */}
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

        {/* Sidebar/Related Info */}
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
          {/* Placeholder for related events or map */}
        </div>
      </div>
    </div>
  );
}

// Removed generateStaticParams as it conflicts with "use client"
// export async function generateStaticParams() {
//   // In a real app, fetch slugs from your data source
//   const eventSlugs = mockEvents.map(event => ({ slug: event.slug || event.id }));
//   return eventSlugs;
// }
    

    