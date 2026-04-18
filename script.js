/* ==========================================================================
   Numiris AI — Script
   Header state, form handling, smooth scroll
   ========================================================================== */

(function () {
  'use strict';

  // ---------- Header scroll state ----------
  var header = document.querySelector('.header');

  function onScroll() {
    header.classList.toggle('scrolled', window.scrollY > 40);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ---------- Form handling (Google Forms) ----------
  document.querySelectorAll('form.contact-form').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      var action = form.getAttribute('action') || '';
      // Don't actually submit while the endpoint placeholders are still in place.
      if (action.indexOf('GOOGLE_FORM_ID') !== -1) {
        e.preventDefault();
        console.warn('Form not yet configured — replace GOOGLE_FORM_ID and entry IDs.');
        return;
      }

      e.preventDefault();
      var btn = form.querySelector('button[type="submit"]');
      var originalText = btn.innerHTML;
      btn.innerHTML = 'Sending\u2026';
      btn.disabled = true;

      // Google Forms doesn't return CORS headers, so we use no-cors. We can't
      // read the response, but the submission still reaches the form.
      fetch(action, {
        method: 'POST',
        mode: 'no-cors',
        body: new FormData(form),
      })
        .then(function () {
          showSuccess(form, btn, originalText);
        })
        .catch(function () {
          btn.innerHTML = 'Something went wrong \u2014 try again';
          btn.disabled = false;
          setTimeout(function () { btn.innerHTML = originalText; }, 3000);
        });
    });
  });

  function showSuccess(form, btn, originalText) {
    btn.innerHTML =
      'Thank you \u2014 we\u2019ll be in touch ' +
      '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8l4 4 6-7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    btn.style.background = '#0F766E';

    setTimeout(function () {
      form.reset();
      btn.innerHTML = originalText;
      btn.style.background = '';
      btn.disabled = false;
    }, 4000);
  }

  // ---------- Hero value-prop rotation ----------
  (function initHeroRotator() {
    var vp = document.querySelector('.hero__vp');
    var visual = document.querySelector('.hero__visual');
    if (!vp || !visual) return;

    var items = Array.prototype.slice.call(vp.querySelectorAll('.hero__vp-item'));
    var scenes = Array.prototype.slice.call(visual.querySelectorAll('.mock-scene'));
    if (items.length === 0 || scenes.length === 0) return;

    var DURATION = 5500;
    var current = 0;
    var timer = null;
    var paused = false;

    function activate(index) {
      current = (index + items.length) % items.length;
      items.forEach(function (btn, i) {
        btn.setAttribute('aria-selected', i === current ? 'true' : 'false');
      });
      scenes.forEach(function (scene, i) {
        scene.classList.toggle('mock-scene--active', i === current);
      });
    }

    function start() {
      stop();
      vp.setAttribute('data-running', 'true');
      timer = setInterval(function () {
        activate(current + 1);
      }, DURATION);
    }

    function stop() {
      vp.setAttribute('data-running', 'false');
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    }

    function restart() {
      // Force progress bar animation to restart by toggling data-running.
      stop();
      // next frame so the animation removal flushes before reapplying
      requestAnimationFrame(function () {
        if (!paused) start();
      });
    }

    items.forEach(function (btn, i) {
      btn.addEventListener('click', function () {
        activate(i);
        restart();
      });
      btn.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
          e.preventDefault();
          activate(current + 1);
          items[current].focus();
          restart();
        } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
          e.preventDefault();
          activate(current - 1);
          items[current].focus();
          restart();
        }
      });
    });

    function pause() {
      paused = true;
      stop();
    }
    function resume() {
      paused = false;
      start();
    }
    [vp, visual].forEach(function (el) {
      el.addEventListener('mouseenter', pause);
      el.addEventListener('mouseleave', resume);
      el.addEventListener('focusin', pause);
      el.addEventListener('focusout', resume);
    });

    vp.style.setProperty('--vp-duration', DURATION + 'ms');
    activate(0);
    start();
  })();

  // ---------- Smooth scroll for anchor links ----------
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
})();
