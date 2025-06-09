import type { Club } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Tag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

type ClubCardProps = {
  club: Club;
};

export function ClubCard({ club }: ClubCardProps) {
  return (
    <Card className="flex flex-col h-full shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg overflow-hidden">
      <CardHeader className="p-0 relative">
        {club.bannerImageUrl && (
          <div className="w-full h-32 relative">
            <Image
              src={club.bannerImageUrl}
              alt={`${club.name} banner`}
              layout="fill"
              objectFit="cover"
              data-ai-hint="club banner"
            />
          </div>
        )}
        <div className={`p-4 ${club.bannerImageUrl ? 'absolute bottom-0 left-0 bg-gradient-to-t from-black/70 to-transparent w-full' : ''}`}>
          <div className="flex items-center gap-3">
            <Image
              src={club.logoUrl}
              alt={`${club.name} logo`}
              width={60}
              height={60}
              className="rounded-md border-2 border-background shadow-md"
              data-ai-hint="club logo"
            />
            <CardTitle className={`text-xl font-semibold ${club.bannerImageUrl ? 'text-white' : 'text-foreground'}`}>
              {club.name}
            </CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <CardDescription className="text-sm text-muted-foreground line-clamp-3 mb-2">
          {club.description}
        </CardDescription>
        <div className="flex items-center text-xs text-muted-foreground gap-2 mb-2">
          <Tag className="w-3 h-3" />
          <span>{club.category.name}</span>
        </div>
        <div className="flex items-center text-xs text-muted-foreground gap-2">
          <Users className="w-3 h-3" />
          <span>{club.memberCount} members</span>
        </div>
      </CardContent>
      <CardFooter className="p-4 border-t">
        <Button asChild variant="default" size="sm" className="w-full bg-primary hover:bg-primary/90">
          <Link href={`/clubs/${club.slug}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
