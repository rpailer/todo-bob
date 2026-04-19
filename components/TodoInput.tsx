// TodoInput component for creating new todos

//'use client';

import React, { useState } from 'react';
import Input from './ui/Input';
import Button from './ui/Button';

interface TodoInputProps {
  onAdd: (description: string) => Promise<void>;
}

export default function TodoInput({ onAdd }: TodoInputProps) {
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  console.log('rendering TodoInput');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate
    const trimmed = description.trim();
    if (!trimmed) {
      setError('Description is required');
      return;
    }
    
    if (trimmed.length > 500) {
      setError('Description must be 500 characters or less');
      return;
    }

    setError('');
    setIsSubmitting(true);

    try {
      await onAdd(trimmed);
      setDescription('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add todo');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmit(e as any);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex gap-2">
        <Input
          type="text"
          placeholder="Enter a new task..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          onKeyDown={handleKeyDown}
          error={error}
          disabled={isSubmitting}
        />
        <Button
          type="submit"
          loading={isSubmitting}
          disabled={isSubmitting}
        >
          Add
        </Button>
      </div>
    </form>
  );
}

// Made with Bob
