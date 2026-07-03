export function getPricingBotResponse(userInput: string): string {
  const input = userInput.toLowerCase()

  const plans = {
    freetrial:
      '🎁 **Free Trial** - $0\n• 7 days, full access\n• Unlimited messages\n• API key included\n\nPerfect for testing PyMA with your FAQ.',
    monthly:
      '⭐ **Monthly** - $29/month\n• Unlimited messages\n• Priority support\n• Best value\n\nAutomatic after trial ends.',
  }

  const responses: { [key: string]: string } = {
    'hi|hello|hey|greetings': '👋 Hey there! What would you like to know about PyMA pricing or plans?',
    'good morning|good afternoon|good evening':
      '😊 Hello! I\'m here to help with any questions about our plans and pricing.',

    'which plan|compare plans|what is the best|recommend|suggest':
      'Simple! We have two plans:\n\n' + plans.freetrial + '\n\n' + plans.monthly +
      '\n\n💡 Try the free trial (7 days), then continue at $29/month. No credit card needed.',

    'free trial|trial plan':
      '🎁 ' + plans.freetrial +
      '\n\nYou get full access for 7 days—perfect to test if PyMA works for your support team. After that, it\'s $29/month.',

    'pay per month|monthly subscription|how much after trial':
      '💳 ' + plans.monthly +
      '\n\nAfter your 7-day free trial ends, your account automatically converts to $29/month. You can cancel anytime!',

    'monthly|monthly plan|subscription':
      '⭐ ' + plans.monthly + '\n\nUnlimited messages, priority support, and SLA guarantee on all monthly plans.',

    'how much|cost|price|pricing|price comparison':
      'Simple pricing:\n\n' + plans.freetrial + '\n\n' + plans.monthly +
      '\n\nThat\'s it! Start free for 7 days, then $29/month if you want to keep going.',

    'included|features|what do i get|what is included':
      'Both plans include:\n✓ Full platform access\n✓ Unlimited messages\n✓ API key\n✓ FAQ upload\n✓ Analytics dashboard\n✓ Priority support',

    'free|trial|start free|seven days|7 days':
      plans.freetrial + '\n\nNo credit card needed. Just click "Start Free" to begin!',

    'how many messages|messages per month|message limit':
      '📊 Unlimited messages on both plans!\n\n' + plans.freetrial + '\n\n' + plans.monthly +
      '\n\nSend as many messages as you want—no limits!',

    'cancel|refund|money back':
      '✋ No problem!\n\n• **Free Trial (7 days):** Cancel anytime—if you cancel within 7 days, you won\'t be charged\n• **Monthly:** Cancel anytime after trial ends (prorated refund available)\n\nYour data stays yours, always.',

    'support|help|customer support|priority support':
      '🤝 Both plans include email support and access to https://docs.pym.ink/pyma\n\n**Free Trial:** Standard support\n**Monthly:** Priority support (24h response time)',

    'discount|coupon|promo|promotion|special offer':
      '🎉 Great question!\n\nWe offer discounts for:\n• Annual billing (save 20%)\n• Non-profits\n• Startups\n\nEmail support@phodata.xyz to discuss!',

    'api|api key|integration|integrate':
      '🔌 All plans include API access!\n\n• Free Trial: Full API access for 7 days\n• Monthly: Unlimited API calls\n\nDocs: https://docs.pym.ink/pyma/api',

    'uptime|sla|reliability|availability':
      '✅ We guarantee **99.9% uptime SLA** on all paid plans.\n\n• 97% FAQ accuracy\n• <1s response time\n• 24/7 monitoring\n\nYour customers won\'t notice a thing.',

    'faq|knowledge base|how it works|upload':
      '📚 How PyMA works:\n\n1. **Upload FAQ** → Paste content, upload file, or crawl your website\n2. **Train AI** → Instant (takes ~5 min)\n3. **Deploy** → Get API key and start using\n\nWe handle the AI—you focus on support quality.',

    'accuracy|hallucination|guardrails':
      '🎯 PyMA is FAQ-first, so hallucinations are nearly impossible!\n\n• 97% accuracy on trained FAQ\n• Answers only from your knowledge base\n• Falls back to "I don\'t know" when unsure\n\nNo making stuff up. Ever.',

    'trial expiration|after free trial|what happens after 7 days|trial ends':
      '⏰ After your 7-day Free Trial:\n\n1. **You can cancel anytime within the 7 days**—no charge if you do\n2. After day 7, your account converts to $29/month (auto-charged)\n3. Keep your FAQ and data\n\nFull access for 7 days. Cancel free if it\'s not for you! 😊',

    'enterprise|custom|custom plan|big company':
      '🏢 For enterprise needs:\n\n• Custom message limits\n• Dedicated support\n• SLA guarantees\n• Custom integrations\n\nEmail support@phodata.xyz to discuss your needs!',

    'speak with human|talk to human|speak with someone|talk to someone|customer service|representative|agent|real person':
      '👤 I understand!\n\nFor personalized support, email us at **support@phodata.xyz** and someone from our team will get back to you within 24 hours.\n\nWe\'re here to help! 😊',

    'thanks|thank you|that helps|helpful|great':
      '😊 Glad I could help!\n\nReady to get started? Click **Enroll** above or ask me anything else!',

    'bye|goodbye|see you|talk soon':
      '👋 Thanks for chatting! Visit https://docs.pym.ink/pyma or click **Enroll** to get started.',

    'enroll|sign up|get started|start|lets go':
      '🚀 Ready!\n\nClick the **Enroll** button at the top to start your Free Trial.\n\nNo credit card needed. Takes <2 minutes.',
  }

  for (const [keyword, response] of Object.entries(responses)) {
    const keywords = keyword.split('|')
    if (keywords.some((kw) => input.includes(kw))) {
      return response
    }
  }

  return (
    '🤔 Good question! I can help with:\n\n• Pricing & plans comparison\n• What\'s included\n• Free trial details\n• Payment & billing\n• Support & SLAs\n• Integration & API\n\n' +
    'What would you like to know? Or visit https://docs.pym.ink/pyma for more!'
  )
}
