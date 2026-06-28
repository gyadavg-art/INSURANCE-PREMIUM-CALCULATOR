(function () {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('./sw.js')
        .then(function(r){ console.log('SW registered:', r.scope); })
        .catch(function(e){ console.log('SW error:', e); });
    });
  }
  var deferredPrompt = null;
  var installBtn = document.getElementById('pwaInstallBtn');
  window.addEventListener('beforeinstallprompt', function (e) {
    e.preventDefault(); deferredPrompt = e;
    if (installBtn) installBtn.style.display = 'flex';
  });
  if (installBtn) {
    installBtn.addEventListener('click', function () {
      if (!deferredPrompt) return;
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then(function (r) {
        if (r.outcome === 'accepted') installBtn.style.display = 'none';
        deferredPrompt = null;
      });
    });
  }
  window.addEventListener('appinstalled', function () {
    if (installBtn) installBtn.style.display = 'none';
    deferredPrompt = null;
  });
  if (window.matchMedia('(display-mode: standalone)').matches) {
    if (installBtn) installBtn.style.display = 'none';
  }
})();
