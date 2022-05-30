import { useRef, useEffect, useState } from 'react';

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
