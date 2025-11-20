// c:\Users\mdimr\OneDrive\Desktop\pcrm\src\app\(console)\roles\page.tsx
"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Main } from "@/components/layout/main";
import { RolesProvider, useRoles } from "./components/roles-provider";
import { RolesActionDialog } from "./components/roles-action-dialog";
import { RolesDeleteDialog } from "./components/roles-delete-dialog";
import { Role } from "@/core/db/client";
import { useRouter, useSearchParams } from "next/navigation";
import type { NavigateFn } from "@/hooks/use-table-url-state";
import { RolesTable } from "./components/roles-table";

function RolesPageContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [mounted, setMounted] = useState(false);
    useEffect(() => { setMounted(true); }, []);

    const [roles, setRoles] = useState<Role[]>([]);
    const [loading, setLoading] = useState(true);
    const { open, setOpen, currentRow, setCurrentRow } = useRoles();
    const fetchRoles = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/roles");
            const json = await res.json() as { data: Role[] };
            setRoles(json.data ?? []);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => { fetchRoles(); }, []);

    const search: Record<string, string> = {};
    for (const [key, value] of searchParams.entries()) {
        search[key] = value;
    }

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

    return (
        <>
            <Main className="flex flex-1 flex-col gap-4 sm:gap-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Designations</h2>
                        <p className="text-muted-foreground">Manage designation names and descriptions.</p>
                    </div>
                    <Button onClick={() => setOpen("add")}>Add Designation</Button>
                </div>

                <RolesTable data={roles} search={search} loading={loading} navigate={navigate} />
            </Main>

            <RolesActionDialog
                open={open === "add"}
                onOpenChange={() => setOpen("add")}
                onSuccess={fetchRoles}
            />
            {currentRow && (
                <>
                    <RolesActionDialog
                        open={open === "edit"}
                        onOpenChange={() => {
                            setOpen("edit");
                            setTimeout(() => setCurrentRow(null), 500);
                        }}
                        onSuccess={fetchRoles}
                        currentRow={currentRow}
                    />
                    <RolesDeleteDialog
                        open={open === "delete"}
                        onOpenChange={() => {
                            setOpen("delete");
                            setTimeout(() => setCurrentRow(null), 500);
                        }}
                        onSuccess={fetchRoles}
                        currentRow={currentRow}
                    />
                </>
            )}
        </>
    );
}

export default function RolesPage() {
    const [refreshFn, setRefreshFn] = useState<() => void>();
    return (
        <RolesProvider refreshRoles={refreshFn}>
            <RolesPageContent />
        </RolesProvider>
    );
}