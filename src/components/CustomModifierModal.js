import { useState } from 'react';

export default function Modal({
  activeMode,
  setIsModalOpen,
  setOptions,
  customModifier,
  setCustomModifier,
}) {
  return (
    <div className='modal' onClick={() => setIsModalOpen(false)}>
      <div className='modal__content' onClick={e => e.stopPropagation()}>
        <h3 className='modal__title'>
          {activeMode === 'time' ? 'Time Duration' : 'Word Amount'}
        </h3>
        <input
          className='modal__input'
          type='number'
          min={1}
          value={customModifier}
          onChange={e => setCustomModifier(+e.target.value)}
        />
        <button
          className='modal__button'
          onClick={() => {
            setIsModalOpen(false);
            setOptions(prevOptions => ({
              ...prevOptions,
              activeModeModifier: customModifier,
            }));
          }}
        >
          ok
        </button>
      </div>
    </div>
  );
}
