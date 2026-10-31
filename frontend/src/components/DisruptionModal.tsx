'use client';

import React from 'react';
import { 
  AlertTriangle, 
  X, 
  Ship, 
  ArrowRight, 
  Sparkles
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#040506]/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#07080a] border border-[#1b1c1e] rounded-[8px] w-full max-w-xl overflow-hidden shadow-key relative">
        {/* Top Warning Banner */}
        <div className="bg-[#111214] border-b border-[#1b1c1e] px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#1b1c1e] text-[#ff6363] border border-[#2f3031] rounded-[6px] shadow-key">
              <AlertTriangle className="w-5 h-5 text-[#ff6363] animate-pulse" />
            </div>
            <div>
              <div className="text-xs font-mono uppercase tracking-widest text-[#ff6363] font-semibold">
                PROACTIVE DISRUPTION ALERT // AIS TELEMETRY ANOMALY
              </div>
              <h3 className="text-base font-normal text-white">
                Berth Congestion & Fog at Jebel Ali Terminal 2
              </h3>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-[#9c9c9d] hover:text-white p-1 rounded-[6px] hover:bg-[#111214] border border-transparent hover:border-[#363739] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {/* Vessel & Container Card */}
          <div className="bg-[#111214] border border-[#1b1c1e] rounded-[6px] p-4 shadow-key">
            <div className="flex items-center justify-between text-xs font-mono text-[#9c9c9d] mb-2">
              <span className="flex items-center gap-1.5 text-white">
                <Ship className="w-3.5 h-3.5 text-[#9c9c9d]" /> {shipment.vessel_name} ({shipment.current_berth})
              </span>
              <span className="px-2 py-0.5 rounded-[4px] bg-[#1b1c1e] text-white font-normal border border-[#2f3031]">
                {shipment.container_id}
              </span>
            </div>

            <div className="text-sm font-normal text-white mb-1">
              {shipment.cargo_description}
            </div>

            <div className="flex items-center text-xs font-mono text-[#6a6b6c] gap-1.5 mt-2">
              <span className="text-[#9c9c9d]">{shipment.origin_port}</span>
              <ArrowRight className="w-3 h-3 text-[#9c9c9d]" />
              <span className="text-white">{shipment.destination}</span>
            </div>
          </div>

          {/* Anomaly Breakdown & Financial Exposure */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#111214] border border-[#1b1c1e] rounded-[6px] p-3.5 text-center shadow-key">
              <div className="text-[11px] font-mono text-[#9c9c9d] uppercase">Estimated AIS Delay</div>
              <div className="text-2xl font-normal font-mono text-white mt-0.5">+{delayHours} Hours</div>
              <div className="text-[10px] text-[#6a6b6c] font-mono mt-1">STS Berth 4 Window Slipped</div>
            </div>

            <div className="bg-[#111214] border border-[#ff6363]/40 rounded-[6px] p-3.5 text-center shadow-key">
              <div className="text-[11px] font-mono text-[#ff6363] uppercase">Unmitigated Financial Risk</div>
              <div className="text-2xl font-normal font-mono text-[#ff6363] mt-0.5">
                ${totalExposure.toLocaleString('en-US')}
              </div>
              <div className="text-[10px] text-[#6a6b6c] font-mono mt-1">
                SLA Penalties (${slaLoss}) + Demurrage
              </div>
            </div>
          </div>

          <div className="bg-[#040506] border border-[#2f3031] rounded-[6px] p-3 text-xs text-[#9c9c9d] leading-relaxed shadow-key">
            <span className="text-white font-semibold">Immediate Bottlenecks:</span> Empty inland trucking fleet is currently waiting at Jebel Ali Gate 4; delayed clearance will trigger container yard storage penalties and breach customer SLA delivery deadline.
          </div>

          {/* Action Button: Launch MAS Orchestrator */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-[#9c9c9d] hover:text-white rounded-[6px] hover:bg-[#111214] border border-transparent hover:border-[#363739] transition"
            >
              Dismiss Alert
            </button>
            <button
              onClick={() => onLaunchOrchestrator(shipment)}
              disabled={isLoading}
              className="flex items-center gap-2 px-5 py-2.5 rounded-[6px] bg-[#e6e6e6] hover:bg-white text-[#454647] font-semibold text-xs shadow-key transition disabled:opacity-45"
            >
              <Sparkles className="w-4 h-4 text-[#ff6363]" />
              <span>{isLoading ? 'Synthesizing with Gemini 1.5...' : 'Delegate to Omni-Agent System'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
