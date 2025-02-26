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
    const optimisticTodo: Todo = {
      id: Date.now().toString(), // Temporary ID
      title,
      completed: false,
      createdAt: new Date().toISOString(),
      userId: "", // Will be set by the server
    };

    // Optimistically add the todo
    set((state) => ({
      todos: [optimisticTodo, ...state.todos],
      isLoading: true,
      error: null,
    }));

    try {
      const response = await fetch("/api/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      });

      if (!response.ok) {
        throw new Error("Failed to add todo");
      }

      // Replace the optimistic todo with the real one
      const newTodo = await response.json();
      set((state) => ({
        todos: state.todos.map((todo) =>
          todo.id === optimisticTodo.id ? newTodo : todo
        ),
        isLoading: false,
      }));
    } catch (error) {
      // Revert the optimistic update on error
      set((state) => ({
        todos: state.todos.filter((todo) => todo.id !== optimisticTodo.id),
        error: (error as Error).message,
        isLoading: false,
      }));
    }
  },

  toggleTodo: async (id: string, completed: boolean) => {
    // Optimistically update the todo
    set((state) => ({
      todos: state.todos.map((todo) =>
        todo.id === id ? { ...todo, completed } : todo
      ),
      isLoading: true,
      error: null,
    }));

    try {
      const response = await fetch("/api/todos", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, completed }),
      });

      if (!response.ok) {
        throw new Error("Failed to update todo");
      }

      const updatedTodo = await response.json();
      // Update with the server response to ensure consistency
      set((state) => ({
        todos: state.todos.map((todo) => (todo.id === id ? updatedTodo : todo)),
        isLoading: false,
      }));
    } catch (error) {
      // Revert the optimistic update on error
      set((state) => ({
        todos: state.todos.map((todo) =>
          todo.id === id ? { ...todo, completed: !completed } : todo
        ),
        error: (error as Error).message,
        isLoading: false,
      }));
    }
  },

  deleteTodo: async (id: string) => {
    // Optimistically remove the todo
    const deletedTodo = get().todos.find((todo) => todo.id === id);
    set((state) => ({
      todos: state.todos.filter((todo) => todo.id !== id),
      isLoading: true,
      error: null,
    }));

    try {
      const response = await fetch(`/api/todos?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete todo");
      }

      set({ isLoading: false });
    } catch (error) {
      // Revert the optimistic delete on error
      if (deletedTodo) {
        set((state) => ({
          todos: [...state.todos, deletedTodo],
          error: (error as Error).message,
          isLoading: false,
        }));
      }
    }
  },

  editTodo: async (id: string, title: string) => {
    // Store the original title for reverting if needed
    const originalTodo = get().todos.find((todo) => todo.id === id);

    // Optimistically update the todo
    set((state) => ({
      todos: state.todos.map((todo) =>
        todo.id === id ? { ...todo, title } : todo
      ),
      isLoading: true,
      error: null,
    }));

    try {
      const response = await fetch("/api/todos", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, title }),
      });

      if (!response.ok) {
        throw new Error("Failed to update todo");
      }

      const updatedTodo = await response.json();
      set((state) => ({
        todos: state.todos.map((todo) => (todo.id === id ? updatedTodo : todo)),
        isLoading: false,
      }));
    } catch (error) {
      // Revert the optimistic update on error
      if (originalTodo) {
        set((state) => ({
          todos: state.todos.map((todo) =>
            todo.id === id ? originalTodo : todo
          ),
          error: (error as Error).message,
          isLoading: false,
        }));
      }
    }
  },
}));
