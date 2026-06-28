// ═══════════════════════════════════════════════════════
// FIRE CALCULATOR JS
// ═══════════════════════════════════════════════════════

function fireSetProduct(mode) {
  ['SK','CS','SG','HR'].forEach(function(m) {
    document.getElementById('fire'+m).classList.add('hidden');
    document.getElementById('fbtn'+m).classList.remove('active');
  });
  document.getElementById('fire'+mode).classList.remove('hidden');
  document.getElementById('fbtn'+mode).classList.add('active');
}

function ffmt(n) {
  return '₹ ' + Math.round(n).toLocaleString('en-IN');
}

// ── Shop Keeper ──
function skAutoCalc() {
  var stock    = parseFloat(document.getElementById('skStock').value)    || 0;
  var building = parseFloat(document.getElementById('skBuilding').value) || 0;
  var fff      = parseFloat(document.getElementById('skFFF').value)      || 0;
  var fireSI   = stock + building + fff;
  var burgSI   = building + stock;
  document.getElementById('skFireSI').textContent = ffmt(fireSI);
  document.getElementById('skBurgSI').textContent = ffmt(burgSI);
}

function skCalculate() {
  var stock    = parseFloat(document.getElementById('skStock').value)    || 0;
  var building = parseFloat(document.getElementById('skBuilding').value) || 0;
  var fff      = parseFloat(document.getElementById('skFFF').value)      || 0;
  if (stock + building + fff === 0) { alert('Please enter at least one Sum Insured value.'); return; }
  var fireSI   = stock + building + fff;
  var burgSI   = building + stock;
  var firePrem = fireSI * 0.75 / 1000;
  var burgPrem = burgSI * 0.70 / 1000;
  var netPrem  = firePrem + burgPrem;
  var gst      = netPrem * 0.18;
  var total    = netPrem + gst;
  var comm     = netPrem * 0.15;
  document.getElementById('skFirePrem').textContent = ffmt(firePrem);
  document.getElementById('skBurgPrem').textContent = ffmt(burgPrem);
  document.getElementById('skNetPrem').textContent  = ffmt(netPrem);
  document.getElementById('skGST').textContent      = ffmt(gst);
  document.getElementById('skTotal').textContent    = ffmt(total);
  document.getElementById('skComm').textContent     = ffmt(comm);
  document.getElementById('skResult').classList.remove('hidden');
}

function skReset() {
  ['skStock','skBuilding','skFFF'].forEach(function(id){ document.getElementById(id).value=''; });
  document.getElementById('skFireSI').textContent = '₹ 0';
  document.getElementById('skBurgSI').textContent = '₹ 0';
  document.getElementById('skResult').classList.add('hidden');
}

// ── Cold Storage ──
function csCalculate() {
  var si = parseFloat(document.getElementById('csSI').value) || 0;
  if (si === 0) { alert('Please enter the Sum Insured.'); return; }
  var brRate, roRate;
  if (si > 50000000) {
    brRate = 1.84; roRate = 0.77;
    document.getElementById('csRateNote').textContent = 'Sum Insured > ₹5 Crore — higher rate band applied at Branch level.';
  } else {
    brRate = 0.93; roRate = 0.77;
    document.getElementById('csRateNote').textContent = 'Sum Insured ≤ ₹5 Crore — standard rate band applied.';
  }
  var brNet   = si * brRate / 1000;
  var brGST   = brNet * 0.18;
  var brFinal = brNet + brGST;
  var brComm  = brNet * 0.25;

  var roNet   = si * roRate / 1000;
  var roGST   = roNet * 0.18;
  var roFinal = roNet + roGST;
  var roComm  = roNet * 0.25;

  document.getElementById('csBrRate').textContent  = brRate.toFixed(2) + '‰';
  document.getElementById('csBrNet').textContent   = ffmt(brNet);
  document.getElementById('csBrGST').textContent   = ffmt(brGST);
  document.getElementById('csBrFinal').textContent = ffmt(brFinal);
  document.getElementById('csBrComm').textContent  = ffmt(brComm);

  document.getElementById('csRoRate').textContent  = roRate.toFixed(2) + '‰';
  document.getElementById('csRoNet').textContent   = ffmt(roNet);
  document.getElementById('csRoGST').textContent   = ffmt(roGST);
  document.getElementById('csRoFinal').textContent = ffmt(roFinal);
  document.getElementById('csRoComm').textContent  = ffmt(roComm);

  document.getElementById('csResult').classList.remove('hidden');
}

function csReset() {
  document.getElementById('csSI').value = '';
  document.getElementById('csResult').classList.add('hidden');
}

function showComingSoon(name) {
  const toast = document.getElementById('csToast');
  toast.textContent = name + ' Insurance — Coming Soon!';
  toast.style.display = 'block';
  setTimeout(() => toast.style.display = 'none', 3000);
}
