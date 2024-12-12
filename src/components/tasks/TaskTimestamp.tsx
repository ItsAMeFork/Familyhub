import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Task } from '../../types';

interface TaskTimestampProps {
  task: Task;
}

export function TaskTimestamp({ task }: TaskTimestampProps) {
  const getTimeSinceLastCompletion = () => {
    if (!task.lastCompletedAt) {
      return formatDistanceToNow(new Date(task.createdAt), { addSuffix: true });
    }
    return formatDistanceToNow(new Date(task.lastCompletedAt), { addSuffix: true });
  };

  return (
    <div className="text-xs text-gray-400">
      {task.status === 'done' ? 'Completed ' : 'Last done '}
      {getTimeSinceLastCompletion()}
    </div>
  );
}