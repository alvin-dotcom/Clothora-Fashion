@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 240 100% 99%; /* Off-white #F8F8FF */
    --foreground: 227 31% 26%; /* Deep navy blue #2E3A59 */

    --card: 240 100% 99%;
    --card-foreground: 227 31% 26%;

    --popover: 240 100% 99%;
    --popover-foreground: 227 31% 26%;

    --primary: 227 31% 26%; /* Deep navy blue */
    --primary-foreground: 240 100% 99%; /* Off-white */

    --secondary: 227 31% 90%; /* Lighter navy */
    --secondary-foreground: 227 31% 26%; /* Deep navy blue */

    --muted: 227 31% 95%;
    --muted-foreground: 227 31% 45%; /* Muted navy */

    --accent: 46 100% 70%; /* Mustard yellow #FFDA63 */
    --accent-foreground: 227 31% 15%; /* Darker navy for contrast on accent */

    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 0 0% 98%;

    --border: 227 31% 85%;
    --input: 227 31% 92%; /* Slightly lighter input background */
    --ring: 46 100% 70%; /* Mustard yellow for focus rings */

    --radius: 0.5rem;

    --chart-1: 12 76% 61%;
    --chart-2: 173 58% 39%;
    --chart-3: 197 37% 24%;
    --chart-4: 43 74% 66%;
    --chart-5: 27 87% 67%;
    
    /* Sidebar specific colors - retained but may not be heavily used */
    --sidebar-background: 0 0% 98%;
    --sidebar-foreground: 240 5.3% 26.1%;
    --sidebar-primary: 240 5.9% 10%;
    --sidebar-primary-foreground: 0 0% 98%;
    --sidebar-accent: 240 4.8% 95.9%;
    --sidebar-accent-foreground: 240 5.9% 10%;
    --sidebar-border: 220 13% 91%;
    --sidebar-ring: 217.2 91.2% 59.8%;
  }

  .dark {
    --background: 240 5% 3%; /* Very dark desaturated blue, almost black */
    --foreground: 0 0% 98%; /* Off-white */

    --card: 240 5% 3%;
    --card-foreground: 0 0% 98%;

    --popover: 240 5% 3%;
    --popover-foreground: 0 0% 98%;

    --primary: 0 0% 98%; /* Off-white for primary interactive elements */
    --primary-foreground: 240 5% 3%; /* Dark text on primary */

    --secondary: 240 5% 10%; /* Slightly lighter dark blue/grey for secondary elements */
    --secondary-foreground: 0 0% 95%; /* Light text on secondary */

    --muted: 240 5% 8%; /* Very dark, for muted elements */
    --muted-foreground: 0 0% 65%; /* Greyish, for muted text */

    --accent: 46 100% 70%; /* Mustard yellow #FFDA63 - Retain for visual pop */
    --accent-foreground: 220 30% 15%; /* Dark blue for text on accent, slightly desaturated */

    --destructive: 0 70% 50%; /* A less saturated, but still clear red for dark mode */
    --destructive-foreground: 0 0% 98%;

    --border: 240 5% 12%; /* Dark border */
    --input: 240 5% 9%; /* Dark input background */
    --ring: 46 100% 70%; /* Mustard yellow for focus rings - Retain */
    
    /* Dark Sidebar specific colors for "pitch black" theme */
    --sidebar-background: 240 5% 2%; /* Even darker for sidebar background */
    --sidebar-foreground: 0 0% 98%;
    --sidebar-primary: 0 0% 98%; /* Light color for active/primary sidebar items */
    --sidebar-primary-foreground: 240 5% 2%; /* Dark text for sidebar primary */
    --sidebar-accent: 240 5% 7%; /* Hover/accent states for sidebar items */
    --sidebar-accent-foreground: 0 0% 98%;
    --sidebar-border: 240 5% 10%;
    --sidebar-ring: 46 100% 70%; /* Retain mustard yellow for focus rings */
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
    font-family: var(--font-geist-sans), sans-serif;
    cursor: none !important; /* Hide default cursor globally */
  }
  html {
     cursor: none !important; /* Ensure it's hidden on html too */
  }
  h1, h2, h3, h4, h5, h6 {
    @apply font-semibold text-foreground;
  }
  /* Ensure interactive elements also use cursor:none */
  [data-cursor-hoverable="true"], button, a, input, textarea, select {
    cursor: none !important;
  }
}
