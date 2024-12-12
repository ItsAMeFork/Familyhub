import React from 'react';
import { useDraggable, useDroppable } from '@dnd-kit/core';
import { useStore } from '../../store/useStore';

interface FamilyMembersProps {
  activeId: string | null;
}

export function FamilyMembers({ activeId }: FamilyMembersProps) {
  const { familyMembers, loading } = useStore();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-4">
        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (!familyMembers?.length) {
    return (
      <div className="text-gray-400 text-sm text-center py-2">
        No family members found
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {familyMembers.map((member) => (
          <DraggableMember 
            key={member.id} 
            member={member} 
            isActive={activeId === `user_${member.id}`}
          />
        ))}
      </div>
      <UnassignDropZone isActive={activeId !== null && !activeId.startsWith('user_')} />
    </div>
  );
}

interface DraggableMemberProps {
  member: { id: string; name: string; avatar: string };
  isActive: boolean;
}

function DraggableMember({ member, isActive }: DraggableMemberProps) {
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: `user_${member.id}`,
  });

  return (
    <button
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`flex items-center gap-2 bg-gray-700/50 rounded-full px-3 py-1.5 cursor-move hover:bg-gray-700 transition-colors touch-none ${
        isActive ? 'opacity-50' : ''
      }`}
    >
      <span className="text-xl">{member.avatar}</span>
      <span className="text-sm">{member.name}</span>
    </button>
  );
}

interface UnassignDropZoneProps {
  isActive: boolean;
}

function UnassignDropZone({ isActive }: UnassignDropZoneProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: 'unassign',
  });

  return (
    <div
      ref={setNodeRef}
      className={`flex items-center gap-2 bg-gray-700/30 rounded-full px-3 py-1.5 border-2 border-dashed border-gray-600 transition-colors ${
        isActive ? 'opacity-100' : 'opacity-0'
      } ${isOver ? 'bg-red-500/20 border-red-500' : 'hover:bg-gray-700/40'}`}
    >
      <span className="text-gray-400 text-sm">Drop to unassign</span>
    </div>
  );
}