'use client';

import React from 'react';
import { 
  ShieldCheck, 
  AlertTriangle, 
  DollarSign, 
  Layers, 
  Sparkles,
  Search,
  RefreshCw,
  Smartphone,
  Download,
  TrendingUp,
  Snowflake
} from 'lucide-react';
import { Shipment } from '@/types';

interface MetricsOverviewProps {
  shipments: Shipment[];
  onSimulateDelay: () => void;
  onSimulateColdChainCrisis?: () => void;
  onOpenTariffModal: () => void;
  onOpenAgencyRoster: () => void;
  onOpenVentureModal?: () => void;
  onOpenJudgeTour?: () => void;
  onOpenPitchDeck?: () => void;
  onToggleMobileView: () => void;
  onExportAudit?: () => void;
  isMobileView: boolean;
  onRefresh: () => void;
  isSimulating: boolean;
}

export const MetricsOverview: React.FC<MetricsOverviewProps> = ({
  shipments,
  onSimulateDelay,
  onSimulateColdChainCrisis,
  onOpenTariffModal,
  onOpenAgencyRoster,
  onOpenVentureModal,
  onOpenJudgeTour,
  onOpenPitchDeck,
  onToggleMobileView,
  onExportAudit,
  isMobileView,
  onRefresh,
  isSimulating
}) => {
  const totalValue = shipments.reduce((sum, s) => sum + s.value, 0);
  const delayedShipments = shipments.filter(s => s.status === 'DELAYED');
  const resolvedShipments = shipments.filter(s => s.status === 'RESOLVED');
  
  // Real-time SLA margin at risk
  const marginAtRisk = delayedShipments.reduce((sum, s) => sum + (s.sla_penalty_rate_per_hour * 12), 0);
  
  // Projected savings from resolved autonomous interventions
  const marginProtected = resolvedShipments.reduce((sum, s) => sum + (s.sla_penalty_rate_per_hour * 12) - 1645, 0);
  const demurrageAvoided = resolvedShipments.length * 360;
  const customsHoursSaved = resolvedShipments.length * 6;
  const roiPct = resolvedShipments.length > 0 && marginProtected > 0 
    ? Math.round((marginProtected / (resolvedShipments.length * 1645)) * 100) 
    : 0;

  return (
    <header className="sticky top-0 z-30 px-6 py-3.5 space-y-3 bg-[#040506]/90 backdrop-blur-48 border-b border-[#363739]">
      {/* Top Floating Glass Navigation Bar: Brand & Action Controls */}
      <div className="max-w-[1720px] mx-auto bg-[#111214]/80 backdrop-blur-48 border border-[#363739] rounded-[8px] px-5 py-3 shadow-key flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        {/* Logo & Operational Status */}
        <div className="flex items-center space-x-3.5">
          <div className="relative flex-shrink-0 flex items-center justify-center w-8 h-8">
            <div className="w-6 h-6 rotate-45 rounded-[3px] bg-[#ff6363] flex items-center justify-center shadow-[0_0_12px_rgba(255,99,99,0.4)]">
              <Layers className="w-3.5 h-3.5 text-[#040506] -rotate-45" />
            </div>
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <h1 className="font-normal tracking-wide text-white text-base lg:text-lg">
                OMNI-LOGISTICS <span className="text-[#9c9c9d] font-mono text-xs font-semibold tracking-wider ml-1.5">CONTROL TOWER</span>
              </h1>
              <span className="px-2 py-0.5 text-[10px] font-mono tracking-widest uppercase bg-[#1b1c1e] border border-[#363739] text-[#9c9c9d] rounded-[4px] font-semibold">
                Dubai Hub v1.0
              </span>
            </div>
            <p className="text-[11px] text-[#9c9c9d] flex items-center gap-2">
              <span>DP World Jebel Ali Port (AEJEA)</span>
              <span>•</span>
              <span className="text-[#9c9c9d] flex items-center gap-1.5 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-[#ff6363] animate-pulse inline-block" />
                Gemini 1.5 Flash Active
              </span>
            </p>
          </div>
        </div>

        {/* Global Action Toolbar */}
        <div className="flex items-center flex-wrap gap-2">
          {onOpenJudgeTour && (
            <button
              onClick={onOpenJudgeTour}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-[6px] bg-[#1b1c1e] hover:bg-[#2f3031] text-[#ffffff] border border-[#363739] shadow-key transition"
              title="Launch 60-Second Guided Auto-Walkthrough for Championship Judges"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#ff6363]" />
              <span>▶️ 60s Judge Tour</span>
            </button>
          )}

          {onOpenPitchDeck && (
            <button
              onClick={onOpenPitchDeck}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-[6px] bg-[#111214] hover:bg-[#1b1c1e] text-[#9c9c9d] hover:text-[#e6e6e6] border border-[#363739] shadow-key transition"
              title="Open 10-Slide Dubai Chamber Championship Pitch Deck"
            >
              <span>📊 Pitch Deck</span>
            </button>
          )}

          {onExportAudit && (
            <button
              onClick={onExportAudit}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-[6px] bg-[#111214] hover:bg-[#1b1c1e] text-[#9c9c9d] hover:text-[#e6e6e6] border border-[#363739] shadow-key transition"
              title="Download Executive Audit Report for Championship & Compliance"
            >
              <Download className="w-3.5 h-3.5 text-[#e6e6e6]" />
              <span>Audit Report</span>
            </button>
          )}

          <button
            onClick={onToggleMobileView}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-[6px] border transition shadow-key ${
              isMobileView
                ? 'bg-[#e6e6e6] text-[#454647] border-[#e6e6e6] font-semibold'
                : 'bg-[#111214] hover:bg-[#1b1c1e] text-[#9c9c9d] hover:text-[#e6e6e6] border-[#363739]'
            }`}
            title="Preview Mobile Operator Journey (PWA view for port coordinators)"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>{isMobileView ? 'Exit Mobile' : 'Mobile View'}</span>
          </button>

          <button
            onClick={onOpenAgencyRoster}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-[6px] bg-[#111214] hover:bg-[#1b1c1e] text-[#9c9c9d] hover:text-[#e6e6e6] border border-[#363739] shadow-key transition"
            title="Browse 271 Ready-Made Agency AI Agents"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#ff6363]" />
            <span>Agency AI (271)</span>
          </button>

          <button
            onClick={onOpenTariffModal}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-[6px] bg-[#111214] hover:bg-[#1b1c1e] text-[#9c9c9d] hover:text-[#e6e6e6] border border-[#363739] shadow-key transition"
            title="Inspect UAE Customs Harmonized Tariff Rules & Mirsal-II Parser"
          >
            <Search className="w-3.5 h-3.5 text-[#9c9c9d]" />
            <span>Customs RAG / BoL</span>
          </button>

          {onOpenVentureModal && (
            <button
              onClick={onOpenVentureModal}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-[6px] bg-[#111214] hover:bg-[#1b1c1e] text-[#9c9c9d] hover:text-[#e6e6e6] border border-[#363739] shadow-key transition"
              title="Inspect Dubai 3PL Venture Case & Commercial ROI Simulator"
            >
              <TrendingUp className="w-3.5 h-3.5 text-[#e6e6e6]" />
              <span>🚀 Venture ROI</span>
            </button>
          )}

          <button
            onClick={onRefresh}
            className="p-1.5 text-[#9c9c9d] hover:text-[#ffffff] rounded-[6px] bg-[#111214] hover:bg-[#1b1c1e] border border-[#363739] shadow-key transition"
            title="Refresh Telemetry"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>

          {/* Simulation Triggers */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={onSimulateDelay}
              disabled={isSimulating}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-[6px] bg-[#e6e6e6] hover:bg-white text-[#454647] shadow-key transition disabled:opacity-45"
              title="Simulate 12h AIS Delay at Berth 4 (Standard 1-Tap Autonomous Fix)"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-[#ff6363]" />
              <span>{isSimulating ? 'Simulating...' : 'Simulate Berth 4 Delay'}</span>
            </button>

            {onSimulateColdChainCrisis && (
              <button
                onClick={onSimulateColdChainCrisis}
                disabled={isSimulating}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-[6px] bg-[#452324] hover:bg-[#5a2e2f] border border-[#ff6363]/50 text-[#ff6363] shadow-key transition disabled:opacity-45"
                title="Simulate High-Stakes Cold Chain Crisis exceeding $10,000 safety threshold"
              >
                <Snowflake className="w-3.5 h-3.5 text-[#ff6363]" />
                <span>⚠️ Cold-Chain Crisis (&gt;$10k Lock)</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Dedicated Full-Width 4-Column KPI Telemetry Ribbon */}
      <div className="max-w-[1720px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 pt-1">
        {/* Metric 1: Active Shipments */}
        <div className="bg-[#111214] border border-[#363739] rounded-[8px] p-4 shadow-key relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-[#9c9c9d] font-mono">
            <span>Active Shipments</span>
            <Layers className="w-4 h-4 text-[#9c9c9d]" />
          </div>
          <div className="mt-1.5 flex items-baseline justify-between">
            <span className="text-2xl font-normal font-mono text-white tracking-tight">{shipments.length}</span>
            <span className="text-xs font-mono text-[#e6e6e6] bg-[#1b1c1e] px-2 py-0.5 rounded-[4px] border border-[#363739]">
              ${(totalValue / 1_000_000).toFixed(2)}M Cargo
            </span>
          </div>
        </div>

        {/* Metric 2: Margin At Risk */}
        <div className="bg-[#111214] border border-[#363739] rounded-[8px] p-4 shadow-key relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-[#9c9c9d] font-mono">
            <span>Margin At Risk</span>
            <AlertTriangle className={`w-4 h-4 ${marginAtRisk > 0 ? 'text-[#ff6363] animate-pulse' : 'text-[#6a6b6c]'}`} />
          </div>
          <div className="mt-1.5 flex items-baseline justify-between">
            <span className={`text-2xl font-normal font-mono tracking-tight ${marginAtRisk > 0 ? 'text-[#ff6363]' : 'text-white'}`}>
              ${marginAtRisk.toLocaleString('en-US')}
            </span>
            <span className={`text-xs font-mono px-2 py-0.5 rounded-[4px] border ${
              marginAtRisk > 0 
                ? 'text-[#ff6363] bg-[#452324] border-[#ff6363]/40' 
                : 'text-[#9c9c9d] bg-[#1b1c1e] border-[#363739]'
            }`}>
              {delayedShipments.length} Anomaly
            </span>
          </div>
        </div>

        {/* Metric 3: SLA Value Protected */}
        <div className="bg-[#111214] border border-[#363739] rounded-[8px] p-4 shadow-key relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-[#9c9c9d] font-mono">
            <span>Margin Protected</span>
            <DollarSign className="w-4 h-4 text-[#9c9c9d]" />
          </div>
          <div className="mt-1.5 flex items-baseline justify-between">
            <span className="text-2xl font-normal font-mono text-white tracking-tight">
              +${Math.max(marginProtected, 0).toLocaleString('en-US')}
            </span>
            <span className="text-xs font-mono text-[#e6e6e6] bg-[#1b1c1e] px-2 py-0.5 rounded-[4px] border border-[#363739]">
              {roiPct > 0 ? `+${roiPct}% ROI` : `${resolvedShipments.length} Fixed`}
            </span>
          </div>
        </div>

        {/* Metric 4: Demurrage Saved */}
        <div className="bg-[#111214] border border-[#363739] rounded-[8px] p-4 shadow-key relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-[#9c9c9d] font-mono">
            <span>Demurrage Saved</span>
            <ShieldCheck className="w-4 h-4 text-[#9c9c9d]" />
          </div>
          <div className="mt-1.5 flex items-baseline justify-between">
            <span className="text-2xl font-normal font-mono text-white tracking-tight">
              ${demurrageAvoided > 0 ? demurrageAvoided.toLocaleString('en-US') : '0'}
            </span>
            <span className="text-xs font-mono text-[#e6e6e6] bg-[#1b1c1e] px-2 py-0.5 rounded-[4px] border border-[#363739]">
              +{customsHoursSaved}h Mirsal
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
