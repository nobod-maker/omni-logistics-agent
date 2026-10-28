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
  ExternalLink,
  Sparkles,
  Zap,
  Key,
  Stamp
} from 'lucide-react';
import { TariffRecord, MirsalIIDeclaration } from '@/types';

interface TariffLookupModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiBaseUrl: string;
}

const SAMPLE_BOL_MSCU = `BILL OF LADING & COMMERCIAL INVOICE
Consignee: DUBAI SOUTH TELECOM INFRASTRUCTURE FZE
License Number: FZ-88391-JAFZA
Port of Loading: Shenzhen (CNSZN)
Port of Discharge: Jebel Ali Port (AEJEA) Terminal 2 Berth 4
Container Number: MSCU7829104
Carrier: Mediterranean Shipping Company (MSC)
Harmonized Code: 8517.62
Cargo Description: 5G Telecom Base Station Transceiver Modules & MIMO Antennas
Declared CIF Value: USD 840,000.00
Gross Weight: 18,420 KGS
Customs Regime: Direct Free Zone Inward Transit`;

const SAMPLE_BOL_MAEU = `BILL OF LADING & COMMERCIAL INVOICE
Consignee: DUBAI HEALTHCARE CITY BIOLOGICS FZE
License Number: FZ-77120-DHCC
Port of Loading: Rotterdam (NLRTM)
Port of Discharge: Jebel Ali Port (AEJEA) Terminal 2 Berth 2
Container Number: MAEU9182301
Carrier: Maersk Line
Harmonized Code: 3002.20
Cargo Description: Temperature-Controlled Biopharmaceutical Vaccines (2-8°C)
Declared CIF Value: USD 1,250,000.00
Gross Weight: 9,250 KGS (Active Cryogenic Reefer)
Customs Regime: Fast-Track Medical Cold-Chain Free Zone Transit`;

