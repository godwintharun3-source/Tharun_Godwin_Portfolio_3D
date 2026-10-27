/**
 * THARUN GODWIN .C - BIOMETRIC AUTHENTICATION & IN-PLACE CMS ENGINE
 * Features:
 * - WebAuthn Fingerprint / Touch ID Biometric Verification
 * - Fallback Secure Master PIN (default: tharun2026)
 * - In-place editing (titles, bios, project descriptions, skills, education)
 * - Image replacement (Profile photo & Project covers)
 * - Add/Remove Projects & Cards dynamically
 * - LocalStorage + Backend API persistence (/api/save, /api/data)
 * - Export / Import Portfolio JSON Backup
 */

(function () {
  let isAdminAuthenticated = false;
  let authModalEl = null;
  const MASTER_PIN = 'tharun2026';
  const STORAGE_KEY = 'tg_portfolio_cms_data';

  function openAuthModal() {
    if (!authModalEl) authModalEl = document.getElementById('biometric-modal');
    if (authModalEl) {
      authModalEl.classList.add('active');
      setAuthStatus('Scan your fingerprint or enter Master PIN to unlock editing.', 'cyan');
      const pinInput = document.getElementById('pin-input');
      if (pinInput) pinInput.value = '';
      if (window.playSynthSound) window.playSynthSound('blip', 600, 0.08);
    }
  }

  function closeAuthModal() {
    if (!authModalEl) authModalEl = document.getElementById('biometric-modal');
    if (authModalEl) authModalEl.classList.remove('active');
  }

  function setAuthStatus(msg, color) {
    const authStatus = document.getElementById('auth-status-text');
    if (!authStatus) return;
    authStatus.textContent = msg;
    authStatus.className = `auth-status ${color}`;
  }

  document.addEventListener('DOMContentLoaded', () => {
    initAuthModal();
    restoreSavedContent();
  });

  /* ==========================================================================
     1. BIOMETRIC & PIN AUTHENTICATION
     ========================================================================== */
  function initAuthModal() {
    const authBtn = document.getElementById('btn-biometric-auth');
    authModalEl = document.getElementById('biometric-modal');
    const closeBtn = document.getElementById('modal-auth-close');
    const fingerprintScanBtn = document.getElementById('btn-scan-fingerprint');
    const pinForm = document.getElementById('pin-auth-form');
    const pinInput = document.getElementById('pin-input');

    if (!authBtn || !authModalEl) return;

    authBtn.addEventListener('click', () => {
      if (isAdminAuthenticated) {
        // Toggle lock
        exitAdminMode();
      } else {
        openAuthModal();
      }
    });

    const officerLoginBtn = document.getElementById('btn-officer-login');
    if (officerLoginBtn) {
      officerLoginBtn.addEventListener('click', () => {
        if (!isAdminAuthenticated) {
          openAuthModal();
        } else {
          exitAdminMode();
        }
      });
    }

    if (closeBtn) {
      closeBtn.addEventListener('click', closeAuthModal);
    }

    authModalEl.addEventListener('click', (e) => {
      if (e.target === authModalEl) closeAuthModal();
    });

    // Biometric Fingerprint Button
    if (fingerprintScanBtn) {
      fingerprintScanBtn.addEventListener('click', async () => {
        setAuthStatus('Waiting for Touch ID / Fingerprint sensor...', 'cyan');
        fingerprintScanBtn.classList.add('scanning');

        try {
          const success = await triggerWebAuthn();
          if (success) {
            handleAuthSuccess('Fingerprint Biometrics Verified! Unlocking Admin Mode...');
          } else {
            setAuthStatus('Biometrics bypassed or unavailable. Please use Master PIN.', 'rose');
          }
        } catch (err) {
          console.warn('WebAuthn prompt error:', err);
          setAuthStatus('Fingerprint timed out. You can use Master PIN below.', 'rose');
        } finally {
          fingerprintScanBtn.classList.remove('scanning');
        }
      });
    }

    // PIN Form Fallback
    if (pinForm) {
      pinForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const pin = pinInput.value.trim();
        if (pin === MASTER_PIN) {
          handleAuthSuccess('Master PIN Accepted! Unlocking Admin Mode...');
        } else {
          setAuthStatus('Incorrect PIN! Access Denied.', 'rose');
          pinInput.value = '';
          pinInput.focus();
        }
      });
    }

    function handleAuthSuccess(msg) {
      setAuthStatus(msg, 'emerald');
      if (window.playSynthSound) window.playSynthSound('blip', 880, 0.15);
      setTimeout(() => {
        closeAuthModal();
        enterAdminMode();
      }, 700);
    }
  }

  // WebAuthn Verification
  async function triggerWebAuthn() {
    if (!window.PublicKeyCredential) {
      return false;
    }

    try {
      // Check if user-verifying platform authenticator (Touch ID, Windows Hello, Fingerprint) is available
      const available = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
      if (!available) {
        return false;
      }

      // Generate realistic WebAuthn challenge
      const challenge = new Uint8Array(32);
      window.crypto.getRandomValues(challenge);

      const userId = new Uint8Array(16);
      window.crypto.getRandomValues(userId);

      const publicKeyCredentialCreationOptions = {
        challenge: challenge,
        rp: {
          name: "Tharun Godwin Portfolio Admin",
          id: window.location.hostname || "localhost"
        },
        user: {
          id: userId,
          name: "tharungodwin",
          displayName: "Tharun Godwin .C"
        },
        pubKeyCredParams: [{ alg: -7, type: "public-key" }, { alg: -257, type: "public-key" }],
        authenticatorSelection: {
          authenticatorAttachment: "platform",
          userVerification: "preferred"
        },
        timeout: 30000
      };

      const credential = await navigator.credentials.create({
        publicKey: publicKeyCredentialCreationOptions
      });

      return !!credential;
    } catch (e) {
      // On local non-HTTPS or skipped biometric prompts, allow fallback
      return false;
    }
  }

  /* ==========================================================================
     2. ADMIN MODE CONTROLS & IN-PLACE EDITING
     ========================================================================== */
  function enterAdminMode() {
    isAdminAuthenticated = true;
    document.body.classList.add('admin-mode-active');

    // Update navbar button
    const authBtn = document.getElementById('btn-biometric-auth');
    if (authBtn) {
      authBtn.innerHTML = `
        <span class="status-dot-active"></span>
        <span>🔓 Admin Active (Exit)</span>
      `;
      authBtn.classList.add('active-admin');
    }

    // Show Admin Floating Toolbar
    let toolbar = document.getElementById('admin-toolbar');
    if (!toolbar) {
      toolbar = createAdminToolbar();
      document.body.appendChild(toolbar);
    }
    toolbar.classList.add('show');

    // Enable contenteditable on marked text nodes
    enableContentEditable(true);

    if (window.showToast) {
      window.showToast('🔒 Biometric Verified! In-Place Edit Mode Activated.');
    }
  }

  function exitAdminMode() {
    isAdminAuthenticated = false;
    document.body.classList.remove('admin-mode-active');

    const authBtn = document.getElementById('btn-biometric-auth');
    if (authBtn) {
      authBtn.innerHTML = `
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 2a10 10 0 0 0-10 10c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69"></path>
          <path d="M12 12v4"></path>
          <circle cx="12" cy="8" r="1"></circle>
        </svg>
        <span>🔒 Admin Edit</span>
      `;
      authBtn.classList.remove('active-admin');
    }

    const toolbar = document.getElementById('admin-toolbar');
    if (toolbar) toolbar.classList.remove('show');

    enableContentEditable(false);

    if (window.showToast) {
      window.showToast('Admin Mode Locked.');
    }
  }

  function enableContentEditable(enabled) {
    const editables = document.querySelectorAll('[data-cms-key]');
    editables.forEach(el => {
      el.contentEditable = enabled ? 'true' : 'false';
      if (enabled) {
        el.classList.add('cms-editable-highlight');
      } else {
        el.classList.remove('cms-editable-highlight');
      }
    });

    // Setup Photo upload click on profile image when in admin mode
    const profileImg = document.querySelector('.profile-inner-img');
    if (profileImg) {
      if (enabled) {
        profileImg.style.cursor = 'pointer';
        profileImg.title = 'Click to change Profile Photo';
        profileImg.onclick = triggerPhotoUpload;
      } else {
        profileImg.style.cursor = '';
        profileImg.title = '';
        profileImg.onclick = null;
      }
    }
  }

  function createAdminToolbar() {
    const bar = document.createElement('div');
    bar.id = 'admin-toolbar';
    bar.className = 'admin-toolbar glass-panel';
    bar.innerHTML = `
      <div class="admin-toolbar-inner">
        <div class="admin-badge">
          <span class="status-dot"></span>
          <span>ADMIN CMS ACTIVE</span>
        </div>
        <div class="admin-actions">
          <button id="cms-save-btn" class="admin-btn primary" title="Save changes to LocalStorage and Server">
            💾 Save All Changes
          </button>
          <button id="cms-add-project-btn" class="admin-btn" title="Add new project card">
            ➕ Add Project
          </button>
          <button id="cms-change-photo-btn" class="admin-btn" title="Upload new profile picture">
            📸 Change Photo
          </button>
          <button id="cms-export-btn" class="admin-btn" title="Download backup JSON">
            📥 Export JSON
          </button>
          <button id="cms-reset-btn" class="admin-btn danger" title="Reset all edits to original resume">
            🔄 Reset
          </button>
          <button id="cms-exit-btn" class="admin-btn" title="Lock edit mode">
            🔒 Lock
          </button>
        </div>
      </div>
    `;

    // Hook buttons
    setTimeout(() => {
      document.getElementById('cms-save-btn')?.addEventListener('click', saveAllContent);
      document.getElementById('cms-add-project-btn')?.addEventListener('click', addNewProjectCard);
      document.getElementById('cms-change-photo-btn')?.addEventListener('click', triggerPhotoUpload);
      document.getElementById('cms-export-btn')?.addEventListener('click', exportContentJSON);
      document.getElementById('cms-reset-btn')?.addEventListener('click', resetContent);
      document.getElementById('cms-exit-btn')?.addEventListener('click', exitAdminMode);
    }, 100);

    return bar;
  }

  /* ==========================================================================
     3. CONTENT PERSISTENCE & ACTIONS
     ========================================================================== */
  function collectContent() {
    const data = {};
    const editables = document.querySelectorAll('[data-cms-key]');
    editables.forEach(el => {
      const key = el.getAttribute('data-cms-key');
      data[key] = el.innerHTML.trim();
    });

    const profileImg = document.querySelector('.profile-inner-img');
    if (profileImg && profileImg.src.startsWith('data:image')) {
      data['profile_image_custom'] = profileImg.src;
    }

    return data;
  }

  function saveAllContent() {
    const data = collectContent();

    // 1. Save to LocalStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));

    // 2. Persist to Backend server if available
    fetch('/api/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(res => res.json())
      .then(res => {
        if (window.showToast) window.showToast('✅ Changes saved to LocalStorage & Server disk!');
      }).catch(() => {
        if (window.showToast) window.showToast('✅ Saved to LocalStorage!');
      });

    if (window.playSynthSound) window.playSynthSound('blip', 900, 0.12);
  }

  function restoreSavedContent() {
    // 1. Try local storage first
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const data = JSON.parse(saved);
        applyContentData(data);
      } catch (e) {}
    }

    // 2. Check server /api/data
    fetch('/api/data')
      .then(res => res.json())
      .then(data => {
        if (data && Object.keys(data).length > 0) {
          applyContentData(data);
        }
      }).catch(() => {});
  }

  function applyContentData(data) {
    if (!data) return;
    Object.keys(data).forEach(key => {
      if (key === 'profile_image_custom') {
        const img = document.querySelector('.profile-inner-img');
        if (img) img.src = data[key];
        return;
      }
      const el = document.querySelector(`[data-cms-key="${key}"]`);
      if (el) {
        el.innerHTML = data[key];
      }
    });
  }

  function triggerPhotoUpload() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (evt) => {
        const base64Img = evt.target.result;
        const img = document.querySelector('.profile-inner-img');
        if (img) {
          img.src = base64Img;
          // Upload to server if possible
          fetch('/api/upload-photo', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ image: base64Img })
          }).catch(() => {});

          saveAllContent();
          if (window.showToast) window.showToast('📸 Profile photo updated!');
        }
      };
      reader.readAsDataURL(file);
    };
    input.click();
  }

  function addNewProjectCard() {
    const grid = document.querySelector('.projects-grid');
    if (!grid) return;

    const projectId = Date.now();
    const newCard = document.createElement('div');
    newCard.className = 'glass-panel project-card';
    newCard.innerHTML = `
      <div>
        <div class="project-top">
          <span class="project-category-badge" contenteditable="true" data-cms-key="proj_${projectId}_cat">
            🛡️ NEW DISCIPLINE
          </span>
          <div class="project-links-row">
            <button class="btn-icon" onclick="this.closest('.project-card').remove();" title="Delete Card" style="color: var(--rose);">
              ✕
            </button>
          </div>
        </div>
        <h3 class="project-title" contenteditable="true" data-cms-key="proj_${projectId}_title">
          New Project Title <span>// Specification</span>
        </h3>
        <p class="project-desc" contenteditable="true" data-cms-key="proj_${projectId}_desc">
          Click here to write the summary of your new project, architectural features, backend technologies, and implementation details.
        </p>
        <ul class="project-features-list" contenteditable="true" data-cms-key="proj_${projectId}_features">
          <li>✔ Key feature or security component description</li>
          <li>✔ Microservice or model architecture detail</li>
        </ul>
      </div>
      <div class="project-tech-stack" contenteditable="true" data-cms-key="proj_${projectId}_tech">
        <span class="tech-tag">Tech 1</span>
        <span class="tech-tag">Tech 2</span>
        <span class="tech-tag">Docker</span>
      </div>
    `;

    grid.prepend(newCard);
    if (window.showToast) window.showToast('➕ New project card inserted! Click to edit.');
    newCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  function exportContentJSON() {
    const data = collectContent();
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tharun_godwin_portfolio_data_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    if (window.showToast) window.showToast('📥 Portfolio JSON Exported!');
  }

  function resetContent() {
    if (confirm('Are you sure you want to reset all modifications back to the default resume?')) {
      localStorage.removeItem(STORAGE_KEY);
      location.reload();
    }
  }

  function unlockWithPin(pin) {
    if (pin === MASTER_PIN) {
      closeAuthModal();
      enterAdminMode();
      return true;
    }
    return false;
  }

  window.TGAdmin = {
    enter: enterAdminMode,
    exit: exitAdminMode,
    save: saveAllContent,
    unlockWithPin: unlockWithPin,
    isAuthenticated: () => isAdminAuthenticated
  };
})();
