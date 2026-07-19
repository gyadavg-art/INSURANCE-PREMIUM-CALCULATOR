(function () {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('./sw.js')
        .then(function(r){ console.log('SW registered:', r.scope); })
        .catch(function(e){ console.log('SW error:', e); });
    });
  }

  var deferredPrompt = null;

  function allInstallBtns() {
    return document.querySelectorAll('.pwa-install-btn');
  }
  function showBtns() { allInstallBtns().forEach(function(b){ b.style.display = 'flex'; }); }
  function hideBtns() { allInstallBtns().forEach(function(b){ b.style.display = 'none'; }); }

  window.addEventListener('beforeinstallprompt', function (e) {
    e.preventDefault();
    deferredPrompt = e;
    showBtns();
  });

  // Single delegated click handler for all install buttons
  document.addEventListener('click', function (e) {
    var btn = e.target.closest('.pwa-install-btn');
    if (!btn || !deferredPrompt) return;
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then(function (r) {
      if (r.outcome === 'accepted') hideBtns();
      deferredPrompt = null;
    });
  });

  window.addEventListener('appinstalled', function () {
    hideBtns();
    deferredPrompt = null;
  });

  if (window.matchMedia('(display-mode: standalone)').matches) {
    hideBtns();
  }
})();
