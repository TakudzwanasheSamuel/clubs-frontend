
"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { CalendarPlus, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import type { Club } from "@/types";
import { useAuth } from "@/contexts/auth-context";
import { ImageUpload } from "@/components/ui/image-upload";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

const createEventFormSchema = z.object({
  title: z.string().min(5, { message: "Event title must be at least 5 characters." }).max(150),
  description: z.string().min(20, { message: "Description must be at least 20 characters." }).max(1000),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), { message: "Please enter a valid date (YYYY-MM-DD)." }),
  time: z.string().min(1, {message: "Time is required."}),
  location: z.string().min(3, { message: "Location must be at least 3 characters." }).max(100),
  clubId: z.string({ required_error: "Please select the host club." }),
  coverImageUrl: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal('')),
});

type CreateEventFormValues = z.infer<typeof createEventFormSchema>;

export default function CreateEventPage() {
  const { toast } = useToast();
  const router = useRouter();
  const { token, isLoading: authLoading } = useAuth();
  const [ledClubs, setLedClubs] = useState<Pick<Club, 'id' | 'name' | 'slug'>[]>([]);
  const [isLoadingClubs, setIsLoadingClubs] = useState(true);
  const timeslots = Array.from({ length: 24 * 2 }, (_, i) => {
    const hours = Math.floor(i / 2);
    const minutes = i % 2 === 0 ? "00" : "30";
    const period = hours < 12 ? "AM" : "PM";
    const hours12 = hours % 12 === 0 ? 12 : hours % 12;
    return `${hours12.toString().padStart(1, '0')}:${minutes} ${period}`;
  });

  const form = useForm<CreateEventFormValues>({
    resolver: zodResolver(createEventFormSchema),
    defaultValues: {
      title: "",
      description: "",
      date: "",
      time: "",
      location: "",
      coverImageUrl: "",
    },
  });

  useEffect(() => {
    const fetchLedClubs = async () => {
      setIsLoadingClubs(true);
      try {
        const res = await fetch('/api/my-clubs/led', {
          headers: token ? { 'Authorization': `Bearer ${token}` } : undefined,
        });
        if (!res.ok) throw new Error('Failed to fetch your clubs');
        const data = await res.json();
        setLedClubs(data);
        if (data.length === 0) {
            toast({ title: "No Clubs Found", description: "You must be a lead of a club to create an event.", variant: "destructive" });
        }
      } catch (error) {
        toast({ title: "Error", description: "Could not load your clubs.", variant: "destructive" });
      } finally {
        setIsLoadingClubs(false);
      }
    };
    if (!authLoading && token) {
      fetchLedClubs();
    }
  }, [toast, token, authLoading]);

  async function onSubmit(data: CreateEventFormValues) {
    try {
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create event');
      }

      const newEvent = await response.json();
      toast({
        title: "Event Created Successfully!",
        description: `Your new event, ${data.title}, has been created.`,
      });
      router.push(`/events/${newEvent.slug}`);
    } catch (error) {
      toast({
        title: "Creation Failed",
        description: error instanceof Error ? error.message : "An unknown error occurred.",
        variant: "destructive",
      });
    }
  }

  return (
    <div className="container mx-auto py-8">
      {authLoading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading authentication...</p>
        </div>
      ) : !token ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">You need to be logged in and be a club lead to create an event.</p>
        </div>
      ) : (
      <>
      <div className="flex items-center mb-6">
        <CalendarPlus className="h-8 w-8 text-primary mr-3" />
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Create New Event</h1>
      </div>
      <p className="text-muted-foreground mb-8">
        Fill out the form below to add a new event for your club.
      </p>
      <Card className="w-full max-w-2xl mx-auto shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <CalendarPlus className="h-6 w-6 text-primary" />
            Event Details
          </CardTitle>
          <CardDescription>Provide all necessary information for your event.</CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Event Title</FormLabel>
                    <FormControl>
                      <Input placeholder="E.g., Annual Tech Conference" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Event Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Describe your event in detail..." {...field} rows={4} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => {
                    const selectedDate = field.value ? new Date(field.value) : undefined;
                    const formatDate = (date: Date) => {
                      const y = date.getFullYear();
                      const m = String(date.getMonth() + 1).padStart(2, '0');
                      const d = String(date.getDate()).padStart(2, '0');
                      return `${y}-${m}-${d}`;
                    };
                    return (
                      <FormItem>
                        <FormLabel>Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" type="button" className="w-full justify-start">
                              {selectedDate ? field.value : "Pick a date"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={selectedDate}
                              onSelect={(date) => date && field.onChange(formatDate(date))}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
                <FormField
                  control={form.control}
                  name="time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Time</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select time" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="max-h-64">
                          {timeslots.map((t) => (
                            <SelectItem key={t} value={t}>{t}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input placeholder="E.g., Main Auditorium, Campus Green" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="clubId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Host Club</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoadingClubs || ledClubs.length === 0}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={isLoadingClubs ? "Loading your clubs..." : "Select host club"} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {ledClubs.map(club => (
                          <SelectItem key={club.id} value={club.id}>
                            {club.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="coverImageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cover Image (Optional)</FormLabel>
                    <FormDescription>Upload a cover image for your event.</FormDescription>
                    <ImageUpload
                      type="banner"
                      currentUrl={field.value || undefined}
                      onUploadComplete={(url) => form.setValue("coverImageUrl", url)}
                      label="Upload Cover Image"
                      description="Recommended size: 1200x600px. Max 5MB."
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
               <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button type="submit" className="w-full" disabled={form.formState.isSubmitting || isLoadingClubs || ledClubs.length === 0}>
                {form.formState.isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating...</> : "Create Event"}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
      </>
    )}
    </div>
  );
}
