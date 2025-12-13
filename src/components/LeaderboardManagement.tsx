import React, { useState } from 'react';

interface User {
  id: string;
  username: string;
  score: number;
  completedGames: string[];
  createdAt: string;
}

interface LeaderboardManagementProps {
  users: User[];
  onRefresh: () => void;
}

export default function LeaderboardManagement({ users, onRefresh }: LeaderboardManagementProps) {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleDeleteUser = async (id: string) => {
    if (!confirm('Spieler wirklich löschen?')) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/admin/users/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setMessage('✓ Spieler gelöscht!');
        onRefresh();
      } else {
        setMessage('✗ Fehler beim Löschen');
      }
    } catch (error) {
      setMessage('✗ Fehler: ' + String(error));
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(''), 2000);
    }
  };

  const handleResetScore = async (id: string) => {
    if (!confirm('Score wirklich zurücksetzen?')) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/admin/users/${id}/reset-score`, {
        method: 'PUT',
      });

      if (response.ok) {
        setMessage('✓ Score zurückgesetzt!');
        onRefresh();
      } else {
        setMessage('✗ Fehler beim Zurücksetzen');
      }
    } catch (error) {
      setMessage('✗ Fehler: ' + String(error));
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(''), 2000);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <h2 className="text-2xl font-bold text-primary mb-4">🏆 Leaderboard-Verwaltung</h2>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-primary text-white">
              <th className="px-4 py-2 text-left">Rang</th>
              <th className="px-4 py-2 text-left">Spieler</th>
              <th className="px-4 py-2 text-center">Punkte</th>
              <th className="px-4 py-2 text-center">Gelöst</th>
              <th className="px-4 py-2 text-center">Beigetreten</th>
              <th className="px-4 py-2 text-center">Aktionen</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-4 text-center text-gray-500">
                  Noch keine Spieler
                </td>
              </tr>
            ) : (
              users.map((user, index) => (
                <tr key={user.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2 font-bold">
                    {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '#' + (index + 1)}
                  </td>
                  <td className="px-4 py-2 font-semibold">{user.username}</td>
                  <td className="px-4 py-2 text-center font-bold">{user.score}</td>
                  <td className="px-4 py-2 text-center">{user.completedGames.length}</td>
                  <td className="px-4 py-2 text-center text-xs">
                    {new Date(user.createdAt).toLocaleDateString('de-DE')}
                  </td>
                  <td className="px-4 py-2 text-center">
                    <button
                      onClick={() => handleResetScore(user.id)}
                      className="px-2 py-1 bg-yellow-500 text-white rounded mr-2 text-xs"
                    >
                      Score zurücksetzen
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      className="px-2 py-1 bg-red-500 text-white rounded text-xs"
                    >
                      Löschen
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {message && (
        <div
          className={`mt-4 p-2 rounded text-center ${
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
