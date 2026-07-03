-- PyMA Database Schema
-- This schema is designed to be detachable from pym.ink in the future

-- Organizations (PyMA Customers)
CREATE TABLE IF NOT EXISTS pyma_organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL UNIQUE,
  company_name VARCHAR(255) NOT NULL,
  api_key VARCHAR(255) NOT NULL UNIQUE,
  stripe_customer_id VARCHAR(255),
  stripe_subscription_id VARCHAR(255),
  plan VARCHAR(50) NOT NULL DEFAULT 'free-trial',
  trial_start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  trial_end_date TIMESTAMP WITH TIME ZONE DEFAULT NOW() + INTERVAL '7 days',
  billing_date TIMESTAMP WITH TIME ZONE,
  status VARCHAR(50) NOT NULL DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- PyMA Subscriptions (Plan tracking)
CREATE TABLE IF NOT EXISTS pyma_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES pyma_organizations(id) ON DELETE CASCADE,
  plan VARCHAR(50) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'active',
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- PyMA FAQs (Knowledge Bases)
CREATE TABLE IF NOT EXISTS pyma_faqs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES pyma_organizations(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  source VARCHAR(50), -- 'text', 'file', 'url'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- PyMA Messages (Chat History)
CREATE TABLE IF NOT EXISTS pyma_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES pyma_organizations(id) ON DELETE CASCADE,
  user_message TEXT NOT NULL,
  bot_response TEXT NOT NULL,
  tokens_used INTEGER DEFAULT 0,
  cost DECIMAL(10, 4) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- PyMA Usage (Daily tracking for dashboard)
CREATE TABLE IF NOT EXISTS pyma_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES pyma_organizations(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  messages_count INTEGER DEFAULT 0,
  tokens_used INTEGER DEFAULT 0,
  cost DECIMAL(10, 4) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(organization_id, date)
);

-- Indexes for performance
CREATE INDEX idx_pyma_organizations_stripe_customer ON pyma_organizations(stripe_customer_id);
CREATE INDEX idx_pyma_organizations_api_key ON pyma_organizations(api_key);
CREATE INDEX idx_pyma_messages_organization ON pyma_messages(organization_id);
CREATE INDEX idx_pyma_messages_created_at ON pyma_messages(created_at);
CREATE INDEX idx_pyma_usage_organization_date ON pyma_usage(organization_id, date);
CREATE INDEX idx_pyma_faqs_organization ON pyma_faqs(organization_id);

-- RLS Policies
ALTER TABLE pyma_organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE pyma_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE pyma_faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE pyma_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE pyma_usage ENABLE ROW LEVEL SECURITY;
