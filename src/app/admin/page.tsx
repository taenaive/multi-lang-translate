'use client';

import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { useState } from 'react';
import UsersList from '@/components/UsersList';

export default function AdminPage() {
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState<'users' | 'stats'>('users');

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-lg text-gray-600 dark:text-gray-400">Loading...</div>
      </div>
    );
  }

  if (!session) {
    redirect('/');
  }

  // Check if user has admin role
  if (session.user?.role !== 'ADMIN') {
    redirect('/translate');
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="p-4 border-b dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
              Admin Dashboard
            </h1>
            <nav className="flex space-x-1">
              <button
                onClick={() => setActiveTab('users')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'users'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                Users
              </button>
              <button
                onClick={() => setActiveTab('stats')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'stats'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                Statistics
              </button>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Welcome, {session.user?.name || session.user?.email}
            </span>
            <div className="flex space-x-2">
              <button
                onClick={() => window.location.href = '/translate'}
                className="px-4 py-2 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
              >
                Translator
              </button>
              <button
                onClick={() => window.location.href = '/api/auth/signout'}
                className="px-4 py-2 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          {activeTab === 'users' && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                  User Management
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  View and manage all registered users in the system
                </p>
              </div>
              <UsersList />
            </div>
          )}

          {activeTab === 'stats' && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                System Statistics
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                  title="Total Users"
                  value="Loading..."
                  description="Registered users"
                  icon="👥"
                />
                <StatCard
                  title="Active Sessions"
                  value="N/A"
                  description="Current sessions"
                  icon="🔐"
                />
                <StatCard
                  title="Translations"
                  value="N/A"
                  description="Total translations"
                  icon="🌐"
                />
                <StatCard
                  title="Speech Requests"
                  value="N/A"
                  description="TTS requests"
                  icon="🔊"
                />
              </div>
              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  💡 Statistics tracking can be implemented in future updates to track translation usage, popular languages, and system performance metrics.
                </p>
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="p-4 border-t dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto">
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            Multi-Language Translator Admin Dashboard
          </p>
        </div>
      </footer>
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string;
  description: string;
  icon: string;
}

function StatCard({ title, value, description, icon }: StatCardProps) {
  return (
    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
            {title}
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {value}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500">
            {description}
          </p>
        </div>
        <div className="text-2xl">{icon}</div>
      </div>
    </div>
  );
}