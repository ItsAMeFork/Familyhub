import React from 'react';

interface TaskColumnDropAreaProps {
  children: React.ReactNode;
  isEmpty: boolean;
}

export function TaskColumnDropArea({ children, isEmpty }: TaskColumnDropAreaProps) {
  return (
    <div className="flex-1">
      <div className="space-y-3 min-h-[100px]">
        {children}
        {isEmpty && (
          <div className="text-gray-400 text-sm text-center py-4 px-2 border-2 border-dashed border-gray-700/50 rounded-lg">
            Drop tasks here
          </div>
        )}
      </div>
    </div>
  );
}