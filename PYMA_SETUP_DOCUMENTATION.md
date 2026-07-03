# pymA - Subscription Platform Setup Documentation

**Date:** July 3, 2026  
**Product:** pymA - AI Support Agent SaaS  
**Architecture:** Subdomain + Backend API Integration

---

## 📋 Overview

pymA is a separate SaaS product from Pym (remittance platform). It consists of:
- **Frontend:** `pyma.pym.ink` (separate Next.js app)
- **Backend:** `pym.ink/api/v1/pyma/*` (existing pym.ink backend)

This allows independent scaling while sharing infrastructure costs.

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    pyma.pym.ink (Frontend)                  │
│  (Landing → Enroll → Plan Selector → Stripe → Dashboard)   │
└────────────────────────┬────────────────────────────────────┘
                         │
                   HTTPS/REST API
                         │
┌────────────────────────▼────────────────────────────────────┐
│                 pym.ink/api/v1/pyma (Backend)              │
│  ✓ Enrollment  ✓ Subscriptions  ✓ FAQ  ✓ Chat  ✓ Webhooks │
└─────────────────────────────────────────────────────────────┘
                         │
                    Database & Services
                         │
          ┌──────────────┼──────────────┐
          │              │              │
      Stripe         LLM API        PostgreSQL
   (Payments)    (OpenAI/Claude)   (pymA Data)
```

---

## 💰 Pricing Plans

### Plan 1: Free Trial
- **Duration:** 14 days
- **Access:** Full platform access
- **Cost:** $0
- **After expiry:** Auto-convert to Pay-as-you-go OR upgrade prompt

### Plan 2: Pay-as-you-go
- **Cost:** $0.01 per message
- **Billing:** Auto-billed via Stripe (minimum $1/month)
- **Best for:** Testing/small usage

### Plan 3: Monthly Flat
- **Cost:** $29/month
- **Access:** Unlimited messages
- **Billing:** Recurring subscription
- **Best for:** Active businesses

---

## 🔌 API Endpoints (pym.ink)

### 1. Enrollment
```
POST /api/v1/pyma/enroll
Body: {
  plan: "free-trial" | "payg" | "monthly",
  email: "user@company.com",
  company: "Company Name",
  phone?: "+1234567890"
}
Response: {
  success: true,
  subscription_id: "sub_xxx",
  api_key: "pyma_xxx",
  trial_expires_at?: "2026-07-17" (if free trial)
}
```

### 2. Subscriptions
```
GET /api/v1/pyma/subscriptions/:userId
Response: {
  subscription_id: "sub_xxx",
  plan: "monthly",
  status: "active" | "trial" | "expired",
  messages_used: 1250,
  messages_limit: null (if monthly), 
  trial_expires_at?: "2026-07-17",
  next_billing_date: "2026-08-03"
}
```

### 3. FAQ Management
```
POST /api/v1/pyma/faq
Body: {
  api_key: "pyma_xxx",
  faq_data: [
    { question: "How long?", answer: "2-3 hours" },
    { question: "Fees?", answer: "1% markup" }
  ],
  format: "json" | "csv" | "text"
}
Response: {
  success: true,
  faq_count: 45,
  indexed_at: "2026-07-03T10:30:00Z"
}
```

### 4. Chat (AI Response)
```
POST /api/v1/pyma/chat
Body: {
  api_key: "pyma_xxx",
  question: "Why was my order cancelled?",
  conversation_id?: "conv_xxx"
}
Response: {
  answer: "Based on your FAQ: [answer from knowledge base]",
  confidence: 0.97,
  source: "faq" | "ai_fallback",
  message_id: "msg_xxx",
  tokens_used: 120
}
```

### 5. Stripe Webhooks
```
POST /webhooks/stripe
Handles:
- payment_intent.succeeded
- customer.subscription.updated
- customer.subscription.deleted
- invoice.payment_failed
```

---

## 📁 Project Structure

### pym.ink (Backend - Existing)
```
app/api/v1/pyma/
├── enroll/route.ts
│   └── POST: Create subscription
├── subscriptions/route.ts
│   └── GET: Get user subscription
├── faq/route.ts
│   ├── POST: Upload FAQ
│   ├── GET: Retrieve FAQ
│   └── PUT: Update FAQ
├── chat/route.ts
│   └── POST: Get AI response
└── webhooks/stripe/route.ts
    └── POST: Handle Stripe events

types/
└── pyma.ts
    ├── PymASubscription
    ├── PymAFAQ
    ├── PymAMessage
    └── PymAPlan

