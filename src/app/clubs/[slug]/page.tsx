
"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound, useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Facebook, Instagram, Twitter, Globe, Users, CalendarDays, BookOpen, Info, Users2, Check, Loader2 } from 'lucide-react';
import type { Club } from '@/types';
import { useToast } from "@/hooks/use-toast";
import { DEFAULT_IMAGES } from '@/lib/constants';

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

export default function ClubDetailPage() {
  const params = useParams();
  const slug = typeof params.slug === 'string' ? params.slug : '';
  const [club, setClub] = useState<Club | null>(null);
  const [isMember, setIsMember] = useState(false);
  const [isProcessingJoin, setIsProcessingJoin] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (!slug) return;

    const fetchClubData = async () => {
      try {
        const response = await fetch(`/api/clubs/${slug}`);
        if (!response.ok) {
          if (response.status === 404) notFound();
          throw new Error('Failed to fetch club data');
        }
        const data: Club = await response.json();
        setClub(data);
        setIsMember(data.isMember || false);
      } catch (error) {
        console.error(error);
        toast({ title: "Error", description: "Could not load club details.", variant: "destructive" });
      }
    };

    fetchClubData();
  }, [slug, toast]);

  if (!club) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  const handleJoinClub = async () => {
    setIsProcessingJoin(true);
    try {
      const response = await fetch(`/api/clubs/${slug}/membership`, {
        method: isMember ? 'DELETE' : 'POST',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update membership');
      }

      const newIsMember = !isMember;
      setIsMember(newIsMember);

      // Optimistically update member count
      setClub(prevClub => {
        if (!prevClub) return null;
        return {
          ...prevClub,
          memberCount: prevClub.memberCount + (newIsMember ? 1 : -1),
        };
      });

      toast({
        title: newIsMember ? `Successfully Joined ${club.name}!` : `Left ${club.name}`,
      });

    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An unknown error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsProcessingJoin(false);
    }
  };

  const CategoryIcon = getIconComponent(club.category.icon);

  return (
    <div className="container mx-auto py-8">
      <div className="relative w-full h-64 md:h-80 rounded-lg overflow-hidden shadow-lg mb-8">
        <Image
          src={club.bannerImageUrl || DEFAULT_IMAGES.CLUB_BANNER}
          alt={`${club.name} banner`}
          fill
          style={{ objectFit: 'cover' }}
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card className="shadow-xl overflow-hidden">
            <CardHeader className="bg-card p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <Image
                  src={club.logoUrl || DEFAULT_IMAGES.CLUB_LOGO}
                  alt={`${club.name} logo`}
                  width={100}
                  height={100}
                  className="rounded-lg border-4 border-background shadow-md"
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
                <p className="text-muted-foreground">{club.memberCount} members</p>
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
              {club.events && club.events.length > 0 ? (
                club.events.map(event => (
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
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-foreground">Latest Posts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {club.posts && club.posts.length > 0 ? (
                club.posts.map(post => (
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
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
