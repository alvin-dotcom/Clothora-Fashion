
// src/app/user-profile/[[...user-profile]]/page.tsx
'use client';

import { useUser } from "@clerk/nextjs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Mail, Phone, User as UserIcon } from "lucide-react";
import ManageUserAddresses from "@/components/profile/ManageUserAddresses";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { useEffect, useState } from "react";
import { getOrSyncUserProfile, type AppUser } from "@/actions/userActions"; 

export default function UserProfilePage() {
  const { user: clerkUser, isLoaded: isClerkLoaded } = useUser();
  const [appDbUser, setAppDbUser] = useState<AppUser | null>(null);
  const [isLoadingAppData, setIsLoadingAppData] = useState(true);

  useEffect(() => {
    async function fetchAndSyncUser() {
      if (isClerkLoaded && clerkUser) {
        setIsLoadingAppData(true);
        try {
          const profileData = await getOrSyncUserProfile(); 
          setAppDbUser(profileData);
        } catch (error) {
          console.error("Failed to fetch or sync user profile:", error);
        } finally {
          setIsLoadingAppData(false);
        }
      } else if (isClerkLoaded && !clerkUser) {
        setIsLoadingAppData(false); 
      }
    }
    fetchAndSyncUser();
  }, [isClerkLoaded, clerkUser]);

  if (!isClerkLoaded || isLoadingAppData) {
    return <div className="container mx-auto py-8 px-4 text-center flex justify-center items-center min-h-[50vh]"><LoadingSpinner size={48} /></div>;
  }

  if (!clerkUser) {
    return <div className="container mx-auto py-8 px-4 text-center">Please sign in to view your profile.</div>;
  }
  
  const displayName = appDbUser?.full_name || clerkUser.fullName || clerkUser.firstName || clerkUser.username || "Your";
  const displayEmail = appDbUser?.email || clerkUser.primaryEmailAddress?.emailAddress || "No email provided";
  // Display phone number from appDbUser first, then fallback to Clerk user data
  const displayPhoneNumber = appDbUser?.phone_number || clerkUser.primaryPhoneNumber?.phoneNumber || null;


  return (
    <div className="container mx-auto py-8 px-4 space-y-8">
      <Card className="max-w-4xl mx-auto shadow-xl border-border">
        <CardHeader className="bg-muted/20">
          <CardTitle className="text-2xl flex items-center gap-2">
            <UserIcon className="h-6 w-6 text-primary"/> {displayName}'s Account Details
          </CardTitle>
          <CardDescription>Review your contact information and manage your saved addresses. For other account settings like password changes or connected accounts, please visit your Clerk dashboard directly.</CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-8">
          <div>
            <h3 className="text-lg font-semibold mb-3">Contact Information</h3>
            <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-md border">
                  <Mail className="h-5 w-5 text-primary mt-1 shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Primary Email</p>
                    <p className="text-sm text-muted-foreground break-all">{displayEmail}</p>
                  </div>
                </div>
              {displayPhoneNumber && ( // Updated to use displayPhoneNumber
                <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-md border">
                  <Phone className="h-5 w-5 text-primary mt-1 shrink-0" />
                   <div>
                    <p className="text-sm font-medium text-foreground">Primary Phone</p>
                    <p className="text-sm text-muted-foreground">{displayPhoneNumber}</p>
                  </div>
                </div>
              )}
              {!displayEmail && !displayPhoneNumber && (
                 <p className="text-sm text-muted-foreground p-3 bg-muted/50 rounded-md border">No primary email or phone number has been linked to this account. You can add them in your Clerk profile settings or here if editing is enabled.</p>
              )}
            </div>
          </div>
          
          {clerkUser.id && <ManageUserAddresses userId={clerkUser.id} />}

        </CardContent>
      </Card>

      {/* The ClerkUserProfile section has been removed from here */}
      
    </div>
  );
}
