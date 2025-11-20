"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { sidebarData } from "./data/sidebar-data";
import { NavGroup } from "./nav-group";
import { NavUser } from "./nav-user";
import { OrganizationSwitcher } from "./organization-switcher";
import { useEffect, useMemo, useState } from "react";
import { useCurrentUser } from "@/context/current-user-provider";
import { GalleryVerticalEnd, Loader2 } from "lucide-react";
import Image from "next/image";

export function AppSidebar({ ...props }) {
  const { user, loading } = useCurrentUser();
  const isSuperAdmin = user?.isSuperAdmin ?? false;
  const [orgTeams, setOrgTeams] = useState<{ name: string; logo: any; plan: string }[]>([]);
  const [loadingOrgs, setLoadingOrgs] = useState(false);
  useEffect(() => {
    if (!isSuperAdmin) return;
    setLoadingOrgs(true);
    (async () => {
      try {
        const res = await fetch("/api/auth/signup/organizations", { credentials: "include" });
        const orgs = await res.json();
        const mapped = Array.isArray(orgs)
          ? orgs.map((o: any) => ({ name: o.name, logo: GalleryVerticalEnd, plan: "Organization" }))
          : [];
        setOrgTeams(mapped);
      } catch {
        setOrgTeams([]);
      } finally {
        setLoadingOrgs(false);
      }
    })();
  }, [isSuperAdmin]);
  const navGroups = useMemo(() => {
    if (isSuperAdmin) return sidebarData.navGroups;
    return sidebarData.navGroups.map((g) => ({
      ...g,
      items: g.items.filter((i) => i.url !== "/roles"),
    }));
  }, [isSuperAdmin]);

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        {isSuperAdmin ? (
          <OrganizationSwitcher teams={orgTeams} label="Organizations" loading={loadingOrgs} />
        ) : loading ? (
          <div className="flex gap-2 items-center">
            <div className='bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg'>
              <Loader2 className='size-4 animate-spin' />
            </div>
            <div className='grid flex-1 text-start text-sm leading-tight'>
              <span className='truncate font-semibold'>Loading...</span>
              <span className='truncate text-xs'>Please wait</span>
            </div>
          </div>
        ) : (
          <div className="flex gap-2 items-center">
            <div className='bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg'>
              <Image
                src={user?.membership?.organization?.logo || "/images/logo.png"}
                alt={user?.membership?.organization?.name || ""}
                className="size-4"
                width={24}
                height={24}
              />
            </div>
            <div className='grid flex-1 text-start text-sm leading-tight'>
              <span className='truncate font-semibold'>{user?.membership?.organization?.name}</span>
              <span className='truncate text-xs'>{user?.membership?.organization?.slogan}</span>
            </div>
          </div>
        )}
      </SidebarHeader>
      <SidebarContent>
        {navGroups.map((props) => (
          <NavGroup key={props.title} {...props} />
        ))}
      </SidebarContent>
      {/* <SidebarFooter>
        <NavUser user={sidebarData.user} />
      </SidebarFooter> */}
    </Sidebar>
  );
}
