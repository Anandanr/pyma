# PyMA Backend Setup Guide

## Overview
This guide covers setting up PyMA's backend infrastructure for trial management and automatic billing conversion.

**Pricing Model:**
- 🎁 Free Trial: $0 for 7 days
- 💳 Monthly: $29/month (automatic after trial)

---

## 1. Database Setup (Supabase)

Run this SQL migration in your Supabase console:

```sql
-- PyMA Database Schema
-- Run the contents of: supabase_migrations_pyma_schema.sql
```

The schema includes:
- `pyma_organizations` - Customer accounts + trial tracking
- `pyma_subscriptions` - Subscription status + Stripe integration
- `pyma_faqs` - Knowledge bases
- `pyma_messages` - Chat history
- `pyma_usage` - Daily usage tracking for dashboard

---

## 2. Environment Variables

Add to your `.env.local`:

```
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Stripe
STRIPE_SECRET_KEY=sk_live_xxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxx
STRIPE_MONTHLY_PRICE_ID=price_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx

# API
NEXT_PUBLIC_API_URL=http://localhost:3001
```

---

## 3. Stripe Setup

### Create Products & Prices

1. **Create a product** in Stripe called "PyMA Monthly"
2. **Create a recurring price** ($29/month)
3. **Copy the Price ID** → Add to `STRIPE_MONTHLY_PRICE_ID`

### Setup Webhook

1. Go to Stripe Webhooks (Dashboard → Developers → Webhooks)
2. **Add endpoint:** `https://your-domain.com/api/webhooks/stripe`
3. **Events to subscribe to:**
   - `customer.subscription.updated`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
   - `customer.subscription.deleted`
4. **Copy webhook secret** → Add to `STRIPE_WEBHOOK_SECRET`

---

## 4. API Endpoints

### POST /api/v1/pyma/enroll
**Create a free trial or monthly subscription**

Request:
```json
{
  "email": "user@company.com",
  "company": "Company Name",
  "plan": "free-trial" | "monthly"
}
```

Response:
```json
{
  "success": true,
  "organization": { ... },
  "apiKey": "pyma_xxx",
  "message": "Free trial started!"
}
```

### POST /api/v1/pyma/chat
**Send a message and get AI response**

Request:
```json
{
  "api_key": "pyma_xxx",
  "message": "How do I reset my password?",
  "faq_id": "optional-faq-id"
}
```

Response:
```json
{
  "success": true,
  "response": "Here's how to reset your password...",
  "usage": {
    "messages_today": 1
  }
}
```

### GET /api/v1/pyma/usage?api_key=pyma_xxx
**Get usage stats for dashboard**

Response:
```json
{
  "success": true,
  "organization": { ... },
  "usage": {
    "today": 5,
    "last_30_days": 150,
    "total_cost": 0,
    "daily_breakdown": [...]
  }
}
```

---

## 5. Trial Expiration Logic

The system automatically handles:

✅ **Day 1-7:** Free trial active
- Customer can use unlimited features
- No charges

✅ **Day 8:** Trial expires
- If no Stripe subscription: Access blocked ("Trial expired. Please upgrade.")
- If Stripe subscription: Automatic charge ($29)

✅ **Monthly billing:** Recurring charge every 30 days

---

## 6. Payment Flow

### Free Trial Path
1. User enters email → Clicks "Start Free"
2. `/api/v1/pyma/enroll` creates org in DB
3. API key generated + sent to dashboard
4. Access granted for 7 days

### Monthly Path
1. User selects "Monthly" → Payment flow
2. Stripe Checkout or Elements form
3. `/api/v1/pyma/enroll` creates Stripe subscription + org in DB
4. Access granted immediately
5. Auto-charged $29 every 30 days

---

## 7. Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
npm start
```

---

## 8. Migration to Standalone API (Future)

When PyMA grows, migration is straightforward:

**Current (Attached):**
```
pym.ink (main platform)
└── /api/v1/pyma/* (PyMA routes)
```

**Future (Detached):**
```
pyma.ai (separate service)
└── /api/v1/* (PyMA routes on own backend)
```

No code changes needed - just redeploy routes to separate backend.

---

## 9. Testing

### Test Free Trial Flow
```
1. Go to http://localhost:3001
2. Click "Enroll"
3. Select "Free Trial"
4. Enter email: test@example.com
5. Enter company: Test Co
6. Click "Start Free Trial"
```

### Test Monthly Flow
```
1. Same as above
2. Select "Monthly" instead
3. Provide Stripe test card: 4242 4242 4242 4242
```

### Test Trial Expiration
```
1. Manually update trial_end_date in DB to past date
2. Try to use API with API key
3. Should return "Trial expired" error
```

---

## 10. Stripe Test Keys

Use these for development:

```
Publishable Key: pk_test_51234567890abcdefghijk
Secret Key: sk_test_1234567890abcdefghijk
```

Test cards:
- Visa: 4242 4242 4242 4242
- Mastercard: 5555 5555 5555 4444
- Invalid: 4000 0000 0000 0002

---

## Support

For questions or issues:
- Check Supabase docs: https://supabase.com/docs
- Check Stripe docs: https://stripe.com/docs
- Contact: hello@pym.ink
