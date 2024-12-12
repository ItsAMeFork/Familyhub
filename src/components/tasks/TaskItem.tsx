import React from 'react';
import { useDroppable, useDraggable } from '@dnd-kit/core';
import { Task } from '../../types';
import { useStore } from '../../store/useStore';
import { getTaskUrgencyColor } from '../../utils/taskUrgency';
import { TaskAssignee } from './TaskAssignee';
import { TaskTimestamp } from './TaskTimestamp';

interface TaskItemProps {
  task: Task;
  isOver: boolean;
  isDraggable: boolean;
  columnId: string;
}

export function TaskItem({ task, isOver, isDraggable, columnId }: TaskItemProps) {
  const { familyMembers } = useStore();

  // Make the task droppable
  const { setNodeRef: setDroppableRef, isOver: isTaskOver } = useDroppable({
    id: task.id,
    data: {
      type: 'task',
      task,
      columnId // Pass the column ID to know where this task is
    }
  });

  // Make the task draggable
  const {
    attributes,
    listeners,
    setNodeRef: setDraggableRef,
    transform,
    isDragging,
  } = useDraggable({
    id: task.id,
    disabled: !isDraggable,
    data: {
      type: 'task',
      task,
      columnId
    }
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    zIndex: isDragging ? 50 : undefined,
  } : undefined;

  const assignedMember = familyMembers.find(m => m.id === task.assignedTo);

  // Combine both refs
  const ref = (node: HTMLDivElement) => {
    setDroppableRef(node);
    if (isDraggable) {
      setDraggableRef(node);
    }
  };

  const urgencyColor = task.status === 'done' 
    ? 'bg-emerald-900/50 hover:bg-emerald-900/70 shadow-lg shadow-emerald-900/50' 
    : getTaskUrgencyColor(task.lastCompletedAt, task.createdAt);

  return (
    <div
      ref={ref}
      style={style}
      {...attributes}
      {...listeners}
      className={`card ${urgencyColor} transition-all ${
        isDraggable ? 'cursor-move touch-none active:scale-95' : ''
      } ${isOver || isTaskOver ? 'ring-2 ring-emerald-500 bg-emerald-500/20' : ''
      } ${isDragging ? 'opacity-50 scale-[1.02]' : ''}`}
    >
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <span className="flex-1">{task.title}</span>
          {assignedMember && <TaskAssignee member={assignedMember} />}
        </div>
        <TaskTimestamp task={task} />
      </div>
    </div>
  );
}