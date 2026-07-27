/* =========================================================
   TheKnowledgeForest – Main Script
   ========================================================= */

(function () {
  'use strict';

  /* ----- Constants --------------------------------------- */
  /** Pixel offset subtracted from section top to account for the sticky header. */
  var HEADER_OFFSET = 80;

  /** Initial Y offset for scroll-reveal animation (in px). */
  var REVEAL_OFFSET = '24px';

  /**
   * RFC 5322-compatible email validation pattern.
   * Allows dots, hyphens, plus signs, and multi-part TLDs while rejecting
   * addresses that would obviously fail delivery.
   */
  var EMAIL_VALIDATION_PATTERN = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/;

  /* ----- Dynamic year in footer ------------------------- */
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  /* ----- Mobile navigation toggle ----------------------- */
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks  = document.querySelector('.nav-links');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      const isOpen = navLinks.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close nav when a link is clicked (mobile)
    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });

    // Close nav on Escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && navLinks.classList.contains('open')) {
        navLinks.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
        navToggle.focus();
      }
    });
  }

  /* ----- Active nav link on scroll ---------------------- */
  const sections  = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

  function updateActiveLink() {
    let currentId = '';
    sections.forEach(function (section) {
      const top = section.getBoundingClientRect().top;
      if (top <= HEADER_OFFSET) {
        currentId = section.id;
      }
    });

    navAnchors.forEach(function (a) {
      a.classList.toggle('active', a.getAttribute('href') === '#' + currentId);
    });
  }

  if (sections.length && navAnchors.length) {
    window.addEventListener('scroll', updateActiveLink, { passive: true });
    updateActiveLink();
  }

  /* ----- Scroll-reveal animation ------------------------ */
  const revealEls = document.querySelectorAll(
    '.feature-card, .topic-card, .value-card'
  );

  if ('IntersectionObserver' in window && revealEls.length) {
    // Initial state – hide elements before they enter the viewport
    revealEls.forEach(function (el) {
      el.style.opacity = '0';
      el.style.transform = 'translateY(' + REVEAL_OFFSET + ')';
      el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    revealEls.forEach(function (el) { observer.observe(el); });
  }

  /* ----- Sign-up form ----------------------------------- */
  const form    = document.querySelector('.signup-form');
  const emailEl = form ? form.querySelector('input[type="email"]') : null;

  if (form && emailEl) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      const email = emailEl.value.trim();
      if (!email || !EMAIL_VALIDATION_PATTERN.test(email)) {
        showFormMessage(form, 'Please enter a valid email address.', 'error');
        emailEl.focus();
        return;
      }

      // Replace with real API call when backend is ready
      showFormMessage(
        form,
        '🎉 You\'re on the list! We\'ll be in touch soon.',
        'success'
      );
      emailEl.value = '';
    });
  }

  function showFormMessage(form, message, type) {
    let msgEl = form.querySelector('.form-message');
    if (!msgEl) {
      msgEl = document.createElement('p');
      msgEl.className = 'form-message';
      msgEl.style.cssText =
        'margin-top:.75rem;font-size:.9rem;font-weight:500;';
      form.insertAdjacentElement('afterend', msgEl);
    }
    msgEl.textContent = message;
    msgEl.style.color = type === 'success' ? '#15803d' : '#dc2626';
  }

  /* ----- Smooth hash links (for older browsers) --------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

}());
