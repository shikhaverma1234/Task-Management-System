import Link from 'next/link';
import { Package2 } from 'lucide-react'; // Using Package2 as a placeholder logo icon
import { Button } from '@/components/ui/button';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex items-center">
          <Link href="/dashboard" className="mr-6 flex items-center space-x-2">
            <Package2 className="h-6 w-6 text-primary" />
            <span className="font-bold">Task Management</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link
              href="/dashboard"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Dashboard
            </Link>
            <Link
              href="/tasks"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Tasks
            </Link>
            {/* Add Profile link later when authentication is implemented */}
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          {/* Add Login/Register/Logout buttons later */}
          {/* <Button variant="outline" size="sm">Login</Button>
          <Button size="sm">Register</Button> */}
        </div>
      </div>
    </header>
  );
}
