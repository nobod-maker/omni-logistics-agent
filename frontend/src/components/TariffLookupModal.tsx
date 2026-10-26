'use client';

import React, { useState } from 'react';
import { 
  X, 
  Search, 
  BookOpen, 
  CheckCircle, 
  AlertCircle, 
  FileText, 
  ShieldCheck, 
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { TariffRecord } from '@/types';

interface TariffLookupModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiBaseUrl: string;
}

export const TariffLookupModal: React.FC<TariffLookupModalProps> = ({
  isOpen,
  onClose,
  apiBaseUrl,
}) => {
  const [queryCode, setQueryCode] = useState('8517.62');
  const [result, setResult] = useState<TariffRecord | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSearch = async (codeToSearch?: string) => {
    const code = codeToSearch || queryCode;
    setLoading(true);
    try {
      const res = await fetch(`${apiBaseUrl}/api/tariff-lookup?hs_code=${encodeURIComponent(code)}`);
      if (res.ok) {
        const data = await res.json();
        setResult(data);
      }
    } catch (err) {
      console.error('Tariff query error:', err);
    } finally {
      setLoading(false);
    }
  };

  const sampleCodes = [
    { code: '8517.62', label: '5G Base Stations' },
    { code: '3002.20', label: 'Biopharma Vaccines' },
    { code: '8507.60', label: 'Li-Ion Batteries' },
    { code: '8803.30', label: 'Aircraft Avionics' },
    { code: '8504.40', label: 'Solar Inverters' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#0A0F1D] border border-cyan-500/40 rounded-2xl w-full max-w-2xl overflow-hidden shadow-cyan-glow flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="bg-cyan-950/40 border-b border-cyan-500/30 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-cyan-500/20 text-cyan-400 rounded-lg">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-bold">
                UAE CUSTOMS TARIFF KNOWLEDGE BASE // HARMONIZED SYSTEM (HS)
              </div>
              <h3 className="text-base font-bold text-white">
                Dubai Trade Mirsal-II Pre-Clearance RAG
              </h3>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar & Quick Picks */}
        <div className="p-6 space-y-4 border-b border-slate-800 bg-slate-900/50">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={queryCode}
                onChange={(e) => setQueryCode(e.target.value)}
                placeholder="Enter 6-digit HS Code (e.g. 8517.62, 3002.20)..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-4 py-2.5 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              />
            </div>
            <button
              onClick={() => handleSearch()}
              disabled={loading}
              className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-cyan-glow transition disabled:opacity-50"
            >
              {loading ? 'Querying...' : 'Lookup Tariff'}
            </button>
          </div>

          {/* Quick presets */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            <span className="text-slate-400 text-[11px] font-mono whitespace-nowrap">Dubai Corridors:</span>
            {sampleCodes.map((sc) => (
              <button
                key={sc.code}
                onClick={() => {
                  setQueryCode(sc.code);
                  handleSearch(sc.code);
                }}
                className={`px-2.5 py-1 rounded-lg font-mono text-[11px] border transition whitespace-nowrap ${
                  queryCode === sc.code
                    ? 'border-cyan-400 bg-cyan-950/80 text-cyan-300'
                    : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-slate-200'
                }`}
              >
                {sc.code} ({sc.label})
              </button>
            ))}
          </div>
        </div>

        {/* Results Card */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {result ? (
            <div className="space-y-4">
              <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4">
                <div className="flex items-center justify-between text-xs font-mono mb-2">
                  <span className="text-cyan-400 font-bold text-base">HS {result.hs_code}</span>
                  <span className="px-2.5 py-1 rounded bg-slate-800 text-slate-300 font-mono text-[11px] border border-slate-700">
                    Category: {result.category}
                  </span>
                </div>
                <div className="text-xs text-slate-200 leading-relaxed font-medium">
                  {result.description}
                </div>
              </div>

              {/* Tax & Duty Metrics */}
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="text-[10px] font-mono text-slate-400 uppercase">Duty Rate</div>
                  <div className="text-xs font-bold font-mono text-emerald-400 mt-1">{result.duty_rate}</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="text-[10px] font-mono text-slate-400 uppercase">UAE VAT</div>
                  <div className="text-xs font-bold font-mono text-cyan-400 mt-1">{result.vat_rate}</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="text-[10px] font-mono text-slate-400 uppercase">Green-Lane Risk</div>
                  <div className="text-xs font-bold font-mono text-slate-200 mt-1">
                    {(result.inspection_risk_score * 100).toFixed(0)}% (Low)
                  </div>
                </div>
              </div>

              {/* Required Documents Checklist */}
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="text-xs font-bold text-slate-300 uppercase font-mono tracking-wider">
                  Mandatory Customs Pre-Clearance Documentation:
                </div>
                <div className="space-y-1.5 pt-1">
                  {result.required_documents.map((doc, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs font-mono text-slate-300">
                      <ShieldCheck className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                      <span>{doc}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Source Attribution Citation */}
              <div className="p-3 rounded-lg bg-cyan-950/20 border border-cyan-500/30 flex items-center justify-between text-xs font-mono text-cyan-300">
                <span>Official Authority Citation:</span>
                <span className="font-bold underline">[{result.source_citation}]</span>
              </div>
            </div>
          ) : (
            <div className="py-12 text-center text-slate-500 font-mono text-xs">
              Click a corridor HS Code above or enter a code to view official UAE tariff rules.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
