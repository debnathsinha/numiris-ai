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

  // ---------- Form handling ----------
  document.querySelectorAll('.form').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      var btn = form.querySelector('.form__submit');
      var originalText = btn.innerHTML;

      if (!window.location.hostname.includes('netlify')) {
        e.preventDefault();

        var data = new FormData(form);

        fetch('/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams(data).toString(),
        })
          .then(function () {
            showSuccess(form, btn, originalText);
          })
          .catch(function () {
            console.log('Form data:', Object.fromEntries(data));
            showSuccess(form, btn, originalText);
          });

        btn.innerHTML = 'Sending\u2026';
        btn.disabled = true;
      }
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
