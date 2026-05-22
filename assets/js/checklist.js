// Generic checklist persistence: any <input type="checkbox" data-checklist-key="..."> is
// persisted to localStorage under that key. Also renders a progress bar to any
// [data-progress] element it finds.
(function () {
  function load(key) {
    try { return JSON.parse(localStorage.getItem(key) || 'false'); } catch (e) { return false; }
  }
  function save(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) {}
  }

  function updateProgress() {
    var host = document.querySelector('[data-progress]');
    if (!host) return;
    var boxes = document.querySelectorAll('input[type="checkbox"][data-checklist-key]');
    var total = boxes.length;
    var done = 0;
    boxes.forEach(function (cb) { if (cb.checked) done++; });
    var pct = total ? Math.round((done / total) * 100) : 0;
    var fill = host.querySelector('.progress__fill');
    var label = host.querySelector('.progress__label');
    if (fill) fill.style.width = pct + '%';
    if (label) label.textContent = done + ' of ' + total + ' done · ' + pct + '%';
    host.setAttribute('aria-valuenow', String(done));
    host.setAttribute('aria-valuemax', String(total));
  }

  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('input[type="checkbox"][data-checklist-key]').forEach(function (cb) {
      var key = 'checklist:' + cb.getAttribute('data-checklist-key');
      var v = load(key);
      cb.checked = !!v;
      var li = cb.closest('li');
      if (li) li.classList.toggle('is-done', !!v);
      cb.addEventListener('change', function () {
        save(key, cb.checked);
        if (li) li.classList.toggle('is-done', cb.checked);
        updateProgress();
      });
    });
    updateProgress();
  });
})();
