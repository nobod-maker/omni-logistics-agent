'use client';

import React, { useState } from 'react';
import { 
  X, 
  CheckCircle, 
  ChevronDown, 
  ChevronRight, 
  Terminal, 
  Clock, 
  DollarSign, 
  ShieldCheck, 
  FileText, 
  Plane, 
  Truck, 
  Anchor, 
  Lock, 
  AlertOctagon, 
  Sparkles,
  ExternalLink,
  RotateCcw
} from 'lucide-react';
import { DisruptionResolution } from '@/types';

interface ResolutionDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  resolution: DisruptionResolution | null;
  onExecuteFix: () => void;
  onRollback?: () => void;
  isExecuting: boolean;
  isRollingBack?: boolean;
  isResolvedAlready?: boolean;
}

export const ResolutionDrawer: React.FC<ResolutionDrawerProps> = ({
  isOpen,
  onClose,
  resolution,
  onExecuteFix,
  onRollback,
  isExecuting,
  isRollingBack = false,
  isResolvedAlready = false,
}) => {
  const [showCoT, setShowCoT] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'terminal' | 'customs' | 'routing'>('overview');

  if (!isOpen || !resolution) return null;

  const isLocked = resolution.requires_human_approval;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-2xl bg-[#0A0F1D] border-l border-slate-800 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
      {/* Drawer Header */}
      <div className="p-6 border-b border-slate-800 bg-slate-900/80 backdrop-blur flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 text-[10px] font-mono uppercase bg-cyan-950 border border-cyan-500/40 text-cyan-300 rounded font-bold">
              MULTI-AGENT SYNTHESIS // JEBEL ALI CORRIDOR
            </span>
            <span className="text-xs font-mono text-slate-400">
              {resolution.container_id}
            </span>
          </div>
          <h2 className={`text-lg font-bold mt-1 ${isLocked ? 'text-amber-400' : 'text-white'}`}>
            {resolution.recommended_action_title}
          </h2>
        </div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Safety Warning Banner if Locked */}
      {isLocked && (
        <div className="bg-amber-950/40 border-b border-amber-500/40 px-6 py-3 flex items-start gap-3">
          <AlertOctagon className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <div className="text-xs text-amber-200">
            <div className="font-bold">Human Review Required (Safety Governance Lock)</div>
            <div>{resolution.human_approval_reason}</div>
          </div>
        </div>
      )}

      {/* Main Drawer Body */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* KPI Scorecard: Net Cost vs Time Saved vs Profit Protected */}
        <div className="grid grid-cols-4 gap-3 bg-slate-900/90 border border-slate-800 rounded-xl p-4 text-center">
          <div>
            <div className="text-[10px] text-slate-400 font-mono uppercase">Mitigation Cost</div>
            <div className="text-base font-bold font-mono text-slate-200 mt-1">
              ${resolution.net_cost_impact.toLocaleString()}
            </div>
            <div className="text-[10px] text-slate-400">Gate + Air Split</div>
          </div>

          <div>
            <div className="text-[10px] text-slate-400 font-mono uppercase">Time Saved</div>
            <div className="text-base font-bold font-mono text-cyan-400 mt-1">
              +{resolution.time_saved_hours}h
            </div>
            <div className="text-[10px] text-slate-400">Transit Buffer</div>
          </div>

          <div>
            <div className="text-[10px] text-slate-400 font-mono uppercase">SLA Penalties Saved</div>
            <div className="text-base font-bold font-mono text-emerald-400 mt-1">
              ${resolution.sla_penalties_prevented.toLocaleString()}
            </div>
            <div className="text-[10px] text-slate-400">Avoided Fines</div>
          </div>

          <div>
            <div className="text-[10px] text-slate-400 font-mono uppercase">Confidence Score</div>
            <div className="text-base font-bold font-mono text-cyan-300 mt-1">
              {(resolution.confidence_score * 100).toFixed(0)}%
            </div>
            <div className="text-[10px] text-slate-400">Multi-Agent Avg</div>
          </div>
        </div>

        {/* Sub-Agent Plan Tabs */}
        <div>
          <div className="flex border-b border-slate-800 gap-2 mb-4">
            <button
              onClick={() => setActiveTab('overview')}
              className={`pb-2 text-xs font-semibold px-2 transition border-b-2 ${
                activeTab === 'overview'
                  ? 'border-cyan-400 text-cyan-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Action Overview
            </button>
            <button
              onClick={() => setActiveTab('terminal')}
              className={`pb-2 text-xs font-semibold px-2 transition border-b-2 ${
                activeTab === 'terminal'
                  ? 'border-cyan-400 text-cyan-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              1. Terminal Sub-Agent
            </button>
            <button
              onClick={() => setActiveTab('customs')}
              className={`pb-2 text-xs font-semibold px-2 transition border-b-2 ${
                activeTab === 'customs'
                  ? 'border-cyan-400 text-cyan-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              2. Customs Sub-Agent
            </button>
            <button
              onClick={() => setActiveTab('routing')}
              className={`pb-2 text-xs font-semibold px-2 transition border-b-2 ${
                activeTab === 'routing'
                  ? 'border-cyan-400 text-cyan-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              3. Routing Sub-Agent
            </button>
          </div>

          {/* Tab 1: Overview */}
          {activeTab === 'overview' && (
            <div className="space-y-3">
              <div className="text-xs font-semibold text-slate-300 uppercase font-mono tracking-wider">
                Recommended Execution Actions:
              </div>
              {resolution.recommended_actions.map((action, idx) => (
                <div key={idx} className="flex items-start gap-2.5 p-3 rounded-lg bg-slate-900 border border-slate-800/80 text-xs text-slate-200 font-mono">
                  <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span>{action}</span>
                </div>
              ))}
            </div>
          )}

          {/* Tab 2: Terminal */}
          {activeTab === 'terminal' && (
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-cyan-400 font-mono">Jebel Ali Terminal 2 (DP World)</span>
                <span className="text-[11px] font-mono text-emerald-400">Confidence: {(resolution.terminal_plan.confidence * 100).toFixed(0)}%</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {resolution.terminal_plan.summary}
              </p>
              <div className="space-y-1.5 pt-2">
                {resolution.terminal_plan.action_items.map((it, i) => (
                  <div key={i} className="text-[11px] font-mono text-slate-400 flex items-center gap-2">
                    <span className="text-cyan-500">•</span> {it}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 3: Customs */}
          {activeTab === 'customs' && (
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-cyan-400 font-mono">Dubai Customs Mirsal-II / Free Zone Authority</span>
                <span className="text-[11px] font-mono text-emerald-400">Confidence: {(resolution.customs_plan.confidence * 100).toFixed(0)}%</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {resolution.customs_plan.summary}
              </p>
              <div className="space-y-1.5 pt-2">
                {resolution.customs_plan.action_items.map((it, i) => (
                  <div key={i} className="text-[11px] font-mono text-slate-400 flex items-center gap-2">
                    <span className="text-cyan-500">•</span> {it}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 4: Routing */}
          {activeTab === 'routing' && (
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-cyan-400 font-mono">Multimodal Speed vs Cost Optimizer</span>
                <span className="text-[11px] font-mono text-emerald-400">Confidence: {(resolution.routing_plan.confidence * 100).toFixed(0)}%</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {resolution.routing_plan.summary}
              </p>
              <div className="space-y-1.5 pt-2">
                {resolution.routing_plan.action_items.map((it, i) => (
                  <div key={i} className="text-[11px] font-mono text-slate-400 flex items-center gap-2">
                    <span className="text-cyan-500">•</span> {it}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Source Attributions (Audit Guarantee) */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-3.5">
          <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-cyan-400" />
            <span>Audit Proof: Verified Telemetry & Tariff Citations</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {resolution.source_attributions.map((cite, i) => (
              <span key={i} className="px-2.5 py-1 rounded bg-slate-800 text-[10px] font-mono text-cyan-300 border border-slate-700">
                {cite}
              </span>
            ))}
          </div>
        </div>

        {/* Collapsible Chain-of-Thought (CoT) Logs */}
        <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950">
          <button
            onClick={() => setShowCoT(!showCoT)}
            className="w-full flex items-center justify-between px-4 py-3 bg-slate-900/90 text-xs font-mono text-slate-200 hover:bg-slate-850 transition"
          >
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-cyan-400" />
              <span className="font-semibold text-white">Agent Chain-of-Thought (Gemini 1.5 Reasoning Trace)</span>
            </div>
            {showCoT ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
          </button>

          {showCoT && (
            <div className="p-4 space-y-2 max-h-60 overflow-y-auto text-xs font-mono text-slate-300 border-t border-slate-800/80 leading-relaxed bg-[#060913]">
              {resolution.chain_of_thought.map((step, idx) => (
                <div key={idx} className="pb-1.5 border-b border-slate-800/40 last:border-b-0">
                  <span className="text-cyan-400 font-bold select-none">&gt; </span>
                  {step}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Drawer Action Footer */}
      <div className="p-6 border-t border-slate-800 bg-[#070B14] flex items-center justify-between gap-4">
        <button
          onClick={onClose}
          className="px-4 py-2.5 rounded-xl border border-slate-700 text-xs font-medium text-slate-300 hover:bg-slate-800 transition"
        >
          Close Drawer
        </button>

        {isResolvedAlready ? (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs font-bold px-3 py-2 bg-emerald-950/40 border border-emerald-500/40 rounded-xl">
              <CheckCircle className="w-4 h-4" />
              <span>Fix Committed</span>
            </div>
            {onRollback && (
              <button
                onClick={onRollback}
                disabled={isRollingBack}
                className="flex items-center gap-1.5 px-4 py-2 bg-red-950/40 hover:bg-red-900/60 border border-red-500/50 text-red-300 font-mono text-xs font-semibold rounded-xl transition disabled:opacity-50"
                title="Revert autonomous actions and restore previous corridor state"
              >
                <RotateCcw className={`w-3.5 h-3.5 ${isRollingBack ? 'animate-spin' : ''}`} />
                <span>{isRollingBack ? 'Reverting...' : 'Rollback Action'}</span>
              </button>
            )}
          </div>
        ) : isLocked ? (
          <button
            disabled
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-slate-800 text-slate-500 font-semibold text-xs border border-slate-700 cursor-not-allowed"
          >
            <Lock className="w-4 h-4" />
            <span>Autonomous Fix Locked (Human Approval Mandatory)</span>
          </button>
        ) : (
          <button
            onClick={onExecuteFix}
            disabled={isExecuting}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-xs shadow-emerald-glow transition disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isExecuting ? 'Committing Resolution to Port...' : 'Execute Autonomous Fix'}</span>
          </button>
        )}
      </div>
    </div>
  );
};
