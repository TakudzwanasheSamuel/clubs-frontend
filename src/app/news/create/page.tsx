
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
import { FilePlus2, Edit, Sparkles, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import type { Club } from "@/types";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const postTypes = ['announcement', 'news', 'achievement', 'event_recap'] as const;

const createPostFormSchema = z.object({
  title: z.string().min(5, { message: "Post title must be at least 5 characters." }).max(200),
  content: z.string().min(50, { message: "Content must be at least 50 characters." }),
  type: z.enum(postTypes, { required_error: "Please select a post type." }),
  clubId: z.string({ required_error: "Please select the host club." }),
  featuredImageUrl: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal('')),
});

type CreatePostFormValues = z.infer<typeof createPostFormSchema>;

export default function CreatePostPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [ledClubs, setLedClubs] = useState<Pick<Club, 'id' | 'name' | 'slug'>[]>([]);
  const [isLoadingClubs, setIsLoadingClubs] = useState(true);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<{title: string; content: string}[]>([]);

  const form = useForm<CreatePostFormValues>({
    resolver: zodResolver(createPostFormSchema),
    defaultValues: {
      title: "",
      content: "",
      featuredImageUrl: "",
    },
  });

  useEffect(() => {
    const fetchLedClubs = async () => {
      setIsLoadingClubs(true);
      try {
        const res = await fetch('/api/my-clubs/led');
        if (!res.ok) throw new Error('Failed to fetch your clubs');
        const data = await res.json();
        setLedClubs(data);
      } catch (error) {
        toast({ title: "Error", description: "Could not load your clubs.", variant: "destructive" });
      } finally {
        setIsLoadingClubs(false);
      }
    };
    fetchLedClubs();
  }, [toast]);

  async function onSubmit(data: CreatePostFormValues) {
    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create post');
      }

      const newPost = await response.json();
      toast({
        title: "Post Created Successfully!",
        description: "Your new post has been published.",
      });
      router.push(`/news/${newPost.slug}`);
    } catch (error) {
      toast({
        title: "Creation Failed",
        description: error instanceof Error ? error.message : "An unknown error occurred.",
        variant: "destructive",
      });
    }
  }

  const handleGenerateSuggestions = async () => {
    const topic = form.getValues("title") || "a recent club activity";
    const clubId = form.getValues("clubId");
    const club = ledClubs.find(c => c.id === clubId);
    if (!club) {
        toast({ title: "Please select a club first", variant: "destructive" });
        return;
    }

    setIsAiLoading(true);
    try {
        const response = await fetch('/api/posts/suggestions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ topic, clubName: club.name }),
        });
        if (!response.ok) throw new Error('Failed to get AI suggestions.');
        const data = await response.json();
        setAiSuggestions(data.suggestions); // Assuming the API returns { suggestions: [...] }
    } catch (error) {
        toast({ title: "AI Generation Failed", description: error instanceof Error ? error.message : "Could not fetch suggestions.", variant: "destructive" });
    } finally {
        setIsAiLoading(false);
    }
  }

  const applySuggestion = (suggestion: {title: string; content: string}) => {
    form.setValue("title", suggestion.title);
    form.setValue("content", suggestion.content);
    toast({ title: "Suggestion Applied!", description: "The title and content have been updated." });
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
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl flex items-center gap-2">
              <Edit className="h-6 w-6 text-primary" />
              Compose Post
            </CardTitle>
            <Dialog>
              <DialogTrigger asChild>
                 <Button variant="outline" size="sm" onClick={handleGenerateSuggestions} disabled={isAiLoading}>
                  <Sparkles className="mr-2 h-4 w-4 text-yellow-500" />
                  {isAiLoading ? "Generating..." : "AI Suggestions"}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>AI-Powered Suggestions</DialogTitle>
                  <DialogDescription>
                    Here are a few ideas based on your post title or a recent activity. Click "Apply" to use one.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  {isAiLoading ? <Loader2 className="mx-auto h-8 w-8 animate-spin" /> :
                    aiSuggestions.length > 0 ? aiSuggestions.map((s, i) => (
                      <Card key={i}>
                        <CardHeader>
                          <CardTitle className="text-base">{s.title}</CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm text-muted-foreground">
                          {s.content}
                        </CardContent>
                        <CardFooter>
                          <Button size="sm" onClick={() => applySuggestion(s)}>Apply Suggestion</Button>
                        </CardFooter>
                      </Card>
                    )) : <p className="text-sm text-muted-foreground text-center">No suggestions available. Try providing a more descriptive title.</p>
                  }
                </div>
              </DialogContent>
            </Dialog>
          </div>
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
                  name="type"
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
                      <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoadingClubs}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select club" />
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
            <CardFooter className="flex justify-end gap-2">
               <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button type="submit" className="w-full" disabled={form.formState.isSubmitting || isLoadingClubs}>
                {form.formState.isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Publishing...</> : "Publish Post"}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
