/**
 * THARUN GODWIN .C - PORTFOLIO AI KNOWLEDGE BOT ENGINE
 * Features:
 * - Interactive dialog chat drawer connected with the 3D Humanoid Bot
 * - Comprehensive knowledge base about Tharun's resume, projects, tools, certifications & education
 * - Reactive facial expressions and speech synthesis
 */

(function () {
  const KNOWLEDGE_BASE = {
    about: `**Tharun Godwin .C** is a Computer Science Engineering student specializing in **Cyber Security & Software Development** at **SKCET Coimbatore** (3rd Year / 5th Sem, CGPA: 7.4). He previously completed his Diploma in CSE at M.S.P.V.N.L.T Polytechnic with **89% Distinction**. He specializes in SOC monitoring, AI risk intelligence, cloud infrastructure, and full-stack API development.`,
    
    projects: `Tharun has engineered 4 flagship projects:
1. **Nexus SOC Platform**: Unified Security Operations Center dashboard combining vulnerability scanning, threat intelligence, firewall rule controls, IoT discovery, and dark-web reconnaissance.
2. **MPLAD AI Risk Intelligence (SIH Participant)**: Decision-support platform auditing public works using Isolation Forest anomaly detection, duplicate transaction traps, and automated risk scoring.
3. **Made In Veedu**: Full-stack e-commerce storefront with Spring Security JWT auth, order workflows, and an AI recommendation engine containerized with Docker Compose.
4. **AgriLoop 360**: Smart IoT agriculture dashboard tracking soil moisture, NPK ratios, fertilizer optimization, composting health, and food warehouse storage deterioration risks.`,
    
    tools: `Tharun is proficient in defensive, offensive, and AI tools:
• **Security & Pentesting**: Nmap, Wireshark, Metasploit, Exploit-DB, OWASP ZAP / Web Security Tools, Digital Forensics (EXIF / ExifTool), Ethical Hacking Tools.
• **Cloud & Systems**: Linux (Red Hat Certified), Docker, AWS (5 Educate Badges), Virtualization, Python, Java.
• **Modern Development**: React, Vite, Tailwind CSS, Spring Boot, FastAPI, MySQL, REST APIs.
• **AI & Agents**: Antigravity agentic workflows, Claude, ChatGPT, scikit-learn, Pandas, NumPy.`,

    sih: `Tharun participated in the prestigious **Smart India Hackathon (SIH)**, engineering the **MPLAD AI Risk & Anomaly Intelligence System**. It automates the audit of public works through unsupervised Isolation Forest machine learning anomaly detection, budget deviation checks, duplicate transaction traps, and downloadable inspection reports.`,

    certifications: `Tharun holds industry-recognized credentials:
• **Red Hat**: System Administration Training Certification
• **AWS Educate (5 Badges)**: Cloud 101, Compute, Networking, Security, Storage
• **Cybersecurity**: Ethical Hacking 101: Beginners Guide
• **Data Science**: Machine Learning using Python`,

    education: `Tharun's academic journey spans three landmarks across Tamil Nadu:
1. **BE CSE (Cyber Security)**: SKCET, Coimbatore (2025–2028, CGPA: 7.4)
2. **Diploma CSE**: M.S.P.V.N.L.T Polytechnic, Pavoorchatram, Alangulam (2023–2025, 89% Distinction)
3. **10th & 12th Standard**: Andrews Mat. Hr. Sec. School, Vickramasingapuram (72% Higher Sec, COVID pass 10th).
*You can track these three locations connected via a 3D flight arc on the interactive globe!*`,

    biometrics: `To unlock **Admin Edit Mode**:
1. Click the **'🔒 Admin Edit'** button in the navigation bar.
2. Touch your fingerprint sensor (Touch ID on macOS/iOS or Android fingerprint).
3. If biometrics is unavailable, you can use the secure fallback Master PIN: **'tharun2026'**.
4. Once verified, you can modify any text, upload new photos, add projects, and save changes to disk!`,

    contact: `You can reach Tharun directly:
• **Email**: godwintharun3@gmail.com
• **Phone**: +91 63694 54943
• **LinkedIn**: linkedin.com/in/tharun-godwin
• **GitHub**: github.com/godwintharun3-source
• **Location**: Tirunelveli, Tamil Nadu, India`
  };

  document.addEventListener('DOMContentLoaded', () => {
    initBotChatDrawer();
  });

  function initBotChatDrawer() {
    const triggerBtn = document.getElementById('btn-open-bot-chat');
    const drawer = document.getElementById('bot-chat-drawer');
    const closeBtn = document.getElementById('btn-close-bot-chat');
    const messagesBox = document.getElementById('bot-chat-messages');
    const form = document.getElementById('bot-chat-form');
    const input = document.getElementById('bot-chat-input');
    const chipBtns = document.querySelectorAll('[data-bot-prompt]');

    if (!drawer) return;

    if (triggerBtn) {
      triggerBtn.addEventListener('click', () => {
        drawer.classList.add('active');
        if (window.TGBot) {
          window.TGBot.setExpression('happy');
          window.TGBot.wave();
        }
        if (window.playSynthSound) window.playSynthSound('blip', 650, 0.08);
      });
    }

    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        drawer.classList.remove('active');
      });
    }

    // Quick chips
    chipBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const query = btn.dataset.botPrompt;
        handleUserQuery(query);
      });
    });

    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = input.value.trim();
        if (!text) return;
        input.value = '';
        handleUserQuery(text);
      });
    }

    function handleUserQuery(userText) {
      appendMessage('user', userText);

      if (window.TGBot) {
        window.TGBot.setExpression('thinking');
      }

      // Find best match in knowledge base
      const queryLower = userText.toLowerCase();
      let response = '';

      if (queryLower.includes('project') || queryLower.includes('nexus') || queryLower.includes('made in veedu') || queryLower.includes('agriloop')) {
        response = KNOWLEDGE_BASE.projects;
      } else if (queryLower.includes('tool') || queryLower.includes('nmap') || queryLower.includes('wireshark') || queryLower.includes('metasploit') || queryLower.includes('exploit') || queryLower.includes('owasp') || queryLower.includes('exif') || queryLower.includes('antigravity') || queryLower.includes('claude') || queryLower.includes('chatgpt')) {
        response = KNOWLEDGE_BASE.tools;
      } else if (queryLower.includes('sih') || queryLower.includes('hackathon') || queryLower.includes('smart india')) {
        response = KNOWLEDGE_BASE.sih;
      } else if (queryLower.includes('cert') || queryLower.includes('red hat') || queryLower.includes('aws') || queryLower.includes('ethical') || queryLower.includes('ml')) {
        response = KNOWLEDGE_BASE.certifications;
      } else if (queryLower.includes('school') || queryLower.includes('college') || queryLower.includes('education') || queryLower.includes('location') || queryLower.includes('tamil nadu') || queryLower.includes('skcet') || queryLower.includes('polytechnic')) {
        response = KNOWLEDGE_BASE.education;
      } else if (queryLower.includes('biometric') || queryLower.includes('edit') || queryLower.includes('fingerprint') || queryLower.includes('admin') || queryLower.includes('pin') || queryLower.includes('modify')) {
        response = KNOWLEDGE_BASE.biometrics;
      } else if (queryLower.includes('contact') || queryLower.includes('email') || queryLower.includes('phone') || queryLower.includes('reach') || queryLower.includes('hire')) {
        response = KNOWLEDGE_BASE.contact;
      } else {
        response = KNOWLEDGE_BASE.about;
      }

      setTimeout(() => {
        if (window.TGBot) {
          window.TGBot.setExpression('speaking');
          window.TGBot.wave();
        }
        appendMessage('bot', response);
      }, 500);
    }

    function appendMessage(sender, text) {
      const msgDiv = document.createElement('div');
      msgDiv.className = `chat-msg ${sender}`;

      if (sender === 'bot') {
        // Convert simple markdown bold/bullet to html
        let formatted = text
          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
          .replace(/\n•/g, '<br>•')
          .replace(/\n\d\./g, match => '<br>' + match.slice(1))
          .replace(/\n/g, '<br>');
        
        msgDiv.innerHTML = `
          <div class="msg-avatar">🤖</div>
          <div class="msg-bubble">${formatted}</div>
        `;
        if (window.playSynthSound) window.playSynthSound('blip', 780, 0.05);
      } else {
        msgDiv.innerHTML = `
          <div class="msg-bubble user-bubble">${text}</div>
        `;
      }

      messagesBox.appendChild(msgDiv);
      messagesBox.scrollTop = messagesBox.scrollHeight;
    }

    window.TGBotAI = {
      open: () => {
        drawer.classList.add('active');
        if (window.TGBot) {
          window.TGBot.setExpression('happy');
          window.TGBot.wave();
        }
      },
      close: () => {
        drawer.classList.remove('active');
      },
      ask: (question) => {
        handleUserQuery(question);
      }
    };
  }
})();
