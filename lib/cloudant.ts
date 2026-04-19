// Cloudant database client and operations

import { CloudantV1 } from '@ibm-cloud/cloudant';
import { IamAuthenticator } from '@ibm-cloud/cloudant/auth';
import { Todo, TodoState } from '@/types/todo';

// Initialize Cloudant client
let cloudantClient: CloudantV1 | null = null;

export function getCloudantClient(): CloudantV1 {
  if (!cloudantClient) {
    const authenticator = new IamAuthenticator({
      apikey: process.env.CLOUDANT_APIKEY!,
    });

    cloudantClient = CloudantV1.newInstance({
      authenticator,
      serviceUrl: process.env.CLOUDANT_URL,
    });
  }

  return cloudantClient;
}

const DB_NAME = process.env.CLOUDANT_DB_NAME || 'todo-db';

// Ensure database exists
export async function ensureDatabase(): Promise<void> {
  const client = getCloudantClient();
  
  try {
    await client.getDatabaseInformation({ db: DB_NAME });
  } catch (error: any) {
    if (error.status === 404) {
      // Database doesn't exist, create it
      await client.putDatabase({ db: DB_NAME });
      console.log(`Database ${DB_NAME} created successfully`);
    } else {
      throw error;
    }
  }
}

// Get all todos
export async function getAllTodos(): Promise<Todo[]> {
  const client = getCloudantClient();
  
  try {
    const response = await client.postAllDocs({
      db: DB_NAME,
      includeDocs: true,
    });

    const todos = response.result.rows
      .filter(row => row.doc && row.id && !row.id.startsWith('_design'))
      .map(row => row.doc as Todo)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return todos;
  } catch (error) {
    console.error('Error fetching todos:', error);
    throw new Error('Failed to fetch todos');
  }
}

// Get todo by ID
export async function getTodoById(id: string): Promise<Todo | null> {
  const client = getCloudantClient();
  
  try {
    const response = await client.getDocument({
      db: DB_NAME,
      docId: id,
    });

    return response.result as Todo;
  } catch (error: any) {
    if (error.status === 404) {
      return null;
    }
    console.error('Error fetching todo:', error);
    throw new Error('Failed to fetch todo');
  }
}

// Create new todo
export async function createTodo(description: string, dueDate?: string): Promise<Todo> {
  const client = getCloudantClient();
  
  // Generate unique ID
  const timestamp = Date.now();
  const id = Math.floor(Math.random() * 1000000);
  const docId = `todo_${timestamp}`;

  const newTodo: Omit<Todo, '_rev'> = {
    _id: docId,
    id,
    description,
    state: TodoState.OPEN,
    createdAt: new Date().toISOString(),
    ...(dueDate && { dueDate }),
  };

  try {
    const response = await client.postDocument({
      db: DB_NAME,
      document: newTodo,
    });

    return {
      ...newTodo,
      _rev: response.result.rev,
    };
  } catch (error) {
    console.error('Error creating todo:', error);
    throw new Error('Failed to create todo');
  }
}

// Update todo
export async function updateTodo(
  id: string,
  updates: { description?: string; state?: TodoState; dueDate?: string }
): Promise<Todo> {
  const client = getCloudantClient();
  
  try {
    // First, get the current document
    const currentDoc = await getTodoById(id);
    if (!currentDoc) {
      throw new Error('Todo not found');
    }

    // Merge updates
    const updatedTodo: Todo = {
      ...currentDoc,
      ...updates,
    };

    // Update the document
    const response = await client.postDocument({
      db: DB_NAME,
      document: updatedTodo,
    });

    return {
      ...updatedTodo,
      _rev: response.result.rev,
    };
  } catch (error) {
    console.error('Error updating todo:', error);
    throw new Error('Failed to update todo');
  }
}

// Delete todo
export async function deleteTodo(id: string): Promise<void> {
  const client = getCloudantClient();
  
  try {
    // Get current document to get the revision
    const currentDoc = await getTodoById(id);
    if (!currentDoc || !currentDoc._rev) {
      throw new Error('Todo not found');
    }

    await client.deleteDocument({
      db: DB_NAME,
      docId: id,
      rev: currentDoc._rev,
    });
  } catch (error) {
    console.error('Error deleting todo:', error);
    throw new Error('Failed to delete todo');
  }
}

// Made with Bob
