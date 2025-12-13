import React from 'react';

interface Score {
  playerName: string;
  score: number;
  completedGames: number;
}

interface LeaderboardProps {
  scores: Score[];
}

export default function Leaderboard({ scores }: LeaderboardProps) {
  return (
    <div className="w-full max-w-2xl mx-auto p-4 bg-white rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold text-primary mb-6 text-center">
        🏆 Leaderboard
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-primary text-white">
              <th className="px-4 py-3 text-left">Rang</th>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-center">Punkte</th>
              <th className="px-4 py-3 text-center">Spiele</th>
            </tr>
          </thead>
          <tbody>
            {scores.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-4 text-center text-gray-500">
                  Noch keine Scores vorhanden
                </td>
              </tr>
            ) : (
              scores.map((score, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-200 hover:bg-gray-50"
                >
                  <td className="px-4 py-3 text-black font-bold">
                    {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '#' + (index + 1)}
                  </td>
                  <td className="px-4 py-3 text-black font-semibold">
                    {score.playerName}
                  </td>
                  <td className="px-4 py-3 text-center text-black font-bold">
                    {score.score}
                  </td>
                  <td className="px-4 py-3 text-center text-black">
                    {score.completedGames}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
