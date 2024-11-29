"use client";

import { useEffect, useRef, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function UsersTable({
  users,
  setSelectedUserIds,
}: {
  users: any[];
  setSelectedUserIds: (ids: number[]) => void;
}) {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const allSelected = users.length > 0 && users.every((user) => selectedIds.includes(user.id));
  const someSelected = users.some((user) => selectedIds.includes(user.id)) && !allSelected;

  const selectAllRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (selectAllRef.current) {
      selectAllRef.current.indeterminate = someSelected;
    }
  }, [someSelected]);

  useEffect(() => {
    setSelectedUserIds(selectedIds);
  }, [selectedIds, setSelectedUserIds]);

  const handleCheckboxChange = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((userId) => userId !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (isChecked: boolean) => {
    setSelectedIds(isChecked ? users.map((user) => user.id) : []);
  };

  return (
    <div className="w-full overflow-x-auto">
      <Table className="min-w-[640px] text-sm">
        <TableHeader>
          <TableRow>
            <TableHead>
              <input
                type="checkbox"
                ref={selectAllRef}
                checked={allSelected}
                onChange={(e) => handleSelectAll(e.target.checked)}
              />
            </TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Last Login</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id} className="hover:bg-gray-100">
              <TableCell>
                <input
                  type="checkbox"
                  checked={selectedIds.includes(user.id)}
                  onChange={() => handleCheckboxChange(user.id)}
                />
              </TableCell>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell className="capitalize">{user.status}</TableCell>
              <TableCell>
                {user.lastLogin
                  ? new Date(user.lastLogin).toLocaleString()
                  : "Never"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
