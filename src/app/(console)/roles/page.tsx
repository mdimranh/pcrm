// c:\Users\mdimr\OneDrive\Desktop\pcrm\src\app\(console)\roles\page.tsx
"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Main } from "@/components/layout/main";
import { RolesProvider, useRoles } from "./components/roles-provider";
import { RolesActionDialog } from "./components/roles-action-dialog";
import { RolesDeleteDialog } from "./components/roles-delete-dialog";
import { Role } from "@/core/db/client";

function RolesPageContent() {
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
    return (
        <>
            <Main className="flex flex-1 flex-col gap-4 sm:gap-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Roles</h2>
                        <p className="text-muted-foreground">Manage role names and descriptions.</p>
                    </div>
                    <Button onClick={() => setOpen("add")}>Add Role</Button>
                </div>
                <div className="overflow-hidden rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow><TableCell colSpan={3} className="h-24 text-center">Loading...</TableCell></TableRow>
                            ) : roles.length === 0 ? (
                                <TableRow><TableCell colSpan={3} className="h-24 text-center">No roles found</TableCell></TableRow>
                            ) : (
                                roles.map((role) => (
                                    <TableRow key={role.id}>
                                        <TableCell>{role.name}</TableCell>
                                        <TableCell>{role.description || "—"}</TableCell>
                                        <TableCell>
                                            <div className="flex gap-2">
                                                <Button
                                                    variant="secondary"
                                                    size="sm"
                                                    onClick={() => {
                                                        setCurrentRow(role);
                                                        setOpen("edit");
                                                    }}
                                                >
                                                    Edit
                                                </Button>
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={() => {
                                                        setCurrentRow(role);
                                                        setOpen("delete");
                                                    }}
                                                >
                                                    Delete
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
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