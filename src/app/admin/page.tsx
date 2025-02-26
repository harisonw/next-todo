"use client";

import AdminTodoList from "@/components/admin/AdminTodoList";
import UserManagementPanel from "@/components/admin/UserManagementPanel";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface Todo {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
  user: {
    name: string | null;
    email: string | null;
  };
}

interface User {
  id: string;
  name: string | null;
  email: string | null;
  role: string;
  _count: {
    todos: number;
  };
}

export default function AdminPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    try {
      const [todosRes, usersRes] = await Promise.all([
        fetch("/api/admin/todos"),
        fetch("/api/admin/users"),
      ]);

      if (!todosRes.ok || !usersRes.ok) {
        throw new Error("Failed to fetch data");
      }

      const [todosData, usersData] = await Promise.all([
        todosRes.json(),
        usersRes.json(),
      ]);

      setTodos(todosData);
      setUsers(usersData);
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();

    // Set up polling for new data
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleTodoChange = () => {
    loadData(); // Refresh both todos and users data
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        Admin Dashboard
      </h1>
      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
            User Management
          </h2>
          <UserManagementPanel users={users} onUserChange={handleTodoChange} />
        </section>
        <section>
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
            Recent Todos
          </h2>
          <AdminTodoList initialTodos={todos} onTodoChange={handleTodoChange} />
        </section>
      </div>
    </div>
  );
}
