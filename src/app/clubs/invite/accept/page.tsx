"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRouter, useSearchParams } from "next/navigation";

const acceptInvitationSchema = z.object({
  firstName: z.string().min(2, { message: "First name must be at least 2 characters." }).max(50),
  lastName: z.string().min(2, { message: "Last name must be at least 2 characters." }).max(50),
  email: z.string().email({ message: "Please enter a valid email address." }),
});

type AcceptInvitationFormValues = z.infer<typeof acceptInvitationSchema>;

export default function AcceptClubInvitationPage() {
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [invitationAccepted, setInvitationAccepted] = useState(false);

  const form = useForm<AcceptInvitationFormValues>({
    resolver: zodResolver(acceptInvitationSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
    },
  });

  async function onSubmit(data: AcceptInvitationFormValues) {
    if (!token) {
      toast({
        title: "Invalid Invitation",
        description: "No invitation token provided.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/clubs/invite/accept', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          ...data,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to accept invitation');
      }

      const result = await response.json();
      
      toast({
        title: "Invitation Accepted!",
        description: result.message,
      });

      setInvitationAccepted(true);
      
      // Show success message with user guidance
      if (result.isNewUser) {
        toast({
          title: "Account Created!",
          description: "A new account has been created for you. Please set a password to complete your setup.",
          variant: "default",
        });
      }
      
      // Redirect to the club page after a short delay
      setTimeout(() => {
        router.push(`/clubs/${result.club.slug}`);
      }, 3000);

    } catch (error) {
      toast({
        title: "Acceptance Failed",
        description: error instanceof Error ? error.message : "An unknown error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!token) {
    return (
      <div className="container mx-auto py-8">
        <Card className="w-full max-w-md mx-auto">
          <CardHeader className="text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <CardTitle className="text-xl">Invalid Invitation</CardTitle>
            <CardDescription>
              No invitation token provided. Please use the complete invitation link.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button onClick={() => router.push('/clubs-directory')}>
              Browse Clubs
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (invitationAccepted) {
    return (
      <div className="container mx-auto py-8">
        <Card className="w-full max-w-md mx-auto">
          <CardHeader className="text-center">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <CardTitle className="text-xl">Invitation Accepted!</CardTitle>
            <CardDescription>
              You are now the club leader! Redirecting to the club page...
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-medium text-green-800 mb-2">Next Steps:</h4>
              <ul className="text-sm text-green-700 space-y-1 text-left">
                <li>• You've been assigned as the club leader</li>
                <li>• An account has been created for you</li>
                <li>• You'll be redirected to the club page</li>
                <li>• Set a password when you first log in</li>
              </ul>
            </div>
            <div className="flex items-center justify-center">
              <Loader2 className="h-5 w-5 animate-spin mr-2" />
              <span>Redirecting...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-center mb-8">
        <Users className="h-8 w-8 text-primary mr-3" />
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Accept Club Leadership</h1>
      </div>
      
      <div className="max-w-md mx-auto">
        <Card className="shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Club Leadership Invitation</CardTitle>
            <CardDescription>
              You've been invited to become a club leader! Please provide your details to accept this role.
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="firstName" className="text-sm font-medium">
                  First Name
                </label>
                <Input
                  id="firstName"
                  {...form.register("firstName")}
                  placeholder="Enter your first name"
                />
                {form.formState.errors.firstName && (
                  <p className="text-sm text-red-500">
                    {form.formState.errors.firstName.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="lastName" className="text-sm font-medium">
                  Last Name
                </label>
                <Input
                  id="lastName"
                  {...form.register("lastName")}
                  placeholder="Enter your last name"
                />
                {form.formState.errors.lastName && (
                  <p className="text-sm text-red-500">
                    {form.formState.errors.lastName.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email Address
                </label>
                <Input
                  id="email"
                  type="email"
                  {...form.register("email")}
                  placeholder="Enter your email address"
                />
                {form.formState.errors.email && (
                  <p className="text-sm text-red-500">
                    {form.formState.errors.email.message}
                  </p>
                )}
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-3 mt-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                  </div>
                  <div className="ml-2 text-sm text-green-700">
                    <p><strong>Ready to accept!</strong></p>
                    <p className="mt-1">Once you submit this form, you'll become the club leader and can start managing the club.</p>
                  </div>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Accepting...
                  </>
                ) : (
                  "Accept Club Leadership"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
