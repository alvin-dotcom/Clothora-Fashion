
import { SignUp } from "@clerk/nextjs";
import type { Metadata } from 'next';
import { Shirt, Sparkles } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Sign Up | Clothora',
  description: 'Create your Clothora account to start designing unique, AI-generated clothing.',
};

export default function SignUpPage() {
  return (
    <div className="min-h-[calc(100vh-10rem)] flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-background via-muted/10 to-background">
      <div className="w-full max-w-md space-y-8 p-8 bg-card shadow-2xl rounded-xl border border-border">
        <div className="flex flex-col items-center">
          <div className="relative mb-4">
            <Shirt className="h-16 w-16 text-primary" />
            <Sparkles className="h-8 w-8 text-accent absolute -top-2 -right-3 transform rotate-12" />
          </div>
          <h2 className="text-center text-3xl font-bold tracking-tight text-foreground">
            Join Clothora Today
          </h2>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Unleash your creativity and design your own fashion.
          </p>
        </div>
        {/* This is the Clerk Sign Up component */}
        <SignUp 
          path="/sign-up" 
          routing="path" 
          signInUrl="/sign-in" 
          afterSignUpUrl="/design" 
        />
      </div>
    </div>
  );
}

