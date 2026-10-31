'use client';

import React, { useState, useEffect } from 'react';
import { 
  X, 
  Search, 
  Bot, 
  Sparkles, 
  CheckCircle, 
  BookOpen, 
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#040506]/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#07080a] border border-[#1b1c1e] rounded-[8px] w-full max-w-5xl h-[88vh] overflow-hidden shadow-key flex flex-col">
        {/* Header */}
        <div className="bg-[#111214] border-b border-[#1b1c1e] px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#1b1c1e] text-white border border-[#2f3031] rounded-[6px] shadow-key">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono uppercase tracking-widest text-[#ff6363] font-semibold">
                  AGENCY AGENTS CATALOG // 271 READY-MADE SPECIALISTS
                </span>
                <span className="px-2 py-0.5 rounded-[4px] text-[10px] font-mono bg-[#1b1c1e] text-[#9c9c9d] border border-[#2f3031]">
                  Antigravity Native
                </span>
              </div>
              <h3 className="text-base font-normal text-white">
                Pre-Trained AI Agent Personas Integrated with Omni-Logistics
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#9c9c9d] hover:text-white p-1.5 rounded-[6px] hover:bg-[#1b1c1e] border border-transparent hover:border-[#363739] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mapped Control Tower Agents Banner */}
        <div className="bg-[#040506] px-6 py-3 border-b border-[#1b1c1e] flex items-center justify-between overflow-x-auto gap-4 text-xs font-mono">
          <span className="text-[#6a6b6c] whitespace-nowrap">Core System Mappings:</span>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-[4px] bg-[#111214] border border-[#2f3031] text-[#9c9c9d] shadow-key">
              Master: <strong className="text-white font-normal">Agents Orchestrator</strong>
            </span>
            <span className="px-2.5 py-1 rounded-[4px] bg-[#111214] border border-[#2f3031] text-[#9c9c9d] shadow-key">
              Terminal: <strong className="text-white font-normal">Operations Manager</strong>
            </span>
            <span className="px-2.5 py-1 rounded-[4px] bg-[#111214] border border-[#2f3031] text-[#9c9c9d] shadow-key">
              Routing: <strong className="text-white font-normal">Supply Chain Strategist</strong>
            </span>
            <span className="px-2.5 py-1 rounded-[4px] bg-[#111214] border border-[#2f3031] text-[#9c9c9d] shadow-key">
              Spatial: <strong className="text-white font-normal">GIS Spatial Data Engineer</strong>
            </span>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="p-4 bg-[#07080a] border-b border-[#1b1c1e] flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#6a6b6c] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by role, capability, or keyword (e.g. 'supply chain', 'gis', 'customs', 'pricing')..."
              className="w-full bg-[#111214] border border-[#2f3031] rounded-[6px] pl-9 pr-4 py-2 text-xs font-mono text-white placeholder-[#6a6b6c] focus:outline-none focus:border-[#454647] shadow-key"
            />
          </div>

          <div className="flex gap-1.5 overflow-x-auto pb-1">
            {divisions.map((div) => (
              <button
                key={div}
                onClick={() => setSelectedDivision(div)}
                className={`px-3 py-1.5 rounded-[4px] text-xs font-mono capitalize transition whitespace-nowrap border shadow-key ${
                  selectedDivision === div
                    ? 'border-[#454647] bg-[#2f3031] text-white font-semibold'
                    : 'border-[#1b1c1e] bg-[#111214] text-[#9c9c9d] hover:text-white'
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
          <div className="w-1/2 border-r border-[#1b1c1e] overflow-y-auto p-4 space-y-2.5 bg-[#07080a]">
            <div className="text-[11px] font-mono text-[#6a6b6c] mb-2">
              Showing {filteredAgents.length} Ready-Made Agents
            </div>

            {loading ? (
              <div className="py-12 text-center text-[#6a6b6c] font-mono text-xs">
                Loading Agency Agents roster...
              </div>
            ) : filteredAgents.length === 0 ? (
              <div className="py-12 text-center text-[#6a6b6c] font-mono text-xs">
                No matching agents found. Try a different keyword or division.
              </div>
            ) : (
              filteredAgents.map((agent) => {
                const isSelected = selectedAgent?.slug === agent.slug;
                return (
                  <div
                    key={agent.slug}
                    onClick={() => loadAgentDetail(agent.slug)}
                    className={`p-3.5 rounded-[6px] border transition cursor-pointer shadow-key ${
                      isSelected
                        ? 'border-[#9c9c9d] bg-[#1b1c1e]'
                        : 'border-[#1b1c1e] bg-[#111214] hover:bg-[#1b1c1e] hover:border-[#363739]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-xs font-semibold text-white font-mono flex items-center gap-1.5">
                        <Sparkles className="w-3 h-3 text-[#ff6363]" />
                        {agent.name}
                      </h4>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-[4px] bg-[#07080a] text-[#9c9c9d] border border-[#2f3031]">
                        {agent.division}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#9c9c9d] leading-snug line-clamp-2">
                      {agent.description}
                    </p>
                    <div className="mt-2 text-[10px] font-mono text-[#6a6b6c] flex items-center justify-between">
                      <span>/{agent.slug}</span>
                      <ChevronRight className="w-3 h-3 text-[#9c9c9d]" />
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Agent Full Profile Details Pane */}
          <div className="w-1/2 overflow-y-auto p-6 bg-[#040506]">
            {loadingDetail ? (
              <div className="py-20 text-center text-[#6a6b6c] font-mono text-xs">
                Loading Agent Persona Details...
              </div>
            ) : selectedAgent ? (
              <div className="space-y-4">
                <div className="p-4 rounded-[6px] bg-[#111214] border border-[#1b1c1e] shadow-key">
                  <div className="flex items-center justify-between text-xs font-mono text-[#9c9c9d] mb-1">
                    <span>READY-MADE AI SPECIALIST</span>
                    <span className="px-2 py-0.5 rounded-[4px] bg-[#07080a] text-white border border-[#2f3031]">
                      /{selectedAgent.slug}
                    </span>
                  </div>
                  <h3 className="text-lg font-normal text-white">{selectedAgent.name}</h3>
                  <p className="text-xs text-[#9c9c9d] mt-2 leading-relaxed">
                    {selectedAgent.description}
                  </p>
                </div>

                <div className="p-4 rounded-[6px] bg-[#111214] border border-[#1b1c1e] shadow-key">
                  <div className="text-xs font-mono uppercase text-[#9c9c9d] font-semibold mb-3 flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-[#9c9c9d]" />
                    <span>Agent Instructions & Core Persona</span>
                  </div>
                  <div className="bg-[#07080a] p-4 rounded-[6px] border border-[#1b1c1e] text-xs font-mono text-[#9c9c9d] max-h-[380px] overflow-y-auto whitespace-pre-wrap leading-relaxed shadow-key">
                    {selectedAgent.system_instructions}
                  </div>
                </div>

                <div className="p-3.5 rounded-[6px] bg-[#111214] border border-[#1b1c1e] text-xs text-[#e6e6e6] flex items-center justify-between font-mono shadow-key">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-white" />
                    Installed & Active in Antigravity Engine
                  </span>
                  <span className="text-[10px] text-[#6a6b6c]">Ready for Subagent Delegation</span>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center text-[#6a6b6c] font-mono text-xs p-8">
                <Bot className="w-12 h-12 text-[#2f3031] mb-3 animate-pulse" />
                <div className="font-semibold text-[#9c9c9d]">Select Any Agent from the Roster</div>
                <div className="text-[11px] text-[#6a6b6c] mt-1 max-w-xs">
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
