'use client';

import React, { useState } from 'react';
import { 
  X, 
  Search, 
  BookOpen, 
  ShieldCheck, 
  Zap, 
  Key, 
  Stamp 
} from 'lucide-react';
import { TariffRecord, MirsalIIDeclaration } from '@/types';

interface TariffLookupModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiBaseUrl: string;
  initialTab?: 'rag' | 'bol_parser';
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
  initialTab = 'rag',
}) => {
  const [activeTab, setActiveTab] = useState<'rag' | 'bol_parser'>(initialTab);

  React.useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab, isOpen]);
  
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#040506]/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#07080a] border border-[#1b1c1e] rounded-[8px] w-full max-w-2xl overflow-hidden shadow-key flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-[#111214] border-b border-[#1b1c1e] px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#1b1c1e] text-[#9c9c9d] border border-[#2f3031] rounded-[6px] shadow-key">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-xs font-mono uppercase tracking-widest text-[#9c9c9d] font-semibold">
                DUBAI TRADE // MIRSAL-II CUSTOMS PRE-CLEARANCE
              </div>
              <h3 className="text-base font-normal text-white">
                UAE Customs Tariff RAG & Autonomous BoL Engine
              </h3>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-[#9c9c9d] hover:text-white p-1 rounded-[6px] hover:bg-[#1b1c1e] border border-transparent hover:border-[#363739] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-[#1b1c1e] bg-[#07080a] px-6 pt-3 gap-4">
          <button
            onClick={() => setActiveTab('rag')}
            className={`pb-2.5 text-xs font-semibold px-2 transition border-b-2 flex items-center gap-2 ${
              activeTab === 'rag'
                ? 'border-white text-white'
                : 'border-transparent text-[#6a6b6c] hover:text-[#9c9c9d]'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            <span>Harmonized Tariff (HS) RAG</span>
          </button>

          <button
            onClick={() => setActiveTab('bol_parser')}
            className={`pb-2.5 text-xs font-semibold px-2 transition border-b-2 flex items-center gap-2 ${
              activeTab === 'bol_parser'
                ? 'border-white text-white'
                : 'border-transparent text-[#6a6b6c] hover:text-[#9c9c9d]'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-[#ff6363]" />
            <span>⚡ Autonomous BoL Pre-Clearance (Mirsal-II)</span>
            <span className="px-1.5 py-0.2 rounded-[4px] bg-[#1b1c1e] text-[#9c9c9d] font-mono text-[9px] border border-[#2f3031]">M5</span>
          </button>
        </div>

        {/* TAB 1: HS TARIFF RAG */}
        {activeTab === 'rag' && (
          <div className="flex flex-col flex-1 overflow-hidden">
            {/* Search Bar & Quick Picks */}
            <div className="p-6 space-y-4 border-b border-[#1b1c1e] bg-[#07080a]">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-[#6a6b6c] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={queryCode}
                    onChange={(e) => setQueryCode(e.target.value)}
                    placeholder="Enter 6-digit HS Code (e.g. 8517.62, 3002.20)..."
                    className="w-full bg-[#111214] border border-[#2f3031] rounded-[6px] pl-9 pr-4 py-2.5 text-xs font-mono text-white placeholder-[#6a6b6c] focus:outline-none focus:border-[#454647] shadow-key"
                  />
                </div>
                <button
                  onClick={() => handleSearch()}
                  disabled={loading}
                  className="px-5 py-2.5 rounded-[6px] bg-[#e6e6e6] hover:bg-white text-[#454647] font-semibold text-xs shadow-key transition disabled:opacity-45"
                >
                  {loading ? 'Querying...' : 'Lookup Tariff'}
                </button>
              </div>

              {/* Quick presets */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
                <span className="text-[#6a6b6c] text-[11px] font-mono whitespace-nowrap">Dubai Corridors:</span>
                {sampleCodes.map((sc) => (
                  <button
                    key={sc.code}
                    onClick={() => {
                      setQueryCode(sc.code);
                      handleSearch(sc.code);
                    }}
                    className={`px-2.5 py-1 rounded-[4px] font-mono text-[11px] border transition whitespace-nowrap shadow-key ${
                      queryCode === sc.code
                        ? 'border-[#454647] bg-[#2f3031] text-white'
                        : 'border-[#1b1c1e] bg-[#111214] text-[#9c9c9d] hover:text-white'
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
                  <div className="bg-[#111214] border border-[#1b1c1e] rounded-[6px] p-4 shadow-key">
                    <div className="flex items-center justify-between text-xs font-mono mb-2">
                      <span className="text-white font-normal text-base">HS {result.hs_code}</span>
                      <span className="px-2.5 py-1 rounded-[4px] bg-[#1b1c1e] text-[#9c9c9d] font-mono text-[11px] border border-[#2f3031]">
                        Category: {result.category}
                      </span>
                    </div>
                    <div className="text-xs text-[#9c9c9d] leading-relaxed font-normal">
                      {result.description}
                    </div>
                  </div>

                  {/* Tax & Duty Metrics */}
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="p-3 rounded-[6px] bg-[#111214] border border-[#1b1c1e] shadow-key">
                      <div className="text-[10px] font-mono text-[#6a6b6c] uppercase">Duty Rate</div>
                      <div className="text-xs font-normal font-mono text-white mt-1">{result.duty_rate}</div>
                    </div>
                    <div className="p-3 rounded-[6px] bg-[#111214] border border-[#1b1c1e] shadow-key">
                      <div className="text-[10px] font-mono text-[#6a6b6c] uppercase">UAE VAT</div>
                      <div className="text-xs font-normal font-mono text-white mt-1">{result.vat_rate}</div>
                    </div>
                    <div className="p-3 rounded-[6px] bg-[#111214] border border-[#1b1c1e] shadow-key">
                      <div className="text-[10px] font-mono text-[#6a6b6c] uppercase">Green-Lane Risk</div>
                      <div className="text-xs font-normal font-mono text-white mt-1">
                        {(result.inspection_risk_score * 100).toFixed(0)}% (Low)
                      </div>
                    </div>
                  </div>

                  {/* Required Documents Checklist */}
                  <div className="p-4 rounded-[6px] bg-[#111214] border border-[#1b1c1e] space-y-2 shadow-key">
                    <div className="text-xs font-semibold text-white uppercase font-mono tracking-wider">
                      Mandatory Customs Pre-Clearance Documentation:
                    </div>
                    <div className="space-y-1.5 pt-1">
                      {result.required_documents.map((doc, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs font-mono text-[#9c9c9d]">
                          <ShieldCheck className="w-3.5 h-3.5 text-[#9c9c9d] flex-shrink-0" />
                          <span>{doc}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Source Attribution Citation */}
                  <div className="p-3 rounded-[6px] bg-[#111214] border border-[#1b1c1e] flex items-center justify-between text-xs font-mono text-[#9c9c9d] shadow-key">
                    <span>Official Authority Citation:</span>
                    <span className="font-semibold text-white">
                      [{result.source_citation.replace(/^\[+|\]+$/g, '')}]
                    </span>
                  </div>
                </div>
              ) : (
                <div className="py-12 text-center text-[#6a6b6c] font-mono text-xs">
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
              <span className="text-xs font-mono text-[#6a6b6c]">Sample Dubai Bill of Lading Manifests:</span>
              <div className="flex gap-2">
                <button
                  onClick={() => setBolText(SAMPLE_BOL_MSCU)}
                  className="px-2.5 py-1 text-[11px] font-mono rounded-[4px] bg-[#111214] hover:bg-[#1b1c1e] text-[#9c9c9d] border border-[#2f3031] transition shadow-key"
                >
                  MSCU7829104 (5G Telecom)
                </button>
                <button
                  onClick={() => setBolText(SAMPLE_BOL_MAEU)}
                  className="px-2.5 py-1 text-[11px] font-mono rounded-[4px] bg-[#111214] hover:bg-[#1b1c1e] text-[#9c9c9d] border border-[#2f3031] transition shadow-key"
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
                className="w-full bg-[#111214] border border-[#2f3031] rounded-[6px] p-3 text-xs font-mono text-white placeholder-[#6a6b6c] focus:outline-none focus:border-[#454647] shadow-key"
                placeholder="Paste raw shipping manifest, Bill of Lading, or commercial invoice text..."
              />
            </div>

            <button
              onClick={handleParseBoL}
              disabled={isParsingBoL}
              className="w-full py-2.5 px-4 rounded-[6px] bg-[#e6e6e6] hover:bg-white text-[#454647] font-semibold text-xs shadow-key transition flex items-center justify-center gap-2 disabled:opacity-45"
            >
              <Zap className="w-4 h-4 text-[#ff6363]" />
              <span>{isParsingBoL ? 'Parsing & Authorizing Digital Pre-Clearance...' : '⚡ Run Autonomous Pre-Clearance (Mirsal-II API)'}</span>
            </button>

            {/* Signed Digital Declaration Card */}
            {declaration && (
              <div className="p-4 rounded-[6px] bg-[#111214] border border-[#363739] shadow-key space-y-3 animate-in fade-in duration-200">
                <div className="flex items-center justify-between border-b border-[#1b1c1e] pb-2.5">
                  <div className="flex items-center gap-2">
                    <Stamp className="w-4 h-4 text-white" />
                    <span className="font-mono text-xs font-normal text-white">
                      {declaration.declaration_number}
                    </span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-[4px] font-mono text-[10px] font-semibold bg-[#1b1c1e] text-[#e6e6e6] border border-[#363739]">
                    {declaration.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-[10px] font-mono text-[#6a6b6c] block uppercase">Consignee</span>
                    <span className="font-normal text-white text-[11px]">{declaration.consignee_name}</span>
                    <span className="text-[10px] font-mono text-[#9c9c9d] block">Lic: {declaration.consignee_license}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-[#6a6b6c] block uppercase">Container & HS Code</span>
                    <span className="font-mono font-normal text-white text-[11px]">{declaration.container_id}</span>
                    <span className="text-[10px] font-mono text-[#9c9c9d] block">HS {declaration.hs_code} (CIF ${declaration.cif_value_usd.toLocaleString('en-US')})</span>
                  </div>
                </div>

                {/* Exemption & Risk Channels */}
                <div className="grid grid-cols-3 gap-2 bg-[#040506] p-2.5 rounded-[4px] border border-[#2f3031] text-center font-mono">
                  <div>
                    <div className="text-[9px] text-[#6a6b6c] uppercase">Duty Applied</div>
                    <div className="text-xs font-normal text-white mt-0.5">
                      {declaration.free_zone_exemption_applied ? '0% (Free Zone Exempt)' : `${declaration.duty_rate_pct}%`}
                    </div>
                  </div>
                  <div>
                    <div className="text-[9px] text-[#6a6b6c] uppercase">VAT Payable</div>
                    <div className="text-xs font-normal text-white mt-0.5">
                      ${declaration.vat_amount_usd.toFixed(2)}
                    </div>
                  </div>
                  <div>
                    <div className="text-[9px] text-[#6a6b6c] uppercase">Inspection Channel</div>
                    <div className="text-xs font-normal text-white mt-0.5">
                      {declaration.risk_channel}
                    </div>
                  </div>
                </div>

                {/* Approvals */}
                <div className="text-xs space-y-1">
                  <div className="text-[10px] font-mono text-[#6a6b6c] uppercase">Regulatory Approvals Bound:</div>
                  <div className="flex flex-wrap gap-1.5">
                    {declaration.regulatory_approvals.map((app, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded-[4px] bg-[#1b1c1e] text-[#9c9c9d] font-mono text-[10px] border border-[#2f3031]">
                        ✓ {app}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Verification Hash & Authority Citation */}
                <div className="flex items-center justify-between pt-2 border-t border-[#1b1c1e] text-[10px] font-mono text-[#6a6b6c]">
                  <span className="flex items-center gap-1 text-[#9c9c9d]">
                    <Key className="w-3 h-3 text-[#9c9c9d]" />
                    <span>Hash: {declaration.verification_hash}</span>
                  </span>
                  <span className="text-white font-semibold">
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
