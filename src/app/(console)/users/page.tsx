"use client";

import { ConfigDrawer } from "@/components/config-drawer";
import { Header } from "@/components/layout/header";
import { Main } from "@/components/layout/main";
import { ProfileDropdown } from "@/components/profile-dropdown";
import { Search } from "@/components/search";
import { ThemeSwitch } from "@/components/theme-switch";
import type { NavigateFn } from "@/hooks/use-table-url-state";
import { useRouter, useSearchParams } from "next/navigation";
import { UsersDialogs } from "./components/users-dialogs";
import { UsersPrimaryButtons } from "./components/users-primary-buttons";
import { UsersProvider } from "./components/users-provider";
import { UsersTable } from "./components/users-table";
import { users } from "./data/users";

export default function Users() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // convert URLSearchParams to an object if needed
  const search: Record<string, string> = {};
  for (const [key, value] of searchParams.entries()) {
    search[key] = value;
  }

  // implement NavigateFn expected by useTableUrlState
  const navigate: NavigateFn = ({ search: nextSearch, replace }) => {
    // build current params from the live URL (avoid stale useSearchParams closure)
    const current: Record<string, unknown> = {};
    const currentParams = new URLSearchParams(window.location.search);
    for (const [k, v] of currentParams.entries()) current[k] = v;

    // resolve next search (function | object | true)
    let resolved: Record<string, unknown> | undefined;
    if (nextSearch === true) {
      resolved = current;
    } else if (typeof nextSearch === "function") {
      resolved = nextSearch(current);
    } else {
      resolved = nextSearch;
    }

    // construct new query string by setting/removing keys with undefined/null
    const pathname = window.location.pathname;
    const url = new URL(pathname, window.location.origin);

    if (resolved) {
      for (const k of Object.keys(resolved)) {
        const v = resolved[k];
        if (v === undefined || v === null) {
          url.searchParams.delete(k);
        } else if (Array.isArray(v)) {
          url.searchParams.delete(k);
          for (const item of v) url.searchParams.append(k, String(item));
        } else if (typeof v === "object") {
          // fallback: serialize objects
          url.searchParams.set(k, JSON.stringify(v));
        } else {
          url.searchParams.set(k, String(v));
        }
      }
    }

    const urlStr = url.pathname + url.search;
    if (replace) router.replace(urlStr);
    else router.push(urlStr);
  };

  return (
    <UsersProvider>
      <Header fixed>
        <Search />
        <div className="ms-auto flex items-center space-x-4">
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>

      <Main className="flex flex-1 flex-col gap-4 sm:gap-6">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">User List</h2>
            <p className="text-muted-foreground">
              Manage your users and their roles here.
            </p>
          </div>
          <UsersPrimaryButtons />
        </div>

        <UsersTable data={users} search={search} navigate={navigate} />
      </Main>

      <UsersDialogs />
    </UsersProvider>
  );
}
