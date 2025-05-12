
import type {Metadata} from 'next';
import { GeistSans } from 'geist/font/sans';
// import { GeistMono } from 'geist/font/mono'; // Removed as it's not used and to simplify font handling
import './globals.css';
import { Toaster } from "@/components/ui/toaster";

const geistSans = GeistSans; // Corrected: Use GeistSans directly as it's an object, not a function.

// const geistMono = GeistMono({ // Removed as it's not used
//   variable: '--font-geist-mono',
//   subsets: ['latin'],
// });

export const metadata: Metadata = {
  title: 'AgentFlow',
  description: 'AI-powered assistant by Firebase Studio',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable}`}>
      <body className={`font-sans antialiased`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}

