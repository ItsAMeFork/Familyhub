import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../lib/auth';
import { AdminButton } from '../admin/AdminButton';
import { AccountMenu } from './AccountMenu';
import { AccountSettings } from '../settings/AccountSettings';
import { useUserAvatar } from '../../hooks/useUserAvatar';

export function AccountDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const { userAvatar } = useUserAvatar();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user) return null;

  return (
    <>
      <div className="relative" ref={dropdownRef}>
        <div className="flex items-center gap-2">
          <AdminButton />
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-gray-700/50 hover:bg-gray-700 transition-colors flex items-center justify-center text-lg"
          >
            <span>{userAvatar}</span>
          </button>
        </div>

        <AccountMenu
          isOpen={isOpen}
          user={user}
          userAvatar={userAvatar}
          onOpenSettings={() => {
            setShowSettings(true);
            setIsOpen(false);
          }}
        />
      </div>

      <AccountSettings
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
      />
    </>
  );
}