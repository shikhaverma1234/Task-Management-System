import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, Filter, Search, Edit, Trash2, AlertTriangle, ArrowUp, ArrowDown } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

// Placeholder Task Type
type Task = {
  id: string;
  title: string;
  description: string;
  dueDate: Date | null;
  priority: 'Low' | 'Medium' | 'High';
  status: 'To Do' | 'In Progress' | 'Done';
};

// Placeholder Data
const tasks: Task[] = [
  { id: '1', title: 'Design Homepage Mockup', description: 'Create wireframes and final design for the homepage.', dueDate: new Date(2024, 7, 15), priority: 'High', status: 'In Progress' },
  { id: '2', title: 'Develop Authentication Flow', description: 'Implement user login and registration backend.', dueDate: new Date(2024, 7, 20), priority: 'High', status: 'To Do' },
  { id: '3', title: 'Setup Database Schema', description: 'Define MongoDB schema for tasks and users.', dueDate: new Date(2024, 7, 10), priority: 'Medium', status: 'Done' },
  { id: '4', title: 'Write API Documentation', description: 'Document all API endpoints using Swagger/OpenAPI.', dueDate: null, priority: 'Low', status: 'To Do' },
  { id: '5', title: 'Test CRUD Operations', description: 'Ensure Create, Read, Update, Delete work for tasks.', dueDate: new Date(2024, 7, 25), priority: 'Medium', status: 'To Do' },
  { id: '6', title: 'Deploy Staging Environment', description: 'Set up a staging server for testing.', dueDate: new Date(2024, 7, 5), priority: 'Low', status: 'Done' }, // Example overdue
];

function getPriorityBadgeVariant(priority: Task['priority']): 'default' | 'secondary' | 'destructive' {
  switch (priority) {
    case 'High': return 'destructive';
    case 'Medium': return 'secondary'; // Using secondary for medium (often yellow/orange theme)
    case 'Low': return 'default'; // Using default (often blue/primary theme)
    default: return 'outline';
  }
}

function getStatusBadgeVariant(status: Task['status']): 'default' | 'secondary' | 'outline' {
   switch (status) {
    case 'Done': return 'default'; // Default (blue) might not fit green accent. Consider custom class later.
    case 'In Progress': return 'secondary';
    case 'To Do': return 'outline';
    default: return 'outline';
  }
}

function getStatusIcon(status: Task['status']) {
    // Placeholder icons - replace with actual icons later if needed
    switch (status) {
        case 'Done': return <CheckCircle className="h-4 w-4 text-green-500" />; // Direct green color for accent
        case 'In Progress': return <Clock className="h-4 w-4 text-yellow-500" />;
        case 'To Do': return <Circle className="h-4 w-4 text-muted-foreground" />;
        default: return null;
    }
}

function getPriorityIcon(priority: Task['priority']) {
    switch (priority) {
        case 'High': return <AlertTriangle className="h-4 w-4 text-destructive" />;
        case 'Medium': return <ArrowUp className="h-4 w-4 text-orange-500" />; // Example orange
        case 'Low': return <ArrowDown className="h-4 w-4 text-green-500" />; // Example green
        default: return null;
    }
}


// Icons mapping
import { Circle, Clock, CheckCircle } from 'lucide-react';


export default function TasksPage() {
  // State for filters - to be implemented
  // const [searchTerm, setSearchTerm] = React.useState('');
  // const [statusFilter, setStatusFilter] = React.useState('all');
  // const [priorityFilter, setPriorityFilter] = React.useState('all');
  // const [dueDateFilter, setDueDateFilter] = React.useState<Date | null>(null);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-primary">Tasks</h1>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" /> Create New Task
        </Button>
      </div>

      {/* Search and Filter Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filter & Search Tasks
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col md:flex-row gap-4">
          <Input
            placeholder="Search by title or description..."
            className="flex-grow"
            // value={searchTerm}
            // onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Select /* onValueChange={setStatusFilter} defaultValue="all" */ >
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
          <Select /* onValueChange={setPriorityFilter} defaultValue="all" */ >
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
                  // !dueDateFilter && "text-muted-foreground"
                  "text-muted-foreground" // Force muted foreground if no date selected yet
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {/* {dueDateFilter ? format(dueDateFilter, "PPP") : <span>Filter by Due Date</span>} */}
                 <span>Filter by Due Date</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                // selected={dueDateFilter}
                // onSelect={setDueDateFilter}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </CardContent>
      </Card>

      {/* Task List Table */}
      <Card>
        <CardHeader>
           <CardTitle>Task List</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">
                  <Checkbox aria-label="Select all tasks" />
                </TableHead>
                <TableHead>Title</TableHead>
                <TableHead className="hidden md:table-cell">Description</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tasks.map((task) => (
                <TableRow key={task.id}>
                  <TableCell>
                    <Checkbox aria-label={`Select task ${task.title}`} />
                  </TableCell>
                  <TableCell className="font-medium">{task.title}</TableCell>
                  <TableCell className="hidden md:table-cell text-sm text-muted-foreground truncate max-w-xs">{task.description}</TableCell>
                  <TableCell>
                     <Badge variant={getStatusBadgeVariant(task.status)} className="flex items-center gap-1 w-fit">
                       {getStatusIcon(task.status)}
                       {task.status}
                     </Badge>
                  </TableCell>
                   <TableCell>
                    <Badge variant={getPriorityBadgeVariant(task.priority)} className="flex items-center gap-1 w-fit">
                      {getPriorityIcon(task.priority)}
                      {task.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {task.dueDate ? format(task.dueDate, 'PP') : <span className="text-muted-foreground">N/A</span>}
                    {/* Add overdue indicator */}
                    {task.dueDate && task.dueDate < new Date() && task.status !== 'Done' && (
                       <AlertTriangle className="inline-block ml-1 h-4 w-4 text-destructive" />
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Edit Task</span>
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete Task</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
           {tasks.length === 0 && (
             <div className="text-center p-8 text-muted-foreground">
               No tasks found. Create one!
             </div>
           )}
        </CardContent>
      </Card>
    </div>
  );
}
