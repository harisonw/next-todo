'use client';

import { useState } from 'react';
import { Todo } from '@/store/useTodoStore';
import { CheckCircleIcon, PencilIcon, TrashIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleSolidIcon } from '@heroicons/react/24/solid';
import clsx from 'clsx';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, title: string) => void;
}

export function TodoItem({ todo, onToggle, onDelete, onEdit }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(todo.title);

  const handleEdit = () => {
    const newTitle = editedTitle.trim();
    if (newTitle && newTitle !== todo.title) {
      onEdit(todo.id, newTitle);
    } else {
      setEditedTitle(todo.title);
    }
    setIsEditing(false);
  };

  return (
    <div className={clsx(
      'group flex items-center gap-4 rounded-lg border p-4 shadow-sm transition-colors',
      'bg-white dark:bg-gray-800 dark:border-gray-700',
      todo.completed && 'bg-gray-50 dark:bg-gray-900'
    )}>
      <button
        onClick={() => onToggle(todo.id)}
        className="flex-shrink-0 text-gray-400 hover:text-green-500 dark:text-gray-600 dark:hover:text-green-400"
        aria-label={todo.completed ? "Mark as incomplete" : "Mark as complete"}
      >
        {todo.completed ? (
          <CheckCircleSolidIcon className="h-6 w-6 text-green-500 dark:text-green-400" aria-hidden="true" />
        ) : (
          <CheckCircleIcon className="h-6 w-6" aria-hidden="true" />
        )}
      </button>

      {isEditing ? (
        <div className="flex flex-1 items-center gap-2">
          <input
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleEdit()}
            className="flex-1 rounded-md border-gray-300 bg-white px-3 py-1.5 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            autoFocus
            aria-label="Edit todo title"
            placeholder="Enter new title"
          />
          <button
            onClick={handleEdit}
            className="text-green-500 hover:text-green-600 dark:text-green-400 dark:hover:text-green-300"
            aria-label="Save changes"
          >
            <CheckCircleIcon className="h-5 w-5" aria-hidden="true" />
          </button>
          <button
            onClick={() => {
              setIsEditing(false);
              setEditedTitle(todo.title);
            }}
            className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300"
            aria-label="Cancel editing"
          >
            <XCircleIcon className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      ) : (
        <>
          <span className={clsx(
            'flex-1 text-gray-900 dark:text-gray-100',
            todo.completed && 'text-gray-500 line-through dark:text-gray-400'
          )}>
            {todo.title}
          </span>
          <div className="flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
            <button
              onClick={() => setIsEditing(true)}
              className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
              aria-label="Edit todo"
            >
              <PencilIcon className="h-5 w-5" aria-hidden="true" />
            </button>
            <button
              onClick={() => onDelete(todo.id)}
              className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300"
              aria-label="Delete todo"
            >
              <TrashIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </>
      )}
    </div>
  );
}