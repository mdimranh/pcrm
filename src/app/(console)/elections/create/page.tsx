// src/app/(dashboard)/elections/create/page.tsx
import { CreateElectionForm } from "@/components/elections/create-election-form";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function CreateElectionPage() {
  return (
    <div className="container max-w-4xl mx-auto py-8">
      <div className="mb-8">
        <Button variant="ghost" asChild className="mb-4">
          <Link href="/elections">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Elections
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Create New Election</h1>
        <p className="text-muted-foreground mt-2">
          Set up a new election with appeal and voting timelines
        </p>
      </div>

      <CreateElectionForm />
    </div>
  );
}