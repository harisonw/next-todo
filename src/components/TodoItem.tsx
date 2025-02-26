"use client";

import { Todo, useTodoStore } from "@/store/useTodoStore";
import { useState } from "react";

interface TodoItemProps {
  todo: Todo;
}

export default function TodoItem({ todo }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(todo.title);
  const { toggleTodo, deleteTodo, editTodo } = useTodoStore();

  const handleToggle = () => {
    toggleTodo(todo.id, !todo.completed);
  };

  const handleDelete = () => {
    deleteTodo(todo.id);
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditValue(todo.title);
  };

  const handleSave = () => {
    if (editValue.trim()) {
      editTodo(todo.id, editValue.trim());
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditValue(todo.title);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      handleCancel();
    }
  };

  return (
    <li className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
      <div className="flex items-center">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={handleToggle}
          className="h-5 w-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 dark:border-gray-600"
          aria-label={`Mark "${todo.title}" as ${todo.completed ? 'incomplete' : 'complete'}`}
        />
        <div className="flex-1 min-w-0 ml-3">
          {isEditing ? (
            <input
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={handleSave}
              onKeyDown={handleKeyDown}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              autoFocus
              aria-label={`Edit todo item: ${todo.title}`}
            />
          ) : (
            <p
              className={`text-sm ${
                todo.completed
                  ? "line-through text-gray-500 dark:text-gray-400"
                  : "text-gray-900 dark:text-white"
              }`}
            >
              {todo.title}
            </p>
          )}
          <p className="text-xs text-gray-400 mt-1">
            {new Date(todo.createdAt).toLocaleString()}
          </p>
        </div>
        <div className="flex gap-2 ml-4">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                className="p-1 text-indigo-600 hover:text-indigo-800 dark:hover:text-indigo-400"
              >
                Save
              </button>
              <button
                onClick={handleCancel}
                className="p-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleEdit}
                className="p-1 text-indigo-600 hover:text-indigo-800 dark:hover:text-indigo-400"
              >
                Edit
              </button>
              <button
                onClick={handleDelete}
                className="p-1 text-red-600 hover:text-red-800 dark:hover:text-red-400"
              >
                Delete
              </button>
            </>
          )}
        </div>
      </div>
    </li>
  );
}
