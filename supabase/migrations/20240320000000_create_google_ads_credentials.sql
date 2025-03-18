-- Create enum for account type
CREATE TYPE google_ads_account_type AS ENUM ('agency', 'client');

-- Create table for Google Ads accounts
CREATE TABLE google_ads_accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID,
    account_type google_ads_account_type NOT NULL DEFAULT 'client',
    name TEXT NOT NULL,
    customer_id TEXT,
    manager_customer_id TEXT, -- For client accounts, this references the agency account's customer_id
    access_token TEXT,
    refresh_token TEXT,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create RLS policies
ALTER TABLE google_ads_accounts ENABLE ROW LEVEL SECURITY;



-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql'; 