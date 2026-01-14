import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface Props {
  data: Array<{
    platform: string;
    publicNature: string;
  }>;
}

const PublicnessChart: React.FC<Props> = ({ data }) => {
  const chartData = data.map(item => ({
    platform: item.platform,
    score: item.publicNature === 'Open' ? 3 : item.publicNature === 'Controlled' ? 2 : 1,
    nature: item.publicNature
  }));

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
      <h3 className="text-lg font-bold text-slate-800 mb-4">Digital Publicness Scores</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="platform" />
          <YAxis domain={[0, 3]} ticks={[1, 2, 3]} tickFormatter={(value) => value === 1 ? 'Contested' : value === 2 ? 'Controlled' : 'Open'} />
          <Tooltip formatter={(value: number) => [value === 1 ? 'Contested' : value === 2 ? 'Controlled' : 'Open', 'Publicness']} />
          <Bar dataKey="score" fill="#6366f1" />
        </BarChart>
      </ResponsiveContainer>
      <p className="text-sm text-slate-500 mt-2">Higher scores indicate more open digital publicness.</p>
    </div>
  );
};

export default PublicnessChart;