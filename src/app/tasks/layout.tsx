import * as React from 'react';

export default function TasksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      {/* You could add task-specific layout elements here if needed, like a sub-navigation */}
      {children}
    </div>
  );
}
