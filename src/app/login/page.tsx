'use client';

import LoginForm from '@/components/auth/LoginForm';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="p-4 border-b dark:border-gray-700">
        <h1 className="text-2xl font-bold text-center text-gray-800 dark:text-white">
          Login
        </h1>
      </header>
      <main className="flex-grow flex flex-col items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-md">
          <LoginForm />
          <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
            Don&#39;t have an account?{' '}
            <Link href="/signup" className="font-medium text-blue-600 hover:text-blue-500">
              Sign up
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
