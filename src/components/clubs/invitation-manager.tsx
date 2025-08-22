"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, Copy, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Invitation {
  id: string;
  token: string;
  email: string;
  expiresAt: string;
  invitationUrl: string;
}

interface InvitationManagerProps {
  clubId: string;
  clubName: string;
}

export function InvitationManager({ clubId, clubName }: InvitationManagerProps) {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  const sendInvitation = async () => {
    if (!email.trim()) {
      toast({
        title: "Error",
        description: "Please enter an email address",
        variant: "destructive",
      });
      return;
    }

    setIsSending(true);
    try {
      const response = await fetch('/api/clubs/invite/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clubId, email: email.trim() }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to send invitation');
      }

      const result = await response.json();
      
      toast({
        title: "Invitation Sent!",
        description: `Invitation sent to ${email}`,
      });

      // Add to local state
      setInvitations(prev => [result.invitation, ...prev]);
      setEmail("");
      
    } catch (error) {
      toast({
        title: "Failed to Send Invitation",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  const copyToClipboard = async (text: string, token: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedToken(token);
      toast({
        title: "Copied!",
        description: "Invitation link copied to clipboard",
      });
      
      // Reset copied state after 2 seconds
      setTimeout(() => setCopiedToken(null), 2000);
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  const formatExpiryDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  const isExpired = (dateString: string) => {
    return new Date(dateString) < new Date();
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          Send Club Leadership Invitation
        </CardTitle>
        <CardDescription>
          Invite a student to become the leader of {clubName}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Send Invitation Form */}
        <div className="flex gap-2">
          <Input
            type="email"
            placeholder="Enter student's email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendInvitation()}
            className="flex-1"
          />
          <Button 
            onClick={sendInvitation} 
            disabled={isSending || !email.trim()}
          >
            {isSending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Mail className="mr-2 h-4 w-4" />
                Send Invitation
              </>
            )}
          </Button>
        </div>

        {/* Invitations List */}
        {invitations.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium text-sm text-muted-foreground">Recent Invitations</h4>
            {invitations.map((invitation) => (
              <div 
                key={invitation.id} 
                className="flex items-center justify-between p-3 border rounded-lg bg-muted/50"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm">{invitation.email}</span>
                    {isExpired(invitation.expiresAt) ? (
                      <Badge variant="destructive" className="text-xs">Expired</Badge>
                    ) : (
                      <Badge variant="secondary" className="text-xs">Active</Badge>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Expires: {formatExpiryDate(invitation.expiresAt)}
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(invitation.invitationUrl, invitation.token)}
                    className="flex items-center gap-1"
                  >
                    {copiedToken === invitation.token ? (
                      <>
                        <CheckCircle className="h-3 w-3" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3" />
                        Copy Link
                      </>
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5" />
            </div>
            <div className="ml-2 text-sm text-blue-700">
              <p><strong>How it works:</strong></p>
              <ul className="mt-1 space-y-1">
                <li>• Send invitation to student's email</li>
                <li>• Student receives invitation link</li>
                <li>• Student accepts and becomes club leader</li>
                <li>• Invitation expires after 7 days</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
