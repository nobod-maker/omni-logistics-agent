'use client';

import React, { useState, useEffect } from 'react';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Printer, 
  Layers, 
  ShieldCheck, 
  Smartphone, 
  Sparkles, 
  Award,
  DollarSign,
  AlertTriangle,
  RotateCcw,
  Globe,
  FileText
} from 'lucide-react';

interface PitchDeckModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PitchDeckModal: React.FC<PitchDeckModalProps> = ({ isOpen, onClose }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    // Slide 1: Title
    {
      slideNum: 1,
      tag: "CHAMPIONSHIP SUBMISSION // DUBAI CHAMBER OF DIGITAL ECONOMY",
      title: "OMNI-LOGISTICS MASTER AGENT",
      subtitle: "Autonomous Control Tower for Dubai Port, Free Zone & Inland Supply Chains",
      category: "Category: Best Business AI Agent ($150,000 USD Growth Grant Track)",
      body: (
        <div className="space-y-6 text-center max-w-2xl mx-auto py-8">
          <div className="w-16 h-16 mx-auto rounded-[6px] bg-[#111214] flex items-center justify-center border border-[#ff6363]/40 shadow-key">
            <Layers className="w-8 h-8 text-[#ff6363]" />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-normal text-white tracking-tight">
              From Reactive Panic to Autonomous Precision
            </h2>
            <p className="text-xs md:text-sm text-[#9c9c9d] mt-3 leading-relaxed">
              Unifying DP World Jebel Ali Terminal 2, Dubai Customs Mirsal-II, Emirates SkyCargo (DWC), and the E611 freight corridor into an enterprise-governed Multi-Agent System (MAS).
            </p>
          </div>
          <div className="flex justify-center gap-3 pt-2">
            <span className="px-3 py-1 rounded-[4px] bg-[#111214] border border-[#2f3031] text-[#e6e6e6] font-mono text-xs shadow-key">
              Gemini 1.5 Flash Orchestrated
            </span>
            <span className="px-3 py-1 rounded-[4px] bg-[#111214] border border-[#2f3031] text-[#e6e6e6] font-mono text-xs shadow-key">
              271 agency-agents Squad
            </span>
            <span className="px-3 py-1 rounded-[4px] bg-[#111214] border border-[#2f3031] text-[#e6e6e6] font-mono text-xs shadow-key">
              $0 Cost MVP Stack
            </span>
          </div>
        </div>
      )
    },

    // Slide 2: The Problem
    {
      slideNum: 2,
      tag: "THE PROBLEM // $4.2B ANNUAL FRICTION",
      title: "Dubai's Trillion-Dirham Corridor Is Throttled by Blind Handoffs",
      subtitle: "Jebel Ali moves 14M+ TEUs/yr, but operational breakdowns compound exponentially",
      category: "Pain Point Analysis",
      body: (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-6">
          <div className="p-5 rounded-[8px] bg-[#111214] border border-[#1b1c1e] space-y-3 shadow-key">
            <div className="w-10 h-10 rounded-[6px] bg-[#07080a] flex items-center justify-center text-[#ff6363] border border-[#2f3031] shadow-key">
              <AlertTriangle className="w-5 h-5 text-[#ff6363]" />
            </div>
            <h3 className="font-semibold text-white text-base">Berth Delays & Demurrage</h3>
            <p className="text-xs text-[#9c9c9d] leading-relaxed">
              AIS fog shifts slip vessel docking by 12–24h. Empty trucks jam Gate 4, STS cranes idle, and storage demurrage fines hit $180–$360/day per container.
            </p>
          </div>

          <div className="p-5 rounded-[8px] bg-[#111214] border border-[#1b1c1e] space-y-3 shadow-key">
            <div className="w-10 h-10 rounded-[6px] bg-[#07080a] flex items-center justify-center text-white border border-[#2f3031] shadow-key">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <h3 className="font-semibold text-white text-base">Customs Paperwork Holds</h3>
            <p className="text-xs text-[#9c9c9d] leading-relaxed">
              Unstructured Bills of Lading and complex HS tariff codes cause 6–18 hour border inspection holds, forfeiting Free Zone 0% duty exemptions.
            </p>
          </div>

          <div className="p-5 rounded-[8px] bg-[#111214] border border-[#1b1c1e] space-y-3 shadow-key">
            <div className="w-10 h-10 rounded-[6px] bg-[#07080a] flex items-center justify-center text-white border border-[#2f3031] shadow-key">
              <DollarSign className="w-5 h-5 text-white" />
            </div>
            <h3 className="font-semibold text-white text-base">Customer SLA Penalties</h3>
            <p className="text-xs text-[#9c9c9d] leading-relaxed">
              High-value tech components and cold-chain biopharma incur strict penalty clauses ($450–$850/hr), turning profitable freight jobs into catastrophic margin losses.
            </p>
          </div>
        </div>
      )
    },

    // Slide 3: Multi-Agent Architecture
    {
      slideNum: 3,
      tag: "THE ARCHITECTURE // MULTI-AGENT SYSTEM (MAS)",
      title: "Omni Master Orchestrator + 3 Specialized Sub-Agents",
      subtitle: "Deterministic domain tools grounded by Gemini 1.5 Flash Chain-of-Thought reasoning",
      category: "System Topology",
      body: (
        <div className="space-y-4 py-4">
          <div className="p-4 rounded-[8px] bg-[#111214] border border-[#1b1c1e] shadow-key">
            <div className="font-mono text-xs text-white font-semibold uppercase">1. Omni Master Orchestrator Agent</div>
            <div className="text-xs text-[#9c9c9d] mt-1">
              Ingests AIS & TMS disruption signals, calculates dynamic margin ROI, evaluates safety ceilings ($10k / 85% confidence), and formats auditable Gemini CoT reasoning traces.
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-[8px] bg-[#111214] border border-[#1b1c1e] shadow-key">
              <div className="font-mono text-xs text-white font-semibold">Terminal Sub-Agent</div>
              <div className="text-[11px] text-[#9c9c9d] mt-1 leading-relaxed">
                Connects to DP World Jebel Ali Terminal 2. Cancels dry-run gate bookings (#GT-8821), secures priority STS crane discharge slots, and eliminates yard storage fines.
              </div>
            </div>

            <div className="p-4 rounded-[8px] bg-[#111214] border border-[#1b1c1e] shadow-key">
              <div className="font-mono text-xs text-white font-semibold">Customs Sub-Agent</div>
              <div className="text-[11px] text-[#9c9c9d] mt-1 leading-relaxed">
                Audits unstructured Bills of Lading against UAE FCA schedules (HS 8517.62, 3002.20), verifies Free Zone 0% duty exemptions, and generates green-lane inspection tokens.
              </div>
            </div>

            <div className="p-4 rounded-[8px] bg-[#111214] border border-[#1b1c1e] shadow-key">
              <div className="font-mono text-xs text-white font-semibold">Routing Sub-Agent</div>
              <div className="text-[11px] text-[#9c9c9d] mt-1 leading-relaxed">
                Executes Cost vs. Speed simulations, schedules dynamic 30% cargo splits via Emirates SkyCargo (DWC), and re-routes inland road carriers via the E611 freight corridor.
              </div>
            </div>
          </div>
        </div>
      )
    },

    // Slide 4: Authentic Domain Grounding
    {
      slideNum: 4,
      tag: "DOMAIN GROUNDING // DUBAI LOGISTICS ASSETS",
      title: "Deeply Localized in Dubai's Physical & Digital Infrastructure",
      subtitle: "Zero generic placeholders—built specifically for UAE trade gateways",
      category: "Authenticity & Localization",
      body: (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6 text-center">
          <div className="p-4 rounded-[8px] bg-[#111214] border border-[#1b1c1e] space-y-2 shadow-key">
            <span className="text-xl font-mono text-white font-normal">AEJEA</span>
            <div className="font-semibold text-white text-xs">DP World Jebel Ali Terminal 2</div>
            <div className="text-[10px] text-[#9c9c9d]">Berths 1–4 STS Dual-Trolley Crane scheduling & Truck Gate Appointment System.</div>
          </div>

          <div className="p-4 rounded-[8px] bg-[#111214] border border-[#1b1c1e] space-y-2 shadow-key">
            <span className="text-xl font-mono text-white font-normal">MIRSAL-II</span>
            <div className="font-semibold text-white text-xs">Dubai Customs Electronic B2G</div>
            <div className="text-[10px] text-[#9c9c9d]">Digital pre-clearance declarations, Green Lane tokens, and UAE FCA Tariff RAG.</div>
          </div>

          <div className="p-4 rounded-[8px] bg-[#111214] border border-[#1b1c1e] space-y-2 shadow-key">
            <span className="text-xl font-mono text-white font-normal">DWC / OMAM</span>
            <div className="font-semibold text-white text-xs">Emirates SkyCargo Hub</div>
            <div className="text-[10px] text-[#9c9c9d]">Al Maktoum International bonded air-sea cargo transfers & priority cold-chain charters.</div>
          </div>

          <div className="p-4 rounded-[8px] bg-[#111214] border border-[#1b1c1e] space-y-2 shadow-key">
            <span className="text-xl font-mono text-white font-normal">E611 CORRIDOR</span>
            <div className="font-semibold text-white text-xs">Dubai Heavy Freight Bypass</div>
            <div className="text-[10px] text-[#9c9c9d]">Bypasses urban peak congestion zones, linking JAFZA directly to Dubai South and DIC.</div>
          </div>
        </div>
      )
    },

    // Slide 5: Enterprise Governance & Safety
    {
      slideNum: 5,
      tag: "ENTERPRISE GOVERNANCE // RESPONSIBLE AI",
      title: "Hard Financial Ceilings & Deterministic Rollbacks",
      subtitle: "Autonomous velocity with boardroom-grade risk controls",
      category: "Safety & Governance",
      body: (
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-[8px] bg-[#111214] border border-[#ff6363]/40 space-y-2 shadow-key">
              <div className="flex items-center gap-2 text-[#ff6363] font-semibold font-mono text-xs">
                <ShieldCheck className="w-4 h-4 text-[#ff6363]" />
                <span>$10,000 Financial Ceiling Lock</span>
              </div>
              <div className="text-xs text-[#9c9c9d] leading-relaxed">
                If operational mitigation costs exceed $10,000 (e.g. emergency cold-chain air charters at $14,200), autonomous execution is locked. A human supervisor must authorize the override.
              </div>
            </div>

            <div className="p-4 rounded-[8px] bg-[#111214] border border-[#1b1c1e] space-y-2 shadow-key">
              <div className="flex items-center gap-2 text-white font-semibold font-mono text-xs">
                <ShieldCheck className="w-4 h-4 text-white" />
                <span>85% Mathematical Confidence Floor</span>
              </div>
              <div className="text-xs text-[#9c9c9d] leading-relaxed">
                If weighted multi-agent confidence drops below 85%, the system automatically flags the plan as &ldquo;I&apos;m not sure — Human Review Required&rdquo; to eliminate hallucinated actions.
              </div>
            </div>
          </div>

          <div className="p-4 rounded-[8px] bg-[#111214] border border-[#1b1c1e] flex items-center justify-between shadow-key">
            <div className="space-y-1">
              <div className="font-semibold text-white text-xs flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-[#9c9c9d]" />
                <span>1-Click Autonomous Rollback Engine</span>
              </div>
              <div className="text-[11px] text-[#9c9c9d]">
                Every autonomous action stores a pre-execution state snapshot, enabling 1-click state reversion with full audit trail compliance.
              </div>
            </div>
            <span className="px-3 py-1 rounded-[4px] bg-[#07080a] text-[#e6e6e6] font-mono text-xs border border-[#363739]">
              POST /api/decisions/rollback
            </span>
          </div>
        </div>
      )
    },

    // Slide 6: Mobile Operator Journey
    {
      slideNum: 6,
      tag: "WORKSHOP 1 ALIGNMENT // MOBILE OPERATOR PWA",
      title: "Quayside Velocity: 1-Tap Autonomous Action",
      subtitle: "Designed for port coordinators at Jebel Ali Terminal 2 on the move",
      category: "Mobile User Journey",
      body: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center py-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-white font-mono text-xs font-semibold">
              <Smartphone className="w-4 h-4 text-white" />
              <span>Responsive Web App / PWA Manifest</span>
            </div>
            <h3 className="text-lg font-semibold text-white">High-Urgency Push Notifications</h3>
            <p className="text-xs text-[#9c9c9d] leading-relaxed">
              When vessel AIS slips, the port coordinator receives an immediate alert on mobile, displaying at-risk margin ($5,400) and net savings (+$3,755).
            </p>
            <ul className="text-xs text-[#9c9c9d] space-y-1.5 font-mono">
              <li>✓ 1-Tap Autonomous Mitigation Dispatch</li>
              <li>✓ Collapsible Mobile Gemini Chain-of-Thought</li>
              <li>✓ Touch-optimized 48px tap targets</li>
              <li>✓ Instant Mobile Rollback Reversion</li>
            </ul>
          </div>

          <div className="bg-[#040506] p-4 rounded-[8px] border border-[#1b1c1e] text-center font-mono space-y-2 shadow-key">
            <div className="text-[10px] text-[#ff6363] uppercase font-semibold">LIVE MOBILE TELEMETRY VIEW</div>
            <div className="text-xs text-white font-normal">MSCU7829104: Berth 4 (+12h)</div>
            <div className="p-3 rounded-[6px] bg-[#e6e6e6] text-[#454647] text-xs font-semibold shadow-key">
              1-Tap Autonomous Fix (Save $3,755)
            </div>
            <div className="text-[10px] text-[#6a6b6c]">Verified on Chrome & Safari iOS standalone</div>
          </div>
        </div>
      )
    },

    // Slide 7: Live Venture Telemetry
    {
      slideNum: 7,
      tag: "FINANCIAL TELEMETRY // MEASURABLE OUTCOMES",
      title: "Real-Time Value Accounting on Every Container",
      subtitle: "Converting port friction into verifiable dollars saved",
      category: "Venture Impact",
      body: (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6 text-center font-mono">
          <div className="p-4 rounded-[8px] bg-[#111214] border border-[#1b1c1e] shadow-key">
            <div className="text-[10px] text-[#6a6b6c] uppercase">Demurrage Saved</div>
            <div className="text-xl font-normal text-white mt-1">$360/TEU</div>
            <div className="text-[10px] text-[#6a6b6c] mt-1">DP World Gate Rescheduled</div>
          </div>

          <div className="p-4 rounded-[8px] bg-[#111214] border border-[#1b1c1e] shadow-key">
            <div className="text-[10px] text-[#6a6b6c] uppercase">Customs Hours Saved</div>
            <div className="text-xl font-normal text-white mt-1">+6.0 hrs</div>
            <div className="text-[10px] text-[#6a6b6c] mt-1">Mirsal-II Green Lane Pre-Clear</div>
          </div>

          <div className="p-4 rounded-[8px] bg-[#111214] border border-[#1b1c1e] shadow-key">
            <div className="text-[10px] text-[#6a6b6c] uppercase">SLA Penalties Mitigated</div>
            <div className="text-xl font-normal text-white mt-1">$5,400</div>
            <div className="text-[10px] text-[#6a6b6c] mt-1">DWC Air Split & E611 Reroute</div>
          </div>

          <div className="p-4 rounded-[8px] bg-[#111214] border border-[#1b1c1e] shadow-key">
            <div className="text-[10px] text-[#6a6b6c] uppercase">Margin ROI</div>
            <div className="text-xl font-normal text-white mt-1">+228%</div>
            <div className="text-[10px] text-[#6a6b6c] mt-1">Net Savings / Mitigation Cost</div>
          </div>
        </div>
      )
    },

    // Slide 8: Business Model
    {
      slideNum: 8,
      tag: "BUSINESS MODEL // WORKSHOP 3 VENTURE CASE",
      title: "SaaS Subscription + 10% Performance Fee on Saved Margin",
      subtitle: "Win-Win Unit Economics: We only win when the 3PL saves money",
      category: "Commercial Model",
      body: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
          <div className="p-5 rounded-[8px] bg-[#111214] border border-[#1b1c1e] space-y-3 font-mono shadow-key">
            <div className="text-xs text-white font-semibold uppercase">Pricing Architecture</div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-normal text-white">$499</span>
              <span className="text-xs text-[#9c9c9d]">/ month base SaaS</span>
            </div>
            <div className="text-xs text-[#9c9c9d] leading-relaxed">
              + <strong className="text-white font-semibold">10% Performance Fee</strong> on verified demurrage and SLA penalties prevented by autonomous actions.
            </div>
            <div className="pt-2 text-[11px] text-[#6a6b6c] border-t border-[#1b1c1e]">
              Zero upfront Capex. Deployed in 30 minutes via legacy TMS webhooks.
            </div>
          </div>

          <div className="p-5 rounded-[8px] bg-[#111214] border border-[#1b1c1e] space-y-3 font-mono text-xs shadow-key">
            <div className="text-white font-semibold uppercase">Mid-Tier 3PL Economics (1,500 TEUs/mo)</div>
            <div className="flex justify-between text-[#9c9c9d]">
              <span>Annual Value Delivered:</span>
              <span className="font-normal text-white">$1,114,800</span>
            </div>
            <div className="flex justify-between text-[#9c9c9d]">
              <span>Omni-Logistics ARR:</span>
              <span className="font-normal text-white">$165,480</span>
            </div>
            <div className="flex justify-between text-[#9c9c9d]">
              <span>3PL Net Savings:</span>
              <span className="font-normal text-white">$949,320</span>
            </div>
            <div className="pt-2 flex justify-between font-semibold text-white border-t border-[#1b1c1e] text-sm">
              <span>Client ROI Multiple:</span>
              <span>8.4x ROI</span>
            </div>
          </div>
        </div>
      )
    },

    // Slide 9: Go-To-Market
    {
      slideNum: 9,
      tag: "GO-TO-MARKET // DUBAI CHAMBERS MARKETPLACE",
      title: "Plug-and-Play Distribution via Dubai Chambers Agentic AI Marketplace",
      subtitle: "Pre-integrated TMS/ERP webhooks for friction-free enterprise adoption",
      category: "Distribution & Connectors",
      body: (
        <div className="space-y-4 py-4">
          <div className="p-4 rounded-[8px] bg-[#111214] border border-[#1b1c1e] flex items-center justify-between shadow-key">
            <div className="flex items-center gap-3">
              <Globe className="w-5 h-5 text-white" />
              <div>
                <div className="font-semibold text-white text-xs">Dubai Chambers Agentic AI Marketplace Manifest</div>
                <div className="text-[11px] text-[#9c9c9d]">Live API endpoint: <code className="text-white">GET /api/marketplace/manifest</code></div>
              </div>
            </div>
            <span className="px-3 py-1 rounded-[4px] bg-[#07080a] text-white font-mono text-xs border border-[#363739] font-semibold">
              Listed & Ready
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center text-xs font-mono">
            <div className="p-3 rounded-[6px] bg-[#07080a] border border-[#1b1c1e] shadow-key">
              <div className="font-normal text-white">CargoWise One</div>
              <div className="text-[10px] text-[#9c9c9d] mt-1">eAdaptor REST / Webhooks</div>
            </div>
            <div className="p-3 rounded-[6px] bg-[#07080a] border border-[#1b1c1e] shadow-key">
              <div className="font-normal text-white">SAP TM</div>
              <div className="text-[10px] text-[#9c9c9d] mt-1">OData v4 Event Mesh</div>
            </div>
            <div className="p-3 rounded-[6px] bg-[#07080a] border border-[#1b1c1e] shadow-key">
              <div className="font-normal text-white">Oracle OTM</div>
              <div className="text-[10px] text-[#9c9c9d] mt-1">REST XML Webhooks</div>
            </div>
            <div className="p-3 rounded-[6px] bg-[#07080a] border border-[#1b1c1e] shadow-key">
              <div className="font-normal text-white">Dubai Trade</div>
              <div className="text-[10px] text-[#9c9c9d] mt-1">Mirsal-II B2G Gateway</div>
            </div>
          </div>
        </div>
      )
    },

    // Slide 10: Validation & Roadmap
    {
      slideNum: 10,
      tag: "VALIDATION & ROADMAP // READY FOR PILOT",
      title: "15/15 Tests Passing • Zero Cost Stack • Pilot Ready",
      subtitle: "Finished one full week ahead of Championship Masterclass 1",
      category: "Milestone Sign-Off",
      body: (
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center font-mono">
            <div className="p-4 rounded-[8px] bg-[#111214] border border-[#1b1c1e] shadow-key">
              <div className="text-xl font-normal text-white">15 / 15</div>
              <div className="text-xs text-[#9c9c9d] mt-1 font-sans">Automated Pytest Suite</div>
              <div className="text-[10px] text-[#6a6b6c] mt-0.5">100% Green Test Coverage</div>
            </div>

            <div className="p-4 rounded-[8px] bg-[#111214] border border-[#1b1c1e] shadow-key">
              <div className="text-xl font-normal text-white">0 Errors</div>
              <div className="text-xs text-[#9c9c9d] mt-1 font-sans">Next.js 14 Production Build</div>
              <div className="text-[10px] text-[#6a6b6c] mt-0.5">SSR + PWA Optimized</div>
            </div>

            <div className="p-4 rounded-[8px] bg-[#111214] border border-[#1b1c1e] shadow-key">
              <div className="text-xl font-normal text-white">1-Command</div>
              <div className="text-xs text-[#9c9c9d] mt-1 font-sans">Docker Compose Ready</div>
              <div className="text-[10px] text-[#6a6b6c] mt-0.5">Zero-Friction Local Spinup</div>
            </div>
          </div>

          <div className="p-4 rounded-[8px] bg-[#111214] border border-[#1b1c1e] space-y-2 text-xs shadow-key">
            <div className="font-semibold text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-white" />
              <span>Next Step: 90-Day JAFZA & Dubai South Pilot Execution</span>
            </div>
            <p className="text-[#9c9c9d] text-[11px] leading-relaxed">
              With the $150,000 USD growth grant from Dubai Chamber of Digital Economy, we will deploy real-time DP World Terminal 2 API bridges, onboard 3 pilot 3PL forwarders in JAFZA, and scale multi-agent autonomous recovery across 25,000 TEUs in 2027.
            </p>
          </div>
        </div>
      )
    }
  ];

  const current = slides[currentSlide];

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        if (currentSlide < slides.length - 1) setCurrentSlide(c => c + 1);
      } else if (e.key === 'ArrowLeft') {
        if (currentSlide > 0) setCurrentSlide(c => c - 1);
      } else if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentSlide, slides.length, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-[#040506]/90 backdrop-blur-md animate-in fade-in duration-200 print:p-0 print:bg-white">
      <div className="bg-[#07080a] border border-[#1b1c1e] rounded-[8px] w-full max-w-4xl overflow-hidden shadow-key flex flex-col max-h-[92vh] print:border-none print:shadow-none print:max-h-full print:bg-white print:text-black">
        {/* Header */}
        <div className="bg-[#111214] border-b border-[#1b1c1e] px-6 py-4 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-[6px] bg-[#1b1c1e] text-white border border-[#2f3031] shadow-key">
              <Layers className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-[10px] font-mono text-[#ff6363] uppercase tracking-widest font-semibold">
                CHAMPIONSHIP PITCH DECK // 10 SLIDES
              </div>
              <h3 className="text-base font-normal text-white">
                Omni-Logistics Master Agent (Dubai Chamber Track)
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-[6px] bg-[#111214] hover:bg-[#1b1c1e] text-[#9c9c9d] hover:text-white border border-[#363739] shadow-key transition"
              title="Print or Save Presentation as PDF"
            >
              <Printer className="w-3.5 h-3.5 text-white" />
              <span>Export / Print PDF</span>
            </button>

            <button
              onClick={onClose}
              className="text-[#9c9c9d] hover:text-white p-1.5 rounded-[6px] hover:bg-[#1b1c1e] border border-transparent hover:border-[#363739] transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Slide Content Area */}
        <div className="p-6 md:p-8 flex-1 overflow-y-auto space-y-4 print:p-4">
          <div className="border-b border-[#1b1c1e] pb-3">
            <span className="text-[10px] font-mono font-semibold text-[#ff6363] uppercase tracking-widest block">
              {current.tag}
            </span>
            <h2 className="text-xl md:text-2xl font-normal text-white tracking-tight mt-1">
              {current.title}
            </h2>
            <p className="text-xs text-[#9c9c9d] mt-0.5">
              {current.subtitle}
            </p>
          </div>

          <div>
            {current.body}
          </div>
        </div>

        {/* Footer Navigation Bar */}
        <div className="bg-[#07080a] border-t border-[#1b1c1e] px-6 py-3.5 flex items-center justify-between print:hidden">
          <div className="text-xs font-mono text-[#6a6b6c]">
            Slide <span className="text-white font-normal">{current.slideNum}</span> of {slides.length}
          </div>

          {/* Dots */}
          <div className="flex items-center gap-1.5">
            {slides.map((s, idx) => (
              <button
                key={s.slideNum}
                onClick={() => setCurrentSlide(idx)}
                className={`h-2 rounded-full transition-all ${
                  idx === currentSlide ? 'w-6 bg-[#e6e6e6]' : 'w-2 bg-[#2f3031] hover:bg-[#454647]'
                }`}
                title={`Jump to Slide ${s.slideNum}`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentSlide(c => Math.max(0, c - 1))}
              disabled={currentSlide === 0}
              className="p-2 rounded-[6px] bg-[#111214] hover:bg-[#1b1c1e] text-[#9c9c9d] hover:text-white border border-[#363739] disabled:opacity-40 transition shadow-key"
              title="Previous Slide (or Left Arrow)"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              onClick={() => setCurrentSlide(c => Math.min(slides.length - 1, c + 1))}
              disabled={currentSlide === slides.length - 1}
              className="p-2 rounded-[6px] bg-[#e6e6e6] hover:bg-white text-[#454647] font-semibold border border-[#e6e6e6] disabled:opacity-40 transition shadow-key"
              title="Next Slide (or Right Arrow)"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
