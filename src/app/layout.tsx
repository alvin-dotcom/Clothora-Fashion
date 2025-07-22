
import type { Metadata } from 'next';
import { ClerkProvider } from '@clerk/nextjs';
import { dark } from '@clerk/themes';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import AppLayout from '@/components/layout/AppLayout';
import { ReduxProvider } from '@/store/ReduxProvider'; // Import the Redux Provider
import CustomCursor from '@/components/shared/CustomCursor'; // Import the custom cursor

export const metadata: Metadata = {
  title: 'Clothora',
  description: 'Generate custom clothing designs with AI.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
        variables: {
          colorPrimary: 'hsl(var(--accent))', // Use accent color for primary actions in Clerk
          colorBackground: 'hsl(var(--background))', // Match app background
          colorText: 'hsl(var(--foreground))',
          colorInputBackground: 'hsl(var(--input))',
          colorInputText: 'hsl(var(--foreground))',
          borderRadius: 'var(--radius)',
        },
        elements: {
          card: 'bg-card shadow-xl border-border',
          formButtonPrimary:
            'bg-accent text-accent-foreground hover:bg-accent/90',
          formFieldInput:
            'bg-input border-border focus:ring-ring focus:border-ring',
          footerActionLink: 'text-accent hover:text-accent/90',
          headerTitle: 'text-foreground',
          headerSubtitle: 'text-muted-foreground',
          socialButtonsBlockButton: 'border-border hover:bg-muted',
          dividerLine: 'bg-border',
          formFieldLabel: 'text-foreground',
          identityPreviewEditButtonIcon: 'text-accent',
          userButtonPopoverCard: 'bg-card border-border text-card-foreground',
          userButtonPopoverActionButton__manageAccount: 'text-foreground',
          userButtonPopoverActionButton__signOut: 'text-destructive',
          userButtonPopoverFooterPagesItem: 'text-muted-foreground',
        },
      }}
    >
      {/* Use .variable directly from the imported font objects */}
      <html lang="en" className={`dark ${GeistSans.variable} ${GeistMono.variable}`}>
        <body className="antialiased">
          <CustomCursor /> {/* Add the custom cursor component here */}
          <ReduxProvider> {/* Wrap with Redux Provider */}
            <AppLayout>
              {children}
            </AppLayout>
            <Toaster />
          </ReduxProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}

