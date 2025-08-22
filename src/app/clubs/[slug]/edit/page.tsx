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
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit, Users, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Club, ClubCategory } from "@/types";
import { useParams, useRouter, notFound } from "next/navigation";
import { ImageUpload } from "@/components/ui/image-upload";
import { IMAGE_DIMENSIONS } from "@/lib/constants";

// Define a schema that includes the social links for a more complete update
const editClubFormSchema = z.object({
  name: z.string().min(3, { message: "Club name must be at least 3 characters." }).max(100),
  description: z.string().min(20, { message: "Description must be at least 20 characters." }).max(500),
  categoryId: z.string({ required_error: "Please select a category." }),
  logoUrl: z.string().optional(),
  bannerImageUrl: z.string().optional(),
  meetingSchedule: z.string().max(100).optional(),
  // social links are not part of the form, but could be added
});

type EditClubFormValues = z.infer<typeof editClubFormSchema>;

export default function EditClubPage() {
  const { toast } = useToast();
  const params = useParams();
  const router = useRouter();
  const slug = typeof params.slug === 'string' ? params.slug : '';

  const [categories, setCategories] = useState<ClubCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<EditClubFormValues>({
    resolver: zodResolver(editClubFormSchema),
    defaultValues: {
      name: "",
      description: "",
      categoryId: "",
      logoUrl: "",
      bannerImageUrl: "",
      meetingSchedule: "",
    },
  });

  useEffect(() => {
    if (!slug) return;

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [clubRes, categoriesRes] = await Promise.all([
          fetch(`/api/clubs/${slug}`),
          fetch('/api/club-categories')
        ]);

        if (!clubRes.ok) {
          if (clubRes.status === 404) notFound();
          throw new Error('Failed to fetch club data');
        }
        if (!categoriesRes.ok) {
          throw new Error('Failed to fetch categories');
        }

        const club: Club = await clubRes.json();
        const categoriesData: ClubCategory[] = await categoriesRes.json();

        setCategories(categoriesData);
        form.reset({
          name: club.name,
          description: club.description,
          categoryId: club.categoryId,
          logoUrl: club.logoUrl,
          bannerImageUrl: club.bannerImageUrl || "",
          meetingSchedule: club.meetingSchedule || "",
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        toast({ title: "Error", description: error, variant: "destructive" });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [slug, form.reset, toast]);

  async function onSubmit(data: EditClubFormValues) {
    try {
      const response = await fetch(`/api/clubs/${slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update club');
      }

      toast({
        title: "Club Updated Successfully",
        description: `Details for ${data.name} have been saved.`,
      });
      router.push(`/clubs/${slug}`);
      router.refresh(); // Refresh server components on the target page
    } catch (error) {
      toast({
        title: "Update Failed",
        description: error instanceof Error ? error.message : "An unknown error occurred.",
        variant: "destructive",
      });
    }
  }
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-12 text-red-500">Error: {error}</div>;
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
                        {categories.map(category => (
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
                    <ImageUpload
                      type="logo"
                      currentUrl={field.value}
                      onUploadComplete={field.onChange}
                      label="Club Logo"
                      description={`Upload a logo image for your club. Recommended size: ${IMAGE_DIMENSIONS.CLUB_LOGO.width}x${IMAGE_DIMENSIONS.CLUB_LOGO.height}px`}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="bannerImageUrl"
                render={({ field }) => (
                  <FormItem>
                    <ImageUpload
                      type="banner"
                      currentUrl={field.value}
                      onUploadComplete={field.onChange}
                      label="Banner Image (Optional)"
                      description={`Upload a banner image for your club page. Recommended size: ${IMAGE_DIMENSIONS.CLUB_BANNER.width}x${IMAGE_DIMENSIONS.CLUB_BANNER.height}px`}
                    />
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