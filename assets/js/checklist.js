// Generic checklist persistence: any <input type="checkbox" data-checklist-key="..."> is
// persisted to localStorage under that key. Used on the application guide.
(function () {
  function load(key) {
    try { return JSON.parse(localStorage.getItem(key) || 'false'); } catch (e) { return false; }
  }
  function save(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) {}
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
      });
    });
  });
})();
