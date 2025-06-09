
"use client";

import { useState, useEffect } from 'react';
import { getClubBySlug, mockEvents, mockPosts, mockClubs } from '@/lib/mock-data';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { EventCard } from '@/components/events/event-card';
import { PostCard } from '@/components/news/post-card';
import { Facebook, Instagram, Twitter, Globe, Users, CalendarDays, BookOpen, Info, MessageSquare, Users2, Check, Loader2 } from 'lucide-react';
import type { ClubCategory, Club } from '@/types';
import { useToast } from "@/hooks/use-toast";

const getIconComponent = (iconName?: string): React.ElementType | null => {
  if (!iconName) return Info;
  const icons: { [key: string]: React.ElementType } = {
    BookOpen,
    HeartHandshake: Users2,
    Palette: BookOpen,
    Bike: Users2,
    Laptop: Users2,
    Briefcase: Users2
  };
  return icons[iconName] || Info;
};

export default function ClubDetailPage({ params }: { params: { slug: string } }) {
  const [club, setClub] = useState<Club | null>(null);
  const [isMember, setIsMember] = useState(false);
  const [isProcessingJoin, setIsProcessingJoin] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const foundClub = getClubBySlug(params.slug);
    if (foundClub) {
      setClub(foundClub);
      // In a real app, you'd fetch membership status
      // For simulation, let's assume not a member initially for some clubs
      setIsMember(foundClub.id === '1'); // Example: already a member of coding club
    } else {
      notFound();
    }
  }, [params.slug]);

  if (!club) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  const handleJoinClub = async () => {
    setIsProcessingJoin(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    setIsMember(!isMember);
    setIsProcessingJoin(false);

    toast({
      title: !isMember ? `Successfully Joined ${club.name}!` : `Left ${club.name}`,
      description: !isMember
        ? `Welcome to ${club.name}.`
        : `You are no longer a member of ${club.name}.`,
      variant: "default",
    });
  };


  const clubEvents = mockEvents.filter(event => event.clubId === club.id).slice(0, 2);
  const clubPosts = mockPosts.filter(post => post.clubId === club.id).slice(0, 2);
  const CategoryIcon = getIconComponent(club.category.icon);

  return (
    <div className="container mx-auto py-8">
      {club.bannerImageUrl && (
        <div className="relative w-full h-64 md:h-80 rounded-lg overflow-hidden shadow-lg mb-8">
          <Image
            src={club.bannerImageUrl}
            alt={`${club.name} banner`}
            fill
            style={{ objectFit: 'cover' }}
            priority
            data-ai-hint="club event banner"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card className="shadow-xl overflow-hidden">
            <CardHeader className="bg-card p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <Image
                  src={club.logoUrl}
                  alt={`${club.name} logo`}
                  width={100}
                  height={100}
                  className="rounded-lg border-4 border-background shadow-md"
                  data-ai-hint="club logo profile"
                />
                <div className="flex-1">
                  <CardTitle className="text-3xl font-bold text-primary">{club.name}</CardTitle>
                  <div className="flex items-center gap-2 text-muted-foreground mt-1">
                     {CategoryIcon && <CategoryIcon className="w-5 h-5" />}
                    <span>{club.category.name}</span>
                  </div>
                </div>
                <Button 
                  size="lg" 
                  className="bg-accent hover:bg-accent/90 text-accent-foreground mt-4 sm:mt-0"
                  onClick={handleJoinClub}
                  disabled={isProcessingJoin}
                  variant={isMember ? "outline" : "default"}
                >
                  {isProcessingJoin ? (
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  ) : isMember ? (
                    <Check className="mr-2 h-5 w-5" />
                  ) : null}
                  {isProcessingJoin
                    ? (isMember ? "Leaving..." : "Joining...")
                    : isMember
                      ? "Leave Club"
                      : "Join Club"}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">About Us</h3>
                <p className="text-muted-foreground leading-relaxed">{club.description}</p>
              </div>

              {club.meetingSchedule && (
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2 flex items-center">
                    <CalendarDays className="w-5 h-5 mr-2 text-primary" />
                    Meeting Schedule
                  </h3>
                  <p className="text-muted-foreground">{club.meetingSchedule}</p>
                </div>
              )}
              
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2 flex items-center">
                  <Users className="w-5 h-5 mr-2 text-primary" />
                  Members
                </h3>
                <p className="text-muted-foreground">{club.memberCount + (isMember && club.id !=='1' ? 1 : (club.id === '1' && !isMember ? -1 : 0) )} members</p>
              </div>

              {club.socialLinks && (
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Connect With Us</h3>
                  <div className="flex space-x-4">
                    {club.socialLinks.facebook && <Button variant="outline" size="icon" asChild><Link href={club.socialLinks.facebook} target="_blank"><Facebook /></Link></Button>}
                    {club.socialLinks.instagram && <Button variant="outline" size="icon" asChild><Link href={club.socialLinks.instagram} target="_blank"><Instagram /></Link></Button>}
                    {club.socialLinks.twitter && <Button variant="outline" size="icon" asChild><Link href={club.socialLinks.twitter} target="_blank"><Twitter /></Link></Button>}
                    {club.socialLinks.website && <Button variant="outline" size="icon" asChild><Link href={club.socialLinks.website} target="_blank"><Globe /></Link></Button>}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-foreground">Recent Events</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {clubEvents.length > 0 ? (
                clubEvents.map(event => (
                  <div key={event.id} className="p-3 border rounded-md hover:bg-muted/50">
                    <Link href={`/events/${event.slug}`} className="block">
                      <h4 className="font-medium text-primary">{event.title}</h4>
                      <p className="text-xs text-muted-foreground">{new Date(event.date).toLocaleDateString()} - {event.location}</p>
                    </Link>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No recent events.</p>
              )}
              {mockEvents.filter(event => event.clubId === club.id).length > 2 && (
                 <Button variant="link" asChild className="text-primary p-0 h-auto">
                    <Link href={`/events?clubId=${club.id}`}>View all events</Link>
                 </Button>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-foreground">Latest Posts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {clubPosts.length > 0 ? (
                clubPosts.map(post => (
                   <div key={post.id} className="p-3 border rounded-md hover:bg-muted/50">
                    <Link href={`/news/${post.slug}`} className="block">
                      <h4 className="font-medium text-primary">{post.title}</h4>
                      <p className="text-xs text-muted-foreground">By {post.author.name} - {new Date(post.publishDate).toLocaleDateString()}</p>
                    </Link>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No recent posts.</p>
              )}
               {mockPosts.filter(post => post.clubId === club.id).length > 2 && (
                 <Button variant="link" asChild className="text-primary p-0 h-auto">
                    <Link href={`/news?clubId=${club.id}`}>View all posts</Link>
                 </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// generateStaticParams removed as this is now a client component
// export async function generateStaticParams() {
//   const clubSlugs = mockClubs.map(club => ({ slug: club.slug }));
//   return clubSlugs;
// }
