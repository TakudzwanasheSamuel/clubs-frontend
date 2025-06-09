
// THIS IS THE NEW LANDING PAGE CONTENT
// It replaces any previous content in src/app/page.tsx,
// especially any that might have redirected to /login.

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ClubCard } from '@/components/clubs/club-card';
import { EventCard } from '@/components/events/event-card';
import { PostCard } from '@/components/news/post-card';
import { mockClubs, mockEvents, mockPosts } from '@/lib/mock-data';
import { Logo } from '@/components/logo';
import { ChevronRight, Users, CalendarDays, MessageSquare, Sparkles, CheckCircle, Star } from 'lucide-react';


// Simplified Top Navigation for Landing Page
function LandingPageHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center justify-between">
        <Logo />
        <nav className="flex items-center gap-4">
          <Button variant="ghost" asChild>
            <Link href="/login">Login</Link>
          </Button>
          <Button asChild>
            <Link href="/register">Sign Up</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}

export default function LandingPage() {
  const featuredClubs = mockClubs.slice(0, 3);
  const trendingPosts = mockPosts.slice(0, 2);
  const upcomingEvents = mockEvents.filter(event => event.status === 'upcoming').slice(0, 2);

  const testimonials = [
    {
      id: '1',
      name: 'Alex P.',
      role: 'Student, Tech Enthusiast',
      avatarUrl: 'https://placehold.co/100x100.png',
      quote: "myCampus helped me discover the Coding Club, and it's been an amazing experience! The events are fantastic, and I've learned so much.",
      dataAiHint: "student avatar"
    },
    {
      id: '2',
      name: 'Sarah L.',
      role: 'Club Lead, Debate Society',
      avatarUrl: 'https://placehold.co/100x100.png',
      quote: "Managing our club's events and announcements is so much easier with myCampus. It's a central hub that keeps everyone connected.",
      dataAiHint: "student avatar"
    },
    {
      id: '3',
      name: 'Mike B.',
      role: 'Fresher Student',
      avatarUrl: 'https://placehold.co/100x100.png',
      quote: "As a new student, myCampus was the perfect way to find clubs that matched my interests. I joined two in my first week!",
      dataAiHint: "student avatar"
    },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <LandingPageHeader />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 md:py-32 bg-gradient-to-br from-primary/10 via-background to-background">
          <div className="absolute inset-0 opacity-50 overflow-hidden">
             {/* Decorative background elements */}
          </div>
          <div className="container relative z-10 text-center">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
              Welcome to <span className="text-primary">myCampus</span>
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-lg text-muted-foreground sm:text-xl md:text-2xl">
              Your central hub for discovering, joining, and engaging with campus clubs and activities. Find your community today!
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <Link href="/clubs-directory">
                  Discover Clubs <ChevronRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/events">
                  Upcoming Events <CalendarDays className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
             <div className="mt-12">
                <Image 
                    src="https://placehold.co/1200x600.png" 
                    alt="Campus life illustration" 
                    width={1200} 
                    height={600} 
                    className="rounded-lg shadow-2xl mx-auto"
                    priority
                    data-ai-hint="campus students"
                />
            </div>
          </div>
        </section>

        {/* Featured Clubs Section */}
        <section className="py-16 bg-secondary/30">
          <div className="container">
            <h2 className="text-3xl font-bold tracking-tight text-center text-foreground mb-4">Featured Clubs</h2>
            <p className="text-center text-muted-foreground mb-12 max-w-xl mx-auto">
              Get a glimpse of some of the vibrant communities you can join on campus.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredClubs.map((club) => (
                <ClubCard key={club.id} club={club} />
              ))}
            </div>
            <div className="text-center mt-12">
              <Button asChild variant="link" className="text-primary text-lg">
                <Link href="/clubs-directory">
                  View All Clubs <ChevronRight className="ml-1 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Upcoming Events Section */}
        <section className="py-16 bg-background">
          <div className="container">
            <h2 className="text-3xl font-bold tracking-tight text-center text-foreground mb-4">Upcoming Events</h2>
             <p className="text-center text-muted-foreground mb-12 max-w-xl mx-auto">
              Don't miss out on exciting workshops, seminars, and social gatherings.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {upcomingEvents.length > 0 ? upcomingEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              )) : <p className="text-center text-muted-foreground col-span-full">No upcoming events right now. Check back soon!</p>}
            </div>
             <div className="text-center mt-12">
              <Button asChild variant="link" className="text-primary text-lg">
                <Link href="/events">
                  View All Events <ChevronRight className="ml-1 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Trending Posts Section */}
        <section className="py-16 bg-secondary/30">
          <div className="container">
            <h2 className="text-3xl font-bold tracking-tight text-center text-foreground mb-4">Trending News & Stories</h2>
            <p className="text-center text-muted-foreground mb-12 max-w-xl mx-auto">
              Catch up on the latest happenings, achievements, and announcements from campus clubs.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {trendingPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
             <div className="text-center mt-12">
              <Button asChild variant="link" className="text-primary text-lg">
                <Link href="/news">
                  Read More News <ChevronRight className="ml-1 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
        
        {/* Testimonials Section */}
        <section className="py-16 bg-background">
          <div className="container">
            <h2 className="text-3xl font-bold tracking-tight text-center text-foreground mb-4">What Students Say</h2>
            <p className="text-center text-muted-foreground mb-12 max-w-xl mx-auto">
              Hear from students who've found their community and passion through myCampus.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial) => (
                <Card key={testimonial.id} className="shadow-lg hover:shadow-xl transition-shadow flex flex-col">
                  <CardHeader className="flex-row gap-4 items-center pb-4">
                     <Avatar className="h-14 w-14 border-2 border-primary">
                        <AvatarImage src={testimonial.avatarUrl} alt={testimonial.name} data-ai-hint={testimonial.dataAiHint} />
                        <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                        <CardTitle className="text-lg">{testimonial.name}</CardTitle>
                        <CardDescription className="text-sm">{testimonial.role}</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-muted-foreground italic">&ldquo;{testimonial.quote}&rdquo;</p>
                  </CardContent>
                  <CardFooter>
                    <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => <Star key={i} className="h-5 w-5 fill-current" />)}
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="py-20 bg-primary text-primary-foreground">
          <div className="container text-center">
            <h2 className="text-3xl font-bold tracking-tight mb-6">Ready to Dive In?</h2>
            <p className="text-lg text-primary-foreground/90 mb-8 max-w-xl mx-auto">
              Create an account or log in to join clubs, RSVP to events, and get the full myCampus experience.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" variant="secondary" asChild className="bg-background text-primary hover:bg-muted">
                <Link href="/register">Create Account</Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="border-primary-foreground/50 text-primary-foreground hover:bg-primary-foreground/10">
                <Link href="/login">Login</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-8 bg-card border-t">
        <div className="container text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} myCampus. All rights reserved.</p>
          <p className="text-sm mt-1">
            <Link href="/privacy" className="hover:text-primary">Privacy Policy</Link> | <Link href="/terms" className="hover:text-primary">Terms of Service</Link>
          </p>
        </div>
      </footer>
    </div>
  );
}

    
