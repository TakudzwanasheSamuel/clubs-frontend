"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit, Users, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { clubCategories, getClubBySlug, mockClubs } from "@/lib/mock-data";
import type { Club } from "@/types";
import { useParams, useRouter, notFound } from "next/navigation";

const editClubFormSchema = z.object({
  name: z.string().min(3, { message: "Club name must be at least 3 characters." }).max(100),
  description: z.string().min(20, { message: "Description must be at least 20 characters." }).max(500),
  categoryId: z.string({ required_error: "Please select a category." }),
  logoUrl: z.string().url({ message: "Please enter a valid URL for the logo." }).optional().or(z.literal('')),
  bannerImageUrl: z.string().url({ message: "Please enter a valid URL for the banner." }).optional().or(z.literal('')),
  meetingSchedule: z.string().max(100).optional(),
});

type EditClubFormValues = z.infer<typeof editClubFormSchema>;

export default function EditClubPage() {
  const { toast } = useToast();
  const params = useParams();
  const router = useRouter();
  const slug = typeof params.slug === 'string' ? params.slug : '';
  
  const form = useForm<EditClubFormValues>({
    resolver: zodResolver(editClubFormSchema),
    defaultValues: async () => {
        const club = getClubBySlug(slug);
        if (club) {
            return {
                name: club.name,
                description: club.description,
                categoryId: club.category.id,
                logoUrl: club.logoUrl || "",
                bannerImageUrl: club.bannerImageUrl || "",
                meetingSchedule: club.meetingSchedule || "",
            };
        }
        return { // Default empty values if club not found initially
            name: "",
            description: "",
            categoryId: "",
            logoUrl: "",
            bannerImageUrl: "",
            meetingSchedule: "",
        };
    }
  });

  useEffect(() => {
    if (!slug) return;
    const club = getClubBySlug(slug);
    if (!club) {
      notFound();
    } else {
         // Reset form with club data if slug changes or on initial load after async defaultValues might have run
        form.reset({
            name: club.name,
            description: club.description,
            categoryId: club.category.id,
            logoUrl: club.logoUrl || "",
            bannerImageUrl: club.bannerImageUrl || "",
            meetingSchedule: club.meetingSchedule || "",
        });
    }
  }, [slug, form, form.reset]);


  function onSubmit(data: EditClubFormValues) {
    console.log("Update club data (simulated):", data);
    toast({
      title: "Club Updated (Simulated)",
      description: `Details for ${data.name} have been saved.`,
    });
    // Potentially redirect or re-fetch data
    router.push(`/clubs/${slug}`);
  }
  
  if (form.formState.isLoading) { // Checks if defaultValues are loading
    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center mb-6">
        <Users className="h-8 w-8 text-primary mr-3" />
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Edit Club Details</h1>
      </div>
      <p className="text-muted-foreground mb-8">
        Update the information for your club. Changes will be reflected on the public club page.
      </p>
      <Card className="w-full max-w-2xl mx-auto shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Edit className="h-6 w-6 text-primary" />
            Editing: {form.getValues("name") || "Club"}
          </CardTitle>
          <CardDescription>Modify the details below and save your changes.</CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Club Name</FormLabel>
                    <FormControl>
                      <Input placeholder="E.g., Awesome Astronomy Club" {...field} />
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
                    <FormLabel>Club Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Tell us all about your club's mission, activities, and goals." {...field} rows={4} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Club Category</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {clubCategories.map(category => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
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
                name="logoUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Logo URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com/logo.png" {...field} />
                    </FormControl>
                    <FormDescription>Link to an image for your club's logo.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="bannerImageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Banner Image URL (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com/banner.png" {...field} />
                    </FormControl>
                    <FormDescription>Link to a banner image for your club page.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="meetingSchedule"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Meeting Schedule (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="E.g., Every Tuesday at 5 PM in Room 101" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</>
                ) : "Save Changes"}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}