'use client';

import React, { useState } from 'react';
import { 
  Ship, 
  Truck, 
  Plane, 
  AlertTriangle, 
  ShieldCheck, 
  CheckCircle, 
  Clock, 
  ArrowRight, 
  DollarSign, 
  Sparkles, 
  Terminal, 
  ChevronRight, 
  ChevronDown, 
  Layers, 
  Bell, 
  Smartphone, 
  PhoneCall,
  Search,
  ExternalLink,
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
    <div className="min-h-screen bg-[#070B14] text-slate-100 flex flex-col max-w-md mx-auto border-x border-slate-800 shadow-2xl relative pb-20">
      {/* Mobile Top App Bar */}
      <header className="sticky top-0 z-40 bg-[#0A0F1D]/95 backdrop-blur border-b border-slate-800 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-600 to-blue-500 flex items-center justify-center border border-cyan-400/40 shadow-cyan-glow">
              <Layers className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-xs tracking-tight text-white">OMNI-LOGISTICS</span>
                <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                  MOBILE PWA
                </span>
              </div>
              <div className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                <span>Jebel Ali Hub</span>
                <span>•</span>
                <span className="text-emerald-400 flex items-center gap-0.5">
                  <Sparkles className="w-2.5 h-2.5" /> Gemini Active
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onSimulateDelay}
              disabled={isSimulating}
              className="p-2 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/40 hover:bg-amber-500/30 transition disabled:opacity-50"
              title="Inject Port Anomaly"
            >
              <AlertTriangle className="w-4 h-4 animate-pulse" />
            </button>
            {onCloseMobileMode && (
              <button
                onClick={onCloseMobileMode}
                className="px-2 py-1 text-[10px] font-mono text-slate-400 hover:text-white rounded bg-slate-800 border border-slate-700"
              >
                Desktop
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Mobile KPI Carousel */}
      <div className="px-4 py-3 grid grid-cols-3 gap-2 bg-[#090E1A] border-b border-slate-800/80">
        <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800 text-center">
          <div className="text-[10px] font-mono text-slate-400 uppercase">Active</div>
          <div className="text-base font-bold font-mono text-cyan-400 mt-0.5">{shipments.length}</div>
          <div className="text-[9px] text-slate-500 font-mono">Containers</div>
        </div>

        <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800 text-center">
          <div className="text-[10px] font-mono text-slate-400 uppercase">At Risk</div>
          <div className={`text-base font-bold font-mono mt-0.5 ${delayedShipments.length > 0 ? 'text-amber-400' : 'text-slate-300'}`}>
            ${delayedShipments.reduce((sum, s) => sum + s.sla_penalty_rate_per_hour * 12, 0).toLocaleString('en-US')}
          </div>
          <div className="text-[9px] text-amber-500/80 font-mono">{delayedShipments.length} Anomaly</div>
        </div>

        <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800 text-center">
          <div className="text-[10px] font-mono text-slate-400 uppercase">Protected</div>
          <div className="text-base font-bold font-mono text-emerald-400 mt-0.5">
            +${resolvedShipments.reduce((sum, s) => sum + (s.sla_penalty_rate_per_hour * 12) - 1645, 0).toLocaleString('en-US')}
          </div>
          <div className="text-[9px] text-emerald-500/80 font-mono">{resolvedShipments.length} Fixed</div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        {/* Urgent Disruption Push Card (Workshop 1 Mobile Journey Highlight) */}
        {activeAlert ? (
          <div className="bg-gradient-to-b from-amber-950/40 to-slate-900 border border-amber-500/50 rounded-xl p-4 shadow-amber-glow relative">
            <div className="flex items-center justify-between text-xs font-mono mb-2">
              <span className="flex items-center gap-1.5 text-amber-400 font-bold uppercase tracking-wider">
                <AlertTriangle className="w-4 h-4 animate-bounce" /> PUSH ALERT // +12H DELAY
              </span>
              <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono text-[10px] font-bold">
                {activeAlert.current_berth}
              </span>
            </div>

            <div className="text-sm font-bold text-white mb-1">
              {activeAlert.vessel_name}: {activeAlert.container_id}
            </div>
            <div className="text-xs text-slate-300 leading-snug mb-3">
              {activeAlert.cargo_description} (Valued at ${(activeAlert.value).toLocaleString('en-US')})
            </div>

            <div className="grid grid-cols-2 gap-2 text-center text-xs font-mono bg-slate-950/70 p-2 rounded-lg border border-slate-800 mb-3">
              <div>
                <span className="text-[10px] text-slate-400 block">SLA Rate</span>
                <span className="text-amber-400 font-bold">${activeAlert.sla_penalty_rate_per_hour}/hr</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Demurrage Saved</span>
                <span className="text-emerald-400 font-bold">+$360.00</span>
              </div>
            </div>

            {/* 1-Tap Autonomous Action Mobile Button */}
            {resolution ? (
              <div className="space-y-2">
                {resolution.requires_human_approval ? (
                  <div className="space-y-2">
                    <div className="p-2.5 rounded-lg bg-red-950/60 border border-red-500/40 text-[11px] text-red-200">
                      <div className="font-bold flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
                        <span>🔒 SUPERVISOR LOCK (Exceeds $10k Ceiling)</span>
                      </div>
                      <div className="text-[10px] text-slate-300 mt-1">
                        Cost: ${resolution.net_cost_impact.toLocaleString('en-US')} • Confidence: {(resolution.confidence_score * 100).toFixed(0)}%
                      </div>
                    </div>
                    <button
                      onClick={onExecuteFix}
                      disabled={isExecuting}
                      className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-red-600 hover:from-amber-400 hover:to-red-500 text-white font-bold text-xs shadow-amber-glow transition flex items-center justify-center gap-2 border border-amber-400/50"
                    >
                      <ShieldCheck className="w-4 h-4 text-white" />
                      <span>{isExecuting ? 'Dispatching Supervisor Approval...' : 'Authorize Supervisor Override & Execute'}</span>
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={onExecuteFix}
                    disabled={isExecuting}
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-xs shadow-emerald-glow transition flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>{isExecuting ? 'Dispatching Fix...' : '1-Tap Autonomous Fix (Save $3,755)'}</span>
                  </button>
                )}

                {/* Collapsible Mobile CoT */}
                <button
                  onClick={() => setShowMobileCoT(!showMobileCoT)}
                  className="w-full text-[11px] font-mono text-cyan-400 flex items-center justify-center gap-1 py-1 hover:underline"
                >
                  <span>{showMobileCoT ? 'Hide' : 'Inspect'} Gemini Chain-of-Thought</span>
                  {showMobileCoT ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                </button>

                {showMobileCoT && (
                  <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-[10px] font-mono text-slate-300 space-y-1.5 max-h-40 overflow-y-auto">
                    {resolution.chain_of_thought.map((step, idx) => (
                      <div key={idx} className="border-b border-slate-800/40 pb-1 last:border-b-0">
                        <span className="text-cyan-400">&gt; </span>{step}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={onSimulateDelay}
                disabled={isSimulating}
                className="w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-amber-glow transition flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>{isSimulating ? 'Analyzing...' : 'Generate Multi-Agent Plan'}</span>
              </button>
            )}
          </div>
        ) : (
          <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-xl p-3.5 flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            <div className="text-xs">
              <div className="font-bold text-emerald-300">All Corridors Clear</div>
              <div className="text-slate-400 text-[11px]">Zero unmitigated delays across Jebel Ali berths.</div>
            </div>
          </div>
        )}

        {/* Quick Tools Row (Tariff RAG + Agency Roster) */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={onOpenAgencyRoster}
            className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-2 text-left hover:border-cyan-500/50 transition"
          >
            <Sparkles className="w-4 h-4 text-cyan-400 flex-shrink-0" />
            <div>
              <div className="text-xs font-bold text-white font-mono">Agency AI</div>
              <div className="text-[10px] text-slate-400">271 Specialists</div>
            </div>
          </button>

          <button
            onClick={onOpenTariffModal}
            className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-2 text-left hover:border-cyan-500/50 transition"
          >
            <Search className="w-4 h-4 text-cyan-400 flex-shrink-0" />
            <div>
              <div className="text-xs font-bold text-white font-mono">HS Tariff RAG</div>
              <div className="text-[10px] text-slate-400">Dubai Trade Mirsal</div>
            </div>
          </button>
        </div>

        {/* Mobile Containers List */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
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
                className={`p-3 rounded-xl border transition ${
                  isDelayed
                    ? 'border-amber-500/60 bg-amber-950/20'
                    : isResolved
                    ? 'border-emerald-500/50 bg-emerald-950/20'
                    : 'border-slate-800 bg-slate-900/60'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-mono text-xs font-bold text-white">{s.container_id}</span>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                    isDelayed ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' :
                    isResolved ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' :
                    'bg-slate-800 text-slate-300'
                  }`}>
                    {s.status}
                  </span>
                </div>

                <div className="text-xs text-slate-300 font-medium truncate">
                  {s.vessel_name} • {s.cargo_description}
                </div>

                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mt-2 pt-2 border-t border-slate-800/80">
                  <span className="truncate max-w-[180px]">{s.destination.split('->')[1] || s.destination}</span>
                  <span className="text-cyan-400 font-bold">${(s.value / 1000).toFixed(0)}k</span>
                </div>

                {isResolved && onRollback && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRollback(s.id);
                    }}
                    disabled={isRollingBack}
                    className="mt-2 w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 border border-red-500/40 text-red-300 font-mono text-[10px] font-semibold transition"
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
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-[#0A0F1D]/95 backdrop-blur border-t border-slate-800 px-4 py-2 flex items-center justify-around z-40">
        <button
          onClick={() => setActiveTab('alerts')}
          className={`flex flex-col items-center gap-1 text-[10px] font-mono transition ${
            activeTab === 'alerts' ? 'text-cyan-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Bell className="w-4 h-4" />
          <span>Alerts</span>
        </button>

        <button
          onClick={() => setActiveTab('containers')}
          className={`flex flex-col items-center gap-1 text-[10px] font-mono transition ${
            activeTab === 'containers' ? 'text-cyan-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Ship className="w-4 h-4" />
          <span>Corridors</span>
        </button>

        <button
          onClick={onOpenAgencyRoster}
          className="flex flex-col items-center gap-1 text-[10px] font-mono text-slate-400 hover:text-cyan-300 transition"
        >
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span>Agents</span>
        </button>

        <button
          onClick={onOpenTariffModal}
          className="flex flex-col items-center gap-1 text-[10px] font-mono text-slate-400 hover:text-cyan-300 transition"
        >
          <Search className="w-4 h-4" />
          <span>Tariff</span>
        </button>
      </nav>
    </div>
  );
};
