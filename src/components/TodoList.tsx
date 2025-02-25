'use client';

import { Fragment, useState } from 'react';
import { TodoItem } from './TodoItem';
import { useTodoStore } from '@/store/useTodoStore';
import { Listbox, Transition } from '@headlessui/react';
import { ChevronUpDownIcon } from '@heroicons/react/20/solid';
import clsx from 'clsx';

const filters = [
  { id: 'all', name: 'All' },
  { id: 'active', name: 'Active' },
  { id: 'completed', name: 'Completed' },
];

export function TodoList() {
  const [selected, setSelected] = useState(filters[0]);
  const { todos, toggleTodo, deleteTodo, editTodo, clearCompleted } = useTodoStore();

  const filteredTodos = todos.filter((todo) => {
    if (selected.id === 'active') return !todo.completed;
    if (selected.id === 'completed') return todo.completed;
    return true;
  });

  const activeTodosCount = todos.filter((todo) => !todo.completed).length;
  const hasCompletedTodos = todos.some((todo) => todo.completed);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="w-32">
          <Listbox value={selected} onChange={setSelected}>
            <div className="relative">
              <Listbox.Button className="relative w-full cursor-pointer rounded-lg bg-white dark:bg-gray-800 py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                <span className="block truncate dark:text-white">{selected.name}</span>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                  <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </span>
              </Listbox.Button>
              <Transition
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white dark:bg-gray-800 py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
                  {filters.map((filter) => (
                    <Listbox.Option
                      key={filter.id}
                      className={({ active }) =>
                        clsx(
                          'relative cursor-pointer select-none py-2 pl-10 pr-4',
                          active ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-900 dark:text-indigo-100' : 'text-gray-900 dark:text-gray-100'
                        )
                      }
                      value={filter}
                    >
                      {({ selected }) => (
                        <>
                          <span className={clsx('block truncate', selected ? 'font-medium' : 'font-normal')}>
                            {filter.name}
                          </span>
                        </>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Transition>
            </div>
          </Listbox>
        </div>

        {hasCompletedTodos && (
          <button
            onClick={clearCompleted}
            className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            Clear completed
          </button>
        )}
      </div>

      <div className="space-y-2">
        {filteredTodos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggle={toggleTodo}
            onDelete={deleteTodo}
            onEdit={editTodo}
          />
        ))}
      </div>

      <div className="text-sm text-gray-500 dark:text-gray-400">
        {activeTodosCount} {activeTodosCount === 1 ? 'item' : 'items'} left
      </div>
    </div>
  );
}