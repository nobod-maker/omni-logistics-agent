'use client';

import React, { useState } from 'react';
import { 
  X, 
  CheckCircle, 
  ChevronDown, 
  ChevronRight, 
  Terminal, 
  ShieldCheck, 
  FileText, 
  AlertOctagon, 
  Sparkles,
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
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-2xl bg-[#040506] border-l border-[#363739] shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
      {/* Drawer Header */}
      <div className="p-6 border-b border-[#363739] bg-[#07080a]/90 backdrop-blur-48 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 text-[10px] font-mono uppercase bg-[#1b1c1e] border border-[#363739] text-[#9c9c9d] rounded-[4px] font-semibold">
              MULTI-AGENT SYNTHESIS // JEBEL ALI CORRIDOR
            </span>
            <span className="text-xs font-mono text-[#6a6b6c]">
              {resolution.container_id}
            </span>
          </div>
          <h2 className={`text-lg font-normal mt-1 ${isLocked ? 'text-[#ff6363]' : 'text-white'}`}>
            {resolution.recommended_action_title}
          </h2>
        </div>
        <button
          onClick={onClose}
          className="text-[#9c9c9d] hover:text-white p-2 rounded-[6px] hover:bg-[#1b1c1e] border border-transparent hover:border-[#363739] transition"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Safety Warning Banner if Locked */}
      {isLocked && (
        <div className="bg-[#452324] border-b border-[#ff6363]/40 px-6 py-3.5 flex items-start gap-3">
          <AlertOctagon className="w-5 h-5 text-[#ff6363] flex-shrink-0 mt-0.5 animate-pulse" />
          <div className="text-xs">
            <div className="font-semibold text-[#ff6363] font-mono tracking-wide">
              🔒 HUMAN SUPERVISOR OVERRIDE REQUIRED (Exceeds $10,000 Autonomous Ceiling)
            </div>
            <div className="text-[#e6e6e6] mt-0.5">{resolution.human_approval_reason}</div>
          </div>
        </div>
      )}

      {/* Main Drawer Body */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* KPI Scorecard: Net Cost vs Time Saved vs Profit Protected */}
        <div className="grid grid-cols-4 gap-3 bg-[#111214] border border-[#363739] rounded-[8px] p-4 text-center shadow-key">
          <div>
            <div className="text-[10px] text-[#6a6b6c] font-mono uppercase">Mitigation Cost</div>
            <div className="text-base font-normal font-mono text-white mt-1">
              ${resolution.net_cost_impact.toLocaleString('en-US')}
            </div>
            <div className="text-[10px] text-[#6a6b6c]">Gate + Air Split</div>
          </div>

          <div>
            <div className="text-[10px] text-[#6a6b6c] font-mono uppercase">Time Saved</div>
            <div className="text-base font-normal font-mono text-white mt-1">
              +{resolution.time_saved_hours}h
            </div>
            <div className="text-[10px] text-[#6a6b6c]">Transit Buffer</div>
          </div>

          <div>
            <div className="text-[10px] text-[#6a6b6c] font-mono uppercase">SLA Penalties Saved</div>
            <div className="text-base font-normal font-mono text-white mt-1">
              ${resolution.sla_penalties_prevented.toLocaleString('en-US')}
            </div>
            <div className="text-[10px] text-[#6a6b6c]">Avoided Fines</div>
          </div>

          <div>
            <div className="text-[10px] text-[#6a6b6c] font-mono uppercase">Confidence Score</div>
            <div className="text-base font-normal font-mono text-white mt-1">
              {(resolution.confidence_score * 100).toFixed(0)}%
            </div>
            <div className="text-[10px] text-[#6a6b6c]">Multi-Agent Avg</div>
          </div>
        </div>

        {/* Sub-Agent Plan Tabs */}
        <div>
          <div className="flex border-b border-[#363739] gap-2 mb-4">
            <button
              onClick={() => setActiveTab('overview')}
              className={`pb-2 text-xs font-semibold px-2 transition border-b-2 ${
                activeTab === 'overview'
                  ? 'border-white text-white'
                  : 'border-transparent text-[#6a6b6c] hover:text-[#9c9c9d]'
              }`}
            >
              Action Overview
            </button>
            <button
              onClick={() => setActiveTab('terminal')}
              className={`pb-2 text-xs font-semibold px-2 transition border-b-2 ${
                activeTab === 'terminal'
                  ? 'border-white text-white'
                  : 'border-transparent text-[#6a6b6c] hover:text-[#9c9c9d]'
              }`}
            >
              1. Terminal Sub-Agent
            </button>
            <button
              onClick={() => setActiveTab('customs')}
              className={`pb-2 text-xs font-semibold px-2 transition border-b-2 ${
                activeTab === 'customs'
                  ? 'border-white text-white'
                  : 'border-transparent text-[#6a6b6c] hover:text-[#9c9c9d]'
              }`}
            >
              2. Customs Sub-Agent
            </button>
            <button
              onClick={() => setActiveTab('routing')}
              className={`pb-2 text-xs font-semibold px-2 transition border-b-2 ${
                activeTab === 'routing'
                  ? 'border-white text-white'
                  : 'border-transparent text-[#6a6b6c] hover:text-[#9c9c9d]'
              }`}
            >
              3. Routing Sub-Agent
            </button>
          </div>

          {/* Tab 1: Overview */}
          {activeTab === 'overview' && (
            <div className="space-y-3">
              <div className="text-xs font-semibold text-[#9c9c9d] uppercase font-mono tracking-wider">
                Recommended Execution Actions:
              </div>
              {resolution.recommended_actions.map((action, idx) => (
                <div key={idx} className="flex items-start gap-2.5 p-3 rounded-[6px] bg-[#07080a] border border-[#363739] text-xs text-[#e6e6e6] font-mono shadow-key">
                  <CheckCircle className="w-4 h-4 text-[#e6e6e6] flex-shrink-0 mt-0.5" />
                  <span>{action}</span>
                </div>
              ))}
            </div>
          )}

          {/* Tab 2: Terminal */}
          {activeTab === 'terminal' && (
            <div className="p-4 rounded-[6px] bg-[#111214] border border-[#363739] space-y-3 shadow-key">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-white font-mono">Jebel Ali Terminal 2 (DP World)</span>
                <span className="text-[11px] font-mono text-[#9c9c9d]">Confidence: {(resolution.terminal_plan.confidence * 100).toFixed(0)}%</span>
              </div>
              <p className="text-xs text-[#9c9c9d] leading-relaxed">
                {resolution.terminal_plan.summary}
              </p>
              <div className="space-y-1.5 pt-2">
                {resolution.terminal_plan.action_items.map((it, i) => (
                  <div key={i} className="text-[11px] font-mono text-[#9c9c9d] flex items-center gap-2">
                    <span className="text-[#6a6b6c]">•</span> {it}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 3: Customs */}
          {activeTab === 'customs' && (
            <div className="p-4 rounded-[6px] bg-[#111214] border border-[#363739] space-y-3 shadow-key">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-white font-mono">Dubai Customs Mirsal-II / Free Zone Authority</span>
                <span className="text-[11px] font-mono text-[#9c9c9d]">Confidence: {(resolution.customs_plan.confidence * 100).toFixed(0)}%</span>
              </div>
              <p className="text-xs text-[#9c9c9d] leading-relaxed">
                {resolution.customs_plan.summary}
              </p>
              <div className="space-y-1.5 pt-2">
                {resolution.customs_plan.action_items.map((it, i) => (
                  <div key={i} className="text-[11px] font-mono text-[#9c9c9d] flex items-center gap-2">
                    <span className="text-[#6a6b6c]">•</span> {it}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 4: Routing */}
          {activeTab === 'routing' && (
            <div className="p-4 rounded-[6px] bg-[#111214] border border-[#363739] space-y-3 shadow-key">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-white font-mono">Multimodal Speed vs Cost Optimizer</span>
                <span className="text-[11px] font-mono text-[#9c9c9d]">Confidence: {(resolution.routing_plan.confidence * 100).toFixed(0)}%</span>
              </div>
              <p className="text-xs text-[#9c9c9d] leading-relaxed">
                {resolution.routing_plan.summary}
              </p>
              <div className="space-y-1.5 pt-2">
                {resolution.routing_plan.action_items.map((it, i) => (
                  <div key={i} className="text-[11px] font-mono text-[#9c9c9d] flex items-center gap-2">
                    <span className="text-[#6a6b6c]">•</span> {it}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Source Attributions (Audit Guarantee) */}
        <div className="bg-[#07080a] border border-[#363739] rounded-[8px] p-3.5 shadow-key">
          <div className="text-[11px] font-mono text-[#9c9c9d] uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-[#9c9c9d]" />
            <span>Audit Proof: Verified Telemetry & Tariff Citations</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {resolution.source_attributions.map((cite, i) => (
              <span key={i} className="px-2.5 py-1 rounded-[4px] bg-[#111214] text-[10px] font-mono text-[#e6e6e6] border border-[#363739]">
                {cite}
              </span>
            ))}
          </div>
        </div>

        {/* Collapsible Chain-of-Thought (CoT) Logs */}
        <div className="border border-[#363739] rounded-[8px] overflow-hidden bg-[#040506] shadow-key">
          <button
            onClick={() => setShowCoT(!showCoT)}
            className="w-full flex items-center justify-between px-4 py-3 bg-[#111214] text-xs font-mono text-[#e6e6e6] hover:bg-[#1b1c1e] transition border-b border-[#363739]"
          >
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-[#9c9c9d]" />
              <span className="font-semibold text-white">Agent Chain-of-Thought (Gemini 1.5 Reasoning Trace)</span>
            </div>
            {showCoT ? <ChevronDown className="w-4 h-4 text-[#9c9c9d]" /> : <ChevronRight className="w-4 h-4 text-[#9c9c9d]" />}
          </button>

          {showCoT && (
            <div className="p-4 space-y-2 max-h-60 overflow-y-auto text-xs font-mono text-[#9c9c9d] leading-relaxed bg-[#040506]">
              {resolution.chain_of_thought.map((step, idx) => (
                <div key={idx} className="pb-1.5 border-b border-[#1b1c1e] last:border-b-0">
                  <span className="text-[#ff6363] font-bold select-none">&gt; </span>
                  {step}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Drawer Action Footer */}
      <div className="p-6 border-t border-[#363739] bg-[#07080a] flex items-center justify-between gap-4">
        <button
          onClick={onClose}
          className="px-4 py-2.5 rounded-[6px] border border-[#363739] text-xs font-medium text-[#9c9c9d] hover:text-white hover:bg-[#111214] shadow-key transition"
        >
          Close Drawer
        </button>

        {isResolvedAlready ? (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-[#e6e6e6] font-mono text-xs font-semibold px-3 py-2 bg-[#1b1c1e] border border-[#363739] rounded-[6px] shadow-key">
              <CheckCircle className="w-4 h-4 text-[#e6e6e6]" />
              <span>Fix Committed</span>
            </div>
            {onRollback && (
              <button
                onClick={onRollback}
                disabled={isRollingBack}
                className="flex items-center gap-1.5 px-4 py-2 bg-[#111214] hover:bg-[#452324] border border-[#363739] hover:border-[#ff6363]/50 text-[#9c9c9d] hover:text-[#ff6363] font-mono text-xs font-semibold rounded-[6px] shadow-key transition disabled:opacity-50"
                title="Revert autonomous actions and restore previous corridor state"
              >
                <RotateCcw className={`w-3.5 h-3.5 ${isRollingBack ? 'animate-spin' : ''}`} />
                <span>{isRollingBack ? 'Reverting...' : 'Rollback Action'}</span>
              </button>
            )}
          </div>
        ) : isLocked ? (
          <button
            onClick={onExecuteFix}
            disabled={isExecuting}
            className="flex items-center gap-2 px-6 py-2.5 rounded-[6px] bg-[#452324] hover:bg-[#5a2e2f] border border-[#ff6363]/60 text-white font-semibold text-xs shadow-key transition disabled:opacity-50"
          >
            <ShieldCheck className="w-4 h-4 text-white" />
            <span>{isExecuting ? 'Dispatching Supervisor Authorization...' : 'Authorize Supervisor Override & Execute'}</span>
          </button>
        ) : (
          <button
            onClick={onExecuteFix}
            disabled={isExecuting}
            className="flex items-center gap-2 px-6 py-2.5 rounded-[6px] bg-[#e6e6e6] hover:bg-white text-[#454647] font-semibold text-xs shadow-key transition disabled:opacity-45"
          >
            <Sparkles className="w-4 h-4 text-[#ff6363]" />
            <span>{isExecuting ? 'Committing Resolution to Port...' : 'Execute Autonomous Fix'}</span>
          </button>
        )}
      </div>
    </div>
  );
};
