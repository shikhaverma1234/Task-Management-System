import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { AlertCircle, CheckCircle, Clock } from 'lucide-react'; // Icons for task status/categories

export default function DashboardPage() {
  // Placeholder data - replace with actual data fetching later
  const assignedTasksCount = 5;
  const createdTasksCount = 10;
  const overdueTasksCount = 2;

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold tracking-tight text-primary">Dashboard</h1>
      <p className="text-muted-foreground">Overview of your tasks.</p>

      <Separator />

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tasks Assigned to Me</CardTitle>
            <CheckCircle className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{assignedTasksCount}</div>
            <p className="text-xs text-muted-foreground">Currently assigned tasks</p>
            {/* Placeholder for task list */}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tasks I Created</CardTitle>
             <Clock className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{createdTasksCount}</div>
             <p className="text-xs text-muted-foreground">Total tasks created by you</p>
             {/* Placeholder for task list */}
          </CardContent>
        </Card>
        <Card className="border-destructive/50 dark:border-destructive">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-destructive">Overdue Tasks</CardTitle>
            <AlertCircle className="h-5 w-5 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{overdueTasksCount}</div>
             <p className="text-xs text-destructive">Tasks past their due date</p>
            {/* Placeholder for task list */}
          </CardContent>
        </Card>
      </div>

      {/* Placeholder sections for task lists */}
      {/* <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Assigned Tasks</h2>
        {/* Task List Component */}
      {/* </div>
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Created Tasks</h2>
        {/* Task List Component */}
      {/* </div>
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4 text-destructive">Overdue Tasks</h2>
        {/* Task List Component */}
      {/* </div> */}
    </div>
  );
}
