# PyMA Integration Guide

How to add the PyMA chatbot to your website.

## Option 1: Embed Script (Easiest)

Add a single line of code to your website:

```html
<script 
  src="https://widget.pym.ink/chatbot.js"
  data-api-key="pyma_YOUR_API_KEY"
  data-position="bottom-right"
></script>
```

**That's it!** The chatbot will appear in the bottom-right corner of your website.

### Configuration Options

```html
<script 
  src="https://widget.pym.ink/chatbot.js"
  data-api-key="pyma_YOUR_API_KEY"
  data-position="bottom-right"
  data-theme="light"
  data-placeholder="Ask me anything..."
  data-title="Help Center"
  data-hide-on-mobile="false"
></script>
```

**Available attributes:**
- `data-position`: `"bottom-right"`, `"bottom-left"`, `"top-right"`, `"top-left"`
- `data-theme`: `"light"`, `"dark"`, `"brand"`
- `data-placeholder`: Custom input placeholder text
- `data-title`: Widget title/header
- `data-hide-on-mobile`: `"true"` to disable on mobile devices

### Where to Find Your API Key

1. Log into your PyMA dashboard
2. Go to **Your API Key** section
3. Copy the key (starts with `pyma_`)
4. Paste into the `data-api-key` attribute

---

## Option 2: React Component

If you're using React, install the package:

```bash
npm install @pyma/chatbot-react
```

Then use in your app:

```jsx
import { PyMAChatbot } from '@pyma/chatbot-react'

export default function MyApp() {
  return (
    <div>
      <h1>My Website</h1>
      
      <PyMAChatbot 
        apiKey="pyma_YOUR_API_KEY"
        position="bottom-right"
        theme="light"
      />
    </div>
  )
}
```

---

## Option 3: Vanilla JavaScript

For custom implementations:

```html
<!DOCTYPE html>
<html>
<head>
  <title>My Website</title>
  <style>
    .pyma-widget {
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 400px;
      height: 600px;
      border-radius: 12px;
      box-shadow: 0 5px 40px rgba(0, 0, 0, 0.16);
      background: white;
      z-index: 999;
    }
  </style>
</head>
<body>
  <h1>My Website</h1>
  
  <div id="pyma-chatbot" class="pyma-widget"></div>

  <script>
    // Initialize PyMA Chatbot
    PyMA.init({
      containerId: 'pyma-chatbot',
      apiKey: 'pyma_YOUR_API_KEY',
      onReady: () => console.log('PyMA is ready!'),
      onMessage: (message) => console.log('New message:', message),
    });
  </script>

  <script src="https://cdn.pym.ink/chatbot.js"></script>
</body>
</html>
```

---

## Option 4: API Documentation (Advanced)

If you want to build a custom chatbot UI:

### Send a Message

```bash
curl -X POST https://api.pym.ink/v1/pyma/chat \
  -H "Content-Type: application/json" \
  -H "X-API-Key: pyma_YOUR_API_KEY" \
  -d '{
    "message": "What is your return policy?",
    "session_id": "user_123"
  }'
```

**Response:**
```json
{
  "success": true,
  "response": "Our return policy allows returns within 30 days of purchase...",
  "confidence": 0.95,
  "sources": ["faq_entry_42"]
}
```

### Get Usage Stats

```bash
curl https://api.pym.ink/v1/pyma/usage?api_key=pyma_YOUR_API_KEY
```

**Response:**
```json
{
  "today": 45,
  "last_30_days": 1250,
  "total_cost": "$25.80",
  "plan": "monthly"
}
```

---

## Implementation Flow

### For Website Owners

1. **Sign up** → Choose plan (Free Trial or Monthly)
2. **Upload FAQ** → Dashboard → Upload FAQ section
3. **Get API Key** → Copy from dashboard
4. **Embed Script** → Add 1 line of HTML to your website
5. **Test** → Refresh and see chatbot appear
6. **Customize** → Adjust colors, position, welcome message

### For Developers

1. Install package: `npm install @pyma/chatbot-react`
2. Import: `import { PyMAChatbot } from '@pyma/chatbot-react'`
3. Use component with API key
4. Optional: Hook into events for analytics

---

## Common Issues

### Chatbot doesn't appear
- ✓ Check API key is correct (copy from dashboard)
- ✓ Check browser console for errors
- ✓ Ensure domain is whitelisted (Settings → Domains)

### Messages not working
- ✓ Verify FAQ is uploaded
- ✓ Check API key has active subscription
- ✓ Try test message in dashboard first

### Styling not matching brand
- ✓ Use `data-theme="brand"` for primary color
- ✓ Or pass custom CSS variables via config

---

## Support

- **Docs**: https://docs.pym.ink/pyma
- **Email**: hello@pym.ink
- **Chat**: Use the support chatbot in your dashboard
