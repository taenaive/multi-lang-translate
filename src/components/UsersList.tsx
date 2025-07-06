'use client';

import { useState, useEffect } from 'react';
import { UserSummary } from '@/lib/users';

interface UsersListProps {
  className?: string;
}

export default function UsersList({ className = '' }: UsersListProps) {
  const [users, setUsers] = useState<UserSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({ 
    total: 0, 
    withPasswords: 0, 
    oauthOnly: 0, 
    verified: 0,
    admins: 0,
    proUsers: 0
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/users');
      
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      
      const data = await response.json();
      setUsers(data.users);
      
      // Calculate stats
      const withPasswords = data.users.filter((u: UserSummary) => u.hasPassword).length;
      const oauthOnly = data.users.filter((u: UserSummary) => !u.hasPassword && u.accountsCount > 0).length;
      const verified = data.users.filter((u: UserSummary) => u.emailVerified).length;
      const admins = data.users.filter((u: UserSummary) => u.role === 'ADMIN').length;
      const proUsers = data.users.filter((u: UserSummary) => u.subscriptionTier !== 'FREE').length;
      
      setStats({
        total: data.users.length,
        withPasswords,
        oauthOnly,
        verified,
        admins,
        proUsers
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className={`p-4 ${className}`}>
        <div className="text-center text-gray-600 dark:text-gray-400">
          Loading users...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`p-4 ${className}`}>
        <div className="text-center text-red-600 dark:text-red-400">
          Error: {error}
        </div>
        <button
          onClick={fetchUsers}
          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className={`p-4 ${className}`}>
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">
            Users ({stats.total})
          </h2>
          <button
            onClick={fetchUsers}
            className="px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            Refresh
          </button>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.total}</div>
            <div className="text-sm text-blue-700 dark:text-blue-300">Total Users</div>
          </div>
          <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.admins}</div>
            <div className="text-sm text-red-700 dark:text-red-300">Admins</div>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.withPasswords}</div>
            <div className="text-sm text-green-700 dark:text-green-300">Email/Password</div>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{stats.oauthOnly}</div>
            <div className="text-sm text-purple-700 dark:text-purple-300">OAuth Only</div>
          </div>
          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats.verified}</div>
            <div className="text-sm text-yellow-700 dark:text-yellow-300">Verified</div>
          </div>
          <div className="bg-indigo-50 dark:bg-indigo-900/20 p-3 rounded-lg">
            <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{stats.proUsers}</div>
            <div className="text-sm text-indigo-700 dark:text-indigo-300">Pro+ Users</div>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Email
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Name
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Role
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Subscription
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Auth Method
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Created
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="px-4 py-2 text-sm text-gray-900 dark:text-gray-100">
                  {user.email}
                </td>
                <td className="px-4 py-2 text-sm text-gray-900 dark:text-gray-100">
                  {user.name || '-'}
                </td>
                <td className="px-4 py-2 text-sm">
                  <span className={`px-2 py-1 text-xs rounded ${
                    user.role === 'ADMIN' 
                      ? 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
                      : user.role === 'MODERATOR'
                      ? 'bg-orange-100 text-orange-800 dark:bg-orange-800 dark:text-orange-100'
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-4 py-2 text-sm">
                  <div className="flex flex-col space-y-1">
                    <span className={`px-2 py-1 text-xs rounded text-center ${
                      user.subscriptionTier === 'ENTERPRISE'
                        ? 'bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100'
                        : user.subscriptionTier === 'ULTRA'
                        ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-800 dark:text-indigo-100'
                        : user.subscriptionTier === 'PRO'
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                    }`}>
                      {user.subscriptionTier}
                    </span>
                    {user.subscriptionEnds && (
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        Until {formatDate(user.subscriptionEnds).split(',')[0]}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-2 text-sm">
                  <div className="flex space-x-1">
                    {user.hasPassword && (
                      <span className="px-2 py-1 text-xs bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100 rounded">
                        Email
                      </span>
                    )}
                    {user.accountsCount > 0 && (
                      <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100 rounded">
                        OAuth ({user.accountsCount})
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-2 text-sm">
                  {user.emailVerified ? (
                    <span className="px-2 py-1 text-xs bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100 rounded">
                      Verified
                    </span>
                  ) : (
                    <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 rounded">
                      Unverified
                    </span>
                  )}
                </td>
                <td className="px-4 py-2 text-sm text-gray-900 dark:text-gray-100">
                  {formatDate(user.createdAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {users.length === 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          No users found
        </div>
      )}
    </div>
  );
}