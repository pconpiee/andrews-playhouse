// Renders the schools grid with filter chips. Reads schools.json.
(function () {
  var rel = window.RELATIVE_TO_ROOT || './';
  var state = { tag: 'all', region: 'all' };
  var schoolsData = [];

  // Pick up ?tag=... and ?region=... from the URL so deep-links from the
  // homepage money-lane buttons land on a pre-filtered grid.
  (function readQueryParams() {
    try {
      var params = new URLSearchParams(window.location.search);
      var tag = params.get('tag');
      var region = params.get('region');
      if (tag) state.tag = tag;
      if (region) state.region = region;
    } catch (e) {}
  })();

  function loadJSON(path) {
    return fetch(rel + path).then(function (r) { return r.json(); });
  }

  function matches(s) {
    if (state.tag !== 'all' && !(s.tags || []).includes(state.tag)) return false;
    if (state.region !== 'all' && s.region !== state.region) return false;
    return true;
  }

  function renderGrid() {
    var grid = document.querySelector('[data-school-grid]');
    if (!grid) return;
    var list = schoolsData.filter(matches);
    var count = document.querySelector('[data-school-count]');
    if (count) count.textContent = list.length + (list.length === 1 ? ' school' : ' schools');

    if (!list.length) {
      grid.innerHTML = '<p class="muted">No schools match those filters. Try clearing one.</p>';
      return;
    }

    grid.innerHTML = list.map(function (s) {
      var dots = '';
      for (var i = 1; i <= 5; i++) {
        dots += '<span class="dot ' + (i <= s.intl_aid_score ? 'on' : '') + '"></span>';
      }
      var href = s.detail_page ? rel + s.detail_page : s.homepage;
      var target = s.detail_page ? '' : ' target="_blank" rel="noopener"';
      var tags = (s.tags || []).slice(0, 3).map(function (t) { return '<span class="tag">' + t + '</span>'; }).join(' ');
      return '' +
        '<a class="card school-card" href="' + href + '"' + target + ' style="text-decoration:none;color:inherit;">' +
          '<div class="school-card__row">' +
            '<h3>' + s.name + '</h3>' +
            '<div class="school-card__score" title="Intl aid friendliness ' + s.intl_aid_score + '/5">' + dots + '</div>' +
          '</div>' +
          '<div class="school-card__meta">' + s.city + ', ' + s.state + ' · ' + (s.faith_affiliation || (s.type === 'public' ? 'Public university' : (s.type === 'community-college' ? 'Community college' : 'Private university'))) + '</div>' +
          '<p style="font-size:var(--fs-sm);margin:0;"><strong>City:</strong> ' + s.city_vibe + '</p>' +
          '<p style="font-size:var(--fs-sm);margin:0;"><strong>Faith life:</strong> ' + s.church_life + '</p>' +
          '<div class="school-card__tags">' + tags + '</div>' +
          '<div class="card__footer">' +
            '<span class="muted">~$' + Math.round(s.sticker_cost_usd / 1000) + 'k/yr sticker · </span>' +
            '<span>' + (s.detail_page ? 'Read profile →' : 'School site ↗') + '</span>' +
          '</div>' +
        '</a>';
    }).join('');
  }

  function wireFilters() {
    // Reflect the current state (which may have come from URL query params) into the chips.
    ['tag', 'region'].forEach(function (group) {
      document.querySelectorAll('[data-filter-group="' + group + '"]').forEach(function (c) {
        c.classList.toggle('is-active', c.getAttribute('data-filter') === state[group]);
      });
    });
    document.querySelectorAll('[data-filter]').forEach(function (chip) {
      chip.addEventListener('click', function () {
        var group = chip.getAttribute('data-filter-group');
        var value = chip.getAttribute('data-filter');
        state[group] = value;
        document.querySelectorAll('[data-filter-group="' + group + '"]').forEach(function (c) {
          c.classList.toggle('is-active', c.getAttribute('data-filter') === value);
        });
        renderGrid();
      });
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    loadJSON('assets/data/schools.json').then(function (data) {
      schoolsData = data;
      wireFilters();
      renderGrid();
    });
  });
})();
