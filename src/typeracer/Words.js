import Word from './Word';

const PUNCTUATION_PERCENTAGE = 0.5;
const NUMBERS_PERCENTAGE = 0.3;

export default function Words({ wordsArr, typedArr, currentWordIdx }) {
  return wordsArr.map((word, i) => {
    return (
      <Word
        word={word}
        typedWord={typedArr[i] || ''}
        isCurrentWord={currentWordIdx === i}
        isSkipped={i < currentWordIdx && typedArr[i].length < word.length}
        key={i}
      />
    );
  });
}

//fetches words from my words api

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

//add punctuation the random words based on the PUNCTUATION_PERCENTAGE variable
//punctuation can be capitalising the first letter or adding a random punctuation charachter

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

//replaces some of the words with a random digit number between 1, 4

function addNumbers(wordsArr) {
  for (let i = 0; i < wordsArr.length; i++) {
    if (Math.random() > 1 - NUMBERS_PERCENTAGE) {
      wordsArr[i] = randomNumber(1, 4);
    }
  }
}

//creates a random digit number between two numbers

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
