/**
 * Rugare Mental Health Organisation — static site scripts
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    initHeroSlider();
    initStatCounters();
    initContactForm();
    initTeamViewToggle();
    initTeamDirectory();
    initProgramsNav();
    initScrollReveal();
    initNavbarScroll();
    initMobileNav();
    initNavDropdown();
    initBackToTop();
  });

  function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function markReveal(el, variant, delayMs) {
    if (!el || el.hasAttribute('data-reveal')) return;
    el.setAttribute('data-reveal', variant || 'fade-up');
    if (delayMs) {
      el.style.setProperty('--reveal-delay', String(delayMs) + 'ms');
    }
  }

  function initScrollReveal() {
    const reducedMotion = prefersReducedMotion();

    const staggerGroups = [
      { parent: '.custom-grid-3', child: '.custom-impact-card', step: 55, variant: 'scale' },
      { parent: '.custom-values-grid', child: '.custom-value-card', step: 50 },
      { parent: '.custom-about-cards', child: '.custom-about-card', step: 55 },
      { parent: '.custom-team-grid', child: '.custom-team-card', step: 50, variant: 'scale' },
      { parent: '.custom-team-row__cards', child: '.custom-team-card', step: 50, variant: 'scale' },
      { parent: '.custom-stats-strip__grid', child: '.custom-stat', step: 45, variant: 'scale' },
      { parent: '.custom-program-block__gallery', child: '.custom-program-gallery__item', step: 40 },
      { parent: '.custom-episode-list', child: '.custom-episode', step: 50 },
      { parent: '.custom-programs-list', child: '.custom-program-block', step: 0 },
      { parent: '.custom-team-directory', child: '.custom-team-directory__item', step: 35 },
    ];

    document.querySelectorAll('.custom-about-grid').forEach(function (grid) {
      const text = grid.querySelector('.custom-story-text');
      const panel = grid.querySelector('.custom-story-panel');
      if (text) markReveal(text, 'fade-left');
      if (panel) markReveal(panel, 'fade-right');
    });

    document.querySelectorAll('.custom-contact-grid').forEach(function (grid) {
      grid.querySelectorAll('.custom-contact-card').forEach(function (card, index) {
        markReveal(card, index === 0 ? 'fade-left' : 'fade-right');
      });
    });

    document.querySelectorAll('.custom-media-feature').forEach(function (feature) {
      const card = feature.querySelector('.custom-media-card');
      if (card) markReveal(card, 'fade-left');
    });

    staggerGroups.forEach(function (group) {
      document.querySelectorAll(group.parent).forEach(function (parent) {
        const children = parent.querySelectorAll(group.child);
        children.forEach(function (child, index) {
          const delay = group.step * index;
          markReveal(child, group.variant || 'fade-up', delay);
        });
      });
    });

    const revealSelectors = [
      '.custom-page-banner__title',
      '.custom-page-banner__subtitle',
      '.custom-section__eyebrow',
      '.custom-section__title',
      '.custom-section__subtitle',
      '.custom-impact-card',
      '.custom-value-card',
      '.custom-about-card',
      '.custom-program-block',
      '.custom-media-card',
      '.custom-episode',
      '.custom-bottom-cta',
      '.custom-cta-section__panel',
      '.custom-contact-card',
      '.custom-stat',
      '.custom-program-gallery__item',
    ];

    revealSelectors.forEach(function (selector) {
      document.querySelectorAll(selector).forEach(function (el) {
        markReveal(el, 'fade-up');
      });
    });

    const revealElements = document.querySelectorAll('[data-reveal]');

    if (reducedMotion) {
      revealElements.forEach(function (el) {
        el.classList.add('is-visible');
      });
      return;
    }

    document.documentElement.classList.add('custom-reveal');

    if (!('IntersectionObserver' in window)) {
      revealElements.forEach(function (el) {
        el.classList.add('is-visible');
      });
      return;
    }

    const observer = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        });
      },
      { root: null, rootMargin: '0px 0px -6% 0px', threshold: 0.12 }
    );

    revealElements.forEach(function (el) {
      observer.observe(el);
    });
  }

  function initNavbarScroll() {
    const navbar = document.querySelector('.custom-navbar');
    if (!navbar) return;

    function updateNavbar() {
      navbar.classList.toggle('is-scrolled', window.scrollY > 16);
    }

    updateNavbar();
    window.addEventListener('scroll', updateNavbar, { passive: true });
  }

  function initMobileNav() {
    const navbar = document.querySelector('.custom-navbar');
    const toggle = document.querySelector('[data-nav-toggle]');
    const closeBtn = document.querySelector('[data-nav-close]');
    const backdrop = document.querySelector('[data-nav-backdrop]');
    const nav = document.getElementById('site-nav');
    if (!navbar || !toggle || !nav) return;

    const mobileQuery = window.matchMedia('(max-width: 820px)');
    let lastFocused = null;

    function isMobile() {
      return mobileQuery.matches;
    }

    function setOpen(open) {
      toggle.classList.toggle('is-active', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      document.body.classList.toggle('custom-nav-open', open);

      if (backdrop) {
        backdrop.hidden = !open;
        backdrop.setAttribute('aria-hidden', open ? 'false' : 'true');
      }

      if (open) {
        lastFocused = document.activeElement;
        closeBtn?.focus();
        return;
      }

      if (lastFocused && typeof lastFocused.focus === 'function') {
        lastFocused.focus();
      }
    }

    function openNav() {
      if (!isMobile()) return;
      setOpen(true);
    }

    function closeNav() {
      setOpen(false);
    }

    toggle.addEventListener('click', function () {
      if (document.body.classList.contains('custom-nav-open')) {
        closeNav();
      } else {
        openNav();
      }
    });

    closeBtn?.addEventListener('click', closeNav);
    backdrop?.addEventListener('click', closeNav);

    nav.querySelectorAll('.custom-navbar__link:not(.custom-navbar__dropdown-trigger)').forEach(function (link) {
      link.addEventListener('click', closeNav);
    });

    nav.querySelectorAll('.custom-navbar__dropdown-link').forEach(function (link) {
      link.addEventListener('click', closeNav);
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && document.body.classList.contains('custom-nav-open')) {
        closeNav();
      }
    });

    mobileQuery.addEventListener('change', function () {
      if (!isMobile()) {
        closeNav();
      }
    });
  }

  function initNavDropdown() {
    const dropdowns = document.querySelectorAll('[data-nav-dropdown]');
    if (!dropdowns.length) return;

    const mobileQuery = window.matchMedia('(max-width: 820px)');

    function isMobile() {
      return mobileQuery.matches;
    }

    function closeAll(except) {
      dropdowns.forEach(function (dropdown) {
        if (dropdown === except) return;
        dropdown.classList.remove('is-open');
        const trigger = dropdown.querySelector('[data-nav-dropdown-trigger]');
        if (trigger) {
          trigger.setAttribute('aria-expanded', 'false');
        }
      });
    }

    dropdowns.forEach(function (dropdown) {
      const trigger = dropdown.querySelector('[data-nav-dropdown-trigger]');
      if (!trigger) return;

      trigger.addEventListener('click', function (event) {
        event.preventDefault();
        event.stopPropagation();

        if (!isMobile()) return;

        const isOpen = dropdown.classList.contains('is-open');
        closeAll(isOpen ? null : dropdown);
        dropdown.classList.toggle('is-open', !isOpen);
        trigger.setAttribute('aria-expanded', isOpen ? 'false' : 'true');
      });
    });

    document.addEventListener('click', function () {
      if (!isMobile()) return;
      closeAll();
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') {
        closeAll();
      }
    });

    mobileQuery.addEventListener('change', function () {
      closeAll();
    });
  }

  function initBackToTop() {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'custom-back-to-top';
    button.setAttribute('aria-label', 'Back to top');
    button.innerHTML = '<span aria-hidden="true">↑</span>';

    document.body.appendChild(button);

    function updateButton() {
      button.classList.toggle('is-visible', window.scrollY > 480);
    }

    button.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
    });

    updateButton();
    window.addEventListener('scroll', updateButton, { passive: true });
  }

  function initHeroSlider() {
    const slider = document.querySelector('[data-hero-slider]');
    if (!slider) return;

    const backgrounds = Array.from(slider.querySelectorAll('[data-hero-bg]'));
    const dots = Array.from(slider.querySelectorAll('[data-hero-dot]'));
    const previousButton = slider.querySelector('[data-hero-prev]');
    const nextButton = slider.querySelector('[data-hero-next]');
    const introContent = slider.querySelector('.custom-hero__content--intro');

    let currentIndex = backgrounds.findIndex(function (bg) {
      return bg.classList.contains('is-active');
    });
    let autoplayId = null;
    let introHasPlayed = false;

    if (currentIndex < 0) currentIndex = 0;

    function setActiveBackground(index) {
      const nextIndex = (index + backgrounds.length) % backgrounds.length;

      backgrounds.forEach(function (bg, bgIndex) {
        bg.classList.toggle('is-active', bgIndex === nextIndex);
      });

      dots.forEach(function (dot, dotIndex) {
        const isActive = dotIndex === nextIndex;
        dot.classList.toggle('is-active', isActive);
        dot.setAttribute('aria-pressed', isActive ? 'true' : 'false');
      });

      currentIndex = nextIndex;
    }

    let heroAnimateTimer = null;
    let heroTypewriterTimer = null;

    function clearHeroTypewriter() {
      if (heroTypewriterTimer !== null) {
        window.cancelAnimationFrame(heroTypewriterTimer);
        heroTypewriterTimer = null;
      }
    }

    function prepareIntroTitle(title) {
      if (!title || title.dataset.heroTypewriterReady) return;

      const typedText = title.dataset.heroTypewriterText || '';
      title.setAttribute('aria-label', 'Changing the ' + typedText);
      title.dataset.heroTypewriterReady = 'true';
    }

    function resetIntroContent(content) {
      clearHeroTypewriter();
      content.classList.remove('is-animating', 'is-reveal-after', 'is-typing');

      const title = content.querySelector('[data-hero-typewriter]');
      if (title) {
        const textSpan = title.querySelector('.custom-hero__title-text');
        const cursor = title.querySelector('.custom-hero__title-cursor');
        if (textSpan) textSpan.textContent = '';
        if (cursor) cursor.classList.remove('is-hidden');
      }
    }

    function runIntroTypewriter(content, onComplete) {
      const title = content.querySelector('[data-hero-typewriter]');
      if (!title) {
        onComplete();
        return;
      }

      const typedText = title.dataset.heroTypewriterText || '';
      const textSpan = title.querySelector('.custom-hero__title-text');
      const cursor = title.querySelector('.custom-hero__title-cursor');
      if (!textSpan) {
        onComplete();
        return;
      }

      let index = 0;
      const charDelay = 52;
      let lastTime = 0;

      clearHeroTypewriter();
      textSpan.textContent = '';
      if (cursor) cursor.classList.remove('is-hidden');

      function typeNextFrame(now) {
        if (!content.classList.contains('is-typing')) {
          return;
        }

        if (!lastTime) lastTime = now;
        const elapsed = now - lastTime;

        if (elapsed >= charDelay) {
          lastTime = now;
          index += 1;
          textSpan.textContent = typedText.slice(0, index);

          if (index >= typedText.length) {
            clearHeroTypewriter();
            window.setTimeout(function () {
              if (!content.classList.contains('is-typing')) return;
              if (cursor) cursor.classList.add('is-hidden');
              window.setTimeout(onComplete, 320);
            }, 240);
            return;
          }
        }

        heroTypewriterTimer = window.requestAnimationFrame(typeNextFrame);
      }

      heroTypewriterTimer = window.requestAnimationFrame(typeNextFrame);
    }

    function playIntroAnimation() {
      if (!introContent || introHasPlayed) return;
      introHasPlayed = true;

      const title = introContent.querySelector('[data-hero-typewriter]');
      prepareIntroTitle(title);
      resetIntroContent(introContent);

      if (prefersReducedMotion()) {
        introContent.classList.add('is-animating', 'is-reveal-after');
        const textSpan = title && title.querySelector('.custom-hero__title-text');
        if (textSpan) textSpan.textContent = title.dataset.heroTypewriterText || '';
        if (title) {
          const cursor = title.querySelector('.custom-hero__title-cursor');
          if (cursor) cursor.classList.add('is-hidden');
        }
        return;
      }

      if (heroAnimateTimer !== null) {
        window.clearTimeout(heroAnimateTimer);
      }

      heroAnimateTimer = window.setTimeout(function () {
        heroAnimateTimer = null;
        introContent.classList.add('is-animating', 'is-typing');

        runIntroTypewriter(introContent, function () {
          introContent.classList.remove('is-typing');
          introContent.classList.add('is-reveal-after');
        });
      }, 120);
    }

    function stopAutoplay() {
      if (autoplayId !== null) {
        window.clearInterval(autoplayId);
        autoplayId = null;
      }
    }

    function startAutoplay() {
      stopAutoplay();
      if (backgrounds.length < 2) return;

      autoplayId = window.setInterval(function () {
        setActiveBackground(currentIndex + 1);
      }, 7500);
    }

    if (previousButton) {
      previousButton.addEventListener('click', function () {
        setActiveBackground(currentIndex - 1);
        startAutoplay();
      });
    }

    if (nextButton) {
      nextButton.addEventListener('click', function () {
        setActiveBackground(currentIndex + 1);
        startAutoplay();
      });
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        const nextIndex = Number(dot.getAttribute('data-hero-index'));
        if (!Number.isNaN(nextIndex)) {
          setActiveBackground(nextIndex);
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

    setActiveBackground(currentIndex);
    playIntroAnimation();
    startAutoplay();
  }

  function initStatCounters() {
    const counters = document.querySelectorAll('[data-stat-counter]');
    if (!counters.length) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function animateCounter(el) {
      const target = Number(el.getAttribute('data-target')) || 0;
      const suffix = el.getAttribute('data-suffix') || '';
      const duration = 900;
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

  function initTeamViewToggle() {
    const toolbar = document.querySelector('[data-team-toolbar]');
    if (!toolbar) return;

    const buttons = Array.from(toolbar.querySelectorAll('[data-team-view]'));
    const panels = Array.from(document.querySelectorAll('[data-team-panel]'));
    const indicator = toolbar.querySelector('.custom-view-toggle__indicator');
    const searchInput = document.querySelector('[data-team-search]');
    const filterButtons = Array.from(document.querySelectorAll('[data-team-filter]'));

    if (!buttons.length || !panels.length) return;

    function getActiveButton() {
      return buttons.find(function (btn) {
        return btn.classList.contains('is-active');
      }) || buttons[0];
    }

    function updateIndicator() {
      if (!indicator) return;
      const activeButton = getActiveButton();
      indicator.style.width = activeButton.offsetWidth + 'px';
      indicator.style.transform = 'translateX(' + (activeButton.offsetLeft - 4) + 'px)';
    }

    function setView(view) {
      buttons.forEach(function (btn) {
        const isActive = btn.getAttribute('data-team-view') === view;
        btn.classList.toggle('is-active', isActive);
        btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
      });

      panels.forEach(function (panel) {
        const isActive = panel.getAttribute('data-team-panel') === view;
        panel.hidden = !isActive;
      });

      if (view === 'card') {
        if (searchInput) searchInput.value = '';
        filterButtons.forEach(function (btn) {
          const isAll = btn.getAttribute('data-team-filter') === 'all';
          btn.classList.toggle('is-active', isAll);
          btn.setAttribute('aria-pressed', isAll ? 'true' : 'false');
        });
        document.dispatchEvent(new CustomEvent('team-search-reset'));
      }

      updateIndicator();
    }

    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        setView(btn.getAttribute('data-team-view'));
      });
    });

    window.addEventListener('resize', updateIndicator);
    updateIndicator();
  }

  function initTeamDirectory() {
    const directory = document.querySelector('[data-team-directory]');
    const searchInput = document.querySelector('[data-team-search]');
    const emptyState = document.querySelector('[data-team-directory-empty]');
    const filterButtons = Array.from(document.querySelectorAll('[data-team-filter]'));
    let activeTeamFilter = 'all';

    if (!directory) return;

    const members = Array.from(document.querySelectorAll('[data-team-member]')).map(function (card) {
      return {
        name: card.getAttribute('data-name') || '',
        role: card.getAttribute('data-role') || '',
        team: card.getAttribute('data-team') || '',
        bio: card.getAttribute('data-bio') || '',
        image: card.getAttribute('data-image') || '',
      };
    });

    const roleOrder = [
      'Leadership',
      'Chairperson',
      'Vice Chairperson',
      'Secretary',
      'Treasurer',
      'Board Member',
    ];

    members.sort(function (a, b) {
      const aIdx = roleOrder.indexOf(a.team);
      const bIdx = roleOrder.indexOf(b.team);

      if (aIdx !== -1 || bIdx !== -1) {
        if (aIdx === -1) return 1;
        if (bIdx === -1) return -1;
        if (aIdx !== bIdx) return aIdx - bIdx;
      }

      return a.name.localeCompare(b.name);
    });

    function renderList(filterText, teamFilter) {
      const query = (filterText || '').trim().toLowerCase();
      const team = teamFilter || activeTeamFilter;
      directory.innerHTML = '';

      const filtered = members.filter(function (member) {
        if (team !== 'all' && member.team !== team) return false;
        if (!query) return true;
        const haystack = [member.name, member.role, member.team, member.bio]
          .join(' ')
          .toLowerCase();
        return haystack.includes(query);
      });

      filtered.forEach(function (member) {
        const item = document.createElement('li');
        item.className = 'custom-team-directory__item';

        const isLeadership = member.team === 'Leadership';
        const badgeClass = isLeadership
          ? 'custom-team-directory__badge custom-team-directory__badge--leadership'
          : 'custom-team-directory__badge';

        item.innerHTML =
          '<div class="custom-team-directory__avatar">' +
            '<img src="' + member.image + '" alt="" loading="lazy">' +
          '</div>' +
          '<div class="custom-team-directory__info">' +
            '<p class="custom-team-directory__name">' + member.name + '</p>' +
            '<p class="custom-team-directory__role">' + member.role + '</p>' +
            (member.bio ? '<p class="custom-team-directory__bio">' + member.bio + '</p>' : '') +
          '</div>' +
          '<span class="' + badgeClass + '">' + member.team + '</span>';

        directory.appendChild(item);
      });

      if (emptyState) {
        emptyState.hidden = filtered.length > 0;
      }
    }

    renderList('', 'all');

    if (searchInput) {
      searchInput.addEventListener('input', function () {
        renderList(searchInput.value, activeTeamFilter);
      });
    }

    filterButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        activeTeamFilter = btn.getAttribute('data-team-filter') || 'all';
        filterButtons.forEach(function (filterBtn) {
          const isActive = filterBtn === btn;
          filterBtn.classList.toggle('is-active', isActive);
          filterBtn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
        });
        renderList(searchInput ? searchInput.value : '', activeTeamFilter);
      });
    });

    document.addEventListener('team-search-reset', function () {
      activeTeamFilter = 'all';
      renderList('', 'all');
    });
  }

  function initProgramsNav() {
    const nav = document.querySelector('.custom-programs-nav');
    if (!nav) return;

    const links = Array.from(nav.querySelectorAll('.custom-programs-nav__link'));
    const sections = links
      .map(function (link) {
        const href = link.getAttribute('href');
        if (!href || href.charAt(0) !== '#') return null;
        return document.getElementById(href.slice(1));
      })
      .filter(Boolean);

    if (!sections.length) return;

    function updateActive() {
      const offset = 140;
      let current = sections[0];

      sections.forEach(function (section) {
        if (section.getBoundingClientRect().top <= offset) {
          current = section;
        }
      });

      links.forEach(function (link) {
        const isActive = link.getAttribute('href') === '#' + current.id;
        link.classList.toggle('is-active', isActive);
      });
    }

    window.addEventListener('scroll', updateActive, { passive: true });
    updateActive();
  }
})();
