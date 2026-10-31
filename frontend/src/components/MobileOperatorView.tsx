'use client';

import React, { useState } from 'react';
import { 
  Ship, 
  AlertTriangle, 
  ShieldCheck, 
  CheckCircle, 
  Sparkles, 
  ChevronRight, 
  ChevronDown, 
  Layers, 
  Bell, 
  Search, 
  RotateCcw
} from 'lucide-react';
import { Shipment, DisruptionResolution } from '@/types';

interface MobileOperatorViewProps {
  shipments: Shipment[];
  onSimulateDelay: () => void;
  onOpenTariffModal: () => void;
  onOpenAgencyRoster: () => void;
  onSelectShipment: (shipment: Shipment) => void;
  selectedShipment: Shipment | null;
  resolution: DisruptionResolution | null;
  onExecuteFix: () => void;
  onRollback?: (shipmentId: string) => void;
  isSimulating: boolean;
  isExecuting: boolean;
  isRollingBack?: boolean;
  onCloseMobileMode?: () => void;
}

export const MobileOperatorView: React.FC<MobileOperatorViewProps> = ({
  shipments,
  onSimulateDelay,
  onOpenTariffModal,
  onOpenAgencyRoster,
  onSelectShipment,
  selectedShipment,
  resolution,
  onExecuteFix,
  onRollback,
  isSimulating,
  isExecuting,
  isRollingBack = false,
  onCloseMobileMode,
}) => {
  const [activeTab, setActiveTab] = useState<'alerts' | 'containers' | 'approvals'>('alerts');
  const [showMobileCoT, setShowMobileCoT] = useState(false);

  const delayedShipments = shipments.filter(s => s.status === 'DELAYED');
  const resolvedShipments = shipments.filter(s => s.status === 'RESOLVED');
  const activeAlert = delayedShipments.length > 0 ? delayedShipments[0] : null;

  return (
    <div className="min-h-screen bg-[#040506] text-[#e6e6e6] flex flex-col max-w-md mx-auto border-x border-[#1b1c1e] shadow-2xl relative pb-20">
      {/* Mobile Top App Bar */}
      <header className="sticky top-0 z-40 bg-[#07080a]/95 backdrop-blur-48 border-b border-[#1b1c1e] px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-[6px] bg-[#111214] border border-[#ff6363]/40 flex items-center justify-center shadow-key">
              <Layers className="w-4 h-4 text-[#ff6363]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-normal text-xs tracking-tight text-white">OMNI-LOGISTICS</span>
                <span className="px-1.5 py-0.5 rounded-[4px] text-[9px] font-mono bg-[#1b1c1e] text-[#9c9c9d] border border-[#363739]">
                  MOBILE PWA
                </span>
              </div>
              <div className="text-[10px] text-[#9c9c9d] font-mono flex items-center gap-1.5">
                <span>Jebel Ali Hub</span>
                <span>•</span>
                <span className="text-[#9c9c9d] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#ff6363] inline-block animate-pulse" />
                  Gemini Active
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onSimulateDelay}
              disabled={isSimulating}
              className="p-2 rounded-[6px] bg-[#111214] hover:bg-[#1b1c1e] text-[#ff6363] border border-[#363739] shadow-key transition disabled:opacity-45"
              title="Inject Port Anomaly"
            >
              <AlertTriangle className="w-4 h-4 animate-pulse" />
            </button>
            {onCloseMobileMode && (
              <button
                onClick={onCloseMobileMode}
                className="px-2 py-1 text-[10px] font-mono text-[#9c9c9d] hover:text-white rounded-[4px] bg-[#111214] border border-[#363739] shadow-key"
              >
                Desktop
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Mobile KPI Carousel */}
      <div className="px-4 py-3 grid grid-cols-3 gap-2 bg-[#07080a] border-b border-[#1b1c1e]">
        <div className="bg-[#111214] p-2.5 rounded-[6px] border border-[#1b1c1e] text-center shadow-key">
          <div className="text-[10px] font-mono text-[#6a6b6c] uppercase">Active</div>
          <div className="text-base font-normal font-mono text-white mt-0.5">{shipments.length}</div>
          <div className="text-[9px] text-[#6a6b6c] font-mono">Containers</div>
        </div>

        <div className="bg-[#111214] p-2.5 rounded-[6px] border border-[#1b1c1e] text-center shadow-key">
          <div className="text-[10px] font-mono text-[#6a6b6c] uppercase">At Risk</div>
          <div className={`text-base font-normal font-mono mt-0.5 ${delayedShipments.length > 0 ? 'text-[#ff6363]' : 'text-white'}`}>
            ${delayedShipments.reduce((sum, s) => sum + s.sla_penalty_rate_per_hour * 12, 0).toLocaleString('en-US')}
          </div>
          <div className="text-[9px] text-[#ff6363]/80 font-mono">{delayedShipments.length} Anomaly</div>
        </div>

        <div className="bg-[#111214] p-2.5 rounded-[6px] border border-[#1b1c1e] text-center shadow-key">
          <div className="text-[10px] font-mono text-[#6a6b6c] uppercase">Protected</div>
          <div className="text-base font-normal font-mono text-white mt-0.5">
            +${resolvedShipments.reduce((sum, s) => sum + (s.sla_penalty_rate_per_hour * 12) - 1645, 0).toLocaleString('en-US')}
          </div>
          <div className="text-[9px] text-[#9c9c9d] font-mono">{resolvedShipments.length} Fixed</div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        {/* Urgent Disruption Push Card (Workshop 1 Mobile Journey Highlight) */}
        {activeAlert ? (
          <div className="bg-[#111214] border border-[#1b1c1e] rounded-[8px] p-4 shadow-key relative">
            <div className="flex items-center justify-between text-xs font-mono mb-2">
              <span className="flex items-center gap-1.5 text-[#ff6363] font-semibold uppercase tracking-wider">
                <AlertTriangle className="w-4 h-4 animate-pulse" /> PUSH ALERT // +12H DELAY
              </span>
              <span className="px-2 py-0.5 rounded-[4px] bg-[#1b1c1e] text-[#9c9c9d] font-mono text-[10px] border border-[#2f3031]">
                {activeAlert.current_berth}
              </span>
            </div>

            <div className="text-sm font-normal text-white mb-1">
              {activeAlert.vessel_name}: {activeAlert.container_id}
            </div>
            <div className="text-xs text-[#9c9c9d] leading-snug mb-3">
              {activeAlert.cargo_description} (Valued at ${(activeAlert.value).toLocaleString('en-US')})
            </div>

            <div className="grid grid-cols-2 gap-2 text-center text-xs font-mono bg-[#040506] p-2 rounded-[4px] border border-[#2f3031] mb-3">
              <div>
                <span className="text-[10px] text-[#6a6b6c] block">SLA Rate</span>
                <span className="text-[#ff6363] font-normal">${activeAlert.sla_penalty_rate_per_hour}/hr</span>
              </div>
              <div>
                <span className="text-[10px] text-[#6a6b6c] block">Demurrage Saved</span>
                <span className="text-white font-normal">+$360.00</span>
              </div>
            </div>

            {/* 1-Tap Autonomous Action Mobile Button */}
            {resolution ? (
              <div className="space-y-2">
                {resolution.requires_human_approval ? (
                  <div className="space-y-2">
                    <div className="p-2.5 rounded-[6px] bg-[#452324]/30 border border-[#ff6363]/40 text-[11px] text-[#ff6363]">
                      <div className="font-semibold flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5 text-[#ff6363]" />
                        <span>🔒 SUPERVISOR LOCK (Exceeds $10k Ceiling)</span>
                      </div>
                      <div className="text-[10px] text-[#e6e6e6] mt-1">
                        Cost: ${resolution.net_cost_impact.toLocaleString('en-US')} • Confidence: {(resolution.confidence_score * 100).toFixed(0)}%
                      </div>
                    </div>
                    <button
                      onClick={onExecuteFix}
                      disabled={isExecuting}
                      className="w-full py-3 px-4 rounded-[6px] bg-[#452324] hover:bg-[#5a2e2f] border border-[#ff6363]/60 text-white font-semibold text-xs shadow-key transition flex items-center justify-center gap-2"
                    >
                      <ShieldCheck className="w-4 h-4 text-white" />
                      <span>{isExecuting ? 'Dispatching Supervisor Approval...' : 'Authorize Supervisor Override & Execute'}</span>
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={onExecuteFix}
                    disabled={isExecuting}
                    className="w-full py-3 px-4 rounded-[6px] bg-[#e6e6e6] hover:bg-white text-[#454647] font-semibold text-xs shadow-key transition flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-4 h-4 text-[#ff6363]" />
                    <span>{isExecuting ? 'Dispatching Fix...' : '1-Tap Autonomous Fix (Save $3,755)'}</span>
                  </button>
                )}

                {/* Collapsible Mobile CoT */}
                <button
                  onClick={() => setShowMobileCoT(!showMobileCoT)}
                  className="w-full text-[11px] font-mono text-[#9c9c9d] hover:text-white flex items-center justify-center gap-1 py-1 transition"
                >
                  <span>{showMobileCoT ? 'Hide' : 'Inspect'} Gemini Chain-of-Thought</span>
                  {showMobileCoT ? <ChevronDown className="w-3.5 h-3.5 text-[#9c9c9d]" /> : <ChevronRight className="w-3.5 h-3.5 text-[#9c9c9d]" />}
                </button>

                {showMobileCoT && (
                  <div className="bg-[#07080a] p-3 rounded-[6px] border border-[#1b1c1e] text-[10px] font-mono text-[#9c9c9d] space-y-1.5 max-h-40 overflow-y-auto shadow-key">
                    {resolution.chain_of_thought.map((step, idx) => (
                      <div key={idx} className="border-b border-[#1b1c1e] pb-1 last:border-b-0">
                        <span className="text-[#ff6363] font-bold">&gt; </span>{step}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={onSimulateDelay}
                disabled={isSimulating}
                className="w-full py-2.5 px-4 rounded-[6px] bg-[#e6e6e6] hover:bg-white text-[#454647] font-semibold text-xs shadow-key transition flex items-center justify-center gap-2 disabled:opacity-45"
              >
                <Sparkles className="w-4 h-4 text-[#ff6363]" />
                <span>{isSimulating ? 'Analyzing...' : 'Generate Multi-Agent Plan'}</span>
              </button>
            )}
          </div>
        ) : (
          <div className="bg-[#111214] border border-[#1b1c1e] rounded-[8px] p-3.5 flex items-center gap-3 shadow-key">
            <CheckCircle className="w-5 h-5 text-[#e6e6e6] flex-shrink-0" />
            <div className="text-xs">
              <div className="font-semibold text-white">All Corridors Clear</div>
              <div className="text-[#9c9c9d] text-[11px]">Zero unmitigated delays across Jebel Ali berths.</div>
            </div>
          </div>
        )}

        {/* Quick Tools Row (Tariff RAG + Agency Roster) */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={onOpenAgencyRoster}
            className="p-3 rounded-[6px] bg-[#111214] border border-[#1b1c1e] flex items-center gap-2 text-left hover:border-[#363739] transition shadow-key"
          >
            <Sparkles className="w-4 h-4 text-[#ff6363] flex-shrink-0" />
            <div>
              <div className="text-xs font-semibold text-white font-mono">Agency AI</div>
              <div className="text-[10px] text-[#9c9c9d]">271 Specialists</div>
            </div>
          </button>

          <button
            onClick={onOpenTariffModal}
            className="p-3 rounded-[6px] bg-[#111214] border border-[#1b1c1e] flex items-center gap-2 text-left hover:border-[#363739] transition shadow-key"
          >
            <Search className="w-4 h-4 text-[#9c9c9d] flex-shrink-0" />
            <div>
              <div className="text-xs font-semibold text-white font-mono">HS Tariff RAG</div>
              <div className="text-[10px] text-[#9c9c9d]">Dubai Trade Mirsal</div>
            </div>
          </button>
        </div>

        {/* Mobile Containers List */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between text-xs font-mono text-[#6a6b6c]">
            <span>Dubai Corridor Fleet ({shipments.length})</span>
            <span>Real-Time Status</span>
          </div>

          {shipments.map((s) => {
            const isDelayed = s.status === 'DELAYED';
            const isResolved = s.status === 'RESOLVED';

            return (
              <div
                key={s.id}
                onClick={() => onSelectShipment(s)}
                className={`p-3 rounded-[6px] border transition shadow-key ${
                  isDelayed
                    ? 'border-[#ff6363]/50 bg-[#452324]/20'
                    : isResolved
                    ? 'border-[#363739] bg-[#111214]'
                    : 'border-[#363739] bg-[#111214]'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-mono text-xs font-normal text-white">{s.container_id}</span>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-[4px] font-semibold border ${
                    isDelayed ? 'bg-[#452324] text-[#ff6363] border-[#ff6363]/40' :
                    isResolved ? 'bg-[#1b1c1e] text-[#e6e6e6] border-[#363739]' :
                    'bg-[#1b1c1e] text-[#9c9c9d] border-[#363739]'
                  }`}>
                    {s.status}
                  </span>
                </div>

                <div className="text-xs text-[#9c9c9d] font-normal truncate">
                  {s.vessel_name} • {s.cargo_description}
                </div>

                <div className="flex items-center justify-between text-[10px] font-mono text-[#6a6b6c] mt-2 pt-2 border-t border-[#1b1c1e]">
                  <span className="truncate max-w-[180px] text-[#9c9c9d]">{s.destination.split('->')[1] || s.destination}</span>
                  <span className="text-white font-normal">${(s.value / 1000).toFixed(0)}k</span>
                </div>

                {isResolved && onRollback && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRollback(s.id);
                    }}
                    disabled={isRollingBack}
                    className="mt-2 w-full flex items-center justify-center gap-1.5 py-1.5 rounded-[4px] bg-[#111214] hover:bg-[#452324] border border-[#363739] hover:border-[#ff6363]/40 text-[#9c9c9d] hover:text-[#ff6363] font-mono text-[10px] font-semibold transition shadow-key disabled:opacity-50"
                  >
                    <RotateCcw className={`w-3 h-3 ${isRollingBack ? 'animate-spin' : ''}`} />
                    <span>{isRollingBack ? 'Reverting...' : 'Revert Fix (Rollback to Delayed)'}</span>
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile Sticky Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-[#07080a]/95 backdrop-blur-48 border-t border-[#1b1c1e] px-4 py-2 flex items-center justify-around z-40">
        <button
          onClick={() => setActiveTab('alerts')}
          className={`flex flex-col items-center gap-1 text-[10px] font-mono transition ${
            activeTab === 'alerts' ? 'text-white font-semibold' : 'text-[#6a6b6c] hover:text-[#9c9c9d]'
          }`}
        >
          <Bell className="w-4 h-4" />
          <span>Alerts</span>
        </button>

        <button
          onClick={() => setActiveTab('containers')}
          className={`flex flex-col items-center gap-1 text-[10px] font-mono transition ${
            activeTab === 'containers' ? 'text-white font-semibold' : 'text-[#6a6b6c] hover:text-[#9c9c9d]'
          }`}
        >
          <Ship className="w-4 h-4" />
          <span>Corridors</span>
        </button>

        <button
          onClick={onOpenAgencyRoster}
          className="flex flex-col items-center gap-1 text-[10px] font-mono text-[#6a6b6c] hover:text-white transition"
        >
          <Sparkles className="w-4 h-4 text-[#ff6363]" />
          <span>Agents</span>
        </button>

        <button
          onClick={onOpenTariffModal}
          className="flex flex-col items-center gap-1 text-[10px] font-mono text-[#6a6b6c] hover:text-white transition"
        >
          <Search className="w-4 h-4" />
          <span>Tariff</span>
        </button>
      </nav>
    </div>
  );
};
