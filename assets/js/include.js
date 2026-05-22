// Loads header + footer partials into every page and rewrites any
// [data-base-href] anchor so links work whether the page is at the
// site root or nested under /schools/.
(function () {
  function rewriteLinks(root) {
    var rel = window.RELATIVE_TO_ROOT || './';
    root.querySelectorAll('[data-base-href]').forEach(function (el) {
      var href = el.getAttribute('data-base-href') || '';
      // data-base-href starts with "/" by convention; strip and prepend rel
      el.setAttribute('href', rel + href.replace(/^\//, ''));
    });
  }

  function highlightActiveNav(root) {
    var current = (document.body.getAttribute('data-page') || '').toLowerCase();
    if (!current) return;
    var link = root.querySelector('[data-nav="' + current + '"]');
    if (link) link.classList.add('is-active');
  }

  function wireHamburger(root) {
    var btn = root.querySelector('.site-header__toggle');
    var nav = root.querySelector('#primary-nav');
    if (!btn || !nav) return;
    btn.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    // Close when a nav link is tapped (mobile)
    nav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        nav.classList.remove('is-open');
        btn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  function loadInto(el, name) {
    var url = (window.RELATIVE_TO_ROOT || './') + 'assets/partials/' + name + '.html';
    return fetch(url)
      .then(function (r) { return r.ok ? r.text() : ''; })
      .then(function (html) {
        el.innerHTML = html;
        rewriteLinks(el);
        if (name === 'header') {
          highlightActiveNav(el);
          wireHamburger(el);
        }
      })
      .catch(function () { /* silent — site still renders without nav */ });
  }

  document.addEventListener('DOMContentLoaded', function () {
    var jobs = [];
    document.querySelectorAll('[data-include]').forEach(function (el) {
      jobs.push(loadInto(el, el.getAttribute('data-include')));
    });
    Promise.all(jobs).then(function () {
      document.dispatchEvent(new CustomEvent('partials:loaded'));
    });
    // Also rewrite any in-page data-base-href links (not just inside partials)
    rewriteLinks(document);
  });
})();
