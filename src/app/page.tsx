'use client';

import { TodoList } from '@/components/TodoList';
import { useTodoStore } from '@/store/useTodoStore';
import { PlusIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { useState } from 'react';

export default function Home() {
  const [newTodo, setNewTodo] = useState('');
  const addTodo = useTodoStore((state) => state.addTodo);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const title = newTodo.trim();
    
    if (title) {
      addTodo(title);
      setNewTodo('');
      toast.success('Todo added successfully');
    }
  };

  return (
    <main className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
            Tasks
          </h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
            Manage your tasks efficiently
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mb-8">
          <div className="flex gap-4">
            <input
              type="text"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              placeholder="What needs to be done?"
              className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:placeholder:text-gray-500"
              aria-label="New todo input"
            />
            <button
              type="submit"
              className="inline-flex items-center rounded-lg bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:bg-indigo-500 dark:hover:bg-indigo-400"
              aria-label="Add new todo"
            >
              <PlusIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </form>

        <TodoList />
      </div>
    </main>
  );
}
