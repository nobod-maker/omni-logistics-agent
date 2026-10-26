'use client';

import React, { useState, useEffect } from 'react';
import { 
  X, 
  Search, 
  Users, 
  Bot, 
  Sparkles, 
  ExternalLink, 
  CheckCircle, 
  Layers, 
  BookOpen, 
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

interface AgencyAgentSummary {
  slug: string;
  name: string;
  division: string;
  description: string;
}

interface AgencyAgentDetail {
  slug: string;
  name: string;
  description: string;
  system_instructions: string;
}

interface AgencyRosterModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiBaseUrl: string;
}

export const AgencyRosterModal: React.FC<AgencyRosterModalProps> = ({
  isOpen,
  onClose,
  apiBaseUrl,
}) => {
  const [agents, setAgents] = useState<AgencyAgentSummary[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDivision, setSelectedDivision] = useState<string>('all');
  const [selectedAgent, setSelectedAgent] = useState<AgencyAgentDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const fetchAgents = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${apiBaseUrl}/api/agency-agents`);
        if (res.ok) {
          const data = await res.json();
          setAgents(data.agents || []);
        }
      } catch (err) {
        console.error('Failed to load agency agents:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAgents();
  }, [isOpen, apiBaseUrl]);

  const loadAgentDetail = async (slug: string) => {
    setLoadingDetail(true);
    try {
      const res = await fetch(`${apiBaseUrl}/api/agency-agents/${slug}`);
      if (res.ok) {
        const detail = await res.json();
        setSelectedAgent(detail);
      }
    } catch (err) {
      console.error('Failed to load agent detail:', err);
    } finally {
      setLoadingDetail(false);
    }
  };

  if (!isOpen) return null;

  const divisions = ['all', 'specialized', 'gis', 'finance', 'engineering', 'product', 'strategy', 'operations'];

  const filteredAgents = agents.filter(a => {
    const matchesDiv = selectedDivision === 'all' || a.division.toLowerCase() === selectedDivision.toLowerCase();
    const matchesSearch = !searchTerm || 
      a.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      a.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesDiv && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#0A0F1D] border border-cyan-500/50 rounded-2xl w-full max-w-5xl h-[88vh] overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="bg-slate-900/90 border-b border-slate-800 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-tr from-cyan-600 to-blue-500 text-white rounded-xl shadow-cyan-glow">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-bold">
                  AGENCY AGENTS CATALOG // 271 READY-MADE SPECIALISTS
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                  Antigravity Native
                </span>
              </div>
              <h3 className="text-base font-bold text-white">
                Pre-Trained AI Agent Personas Integrated with Omni-Logistics
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mapped Control Tower Agents Banner */}
        <div className="bg-slate-950 px-6 py-3 border-b border-slate-800/80 flex items-center justify-between overflow-x-auto gap-4 text-xs font-mono">
          <span className="text-slate-400 whitespace-nowrap">Core System Mappings:</span>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-700 text-cyan-300">
              Master: <strong className="text-white">Agents Orchestrator</strong>
            </span>
            <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-700 text-amber-300">
              Terminal: <strong className="text-white">Operations Manager</strong>
            </span>
            <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-700 text-emerald-300">
              Routing: <strong className="text-white">Supply Chain Strategist</strong>
            </span>
            <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-700 text-purple-300">
              Spatial: <strong className="text-white">GIS Spatial Data Engineer</strong>
            </span>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="p-4 bg-slate-900/60 border-b border-slate-800 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by role, capability, or keyword (e.g. 'supply chain', 'gis', 'customs', 'pricing')..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div className="flex gap-1.5 overflow-x-auto pb-1">
            {divisions.map((div) => (
              <button
                key={div}
                onClick={() => setSelectedDivision(div)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono capitalize transition whitespace-nowrap border ${
                  selectedDivision === div
                    ? 'border-cyan-400 bg-cyan-950/80 text-cyan-300 font-bold'
                    : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-slate-200'
                }`}
              >
                {div}
              </button>
            ))}
          </div>
        </div>

        {/* Split View: List on left, details on right */}
        <div className="flex-1 flex overflow-hidden">
          {/* Agent Cards List */}
          <div className="w-1/2 border-r border-slate-800 overflow-y-auto p-4 space-y-2.5">
            <div className="text-[11px] font-mono text-slate-400 mb-2">
              Showing {filteredAgents.length} Ready-Made Agents
            </div>

            {loading ? (
              <div className="py-12 text-center text-slate-500 font-mono text-xs">
                Loading Agency Agents roster...
              </div>
            ) : filteredAgents.length === 0 ? (
              <div className="py-12 text-center text-slate-500 font-mono text-xs">
                No matching agents found. Try a different keyword or division.
              </div>
            ) : (
              filteredAgents.map((agent) => {
                const isSelected = selectedAgent?.slug === agent.slug;
                return (
                  <div
                    key={agent.slug}
                    onClick={() => loadAgentDetail(agent.slug)}
                    className={`p-3.5 rounded-xl border transition cursor-pointer ${
                      isSelected
                        ? 'border-cyan-400 bg-cyan-950/40 shadow-cyan-glow'
                        : 'border-slate-800 bg-slate-900/60 hover:bg-slate-900 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-xs font-bold text-white font-mono flex items-center gap-1.5">
                        <Sparkles className="w-3 h-3 text-cyan-400" />
                        {agent.name}
                      </h4>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                        {agent.division}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-snug line-clamp-2">
                      {agent.description}
                    </p>
                    <div className="mt-2 text-[10px] font-mono text-cyan-400/80 flex items-center justify-between">
                      <span>/{agent.slug}</span>
                      <ChevronRight className="w-3 h-3" />
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Agent Full Profile Details Pane */}
          <div className="w-1/2 overflow-y-auto p-6 bg-[#070B14]">
            {loadingDetail ? (
              <div className="py-20 text-center text-slate-500 font-mono text-xs">
                Loading Agent Persona Details...
              </div>
            ) : selectedAgent ? (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="flex items-center justify-between text-xs font-mono text-cyan-400 mb-1">
                    <span>READY-MADE AI SPECIALIST</span>
                    <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                      /{selectedAgent.slug}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white">{selectedAgent.name}</h3>
                  <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                    {selectedAgent.description}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                  <div className="text-xs font-mono uppercase text-slate-400 font-bold mb-3 flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-cyan-400" />
                    <span>Agent Instructions & Core Persona</span>
                  </div>
                  <div className="bg-[#050811] p-4 rounded-lg border border-slate-800 text-xs font-mono text-slate-300 max-h-[380px] overflow-y-auto whitespace-pre-wrap leading-relaxed">
                    {selectedAgent.system_instructions}
                  </div>
                </div>

                <div className="p-3.5 rounded-lg bg-emerald-950/20 border border-emerald-500/30 text-xs text-emerald-300 flex items-center justify-between font-mono">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    Installed & Active in Antigravity Engine
                  </span>
                  <span className="text-[10px] text-slate-400">Ready for Subagent Delegation</span>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center text-slate-500 font-mono text-xs p-8">
                <Bot className="w-12 h-12 text-slate-600 mb-3 animate-pulse" />
                <div className="font-semibold text-slate-400">Select Any Agent from the Roster</div>
                <div className="text-[11px] text-slate-500 mt-1 max-w-xs">
                  Inspect the full system instructions, identity traits, and workflows of any ready-made specialist.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
