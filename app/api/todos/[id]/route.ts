// API routes for individual todo operations

import { NextRequest, NextResponse } from 'next/server';
import { getTodoById, updateTodo, deleteTodo } from '@/lib/cloudant';
import { updateTodoSchema } from '@/lib/validation';
import { TodoResponse } from '@/types/todo';

// GET /api/todos/[id] - Get single todo
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const todo = await getTodoById(id);
    
    if (!todo) {
      const response: TodoResponse = {
        success: false,
        error: 'Todo not found',
      };
      
      return NextResponse.json(response, { status: 404 });
    }
    
    const response: TodoResponse = {
      success: true,
      data: todo,
    };
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('GET /api/todos/[id] error:', error);
    
    const response: TodoResponse = {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch todo',
    };
    
    return NextResponse.json(response, { status: 500 });
  }
}

// PUT /api/todos/[id] - Update todo
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    // Validate input
    const validationResult = updateTodoSchema.safeParse(body);
    
    if (!validationResult.success) {
      const response: TodoResponse = {
        success: false,
        error: validationResult.error.issues[0].message,
      };
      
      return NextResponse.json(response, { status: 400 });
    }
    
    const updatedTodo = await updateTodo(id, validationResult.data as any);
    
    const response: TodoResponse = {
      success: true,
      data: updatedTodo,
    };
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('PUT /api/todos/[id] error:', error);
    
    const response: TodoResponse = {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update todo',
    };
    
    return NextResponse.json(response, { status: 500 });
  }
}

// DELETE /api/todos/[id] - Delete todo
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await deleteTodo(id);
    
    const response: TodoResponse = {
      success: true,
    };
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('DELETE /api/todos/[id] error:', error);
    
    const response: TodoResponse = {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete todo',
    };
    
    return NextResponse.json(response, { status: 500 });
  }
}

// Made with Bob
