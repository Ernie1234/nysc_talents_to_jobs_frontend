// pages/admin-dashboard.tsx
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, FileText, RefreshCw, Shield } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useGetAdminDashboardStatsQuery } from "@/features/admin/adminAPI";
import { ApplicationsTable } from "./ApplicationsTable";
import { UsersTable } from "./UsersTable";
import { AdminStats } from "./AdminStats";

const AdminDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const { data: statsData, isLoading: statsLoading } =
    useGetAdminDashboardStatsQuery();

  // Redirect if not admin
  if (!user || user.role !== "ADMIN") {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="text-center py-12">
          <div className="text-red-400 text-6xl mb-4">🚫</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Access Denied
          </h3>
          <p className="text-gray-600 mb-4">
            Only administrators can access this page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Manage applications, users, and platform statistics
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary" className="flex items-center space-x-1">
            <Shield className="h-3 w-3" />
            <span>Administrator</span>
          </Badge>
        </div>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center space-x-2">
            <Users className="h-4 w-4" />
            <span>Overview</span>
          </TabsTrigger>
          <TabsTrigger
            value="applications"
            className="flex items-center space-x-2"
          >
            <FileText className="h-4 w-4" />
            <span>Applications</span>
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center space-x-2">
            <Users className="h-4 w-4" />
            <span>Users</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center space-x-2">
            <Shield className="h-4 w-4" />
            <span>Settings</span>
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <AdminStats stats={statsData?.data} isLoading={statsLoading} />

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Frequently used administrative tasks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button
                  onClick={() => setActiveTab("applications")}
                  variant="outline"
                  className="h-16 flex flex-col items-center justify-center space-y-2"
                >
                  <FileText className="h-5 w-5" />
                  <span>Manage Applications</span>
                </Button>
                <Button
                  onClick={() => setActiveTab("users")}
                  variant="outline"
                  className="h-16 flex flex-col items-center justify-center space-y-2"
                >
                  <Users className="h-5 w-5" />
                  <span>Manage Users</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-16 flex flex-col items-center justify-center space-y-2"
                >
                  <RefreshCw className="h-5 w-5" />
                  <span>Refresh Data</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Applications Tab */}
        <TabsContent value="applications">
          <ApplicationsTable />
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="users">
          <UsersTable />
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Admin Settings</CardTitle>
              <CardDescription>
                Platform configuration and settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Settings Coming Soon
                </h3>
                <p className="text-gray-600">
                  Platform configuration settings will be available in a future
                  update.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
