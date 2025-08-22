"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Building2, Users, UserPlus, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { useToast } from '@/hooks/use-toast';
import { StudentAssignment } from '@/components/clubs/student-assignment';

interface Club {
  id: string;
  name: string;
  slug: string;
  description: string;
  category?: {
    name: string;
  };
  leadId: string | null;
  lead?: {
    firstName: string;
    lastName: string;
    email: string;
  };
  _count?: {
    members: number;
    events: number;
    posts: number;
  };
}

export default function ManageClubsPage() {
  const { token } = useAuth();
  const { toast } = useToast();
  const [clubs, setClubs] = useState<Club[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedClub, setSelectedClub] = useState<Club | null>(null);
  const [showAssignment, setShowAssignment] = useState(false);

  useEffect(() => {
    fetchClubs();
  }, []);

  const fetchClubs = async () => {
    try {
      const response = await fetch('/api/clubs', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch clubs');
      }

      const data = await response.json();
      setClubs(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch clubs. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAssignLeader = (club: Club) => {
    setSelectedClub(club);
    setShowAssignment(true);
  };

  const handleAssignmentComplete = () => {
    setShowAssignment(false);
    setSelectedClub(null);
    fetchClubs(); // Refresh the clubs list
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading clubs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-3">
        <Building2 className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Manage Existing Clubs</h1>
          <p className="text-muted-foreground">Assign leaders and manage existing clubs</p>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clubs</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{clubs.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clubs with Leaders</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {clubs.filter(club => club.leadId).length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clubs without Leaders</CardTitle>
            <AlertCircle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {clubs.filter(club => !club.leadId).length}
            </div>
          </CardContent>
        </Card>

                 <Card>
           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
             <CardTitle className="text-sm font-medium">Total Members</CardTitle>
             <Users className="h-4 w-4 text-muted-foreground" />
           </CardHeader>
           <CardContent>
             <div className="text-2xl font-bold">
               {clubs.reduce((total, club) => total + (club._count?.members || 0), 0)}
             </div>
           </CardContent>
         </Card>
      </div>

      {/* Clubs List */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">All Clubs</h2>
        
        {clubs.map((club) => (
          <Card key={club.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <CardTitle className="text-xl">{club.name}</CardTitle>
                  <CardDescription>{club.description}</CardDescription>
                                     <div className="flex items-center gap-4 text-sm text-muted-foreground">
                     <Badge variant="outline">{club.category?.name || 'No Category'}</Badge>
                     <span>•</span>
                     <span>{club._count?.members || 0} members</span>
                     <span>•</span>
                     <span>{club._count?.events || 0} events</span>
                     <span>•</span>
                     <span>{club._count?.posts || 0} posts</span>
                   </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {club.leadId ? (
                    <div className="text-right">
                      <Badge variant="default" className="bg-green-100 text-green-800">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Has Leader
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-1">
                        {club.lead?.firstName} {club.lead?.lastName}
                      </p>
                    </div>
                  ) : (
                    <div className="text-right">
                      <Badge variant="destructive">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        No Leader
                      </Badge>
                      <Button
                        size="sm"
                        onClick={() => handleAssignLeader(club)}
                        className="mt-2"
                      >
                        <UserPlus className="h-4 w-4 mr-2" />
                        Assign Leader
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>

      {/* Student Assignment Modal */}
      {showAssignment && selectedClub && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">
                Assign Leader to {selectedClub.name}
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAssignment(false)}
              >
                ✕
              </Button>
            </div>
            
            <StudentAssignment
              clubId={selectedClub.id}
              clubName={selectedClub.name}
              onAssignmentComplete={handleAssignmentComplete}
            />
          </div>
        </div>
      )}
    </div>
  );
}
