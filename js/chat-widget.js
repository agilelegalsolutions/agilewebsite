/**
 * Agile Legal Solutions® — AI Legal Assistant Widget
 * Lightweight, vanilla JavaScript engine with zero external dependencies.
 * 
 * Features:
 *   - Auto-injected DOM with sleek floating launcher & mobile bottom sheet
 *   - Session persistence across page navigation via sessionStorage
 *   - Markdown-lite formatting (bolding, lists, linebreaks)
 *   - Honeypot anti-bot security
 *   - Direct WhatsApp lead capture bridge
 *   - Graceful offline & error fallbacks
 */

(function () {
  'use strict';

  // ==========================================================================
  // CONFIGURATION
  // ==========================================================================
  // Production Google Cloud Function (2nd Gen - asia-south1 Mumbai)
  const DEFAULT_API_ENDPOINT = "https://agile-trademark-chat-ftgfclihda-el.a.run.app";

  const CONFIG = {
    apiEndpoint: window.AGILE_CHAT_API_URL || DEFAULT_API_ENDPOINT,
    advocatePhone: "+919811343159",
    advocateDisplayPhone: "+91 98113 43159",
    leadCounsel: "Advocate Arun Kumar Jha",
    firmName: "Agile Legal Solutions®",
    storageKey: "agile_legal_chat_history_v1"
  };

  // State
  let isOpen = false;
  let isSending = false;
  let chatHistory = []; // { role: 'user' | 'model', text: string }

  // Quick Action Prompts
  const SUGGESTIONS = [
    { label: "Govt Fees (₹4,500 vs ₹9,000)", query: "What are the official government fees for registering a trademark?" },
    { label: "Objection Reply (30 Days)", query: "I received an examination report objection. What is the deadline to reply?" },
    { label: "Class 42 (SaaS) vs Class 9", query: "What is the difference between Class 9 and Class 42 for a tech startup?" },
    { label: "Class 25 (Clothing & Apparel)", query: "How do I register a clothing and fashion brand in Class 25?" },
    { label: "Talk to Advocate Arun", query: "I would like to speak directly with Advocate Arun Kumar Jha." }
  ];

  // ==========================================================================
  // DOM BUILDER
  // ==========================================================================
  function createWidgetDOM() {
    // 0. Proactive Teaser Speech Bubble
    const teaser = document.createElement('div');
    teaser.className = 'legal-chat-teaser';
    teaser.id = 'legalChatTeaser';
    teaser.style.display = 'none';
    teaser.innerHTML = `
      <div class="legal-chat-teaser-text">
        👋 Have a trademark query? Ask <strong>Agile AI</strong>
      </div>
      <button class="legal-chat-teaser-close" id="legalChatTeaserClose" aria-label="Dismiss">&times;</button>
    `;

    // 1. Floating Trigger Button
    const trigger = document.createElement('div');
    trigger.className = 'legal-chat-trigger';
    trigger.id = 'legalChatTrigger';
    trigger.setAttribute('role', 'button');
    trigger.setAttribute('aria-label', 'Open Agile AI Legal Assistant');
    trigger.innerHTML = `
      <div class="legal-chat-trigger-icon">
        <i class="fas fa-robot"></i>
        <div class="legal-chat-pulse"></div>
      </div>
      <div class="legal-chat-trigger-label">
        <span class="legal-chat-trigger-title">Agile AI</span>
        <span class="legal-chat-trigger-subtitle">Instant Legal Info • 24/7</span>
      </div>
    `;

    // 2. Chat Window
    const windowEl = document.createElement('div');
    windowEl.className = 'legal-chat-window';
    windowEl.id = 'legalChatWindow';
    windowEl.setAttribute('role', 'dialog');
    windowEl.setAttribute('aria-label', 'Agile Legal Solutions Chat Window');
    windowEl.innerHTML = `
      <!-- Header -->
      <div class="legal-chat-header">
        <div class="legal-chat-header-profile">
          <div class="legal-chat-avatar">
            <i class="fas fa-robot"></i>
          </div>
          <div class="legal-chat-header-info">
            <div class="legal-chat-header-title">
              Agile AI
              <i class="fas fa-check-circle text-primary small" title="Verified Law Chambers"></i>
            </div>
            <div class="legal-chat-header-status">
              <span class="legal-chat-status-dot"></span>
              Chambers of Adv. Arun Kumar Jha
            </div>
          </div>
        </div>
        <div class="legal-chat-header-actions">
          <button class="legal-chat-btn-icon" id="legalChatCloseBtn" aria-label="Close Chat">
            <i class="fas fa-times"></i>
          </button>
        </div>
      </div>

      <!-- BCI Legal Compliance Banner -->
      <div class="legal-chat-disclaimer">
        <i class="fas fa-shield-alt"></i>
        <span><strong>BCI Notice:</strong> Informational only under Indian trademark rules. Does not create an attorney-client relationship.</span>
      </div>

      <!-- Message History Container -->
      <div class="legal-chat-messages" id="legalChatMessages">
        <!-- Messages rendered here -->
      </div>

      <!-- Footer & Input Form -->
      <div class="legal-chat-footer">
        <form class="legal-chat-form" id="legalChatForm" autocomplete="off">
          <!-- Honeypot anti-bot field -->
          <input type="text" name="hp_auth" class="legal-chat-hp" tabindex="-1" autocomplete="off">
          
          <input type="text" class="legal-chat-input" id="legalChatInput" 
                 placeholder="Ask about fees, classes, objections..." maxlength="400" required>
          <button type="submit" class="legal-chat-send-btn" id="legalChatSendBtn" aria-label="Send Message">
            <i class="fas fa-paper-plane"></i>
          </button>
        </form>
      </div>
    `;

    document.body.appendChild(teaser);
    document.body.appendChild(trigger);
    document.body.appendChild(windowEl);
  }

  // ==========================================================================
  // MARKDOWN-LITE FORMATTER
  // ==========================================================================
  function formatMarkdown(text) {
    if (!text) return '';
    let escaped = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // Bold: **text**
    escaped = escaped.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    // Convert bullet points (* or -) into clean lists
    const lines = escaped.split('\n');
    let inList = false;
    let html = '';

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line.startsWith('* ') || line.startsWith('- ')) {
        if (!inList) {
          html += '<ul>';
          inList = true;
        }
        html += `<li>${line.substring(2)}</li>`;
      } else {
        if (inList) {
          html += '</ul>';
          inList = false;
        }
        if (line.length > 0) {
          html += `<p>${line}</p>`;
        }
      }
    }
    if (inList) html += '</ul>';
    return html;
  }

  // ==========================================================================
  // RENDER HELPERS
  // ==========================================================================
  function appendMessage(role, text) {
    const container = document.getElementById('legalChatMessages');
    if (!container) return;

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const msgEl = document.createElement('div');
    msgEl.className = `legal-chat-msg ${role === 'user' ? 'user' : 'bot'}`;
    
    msgEl.innerHTML = `
      <div class="legal-chat-bubble">${formatMarkdown(text)}</div>
      <span class="legal-chat-time">${timeStr}</span>
    `;

    container.appendChild(msgEl);
    container.scrollTop = container.scrollHeight;

    // Save to history and session
    chatHistory.push({ role, text });
    try {
      sessionStorage.setItem(CONFIG.storageKey, JSON.stringify(chatHistory));
    } catch (e) {
      // Ignore quota storage exceptions
    }

    // Check if we should render a WhatsApp lead card
    if (role === 'model') {
      checkForLeadIntent(text, container);
    }
  }

  function renderQuickSuggestions(container) {
    const chipWrapper = document.createElement('div');
    chipWrapper.className = 'legal-chat-suggestions';
    chipWrapper.id = 'legalChatSuggestions';

    SUGGESTIONS.forEach(s => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'legal-chat-chip';
      btn.innerText = s.label;
      btn.addEventListener('click', () => {
        handleUserSend(s.query);
      });
      chipWrapper.appendChild(btn);
    });

    container.appendChild(chipWrapper);
    container.scrollTop = container.scrollHeight;
  }

  function checkForLeadIntent(botText, container) {
    // If the conversation reaches certain keywords, offer instant WhatsApp bridge
    const keywords = ['whatsapp', 'call', 'advocate', 'arun', 'consultation', 'chamber', 'hire', 'file', 'register'];
    const lower = botText.toLowerCase();
    const hasIntent = keywords.some(k => lower.includes(k));

    if (hasIntent) {
      const waCard = document.createElement('div');
      waCard.className = 'legal-chat-action-card';
      waCard.innerHTML = `
        <div class="legal-chat-action-card-title">
          <i class="fab fa-whatsapp text-success me-1"></i> Speak Directly with Advocate Arun Kumar Jha
        </div>
        <p class="small text-muted mb-0">Have an examination objection or ready to register? Connect on WhatsApp for a fast consultation.</p>
        <a href="https://wa.me/${CONFIG.advocatePhone.replace('+', '')}?text=Hello%20Advocate%20Arun,%20I%20am%20inquiring%20via%20your%20website%20AI%20chat%20regarding%20my%20trademark." 
           class="legal-chat-btn-wa" target="_blank" rel="noopener">
          <i class="fab fa-whatsapp"></i> Chat on WhatsApp (${CONFIG.advocateDisplayPhone})
        </a>
      `;
      container.appendChild(waCard);
      container.scrollTop = container.scrollHeight;
    }
  }

  function showTypingIndicator() {
    const container = document.getElementById('legalChatMessages');
    if (!container) return null;

    const typingEl = document.createElement('div');
    typingEl.className = 'legal-chat-typing';
    typingEl.id = 'legalChatTypingIndicator';
    typingEl.innerHTML = `
      <div class="legal-chat-dot"></div>
      <div class="legal-chat-dot"></div>
      <div class="legal-chat-dot"></div>
    `;
    container.appendChild(typingEl);
    container.scrollTop = container.scrollHeight;
    return typingEl;
  }

  function hideTypingIndicator() {
    const typingEl = document.getElementById('legalChatTypingIndicator');
    if (typingEl) typingEl.remove();
  }

  // ==========================================================================
  // SEND MESSAGE LOGIC & API CALL
  // ==========================================================================
  async function handleUserSend(textOverride) {
    if (isSending) return;

    const input = document.getElementById('legalChatInput');
    const userText = textOverride || (input ? input.value.trim() : '');
    if (!userText) return;

    // Remove suggestion chips once conversation starts
    const existingChips = document.getElementById('legalChatSuggestions');
    if (existingChips) existingChips.remove();

    if (input && !textOverride) {
      input.value = '';
    }

    appendMessage('user', userText);
    isSending = true;

    const sendBtn = document.getElementById('legalChatSendBtn');
    if (sendBtn) sendBtn.disabled = true;

    showTypingIndicator();

    // Prepare API Payload
    const hpEl = document.querySelector('.legal-chat-hp');
    const hpValue = hpEl ? hpEl.value : '';

    const payload = {
      message: userText,
      history: chatHistory.slice(-6), // Send last 3 turns
      hp_auth: hpValue
    };

    try {
      const response = await fetch(CONFIG.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      hideTypingIndicator();

      if (response.ok) {
        const data = await response.json();
        const reply = data.reply || "Thank you for your inquiry. For specific trademark defense, please connect with Advocate Arun Kumar Jha on WhatsApp (+91 98113 43159).";
        appendMessage('model', reply);
      } else if (response.status === 429) {
        appendMessage('model', "You have reached the chat limit. Please connect directly with Advocate Arun Kumar Jha on WhatsApp at +91 98113 43159.");
      } else {
        // Fallback for unconfigured backend or server error
        appendMessage('model', "I am currently directing you to our senior chambers. You can speak directly with Advocate Arun Kumar Jha at +91 98113 43159 or click the WhatsApp button below.");
      }
    } catch (err) {
      console.warn("Agile Legal AI API unreachable, falling back to chamber contact:", err);
      hideTypingIndicator();
      appendMessage('model', "Our legal server is currently connecting. For immediate assistance with trademark objections, hearings, or filings, please click below to chat directly with Advocate Arun Kumar Jha on WhatsApp.");
    } finally {
      isSending = false;
      if (sendBtn) sendBtn.disabled = false;
      if (input) input.focus();
    }
  }

  // ==========================================================================
  // INITIALIZATION & EVENT LISTENERS
  // ==========================================================================
  function initChat() {
    createWidgetDOM();

    const trigger = document.getElementById('legalChatTrigger');
    const teaser = document.getElementById('legalChatTeaser');
    const teaserClose = document.getElementById('legalChatTeaserClose');
    const windowEl = document.getElementById('legalChatWindow');
    const closeBtn = document.getElementById('legalChatCloseBtn');
    const form = document.getElementById('legalChatForm');
    const messages = document.getElementById('legalChatMessages');

    // Toggle Chat
    function toggleChat() {
      isOpen = !isOpen;
      if (isOpen) {
        windowEl.classList.add('active');
        trigger.style.display = 'none';
        if (teaser) teaser.style.display = 'none';
        sessionStorage.setItem('agile_ai_opened', 'true');

        // Load history or initial welcome
        if (chatHistory.length === 0) {
          const stored = sessionStorage.getItem(CONFIG.storageKey);
          if (stored) {
            try {
              chatHistory = JSON.parse(stored);
              chatHistory.forEach(item => {
                const msgEl = document.createElement('div');
                msgEl.className = `legal-chat-msg ${item.role === 'user' ? 'user' : 'bot'}`;
                msgEl.innerHTML = `<div class="legal-chat-bubble">${formatMarkdown(item.text)}</div>`;
                messages.appendChild(msgEl);
              });
              messages.scrollTop = messages.scrollHeight;
            } catch (e) {
              chatHistory = [];
            }
          }

          if (chatHistory.length === 0) {
            appendMessage('model', "Welcome to **Agile Legal Solutions®**. I am **Agile AI**, your 24/7 Chamber Assistant for **Advocate Arun Kumar Jha** (4.9★ | 47 Reviews).\n\nHow can I help protect your brand today with trademark filing, statutory fees, objection replies, or hearings?");
            renderQuickSuggestions(messages);
          }
        }
        const input = document.getElementById('legalChatInput');
        if (input) setTimeout(() => input.focus(), 200);
      } else {
        windowEl.classList.remove('active');
        trigger.style.display = 'flex';
      }
    }

    trigger.addEventListener('click', toggleChat);
    closeBtn.addEventListener('click', toggleChat);

    // Teaser events
    if (teaser) {
      teaser.addEventListener('click', (e) => {
        if (e.target !== teaserClose) {
          toggleChat();
        }
      });
    }

    if (teaserClose) {
      teaserClose.addEventListener('click', (e) => {
        e.stopPropagation();
        teaser.style.display = 'none';
        sessionStorage.setItem('agile_ai_teaser_dismissed', 'true');
      });
    }

    // 1. Proactive Teaser Speech Bubble (appears after 3 seconds)
    setTimeout(() => {
      const hasInteracted = sessionStorage.getItem('agile_ai_opened') || sessionStorage.getItem('agile_ai_teaser_dismissed');
      if (teaser && !isOpen && !hasInteracted) {
        teaser.style.display = 'flex';
      }
    }, 3000);

    // 2. Intelligent Auto-Open on Desktop (after 5 seconds, once per session)
    setTimeout(() => {
      const autoOpened = sessionStorage.getItem('agile_ai_auto_opened');
      const isDesktop = window.innerWidth >= 992;
      if (!autoOpened && !isOpen && isDesktop) {
        sessionStorage.setItem('agile_ai_auto_opened', 'true');
        toggleChat();
      }
    }, 5000);

    // Form Submit
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      handleUserSend();
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isOpen) {
        toggleChat();
      }
    });
  }

  // Self-initialize once DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initChat);
  } else {
    initChat();
  }

})();
