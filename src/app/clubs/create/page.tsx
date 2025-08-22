
"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, Users, Loader2, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import type { ClubCategory } from "@/types";
import { StudentAssignment } from "@/components/clubs/student-assignment";

const createClubFormSchema = z.object({
  name: z.string().min(3, { message: "Club name must be at least 3 characters." }).max(100),
  categoryId: z.string({ required_error: "Please select a category." }),
});

type CreateClubFormValues = z.infer<typeof createClubFormSchema>;

export default function CreateClubPage() {
  const { toast } = useToast();
  const { token, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [categories, setCategories] = useState<ClubCategory[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [createdClub, setCreatedClub] = useState<any>(null);
  const [showStudentAssignment, setShowStudentAssignment] = useState(false);

  const form = useForm<CreateClubFormValues>({
    resolver: zodResolver(createClubFormSchema),
    defaultValues: {
      name: "",
      categoryId: "",
    },
  });

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!authLoading && !token) {
      router.push('/login');
      return;
    }

    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/club-categories');
        if (!res.ok) throw new Error('Failed to fetch categories');
        const data: ClubCategory[] = await res.json();
        setCategories(data);
      } catch (error) {
        toast({ title: "Error", description: "Could not load club categories.", variant: "destructive" });
      } finally {
        setIsLoadingCategories(false);
      }
    };
    
    if (token) {
      fetchCategories();
    }
  }, [token, toast, router, authLoading]);

  async function onSubmit(data: CreateClubFormValues) {
    try {
      if (!token) {
        throw new Error('Authentication required. Please log in again.');
      }

      const response = await fetch('/api/clubs', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create club');
      }

      const newClub = await response.json();

      toast({
        title: "Club Created Successfully!",
        description: `Your new club, ${data.name}, has been created. You can now send invitations to students to become club leaders.`,
      });

      // Store the created club and show student assignment
      setCreatedClub(newClub);
      setShowStudentAssignment(true);
    } catch (error) {
      toast({
        title: "Creation Failed",
        description: error instanceof Error ? error.message : "An unknown error occurred.",
        variant: "destructive",
      });
    }
  }

  const goToClubPage = () => {
    if (createdClub) {
      router.push(`/clubs/${createdClub.slug}`);
    }
  };

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Loading...</span>
        </div>
      </div>
    );
  }

  // Show student assignment if club was created
  if (showStudentAssignment && createdClub) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-green-600 mr-3" />
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Club Created Successfully!</h1>
          </div>
          <div className="flex gap-2">
            <Button onClick={goToClubPage} variant="outline">
              View Club Page
            </Button>
            <Button 
              onClick={() => {
                setCreatedClub(null);
                setShowStudentAssignment(false);
                form.reset();
              }} 
              variant="secondary"
            >
              Create Another Club
            </Button>
          </div>
        </div>
        
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
          <div className="text-center">
            <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-green-800 mb-2">Club Created Successfully!</h3>
            <p className="text-sm text-green-700 mb-4">
              Your club <strong>{createdClub.name}</strong> has been created. Now assign a student as the club leader.
            </p>
            
            <StudentAssignment
              clubId={createdClub.id}
              clubName={createdClub.name}
              onAssignmentComplete={() => {
                setCreatedClub(null);
                setShowStudentAssignment(false);
                form.reset();
              }}
            />
            
            <p className="text-xs text-green-600">
              Search for a student and assign them as the club leader. The student's role will automatically be updated to "club_lead".
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center mb-6">
        <Users className="h-8 w-8 text-primary mr-3" />
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Create New Club (Admin Only)</h1>
      </div>

      <Card className="w-full max-w-2xl mx-auto shadow-xl">
        <CardHeader>
                     <CardTitle className="text-2xl flex items-center gap-2">
             <PlusCircle className="h-6 w-6 text-primary" />
             Create New Club
           </CardTitle>
          <CardDescription>Enter the club name and select a category to get started.</CardDescription>
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
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Club Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoadingCategories}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={isLoadingCategories ? "Loading categories..." : "Select a category"} />
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
            </CardContent>
            <CardFooter>
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button type="submit" className="w-full" disabled={form.formState.isSubmitting || isLoadingCategories}>
                {form.formState.isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Creating...</> : "Create Club"}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
