'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Shipment, 
  DisruptionEvent, 
  DisruptionResolution 
} from '@/types';
import { MetricsOverview } from '@/components/MetricsOverview';
import { ControlTowerMap } from '@/components/ControlTowerMap';
import { TelemetryFeed } from '@/components/TelemetryFeed';
import { DisruptionModal } from '@/components/DisruptionModal';
import { ResolutionDrawer } from '@/components/ResolutionDrawer';
import { TariffLookupModal } from '@/components/TariffLookupModal';
import { AgencyRosterModal } from '@/components/AgencyRosterModal';
import { MobileOperatorView } from '@/components/MobileOperatorView';
import { VentureCaseModal } from '@/components/VentureCaseModal';
import { JudgeTourOverlay } from '@/components/JudgeTourOverlay';
import { PitchDeckModal } from '@/components/PitchDeckModal';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export default function ControlTowerHome() {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [events, setEvents] = useState<DisruptionEvent[]>([]);
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);

  // Modals & Drawers state
  const [isDisruptionModalOpen, setIsDisruptionModalOpen] = useState(false);
  const [isResolutionDrawerOpen, setIsResolutionDrawerOpen] = useState(false);
  const [isTariffModalOpen, setIsTariffModalOpen] = useState(false);
  const [isAgencyRosterOpen, setIsAgencyRosterOpen] = useState(false);
  const [isVentureModalOpen, setIsVentureModalOpen] = useState(false);
  const [isJudgeTourOpen, setIsJudgeTourOpen] = useState(false);
  const [isPitchDeckOpen, setIsPitchDeckOpen] = useState(false);
  const [tariffInitialTab, setTariffInitialTab] = useState<'rag' | 'bol_parser'>('rag');
  const [isMobileMode, setIsMobileMode] = useState(false);

  // Active Multi-Agent Resolution Plan
  const [currentResolution, setCurrentResolution] = useState<DisruptionResolution | null>(null);

  // Loading states
  const [isSimulating, setIsSimulating] = useState(false);
  const [isExecutingFix, setIsExecutingFix] = useState(false);
  const [isRollingBack, setIsRollingBack] = useState(false);

  // Fetch initial shipments
  const fetchShipments = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/api/shipments`);
      if (res.ok) {
        const data = await res.json();
        setShipments(data);
        if (!selectedShipment && data.length > 0) {
          setSelectedShipment(data[0]);
        }
      }
    } catch (err) {
      console.warn('Backend not yet reachable on', API_BASE, err);
    }
  }, [selectedShipment]);

  // Fetch events
  const fetchEvents = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/api/events`);
      if (res.ok) {
        const data = await res.json();
        setEvents(data);
      }
    } catch (err) {
      // Quiet fallback
    }
  }, []);

  useEffect(() => {
    fetchShipments();
    fetchEvents();
    const interval = setInterval(() => {
      fetchShipments();
      fetchEvents();
    }, 4000);
    return () => clearInterval(interval);
  }, [fetchShipments, fetchEvents]);

  // Trigger simulated delay (Jebel Ali Berth 4 / MSC Zoe)
  const handleSimulateDelay = async () => {
    setIsSimulating(true);
    try {
      const target = shipments.find(s => s.container_id === 'MSCU7829104') || shipments[0];
      const res = await fetch(`${API_BASE}/api/simulate-delay`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          container_id: target?.container_id || 'MSCU7829104',
          delay_hours: 12,
          reason: 'Severe fog & AIS reported berth congestion at Jebel Ali Berth 4',
          affected_berth: 'Jebel Ali Terminal 2 - Berth 4',
        }),
      });

      if (res.ok) {
        const resolutionData: DisruptionResolution = await res.json();
        setCurrentResolution(resolutionData);
        if (target) {
          setSelectedShipment({ ...target, status: 'DELAYED' });
        }
        setIsDisruptionModalOpen(true);
        await fetchShipments();
        await fetchEvents();
      }
    } catch (err) {
      console.error('Simulation error:', err);
    } finally {
      setIsSimulating(false);
    }
  };

  // Milestone M6: Trigger simulated cold-chain crisis (MAEU9182301 / Biopharma vaccines > $10,000 threshold)
  const handleSimulateColdChainCrisis = async () => {
    setIsSimulating(true);
    try {
      const target = shipments.find(s => s.container_id === 'MAEU9182301') || shipments[1] || shipments[0];
      const res = await fetch(`${API_BASE}/api/simulate-delay`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          container_id: target?.container_id || 'MAEU9182301',
          delay_hours: 16,
          reason: 'Critical Cold-Chain Alert: Active cryogenic reefer delay at Berth 2',
          affected_berth: target?.current_berth || 'Berth 2',
        }),
      });

      if (res.ok) {
        const resolutionData: DisruptionResolution = await res.json();
        setCurrentResolution(resolutionData);
        if (target) {
          setSelectedShipment({ ...target, status: 'DELAYED' });
        }
        setIsResolutionDrawerOpen(true);
        await fetchShipments();
        await fetchEvents();
      }
    } catch (err) {
      console.error('Cold chain simulation error:', err);
    } finally {
      setIsSimulating(false);
    }
  };

  // Milestone M9: 60s Judge Tour Execution Coordinator
  const handleExecuteTourStep = useCallback(async (stepNumber: number) => {
    switch (stepNumber) {
      case 1:
        // Step 1: DEFINE - The $4.2B Dubai Port Friction
        setIsDisruptionModalOpen(false);
        setIsResolutionDrawerOpen(false);
        setIsTariffModalOpen(false);
        setIsVentureModalOpen(false);
        setIsAgencyRosterOpen(false);
        setIsMobileMode(false);
        break;
      case 2:
        // Step 2: BUILD - Multi-Agent Berth 4 Delay
        setIsTariffModalOpen(false);
        setIsVentureModalOpen(false);
        setIsMobileMode(false);
        await handleSimulateDelay();
        setIsDisruptionModalOpen(false);
        setIsResolutionDrawerOpen(true);
        break;
      case 3:
        // Step 3: PAPERWORK - Mirsal-II BoL Parser
        setIsResolutionDrawerOpen(false);
        setIsVentureModalOpen(false);
        setIsMobileMode(false);
        setTariffInitialTab('bol_parser');
        setIsTariffModalOpen(true);
        break;
      case 4:
        // Step 4: SAFETY - >$10,000 Human-in-the-Loop Ceiling & Rollback
        setIsTariffModalOpen(false);
        setIsVentureModalOpen(false);
        setIsMobileMode(false);
        await handleSimulateColdChainCrisis();
        setIsResolutionDrawerOpen(true);
        break;
      case 5:
        // Step 5: MOBILE - Workshop 1 Quayside PWA
        setIsResolutionDrawerOpen(false);
        setIsTariffModalOpen(false);
        setIsVentureModalOpen(false);
        setIsMobileMode(true);
        break;
      case 6:
        // Step 6: TRANSFORM - 3PL Venture Case
        setIsMobileMode(false);
        setIsResolutionDrawerOpen(false);
        setIsTariffModalOpen(false);
        setIsVentureModalOpen(true);
        break;
      default:
        break;
    }
  }, [handleSimulateDelay]);

  // Launch Orchestrator from Disruption Modal
  const handleLaunchOrchestrator = (shipment: Shipment) => {
    setIsDisruptionModalOpen(false);
    setIsResolutionDrawerOpen(true);
  };

  // Inspect existing resolution directly from feed
  const handleInspectResolution = async (shipment: Shipment) => {
    setSelectedShipment(shipment);
    setIsSimulating(true);
    try {
      const res = await fetch(`${API_BASE}/api/simulate-delay`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          container_id: shipment.container_id,
          delay_hours: 12,
          reason: 'Proactive corridor audit & delay simulation',
          affected_berth: shipment.current_berth || 'Berth 4',
        }),
      });

      if (res.ok) {
        const resolutionData: DisruptionResolution = await res.json();
        setCurrentResolution(resolutionData);
        setIsResolutionDrawerOpen(true);
      }
    } catch (err) {
      console.error('Inspect resolution error:', err);
    } finally {
      setIsSimulating(false);
    }
  };

  // Execute Autonomous Fix
  const handleExecuteFix = async () => {
    if (!currentResolution) return;
    setIsExecutingFix(true);
    try {
      const res = await fetch(`${API_BASE}/api/execute-action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          shipment_id: currentResolution.shipment_id,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        // Update local state to resolved
        setShipments(prev =>
          prev.map(s => (s.id === data.shipment_id ? { ...s, status: 'RESOLVED' } : s))
        );
        if (selectedShipment?.id === data.shipment_id) {
          setSelectedShipment(prev => prev ? { ...prev, status: 'RESOLVED' } : null);
        }
        setIsResolutionDrawerOpen(false);
        await fetchShipments();
        await fetchEvents();
      }
    } catch (err) {
      console.error('Execute action error:', err);
    } finally {
      setIsExecutingFix(false);
    }
  };

  // Rollback Action
  const handleRollback = async (shipmentId?: string) => {
    const targetId = shipmentId || currentResolution?.shipment_id || selectedShipment?.id;
    if (!targetId) return;
    setIsRollingBack(true);
    try {
      const res = await fetch(`${API_BASE}/api/shipments/${targetId}/rollback`, {
        method: 'POST',
      });
      if (res.ok) {
        await fetchShipments();
        await fetchEvents();
        setIsResolutionDrawerOpen(false);
      }
    } catch (err) {
      console.error('Rollback error:', err);
    } finally {
      setIsRollingBack(false);
    }
  };

  // Export Executive Audit Report
  const handleExportAudit = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/reports/executive-audit`);
      if (res.ok) {
        const data = await res.json();
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `omni-logistics-audit-${new Date().toISOString().slice(0, 10)}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    } catch (err) {
      console.error('Audit export error:', err);
    }
  };

  return (
    <main className="min-h-screen bg-[#040506] flex flex-col">
      {/* Top HUD Metrics Bar */}
      <MetricsOverview
        shipments={shipments}
        onSimulateDelay={handleSimulateDelay}
        onSimulateColdChainCrisis={handleSimulateColdChainCrisis}
        onOpenTariffModal={() => {
          setTariffInitialTab('rag');
          setIsTariffModalOpen(true);
        }}
        onOpenAgencyRoster={() => setIsAgencyRosterOpen(true)}
        onOpenVentureModal={() => setIsVentureModalOpen(true)}
        onOpenJudgeTour={() => setIsJudgeTourOpen(true)}
        onOpenPitchDeck={() => setIsPitchDeckOpen(true)}
        onToggleMobileView={() => setIsMobileMode(!isMobileMode)}
        onExportAudit={handleExportAudit}
        isMobileView={isMobileMode}
        onRefresh={() => {
          fetchShipments();
          fetchEvents();
        }}
        isSimulating={isSimulating}
      />

      {isMobileMode ? (
        <div className="py-4">
          <MobileOperatorView
            shipments={shipments}
            onSimulateDelay={handleSimulateDelay}
            onOpenTariffModal={() => setIsTariffModalOpen(true)}
            onOpenAgencyRoster={() => setIsAgencyRosterOpen(true)}
            onSelectShipment={s => setSelectedShipment(s)}
            selectedShipment={selectedShipment}
            resolution={currentResolution}
            onExecuteFix={handleExecuteFix}
            onRollback={handleRollback}
            isSimulating={isSimulating}
            isExecuting={isExecutingFix}
            isRollingBack={isRollingBack}
            onCloseMobileMode={() => setIsMobileMode(false)}
          />
        </div>
      ) : (
        /* Main Operational Grid */
        <div className="flex-1 p-6 max-w-[1720px] w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Corridor Radar Map & Active Links */}
          <div className="lg:col-span-7 flex flex-col space-y-6">
            <ControlTowerMap
              shipments={shipments}
              selectedShipmentId={selectedShipment?.id}
              onSelectShipment={s => setSelectedShipment(s)}
            />
          </div>

          {/* Right Column: High-Density Telemetry & Event Feed */}
          <div className="lg:col-span-5 flex flex-col space-y-6">
            <TelemetryFeed
              shipments={shipments}
              events={events}
              selectedShipmentId={selectedShipment?.id}
              onSelectShipment={s => setSelectedShipment(s)}
              onResolveDisruption={handleInspectResolution}
            />
          </div>
        </div>
      )}

      {/* Screen 2: Proactive Disruption Alert Modal */}
      <DisruptionModal
        isOpen={isDisruptionModalOpen}
        onClose={() => setIsDisruptionModalOpen(false)}
        shipment={selectedShipment}
        onLaunchOrchestrator={handleLaunchOrchestrator}
        isLoading={isSimulating}
      />

      {/* Screen 3: Autonomous Agent Resolution Drawer */}
      <ResolutionDrawer
        isOpen={isResolutionDrawerOpen}
        onClose={() => setIsResolutionDrawerOpen(false)}
        resolution={currentResolution}
        onExecuteFix={handleExecuteFix}
        onRollback={() => handleRollback(currentResolution?.shipment_id)}
        isExecuting={isExecutingFix}
        isRollingBack={isRollingBack}
        isResolvedAlready={selectedShipment?.status === 'RESOLVED'}
      />

      {/* Milestone M5 Extended: UAE Customs HS Code Tariff Modal */}
      <TariffLookupModal
        isOpen={isTariffModalOpen}
        onClose={() => setIsTariffModalOpen(false)}
        apiBaseUrl={API_BASE}
        initialTab={tariffInitialTab}
      />

      {/* Agency Agents 271 Ready-Made Specialists Roster Modal */}
      <AgencyRosterModal
        isOpen={isAgencyRosterOpen}
        onClose={() => setIsAgencyRosterOpen(false)}
        apiBaseUrl={API_BASE}
      />

      {/* Milestone M7: Dubai 3PL Venture Case & Commercial ROI Simulator */}
      <VentureCaseModal
        isOpen={isVentureModalOpen}
        onClose={() => setIsVentureModalOpen(false)}
      />

      {/* Milestone M9: 60s Judge Tour Auto-Walkthrough Overlay */}
      <JudgeTourOverlay
        isOpen={isJudgeTourOpen}
        onClose={() => setIsJudgeTourOpen(false)}
        onExecuteTourStep={handleExecuteTourStep}
      />

      {/* Milestone M9: In-App 10-Slide Interactive Pitch Deck Modal */}
      <PitchDeckModal
        isOpen={isPitchDeckOpen}
        onClose={() => setIsPitchDeckOpen(false)}
      />
    </main>
  );
}
