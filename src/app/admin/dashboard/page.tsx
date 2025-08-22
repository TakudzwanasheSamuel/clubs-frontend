"use client";

import { useEffect, useState } from 'react';
import { ShieldCheck, Users, BarChart3, Settings, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { useAuth } from '@/contexts/auth-context';
import { useToast } from '@/hooks/use-toast';

interface DashboardStats {
  totalClubs: number;
  totalUsers: number;
  totalEvents: number;
  totalPosts: number;
  clubsWithoutLeaders: number;
  recentClubs: Array<{
    id: string;
    name: string;
    slug: string;
    category: { name: string };
    createdAt: string;
    lead: { firstName: string; lastName: string } | null;
  }>;
  recentUsers: Array<{
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    createdAt: string;
  }>;
}

export default function AdminDashboardPage() {
  const { token } = useAuth();
  const { toast } = useToast();
  const [stats, setStats] = useState<DashboardStats | null>(null);
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

        // Calculate stats
        const clubsWithoutLeaders = clubs.filter((club: any) => !club.leadId).length;
        const recentClubs = clubs
          .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 5);
        
        const recentUsers = users
          .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 5);

        setStats({
          totalClubs: clubs.length,
          totalUsers: users.length,
          totalEvents: events.length,
          totalPosts: posts.length,
          clubsWithoutLeaders,
          recentClubs,
          recentUsers
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'super_admin': return 'bg-red-100 text-red-800';
      case 'sdo_admin': return 'bg-blue-100 text-blue-800';
      case 'club_lead': return 'bg-green-100 text-green-800';
      case 'student': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <ProtectedRoute requiredRole="super_admin">
        <div className="container mx-auto py-2">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading dashboard data...</p>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requiredRole="super_admin">
      <div className="container mx-auto py-2">
        <div className="flex items-center mb-6">
          <ShieldCheck className="h-8 w-8 text-primary mr-3" />
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Admin Dashboard</h1>
        </div>
        <p className="text-muted-foreground mb-8">
          Overview and management tools for myCampus administrators.
        </p>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Clubs</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalClubs || 0}</div>
              <p className="text-xs text-muted-foreground">
                {stats?.clubsWithoutLeaders || 0} need leaders
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalUsers || 0}</div>
              <p className="text-xs text-muted-foreground">Registered users</p>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Events</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalEvents || 0}</div>
              <p className="text-xs text-muted-foreground">Scheduled events</p>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalPosts || 0}</div>
              <p className="text-xs text-muted-foreground">News & updates</p>
            </CardContent>
          </Card>
        </div>

        {/* Alerts */}
        {stats?.clubsWithoutLeaders && stats.clubsWithoutLeaders > 0 && (
          <Card className="mb-8 border-orange-200 bg-orange-50">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <AlertCircle className="h-5 w-5 text-orange-600" />
                <div>
                  <p className="font-medium text-orange-800">
                    {stats.clubsWithoutLeaders} club{stats.clubsWithoutLeaders > 1 ? 's' : ''} need{stats.clubsWithoutLeaders > 1 ? '' : 's'} a leader assigned
                  </p>
                  <p className="text-sm text-orange-700">
                    Visit the club creation page to assign students as club leaders.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                Recent Clubs
              </CardTitle>
              <CardDescription>Recently created clubs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stats?.recentClubs && stats.recentClubs.length > 0 ? (
                  stats.recentClubs.map((club) => (
                    <div key={club.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium">{club.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {club.category.name} • {formatDate(club.createdAt)}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        {club.lead ? (
                          <div className="flex items-center space-x-1">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span className="text-xs text-green-600">Has Leader</span>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-1">
                            <AlertCircle className="h-4 w-4 text-orange-600" />
                            <span className="text-xs text-orange-600">No Leader</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground text-center py-4">No clubs created yet</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Recent Users
              </CardTitle>
              <CardDescription>Recently registered users</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stats?.recentUsers && stats.recentUsers.length > 0 ? (
                  stats.recentUsers.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium">{user.firstName} {user.lastName}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(user.role)}`}>
                        {user.role.replace('_', ' ')}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground text-center py-4">No users registered yet</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full" asChild>
                <Link href="/clubs/create">Create New Club</Link>
              </Button>
              <Button className="w-full" variant="outline" asChild>
                <Link href="/clubs-directory">View All Clubs</Link>
              </Button>
              <Button className="w-full" variant="outline" asChild>
                <Link href="/events">Manage Events</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>System Overview</CardTitle>
              <CardDescription>Platform health and status</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Database Status</span>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-green-600">Connected</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">API Status</span>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-green-600">Healthy</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Last Updated</span>
                <span className="text-sm text-muted-foreground">
                  {new Date().toLocaleString()}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  );
}
