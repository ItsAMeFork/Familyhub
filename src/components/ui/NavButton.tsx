import React, { ReactNode } from 'react';

interface NavButtonProps {
  icon: ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

export function NavButton({ icon, label, isActive, onClick }: NavButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center p-2 md:p-3 rounded-xl transition-colors ${
        isActive ? 'text-emerald-500' : 'text-gray-400 hover:text-gray-300'
      }`}
    >
      {icon}
      <span className="text-xs mt-1">{label}</span>
    </button>
  );
}