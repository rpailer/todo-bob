// TypeScript interfaces for Todo application

export interface Todo {
  _id: string;                    // Cloudant document ID
  _rev?: string;                  // Cloudant revision (for updates)
  id: number;                     // Application-level unique ID
  description: string;            // Task description (1-500 chars)
  state: TodoState;               // Task status
  createdAt: string;              // ISO 8601 timestamp
  dueDate?: string;               // Optional ISO 8601 date
}

export enum TodoState {
  OPEN = 'open',
  FINISHED = 'finished'
}

export interface CreateTodoRequest {
  description: string;
  dueDate?: string;
}

export interface UpdateTodoRequest {
  description?: string;
  state?: TodoState;
  dueDate?: string;
}

export interface TodoResponse {
  success: boolean;
  data?: Todo | Todo[];
  error?: string;
}

// Made with Bob
