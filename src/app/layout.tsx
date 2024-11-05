import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
// 'cn' helper function to merge default classNames with other classNames and to conditionally add classnames
import { cn, constructMetadata } from "@/lib/utils";
// render the 'Toaster' component and display when needed
import { Toaster } from "@/components/ui/toaster";
// wrap entire application with context provider component to use  React Query
import QCProvider from "@/components/QCProvider";
import { TooltipProvider } from "@/components/ui/tooltip";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = constructMetadata();

// Root Layout Component wraps around all routes inside the application
// it ensures a consistent layout for all routes within the application
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={cn(
            "relative h-full font-sans antialiased",
            inter.className,
          )}
        >
          <QCProvider>
            <TooltipProvider>{children}</TooltipProvider>
          </QCProvider>

          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
