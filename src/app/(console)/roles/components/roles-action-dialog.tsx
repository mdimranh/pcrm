// c:\Users\mdimr\OneDrive\Desktop\pcrm\src\app\(console)\roles\components\roles-action-dialog.tsx
"use client";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Role } from "@/core/db/client";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

const formSchema = z.object({
    name: z.string().min(1, "Name is required."),
    description: z.string().optional(),
});
type RoleForm = z.infer<typeof formSchema>;
export function RolesActionDialog({
    open,
    onOpenChange,
    currentRow,
    onSuccess,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    currentRow?: Role | null;
    onSuccess?: () => void;
}) {
    const isEdit = !!currentRow;
    const [submitting, setSubmitting] = useState(false);
    const form = useForm<RoleForm>({
        resolver: zodResolver(formSchema),
        defaultValues: isEdit
            ? { name: currentRow?.name ?? "", description: currentRow?.description ?? "" }
            : { name: "", description: "" },
    });
    const onSubmit = async (values: RoleForm) => {
        setSubmitting(true);
        try {
            const res = await fetch(isEdit ? `/api/roles/${currentRow?.id}` : `/api/roles`, {
                method: isEdit ? "PATCH" : "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values),
            });
            if (!res.ok) throw new Error("Failed to save role");
            toast.success(isEdit ? "Role updated" : "Role created");
            form.reset();
            onSuccess?.();
            onOpenChange(false);
        } catch {
            toast.error("Error", { description: "Failed to save role. Please try again." });
        } finally {
            setSubmitting(false);
        }
    };
    return (
        <Dialog
            open={open}
            onOpenChange={(state) => {
                if (!state) form.reset();
                onOpenChange(state);
            }}
        >
            <DialogContent className="sm:max-w-sm">
                <DialogHeader className="text-start">
                    <DialogTitle>{isEdit ? "Edit Role" : "Add Role"}</DialogTitle>
                    <DialogDescription>Manage role name and description.</DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form id="role-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl><Input placeholder="Role name" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl><Input placeholder="Optional" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </form>
                </Form>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button type="submit" form="role-form" disabled={submitting}>
                        {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {isEdit ? (submitting ? "Saving..." : "Save changes") : (submitting ? "Creating..." : "Create")}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}