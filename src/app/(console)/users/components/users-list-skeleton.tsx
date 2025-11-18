// src/components/users/users-list-skeleton.tsx
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function UsersListSkeleton() {
    return (
        <Card>
            <CardHeader>
                <Skeleton className="h-8 w-32" />
                <Skeleton className="h-4 w-48 mt-2" />
            </CardHeader>
            <CardContent>
                <div className="flex flex-col gap-4 mb-6 md:flex-row md:items-end">
                    <div className="flex-1">
                        <Skeleton className="h-4 w-16 mb-2" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                    <div className="w-full md:w-48">
                        <Skeleton className="h-4 w-16 mb-2" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                    <div className="w-full md:w-48">
                        <Skeleton className="h-4 w-16 mb-2" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                </div>
                <UsersTableSkeleton />
            </CardContent>
        </Card>
    );
}

export function UsersTableSkeleton() {
    return (
        <div className="rounded-md border">
            <div className="p-4">
                <div className="space-y-3">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-16 w-full" />
                </div>
            </div>
        </div>
    );
}