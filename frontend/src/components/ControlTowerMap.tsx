'use client';

import React from 'react';
import { 
  Ship, 
  Truck, 
  Plane, 
  MapPin, 
  Anchor, 
  ShieldAlert, 
  CheckCircle,
  Clock,
  Compass
} from 'lucide-react';
import { Shipment } from '@/types';

interface ControlTowerMapProps {
  shipments: Shipment[];
  selectedShipmentId?: string;
  onSelectShipment: (shipment: Shipment) => void;
}

export const ControlTowerMap: React.FC<ControlTowerMapProps> = ({
  shipments,
  selectedShipmentId,
  onSelectShipment,
}) => {
  return (
    <div className="bg-[#0A0F1D] border border-slate-800 rounded-xl p-5 relative overflow-hidden flex flex-col h-full min-h-[460px]">
      {/* Header Bar */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-3 z-10">
        <div className="flex items-center space-x-2">
          <Compass className="w-4 h-4 text-cyan-400" />
          <h2 className="text-sm font-semibold text-slate-200 tracking-wide uppercase font-mono">
            Dubai Port-to-Inland Corridor Telemetry Map
          </h2>
        </div>
        <div className="flex items-center gap-3 text-xs font-mono">
          <span className="flex items-center gap-1.5 text-cyan-400">
            <span className="w-2 h-2 rounded-full bg-cyan-400 inline-block"></span> Normal Transit
          </span>
          <span className="flex items-center gap-1.5 text-amber-400">
            <span className="w-2 h-2 rounded-full bg-amber-400 inline-block animate-ping"></span> Delayed Anomaly
          </span>
          <span className="flex items-center gap-1.5 text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block"></span> Autonomous Fix
          </span>
        </div>
      </div>

      {/* Stylized Vector Radar Map Container */}
      <div className="relative flex-1 rounded-lg border border-slate-800/60 bg-[#070B14] p-4 overflow-hidden flex items-center justify-center">
        {/* Subtle Radar Background Grid & Concentric Rings */}
        <div className="absolute inset-0 opacity-15 pointer-events-none">
          <div className="w-full h-full bg-[radial-gradient(#06B6D4_1px,transparent_1px)] [background-size:24px_24px]"></div>
        </div>
        <div className="absolute w-[600px] h-[600px] rounded-full border border-cyan-500/10 pointer-events-none"></div>
        <div className="absolute w-[400px] h-[400px] rounded-full border border-cyan-500/15 pointer-events-none"></div>
        <div className="absolute w-[200px] h-[200px] rounded-full border border-cyan-500/20 pointer-events-none"></div>

        {/* SVG Route Corridors */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
          <defs>
            <linearGradient id="corridorGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.2" />
            </linearGradient>
            <linearGradient id="alertGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#EF4444" stopOpacity="0.4" />
            </linearGradient>
          </defs>

          {/* Jebel Ali to Dubai South (Air/Inland) */}
          <path d="M 120 220 Q 300 240 540 320" fill="none" stroke="url(#corridorGradient)" strokeWidth="2.5" strokeDasharray="4 4" className="animate-pulse" />
          
          {/* Jebel Ali to JAFZA North */}
          <path d="M 120 220 L 260 140" fill="none" stroke="#06B6D4" strokeWidth="2" opacity="0.6" />

          {/* Jebel Ali to Al Quoz Industrial */}
          <path d="M 120 220 Q 360 180 620 160" fill="none" stroke="#3B82F6" strokeWidth="2" opacity="0.5" />

          {/* Jebel Ali to DAFZA Airport Freezone */}
          <path d="M 120 220 Q 420 100 750 110" fill="none" stroke="#8B5CF6" strokeWidth="1.5" strokeDasharray="6 3" opacity="0.4" />

          {/* Jebel Ali to Dubai Industrial City */}
          <path d="M 120 220 L 320 370" fill="none" stroke="#10B981" strokeWidth="2" opacity="0.5" />
        </svg>

        {/* Port Node: Jebel Ali Port (AEJEA) */}
        <div className="absolute left-[10%] top-[46%] z-10 -translate-x-1/2 -translate-y-1/2">
          <div className="relative group cursor-pointer">
            <div className="w-16 h-16 rounded-xl bg-cyan-950/80 border-2 border-cyan-400 p-2 shadow-cyan-glow flex flex-col items-center justify-center text-center">
              <Anchor className="w-6 h-6 text-cyan-400" />
              <span className="text-[10px] font-mono font-bold text-white mt-1">JEBEL ALI</span>
            </div>
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap bg-slate-900 border border-slate-700 px-2 py-0.5 rounded text-[10px] text-slate-300 font-mono">
              Berths 1-4 • Terminal 2
            </div>
          </div>
        </div>

        {/* Destination Nodes */}

        {/* 1. JAFZA North Node */}
        <div className="absolute left-[30%] top-[28%] z-10 -translate-x-1/2 -translate-y-1/2">
          <div className="bg-slate-900/90 border border-slate-700 px-3 py-1.5 rounded-lg text-center shadow-lg">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-200">
              <MapPin className="w-3.5 h-3.5 text-cyan-400" />
              <span>JAFZA North</span>
            </div>
            <span className="text-[10px] font-mono text-cyan-400">Free Zone Duty Free</span>
          </div>
        </div>

        {/* 2. Dubai South & Al Maktoum Airport (DWC) */}
        <div className="absolute left-[62%] top-[68%] z-10 -translate-x-1/2 -translate-y-1/2">
          <div className="bg-slate-900/90 border border-slate-700 px-3 py-2 rounded-lg text-center shadow-lg">
            <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-slate-200">
              <Plane className="w-3.5 h-3.5 text-amber-400" />
              <span>Dubai South & DWC</span>
            </div>
            <div className="text-[10px] font-mono text-slate-400 mt-0.5">
              Multimodal Air/Road Corridor
            </div>
          </div>
        </div>

        {/* 3. Al Quoz Industrial Area */}
        <div className="absolute left-[70%] top-[34%] z-10 -translate-x-1/2 -translate-y-1/2">
          <div className="bg-slate-900/90 border border-slate-700 px-3 py-1.5 rounded-lg text-center shadow-lg">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-200">
              <Truck className="w-3.5 h-3.5 text-blue-400" />
              <span>Al Quoz IND-3</span>
            </div>
            <span className="text-[10px] font-mono text-slate-400">Mainland Logistics</span>
          </div>
        </div>

        {/* 4. DAFZA Airport Freezone */}
        <div className="absolute left-[84%] top-[22%] z-10 -translate-x-1/2 -translate-y-1/2">
          <div className="bg-slate-900/90 border border-slate-700 px-3 py-1.5 rounded-lg text-center shadow-lg">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-200">
              <MapPin className="w-3.5 h-3.5 text-purple-400" />
              <span>DAFZA</span>
            </div>
            <span className="text-[10px] font-mono text-purple-300">Aviation Free Zone</span>
          </div>
        </div>

        {/* 5. Dubai Industrial City (DIC) */}
        <div className="absolute left-[38%] top-[80%] z-10 -translate-x-1/2 -translate-y-1/2">
          <div className="bg-slate-900/90 border border-slate-700 px-3 py-1.5 rounded-lg text-center shadow-lg">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-200">
              <Truck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Dubai Industrial City</span>
            </div>
            <span className="text-[10px] font-mono text-emerald-300">Renewable Energy Hub</span>
          </div>
        </div>

        {/* Render Active Shipment Corridor Badges directly on Map */}
        <div className="absolute bottom-3 left-4 right-4 z-20 flex gap-2 overflow-x-auto pb-1">
          {shipments.map((s) => {
            const isSelected = selectedShipmentId === s.id;
            const isDelayed = s.status === 'DELAYED';
            const isResolved = s.status === 'RESOLVED';

            return (
              <button
                key={s.id}
                onClick={() => onSelectShipment(s)}
                className={`flex-shrink-0 text-left px-3 py-2 rounded-lg border transition-all ${
                  isSelected
                    ? 'border-cyan-400 bg-cyan-950/70 shadow-cyan-glow'
                    : isDelayed
                    ? 'border-amber-500/70 bg-amber-950/40 hover:bg-amber-950/60'
                    : isResolved
                    ? 'border-emerald-500/60 bg-emerald-950/30 hover:bg-emerald-950/50'
                    : 'border-slate-800 bg-slate-900/80 hover:bg-slate-850'
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-1.5">
                    {isDelayed ? (
                      <ShieldAlert className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
                    ) : isResolved ? (
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Ship className="w-3.5 h-3.5 text-cyan-400" />
                    )}
                    <span className="font-mono text-xs font-bold text-slate-100">{s.container_id}</span>
                  </div>
                  <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-semibold ${
                    isDelayed ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' :
                    isResolved ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' :
                    'bg-slate-800 text-slate-300'
                  }`}>
                    {s.status}
                  </span>
                </div>
                <div className="text-[11px] text-slate-300 font-medium truncate max-w-[200px] mt-0.5">
                  {s.vessel_name} ({s.current_berth})
                </div>
                <div className="text-[10px] font-mono text-slate-400">
                  Val: ${(s.value / 1000).toFixed(0)}k • SLA: ${s.sla_penalty_rate_per_hour}/h
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
