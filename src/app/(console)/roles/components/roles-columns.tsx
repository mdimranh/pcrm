import { type ColumnDef } from "@tanstack/react-table";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Role } from "@/core/db/client";
import { useRoles } from "./roles-provider";

function ActionsCell({ row }: { row: any }) {
    const { setOpen, setCurrentRow } = useRoles();
    const role = row.original as Role & { _count: { members: number } };
    return (
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
                disabled={role._count.members > 0}
            >
                Delete
            </Button>
        </div>
    );
}

export const rolesColumns: ColumnDef<Role>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
                className="translate-y-[2px]"
            />
        ),
        meta: {
            className: cn("max-md:sticky start-0 z-10 rounded-tl-[inherit]"),
        },
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
                className="translate-y-[2px]"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "name",
        id: "name",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
        cell: ({ row }) => {
            const name = row.getValue("name") as string;
            return <span className="text-sm font-medium">{name}</span>;
        },
        enableSorting: true,
        enableHiding: false,
    },
    {
        accessorKey: "description",
        id: "description",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Description" />,
        cell: ({ row }) => {
            const desc = (row.getValue("description") as string) || "—";
            return <span className="text-sm text-muted-foreground">{desc}</span>;
        },
        enableSorting: false,
        enableHiding: false,
    },
    {
        id: "actions",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Actions" />,
        cell: ActionsCell as any,
        enableSorting: false,
        enableHiding: false,
        meta: {
            className: cn("w-[200px]"),
        },
    },
];