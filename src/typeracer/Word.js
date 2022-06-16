import React from 'react';
import Letter from './Letter';

export default function Word({ word, typedWord, isCurrentWord, isSkipped }) {
  return (
    <div className={`words__word ${isSkipped ? 'skipped' : ''}`}>
      {word.split('').map((letter, i) => {
        return (
          <Letter
            letter={letter}
            typedLetter={typedWord[i] || ''}
            caretClass={getCaretClass(
              isCurrentWord,
              i,
              typedWord.length,
              i === word.length - 1
            )}
            key={i}
          />
        );
      })}
      {typedWord.length > word.length &&
        typedWord.split('').map((typedLetter, i) => {
          return (
            i > word.length - 1 && (
              <Letter
                typedLetter={typedLetter}
                isExtra={true}
                caretClass={getCaretClass(
                  isCurrentWord,
                  i,
                  typedWord.length,
                  i === typedWord.length - 1
                )}
                key={i}
              />
            )
          );
        })}
    </div>
  );
}

//add the caret to the left is if we are in the middle or beginning of a word
//add the caret to the right if we are in the end of the word

function getCaretClass(isCurrentWord, i, length, isEnd) {
  if (isCurrentWord && i === length) return 'caret left';
  if (isCurrentWord && i === length - 1 && isEnd) return 'caret right';
  return '';
}
