"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { format } from "date-fns";
import { CalendarIcon, Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import { Task, TaskPriority, TaskStatus } from "@/lib/types"; // Import Task types

// Define Zod schema for form validation
const taskFormSchema = z.object({
  title: z.string().min(3, {
    message: "Title must be at least 3 characters.",
  }),
  description: z.string().optional(),
  dueDate: z.date().optional().nullable(),
  priority: z.enum(["Low", "Medium", "High"]),
  status: z.enum(["To Do", "In Progress", "Done"]),
});

type TaskFormValues = z.infer<typeof taskFormSchema>;

interface TaskFormProps {
  initialData?: Task | null; // Task data for editing, null for creating
  onSubmit: (data: TaskFormValues) => void; // Callback on successful submit
  onCancel?: () => void; // Optional callback for cancellation
  isLoading?: boolean; // Optional loading state for submit button
}

const priorities: { value: TaskPriority; label: string }[] = [
  { value: "Low", label: "Low" },
  { value: "Medium", label: "Medium" },
  { value: "High", label: "High" },
];

const statuses: { value: TaskStatus; label: string }[] = [
  { value: "To Do", label: "To Do" },
  { value: "In Progress", label: "In Progress" },
  { value: "Done", label: "Done" },
];

export function TaskForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
}: TaskFormProps) {

  // Process initialData to ensure dueDate is a Date object or null
  const processedInitialData = initialData ? {
    ...initialData,
    dueDate: initialData.dueDate ? new Date(initialData.dueDate) : null
  } : null;


  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      title: processedInitialData?.title || "",
      description: processedInitialData?.description || "",
      dueDate: processedInitialData?.dueDate || null,
      priority: processedInitialData?.priority || "Medium",
      status: processedInitialData?.status || "To Do",
    },
  });

  const handleSubmit = (data: TaskFormValues) => {
    onSubmit(data);
    // Optionally reset form after submission if needed (e.g., for create form)
    // if (!initialData) {
    //   form.reset();
    // }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Title Field */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title *</FormLabel>
              <FormControl>
                <Input placeholder="Enter task title" {...field} disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Description Field */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Add a description for the task (optional)"
                  className="resize-none"
                  {...field}
                  value={field.value ?? ""} // Ensure value is never null/undefined for textarea
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Due Date Field */}
          <FormField
            control={form.control}
            name="dueDate"
            render={({ field }) => (
              <FormItem className="flex flex-col pt-2">
                <FormLabel>Due Date</FormLabel>
                 <Popover>
                   <PopoverTrigger asChild>
                     <FormControl>
                       <Button
                         variant={"outline"}
                         className={cn(
                           "w-full pl-3 text-left font-normal",
                           !field.value && "text-muted-foreground"
                         )}
                         disabled={isLoading}
                       >
                         {field.value ? (
                           format(field.value, "PPP")
                         ) : (
                           <span>Pick a date</span>
                         )}
                         <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                       </Button>
                     </FormControl>
                   </PopoverTrigger>
                   <PopoverContent className="w-auto p-0" align="start">
                     <Calendar
                       mode="single"
                       selected={field.value ?? undefined} // Handle null case for Calendar
                       onSelect={field.onChange}
                       disabled={(date) =>
                         date < new Date(new Date().setHours(0, 0, 0, 0)) || // Disable past dates
                         isLoading
                       }
                       initialFocus
                     />
                   </PopoverContent>
                 </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Priority Field */}
          <FormField
            control={form.control}
            name="priority"
            render={({ field }) => (
                <FormItem className="flex flex-col pt-2">
                    <FormLabel>Priority</FormLabel>
                    <Popover>
                    <PopoverTrigger asChild>
                        <FormControl>
                        <Button
                            variant="outline"
                            role="combobox"
                            className={cn(
                            "w-full justify-between",
                            !field.value && "text-muted-foreground"
                            )}
                             disabled={isLoading}
                        >
                            {field.value
                            ? priorities.find(
                                (priority) => priority.value === field.value
                                )?.label
                            : "Select priority"}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                        </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                        <Command>
                         <CommandList>
                             <CommandEmpty>No priority found.</CommandEmpty>
                            <CommandGroup>
                                {priorities.map((priority) => (
                                <CommandItem
                                    value={priority.value}
                                    key={priority.value}
                                    onSelect={() => {
                                        form.setValue("priority", priority.value)
                                    }}
                                >
                                    <Check
                                    className={cn(
                                        "mr-2 h-4 w-4",
                                        priority.value === field.value
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                    />
                                    {priority.label}
                                </CommandItem>
                                ))}
                            </CommandGroup>
                           </CommandList>
                        </Command>
                    </PopoverContent>
                    </Popover>
                    <FormMessage />
                </FormItem>
            )}
           />


          {/* Status Field */}
            <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                    <FormItem className="flex flex-col pt-2">
                    <FormLabel>Status</FormLabel>
                     <Popover>
                        <PopoverTrigger asChild>
                            <FormControl>
                            <Button
                                variant="outline"
                                role="combobox"
                                className={cn(
                                "w-full justify-between",
                                !field.value && "text-muted-foreground"
                                )}
                                disabled={isLoading}
                            >
                                {field.value
                                ? statuses.find(
                                    (status) => status.value === field.value
                                    )?.label
                                : "Select status"}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                            </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                             <Command>
                                <CommandList>
                                    <CommandEmpty>No status found.</CommandEmpty>
                                    <CommandGroup>
                                        {statuses.map((status) => (
                                        <CommandItem
                                            value={status.value}
                                            key={status.value}
                                            onSelect={() => {
                                            form.setValue("status", status.value)
                                            }}
                                        >
                                            <Check
                                            className={cn(
                                                "mr-2 h-4 w-4",
                                                status.value === field.value
                                                ? "opacity-100"
                                                : "opacity-0"
                                            )}
                                            />
                                            {status.label}
                                        </CommandItem>
                                        ))}
                                    </CommandGroup>
                                </CommandList>
                            </Command>
                        </PopoverContent>
                        </Popover>
                    <FormMessage />
                    </FormItem>
                )}
             />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-2 pt-4">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : processedInitialData ? "Save Changes" : "Create Task"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
