const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://zxaghtrzrdexkcolwvig.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4YWdodHJ6cmRleGtjb2x3dmlnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDk4NTM5NSwiZXhwIjoyMDg2NTYxMzk1fQ.K9rdFOYnbhNFcUkf43ClCHZUW9C_v9qXx6DwGeZ9ebM';

const supabase = createClient(supabaseUrl, supabaseKey);

async function addFAQs() {
  try {
    // Get org ID
    const { data: org } = await supabase
      .from('pyma_organizations')
      .select('id')
      .eq('email', 'test@widget.local')
      .single();
    
    if (!org) {
      console.error('Organization not found');
      process.exit(1);
    }

    const faqs = [
      {
        title: 'What is PyMA?',
        content: 'PyMA is an AI-powered chatbot widget for customer support. It uses Groq AI to provide intelligent responses to customer questions based on your FAQ knowledge base.',
      },
      {
        title: 'What are your pricing plans?',
        content: 'We offer a 7-day free trial for all new customers. After the trial, it\'s $29/month for unlimited messages. Pay as you go pricing is on the way SOON!',
      },
      {
        title: 'How do I get started?',
        content: 'Sign up through our enrollment page, and you\'ll get an API key. Add your FAQs to the knowledge base, then embed the chatbot widget on your website using the provided embed code.',
      },
      {
        title: 'Can I customize the chatbot?',
        content: 'Yes! You can customize the chatbot\'s theme, position, title, and placeholder text through data attributes in the embed code.',
      },
      {
        title: 'What are your payment methods?',
        content: 'We accept all major credit cards via Stripe. Invoicing and other payment methods coming soon.',
      },
    ];

    const { data, error } = await supabase
      .from('pyma_faqs')
      .insert(
        faqs.map(faq => ({
          organization_id: org.id,
          title: faq.title,
          content: faq.content,
        }))
      );

    if (error) {
      console.error('Error:', error);
      process.exit(1);
    }

    console.log('✅ FAQs added:', faqs.length);
    process.exit(0);
  } catch (err) {
    console.error('Exception:', err.message);
    process.exit(1);
  }
}

addFAQs();
