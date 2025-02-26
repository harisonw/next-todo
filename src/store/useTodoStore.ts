import { create } from "zustand";

export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
  userId: string;
}

interface TodoStore {
  todos: Todo[];
  isLoading: boolean;
  error: string | null;
  fetchTodos: () => Promise<void>;
  addTodo: (title: string) => Promise<void>;
  toggleTodo: (id: string, completed: boolean) => Promise<void>;
  deleteTodo: (id: string) => Promise<void>;
  editTodo: (id: string, title: string) => Promise<void>;
}

export const useTodoStore = create<TodoStore>()((set, get) => ({
  todos: [],
  isLoading: false,
  error: null,

  fetchTodos: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch("/api/todos");

      if (!response.ok) {
        throw new Error("Failed to fetch todos");
      }

      const todos = await response.json();
      set({ todos, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  addTodo: async (title: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch("/api/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      });

      if (!response.ok) {
        throw new Error("Failed to add todo");
      }

      // After adding, fetch all todos to ensure we have the latest state
      await get().fetchTodos();
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  toggleTodo: async (id: string, completed: boolean) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch("/api/todos", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, completed }),
      });

      if (!response.ok) {
        throw new Error("Failed to update todo");
      }

      // After toggling, fetch all todos to ensure we have the latest state
      await get().fetchTodos();
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  deleteTodo: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/todos?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete todo");
      }

      // After deleting, fetch all todos to ensure we have the latest state
      await get().fetchTodos();
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  editTodo: async (id: string, title: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch("/api/todos", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, title }),
      });

      if (!response.ok) {
        throw new Error("Failed to update todo");
      }

      // After editing, fetch all todos to ensure we have the latest state
      await get().fetchTodos();
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },
}));
