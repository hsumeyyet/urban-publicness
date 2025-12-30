
import React from 'react';
import { PlatformRepresentation } from '../types';

interface Props {
  data: PlatformRepresentation;
}

const PlatformCard: React.FC<Props> = ({ data }) => {
  const getIcon = (platform: string) => {
    switch (platform) {
      case 'Google Maps': return 'fa-location-dot text-red-500';
      case 'Airbnb': return 'fa-house-user text-rose-500';
      case 'Event Listings': return 'fa-calendar-days text-indigo-500';
      case 'Social Media': return 'fa-hashtag text-blue-500';
      default: return 'fa-globe text-gray-500';
    }
  };

  const getStatusColor = (nature: string) => {
    switch (nature) {
      case 'Open': return 'bg-green-100 text-green-700 border-green-200';
      case 'Controlled': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Contested': return 'bg-purple-100 text-purple-700 border-purple-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
      <div className="p-5 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <i className={`fa-solid ${getIcon(data.platform)} text-xl`}></i>
          <h3 className="font-bold text-slate-800 tracking-tight">{data.platform}</h3>
        </div>
        <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${getStatusColor(data.publicNature)}`}>
          {data.publicNature}
        </span>
      </div>
      <div className="p-5 space-y-4">
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Tone</span>
          <p className="text-sm italic text-slate-600">"{data.tone}"</p>
        </div>
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Narrative Summary</span>
          <p className="text-sm text-slate-700 leading-relaxed">{data.narrativeSummary}</p>
        </div>
        <div className="flex flex-wrap gap-1.5 pt-2">
          {data.keyKeywords.map((kw, i) => (
            <span key={i} className="text-[11px] bg-slate-50 text-slate-500 px-2 py-0.5 rounded border border-slate-100">
              #{kw}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlatformCard;
