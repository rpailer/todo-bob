// Custom hook for managing todos

//'use client';

import { useState, useEffect, useCallback } from 'react';
import { Todo, TodoState, TodoResponse } from '@/types/todo';

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all todos
  const fetchTodos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/todos');
      const data: TodoResponse = await response.json();
      
      //const data = {success: false, error: 'default', data:{}};
      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch todos');
      }
      
      setTodos(Array.isArray(data.data) ? data.data : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch todos');
    } finally {
      setLoading(false);
    }
  }, []);

  // Create new todo
  const createTodo = useCallback(async (description: string, dueDate?: string) => {
    try {
      const response = await fetch('/api/todos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ description, dueDate }),
      });
      
      const data: TodoResponse = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to create todo');
      }
      
      // Optimistic update
      if (data.data && !Array.isArray(data.data)) {
        setTodos((prev) => [data.data as Todo, ...prev]);
      }
    } catch (err) {
      throw err;
    }
  }, []);

  // Toggle todo state
  const toggleTodo = useCallback(async (id: string) => {
    try {
      // Find the todo to toggle
      const todo = todos.find((t) => t._id === id);
      if (!todo) return;
      
      const newState = todo.state === TodoState.OPEN ? TodoState.FINISHED : TodoState.OPEN;
      
      // Optimistic update
      setTodos((prev) =>
        prev.map((t) =>
          t._id === id ? { ...t, state: newState } : t
        )
      );
      
      const response = await fetch(`/api/todos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ state: newState }),
      });
      
      const data: TodoResponse = await response.json();
      
      if (!data.success) {
        // Revert on error
        setTodos((prev) =>
          prev.map((t) =>
            t._id === id ? { ...t, state: todo.state } : t
          )
        );
        throw new Error(data.error || 'Failed to toggle todo');
      }
    } catch (err) {
      console.error('Error toggling todo:', err);
      throw err;
    }
  }, [todos]);

  // Delete todo
  const deleteTodo = useCallback(async (id: string) => {
    try {
      // Optimistic update
      const previousTodos = todos;
      setTodos((prev) => prev.filter((t) => t._id !== id));
      
      const response = await fetch(`/api/todos/${id}`, {
        method: 'DELETE',
      });
      
      const data: TodoResponse = await response.json();
      
      if (!data.success) {
        // Revert on error
        setTodos(previousTodos);
        throw new Error(data.error || 'Failed to delete todo');
      }
    } catch (err) {
      console.error('Error deleting todo:', err);
      throw err;
    }
  }, [todos]);

  // Fetch todos on mount
  useEffect(() => {
    fetchTodos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    todos,
    loading,
    error,
    createTodo,
    toggleTodo,
    deleteTodo,
    refetch: fetchTodos,
  };
}

// Made with Bob
