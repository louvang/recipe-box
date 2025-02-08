'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginForm() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error('Login failed:', data.message);
        setError(data.message);
        return;
      }

      window.location.reload();
    } catch (error) {
      console.error('Login error:', error);
      setError(
        error instanceof Error ? error.message : 'Something unexpected happened'
      );
    }
  };

  let errorMsg = (
    <div className="text-base px-3 py-2 mt-2 red-msg-box font-bold">
      Incorrect username/password.
    </div>
  );

  return (
    <div className="flex justify-center items-center h-screen overflow-auto text-lg bg-neutral-50">
      <div className="bg-neutral-100 border border-neutral-400 p-8 rounded-xl w-[400px]">
        <h1 className="text-4xl mb-1">Welcome!</h1>
        <p className="mb-4">Login to start managing your recipes.</p>

        <form onSubmit={handleLogin}>
          <label htmlFor="email" className="font-bold w-full mb-1 block">
            Email
          </label>

          <input
            id="email"
            type="text"
            placeholder="Your email"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            className="input-field w-full mb-4"
            required
          />

          <label htmlFor="password" className="font-bold w-full mb-1 block">
            Password
          </label>
          <input
            id="password"
            type="password"
            placeholder="Your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-field w-full mb-4"
            required
          />

          {error ? errorMsg : ''}

          <div className="flex justify-center mt-4 mb-1">
            <button type="submit" className="submit-btn text-xl">
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
