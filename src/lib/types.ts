// Defines the structure for a Task object

export type TaskPriority = 'Low' | 'Medium' | 'High';
export type TaskStatus = 'To Do' | 'In Progress' | 'Done';

export interface Task {
  id: string; // Unique identifier (e.g., from MongoDB ObjectId)
  title: string;
  description?: string; // Optional description
  dueDate?: Date | null; // Optional due date
  priority: TaskPriority;
  status: TaskStatus;
  createdAt: Date; // Timestamp for creation
  updatedAt: Date; // Timestamp for last update
  // Add userId or assignedToId later for ownership/assignment
  // createdById: string;
  // assignedToId?: string | null;
}
