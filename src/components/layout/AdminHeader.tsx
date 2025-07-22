
'use client';

import Link from 'next/link';
import { Shirt, LogOut as LogOutIcon } from 'lucide-react';
import { useAuth, useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function AdminHeader() {
  const { signOut } = useAuth();
  const { user, isSignedIn } = useUser();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut(() => {
      router.push('/'); // Redirect to home page after sign out
    });
  };

  if (!isSignedIn) {
    // This case should ideally be prevented by middleware protecting /admin
    return (
       <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <Shirt className="h-7 w-7 sm:h-8 sm:w-8 text-primary" />
            <span className="text-xl sm:text-2xl font-bold text-primary">Clothora Admin</span>
          </Link>
          {/* Optionally, a sign-in link here if direct access to /admin without auth is possible, though not recommended */}
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <Shirt className="h-7 w-7 sm:h-8 sm:w-8 text-primary" />
          <span className="text-xl sm:text-2xl font-bold text-primary">Clothora Admin</span>
        </Link>

        <div className="flex items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={user?.imageUrl} alt={user?.fullName || 'Admin avatar'} />
                  <AvatarFallback>
                    {user?.firstName?.charAt(0)?.toUpperCase() || 'A'}
                    {user?.lastName?.charAt(0)?.toUpperCase() || ''}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user?.fullName || user?.username}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    Administrator
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-destructive focus:text-destructive-foreground focus:bg-destructive">
                <LogOutIcon className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
