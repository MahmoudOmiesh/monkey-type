import { useState, useEffect } from 'react';
import Options from './Options';
import Words from './Words';

export default function App() {
  const [wordsDetails, setWordsDetails] = useState([]);
  const [options, setOptions] = useState({
    punctuation: false,
    numbers: false,
    activeMode: 'time',
    activeModeModifier: 30,
  });

  useEffect(() => {
    generateWords(options).then(words => {
      const wordsDetails = [];
      words.forEach(word => {
        const wordDetails = [];
        word.split('').forEach(letter => {
          wordDetails.push({ letter, status: 'untyped' });
        });
        wordsDetails.push(wordDetails);
      });
      setWordsDetails(wordsDetails);
    });
  }, [options]);

  return (
    <div className='container'>
      <Options options={options} setOptions={setOptions} />
      <Words wordsDetails={wordsDetails} />
    </div>
  );
}

async function generateWords(options) {
  let wordEnpoint = 'https://random-word-api.herokuapp.com/word?number=';
  if (options.activeMode === 'words') {
    wordEnpoint += `${options.activeModeModifier}`;
  } else {
    wordEnpoint += '50';
  }

  const res = await fetch(wordEnpoint);
  const words = await res.json();
  return words;
}
