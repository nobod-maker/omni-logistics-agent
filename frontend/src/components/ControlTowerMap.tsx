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
    <div className="bg-[#07080a] border border-[#363739] rounded-[8px] p-5 relative overflow-hidden flex flex-col h-full min-h-[460px] shadow-key">
      {/* Header Bar */}
      <div className="flex items-center justify-between pb-3 border-b border-[#363739] mb-3 z-10">
        <div className="flex items-center space-x-2">
          <Compass className="w-4 h-4 text-[#9c9c9d]" />
          <h2 className="text-xs font-semibold text-[#e6e6e6] tracking-wider uppercase font-mono">
            Dubai Port-to-Inland Corridor Telemetry Map
          </h2>
        </div>
        <div className="flex items-center gap-3 text-xs font-mono">
          <span className="flex items-center gap-1.5 text-[#9c9c9d]">
            <span className="w-2 h-2 rounded-full bg-[#9c9c9d] inline-block"></span> Normal Transit
          </span>
          <span className="flex items-center gap-1.5 text-[#ff6363]">
            <span className="w-2 h-2 rounded-full bg-[#ff6363] inline-block animate-pulse"></span> Delayed Anomaly
          </span>
          <span className="flex items-center gap-1.5 text-[#e6e6e6]">
            <span className="w-2 h-2 rounded-full bg-[#e6e6e6] inline-block"></span> Autonomous Fix
          </span>
        </div>
      </div>

      {/* Stylized Vector Radar Map Container */}
      <div className="relative flex-1 rounded-[6px] border border-[#363739] bg-[#040506] p-4 overflow-hidden flex items-center justify-center">
        {/* Subtle Radar Background Grid & Concentric Rings */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="w-full h-full bg-[radial-gradient(#2f3031_1px,transparent_1px)] [background-size:24px_24px]"></div>
        </div>
        <div className="absolute w-[600px] h-[600px] rounded-full border border-[#2f3031]/40 pointer-events-none"></div>
        <div className="absolute w-[400px] h-[400px] rounded-full border border-[#2f3031]/40 pointer-events-none"></div>
        <div className="absolute w-[200px] h-[200px] rounded-full border border-[#2f3031]/40 pointer-events-none"></div>

        {/* SVG Route Corridors */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
          <defs>
            <linearGradient id="corridorGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#6a6b6c" stopOpacity="0.3" />
            </linearGradient>
          </defs>

          {/* Jebel Ali to Dubai South (Air/Inland) */}
          <path d="M 120 220 Q 300 240 540 320" fill="none" stroke="url(#corridorGradient)" strokeWidth="2.5" strokeDasharray="4 4" className="animate-pulse" />
          
          {/* Jebel Ali to JAFZA North */}
          <path d="M 120 220 L 260 140" fill="none" stroke="#6a6b6c" strokeWidth="2" opacity="0.6" />

          {/* Jebel Ali to Al Quoz Industrial */}
          <path d="M 120 220 Q 360 180 620 160" fill="none" stroke="#6a6b6c" strokeWidth="2" opacity="0.5" />

          {/* Jebel Ali to DAFZA Airport Freezone */}
          <path d="M 120 220 Q 420 100 750 110" fill="none" stroke="#454647" strokeWidth="1.5" strokeDasharray="6 3" opacity="0.4" />

          {/* Jebel Ali to Dubai Industrial City */}
          <path d="M 120 220 L 320 370" fill="none" stroke="#6a6b6c" strokeWidth="2" opacity="0.5" />
        </svg>

        {/* Port Node: Jebel Ali Port (AEJEA) */}
        <div className="absolute left-[10%] top-[46%] z-10 -translate-x-1/2 -translate-y-1/2">
          <div className="relative group cursor-pointer">
            <div className="w-16 h-16 rounded-[6px] bg-[#111214] border border-[#363739] p-2 shadow-key flex flex-col items-center justify-center text-center">
              <Anchor className="w-5 h-5 text-white" />
              <span className="text-[10px] font-mono font-normal text-white mt-1">JEBEL ALI</span>
            </div>
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap bg-[#07080a] border border-[#363739] px-2 py-0.5 rounded-[4px] text-[10px] text-[#9c9c9d] font-mono shadow-key">
              Berths 1-4 • Terminal 2
            </div>
          </div>
        </div>

        {/* Destination Nodes */}

        {/* 1. JAFZA North Node */}
        <div className="absolute left-[30%] top-[28%] z-10 -translate-x-1/2 -translate-y-1/2">
          <div className="bg-[#111214] border border-[#363739] px-3 py-1.5 rounded-[6px] text-center shadow-key">
            <div className="flex items-center gap-1.5 text-xs font-normal text-white">
              <MapPin className="w-3.5 h-3.5 text-[#9c9c9d]" />
              <span>JAFZA North</span>
            </div>
            <span className="text-[10px] font-mono text-[#9c9c9d]">Free Zone Duty Free</span>
          </div>
        </div>

        {/* 2. Dubai South & Al Maktoum Airport (DWC) */}
        <div className="absolute left-[62%] top-[68%] z-10 -translate-x-1/2 -translate-y-1/2">
          <div className="bg-[#111214] border border-[#363739] px-3 py-2 rounded-[6px] text-center shadow-key">
            <div className="flex items-center justify-center gap-1.5 text-xs font-normal text-white">
              <Plane className="w-3.5 h-3.5 text-[#9c9c9d]" />
              <span>Dubai South & DWC</span>
            </div>
            <div className="text-[10px] font-mono text-[#9c9c9d] mt-0.5">
              Multimodal Air/Road Corridor
            </div>
          </div>
        </div>

        {/* 3. Al Quoz Industrial Area */}
        <div className="absolute left-[70%] top-[34%] z-10 -translate-x-1/2 -translate-y-1/2">
          <div className="bg-[#111214] border border-[#363739] px-3 py-1.5 rounded-[6px] text-center shadow-key">
            <div className="flex items-center gap-1.5 text-xs font-normal text-white">
              <Truck className="w-3.5 h-3.5 text-[#9c9c9d]" />
              <span>Al Quoz IND-3</span>
            </div>
            <span className="text-[10px] font-mono text-[#9c9c9d]">Mainland Logistics</span>
          </div>
        </div>

        {/* 4. DAFZA Airport Freezone */}
        <div className="absolute left-[84%] top-[22%] z-10 -translate-x-1/2 -translate-y-1/2">
          <div className="bg-[#111214] border border-[#363739] px-3 py-1.5 rounded-[6px] text-center shadow-key">
            <div className="flex items-center gap-1.5 text-xs font-normal text-white">
              <MapPin className="w-3.5 h-3.5 text-[#9c9c9d]" />
              <span>DAFZA</span>
            </div>
            <span className="text-[10px] font-mono text-[#9c9c9d]">Aviation Free Zone</span>
          </div>
        </div>

        {/* 5. Dubai Industrial City (DIC) */}
        <div className="absolute left-[38%] top-[80%] z-10 -translate-x-1/2 -translate-y-1/2">
          <div className="bg-[#111214] border border-[#363739] px-3 py-1.5 rounded-[6px] text-center shadow-key">
            <div className="flex items-center gap-1.5 text-xs font-normal text-white">
              <Truck className="w-3.5 h-3.5 text-[#9c9c9d]" />
              <span>Dubai Industrial City</span>
            </div>
            <span className="text-[10px] font-mono text-[#9c9c9d]">Renewable Energy Hub</span>
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
                className={`flex-shrink-0 min-w-[225px] text-left px-3.5 py-2.5 rounded-[6px] border transition-all shadow-key ${
                  isSelected
                    ? 'border-[#9c9c9d] bg-[#1b1c1e]'
                    : isDelayed
                    ? 'border-[#ff6363]/60 bg-[#452324]/30'
                    : isResolved
                    ? 'border-[#363739] bg-[#111214] hover:bg-[#1b1c1e]'
                    : 'border-[#363739] bg-[#111214] hover:bg-[#1b1c1e]'
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-1.5">
                    {isDelayed ? (
                      <ShieldAlert className="w-3.5 h-3.5 text-[#ff6363] animate-pulse" />
                    ) : isResolved ? (
                      <CheckCircle className="w-3.5 h-3.5 text-[#e6e6e6]" />
                    ) : (
                      <Ship className="w-3.5 h-3.5 text-[#9c9c9d]" />
                    )}
                    <span className="font-mono text-xs font-normal text-white">{s.container_id}</span>
                  </div>
                  <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-[4px] font-semibold border ${
                    isDelayed ? 'bg-[#452324] text-[#ff6363] border-[#ff6363]/40' :
                    isResolved ? 'bg-[#1b1c1e] text-[#e6e6e6] border-[#363739]' :
                    'bg-[#111214] text-[#9c9c9d] border-[#363739]'
                  }`}>
                    {s.status}
                  </span>
                </div>
                <div className="text-[11px] text-[#9c9c9d] font-normal truncate max-w-[210px] mt-0.5">
                  {s.vessel_name} ({s.current_berth})
                </div>
                <div className="text-[10px] font-mono text-[#6a6b6c] leading-tight truncate mt-0.5">
                  Val: ${(s.value / 1000).toLocaleString('en-US', { maximumFractionDigits: 0 })}k • SLA: ${s.sla_penalty_rate_per_hour.toLocaleString('en-US')}/h
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
