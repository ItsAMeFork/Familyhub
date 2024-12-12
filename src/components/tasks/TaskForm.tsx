import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { ref, push } from 'firebase/database';
import { db } from '../../lib/firebase';
import { useAuth } from '../../lib/auth/useAuth';

export function TaskForm() {
  const [title, setTitle] = useState('');
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !user) return;

    try {
      await push(ref(db, 'tasks'), {
        title: title.trim(),
        status: 'todo',
        assignedTo: null,
        createdBy: user.uid,
        createdAt: new Date().toISOString()
      });

      setTitle('');
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex gap-2">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Add new task..."
          className="input flex-1"
        />
        <button
          type="submit"
          className="button button-primary p-2"
        >
          <Plus size={20} />
        </button>
      </div>
    </form>
  );
}