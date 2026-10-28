'use client';

import React, { useState } from 'react';
import { 
  X, 
  TrendingUp, 
  DollarSign, 
  ShieldCheck, 
  Clock, 
  BarChart3, 
  Calculator,
  Download,
  Layers,
  Sparkles,
  ChevronRight
} from 'lucide-react';

interface VentureCaseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VentureCaseModal: React.FC<VentureCaseModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [monthlyTeu, setMonthlyTeu] = useState<number>(1500);

  if (!isOpen) return null;

  // Real-world Dubai Free Zone / Port Logistics assumptions
  const disruptionRate = 0.085; // 8.5% of containers face AIS delay / customs hold
  const monthlyDisruptions = Math.round(monthlyTeu * disruptionRate);
  const annualDisruptions = monthlyDisruptions * 12;

  // Savings calculus
  const demurragePerContainer = 360; // Average Jebel Ali port storage penalty per delayed box
  const customsHoursPerContainer = 6; // Hours saved by autonomous Mirsal-II digital pre-clearance
  const slaMitigatedPerDisruption = 4500; // Customer SLA penalty avoided by automated rerouting

  const annualDemurrageSaved = annualDisruptions * demurragePerContainer;
  const annualCustomsHoursSaved = annualDisruptions * customsHoursPerContainer;
  const annualSlaProtected = annualDisruptions * slaMitigatedPerDisruption;
  const totalAnnualValue = annualDemurrageSaved + annualSlaProtected;

  // Omni-Logistics SaaS + Performance Fee Model
  const annualBaseSaas = 54000; // $4,500/month enterprise control tower tier
  const performanceFeeRate = 0.10; // 10% of verified savings
  const annualPerformanceFee = totalAnnualValue * performanceFeeRate;
  const omniAnnualRevenue = annualBaseSaas + annualPerformanceFee;

  const clientNetSavings = totalAnnualValue - omniAnnualRevenue;
  const roiMultiple = omniAnnualRevenue > 0 ? (totalAnnualValue / omniAnnualRevenue).toFixed(1) : '0';

  const handleExportPlan = () => {
    const report = {
      title: "Omni-Logistics Venture ROI & 3PL Unit Economics Model",
      championship_track: "Dubai Chamber of Digital Economy - Best Business AI Agent ($150,000 USD Grant)",
      parameters: {
        monthly_teu_volume: monthlyTeu,
        annual_teu_volume: monthlyTeu * 12,
        corridor_disruption_rate_pct: disruptionRate * 100,
        annual_anomalies_managed: annualDisruptions
      },
      client_value_delivered: {
        annual_demurrage_saved_usd: annualDemurrageSaved,
        annual_customs_preclearance_hours_saved: annualCustomsHoursSaved,
        annual_sla_penalties_prevented_usd: annualSlaProtected,
        total_gross_margin_protected_usd: totalAnnualValue,
        client_net_savings_usd: clientNetSavings,
        client_roi_multiple: `${roiMultiple}x`
      },
      omni_logistics_saas_monetization: {
        base_annual_platform_fee_usd: annualBaseSaas,
        autonomous_performance_fee_10pct_usd: annualPerformanceFee,
        total_annual_contract_value_usd: omniAnnualRevenue
      },
      unit_economics: {
        customer_acquisition_cost_est: "$18,500",
        payback_period_months: "3.2 months",
        gross_margin: "84%"
      }
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `omni-venture-roi-${monthlyTeu}teu.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#0A0F1D] border border-cyan-500/40 rounded-2xl w-full max-w-3xl overflow-hidden shadow-cyan-glow flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-cyan-950/40 border-b border-cyan-500/30 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-tr from-cyan-600 to-emerald-500 text-white rounded-lg">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-bold">
                COMMERCIAL VENTURE CASE // DUBAI CHAMBER CHAMPIONSHIP
              </div>
              <h3 className="text-base font-bold text-white">
                3PL ROI Simulator & Unit Economics Engine
              </h3>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* Interactive Volume Slider */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                  3PL Monthly Container Volume (TEUs):
                </label>
                <div className="text-[11px] text-slate-400">
                  Target: Medium to Large Freight Forwarders operating via Jebel Ali Port & Free Zones
                </div>
              </div>
              <div className="text-right">
                <span className="text-2xl font-bold font-mono text-cyan-400">{monthlyTeu.toLocaleString('en-US')}</span>
                <span className="text-xs font-mono text-slate-400 ml-1.5">TEUs/mo</span>
              </div>
            </div>

            <input
              type="range"
              min="100"
              max="10000"
              step="100"
              value={monthlyTeu}
              onChange={(e) => setMonthlyTeu(Number(e.target.value))}
              className="w-full h-2 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />

            <div className="flex justify-between text-[10px] font-mono text-slate-500">
              <span>Boutique Forwarder (100 TEUs)</span>
              <span>Mid-Market (1,500 TEUs)</span>
              <span>Regional 3PL Major (10,000 TEUs)</span>
            </div>
          </div>

          {/* Value Delivered Scorecard */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-center">
              <div className="text-[10px] font-mono text-slate-400 uppercase">Annual Demurrage Avoided</div>
              <div className="text-lg font-bold font-mono text-cyan-400 mt-1">
                ${annualDemurrageSaved.toLocaleString('en-US')}
              </div>
              <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                {annualDisruptions.toLocaleString('en-US')} Boxes @ $360/box
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-center">
              <div className="text-[10px] font-mono text-slate-400 uppercase">Customs Time Recovered</div>
              <div className="text-lg font-bold font-mono text-emerald-400 mt-1">
                +{annualCustomsHoursSaved.toLocaleString('en-US')} hrs
              </div>
              <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                Mirsal-II Automated Green Lane
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-center">
              <div className="text-[10px] font-mono text-slate-400 uppercase">Gross SLA Penalties Mitigated</div>
              <div className="text-lg font-bold font-mono text-amber-400 mt-1">
                ${annualSlaProtected.toLocaleString('en-US')}
              </div>
              <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                Saved via DWC Split & E611
              </div>
            </div>
          </div>

          {/* Revenue & Unit Economics Matrix */}
          <div className="p-5 rounded-xl bg-gradient-to-br from-cyan-950/30 via-slate-900 to-slate-950 border border-cyan-500/40 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <div className="flex items-center gap-2">
                <Calculator className="w-4 h-4 text-cyan-400" />
                <span className="font-bold text-white text-sm">Monetization & Client ROI Multiple</span>
              </div>
              <span className="px-3 py-1 rounded-full font-mono text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                {roiMultiple}x Client ROI
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="space-y-2 bg-slate-950/80 p-3.5 rounded-lg border border-slate-800">
                <span className="font-mono font-bold text-cyan-300 text-[11px] uppercase block">
                  Omni-Logistics ARR Generated:
                </span>
                <div className="flex justify-between text-slate-300 font-mono text-[11px]">
                  <span>Base SaaS ($4,500/mo):</span>
                  <span>${annualBaseSaas.toLocaleString('en-US')}</span>
                </div>
                <div className="flex justify-between text-slate-300 font-mono text-[11px]">
                  <span>10% Performance Fee:</span>
                  <span>+${annualPerformanceFee.toLocaleString('en-US', { maximumFractionDigits: 0 })}</span>
                </div>
                <div className="flex justify-between text-emerald-400 font-mono font-bold pt-1.5 border-t border-slate-800">
                  <span>Total ACV / ARR:</span>
                  <span>${omniAnnualRevenue.toLocaleString('en-US', { maximumFractionDigits: 0 })}/yr</span>
                </div>
              </div>

              <div className="space-y-2 bg-slate-950/80 p-3.5 rounded-lg border border-slate-800">
                <span className="font-mono font-bold text-emerald-300 text-[11px] uppercase block">
                  Client 3PL Financial Impact:
                </span>
                <div className="flex justify-between text-slate-300 font-mono text-[11px]">
                  <span>Total Margin Protected:</span>
                  <span>${totalAnnualValue.toLocaleString('en-US')}</span>
                </div>
                <div className="flex justify-between text-slate-300 font-mono text-[11px]">
                  <span>Less Omni Platform Cost:</span>
                  <span>-${omniAnnualRevenue.toLocaleString('en-US', { maximumFractionDigits: 0 })}</span>
                </div>
                <div className="flex justify-between text-emerald-400 font-mono font-bold pt-1.5 border-t border-slate-800">
                  <span>Net Annual Profit Added:</span>
                  <span>+${clientNetSavings.toLocaleString('en-US', { maximumFractionDigits: 0 })}/yr</span>
                </div>
              </div>
            </div>
          </div>

          {/* Strategic Market Sizing for Championship Jury */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300 space-y-2">
            <div className="font-bold text-white flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Dubai Hub Market TAM & Scalability:</span>
            </div>
            <p className="leading-relaxed text-[11px] text-slate-400">
              Jebel Ali Port handles over <strong className="text-slate-200">14.0 Million TEUs annually</strong> across 90+ container shipping lines. Capturing just <strong className="text-cyan-300">1.5% market penetration</strong> (210,000 TEUs) yields <strong className="text-emerald-400 font-mono">$11.8M ARR</strong> while protecting over $85M in supply chain margins for UAE trade operators.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-slate-800 bg-[#070B14] flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-700 text-xs font-medium text-slate-300 hover:bg-slate-800 transition"
          >
            Close Simulator
          </button>

          <button
            onClick={handleExportPlan}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-xs shadow-emerald-glow transition"
          >
            <Download className="w-4 h-4" />
            <span>Export 3PL Venture Case (.JSON)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
