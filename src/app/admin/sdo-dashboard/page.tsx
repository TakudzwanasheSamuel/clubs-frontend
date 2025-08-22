"use client";

import { useEffect, useState } from 'react';
import { Building2, Users, Calendar, FileText, PlusCircle, AlertCircle, CheckCircle, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { useAuth } from '@/contexts/auth-context';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

interface SDODashboardStats {
  totalClubs: number;
  totalStudents: number;
  totalEvents: number;
  totalPosts: number;
  clubsWithoutLeaders: number;
  activeClubs: number;
  recentClubs: Array<{
    id: string;
    name: string;
    slug: string;
    category: { name: string };
    createdAt: string;
    lead: { firstName: string; lastName: string } | null;
    memberCount: number;
  }>;
  recentStudents: Array<{
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    createdAt: string;
  }>;
}

export default function SDODashboardPage() {
  const { token } = useAuth();
  const { toast } = useToast();
  const [stats, setStats] = useState<SDODashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!token) return;

      try {
        setIsLoading(true);
        
        // Fetch all data in parallel
        const [clubsRes, usersRes, eventsRes, postsRes] = await Promise.all([
          fetch('/api/clubs', {
            headers: { 'Authorization': `Bearer ${token}` }
          }),
          fetch('/api/users', {
            headers: { 'Authorization': `Bearer ${token}` }
          }),
          fetch('/api/events', {
            headers: { 'Authorization': `Bearer ${token}` }
          }),
          fetch('/api/posts', {
            headers: { 'Authorization': `Bearer ${token}` }
          })
        ]);

        if (!clubsRes.ok || !usersRes.ok || !eventsRes.ok || !postsRes.ok) {
          throw new Error('Failed to fetch dashboard data');
        }

        const [clubs, users, events, posts] = await Promise.all([
          clubsRes.json(),
          usersRes.json(),
          eventsRes.json(),
          postsRes.json()
        ]);

        // Calculate SDO-specific stats
        const clubsWithoutLeaders = clubs.filter((club: any) => !club.leadId).length;
        const activeClubs = clubs.filter((club: any) => club.leadId).length;
        const students = users.filter((user: any) => user.role === 'student');
        
        const recentClubs = clubs
          .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 5);
        
        const recentStudents = students
          .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 5);

        setStats({
          totalClubs: clubs.length,
          totalStudents: students.length,
          totalEvents: events.length,
          totalPosts: posts.length,
          clubsWithoutLeaders,
          activeClubs,
          recentClubs,
          recentStudents
        });

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast({
          title: "Error",
          description: "Failed to load dashboard data. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [token, toast]);

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'student':
        return 'bg-blue-100 text-blue-800';
      case 'club_lead':
        return 'bg-green-100 text-green-800';
      case 'sdo_admin':
        return 'bg-purple-100 text-purple-800';
      case 'super_admin':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <ProtectedRoute allowedRoles={['sdo_admin']}>
        <div className="container mx-auto py-6">
          <div className="flex items-center mb-6">
            <Building2 className="h-8 w-8 text-primary mr-3" />
            <h1 className="text-3xl font-bold tracking-tight">SDO Dashboard</h1>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader className="pb-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute allowedRoles={['sdo_admin']}>
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Building2 className="h-8 w-8 text-primary mr-3" />
            <h1 className="text-3xl font-bold tracking-tight">SDO Dashboard</h1>
          </div>
          <div className="flex gap-2">
            <Button asChild>
              <Link href="/clubs/create">
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Club
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/admin/users">
                <Users className="mr-2 h-4 w-4" />
                Manage Users
              </Link>
            </Button>
          </div>
        </div>

        <p className="text-muted-foreground mb-8">
          Welcome to the Student Development Office Dashboard. Monitor clubs, students, and campus activities.
        </p>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Clubs</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalClubs || 0}</div>
              <p className="text-xs text-muted-foreground">
                {stats?.activeClubs || 0} with leaders
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalStudents || 0}</div>
              <p className="text-xs text-muted-foreground">
                Registered students
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Events</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalEvents || 0}</div>
              <p className="text-xs text-muted-foreground">
                Campus events
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalPosts || 0}</div>
              <p className="text-xs text-muted-foreground">
                News & updates
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Alerts */}
        {stats?.clubsWithoutLeaders > 0 && (
          <Card className="mb-8 border-orange-200 bg-orange-50">
            <CardHeader className="pb-3">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-orange-600 mr-2" />
                <CardTitle className="text-orange-800">Clubs Need Leaders</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-orange-700 mb-3">
                {stats.clubsWithoutLeaders} club{stats.clubsWithoutLeaders > 1 ? 's' : ''} currently have no assigned leaders.
              </p>
              <Button asChild variant="outline" className="border-orange-300 text-orange-700 hover:bg-orange-100">
                <Link href="/clubs/create">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Assign Leaders
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Clubs */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Building2 className="mr-2 h-5 w-5" />
                Recent Clubs
              </CardTitle>
              <CardDescription>Recently created clubs and their status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats?.recentClubs.map((club) => (
                  <div key={club.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="font-medium">{club.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {club.category.name} • {club.memberCount || 0} members
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {club.lead ? (
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          <CheckCircle className="mr-1 h-3 w-3" />
                          {club.lead.firstName} {club.lead.lastName}
                        </Badge>
                      ) : (
                        <Badge variant="destructive">
                          <AlertCircle className="mr-1 h-3 w-3" />
                          No Leader
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
                {(!stats?.recentClubs || stats.recentClubs.length === 0) && (
                  <div className="text-center py-6 text-muted-foreground">
                    No clubs created yet
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent Students */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="mr-2 h-5 w-5" />
                Recent Students
              </CardTitle>
              <CardDescription>Recently registered students</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats?.recentStudents.map((student) => (
                  <div key={student.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="font-medium">{student.firstName} {student.lastName}</div>
                      <div className="text-sm text-muted-foreground">{student.email}</div>
                    </div>
                    <Badge className={getRoleBadgeColor(student.role)}>
                      {student.role.replace('_', ' ')}
                    </Badge>
                  </div>
                ))}
                {(!stats?.recentStudents || stats.recentStudents.length === 0) && (
                  <div className="text-center py-6 text-muted-foreground">
                    No students registered yet
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common SDO administrative tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button asChild className="h-auto p-4 flex-col">
                <Link href="/clubs/create">
                  <PlusCircle className="h-6 w-6 mb-2" />
                  <span>Create New Club</span>
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-auto p-4 flex-col">
                <Link href="/admin/users">
                  <Users className="h-6 w-6 mb-2" />
                  <span>Manage Users</span>
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-auto p-4 flex-col">
                <Link href="/clubs-directory">
                  <Building2 className="h-6 w-6 mb-2" />
                  <span>View All Clubs</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  );
}
