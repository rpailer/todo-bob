// TodoItem component for displaying individual todo

'use client';

import React from 'react';
import { Todo, TodoState } from '@/types/todo';
import Checkbox from './ui/Checkbox';
import { format } from 'date-fns';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export default function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
  const isFinished = todo.state === TodoState.FINISHED;

  const handleToggle = async () => {
    await onToggle(todo._id);
  };

  const handleDelete = async () => {
    await onDelete(todo._id);
  };

  return (
    <div className="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
      <Checkbox
        checked={isFinished}
        onChange={handleToggle}
      />
      
      <div className="flex-1 min-w-0">
        <p className={`text-gray-800 ${isFinished ? 'line-through text-gray-500' : ''}`}>
          {todo.description}
        </p>
        {todo.dueDate && (
          <p className="text-sm text-gray-500 mt-1">
            Due: {format(new Date(todo.dueDate), 'MMM dd, yyyy')}
          </p>
        )}
      </div>

      <button
        onClick={handleDelete}
        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        aria-label="Delete todo"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
      </button>
    </div>
  );
}

// Made with Bob
