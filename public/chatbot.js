/**
 * PyMA Chatbot Widget
 * Embed script for website integration
 * 
 * Usage:
 * <script 
 *   src="https://widget.pym.ink/chatbot.js"
 *   data-api-key="pyma_YOUR_API_KEY"
 * ></script>
 */

(function () {
  // Configuration
  const config = {
    apiKey: document.currentScript.dataset.apiKey,
    position: document.currentScript.dataset.position || 'bottom-right',
    theme: document.currentScript.dataset.theme || 'light',
    title: document.currentScript.dataset.title || 'Chat with us',
    placeholder: document.currentScript.dataset.placeholder || 'Ask a question...',
    hideOnMobile: document.currentScript.dataset.hideOnMobile === 'true',
    apiUrl: 'https://api.pym.ink/v1/pyma',
  }

  // Validate API key
  if (!config.apiKey || !config.apiKey.startsWith('pyma_')) {
    console.error('PyMA: Invalid API key. Please check your configuration.')
    return
  }

  // Create widget container
  function createWidget() {
    // Check mobile
    if (config.hideOnMobile && window.innerWidth < 768) {
      return
    }

    // Widget HTML
    const html = `
      <div id="pyma-widget" style="
        position: fixed;
        ${config.position.includes('bottom') ? 'bottom: 20px;' : 'top: 20px;'}
        ${config.position.includes('right') ? 'right: 20px;' : 'left: 20px;'}
        width: 400px;
        max-width: 90vw;
        height: 600px;
        max-height: 80vh;
        border-radius: 12px;
        box-shadow: 0 5px 40px rgba(0, 0, 0, 0.16);
        background: white;
        z-index: 999999;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
        overflow: hidden;
        display: flex;
        flex-direction: column;
      ">
        <!-- Header -->
        <div style="
          background: ${config.theme === 'dark' ? '#1f2937' : '#f3f4f6'};
          color: ${config.theme === 'dark' ? '#fff' : '#000'};
          padding: 16px;
          border-bottom: 1px solid ${config.theme === 'dark' ? '#374151' : '#e5e7eb'};
          display: flex;
          align-items: center;
          justify-content: space-between;
        ">
          <span style="font-weight: 600; font-size: 14px;">${config.title}</span>
          <button id="pyma-minimize" style="
            background: none;
            border: none;
            color: ${config.theme === 'dark' ? '#fff' : '#000'};
            cursor: pointer;
            font-size: 18px;
            padding: 0;
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
          ">_</button>
        </div>

        <!-- Messages -->
        <div id="pyma-messages" style="
          flex: 1;
          overflow-y: auto;
          padding: 16px;
          background: ${config.theme === 'dark' ? '#111827' : '#fff'};
        ">
          <div style="
            text-align: center;
            color: #999;
            font-size: 12px;
            margin-top: 8px;
          ">
            👋 Hi! How can we help?
          </div>
        </div>

        <!-- Input -->
        <div style="
          padding: 12px;
          border-top: 1px solid ${config.theme === 'dark' ? '#374151' : '#e5e7eb'};
          background: ${config.theme === 'dark' ? '#1f2937' : '#f9fafb'};
          display: flex;
          gap: 8px;
        ">
          <input 
            id="pyma-input"
            type="text"
            placeholder="${config.placeholder}"
            style="
              flex: 1;
              border: 1px solid ${config.theme === 'dark' ? '#374151' : '#e5e7eb'};
              border-radius: 6px;
              padding: 8px 12px;
              font-size: 14px;
              background: ${config.theme === 'dark' ? '#111827' : '#fff'};
              color: ${config.theme === 'dark' ? '#fff' : '#000'};
              outline: none;
            "
          />
          <button 
            id="pyma-send"
            style="
              background: #3b82f6;
              color: white;
              border: none;
              border-radius: 6px;
              padding: 8px 12px;
              cursor: pointer;
              font-size: 14px;
              font-weight: 500;
            "
          >
            ↑
          </button>
        </div>
      </div>

      <!-- Trigger button (when minimized) -->
      <div id="pyma-trigger" style="
        position: fixed;
        ${config.position.includes('bottom') ? 'bottom: 20px;' : 'top: 20px;'}
        ${config.position.includes('right') ? 'right: 20px;' : 'left: 20px;'}
        width: 56px;
        height: 56px;
        border-radius: 50%;
        background: #3b82f6;
        color: white;
        border: none;
        font-size: 24px;
        cursor: pointer;
        box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
        display: none;
        align-items: center;
        justify-content: center;
        z-index: 999998;
        transition: transform 0.2s;
      " title="Open chat">
        💬
      </div>
    `

    document.body.insertAdjacentHTML('beforeend', html)

    // Event listeners
    const widget = document.getElementById('pyma-widget')
    const trigger = document.getElementById('pyma-trigger')
    const input = document.getElementById('pyma-input')
    const sendBtn = document.getElementById('pyma-send')
    const messagesDiv = document.getElementById('pyma-messages')
    const minimizeBtn = document.getElementById('pyma-minimize')

    // Send message
    async function sendMessage() {
      const message = input.value.trim()
      if (!message) return

      // Add user message to display
      const msgEl = document.createElement('div')
      msgEl.style.cssText = `
        margin-bottom: 8px;
        text-align: right;
        font-size: 13px;
      `
      msgEl.innerHTML = `<div style="
        background: #3b82f6;
        color: white;
        padding: 8px 12px;
        border-radius: 8px;
        display: inline-block;
        max-width: 80%;
      ">${message}</div>`
      messagesDiv.appendChild(msgEl)
      input.value = ''
      messagesDiv.scrollTop = messagesDiv.scrollHeight

      // Send to API
      try {
        const response = await fetch(`${config.apiUrl}/chat`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-API-Key': config.apiKey,
          },
          body: JSON.stringify({
            message: message,
            session_id: `user_${Math.random().toString(36).substr(2, 9)}`,
          }),
        })

        const data = await response.json()

        if (response.ok && data.response) {
          const botMsgEl = document.createElement('div')
          botMsgEl.style.cssText = `
            margin-bottom: 8px;
            text-align: left;
            font-size: 13px;
          `
          botMsgEl.innerHTML = `<div style="
            background: ${config.theme === 'dark' ? '#374151' : '#e5e7eb'};
            color: ${config.theme === 'dark' ? '#fff' : '#000'};
            padding: 8px 12px;
            border-radius: 8px;
            display: inline-block;
            max-width: 80%;
          ">${data.response}</div>`
          messagesDiv.appendChild(botMsgEl)
        } else {
          console.error('PyMA API error:', data)
        }
      } catch (err) {
        console.error('PyMA error:', err)
      }

      messagesDiv.scrollTop = messagesDiv.scrollHeight
    }

    sendBtn.addEventListener('click', sendMessage)
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') sendMessage()
    })

    // Minimize/Maximize
    minimizeBtn.addEventListener('click', () => {
      widget.style.display = 'none'
      trigger.style.display = 'flex'
    })

    trigger.addEventListener('click', () => {
      widget.style.display = 'flex'
      trigger.style.display = 'none'
      input.focus()
    })

    input.focus()
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createWidget)
  } else {
    createWidget()
  }

  // Expose API for custom control
  window.PyMA = {
    show: function () {
      const widget = document.getElementById('pyma-widget')
      if (widget) widget.style.display = 'flex'
    },
    hide: function () {
      const widget = document.getElementById('pyma-widget')
      if (widget) widget.style.display = 'none'
    },
  }
})()
