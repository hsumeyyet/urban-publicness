
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { analyzePlaceNarratives } from './services/geminiService';
import { AnalysisResult } from './types';
import PlatformCard from './components/PlatformCard';
import AnalysisSection from './components/AnalysisSection';
import PublicnessChart from './components/PublicnessChart';
import PublicnessTrend from './components/PublicnessTrend';

import LoginGate from './components/LoginGate';

const AppInner: React.FC = () => {
  const [place, setPlace] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const exportMenuRef = useRef<HTMLDivElement>(null);

  const handleSearch = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!place.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const data = await analyzePlaceNarratives(place);
      setResult(data);
    } catch (err) {
      console.error(err);
      setError('Failed to analyze the narratives. Please try again or check your API key.');
    } finally {
      setLoading(false);
    }
  }, [place]);

  const exportAsJson = () => {
    if (!result) return;
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(result, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `${result.placeName.replace(/\s+/g, '_')}_analysis.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    setShowExportMenu(false);
  };

  const exportAsCsv = () => {
    if (!result) return;
    const csvData = [
      ['Platform', 'Narrative Summary', 'Tone', 'Public Nature', 'Key Keywords'],
      ...result.platforms.map(p => [p.platform, p.narrativeSummary, p.tone, p.publicNature, p.keyKeywords.join('; ')]),
      [],
      ['Platform History (5y)'],
      ['Platform', 'Year', 'Public Nature', 'Tone', 'Narrative Summary', 'Key Keywords'],
      ...result.platforms.flatMap(p => (p.history || []).map(h => [p.platform, h.year, h.publicNature, h.tone, h.narrativeSummary, h.keyKeywords.join('; ')])),
      [],
      ['Publicness Timeline (5y)'],
      ['Year', 'Dominant Nature', 'Summary'],
      ...(result.publicnessTimeline || []).map(pt => [pt.year, pt.dominantNature, pt.summary]),
      [],
      ['Overlaps'],
      ...result.overlaps.map(o => [o]),
      [],
      ['Tensions'],
      ...result.tensions.map(t => [t]),
      [],
      ['Foregrounded Publics'],
      ...result.publics.foregrounded.map(f => [f]),
      [],
      ['Marginalized Publics'],
      ...result.publics.marginalized.map(m => [m]),
      [],
      ['Conclusion Type', result.conclusion.type],
      ['Conclusion Assessment', result.conclusion.assessment]
    ];
    const csvContent = csvData.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    const dataStr = "data:text/csv;charset=utf-8," + encodeURIComponent(csvContent);
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `${result.placeName.replace(/\s+/g, '_')}_analysis.csv`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    setShowExportMenu(false);
  };

  // Close menu on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (exportMenuRef.current && !exportMenuRef.current.contains(event.target as Node)) {
        setShowExportMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <header className="bg-slate-900 dark:bg-slate-800 text-white py-12 px-4 shadow-xl mb-10 print:hidden">
        <div className="max-w-6xl mx-auto text-center relative">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="absolute top-4 right-4 p-2 bg-slate-800 dark:bg-slate-700 rounded-full hover:bg-slate-700 dark:hover:bg-slate-600 transition-colors"
            title="Toggle Dark Mode"
          >
            <i className={`fa-solid ${darkMode ? 'fa-sun' : 'fa-moon'} text-lg`}></i>
          </button>
          <div className="inline-block px-3 py-1 bg-indigo-500 text-[10px] font-bold rounded-full mb-4 tracking-widest uppercase">
            Placemaking Research Tool
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">
            Urban Narrative <span className="text-indigo-400">Decoder</span>
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed">
            Deconstruct digital representations of physical space to reveal the tensions between curation, utility, and lived reality.
          </p>
          
          <form onSubmit={handleSearch} className="mt-8 max-w-md mx-auto relative">
            <input
              type="text"
              value={place}
              onChange={(e) => setPlace(e.target.value)}
              placeholder="Enter a neighborhood or venue (e.g. Shoreditch, London)"
              className="w-full bg-slate-800 border border-slate-700 text-white rounded-full py-4 pl-6 pr-14 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-slate-500 shadow-inner"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading}
              className="absolute right-2 top-2 bottom-2 aspect-square flex items-center justify-center bg-indigo-500 hover:bg-indigo-600 rounded-full transition-colors disabled:opacity-50"
            >
              {loading ? (
                <i className="fa-solid fa-circle-notch fa-spin"></i>
              ) : (
                <i className="fa-solid fa-magnifying-glass"></i>
              )}
            </button>
          </form>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl mb-8 flex items-center gap-3 print:hidden">
            <i className="fa-solid fa-circle-exclamation text-xl"></i>
            <p className="font-medium">{error}</p>
          </div>
        )}

        {!result && !loading && (
          <div className="text-center py-20 border-2 border-dashed border-slate-200 rounded-2xl print:hidden">
            <div className="bg-slate-100 h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <i className="fa-solid fa-city text-slate-400 text-3xl"></i>
            </div>
            <h2 className="text-xl font-semibold text-slate-700 mb-2">Ready for analysis</h2>
            <p className="text-slate-500 max-w-sm mx-auto">
              Enter a location name above to generate a comparative report across digital urban platforms.
            </p>
          </div>
        )}

        {loading && (
          <div className="text-center py-20 space-y-6 print:hidden">
            <div className="w-64 h-2 bg-slate-200 rounded-full mx-auto overflow-hidden">
              <div className="h-full bg-indigo-500 rounded-full animate-pulse" style={{width: '60%'}}></div>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-slate-800">Scraping Digital Fragments...</h3>
              <p className="text-sm text-slate-500 italic max-w-md mx-auto">
                "We define our cities as much by our digital traces as by our physical movement."
              </p>
            </div>
          </div>
        )}

        {result && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 print:block">
            {/* Summary Banner */}
            <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200 pb-6">
              <div>
                <h2 className="text-3xl font-bold text-slate-900 mb-2">{result.placeName}</h2>
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-2 text-sm font-medium text-slate-500">
                    <i className="fa-solid fa-fingerprint text-indigo-400"></i>
                    Digital Analysis Result
                  </span>
                  <div className="h-4 w-px bg-slate-200 print:hidden"></div>
                  <span className="flex items-center gap-2 text-sm font-medium text-slate-500 print:hidden">
                    <i className="fa-solid fa-link text-indigo-400"></i>
                    {result.sources.length} Grounded References
                  </span>
                </div>
              </div>
              <div className="flex gap-2 print:hidden">
                <div className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-lg shadow-indigo-200">
                  {result.conclusion.type} Publicness
                </div>
              </div>
            </div>

            {/* Platform Comparison Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {result.platforms.map((platform, idx) => (
                <PlatformCard key={idx} data={platform} />
              ))}
            </div>

            {/* Publicness Visualization */}
            <PublicnessChart data={result.platforms} />

            {/* Temporal Trend */}
            <PublicnessTrend timeline={result.publicnessTimeline} />

            {/* Analysis Deep Dive */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
              <AnalysisSection
                title="Overlaps in Narratives"
                icon="fa-object-group text-blue-500"
                colorClass="border-blue-500"
                items={result.overlaps}
              />
              <AnalysisSection
                title="Contradictions & Tensions"
                icon="fa-bolt text-amber-500"
                colorClass="border-amber-500"
                items={result.tensions}
              />
            </div>

            {/* Publics Analysis */}
            <div className="bg-slate-900 rounded-2xl shadow-xl overflow-hidden mb-12 print:bg-white print:text-slate-900 print:border print:border-slate-200 print:shadow-none">
              <div className="p-8 border-b border-slate-800 print:border-slate-200">
                <h3 className="text-xl font-bold text-white print:text-slate-900 flex items-center gap-3">
                  <i className="fa-solid fa-users text-indigo-400"></i>
                  The Politics of Visibility
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="p-8 border-r border-slate-800 bg-slate-900/50 print:bg-white print:border-slate-200">
                  <h4 className="text-sm font-bold text-indigo-400 uppercase tracking-widest mb-6">Foregrounded Publics</h4>
                  <div className="space-y-4">
                    {result.publics.foregrounded.map((pub, i) => (
                      <div key={i} className="flex items-center gap-3 bg-slate-800/50 p-3 rounded-lg border border-slate-700/50 print:bg-slate-50 print:border-slate-200">
                        <i className="fa-solid fa-eye text-green-400"></i>
                        <span className="text-slate-200 print:text-slate-700 font-medium">{pub}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="p-8 bg-slate-900 print:bg-white">
                  <h4 className="text-sm font-bold text-rose-400 uppercase tracking-widest mb-6">Marginalized Publics</h4>
                  <div className="space-y-4">
                    {result.publics.marginalized.map((pub, i) => (
                      <div key={i} className="flex items-center gap-3 bg-slate-800/50 p-3 rounded-lg border border-slate-700/50 print:bg-slate-50 print:border-slate-200">
                        <i className="fa-solid fa-eye-slash text-rose-400"></i>
                        <span className="text-slate-300 print:text-slate-700 font-medium">{pub}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Final Assessment */}
            <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-10 mb-12 print:bg-white print:border-slate-200 print:p-6">
              <div className="max-w-3xl mx-auto text-center">
                <h3 className="text-2xl font-bold text-slate-900 mb-4">Assessment: {result.conclusion.type} Publicness</h3>
                <p className="text-slate-700 text-lg leading-relaxed mb-8 italic">
                  "{result.conclusion.assessment}"
                </p>
                <div className="flex flex-wrap justify-center gap-4 print:hidden">
                  {result.sources.length > 0 && (
                    <div className="w-full mb-4">
                      <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Research Data Sources</h4>
                      <div className="flex flex-wrap justify-center gap-2">
                        {result.sources.slice(0, 5).map((source, i) => (
                          <a
                            key={i}
                            href={source.uri}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-white border border-slate-200 px-3 py-1.5 rounded-full text-xs text-indigo-600 hover:border-indigo-300 transition-colors flex items-center gap-2"
                          >
                            <i className="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>
                            {source.title.length > 25 ? source.title.substring(0, 25) + '...' : source.title}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Academic References */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 mb-12 print:bg-white print:border-slate-200">
              <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                <i className="fa-solid fa-book text-indigo-500"></i>
                Research Methodology & References
              </h3>
              <div className="space-y-4 text-sm text-slate-700">
                <p>
                  This analysis draws from theories of digital publicness, examining how online platforms shape perceptions of urban spaces. The methodology combines AI-powered content analysis with grounded web search to identify narrative patterns across platforms.
                </p>
                <ul className="list-disc list-inside space-y-2">
                  <li><strong>Public Space Theory:</strong> Habermas, J. (1989). <em>The Structural Transformation of the Public Sphere</em>. MIT Press.</li>
                  <li><strong>Digital Urbanism:</strong> Townsend, A. (2013). <em>Smart Cities: Big Data, Civic Hackers, and the Quest for a New Utopia</em>. W.W. Norton & Company.</li>
                  <li><strong>Platform Studies:</strong> Gillespie, T. (2010). "The politics of 'platforms'." <em>New Media & Society</em>, 12(3), 347-364.</li>
                  <li><strong>AI in Urban Analysis:</strong> Batty, M. (2013). <em>The New Science of Cities</em>. MIT Press.</li>
                </ul>
                <p className="text-xs text-slate-500 mt-4">
                  For your thesis, cite this tool as: "Urban Narrative Decoder (2025). AI-powered analysis of digital publicness in urban spaces."
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer Navigation (Sticky CTA) */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-slate-200 p-4 z-50 print:hidden">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="hidden sm:flex items-center gap-2 text-slate-400 text-xs">
            <i className="fa-solid fa-terminal"></i>
            Urban Logic Engine v1.2
          </div>
          <div className="flex items-center gap-4 mx-auto sm:mx-0">
             <button 
              onClick={() => {
                setResult(null);
                setPlace('');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-6 py-2 text-slate-600 hover:text-slate-900 text-sm font-bold transition-all"
             >
               New Analysis
             </button>
             
             <div className="relative" ref={exportMenuRef}>
               <button 
                disabled={!result}
                onClick={() => setShowExportMenu(!showExportMenu)}
                className={`flex items-center gap-2 px-6 py-2 bg-slate-900 text-white rounded-full text-sm font-bold shadow-lg hover:bg-slate-800 transition-all ${!result ? 'opacity-50 cursor-not-allowed' : ''}`}
               >
                 <i className="fa-solid fa-file-export"></i>
                 Export Report
                 <i className={`fa-solid fa-chevron-up transition-transform duration-200 ${showExportMenu ? 'rotate-180' : ''}`}></i>
               </button>

               {showExportMenu && (
                 <div className="absolute bottom-full right-0 mb-4 w-48 bg-white rounded-xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-bottom-2">
                   <button 
                    onClick={exportAsPdf}
                    className="w-full text-left px-5 py-3 hover:bg-slate-50 flex items-center gap-3 text-sm text-slate-700 font-medium transition-colors"
                   >
                     <i className="fa-solid fa-file-pdf text-rose-500"></i>
                     PDF Report
                   </button>
                   <button 
                    onClick={exportAsJson}
                    className="w-full text-left px-5 py-3 hover:bg-slate-50 flex items-center gap-3 text-sm text-slate-700 font-medium transition-colors border-t border-slate-50"
                   >
                     <i className="fa-solid fa-file-code text-amber-500"></i>
                     JSON Data
                   </button>
                   <button 
                    onClick={exportAsCsv}
                    className="w-full text-left px-5 py-3 hover:bg-slate-50 flex items-center gap-3 text-sm text-slate-700 font-medium transition-colors border-t border-slate-50"
                   >
                     <i className="fa-solid fa-file-csv text-green-500"></i>
                     CSV Data
                   </button>
                 </div>
               )}
             </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;

const App: React.FC = () => (
  <LoginGate>
    <AppInner />
  </LoginGate>
);

export default App;
