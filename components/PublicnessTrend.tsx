import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { PublicnessTimelinePoint } from '../types';

interface Props {
  timeline?: PublicnessTimelinePoint[];
}

const natureToScore = (nature: 'Open' | 'Controlled' | 'Contested') => {
  if (nature === 'Open') return 3;
  if (nature === 'Controlled') return 2;
  return 1;
};

const scoreToLabel = (score: number) => {
  if (score === 3) return 'Open';
  if (score === 2) return 'Controlled';
  return 'Contested';
};

const PublicnessTrend: React.FC<Props> = ({ timeline }) => {
  if (!timeline || timeline.length === 0) {
    return null;
  }

  const chartData = timeline.map(point => ({
    year: point.year,
    score: natureToScore(point.dominantNature),
    label: point.dominantNature,
    summary: point.summary
  }));

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-12">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-slate-800">Publicness Over Time (5 years)</h3>
        <span className="text-xs text-slate-500">Higher = more open</span>
      </div>
      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" />
          <YAxis domain={[0, 3]} ticks={[1, 2, 3]} tickFormatter={scoreToLabel} />
          <Tooltip formatter={(value: number, _name, props) => [scoreToLabel(value), props.payload.summary]} />
          <ReferenceLine y={2} stroke="#cbd5e1" strokeDasharray="4 4" />
          <Line type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
        </LineChart>
      </ResponsiveContainer>
      <ul className="mt-4 space-y-3 text-sm text-slate-700">
        {chartData.map((point, idx) => (
          <li key={idx} className="flex items-start gap-3">
            <span className="text-xs font-semibold text-slate-500 w-12">{point.year}</span>
            <span className="text-xs font-bold text-indigo-600 px-2 py-0.5 rounded-full bg-indigo-50 border border-indigo-100">{point.label}</span>
            <span className="flex-1">{point.summary}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PublicnessTrend;
