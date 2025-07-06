'use client';

import { getAuth, onAuthStateChanged, signOut, User } from 'firebase/auth';
import { app } from '@/lib/firebase';
import { useEffect, useState } from 'react';
import Link from 'next/link';

const auth = getAuth(app);

export default function AuthButton() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return null;
  }

  if (user) {
    return (
      <button
        onClick={() => signOut(auth)}
        className="px-4 py-2 font-semibold text-white bg-red-600 rounded-md hover:bg-red-700"
      >
        Logout
      </button>
    );
  }

  return (
    <Link href="/login" className="px-4 py-2 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700">
      Login
    </Link>
  );
}
