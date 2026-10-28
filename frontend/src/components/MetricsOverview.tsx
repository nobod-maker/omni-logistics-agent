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
  Smartphone
} from 'lucide-react';
import { Shipment } from '@/types';

interface MetricsOverviewProps {
  shipments: Shipment[];
  onSimulateDelay: () => void;
  onOpenTariffModal: () => void;
  onOpenAgencyRoster: () => void;
  onToggleMobileView: () => void;
  isMobileView: boolean;
  onRefresh: () => void;
  isSimulating: boolean;
}

export const MetricsOverview: React.FC<MetricsOverviewProps> = ({
  shipments,
  onSimulateDelay,
  onOpenTariffModal,
  onOpenAgencyRoster,
  onToggleMobileView,
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

  return (
    <div className="bg-[#0A0F1D]/80 backdrop-blur border-b border-slate-800/80 sticky top-0 z-30 px-6 py-4">
      <div className="max-w-[1720px] mx-auto flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
        {/* Logo and System Status */}
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-cyan-600 to-blue-500 flex items-center justify-center shadow-cyan-glow border border-cyan-400/30">
              <Layers className="w-5 h-5 text-white" />
            </div>
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <h1 className="font-bold tracking-tight text-white text-lg lg:text-xl">
                OMNI-LOGISTICS <span className="text-cyan-400 font-mono text-base font-medium">CONTROL TOWER</span>
              </h1>
              <span className="px-2 py-0.5 text-[10px] font-mono tracking-widest uppercase bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 rounded">
                Dubai Hub v1.0
              </span>
            </div>
            <p className="text-xs text-slate-400 flex items-center gap-2">
              <span>Jebel Ali Port (AEJEA)</span>
              <span>•</span>
              <span className="text-emerald-400 flex items-center gap-1 font-mono">
                <Sparkles className="w-3 h-3" /> Gemini 1.5 Flash Active
              </span>
            </p>
          </div>
        </div>

        {/* Real-Time Telemetry Counters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 lg:gap-4 flex-1 max-w-4xl">
          {/* Active Corridors */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-3 relative overflow-hidden">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Active Shipments</span>
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
            </div>
            <div className="mt-1 flex items-baseline justify-between">
              <span className="text-xl font-bold font-mono text-white">{shipments.length}</span>
              <span className="text-[11px] font-mono text-slate-400">${(totalValue / 1_000_000).toFixed(2)}M Cargo</span>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-500/50" />
          </div>

          {/* Margin At Risk */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-3 relative overflow-hidden">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Margin At Risk</span>
              <AlertTriangle className={`w-3.5 h-3.5 ${marginAtRisk > 0 ? 'text-amber-400' : 'text-slate-500'}`} />
            </div>
            <div className="mt-1 flex items-baseline justify-between">
              <span className={`text-xl font-bold font-mono ${marginAtRisk > 0 ? 'text-amber-400' : 'text-slate-300'}`}>
                ${marginAtRisk.toLocaleString()}
              </span>
              <span className="text-[11px] font-mono text-amber-500/80">
                {delayedShipments.length} Anomaly
              </span>
            </div>
            <div className={`absolute bottom-0 left-0 right-0 h-0.5 ${marginAtRisk > 0 ? 'bg-amber-500' : 'bg-slate-700'}`} />
          </div>

          {/* SLA Value Protected */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-3 relative overflow-hidden">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Margin Protected</span>
              <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="mt-1 flex items-baseline justify-between">
              <span className="text-xl font-bold font-mono text-emerald-400">
                +${Math.max(marginProtected, 0).toLocaleString()}
              </span>
              <span className="text-[11px] font-mono text-emerald-500/80">
                {resolvedShipments.length} Resolved
              </span>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500/50" />
          </div>

          {/* Autonomous Clearances */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-3 relative overflow-hidden">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Free Zone Pre-Clear</span>
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            </div>
            <div className="mt-1 flex items-baseline justify-between">
              <span className="text-xl font-bold font-mono text-cyan-400">100%</span>
              <span className="text-[11px] font-mono text-cyan-300/80">Mirsal-II Direct</span>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-400/50" />
          </div>
        </div>

        {/* Action Trigger Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleMobileView}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg border transition ${
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
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg bg-cyan-950/70 hover:bg-cyan-900/80 text-cyan-300 border border-cyan-500/40 shadow-cyan-glow transition"
            title="Browse 271 Ready-Made Agency AI Agents"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Agency AI (271)</span>
          </button>

          <button
            onClick={onOpenTariffModal}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
            title="Inspect UAE Customs Harmonized Tariff Rules"
          >
            <Search className="w-3.5 h-3.5 text-cyan-400" />
            <span>HS Tariff RAG</span>
          </button>

          <button
            onClick={onRefresh}
            className="p-2 text-slate-400 hover:text-white rounded-lg bg-slate-800/80 hover:bg-slate-700 border border-slate-700 transition"
            title="Refresh Telemetry"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <button
            onClick={onSimulateDelay}
            disabled={isSimulating}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-glow transition disabled:opacity-50"
          >
            <AlertTriangle className="w-4 h-4" />
            <span>{isSimulating ? 'Simulating Anomaly...' : 'Simulate Berth 4 Delay'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
