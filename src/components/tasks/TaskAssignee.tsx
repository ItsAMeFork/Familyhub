import React from 'react';
import { FamilyMember } from '../../types';

interface TaskAssigneeProps {
  member: FamilyMember;
}

export function TaskAssignee({ member }: TaskAssigneeProps) {
  return (
    <div className="flex items-center gap-2 bg-gray-800/50 rounded-full px-3 py-1 shrink-0">
      <span>{member.avatar}</span>
      <span className="text-sm text-gray-300">{member.name}</span>
    </div>
  );
}