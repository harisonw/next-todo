"use client";

import { useTodoStore } from "@/store/useTodoStore";
import { useEffect } from "react";
import toast from "react-hot-toast";
import NewTodoForm from "./NewTodoForm";
import TodoItem from "./TodoItem";

export default function TodoList() {
  const { todos, fetchTodos, error, isLoading } = useTodoStore();

  useEffect(() => {
    // Initial fetch
    fetchTodos().catch(() => {
      toast.error("Failed to load todos");
    });

    // Set up polling for new todos
    const interval = setInterval(() => {
      fetchTodos().catch(() => {
        // Silently fail on polling errors to avoid spamming the user
        console.error("Failed to poll todos");
      });
    }, 5000); // Poll every 5 seconds

    return () => clearInterval(interval);
  }, [fetchTodos]);

  if (error) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-500">Error loading todos: {error}</p>
        <button
          onClick={() => fetchTodos()}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-4">
      <NewTodoForm />

      {isLoading && todos.length === 0 ? (
        <div className="text-center p-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            Loading todos...
          </p>
        </div>
      ) : (
        <div>
          {todos.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center p-8">
              No todos yet. Add one above!
            </p>
          ) : (
            <ul className="mt-6 space-y-4">
              {todos.map((todo) => (
                <TodoItem key={todo.id} todo={todo} />
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
