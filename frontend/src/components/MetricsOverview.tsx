'use client';

import React from 'react';
import { 
  ShieldCheck, 
  AlertTriangle, 
  DollarSign, 
  Layers, 
  Clock, 
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
    <header className="bg-[#0A0F1D]/90 backdrop-blur border-b border-slate-800/80 sticky top-0 z-30 px-6 py-3.5 space-y-3">
      {/* Top Navbar Row: Brand & Action Controls */}
      <div className="max-w-[1720px] mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        {/* Logo & Operational Status */}
        <div className="flex items-center space-x-3.5">
          <div className="relative flex-shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-500 flex items-center justify-center shadow-cyan-glow border border-cyan-400/30">
              <Layers className="w-5 h-5 text-white" />
            </div>
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <h1 className="font-bold tracking-tight text-white text-base lg:text-lg">
                OMNI-LOGISTICS <span className="text-cyan-400 font-mono text-sm font-semibold">CONTROL TOWER</span>
              </h1>
              <span className="px-2 py-0.5 text-[9px] font-mono tracking-widest uppercase bg-cyan-950/90 border border-cyan-500/40 text-cyan-300 rounded font-bold">
                Dubai Hub v1.0
              </span>
            </div>
            <p className="text-[11px] text-slate-400 flex items-center gap-2">
              <span>DP World Jebel Ali Port (AEJEA)</span>
              <span>•</span>
              <span className="text-emerald-400 flex items-center gap-1 font-mono">
                <Sparkles className="w-3 h-3" /> Gemini 1.5 Flash Active
              </span>
            </p>
          </div>
        </div>

        {/* Global Action Toolbar */}
        <div className="flex items-center flex-wrap gap-2">
          {onOpenJudgeTour && (
            <button
              onClick={onOpenJudgeTour}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 shadow-emerald-glow transition animate-pulse border border-emerald-400/50"
              title="Launch 60-Second Guided Auto-Walkthrough for Championship Judges"
            >
              <Sparkles className="w-3.5 h-3.5 text-slate-950" />
              <span>▶️ 60s Judge Tour</span>
            </button>
          )}

          {onOpenPitchDeck && (
            <button
              onClick={onOpenPitchDeck}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-950/80 hover:bg-indigo-900/90 text-indigo-300 border border-indigo-500/40 shadow-lg transition"
              title="Open 10-Slide Dubai Chamber Championship Pitch Deck"
            >
              <span>📊 Pitch Deck</span>
            </button>
          )}

          {onExportAudit && (
            <button
              onClick={onExportAudit}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
              title="Download Executive Audit Report for Championship & Compliance"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span>Audit Report</span>
            </button>
          )}

          <button
            onClick={onToggleMobileView}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition ${
              isMobileView
                ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold shadow-amber-glow'
                : 'bg-slate-800/80 hover:bg-slate-700 text-slate-200 border-slate-700'
            }`}
            title="Preview Mobile Operator Journey (PWA view for port coordinators)"
          >
            <Smartphone className="w-3.5 h-3.5 text-cyan-400" />
            <span>{isMobileView ? 'Exit Mobile' : 'Mobile View'}</span>
          </button>

          <button
            onClick={onOpenAgencyRoster}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-cyan-950/70 hover:bg-cyan-900/80 text-cyan-300 border border-cyan-500/40 shadow-cyan-glow transition"
            title="Browse 271 Ready-Made Agency AI Agents"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Agency AI (271)</span>
          </button>

          <button
            onClick={onOpenTariffModal}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
            title="Inspect UAE Customs Harmonized Tariff Rules & Mirsal-II Parser"
          >
            <Search className="w-3.5 h-3.5 text-cyan-400" />
            <span>Customs RAG / BoL</span>
          </button>

          {onOpenVentureModal && (
            <button
              onClick={onOpenVentureModal}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-emerald-950/60 hover:bg-emerald-900/70 text-emerald-300 border border-emerald-500/40 shadow-emerald-glow transition"
              title="Inspect Dubai 3PL Venture Case & Commercial ROI Simulator"
            >
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
              <span>🚀 Venture ROI</span>
            </button>
          )}

          <button
            onClick={onRefresh}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg bg-slate-800/80 hover:bg-slate-700 border border-slate-700 transition"
            title="Refresh Telemetry"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>

          {/* Simulation Triggers */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={onSimulateDelay}
              disabled={isSimulating}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-glow transition disabled:opacity-50"
              title="Simulate 12h AIS Delay at Berth 4 (Standard 1-Tap Autonomous Fix)"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>{isSimulating ? 'Simulating...' : 'Simulate Berth 4 Delay'}</span>
            </button>

            {onSimulateColdChainCrisis && (
              <button
                onClick={onSimulateColdChainCrisis}
                disabled={isSimulating}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-red-950/80 hover:bg-red-900/90 text-red-200 border border-red-500/60 shadow-lg transition disabled:opacity-50"
                title="Simulate High-Stakes Cold Chain Crisis exceeding $10,000 safety threshold"
              >
                <Snowflake className="w-3.5 h-3.5 text-red-400" />
                <span>⚠️ Cold-Chain Crisis (&gt;$10k Lock)</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Dedicated Full-Width 4-Column KPI Telemetry Ribbon */}
      <div className="max-w-[1720px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 pt-1">
        {/* Metric 1: Active Shipments */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>Active Shipments</span>
            <Layers className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="mt-1.5 flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-white tracking-tight">{shipments.length}</span>
            <span className="text-xs font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30">
              ${(totalValue / 1_000_000).toFixed(2)}M Cargo
            </span>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-500/50" />
        </div>

        {/* Metric 2: Margin At Risk */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>Margin At Risk</span>
            <AlertTriangle className={`w-4 h-4 ${marginAtRisk > 0 ? 'text-amber-400 animate-pulse' : 'text-slate-500'}`} />
          </div>
          <div className="mt-1.5 flex items-baseline justify-between">
            <span className={`text-2xl font-bold font-mono tracking-tight ${marginAtRisk > 0 ? 'text-amber-400' : 'text-slate-300'}`}>
              ${marginAtRisk.toLocaleString('en-US')}
            </span>
            <span className="text-xs font-mono text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/30">
              {delayedShipments.length} Anomaly
            </span>
          </div>
          <div className={`absolute bottom-0 left-0 right-0 h-0.5 ${marginAtRisk > 0 ? 'bg-amber-500' : 'bg-slate-700'}`} />
        </div>

        {/* Metric 3: SLA Value Protected */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>Margin Protected</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-1.5 flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-emerald-400 tracking-tight">
              +${Math.max(marginProtected, 0).toLocaleString('en-US')}
            </span>
            <span className="text-xs font-mono text-emerald-300 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30 font-semibold">
              {roiPct > 0 ? `+${roiPct}% ROI` : `${resolvedShipments.length} Fixed`}
            </span>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500/50" />
        </div>

        {/* Metric 4: Demurrage Saved */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>Demurrage Saved</span>
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="mt-1.5 flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-cyan-400 tracking-tight">
              ${demurrageAvoided > 0 ? demurrageAvoided.toLocaleString('en-US') : '0'}
            </span>
            <span className="text-xs font-mono text-cyan-300 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30">
              +{customsHoursSaved}h Mirsal
            </span>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-400/50" />
        </div>
      </div>
    </header>
  );
};
