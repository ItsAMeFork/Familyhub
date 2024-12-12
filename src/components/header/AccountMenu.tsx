import React from 'react';
import { LogOut, Settings } from 'lucide-react';
import { User } from 'firebase/auth';
import { useAuth } from '../../lib/auth';

interface AccountMenuProps {
  isOpen: boolean;
  user: User;
  userAvatar: string;
  onOpenSettings: () => void;
}

export function AccountMenu({ isOpen, user, userAvatar, onOpenSettings }: AccountMenuProps) {
  const { signOut } = useAuth();

  if (!isOpen) return null;

  return (
    <div className="dropdown-content absolute right-0 mt-2 w-56 rounded-xl bg-gray-800 shadow-xl border border-gray-700">
      <div className="p-3 border-b border-gray-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-xl">
            <span>{userAvatar}</span>
          </div>
          <div>
            <p className="font-medium">{user.displayName || user.email?.split('@')[0]}</p>
            <p className="text-xs text-gray-400">{user.email}</p>
          </div>
        </div>
      </div>

      <div className="p-2 space-y-1">
        <button
          onClick={onOpenSettings}
          className="w-full flex items-center gap-3 px-2 py-1.5 rounded-lg hover:bg-gray-700/50"
        >
          <Settings size={16} />
          <span className="text-sm">Settings</span>
        </button>
        <button
          onClick={signOut}
          className="w-full flex items-center gap-3 px-2 py-1.5 rounded-lg hover:bg-gray-700/50 text-red-400 hover:text-red-300"
        >
          <LogOut size={16} />
          <span className="text-sm">Sign Out</span>
        </button>
      </div>
    </div>
  );
}