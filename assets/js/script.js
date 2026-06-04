/**
 * Rugare Mental Health Organisation — static site scripts
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    initHeroSlider();
    initStatCounters();
    initContactForm();
  });

  function initHeroSlider() {
    const slider = document.querySelector('[data-hero-slider]');
    if (!slider) return;

    const slides = Array.from(slider.querySelectorAll('[data-hero-slide]'));
    const dots = Array.from(slider.querySelectorAll('[data-hero-dot]'));
    const previousButton = slider.querySelector('[data-hero-prev]');
    const nextButton = slider.querySelector('[data-hero-next]');

    let currentIndex = slides.findIndex(function (slide) {
      return slide.classList.contains('is-active');
    });
    let autoplayId = null;

    if (currentIndex < 0) currentIndex = 0;

    function setActiveSlide(index) {
      const nextIndex = (index + slides.length) % slides.length;

      slides.forEach(function (slide, slideIndex) {
        const isActive = slideIndex === nextIndex;
        slide.classList.toggle('is-active', isActive);
        slide.setAttribute('aria-hidden', isActive ? 'false' : 'true');
      });

      dots.forEach(function (dot, dotIndex) {
        const isActive = dotIndex === nextIndex;
        dot.classList.toggle('is-active', isActive);
        dot.setAttribute('aria-pressed', isActive ? 'true' : 'false');
      });

      currentIndex = nextIndex;
    }

    function stopAutoplay() {
      if (autoplayId !== null) {
        window.clearInterval(autoplayId);
        autoplayId = null;
      }
    }

    function startAutoplay() {
      stopAutoplay();
      if (slides.length < 2) return;

      autoplayId = window.setInterval(function () {
        setActiveSlide(currentIndex + 1);
      }, 6000);
    }

    if (previousButton) {
      previousButton.addEventListener('click', function () {
        setActiveSlide(currentIndex - 1);
        startAutoplay();
      });
    }

    if (nextButton) {
      nextButton.addEventListener('click', function () {
        setActiveSlide(currentIndex + 1);
        startAutoplay();
      });
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        const nextIndex = Number(dot.getAttribute('data-hero-index'));
        if (!Number.isNaN(nextIndex)) {
          setActiveSlide(nextIndex);
          startAutoplay();
        }
      });
    });

    slider.addEventListener('mouseenter', stopAutoplay);
    slider.addEventListener('mouseleave', startAutoplay);
    slider.addEventListener('focusin', stopAutoplay);
    slider.addEventListener('focusout', startAutoplay);

    document.addEventListener('visibilitychange', function () {
      if (document.hidden) {
        stopAutoplay();
        return;
      }
      startAutoplay();
    });

    setActiveSlide(currentIndex);
    startAutoplay();
  }

  function initStatCounters() {
    const counters = document.querySelectorAll('[data-stat-counter]');
    if (!counters.length) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function animateCounter(el) {
      const target = Number(el.getAttribute('data-target')) || 0;
      const suffix = el.getAttribute('data-suffix') || '';
      const duration = 1400;
      const start = performance.now();

      function tick(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const value = Math.round(target * eased);
        el.textContent = String(value) + suffix;
        if (progress < 1) requestAnimationFrame(tick);
      }

      requestAnimationFrame(tick);
    }

    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      counters.forEach(function (el) {
        const target = Number(el.getAttribute('data-target')) || 0;
        const suffix = el.getAttribute('data-suffix') || '';
        el.textContent = String(target) + suffix;
      });
      return;
    }

    const observer = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          animateCounter(entry.target);
          obs.unobserve(entry.target);
        });
      },
      { threshold: 0.35 }
    );

    counters.forEach(function (el) {
      observer.observe(el);
    });
  }

  function initContactForm() {
    const form = document.querySelector('[data-contact-form]');
    if (!form) return;

    const statusEl = document.querySelector('[data-form-status]');
    const formspreeEndpoint = form.getAttribute('action');

    if (!formspreeEndpoint || formspreeEndpoint.includes('YOUR_FORM_ID')) {
      form.addEventListener('submit', function (event) {
        event.preventDefault();
        const first = form.querySelector('[name="first_name"]');
        const last = form.querySelector('[name="last_name"]');
        const subject = form.querySelector('[name="subject"]');
        const message = form.querySelector('[name="message"]');
        const name = [first?.value, last?.value].filter(Boolean).join(' ');
        const subj = subject?.value || 'Message from Rugare website';
        const body = (message?.value || '') + (name ? '\n\n— ' + name : '');
        window.location.href =
          'mailto:rugarementalhealthorg@gmail.com?subject=' +
          encodeURIComponent(subj) +
          '&body=' +
          encodeURIComponent(body);
        if (statusEl) {
          statusEl.textContent = 'Opening your email app…';
          statusEl.hidden = false;
        }
      });
      return;
    }

    form.addEventListener('submit', async function (event) {
      event.preventDefault();
      const submitBtn = form.querySelector('[type="submit"]');
      if (submitBtn) submitBtn.disabled = true;

      if (statusEl) {
        statusEl.textContent = 'Sending…';
        statusEl.hidden = false;
        statusEl.classList.remove('is-error', 'is-success');
      }

      try {
        const response = await fetch(formspreeEndpoint, {
          method: 'POST',
          body: new FormData(form),
          headers: { Accept: 'application/json' },
        });

        if (response.ok) {
          form.reset();
          if (statusEl) {
            statusEl.textContent = 'Thank you! Your message has been sent.';
            statusEl.classList.add('is-success');
          }
        } else {
          throw new Error('Request failed');
        }
      } catch {
        if (statusEl) {
          statusEl.textContent = 'Something went wrong. Please email us directly.';
          statusEl.classList.add('is-error');
        }
      } finally {
        if (submitBtn) submitBtn.disabled = false;
      }
    });
  }
})();
