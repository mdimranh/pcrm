// src/components/users/user-approval-dialog.tsx
"use client";

import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Check, X, Loader2 } from "lucide-react";
import { UserStatus } from "@/core/db/client";
import { toast } from "sonner";

interface User {
    id: string;
    firstName: string;
    middleName: string | null;
    lastName: string;
    status: UserStatus;
    nid: string;
    gender: string | null;
    email: {
        email: string;
        isVerified: boolean;
    } | null;
    phoneNumber: {
        phoneNumber: string;
        isVerified: boolean;
    } | null;
    membership: {
        role: {
            name: string;
        } | null;
    } | null;
    area: any;
}

interface UserApprovalDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    user: User;
    onSuccess: () => void;
}

export function UserApprovalDialog({
    open,
    onOpenChange,
    user,
    onSuccess,
}: UserApprovalDialogProps) {
    const [loading, setLoading] = useState(false);
    const [notes, setNotes] = useState("");

    const handleApproval = async (approved: boolean) => {
        setLoading(true);
        try {
            const response = await fetch(`/api/users/${user.id}/approval`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    approved,
                    notes,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to process approval");
            }

            toast(approved ? "User Approved" : "User Rejected", {
                description: approved
                    ? `${user.firstName} ${user.lastName} has been approved successfully.`
                    : `${user.firstName} ${user.lastName} has been rejected.`,
            });

            onSuccess();
        } catch (error) {
            toast.error("Error", {
                description: "Failed to process user approval. Please try again."
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Review User Application</DialogTitle>
                    <DialogDescription>
                        Review the user details and approve or reject their application.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    {/* User Details */}
                    <div className="space-y-3">
                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <Label className="text-xs text-muted-foreground">Name</Label>
                                <p className="font-medium">
                                    {user.firstName}{" "}
                                    {user.middleName && `${user.middleName} `}
                                    {user.lastName}
                                </p>
                            </div>
                            <div>
                                <Label className="text-xs text-muted-foreground">NID</Label>
                                <p className="font-medium">{user.nid}</p>
                            </div>
                            <div>
                                <Label className="text-xs text-muted-foreground">Gender</Label>
                                <p className="font-medium">
                                    {user.gender || "Not specified"}
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label className="text-xs text-muted-foreground">Email</Label>
                                <div className="flex items-center gap-2">
                                    <p className="font-medium">
                                        {user.email?.email || "Not provided"}
                                    </p>
                                    {user.email?.isVerified && (
                                        <Badge variant="outline" className="text-xs">
                                            <Check className="h-3 w-3 mr-1" />
                                            Verified
                                        </Badge>
                                    )}
                                </div>
                            </div>
                            <div>
                                <Label className="text-xs text-muted-foreground">Phone</Label>
                                <div className="flex items-center gap-2">
                                    <p className="font-medium">
                                        {user.phoneNumber?.phoneNumber || "Not provided"}
                                    </p>
                                    {user.phoneNumber?.isVerified && (
                                        <Badge variant="outline" className="text-xs">
                                            <Check className="h-3 w-3 mr-1" />
                                            Verified
                                        </Badge>
                                    )}
                                </div>
                            </div>
                        </div>

                        {user.area && (
                            <div>
                                <Label className="text-xs text-muted-foreground">Location</Label>
                                <p className="font-medium">
                                    {[
                                        user.area.pollingUnit?.name,
                                        user.area.union?.name,
                                        user.area.upazila?.name,
                                        user.area.district?.name,
                                        user.area.division?.name,
                                    ]
                                        .filter(Boolean)
                                        .join(", ")}
                                </p>
                            </div>
                        )}

                        {user.membership?.role && (
                            <div>
                                <Label className="text-xs text-muted-foreground">Role</Label>
                                <p className="font-medium">{user.membership.role.name}</p>
                            </div>
                        )}
                    </div>

                    {/* Notes */}
                    <div className="space-y-2">
                        <Label htmlFor="notes">Notes (Optional)</Label>
                        <Textarea
                            id="notes"
                            placeholder="Add any notes about this decision..."
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            rows={3}
                        />
                    </div>
                </div>

                <DialogFooter className="gap-2 sm:gap-0">
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={loading}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={() => handleApproval(false)}
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Processing...
                            </>
                        ) : (
                            <>
                                <X className="mr-2 h-4 w-4" />
                                Reject
                            </>
                        )}
                    </Button>
                    <Button onClick={() => handleApproval(true)} disabled={loading}>
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Processing...
                            </>
                        ) : (
                            <>
                                <Check className="mr-2 h-4 w-4" />
                                Approve
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}