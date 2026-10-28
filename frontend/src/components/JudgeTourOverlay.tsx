'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  X, 
  ChevronRight, 
  ChevronLeft, 
  Play, 
  Pause, 
  RotateCcw, 
  Sparkles, 
  Award, 
  Ship, 
  FileText, 
  ShieldAlert, 
  Smartphone, 
  TrendingUp,
  Volume2
} from 'lucide-react';

export interface JudgeTourStep {
  stepNumber: number;
  phase: string;
  badgeColor: string;
  title: string;
  rubricCriterion: string;
  teleprompterNarration: string;
  targetFocus: string;
  durationSeconds: number;
}

export const TOUR_STEPS: JudgeTourStep[] = [
  {
    stepNumber: 1,
    phase: 'DEFINE',
    badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
    title: 'The $4.2B Dubai Port & Free Zone Friction',
    rubricCriterion: 'Problem Statement & Strategic Dubai Alignment',
    teleprompterNarration: 'DP World Jebel Ali Port handles 14M+ TEUs annually, but 8.5% of inbound containers face sudden berth fog delays, customs holds, and demurrage fines of $180-$360/day. Omni-Logistics transforms disconnected spreadsheets into an autonomous, governed Control Tower.',
    targetFocus: 'Corridor Telemetry Radar Map & Top KPI Ribbon',
    durationSeconds: 10
  },
  {
    stepNumber: 2,
    phase: 'BUILD',
    badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
    title: 'Multi-Agent AIS Delay Resolution (MSCU7829104)',
    rubricCriterion: 'Multi-Agent Architecture & Gemini 1.5 Flash CoT',
    teleprompterNarration: 'When AIS signals a 12-hour fog slip on vessel MSC Zoe, our Master Orchestrator mobilizes Terminal, Customs, and Routing sub-agents. It reschedules STS crane windows, issues digital pre-clearances, and routes an air split via DWC, saving $3,755 in net margin.',
    targetFocus: 'Disruption Anomaly & Multi-Agent CoT Drawer',
    durationSeconds: 12
  },
  {
    stepNumber: 3,
    phase: 'PAPERWORK',
    badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
    title: 'Autonomous Mirsal-II BoL & Customs Pre-Clearance',
    rubricCriterion: 'Domain Grounding: Dubai Trade Mirsal-II Gateway',
    teleprompterNarration: 'Our autonomous BoL engine ingests unstructured shipping manifests, queries the UAE Federal Customs Harmonized Tariff Schedule (HS 8517.62), applies 0% Free Zone duty exemptions, and outputs an immutable SHA-256 hashed digital declaration in under 2 seconds.',
    targetFocus: 'Customs Pre-Clearance Modal & Digital Declaration Card',
    durationSeconds: 11
  },
  {
    stepNumber: 4,
    phase: 'SAFETY',
    badgeColor: 'bg-red-500/20 text-red-300 border-red-500/40',
    title: 'Enterprise Safety: >$10,000 Ceiling & 1-Click Rollback',
    rubricCriterion: 'Responsible AI, Human-in-the-Loop & Governance',
    teleprompterNarration: 'Safety is non-negotiable. When an emergency cold-chain vaccine crisis (MAEU9182301) requires a $14,200 air charter split, the system locks autonomous dispatch. A human supervisor must authorize the override, with complete 1-click state rollback capability.',
    targetFocus: 'Cold-Chain Supervisor Lock & Rollback Engine',
    durationSeconds: 12
  },
  {
    stepNumber: 5,
    phase: 'MOBILE',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    title: 'Workshop 1: Quayside Mobile Operator Journey',
    rubricCriterion: 'Mobile User Experience & Quayside Operational Velocity',
    teleprompterNarration: 'Tailored for on-the-ground port coordinators at Jebel Ali Terminal 2, our responsive PWA delivers real-time push alerts, 1-tap autonomous mitigation dispatch, and transparent access to Gemini reasoning traces right on quayside smartphones.',
    targetFocus: 'Mobile Operator PWA (1-Tap Approval Interface)',
    durationSeconds: 10
  },
  {
    stepNumber: 6,
    phase: 'TRANSFORM',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    title: 'Commercial Venture Case & Agentic Marketplace',
    rubricCriterion: 'Venture Monetization, Unit Economics & 8.4x ROI',
    teleprompterNarration: 'For a mid-sized 3PL handling 1,500 TEUs/month, Omni-Logistics protects $1.1M in annual client margin. Monetized via a $499/mo base SaaS + 10% saved demurrage fee, we deliver $160k ARR with an 8.4x client ROI multiple—ready for the Dubai Chambers Marketplace.',
    targetFocus: 'Venture ROI Simulator & Pricing Engine',
    durationSeconds: 12
  }
];

interface JudgeTourOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onExecuteTourStep: (stepNumber: number) => void;
}

