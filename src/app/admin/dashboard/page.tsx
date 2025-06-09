
import { ShieldCheck, Users, BarChart3, Settings } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function AdminDashboardPage() {
  return (
    <div className="container mx-auto py-2">
      <div className="flex items-center mb-6">
        <ShieldCheck className="h-8 w-8 text-primary mr-3" />
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Admin Dashboard</h1>
      </div>
      <p className="text-muted-foreground mb-8">
        Overview and management tools for myCampus administrators.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clubs</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15</div>
            <p className="text-xs text-muted-foreground">+2 this month</p>
          </CardContent>
        </Card>
        <Card className="shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">250</div>
            <p className="text-xs text-muted-foreground">+30 since last week</p>
          </CardContent>
        </Card>
        <Card className="shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">Club requests & event approvals</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
         <Card className="shadow-md">
            <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                <Button className="w-full" asChild><Link href="/admin/manage-clubs">Manage Clubs</Link></Button>
                <Button className="w-full" variant="outline" asChild><Link href="/admin/manage-users">Manage Users</Link></Button>
                <Button className="w-full" variant="outline" asChild><Link href="/admin/reports">View Reports</Link></Button>
            </CardContent>
         </Card>
         <Card className="shadow-md">
            <CardHeader>
                <CardTitle>System Settings</CardTitle>
                <CardDescription>Configure platform settings and features.</CardDescription>
            </CardHeader>
            <CardContent>
                <Button className="w-full" variant="secondary" asChild>
                    <Link href="/admin/settings">
                        <Settings className="mr-2 h-4 w-4" /> Go to Settings
                    </Link>
                </Button>
            </CardContent>
         </Card>
      </div>
    </div>
  );
}
