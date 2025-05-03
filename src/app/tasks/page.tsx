"use client";

import * as React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link'; // Import Link
import { format } from 'date-fns';
import { PlusCircle, Filter, Search, Edit, Trash2, AlertTriangle, ArrowUp, ArrowDown, Circle, Clock, CheckCircle, Calendar as CalendarIcon, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import type { Task, TaskPriority, TaskStatus } from '@/lib/types';
import { getTasks, deleteTask } from '@/services/taskService'; // Import service functions
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"
import { buttonVariants } from '@/components/ui/button'; // Import buttonVariants for AlertDialog styling


// Helper Functions
function getPriorityBadgeVariant(priority: TaskPriority): 'default' | 'secondary' | 'destructive' {
  switch (priority) {
    case 'High': return 'destructive';
    case 'Medium': return 'secondary';
    case 'Low': return 'default'; // Use primary color theme
    default: return 'outline';
  }
}

function getStatusBadgeVariant(status: TaskStatus): 'default' | 'secondary' | 'outline' {
   switch (status) {
    case 'Done': return 'default'; // Using default which is themed green via globals.css chart-2
    case 'In Progress': return 'secondary'; // Themed yellow/orange via globals.css chart-3?
    case 'To Do': return 'outline';
    default: return 'outline';
  }
}

function getStatusIcon(status: TaskStatus) {
    switch (status) {
        case 'Done': return <CheckCircle className="h-4 w-4 text-[hsl(var(--chart-2))]" />; // Use chart-2 green
        case 'In Progress': return <Clock className="h-4 w-4 text-[hsl(var(--chart-3))]" />; // Use chart-3 yellow/orange
        case 'To Do': return <Circle className="h-4 w-4 text-muted-foreground" />;
        default: return null;
    }
}

function getPriorityIcon(priority: TaskPriority) {
    switch (priority) {
        case 'High': return <AlertTriangle className="h-4 w-4 text-destructive" />; // Use destructive red
        case 'Medium': return <ArrowUp className="h-4 w-4 text-[hsl(var(--chart-3))]" />; // Use chart-3 yellow/orange
        case 'Low': return <ArrowDown className="h-4 w-4 text-primary" />; // Use primary blue
        default: return null;
    }
}


export default function TasksPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [tasks, setTasks] = React.useState<Task[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isDeleting, setIsDeleting] = React.useState<string | null>(null); // Store ID of task being deleted

  // State for filters
  const [searchTerm, setSearchTerm] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<TaskStatus | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = React.useState<TaskPriority | 'all'>('all');
  const [dueDateFilter, setDueDateFilter] = React.useState<Date | null>(null);
  const [selectedTasks, setSelectedTasks] = React.useState<Set<string>>(new Set());

  // Fetch tasks on component mount
  React.useEffect(() => {
    const fetchAndSetTasks = async () => {
      setIsLoading(true);
      try {
        const fetchedTasks = await getTasks();
        setTasks(fetchedTasks);
      } catch (error) {
        console.error("Failed to fetch tasks:", error);
        toast({
          title: "Error",
          description: "Could not fetch tasks. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchAndSetTasks();
  }, [toast]);

  // Filter tasks based on state
  const filteredTasks = React.useMemo(() => {
    return tasks.filter(task => {
      const lowerSearchTerm = searchTerm.toLowerCase();
      const matchesSearch = !searchTerm ||
                            task.title.toLowerCase().includes(lowerSearchTerm) ||
                            task.description?.toLowerCase().includes(lowerSearchTerm);
      const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
      const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
      // Ensure dueDate is handled correctly - convert to Date object if it's not already
      const taskDueDate = task.dueDate ? new Date(task.dueDate) : null;
      const matchesDueDate = !dueDateFilter || (taskDueDate && format(taskDueDate, 'yyyy-MM-dd') === format(dueDateFilter, 'yyyy-MM-dd'));

      return matchesSearch && matchesStatus && matchesPriority && matchesDueDate;
    });
  }, [tasks, searchTerm, statusFilter, priorityFilter, dueDateFilter]);


  // Handle Delete
  const handleDeleteTask = async (taskId: string) => {
    setIsDeleting(taskId);
    try {
      const success = await deleteTask(taskId);
      if (success) {
        setTasks(prevTasks => prevTasks.filter(t => t.id !== taskId));
        setSelectedTasks(prevSelected => {
            const newSelected = new Set(prevSelected);
            newSelected.delete(taskId);
            return newSelected;
        });
        toast({
          title: "Task Deleted",
          description: "The task has been successfully deleted.",
        });
      } else {
        throw new Error("Deletion failed server-side"); // Or handle specific API error
      }
    } catch (error) {
      console.error("Failed to delete task:", error);
      toast({
        title: "Error",
        description: "Failed to delete the task. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(null); // Reset deleting state regardless of outcome
    }
  };

    // Handle selecting single task
    const handleSelectTask = (taskId: string, checked: boolean | 'indeterminate') => {
        setSelectedTasks(prevSelected => {
            const newSelected = new Set(prevSelected);
            if (checked === true) {
                newSelected.add(taskId);
            } else {
                newSelected.delete(taskId);
            }
            return newSelected;
        });
    };

    // Handle selecting all tasks
    const handleSelectAllTasks = (checked: boolean | 'indeterminate') => {
        if (checked === true) {
            const allTaskIds = new Set(filteredTasks.map(task => task.id));
            setSelectedTasks(allTaskIds);
        } else {
            setSelectedTasks(new Set());
        }
    };

    const isAllSelected = filteredTasks.length > 0 && selectedTasks.size === filteredTasks.length;
    const isIndeterminate = selectedTasks.size > 0 && selectedTasks.size < filteredTasks.length;


  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-primary">Tasks</h1>
         <Link href="/tasks/new" passHref>
           <Button>
              <PlusCircle className="mr-2 h-4 w-4" /> Create New Task
           </Button>
         </Link>
      </div>

      {/* Search and Filter Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg"> {/* Slightly smaller title */}
            <Filter className="h-5 w-5" />
            Filter & Search Tasks
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col md:flex-row gap-4 items-center">
          <Input
            placeholder="Search by title or description..."
            className="flex-grow"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Select onValueChange={(value) => setStatusFilter(value as TaskStatus | 'all')} value={statusFilter}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Filter by Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="To Do">To Do</SelectItem>
              <SelectItem value="In Progress">In Progress</SelectItem>
              <SelectItem value="Done">Done</SelectItem>
            </SelectContent>
          </Select>
          <Select onValueChange={(value) => setPriorityFilter(value as TaskPriority | 'all')} value={priorityFilter}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Filter by Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priorities</SelectItem>
              <SelectItem value="Low">Low</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="High">High</SelectItem>
            </SelectContent>
          </Select>
          <Popover>
              <PopoverTrigger asChild>
                  <Button
                      variant={"outline"}
                      className={cn(
                          "w-full md:w-[240px] justify-start text-left font-normal",
                          !dueDateFilter && "text-muted-foreground"
                      )}
                  >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dueDateFilter ? format(dueDateFilter, "PPP") : <span>Filter by Due Date</span>}
                  </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                      mode="single"
                      selected={dueDateFilter ?? undefined} // Handle null case
                      onSelect={setDueDateFilter} // Allow selecting a date
                      initialFocus
                  />
                  {/* Optional: Button to clear the date filter */}
                  {dueDateFilter && (
                    <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start mt-1"
                        onClick={() => setDueDateFilter(null)}
                    >
                        Clear Date Filter
                    </Button>
                    )}
              </PopoverContent>
          </Popover>
        </CardContent>
      </Card>

      {/* Task List Table */}
      <Card>
        <CardHeader>
           <CardTitle>Task List ({filteredTasks.length})</CardTitle>
            {/* Optional: Add bulk actions based on selectedTasks */}
            {selectedTasks.size > 0 && (
                <div className="text-sm text-muted-foreground mt-2">
                    {selectedTasks.size} task(s) selected. {/* Add bulk action buttons here */}
                </div>
            )}
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">
                      <Checkbox
                         aria-label="Select all tasks"
                         checked={isAllSelected || (isIndeterminate ? 'indeterminate' : false)}
                         onCheckedChange={handleSelectAllTasks}
                       />
                    </TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead className="hidden lg:table-cell">Description</TableHead> {/* Hide on smaller screens */}
                    <TableHead>Status</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center">
                        <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
                        <p className="mt-2 text-muted-foreground">Loading tasks...</p>
                      </TableCell>
                    </TableRow>
                  ) : filteredTasks.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                        No tasks found matching your criteria.
                        {tasks.length > 0 && ( // Only show if there ARE tasks, but none match filters
                            <Button variant="link" onClick={() => {
                                setSearchTerm('');
                                setStatusFilter('all');
                                setPriorityFilter('all');
                                setDueDateFilter(null);
                            }}>
                                Clear Filters
                            </Button>
                        )}
                          {tasks.length === 0 && ( // Show if there are absolutely no tasks
                               <Link href="/tasks/new" className="ml-2 text-primary hover:underline">
                                    Create one!
                                </Link>
                            )}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredTasks.map((task) => {
                      // Ensure dueDate is a Date object for comparison and formatting
                      const taskDueDate = task.dueDate ? new Date(task.dueDate) : null;

                      return (
                      <TableRow key={task.id} data-state={selectedTasks.has(task.id) ? "selected" : undefined}>
                        <TableCell>
                          <Checkbox
                            aria-label={`Select task ${task.title}`}
                            checked={selectedTasks.has(task.id)}
                            onCheckedChange={(checked) => handleSelectTask(task.id, checked)}
                          />
                        </TableCell>
                        <TableCell className="font-medium">{task.title}</TableCell>
                        <TableCell className="hidden lg:table-cell text-sm text-muted-foreground max-w-xs">
                           <p className="truncate">{task.description || <span className="italic text-muted-foreground/70">No description</span>}</p>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusBadgeVariant(task.status)} className="flex items-center gap-1 w-fit capitalize"> {/* Use capitalize */}
                            {getStatusIcon(task.status)}
                            {task.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getPriorityBadgeVariant(task.priority)} className="flex items-center gap-1 w-fit capitalize"> {/* Use capitalize */}
                            {getPriorityIcon(task.priority)}
                            {task.priority}
                          </Badge>
                        </TableCell>
                        <TableCell className="whitespace-nowrap"> {/* Prevent wrapping */}
                          {taskDueDate ? format(taskDueDate, 'PP') : <span className="text-muted-foreground">N/A</span>}
                          {/* Add overdue indicator */}
                          {taskDueDate && taskDueDate < new Date() && task.status !== 'Done' && (
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <AlertTriangle className="inline-block ml-1 h-4 w-4 text-destructive" />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Task is overdue!</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                          )}
                        </TableCell>
                        <TableCell className="text-right whitespace-nowrap"> {/* Prevent wrapping */}
                          <Link href={`/tasks/${task.id}/edit`} passHref>
                            <Button variant="ghost" size="icon" className="h-8 w-8" aria-label={`Edit task ${task.title}`}>
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Link>

                           <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                                        aria-label={`Delete task ${task.title}`}
                                        disabled={isDeleting === task.id} // Disable while this specific task is being deleted
                                    >
                                        {isDeleting === task.id ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : (
                                            <Trash2 className="h-4 w-4" />
                                        )}
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action cannot be undone. This will permanently delete the task
                                        <span className="font-medium"> "{task.title}"</span>.
                                    </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                    <AlertDialogCancel disabled={isDeleting === task.id}>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={() => handleDeleteTask(task.id)}
                                        disabled={isDeleting === task.id}
                                        className={buttonVariants({ variant: "destructive" })}
                                    >
                                        {isDeleting === task.id ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                        Delete Task
                                    </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
