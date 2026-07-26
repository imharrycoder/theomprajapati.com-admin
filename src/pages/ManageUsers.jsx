import { useState, useEffect } from 'react';
import { apiFetch } from '../utils/api.js';
import { toast } from 'react-toastify';
import { Save, User, Calendar, Award } from 'lucide-react';

function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await apiFetch('/admin/users');
      setUsers(data);
    } catch (error) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSubscription = async (userId, plan, expiresAtStr) => {
    try {
      await apiFetch(`/admin/users/${userId}/subscription`, {
        method: 'PUT',
        body: JSON.stringify({
          subscriptionPlan: plan,
          subscriptionExpiresAt: expiresAtStr || null
        })
      });
      toast.success('User subscription updated successfully');
      fetchUsers();
    } catch (error) {
      toast.error('Failed to update subscription');
    }
  };

  if (loading) {
    return <div className="text-white opacity-60">Loading users...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Users & Subscriptions</h2>
      </div>

      <div className="overflow-x-auto rounded-xl border border-[var(--line)] bg-[var(--surface)]">
        <table className="w-full text-left text-sm text-[var(--muted)]">
          <thead className="border-b border-[var(--line)] bg-[var(--surface-2)] text-xs uppercase text-white">
            <tr>
              <th className="px-6 py-4">User</th>
              <th className="px-6 py-4">Current Plan</th>
              <th className="px-6 py-4">Expires At</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--line)]">
            {users.map((user) => {
              // Create local state for editing this specific user
              return <UserRow key={user.id} user={user} onSave={handleUpdateSubscription} />;
            })}
          </tbody>
        </table>
        {users.length === 0 && (
          <div className="p-8 text-center text-[var(--muted)]">
            No users found.
          </div>
        )}
      </div>
    </div>
  );
}

function UserRow({ user, onSave }) {
  const [plan, setPlan] = useState(user.subscriptionPlan || 'NONE');
  const [expiresAt, setExpiresAt] = useState(
    user.subscriptionExpiresAt ? new Date(user.subscriptionExpiresAt).toISOString().split('T')[0] : ''
  );
  const [isModified, setIsModified] = useState(false);

  // Sync when user changes
  useEffect(() => {
    setPlan(user.subscriptionPlan || 'NONE');
    setExpiresAt(user.subscriptionExpiresAt ? new Date(user.subscriptionExpiresAt).toISOString().split('T')[0] : '');
    setIsModified(false);
  }, [user]);

  const handlePlanChange = (e) => {
    setPlan(e.target.value);
    setIsModified(true);
  };

  const handleDateChange = (e) => {
    setExpiresAt(e.target.value);
    setIsModified(true);
  };

  const handleSave = () => {
    onSave(user.id, plan, expiresAt);
  };

  return (
    <tr className="hover:bg-[var(--surface-2)] transition-colors">
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-full bg-[var(--surface-3)] text-white">
            <User size={18} />
          </div>
          <div>
            <div className="font-bold text-white">{user.name}</div>
            <div className="text-xs">{user.email}</div>
            <div className="text-[10px] mt-1 opacity-50">Joined {new Date(user.createdAt).toLocaleDateString()}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <Award size={16} className={plan !== 'NONE' ? 'text-amber-400' : 'text-gray-500'} />
          <select 
            value={plan} 
            onChange={handlePlanChange}
            className="input-field py-1 px-2 text-xs"
          >
            <option value="NONE">None (Free)</option>
            <option value="PREMIUM">Premium</option>
            <option value="EARLY_JOINER">Early Joiner (Legacy)</option>
            <option value="STANDARD">Standard (Legacy)</option>
          </select>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <Calendar size={16} className="text-blue-400" />
          <input 
            type="date" 
            value={expiresAt} 
            onChange={handleDateChange}
            className="input-field py-1 px-2 text-xs"
          />
        </div>
        {user.subscriptionExpiresAt && new Date(user.subscriptionExpiresAt) < new Date() && (
          <span className="text-red-400 text-xs ml-6 mt-1 block">Expired</span>
        )}
      </td>
      <td className="px-6 py-4">
        {isModified ? (
          <button 
            onClick={handleSave}
            className="flex items-center gap-1 rounded bg-green-600 px-3 py-1 text-xs font-bold text-white hover:bg-green-500 transition-colors"
          >
            <Save size={14} /> Save
          </button>
        ) : (
          <span className="text-xs opacity-50">Up to date</span>
        )}
      </td>
    </tr>
  );
}

export default ManageUsers;
