"use client";

import { useTodoStore } from "@/store/useTodoStore";
import { useState } from "react";
import toast from "react-hot-toast";

export default function NewTodoForm() {
  const [title, setTitle] = useState("");
  const { addTodo, isLoading } = useTodoStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      await addTodo(title.trim());
      setTitle("");
      toast.success("Todo added successfully");
    } catch (error) {
      // Error handling is done in the store
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="flex items-center">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Add a new task..."
          className="flex-1 rounded-l-md border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !title.trim()}
          className="rounded-r-md border border-l-0 border-indigo-600 bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Adding..." : "Add"}
        </button>
      </div>
    </form>
  );
}
