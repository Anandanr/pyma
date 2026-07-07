/**
 * PyMA Chatbot Widget v2
 * Simpler, more robust version
 */

console.log('[PyMA] Widget script loading...');

(function () {
  try {
    console.log('[PyMA] Script IIFE starting');
    
    // Find script tag
    const scripts = Array.from(document.querySelectorAll('script'));
    const scriptTag = scripts.find(s => s.src && s.src.includes('chatbot'));
    
    console.log('[PyMA] Script tag found:', !!scriptTag);
    
    if (!scriptTag) {
      console.error('[PyMA] Could not find script tag');
      return;
    }

    const apiKey = scriptTag.dataset.apiKey;
    console.log('[PyMA] API Key:', apiKey ? 'Present' : 'MISSING');

    if (!apiKey) {
      console.error('[PyMA] No API key provided');
      return;
    }

    // Create bubble button
    const bubble = document.createElement('button');
    bubble.id = 'pyma-bubble';
    bubble.textContent = '💬';
    bubble.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 56px;
      height: 56px;
      border-radius: 50%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      font-size: 24px;
      cursor: pointer;
      z-index: 999998;
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
      transition: transform 0.2s;
    `;

    // Create widget window
    const widget = document.createElement('div');
    widget.id = 'pyma-widget';
    widget.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 380px;
      max-width: 90vw;
      height: 500px;
      border-radius: 12px;
      background: white;
      box-shadow: 0 5px 40px rgba(0, 0, 0, 0.16);
      display: none;
      flex-direction: column;
      z-index: 999999;
    `;

    widget.innerHTML = `
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 16px; border-radius: 12px 12px 0 0; display: flex; justify-content: space-between; align-items: center;">
        <div>
          <div style="font-weight: 600; font-size: 14px;">PyMA Support</div>
          <div style="font-size: 12px; opacity: 0.9;">Typically replies instantly</div>
        </div>
        <button id="pyma-close" style="background: rgba(255,255,255,0.2); border: none; color: white; width: 32px; height: 32px; border-radius: 6px; cursor: pointer; font-size: 18px;">−</button>
      </div>
      <div id="pyma-messages" style="flex: 1; overflow-y: auto; padding: 16px; background: #fafafa;">
        <div style="text-align: center; color: #999; font-size: 12px;">
          👋 Hi! How can we help?
        </div>
      </div>
      <div style="padding: 12px; border-top: 1px solid #eee; display: flex; gap: 8px;">
        <input id="pyma-input" type="text" placeholder="Ask a question..." style="flex: 1; border: 1px solid #ddd; border-radius: 20px; padding: 8px 14px; font-size: 13px; outline: none; font-family: inherit;">
        <button id="pyma-send" style="background: #667eea; color: white; border: none; border-radius: 50%; width: 36px; height: 36px; cursor: pointer; font-size: 18px;">➤</button>
      </div>
    `;

    // Add to DOM
    document.body.appendChild(bubble);
    document.body.appendChild(widget);

    console.log('[PyMA] Widget elements added to DOM');

    // Event listeners
    const input = widget.querySelector('#pyma-input');
    const sendBtn = widget.querySelector('#pyma-send');
    const messagesDiv = widget.querySelector('#pyma-messages');
    const closeBtn = widget.querySelector('#pyma-close');

    bubble.addEventListener('click', () => {
      widget.style.display = 'flex';
      bubble.style.display = 'none';
      input.focus();
    });

    closeBtn.addEventListener('click', () => {
      widget.style.display = 'none';
      bubble.style.display = 'block';
    });

    async function sendMessage() {
      const message = input.value.trim();
      if (!message) return;

      // Add user message
      const userMsg = document.createElement('div');
      userMsg.style.cssText = `
        margin-bottom: 12px;
        text-align: right;
      `;
      userMsg.innerHTML = `<div style="background: #667eea; color: white; padding: 10px 14px; border-radius: 12px; display: inline-block; max-width: 80%; word-wrap: break-word;">${message}</div>`;
      messagesDiv.appendChild(userMsg);

      input.value = '';
      messagesDiv.scrollTop = messagesDiv.scrollHeight;

      // Send to API
      try {
        const response = await fetch('http://localhost:3001/api/v1/pyma/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            api_key: apiKey,
            message: message,
          }),
        });

        const data = await response.json();

        if (response.ok && data.response) {
          const botMsg = document.createElement('div');
          botMsg.style.cssText = `
            margin-bottom: 12px;
            text-align: left;
          `;
          botMsg.innerHTML = `<div style="background: #e8eaf6; color: #1a1a1a; padding: 10px 14px; border-radius: 12px; display: inline-block; max-width: 80%; word-wrap: break-word;">${data.response}</div>`;
          messagesDiv.appendChild(botMsg);
        } else {
          console.error('[PyMA] API error:', data);
        }
      } catch (err) {
        console.error('[PyMA] Error:', err);
      }

      messagesDiv.scrollTop = messagesDiv.scrollHeight;
    }

    sendBtn.addEventListener('click', sendMessage);
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') sendMessage();
    });

    console.log('[PyMA] Widget initialized successfully ✓');

  } catch (err) {
    console.error('[PyMA] Fatal error:', err);
  }
})();

console.log('[PyMA] Widget script loaded');
