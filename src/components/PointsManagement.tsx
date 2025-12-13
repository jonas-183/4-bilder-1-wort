import React, { useState, useEffect } from 'react';

interface PointsConfig {
  easy: number;
  medium: number;
  hard: number;
}

interface PointsManagementProps {
  onRefresh: () => void;
}

export default function PointsManagement({ onRefresh }: PointsManagementProps) {
  const [points, setPoints] = useState<PointsConfig>({
    easy: 10,
    medium: 25,
    hard: 50,
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchPointsConfig();
  }, []);

  const fetchPointsConfig = async () => {
    try {
      const response = await fetch('/api/admin/points');
      const data = await response.json();
      setPoints(data);
    } catch (error) {
      console.error('Fehler beim Laden der Punkte:', error);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/points', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(points),
      });

      if (response.ok) {
        setMessage('✓ Punkte aktualisiert!');
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

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <h2 className="text-2xl font-bold text-primary mb-4">⭐ Punkteverwaltung</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-bold text-black mb-2">
            Einfach (easy)
          </label>
          <input
            type="number"
            value={points.easy}
            onChange={(e) =>
              setPoints({ ...points, easy: parseInt(e.target.value) || 0 })
            }
            className="w-full px-4 py-2 border-2 border-primary rounded-lg text-black"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-black mb-2">
            Mittel (medium)
          </label>
          <input
            type="number"
            value={points.medium}
            onChange={(e) =>
              setPoints({ ...points, medium: parseInt(e.target.value) || 0 })
            }
            className="w-full px-4 py-2 border-2 border-primary rounded-lg text-black"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-black mb-2">
            Schwer (hard)
          </label>
          <input
            type="number"
            value={points.hard}
            onChange={(e) =>
              setPoints({ ...points, hard: parseInt(e.target.value) || 0 })
            }
            className="w-full px-4 py-2 border-2 border-primary rounded-lg text-black"
          />
        </div>
      </div>

      <button
        onClick={handleSave}
        disabled={loading}
        className="mt-4 w-full px-6 py-3 bg-primary hover:bg-primary-dark text-white font-bold rounded-lg transition disabled:bg-gray-400"
      >
        {loading ? 'Wird gespeichert...' : 'Punkte speichern'}
      </button>

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
