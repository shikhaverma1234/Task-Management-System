// Placeholder service for Task CRUD operations
// In a real application, this would interact with a backend API (e.g., Node.js/MongoDB)

import type { Task, TaskPriority, TaskStatus } from '@/lib/types';

// Simulate a database with an in-memory array
let tasks: Task[] = [
  { id: '1', title: 'Design Homepage Mockup', description: 'Create wireframes and final design for the homepage.', dueDate: new Date(2024, 7, 15), priority: 'High', status: 'In Progress', createdAt: new Date(2024, 6, 1), updatedAt: new Date(2024, 6, 5) },
  { id: '2', title: 'Develop Authentication Flow', description: 'Implement user login and registration backend.', dueDate: new Date(2024, 7, 20), priority: 'High', status: 'To Do', createdAt: new Date(2024, 6, 2), updatedAt: new Date(2024, 6, 2) },
  { id: '3', title: 'Setup Database Schema', description: 'Define MongoDB schema for tasks and users.', dueDate: new Date(2024, 7, 10), priority: 'Medium', status: 'Done', createdAt: new Date(2024, 6, 3), updatedAt: new Date(2024, 7, 9) },
  { id: '4', title: 'Write API Documentation', description: 'Document all API endpoints using Swagger/OpenAPI.', dueDate: null, priority: 'Low', status: 'To Do', createdAt: new Date(2024, 6, 4), updatedAt: new Date(2024, 6, 4) },
  { id: '5', title: 'Test CRUD Operations', description: 'Ensure Create, Read, Update, Delete work for tasks.', dueDate: new Date(2024, 7, 25), priority: 'Medium', status: 'To Do', createdAt: new Date(2024, 6, 5), updatedAt: new Date(2024, 6, 5) },
  { id: '6', title: 'Deploy Staging Environment', description: 'Set up a staging server for testing.', dueDate: new Date(2024, 7, 5), priority: 'Low', status: 'Done', createdAt: new Date(2024, 6, 6), updatedAt: new Date(2024, 7, 4) }, // Example overdue but done
  { id: '7', title: 'Implement Task Filtering', description: 'Add filtering options to the tasks page.', dueDate: new Date(2024, 7, 1), priority: 'Medium', status: 'To Do', createdAt: new Date(2024, 6, 7), updatedAt: new Date(2024, 6, 7) }, // Example overdue and not done
];

// Simulate API delay
const simulateDelay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const getTasks = async (): Promise<Task[]> => {
  await simulateDelay(500);
  // Return a copy to prevent direct modification of the in-memory store
  return [...tasks].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()); // Sort by newest first
};

export const getTaskById = async (taskId: string): Promise<Task | null> => {
  await simulateDelay(300);
  const task = tasks.find(t => t.id === taskId);
  return task ? { ...task } : null; // Return a copy
};

// Define the input type for creating a task (excluding id, createdAt, updatedAt)
export type CreateTaskInput = Omit<Task, 'id' | 'createdAt' | 'updatedAt'>;

export const createTask = async (taskData: CreateTaskInput): Promise<Task> => {
  await simulateDelay(700);
  const newTask: Task = {
    ...taskData,
    id: String(Date.now() + Math.random()), // Simple unique ID generation for demo
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  tasks.push(newTask);
  console.log("Task created:", newTask);
  console.log("Current tasks:", tasks);
  return { ...newTask }; // Return a copy
};

// Define the input type for updating a task (all fields optional except id)
export type UpdateTaskInput = Partial<Omit<Task, 'id' | 'createdAt' | 'updatedAt'>>;

export const updateTask = async (taskId: string, updates: UpdateTaskInput): Promise<Task | null> => {
  await simulateDelay(600);
  const taskIndex = tasks.findIndex(t => t.id === taskId);
  if (taskIndex === -1) {
    return null;
  }
  const updatedTask = {
    ...tasks[taskIndex],
    ...updates,
    // Ensure dueDate is handled correctly (can be null)
    dueDate: updates.dueDate !== undefined ? updates.dueDate : tasks[taskIndex].dueDate,
    updatedAt: new Date(),
  };
  tasks[taskIndex] = updatedTask;
   console.log("Task updated:", updatedTask);
   console.log("Current tasks:", tasks);
  return { ...updatedTask }; // Return a copy
};

export const deleteTask = async (taskId: string): Promise<boolean> => {
  await simulateDelay(400);
  const initialLength = tasks.length;
  tasks = tasks.filter(t => t.id !== taskId);
   console.log("Task deleted:", taskId);
   console.log("Current tasks:", tasks);
  return tasks.length < initialLength;
};
