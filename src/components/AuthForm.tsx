import React, { useState } from 'react';

interface AuthFormProps {
  isLogin: boolean;
  onToggle: () => void;
  onSubmit: (username: string, password: string, email?: string) => Promise<void>;
}

export default function AuthForm({ isLogin, onToggle, onSubmit }: AuthFormProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      await onSubmit(username, password, email);
      setUsername('');
      setPassword('');
      setEmail('');
      setMessage(isLogin ? '✓ Erfolgreich angemeldet!' : '✓ Account erstellt!');
    } catch (error) {
      setMessage('✗ ' + String(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 max-w-md mx-auto border-4 border-primary">
      <h2 className="text-2xl font-bold text-primary mb-4 text-center">
        {isLogin ? '🔐 Anmelden' : '📝 Registrieren'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-bold text-black mb-2">
            Benutzername
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Benutzername"
            required
            className="w-full px-4 py-2 border-2 border-primary rounded-lg text-black placeholder-gray-500 focus:outline-none focus:border-primary-dark"
          />
        </div>

        {!isLogin && (
          <div>
            <label className="block text-sm font-bold text-black mb-2">
              E-Mail
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="deine@email.com"
              required={!isLogin}
              className="w-full px-4 py-2 border-2 border-primary rounded-lg text-black placeholder-gray-500 focus:outline-none focus:border-primary-dark"
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-bold text-black mb-2">
            Passwort
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Passwort"
            required
            className="w-full px-4 py-2 border-2 border-primary rounded-lg text-black placeholder-gray-500 focus:outline-none focus:border-primary-dark"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full px-6 py-3 bg-primary hover:bg-primary-dark text-white font-bold rounded-lg transition disabled:bg-gray-400"
        >
          {loading ? 'Wird verarbeitet...' : isLogin ? 'Anmelden' : 'Registrieren'}
        </button>
      </form>

      <button
        onClick={onToggle}
        className="mt-4 w-full text-primary hover:text-primary-dark font-semibold underline"
      >
        {isLogin ? 'Kein Account? Jetzt registrieren' : 'Bereits registriert? Anmelden'}
      </button>

      {message && (
        <div
          className={`mt-4 p-2 rounded text-center text-sm ${
            message.startsWith('✓')
              ? 'bg-green-200 text-green-800'
              : 'bg-red-200 text-red-800'
          }`}
        >
          {message}
        </div>
      )}
    </div>
  );
}