export const TariffLookupModal: React.FC<TariffLookupModalProps> = ({
  isOpen,
  onClose,
  apiBaseUrl,
}) => {
  const [activeTab, setActiveTab] = useState<'rag' | 'bol_parser'>('rag');
  
  // HS RAG state
  const [queryCode, setQueryCode] = useState('8517.62');
  const [result, setResult] = useState<TariffRecord | null>(null);
  const [loading, setLoading] = useState(false);

  // BoL Parser state (Milestone M5)
  const [bolText, setBolText] = useState(SAMPLE_BOL_MSCU);
  const [isParsingBoL, setIsParsingBoL] = useState(false);
  const [declaration, setDeclaration] = useState<MirsalIIDeclaration | null>(null);

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

  const handleParseBoL = async () => {
    setIsParsingBoL(true);
    try {
      const res = await fetch(`${apiBaseUrl}/api/customs/parse-bol`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ raw_document_text: bolText }),
      });
      if (res.ok) {
        const data = await res.json();
        setDeclaration(data);
      }
    } catch (err) {
      console.error('BoL parse error:', err);
    } finally {
      setIsParsingBoL(false);
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#0A0F1D] border border-cyan-500/40 rounded-2xl w-full max-w-2xl overflow-hidden shadow-cyan-glow flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-cyan-950/40 border-b border-cyan-500/30 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-cyan-500/20 text-cyan-400 rounded-lg">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-bold">
                DUBAI TRADE // MIRSAL-II CUSTOMS PRE-CLEARANCE
              </div>
              <h3 className="text-base font-bold text-white">
                UAE Customs Tariff RAG & Autonomous BoL Engine
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

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-800 bg-slate-900/60 px-6 pt-3 gap-4">
          <button
            onClick={() => setActiveTab('rag')}
            className={`pb-2.5 text-xs font-semibold px-2 transition border-b-2 flex items-center gap-2 ${
              activeTab === 'rag'
                ? 'border-cyan-400 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            <span>Harmonized Tariff (HS) RAG</span>
          </button>

          <button
            onClick={() => setActiveTab('bol_parser')}
            className={`pb-2.5 text-xs font-semibold px-2 transition border-b-2 flex items-center gap-2 ${
              activeTab === 'bol_parser'
                ? 'border-cyan-400 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>⚡ Autonomous BoL Pre-Clearance (Mirsal-II)</span>
            <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-mono text-[9px] font-bold">M5</span>
          </button>
        </div>

        {/* TAB 1: HS TARIFF RAG */}
        {activeTab === 'rag' && (
          <div className="flex flex-col flex-1 overflow-hidden">
            {/* Search Bar & Quick Picks */}
            <div className="p-6 space-y-4 border-b border-slate-800 bg-slate-900/30">
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
                    <span className="font-bold underline">
                      [{result.source_citation.replace(/^\[+|\]+$/g, '')}]
                    </span>
                  </div>
                </div>
              ) : (
                <div className="py-12 text-center text-slate-500 font-mono text-xs">
                  Click a corridor HS Code above or enter a code to view official UAE tariff rules.
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: AUTONOMOUS BoL PARSER (MILESTONE M5) */}
        {activeTab === 'bol_parser' && (
          <div className="p-6 overflow-y-auto flex-1 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-slate-400">Sample Dubai Bill of Lading Manifests:</span>
              <div className="flex gap-2">
                <button
                  onClick={() => setBolText(SAMPLE_BOL_MSCU)}
                  className="px-2.5 py-1 text-[11px] font-mono rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
                >
                  MSCU7829104 (5G Telecom)
                </button>
                <button
                  onClick={() => setBolText(SAMPLE_BOL_MAEU)}
                  className="px-2.5 py-1 text-[11px] font-mono rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
                >
                  MAEU9182301 (Biopharma)
                </button>
              </div>
            </div>

            <div>
              <textarea
                value={bolText}
                onChange={(e) => setBolText(e.target.value)}
                rows={5}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs font-mono text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                placeholder="Paste raw shipping manifest, Bill of Lading, or commercial invoice text..."
              />
            </div>

            <button
              onClick={handleParseBoL}
              disabled={isParsingBoL}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs shadow-cyan-glow transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Zap className="w-4 h-4" />
              <span>{isParsingBoL ? 'Parsing & Authorizing Digital Pre-Clearance...' : '⚡ Run Autonomous Pre-Clearance (Mirsal-II API)'}</span>
            </button>

            {/* Signed Digital Declaration Card */}
            {declaration && (
              <div className="p-4 rounded-xl bg-slate-900 border border-emerald-500/40 shadow-emerald-glow/20 space-y-3 animate-in fade-in duration-200">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                  <div className="flex items-center gap-2">
                    <Stamp className="w-4 h-4 text-emerald-400" />
                    <span className="font-mono text-xs font-bold text-emerald-400">
                      {declaration.declaration_number}
                    </span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded font-mono text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    {declaration.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-[10px] font-mono text-slate-400 block uppercase">Consignee</span>
                    <span className="font-bold text-white text-[11px]">{declaration.consignee_name}</span>
                    <span className="text-[10px] font-mono text-cyan-400 block">Lic: {declaration.consignee_license}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-slate-400 block uppercase">Container & HS Code</span>
                    <span className="font-mono font-bold text-white text-[11px]">{declaration.container_id}</span>
                    <span className="text-[10px] font-mono text-amber-400 block">HS {declaration.hs_code} (CIF ${declaration.cif_value_usd.toLocaleString('en-US')})</span>
                  </div>
                </div>

                {/* Exemption & Risk Channels */}
                <div className="grid grid-cols-3 gap-2 bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-center font-mono">
                  <div>
                    <div className="text-[9px] text-slate-400 uppercase">Duty Applied</div>
                    <div className="text-xs font-bold text-emerald-400 mt-0.5">
                      {declaration.free_zone_exemption_applied ? '0% (Free Zone Exempt)' : `${declaration.duty_rate_pct}%`}
                    </div>
                  </div>
                  <div>
                    <div className="text-[9px] text-slate-400 uppercase">VAT Payable</div>
                    <div className="text-xs font-bold text-emerald-400 mt-0.5">
                      ${declaration.vat_amount_usd.toFixed(2)}
                    </div>
                  </div>
                  <div>
                    <div className="text-[9px] text-slate-400 uppercase">Inspection Channel</div>
                    <div className="text-xs font-bold text-emerald-300 mt-0.5">
                      {declaration.risk_channel}
                    </div>
                  </div>
                </div>

                {/* Approvals */}
                <div className="text-xs space-y-1">
                  <div className="text-[10px] font-mono text-slate-400 uppercase">Regulatory Approvals Bound:</div>
                  <div className="flex flex-wrap gap-1.5">
                    {declaration.regulatory_approvals.map((app, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px] border border-slate-700">
                        ✓ {app}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Verification Hash & Authority Citation */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-[10px] font-mono text-slate-400">
                  <span className="flex items-center gap-1 text-slate-300">
                    <Key className="w-3 h-3 text-cyan-400" />
                    <span>Hash: {declaration.verification_hash}</span>
                  </span>
                  <span className="text-cyan-400 font-bold">
                    [{declaration.source_citation.replace(/^\[+|\]+$/g, '')}]
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
