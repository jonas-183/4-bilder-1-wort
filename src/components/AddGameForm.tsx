import React, { useState } from 'react';

interface AddGameFormProps {
  onSubmit: (data: {
    images: string[];
    answer: string;
    category: string;
    difficulty: 'easy' | 'medium' | 'hard';
  }) => Promise<void>;
}

export default function AddGameForm({ onSubmit }: AddGameFormProps) {
  const [images, setImages] = useState<string[]>(['', '', '', '']);
  const [answer, setAnswer] = useState('');
  const [category, setCategory] = useState('');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleImageChange = (index: number, value: string) => {
    const newImages = [...images];
    newImages[index] = value;
    setImages(newImages);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    // Validation
    if (images.some((img) => !img.trim())) {
      setMessage('Bitte alle 4 Bild-URLs eingeben');
      setLoading(false);
      return;
    }

    if (!answer.trim()) {
      setMessage('Bitte Antwort eingeben');
      setLoading(false);
      return;
    }

    if (!category.trim()) {
      setMessage('Bitte Kategorie eingeben');
      setLoading(false);
      return;
    }

    try {
      await onSubmit({
        images: images.map((img) => img.trim()),
        answer: answer.trim(),
        category: category.trim(),
        difficulty,
      });

      setMessage('✓ Rätsel erfolgreich hinzugefügt!');
      setImages(['', '', '', '']);
      setAnswer('');
      setCategory('');
      setDifficulty('easy');
    } catch (error) {
      setMessage('✗ Fehler beim Hinzufügen des Rätsels');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 bg-white rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold text-primary mb-6 text-center">
        ➕ Neues Rätsel hinzufügen
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Image URLs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {images.map((img, index) => (
            <div key={index}>
              <label className="block text-sm font-bold text-black mb-2">
                Bild {index + 1} URL
              </label>
              <input
                type="url"
                value={img}
                onChange={(e) => handleImageChange(index, e.target.value)}
                placeholder={`https://example.com/image${index + 1}.jpg`}
                className="w-full px-4 py-2 border-2 border-primary rounded-lg text-black placeholder-gray-500 focus:outline-none focus:border-primary-dark"
              />
              {img && (
                <div className="mt-2 relative w-full aspect-square rounded-lg overflow-hidden bg-gray-100 border border-primary">
                  <img
                    src={img}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const img = e.currentTarget as HTMLImageElement;
                      img.style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Answer and Category */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-black mb-2">
              Antwort (das Wort)
            </label>
            <input
              type="text"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="z.B. hund"
              className="w-full px-4 py-2 border-2 border-primary rounded-lg text-black placeholder-gray-500 focus:outline-none focus:border-primary-dark"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-black mb-2">
              Kategorie
            </label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="z.B. Tiere"
              className="w-full px-4 py-2 border-2 border-primary rounded-lg text-black placeholder-gray-500 focus:outline-none focus:border-primary-dark"
            />
          </div>
        </div>

        {/* Difficulty */}
        <div>
          <label className="block text-sm font-bold text-black mb-2">
            Schwierigkeit
          </label>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value as 'easy' | 'medium' | 'hard')}
            className="w-full px-4 py-2 border-2 border-primary rounded-lg text-black focus:outline-none focus:border-primary-dark"
          >
            <option value="easy">Einfach</option>
            <option value="medium">Mittel</option>
            <option value="hard">Schwer</option>
          </select>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full px-6 py-3 bg-primary hover:bg-primary-dark text-white font-bold rounded-lg transition disabled:bg-gray-400 cursor-pointer text-lg"
        >
          {loading ? 'Wird hinzugefügt...' : 'Rätsel hinzufügen'}
        </button>

        {message && (
          <div
            className={`p-3 rounded text-center font-bold ${
              message.startsWith('✓')
                ? 'bg-green-200 text-green-800'
                : 'bg-red-200 text-red-800'
            }`}
          >
            {message}
          </div>
        )}
      </form>
    </div>
  );
}
