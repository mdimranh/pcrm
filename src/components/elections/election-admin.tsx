// src/components/elections/election-admin.tsx
"use client";

import { useState } from "react";
import { Election } from "@/types/election";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CandidateApproval } from "./candidate-approval";
import { ElectionStatusManager } from "./election-status-manager";
import { ElectionResults } from "./election-results";

interface ElectionAdminProps {
  election: Election;
  onUpdate: () => void;
}

export function ElectionAdmin({ election, onUpdate }: ElectionAdminProps) {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="candidates" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="candidates">Approve Candidates</TabsTrigger>
          <TabsTrigger value="status">Manage Status</TabsTrigger>
          <TabsTrigger value="results">Results</TabsTrigger>
        </TabsList>

        <TabsContent value="candidates" className="mt-6">
          <CandidateApproval election={election} onUpdate={onUpdate} />
        </TabsContent>

        <TabsContent value="status" className="mt-6">
          <ElectionStatusManager election={election} onUpdate={onUpdate} />
        </TabsContent>

        <TabsContent value="results" className="mt-6">
          <ElectionResults election={election} onUpdate={onUpdate} />
        </TabsContent>
      </Tabs>
    </div>
  );
}