// src/app/(dashboard)/elections/[electionId]/page.tsx

import { ElectionDetails } from "@/components/elections/election-details";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface PageProps {
  params: Promise<{ electionId: string }>;
}

export default async function ElectionDetailPage({ params }: PageProps) {
  const { electionId } = await params;

  return (
    <div className="container mx-auto py-8">
      <Button variant="ghost" asChild className="mb-4">
        <Link href="/elections">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Elections
        </Link>
      </Button>

      <ElectionDetails electionId={electionId} />
    </div>
  );
}