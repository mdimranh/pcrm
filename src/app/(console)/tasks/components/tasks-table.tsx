"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useMemo, useState } from "react";

// Example data type
type Task = {
  id: number;
  title: string;
  status: string;
  priority: string;
};

type TasksTableProps = {
  data: Task[];
};

export function TasksTable({ data }: TasksTableProps) {
  const [search, setSearch] = useState("");
  const [sortAsc, setSortAsc] = useState(true);
  const [page, setPage] = useState(1);
  const pageSize = 5;

  // Filter data by search
  const filteredData = useMemo(() => {
    return data.filter(
      (task) =>
        task.title.toLowerCase().includes(search.toLowerCase()) ||
        String(task.id).includes(search)
    );
  }, [data, search]);

  // Sort data by ID
  const sortedData = useMemo(() => {
    return [...filteredData].sort((a, b) =>
      sortAsc ? a.id - b.id : b.id - a.id
    );
  }, [filteredData, sortAsc]);

  // Pagination
  const paginatedData = useMemo(() => {
    const start = (page - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, page]);

  const pageCount = Math.ceil(filteredData.length / pageSize);

  return (
    <div className="flex flex-col gap-4">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <Input
          placeholder="Filter by title or ID..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="max-w-sm"
        />
        <Button onClick={() => setSortAsc(!sortAsc)}>
          Sort by ID {sortAsc ? "↑" : "↓"}
        </Button>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Priority</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length > 0 ? (
              paginatedData.map((task) => (
                <TableRow key={task.id}>
                  <TableCell>{task.id}</TableCell>
                  <TableCell>{task.title}</TableCell>
                  <TableCell>{task.status}</TableCell>
                  <TableCell>{task.priority}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center h-24">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center">
        <Button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
        >
          Previous
        </Button>
        <span>
          Page {page} of {pageCount}
        </span>
        <Button
          onClick={() => setPage((p) => Math.min(p + 1, pageCount))}
          disabled={page === pageCount}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
