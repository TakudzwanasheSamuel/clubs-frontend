"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import type { Club } from '@/types';
import { Edit, PlusCircle, Eye, Users, Settings, ListChecks, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/contexts/auth-context';

const ManagedClubCard = ({ club }: { club: Club }) => (
  <Card className="shadow-xl mb-8">
    <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-6 bg-card-foreground/5 rounded-t-lg">
      <Image
        src={club.logoUrl}
        alt={`${club.name} logo`}
        width={80}
        height={80}
        className="rounded-lg border-2 border-background shadow-md"
      />
      <div className="flex-1">
        <CardTitle className="text-2xl font-bold text-primary">{club.name}</CardTitle>
        <CardDescription className="text-muted-foreground">{club.category.name}</CardDescription>
        <div className="flex items-center text-sm text-muted-foreground mt-1">
          <Users className="w-4 h-4 mr-1.5" />
          {club.memberCount} members
        </div>
      </div>
      <div className="flex flex-col sm:flex-row gap-2 mt-4 sm:mt-0">
          <Button variant="outline" asChild>
            <Link href={`/clubs/${club.slug}`}>
                <Eye className="mr-2 h-4 w-4" /> View Public Page
            </Link>
        </Button>
        <Button asChild>
          <Link href={`/clubs/${club.slug}/edit`}>
            <Edit className="mr-2 h-4 w-4" /> Edit Club Details
          </Link>
        </Button>
      </div>
    </CardHeader>
    <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-lg">Content Creation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button className="w-full" variant="secondary" asChild>
            <Link href={`/events/create?clubId=${club.id}`}>
              <PlusCircle className="mr-2 h-4 w-4" /> Create New Event
            </Link>
          </Button>
          <Button className="w-full" variant="secondary" asChild>
            <Link href={`/news/create?clubId=${club.id}`}>
              <PlusCircle className="mr-2 h-4 w-4" /> Create New Post
            </Link>
          </Button>
        </CardContent>
      </Card>
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-lg">Quick Stats</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p><strong>Upcoming Events:</strong> {club.events?.length || 0}</p>
          <p><strong>Recent Posts:</strong> {club.posts?.length || 0}</p>
          <p><strong>Membership Requests:</strong> 0 (Placeholder)</p>
        </CardContent>
      </Card>
    </CardContent>
    <CardFooter className="p-6 border-t">
        <p className="text-xs text-muted-foreground">
            Managing club: {club.name}. For support, contact site administrators.
        </p>
    </CardFooter>
  </Card>
);

export default function MyClubManagementPage() {
  const [managedClubs, setManagedClubs] = useState<Club[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { token, isLoading: authLoading } = useAuth();

  useEffect(() => {
    const fetchManagedClubs = async () => {
      if (!token || authLoading) return;
      
      setIsLoading(true);
      try {
        const response = await fetch('/api/my-clubs/led', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!response.ok) throw new Error('Failed to fetch managed clubs');

        // We need full club details, so we fetch each one.
        // A better API might provide all details in one go.
        const ledClubSummaries = await response.json();
        const clubPromises = ledClubSummaries.map((summary: {slug: string}) =>
            fetch(`/api/clubs/${summary.slug}`).then(res => {
                if (!res.ok) throw new Error(`Failed to fetch details for ${summary.slug}`);
                return res.json();
            })
        );
        const clubsData = await Promise.all(clubPromises);
        setManagedClubs(clubsData);

      } catch (error) {
        toast({ title: "Error", description: "Could not load your club data.", variant: "destructive" });
      } finally {
        setIsLoading(false);
      }
    };
    fetchManagedClubs();
  }, [token, authLoading, toast]);

  const renderLoadingState = () => (
    <Card className="shadow-xl mb-8">
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-6">
        <Skeleton className="h-[80px] w-[80px] rounded-lg" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-4 w-1/4" />
        </div>
      </CardHeader>
      <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <Skeleton className="h-[150px] w-full" />
        <Skeleton className="h-[150px] w-full" />
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto py-2">
      <div className="flex items-center mb-6">
        <Settings className="h-8 w-8 text-primary mr-3" />
        <h1 className="text-3xl font-bold tracking-tight text-foreground">My Club Management</h1>
      </div>
      <p className="text-muted-foreground mb-8">
        Oversee and manage your club's details, events, and posts.
      </p>

             {authLoading ? (
         <div className="text-center py-12">
           <p className="text-muted-foreground">Loading authentication...</p>
         </div>
       ) : !token ? (
         <div className="text-center py-12">
           <Card className="text-center py-12 shadow">
             <CardHeader>
               <Settings className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
               <CardTitle className="text-xl text-muted-foreground">Please log in to manage clubs</CardTitle>
             </CardHeader>
             <CardContent>
               <p className="text-sm text-muted-foreground">You need to be logged in to manage your clubs.</p>
             </CardContent>
           </Card>
         </div>
       ) : isLoading ? (
         renderLoadingState()
       ) : managedClubs.length > 0 ? (
         managedClubs.map(club => <ManagedClubCard key={club.id} club={club} />)
       ) : (
        <Card className="text-center py-12 shadow">
          <CardHeader>
            <ListChecks className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <CardTitle className="text-xl text-muted-foreground">No Clubs Managed</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">You are not currently managing any clubs. If you believe this is an error, please contact an administrator.</p>
            <Button asChild className="mt-4">
              <Link href="/clubs/create">Propose a New Club</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}