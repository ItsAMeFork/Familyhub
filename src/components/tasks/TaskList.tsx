import React from 'react';
import { Task } from '../../types';
import { TaskItem } from './TaskItem';

interface TaskListProps {
  tasks: Task[];
  isFamilyMemberDragging: boolean;
  isOver: boolean;
  columnId: string;
}

export function TaskList({ tasks, isFamilyMemberDragging, isOver, columnId }: TaskListProps) {
  return (
    <div className="flex-1 flex flex-col">
      <div className="flex-1 relative">
        {/* Task list container */}
        <div className="relative h-full">
          <div className="space-y-3 p-0.5 min-h-full">
            {tasks.length === 0 ? (
              <div className="absolute inset-0 flex items-center justify-center p-4">
                <div className="text-gray-400 text-sm text-center py-8 px-4 w-full border-2 border-dashed border-gray-700/50 rounded-lg">
                  Drop tasks here
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {tasks.map((task) => (
                  <TaskItem 
                    key={task.id} 
                    task={task} 
                    isOver={isOver && isFamilyMemberDragging}
                    isDraggable={true}
                    columnId={columnId}
                  />
                ))}
                {/* Extra space at bottom for dropping */}
                <div className="h-4" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}