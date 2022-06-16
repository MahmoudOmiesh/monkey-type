import React from 'react';
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export default function Stats({ stats, graphData, newTest }) {
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className='tooltip'>
          <p className='tooltip__label'>{label}</p>
          <p className='tooltip__data'>wpm: {payload[0].payload.wpm}</p>
          <p className='tooltip__data'>raw: {payload[0].payload.raw}</p>
        </div>
      );
    }

    return null;
  };

  return (
    <div className='stats'>
      <div className='stats__content'>
        {Object.entries(stats).map(([statName, statValue]) => {
          return (
            <div
              className='stats__stat'
              key={statName}
              style={{ gridArea: statName }}
            >
              <p className='stats__name'>{formatName(statName)}</p>
              <p className='stats__value'>{formatValue(statName, statValue)}</p>
            </div>
          );
        })}
        <ResponsiveContainer width='100%' height='100%'>
          <LineChart data={graphData}>
            <Line
              type='monotone'
              dataKey='wpm'
              stroke='#f44c7f'
              strokeWidth={2}
            />
            <Line
              type='monotone'
              dataKey='raw'
              stroke='#939eae'
              strokeWidth={2}
            />
            <CartesianGrid stroke='#0003' />
            <XAxis dataKey='time' stroke='#0003' tick={{ fill: '#8c97a7' }} />
            <YAxis tick={{ fill: '#8c97a7' }} stroke='#0003' />
            <Tooltip content={<CustomTooltip />} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <button onClick={newTest} className='btn-primary'>
        Next Test
      </button>
    </div>
  );
}

function formatName(name) {
  const formatted = name.replace(/([A-Z])/g, ' $1').toLowerCase();
  return formatted;
}

function formatValue(name, value) {
  if (Array.isArray(value)) return value.join('/');
  else if (typeof value === 'number') {
    let formattedNumber = `${Math.round(value)}`;
    switch (name) {
      case 'time':
        formattedNumber += 's';
        break;
      case 'acc':
        formattedNumber += '%';
        break;
    }
    return formattedNumber;
  } else return value;
}
