import { ClubCard } from '@/components/clubs/club-card';
import { mockClubs } from '@/lib/mock-data';
import { Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function MyMembershipsPage() {
  // Simulate fetching user's clubs. In a real app, this would be dynamic.
  const userClubs = mockClubs.slice(0, 2); // Example: user is member of first two clubs

  return (
    <div className="container mx-auto py-2">
      <div className="flex items-center mb-6">
        <Users className="h-8 w-8 text-primary mr-3" />
        <h1 className="text-3xl font-bold tracking-tight text-foreground">My Club Memberships</h1>
      </div>
      <p className="text-muted-foreground mb-8">
        Manage your club memberships and see updates from clubs you've joined.
      </p>

      {userClubs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {userClubs.map((club) => (
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
                <p className="text-sm text-muted-foreground">Explore the <a href="/" className="text-primary hover:underline">Club Directory</a> to find clubs that interest you!</p>
            </CardContent>
        </Card>
      )}
    </div>
  );
}
