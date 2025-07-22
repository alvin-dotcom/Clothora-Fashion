
import { SignIn } from "@clerk/nextjs";
import type { Metadata } from 'next';
import { Shirt } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Sign In | Clothora',
  description: 'Sign in to your Clothora account to create and manage your unique clothing designs.',
};

export default function SignInPage() {
  return (
    <div className="min-h-[calc(100vh-10rem)] flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-background via-muted/10 to-background">
      <div className="w-full max-w-md space-y-8 p-8 bg-card shadow-2xl rounded-xl border border-border">
        <div className="flex flex-col items-center">
          <Shirt className="h-16 w-16 text-primary mb-4" />
          <h2 className="text-center text-3xl font-bold tracking-tight text-foreground">
            Welcome Back to Clothora
          </h2>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Sign in to continue your design journey.
          </p>
        </div>
        {/* This is the Clerk Sign In component */}
        <SignIn 
          path="/sign-in" 
          routing="path" 
          signUpUrl="/sign-up" 
          afterSignInUrl="/design" 
        />
      </div>
    </div>
  );
}

