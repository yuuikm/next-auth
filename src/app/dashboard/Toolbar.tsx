"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import api from "../utils/api";

export default function Toolbar({
  selectedUserIds,
  setUsers,
}: {
  selectedUserIds: number[];
  setUsers: (users: any[]) => void;
}) {
  const router = useRouter();

  const handleAction = async (action: string) => {
    try {
      if (selectedUserIds.length === 0) {
        console.error("No users selected");
        return;
      }
      await api.patch(`/users/${action}`, { ids: selectedUserIds });
      const response = await api.get("/users");
      setUsers(response.data);
    } catch (error) {
      console.error(`Failed to ${action} users:`, error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    router.push("/");
  };

  return (
    <div className="flex items-center space-x-4">
      <Button
        onClick={() => handleAction("block")}
        variant="outline"
        className="bg-gray-100"
      >
        Block
      </Button>
      <Button
        onClick={() => handleAction("unblock")}
        variant="outline"
        className="bg-gray-100"
      >
        Unblock
      </Button>
      <Button
        onClick={() => handleAction("delete")}
        variant="destructive"
        className="bg-red-500 text-white"
      >
        Delete
      </Button>
      <Button
        onClick={handleLogout}
        variant="outline"
        className="bg-blue-500 text-white ml-auto"
      >
        Logout
      </Button>
    </div>
  );
}
