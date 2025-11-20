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
import { Search } from "@/components/search";
import { ThemeSwitch } from "@/components/theme-switch";
import { ConfigDrawer } from "@/components/config-drawer";
import { ProfileDropdown } from "@/components/profile-dropdown";
import { Header } from "@/components/layout/header";
import { TopNav } from "@/components/layout/top-nav";

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
              geistSans.variable,
              geistMono.variable,
              "@container/content",
              "has-[[data-layout=fixed]]:h-svh",
              "peer-data-[variant=inset]:has-[[data-layout=fixed]]:h-[calc(100svh-(var(--spacing)*4))]"
            )}
          >
            <Header>
              <TopNav links={[]} />
              <div className="ms-auto flex items-center space-x-4">
                <Search />
                <ThemeSwitch />
                <ConfigDrawer />
                <ProfileDropdown />
              </div>
            </Header>
            {children}
          </SidebarInset>
        </SidebarProvider>
      </SearchProvider>
    </DirectionProvider>
  );
}
