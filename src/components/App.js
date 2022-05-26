import { useState } from 'react';
import Options from './Options';

export default function App() {
  const [options, setOptions] = useState({
    punctuation: false,
    numbers: false,
    activeMode: 'time',
    activeModeModifier: 30,
  });

  return (
    <div className='container'>
      <Options options={options} setOptions={setOptions} />
    </div>
  );
}
