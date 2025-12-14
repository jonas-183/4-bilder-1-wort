import React, { useState } from 'react';
import Image from 'next/image';

interface GameImageGridProps {
  images: string[];
  answer: string;
  onAnswerSubmit: (isCorrect: boolean) => void; // reports whether the submitted answer was correct
  disabled?: boolean;
  attemptsLeft?: number;
}

export default function GameImageGrid({
  images,
  answer,
  onAnswerSubmit,
  disabled = false,
  attemptsLeft = 3,
}: GameImageGridProps) {
  const [inputValue, setInputValue] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const userAnswer = inputValue.toLowerCase().trim();

    if (userAnswer === answer.toLowerCase()) {
      setMessage('✓ Richtig!');
      setInputValue('');
      onAnswerSubmit(true);
      setTimeout(() => setMessage(''), 1500);
    } else {
      setMessage('✗ Falsch, versuchen Sie es nochmal!');
      onAnswerSubmit(false);
      setTimeout(() => setMessage(''), 1500);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      {/* Image Grid */}
      <div className="grid grid-cols-2 gap-4 mb-8 bg-white p-6 rounded-lg shadow-lg border-4 border-primary">
        {images.map((img, index) => (
          <div
            key={index}
            className="relative w-full aspect-square rounded-lg overflow-hidden bg-gray-200"
          >
            <Image
              src={img}
              alt={`Bild ${index + 1}`}
              fill
              className="object-cover"
              onError={(e) => {
                const img = e.currentTarget as HTMLImageElement;
                img.src = `https://via.placeholder.com/300?text=Bild+${index + 1}`;
              }}
            />
          </div>
        ))}
      </div>

      {/* Input Area */}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg">
        <label className="block text-2xl font-bold text-black mb-4 text-center">
          Wie lautet das Wort?
        </label>
        <div className="flex flex-col gap-3">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Antwort eingeben..."
            disabled={disabled}
            className="px-4 py-3 border-2 border-primary rounded-lg text-black placeholder-gray-500 focus:outline-none focus:border-primary-dark disabled:bg-gray-100"
            autoFocus
          />
          <button
            type="submit"
            disabled={disabled}
            className="px-6 py-3 bg-primary hover:bg-primary-dark text-white font-bold rounded-lg transition disabled:bg-gray-400 cursor-pointer"
          >
            Absenden
          </button>
        </div>
        <div className="mt-3 text-center text-sm text-gray-600">Versuche übrig: {attemptsLeft}</div>
        {message && (
          <div
            className={`mt-3 p-2 rounded text-center font-bold ${
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
