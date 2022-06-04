import { useState, useEffect, useRef } from 'react';
import Options from './header/Options';
import Words, { generateWords } from './typeracer/Words';

export default function App() {
  const [options, setOptions] = useState({
    punctuation: false,
    numbers: false,
    activeMode: 'words',
    activeModeModifier: 10,
  });
  const [words, setWords] = useState([]);
  const [typed, setTyped] = useState([]);
  const [currentWordIdx, setCurrentWordIdx] = useState(0);
  const stateRef = useRef({});

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
  }, []);

  useEffect(() => {
    stateRef.current = { words, typed, currentWordIdx };
  }, [words, typed, currentWordIdx]);

  useEffect(() => {
    generateWords(options).then(words => setWords(words));
    setCurrentWordIdx(0);
    setTyped([]);
  }, [options]);

  //testing
  // useEffect(() => console.log(stateRef.current), [stateRef.current]);

  function handleKeyPress({ key }) {
    const { currentWordIdx, words, typed } = stateRef.current;
    if (key === ' ') {
      setCurrentWordIdx(prevWordIdx => {
        return typed[prevWordIdx] && prevWordIdx < words.length - 1
          ? prevWordIdx + 1
          : prevWordIdx;
      });
    } else if (key === 'Backspace') {
      setTyped(prevTyped => {
        if (prevTyped[currentWordIdx]) {
          prevTyped[currentWordIdx] = prevTyped[currentWordIdx].slice(
            0,
            prevTyped[currentWordIdx].length - 1
          );
        }
        return [...prevTyped];
      });
      setCurrentWordIdx(prevWordIdx => {
        if (
          (typed[prevWordIdx]?.length === 0 || !typed[prevWordIdx]) &&
          prevWordIdx > 0
        ) {
          return prevWordIdx - 1;
        } else {
          return prevWordIdx;
        }
      });
    } else if (
      (key.match(/[a-z0-9]/gi) && key.length === 1) ||
      key.match(/[-,.?!:';]/g)
    ) {
      setTyped(prevTyped => {
        if (prevTyped[currentWordIdx]) {
          prevTyped[currentWordIdx] = prevTyped[currentWordIdx] + key;
        } else {
          prevTyped[currentWordIdx] = key;
        }
        return [...prevTyped];
      });
    }
  }

  return (
    words.length >= 0 && (
      <div className='container'>
        <Options options={options} setOptions={setOptions} />
        <Words
          wordsArr={words}
          typedArr={typed}
          currentWordIdx={currentWordIdx}
        />
      </div>
    )
  );
}
