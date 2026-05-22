// Renders the scholarships list with filter chips. Reads scholarships.json.
(function () {
  var rel = window.RELATIVE_TO_ROOT || './';
  var state = { tag: 'all' };
  var data = [];

  function loadJSON(path) {
    return fetch(rel + path).then(function (r) { return r.json(); });
  }

  function matches(s) {
    if (state.tag === 'all') return true;
    if (state.tag === 'intl') return s.open_to_international === 'yes';
    if (state.tag === 'christian') return !!s.christian;
    if (state.tag === 'africa') return !!s.africa_specific;
    if (state.tag === 'nursing') return !!s.nursing_specific;
    if (state.tag === 'loan') return (s.tags || []).includes('loan');
    if (state.tag === 'need-blind') return (s.tags || []).includes('need-blind');
    return (s.tags || []).includes(state.tag);
  }

  function fmtAmount(s) {
    if (!s.amount_usd_max && !s.amount_usd_min) return 'Varies / not stated';
    if (s.amount_usd_min === s.amount_usd_max) return '$' + s.amount_usd_min.toLocaleString();
    if (!s.amount_usd_min) return 'Up to $' + s.amount_usd_max.toLocaleString();
    return '$' + s.amount_usd_min.toLocaleString() + '–$' + s.amount_usd_max.toLocaleString();
  }

  function fmtIntl(s) {
    if (s.open_to_international === 'yes') return '<span class="tag tag-accent">Open to international</span>';
    if (s.open_to_international === 'indirect') return '<span class="tag tag-gold">Indirect / via partner school</span>';
    return '<span class="tag tag-warn">US residents only</span>';
  }

  function render() {
    var host = document.querySelector('[data-scholarship-list]');
    if (!host) return;
    var list = data.filter(matches);
    var count = document.querySelector('[data-scholarship-count]');
    if (count) count.textContent = list.length + (list.length === 1 ? ' scholarship' : ' scholarships');
    host.setAttribute('aria-busy', 'false');
    if (!list.length) { host.innerHTML = '<p class="muted">No matches. Clear a filter.</p>'; return; }

    host.innerHTML = list.map(function (s) {
      var tags = (s.tags || []).slice(0, 4).map(function (t) { return '<span class="tag">' + t + '</span>'; }).join(' ');
      return '' +
        '<article class="scholarship">' +
          '<div class="scholarship__head">' +
            '<div>' +
              '<div class="scholarship__name">' + s.name + '</div>' +
              '<div class="muted" style="font-size:var(--fs-sm);">' + s.sponsor + '</div>' +
            '</div>' +
            '<div style="text-align:right;">' +
              '<div class="scholarship__amount">' + fmtAmount(s) + (s.renewable ? ' / yr' : '') + '</div>' +
              '<div class="muted" style="font-size:var(--fs-xs);">Deadline: ' + s.deadline + '</div>' +
            '</div>' +
          '</div>' +
          '<p class="scholarship__elig"><strong>Eligibility:</strong> ' + (s.eligibility || []).join(' · ') + '</p>' +
          (s.intl_notes ? '<p class="scholarship__elig"><strong>Notes:</strong> ' + s.intl_notes + '</p>' : '') +
          '<div class="scholarship__meta">' +
            fmtIntl(s) +
            tags +
            ' <a class="src" href="' + (s.source || s.url) + '" target="_blank" rel="noopener">source</a>' +
            ' <a class="src" href="' + s.url + '" target="_blank" rel="noopener">apply</a>' +
          '</div>' +
        '</article>';
    }).join('');
  }

  function syncChip(c, value) {
    var active = c.getAttribute('data-filter') === value;
    c.classList.toggle('is-active', active);
    c.setAttribute('aria-pressed', active ? 'true' : 'false');
  }

  function wireFilters() {
    document.querySelectorAll('[data-filter-group="tag"]').forEach(function (c) {
      syncChip(c, state.tag);
    });
    document.querySelectorAll('[data-filter]').forEach(function (chip) {
      chip.addEventListener('click', function () {
        var group = chip.getAttribute('data-filter-group');
        var value = chip.getAttribute('data-filter');
        state[group] = value;
        document.querySelectorAll('[data-filter-group="' + group + '"]').forEach(function (c) {
          syncChip(c, value);
        });
        render();
      });
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    loadJSON('assets/data/scholarships.json').then(function (d) {
      data = d;
      wireFilters();
      render();
    });
  });
})();
