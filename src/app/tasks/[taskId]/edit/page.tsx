"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { TaskForm } from "@/components/tasks/TaskForm";
import { useToast } from "@/hooks/use-toast";
import { Task } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button"; // Import Button
import { getTaskById, updateTask, UpdateTaskInput } from "@/services/taskService"; // Import service functions
import { Loader2 } from "lucide-react"; // Import Loader icon

export default function EditTaskPage() {
  const router = useRouter();
  const params = useParams();
  const taskId = params.taskId as string;
  const { toast } = useToast();

  const [taskData, setTaskData] = React.useState<Task | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [notFound, setNotFound] = React.useState(false); // State for not found

  React.useEffect(() => {
    if (taskId) {
      const loadTask = async () => {
        setIsLoading(true);
        setNotFound(false); // Reset not found state on new load attempt
        try {
          const data = await getTaskById(taskId);
          if (!data) {
             setNotFound(true); // Set not found state
             toast({
               title: "Task Not Found",
               description: "Could not find the task you're trying to edit.",
               variant: "destructive",
             });
             // Optionally redirect immediately, or let the component render the not found message
             // router.push("/tasks");
          } else {
            // Ensure dueDate is a Date object if it exists, otherwise null
            setTaskData({
                ...data,
                dueDate: data.dueDate ? new Date(data.dueDate) : null
            });
          }
        } catch (error) {
           console.error("Failed to fetch task:", error);
           toast({
            title: "Error",
            description: "Failed to load task data. Please try again.",
            variant: "destructive",
           });
           // Consider setting notFound here too if the error indicates it
        } finally {
           setIsLoading(false);
        }
      };
      loadTask();
    } else {
        // Handle case where taskId is missing from params (shouldn't normally happen with correct routing)
        setIsLoading(false);
        setNotFound(true);
        toast({ title: "Error", description: "Task ID is missing.", variant: "destructive" });
    }
  }, [taskId, router, toast]);

  const handleUpdateTask = async (data: UpdateTaskInput) => {
     console.log("Attempting to update task:", taskId, data);
     setIsSubmitting(true);
     try {
        // Ensure dueDate is either a Date object or null before sending
        const taskDataToSend = {
            ...data,
            dueDate: data.dueDate instanceof Date ? data.dueDate : null,
        };

       const updatedTask = await updateTask(taskId, taskDataToSend); // Use the service function
       if (!updatedTask) {
          throw new Error("Update failed or task not found during update");
       }
       toast({
         title: "Task Updated",
         description: `Task "${updatedTask.title}" has been successfully updated.`,
       });
       router.push("/tasks"); // Redirect after successful update
       router.refresh(); // Optional: Force refresh of the tasks page data
     } catch (error) {
       console.error("Failed to update task:", error);
       toast({
         title: "Error",
         description: "Failed to update the task. Please try again.",
         variant: "destructive",
       });
        setIsSubmitting(false); // Ensure loading state is reset on error
     }
     // No finally block needed here, handled in catch or after success redirect
   };

  const handleCancel = () => {
    router.back(); // Go back
  };

  if (isLoading) {
    return <EditTaskSkeleton />;
  }

  if (notFound) {
     return (
        <div className="text-center p-8 space-y-4">
            <h1 className="text-2xl font-semibold text-destructive">Task Not Found</h1>
            <p className="text-muted-foreground">The task you are looking for does not exist or could not be loaded.</p>
            <Button onClick={() => router.push('/tasks')}>Go to Tasks List</Button>
        </div>
     );
  }

  // Should have taskData if not loading and not notFound
  if (!taskData) {
     // Fallback for unexpected state, although should be covered by isLoading/notFound
     return <div className="text-center p-8 text-destructive">An unexpected error occurred.</div>;
  }


  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-semibold">Edit Task: <span className="text-primary">{taskData.title}</span></h1>
      <TaskForm
        initialData={taskData}
        onSubmit={handleUpdateTask}
        onCancel={handleCancel}
        isLoading={isSubmitting} // Pass submitting state to the form
      />
    </div>
  );
}


// Skeleton loader component for the edit page
function EditTaskSkeleton() {
    return (
        <div className="space-y-6 max-w-2xl mx-auto">
            <Skeleton className="h-8 w-2/3" /> {/* Title heading skeleton */}
            <div className="space-y-6 pt-4"> {/* Add padding top */}
                <div className="space-y-2">
                    <Skeleton className="h-4 w-1/6" /> {/* Label skeleton */}
                    <Skeleton className="h-10 w-full" /> {/* Input skeleton */}
                </div>
                <div className="space-y-2">
                    <Skeleton className="h-4 w-1/6" /> {/* Label skeleton */}
                    <Skeleton className="h-20 w-full" /> {/* Textarea skeleton */}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2"> {/* Add padding top */}
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
