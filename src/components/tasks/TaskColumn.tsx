import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { Task } from '../../types';
import { TaskItem } from './TaskItem';
import { TaskColumnHeader } from './TaskColumnHeader';
import { TaskList } from './TaskList';

interface TaskColumnProps {
  title: string;
  status: 'todo' | 'doing' | 'done';
  tasks: Task[];
  activeId: string | null;
}

export function TaskColumn({ title, status, tasks, activeId }: TaskColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: status,
    data: {
      type: 'column',
      accepts: 'task'
    }
  });

  const isFamilyMemberDragging = activeId?.startsWith('user_') || false;
  const isTaskDragging = activeId && !activeId.startsWith('user_');

  return (
    <div 
      ref={setNodeRef}
      className={`card flex flex-col min-h-[calc(100vh-20rem)] transition-colors ${
        isOver && isTaskDragging ? 'ring-2 ring-emerald-500 bg-emerald-500/10' : ''
      }`}
    >
      <TaskColumnHeader title={title} taskCount={tasks.length} />
      
      <TaskList
        tasks={tasks}
        isFamilyMemberDragging={isFamilyMemberDragging}
        isOver={isOver}
        columnId={status}
      />
    </div>
  );
}