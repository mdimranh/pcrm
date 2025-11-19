// src/app/(dashboard)/elections/page.tsx
import { Suspense } from "react";
import { ElectionsList } from "@/components/elections/elections-list";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";
import { getCurrentUserServer } from "@/core/auth/current-user-server";
import db from "@/core/db";

export default async function ElectionsPage() {
  const currentUser = await getCurrentUserServer();
  
  const membership = currentUser
    ? await db.member.findFirst({
        where: { userId: currentUser.id },
        include: { role: true },
      })
    : null;

  const isAdmin = membership?.isAdmin || membership?.role?.isSuperAdmin;

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Elections</h1>
          <p className="text-muted-foreground mt-2">
            View and participate in organizational elections
          </p>
        </div>
        {isAdmin && (
          <Button asChild>
            <Link href="/elections/create">
              <Plus className="mr-2 h-4 w-4" />
              Create Election
            </Link>
          </Button>
        )}
      </div>

      <Suspense fallback={<ElectionsListSkeleton />}>
        <ElectionsList />
      </Suspense>
    </div>
  );
}

function ElectionsListSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="h-48 rounded-lg border bg-card animate-pulse"
        />
      ))}
    </div>
  );
}