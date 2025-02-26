"use client";

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

interface AdminTodoListProps {
  initialTodos: Todo[];
  onTodoChange?: () => void;
}

export default function AdminTodoList({ initialTodos, onTodoChange }: AdminTodoListProps) {
  const [todos, setTodos] = useState<Todo[]>(initialTodos);
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  // Add useEffect to refresh todos when needed and set up polling
  useEffect(() => {
    loadTodos(selectedUser);

    // Set up polling for new todos
    const interval = setInterval(() => {
      loadTodos(selectedUser);
    }, 5000); // Poll every 5 seconds

    return () => clearInterval(interval);
  }, [initialTodos, selectedUser]); // Refresh when initialTodos or selectedUser changes

  const loadTodos = async (userId: string | null = null) => {
    setIsLoading("fetch");
    try {
      const url = userId
        ? `/api/admin/todos?userId=${userId}`
        : "/api/admin/todos";
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Failed to fetch todos");
      }

      const data = await response.json();
      setTodos(data);
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setIsLoading(null);
    }
  };

  const handleUserFilter = (userId: string | null) => {
    setSelectedUser(userId);
    loadTodos(userId);
  };

  const handleDeleteTodo = async (id: string) => {
    setIsLoading(id);
    try {
      const response = await fetch(`/api/admin/todos?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete todo");
      }

      // Update local state
      setTodos(todos.filter((todo) => todo.id !== id));
      
      // Notify parent of the change
      onTodoChange?.();
      
      toast.success("Todo deleted successfully");
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setIsLoading(null);
    }
  };

  // Extract unique users from todos
  const uniqueUsers = Array.from(new Set(todos.map((todo) => todo.user.email)))
    .filter(Boolean)
    .map((email) => {
      const todo = todos.find((t) => t.user.email === email);
      return {
        email,
        name: todo?.user.name || "Unknown",
      };
    });

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4 mb-4">
        <label
          htmlFor="userFilter"
          className="text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Filter by user:
        </label>
        <select
          id="userFilter"
          value={selectedUser || ""}
          onChange={(e) => handleUserFilter(e.target.value || null)}
          className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
        >
          <option value="">All users</option>
          {uniqueUsers.map((user) => (
            <option key={user.email as string} value={user.email as string}>
              {user.name} ({user.email})
            </option>
          ))}
        </select>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {todos.length > 0 ? (
            todos.map((todo) => (
              <li key={todo.id} className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={todo.completed}
                      readOnly
                      title="Todo completion status"
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <p
                      className={`ml-3 text-sm ${
                        todo.completed
                          ? "line-through text-gray-500 dark:text-gray-400"
                          : "text-gray-900 dark:text-white"
                      }`}
                    >
                      {todo.title}
                    </p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      by {todo.user.name || todo.user.email}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(todo.createdAt).toLocaleDateString()}
                    </span>
                    <button
                      onClick={() => handleDeleteTodo(todo.id)}
                      disabled={isLoading === todo.id}
                      className="text-red-600 hover:text-red-900 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </li>
            ))
          ) : (
            <li className="px-4 py-6 sm:px-6 text-center text-gray-500 dark:text-gray-400">
              No todos found
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
