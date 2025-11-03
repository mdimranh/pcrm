"use client"; // ⚠️ Client component

import { ConfigDrawer } from "@/components/config-drawer";
import { Header } from "@/components/layout/header";
import { Main } from "@/components/layout/main";
import { ProfileDropdown } from "@/components/profile-dropdown";
import { Search } from "@/components/search";
import { ThemeSwitch } from "@/components/theme-switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { ArrowDownAZ, ArrowUpAZ, SlidersHorizontal } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, type ChangeEvent } from "react";
import { apps } from "./data/apps";

type AppType = "all" | "connected" | "notConnected";

const appText = new Map<AppType, string>([
  ["all", "All Apps"],
  ["connected", "Connected"],
  ["notConnected", "Not Connected"],
]);

export default function AppsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initialize from URL query
  const initialFilter = searchParams.get("filter") ?? "";
  const initialType = (searchParams.get("type") as AppType) || "all";
  const initialSort = (searchParams.get("sort") as "asc" | "desc") || "asc";

  const [searchTerm, setSearchTerm] = useState(initialFilter);
  const [appType, setAppType] = useState<AppType>(initialType);
  const [sort, setSort] = useState<"asc" | "desc">(initialSort);

  // Update URL when state changes
  const updateSearchParams = (params: {
    filter?: string;
    type?: AppType;
    sort?: "asc" | "desc";
  }) => {
    const newParams = new URLSearchParams(searchParams.toString());
    if (params.filter !== undefined) {
      if (params.filter) newParams.set("filter", params.filter);
      else newParams.delete("filter");
    }
    if (params.type !== undefined) {
      if (params.type !== "all") newParams.set("type", params.type);
      else newParams.delete("type");
    }
    if (params.sort !== undefined) {
      newParams.set("sort", params.sort);
    }
    router.replace(`${window.location.pathname}?${newParams.toString()}`);
  };

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    updateSearchParams({ filter: e.target.value });
  };

  const handleTypeChange = (value: AppType) => {
    setAppType(value);
    updateSearchParams({ type: value });
  };

  const handleSortChange = (value: "asc" | "desc") => {
    setSort(value);
    updateSearchParams({ sort: value });
  };

  const filteredApps = apps
    .sort((a, b) =>
      sort === "asc"
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name)
    )
    .filter((app) =>
      appType === "connected"
        ? app.connected
        : appType === "notConnected"
        ? !app.connected
        : true
    )
    .filter((app) => app.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <>
      <Header>
        <Search />
        <div className="ms-auto flex items-center gap-4">
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>

      <Main fixed>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            App Integrations
          </h1>
          <p className="text-muted-foreground">
            Here&apos;s a list of your apps for the integration!
          </p>
        </div>

        <div className="my-4 flex items-end justify-between sm:my-0 sm:items-center">
          <div className="flex flex-col gap-4 sm:my-4 sm:flex-row">
            <Input
              placeholder="Filter apps..."
              className="h-9 w-40 lg:w-[250px]"
              value={searchTerm}
              onChange={handleSearch}
            />

            <Select value={appType} onValueChange={handleTypeChange}>
              <SelectTrigger className="w-36">
                <SelectValue>{appText.get(appType)}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Apps</SelectItem>
                <SelectItem value="connected">Connected</SelectItem>
                <SelectItem value="notConnected">Not Connected</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Select value={sort} onValueChange={handleSortChange}>
            <SelectTrigger className="w-16">
              <SelectValue>
                <SlidersHorizontal size={18} />
              </SelectValue>
            </SelectTrigger>
            <SelectContent align="end">
              <SelectItem value="asc">
                <div className="flex items-center gap-4">
                  <ArrowUpAZ size={16} />
                  <span>Ascending</span>
                </div>
              </SelectItem>
              <SelectItem value="desc">
                <div className="flex items-center gap-4">
                  <ArrowDownAZ size={16} />
                  <span>Descending</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Separator className="shadow-sm" />

        <ul className="faded-bottom no-scrollbar grid gap-4 overflow-auto pt-4 pb-16 md:grid-cols-2 lg:grid-cols-3">
          {filteredApps.map((app) => (
            <li
              key={app.name}
              className="rounded-lg border p-4 hover:shadow-md"
            >
              <div className="mb-8 flex items-center justify-between">
                <div className="bg-muted flex size-10 items-center justify-center rounded-lg p-2">
                  {app.logo}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className={`${
                    app.connected
                      ? "border border-blue-300 bg-blue-50 hover:bg-blue-100 dark:border-blue-700 dark:bg-blue-950 dark:hover:bg-blue-900"
                      : ""
                  }`}
                >
                  {app.connected ? "Connected" : "Connect"}
                </Button>
              </div>
              <div>
                <h2 className="mb-1 font-semibold">{app.name}</h2>
                <p className="line-clamp-2 text-gray-500">{app.desc}</p>
              </div>
            </li>
          ))}
        </ul>
      </Main>
    </>
  );
}
