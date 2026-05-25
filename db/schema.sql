-- LedgerLoop Database Schema (Supabase PostgreSQL)
-- Tracks details of active savings circles and participants.

CREATE TABLE IF NOT EXISTS circles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contract_address VARCHAR(42) UNIQUE,
    creator_address VARCHAR(42) NOT NULL,
    pool_size NUMERIC NOT NULL,           -- Total pool amount (e.g. 1000 USDC)
    contribution_amount NUMERIC NOT NULL,  -- Weekly deposit (e.g. 100 USDC)
    total_rounds INTEGER NOT NULL,
    current_round INTEGER DEFAULT 1,
    status VARCHAR(20) DEFAULT 'pending',  -- 'pending', 'active', 'settled'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    circle_id UUID REFERENCES circles(id) ON DELETE CASCADE,
    wallet_address VARCHAR(42) NOT NULL,
    trust_score INTEGER DEFAULT 50,       -- Calculated score (0-100)
    rotation_turn INTEGER,                -- Rotation turn (1 to N)
    contribution_status VARCHAR(20) DEFAULT 'unpaid', -- 'unpaid', 'paid', 'pending'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(circle_id, wallet_address)
);
