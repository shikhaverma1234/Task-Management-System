"use client"; // Required for useEffect and useState

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { AlertCircle, CheckCircle, Clock, ListChecks, Loader2 } from 'lucide-react'; // Import necessary icons
import { getTasks } from '@/services/taskService'; // Import task service
import { Task } from '@/lib/types'; // Import Task type
import Link from 'next/link'; // Import Link for navigation
import { Skeleton } from '@/components/ui/skeleton'; // Import Skeleton

// Placeholder: Replace with actual user ID logic when authentication is implemented
const CURRENT_USER_ID = 'user123'; // Example user ID

export default function DashboardPage() {
  const [tasks, setTasks] = React.useState<Task[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const fetchedTasks = await getTasks();
        setTasks(fetchedTasks);
      } catch (err) {
        console.error("Failed to fetch tasks for dashboard:", err);
        setError("Could not load task data. Please try again later.");
        // Optionally use toast here as well
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  // Calculate counts based on fetched tasks
  // Note: 'assignedTo' and 'createdBy' logic is placeholder until user model exists
  const assignedTasksCount = tasks.filter(task => task.status !== 'Done' /* && task.assignedToId === CURRENT_USER_ID */).length;
  const createdTasksCount = tasks.length; // Assuming all fetched tasks were created by the user for now
  const overdueTasksCount = tasks.filter(task => task.dueDate && task.dueDate < new Date() && task.status !== 'Done').length;
  const completedTasksCount = tasks.filter(task => task.status === 'Done').length; // Added completed count


  if (error) {
      return <div className="text-center text-destructive p-8">{error}</div>
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold tracking-tight text-primary">Dashboard</h1>
      <p className="text-muted-foreground">Overview of your tasks.</p>

      <Separator />

      {isLoading ? (
        <DashboardSkeleton />
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {/* Card for Assigned/Pending Tasks */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Tasks</CardTitle> {/* Renamed for clarity */}
              <ListChecks className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{assignedTasksCount}</div>
              <p className="text-xs text-muted-foreground">Tasks needing action</p> {/* Updated text */}
              <Link href="/tasks?status=To%20Do&status=In%20Progress" className="text-xs text-primary hover:underline mt-1 block">View Pending</Link>
            </CardContent>
          </Card>

           {/* Card for Completed Tasks */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completed Tasks</CardTitle>
                <CheckCircle className="h-5 w-5 text-green-500" /> {/* Use green icon */}
                </CardHeader>
                <CardContent>
                <div className="text-2xl font-bold">{completedTasksCount}</div>
                <p className="text-xs text-muted-foreground">Tasks marked as done</p>
                <Link href="/tasks?status=Done" className="text-xs text-primary hover:underline mt-1 block">View Completed</Link>
                </CardContent>
            </Card>


          {/* Card for Overdue Tasks */}
          <Card className={overdueTasksCount > 0 ? "border-destructive/50 dark:border-destructive" : ""}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className={`text-sm font-medium ${overdueTasksCount > 0 ? 'text-destructive' : ''}`}>Overdue Tasks</CardTitle>
              <AlertCircle className={`h-5 w-5 ${overdueTasksCount > 0 ? 'text-destructive' : 'text-muted-foreground'}`} />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${overdueTasksCount > 0 ? 'text-destructive' : ''}`}>{overdueTasksCount}</div>
              <p className={`text-xs ${overdueTasksCount > 0 ? 'text-destructive' : 'text-muted-foreground'}`}>Tasks past their due date</p>
              {overdueTasksCount > 0 && (
                 <Link href="/tasks?overdue=true" className="text-xs text-destructive hover:underline mt-1 block">View Overdue</Link>
               )}
            </CardContent>
          </Card>

           {/* Card for Total Tasks */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
                <Clock className="h-5 w-5 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                <div className="text-2xl font-bold">{createdTasksCount}</div>
                <p className="text-xs text-muted-foreground">All tasks created</p>
                 <Link href="/tasks" className="text-xs text-primary hover:underline mt-1 block">View All</Link>
                </CardContent>
            </Card>

        </div>
      )}

      {/* Placeholder sections for task lists can be added later if needed */}
      {/* <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        {/* Activity Feed or Task List Component */}
      {/* </div> */}
    </div>
  );
}


// Skeleton Loader for Dashboard Cards
function DashboardSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {[...Array(4)].map((_, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <Skeleton className="h-4 w-3/5" /> {/* Skeleton for Title */}
             <Skeleton className="h-5 w-5 rounded-full" /> {/* Skeleton for Icon */}
          </CardHeader>
          <CardContent>
             <Skeleton className="h-7 w-1/4 mb-2" /> {/* Skeleton for Count */}
             <Skeleton className="h-3 w-4/5" /> {/* Skeleton for Description */}
              <Skeleton className="h-3 w-1/3 mt-2" /> {/* Skeleton for Link */}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
