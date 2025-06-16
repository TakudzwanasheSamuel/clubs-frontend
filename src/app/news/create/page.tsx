
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { FilePlus2, Edit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { mockClubs } from "@/lib/mock-data"; // Assuming club leads create posts for their clubs

const postTypes = ['announcement', 'news', 'achievement', 'event_recap'] as const;

const createPostFormSchema = z.object({
  title: z.string().min(5, { message: "Post title must be at least 5 characters." }).max(200),
  content: z.string().min(50, { message: "Content must be at least 50 characters." }),
  postType: z.enum(postTypes, { required_error: "Please select a post type." }),
  clubId: z.string({ required_error: "Please select the host club." }),
  featuredImageUrl: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal('')),
});

type CreatePostFormValues = z.infer<typeof createPostFormSchema>;

export default function CreatePostPage() {
  const { toast } = useToast();
  const form = useForm<CreatePostFormValues>({
    resolver: zodResolver(createPostFormSchema),
    defaultValues: {
      title: "",
      content: "",
      featuredImageUrl: "",
    },
  });

  // Simulate user's manageable clubs
  const manageableClubs = mockClubs.slice(0,3);

  function onSubmit(data: CreatePostFormValues) {
    console.log("Create post data:", data);
    toast({
      title: "Post Created (Simulated)",
      description: "Your new post has been submitted.",
    });
    form.reset();
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center mb-6">
        <FilePlus2 className="h-8 w-8 text-primary mr-3" />
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Create New Post</h1>
      </div>
      <p className="text-muted-foreground mb-8">
        Share updates, news, or announcements for your club.
      </p>
      <Card className="w-full max-w-2xl mx-auto shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Edit className="h-6 w-6 text-primary" />
            Compose Post
          </CardTitle>
          <CardDescription>Write and publish content for the club community.</CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Post Title</FormLabel>
                    <FormControl>
                      <Input placeholder="E.g., Exciting New Workshop Announced!" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Write your post content here..." {...field} rows={10} />
                    </FormControl>
                    <FormDescription>Use markdown for formatting if supported (simulation).</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="postType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Post Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select post type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {postTypes.map(type => (
                            <SelectItem key={type} value={type} className="capitalize">
                              {type.replace('_', ' ')}
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
                  name="clubId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>For Club</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select club" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {manageableClubs.map(club => (
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
              </div>
              <FormField
                control={form.control}
                name="featuredImageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Featured Image URL (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com/post-image.png" {...field} />
                    </FormControl>
                    <FormDescription>Link to an image to feature with your post.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Publishing..." : "Publish Post"}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
