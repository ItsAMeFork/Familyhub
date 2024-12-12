import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useAuth } from '../../lib/auth/useAuth';
import { updateProfile } from 'firebase/auth';
import { ref, update, get } from 'firebase/database';
import { db } from '../../lib/firebase';

const AVATARS = ['👤', '👩', '👨', '👧', '👦', '🧑', '👱', '👴', '👵', '🐱', '🐶', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🦄', '🐸', '🦆'];

interface AccountSettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AccountSettings({ isOpen, onClose }: AccountSettingsProps) {
  const { user } = useAuth();
  const [name, setName] = useState(user?.displayName || '');
  const [selectedAvatar, setSelectedAvatar] = useState('👤');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      const fetchUserData = async () => {
        try {
          const snapshot = await get(ref(db, `users/${user.uid}`));
          if (snapshot.exists()) {
            const userData = snapshot.val();
            setName(userData.name || user.displayName || '');
            setSelectedAvatar(userData.avatar || '👤');
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          setError('Failed to load user data. Please try again.');
        }
      };

      fetchUserData();
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Update Firebase Auth profile
      await updateProfile(user, {
        displayName: name
      });

      // Update Realtime Database
      await update(ref(db, `users/${user.uid}`), {
        name,
        avatar: selectedAvatar,
        lastUpdated: new Date().toISOString()
      });

      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="w-full max-w-md bg-gray-800 rounded-xl shadow-xl">
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-lg font-semibold">Account Settings</h2>
          <button 
            onClick={onClose} 
            className="p-1 hover:text-gray-400 transition-colors rounded-lg hover:bg-gray-700/50"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {error && (
            <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300 text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="p-3 bg-emerald-500/20 border border-emerald-500/50 rounded-lg text-emerald-300 text-sm">
              Profile updated successfully!
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Display Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input w-full"
              placeholder="Your name"
              required
              minLength={2}
              maxLength={50}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Choose Avatar
            </label>
            <div className="grid grid-cols-5 gap-2">
              {AVATARS.map((avatar) => (
                <button
                  key={avatar}
                  type="button"
                  onClick={() => setSelectedAvatar(avatar)}
                  className={`aspect-square text-2xl rounded-lg flex items-center justify-center transition-all ${
                    selectedAvatar === avatar
                      ? 'bg-emerald-500/20 ring-2 ring-emerald-500'
                      : 'bg-gray-700/50 hover:bg-gray-700'
                  }`}
                >
                  {avatar}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="button button-primary flex-1 relative"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Saving...
                </span>
              ) : (
                'Save Changes'
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="button flex-1"
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}