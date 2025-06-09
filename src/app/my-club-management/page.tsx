"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { mockClubs, getClubById } from '@/lib/mock-data'; // Assuming first club is managed by current user
import type { Club } from '@/types';
import { Edit, PlusCircle, Eye, Users, Settings, ListChecks } from 'lucide-react';

// Simulate fetching clubs managed by the current user.
// In a real app, this would come from user authentication and backend data.
const MANAGED_CLUB_ID = '1'; // Example: current user manages 'MSU Coding Club'

export default function MyClubManagementPage() {
  const [managedClub, setManagedClub] = useState<Club | null>(null);

  useEffect(() => {
    // Simulate fetching the club details for the managed club
    // In a real app, you'd fetch based on the logged-in user's managed club IDs
    const club = getClubById(MANAGED_CLUB_ID); // Using ID '1' as the example managed club
    if (club) {
      setManagedClub(club);
    }
  }, []);

  if (!managedClub) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center mb-6">
          <Settings className="h-8 w-8 text-primary mr-3" />
          <h1 className="text-3xl font-bold tracking-tight text-foreground">My Club Management</h1>
        </div>
        <Card className="text-center py-12 shadow">
          <CardHeader>
            <ListChecks className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <CardTitle className="text-xl text-muted-foreground">No Clubs Managed</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">You are not currently managing any clubs. If you believe this is an error, please contact an administrator.</p>
            <Button asChild className="mt-4">
              <Link href="/clubs-directory">Explore Clubs</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-2">
      <div className="flex items-center mb-6">
        <Settings className="h-8 w-8 text-primary mr-3" />
        <h1 className="text-3xl font-bold tracking-tight text-foreground">My Club Management</h1>
      </div>
      <p className="text-muted-foreground mb-8">
        Oversee and manage your club's details, events, and posts.
      </p>

      <Card className="shadow-xl">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-6 bg-card-foreground/5 rounded-t-lg">
          <Image
            src={managedClub.logoUrl}
            alt={`${managedClub.name} logo`}
            width={80}
            height={80}
            className="rounded-lg border-2 border-background shadow-md"
            data-ai-hint="club logo profile"
          />
          <div className="flex-1">
            <CardTitle className="text-2xl font-bold text-primary">{managedClub.name}</CardTitle>
            <CardDescription className="text-muted-foreground">{managedClub.category.name}</CardDescription>
            <div className="flex items-center text-sm text-muted-foreground mt-1">
              <Users className="w-4 h-4 mr-1.5" />
              {managedClub.memberCount} members
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 mt-4 sm:mt-0">
             <Button variant="outline" asChild>
                <Link href={`/clubs/${managedClub.slug}`}>
                    <Eye className="mr-2 h-4 w-4" /> View Public Page
                </Link>
            </Button>
            <Button asChild>
              <Link href={`/clubs/${managedClub.slug}/edit`}>
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
                <Link href="/events/create"> {/* TODO: Pre-fill clubId for this club */}
                  <PlusCircle className="mr-2 h-4 w-4" /> Create New Event
                </Link>
              </Button>
              <Button className="w-full" variant="secondary" asChild>
                <Link href="/news/create"> {/* TODO: Pre-fill clubId for this club */}
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
              <p><strong>Upcoming Events:</strong> 3 (Placeholder)</p>
              <p><strong>Recent Posts:</strong> 5 (Placeholder)</p>
              <p><strong>Membership Requests:</strong> 0 (Placeholder)</p>
            </CardContent>
          </Card>
        </CardContent>
        <CardFooter className="p-6 border-t">
            <p className="text-xs text-muted-foreground">
                Managing club: {managedClub.name}. For support, contact site administrators.
            </p>
        </CardFooter>
      </Card>
    </div>
  );
}