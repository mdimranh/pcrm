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
import { useEffect, useState } from "react";
import { useCurrentUser } from "@/context/current-user-provider";
import { Field, FieldLabel } from "@/components/ui/field";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getDivision, getDistrict, getUpazila, getUnion, getPollingUnit } from "@/app/auth/signup/actions";
import { Role } from "@/core/db/client";
import { Users as UsersType } from "@/app/api/users/route";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

export default function Users() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const reload = async () => {
    setLoading(true);
    try {
      const qs = typeof window !== "undefined" ? window.location.search : "";
      const [usersRes, rolesRes] = await Promise.all([
        fetch(`/api/users${qs}`, { credentials: "include" }),
        fetch("/api/roles")
      ]);
      const usersJson = (await usersRes.json()) as UsersType[];
      const rolesJson = (await rolesRes.json()) as { data: Role[] };
      setData(usersJson);
      setRoles(rolesJson.data);
    } finally {
      setLoading(false);
    }
  };

  const [data, setData] = useState<UsersType[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);

  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    reload();
  }, [searchParams]);

  // convert URLSearchParams to an object if needed
  const search: Record<string, string> = {};
  for (const [key, value] of searchParams.entries()) {
    search[key] = value;
  }

  // implement NavigateFn expected by useTableUrlState
  const navigate: NavigateFn = ({ search: nextSearch, replace }) => {
    if (!mounted) return;
    const current: Record<string, unknown> = {};
    const currentParams = new URLSearchParams(window.location.search);
    for (const [k, v] of currentParams.entries()) current[k] = v;

    let resolved: Record<string, unknown> | undefined;
    if (nextSearch === true) {
      resolved = current;
    } else if (typeof nextSearch === "function") {
      resolved = nextSearch(current);
    } else {
      resolved = nextSearch;
    }

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
          url.searchParams.set(k, JSON.stringify(v));
        } else {
          url.searchParams.set(k, String(v));
        }
      }
    }

    const urlStr = url.pathname + url.search;
    const currentStr = window.location.pathname + window.location.search;
    if (urlStr === currentStr) return;
    if (replace) router.replace(urlStr);
    else router.push(urlStr);
  };

  const { user } = useCurrentUser();
  const isSuperAdmin = !!user?.isSuperAdmin;

  const [divisions, setDivisions] = useState<{ id: string; name: string }[]>([]);
  const [districts, setDistricts] = useState<{ id: string; name: string }[]>([]);
  const [upazilas, setUpazilas] = useState<{ id: string; name: string }[]>([]);
  const [unions, setUnions] = useState<{ id: string; name: string }[]>([]);
  const [units, setUnits] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    if (!isSuperAdmin) return;
    (async () => {
      const divs = await getDivision();
      setDivisions(divs);
      const divId = searchParams.get("divisionId");
      const distId = searchParams.get("districtId");
      const upaId = searchParams.get("upazilaId");
      const uniId = searchParams.get("unionId");
      const puId = searchParams.get("pollingUnitId");
      if (divId) {
        const dists = await getDistrict(divId);
        setDistricts(dists);
        if (distId) {
          const upas = await getUpazila(distId);
          setUpazilas(upas);
          if (upaId) {
            const unis = await getUnion(upaId);
            setUnions(unis);
            if (uniId) {
              const pus = await getPollingUnit(uniId);
              setUnits(pus);
            }
          }
        }
      }
    })();
  }, [isSuperAdmin, searchParams]);

  const onDivision = async (id: string) => {
    const dists = await getDistrict(id);
    setDistricts(dists); setUpazilas([]); setUnions([]); setUnits([]);
    navigate({ search: (prev) => ({ ...prev, divisionId: id, districtId: undefined, upazilaId: undefined, unionId: undefined, pollingUnitId: undefined }) });
  };
  const onDistrict = async (id: string) => {
    const upas = await getUpazila(id);
    setUpazilas(upas); setUnions([]); setUnits([]);
    navigate({ search: (prev) => ({ ...prev, districtId: id, upazilaId: undefined, unionId: undefined, pollingUnitId: undefined }) });
  };
  const onUpazila = async (id: string) => {
    const unis = await getUnion(id);
    setUnions(unis); setUnits([]);
    navigate({ search: (prev) => ({ ...prev, upazilaId: id, unionId: undefined, pollingUnitId: undefined }) });
  };
  const onUnion = async (id: string) => {
    const pus = await getPollingUnit(id);
    setUnits(pus);
    navigate({ search: (prev) => ({ ...prev, unionId: id, pollingUnitId: undefined }) });
  };
  const onPollingUnit = async (id: string) => {
    navigate({ search: (prev) => ({ ...prev, pollingUnitId: id }) });
  };

  // Reset handlers
  const resetDivision = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDistricts([]); setUpazilas([]); setUnions([]); setUnits([]);
    navigate({ search: (prev) => ({ ...prev, divisionId: undefined, districtId: undefined, upazilaId: undefined, unionId: undefined, pollingUnitId: undefined }) });
  };
  const resetDistrict = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setUpazilas([]); setUnions([]); setUnits([]);
    navigate({ search: (prev) => ({ ...prev, districtId: undefined, upazilaId: undefined, unionId: undefined, pollingUnitId: undefined }) });
  };
  const resetUpazila = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setUnions([]); setUnits([]);
    navigate({ search: (prev) => ({ ...prev, upazilaId: undefined, unionId: undefined, pollingUnitId: undefined }) });
  };
  const resetUnion = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setUnits([]);
    navigate({ search: (prev) => ({ ...prev, unionId: undefined, pollingUnitId: undefined }) });
  };
  const resetPollingUnit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigate({ search: (prev) => ({ ...prev, pollingUnitId: undefined }) });
  };

  return (
    <UsersProvider refreshUsers={reload}>
      <Main className="flex flex-1 flex-col gap-4 sm:gap-6">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">User List</h2>
            <p className="text-muted-foreground">Manage your users and their roles here.</p>
          </div>
          <UsersPrimaryButtons />
        </div>
        <UsersTable data={data} roles={roles} search={search} loading={loading} navigate={navigate} postToolbarSlot={isSuperAdmin && (
          <div className="flex items-end gap-4">
            <Field className="w-full">
              <FieldLabel>Division</FieldLabel>
              <div className="flex items-center gap-2">
                <Select value={searchParams.get("divisionId") ?? undefined} onValueChange={onDivision}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Division" />
                  </SelectTrigger>
                  <SelectContent>
                    {divisions.map((d) => (<SelectItem key={d.id} value={String(d.id)}>{d.name}</SelectItem>))}
                  </SelectContent>
                </Select>
                {searchParams.get("divisionId") && (
                  <button
                    type="button"
                    onClick={resetDivision}
                    className="rounded-sm opacity-50 hover:opacity-100 focus:outline-none"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </Field>
            <Field className="w-full">
              <FieldLabel>District</FieldLabel>
              <div className="flex items-center gap-2">
                <Select value={searchParams.get("districtId") ?? undefined} onValueChange={onDistrict} disabled={!districts.length}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select District" />
                  </SelectTrigger>
                  <SelectContent>
                    {districts.map((d) => (<SelectItem key={d.id} value={String(d.id)}>{d.name}</SelectItem>))}
                  </SelectContent>
                </Select>
                {searchParams.get("districtId") && (
                  <button
                    type="button"
                    onClick={resetDistrict}
                    className="rounded-sm opacity-50 hover:opacity-100 focus:outline-none"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </Field>
            <Field className="w-full">
              <FieldLabel>Upazila</FieldLabel>
              <div className="flex items-center gap-2">
                <Select value={searchParams.get("upazilaId") ?? undefined} onValueChange={onUpazila} disabled={!upazilas.length}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Upazila / Paurashava" />
                  </SelectTrigger>
                  <SelectContent>
                    {upazilas.map((u) => (<SelectItem key={u.id} value={String(u.id)}>{u.name}</SelectItem>))}
                  </SelectContent>
                </Select>
                {searchParams.get("upazilaId") && (
                  <button
                    type="button"
                    onClick={resetUpazila}
                    className="rounded-sm opacity-50 hover:opacity-100 focus:outline-none"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </Field>
            <Field className="w-full">
              <FieldLabel>Union / Ward</FieldLabel>
              <div className="flex items-center gap-2">
                <Select value={searchParams.get("unionId") ?? undefined} onValueChange={onUnion} disabled={!unions.length}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Union / Ward" />
                  </SelectTrigger>
                  <SelectContent>
                    {unions.map((u) => (<SelectItem key={u.id} value={String(u.id)}>{u.name}</SelectItem>))}
                  </SelectContent>
                </Select>
                {searchParams.get("unionId") && (
                  <button
                    type="button"
                    onClick={resetUnion}
                    className="rounded-sm opacity-50 hover:opacity-100 focus:outline-none"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </Field>
            <Field className="w-full">
              <FieldLabel>Polling Unit</FieldLabel>
              <div className="flex items-center gap-2">
                <Select value={searchParams.get("pollingUnitId") ?? undefined} onValueChange={onPollingUnit} disabled={!units.length}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Polling Station / Unit" />
                  </SelectTrigger>
                  <SelectContent>
                    {units.map((u) => (<SelectItem key={u.id} value={String(u.id)}>{u.name}</SelectItem>))}
                  </SelectContent>
                </Select>
                {searchParams.get("pollingUnitId") && (
                  <button
                    type="button"
                    onClick={resetPollingUnit}
                    className="rounded-sm opacity-50 hover:opacity-100 focus:outline-none"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </Field>
          </div>
        )} />
      </Main>

      <UsersDialogs roles={roles} />
    </UsersProvider>
  );
}