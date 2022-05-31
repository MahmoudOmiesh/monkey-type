import { useState, useEffect } from 'react';
import Options from './Options';
import Words, { generateWords } from './Words';

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
      setWordsDetails(words);
    });
  }, [options]);

  return (
    <div className='container'>
      <Options options={options} setOptions={setOptions} />
      <Words wordsDetails={wordsDetails} />
    </div>
  );
}
