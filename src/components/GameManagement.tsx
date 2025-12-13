import React, { useState, useEffect } from 'react';

interface Game {
  id: string;
  images: string[];
  answer: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
}

interface GameManagementProps {
  games: Game[];
  onRefresh: () => void;
}

export default function GameManagement({ games, onRefresh }: GameManagementProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<Game>>({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleEdit = (game: Game) => {
    setEditingId(game.id);
    setEditData(game);
  };

  const handleSave = async () => {
    if (!editingId) return;
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/games/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editData),
      });

      if (response.ok) {
        setMessage('✓ Rätsel aktualisiert!');
        setEditingId(null);
        onRefresh();
      } else {
        setMessage('✗ Fehler beim Speichern');
      }
    } catch (error) {
      setMessage('✗ Fehler: ' + String(error));
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(''), 2000);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Rätsel wirklich löschen?')) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/admin/games/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setMessage('✓ Rätsel gelöscht!');
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

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <h2 className="text-2xl font-bold text-primary mb-4">📋 Rätsel-Verwaltung</h2>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-primary text-white">
              <th className="px-4 py-2 text-left">Antwort</th>
              <th className="px-4 py-2 text-left">Kategorie</th>
              <th className="px-4 py-2 text-left">Schwierigkeit</th>
              <th className="px-4 py-2 text-center">Aktionen</th>
            </tr>
          </thead>
          <tbody>
            {games.map((game) => (
              <tr key={game.id} className="border-b hover:bg-gray-50">
                {editingId === game.id ? (
                  <>
                    <td className="px-4 py-2">
                      <input
                        type="text"
                        value={editData.answer || ''}
                        onChange={(e) =>
                          setEditData({ ...editData, answer: e.target.value })
                        }
                        className="w-full px-2 py-1 border border-primary rounded"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="text"
                        value={editData.category || ''}
                        onChange={(e) =>
                          setEditData({ ...editData, category: e.target.value })
                        }
                        className="w-full px-2 py-1 border border-primary rounded"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <select
                        value={editData.difficulty || 'easy'}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            difficulty: e.target.value as 'easy' | 'medium' | 'hard',
                          })
                        }
                        className="w-full px-2 py-1 border border-primary rounded"
                      >
                        <option value="easy">Einfach</option>
                        <option value="medium">Mittel</option>
                        <option value="hard">Schwer</option>
                      </select>
                    </td>
                    <td className="px-4 py-2 text-center">
                      <button
                        onClick={handleSave}
                        disabled={loading}
                        className="px-2 py-1 bg-green-500 text-white rounded mr-2 text-xs"
                      >
                        Speichern
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="px-2 py-1 bg-gray-500 text-white rounded text-xs"
                      >
                        Abbrechen
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="px-4 py-2 font-semibold">{game.answer}</td>
                    <td className="px-4 py-2">{game.category}</td>
                    <td className="px-4 py-2">
                      <span
                        className={`px-2 py-1 rounded text-xs text-white ${
                          game.difficulty === 'easy'
                            ? 'bg-green-500'
                            : game.difficulty === 'medium'
                            ? 'bg-yellow-500'
                            : 'bg-red-500'
                        }`}
                      >
                        {game.difficulty}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-center">
                      <button
                        onClick={() => handleEdit(game)}
                        className="px-2 py-1 bg-blue-500 text-white rounded mr-2 text-xs"
                      >
                        Bearbeiten
                      </button>
                      <button
                        onClick={() => handleDelete(game.id)}
                        className="px-2 py-1 bg-red-500 text-white rounded text-xs"
                      >
                        Löschen
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
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
