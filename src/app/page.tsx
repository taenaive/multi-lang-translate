'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="p-4 border-b dark:border-gray-700">
        <h1 className="text-2xl font-bold text-center text-gray-800 dark:text-white">
          Welcome to the Multi-Language Translator
        </h1>
      </header>
      <main className="flex-grow flex flex-col items-center justify-center p-4 md:p-8">
        <div className="text-center">
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            Translate text into multiple languages at once. Log in to get started.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/login" className="px-6 py-2 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700">
              Login
            </Link>
            <Link href="/signup" className="px-6 py-2 font-semibold text-white bg-green-600 rounded-md hover:bg-green-700">
              Sign Up
            </Link>
          </div>
        </div>
      </main>
      <footer className="p-4 border-t dark:border-gray-700">
        <p className="text-center text-sm text-gray-500 dark:text-gray-400">
          Powered by Next.js and Google Cloud
        </p>
      </footer>
    </div>
  );
}

