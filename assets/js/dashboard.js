// Renders the homepage dashboard: countdowns from timeline.json, next-actions
// checklist (localStorage), and the priority school shortlist from schools.json.
(function () {
  var rel = window.RELATIVE_TO_ROOT || './';

  function loadJSON(path) {
    return fetch(rel + path).then(function (r) { return r.json(); });
  }

  function daysBetween(a, b) {
    var MS = 24 * 60 * 60 * 1000;
    var d1 = new Date(a.getFullYear(), a.getMonth(), a.getDate());
    var d2 = new Date(b.getFullYear(), b.getMonth(), b.getDate());
    return Math.round((d2 - d1) / MS);
  }

  function formatDate(iso) {
    var d = new Date(iso + 'T00:00:00');
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  }

  function renderCountdowns(timeline) {
    var host = document.querySelector('[data-countdowns]');
    if (!host) return;

    var ids = (host.getAttribute('data-countdowns') || '').split(',').map(function (s) { return s.trim(); });
    var today = new Date();
    var html = ids.map(function (id) {
      var m = timeline.milestones.find(function (x) { return x.id === id; });
      if (!m) return '';
      var diff = daysBetween(today, new Date(m.date + 'T00:00:00'));
      var past = diff < 0;
      var label = past
        ? Math.abs(diff) + ' days ago'
        : (diff === 0 ? 'today' : diff + ' days');
      return '' +
        '<div class="countdown ' + (past ? 'is-past' : '') + '">' +
          '<div class="countdown__days">' + label + '</div>' +
          '<div class="countdown__label">' + m.label + '</div>' +
          '<div class="countdown__date">' + formatDate(m.date) + '</div>' +
        '</div>';
    }).join('');
    host.innerHTML = html;
  }

  function renderNextActions(timeline) {
    var host = document.querySelector('[data-next-actions]');
    if (!host) return;
    var limit = parseInt(host.getAttribute('data-limit') || '0', 10) || timeline.next_actions.length;

    var stored = {};
    try { stored = JSON.parse(localStorage.getItem('next-actions') || '{}'); } catch (e) {}

    var items = timeline.next_actions.slice(0, limit).map(function (text, idx) {
      var key = 'next-' + idx;
      var checked = !!stored[key];
      return '' +
        '<li class="' + (checked ? 'is-done' : '') + '">' +
          '<input type="checkbox" id="' + key + '" data-action-key="' + key + '" ' + (checked ? 'checked' : '') + '/>' +
          '<label for="' + key + '">' + text + '</label>' +
        '</li>';
    }).join('');
    host.innerHTML = items;

    host.addEventListener('change', function (e) {
      if (e.target && e.target.matches('input[type="checkbox"][data-action-key]')) {
        var key = e.target.getAttribute('data-action-key');
        var state = {};
        try { state = JSON.parse(localStorage.getItem('next-actions') || '{}'); } catch (err) {}
        state[key] = e.target.checked;
        localStorage.setItem('next-actions', JSON.stringify(state));
        var li = e.target.closest('li');
        if (li) li.classList.toggle('is-done', e.target.checked);
      }
    });
  }

  function renderPriorityShortlist(schools) {
    var host = document.querySelector('[data-priority-shortlist]');
    if (!host) return;
    var priority = schools.filter(function (s) { return s.priority_pick; });
    host.innerHTML = priority.map(function (s) {
      var dots = '';
      for (var i = 1; i <= 5; i++) {
        dots += '<span class="dot ' + (i <= s.intl_aid_score ? 'on' : '') + '"></span>';
      }
      var href = s.detail_page ? rel + s.detail_page : s.homepage;
      var target = s.detail_page ? '' : ' target="_blank" rel="noopener"';
      return '' +
        '<a class="card school-card" href="' + href + '"' + target + ' style="text-decoration:none;color:inherit;">' +
          '<div class="school-card__row">' +
            '<h3>' + s.name + '</h3>' +
            '<div class="school-card__score" title="Intl aid friendliness ' + s.intl_aid_score + '/5">' + dots + '</div>' +
          '</div>' +
          '<div class="school-card__meta">' + s.city + ', ' + s.state + ' · ' + (s.faith_affiliation || (s.type === 'public' ? 'Public' : 'Private')) + '</div>' +
          '<p style="font-size:var(--fs-sm);margin:0;">' + s.city_vibe + '</p>' +
          '<div class="card__footer">' +
            '<span class="muted">~$' + Math.round(s.sticker_cost_usd / 1000) + 'k sticker · </span>' +
            '<span>Details →</span>' +
          '</div>' +
        '</a>';
    }).join('');
  }

  document.addEventListener('DOMContentLoaded', function () {
    Promise.all([
      loadJSON('assets/data/timeline.json'),
      loadJSON('assets/data/schools.json')
    ]).then(function (results) {
      var timeline = results[0];
      var schools = results[1];
      renderCountdowns(timeline);
      renderNextActions(timeline);
      renderPriorityShortlist(schools);
    });
  });
})();
