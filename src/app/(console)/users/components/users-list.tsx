// src/components/users/users-list.tsx
"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Search, ChevronUp, ChevronDown, Check, X } from "lucide-react";
import { UserStatus } from "@/core/db/client";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { useDebouncedCallback } from "@/hooks/use-debounce";
import { UsersTableSkeleton } from "./users-list-skeleton";
import { UserApprovalDialog } from "./user-approval-dialog";
import { UsersSuspendDialog } from "./users-suspend-dialog";

interface User {
    id: string;
    firstName: string;
    middleName: string | null;
    lastName: string;
    status: UserStatus;
    createdAt: string;
    updatedAt: string;
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
            id: string;
            name: string;
        } | null;
        organization: {
            name: string;
        };
        isAdmin: boolean;
    } | null;
    area: any;
}

interface UsersResponse {
    data: User[];
    pagination: {
        page: number;
        limit: number;
        totalCount: number;
        totalPages: number;
        hasMore: boolean;
    };
}

export function UsersList() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [users, setUsers] = useState<User[]>([]);
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        totalCount: 0,
        totalPages: 0,
        hasMore: false,
    });
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState(searchParams.get("search") || "");
    const [status, setStatus] = useState(searchParams.get("status") || "all");
    const [roleId, setRoleId] = useState(searchParams.get("roleId") || "all");
    const [sortBy, setSortBy] = useState(searchParams.get("sortBy") || "createdAt");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">(
        (searchParams.get("sortOrder") as "asc" | "desc") || "desc"
    );
    const [roles, setRoles] = useState<Array<{ id: string; name: string }>>([]);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [showApprovalDialog, setShowApprovalDialog] = useState(false);
    const [showSuspendDialog, setShowSuspendDialog] = useState(false);

    // Fetch roles for filter
    useEffect(() => {
        fetchRoles();
    }, []);

    const fetchRoles = async () => {
        try {
            const response = await fetch("/api/roles");
            if (response.ok) {
                const data = await response.json() as { data: Array<{ id: string; name: string }> };
                setRoles(data.data || []);
            }
        } catch (error) {
            console.error("Error fetching roles:", error);
        }
    };

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            params.set("page", pagination.page.toString());
            params.set("limit", pagination.limit.toString());
            if (search) params.set("search", search);
            if (status !== "all") params.set("status", status);
            if (roleId !== "all") params.set("roleId", roleId);
            params.set("sortBy", sortBy);
            params.set("sortOrder", sortOrder);

            const response = await fetch(`/api/users?${params.toString()}`);
            if (!response.ok) throw new Error("Failed to fetch users");

            const data: UsersResponse = await response.json();
            setUsers(data.data);
            setPagination(data.pagination);
        } catch (error) {
            console.error("Error fetching users:", error);
        } finally {
            setLoading(false);
        }
    }, [pagination.page, pagination.limit, search, status, roleId, sortBy, sortOrder]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const debouncedSearch = useDebouncedCallback((value: string) => {
        setSearch(value);
        setPagination((prev) => ({ ...prev, page: 1 }));
    }, 500);

    const handleSort = (field: string) => {
        if (sortBy === field) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
            setSortBy(field);
            setSortOrder("asc");
        }
        setPagination((prev) => ({ ...prev, page: 1 }));
    };

    const handleStatusChange = (value: string) => {
        setStatus(value);
        setPagination((prev) => ({ ...prev, page: 1 }));
    };

    const handleRoleChange = (value: string) => {
        setRoleId(value);
        setPagination((prev) => ({ ...prev, page: 1 }));
    };

    const handlePageChange = (page: number) => {
        setPagination((prev) => ({ ...prev, page }));
    };

    const handleApproval = (user: User) => {
        setSelectedUser(user);
        setShowApprovalDialog(true);
    };

    const handleApprovalSuccess = () => {
        fetchUsers();
        setShowApprovalDialog(false);
        setSelectedUser(null);
    };

    const handleSuspend = (user: User) => {
        setSelectedUser(user);
        setShowSuspendDialog(true);
    };

    const handleSuspendSuccess = () => {
        fetchUsers();
        setShowSuspendDialog(false);
        setSelectedUser(null);
    };

    const getStatusBadge = (status: UserStatus) => {
        const variants: Record<UserStatus, { variant: any; label: string }> = {
            ACTIVE: { variant: "default", label: "Active" },
            PENDING: { variant: "secondary", label: "Pending" },
            REJECTED: { variant: "destructive", label: "Rejected" },
            SUSPENDED: { variant: "outline", label: "Suspended" },
        };
        const config = variants[status];
        return <Badge variant={config.variant}>{config.label}</Badge>;
    };

    const SortIcon = ({ field }: { field: string }) => {
        if (sortBy !== field) return null;
        return sortOrder === "asc" ? (
            <ChevronUp className="ml-1 h-4 w-4" />
        ) : (
            <ChevronDown className="ml-1 h-4 w-4" />
        );
    };

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>Users</CardTitle>
                    <CardDescription>
                        Total {pagination.totalCount} users found
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {/* Filters */}
                    <div className="flex flex-col gap-4 mb-6 md:flex-row md:items-end">
                        <div className="flex-1">
                            <label className="text-sm font-medium mb-2 block">Search</label>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search by name, email, phone, or NID..."
                                    defaultValue={search}
                                    onChange={(e) => debouncedSearch(e.target.value)}
                                    className="pl-9"
                                />
                            </div>
                        </div>
                        <div className="w-full md:w-48">
                            <label className="text-sm font-medium mb-2 block">Status</label>
                            <Select value={status} onValueChange={handleStatusChange}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Status</SelectItem>
                                    <SelectItem value="ACTIVE">Active</SelectItem>
                                    <SelectItem value="PENDING">Pending</SelectItem>
                                    <SelectItem value="REJECTED">Rejected</SelectItem>
                                    <SelectItem value="SUSPENDED">Suspended</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="w-full md:w-48">
                            <label className="text-sm font-medium mb-2 block">Role</label>
                            <Select value={roleId} onValueChange={handleRoleChange}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Roles</SelectItem>
                                    {roles.map((role) => (
                                        <SelectItem key={role.id} value={role.id}>
                                            {role.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Table */}
                    {loading ? (
                        <UsersTableSkeleton />
                    ) : (
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead
                                            className="cursor-pointer select-none"
                                            onClick={() => handleSort("firstName")}
                                        >
                                            <div className="flex items-center">
                                                Name
                                                <SortIcon field="firstName" />
                                            </div>
                                        </TableHead>
                                        <TableHead
                                            className="cursor-pointer select-none"
                                            onClick={() => handleSort("email")}
                                        >
                                            <div className="flex items-center">
                                                Contact
                                                <SortIcon field="email" />
                                            </div>
                                        </TableHead>
                                        <TableHead
                                            className="cursor-pointer select-none"
                                            onClick={() => handleSort("role")}
                                        >
                                            <div className="flex items-center">
                                                Role
                                                <SortIcon field="role" />
                                            </div>
                                        </TableHead>
                                        <TableHead
                                            className="cursor-pointer select-none"
                                            onClick={() => handleSort("status")}
                                        >
                                            <div className="flex items-center">
                                                Status
                                                <SortIcon field="status" />
                                            </div>
                                        </TableHead>
                                        <TableHead
                                            className="cursor-pointer select-none"
                                            onClick={() => handleSort("createdAt")}
                                        >
                                            <div className="flex items-center">
                                                Joined
                                                <SortIcon field="createdAt" />
                                            </div>
                                        </TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {users.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={6} className="text-center py-8">
                                                No users found
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        users.map((user) => (
                                            <TableRow key={user.id}>
                                                <TableCell>
                                                    <div>
                                                        <div className="font-medium">
                                                            {user.firstName}{" "}
                                                            {user.middleName && `${user.middleName} `}
                                                            {user.lastName}
                                                        </div>
                                                        <div className="text-xs text-muted-foreground">
                                                            NID: {user.nid}
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="space-y-1">
                                                        {user.email && (
                                                            <div className="text-sm flex items-center gap-1">
                                                                {user.email.email}
                                                                {user.email.isVerified && (
                                                                    <Check className="h-3 w-3 text-green-600" />
                                                                )}
                                                            </div>
                                                        )}
                                                        {user.phoneNumber && (
                                                            <div className="text-sm text-muted-foreground flex items-center gap-1">
                                                                {user.phoneNumber.phoneNumber}
                                                                {user.phoneNumber.isVerified && (
                                                                    <Check className="h-3 w-3 text-green-600" />
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    {user.membership?.role?.name || (
                                                        <span className="text-muted-foreground">
                                                            No role
                                                        </span>
                                                    )}
                                                </TableCell>
                                                <TableCell>{getStatusBadge(user.status)}</TableCell>
                                                <TableCell>
                                                    {new Date(user.createdAt).toLocaleDateString()}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex gap-2">
                                                        {user.status === "PENDING" && (
                                                            <Button
                                                                size="sm"
                                                                onClick={() => handleApproval(user)}
                                                            >
                                                                Review
                                                            </Button>
                                                        )}
                                                        {user.status === "ACTIVE" && (
                                                            <Button
                                                                variant="destructive"
                                                                size="sm"
                                                                onClick={() => handleSuspend(user)}
                                                            >
                                                                Suspend
                                                            </Button>
                                                        )}
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    )}

                    {/* Pagination */}
                    {pagination.totalPages > 1 && (
                        <div className="mt-6">
                            <Pagination>
                                <PaginationContent>
                                    <PaginationItem>
                                        <PaginationPrevious
                                            onClick={() =>
                                                handlePageChange(Math.max(1, pagination.page - 1))
                                            }
                                            className={
                                                pagination.page === 1
                                                    ? "pointer-events-none opacity-50"
                                                    : "cursor-pointer"
                                            }
                                        />
                                    </PaginationItem>

                                    {Array.from({ length: pagination.totalPages }, (_, i) => {
                                        const pageNum = i + 1;
                                        const showPage =
                                            pageNum === 1 ||
                                            pageNum === pagination.totalPages ||
                                            (pageNum >= pagination.page - 1 &&
                                                pageNum <= pagination.page + 1);

                                        if (!showPage) {
                                            if (
                                                pageNum === pagination.page - 2 ||
                                                pageNum === pagination.page + 2
                                            ) {
                                                return (
                                                    <PaginationItem key={pageNum}>
                                                        <PaginationEllipsis />
                                                    </PaginationItem>
                                                );
                                            }
                                            return null;
                                        }

                                        return (
                                            <PaginationItem key={pageNum}>
                                                <PaginationLink
                                                    onClick={() => handlePageChange(pageNum)}
                                                    isActive={pagination.page === pageNum}
                                                    className="cursor-pointer"
                                                >
                                                    {pageNum}
                                                </PaginationLink>
                                            </PaginationItem>
                                        );
                                    })}

                                    <PaginationItem>
                                        <PaginationNext
                                            onClick={() =>
                                                handlePageChange(
                                                    Math.min(pagination.totalPages, pagination.page + 1)
                                                )
                                            }
                                            className={
                                                pagination.page === pagination.totalPages
                                                    ? "pointer-events-none opacity-50"
                                                    : "cursor-pointer"
                                            }
                                        />
                                    </PaginationItem>
                                </PaginationContent>
                            </Pagination>
                        </div>
                    )}
                </CardContent>
            </Card>

            {selectedUser && (
                <UserApprovalDialog
                    open={showApprovalDialog}
                    onOpenChange={setShowApprovalDialog}
                    user={selectedUser}
                    onSuccess={handleApprovalSuccess}
                />
            )}

            {selectedUser && (
                <UsersSuspendDialog
                    open={showSuspendDialog}
                    onOpenChange={setShowSuspendDialog}
                    user={selectedUser}
                    onSuccess={handleSuspendSuccess}
                />
            )}
        </>
    );
}