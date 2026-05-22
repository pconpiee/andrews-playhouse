// Renders the AI prompt cards from prompts.json and wires copy-to-clipboard buttons.
(function () {
  var rel = window.RELATIVE_TO_ROOT || './';

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  function render(prompts) {
    var host = document.querySelector('[data-prompt-list]');
    if (!host) return;
    host.setAttribute('aria-busy', 'false');
    host.innerHTML = prompts.map(function (p, idx) {
      return '' +
        '<article class="prompt" id="prompt-' + p.id + '">' +
          '<div class="prompt__head">' +
            '<div>' +
              '<h3 style="margin:0;">' + p.title + '</h3>' +
              '<p class="muted" style="font-size:var(--fs-sm);margin:var(--sp-1) 0 0;">' + p.when_to_use + '</p>' +
            '</div>' +
            '<div><button class="btn btn-secondary btn-sm" data-copy-prompt="' + idx + '" aria-label="Copy prompt: ' + escapeHtml(p.title) + '">Copy</button> <span class="copy-ok" data-copy-ok="' + idx + '" role="status" aria-live="polite" hidden>Copied</span></div>' +
          '</div>' +
          '<pre data-prompt-body="' + idx + '">' + escapeHtml(p.prompt) + '</pre>' +
        '</article>';
    }).join('');

    host.addEventListener('click', function (e) {
      var btn = e.target.closest('button[data-copy-prompt]');
      if (!btn) return;
      var idx = btn.getAttribute('data-copy-prompt');
      var body = host.querySelector('[data-prompt-body="' + idx + '"]');
      if (!body) return;
      var text = body.textContent;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(showOk(idx));
      } else {
        var ta = document.createElement('textarea');
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand('copy'); } catch (err) {}
        document.body.removeChild(ta);
        showOk(idx)();
      }
    });

    function showOk(idx) {
      return function () {
        var ok = host.querySelector('[data-copy-ok="' + idx + '"]');
        if (!ok) return;
        ok.hidden = false;
        setTimeout(function () { ok.hidden = true; }, 1800);
      };
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    fetch(rel + 'assets/data/prompts.json').then(function (r) { return r.json(); }).then(render);
  });
})();
