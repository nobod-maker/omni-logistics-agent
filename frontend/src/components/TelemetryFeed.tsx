'use client';

import React from 'react';
import { 
  Shipment, 
  DisruptionEvent 
} from '@/types';
import { 
  Activity, 
  ArrowRight, 
  ShieldCheck, 
  Box, 
  Sparkles
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
    <div className="bg-[#07080a] border border-[#363739] rounded-[8px] p-5 flex flex-col h-full shadow-key">
      {/* Title */}
      <div className="flex items-center justify-between pb-3 border-b border-[#363739] mb-4">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-[#9c9c9d]" />
          <h2 className="text-xs font-semibold text-[#e6e6e6] tracking-wider uppercase font-mono">
            Active Container Telemetry & Events
          </h2>
        </div>
        <span className="text-xs font-mono text-[#6a6b6c]">
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
              className={`p-4 rounded-[6px] border transition-all cursor-pointer relative overflow-hidden shadow-key ${
                isSelected
                  ? 'border-[#9c9c9d] bg-[#1b1c1e] ring-1 ring-[#9c9c9d]/30'
                  : isDelayed
                  ? 'border-[#ff6363]/50 bg-[#452324]/20 hover:bg-[#452324]/30'
                  : isResolved
                  ? 'border-[#363739] bg-[#111214] hover:bg-[#1b1c1e]'
                  : 'border-[#363739] bg-[#111214] hover:bg-[#1b1c1e]'
              }`}
            >
              {/* Top Row: Container ID + Status Badge */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded-[4px] border ${
                    isDelayed ? 'bg-[#452324] text-[#ff6363] border-[#ff6363]/40' :
                    isResolved ? 'bg-[#1b1c1e] text-[#e6e6e6] border-[#363739]' :
                    'bg-[#1b1c1e] text-[#9c9c9d] border-[#363739]'
                  }`}>
                    <Box className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-mono text-sm font-normal text-white tracking-wider">
                      {s.container_id}
                    </span>
                    <span className="text-xs text-[#9c9c9d] font-mono ml-2">
                      ({s.carrier} • {s.current_berth})
                    </span>
                  </div>
                </div>

                <span className={`text-[11px] font-mono px-2 py-0.5 rounded-[4px] font-semibold border ${
                  isDelayed
                    ? 'bg-[#452324] text-[#ff6363] border-[#ff6363]/40 animate-pulse'
                    : isResolved
                    ? 'bg-[#1b1c1e] text-[#e6e6e6] border-[#363739]'
                    : 'bg-[#1b1c1e] text-[#9c9c9d] border-[#363739]'
                }`}>
                  {s.status}
                </span>
              </div>

              {/* Vessel & Cargo Details */}
              <div className="text-xs text-[#9c9c9d] mb-2">
                <span className="font-normal text-white">{s.vessel_name}</span>: {s.cargo_description}
              </div>

              {/* Transit Corridor */}
              <div className="flex items-center text-[11px] font-mono text-[#6a6b6c] gap-1.5 mb-2.5">
                <span className="truncate max-w-[120px] text-[#9c9c9d]">{s.origin_port.split(' ')[0]}</span>
                <ArrowRight className="w-3 h-3 text-[#9c9c9d] flex-shrink-0" />
                <span className="truncate max-w-[180px] text-[#e6e6e6]">{s.destination}</span>
              </div>

              {/* Financial Metrics & SLA Row */}
              <div className="grid grid-cols-3 gap-2 py-2 px-2.5 bg-[#040506] rounded-[4px] text-center border border-[#2f3031] mb-3">
                <div>
                  <div className="text-[10px] text-[#6a6b6c] uppercase font-mono">Cargo Value</div>
                  <div className="text-xs font-mono font-normal text-[#e6e6e6]">${(s.value).toLocaleString('en-US')}</div>
                </div>
                <div>
                  <div className="text-[10px] text-[#6a6b6c] uppercase font-mono">SLA Penalty</div>
                  <div className={`text-xs font-mono font-normal ${isDelayed ? 'text-[#ff6363]' : 'text-white'}`}>
                    ${s.sla_penalty_rate_per_hour}/hr
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-[#6a6b6c] uppercase font-mono">HS Tariff</div>
                  <div className="text-xs font-mono font-normal text-[#e6e6e6]">{s.hs_code}</div>
                </div>
              </div>

              {/* Action Resolution Button if Delayed */}
              {isDelayed && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onResolveDisruption(s);
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-[6px] bg-[#e6e6e6] hover:bg-white text-[#454647] font-semibold text-xs shadow-key transition"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#ff6363]" />
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
                  className="w-full flex items-center justify-center gap-2 py-1.5 px-3 rounded-[6px] bg-[#111214] hover:bg-[#1b1c1e] border border-[#363739] text-[#e6e6e6] font-mono text-xs shadow-key transition"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-[#9c9c9d]" />
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
