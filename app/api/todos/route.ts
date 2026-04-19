// API routes for todos collection

import { NextRequest, NextResponse } from 'next/server';
import { getAllTodos, createTodo, ensureDatabase } from '@/lib/cloudant';
import { createTodoSchema } from '@/lib/validation';
import { TodoResponse } from '@/types/todo';

// GET /api/todos - Get all todos
export async function GET() {
  try {
    await ensureDatabase();
    const todos = await getAllTodos();
    
    const response: TodoResponse = {
      success: true,
      data: todos,
    };
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('GET /api/todos error:', error);
    
    const response: TodoResponse = {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch todos',
    };
    
    return NextResponse.json(response, { status: 500 });
  }
}

// POST /api/todos - Create new todo
export async function POST(request: NextRequest) {
  try {
    await ensureDatabase();
    const body = await request.json();
    
    // Validate input
    const validationResult = createTodoSchema.safeParse(body);
    
    if (!validationResult.success) {
      const response: TodoResponse = {
        success: false,
        error: validationResult.error.issues[0].message,
      };
      
      return NextResponse.json(response, { status: 400 });
    }
    
    const { description, dueDate } = validationResult.data;
    const newTodo = await createTodo(description, dueDate);
    
    const response: TodoResponse = {
      success: true,
      data: newTodo,
    };
    
    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error('POST /api/todos error:', error);
    
    const response: TodoResponse = {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create todo',
    };
    
    return NextResponse.json(response, { status: 500 });
  }
}

// Made with Bob
