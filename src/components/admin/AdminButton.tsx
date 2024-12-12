import React from 'react';
import { Settings } from 'lucide-react';
import { useAdmin } from '../../lib/admin/useAdmin';
import { AdminPanel } from './AdminPanel';

export function AdminButton() {
  const { isAdmin, loading } = useAdmin();
  const [showPanel, setShowPanel] = React.useState(false);

  if (loading || !isAdmin) return null;

  return (
    <>
      <button
        onClick={() => setShowPanel(true)}
        className="p-1.5 md:p-2 rounded-full bg-purple-500/20 hover:bg-purple-500/30 transition-colors text-purple-300"
        title="Admin Settings"
      >
        <Settings className="w-4 h-4 md:w-5 md:h-5" />
      </button>

      <AdminPanel
        isOpen={showPanel}
        onClose={() => setShowPanel(false)}
      />
    </>
  );
}