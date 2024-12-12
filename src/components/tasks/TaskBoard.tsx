import React from 'react';
import { DndContext, DragEndEvent, useSensor, useSensors, PointerSensor, DragStartEvent, DragOverlay } from '@dnd-kit/core';
import { useStore } from '../../store/useStore';
import { TaskColumn } from './TaskColumn';
import { FamilyMembers } from './FamilyMembers';
import { TaskForm } from './TaskForm';
import { TaskItem } from './TaskItem';

export function TaskBoard() {
  const { tasks, familyMembers, assignTask, updateTaskStatus, loading } = useStore();
  const [activeId, setActiveId] = React.useState<string | null>(null);
  const [activeTask, setActiveTask] = React.useState<any>(null);
  const [isHeaderSticky, setIsHeaderSticky] = React.useState(false);
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  React.useEffect(() => {
    const handleScroll = () => {
      setIsHeaderSticky(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveId(active.id.toString());
    
    if (!active.id.toString().startsWith('user_')) {
      const task = tasks.find(t => t.id === active.id);
      setActiveTask(task);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    setActiveTask(null);
    
    if (!over) return;

    // If dragging a family member to a task
    if (active.id.toString().startsWith('user_') && !over.id.toString().startsWith('user_')) {
      const memberId = active.id.toString().replace('user_', '');
      const taskId = over.id.toString();
      if (over.id !== 'unassign') {
        await assignTask(taskId, memberId);
      }
    }
    // If removing assignment (dragging to unassign area)
    else if (!active.id.toString().startsWith('user_') && over.id === 'unassign') {
      await assignTask(active.id.toString(), null);
    }
    // If dragging a task
    else if (!active.id.toString().startsWith('user_')) {
      let targetStatus: 'todo' | 'doing' | 'done';
      
      // If dropping on another task, use that task's column
      if (over.data.current?.type === 'task') {
        targetStatus = over.data.current.columnId as 'todo' | 'doing' | 'done';
      } 
      // If dropping on a column
      else {
        targetStatus = over.id.toString() as 'todo' | 'doing' | 'done';
      }
      
      await updateTaskStatus(active.id.toString(), targetStatus);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <DndContext 
      sensors={sensors} 
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="space-y-4 pb-24">
        <div className={`card sticky top-0 z-30 transition-all duration-300 ${
          isHeaderSticky 
            ? 'bg-gray-800/95 backdrop-blur shadow-lg shadow-black/20 rounded-none -mx-3 md:-mx-4 px-3 md:px-4 py-2 translate-y-0' 
            : 'bg-gray-800 translate-y-0'
        }`}>
          <div className={`space-y-2 transition-all duration-300 ${isHeaderSticky ? 'scale-95 origin-left' : ''}`}>
            <h2 className="text-lg md:text-xl font-bold">House Tasks</h2>
            <p className="text-gray-400 text-sm">Drag family members onto tasks to assign them</p>
            <div className="space-y-2">
              <FamilyMembers activeId={activeId} />
              <TaskForm />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <TaskColumn
            title="To Do"
            status="todo"
            tasks={tasks.filter((task) => task.status === 'todo')}
            activeId={activeId}
          />
          <TaskColumn
            title="Doing"
            status="doing"
            tasks={tasks.filter((task) => task.status === 'doing')}
            activeId={activeId}
          />
          <TaskColumn
            title="Done"
            status="done"
            tasks={tasks.filter((task) => task.status === 'done')}
            activeId={activeId}
          />
        </div>

        <DragOverlay zIndex={100}>
          {activeId?.startsWith('user_') && familyMembers && (
            <div className="flex items-center gap-2 bg-gray-700/50 rounded-full px-3 py-1.5">
              <span className="text-xl">
                {activeId && familyMembers.find(m => `user_${m.id}` === activeId)?.avatar}
              </span>
              <span className="text-sm">
                {activeId && familyMembers.find(m => `user_${m.id}` === activeId)?.name}
              </span>
            </div>
          )}
          {activeTask && (
            <TaskItem 
              task={activeTask}
              isOver={false}
              isDraggable={false}
              columnId=""
            />
          )}
        </DragOverlay>
      </div>
    </DndContext>
  );
}