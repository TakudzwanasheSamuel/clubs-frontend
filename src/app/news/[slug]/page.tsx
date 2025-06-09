import { getPostBySlug, mockClubs, mockPosts } from '@/lib/mock-data';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, UserCircle, ThumbsUp, MessageCircle, Edit, Trash2, Tag } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea'; // For comment box

export default function PostDetailPage({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }
  
  const club = mockClubs.find(c => c.id === post.clubId);
  const publishDate = new Date(post.publishDate);
  const formattedDate = publishDate.toLocaleDateString(undefined, {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <Card className="shadow-xl overflow-hidden">
        {post.featuredImageUrl && (
          <div className="relative w-full h-64 md:h-96">
            <Image
              src={post.featuredImageUrl}
              alt={`${post.title} featured image`}
              layout="fill"
              objectFit="cover"
              priority
              data-ai-hint="article header"
            />
          </div>
        )}
        <CardHeader className="p-6">
          <Badge variant="secondary" className="w-fit mb-2 capitalize bg-accent text-accent-foreground">{post.type.replace('_', ' ')}</Badge>
          <CardTitle className="text-3xl md:text-4xl font-bold text-primary">{post.title}</CardTitle>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground mt-3">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={post.author.avatarUrl} alt={post.author.name} />
                <AvatarFallback><UserCircle className="h-6 w-6" /></AvatarFallback>
              </Avatar>
              <span>By {post.author.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4" />
              <span>{formattedDate}</span>
            </div>
            {club && (
              <div className="flex items-center gap-2">
                <Tag className="h-4 w-4" />
                <span>From: <Link href={`/clubs/${club.slug}`} className="text-primary hover:underline">{club.name}</Link></span>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-6 prose dark:prose-invert max-w-none prose-p:text-muted-foreground prose-headings:text-foreground">
          {/* Using a simple div for content rendering; for markdown, use a library */}
          <div dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br />') }} />
        </CardContent>
        <CardFooter className="p-6 border-t flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm">
              <ThumbsUp className="w-4 h-4 mr-2" /> Like ({post.likes})
            </Button>
            <Button variant="outline" size="sm">
              <MessageCircle className="w-4 h-4 mr-2" /> Comment ({post.commentsCount})
            </Button>
          </div>
          {/* Placeholder for admin actions */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
              <Edit className="w-4 h-4 mr-1" /> Edit
            </Button>
            <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive/80">
              <Trash2 className="w-4 h-4 mr-1" /> Delete
            </Button>
          </div>
        </CardFooter>
      </Card>

      {/* Comments Section Placeholder */}
      <Separator className="my-8" />
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-foreground">Comments ({post.commentsCount})</h2>
        {/* Example Comment */}
        {post.commentsCount > 0 && (
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="https://placehold.co/50x50.png" alt="Commenter" data-ai-hint="user avatar"/>
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-sm">User One</p>
                  <p className="text-xs text-muted-foreground">2 days ago</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">This is a great post! Very informative.</p>
            </CardContent>
          </Card>
        )}
        {/* Add Comment Form */}
        <div>
          <h3 className="text-lg font-medium mb-2 text-foreground">Leave a Comment</h3>
          <Textarea placeholder="Write your comment here..." className="mb-2" />
          <Button>Submit Comment</Button>
        </div>
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  // In a real app, fetch slugs from your data source
  const postSlugs = mockPosts.map(post => ({ slug: post.slug }));
  return postSlugs;
}
