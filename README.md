# pymA Frontend - Next.js + React

**pymA** is an AI-powered support agent SaaS platform. This repository contains the frontend for the subscription and onboarding flow.

---

## 📁 Project Structure

```
pyma/
├── app/
│   ├── layout.tsx              # Root layout with metadata
│   ├── globals.css             # Global Tailwind styles
│   ├── page.tsx                # Landing page
│   ├── enroll/
│   │   └── page.tsx            # Plan selector
│   ├── checkout/
│   │   └── page.tsx            # Signup form + payment
│   └── dashboard/
│       └── page.tsx            # User dashboard
├── components/
│   └── PlanCard.tsx            # Reusable plan card component
├── lib/
│   └── api.ts                  # API client utilities
├── public/                      # Static assets
├── package.json                # Dependencies
├── tsconfig.json               # TypeScript config
├── tailwind.config.ts          # Tailwind CSS config
├── next.config.ts              # Next.js config
└── README.md                   # This file
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Vercel account (for deployment)

### Installation

```bash
# Clone the repository
cd pyma

# Install dependencies
npm install

# Create environment file
cp .env.local.example .env.local

# Add your configuration
# NEXT_PUBLIC_API_URL=https://pym.ink
# NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
```

### Development

```bash
# Start development server
npm run dev

# Open http://localhost:3000
```

### Build

```bash
# Build for production
npm run build

# Start production server
npm start
```

---

## 🎨 Design System

### Colors
- **Primary:** `#7c3aed` (Purple)
- **Success:** `#10b981` (Green)
- **Accent:** `#f59e0b` (Amber)
- **Neutral:** `#6b7280` (Gray)

### Components
- **PlanCard** - Displays plan options with features
- **Navigation** - Header with logo and CTA
- **Button** - Primary actions

---

## 📄 Pages

### 1. Landing Page (`/`)
- Hero section with value proposition
- Features overview
- Pricing preview
- CTA to start free trial

### 2. Enroll Page (`/enroll`)
- Plan selector (Free Trial, Pay-as-you-go, Monthly)
- Radio selection with instant feedback
- Continue button to checkout

### 3. Checkout Page (`/checkout`)
- Email and company input
- Plan summary
- Form validation
- API integration for enrollment
- Stripe redirect for paid plans

### 4. Dashboard Page (`/dashboard`)
- API key display with copy functionality
- Quick start guide
- Subscription details
- Links to documentation

---

## 🔌 API Integration

All API calls go through `lib/api.ts`:

```typescript
// Enroll user
await enrollUser('monthly', 'user@company.com', 'Company Name')

// Get subscription details
await getSubscription(apiKey)

// Upload FAQ
await uploadFAQ(apiKey, faqData, 'json')

// Send message to AI
await sendMessage(apiKey, 'How long does delivery take?')
```

### Environment Variables

```bash
NEXT_PUBLIC_API_URL          # Backend URL (https://pym.ink)
NEXT_PUBLIC_STRIPE_KEY       # Stripe public key
```

---

## 🎯 User Flow

```
Landing (/) 
    ↓
[Get Started] → Enroll (/enroll)
    ↓
Select Plan → Checkout (/checkout)
    ↓
Free Trial? ✓ → Dashboard (/dashboard) [API Key]
Free Trial? ✗ → Stripe Payment → Dashboard
```

---

## 📊 Pricing Plans

### Free Trial
- **Price:** $0
- **Duration:** 14 days
- **Features:** Full access, unlimited messages, API key

### Pay-as-you-go
- **Price:** $0.01 per message
- **Billing:** Auto-billed monthly (min $1)
- **Features:** No contract, cancel anytime

### Monthly
- **Price:** $29/month
- **Features:** Unlimited messages, priority support, 99% SLA

---

## 🔐 Authentication

- User signs up with email and company
- Enrollment API creates subscription and returns JWT token
- Frontend stores token in httpOnly cookie (via Set-Cookie header)
- All subsequent API calls include token in `Authorization` header
- Unique API key generated per subscription (for customer's backend)

---

## 🎁 Features Implemented

✅ Landing page with pricing preview  
✅ Plan selector with real-time selection  
✅ Checkout form with validation  
✅ Free trial signup  
✅ Dashboard with API key display  
✅ Responsive design (mobile-first)  
✅ Error handling  
✅ Loading states  

---

## 🚧 Coming Soon

- [ ] FAQ upload interface
- [ ] Chat widget preview
- [ ] Analytics dashboard
- [ ] Settings page
- [ ] User management
- [ ] Advanced analytics
- [ ] Custom integrations

---

## 🔄 Deployment

### Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
NEXT_PUBLIC_API_URL=https://pym.ink
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
```

### Custom Domain

1. Point `pyma.pym.ink` DNS to Vercel
2. Add custom domain in Vercel project settings
3. SSL certificate auto-generated

---

## 📚 Documentation

- **API Docs:** https://docs.pym.ink/pyma
- **Stripe Integration:** https://stripe.com/docs/payments
- **Next.js Guide:** https://nextjs.org/docs

---

## 🐛 Troubleshooting

### CORS Issues
- Ensure `pym.ink/middleware.ts` has CORS headers for `pyma.pym.ink`
- Check `Access-Control-Allow-Origin` header in responses

### Stripe Not Loading
- Verify `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` in `.env.local`
- Check browser console for errors
- Ensure key is for correct environment (test vs. live)

### API Calls Failing
- Verify `NEXT_PUBLIC_API_URL` points to correct backend
- Check API endpoint exists on backend
- Ensure authentication token is valid

---

## 📝 License

Private - Pym Inc.

---

## 🤝 Support

Email: support@pym.ink  
Docs: https://docs.pym.ink/pyma
