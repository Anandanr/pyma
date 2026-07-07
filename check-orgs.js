const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://zxaghtrzrdexkcolwvig.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4YWdodHJ6cmRleGtjb2x3dmlnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDk4NTM5NSwiZXhwIjoyMDg2NTYxMzk1fQ.K9rdFOYnbhNFcUkf43ClCHZUW9C_v9qXx6DwGeZ9ebM';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkOrgs() {
  try {
    const { data: orgs, error } = await supabase
      .from('pyma_organizations')
      .select('id, email, api_key');
    
    if (error) {
      console.error('Error:', error);
      process.exit(1);
    }

    console.log('Organizations:', JSON.stringify(orgs, null, 2));
    
    // Now add FAQs to the first org
    if (orgs.length > 0) {
      const org = orgs[0];
      const faqs = [
        {
          title: 'What is PyMA?',
          content: 'PyMA is an AI-powered chatbot widget for customer support. It uses Groq AI to provide intelligent responses based on your FAQ knowledge base.',
        },
        {
          title: 'What are your pricing plans?',
          content: 'We offer a 7-day free trial for all new customers. After the trial, it is $29/month for unlimited messages. Pay as you go pricing is on the way SOON!',
        },
        {
          title: 'How do I get started?',
          content: 'Sign up through our enrollment page, and you will get an API key. Add your FAQs to the knowledge base, then embed the chatbot widget on your website.',
        },
      ];

      const { data: faqData, error: faqError } = await supabase
        .from('pyma_faqs')
        .insert(
          faqs.map(faq => ({
            organization_id: org.id,
            title: faq.title,
            content: faq.content,
          }))
        );

      if (faqError) {
        console.error('FAQ Error:', faqError);
      } else {
        console.log('FAQs added successfully:', faqs.length);
      }
    }
    
    process.exit(0);
  } catch (err) {
    console.error('Exception:', err.message);
    process.exit(1);
  }
}

checkOrgs();
