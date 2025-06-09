
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { PlusCircle, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { clubCategories } from "@/lib/mock-data";

const createClubFormSchema = z.object({
  name: z.string().min(3, { message: "Club name must be at least 3 characters." }).max(100),
  description: z.string().min(20, { message: "Description must be at least 20 characters." }).max(500),
  categoryId: z.string({ required_error: "Please select a category." }),
  logoUrl: z.string().url({ message: "Please enter a valid URL for the logo." }).optional().or(z.literal('')),
  bannerImageUrl: z.string().url({ message: "Please enter a valid URL for the banner." }).optional().or(z.literal('')),
  meetingSchedule: z.string().max(100).optional(),
});

type CreateClubFormValues = z.infer<typeof createClubFormSchema>;

export default function CreateClubPage() {
  const { toast } = useToast();
  const form = useForm<CreateClubFormValues>({
    resolver: zodResolver(createClubFormSchema),
    defaultValues: {
      name: "",
      description: "",
      logoUrl: "",
      bannerImageUrl: "",
      meetingSchedule: "",
    },
  });

  function onSubmit(data: CreateClubFormValues) {
    console.log("Create club data:", data);
    toast({
      title: "Club Creation Submitted (Simulated)",
      description: "In a real app, this would go through an approval process.",
    });
    form.reset();
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center mb-6">
        <Users className="h-8 w-8 text-primary mr-3" />
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Propose a New Club</h1>
      </div>
      <p className="text-muted-foreground mb-8">
        Fill out the form below to start a new club. Your proposal will be reviewed.
      </p>
      <Card className="w-full max-w-2xl mx-auto shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <PlusCircle className="h-6 w-6 text-primary" />
            Club Proposal Form
          </CardTitle>
          <CardDescription>Provide details about the club you want to create.</CardDescription>
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
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                    <FormLabel>Logo URL (Optional)</FormLabel>
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
            <CardFooter>
              <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Submitting..." : "Submit Proposal"}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
