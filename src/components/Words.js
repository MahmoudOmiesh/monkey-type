import { useRef, useEffect, useState } from 'react';
const punctuationPercentage = 0.3;
const numberPercentage = 0.3;

export default function Words({ wordsDetails }) {
  const wordsDivRef = useRef();
  const firstLetterRef = useRef();
  const [letterHeight, setLetterHeight] = useState(0);

  useEffect(() => {
    if (firstLetterRef.current) {
      setLetterHeight(firstLetterRef.current.offsetHeight);
      wordsDivRef.current.style.height = `${
        firstLetterRef.current.offsetHeight * 3
      }px`;
    }
  }, [firstLetterRef.current]);

  return (
    <div className='words' ref={wordsDivRef}>
      <div className='words__content'>
        {wordsDetails.map((wordDetails, i) => {
          return (
            <div className='words__word' key={i}>
              {wordDetails.map((letterDetails, j) => {
                return (
                  <div
                    className={`words__letter ${letterDetails.status}`}
                    key={j}
                    ref={i === 0 && j === 0 ? firstLetterRef : null}
                  >
                    {letterDetails.letter}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export async function generateWords(options) {
  let wordEnpoint = 'https://random-word-api.herokuapp.com/word?number=';
  if (options.activeMode === 'words') {
    wordEnpoint += `${options.activeModeModifier}`;
  } else {
    wordEnpoint += '50';
  }
  const res = await fetch(wordEnpoint);
  let words = await res.json();
  if (options.punctuation) addPunctuation(words);
  if (options.numbers) addNumbers(words);
  return generateWordsDetails(words);
}

function generateWordsDetails(words) {
  const wordsDetails = [];
  words.forEach(word => {
    const wordDetails = [];
    word.split('').forEach(letter => {
      wordDetails.push({ letter, status: 'untyped' });
    });
    wordsDetails.push(wordDetails);
  });
  return wordsDetails;
}

function addPunctuation(wordsArr) {
  const punctuation = [',', '.', '-', '?', '!', "'", ':', ';'];
  for (let i = 0; i < wordsArr.length; i++) {
    if (Math.random() > 1 - punctuationPercentage) {
      Math.random() > 0.5
        ? (wordsArr[i] = wordsArr[i][0].toUpperCase() + wordsArr[i].slice(1))
        : (wordsArr[i] =
            wordsArr[i] +
            punctuation[Math.floor(Math.random() * punctuation.length)]);
    }
  }
  return wordsArr;
}

function addNumbers(wordsArr) {
  for (let i = 0; i < wordsArr.length; i++) {
    if (Math.random() > 1 - numberPercentage) {
      wordsArr[i] = randomNumber();
    }
  }
  return wordsArr;
}

function randomNumber(minNumOfDigits = 1, maxNumOfDigits = 4) {
  const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  const randomNumOfDigits = Math.floor(
    Math.random() * (maxNumOfDigits - minNumOfDigits + 1) + minNumOfDigits
  );
  let randomNum = '';
  for (let i = 0; i < randomNumOfDigits; i++) {
    randomNum += numbers[Math.floor(Math.random() * numbers.length)];
  }
  return randomNum;
}
