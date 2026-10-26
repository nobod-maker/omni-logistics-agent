'use client';

import React from 'react';
import { 
  AlertTriangle, 
  X, 
  Clock, 
  Ship, 
  ArrowRight, 
  DollarSign, 
  Sparkles,
  ShieldAlert
} from 'lucide-react';
import { Shipment } from '@/types';

interface DisruptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  shipment: Shipment | null;
  onLaunchOrchestrator: (shipment: Shipment) => void;
  isLoading: boolean;
}

export const DisruptionModal: React.FC<DisruptionModalProps> = ({
  isOpen,
  onClose,
  shipment,
  onLaunchOrchestrator,
  isLoading
}) => {
  if (!isOpen || !shipment) return null;

  const delayHours = 12;
  const slaLoss = delayHours * shipment.sla_penalty_rate_per_hour;
  const demurrageEst = 360.0;
  const totalExposure = slaLoss + demurrageEst;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#0A0F1D] border border-amber-500/50 rounded-2xl w-full max-w-xl overflow-hidden shadow-amber-glow relative">
        {/* Top Warning Banner */}
        <div className="bg-amber-500/10 border-b border-amber-500/30 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/20 text-amber-400 rounded-lg">
              <AlertTriangle className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="text-xs font-mono uppercase tracking-widest text-amber-400 font-bold">
                PROACTIVE DISRUPTION ALERT // AIS TELEMETRY ANOMALY
              </div>
              <h3 className="text-base font-bold text-white">
                Berth Congestion & Fog at Jebel Ali Terminal 2
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

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {/* Vessel & Container Card */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
              <span className="flex items-center gap-1.5 text-cyan-400">
                <Ship className="w-3.5 h-3.5" /> {shipment.vessel_name} ({shipment.current_berth})
              </span>
              <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-200 font-bold">
                {shipment.container_id}
              </span>
            </div>

            <div className="text-sm font-semibold text-slate-100 mb-1">
              {shipment.cargo_description}
            </div>

            <div className="flex items-center text-xs font-mono text-slate-400 gap-1.5 mt-2">
              <span>{shipment.origin_port}</span>
              <ArrowRight className="w-3 h-3 text-cyan-500" />
              <span className="text-cyan-300">{shipment.destination}</span>
            </div>
          </div>

          {/* Anomaly Breakdown & Financial Exposure */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-amber-950/20 border border-amber-500/30 rounded-xl p-3.5 text-center">
              <div className="text-[11px] font-mono text-amber-400 uppercase">Estimated AIS Delay</div>
              <div className="text-2xl font-bold font-mono text-white mt-0.5">+{delayHours} Hours</div>
              <div className="text-[10px] text-slate-400 font-mono mt-1">STS Berth 4 Window Slipped</div>
            </div>

            <div className="bg-red-950/20 border border-red-500/30 rounded-xl p-3.5 text-center">
              <div className="text-[11px] font-mono text-red-400 uppercase">Unmitigated Financial Risk</div>
              <div className="text-2xl font-bold font-mono text-red-300 mt-0.5">
                ${totalExposure.toLocaleString()}
              </div>
              <div className="text-[10px] text-slate-400 font-mono mt-1">
                SLA Penalties (${slaLoss}) + Demurrage
              </div>
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800/80 rounded-lg p-3 text-xs text-slate-300 leading-relaxed">
            <span className="text-amber-400 font-semibold">Immediate Bottlenecks:</span> Empty inland trucking fleet is currently waiting at Jebel Ali Gate 4; delayed clearance will trigger container yard storage penalties and breach customer SLA delivery deadline.
          </div>

          {/* Action Button: Launch MAS Orchestrator */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
            >
              Dismiss Alert
            </button>
            <button
              onClick={() => onLaunchOrchestrator(shipment)}
              disabled={isLoading}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs shadow-cyan-glow transition disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isLoading ? 'Synthesizing with Gemini 1.5...' : 'Delegate to Omni-Agent System'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
