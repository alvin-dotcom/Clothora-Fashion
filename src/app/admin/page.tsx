
// src/app/admin/page.tsx
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import UserTable from "@/components/admin/UserTable";
import OrderTable from "@/components/admin/OrderTable";
import { isAdminUser, getAllAppUsers, getAllOrdersAdmin } from "@/actions/adminActions";
import { ShieldAlert } from "lucide-react";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Dashboard | Clothora',
  description: 'Manage users and orders for Clothora.',
};

// This page will not use AppLayout, so it needs its own html/body structure if RootLayout doesn't cover it
// However, RootLayout already provides html, body, ClerkProvider, global styles.
// AppLayout's main job was adding Header/Footer, which we're conditionally removing.

export default async function AdminDashboardPage() {
  const isAdmin = await isAdminUser();

  if (!isAdmin) {
    return (
      <div className="container mx-auto py-10 flex flex-col items-center justify-center min-h-screen"> {/* Changed to min-h-screen */}
        <ShieldAlert className="w-24 h-24 text-destructive mb-6" />
        <h1 className="text-4xl font-bold mb-4">Access Denied</h1>
        <p className="text-lg text-muted-foreground">
          You do not have permission to view this page.
        </p>
      </div>
    );
  }

  const users = await getAllAppUsers();
  const orders = await getAllOrdersAdmin();

  return (
    // The main AppLayout will conditionally hide its header/footer for /admin
    // So this div effectively becomes the page content container for admin.
    <div className="container mx-auto py-6 sm:py-10 px-2 sm:px-4"> {/* Adjusted padding for smaller screens */}
      <h1 className="text-3xl sm:text-4xl font-bold mb-6 sm:mb-8 text-center">Admin Dashboard</h1>
      <Tabs defaultValue="orders" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:w-1/2 lg:w-1/3 mx-auto mb-6">
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
        </TabsList>

        <TabsContent value="orders">
          <Card className="shadow-md">
            <CardHeader className="px-4 py-4 sm:px-6 sm:py-5">
              <CardTitle className="text-xl sm:text-2xl">Manage Orders</CardTitle>
              <CardDescription className="text-sm sm:text-base">View and update the status of all customer orders.</CardDescription>
            </CardHeader>
            <CardContent className="p-0 sm:p-2 md:p-4"> {/* Reduced padding on smaller screens for tables */}
              <OrderTable initialOrders={orders} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users">
          <Card className="shadow-md">
            <CardHeader className="px-4 py-4 sm:px-6 sm:py-5">
              <CardTitle className="text-xl sm:text-2xl">Manage Users</CardTitle>
              <CardDescription className="text-sm sm:text-base">View details of all registered users.</CardDescription>
            </CardHeader>
            <CardContent className="p-0 sm:p-2 md:p-4"> {/* Reduced padding on smaller screens for tables */}
              <UserTable users={users} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
