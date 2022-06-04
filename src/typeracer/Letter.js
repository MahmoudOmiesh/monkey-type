import React from 'react';

export default function Letter({ letter, typedLetter, caretClass, isExtra }) {
  function getLetterClass() {
    if (typedLetter === '') return 'untyped';
    if (typedLetter === letter) return 'correct';
    if (isExtra) return 'extra';
    if (typedLetter !== letter) return 'false';
  }

  return (
    <div className={`words__letter ${getLetterClass()} ${caretClass}`}>
      {isExtra ? typedLetter : letter}
    </div>
  );
}
