// ═══════════════════════════════════════════════════════════
// LANDING NAVIGATION CONTROLLER
// ═══════════════════════════════════════════════════════════
let _healthInited = false, _motorInited = false;

function showSection(name) {
  document.querySelectorAll('.calc-section').forEach(s => s.classList.add('hidden'));
  document.getElementById('firePlaceholder').classList.add('hidden');
  document.getElementById('otherPlaceholder').classList.add('hidden');
  document.getElementById('landingScreen').classList.add('hidden');
  document.getElementById('globalNav').style.display = '';
  const titles = { motor: 'Motor Insurance', health: 'Health Insurance', fire: 'Fire Insurance' };
  document.getElementById('navTitle').textContent = titles[name] || name;
  if (name === 'fire')  { document.getElementById('firePlaceholder').classList.remove('hidden'); return; }
  if (name === 'other') { document.getElementById('otherPlaceholder').classList.remove('hidden'); return; }
  document.getElementById(name + 'Section').classList.remove('hidden');
  if (name === 'health' && !_healthInited) { init(); _healthInited = true; }
  if (name === 'motor'  && !_motorInited)  {
    const today=new Date().toISOString().split('T')[0];
    ['twStartDate','twEndDate','pcStartDate','pcEndDate','cvStartDate','cvEndDate'].forEach(function(id){
      var el=document.getElementById(id); if(el&&!el.value) el.value=today;
    });
    setMode('TW');
    _motorInited = true;
  }
}

function showLanding() {
  document.querySelectorAll('.calc-section').forEach(s => s.classList.add('hidden'));
  document.getElementById('firePlaceholder').classList.add('hidden');
  document.getElementById('otherPlaceholder').classList.add('hidden');
  document.getElementById('landingScreen').classList.remove('hidden');
  document.getElementById('globalNav').style.display = 'none';
}

function launchMotor(mode) {
  showSection('motor');
  setMode(mode);
}

function launchHealth(product) {
  showSection('health');
  var radio = document.querySelector('input[name="product"][value="' + product + '"]');
  if (radio) { radio.checked = true; if (typeof onProductChange === 'function') onProductChange(); }
}

function launchFire(product) {
  showSection('fire');
  if (typeof fireSetProduct === 'function') fireSetProduct(product);
}

