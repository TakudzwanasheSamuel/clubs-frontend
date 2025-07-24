
"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { PlusCircle, Users, Image as ImageIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { clubCategories, mockUsers } from "@/lib/mock-data";

const createClubFormSchema = z.object({
  name: z.string().min(3, { message: "Club name must be at least 3 characters." }).max(100),
  description: z.string().min(20, { message: "Description must be at least 20 characters." }).max(500),
  categoryId: z.string({ required_error: "Please select a category." }),
  clubLeadId: z.string({ required_error: "Please assign a club lead." }),
  logo: z.any().optional(),
  bannerImage: z.any().optional(),
  meetingSchedule: z.string().max(100).optional(),
});

type CreateClubFormValues = z.infer<typeof createClubFormSchema>;

export default function CreateClubPage() {
  const { toast } = useToast();
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);

  const form = useForm<CreateClubFormValues>({
    resolver: zodResolver(createClubFormSchema),
    defaultValues: {
      name: "",
      description: "",
      meetingSchedule: "",
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: "logo" | "bannerImage") => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (fieldName === 'logo') {
          setLogoPreview(reader.result as string);
        } else {
          setBannerPreview(reader.result as string);
        }
        form.setValue(fieldName, file);
      };
      reader.readAsDataURL(file);
    }
  };

  function onSubmit(data: CreateClubFormValues) {
    console.log("Create club data (simulated):", {
        ...data,
        logo: data.logo?.[0]?.name,
        bannerImage: data.bannerImage?.[0]?.name,
    });
    toast({
      title: "Club Created (Simulated)",
      description: `The new club '${data.name}' has been added and assigned a lead.`,
    });
    form.reset();
    setLogoPreview(null);
    setBannerPreview(null);
  }

  // Clean up object URLs on unmount
  useEffect(() => {
    return () => {
      if (logoPreview) URL.revokeObjectURL(logoPreview);
      if (bannerPreview) URL.revokeObjectURL(bannerPreview);
    };
  }, [logoPreview, bannerPreview]);
  
  const potentialLeads = mockUsers.filter(u => u.role !== 'admin');

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center mb-6">
        <Users className="h-8 w-8 text-primary mr-3" />
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Create New Club</h1>
      </div>
      <p className="text-muted-foreground mb-8">
        Fill out the form below to create a new club. This is an admin action.
      </p>
      <Card className="w-full max-w-2xl mx-auto shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <PlusCircle className="h-6 w-6 text-primary" />
            New Club Form
          </CardTitle>
          <CardDescription>Provide details about the club and assign a lead.</CardDescription>
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  name="clubLeadId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Assign Club Lead</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                             <SelectValue placeholder="Select a user to lead the club" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {potentialLeads.map(user => (
                            <SelectItem key={user.id} value={user.id}>
                              {user.firstName} {user.lastName} ({user.email})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              {/* Logo Upload with Preview */}
              <FormField
                control={form.control}
                name="logo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Logo</FormLabel>
                    <div className="flex items-center gap-4">
                      <div className="w-24 h-24 rounded-md border border-dashed flex items-center justify-center bg-muted">
                        {logoPreview ? (
                          <Image src={logoPreview} alt="Logo preview" width={96} height={96} className="object-cover rounded-md" data-ai-hint="logo preview"/>
                        ) : (
                          <ImageIcon className="w-10 h-10 text-muted-foreground" />
                        )}
                      </div>
                      <FormControl className="flex-1">
                        <Input 
                          type="file" 
                          accept="image/*"
                          onChange={(e) => handleFileChange(e, 'logo')}
                        />
                      </FormControl>
                    </div>
                    <FormDescription>Upload an image for your club's logo (1:1 ratio recommended).</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Banner Image Upload with Preview */}
              <FormField
                control={form.control}
                name="bannerImage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Banner Image (Optional)</FormLabel>
                     <div className="w-full h-32 rounded-md border border-dashed flex items-center justify-center bg-muted relative overflow-hidden">
                        {bannerPreview ? (
                          <Image src={bannerPreview} alt="Banner preview" layout="fill" className="object-cover" data-ai-hint="banner preview"/>
                        ) : (
                          <ImageIcon className="w-10 h-10 text-muted-foreground" />
                        )}
                      </div>
                    <FormControl className="mt-2">
                       <Input 
                        type="file" 
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, 'bannerImage')}
                      />
                    </FormControl>
                    <FormDescription>Upload a banner image for your club page (16:9 ratio recommended).</FormDescription>
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
                {form.formState.isSubmitting ? "Creating Club..." : "Create Club"}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}

    