"use client"; // Needs client-side interactivity for form and data fetching

import * as React from "react";
import { useParams, useRouter } from "next/navigation"; // Use next/navigation for App Router
import { TaskForm } from "@/components/tasks/TaskForm";
import { useToast } from "@/hooks/use-toast";
import { Task } from "@/lib/types"; // Import Task type
import { Skeleton } from "@/components/ui/skeleton";

// Placeholder fetch function - replace with actual API call
async function fetchTask(taskId: string): Promise<Task | null> {
  console.log("Fetching task:", taskId);
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 500));
  // Find task in placeholder data (replace with actual fetch)
   const tasks: Task[] = [
     { id: '1', title: 'Design Homepage Mockup', description: 'Create wireframes and final design for the homepage.', dueDate: new Date(2024, 7, 15), priority: 'High', status: 'In Progress', createdAt: new Date(), updatedAt: new Date() },
     { id: '2', title: 'Develop Authentication Flow', description: 'Implement user login and registration backend.', dueDate: new Date(2024, 7, 20), priority: 'High', status: 'To Do', createdAt: new Date(), updatedAt: new Date() },
     { id: '3', title: 'Setup Database Schema', description: 'Define MongoDB schema for tasks and users.', dueDate: new Date(2024, 7, 10), priority: 'Medium', status: 'Done', createdAt: new Date(), updatedAt: new Date() },
   ];
  const task = tasks.find(t => t.id === taskId);
  return task || null;
}

// Placeholder update function - replace with actual API call
async function updateTask(taskId: string, data: any): Promise<void> {
   console.log("Updating task:", taskId, data);
   // Simulate API call
   await new Promise(resolve => setTimeout(resolve, 1000));
   // In a real app, this would make a PUT/PATCH request
}


export default function EditTaskPage() {
  const router = useRouter();
  const params = useParams();
  const taskId = params.taskId as string; // Get task ID from route params
  const { toast } = useToast();

  const [taskData, setTaskData] = React.useState<Task | null>(null);
  const [isLoading, setIsLoading] = React.useState(true); // Loading state for fetching
  const [isSubmitting, setIsSubmitting] = React.useState(false); // Loading state for submitting

  React.useEffect(() => {
    if (taskId) {
      const loadTask = async () => {
        setIsLoading(true);
        try {
          const data = await fetchTask(taskId);
          if (!data) {
            toast({
              title: "Error",
              description: "Task not found.",
              variant: "destructive",
            });
            router.push("/tasks"); // Redirect if task not found
          } else {
            setTaskData(data);
          }
        } catch (error) {
           console.error("Failed to fetch task:", error);
           toast({
            title: "Error",
            description: "Failed to load task data.",
            variant: "destructive",
           });
        } finally {
           setIsLoading(false);
        }
      };
      loadTask();
    }
  }, [taskId, router, toast]);

  const handleUpdateTask = async (data: any) => {
     console.log("Updating task:", data);
     setIsSubmitting(true);
     try {
       await updateTask(taskId, data); // Your API function
       toast({
         title: "Task Updated",
         description: "The task has been successfully updated.",
         // variant: "success",
       });
       router.push("/tasks"); // Redirect after update
     } catch (error) {
       console.error("Failed to update task:", error);
       toast({
         title: "Error",
         description: "Failed to update the task. Please try again.",
         variant: "destructive",
       });
     } finally {
       setIsSubmitting(false);
     }
   };

  const handleCancel = () => {
    router.back(); // Go back
  };

  if (isLoading) {
    return <EditTaskSkeleton />; // Show skeleton loader while fetching
  }

  if (!taskData) {
     // This case should ideally be handled by the redirect in useEffect,
     // but adding a fallback message.
     return <div className="text-center p-8 text-destructive">Task not found or failed to load.</div>;
  }


  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-semibold">Edit Task</h1>
      <TaskForm
        initialData={taskData}
        onSubmit={handleUpdateTask}
        onCancel={handleCancel}
        isLoading={isSubmitting}
      />
    </div>
  );
}


// Skeleton loader component for the edit page
function EditTaskSkeleton() {
    return (
        <div className="space-y-6 max-w-2xl mx-auto">
            <Skeleton className="h-8 w-1/3" /> {/* Title heading skeleton */}
            <div className="space-y-6">
                <div className="space-y-2">
                    <Skeleton className="h-4 w-1/6" /> {/* Label skeleton */}
                    <Skeleton className="h-10 w-full" /> {/* Input skeleton */}
                </div>
                <div className="space-y-2">
                    <Skeleton className="h-4 w-1/6" /> {/* Label skeleton */}
                    <Skeleton className="h-20 w-full" /> {/* Textarea skeleton */}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                     <div className="space-y-2">
                        <Skeleton className="h-4 w-1/3" /> {/* Label skeleton */}
                        <Skeleton className="h-10 w-full" /> {/* Date picker skeleton */}
                     </div>
                     <div className="space-y-2">
                         <Skeleton className="h-4 w-1/3" /> {/* Label skeleton */}
                        <Skeleton className="h-10 w-full" /> {/* Select skeleton */}
                    </div>
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-1/3" /> {/* Label skeleton */}
                        <Skeleton className="h-10 w-full" /> {/* Select skeleton */}
                    </div>
                </div>
                <div className="flex justify-end space-x-2 pt-4">
                    <Skeleton className="h-10 w-20" /> {/* Cancel button skeleton */}
                    <Skeleton className="h-10 w-24" /> {/* Submit button skeleton */}
                </div>
            </div>
        </div>
    )
}