lib/pyma/
├── stripe.ts (create checkout, manage subscriptions)
├── subscription.ts (enrollment logic)
├── faq-parser.ts (parse various formats)
└── llm.ts (AI response generation)

middleware.ts (add CORS for pyma.pym.ink)
```

### pyma.pym.ink (Frontend - NEW)
```
app/
├── page.tsx (Landing)
├── layout.tsx
├── enroll/
│   ├── page.tsx (Plan selector)
│   └── layout.tsx
├── checkout/
│   ├── page.tsx (Stripe form)
│   └── success/page.tsx
└── dashboard/
    ├── page.tsx (Main dashboard)
    ├── layout.tsx
    ├── faq/page.tsx (FAQ management)
    ├── api-key/page.tsx (API docs)
    └── settings/page.tsx

components/
├── PlanCard.tsx
├── PlanSelector.tsx
├── StripeCheckout.tsx
├── FAQUploader.tsx
├── ChatWidget.tsx
└── Navigation.tsx

lib/
├── api.ts (fetch to pym.ink APIs)
├── stripe.ts (Stripe integration)
└── auth.ts (Session management)

.env.local
├── NEXT_PUBLIC_API_URL=https://pym.ink
├── NEXT_PUBLIC_STRIPE_KEY=pk_live_xxx
└── STRIPE_SECRET_KEY=sk_live_xxx
```

---

## 🔐 Security & Auth

1. **Signup → JWT Token** (created by pym.ink)
2. **pyma.pym.ink stores token** in httpOnly cookie
3. **All API calls** include token in Authorization header
4. **API Key** (for customer's backend) is separate from JWT

---

## 🌍 CORS Setup

Add to `pym.ink/middleware.ts`:
```typescript
if (request.nextUrl.origin === 'https://pyma.pym.ink') {
  response.headers.set('Access-Control-Allow-Origin', 'https://pyma.pym.ink')
}
```

---

## 💳 Stripe Integration Flow

```
Plan Selector
     ↓
Free Trial? → Yes → Skip Stripe, Create Subscription, Generate API Key → Done
     ↓ No
  Paid Plan? → Create Stripe Session
     ↓
   User Pays
     ↓
Stripe Webhook → Update Subscription → Generate API Key
     ↓
Redirect to Dashboard
```

---

## 📊 Database Schema (New Tables in pym)

### pyma_subscriptions
```sql
CREATE TABLE pyma_subscriptions (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  stripe_customer_id VARCHAR,
  stripe_subscription_id VARCHAR,
  plan VARCHAR (free_trial, payg, monthly),
  status VARCHAR (active, trial, expired, cancelled),
  messages_used INT DEFAULT 0,
  trial_started_at TIMESTAMP,
  trial_expires_at TIMESTAMP,
  current_period_start TIMESTAMP,
  current_period_end TIMESTAMP,
  api_key VARCHAR UNIQUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE pyma_faqs (
  id UUID PRIMARY KEY,
  subscription_id UUID REFERENCES pyma_subscriptions(id),
  question TEXT,
  answer TEXT,
  embedding VECTOR (1536), -- For semantic search
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE pyma_messages (
  id UUID PRIMARY KEY,
  subscription_id UUID REFERENCES pyma_subscriptions(id),
  question TEXT,
  answer TEXT,
  source VARCHAR (faq, ai_fallback),
  tokens_used INT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 🚀 Deployment

### pym.ink Changes
1. Add API routes in `/app/api/v1/pyma/`
2. Add database tables
3. Deploy to existing infrastructure

### pyma.pym.ink (New Deployment)
1. Create separate Vercel project
2. Connect to subdomain `pyma.pym.ink`
3. Set environment variables
4. Deploy

---

## 📈 Metrics to Track

- Free trial → Paid conversion rate
- Subscription churn
- Average messages per user
- FAQ indexing success rate
- API response time (< 1 second SLA)

---

## ⚡ Implementation Timeline

- **Week 1:** Database setup + Core APIs
- **Week 2:** Stripe integration
- **Week 3:** Frontend (Landing + Enroll)
- **Week 4:** Dashboard + Chat widget
- **Week 5:** Testing + Launch

---

## 🔄 Next Steps

1. ✅ Finalize UI/UX design
2. ✅ Create database schema
3. ✅ Build pym.ink APIs
4. ✅ Build pyma.pym.ink frontend
5. ✅ Integration testing
6. ✅ Deploy to staging
7. ✅ Public launch
