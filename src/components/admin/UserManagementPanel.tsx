"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface User {
  id: string;
  name: string | null;
  email: string | null;
  role: string;
  _count: {
    todos: number;
  };
}

interface UserManagementPanelProps {
  users: User[];
  onUserChange?: () => void;
}

export default function UserManagementPanel({
  users: initialUsers,
  onUserChange,
}: UserManagementPanelProps) {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const router = useRouter();

  // Update local state when initialUsers changes
  useEffect(() => {
    setUsers(initialUsers);
  }, [initialUsers]);

  const handleRoleChange = async (userId: string, newRole: string) => {
    setIsLoading(userId);
    try {
      const response = await fetch("/api/admin/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: userId, role: newRole }),
      });

      if (!response.ok) {
        throw new Error("Failed to update user role");
      }

      setUsers(
        users.map((user) =>
          user.id === userId ? { ...user, role: newRole } : user
        )
      );
      toast.success(`User role updated to ${newRole}`);
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setIsLoading(null);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (
      !confirm("Are you sure you want to delete this user and all their data?")
    )
      return;

    setIsLoading(userId);
    try {
      const response = await fetch(`/api/admin/users?id=${userId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete user");
      }

      setUsers(users.filter((user) => user.id !== userId));
      onUserChange?.();
      toast.success("User deleted successfully");
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setIsLoading(null);
    }
  };

  const handleDeleteUserTodos = async (userId: string) => {
    if (!confirm("Are you sure you want to delete all todos for this user?"))
      return;

    setIsLoading(userId);
    try {
      const response = await fetch(`/api/admin/todos?userId=${userId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete user todos");
      }

      // Update local state
      setUsers(
        users.map((user) =>
          user.id === userId ? { ...user, _count: { todos: 0 } } : user
        )
      );

      onUserChange?.();

      // Refresh the page to update the todos list
      router.refresh();

      toast.success("All todos deleted for this user");
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <div className="overflow-hidden bg-white dark:bg-gray-800 shadow sm:rounded-lg">
      <table className="w-full table-fixed divide-y divide-gray-200 dark:divide-gray-700">
        <thead>
          <tr>
            <th className="px-4 py-3 bg-gray-50 dark:bg-gray-900 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-1/6">
              Name
            </th>
            <th className="px-4 py-3 bg-gray-50 dark:bg-gray-900 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-2/6">
              Email
            </th>
            <th className="px-4 py-3 bg-gray-50 dark:bg-gray-900 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-1/6">
              Role
            </th>
            <th className="px-4 py-3 bg-gray-50 dark:bg-gray-900 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-1/12">
              Todos
            </th>
            <th className="px-4 py-3 bg-gray-50 dark:bg-gray-900 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-3/12">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          {users.map((user) => (
            <tr key={user.id}>
              <td className="px-4 py-4 text-sm text-gray-900 dark:text-white truncate">
                {user.name || "N/A"}
              </td>
              <td className="px-4 py-4 text-sm text-gray-900 dark:text-white truncate">
                {user.email}
              </td>
              <td className="px-4 py-4 text-sm text-gray-900 dark:text-white">
                <select
                  value={user.role}
                  onChange={(e) => handleRoleChange(user.id, e.target.value)}
                  disabled={isLoading === user.id}
                  title={`Change role for ${user.name || user.email}`}
                  className="block w-full rounded-md border border-gray-300 bg-white py-1.5 px-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </td>
              <td className="px-4 py-4 text-sm text-gray-900 dark:text-white">
                {user._count.todos}
              </td>
              <td className="px-4 py-4 text-sm font-medium">
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleDeleteUserTodos(user.id)}
                    disabled={isLoading === user.id || user._count.todos === 0}
                    className="text-red-600 hover:text-red-900 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                  >
                    Delete Todos
                  </button>
                  <button
                    onClick={() => handleDeleteUser(user.id)}
                    disabled={isLoading === user.id}
                    className="text-red-600 hover:text-red-900 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                  >
                    Delete User
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
