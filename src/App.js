import { useState, useEffect, useRef } from 'react';
import Options from './header/Options';
import Words, { generateWords } from './typeracer/Words';
import Stats from './stats/Stats';

let typedFirstLetter; // used for detecting the first letter being typed
let timeInterval; // used for clearing the time interval so we dont get memory leaks
let handleKeyPressRefrence; //used for removing the event listener in gameEnd function
let letterHeight; //used for moving the rows when typing

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
  const [timer, setTimer] = useState(0);
  const [didGameEnd, setDidGameEnd] = useState(false);
  const [stats, setStats] = useState({});
  const [graphData, setGraphData] = useState([]);
  const stateRef = useRef({});
  const wordsDivRef = useRef({});
  const isLastRow = useRef(false);

  //add an event listener for the keyboard once the component loads

  useEffect(startGame, []);

  //this ref is used to get the most recent version of state to avoid some bugs in the handleKey press function

  useEffect(() => {
    stateRef.current = { words, typed, currentWordIdx };
  }, [words, typed, currentWordIdx]);

  //the game is reset if options are changed

  useEffect(resetGame, [options]);

  //get the letter height and sets the words div to show 3 times that height to show 3 rows at a time

  useEffect(() => {
    if (words.length !== 0) {
      const wordsDiv = wordsDivRef.current;
      const letter = wordsDiv.querySelector('.words__letter');
      letterHeight = letter.offsetHeight;
      wordsDiv.style.height = `${3 * letterHeight}px`;
    }
  }, [words]);

  // there is only 3 rows of words displayed at a time
  // if we are in the last row we set the ref to true

  useEffect(() => {
    const wordsDiv = wordsDivRef.current;
    const activeLetter =
      wordsDiv.querySelector('.words__content').children[currentWordIdx]
        ?.children[0];
    const wordsDivTop = wordsDiv.getBoundingClientRect().top;
    const activeLetterTop = activeLetter?.getBoundingClientRect().top;
    if (activeLetterTop - wordsDivTop === 2 * letterHeight) {
      isLastRow.current = true;
    }
  }, [currentWordIdx]);

  //we get the previous margin of the div and add it to the height of the letter
  //if we are in time mode and we typed more than 70% of the words list we add new words

  useEffect(() => {
    if (isLastRow.current === true) {
      const wordsDiv = wordsDivRef.current;
      const wordsContentDiv = wordsDiv.querySelector('.words__content');
      const prevMargin = +window
        .getComputedStyle(wordsContentDiv)
        .marginTop.replace(/[a-z]/gi, '');
      wordsContentDiv.style.marginTop = `${prevMargin - letterHeight}px`;

      if (options.activeMode === 'time' && typed.length > 0.7 * words.length) {
        generateWords(options).then(newWords =>
          setWords(prevWords => [...prevWords, ...newWords])
        );
      }

      isLastRow.current = false;
    }
  }, [isLastRow.current]);

  //detects when we type the first letter and starts a timer

  useEffect(() => {
    if (typedFirstLetter) return;
    const firstLetter = typed[0] ? typed[0][0] : null;
    if (firstLetter != null) {
      typedFirstLetter = true;
      document.body.classList.add('game-active');
      startTimer();
    }
  }, [typed]);

  //ends the game in the words mode when the last letter is typed

  useEffect(() => {
    const { activeMode, activeModeModifier } = options;
    if (activeMode !== 'words' || !typed[activeModeModifier - 1]) return;
    if (
      typed[activeModeModifier - 1].length ===
      words[activeModeModifier - 1].length
    ) {
      endGame();
    }
  }, [typed]);

  //ends the game in the time mode when the timer is up

  useEffect(() => {
    if (options.activeMode === 'time' && timer === options.activeModeModifier) {
      console.log('time end');
      endGame();
    }
  }, [timer]);

  //used for getting the data for the graph

  useEffect(() => {
    const characters = getCharacters();
    const [correct, incorrect] = characters;
    const time = timer;
    //prettier-ignore
    const raw = Math.round(((correct + incorrect) / 5) / (time / 60)) || 0;
    //prettier-ignore
    const wpm = Math.round((correct / 5) / (time / 60)) || 0;
    setGraphData(prevGraphData => [...prevGraphData, { time, wpm, raw }]);
  }, [timer]);

  //handles the logic of the letters, numbers, backspace, spacebar, and ignores all other charachters

  function handleKeyPress({ key }) {
    console.log('press');
    //gets most recent state from the ref
    const { currentWordIdx, words, typed } = stateRef.current;
    // increments word idx only when you typed at least a letter in the word and you didnt exceed the number of words
    if (key === ' ') {
      setCurrentWordIdx(prevWordIdx => {
        return typed[prevWordIdx] && prevWordIdx < words.length - 1
          ? prevWordIdx + 1
          : prevWordIdx;
      });
    } else if (key === 'Backspace') {
      // decremnets currentWordIdx if the current word is empty and you aren't on the first word otherwise it removes a letter from the current word
      (typed[currentWordIdx]?.length === 0 || !typed[currentWordIdx]) &&
      currentWordIdx > 0
        ? setCurrentWordIdx(prevWordIdx => {
            return prevWordIdx - 1;
          })
        : setTyped(prevTyped => {
            if (prevTyped[currentWordIdx]) {
              prevTyped[currentWordIdx] = prevTyped[currentWordIdx].slice(
                0,
                prevTyped[currentWordIdx].length - 1
              );
            }
            return [...prevTyped];
          });
    } else if (
      //adds letter or number to the current word
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

  function newTest({ currentTarget }) {
    currentTarget.blur();
    startGame();
    resetGame();
  }

  function startTimer() {
    timeInterval = setInterval(
      () => setTimer(prevTimer => prevTimer + 1),
      1000
    );
  }

  function clearTimer() {
    clearInterval(timeInterval);
  }

  function getStats() {
    const characters = getCharacters();
    const [correct, incorrect] = characters;
    const testType = `${options.activeMode} ${options.activeModeModifier}`;
    const time = timer;
    //prettier-ignore
    const raw = ((correct + incorrect) / 5) / (time / 60);
    //prettier-ignore
    const wpm = (correct / 5) / (time / 60);
    const acc = (correct / (correct + incorrect)) * 100;
    return { characters, testType, time, raw, wpm, acc };
  }

  function getCharacters() {
    let correct = 0,
      incorrect = 0,
      extra = 0,
      missed = 0;
    words.forEach((word, i) => {
      if (typed[i] && typed[i].length > word.length)
        extra += typed[i].length - word.length;
      word.split('').forEach((letter, j) => {
        if (typed[i] && typed[i][j]) {
          if (typed[i][j] === letter) correct++;
          else if (typed[i][j] == undefined) missed++;
          else if (typed[i][j] !== letter) incorrect++;
        }
      });
    });
    return [correct, incorrect, extra, missed];
  }

  function startGame() {
    if (!handleKeyPressRefrence) {
      console.log('start');
      handleKeyPressRefrence = handleKeyPress;
      document.body.addEventListener('keydown', handleKeyPressRefrence);
    }
  }

  //resets all state and generated new words

  function resetGame() {
    console.log('reset');
    generateWords(options).then(words => setWords(words));
    setTyped([]);
    setCurrentWordIdx(0);
    setTimer(0);
    setDidGameEnd(false);
    setStats({});
    setGraphData([]);
    clearTimer();
    typedFirstLetter = false;
    document.body.classList.remove('game-active');
  }

  //get the stats and sets the mode to game end

  function endGame() {
    document.body.removeEventListener('keydown', handleKeyPressRefrence);
    handleKeyPressRefrence = null;
    clearTimer();
    setDidGameEnd(true);
    setStats(getStats());
  }

  return (
    words.length >= 0 && (
      <div className='container'>
        <Options options={options} setOptions={setOptions} />
        {didGameEnd ? (
          <Stats stats={stats} graphData={graphData} newTest={newTest} />
        ) : (
          <main className='main'>
            <p className='typed-words'>{`${currentWordIdx}/${words.length}`}</p>
            <div className='words' ref={wordsDivRef}>
              <div className='words__content'>
                <Words
                  wordsArr={words}
                  typedArr={typed}
                  currentWordIdx={currentWordIdx}
                />
              </div>
            </div>
            <button className='btn-primary' onClick={newTest}>
              new test
            </button>
          </main>
        )}
        <footer>
          copyright&copy; 2022{' '}
          <a href='https://github.com/MahmoudOmiesh' target='_blanc'>
            GitHub
          </a>
        </footer>
      </div>
    )
  );
}
