import React from 'react';

interface TaskColumnHeaderProps {
  title: string;
  taskCount: number;
}

export function TaskColumnHeader({ title, taskCount }: TaskColumnHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-semibold">{title}</h3>
      <span className="text-sm px-2 py-0.5 bg-gray-700/50 rounded-full">
        {taskCount}
      </span>
    </div>
  );
}