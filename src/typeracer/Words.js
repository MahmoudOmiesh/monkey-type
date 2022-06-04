import { useEffect, useState } from 'react';
import Word from './Word';
const PUNCTUATION_PERCENTAGE = 0.5;
const NUMBERS_PERCENTAGE = 0.3;

export default function Words({ wordsArr, typedArr, currentWordIdx }) {
  return (
    <div className='words'>
      <div className='words__content'>
        {wordsArr.map((word, i) => {
          return (
            <Word
              word={word}
              typedWord={typedArr[i] || ''}
              isCurrentWord={currentWordIdx === i}
              isSkipped={i < currentWordIdx && typedArr[i].length < word.length}
              key={i}
            />
          );
        })}
      </div>
    </div>
  );
}

export async function generateWords(options) {
  let apiLink = 'https://english-words-api.herokuapp.com/words/';
  if (options.activeMode === 'words') {
    apiLink += options.activeModeModifier;
  } else {
    apiLink += 50;
  }
  const res = await fetch(apiLink);
  const words = await res.json();
  if (options.punctuation) addPunctuation(words);
  if (options.numbers) addNumbers(words);

  return words;
}

function addPunctuation(wordsArr) {
  const punctuation = ['-', ',', '.', '?', '!', ':', "'", ';'];
  for (let i = 0; i < wordsArr.length; i++) {
    if (Math.random() > 1 - PUNCTUATION_PERCENTAGE) {
      if (Math.random() > 0.5) {
        wordsArr[i] =
          wordsArr[i] +
          punctuation[Math.floor(Math.random() * punctuation.length)];
      } else {
        wordsArr[i] = wordsArr[i][0].toUpperCase() + wordsArr[i].slice(1);
      }
    }
  }
}

function addNumbers(wordsArr) {
  for (let i = 0; i < wordsArr.length; i++) {
    if (Math.random() > 1 - PUNCTUATION_PERCENTAGE) {
      wordsArr[i] = randomNumber(1, 4);
    }
  }
}

function randomNumber(minDigits, maxDigits) {
  const randomNumOfDigits = Math.floor(
    Math.random() * (maxDigits - minDigits + 1) + minDigits
  );
  const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  let randomNumber = '';
  for (let i = 0; i < randomNumOfDigits; i++) {
    randomNumber += numbers[Math.floor(Math.random() * numbers.length)];
  }
  return randomNumber;
}
