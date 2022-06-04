import { useState } from 'react';
import Modal from './CustomModifierModal';

export default function Options({
  options: { punctuation, numbers, activeMode, activeModeModifier },
  setOptions,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [customModifier, setCustomModifier] = useState(1);
  const avaialableModifiers = {
    time: [15, 30, 60, 120, 'custom'],
    words: [10, 25, 50, 100, 'custom'],
  };

  return (
    <>
      {isModalOpen && (
        <Modal
          customModifier={customModifier}
          setCustomModifier={setCustomModifier}
          activeMode={activeMode}
          setIsModalOpen={setIsModalOpen}
          setOptions={setOptions}
        />
      )}
      <div className='options'>
        <div className='options__content'>
          <div className='options__row'>
            <p
              className={getClass(punctuation, true)}
              onClick={() =>
                setOptions(prevOptions => ({
                  ...prevOptions,
                  punctuation: !prevOptions.punctuation,
                }))
              }
            >
              punctuation
            </p>
            <p
              className={getClass(numbers, true)}
              onClick={() =>
                setOptions(prevOptions => ({
                  ...prevOptions,
                  numbers: !prevOptions.numbers,
                }))
              }
            >
              numbers
            </p>
          </div>
          <div className='options__row'>
            <p
              className={getClass(activeMode, 'time')}
              onClick={() =>
                setOptions(prevOptions => ({
                  ...prevOptions,
                  activeMode: 'time',
                }))
              }
            >
              time
            </p>
            <p
              className={getClass(activeMode, 'words')}
              onClick={() =>
                setOptions(prevOptions => ({
                  ...prevOptions,
                  activeMode: 'words',
                }))
              }
            >
              words
            </p>
          </div>
          <div className='options__row'>
            {avaialableModifiers[activeMode].map((modifier, i) => {
              if (modifier !== 'custom') {
                return (
                  <p
                    className={getClass(modifier, activeModeModifier)}
                    key={i}
                    onClick={() =>
                      setOptions(prevOptions => ({
                        ...prevOptions,
                        activeModeModifier: modifier,
                      }))
                    }
                  >
                    {modifier}
                  </p>
                );
              } else {
                return (
                  <p
                    className={
                      isModidfierCustom(
                        activeModeModifier,
                        avaialableModifiers[activeMode]
                      )
                        ? 'options__option active'
                        : 'options__option'
                    }
                    key={i}
                    onClick={() => setIsModalOpen(true)}
                  >
                    <i className='fa-solid fa-screwdriver-wrench'></i>
                  </p>
                );
              }
            })}
          </div>
        </div>
      </div>
    </>
  );
}

function getClass(check, value) {
  return check === value ? 'options__option active' : 'options__option';
}

function isModidfierCustom(modifier, defaultModifiers) {
  return !defaultModifiers.includes(modifier) ? true : false;
}
