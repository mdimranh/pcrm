"use client";

import { AppSidebar } from "@/components/layout/app-sidebar";
import { SkipToMain } from "@/components/skip-to-main";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { DirectionProvider } from "@/context/direction-provider";
import { useLayout } from "@/context/layout-provider";
import { SearchProvider } from "@/context/search-provider";
import { cn } from "@/lib/utils";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { collapsible, variant, state } = useLayout();
  return (
    <DirectionProvider>
      <SearchProvider>
        <SidebarProvider defaultOpen={state}>
          <SkipToMain />
          <AppSidebar collapsible={collapsible} variant={variant} />
          <SidebarInset
            className={cn(
              // Set content container, so we can use container queries
              "@container/content",

              // If layout is fixed, set the height
              // to 100svh to prevent overflow
              "has-[[data-layout=fixed]]:h-svh",

              // If layout is fixed and sidebar is inset,
              // set the height to 100svh - spacing (total margins) to prevent overflow
              "peer-data-[variant=inset]:has-[[data-layout=fixed]]:h-[calc(100svh-(var(--spacing)*4))]"
            )}
          >
            {children}
          </SidebarInset>
        </SidebarProvider>
      </SearchProvider>
    </DirectionProvider>
  );
}
