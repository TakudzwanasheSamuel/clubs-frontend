"use client";

import { useState, useEffect } from 'react';
import { PostCard } from '@/components/news/post-card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, Filter, Rss, PlusCircle } from 'lucide-react';
import Link from 'next/link';
import type { Post } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';

export default function NewsfeedPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/posts');
        if (!response.ok) {
          throw new Error('Failed to fetch posts');
        }
        const data: Post[] = await response.json();
        setPosts(data.sort((a,b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setIsLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const renderLoadingState = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="flex flex-col space-y-3">
          <Skeleton className="h-[200px] w-full rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="container mx-auto py-2">
       <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">News & Announcements</h1>
        <Button asChild variant="default">
          <Link href="/news/create">
            <PlusCircle className="mr-2 h-5 w-5" /> Create Post
          </Link>
        </Button>
      </div>
      <p className="text-muted-foreground mb-6">
        Stay updated with the latest news, announcements, and stories from campus clubs.
      </p>

      {/* Filters Placeholder */}
      <div className="mb-8 p-4 bg-card rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div className="md:col-span-2">
            <label htmlFor="search-posts" className="block text-sm font-medium text-foreground mb-1">Search Posts</label>
            <div className="relative">
              <Input id="search-posts" type="text" placeholder="Search by title or content..." className="pl-10" />
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            </div>
          </div>
          <div>
            <label htmlFor="filter-post-type" className="block text-sm font-medium text-foreground mb-1">Filter by Type</label>
            <Select>
              <SelectTrigger id="filter-post-type">
                 <Filter className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <SelectValue placeholder="All Post Types" className="pl-5"/>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Post Types</SelectItem>
                <SelectItem value="announcement">Announcement</SelectItem>
                <SelectItem value="news">News</SelectItem>
                <SelectItem value="achievement">Achievement</SelectItem>
                <SelectItem value="event_recap">Event Recap</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {isLoading ? (
        renderLoadingState()
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : posts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Rss className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-xl text-muted-foreground">No posts available yet.</p>
          <p className="text-sm text-muted-foreground">Check back later for updates from campus clubs.</p>
        </div>
      )}
    </div>
  );
}
