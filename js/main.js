/**
 * Blood Donors Association of Berkane - Main Interactive JavaScript
 * Association des Donneurs de Sang de Berkane
 * جمعية المتبرعين بالدم ببركان
 * 
 * Features:
 *  1. Dark / Light Mode Toggle
 *  2. Emergency Banner Dismiss (Session-persistent)
 *  3. Sticky Navbar Scroll Effect
 *  4. Mobile Navigation Menu Toggle
 *  5. Animated Roll-Up Stat Counters
 *  6. Mouse-Tracking Spotlight Glow on Stat Cards
 *  7. Blood Type Compatibility Matrix Interactive System
 *  8. Interactive 5-Step Eligibility Quiz
 *  9. Live Countdown Timer (Target: Nov 14, 2026, 09:00 AM Morocco Time)
 * 10. Registration Form Tabs (Donor / Volunteer)
 * 11. Form Submission Handling & Validation
 * 12. Toast Notification System
 * 13. Moroccan Confetti Celebration Effect
 * 14. Smooth Anchor Scrolling with Navbar Offset
 * 15. Floating WhatsApp Direct Connect Button
 * 16. Scroll Reveal & Stagger Animations
 */

'use strict';

document.addEventListener('DOMContentLoaded', () => {

  // =========================================================================
  // Security Helpers: HTML Escaping & URL Sanitization
  // =========================================================================
  function escapeHtml(str) {
    if (str === null || str === undefined) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function sanitizeUrl(url, fallback = 'assets/logo.png') {
    if (!url || typeof url !== 'string') return fallback;
    const trimmed = url.trim();
    // Prevent attribute breakout and XSS: disallow quotes, brackets, and control chars
    if (/[<>"'`\x00-\x1F\x7F]/.test(trimmed)) {
      return fallback;
    }
    if (trimmed.startsWith('/') || trimmed.startsWith('./') || trimmed.startsWith('assets/') ||
        trimmed.startsWith('https://') || trimmed.startsWith('http://') ||
        trimmed.startsWith('data:image/')) {
      return trimmed;
    }
    return fallback;
  }

  // Security & Validation Helper: Moroccan phone number format
  function isValidMoroccanPhone(phone) {
    if (!phone || typeof phone !== 'string') return false;
    const rawTel = phone.trim().replace(/[\s\-\.]/g, '');
    return /^(?:(?:\+|00)212|0)[5-7]\d{8}$/.test(rawTel);
  }

  // =========================================================================
  // Helper: Current Language & Bilingual Translations
  // =========================================================================
  function getCurrentLang() {
    if (typeof window.getCurrentLang === 'function') {
      try {
        return window.getCurrentLang();
      } catch (e) {
        console.warn('Error reading window.getCurrentLang():', e);
      }
    }
    return document.documentElement.getAttribute('lang') || 'ar';
  }

  // Built-in toast & dynamic interface translations dictionary fallback
  const internalTranslations = {
    ar: {
      toast_donor_success: 'تم تسجيل طلب التبرع بالدم بنجاح! شكراً لعطائك الإنساني النبيل.',
      toast_volunteer_success: 'تم تسجيلك كمتطوع بنجاح! أهلاً بك في أسرة جمعية المتبرعين بالدم ببركان.',
      toast_fill_required: 'يرجى ملء جميع الحقول المطلوبة بشكل صحيح.',
      toast_consent_required: 'يرجى الموافقة على الشروط والتصريح الصحي للمتابعة.',
      toast_error_general: 'حدث خطأ ما، يرجى المحاولة مرة أخرى.',
      all_blood_types: 'جميع الفصائل (الكل)',
      campaign_in_progress: 'حان موعد الحملة',
      quiz_pass_title: 'أنت مؤهل مبدئياً للتبرع بالدم!',
      quiz_pass_desc: 'بناءً على إجاباتك، يمكنك التقدم للتبرع بالدم. سيقوم الطبيب المختص بالفحص النهائي في موقع الحملة.',
      quiz_fail_title: 'غير مؤهل للتبرع حالياً',
      quiz_fail_desc: 'بناءً على إجاباتك، قد يتعذر عليك التبرع حالياً لسلامتك أو سلامة المتلقي. شكراً لنبلك ورغبتك في العطاء!'
    },
    fr: {
      toast_donor_success: 'Votre inscription en tant que donneur a été enregistrée avec succès! Merci pour votre générosité.',
      toast_volunteer_success: 'Votre inscription en tant que bénévole a été validée avec succès! Bienvenue dans notre équipe.',
      toast_fill_required: 'Veuillez remplir correctement tous les champs obligatoires.',
      toast_consent_required: 'Veuillez accepter les conditions et la déclaration médicale pour continuer.',
      toast_error_general: 'Une erreur est survenue, veuillez réessayer.',
      all_blood_types: 'Tous les groupes (TOUS)',
      campaign_in_progress: 'Le moment de la campagne est arrivé',
      quiz_pass_title: 'Vous êtes éligible au don de sang!',
      quiz_pass_desc: 'D’après vos réponses, vous remplissez les conditions requises. Une consultation médicale finale sera réalisée sur place.',
      quiz_fail_title: 'Non éligible pour le moment',
      quiz_fail_desc: 'D’après vos réponses, le don de sang vous est temporairement ou définitivement déconseillé pour votre protection ou celle du receveur.'
    }
  };

  function translate(key) {
    const lang = getCurrentLang();
    // Check if key is available in external window.translations
    if (window.translations && window.translations[lang] && window.translations[lang][key]) {
      return window.translations[lang][key];
    }
    // Check in internal dictionary
    if (internalTranslations[lang] && internalTranslations[lang][key]) {
      return internalTranslations[lang][key];
    }
    if (internalTranslations.ar && internalTranslations.ar[key]) {
      return internalTranslations.ar[key];
    }
    return key;
  }

  // Registration receipt: shown only after the submission has been saved.
  const registrationSuccessDialog = document.getElementById('registration-success-dialog');
  let registrationReturnFocus = null;
  let registrationPreviousOverflow = '';

  function showRegistrationConfirmation(category, returnFocus) {
    if (!registrationSuccessDialog || registrationSuccessDialog.open) return;
    const title = document.getElementById('registration-success-title');
    const key = `registration_success_${category}_title`;
    title.setAttribute('data-i18n', key);
    title.textContent = translate(key);
    document.getElementById('registration-success-description').textContent = translate('registration_success_description');
    registrationSuccessDialog.querySelector('button').textContent = translate('registration_success_acknowledge');
    registrationReturnFocus = returnFocus;
    registrationPreviousOverflow = document.body.style.overflow;
    registrationSuccessDialog.showModal();
    document.body.style.overflow = 'hidden';
  }

  if (registrationSuccessDialog) {
    registrationSuccessDialog.addEventListener('close', () => {
      document.body.style.overflow = registrationPreviousOverflow;
      if (registrationReturnFocus && registrationReturnFocus.isConnected) registrationReturnFocus.focus();
      registrationReturnFocus = null;
    });
  }

  // =========================================================================
  // 1. Dark / Light Mode Toggle
  // =========================================================================
  const themeToggle = document.getElementById('theme-toggle');

  function updateThemeToggleUI(isDark) {
    if (!themeToggle) return;
    themeToggle.setAttribute('aria-pressed', String(isDark));
    if (isDark) {
      themeToggle.setAttribute('aria-label', getCurrentLang() === 'fr' ? 'Activer le mode clair' : 'تفعيل الوضع المضيء');
      themeToggle.setAttribute('title', getCurrentLang() === 'fr' ? 'Mode clair' : 'الوضع المضيء');
    } else {
      themeToggle.setAttribute('aria-label', getCurrentLang() === 'fr' ? 'Activer le mode sombre' : 'تفعيل الوضع الليلي');
      themeToggle.setAttribute('title', getCurrentLang() === 'fr' ? 'Mode sombre' : 'الوضع الليلي');
    }
  }

  function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    const isDark = savedTheme === 'dark';

    if (isDark) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
      if (savedTheme === 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
      }
    }
    updateThemeToggleUI(isDark);

    if (themeToggle) {
      themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newThemeIsDark = currentTheme !== 'dark';

        if (newThemeIsDark) {
          document.documentElement.setAttribute('data-theme', 'dark');
          localStorage.setItem('theme', 'dark');
        } else {
          document.documentElement.setAttribute('data-theme', 'light');
          localStorage.setItem('theme', 'light');
        }
        updateThemeToggleUI(newThemeIsDark);
      });
    }
  }
  initTheme();

  // =========================================================================
  // 2. Emergency Banner Dismiss
  // =========================================================================
  const emergencyBar = document.getElementById('emergency-bar');
  const emergencyClose = document.getElementById('emergency-close');
  let cachedEmergencyAlert = null;
  let emergencyCloseTimer = null;
  let emergencyCloseFrame = null;

  function emergencyAlertVersion(alertData) {
    return JSON.stringify([alertData.updatedAt || '', alertData.bloodType || '', alertData.location || '', alertData.textAr || '', alertData.textFr || '']);
  }

  if (emergencyBar) {
    if (emergencyClose) {
      emergencyClose.addEventListener('click', () => {
        // Smooth slide-up transition
        emergencyBar.style.overflow = 'hidden';
        emergencyBar.style.transition = 'max-height 0.4s ease, opacity 0.35s ease, margin 0.4s ease, padding 0.4s ease';
        emergencyBar.style.maxHeight = emergencyBar.scrollHeight + 'px';

        emergencyCloseFrame = requestAnimationFrame(() => {
          emergencyBar.style.maxHeight = '0';
          emergencyBar.style.opacity = '0';
          emergencyBar.style.paddingTop = '0';
          emergencyBar.style.paddingBottom = '0';
          emergencyBar.style.marginTop = '0';
          emergencyBar.style.marginBottom = '0';
        });

        emergencyCloseTimer = setTimeout(() => {
          emergencyBar.style.display = 'none';
        }, 400);

        if (cachedEmergencyAlert) sessionStorage.setItem('emergency_dismissed_version', emergencyAlertVersion(cachedEmergencyAlert));
      });
    }
  }

  // =========================================================================
  // 2b. Emergency Alert Cloud Sync & State Handler
  // =========================================================================
  function applyEmergencyAlert(alertData, lang) {
    if (!emergencyBar || !alertData) return;
    cachedEmergencyAlert = alertData;

    if (sessionStorage.getItem('emergency_dismissed_version') === emergencyAlertVersion(alertData)) {
      emergencyBar.style.display = 'none';
      return;
    }

    const currentLang = lang || getCurrentLang();
    const customText = currentLang === 'fr' ? (alertData.textFr || alertData.textAr) : (alertData.textAr || alertData.textFr);
    if (alertData.active !== true || typeof customText !== 'string' || !customText.trim()) {
      emergencyBar.style.display = 'none';
      return;
    }

    clearTimeout(emergencyCloseTimer);
    cancelAnimationFrame(emergencyCloseFrame);
    ['overflow', 'transition', 'maxHeight', 'opacity', 'paddingTop', 'paddingBottom', 'marginTop', 'marginBottom'].forEach(prop => { emergencyBar.style[prop] = ''; });
    emergencyBar.style.display = 'flex';
    const textEl = emergencyBar.querySelector('[data-i18n="emergency_text"]');
    if (textEl) {
      textEl.textContent = customText;
    }
  }

  function initEmergencyAlertCloudSync() {
    if (window.BloodDonorsFirebase && typeof window.BloodDonorsFirebase.subscribeToEmergencyAlert === 'function') {
      window.BloodDonorsFirebase.subscribeToEmergencyAlert((data, meta) => {
        applyEmergencyAlert(meta && meta.isLocal ? { active: false } : data, getCurrentLang());
      });
    } else {
      window.addEventListener('bloodDonorsFirebaseReady', () => {
        if (window.BloodDonorsFirebase?.subscribeToEmergencyAlert) {
          window.BloodDonorsFirebase.subscribeToEmergencyAlert((data, meta) => {
            applyEmergencyAlert(meta && meta.isLocal ? { active: false } : data, getCurrentLang());
          });
        }
      }, { once: true });

    }
  }

  window.addEventListener('offline', () => {
    applyEmergencyAlert({ active: false }, getCurrentLang());
  });

  initEmergencyAlertCloudSync();

  // =========================================================================
  // 3. Sticky Navbar Scroll Effect
  // =========================================================================
  const navbar = document.getElementById('navbar');

  function handleNavbarScroll() {
    if (!navbar) return;
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleNavbarScroll, { passive: true });
  handleNavbarScroll(); // Check on initial page load

  // =========================================================================
  // 4. Mobile Menu Toggle
  // =========================================================================
  const menuToggle = document.getElementById('menu-toggle');
  const navLinks = document.getElementById('nav-links');

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isActive = navLinks.classList.toggle('active');
      menuToggle.classList.toggle('active', isActive);
      menuToggle.setAttribute('aria-expanded', String(isActive));
    });

    // Close mobile menu when clicking any nav link
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        menuToggle.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (navLinks.classList.contains('active') && !navbar.contains(e.target)) {
        navLinks.classList.remove('active');
        menuToggle.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // =========================================================================
  // 4b. Navbar "Plus" Dropdown Menu Interaction
  // =========================================================================
  const navDropdown = document.getElementById('nav-dropdown');
  const navDropdownToggle = document.getElementById('nav-dropdown-toggle');
  const navDropdownMenu = document.getElementById('nav-dropdown-menu');

  if (navDropdown && navDropdownToggle) {
    function toggleNavDropdown(openState) {
      const isCurrentlyOpen = navDropdown.classList.contains('open');
      const shouldOpen = (typeof openState === 'boolean') ? openState : !isCurrentlyOpen;
      
      navDropdown.classList.toggle('open', shouldOpen);
      navDropdownToggle.setAttribute('aria-expanded', String(shouldOpen));
    }

    navDropdownToggle.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      toggleNavDropdown();
    });

    // Close dropdown on click outside
    document.addEventListener('click', (e) => {
      if (!navDropdown.contains(e.target)) {
        toggleNavDropdown(false);
      }
    });

    // Close dropdown on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navDropdown.classList.contains('open')) {
        toggleNavDropdown(false);
        navDropdownToggle.focus();
      }
    });

    // Close dropdown when clicking any link inside menu
    if (navDropdownMenu) {
      navDropdownMenu.querySelectorAll('a').forEach(item => {
        item.addEventListener('click', () => {
          toggleNavDropdown(false);
        });
      });
    }
  }

  // =========================================================================
  // 5. Animated Roll-Up Counters
  // =========================================================================
  const statCards = document.querySelectorAll('.stat-card');

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function animateCounter(card) {
    const numberEl = card.querySelector('.stat-number');
    if (!numberEl) return;

    const rawTarget = card.getAttribute('data-target') || numberEl.getAttribute('data-target') || '0';
    const target = parseInt(rawTarget.replace(/\D/g, ''), 10) || 0;
    const duration = 2000; // ~2 seconds
    let startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutCubic(progress);
      const currentVal = Math.round(easedProgress * target);

      const lang = getCurrentLang();
      const locale = lang === 'fr' ? 'fr-FR' : 'ar-MA';
      const formatted = currentVal.toLocaleString(locale);

      // Add '+' prefix after the number as requested
      numberEl.textContent = `${formatted}+`;

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        const finalFormatted = target.toLocaleString(locale);
        numberEl.textContent = `${finalFormatted}+`;
      }
    }

    requestAnimationFrame(step);
  }

  if ('IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target); // Animate only once
        }
      });
    }, {
      threshold: 0.3
    });

    statCards.forEach(card => counterObserver.observe(card));
  } else {
    // Fallback if IntersectionObserver is unsupported
    statCards.forEach(card => animateCounter(card));
  }

  // =========================================================================
  // 6. Mouse-Tracking Spotlight Glow Effect on Stat Cards
  // =========================================================================
  statCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });

    card.addEventListener('mouseleave', () => {
      // Smoothly reset spotlight position out of sight
      card.style.setProperty('--mouse-x', `-999px`);
      card.style.setProperty('--mouse-y', `-999px`);
    });
  });

  // =========================================================================
  // 7. Blood Type Compatibility Matrix
  // =========================================================================
  const compatibilityMatrix = {
    'O-': {
      donate: ['ALL'],
      receive: ['O-']
    },
    'O+': {
      donate: ['O+', 'A+', 'B+', 'AB+'],
      receive: ['O-', 'O+']
    },
    'A-': {
      donate: ['A-', 'A+', 'AB-', 'AB+'],
      receive: ['O-', 'A-']
    },
    'A+': {
      donate: ['A+', 'AB+'],
      receive: ['O-', 'O+', 'A-', 'A+']
    },
    'B-': {
      donate: ['B-', 'B+', 'AB-', 'AB+'],
      receive: ['O-', 'B-']
    },
    'B+': {
      donate: ['B+', 'AB+'],
      receive: ['O-', 'O+', 'B-', 'B+']
    },
    'AB-': {
      donate: ['AB-', 'AB+'],
      receive: ['O-', 'A-', 'B-', 'AB-']
    },
    'AB+': {
      donate: ['AB+'],
      receive: ['ALL']
    }
  };

  const bloodBadges = document.querySelectorAll('.blood-badge[data-type]');
  const compatResults = document.getElementById('compat-results');
  const donateToList = document.getElementById('donate-to-list');
  const receiveFromList = document.getElementById('receive-from-list');
  let selectedBloodType = null;

  function renderCompatibilityResults(type) {
    if (!type || !compatibilityMatrix[type]) return;
    selectedBloodType = type;

    const data = compatibilityMatrix[type];
    const lang = getCurrentLang();
    const allLabel = translate('all_blood_types');

    if (donateToList) donateToList.innerHTML = '';
    if (receiveFromList) receiveFromList.innerHTML = '';

    // Populate Donate-To list
    if (donateToList) {
      data.donate.forEach((item, index) => {
        const badge = document.createElement('span');
        badge.className = 'blood-badge badge-sm compat-badge';
        badge.style.animationDelay = `${index * 0.05}s`;
        if (item === 'ALL') {
          badge.classList.add('badge-all');
          badge.textContent = allLabel;
        } else {
          badge.textContent = item;
        }
        donateToList.appendChild(badge);
      });
    }

    // Populate Receive-From list
    if (receiveFromList) {
      data.receive.forEach((item, index) => {
        const badge = document.createElement('span');
        badge.className = 'blood-badge badge-sm compat-badge';
        badge.style.animationDelay = `${index * 0.05}s`;
        if (item === 'ALL') {
          badge.classList.add('badge-all');
          badge.textContent = allLabel;
        } else {
          badge.textContent = item;
        }
        receiveFromList.appendChild(badge);
      });
    }

    // Show container with animation
    if (compatResults) {
      compatResults.style.display = 'block';
      compatResults.classList.remove('fade-slide-in');
      // Trigger DOM reflow to restart CSS animation
      void compatResults.offsetWidth;
      compatResults.classList.add('fade-slide-in');
    }

    const compatPrompt = document.getElementById('compat-prompt');
    if (compatPrompt) {
      compatPrompt.style.display = 'none';
    }
  }

  bloodBadges.forEach(badge => {
    badge.addEventListener('click', () => {
      const type = badge.getAttribute('data-type');
      bloodBadges.forEach(b => b.classList.remove('active'));
      badge.classList.add('active');
      renderCompatibilityResults(type);
    });
  });

  // Expose function for external updates
  window.updateCompatibility = renderCompatibilityResults;

  // =========================================================================
  // 8. Interactive 5-Step Eligibility Quiz
  // =========================================================================
  const eligibilityQuiz = document.getElementById('eligibility-quiz');
  const quizSteps = document.querySelectorAll('.quiz-step');
  const quizResult = document.getElementById('quiz-result');
  const quizProgress = document.getElementById('quiz-progress');
  const quizRestart = document.getElementById('quiz-restart');

  let currentStepIndex = 0; // 0 to 4 (steps 1 to 5)
  const totalSteps = quizSteps.length || 5;
  const quizAnswers = new Array(totalSteps).fill(null);

  function updateQuizUI() {
    // Hide results initially
    if (quizResult) {
      quizResult.style.display = 'none';
      quizResult.classList.remove('result-pass', 'result-fail', 'fade-slide-in');
    }

    // Update question step number
    const stepNumEl = document.getElementById('current-step-num');
    if (stepNumEl) {
      stepNumEl.textContent = String(currentStepIndex + 1);
    }

    const stepIndicator = document.querySelector('.quiz-step-indicator');
    if (stepIndicator) {
      stepIndicator.style.display = 'block';
    }

    const quizNav = document.querySelector('.quiz-nav');
    const prevBtn = document.querySelector('.quiz-prev');
    const nextBtn = document.querySelector('.quiz-next');

    if (quizNav) quizNav.style.display = 'flex';
    if (prevBtn) {
      prevBtn.style.visibility = currentStepIndex > 0 ? 'visible' : 'hidden';
    }
    if (nextBtn) {
      nextBtn.style.visibility = (quizAnswers[currentStepIndex] !== null && currentStepIndex < totalSteps - 1) ? 'visible' : 'hidden';
    }

    quizSteps.forEach((step, index) => {
      if (index === currentStepIndex) {
        step.style.display = 'block';
        step.classList.add('active', 'fade-slide-in');
        // Restore active button states if previously selected
        const yesBtn = step.querySelector('.quiz-yes');
        const noBtn = step.querySelector('.quiz-no');
        const answer = quizAnswers[index];
        if (yesBtn) yesBtn.classList.toggle('selected-yes', answer === 'yes');
        if (noBtn) noBtn.classList.toggle('selected-no', answer === 'no');
      } else {
        step.style.display = 'none';
        step.classList.remove('active', 'fade-slide-in');
      }
    });

    // Update progress bar
    if (quizProgress) {
      const progressPercent = ((currentStepIndex + 1) / totalSteps) * 100;
      quizProgress.style.width = `${progressPercent}%`;
      quizProgress.setAttribute('aria-valuenow', Math.round(progressPercent));
    }
  }

  function completeQuiz() {
    quizSteps.forEach(step => {
      step.style.display = 'none';
      step.classList.remove('active');
    });

    const stepIndicator = document.querySelector('.quiz-step-indicator');
    if (stepIndicator) {
      stepIndicator.style.display = 'none';
    }

    const quizNav = document.querySelector('.quiz-nav');
    if (quizNav) {
      quizNav.style.display = 'none';
    }

    if (quizProgress) {
      quizProgress.style.width = '100%';
      quizProgress.setAttribute('aria-valuenow', '100');
    }

    if (!quizResult) return;
    quizResult.style.display = 'block';
    quizResult.classList.add('fade-slide-in');

    const resultBadge = document.getElementById('quiz-result-badge') || quizResult.querySelector('.result-badge');
    const allYes = quizAnswers.every(ans => ans === 'yes');

    // Look for text elements inside quiz-result to localize if present
    const titleEl = quizResult.querySelector('.quiz-result-title') || quizResult.querySelector('h3') || quizResult.querySelector('h4');
    const descEl = quizResult.querySelector('.quiz-result-desc') || quizResult.querySelector('p');

    if (allYes) {
      quizResult.classList.remove('result-fail');
      quizResult.classList.add('result-pass');
      if (resultBadge) {
        resultBadge.classList.remove('result-fail');
        resultBadge.classList.add('result-pass');
      }
      if (titleEl) titleEl.textContent = translate('quiz_pass_title');
      if (descEl) descEl.textContent = translate('elig_result_pass') || translate('quiz_pass_desc');

      // Trigger confetti celebration on pass
      triggerConfetti();
    } else {
      quizResult.classList.remove('result-pass');
      quizResult.classList.add('result-fail');
      if (resultBadge) {
        resultBadge.classList.remove('result-pass');
        resultBadge.classList.add('result-fail');
      }
      if (titleEl) titleEl.textContent = translate('quiz_fail_title');
      if (descEl) descEl.textContent = translate('elig_result_fail') || translate('quiz_fail_desc');
    }
  }

  // Setup step event listeners
  quizSteps.forEach((step, index) => {
    const yesBtn = step.querySelector('.quiz-yes');
    const noBtn = step.querySelector('.quiz-no');

    if (yesBtn) {
      yesBtn.addEventListener('click', () => {
        quizAnswers[index] = 'yes';
        yesBtn.classList.add('selected-yes');
        if (noBtn) noBtn.classList.remove('selected-no');

        // Smooth auto-advance after brief visual confirmation
        setTimeout(() => {
          if (index < totalSteps - 1) {
            currentStepIndex++;
            updateQuizUI();
          } else {
            completeQuiz();
          }
        }, 220);
      });
    }

    if (noBtn) {
      noBtn.addEventListener('click', () => {
        quizAnswers[index] = 'no';
        noBtn.classList.add('selected-no');
        if (yesBtn) yesBtn.classList.remove('selected-yes');

        setTimeout(() => {
          if (index < totalSteps - 1) {
            currentStepIndex++;
            updateQuizUI();
          } else {
            completeQuiz();
          }
        }, 220);
      });
    }
  });

  // Global prev / next buttons
  const globalPrevBtn = document.querySelector('.quiz-prev');
  const globalNextBtn = document.querySelector('.quiz-next');

  if (globalPrevBtn) {
    globalPrevBtn.addEventListener('click', () => {
      if (currentStepIndex > 0) {
        currentStepIndex--;
        updateQuizUI();
      }
    });
  }

  if (globalNextBtn) {
    globalNextBtn.addEventListener('click', () => {
      if (currentStepIndex < totalSteps - 1) {
        currentStepIndex++;
        updateQuizUI();
      } else {
        completeQuiz();
      }
    });
  }

  if (quizRestart) {
    quizRestart.addEventListener('click', () => {
      currentStepIndex = 0;
      quizAnswers.fill(null);
      quizSteps.forEach(step => {
        const yesBtn = step.querySelector('.quiz-yes');
        const noBtn = step.querySelector('.quiz-no');
        if (yesBtn) yesBtn.classList.remove('selected-yes');
        if (noBtn) noBtn.classList.remove('selected-no');
      });
      const resultBadge = document.getElementById('quiz-result-badge') || (quizResult ? quizResult.querySelector('.result-badge') : null);
      if (resultBadge) {
        resultBadge.classList.remove('result-pass', 'result-fail');
      }
      updateQuizUI();
    });
  }

  if (eligibilityQuiz && quizSteps.length > 0) {
    updateQuizUI();
  }

  // =========================================================================
  // 9. Live Countdown Timer
  // Countdown target comes from the campaign data.
  // =========================================================================
  const daysEl = document.getElementById('countdown-days');
  const hoursEl = document.getElementById('countdown-hours');
  const minutesEl = document.getElementById('countdown-minutes');
  const secondsEl = document.getElementById('countdown-seconds');

  // Target date for countdown (mutable so admin panel can update it live)
  let targetDate = null;

  function updateCountdown() {
    const grid = document.querySelector('.countdown-grid');
    const status = document.getElementById('countdown-status') || document.querySelector('.countdown-status');
    if (targetDate === null) {
      if (grid) grid.style.display = 'none';
      if (status) status.style.display = 'none';
      return;
    }
    if (grid) grid.style.display = 'grid';
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance <= 0) {
      if (daysEl) daysEl.textContent = '00';
      if (hoursEl) hoursEl.textContent = '00';
      if (minutesEl) minutesEl.textContent = '00';
      if (secondsEl) secondsEl.textContent = '00';

      const statusEl = document.getElementById('countdown-status') || document.querySelector('.countdown-status');
      if (statusEl) {
        statusEl.textContent = translate('campaign_in_progress');
        statusEl.style.display = 'block';
      }
      return;
    }

    const statusEl = document.getElementById('countdown-status') || document.querySelector('.countdown-status');
    if (statusEl) {
      statusEl.style.display = 'none';
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
    if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
    if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, '0');
    if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, '0');
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

  // =========================================================================
  // 10. Registration Form Tabs (Donor / Volunteer)
  // =========================================================================
  const formTabs = document.querySelectorAll('.form-tab');
  const formPanels = document.querySelectorAll('.form-panel');

  formTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetTab = tab.getAttribute('data-tab');

      formTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      formPanels.forEach(panel => {
        const isTarget = panel.id === `form-${targetTab}`;
        panel.classList.toggle('active', isTarget);
        if (isTarget) {
          panel.style.display = 'block';
          panel.classList.add('fade-slide-in');
        } else {
          panel.style.display = 'none';
          panel.classList.remove('fade-slide-in');
        }
      });
    });
  });

  // Ensure initial active panel is visible
  formTabs.forEach(tab => {
    if (tab.classList.contains('active')) {
      const targetTab = tab.getAttribute('data-tab');
      formPanels.forEach(p => {
        p.style.display = p.id === `form-${targetTab}` ? 'block' : 'none';
      });
    }
  });

  // =========================================================================
  // 11. Form Submission Handling
  // =========================================================================
  const donorForm = document.getElementById('donor-form');
  const volunteerForm = document.getElementById('volunteer-form');

  function validateRequiredFields(form) {
    const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
    let isValid = true;
    let firstInvalid = null;

    inputs.forEach(input => {
      // Clear prior error borders
      input.classList.remove('input-invalid');

      if (input.type === 'checkbox') {
        if (!input.checked) {
          isValid = false;
          input.classList.add('input-invalid');
          if (!firstInvalid) firstInvalid = input;
        }
      } else {
        if (!input.value || !input.value.trim()) {
          isValid = false;
          input.classList.add('input-invalid');
          if (!firstInvalid) firstInvalid = input;
        } else if (input.type === 'email') {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(input.value.trim())) {
            isValid = false;
            input.classList.add('input-invalid');
            if (!firstInvalid) firstInvalid = input;
          }
        } else if (input.type === 'tel' || input.name === 'phone') {
          if (!isValidMoroccanPhone(input.value)) {
            isValid = false;
            input.classList.add('input-invalid');
            if (!firstInvalid) firstInvalid = input;
          }
        }
      }
    });

    if (firstInvalid) {
      firstInvalid.focus();
    }

    return isValid;
  }

  const pendingForms = new WeakSet();
  const pendingTimers = new WeakMap();
  const submissionAttempts = new WeakMap();

  function submissionIdFor(form, data) {
    const fingerprint = JSON.stringify(data);
    const previous = submissionAttempts.get(form);
    if (previous && previous.fingerprint === fingerprint) return previous.id;
    const id = window.BloodDonorsFirebase.createSubmissionId();
    submissionAttempts.set(form, { fingerprint, id });
    return id;
  }

  function setFormPending(form, pending) {
    const button = form.querySelector('button[type="submit"], input[type="submit"]');
    let status = form.querySelector('[data-submission-status]');
    if (!status) {
      status = document.createElement('p');
      status.dataset.submissionStatus = '';
      status.setAttribute('role', 'status');
      status.style.margin = '10px 0';
      form.appendChild(status);
    }
    const isFrench = getCurrentLang() === 'fr';
    if (pending) {
      pendingForms.add(form);
      status.textContent = isFrench ? 'Envoi en cours, veuillez patienter…' : 'جارٍ إرسال الطلب، يرجى الانتظار…';
      const timer = setTimeout(() => {
        status.textContent = isFrench
          ? 'L’envoi est toujours en attente. Vérifiez votre connexion et gardez cette page ouverte ; ne renvoyez pas le formulaire.'
          : 'لا يزال الإرسال في الانتظار. تحقق من اتصالك واترك الصفحة مفتوحة، ولا ترسل الطلب مرة أخرى.';
      }, 15000);
      pendingTimers.set(form, timer);
    } else {
      pendingForms.delete(form);
      clearTimeout(pendingTimers.get(form));
      pendingTimers.delete(form);
      status.textContent = '';
    }
    if (button) button.disabled = pending;
    form.setAttribute('aria-busy', String(pending));
  }

  // Handle Donor Form
  if (donorForm) {
    donorForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (pendingForms.has(donorForm)) return;

      // Check required input fields
      const isFieldsValid = validateRequiredFields(donorForm);
      if (!isFieldsValid) {
        showToast('toast_fill_required', 'error');
        return;
      }

      // Check consent checkbox specifically
      const consentCheckbox = donorForm.querySelector('input[type="checkbox"][name*="consent"], #donor-consent, input[name="terms"]');
      if (!consentCheckbox || !consentCheckbox.checked) {
        if (consentCheckbox) consentCheckbox.classList.add('input-invalid');
        showToast('toast_consent_required', 'error');
        return;
      }

      // Extract form values
      const fullnameVal = (donorForm.querySelector('[name="fullname"]')?.value || '').trim();
      const phoneVal = (donorForm.querySelector('[name="phone"]')?.value || '').trim();
      const bloodgroupVal = (donorForm.querySelector('[name="bloodgroup"]')?.value || 'N/A').trim();
      const districtVal = (donorForm.querySelector('[name="district"]')?.value || 'بركان').trim();

      // Only confirm success after Firestore has accepted the registration.
      setFormPending(donorForm, true);
      try {
        if (!window.BloodDonorsFirebase || typeof window.BloodDonorsFirebase.addRegistration !== 'function') {
          throw new Error('Registration service unavailable');
        }
        const registration = {
          fullname: fullnameVal,
          phone: phoneVal,
          bloodGroup: bloodgroupVal,
          city: districtVal,
          category: 'donor',
          consentAccepted: true,
          consentVersion: 'donor-consent-v1',
          consentLanguage: getCurrentLang() === 'fr' ? 'fr' : 'ar'
        };
        await window.BloodDonorsFirebase.addRegistration(registration, submissionIdFor(donorForm, registration));
        submissionAttempts.delete(donorForm);
      } catch (err) {
        console.warn('[DonorForm] Registration failed:', err);
        showToast('toast_error_general', 'error');
        return;
      } finally {
        setFormPending(donorForm, false);
      }

      // Successful registration feedback
      triggerConfetti();
      donorForm.reset();
      showRegistrationConfirmation('donor', donorForm.querySelector('[type="submit"]'));
    });
  }

  // Handle Volunteer Form
  if (volunteerForm) {
    volunteerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (pendingForms.has(volunteerForm)) return;

      const isFieldsValid = validateRequiredFields(volunteerForm);
      if (!isFieldsValid) {
        showToast('toast_fill_required', 'error');
        return;
      }

      const fullnameVal = (volunteerForm.querySelector('[name="fullname"]')?.value || '').trim();
      const phoneVal = (volunteerForm.querySelector('[name="phone"]')?.value || '').trim();
      const areaVal = (volunteerForm.querySelector('[name="area"]')?.value || 'logistics').trim();

      // Preserve the form if the registration cannot be sent.
      setFormPending(volunteerForm, true);
      try {
        if (!window.BloodDonorsFirebase || typeof window.BloodDonorsFirebase.addRegistration !== 'function') {
          throw new Error('Registration service unavailable');
        }
        const registration = {
          fullname: fullnameVal,
          phone: phoneVal,
          subCategory: areaVal,
          city: 'بركان',
          bloodGroup: 'N/A',
          category: 'volunteer'
        };
        await window.BloodDonorsFirebase.addRegistration(registration, submissionIdFor(volunteerForm, registration));
        submissionAttempts.delete(volunteerForm);
      } catch (err) {
        console.warn('[VolunteerForm] Registration failed:', err);
        showToast('toast_error_general', 'error');
        return;
      } finally {
        setFormPending(volunteerForm, false);
      }

      triggerConfetti();
      volunteerForm.reset();
      showRegistrationConfirmation('volunteer', volunteerForm.querySelector('[type="submit"]'));
    });
  }

  // =========================================================================
  // 12. Toast Notification System
  // =========================================================================
  function getOrCreateToastContainer() {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.setAttribute('aria-live', 'polite');
      container.setAttribute('role', 'region');
      document.body.appendChild(container);
    }
    return container;
  }

  function showToast(messageKey, type = 'success') {
    const container = getOrCreateToastContainer();
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    const text = translate(messageKey);

    const iconSpan = document.createElement('span');
    iconSpan.className = 'toast-icon';
    iconSpan.innerHTML = `<i class="fa-solid ${type === 'success' ? 'fa-circle-check' : 'fa-circle-xmark'}" aria-hidden="true"></i>`;

    const messageSpan = document.createElement('span');
    messageSpan.className = 'toast-message';
    messageSpan.textContent = text;

    const closeBtn = document.createElement('button');
    closeBtn.type = 'button';
    closeBtn.className = 'toast-close';
    closeBtn.innerHTML = '&times;';
    closeBtn.setAttribute('aria-label', getCurrentLang() === 'fr' ? 'Fermer' : 'إغلاق');

    toast.appendChild(iconSpan);
    toast.appendChild(messageSpan);
    toast.appendChild(closeBtn);
    container.appendChild(toast);

    // Trigger slide-in animation
    requestAnimationFrame(() => {
      toast.classList.add('toast-show');
    });

    let dismissTimer = null;

    function dismissToast() {
      if (dismissTimer) clearTimeout(dismissTimer);
      toast.classList.remove('toast-show');
      toast.classList.add('toast-hide');
      setTimeout(() => {
        if (toast.parentNode === container) {
          container.removeChild(toast);
        }
      }, 350);
    }

    closeBtn.addEventListener('click', dismissToast);
    dismissTimer = setTimeout(dismissToast, 5000);
  }

  // Expose toast function globally
  window.showToast = showToast;

  // =========================================================================
  // 13. Confetti Effect (Moroccan Colors & Blood Red)
  // =========================================================================
  function triggerConfetti() {
    const confettiContainer = document.createElement('div');
    confettiContainer.className = 'confetti-container';
    confettiContainer.style.position = 'fixed';
    confettiContainer.style.top = '0';
    confettiContainer.style.left = '0';
    confettiContainer.style.width = '100%';
    confettiContainer.style.height = '100%';
    confettiContainer.style.pointerEvents = 'none';
    confettiContainer.style.zIndex = '99999';
    confettiContainer.style.overflow = 'hidden';
    document.body.appendChild(confettiContainer);

    // Moroccan flag red (#c1272d), green (#006233), blood red (#8b0000), white (#ffffff), gold (#d4af37)
    const colors = ['#c1272d', '#006233', '#8b0000', '#ffffff', '#2a9d8f', '#e63946', '#d4af37'];
    const particleCount = 100;

    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'confetti-particle';

      const color = colors[Math.floor(Math.random() * colors.length)];
      const left = Math.random() * 100;
      const width = Math.random() * 8 + 6;
      const height = Math.random() * 12 + 6;
      const duration = Math.random() * 2 + 2; // 2s to 4s
      const delay = Math.random() * 0.8;
      const isCircle = Math.random() > 0.5;

      particle.style.position = 'absolute';
      particle.style.top = '-20px';
      particle.style.left = `${left}%`;
      particle.style.width = `${width}px`;
      particle.style.height = `${height}px`;
      particle.style.backgroundColor = color;
      particle.style.borderRadius = isCircle ? '50%' : '2px';
      particle.style.opacity = '1';
      particle.style.animation = `confettiFall ${duration}s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${delay}s forwards`;

      confettiContainer.appendChild(particle);
    }

    // Auto-remove container after animation finishes
    setTimeout(() => {
      if (confettiContainer.parentNode) {
        confettiContainer.parentNode.removeChild(confettiContainer);
      }
    }, 5000);
  }

  // Expose confetti globally
  window.triggerConfetti = triggerConfetti;

  // =========================================================================
  // 14. Smooth Scroll for Anchor Links with Navbar Offset
  // =========================================================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    // Keep native focus movement for the homepage skip link.
    if (anchor.classList.contains('site-skip-link')) return;
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (!href || href === '#') return;

      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const navHeight = navbar ? navbar.offsetHeight : 70;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = targetPosition - navHeight - 16;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });

        // Close mobile nav if opened
        if (navLinks && navLinks.classList.contains('active')) {
          navLinks.classList.remove('active');
          if (menuToggle) {
            menuToggle.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', 'false');
          }
        }
      }
    });
  });

  // =========================================================================
  // 15. Floating WhatsApp Button
  // =========================================================================
  const whatsappFloat = document.getElementById('whatsapp-float');

  if (whatsappFloat) {
    whatsappFloat.addEventListener('click', (e) => {
      const currentHref = whatsappFloat.getAttribute('href');
      if (currentHref && currentHref !== '#' && currentHref.startsWith('http')) {
        return; // Allow standard link navigation to the configured WhatsApp URL
      }

      e.preventDefault();
      const lang = getCurrentLang();
      const message = lang === 'fr'
        ? 'Bonjour, je souhaite me renseigner sur le don de sang à Berkane'
        : 'السلام عليكم، أرغب في الاستفسار عن التبرع بالدم في بركان';

      const phoneNumber = '212677216964';
      const encodedMsg = encodeURIComponent(message);
      const url = `https://wa.me/${phoneNumber}?text=${encodedMsg}`;

      window.open(url, '_blank', 'noopener,noreferrer');
    });
  }

  // =========================================================================
  // 16. Scroll Reveal Animations (with child staggering)
  // =========================================================================
  const revealElements = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          el.classList.add('revealed');

          // Stagger any child elements with .reveal-child
          const children = el.querySelectorAll('.reveal-child');
          children.forEach((child, index) => {
            child.style.transitionDelay = `${(index + 1) * 0.12}s`;
            child.classList.add('revealed');
          });

          observer.unobserve(el);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add('revealed'));
  }

  // =========================================================================
  // 17. Activities & Campaigns Gallery Filtering & Pagination
  // =========================================================================
  const GALLERY_ITEMS_PER_PAGE = 6;
  let currentGalleryPage = 1;
  let currentGalleryFilter = 'all';

  const filterButtons = document.querySelectorAll('.gallery-filter-btn');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter') || 'all';
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentGalleryFilter = filter;
      currentGalleryPage = 1;
      renderPublicActivitiesGallery(cachedActivitiesGallery, getCurrentLang());
    });
  });

  // =========================================================================
  // 17b. Dynamic Activities Gallery & Partners Cloud Services
  // =========================================================================
  let cachedActivitiesGallery = null;
  let cachedPartners = null;

  function renderPublicActivitiesGallery(items = null, lang = null) {
    const galleryContainer = document.getElementById('gallery-container');
    const paginationContainer = document.getElementById('gallery-pagination');
    if (!galleryContainer) return;

    if (items !== null && items !== undefined) {
      cachedActivitiesGallery = items;
    }

    const currentLang = lang || getCurrentLang();
    let rawItems = (items !== null && items !== undefined) ? items : cachedActivitiesGallery;

    if (!rawItems) {
      try {
        const stored = localStorage.getItem('admin_gallery_items');
        if (stored) rawItems = JSON.parse(stored);
      } catch (e) {
        console.warn('Error reading admin_gallery_items:', e);
      }
    }

    if (!rawItems || !Array.isArray(rawItems)) {
      rawItems = [];
    }

    // Filter items according to active category filter
    const filteredItems = (currentGalleryFilter === 'all')
      ? rawItems
      : rawItems.filter(item => (item.category || 'campaign') === currentGalleryFilter);

    galleryContainer.innerHTML = '';

    if (filteredItems.length === 0) {
      galleryContainer.innerHTML = `
        <div class="gallery-empty-state" style="grid-column: 1 / -1; text-align: center; padding: 48px 20px; color: var(--color-text-muted, #94A3B8);">
          <i class="fa-solid fa-images" style="font-size: 2.5rem; margin-bottom: 12px; opacity: 0.6; display: block;"></i>
          <p style="font-size: 1rem; margin: 0;">${currentLang === 'fr' ? 'Aucune activité ou campagne disponible pour le moment.' : 'لا توجد أنشطة أو حملات معروضة حالياً.'}</p>
        </div>
      `;
      if (paginationContainer) {
        paginationContainer.innerHTML = '';
        paginationContainer.style.display = 'none';
      }
      return;
    }

    // Calculate pagination slices
    const totalItems = filteredItems.length;
    const totalPages = Math.ceil(totalItems / GALLERY_ITEMS_PER_PAGE);

    if (currentGalleryPage > totalPages) {
      currentGalleryPage = totalPages;
    }
    if (currentGalleryPage < 1) {
      currentGalleryPage = 1;
    }

    const startIndex = (currentGalleryPage - 1) * GALLERY_ITEMS_PER_PAGE;
    const endIndex = startIndex + GALLERY_ITEMS_PER_PAGE;
    const pageItems = filteredItems.slice(startIndex, endIndex);

    const categoryLabels = {
      ar: {
        campaign: 'حملات التبرع',
        caravan: 'قوافل متنقلة',
        awareness: 'توعية وتحسيس'
      },
      fr: {
        campaign: 'Campagnes',
        caravan: 'Caravanes',
        awareness: 'Sensibilisation'
      }
    };

    pageItems.forEach(item => {
      const card = document.createElement('article');
      card.className = 'gallery-card fade-slide-in';
      card.setAttribute('role', 'button');
      card.setAttribute('tabindex', '0');
      const cat = (item.category === 'caravan' || item.category === 'awareness') ? item.category : 'campaign';
      card.setAttribute('data-category', cat);

      const title = (currentLang === 'fr' && item.titleFr) ? item.titleFr : (item.titleAr || item.title || '');
      const fullDesc = (currentLang === 'fr' && item.descFr) 
        ? item.descFr 
        : (item.description || item.descAr || item.desc || '');
      const snippet = fullDesc.length > 110 ? fullDesc.slice(0, 110) + '...' : fullDesc;
      const catLabel = (categoryLabels[currentLang] && categoryLabels[currentLang][cat]) 
        ? categoryLabels[currentLang][cat] 
        : (item.categoryLabel || cat);
      const safeImg = sanitizeUrl(item.image || 'assets/campaign-1.svg');
      const actionText = currentLang === 'fr' ? 'Lire le rapport complet →' : 'عرض التقرير والتفاصيل ←';

      card.innerHTML = `
        <div class="gallery-thumb">
          <img src="${safeImg}" alt="${escapeHtml(title)}" loading="lazy" decoding="async" onerror="this.src='assets/logo.png'" />
          <span class="gallery-badge-date"><i class="fa-regular fa-calendar-days" style="margin-inline-end: 4px;"></i>${escapeHtml(item.date || '')}</span>
        </div>
        <div class="gallery-card-body">
          <span class="gallery-card-tag">${escapeHtml(catLabel)}</span>
          <h3 class="gallery-card-title">${escapeHtml(title)}</h3>
          <p class="gallery-card-desc">${escapeHtml(snippet || title)}</p>
          <div class="gallery-card-action">
            <span>${actionText}</span>
          </div>
        </div>
      `;

      card.addEventListener('click', () => {
        openActivityModal(item);
      });
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openActivityModal(item);
        }
      });

      galleryContainer.appendChild(card);
    });

    // Render pagination controls
    renderGalleryPagination(totalPages, totalItems, currentLang);
  }

  function renderGalleryPagination(totalPages, totalItems, currentLang) {
    const paginationContainer = document.getElementById('gallery-pagination');
    if (!paginationContainer) return;

    if (totalPages <= 1) {
      paginationContainer.innerHTML = '';
      paginationContainer.style.display = 'none';
      return;
    }

    paginationContainer.style.display = 'flex';
    paginationContainer.innerHTML = '';

    const isRtl = (currentLang !== 'fr');
    const prevIcon = isRtl ? 'fa-angle-right' : 'fa-angle-left';
    const nextIcon = isRtl ? 'fa-angle-left' : 'fa-angle-right';
    const prevText = isRtl ? 'السابق' : 'Précédent';
    const nextText = isRtl ? 'التالي' : 'Suivant';

    // Previous Button
    const prevBtn = document.createElement('button');
    prevBtn.type = 'button';
    prevBtn.className = 'gallery-page-btn';
    prevBtn.setAttribute('aria-label', prevText);
    prevBtn.disabled = (currentGalleryPage === 1);
    prevBtn.innerHTML = `<i class="fa-solid ${prevIcon}"></i> <span>${prevText}</span>`;
    prevBtn.addEventListener('click', () => {
      if (currentGalleryPage > 1) {
        goToGalleryPage(currentGalleryPage - 1);
      }
    });
    paginationContainer.appendChild(prevBtn);

    // Page Numbers with smart range
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentGalleryPage - 2);
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    if (startPage > 1) {
      paginationContainer.appendChild(createPageButton(1));
      if (startPage > 2) {
        const ellipsis = document.createElement('span');
        ellipsis.className = 'gallery-page-ellipsis';
        ellipsis.textContent = '...';
        paginationContainer.appendChild(ellipsis);
      }
    }

    for (let p = startPage; p <= endPage; p++) {
      paginationContainer.appendChild(createPageButton(p));
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        const ellipsis = document.createElement('span');
        ellipsis.className = 'gallery-page-ellipsis';
        ellipsis.textContent = '...';
        paginationContainer.appendChild(ellipsis);
      }
      paginationContainer.appendChild(createPageButton(totalPages));
    }

    // Next Button
    const nextBtn = document.createElement('button');
    nextBtn.type = 'button';
    nextBtn.className = 'gallery-page-btn';
    nextBtn.setAttribute('aria-label', nextText);
    nextBtn.disabled = (currentGalleryPage === totalPages);
    nextBtn.innerHTML = `<span>${nextText}</span> <i class="fa-solid ${nextIcon}"></i>`;
    nextBtn.addEventListener('click', () => {
      if (currentGalleryPage < totalPages) {
        goToGalleryPage(currentGalleryPage + 1);
      }
    });
    paginationContainer.appendChild(nextBtn);

    // Info Pill
    const infoPill = document.createElement('div');
    infoPill.className = 'gallery-page-info';
    infoPill.textContent = (currentLang === 'fr')
      ? `Page ${currentGalleryPage} sur ${totalPages} (${totalItems} activités)`
      : `الصفحة ${currentGalleryPage} من أصل ${totalPages} (إجمالي ${totalItems} نشاط)`;
    paginationContainer.appendChild(infoPill);
  }

  function createPageButton(pageNum) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `gallery-page-btn ${pageNum === currentGalleryPage ? 'active' : ''}`;
    btn.textContent = String(pageNum);
    btn.setAttribute('aria-label', `Page ${pageNum}`);
    if (pageNum === currentGalleryPage) {
      btn.setAttribute('aria-current', 'page');
    }
    btn.addEventListener('click', () => {
      if (pageNum !== currentGalleryPage) {
        goToGalleryPage(pageNum);
      }
    });
    return btn;
  }

  function goToGalleryPage(page) {
    currentGalleryPage = page;
    renderPublicActivitiesGallery(cachedActivitiesGallery, getCurrentLang());
    const gallerySection = document.getElementById('gallery');
    if (gallerySection) {
      gallerySection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  // =========================================================================
  // Activity Report Details Modal Handler
  // =========================================================================
  const activityModal = document.getElementById('activity-modal');
  const closeActivityBtn = document.getElementById('close-activity-modal');
  const btnCloseActivity = document.getElementById('btn-close-activity-modal');
  let currentOpenActivityItem = null;

  function openActivityModal(item) {
    if (!activityModal || !item) return;
    currentOpenActivityItem = item;

    const currentLang = getCurrentLang();
    const title = (currentLang === 'fr' && item.titleFr) ? item.titleFr : (item.titleAr || item.title || '');
    const desc = (currentLang === 'fr' && item.descFr) 
      ? item.descFr 
      : (item.description || item.descAr || item.desc || '');
    const safeImg = sanitizeUrl(item.image || 'assets/campaign-1.svg');
    const cat = item.category || 'campaign';

    const categoryLabels = {
      ar: { campaign: 'حملات التبرع', caravan: 'قوافل متنقلة', awareness: 'توعية وتحسيس' },
      fr: { campaign: 'Campagnes', caravan: 'Caravanes', awareness: 'Sensibilisation' }
    };
    const catLabel = (categoryLabels[currentLang] && categoryLabels[currentLang][cat]) 
      ? categoryLabels[currentLang][cat] 
      : (item.categoryLabel || cat);

    const modalTitle = document.getElementById('modal-activity-title');
    const modalDesc = document.getElementById('modal-activity-desc');
    const modalImg = document.getElementById('modal-activity-img');
    const modalDate = document.getElementById('modal-activity-date');
    const modalTag = document.getElementById('modal-activity-tag');

    if (modalTitle) modalTitle.textContent = title;
    if (modalDesc) {
      if (desc && desc.trim()) {
        modalDesc.textContent = desc;
      } else {
        modalDesc.textContent = (currentLang === 'fr') 
          ? 'Aucun rapport supplémentaire renseigné pour cette activité.' 
          : 'لا يوجد تقرير إضافي مفصل مسجل لهذا النشاط.';
      }
    }
    if (modalImg) {
      modalImg.src = safeImg;
      modalImg.alt = title;
      modalImg.decoding = 'async';
    }
    if (modalDate) {
      modalDate.innerHTML = `<i class="fa-regular fa-calendar-days" style="margin-inline-end: 5px;"></i>${escapeHtml(item.date || '')}`;
    }
    if (modalTag) {
      modalTag.textContent = catLabel;
    }

    activityModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }

  function closeActivityModal() {
    if (activityModal) {
      activityModal.style.display = 'none';
      document.body.style.overflow = '';
      currentOpenActivityItem = null;
    }
  }

  if (closeActivityBtn) {
    closeActivityBtn.addEventListener('click', closeActivityModal);
  }

  if (btnCloseActivity) {
    btnCloseActivity.addEventListener('click', closeActivityModal);
  }

  if (activityModal) {
    activityModal.addEventListener('click', (e) => {
      if (e.target === activityModal) {
        closeActivityModal();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && activityModal && activityModal.style.display === 'flex') {
      closeActivityModal();
    }
  });

  function initActivitiesGalleryCloudSync() {
    if (window.BloodDonorsFirebase && typeof window.BloodDonorsFirebase.subscribeToActivitiesGallery === 'function') {
      window.BloodDonorsFirebase.subscribeToActivitiesGallery((items) => {
        cachedActivitiesGallery = items;
        renderPublicActivitiesGallery(items, getCurrentLang());
      });
    } else {
      window.addEventListener('bloodDonorsFirebaseReady', () => {
        if (window.BloodDonorsFirebase?.subscribeToActivitiesGallery) {
          window.BloodDonorsFirebase.subscribeToActivitiesGallery((items) => {
            cachedActivitiesGallery = items;
            renderPublicActivitiesGallery(items, getCurrentLang());
          });
        }
      }, { once: true });

      renderPublicActivitiesGallery(null, getCurrentLang());
    }
  }

  function renderPublicPartners(items = null, lang = null) {
    const partnersContainer = document.getElementById('partners-container');
    if (!partnersContainer) return;

    if (items !== null && items !== undefined) {
      cachedPartners = items;
    }

    const currentLang = lang || getCurrentLang();
    let rawItems = (items !== null && items !== undefined) ? items : cachedPartners;

    if (!rawItems) {
      try {
        const stored = localStorage.getItem('admin_partners_items');
        if (stored) rawItems = JSON.parse(stored);
      } catch (e) {
        console.warn('Error reading admin_partners_items:', e);
      }
    }

    if (!rawItems || !Array.isArray(rawItems)) {
      rawItems = [];
    }

    partnersContainer.innerHTML = '';

    if (rawItems.length === 0) {
      partnersContainer.innerHTML = `
        <div class="partners-empty-state" style="text-align: center; padding: 36px 20px; color: var(--color-text-muted, #94A3B8); width: 100%;">
          <i class="fa-solid fa-handshake" style="font-size: 2.2rem; margin-bottom: 12px; opacity: 0.6; display: block;"></i>
          <p style="font-size: 1rem; margin: 0;">${currentLang === 'fr' ? 'Aucun partenaire enregistré pour le moment.' : 'لا يوجد شركاء مسجلون حالياً.'}</p>
        </div>
      `;
      partnersContainer.style.animation = 'none';
      return;
    }

    partnersContainer.style.animation = '';

    // Triplicate partner items (3 identical sequences) for seamless -33.333% marquee scrolling
    const baseRepeat = Math.max(1, Math.ceil(4 / rawItems.length));
    let oneThirdItems = [];
    for (let r = 0; r < baseRepeat; r++) {
      oneThirdItems = oneThirdItems.concat(rawItems);
    }
    const marqueeItems = oneThirdItems.concat(oneThirdItems, oneThirdItems);

    // Apply smooth 30s continuous animation
    partnersContainer.style.animation = 'marquee 30s linear infinite';

    marqueeItems.forEach(partner => {
      const card = document.createElement('div');
      card.className = 'partner-card';
      const name = (currentLang === 'fr' && partner.nameFr) ? partner.nameFr : (partner.nameAr || partner.name || '');
      const desc = (currentLang === 'fr' && partner.descFr) ? partner.descFr : (partner.descAr || partner.desc || '');
      const safeLogo = sanitizeUrl(partner.logo || 'assets/partner-1.svg');

      card.innerHTML = `
        <img src="${safeLogo}" alt="${escapeHtml(name)}" loading="lazy" decoding="async" onerror="this.src='assets/logo.png'" />
        <span class="partner-card-name">${escapeHtml(name)}</span>
        ${desc ? `<span class="partner-card-desc">${escapeHtml(desc)}</span>` : ''}
      `;
      partnersContainer.appendChild(card);
    });
  }

  // Marquee hover and touch pause/resume controller
  const marqueeWrapper = document.getElementById('partners-marquee-wrapper');
  if (marqueeWrapper) {
    marqueeWrapper.addEventListener('mouseenter', () => {
      const track = document.getElementById('partners-container');
      if (track) track.style.animationPlayState = 'paused';
    });
    marqueeWrapper.addEventListener('mouseleave', () => {
      const track = document.getElementById('partners-container');
      if (track) track.style.animationPlayState = 'running';
    });
    marqueeWrapper.addEventListener('touchstart', () => {
      const track = document.getElementById('partners-container');
      if (track) track.style.animationPlayState = 'paused';
    }, { passive: true });
    marqueeWrapper.addEventListener('touchend', () => {
      const track = document.getElementById('partners-container');
      if (track) track.style.animationPlayState = 'running';
    }, { passive: true });
  }

  function initPartnersCloudSync() {
    if (window.BloodDonorsFirebase && typeof window.BloodDonorsFirebase.subscribeToPartners === 'function') {
      window.BloodDonorsFirebase.subscribeToPartners((items) => {
        cachedPartners = items;
        renderPublicPartners(items, getCurrentLang());
      });
    } else {
      window.addEventListener('bloodDonorsFirebaseReady', () => {
        if (window.BloodDonorsFirebase?.subscribeToPartners) {
          window.BloodDonorsFirebase.subscribeToPartners((items) => {
            cachedPartners = items;
            renderPublicPartners(items, getCurrentLang());
          });
        }
      }, { once: true });

      renderPublicPartners(null, getCurrentLang());
    }
  }

  initActivitiesGalleryCloudSync();
  initPartnersCloudSync();

  // =========================================================================
  // 17c. Dynamic Statistics Counters & Upcoming Campaign Cloud Services
  // =========================================================================
  let cachedStatsCounters = null;
  let cachedCampaignData = null;

  function applyPublicStatsCounters(stats) {
    if (!stats) return;
    cachedStatsCounters = stats;

    const statMappings = [
      { id: 'counter-donors', value: stats.donors },
      { id: 'counter-bags', value: stats.bags },
      { id: 'counter-campaigns', value: stats.campaigns },
      { id: 'counter-lives', value: stats.lives }
    ];

    statMappings.forEach(mapping => {
      if (mapping.value !== undefined && mapping.value !== null) {
        const numEl = document.getElementById(mapping.id);
        if (numEl) {
          const card = numEl.closest('.stat-card');
          if (card) {
            card.setAttribute('data-target', String(mapping.value));
            numEl.setAttribute('data-target', String(mapping.value));
            animateCounter(card);
          }
        }
      }
    });
  }

  function initStatsCloudSync() {
    if (window.BloodDonorsFirebase && typeof window.BloodDonorsFirebase.subscribeToStatsCounters === 'function') {
      window.BloodDonorsFirebase.subscribeToStatsCounters((stats) => {
        applyPublicStatsCounters(stats);
      });
    } else {
      window.addEventListener('bloodDonorsFirebaseReady', () => {
        if (window.BloodDonorsFirebase?.subscribeToStatsCounters) {
          window.BloodDonorsFirebase.subscribeToStatsCounters((stats) => {
            applyPublicStatsCounters(stats);
          });
        }
      }, { once: true });

      try {
        const stored = localStorage.getItem('admin_stats_counters') || localStorage.getItem('admin_stats_data');
        if (stored) applyPublicStatsCounters(JSON.parse(stored));
      } catch (e) {}
    }
  }

  function applyPublicCampaignData(camp, lang) {
    if (!camp) return;
    cachedCampaignData = camp;

    const currentLang = lang || getCurrentLang();
    const campNameEl = document.querySelector('[data-i18n="campaign_name"]');
    const campLocEl = document.querySelector('[data-i18n="campaign_location"]');
    const campDateEl = document.querySelector('[data-i18n="campaign_date"]');

    if (campNameEl) {
      const title = (currentLang === 'fr' && camp.titleFr) ? camp.titleFr : (camp.titleAr || camp.title);
      campNameEl.textContent = title || (currentLang === 'fr' ? 'Aucune campagne annoncée pour le moment' : 'لا توجد حملة معلنة حاليًا');
    }

    if (campLocEl) {
      const loc = (currentLang === 'fr' && camp.locFr) ? camp.locFr : (camp.locAr || camp.loc || camp.location);
      campLocEl.textContent = loc || '';
    }

    if (campDateEl) {
      const dt = (currentLang === 'fr' && (camp.dateFr || camp.dateTextFr)) ? (camp.dateFr || camp.dateTextFr) : (camp.dateAr || camp.dateText || camp.date);
      campDateEl.textContent = dt || '';
    }

    const parsedTarget = camp.targetDatetime ? new Date(camp.targetDatetime).getTime() : NaN;
    targetDate = Number.isFinite(parsedTarget) ? parsedTarget : null;
    updateCountdown();
  }

  function initCampaignCloudSync() {
    if (window.BloodDonorsFirebase && typeof window.BloodDonorsFirebase.subscribeToCampaignData === 'function') {
      window.BloodDonorsFirebase.subscribeToCampaignData((camp) => {
        applyPublicCampaignData(camp, getCurrentLang());
      });
    } else {
      window.addEventListener('bloodDonorsFirebaseReady', () => {
        if (window.BloodDonorsFirebase?.subscribeToCampaignData) {
          window.BloodDonorsFirebase.subscribeToCampaignData((camp) => {
            applyPublicCampaignData(camp, getCurrentLang());
          });
        }
      }, { once: true });

      try {
        const stored = localStorage.getItem('admin_campaign_data');
        if (stored) applyPublicCampaignData(JSON.parse(stored), getCurrentLang());
      } catch (e) {}
    }
  }

  initStatsCloudSync();
  initCampaignCloudSync();

  // =========================================================================
  // 17d. Dynamic Social Links, Leaderboard Teams & Pillar Cards Cloud Services
  // =========================================================================
  let cachedSocialLinks = null;
  let cachedLeaderboardTeams = null;
  let cachedPillars = null;

  function initSocialLinksCloudSync() {
    if (window.BloodDonorsFirebase && typeof window.BloodDonorsFirebase.subscribeToSocialLinks === 'function') {
      window.BloodDonorsFirebase.subscribeToSocialLinks((links) => {
        cachedSocialLinks = links;
        syncSocialAndContact();
      });
    } else {
      window.addEventListener('bloodDonorsFirebaseReady', () => {
        if (window.BloodDonorsFirebase?.subscribeToSocialLinks) {
          window.BloodDonorsFirebase.subscribeToSocialLinks((links) => {
            cachedSocialLinks = links;
            syncSocialAndContact();
          });
        }
      }, { once: true });

      try {
        const stored = localStorage.getItem('admin_social_links');
        if (stored) {
          cachedSocialLinks = JSON.parse(stored);
          syncSocialAndContact();
        }
      } catch (e) {}
    }
  }

  function initLeaderboardCloudSync() {
    if (window.BloodDonorsFirebase && typeof window.BloodDonorsFirebase.subscribeToLeaderboardTeams === 'function') {
      window.BloodDonorsFirebase.subscribeToLeaderboardTeams((teams) => {
        cachedLeaderboardTeams = teams;
        syncTeamsLeaderboard(getCurrentLang());
      });
    } else {
      window.addEventListener('bloodDonorsFirebaseReady', () => {
        if (window.BloodDonorsFirebase?.subscribeToLeaderboardTeams) {
          window.BloodDonorsFirebase.subscribeToLeaderboardTeams((teams) => {
            cachedLeaderboardTeams = teams;
            syncTeamsLeaderboard(getCurrentLang());
          });
        }
      }, { once: true });

      try {
        const stored = localStorage.getItem('admin_leaderboard_teams');
        if (stored) {
          cachedLeaderboardTeams = JSON.parse(stored);
          syncTeamsLeaderboard(getCurrentLang());
        }
      } catch (e) {}
    }
  }

  function initPillarsCloudSync() {
    if (window.BloodDonorsFirebase && typeof window.BloodDonorsFirebase.subscribeToPillars === 'function') {
      window.BloodDonorsFirebase.subscribeToPillars((pillars) => {
        cachedPillars = pillars;
        syncPillars(getCurrentLang());
      });
    } else {
      window.addEventListener('bloodDonorsFirebaseReady', () => {
        if (window.BloodDonorsFirebase?.subscribeToPillars) {
          window.BloodDonorsFirebase.subscribeToPillars((pillars) => {
            cachedPillars = pillars;
            syncPillars(getCurrentLang());
          });
        }
      }, { once: true });

      try {
        const stored = localStorage.getItem('admin_pillar_cards');
        if (stored) {
          cachedPillars = JSON.parse(stored);
          syncPillars(getCurrentLang());
        }
      } catch (e) {}
    }
  }

  initSocialLinksCloudSync();
  initLeaderboardCloudSync();
  initPillarsCloudSync();

  // =========================================================================
  // 18. Admin Data Sync
  // =========================================================================
  function syncAdminData() {
    try {
      const lang = getCurrentLang();

      // 1. Sync Emergency Alert
      if (cachedEmergencyAlert) {
        applyEmergencyAlert(cachedEmergencyAlert, lang);
      }

      // 2. Sync Dynamic Gallery
      renderPublicActivitiesGallery(cachedActivitiesGallery, lang);
      if (typeof activityModal !== 'undefined' && activityModal && activityModal.style.display === 'flex' && currentOpenActivityItem) {
        openActivityModal(currentOpenActivityItem);
      }

      // 3. Sync Dynamic Partners
      renderPublicPartners(cachedPartners, lang);

      // 4. Sync Dynamic Stats & Counters
      if (cachedStatsCounters) {
        applyPublicStatsCounters(cachedStatsCounters);
      } else {
        const storedStats = localStorage.getItem('admin_stats_counters') || localStorage.getItem('admin_stats_data');
        if (storedStats) {
          try {
            applyPublicStatsCounters(JSON.parse(storedStats));
          } catch (e) {}
        }
      }

      // 5. Sync Dynamic Upcoming Campaign & Countdown
      if (cachedCampaignData) {
        applyPublicCampaignData(cachedCampaignData, lang);
      } else {
        const storedCampaign = localStorage.getItem('admin_campaign_data');
        if (storedCampaign) {
          try {
            applyPublicCampaignData(JSON.parse(storedCampaign), lang);
          } catch (err) {
            console.warn('Error applying admin campaign data:', err);
          }
        }
      }

      // 6. Sync Dynamic Hero Image Slider (Strict Rule: Admin Provided Only, Zero Dummy Images)
      syncHeroSlider(lang, cachedHeroGalleryItems);

      // 7. Sync Dynamic Social Media & Contact Info from admin_social_links
      syncSocialAndContact();

      // 8. Sync Dynamic Teams Leaderboard (Group Donation Challenge)
      syncTeamsLeaderboard(lang);

      // 9. Sync Dynamic Core Pillar Cards
      syncPillars(lang);

    } catch (e) {
      console.warn('Error syncing admin data:', e);
    }
  }

  // =========================================================================
  // Social Media & Contact Details Synchronization (admin_social_links)
  // =========================================================================
  function syncSocialAndContact() {
    try {
      let data = cachedSocialLinks;
      if (!data) {
        const stored = localStorage.getItem('admin_social_links');
        if (stored) {
          try {
            data = JSON.parse(stored);
          } catch (e) {}
        }
      }
      if (!data || typeof data !== 'object') return;

      // 1. Facebook Link
      const fbLink = document.getElementById('social-facebook');
      if (fbLink) {
        const fbUrl = (data.facebook || '').trim();
        if (fbUrl && /^https?:\/\//i.test(fbUrl)) {
          fbLink.href = fbUrl;
          fbLink.style.display = 'inline-flex';
        } else {
          fbLink.href = '#';
        }
      }

      // 2. Instagram Link
      const igLink = document.getElementById('social-instagram');
      if (igLink) {
        const igUrl = (data.instagram || '').trim();
        if (igUrl && /^https?:\/\//i.test(igUrl)) {
          igLink.href = igUrl;
          igLink.style.display = 'inline-flex';
        } else {
          igLink.href = '#';
        }
      }

      // 3. TikTok Link
      const ttLink = document.getElementById('social-tiktok');
      if (ttLink) {
        const ttUrl = (data.tiktok || '').trim();
        if (ttUrl && /^https?:\/\//i.test(ttUrl)) {
          ttLink.href = ttUrl;
          ttLink.style.display = 'inline-flex';
        } else {
          ttLink.href = '#';
        }
      }

      // 4. WhatsApp Floating Button
      const waBtn = document.getElementById('whatsapp-float');
      if (waBtn) {
        if (data.whatsapp && data.whatsapp.trim()) {
          let waVal = data.whatsapp.trim();
          let waUrl = waVal;
          if (!waVal.startsWith('http://') && !waVal.startsWith('https://')) {
            const cleanNum = waVal.replace(/\D/g, '');
            const intlNum = cleanNum.startsWith('0') ? '212' + cleanNum.substring(1) : (cleanNum || '212677216964');
            const lang = getCurrentLang();
            const msg = lang === 'fr'
              ? 'Bonjour, je souhaite me renseigner sur le don de sang à Berkane'
              : 'السلام عليكم، أرغب في الاستفسار عن التبرع بالدم في بركان';
            waUrl = `https://wa.me/${intlNum}?text=${encodeURIComponent(msg)}`;
          }
          waBtn.href = waUrl;
          waBtn.style.display = 'flex';
        }
      }

      // 5. Official Phone Number
      const phoneEl = document.getElementById('footer-contact-phone');
      if (phoneEl && data.phone && data.phone.trim()) {
        const cleanPhone = data.phone.trim();
        phoneEl.href = `tel:${cleanPhone.replace(/\s+/g, '')}`;
        const span = phoneEl.querySelector('span');
        if (span) {
          span.textContent = cleanPhone;
        } else {
          phoneEl.textContent = cleanPhone;
        }
      }

      // 6. Official Email Address
      const emailEl = document.getElementById('footer-contact-email');
      if (emailEl && data.email && data.email.trim()) {
        const cleanEmail = data.email.trim();
        emailEl.href = `mailto:${cleanEmail}`;
        const span = emailEl.querySelector('span');
        if (span) {
          span.textContent = cleanEmail;
        } else {
          emailEl.textContent = cleanEmail;
        }
      }
    } catch (e) {
      console.warn('Error syncing social & contact info:', e);
    }
  }

  // =========================================================================
  // Core Pillar Cards Synchronization (admin_pillar_cards)
  // =========================================================================
  function syncPillars(lang) {
    try {
      let pillars = cachedPillars;
      if (!pillars) {
        const stored = localStorage.getItem('admin_pillar_cards');
        if (stored) {
          try {
            pillars = JSON.parse(stored);
          } catch (e) {}
        }
      }
      if (!Array.isArray(pillars) || pillars.length < 3) return;

      const currentLang = lang || getCurrentLang();

      pillars.forEach((p, idx) => {
        const cardId = `pillar-card-${idx + 1}`;
        const card = document.getElementById(cardId);
        if (!card) return;

        const titleEl = card.querySelector('h3');
        const descEl = card.querySelector('p');

        const title = (currentLang === 'fr' && p.titleFr) ? p.titleFr : (p.titleAr || '');
        const desc = (currentLang === 'fr' && p.descFr) ? p.descFr : (p.descAr || '');

        if (titleEl && title) titleEl.textContent = title;
        if (descEl && desc) descEl.textContent = desc;

        if (p.icon) {
          const iconEl = card.querySelector('.feature-icon i');
          if (iconEl) {
            iconEl.className = `fa-solid ${p.icon}`;
          }
        }
      });
    } catch (e) {
      console.warn('Error syncing pillar cards:', e);
    }
  }

  // =========================================================================
  // Feature #5: Teams & Institutions Leaderboard (Group Donation Challenge)
  // =========================================================================
  const TEAM_CATEGORY_MAP = {
    education: { ar: 'مؤسسة تعليمية', fr: 'Établissement éducatif', icon: '🏫' },
    association: { ar: 'جمعية / مجتمع مدني', fr: 'Association', icon: '🤝' },
    company: { ar: 'شركة / قطاع خاص', fr: 'Entreprise privée', icon: '🏢' },
    youth: { ar: 'نادي رياضي / شبابي', fr: 'Club sportif', icon: '⚽' },
    public: { ar: 'إدارة / مؤسسة عمومية', fr: 'Établissement public', icon: '🏛️' },
    other: { ar: 'مجموعة أخرى', fr: 'Autre groupe', icon: '👥' }
  };

  function syncTeamsLeaderboard(lang) {
    const container = document.getElementById('leaderboard-container');
    if (!container) return;

    const currentLang = lang || getCurrentLang();
    let teams = cachedLeaderboardTeams;

    if (!teams) {
      try {
        const stored = localStorage.getItem('admin_leaderboard_teams');
        if (stored) {
          teams = JSON.parse(stored);
        }
      } catch (err) {
        console.warn('Error reading admin_leaderboard_teams:', err);
        teams = [];
      }
    }

    if (!Array.isArray(teams)) {
      teams = [];
    }

    // Filter valid teams
    teams = teams.filter(t => t && (t.nameAr || t.nameFr || t.name));

    // Sort descending by current donations count
    teams.sort((a, b) => (parseInt(b.currentBags, 10) || 0) - (parseInt(a.currentBags, 10) || 0));

    // Empty state handling
    if (teams.length === 0) {
      const emptyText = currentLang === 'fr'
        ? (window.translations && window.translations.fr && window.translations.fr.leaderboard_empty) || "Aucune équipe n'est encore inscrite au tableau d'honneur. Soyez les premiers à participer !"
        : (window.translations && window.translations.ar && window.translations.ar.leaderboard_empty) || "لا توجد فرق مسجلة في لوحة الشرف حالياً. كن أول من يسجل فريقه في التحدي!";
      
      container.innerHTML = `
        <div class="leaderboard-empty-state">
          <div class="leaderboard-empty-icon"><i class="fa-solid fa-trophy challenge-trophy" aria-hidden="true"></i></div>
          <p class="leaderboard-empty-text">${emptyText}</p>
        </div>
      `;
      return;
    }

    // Render Grid
    const grid = document.createElement('div');
    grid.className = 'leaderboard-grid';

    teams.forEach((team, index) => {
      const rank = index + 1;
      const rankClass = rank === 1 ? 'rank-1' : (rank === 2 ? 'rank-2' : (rank === 3 ? 'rank-3' : 'rank-other'));
      const rankBadgeText = rank === 1 ? '🥇 1' : (rank === 2 ? '🥈 2' : (rank === 3 ? '🥉 3' : `#${rank}`));
      
      const teamName = currentLang === 'fr' ? (team.nameFr || team.nameAr || team.name) : (team.nameAr || team.nameFr || team.name);
      const catKey = team.category || 'other';
      const catObj = TEAM_CATEGORY_MAP[catKey] || { ar: team.categoryAr || 'فريق', fr: team.categoryFr || 'Équipe', icon: '🏆' };
      const catLabel = currentLang === 'fr' ? catObj.fr : catObj.ar;
      const icon = team.icon || catObj.icon || '🏆';

      const currentBags = parseInt(team.currentBags, 10) || 0;
      const targetBags = parseInt(team.targetBags, 10) || 30;
      const pct = Math.min(100, Math.round((currentBags / targetBags) * 100));

      const bagUnit = currentLang === 'fr' ? 'poches' : 'كيس';
      const goalLabel = currentLang === 'fr' ? 'Objectif' : 'الهدف';

      const card = document.createElement('article');
      card.className = `team-card ${rankClass}`;
      card.innerHTML = `
        <div class="team-card-header">
          <span class="team-rank-badge">${rankBadgeText}</span>
          <span class="team-category-badge">${escapeHtml(catLabel)}</span>
        </div>
        <div class="team-card-body">
          <div class="team-avatar-icon">${icon === '🏆' ? '<i class="fa-solid fa-trophy challenge-trophy" aria-hidden="true"></i>' : escapeHtml(icon)}</div>
          <div class="team-info-wrap">
            <h3 class="team-card-title">${escapeHtml(teamName)}</h3>
          </div>
        </div>
        <div class="team-progress-wrap">
          <div class="team-progress-stats">
            <div>
              <span class="team-progress-current">${currentBags}</span>
              <span style="font-size: 0.82rem; margin-inline-start: 4px;">${bagUnit}</span>
            </div>
            <div style="font-size: 0.82rem;">
              <span>${goalLabel}: ${targetBags}</span>
              <span style="font-weight: 800; color: var(--text); margin-inline-start: 6px;">(${pct}%)</span>
            </div>
          </div>
          <div class="team-progress-track">
            <div class="team-progress-fill" style="width: ${pct}%;"></div>
          </div>
        </div>
      `;
      grid.appendChild(card);
    });

    container.innerHTML = '';
    container.appendChild(grid);
  }

  // =========================================================================
  // Team Pledge Challenge Modal & Form Submission
  // =========================================================================
  const openPledgeBtn = document.getElementById('open-team-pledge-btn');
  const pledgeModal = document.getElementById('team-pledge-modal');
  const closePledgeBtn = document.getElementById('close-team-pledge-modal');
  const cancelPledgeBtn = document.getElementById('cancel-team-pledge-btn');
  const pledgeForm = document.getElementById('team-pledge-form');

  function openTeamPledgeModal() {
    if (pledgeModal) {
      pledgeModal.style.display = 'flex';
      document.body.style.overflow = 'hidden';
      const firstInput = pledgeModal.querySelector('input');
      if (firstInput) setTimeout(() => firstInput.focus(), 100);
    }
  }

  function closeTeamPledgeModal() {
    if (pledgeModal) {
      pledgeModal.style.display = 'none';
      document.body.style.overflow = '';
      if (pledgeForm && !pendingForms.has(pledgeForm)) pledgeForm.reset();
    }
  }

  if (openPledgeBtn) {
    openPledgeBtn.addEventListener('click', openTeamPledgeModal);
  }

  if (closePledgeBtn) {
    closePledgeBtn.addEventListener('click', closeTeamPledgeModal);
  }

  if (cancelPledgeBtn) {
    cancelPledgeBtn.addEventListener('click', closeTeamPledgeModal);
  }

  if (pledgeModal) {
    pledgeModal.addEventListener('click', (e) => {
      if (e.target === pledgeModal) {
        closeTeamPledgeModal();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && pledgeModal && pledgeModal.style.display === 'flex') {
      closeTeamPledgeModal();
    }
  });

  if (pledgeForm) {
    pledgeForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (pendingForms.has(pledgeForm)) return;

      const teamName = (document.getElementById('team-name') ? document.getElementById('team-name').value : '').trim();
      const category = (document.getElementById('team-category') ? document.getElementById('team-category').value : 'other');
      const coordinator = (document.getElementById('team-coordinator') ? document.getElementById('team-coordinator').value : '').trim();
      const phone = (document.getElementById('team-phone') ? document.getElementById('team-phone').value : '').trim();
      const targetBags = parseInt(document.getElementById('team-target') ? document.getElementById('team-target').value : '30', 10) || 30;
      const notes = (document.getElementById('team-notes') ? document.getElementById('team-notes').value : '').trim();

      if (!teamName || !coordinator || !phone) {
        showToast(translate('toast_fill_required'), 'error');
        return;
      }

      const currentLang = getCurrentLang();

      if (!isValidMoroccanPhone(phone)) {
        showToast(currentLang === 'fr' ? 'Veuillez saisir un numéro de téléphone marocain valide (ex: 0612345678)' : 'يرجى إدخال رقم هاتف مغربي صحيح (مثال: 0612345678)', 'error');
        return;
      }

      if (teamName.length > 120 || coordinator.length > 100 || notes.length > 600) {
        showToast(translate('toast_fill_required'), 'error');
        return;
      }
      const newRequest = {
        teamName,
        category,
        coordinator,
        phone,
        targetBags,
        notes,
        date: new Date().toLocaleDateString(currentLang === 'fr' ? 'fr-FR' : 'ar-MA'),
        status: 'pending'
      };

      setFormPending(pledgeForm, true);
      try {
        if (!window.BloodDonorsFirebase || typeof window.BloodDonorsFirebase.addTeamRequest !== 'function') {
          throw new Error('Team registration service unavailable');
        }
        await window.BloodDonorsFirebase.addTeamRequest(newRequest, submissionIdFor(pledgeForm, newRequest));
        submissionAttempts.delete(pledgeForm);
      } catch (err) {
        console.warn('Error saving team request:', err);
        showToast('toast_error_general', 'error');
        return;
      } finally {
        setFormPending(pledgeForm, false);
      }

      closeTeamPledgeModal();

      // Celebration & registration receipt
      if (typeof triggerConfetti === 'function') {
        triggerConfetti();
      }

      showRegistrationConfirmation('team', openPledgeBtn);
    });
  }

  // =========================================================================
  // Smart Body Recovery Simulator (محاكي تعافي الجسم بعد التبرع)
  // =========================================================================
  const RECOVERY_STAGES_DATA = [
    {
      stage: 0,
      icon: '⏱️',
      plasma: 20,
      platelets: 50,
      rbc: 15,
      overall: 25,
      titleAr: 'انقباض الأوعية وتثبيت ضغط الدم',
      titleFr: 'Stabilisation de la tension artérielle & hémostase',
      descAr: 'تبدأ الأوعية الدموية بالانقباض التلقائي للحفاظ على ضغط دم مستقر. تعوض السوائل المتناولة فوراً (الماء والعصير في خيمة الاستراحة) حجم الدورة الدموية، وتعمل الصفائح على إغلاق نقطة الوخز بأمان تام.',
      descFr: 'Les vaisseaux sanguins se contractent pour stabiliser la pression. Les liquides absorbés lors de la collation commencent déjà à restaurer le volume circulant et les plaquettes colmatent le point de ponction.',
      bagAr: 'كيس الدم في طريقه لوحدة الحفظ المبردة بالمستشفى؛ يخضع لترميز باركود آمن تمهيداً لفصل مكوناته المخبرية.',
      bagFr: "La poche est acheminée sous chaîne de froid à l'Hôpital Draq de Berkane avec code-barres sécurisé avant centrifugation.",
      tipAr: 'استرح لمدة 10 إلى 15 دقيقة، واشرب كوبين من الماء أو العصير الطبيعي وتناول وجبة خفيفة قبل مغادرة موقع الحملة.',
      tipFr: 'Reposez-vous 10 à 15 minutes, buvez deux verres d\'eau ou de jus et prenez votre collation avant de quitter le site.'
    },
    {
      stage: 1,
      icon: '💧',
      plasma: 100,
      platelets: 70,
      rbc: 35,
      overall: 60,
      titleAr: 'التعويض الكامل لحجم البلازما والسوائل',
      titleFr: 'Restauration intégrale du volume plasmatique',
      descAr: 'استعاد جسمك 100% من حجم السوائل والبلازما المفقودة بفضل كفاءة الكلى وتدفق المياه بين الأنسجة. يعود حجم الدم الإجمالي لطبيعته تماماً دون أي إجهاد للقلب.',
      descFr: 'Votre corps a reconstitué 100% du volume liquide et plasmatique grâce à l\'hydratation. Le volume sanguin total est redevenu totalement normal.',
      bagAr: 'تجري في مختبر بنك الدم تحاليل السلامة البيولوجية الدقيقة (فصائل الدم، التهاب الكبد، السيدا) لضمان أمان دمك للمرضى والمصابين.',
      bagFr: 'Analyses de qualification biologique (groupage, sérologie, dépistages) pour garantir une sécurité transfusionnelle maximale.',
      tipAr: 'واصل شرب السوائل بوفرة (2 إلى 3 لترات يومياً) وتجنب رفع الأثقال أو التمارين الرياضية الشاقة باليد المتبرع بها.',
      tipFr: 'Continuez à boire abondamment (2 à 3 litres d\'eau) et évitez les efforts physiques intenses ou de soulever des charges lourdes.'
    },
    {
      stage: 2,
      icon: '🛡️',
      plasma: 100,
      platelets: 100,
      rbc: 55,
      overall: 75,
      titleAr: 'تجدد كامل للصفائح وذروة نشاط النخاع العظمي',
      titleFr: 'Renouvellement total des plaquettes & pic médullaire',
      descAr: 'عادت الصفائح الدموية إلى مستواها الأولي 100%. يفرز النخاع العظمي محفزات حيوية قوية (الإريثروبويتين) لتسريع ولادة ملايين الكريات الحمراء الشابة المفعمة بالحيوية.',
      descFr: 'Vos plaquettes sanguines sont renouvelées à 100%. La moelle osseuse est en pleine effervescence pour produire de jeunes globules rouges vigoureux.',
      bagAr: 'تم فصل كيسك إلى 3 مشتقات علاجية: كريات حمراء لمصاب بحادث، صفائح لمريض سرطان، وبلازما لإنقاذ مصاب بحروق .',
      bagFr: 'Votre don est séparé en 3 fractions vitales : culot globulaire (urgences), plaquettes (cancérologie) et plasma (grands brûlés).',
      tipAr: 'ركز على الأغذية الغنية بالحديد وفيتامين C (كالعدس، السبانخ، اللحوم الحمراء، والبرتقال البركاني اللذيذ) لدعم إنتاج الخلايا.',
      tipFr: 'Privilégiez les aliments riches en fer et vitamine C (lentilles, épinards, viandes, agrumes de Berkane) pour optimiser l\'hématopoïèse.'
    },
    {
      stage: 3,
      icon: '🩸',
      plasma: 100,
      platelets: 100,
      rbc: 90,
      overall: 95,
      titleAr: 'تجدد شبه تام للكريات الحمراء وتنشيط الدورة الدموية',
      titleFr: 'Reconstitution quasi-totale des globules rouges',
      descAr: 'اكتمل تعويض أكثر من 90% من كريات الدم الحمراء وخضاب الدم (الهيموجلوبين). يشعر المتبرع بحيوية متزايدة وتحسن في تدفق الأكسجين وتجدد أنسجة الجسم.',
      descFr: 'Plus de 90% de vos globules rouges et de votre hémoglobine sont renouvelés. Votre circulation transporte un oxygène frais et régénéré.',
      bagAr: 'كيس دمك ساهم بالفعل في إنقاذ حياة أم أثناء الولادة أو مصاب في قسم المستعجلات؛ شكرًا لعطائك الإنساني!',
      bagFr: 'Votre don a déjà sauvé la vie d\'une maman ou d\'un blessé en réanimation à Berkane. Merci pour ce geste héroïque !',
      tipAr: 'أنت تتمتع الآن بدم متجدد وخلايا فتية نشطة؛ استمر في نظامك الغذائي المتوازن ونمط حياتك الصحي والنشط.',
      tipFr: 'Vous bénéficiez d\'un sang neuf et purifié. Maintenez un mode de vie sain, actif et équilibré.'
    },
    {
      stage: 4,
      icon: '🏆',
      plasma: 100,
      platelets: 100,
      rbc: 100,
      overall: 100,
      titleAr: 'تعافٍ بيولوجي كامل بنسبة 100% وجاهزية لتبرع جديد',
      titleFr: 'Récupération biologique à 100% & nouvelle éligibilité',
      descAr: 'استعاد جسمك كامل مخزونه من الحديد والهيموجلوبين بنسبة 100%. أصبحت مؤهلاً طبياً وقانونياً لخوض تجربة تبرع نبيلة جديدة وإنقاذ 3 أرواح أخرى بالإقليم!',
      descFr: 'Récupération totale à 100% du capital sanguin et des réserves de fer. Vous êtes officiellement prêt(e) pour un nouveau don salvateur !',
      bagAr: 'أثر تبرعك مستمر في دماء المرضى المتعافين، وأسرة جمعية المتبرعين بالدم إقليم بركان تفخر بك كبطل حقيقي للإنسانية في مدينتنا.',
      bagFr: 'Votre générosité continue de faire battre des cœurs dans notre province. Vous êtes un véritable héros du quotidien !',
      tipAr: 'تهانينا! يمكنك الآن حجز موعد للتبرع في أقرب حملة للجمعية بإقليم بركان ومواصلة مسيرة العطاء لإنقاذ الأرواح.',
      tipFr: 'Félicitations ! Vous pouvez dès à présent participer à la prochaine campagne de don de sang à Berkane.'
    }
  ];

  let currentRecoveryStageIdx = 0;

  function selectRecoveryStage(index) {
    const stageIdx = Math.max(0, Math.min(RECOVERY_STAGES_DATA.length - 1, parseInt(index, 10) || 0));
    currentRecoveryStageIdx = stageIdx;
    const stageData = RECOVERY_STAGES_DATA[stageIdx];
    const lang = getCurrentLang();

    // 1. Update Buttons Active State
    const stageBtns = document.querySelectorAll('#recovery-timeline-btns .recovery-step-btn');
    stageBtns.forEach((btn, i) => {
      const isActive = (i === stageIdx);
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });

    // 2. Update Column 1 Visual Tank
    const liquid = document.getElementById('recovery-liquid');
    const stageIcon = document.getElementById('recovery-stage-icon');
    const overallPercent = document.getElementById('recovery-overall-percent');
    const bagText = document.getElementById('recovery-bag-text');

    if (liquid) {
      liquid.style.height = `${stageData.overall}%`;
    }
    if (stageIcon) {
      stageIcon.textContent = stageData.icon;
    }
    if (overallPercent) {
      overallPercent.textContent = `${stageData.overall}%`;
    }
    if (bagText) {
      bagText.textContent = (lang === 'fr') ? stageData.bagFr : stageData.bagAr;
    }

    // 3. Update Column 2 Metrics & Descriptions
    const stageTitle = document.getElementById('recovery-stage-title');
    const stageDesc = document.getElementById('recovery-stage-desc');
    const barPlasma = document.getElementById('bar-plasma');
    const barPlasmaVal = document.getElementById('bar-plasma-val');
    const barPlatelets = document.getElementById('bar-platelets');
    const barPlateletsVal = document.getElementById('bar-platelets-val');
    const barRbc = document.getElementById('bar-rbc');
    const barRbcVal = document.getElementById('bar-rbc-val');
    const doctorTip = document.getElementById('recovery-doctor-tip');

    if (stageTitle) {
      stageTitle.textContent = (lang === 'fr') ? stageData.titleFr : stageData.titleAr;
    }
    if (stageDesc) {
      stageDesc.textContent = (lang === 'fr') ? stageData.descFr : stageData.descAr;
    }

    if (barPlasma) barPlasma.style.width = `${stageData.plasma}%`;
    if (barPlasmaVal) barPlasmaVal.textContent = `${stageData.plasma}%`;

    if (barPlatelets) barPlatelets.style.width = `${stageData.platelets}%`;
    if (barPlateletsVal) barPlateletsVal.textContent = `${stageData.platelets}%`;

    if (barRbc) barRbc.style.width = `${stageData.rbc}%`;
    if (barRbcVal) barRbcVal.textContent = `${stageData.rbc}%`;

    if (doctorTip) {
      doctorTip.textContent = (lang === 'fr') ? stageData.tipFr : stageData.tipAr;
    }
  }

  // Bind click on timeline buttons
  const timelineBtns = document.querySelectorAll('#recovery-timeline-btns .recovery-step-btn');
  timelineBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const stage = parseInt(btn.getAttribute('data-stage'), 10);
      selectRecoveryStage(stage);
    });
  });

  // 4. Personal Recovery Calculator
  const recoveryForm = document.getElementById('recovery-calc-form');
  const lastDonationInput = document.getElementById('last-donation-date');
  const recoveryResultBox = document.getElementById('personal-recovery-result');

  // Set default max date to today
  if (lastDonationInput) {
    const todayStr = new Date().toISOString().split('T')[0];
    lastDonationInput.setAttribute('max', todayStr);
  }

  if (recoveryForm) {
    recoveryForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const dateVal = lastDonationInput ? lastDonationInput.value : '';
      const lang = getCurrentLang();

      if (!dateVal) {
        showToast(lang === 'fr' ? 'Veuillez sélectionner une date valide.' : 'يرجى اختيار تاريخ صالح.', 'error');
        return;
      }

      const donationDate = new Date(dateVal);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      donationDate.setHours(0, 0, 0, 0);

      if (isNaN(donationDate.getTime())) {
        showToast(lang === 'fr' ? 'Format de date invalide.' : 'تنسيق التاريخ غير صحيح.', 'error');
        return;
      }

      if (donationDate > today) {
        showToast(lang === 'fr' ? 'La date ne peut pas être dans le futur !' : 'لا يمكن اختيار تاريخ مستقبلي للتبرع السابق !', 'error');
        return;
      }

      // Difference in days
      const diffTime = today.getTime() - donationDate.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      // Calculate next eligible date (56 days = 8 weeks)
      const nextEligibleDate = new Date(donationDate);
      nextEligibleDate.setDate(nextEligibleDate.getDate() + 56);
      const nextDateFormatted = nextEligibleDate.toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'ar-MA', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      // Match to Stage:
      let matchedStage = 0;
      if (diffDays === 0) {
        matchedStage = 0;
      } else if (diffDays <= 2) {
        matchedStage = 1;
      } else if (diffDays <= 21) {
        matchedStage = 2;
      } else if (diffDays < 56) {
        matchedStage = 3;
      } else {
        matchedStage = 4;
      }

      // Select that stage in the simulator
      selectRecoveryStage(matchedStage);

      // Render Result Card
      if (recoveryResultBox) {
        recoveryResultBox.style.display = 'block';

        if (diffDays >= 56) {
          // Fully recovered & Eligible
          if (lang === 'fr') {
            recoveryResultBox.innerHTML = `
              <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
                <span style="font-size: 1.5rem;">🎉</span>
                <strong style="color: #10B981; font-size: 1.05rem;">Félicitations ! Vous êtes totalement rétabli(e) à 100%</strong>
                <span class="calc-result-badge">Éligible dès maintenant</span>
              </div>
              <p style="margin: 0; line-height: 1.6;">
                Il s'est écoulé <span class="calc-result-highlight">${diffDays} jours</span> depuis votre dernier don. Votre capital sanguin est intégralement reconstitué. Vous pouvez dès aujourd'hui participer à la prochaine campagne de Berkane et sauver jusqu'à 3 nouvelles vies !
              </p>
            `;
          } else {
            recoveryResultBox.innerHTML = `
              <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
                <span style="font-size: 1.5rem;">🎉</span>
                <strong style="color: #10B981; font-size: 1.05rem;">تهانينا! جسمك متعافٍ تماماً بنسبة 100%</strong>
                <span class="calc-result-badge">مؤهل للتبرع الآن</span>
              </div>
              <p style="margin: 0; line-height: 1.6;">
                لقد مضى <span class="calc-result-highlight">${diffDays} يوماً</span> على آخر تبرع لك. استعاد جسمك كامل مخزونه من الدم والحديد، وأنت مؤهل طبياً للتبرع في أقرب حملة بإقليم بركان لإنقاذ 3 أرواح أخرى!
              </p>
            `;
          }
          if (typeof triggerConfetti === 'function') {
            triggerConfetti();
          }
        } else {
          // In recovery progress
          const remainingDays = 56 - diffDays;
          if (lang === 'fr') {
            recoveryResultBox.innerHTML = `
              <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
                <span style="font-size: 1.5rem;">⏳</span>
                <strong style="color: #F59E0B; font-size: 1.05rem;">Processus de régénération en cours (${diffDays} jours écoulés)</strong>
                <span class="calc-result-badge waiting">Encore ${remainingDays} jours</span>
              </div>
              <p style="margin: 0; line-height: 1.6;">
                Votre organisme progresse remarquablement au <strong>Stade ${matchedStage + 1}</strong>. Votre prochaine date d'éligibilité médicale recommandée est le : <span class="calc-result-highlight">${nextDateFormatted}</span>. Continuez à bien vous hydrater !
              </p>
            `;
          } else {
            recoveryResultBox.innerHTML = `
              <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
                <span style="font-size: 1.5rem;">⏳</span>
                <strong style="color: #F59E0B; font-size: 1.05rem;">جسمك في مرحلة التجدد الحيوي (مرت ${diffDays} يوماً)</strong>
                <span class="calc-result-badge waiting">متبقي ${remainingDays} يوماً</span>
              </div>
              <p style="margin: 0; line-height: 1.6;">
                أنت الآن في <strong>المرحلة ${matchedStage + 1}</strong> من التعافي البيولوجي. موعد تبرعك القادم المسموح به طبياً هو: <span class="calc-result-highlight">${nextDateFormatted}</span>. واصل التغذية المتوازنة وشرب السوائل !
              </p>
            `;
          }
        }

        // Smooth scroll to the simulator dashboard to view the stage visually
        const simEl = document.getElementById('recovery-simulator');
        if (simEl) {
          const navHeight = 70;
          const targetPos = simEl.getBoundingClientRect().top + window.pageYOffset - navHeight - 10;
          window.scrollTo({ top: targetPos, behavior: 'smooth' });
        }
      }
    });
  }

  // Initialize Stage 0 by default on load
  selectRecoveryStage(0);

  // =========================================================================
  // Hero Image Slider State & Synchronization (Cloud & Local)
  // Populates #hero-slider dynamically ONLY when hero_gallery is provided
  // =========================================================================
  let heroSliderTimer = null;
  let cachedHeroGalleryItems = null;

  function syncHeroSlider(lang, items = null) {
    const heroSlider = document.getElementById('hero-slider');
    if (!heroSlider) return;

    if (items !== null && items !== undefined) {
      cachedHeroGalleryItems = items;
    }

    // Reset any running autoplay timer
    if (heroSliderTimer) {
      clearInterval(heroSliderTimer);
      heroSliderTimer = null;
    }

    const currentLang = lang || getCurrentLang();
    let rawItems = (items !== null && items !== undefined) ? items : cachedHeroGalleryItems;

    if (!rawItems) {
      try {
        const stored = localStorage.getItem('admin_general_gallery') || localStorage.getItem('admin_hero_slider_items');
        if (stored) {
          rawItems = JSON.parse(stored);
        }
      } catch (err) {
        console.warn('Error parsing admin_general_gallery:', err);
        rawItems = null;
      }
    }

    // Normalize rawItems to array
    let itemsArray = [];
    if (Array.isArray(rawItems)) {
      itemsArray = rawItems;
    } else if (rawItems && typeof rawItems === 'object') {
      itemsArray = [rawItems];
    }

    // Filter valid slides containing real image paths (strictly NO dummy or placeholder images)
    const validSlides = [];
    itemsArray.forEach(item => {
      if (!item) return;
      if (typeof item === 'string' && item.trim()) {
        validSlides.push({
          image: item.trim(),
          title: ''
        });
      } else if (typeof item === 'object') {
        const img = item.image || item.url || item.src || item.photo || item.img;
        if (img && typeof img === 'string' && img.trim()) {
          let title = '';
          if (currentLang === 'fr') {
            title = (item.titleFr !== undefined && item.titleFr !== null)
              ? item.titleFr
              : (item.captionFr || item.descFr || item.title || item.caption || '');
          } else {
            title = (item.titleAr !== undefined && item.titleAr !== null)
              ? item.titleAr
              : (item.captionAr || item.descAr || item.title || item.caption || '');
          }
          title = typeof title === 'string' ? title.trim() : '';
          validSlides.push({
            image: img.trim(),
            title: title
          });
        }
      }
    });

    // STRICT RULE: If no images are provided by the admin, leave #hero-slider empty
    // without dummy or placeholder images, without arrows or dots
    if (validSlides.length === 0) {
      heroSlider.innerHTML = '';
      heroSlider.classList.add('is-empty');
      return;
    }

    heroSlider.classList.remove('is-empty');
    heroSlider.innerHTML = '';

    // Build Track & Slides
    const track = document.createElement('div');
    track.className = 'hero-slider-track';

    validSlides.forEach((slide, index) => {
      const slideDiv = document.createElement('div');
      slideDiv.className = 'hero-slide' + (index === 0 ? ' active' : '');
      slideDiv.setAttribute('data-index', String(index));

      const imgEl = document.createElement('img');
      imgEl.src = sanitizeUrl(slide.image);
      imgEl.alt = slide.title || (currentLang === 'fr' ? 'Photo activité don de sang' : 'صورة من أنشطة التبرع بالدم');
      imgEl.loading = index === 0 ? 'eager' : 'lazy';
      imgEl.decoding = index === 0 ? 'sync' : 'async';
      if (index === 0) {
        imgEl.setAttribute('fetchpriority', 'high');
      }

      slideDiv.appendChild(imgEl);

      // Only if an image has a title provided by the admin, display it nicely over/beside the slide.
      // If the title field is left blank, render ONLY the image cleanly without allocating space
      // for a missing title or showing placeholder text.
      if (slide.title && slide.title.length > 0) {
        const captionDiv = document.createElement('div');
        captionDiv.className = 'hero-slide-caption';
        captionDiv.textContent = slide.title;
        slideDiv.appendChild(captionDiv);
      }

      track.appendChild(slideDiv);
    });

    heroSlider.appendChild(track);

    // Build Navigation Arrows (Next / Prev)
    const prevBtn = document.createElement('button');
    prevBtn.type = 'button';
    prevBtn.className = 'hero-slider-arrow hero-slider-prev';
    prevBtn.setAttribute('aria-label', currentLang === 'fr' ? 'Image précédente' : 'الصورة السابقة');
    prevBtn.innerHTML = '<svg viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"></polyline></svg>';

    const nextBtn = document.createElement('button');
    nextBtn.type = 'button';
    nextBtn.className = 'hero-slider-arrow hero-slider-next';
    nextBtn.setAttribute('aria-label', currentLang === 'fr' ? 'Image suivante' : 'الصورة التالية');
    nextBtn.innerHTML = '<svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"></polyline></svg>';

    heroSlider.appendChild(prevBtn);
    heroSlider.appendChild(nextBtn);

    // Build Navigation Dots
    const dotsWrap = document.createElement('div');
    dotsWrap.className = 'hero-slider-dots';

    validSlides.forEach((_, idx) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'hero-slider-dot' + (idx === 0 ? ' active' : '');
      dot.setAttribute('data-index', String(idx));
      dot.setAttribute('aria-label', (currentLang === 'fr' ? 'Diapositive ' : 'شريحة ') + (idx + 1));
      dotsWrap.appendChild(dot);
    });

    heroSlider.appendChild(dotsWrap);

    // Slider Interactive Controller
    let activeIdx = 0;
    const slides = track.querySelectorAll('.hero-slide');
    const dots = dotsWrap.querySelectorAll('.hero-slider-dot');
    const totalSlides = slides.length;

    function goToSlide(newIdx) {
      if (totalSlides <= 1) return;
      activeIdx = (newIdx + totalSlides) % totalSlides;
      slides.forEach((sl, i) => {
        sl.classList.toggle('active', i === activeIdx);
      });
      dots.forEach((dt, i) => {
        dt.classList.toggle('active', i === activeIdx);
      });
    }

    prevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      goToSlide(activeIdx - 1);
      restartAutoplay();
    });

    nextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      goToSlide(activeIdx + 1);
      restartAutoplay();
    });

    dots.forEach((dot) => {
      dot.addEventListener('click', (e) => {
        e.stopPropagation();
        const target = parseInt(dot.getAttribute('data-index'), 10);
        if (!isNaN(target)) {
          goToSlide(target);
          restartAutoplay();
        }
      });
    });

    function startAutoplay() {
      if (totalSlides > 1 && !heroSliderTimer) {
        heroSliderTimer = setInterval(() => {
          goToSlide(activeIdx + 1);
        }, 5000);
      }
    }

    function stopAutoplay() {
      if (heroSliderTimer) {
        clearInterval(heroSliderTimer);
        heroSliderTimer = null;
      }
    }

    function restartAutoplay() {
      stopAutoplay();
      startAutoplay();
    }

    heroSlider.addEventListener('mouseenter', stopAutoplay);
    heroSlider.addEventListener('mouseleave', startAutoplay);

    // Touch Swipe Support
    let startX = 0;
    let endX = 0;

    heroSlider.addEventListener('touchstart', (e) => {
      startX = e.changedTouches[0].screenX;
    }, { passive: true });

    heroSlider.addEventListener('touchend', (e) => {
      endX = e.changedTouches[0].screenX;
      const diff = endX - startX;
      if (Math.abs(diff) > 40) {
        if (diff > 0) {
          goToSlide(activeIdx - 1);
        } else {
          goToSlide(activeIdx + 1);
        }
        restartAutoplay();
      }
    }, { passive: true });

    startAutoplay();
  }

  function initHeroSliderCloudSync() {
    if (window.BloodDonorsFirebase && typeof window.BloodDonorsFirebase.subscribeToHeroGallery === 'function') {
      window.BloodDonorsFirebase.subscribeToHeroGallery((items) => {
        cachedHeroGalleryItems = items;
        syncHeroSlider(getCurrentLang(), items);
      });
    } else {
      window.addEventListener('bloodDonorsFirebaseReady', () => {
        if (window.BloodDonorsFirebase?.subscribeToHeroGallery) {
          window.BloodDonorsFirebase.subscribeToHeroGallery((items) => {
            cachedHeroGalleryItems = items;
            syncHeroSlider(getCurrentLang(), items);
          });
        }
      }, { once: true });

      syncHeroSlider(getCurrentLang());
    }
  }

  initHeroSliderCloudSync();
  syncAdminData();

  // Listen for storage events across tabs (e.g. changes in admin-core-x89-secure.html)
  window.addEventListener('storage', syncAdminData);

  // =========================================================================
  // Bilingual Event Listener: 'languageChanged'
  // Re-evaluates dynamic texts and updates UI elements
  // =========================================================================
  function handleLanguageChange() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    updateThemeToggleUI(isDark);

    if (cachedEmergencyAlert) {
      applyEmergencyAlert(cachedEmergencyAlert, getCurrentLang());
    }

    syncHeroSlider(getCurrentLang(), cachedHeroGalleryItems);

    // Re-sync admin custom alert & dynamic lists
    syncAdminData();

    // Re-render compatibility results if an active blood type was chosen
    if (selectedBloodType) {
      renderCompatibilityResults(selectedBloodType);
    }

    // Update recovery simulator stage texts in active language
    if (typeof selectRecoveryStage === 'function') {
      selectRecoveryStage(currentRecoveryStageIdx);
    }

    // Update countdown in-progress text if campaign passed
    const statusEl = document.getElementById('countdown-status') || document.querySelector('.countdown-status');
    if (statusEl && targetDate !== null && targetDate - new Date().getTime() <= 0) {
      statusEl.textContent = translate('campaign_in_progress');
    }

    // Update quiz result texts if currently showing result
    if (quizResult && quizResult.style.display !== 'none') {
      const allYes = quizAnswers.every(ans => ans === 'yes');
      const titleEl = quizResult.querySelector('.quiz-result-title') || quizResult.querySelector('h3') || quizResult.querySelector('h4');
      const descEl = quizResult.querySelector('.quiz-result-desc') || quizResult.querySelector('p');

      if (allYes) {
        if (titleEl) titleEl.textContent = translate('quiz_pass_title');
        if (descEl) descEl.textContent = translate('elig_result_pass') || translate('quiz_pass_desc');
      } else {
        if (titleEl) titleEl.textContent = translate('quiz_fail_title');
        if (descEl) descEl.textContent = translate('elig_result_fail') || translate('quiz_fail_desc');
      }
    }
  }

  document.addEventListener('languageChanged', handleLanguageChange);

});
