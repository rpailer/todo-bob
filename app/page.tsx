// Main page - TODO App

'use client';

import React from 'react';
import TodoInput from '@/components/TodoInput';
import TodoList from '@/components/TodoList';
import { useTodos } from '@/hooks/useTodos';

export default function Home() {
  const { todos, loading, error, createTodo, toggleTodo, deleteTodo } = useTodos();

  return (
    <main className="min-h-screen py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Title Bar */}
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            TODO App
          </h1>
          <p className="text-gray-600">
            Manage your tasks efficiently
          </p>
        </header>

       {/* Input Section */}
        <div className="mb-8 bg-white rounded-lg shadow-md p-6">
          <TodoInput onAdd={createTodo} />
        </div>
       
        {/* Task List */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Your Tasks
          </h2>
          <TodoList
            todos={todos}
            loading={loading}
            error={error}
            onToggle={toggleTodo}
            onDelete={deleteTodo}
          />
        </div>

        {/* Footer */}
        <footer className="mt-8 text-center text-gray-500 text-sm">
          <p>Built with Next.js, TypeScript, and IBM Cloudant</p>
        </footer>
      </div>
    </main>
  );
}

// Made with Bob
