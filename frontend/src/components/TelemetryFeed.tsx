'use client';

import React from 'react';
import { 
  Shipment, 
  DisruptionEvent 
} from '@/types';
import { 
  Activity, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  ShieldCheck, 
  Box, 
  Sparkles,
  ExternalLink
} from 'lucide-react';

interface TelemetryFeedProps {
  shipments: Shipment[];
  events: DisruptionEvent[];
  selectedShipmentId?: string;
  onSelectShipment: (shipment: Shipment) => void;
  onResolveDisruption: (shipment: Shipment) => void;
}

export const TelemetryFeed: React.FC<TelemetryFeedProps> = ({
  shipments,
  events,
  selectedShipmentId,
  onSelectShipment,
  onResolveDisruption
}) => {
  return (
    <div className="bg-[#0A0F1D] border border-slate-800 rounded-xl p-5 flex flex-col h-full">
      {/* Title */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-4">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-cyan-400" />
          <h2 className="text-sm font-semibold text-slate-200 tracking-wide uppercase font-mono">
            Active Container Telemetry & Events
          </h2>
        </div>
        <span className="text-xs font-mono text-slate-400">
          {shipments.length} Active Records
        </span>
      </div>

      {/* Shipment Container List */}
      <div className="space-y-3 overflow-y-auto max-h-[580px] pr-1">
        {shipments.map((s) => {
          const isSelected = selectedShipmentId === s.id;
          const isDelayed = s.status === 'DELAYED';
          const isResolved = s.status === 'RESOLVED';

          return (
            <div
              key={s.id}
              onClick={() => onSelectShipment(s)}
              className={`p-4 rounded-xl border transition-all cursor-pointer relative overflow-hidden ${
                isSelected
                  ? 'border-cyan-500 bg-slate-900/90 shadow-cyan-glow'
                  : isDelayed
                  ? 'border-amber-500/60 bg-amber-950/20 hover:bg-amber-950/30'
                  : isResolved
                  ? 'border-emerald-500/50 bg-emerald-950/20 hover:bg-emerald-950/30'
                  : 'border-slate-800 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-900'
              }`}
            >
              {/* Top Row: Container ID + Status Badge */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded-lg ${
                    isDelayed ? 'bg-amber-500/20 text-amber-400' :
                    isResolved ? 'bg-emerald-500/20 text-emerald-400' :
                    'bg-cyan-500/20 text-cyan-400'
                  }`}>
                    <Box className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-mono text-sm font-bold text-white tracking-wider">
                      {s.container_id}
                    </span>
                    <span className="text-xs text-slate-400 font-mono ml-2">
                      ({s.carrier} • {s.current_berth})
                    </span>
                  </div>
                </div>

                <span className={`text-[11px] font-mono px-2 py-0.5 rounded-full font-semibold border ${
                  isDelayed
                    ? 'bg-amber-500/10 text-amber-300 border-amber-500/40 animate-pulse'
                    : isResolved
                    ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/40'
                    : 'bg-slate-800 text-slate-300 border-slate-700'
                }`}>
                  {s.status}
                </span>
              </div>

              {/* Vessel & Cargo Details */}
              <div className="text-xs text-slate-300 mb-2">
                <span className="font-medium text-white">{s.vessel_name}</span>: {s.cargo_description}
              </div>

              {/* Transit Corridor */}
              <div className="flex items-center text-[11px] font-mono text-slate-400 gap-1.5 mb-2.5">
                <span className="truncate max-w-[120px]">{s.origin_port.split(' ')[0]}</span>
                <ArrowRight className="w-3 h-3 text-cyan-500 flex-shrink-0" />
                <span className="truncate max-w-[180px] text-cyan-300">{s.destination}</span>
              </div>

              {/* Financial Metrics & SLA Row */}
              <div className="grid grid-cols-3 gap-2 py-2 px-2.5 bg-slate-950/60 rounded-lg text-center border border-slate-800/80 mb-3">
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-mono">Cargo Value</div>
                  <div className="text-xs font-mono font-bold text-slate-200">${(s.value).toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-mono">SLA Penalty</div>
                  <div className="text-xs font-mono font-bold text-amber-400">${s.sla_penalty_rate_per_hour}/hr</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-mono">HS Tariff</div>
                  <div className="text-xs font-mono font-bold text-cyan-400">{s.hs_code}</div>
                </div>
              </div>

              {/* Action Resolution Button if Delayed */}
              {isDelayed && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onResolveDisruption(s);
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-amber-glow transition"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Inspect Omni-Agent Multi-Agent Resolution</span>
                </button>
              )}

              {/* Inspect Details if Resolved */}
              {isResolved && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onResolveDisruption(s);
                  }}
                  className="w-full flex items-center justify-center gap-2 py-1.5 px-3 rounded-lg bg-emerald-950/40 hover:bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 font-semibold text-xs transition"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>View Executed Recovery Plan & CoT Logs</span>
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
