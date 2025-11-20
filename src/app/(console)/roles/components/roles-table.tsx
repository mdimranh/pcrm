"use client";

import { DataTablePagination, DataTableToolbar } from "@/components/data-table";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { type NavigateFn, useTableUrlState } from "@/hooks/use-table-url-state";
import { cn } from "@/lib/utils";
import {
    type SortingState,
    type VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { Role } from "@/core/db/client";
import { rolesColumns as columns } from "./roles-columns";

type RolesTableProps = {
    data: Role[];
    search: Record<string, unknown>;
    loading: boolean;
    navigate: NavigateFn;
};

export function RolesTable({ data, search, loading, navigate }: RolesTableProps) {
    const [rowSelection, setRowSelection] = useState({});
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const [sorting, setSorting] = useState<SortingState>([]);

    const { globalFilter, onGlobalFilterChange, columnFilters, onColumnFiltersChange, pagination, onPaginationChange, ensurePageInRange } =
        useTableUrlState({
            search,
            navigate,
            pagination: { defaultPage: 1, defaultPageSize: 10 },
            globalFilter: { enabled: true, key: "q" },
            columnFilters: [],
        });

    const globalFilterFn = (row: any, _columnId: string, filterValue: string) => {
        const q = String(filterValue ?? "").toLowerCase();
        if (!q) return true;
        const r = row.original as Role;
        const hay = `${r.name ?? ""} ${r.description ?? ""}`.toLowerCase();
        return hay.includes(q);
    };

    const table = useReactTable({
        data,
        columns,
        state: {
            sorting,
            pagination,
            rowSelection,
            columnFilters,
            columnVisibility,
            globalFilter,
        },
        onPaginationChange,
        onColumnFiltersChange,
        onRowSelectionChange: setRowSelection,
        onSortingChange: setSorting,
        onColumnVisibilityChange: setColumnVisibility,
        onGlobalFilterChange,
        globalFilterFn,
        getPaginationRowModel: getPaginationRowModel(),
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
    });

    useEffect(() => {
        ensurePageInRange(table.getPageCount());
    }, [table, ensurePageInRange]);

    return (
        <div className={cn("flex flex-1 flex-col gap-4")}>
            <DataTableToolbar table={table} searchPlaceholder="Search role name or description..." filters={[]} />
            <div className="overflow-hidden rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((hg) => (
                            <TableRow key={hg.id} className="group/row">
                                {hg.headers.map((header) => (
                                    <TableHead
                                        key={header.id}
                                        colSpan={header.colSpan}
                                        className={cn(
                                            "bg-background group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted",
                                            (header.column.columnDef.meta as any)?.className,
                                            (header.column.columnDef.meta as any)?.thClassName
                                        )}
                                    >
                                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    Loading...
                                </TableCell>
                            </TableRow>
                        ) : table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"} className="group/row">
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell
                                            key={cell.id}
                                            className={cn(
                                                "bg-background group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted",
                                                (cell.column.columnDef.meta as any)?.className,
                                                (cell.column.columnDef.meta as any)?.tdClassName
                                            )}
                                        >
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <DataTablePagination table={table} className="mt-auto" />
        </div>
    );
}