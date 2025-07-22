
'use client';

import Link from 'next/link';
import { Shirt, Menu, UserCircle, LogOutIcon as LogOutIconLucide, Package, PencilRuler, Heart } from 'lucide-react'; // Renamed LogOutIcon to avoid conflict
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetClose, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useAuth, useUser } from '@clerk/nextjs';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navItems = [
  { href: '/design', label: 'Design Studio', icon: <PencilRuler className="h-5 w-5" /> },
  { href: '/wishlist', label: 'Wishlist', icon: <Heart className="h-5 w-5" /> },
  { href: '/orders', label: 'My Orders', icon: <Package className="h-5 w-5" /> },
];

export default function Header() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { signOut } = useAuth();
  const { user, isSignedIn } = useUser();
  const router = useRouter();

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const handleSignOut = async () => {
    await signOut(() => {
      router.push('/'); 
    });
    closeMobileMenu();
  };

  useEffect(() => {
    if (isMobileMenuOpen) {
      closeMobileMenu();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);


  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Increased height from h-16 to h-20 */}
      <div className="container mx-auto flex h-20 items-center px-4"> 
        <Link href="/" className="flex items-center gap-2 shrink-0" onClick={closeMobileMenu}>
          <Shirt className="h-7 w-7 sm:h-8 sm:w-8 text-primary" />
          <span className="text-xl sm:text-2xl font-bold text-primary">Clothora</span>
        </Link>

        {isSignedIn && (
          <>
            {/* Desktop Navigation - removed mx-6 from nav to allow flex-grow to better center */}
            <nav className="hidden md:flex flex-grow justify-center items-center"> 
              <div className="flex items-center gap-2 bg-secondary/40 backdrop-blur-sm p-1.5 rounded-full">
                {navItems.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={cn(
                      "px-5 py-2 text-sm font-medium rounded-full transition-colors duration-150",
                      pathname === item.href 
                        ? "bg-secondary text-secondary-foreground shadow-inner" 
                        : "text-muted-foreground hover:text-foreground/90 hover:bg-secondary/60"
                    )}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </nav>

            {/* Desktop User Avatar */}
            <div className="hidden md:flex items-center ml-auto shrink-0"> {/* Added ml-auto to push to right */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0">
                     <Avatar className="h-9 w-9">
                      <AvatarImage src={user?.imageUrl} alt={user?.fullName || 'User avatar'} />
                      <AvatarFallback>
                        {(user?.firstName?.charAt(0) || '') + (user?.lastName?.charAt(0) || '')}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user?.fullName || user?.username}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user?.primaryEmailAddress?.emailAddress}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/user-profile" className="flex items-center cursor-pointer">
                      <UserCircle className="mr-2 h-4 w-4" />
                      My Profile
                    </Link>
                  </DropdownMenuItem>
                  {/* My Orders is intentionally kept here for desktop as per previous state */}
                  <DropdownMenuItem asChild>
                     <Link href="/orders" className="flex items-center cursor-pointer">
                       <Package className="mr-2 h-4 w-4" />
                       My Orders
                     </Link>
                   </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-destructive focus:text-destructive-foreground focus:bg-destructive">
                    <LogOutIconLucide className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </>
        )}

        {/* Mobile specific controls */}
        {isSignedIn && (
            <div className="md:hidden flex flex-grow justify-end items-center gap-2">
              {/* Mobile User Avatar Dropdown */}
              <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={user?.imageUrl} alt={user?.fullName || 'User avatar'} />
                        <AvatarFallback>
                          {(user?.firstName?.charAt(0) || '') + (user?.lastName?.charAt(0) || '')}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user?.fullName || user?.username}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user?.primaryEmailAddress?.emailAddress}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                     <DropdownMenuItem asChild>
                      <Link href="/user-profile" className="flex items-center cursor-pointer" onClick={closeMobileMenu}>
                        <UserCircle className="mr-2 h-4 w-4" />
                        My Profile
                      </Link>
                    </DropdownMenuItem>
                    {/* "My Orders" and "Log out" are intentionally omitted here for mobile avatar dropdown as per previous request */}
                  </DropdownMenuContent>
                </DropdownMenu>

              {/* Mobile Hamburger Menu */}
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-full max-w-xs bg-background">
                  <SheetHeader className="mb-6 border-b pb-4">
                    <SheetTitle>
                      <Link href="/" className="flex items-center gap-2" onClick={closeMobileMenu}>
                        <Shirt className="h-7 w-7 text-primary" />
                        <span className="text-xl font-bold text-primary">Clothora</span>
                      </Link>
                    </SheetTitle>
                  </SheetHeader>
                  <nav className="flex flex-col gap-4 text-lg">
                    {navItems.map((item) => (
                      <SheetClose asChild key={item.label}>
                        <Link
                          href={item.href}
                          className={cn(
                            "flex items-center gap-3 rounded-md px-3 py-2 transition-colors duration-150",
                            pathname === item.href 
                              ? "bg-secondary text-secondary-foreground font-semibold" 
                              : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground/90"
                          )}
                        >
                          {item.icon}
                          {item.label}
                        </Link>
                      </SheetClose>
                    ))}
                  </nav>
                   <div className="mt-auto pt-6 border-t">
                       <Button
                        variant="ghost"
                        onClick={handleSignOut}
                        className="w-full justify-start text-destructive hover:bg-destructive/10 hover:text-destructive text-lg gap-3 px-3 py-2"
                      >
                        <LogOutIconLucide className="h-5 w-5" />
                        Log out
                      </Button>
                   </div> 
                </SheetContent>
              </Sheet>
            </div>
        )}

        {/* If not signed in, ensure logo is on left and this div takes up space to push it left */}
        {!isSignedIn && (
           <div className="flex-grow"></div>
        )}
      </div>
    </header>
  );
}

