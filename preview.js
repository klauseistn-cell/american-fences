// Предпросмотр несохранённых правок из админки: ?afpreview=<ключ>
(function () {
  var key = document.currentScript.dataset.key, AF = window.AF || {};
  var esc = function (s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); };
  function marked(el, s) {
    var alt = (el.getAttribute('data-a') || '').split(' ');
    var html = esc(s).replace(/\[\[([\s\S]*?)\]\]/g, function (_, t) { return alt[0] ? '<span class="' + alt[0] + '">' + t + '</span>' : t; })
      .replace(/\{\{([\s\S]*?)\}\}/g, function (_, t) { return alt[1] ? '<span class="' + alt[1] + '">' + t + '</span>' : t; }).replace(/\n/g, '<br>');
    el.innerHTML = html;
  }
  fetch(AF.api + 'preview/' + key).then(function (r) { return r.json(); }).then(function (d) {
    var v = d.vals || {}, n = 0;
    Object.keys(v).forEach(function (k) {
      var val = v[k];
      if (val && val.img) document.querySelectorAll('[data-ik="' + k + '"]').forEach(function (p) { p.querySelectorAll('source').forEach(function (s) { s.remove(); }); var i = p.querySelector('img'); i.removeAttribute('srcset'); i.src = val.img; n++; });
      else document.querySelectorAll('[data-k="' + k + '"]').forEach(function (el) { marked(el, val); n++; });
    });
    var b = document.createElement('div');
    b.textContent = 'Предпросмотр: изменений на странице — ' + n + '. Чтобы они появились на сайте, нажмите «Обновить» в админке.';
    b.style.cssText = 'position:fixed;left:50%;top:12px;transform:translateX(-50%);z-index:200;background:#2e5e4e;color:#fff;font:600 14px/1.4 Inter,system-ui,sans-serif;padding:10px 16px;border-radius:6px;box-shadow:0 6px 24px #0004;max-width:92vw;text-align:center';
    document.body.appendChild(b);
  }).catch(function () { alert('Предпросмотр устарел — откройте его заново из админки.'); });
})();
