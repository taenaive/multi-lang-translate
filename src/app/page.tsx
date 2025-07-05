'use client';

import { useSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (session) {
      router.push('/translate');
    }
  }, [session, router]);

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (isLogin) {
      // Sign in with credentials
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Invalid email or password');
      }
    } else {
      // Register new user
      try {
        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password, name }),
        });

        if (response.ok) {
          // Auto-login after registration
          const result = await signIn('credentials', {
            email,
            password,
            redirect: false,
          });

          if (result?.error) {
            setError('Registration successful but login failed');
          }
        } else {
          const data = await response.json();
          setError(data.error || 'Registration failed');
        }
      } catch {
        setError('Registration failed');
      }
    }
    setLoading(false);
  };

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-lg text-gray-600 dark:text-gray-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="p-4 border-b dark:border-gray-700">
        <h1 className="text-2xl font-bold text-center text-gray-800 dark:text-white">
          Multi-Language Translator
        </h1>
      </header>
      <main className="flex-grow flex items-center justify-center p-4 md:p-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
              Welcome
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
              Translate text between multiple languages with text-to-speech support.
            </p>
            
            {!session ? (
              <div className="space-y-6">
                {/* OAuth Login */}
                <button
                  onClick={() => signIn('google')}
                  className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Sign in with Google
                </button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-gray-50 dark:bg-gray-900 text-gray-500">Or</span>
                  </div>
                </div>

                {/* Credentials Form */}
                <form onSubmit={handleCredentialsSubmit} className="space-y-4">
                  {!isLogin && (
                    <input
                      type="text"
                      placeholder="Full Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                  )}
                  <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                  <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                  
                  {error && (
                    <div className="text-red-600 text-sm text-center">{error}</div>
                  )}
                  
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50"
                  >
                    {loading ? 'Processing...' : isLogin ? 'Sign In' : 'Sign Up'}
                  </button>
                </form>

                <div className="text-center">
                  <button
                    onClick={() => {
                      setIsLogin(!isLogin);
                      setError('');
                    }}
                    className="text-blue-600 hover:text-blue-700 text-sm"
                  >
                    {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => router.push('/translate')}
                className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                Go to Translator
              </button>
            )}
          </div>
          
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
              Features
            </h3>
            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <li>• Real-time translation between multiple languages</li>
              <li>• Text-to-speech functionality</li>
              <li>• Support for multiple target languages</li>
              <li>• Dark mode support</li>
            </ul>
          </div>
        </div>
      </main>
      <footer className="p-4 border-t dark:border-gray-700">
        <p className="text-center text-sm text-gray-500 dark:text-gray-400">
          Powered by Next.js & NextAuth.js
        </p>
      </footer>
    </div>
  );
}
