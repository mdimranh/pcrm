// c:\Users\mdimr\OneDrive\Desktop\pcrm\src\app\(console)\roles\components\roles-delete-dialog.tsx
"use client";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { Role } from "@/core/db/client";
import { toast } from "sonner";
import { useState } from "react";

export function RolesDeleteDialog({
    open,
    onOpenChange,
    currentRow,
    onSuccess,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    currentRow: Role;
    onSuccess?: () => void;
}) {
    const [loading, setLoading] = useState(false);
    const handleDelete = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/roles/${currentRow.id}`, { method: "DELETE" });
            if (!res.ok) throw new Error("Failed to delete role");
            toast.success("Role deleted");
            onSuccess?.();
            onOpenChange(false);
        } catch {
            toast.error("Error", { description: "Failed to delete role. It may be in use." });
        } finally {
            setLoading(false);
        }
    };
    return (
        <ConfirmDialog
            open={open}
            onOpenChange={onOpenChange}
            title="Delete Role"
            desc={`Are you sure you want to delete "${currentRow.name}"?`}
            confirmText="Delete"
            destructive
            handleConfirm={handleDelete}
            isLoading={loading}
            className="sm:max-w-sm"
        />
    );
}