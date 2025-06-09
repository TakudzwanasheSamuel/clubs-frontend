import type { Post } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ThumbsUp, MessageCircle, CalendarDays, UserCircle, Tag } from 'lucide-react';

type PostCardProps = {
  post: Post;
};

export function PostCard({ post }: PostCardProps) {
  const publishDate = new Date(post.publishDate);
  const formattedDate = publishDate.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Card className="flex flex-col h-full shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg overflow-hidden">
      {post.featuredImageUrl && (
        <div className="w-full h-56 relative">
          <Image
            src={post.featuredImageUrl}
            alt={`${post.title} featured image`}
            layout="fill"
            objectFit="cover"
            className="rounded-t-lg"
            data-ai-hint="news article"
          />
        </div>
      )}
      <CardHeader className="p-4">
        <Badge variant="outline" className="w-fit mb-2 capitalize">{post.type.replace('_', ' ')}</Badge>
        <Link href={`/news/${post.slug}`}>
            <CardTitle className="text-xl font-semibold text-primary hover:underline line-clamp-2">
            {post.title}
            </CardTitle>
        </Link>
        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2">
          <Avatar className="h-6 w-6">
            <AvatarImage src={post.author.avatarUrl} alt={post.author.name} />
            <AvatarFallback>
              <UserCircle className="h-5 w-5" />
            </AvatarFallback>
          </Avatar>
          <span>{post.author.name}</span>
          <span>&bull;</span>
          <CalendarDays className="h-3 w-3" />
          <span>{formattedDate}</span>
        </div>
         <div className="text-xs text-muted-foreground mt-1">
           Posted by: <Link href={`/clubs/${post.clubId}`} className="text-primary hover:underline">{post.clubName}</Link>
         </div>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <CardDescription className="text-sm text-muted-foreground line-clamp-4">
          {post.content}
        </CardDescription>
      </CardContent>
      <CardFooter className="p-4 border-t flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
            <ThumbsUp className="w-4 h-4 mr-1" /> {post.likes}
          </Button>
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
            <MessageCircle className="w-4 h-4 mr-1" /> {post.commentsCount}
          </Button>
        </div>
        <Button asChild variant="outline" size="sm">
          <Link href={`/news/${post.slug}`}>Read More</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
