// Sets window.BASE_PATH so we can resolve assets/partials regardless of where the
// site is mounted (root locally, /andrews-playhouse on GitHub Pages, or anywhere else).
// Strategy: derive the prefix from the current path by stripping the trailing
// /index.html (or any other .html) and any /schools/foo.html nesting.
(function () {
  var path = window.location.pathname;
  // strip trailing filename if present
  var prefix = path.replace(/\/[^\/]*\.html?$/i, '');
  // if we are inside /schools/foo.html, prefix is currently /schools — pop one level
  if (/\/schools$/.test(prefix)) {
    prefix = prefix.replace(/\/schools$/, '');
  }
  // strip a trailing slash
  prefix = prefix.replace(/\/$/, '');
  window.BASE_PATH = prefix; // e.g. "" locally at root, "/andrews-playhouse" on GH Pages

  // Depth: how many "../" we need to climb to reach BASE_PATH.
  // 0 for pages at the root, 1 for pages under /schools/.
  var rel = path.slice(prefix.length + 1); // drop the prefix and the slash
  var slashes = (rel.match(/\//g) || []).length;
  window.RELATIVE_TO_ROOT = slashes === 0 ? './' : '../'.repeat(slashes);
})();
