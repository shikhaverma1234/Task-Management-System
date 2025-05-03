"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { TaskForm } from "@/components/tasks/TaskForm";
import { useToast } from "@/hooks/use-toast";
import { createTask, CreateTaskInput } from "@/services/taskService"; // Import service function and type

export default function NewTaskPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);

  const handleCreateTask = async (data: CreateTaskInput) => {
     console.log("Attempting to create task:", data);
     setIsLoading(true);

     try {
       // Ensure dueDate is either a Date object or null before sending
       const taskDataToSend = {
            ...data,
            dueDate: data.dueDate instanceof Date ? data.dueDate : null,
        };

       const newTask = await createTask(taskDataToSend); // Use the service function
       toast({
         title: "Task Created",
         description: `Task "${newTask.title}" has been successfully created.`,
       });
       router.push("/tasks"); // Redirect to tasks list after creation
     } catch (error) {
       console.error("Failed to create task:", error);
       setIsLoading(false);
       toast({
         title: "Error",
         description: "Failed to create the task. Please try again.",
         variant: "destructive",
       });
     }
     // No finally block needed to set isLoading to false here,
     // as it's handled in the catch or after successful navigation.
   };

  const handleCancel = () => {
    router.back(); // Go back to the previous page
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-semibold">Create New Task</h1>
      <TaskForm
        onSubmit={handleCreateTask}
        onCancel={handleCancel}
        isLoading={isLoading}
        // No initialData needed for create form
      />
    </div>
  );
}
