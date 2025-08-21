"use client";

import { useState, useEffect } from 'react';
import { ClubCard } from '@/components/clubs/club-card';
import { Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Club } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';

export default function MyMembershipsPage() {
  const [memberClubs, setMemberClubs] = useState<Club[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMemberClubs = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/my-memberships');
        if (!response.ok) {
          throw new Error('Failed to fetch your club memberships');
        }
        const data: Club[] = await response.json();
        setMemberClubs(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setIsLoading(false);
      }
    };
    fetchMemberClubs();
  }, []);

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

  return (
    <div className="container mx-auto py-2">
      <div className="flex items-center mb-6">
        <Users className="h-8 w-8 text-primary mr-3" />
        <h1 className="text-3xl font-bold tracking-tight text-foreground">My Club Memberships</h1>
      </div>
      <p className="text-muted-foreground mb-8">
        Manage your club memberships and see updates from clubs you've joined.
      </p>

      {isLoading ? (
        renderLoadingState()
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : memberClubs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {memberClubs.map((club) => (
            <ClubCard key={club.id} club={club} />
          ))}
        </div>
      ) : (
        <Card className="text-center py-12 shadow">
            <CardHeader>
                <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <CardTitle className="text-xl text-muted-foreground">You haven't joined any clubs yet.</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground">Explore the <Link href="/clubs-directory" className="text-primary hover:underline">Club Directory</Link> to find clubs that interest you!</p>
            </CardContent>
        </Card>
      )}
    </div>
  );
}
