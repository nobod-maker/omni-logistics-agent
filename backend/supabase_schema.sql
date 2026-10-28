-- ==============================================================================
-- OMNI-LOGISTICS MASTER AGENT — SUPABASE / POSTGRESQL SCHEMA MIGRATION
-- Project: Autonomous Control Tower for Dubai Jebel Ali & Free Zones
-- Competition: Create AI Agents Championship (Dubai Chamber of Digital Economy)
-- ==============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Clean Existing Tables (Optional - Run only on fresh setup)
DROP TABLE IF EXISTS agent_decisions CASCADE;
DROP TABLE IF EXISTS events CASCADE;
DROP TABLE IF EXISTS shipments CASCADE;

-- 3. Shipments Table
CREATE TABLE shipments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    container_id TEXT NOT NULL UNIQUE,
    vessel_name TEXT NOT NULL,
    origin_port TEXT NOT NULL,
    destination TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'IN_TRANSIT',
    expected_arrival TIMESTAMPTZ NOT NULL,
    cargo_description TEXT NOT NULL,
    hs_code TEXT NOT NULL,
    value NUMERIC(15, 2) NOT NULL,
    sla_deadline TIMESTAMPTZ NOT NULL,
    sla_penalty_rate_per_hour NUMERIC(10, 2) NOT NULL,
    carrier TEXT DEFAULT 'MSC',
    current_berth TEXT DEFAULT 'Berth 4',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Disruption & Operational Events Table
CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    shipment_id UUID NOT NULL REFERENCES shipments(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL,
    severity TEXT NOT NULL,
    description TEXT NOT NULL,
    impact_hours INTEGER NOT NULL,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Agent Decisions & Immutable Audit Trail
CREATE TABLE agent_decisions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    shipment_id UUID NOT NULL REFERENCES shipments(id) ON DELETE CASCADE,
    sub_agent TEXT NOT NULL,
    proposed_action JSONB NOT NULL,
    cost_impact NUMERIC(12, 2) NOT NULL,
    time_saved_hours NUMERIC(6, 2) NOT NULL,
    confidence_score NUMERIC(4, 2) NOT NULL,
    reasoning_cot TEXT,
    requires_human_approval BOOLEAN DEFAULT FALSE,
    executed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    executed_at TIMESTAMPTZ
);

-- 6. Performance & Lookup Indexes
CREATE INDEX IF NOT EXISTS idx_shipments_container_id ON shipments(container_id);
CREATE INDEX IF NOT EXISTS idx_shipments_status ON shipments(status);
CREATE INDEX IF NOT EXISTS idx_events_shipment_id ON events(shipment_id);
CREATE INDEX IF NOT EXISTS idx_events_timestamp ON events(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_agent_decisions_shipment_id ON agent_decisions(shipment_id);
CREATE INDEX IF NOT EXISTS idx_agent_decisions_created_at ON agent_decisions(created_at DESC);

-- 7. Row Level Security (RLS) Policies
ALTER TABLE shipments ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_decisions ENABLE ROW LEVEL SECURITY;

-- Allow read and write access for application backend (service role / anon during demo)
CREATE POLICY "Public Read Access for Shipments" ON shipments FOR SELECT USING (true);
CREATE POLICY "Public Insert/Update for Shipments" ON shipments FOR ALL USING (true);

CREATE POLICY "Public Read Access for Events" ON events FOR SELECT USING (true);
CREATE POLICY "Public Insert for Events" ON events FOR ALL USING (true);

CREATE POLICY "Public Read Access for Agent Decisions" ON agent_decisions FOR SELECT USING (true);
CREATE POLICY "Public Insert/Update for Agent Decisions" ON agent_decisions FOR ALL USING (true);

-- 8. Seed Initial 5 Dubai Trade Corridor Shipments
INSERT INTO shipments (
    id, container_id, vessel_name, origin_port, destination, status,
    expected_arrival, cargo_description, hs_code, value,
    sla_deadline, sla_penalty_rate_per_hour, carrier, current_berth, created_at
) VALUES 
(
    'c1f7a834-82a1-4d1a-821b-10f847190001',
    'MSCU7829104',
    'MSC Zoe',
    'Shanghai (CNSHA)',
    'Jebel Ali Port (AEJEA) -> Dubai South Logistics District',
    'IN_TRANSIT',
    NOW() + INTERVAL '6 hours',
    'High-Precision 5G Base Stations & Network Switches',
    '8517.62',
    840000.00,
    NOW() + INTERVAL '14 hours',
    450.00,
    'MSC',
    'Berth 4',
    NOW()
),
(
    'c1f7a834-82a1-4d1a-821b-10f847190002',
    'MAEU9182301',
    'Maersk Mc-Kinney Moller',
    'Rotterdam (NLRTM)',
    'Jebel Ali Port (AEJEA) -> JAFZA Free Zone North',
    'IN_TRANSIT',
    NOW() + INTERVAL '18 hours',
    'Temperature-Controlled Biopharmaceutical Vaccines (2-8°C)',
    '3002.20',
    1250000.00,
    NOW() + INTERVAL '26 hours',
    850.00,
    'Maersk',
    'Berth 2',
    NOW()
),
(
    'c1f7a834-82a1-4d1a-821b-10f847190003',
    'CMAU6521908',
    'CMA CGM Saint Exupery',
    'Busan (KRPUS)',
    'Jebel Ali Port (AEJEA) -> Al Quoz Industrial Area 3',
    'IN_TRANSIT',
    NOW() + INTERVAL '11 hours',
    'EV Lithium-Ion Battery Storage Modules',
    '8507.60',
    320000.00,
    NOW() + INTERVAL '22 hours',
    250.00,
    'CMA CGM',
    'Berth 4',
    NOW()
),
(
    'c1f7a834-82a1-4d1a-821b-10f847190004',
    'HLCU4901842',
    'Hapag-Lloyd Al Jmeliyah',
    'Hamburg (DEHAM)',
    'Jebel Ali Port (AEJEA) -> DAFZA (Dubai Airport Freezone)',
    'IN_TRANSIT',
    NOW() + INTERVAL '3 hours',
    'Precision Aircraft Avionics & Hydraulic Assemblies',
    '8803.30',
    620000.00,
    NOW() + INTERVAL '8 hours',
    600.00,
    'Hapag-Lloyd',
    'Berth 1',
    NOW()
),
(
    'c1f7a834-82a1-4d1a-821b-10f847190005',
    'ONEU3098125',
    'ONE Apus',
    'Yokohama (JPYOK)',
    'Jebel Ali Port (AEJEA) -> Dubai Industrial City (DIC)',
    'IN_TRANSIT',
    NOW() + INTERVAL '36 hours',
    'Solar PV Inverters & Grid Tie Rectifiers',
    '8504.40',
    195000.00,
    NOW() + INTERVAL '48 hours',
    150.00,
    'ONE',
    'Berth 3',
    NOW()
);
