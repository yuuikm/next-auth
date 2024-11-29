"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import Toolbar from "./Toolbar";
import Table from "./Table";
import api from "../utils/api";

export default function Dashboard() {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [selectedUserIds, setSelectedUserIds] = useState<number[]>([]);
  const [currentUser, setCurrentUser] = useState<{ email: string; name: string; status: string } | null>(null);

  const checkUserStatus = async () => {
    const token = Cookies.get("token");
    if (!token) {
      router.push("/");
      return;
    }

    try {
      const response = await api.get("/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.status === "blocked") {
        Cookies.remove("token");
        router.push("/");
        return;
      }

      setCurrentUser({
        email: response.data.email,
        name: response.data.name,
        status: response.data.status,
      });
    } catch (error) {
      console.error("Authentication failed:", error);
      Cookies.remove("token");
      router.push("/");
    }
  };

  useEffect(() => {
    checkUserStatus();
    const interval = setInterval(() => {
      checkUserStatus();
    }, 1000);
    return () => clearInterval(interval);
  }, [router]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get("/users");
        setUsers(response.data);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="p-16">
      <div className="mb-8 text-xl font-semibold">
        {currentUser
          ? `Hello, ${currentUser.name} (${currentUser.email})`
          : "Loading user information..."}
      </div>
      <Toolbar selectedUserIds={selectedUserIds} setUsers={setUsers} />
      <Table users={users} setSelectedUserIds={setSelectedUserIds} />
    </div>
  );
}
