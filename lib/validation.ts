// Validation schemas using Zod

import { z } from 'zod';

export const createTodoSchema = z.object({
  description: z.string()
    .trim()
    .min(1, 'Description is required')
    .max(500, 'Description must be 500 characters or less'),
  dueDate: z.string().datetime().optional()
});

export const updateTodoSchema = z.object({
  description: z.string()
    .trim()
    .min(1)
    .max(500)
    .optional(),
  state: z.enum(['open', 'finished']).optional(),
  dueDate: z.string().datetime().optional()
});

export type CreateTodoInput = z.infer<typeof createTodoSchema>;
export type UpdateTodoInput = z.infer<typeof updateTodoSchema>;

// Made with Bob
