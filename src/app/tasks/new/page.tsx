"use client"; // Needs client-side interactivity for form

import { TaskForm } from "@/components/tasks/TaskForm";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation"; // Use next/navigation for App Router

export default function NewTaskPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);

   // Placeholder function - replace with actual API call
  const handleCreateTask = async (data: any) => {
     console.log("Creating task:", data);
     setIsLoading(true);
     // Simulate API call
     await new Promise(resolve => setTimeout(resolve, 1000));
     setIsLoading(false);

     // Replace with actual API call to create task
     // try {
     //   await createTaskApi(data); // Your API function
       toast({
         title: "Task Created",
         description: "The new task has been successfully created.",
         // variant: "success", // You might need to add a success variant to toast
       });
       router.push("/tasks"); // Redirect to tasks list after creation
     // } catch (error) {
     //   console.error("Failed to create task:", error);
     //   setIsLoading(false);
     //   toast({
     //     title: "Error",
     //     description: "Failed to create the task. Please try again.",
     //     variant: "destructive",
     //   });
     // }
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
      />
    </div>
  );
}

import * as React from "react"; // Import React
