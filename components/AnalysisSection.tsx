
import React from 'react';

interface Props {
  title: string;
  items: string[];
  icon: string;
  colorClass: string;
}

const AnalysisSection: React.FC<Props> = ({ title, items, icon, colorClass }) => {
  return (
    <div className={`bg-white rounded-xl border-l-4 ${colorClass} shadow-sm p-6`}>
      <div className="flex items-center gap-3 mb-4">
        <i className={`fa-solid ${icon} text-lg`}></i>
        <h3 className="font-bold text-slate-800">{title}</h3>
      </div>
      <ul className="space-y-3">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-3 text-sm text-slate-600 leading-relaxed">
            <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-slate-300 flex-shrink-0" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AnalysisSection;
