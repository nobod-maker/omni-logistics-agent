'use client';

import React, { useState } from 'react';
import { 
  X, 
  TrendingUp, 
  Calculator,
  Download,
  Sparkles
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#040506]/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#07080a] border border-[#1b1c1e] rounded-[8px] w-full max-w-3xl overflow-hidden shadow-key flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-[#111214] border-b border-[#1b1c1e] px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#1b1c1e] text-[#9c9c9d] border border-[#2f3031] rounded-[6px] shadow-key">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-xs font-mono uppercase tracking-widest text-[#9c9c9d] font-semibold">
                COMMERCIAL VENTURE CASE // DUBAI CHAMBER CHAMPIONSHIP
              </div>
              <h3 className="text-base font-normal text-white">
                3PL ROI Simulator & Unit Economics Engine
              </h3>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-[#9c9c9d] hover:text-white p-1 rounded-[6px] hover:bg-[#1b1c1e] border border-transparent hover:border-[#363739] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body / Dark Bento Grid */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {/* Bento Card 1: Interactive Volume Slider */}
          <div className="bg-[#111214] border border-[#1b1c1e] rounded-[8px] p-5 space-y-3 shadow-key">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-xs font-semibold text-white uppercase tracking-wider font-mono">
                  3PL Monthly Container Volume (TEUs):
                </label>
                <div className="text-[11px] text-[#9c9c9d]">
                  Target: Medium to Large Freight Forwarders operating via Jebel Ali Port & Free Zones
                </div>
              </div>
              <div className="text-right">
                <span className="text-2xl font-normal font-mono text-white">{monthlyTeu.toLocaleString('en-US')}</span>
                <span className="text-xs font-mono text-[#9c9c9d] ml-1.5">TEUs/mo</span>
              </div>
            </div>

            <input
              type="range"
              min="100"
              max="10000"
              step="100"
              value={monthlyTeu}
              onChange={(e) => setMonthlyTeu(Number(e.target.value))}
              className="w-full h-2 bg-[#040506] border border-[#2f3031] rounded-lg appearance-none cursor-pointer accent-[#e6e6e6]"
            />

            <div className="flex justify-between text-[10px] font-mono text-[#6a6b6c]">
              <span>Boutique Forwarder (100 TEUs)</span>
              <span>Mid-Market (1,500 TEUs)</span>
              <span>Regional 3PL Major (10,000 TEUs)</span>
            </div>
          </div>

          {/* Bento Cards 2, 3, 4: Value Delivered Scorecard */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-4 rounded-[8px] bg-[#111214] border border-[#1b1c1e] text-center shadow-key">
              <div className="text-[10px] font-mono text-[#6a6b6c] uppercase">Annual Demurrage Avoided</div>
              <div className="text-lg font-normal font-mono text-white mt-1">
                ${annualDemurrageSaved.toLocaleString('en-US')}
              </div>
              <div className="text-[10px] font-mono text-[#6a6b6c] mt-0.5">
                {annualDisruptions.toLocaleString('en-US')} Boxes @ $360/box
              </div>
            </div>

            <div className="p-4 rounded-[8px] bg-[#111214] border border-[#1b1c1e] text-center shadow-key">
              <div className="text-[10px] font-mono text-[#6a6b6c] uppercase">Customs Time Recovered</div>
              <div className="text-lg font-normal font-mono text-white mt-1">
                +{annualCustomsHoursSaved.toLocaleString('en-US')} hrs
              </div>
              <div className="text-[10px] font-mono text-[#6a6b6c] mt-0.5">
                Mirsal-II Automated Green Lane
              </div>
            </div>

            <div className="p-4 rounded-[8px] bg-[#111214] border border-[#1b1c1e] text-center shadow-key">
              <div className="text-[10px] font-mono text-[#6a6b6c] uppercase">Gross SLA Penalties Mitigated</div>
              <div className="text-lg font-normal font-mono text-white mt-1">
                ${annualSlaProtected.toLocaleString('en-US')}
              </div>
              <div className="text-[10px] font-mono text-[#6a6b6c] mt-0.5">
                Saved via DWC Split & E611
              </div>
            </div>
          </div>

          {/* Bento Card 5: Revenue & Unit Economics Matrix */}
          <div className="p-5 rounded-[8px] bg-[#111214] border border-[#1b1c1e] shadow-key space-y-4">
            <div className="flex items-center justify-between border-b border-[#1b1c1e] pb-3">
              <div className="flex items-center gap-2">
                <Calculator className="w-4 h-4 text-[#9c9c9d]" />
                <span className="font-semibold text-white text-sm">Monetization & Client ROI Multiple</span>
              </div>
              <span className="px-3 py-1 rounded-[4px] font-mono text-xs font-semibold bg-[#1b1c1e] text-[#e6e6e6] border border-[#363739]">
                {roiMultiple}x Client ROI
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="space-y-2 bg-[#07080a] p-3.5 rounded-[6px] border border-[#1b1c1e] shadow-key">
                <span className="font-mono font-semibold text-white text-[11px] uppercase block">
                  Omni-Logistics ARR Generated:
                </span>
                <div className="flex justify-between text-[#9c9c9d] font-mono text-[11px]">
                  <span>Base SaaS ($4,500/mo):</span>
                  <span>${annualBaseSaas.toLocaleString('en-US')}</span>
                </div>
                <div className="flex justify-between text-[#9c9c9d] font-mono text-[11px]">
                  <span>10% Performance Fee:</span>
                  <span>+${annualPerformanceFee.toLocaleString('en-US', { maximumFractionDigits: 0 })}</span>
                </div>
                <div className="flex justify-between text-white font-mono font-semibold pt-1.5 border-t border-[#1b1c1e]">
                  <span>Total ACV / ARR:</span>
                  <span>${omniAnnualRevenue.toLocaleString('en-US', { maximumFractionDigits: 0 })}/yr</span>
                </div>
              </div>

              <div className="space-y-2 bg-[#07080a] p-3.5 rounded-[6px] border border-[#1b1c1e] shadow-key">
                <span className="font-mono font-semibold text-white text-[11px] uppercase block">
                  Client 3PL Financial Impact:
                </span>
                <div className="flex justify-between text-[#9c9c9d] font-mono text-[11px]">
                  <span>Total Margin Protected:</span>
                  <span>${totalAnnualValue.toLocaleString('en-US')}</span>
                </div>
                <div className="flex justify-between text-[#9c9c9d] font-mono text-[11px]">
                  <span>Less Omni Platform Cost:</span>
                  <span>-${omniAnnualRevenue.toLocaleString('en-US', { maximumFractionDigits: 0 })}</span>
                </div>
                <div className="flex justify-between text-white font-mono font-semibold pt-1.5 border-t border-[#1b1c1e]">
                  <span>Net Annual Profit Added:</span>
                  <span>+${clientNetSavings.toLocaleString('en-US', { maximumFractionDigits: 0 })}/yr</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bento Card 6: Strategic Market Sizing for Championship Jury */}
          <div className="p-4 rounded-[8px] bg-[#111214] border border-[#1b1c1e] shadow-key text-xs text-[#9c9c9d] space-y-2">
            <div className="font-semibold text-white flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#ff6363]" />
              <span>Dubai Hub Market TAM & Scalability:</span>
            </div>
            <p className="leading-relaxed text-[11px] text-[#9c9c9d]">
              Jebel Ali Port handles over <strong className="text-white font-semibold">14.0 Million TEUs annually</strong> across 90+ container shipping lines. Capturing just <strong className="text-white font-semibold">1.5% market penetration</strong> (210,000 TEUs) yields <strong className="text-white font-mono font-semibold">$11.8M ARR</strong> while protecting over $85M in supply chain margins for UAE trade operators.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-[#1b1c1e] bg-[#07080a] flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-[6px] border border-[#363739] text-xs font-medium text-[#9c9c9d] hover:text-white hover:bg-[#111214] shadow-key transition"
          >
            Close Simulator
          </button>

          <button
            onClick={handleExportPlan}
            className="flex items-center gap-2 px-5 py-2 rounded-[6px] bg-[#e6e6e6] hover:bg-white text-[#454647] font-semibold text-xs shadow-key transition"
          >
            <Download className="w-4 h-4" />
            <span>Export 3PL Venture Case (.JSON)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