export const JudgeTourOverlay: React.FC<JudgeTourOverlayProps> = ({
  isOpen,
  onClose,
  onExecuteTourStep,
}) => {
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(TOUR_STEPS[0].durationSeconds);

  const step = TOUR_STEPS[currentStepIdx];

  // Sync execution when step changes
  useEffect(() => {
    if (isOpen) {
      onExecuteTourStep(step.stepNumber);
      setTimeLeft(step.durationSeconds);
    }
  }, [currentStepIdx, isOpen, onExecuteTourStep, step.stepNumber, step.durationSeconds]);

  // Auto-play timer
  useEffect(() => {
    if (!isOpen || !isPlaying) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (currentStepIdx < TOUR_STEPS.length - 1) {
            setCurrentStepIdx((s) => s + 1);
            return TOUR_STEPS[currentStepIdx + 1].durationSeconds;
          } else {
            setIsPlaying(false);
            return 0;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, isPlaying, currentStepIdx]);

  const handleNext = () => {
    if (currentStepIdx < TOUR_STEPS.length - 1) {
      setCurrentStepIdx(currentStepIdx + 1);
    }
  };

  const handlePrev = () => {
    if (currentStepIdx > 0) {
      setCurrentStepIdx(currentStepIdx - 1);
    }
  };

  const handleRestart = () => {
    setCurrentStepIdx(0);
    setTimeLeft(TOUR_STEPS[0].durationSeconds);
    setIsPlaying(true);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 max-w-5xl mx-auto animate-in slide-in-from-bottom duration-300">
      <div className="bg-[#0A0F1D]/95 border-2 border-emerald-500/60 rounded-2xl shadow-2xl backdrop-blur-md overflow-hidden p-4 md:p-5 text-white">
        {/* Top Control Bar */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
          <div className="flex items-center gap-2.5">
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-emerald-400" />
              <span className="font-bold text-xs uppercase tracking-wider text-emerald-300 font-mono">
                DUBAI CHAMBER JUDGE DEMO TOUR // STEP {step.stepNumber} OF 6
              </span>
            </div>
            <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${step.badgeColor}`}>
              {step.phase}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Step Indicators */}
            <div className="hidden sm:flex items-center gap-1.5">
              {TOUR_STEPS.map((s, idx) => (
                <button
                  key={s.stepNumber}
                  onClick={() => setCurrentStepIdx(idx)}
                  className={`h-2 rounded-full transition-all ${
                    idx === currentStepIdx
                      ? 'w-6 bg-emerald-400'
                      : idx < currentStepIdx
                      ? 'w-2 bg-emerald-600/70'
                      : 'w-2 bg-slate-700'
                  }`}
                  title={`Step ${s.stepNumber}: ${s.title}`}
                />
              ))}
            </div>

            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              title="Exit Tour"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Step Body & Live Teleprompter Narration */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
          {/* Left Column: Title & Rubric Focus */}
          <div className="lg:col-span-4 space-y-1">
            <div className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider">
              {step.rubricCriterion}
            </div>
            <h4 className="text-base font-bold text-white tracking-tight leading-snug">
              {step.title}
            </h4>
            <div className="text-[11px] font-mono text-slate-400">
              Active Focus: <span className="text-slate-200 font-medium">{step.targetFocus}</span>
            </div>
          </div>

          {/* Center Column: Teleprompter Caption Box */}
          <div className="lg:col-span-5 bg-slate-950/80 border border-slate-800 rounded-xl p-3 text-xs leading-relaxed font-sans text-slate-200 relative">
            <div className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-400 mb-1">
              <Volume2 className="w-3 h-3 text-emerald-400 animate-pulse" />
              <span>JUDGE DEMO SCRIPT (60s NARRATION):</span>
            </div>
            <p className="italic text-slate-300">
              &ldquo;{step.teleprompterNarration}&rdquo;
            </p>
          </div>

          {/* Right Column: Playback Controls */}
          <div className="lg:col-span-3 flex flex-col items-center sm:items-end justify-center gap-2">
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                disabled={currentStepIdx === 0}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 disabled:opacity-40 transition"
                title="Previous Step"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition shadow-lg ${
                  isPlaying 
                    ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-glow' 
                    : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-glow'
                }`}
                title={isPlaying ? 'Pause Auto-Play' : 'Auto-Play 60s Tour'}
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{isPlaying ? `Auto (${timeLeft}s)` : 'Auto-Play'}</span>
              </button>

              <button
                onClick={handleNext}
                disabled={currentStepIdx === TOUR_STEPS.length - 1}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 disabled:opacity-40 transition"
                title="Next Step"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              <button
                onClick={handleRestart}
                className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
                title="Restart Tour from Step 1"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            <div className="text-[10px] font-mono text-slate-400">
              {currentStepIdx === TOUR_STEPS.length - 1 ? (
                <span className="text-emerald-400 font-bold">✓ Tour Complete!</span>
              ) : (
                <span>Next: {TOUR_STEPS[currentStepIdx + 1].phase} ({TOUR_STEPS[currentStepIdx + 1].title.slice(0, 24)}...)</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
