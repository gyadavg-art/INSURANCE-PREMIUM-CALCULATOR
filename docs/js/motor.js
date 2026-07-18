// ═══════════════════════════════════════════════════════════
// MOTOR CALCULATOR JS
// ═══════════════════════════════════════════════════════════

const $=id=>document.getElementById(id);
const getV=id=>parseFloat($( id)&&$(id).value||0)||0;
const show=id=>{const e=$(id);if(e)e.classList.remove('hidden');};
const hide=id=>{const e=$(id);if(e)e.classList.add('hidden');};
const sd=(id,v)=>{const e=$(id);if(e)e.style.display=v?'block':'none';};

/* ── AGENT SETTINGS ── */
function loadSettings(){
  ['agentName','agentAgency','agentLicence','agentMobile'].forEach(k=>{
    const v=localStorage.getItem(k);
    const el=$(k); if(el&&v) el.value=v;
  });
}
function saveSettings(){
  ['agentName','agentAgency','agentLicence','agentMobile'].forEach(k=>{
    const el=$(k); if(el) localStorage.setItem(k,el.value);
  });
}
function toggleSettings(){
  const p=$('settingsPanel');
  p.classList.toggle('closed'); p.classList.toggle('open');
}
function getAgent(){
  return {
    name: ($(  'agentName')&&$('agentName').value)||'Agent Name',
    agency:($('agentAgency')&&$('agentAgency').value)||'Insurance Agency',
    licence:($('agentLicence')&&$('agentLicence').value)||'',
    mobile:($('agentMobile')&&$('agentMobile').value)||''
  };
}

/* ── MODE SWITCHER ── */
function setMode(m){
  var twEl=document.getElementById('twSection');
  var pcEl=document.getElementById('pcSection');
  var cvEl=document.getElementById('cvSection');
  // Quick modes GC/TAXI/BUS/MISC all route to the CV section
  var quickCV=['GC','TAXI','BUS','MISC'];
  var isCVQuick=quickCV.includes(m);
  var showCV=isCVQuick||m==='CV';
  if(twEl) twEl.style.display = m==='TW' ? 'block' : 'none';
  if(pcEl) pcEl.style.display = m==='PC' ? 'block' : 'none';
  if(cvEl) cvEl.style.display = showCV ? 'block' : 'none';

  // Theme via body class
  var b=document.getElementById('motorSection');
  b.classList.remove('tw-mode','cv-mode');
  if(m==='TW') b.classList.add('tw-mode');
  if(showCV) b.classList.add('cv-mode');

  // Button active state — all 6 buttons
  ['TW','PC','GC','TAXI','BUS','MISC'].forEach(function(id){
    var btn=document.getElementById('btn'+id); if(btn) btn.classList.toggle('active',id===m);
  });

  // Quick-mode: pre-set cvClass, show category badge, hide class row
  var classMap={GC:'A1',TAXI:'C1a',BUS:'C2',MISC:'D'};
  var catMap={
    GC:  {icon:'🚚',name:'Goods Carrying',code:'A-1 Public Carrier (4-wheel) — IRDAI Section 4 Tariff'},
    TAXI:{icon:'🚕',name:'Taxi / Cab',code:'C-1a Passenger Carrying ≤6 Pass (4-wheel) — IRDAI Section 4 Tariff'},
    BUS: {icon:'🚌',name:'Bus / Minibus',code:'C-2 Passenger Carrying >6 Pass (4-wheel) — IRDAI Section 4 Tariff'},
    MISC:{icon:'🚜',name:'Misc / Agri Tractor',code:'Class D — Misc & Special Types — IRDAI Section 4 Tariff'}
  };
  var cvClassSel=document.getElementById('cvClass');
  var cvClassRow=document.getElementById('cvClassRow');
  var cvCatBadge=document.getElementById('cvCategoryBadge');
  if(isCVQuick){
    if(cvClassSel) cvClassSel.value=classMap[m];
    if(cvClassRow) cvClassRow.style.display='none';
    if(cvCatBadge){
      cvCatBadge.style.display='flex';
      var info=catMap[m];
      var iconEl=document.getElementById('cvCatIcon');
      var nameEl=document.getElementById('cvCatName');
      var codeEl=document.getElementById('cvCatCode');
      if(iconEl) iconEl.textContent=info.icon;
      if(nameEl) nameEl.textContent=info.name;
      if(codeEl) codeEl.textContent=info.code;
    }
  } else {
    if(cvClassRow) cvClassRow.style.display='';
    if(cvCatBadge) cvCatBadge.style.display='none';
  }

  try{ window.scrollTo(0,0); }catch(e){}
  var icons={TW:'🏍️',PC:'🚗',GC:'🚚',TAXI:'🚕',BUS:'🚌',MISC:'🚜',CV:'🚛'};
  var labels={
    TW:'Two Wheeler — Section 3 Tariff',
    PC:'Private Car — Section 2 Tariff',
    GC:'Goods Carrying — A1 Public Carrier (4-wheel)',
    TAXI:'Taxi / Cab — C-1a Passenger Carrying',
    BUS:'Bus / Minibus — C-2 Passenger Carrying',
    MISC:'Misc / Agri Tractor — Class D',
    CV:'Commercial Vehicle — Section 4 Tariff'
  };
  var logo=$('vsLogo'); if(logo) logo.textContent=icons[m]||'';
  var lbl=$('vsActiveLbl'); if(lbl) lbl.textContent=labels[m]||'';
  try{
    if(showCV){cvCovChange();cvClassChange();cvFuelChange();}
    else if(m==='PC'){pcCovChange();}
    else{twCovChange();}
  }catch(e){ console.error('setMode init error:',e); }
}

/* ══════════════════════════════════════════════
   TWO WHEELER LOGIC
══════════════════════════════════════════════ */
const TW_BANNERS={
  PKG:'Package Policy: Own Damage + TP Liability + Compulsory PA. Full coverage.',
  TP:'TP Only / Liability Policy: Third Party + Compulsory PA. No Own Damage.',
  SAOD:'Stand Alone OD: Own Damage only. TP, Owner-Driver PA and LL covers are disabled (not included in premium).'
};
const twCovType=()=>{var el=document.querySelector('input[name=twCov]:checked');return el?el.value:'PKG';};

function twCovChange(){
  const ct=twCovType();
  const b=$('twCovBanner'); if(b) b.textContent=TW_BANNERS[ct];
  const pill=$('twQpPill'); if(pill) pill.textContent=ct==='PKG'?'Package':ct==='TP'?'TP Only':'Stand Alone OD';
  sd('twIdvField', ct!=='TP');
  sd('twOdDiscBlock', ct!=='TP');
  sd('twAccLabel', ct!=='TP');
  sd('twAccBlock', ct!=='TP');
  sd('twPillionBlock', ct!=='TP');
  ct==='TP' ? show('twTpNotice') : hide('twTpNotice');
  // SAOD: disable (grey out) TP-related items — show them but mark as N/A
  const saod = ct==='SAOD';
  const compPABlock=$('twCompPABlock');
  if(compPABlock){ compPABlock.style.opacity=saod?'0.38':''; compPABlock.style.pointerEvents=saod?'none':''; }
  const llBlock=$('twLLBlock');
  if(llBlock){ llBlock.style.opacity=saod?'0.38':''; llBlock.style.pointerEvents=saod?'none':''; }
  if(saod){ const p=$('twCompPA'); if(p) p.checked=false; const ll=$('twLL'); if(ll) ll.checked=false; }
  twRefreshAddons();
}

function twRefreshAddons(){
  const ct=twCovType();
  const vt=$('twVehicleType')?.value||'IC';
  const yrF=parseFloat($('twAgeBr')?.value)||1;
  const ageYr=(yrF===1)?1:(yrF===2)?6:11;
  document.querySelectorAll('#twSection .addon-card').forEach(card=>{
    const allow=(card.dataset.allow||'PKG').split(',');
    const maxYr=parseFloat(card.dataset.maxyr)||999;
    const covOk=allow.includes(ct);
    const ageOk=ageYr<=maxYr;
    if(!covOk) card.classList.add('cov-hidden');
    else if(!ageOk){card.classList.remove('cov-hidden','active');card.classList.add('age-disabled');}
    else card.classList.remove('cov-hidden','age-disabled');
  });
  const battCard=$('tw_card_batteryProtect');
  if(battCard) battCard.classList.toggle('hidden', vt!=='EV');
}

function twCardToggle(id){
  const chk=$('tw_'+id), card=$('tw_card_'+id);
  if(card) card.classList.toggle('active',!!chk&&chk.checked);
}

function twVehicleChange(){
  const vt=$('twVehicleType').value;
  sd('twKwField', vt==='EV');
  sd('twCcField', vt!=='EV');
  sd('twCngKitField', vt==='CNG_KIT');
  twRefreshAddons();
}

function twUpdateAge(){
  const r=$('twRegDate').value, p=$('twPolDate').value;
  if(r&&p){
    const months=Math.max(0,Math.ceil((new Date(p)-new Date(r))/(1000*60*60*24*30.44)));
    const disp=$('twAgeDisplay'); if(disp) disp.value=months+' months ('+(months/12).toFixed(1)+' yrs)';
    let br=1;
    if(months<=60) br=1;
    else if(months<=120) br=2;
    else br=3;
    const abr=$('twAgeBr'); if(abr) abr.value=br;
  } else {
    const disp=$('twAgeDisplay'); if(disp) disp.value='—';
    const abr=$('twAgeBr'); if(abr) abr.value=1;
  }
}

function calculateTW(){
  twUpdateAge();
  const ct=twCovType();
  const vt=$('twVehicleType').value;
  const zone=$('twZone').value;
  const br=parseInt($('twAgeBr').value)||1;
  const idv=ct!=='TP'?getV('twIDV'):0;
  const ncbPct=parseFloat($('twNCB').value)||0;

  // OD Rates: Zone × CC-band × age-bracket [br1,br2,br3]
  const OD={
    A:{u150:[1.879,1.973,2.020], u350:[1.793,1.883,1.928], over350:[1.708,1.793,1.836]},
    B:{u150:[1.676,1.760,1.802], u350:[1.760,1.848,1.892], over350:[1.844,1.936,1.982]}
  };

  let baseOD=0, odDiscAmt=0, ncbAmt=0, netOD=0;
  if(ct!=='TP'){
    let band;
    if(vt==='EV'){
      const kw=$('twKW').value;
      // Map KW to OD CC band (GR-46: same tariff structure)
      band=(kw==='u3'||kw==='u7')?'u150':(kw==='u16')?'u350':'over350';
    } else {
      const cc=$('twCC').value;
      band=(cc==='u75'||cc==='u150')?'u150':(cc==='u350')?'u350':'over350';
    }
    const r=OD[zone][band][br-1];
    baseOD=(r/100)*idv;
    if(vt==='CNG_KIT'){
      const kitVal=getV('twCngKitVal');
      baseOD+=kitVal>0?kitVal*0.04:baseOD*0.05;
    }
    const discPct=Math.min(100,getV('twOdDisc'));
    odDiscAmt=baseOD*(discPct/100);
    const afterBasic=Math.max(0,baseOD-odDiscAmt);
    ncbAmt=(ncbPct/100)*afterBasic;
    netOD=Math.max(0,afterBasic-ncbAmt);
  }

  // TP Rates (PAN India, no zone)
  let tp=0;
  if(ct!=='SAOD'){
    if(vt==='EV'){
      const kw=$('twKW').value;
      tp=kw==='u3'?457:kw==='u7'?607:kw==='u16'?1161:2383;
    } else {
      const cc=$('twCC').value;
      tp=cc==='u75'?538:cc==='u150'?714:cc==='u350'?1366:2804;
      if(vt==='CNG_KIT') tp+=60;
    }
  }

  const pa=$('twCompPA').checked?400:0;

  // Pillion PA: ₹7 per ₹10,000 SI (max SI ₹2L)
  const pillionCb=$('twPillionPA');
  const pillionSI=ct!=='TP'&&pillionCb&&pillionCb.checked?Math.min(getV('twPillionSI'),200000):0;
  const pillionPrem=pillionSI>0?Math.ceil(pillionSI/10000)*7:0;

  // LL
  const llCb=$('twLL');
  const llPersons=parseInt($('twLLPersons').value)||1;
  const ll=llCb&&llCb.checked?50*llPersons:0;

  // OD discount factor (OD disc + NCB combined) — applied to accessories
  const odFactor=ct!=='TP'&&baseOD>0?netOD/baseOD:1;

  // Accessories (3%, min ₹50, after OD discount)
  const accVal=getV('twAccVal');
  const accPrem=ct!=='TP'&&accVal>0?Math.max(50,accVal*0.03*odFactor):0;

  // Electrical accessories (4%, after OD discount)
  const elecPrem=ct!=='TP'?getV('twElecVal')*0.04*odFactor:0;

  // Additional towing (over inbuilt ₹300), max ₹300 @ 5%
  const towPrem=ct!=='TP'?Math.min(getV('twTowingAmt'),300)*0.05:0;

  // Add-on covers (PKG and SAOD)
  let _twAdLines=[];
  let twAddons=0;
  if(ct==='PKG'||ct==='SAOD'){
    const nilDepCb=$('tw_nilDep'); const nilDepCard=$('tw_card_nilDep');
    if(nilDepCb&&nilDepCb.checked&&nilDepCard&&!nilDepCard.classList.contains('cov-hidden')&&!nilDepCard.classList.contains('age-disabled')){
      const v=Math.round(netOD*0.20); twAddons+=v; _twAdLines.push({l:'Zero Depreciation (20% of net OD)',a:v});
    }
    const engCb=$('tw_engineProtect'); const engCard=$('tw_card_engineProtect');
    if(engCb&&engCb.checked&&engCard&&!engCard.classList.contains('cov-hidden')&&!engCard.classList.contains('age-disabled')){
      const v=Math.round(netOD*0.08); twAddons+=v; _twAdLines.push({l:'Engine Protector (8% of net OD)',a:v});
    }
    const rtiCb=$('tw_rti'); const rtiCard=$('tw_card_rti');
    if(rtiCb&&rtiCb.checked&&rtiCard&&!rtiCard.classList.contains('cov-hidden')&&!rtiCard.classList.contains('age-disabled')){
      const v=Math.round(netOD*0.08); twAddons+=v; _twAdLines.push({l:'Return to Invoice (8% of net OD)',a:v});
    }
    const rsaCb=$('tw_rsa');
    if(rsaCb&&rsaCb.checked){ twAddons+=150; _twAdLines.push({l:'Roadside Assistance (RSA)',a:150}); }
    const battCb=$('tw_batteryProtect'); const battCard=$('tw_card_batteryProtect');
    if(battCb&&battCb.checked&&battCard&&!battCard.classList.contains('cov-hidden')&&!battCard.classList.contains('age-disabled')){
      const v=Math.round(idv*0.005); twAddons+=v; _twAdLines.push({l:'Battery Protect EV (0.5% of IDV)',a:v});
    }
    const sacCb=$('tw_warRisk');
    if(sacCb&&sacCb.checked){const v=Math.max(75,Math.round((netOD+twAddons)*0.05));twAddons+=v;_twAdLines.push({l:'War Risk Cover (5% of net OD+addons, min ₹75)',a:v});}
  }

  const netBase=netOD+tp+pa+pillionPrem+ll+accPrem+elecPrem+towPrem+twAddons;
  const gst=netBase*0.18;
  const grand=Math.round(netBase+gst);

  // Update display
  const setT=(id,v)=>{const e=$(id);if(e)e.textContent=v;};
  setT('tw_lbl_baseOD',baseOD.toFixed(2));
  setT('tw_lbl_odDisc',odDiscAmt.toFixed(2));
  setT('tw_lbl_ncbDisc',ncbAmt.toFixed(2));
  setT('tw_lbl_netOD',netOD.toFixed(2));
  setT('tw_lbl_tp',tp.toFixed(2));
  setT('tw_lbl_pa',pa.toFixed(2));
  setT('tw_lbl_pillion',pillionPrem.toFixed(2));
  setT('tw_lbl_ll',ll.toFixed(2));
  setT('tw_lbl_acc',accPrem.toFixed(2));
  setT('tw_lbl_elec',elecPrem.toFixed(2));
  setT('tw_lbl_tow',towPrem.toFixed(2));
  setT('tw_lbl_addons',twAddons.toFixed(2));
  sd('twAccRow',accPrem>0);
  sd('twElecRow',elecPrem>0);
  sd('twTowRow',towPrem>0);
  sd('twPillionRow',pillionPrem>0);
  sd('twLlRow',ll>0);
  sd('twAddonsTotalRow',twAddons>0);
  sd('twQColOD',ct!=='TP');
  animateCounter('tw_lbl_grand',grand);

  const cc_el=$('twCC'), kw_el=$('twKW');
  const specText=vt==='EV'?(kw_el?kw_el.options[kw_el.selectedIndex].text:'EV'):(cc_el?cc_el.options[cc_el.selectedIndex].text:'');
  const zEl=$('twZone');
  const zoneText=zEl?zEl.options[zEl.selectedIndex].text:'';

  buildPrintDoc({
    mode:'TW',
    date:new Date().toLocaleDateString('en-IN',{day:'2-digit',month:'long',year:'numeric'}),
    custName:($('twCustName')&&$('twCustName').value)||'',
    regNo:($('twRegNo')&&$('twRegNo').value)||'',
    makeModel:($('twMakeModel')&&$('twMakeModel').value)||'',
    covType:ct==='PKG'?'Package Policy':ct==='TP'?'TP Only':'Stand Alone OD',
    vehType:'Two Wheeler', spec:specText, zone:zoneText,
    idv:ct!=='TP'?Math.round(idv).toLocaleString('en-IN'):'N/A',
    age:$('twAgeDisplay')?$('twAgeDisplay').value:'—',
    ncbPct,
    od:{show:ct!=='TP',base:baseOD,discOD:odDiscAmt,discNCB:ncbAmt,net:netOD,
        elec:elecPrem,nonElec:0,tow:towPrem,geo:0,gvwLoad:0,otLoad:0,imt23:0,spFactor:null,
        acc:accPrem},
    tp:{show:ct!=='SAOD',base:tp,hev:0,pa,pillion:pillionPrem,ll,llEmp:0,geo:0},
    addons:{items:_twAdLines,total:twAddons},
    gst:{split:false,total:Math.round(gst)},
    grand, cov:buildCovList('TW',ct,pa,ll,pillionPrem), policyMonths:12
  });
}

function buildCovList(mode,ct,pa,ll,pillion){
  const c=[];
  if(ct!=='TP') c.push('Own Damage Cover');
  c.push('Third Party Liability');
  if(pa) c.push('Owner-Driver PA — ₹15L');
  if(pillion) c.push('Pillion Rider PA');
  if(ll) c.push('LL — Paid Driver/Cleaner');
  return c;
}

/* ══════════════════════════════════════════════
   PRIVATE CAR LOGIC
══════════════════════════════════════════════ */
const PC_BANNERS={
  PKG:'Package Policy: Own Damage + TP Liability + Compulsory PA. All add-on covers available.',
  TP:'TP Only / Liability Policy: Third Party + Compulsory PA. No Own Damage.',
  SAOD:'Standalone OD: Own Damage Only. No TP, no PA cover.'
};
const pcCovType=()=>{var el=document.querySelector('input[name=pcCov]:checked');return el?el.value:'PKG';};
let _pcPolicyType='renewal';
function pcSetPolicyType(type){
  _pcPolicyType=type;
  document.getElementById('pcPtRenewal').classList.toggle('active',type==='renewal');
  document.getElementById('pcPtNew').classList.toggle('active',type==='new');
  const note=document.getElementById('pcPtNote');
  if(note) note.textContent=type==='new'
    ?'Brand New Vehicle: 1 Year OD premium + 3 Year TP premium (as per IRDAI mandate for new vehicles).'
    :'Renewal: standard annual policy — 1 year OD and 1 year TP premium applies.';
}

function pcCovChange(){
  const ct=pcCovType();
  const b=$('pcCovBanner'); if(b) b.textContent=PC_BANNERS[ct];
  const pill=$('pcQpPill'); if(pill) pill.textContent=ct==='PKG'?'Package':ct==='TP'?'TP Only':'SAOD';
  sd('pcIdvField',ct!=='TP'); sd('pcQColOD',ct!=='TP');
  sd('pcOdDiscBlock',ct!=='TP'); sd('pcPaBlock',ct!=='SAOD');
  sd('pcLlBlock',ct!=='SAOD'); sd('pcQColTP',true);
  ct==='TP'?show('pcTpNotice'):hide('pcTpNotice');
  pcRefreshAddons();
}

function pcMakeChange(){
  const isMaruti=$('pcMakeBrand')&&$('pcMakeBrand').value==='maruti';
  ['nilDep','engineProtect','rti','consumables','tyreAlloy','batteryProtect'].forEach(id=>{
    const el=$('pc_disc_'+id);
    if(!el) return;
    el.disabled=isMaruti;
    if(isMaruti) el.value=0;
    el.style.opacity=isMaruti?'0.35':'';
    el.style.cursor=isMaruti?'not-allowed':'';
  });
  const note=$('pcMarutiDiscNote'); if(note) note.style.display=isMaruti?'block':'none';
}

function pcVehicleChange(){
  const vt=$('pcVehicleType').value;
  sd('pcKwField',vt==='EV'); sd('pcCcField',vt!=='EV');
  sd('pcCngKitField',vt==='CNG_KIT');
  const bCard=$('pc_card_batteryProtect');
  if(bCard) bCard.classList.toggle('hidden',vt!=='EV'&&vt!=='HEV');
  const hevW=$('pc_hevWrap'); if(hevW) hevW.classList.toggle('hidden',vt!=='HEV');
  const bTitle=$('pc_batteryTitle');
  if(bTitle) bTitle.textContent=vt==='HEV'?'Hybrid Protect':'Battery Protect (EV)';
  const hRow=$('pc_hevRow'); if(hRow) hRow.style.display=vt==='HEV'?'':'none';
  pcRefreshAddons();
}

function pcUpdateAge(){
  const r=$('pcRegDate').value, p=$('pcPolDate').value;
  if(r&&p){
    const m=Math.max(0,Math.ceil((new Date(p)-new Date(r))/(1000*60*60*24*30.44)));
    const disp=$('pcAgeDisplay'); if(disp) disp.value=m+' months ('+(m/12).toFixed(1)+' yrs)';
    const yr=$('pcAgeYr'); if(yr) yr.value=(m/12).toFixed(3);
    let br=1;
    if(m<=12)br=1; else if(m<=24)br=2; else if(m<=36)br=3; else if(m<=48)br=4;
    else if(m<=60)br=5; else if(m<=72)br=6; else if(m<=84)br=7;
    else if(m<=120)br=8; else br=11;
    const abr=$('pcAgeBr'); if(abr) abr.value=br;
  } else {
    const disp=$('pcAgeDisplay'); if(disp) disp.value='—';
    const abr=$('pcAgeBr'); if(abr) abr.value=1;
    const yr=$('pcAgeYr'); if(yr) yr.value=0;
  }
  pcRefreshAddons();
}

function pcRefreshAddons(){
  const ct=pcCovType();
  const yrF=parseFloat($('pcAgeYr')?.value)||0;
  document.querySelectorAll('#pcSection .addon-card').forEach(card=>{
    const allow=(card.dataset.allow||'PKG').split(',');
    const maxYr=parseFloat(card.dataset.maxyr)||999;
    const covOk=allow.includes(ct), ageOk=yrF<=maxYr;
    if(!covOk) card.classList.add('cov-hidden');
    else if(!ageOk){card.classList.remove('cov-hidden','active');card.classList.add('age-disabled');}
    else card.classList.remove('cov-hidden','age-disabled');
  });
}

function pcCardToggle(id){
  const chk=$('pc_'+id), card=$('pc_card_'+id);
  if(card) card.classList.toggle('active',!!chk&&chk.checked);
}

function calculatePC(){
  pcUpdateAge();
  const ct=pcCovType(), vt=$('pcVehicleType').value, zone=$('pcZone').value;
  const br=parseInt($('pcAgeBr').value)||1;
  const idv=ct!=='TP'?getV('pcIDV'):0;
  const cc=$('pcCC').value, kw=$('pcKW').value;
  const ncbPct=parseFloat($('pcNCB').value)||0;
  const isHighCC=(cc==='over1500'&&vt!=='EV');
  const isMaruti=$('pcMakeBrand')&&$('pcMakeBrand').value==='maruti';

  let baseOD=0,odDiscAmt=0,ncbAmt=0,netOD=0;
  if(ct!=='TP'){
    let r=0;
    if(vt==='EV'){r=zone==='A'?3.127:3.039;}
    else{
      if(zone==='A'){
        if(br<=5)r=cc==='under1000'?3.127:cc==='1000to1500'?3.283:3.440;
        else if(br<=8)r=cc==='under1000'?3.283:cc==='1000to1500'?3.447:3.612;
        else r=cc==='under1000'?3.362:cc==='1000to1500'?3.529:3.698;
      }else{
        if(br<=5)r=cc==='under1000'?3.039:cc==='1000to1500'?3.191:3.343;
        else if(br<=8)r=cc==='under1000'?3.191:cc==='1000to1500'?3.351:3.510;
        else r=cc==='under1000'?3.267:cc==='1000to1500'?3.430:3.594;
      }
    }
    baseOD=(r/100)*idv;
    if(vt==='CNG_FACTORY') baseOD+=baseOD*0.05;
    else if(vt==='CNG_KIT') baseOD+=getV('pcCngKitVal')*0.04;
    const discPct=Math.min(100,getV('pcOdDisc'));
    odDiscAmt=baseOD*(discPct/100);
    const afterBasic=Math.max(0,baseOD-odDiscAmt);
    const antiTheft=$('pcAntiTheft')&&$('pcAntiTheft').checked;
    const antiTheftAmt=antiTheft?afterBasic*0.025:0;
    ncbAmt=(ncbPct/100)*Math.max(0,afterBasic-antiTheftAmt);
    netOD=Math.max(0,afterBasic-antiTheftAmt-ncbAmt);
  }

  let tp=0,hevDisc=0;
  const isBrandNew=_pcPolicyType==='new';
  if(ct!=='SAOD'){
    if(vt==='EV') tp=kw==='under30'?1780:kw==='30to65'?2904:6712;
    else{tp=cc==='under1000'?2094:cc==='1000to1500'?3416:7897; if(vt==='CNG_FACTORY'||vt==='CNG_KIT')tp+=60;}
    if(vt==='HEV') hevDisc=tp*0.075;
    if(isBrandNew) { tp=tp*3; hevDisc=hevDisc*3; }
  }
  const netTP=tp-hevDisc;
  const pa=ct!=='SAOD'&&$('pcCompPA').checked?325:0;
  const llCb=$('pcLL');
  const llPersons=parseInt($('pcLLPersons').value)||1;
  const ll=ct!=='SAOD'&&llCb&&llCb.checked?50*llPersons:0;

  let addons=0; const cov=[]; const _adLines=[];
  if(ct!=='TP') cov.push('Own Damage Cover');
  cov.push('Third Party Liability');
  if(pa) cov.push('Owner-Driver PA — ₹15L');
  if(ll) cov.push('LL — Paid Driver');
  const aOn=id=>{const c=$('pc_'+id);return c&&!c.disabled&&c.checked;};
  const dsc=id=>{const e=$('pc_disc_'+id);return e?Math.min(100,Math.max(0,getV('pc_disc_'+id))):0;};

  if(aOn('nilDep')){
    const cl=$('pc_nilDepClaims').value;
    // Non-Maruti rates (≤1500cc and >1500cc) — 2 claims, 4 claims, unlimited
    const rL={1:{'2':0.38,'4':0.58,'unlimited':0.86},2:{'2':0.48,'4':0.72,'unlimited':1.08},3:{'2':0.62,'4':0.94,'unlimited':1.40},4:{'2':0.81,'4':1.22,'unlimited':1.84},5:{'2':1.00,'4':1.51,'unlimited':2.27},6:{'2':1.19,'4':1.80,'unlimited':2.70},7:{'2':1.38,'4':2.09,'unlimited':3.13}};
    const rH={1:{'2':0.43,'4':0.65,'unlimited':0.97},2:{'2':0.52,'4':0.79,'unlimited':1.19},3:{'2':0.67,'4':1.00,'unlimited':1.51},4:{'2':0.86,'4':1.29,'unlimited':1.94},5:{'2':1.05,'4':1.58,'unlimited':2.37},6:{'2':1.24,'4':1.86,'unlimited':2.80},7:{'2':1.43,'4':2.15,'unlimited':3.23}};
    // Maruti Suzuki rates (lower — both CC bands same for Maruti per IRDAI circular)
    const rLM={1:{'2':0.30,'4':0.44,'unlimited':0.65},2:{'2':0.38,'4':0.58,'unlimited':0.86},3:{'2':0.50,'4':0.66,'unlimited':0.99},4:{'2':0.65,'4':0.85,'unlimited':1.28},5:{'2':0.90,'4':1.07,'unlimited':1.61},6:{'2':1.07,'4':1.80,'unlimited':2.70},7:{'2':1.24,'4':2.09,'unlimited':3.13}};
    const rHM={1:{'2':0.30,'4':0.44,'unlimited':0.65},2:{'2':0.38,'4':0.58,'unlimited':0.86},3:{'2':0.50,'4':0.66,'unlimited':0.99},4:{'2':0.65,'4':0.85,'unlimited':1.28},5:{'2':0.90,'4':1.07,'unlimited':1.61},6:{'2':1.07,'4':1.80,'unlimited':2.70},7:{'2':1.24,'4':2.09,'unlimited':3.13}};
    let table;
    if(isMaruti) table=isHighCC?rHM:rLM;
    else table=isHighCC?rH:rL;
    const rate=table[br]?(table[br][cl]||0):0;
    const brandLabel=isMaruti?'Maruti':'Non-Maruti';
    const _a=((rate/100)*idv)*(1-dsc('nilDep')/100);addons+=_a;_adLines.push({l:'Nil Dep ('+cl+' Claims · '+brandLabel+')',a:_a});cov.push('Nil Depreciation');
  }
  if(aOn('engineProtect')){
    const et=$('pc_engineProtectType').value;
    const rate=et==='with'?({1:0.26,2:0.28,3:0.30,4:0.35,5:0.40}[br]||0.25):0.25;
    const _a=((rate/100)*idv)*(1-dsc('engineProtect')/100);addons+=_a;_adLines.push({l:'Engine Protect',a:_a});cov.push('Engine Protect');
  }
  if(aOn('rti')){const r={1:0.24,2:0.57,3:1.01}[br]||0;const _a=((r/100)*idv)*(1-dsc('rti')/100);addons+=_a;_adLines.push({l:'Return to Invoice',a:_a});cov.push('RTI');}
  if(aOn('consumables')){const r={1:0.14,2:0.16,3:0.18,4:0.21,5:0.25}[br]||0;const _a=((r/100)*idv)*(1-dsc('consumables')/100);addons+=_a;_adLines.push({l:'Consumables Cover',a:_a});cov.push('Consumables');}
  if(aOn('tyreAlloy')){const r={1:0.20,2:0.25,3:0.30}[br]||0;const _a=((r/100)*idv)*(1-dsc('tyreAlloy')/100);addons+=_a;_adLines.push({l:'Tyre & Alloy Cover',a:_a});cov.push('Tyre & Alloy');}
  if(aOn('keyProtect')){addons+=250;_adLines.push({l:'Key Protect Cover',a:250});cov.push('Key Protect');}
  if(aOn('personalBelonging')){addons+=500;_adLines.push({l:'Personal Belonging',a:500});cov.push('Personal Belonging');}
  if(aOn('lossContents')){addons+=140;_adLines.push({l:'Loss of Contents',a:140});cov.push('Loss of Contents');}
  if(aOn('ncbProtect')){const rates={0:8.5,20:10.63,25:14.88,35:19.13,45:21.25,50:21.25};const _a=(rates[ncbPct]||8.5)/100*Math.max(0,baseOD-odDiscAmt);addons+=_a;_adLines.push({l:'NCB Protection',a:_a});cov.push('NCB Protection');}
  if(aOn('rsa')){const _a=$('pc_rsaType').value==='basic'?50:60;addons+=_a;_adLines.push({l:'Roadside Assistance',a:_a});cov.push('RSA');}
  if(aOn('batteryProtect')){
    let bp=0;
    if(vt==='EV'){bp={1:0.27,2:0.29,3:0.31}[br]||0;}
    else if(vt==='HEV'){const ht=$('pc_hevType').value;bp=ht==='basic'?({1:0.20,2:0.25,3:0.30}[br]||0):({1:0.43,2:0.50,3:0.57}[br]||0);}
    const _a=((bp/100)*idv)*(1-dsc('batteryProtect')/100);addons+=_a;if(_a>0)_adLines.push({l:vt==='HEV'?'Hybrid Protect':'Battery Protect (EV)',a:_a});cov.push(vt==='HEV'?'Hybrid Protect':'Battery Protect');
  }
  if(aOn('warRisk')){const v=Math.max(250,Math.round((netOD+addons)*0.05));addons+=v;_adLines.push({l:'War Risk Cover (5% of net OD+addons, min ₹250)',a:v});cov.push('War Risk Cover');}

  const wrap=$('pcAddonsWrap');
  if(wrap){
    wrap.innerHTML=_adLines.length>0?_adLines.map(it=>`<div class="qrow acc-r" style="font-size:.73rem;padding:4px 0;border-bottom:1px dashed var(--border-lt)"><span class="qlbl">↳ ${it.l}</span><span class="qval">₹ ${it.a.toFixed(2)}</span></div>`).join('')
      :`<div class="qrow acc-r"><span class="qlbl">Add-on Covers</span><span class="qval">₹ 0.00</span></div>`;
    const tr=$('pcAddonsTotalRow'); if(tr) tr.style.display=_adLines.length>0?'flex':'none';
  }

  const pcOdFactor=ct!=='TP'&&baseOD>0?netOD/baseOD:1;
  const elecPrem=ct!=='TP'?getV('pcElecVal')*0.04*pcOdFactor:0;
  const nonElecPrem=ct!=='TP'?getV('pcNonElecVal')*0.04*pcOdFactor:0;
  const towPrem=Math.min(getV('pcTowingAmt'),1500)*0.05;
  const grand=Math.round((netOD+netTP+pa+ll+addons+elecPrem+nonElecPrem+towPrem)*1.18);

  const setT=(id,v)=>{const e=$(id);if(e)e.textContent=v;};
  const antiTheftDisp=$('pcAntiTheft')&&$('pcAntiTheft').checked;
  const antiTheftDispAmt=antiTheftDisp?(Math.max(0,baseOD-odDiscAmt)*0.025):0;
  const tpLbl=$('pcTpRowLabel'); if(tpLbl) tpLbl.textContent=isBrandNew?'Third Party (3 Year TP)':'Third Party (TP)';
  setT('pc_lbl_baseOD',baseOD.toFixed(2));setT('pc_lbl_odDisc',odDiscAmt.toFixed(2));
  setT('pc_lbl_antiTheft',antiTheftDispAmt.toFixed(2));
  sd('pcAntiTheftRow',antiTheftDisp);
  setT('pc_lbl_ncbDisc',ncbAmt.toFixed(2));setT('pc_lbl_netOD',netOD.toFixed(2));
  setT('pc_lbl_tp',tp.toFixed(2));setT('pc_lbl_hevDisc',hevDisc.toFixed(2));
  setT('pc_lbl_pa',pa.toFixed(2));setT('pc_lbl_ll',ll.toFixed(2));
  setT('pc_lbl_addons',addons.toFixed(2));setT('pc_lbl_elec',elecPrem.toFixed(2));
  setT('pc_lbl_nonElec',nonElecPrem.toFixed(2));setT('pc_lbl_towing',towPrem.toFixed(2));
  sd('pcElecRow',elecPrem>0);sd('pcNonElecRow',nonElecPrem>0);sd('pcTowingRow',towPrem>0);
  sd('pc_hevRow',hevDisc>0);
  animateCounter('pc_lbl_grand',grand);

  // ── PC Agent Commission ──────────────────────────────────────────
  {
    const yrF2=parseFloat($('pcAgeYr')?.value)||0;
    const over10=yrF2>10;
    let odPct=0, tpPct=0, basis='';
    if(ct==='PKG'){
      odPct=20; tpPct=over10?12.5:15;
      basis=over10?'Package >10 yr':'Package ≤10 yr';
    } else if(ct==='SAOD'){
      odPct=20; tpPct=0;
      basis='Standalone OD';
    } else if(ct==='TP'){
      odPct=0; tpPct=15;
      basis='TP Only';
    }
    const commOD=(odPct/100)*(netOD+addons);
    const commTP=(tpPct/100)*netTP;
    const commTotal=commOD+commTP;
    const sT=(id,v)=>{const e=$(id);if(e)e.textContent=v;};
    sT('pcCommODPct',odPct); sT('pcCommTPPct',tpPct);
    sT('pcCommOD',commOD.toFixed(2)); sT('pcCommTP',commTP.toFixed(2));
    sT('pcCommTotal',commTotal.toFixed(2));
    sT('pcCommBasis',basis);
    sd('pcCommODRow',odPct>0); sd('pcCommTPRow',tpPct>0);
    sd('pcCommPanel',true);
  }

  const vEl=$('pcVehicleType'), zEl=$('pcZone');
  buildPrintDoc({
    mode:'PC',
    date:new Date().toLocaleDateString('en-IN',{day:'2-digit',month:'long',year:'numeric'}),
    custName:($('pcCustName')&&$('pcCustName').value)||'',
    regNo:($('pcRegNo')&&$('pcRegNo').value)||'',
    makeModel:($('pcMakeModel')&&$('pcMakeModel').value)||'',
    covType:ct==='PKG'?(isBrandNew?'Package — 1yr OD + 3yr TP (New)':'Package Policy'):ct==='TP'?(isBrandNew?'TP Only — 3yr (New)':'TP Only'):'Standalone OD',
    vehType:'Private Car',
    spec:vEl?vEl.options[vEl.selectedIndex].text:'',
    zone:zEl?zEl.options[zEl.selectedIndex].text:'',
    idv:ct!=='TP'?Math.round(idv).toLocaleString('en-IN'):'N/A',
    age:$('pcAgeDisplay')?$('pcAgeDisplay').value:'—',
    ncbPct,
    od:{show:ct!=='TP',base:baseOD,discOD:odDiscAmt,discNCB:ncbAmt,net:netOD,
        elec:elecPrem,nonElec:nonElecPrem,tow:towPrem,geo:0,gvwLoad:0,otLoad:0,imt23:0,spFactor:null,acc:0},
    tp:{show:ct!=='SAOD',base:tp,hev:hevDisc,pa,pillion:0,ll,llEmp:0,geo:0},
    addons:{items:_adLines,total:addons},
    gst:{split:false,total:grand-Math.round(netOD+netTP+pa+ll+addons+elecPrem+nonElecPrem+towPrem)},
    grand, cov, policyMonths:12
  });
}

/* ══════════════════════════════════════════════
   COMMERCIAL VEHICLE LOGIC
══════════════════════════════════════════════ */
const CV_BANNERS={
  PKG:'Package Policy: Own Damage + Third Party Liability + Compulsory PA. Add-on covers available.',
  TP:'TP Only: Third Party Liability + Compulsory PA. No Own Damage. No add-ons.'
};
const cvCovType=()=>{var el=document.querySelector('input[name=cvCov]:checked');return el?el.value:'PKG';};

function cvCovChange(){
  const ct=cvCovType();
  const b=$('cvCovBanner'); if(b) b.textContent=CV_BANNERS[ct];
  const pill=$('cvQpPill'); if(pill) pill.textContent=ct==='PKG'?'Package':'TP Only';
  sd('cvIdvField',ct!=='TP'); sd('cvQColOD',ct!=='TP');
  sd('cvOdDiscBlock',ct!=='TP'); sd('cvImt23Block',ct!=='TP');
  sd('cvElecBlock',ct!=='TP'); sd('cvTowingBlock',ct!=='TP');
  sd('cvPaBlock',true); sd('cvLlBlock',true);
  ct==='TP'?show('cvTpNotice'):hide('cvTpNotice');
  cvRefreshAddons();
}

function cvClassChange(){
  const cl=$('cvClass').value;
  const isGoods=['A1','A2','A3','A4'].includes(cl);
  const isPass=['C1a','C1b','C2','C3'].includes(cl);
  const isD=cl==='D';
  sd('cvGoodsFields',isGoods); sd('cvPassFields',isPass); sd('cvClassDFields',isD);
  sd('cvOverturningBlock',isD); sd('cvLlEmpBlock',!isD);
  const isBus=cl==='C2';
  sd('cvBusTypeField',isBus); sd('cvPassCapField',isPass);
  cvUpdatePassDisplay();
  cvRefreshAddons();
}

function cvUpdatePassDisplay(){
  const cl=$('cvClass')?.value||'';
  const isPass=['C1a','C1b','C2','C3'].includes(cl);
  const hint=$('cvPassDerivedHint');
  if(!hint) return;
  if(!isPass){ hint.style.display='none'; return; }
  const rcSeats=parseInt($('cvRCSeats')?.value)||0;
  const llP=parseInt($('cvLLDriverPersons')?.value)||0;
  const passTp=Math.max(1, rcSeats - llP);
  const valEl=$('cvPassDerivedVal');
  if(valEl) valEl.textContent=passTp+' ('+rcSeats+' RC − '+llP+' crew)';
  hint.style.display='block';
}

function cvFuelChange(){
  const ft=$('cvFuelType').value;
  sd('cvKwFieldWrap',ft==='ev'); sd('cvCcFieldWrap',ft!=='ev');
  sd('cvCngKitField',ft==='cng_kit'); sd('cvCngKitPassField',ft==='cng_kit');
}

function cvUpdateAge(){
  const r=$('cvRegDate').value, p=$('cvPolDate').value;
  const warn=$('cvAgeWarn');
  if(r&&p){
    const m=Math.max(0,Math.ceil((new Date(p)-new Date(r))/(1000*60*60*24*30.44)));
    const disp=$('cvAgeDisplay'); if(disp) disp.value=m+' months ('+(m/12).toFixed(1)+' yrs)';
    const yr=$('cvAgeYr'); if(yr) yr.value=(m/12).toFixed(3);
    let br=1;
    if(m<=60)br=1; else if(m<=84)br=2; else br=3;
    const abr=$('cvAgeBr'); if(abr) abr.value=br;
    // Age-based policy warnings (as per IRDAI/Underwriting guidelines)
    if(warn){
      if(m>360){warn.style.display='block';warn.style.borderColor='#dc2626';warn.style.background='#fee2e2';warn.style.color='#991b1b';warn.innerHTML='⛔ <strong>Package Policy NOT allowed</strong> for vehicles older than 30 years. Only TP policy can be issued.';}
      else if(m>240){warn.style.display='block';warn.style.borderColor='#f59e0b';warn.style.background='#fef9c3';warn.style.color='#92400e';warn.innerHTML='⚠️ <strong>Age 20–30 Years:</strong> Package Policy requires Prior HO Approval + Valid Fitness Certificate / RC + NCB + Own Renewal only. <strong>Imposed Excess: 7.5% of IDV (minimum ₹7,500/-)</strong>';}
      else if(m>180){warn.style.display='block';warn.style.borderColor='#f59e0b';warn.style.background='#fef9c3';warn.style.color='#92400e';warn.innerHTML='⚠️ <strong>Age 15–20 Years:</strong> Package Policy can only be accepted with NCB &amp; Valid Fitness Certificate / RC at Risk Acceptance.';}
      else{warn.style.display='none';}
    }
  } else {
    const disp=$('cvAgeDisplay'); if(disp) disp.value='—';
    const abr=$('cvAgeBr'); if(abr) abr.value=1;
    const yr=$('cvAgeYr'); if(yr) yr.value=0;
    if(warn) warn.style.display='none';
  }
  cvRefreshAddons();
}

function cvGeoToggle(){
  const on=$('cvGeoExt')&&$('cvGeoExt').checked;
  const oh=$('cvGeoODPrem'); if(oh) oh.value=on?400:0;
  const th=$('cvGeoTPPrem'); if(th) th.value=on?100:0;
}

function cvRefreshAddons(){
  const ct=cvCovType();
  const cl=$('cvClass')?.value||'A1';
  const isPass=['C1a','C1b','C2','C3'].includes(cl);
  const yrF=parseFloat($('cvAgeYr')?.value)||0;
  // RTI, engine protect, key protect, tyre alloy — passenger only
  const passOnly=['rti','engineProtect','keyProtect','tyreAlloy'];
  document.querySelectorAll('#cvSection .addon-card').forEach(card=>{
    const id=card.id.replace('cv_card_','');
    const allow=(card.dataset.allow||'PKG').split(',');
    const maxYr=parseFloat(card.dataset.maxyr)||999;
    const covOk=allow.includes(ct);
    const passOk=!passOnly.includes(id)||isPass;
    const ageOk=yrF<=maxYr;
    if(!covOk||!passOk) card.classList.add('cov-hidden');
    else if(!ageOk){card.classList.remove('cov-hidden','active');card.classList.add('age-disabled');}
    else card.classList.remove('cov-hidden','age-disabled');
  });
}

function cvCardToggle(id){
  const chk=$('cv_'+id), card=$('cv_card_'+id);
  if(card) card.classList.toggle('active',!!chk&&chk.checked);
}

function calculateCV(){
  cvUpdateAge();
  const ct=cvCovType(), cl=$('cvClass').value;
  const zone=$('cvZone').value, ft=$('cvFuelType').value;
  const br=parseInt($('cvAgeBr').value)||1;
  const yrF=parseFloat($('cvAgeYr')?.value)||0;
  const idv=ct!=='TP'?getV('cvIDV'):0;
  const ncbPct=parseFloat($('cvNCB').value)||0;
  const isGoods=['A1','A2','A3','A4'].includes(cl);
  const isPass=['C1a','C1b','C2','C3'].includes(cl);
  const isD=cl==='D';

  // GVW from single exact field — used for both TP band and OD loading
  const exactGVW=isGoods?(getV('cvExactGVW')||1):0;
  const gvwBand=exactGVW<=7500?'u7500':exactGVW<=12000?'7500to12000':exactGVW<=20000?'12000to20000':exactGVW<=40000?'20000to40000':'over40000';

  let baseOD=0, gvwLoad=0, otLoad=0;
  if(ct!=='TP'){
    // OD rate tables — fixed Zone A C1a (unscrambled), Zone A/B C1b (swapped), A1 Zone A >7yr (1.893), added A2/A4
    const gR={
      A1:{A:[1.751,1.795,1.893],B:[1.743,1.787,1.830],C:[1.726,1.770,1.812]},
      A2:{A:[1.226,1.257,1.287],B:[1.220,1.251,1.281],C:[1.208,1.239,1.268]},
      A3:{A:[1.664,1.706,1.747],B:[1.656,1.697,1.739],C:[1.640,1.681,1.722]},
      A4:{A:[1.165,1.194,1.223],B:[1.159,1.188,1.217],C:[1.148,1.177,1.205]}
    };
    const c1aR={
      A:{under1000:[3.284,3.366,3.448],'1000to1500':[3.448,3.534,3.620],over1500:[3.612,3.703,3.793]},
      B:{under1000:[3.191,3.271,3.351],'1000to1500':[3.351,3.435,3.519],over1500:[3.510,3.598,3.686]}
    };
    const c1bR={A:[1.278,1.310,1.342],B:[1.272,1.304,1.336],C:[1.260,1.292,1.328]};
    const c2R={A:[1.680,1.722,1.764],B:[1.672,1.714,1.756],C:[1.656,1.697,1.739]};
    const c2Fix={'7to18':350,'19to36':450,'37to60':550,'over60':680};
    const c3R={A:[1.785,1.830,1.874],B:[1.777,1.821,1.866],C:[1.759,1.803,1.847]};
    const dR={A:[1.208,1.238,1.268],B:[1.202,1.232,1.262],C:[1.190,1.220,1.250]};
    const abi=br-1;

    if(isGoods){
      const r=(gR[cl]&&gR[cl][zone])?gR[cl][zone][abi]||0:0;
      baseOD=(r/100)*idv;
      if(exactGVW>12000){
        gvwLoad=Math.max(0,Math.ceil((exactGVW-12000)/100)*27);
        baseOD+=gvwLoad;
      }
    } else if(cl==='C1a'){
      const cc=$('cvCC').value;
      const zk=zone==='A'?'A':'B';
      const r=(c1aR[zk]&&c1aR[zk][cc])?c1aR[zk][cc][abi]||0:0;
      baseOD=(r/100)*idv;
    } else if(cl==='C1b'){
      const r=c1bR[zone]?c1bR[zone][abi]||0:0;
      baseOD=(r/100)*idv;
    } else if(cl==='C2'){
      const r=c2R[zone]?c2R[zone][abi]||0:0;
      const cap=parseInt($('cvRCSeats').value)||20;
      const band=cap<=18?'7to18':cap<=36?'19to36':cap<=60?'37to60':'over60';
      baseOD=c2Fix[band]+((r/100)*idv);
    } else if(cl==='C3'){
      const r=c3R[zone]?c3R[zone][abi]||0:0;
      baseOD=(r/100)*idv;
    } else if(isD){
      const r=dR[zone]?dR[zone][abi]||1.20:1.20;
      baseOD=(r/100)*idv;
      const otCb=$('cvOverturning');
      if(otCb&&otCb.checked){otLoad=Math.max(100,(0.5/100)*idv);baseOD+=otLoad;}
    }

    if(ft==='cng_kit'){
      const kv=getV(isGoods?'cvCngKitVal':'cvCngKitPassVal');
      baseOD+=kv>0?kv*0.04:baseOD*0.05;
    }

    const discPct=Math.min(100,getV('cvOdDisc'));
    const odDiscAmt=baseOD*(discPct/100);
    const afterBasic=Math.max(0,baseOD-odDiscAmt);
    const ncbAmt=(ncbPct/100)*afterBasic;
    var finalOdDisc=odDiscAmt, finalNcb=ncbAmt;
    var netOD=Math.max(0,afterBasic-ncbAmt);
    const setT=(id,v)=>{const e=$(id);if(e)e.textContent=v;};
    setT('cv_lbl_baseOD',(baseOD-gvwLoad-otLoad).toFixed(2));
    setT('cv_lbl_gvwLoad',gvwLoad.toFixed(2));setT('cv_lbl_otLoad',otLoad.toFixed(2));
    setT('cv_lbl_odDisc',odDiscAmt.toFixed(2));setT('cv_lbl_ncbDisc',ncbAmt.toFixed(2));
    setT('cv_lbl_netOD',netOD.toFixed(2));
    sd('cv_gvwRow',gvwLoad>0);sd('cv_otRow',otLoad>0);
  } else {
    var netOD=0, finalOdDisc=0, finalNcb=0;
    const setT=(id,v)=>{const e=$(id);if(e)e.textContent=v;};
    ['cv_lbl_baseOD','cv_lbl_gvwLoad','cv_lbl_otLoad','cv_lbl_odDisc','cv_lbl_ncbDisc','cv_lbl_netOD'].forEach(id=>setT(id,'0.00'));
  }

  const llP=parseInt($('cvLLDriverPersons').value)||1;

  let tp=0, hevDisc=0;
  {
    // TP rate lookup — uses gvwBand derived from exact GVW above
    const gTP={u7500:{diesel:16049,ev:13642},'7500to12000':{diesel:27186,ev:23108},'12000to20000':{diesel:35313,ev:30016},'20000to40000':{diesel:43950,ev:37357},over40000:{diesel:44242,ev:37606}};
    const fk=ft==='ev'?'ev':'diesel';
    if(cl==='A1'||cl==='A2'){
      // A2 uses same GVW-based TP table as A1
      const g=gTP[gvwBand]; tp=g?(g[fk]||16049):16049;
    } else if(cl==='A3'){
      tp=ft==='ev'?3139:4492;
    } else if(cl==='A4'){
      tp=ft==='ev'?3211:3922;
    } else if(cl==='C1a'){
      // Passenger TP = RC seats − LL crew (driver/cleaner/conductor)
      const pass=Math.max(1,(parseInt($('cvRCSeats').value)||4)-llP);
      const cc=$('cvCC').value;
      if(ft==='ev'){const kw=$('cvKW').value;const eb=kw==='under30'?5134:kw==='30to65'?6749:8945;const ep=kw==='under30'?988:kw==='30to65'?831:949;tp=eb+ep*(pass-1);}
      else{const b=cc==='under1000'?6040:cc==='1000to1500'?7940:10523;const p=cc==='under1000'?1162:cc==='1000to1500'?978:1117;tp=b+p*(pass-1);}
    } else if(cl==='C1b'){
      const pass=Math.max(1,(parseInt($('cvRCSeats').value)||3)-llP);
      const b=ft==='ev'?1539:2371, p=ft==='ev'?737:1134;
      tp=b+p*(pass-1);
    } else if(cl==='C2'){
      // OD banding uses full RC seats; TP uses seats minus LL crew
      const pass=Math.max(1,(parseInt($('cvRCSeats').value)||20)-llP);
      const tpP=Math.max(0,pass-1);
      const bt=$('cvBusType').value;
      if(ft==='ev') tp=(bt==='educational'?10363:bt==='school'?13177:12192)+((bt==='educational'?633:bt==='school'?806:745)*tpP);
      else tp=(bt==='educational'?12192:bt==='school'?15502:14343)+((bt==='educational'?745:bt==='school'?948:877)*tpP);
    } else if(cl==='C3'){
      const pass=Math.max(1,(parseInt($('cvRCSeats').value)||10)-llP);
      tp=ft==='ev'?(5749+1147*(pass-1)):(6763+1349*(pass-1));
    } else if(isD){
      tp=$('cvClassDType').value==='type1'?1645:7267;
    }
    if(ft==='cng_kit') tp+=60;
    if(ft==='hev') hevDisc=tp*0.075;
  }
  const netTP=tp-hevDisc;

  const pa=$('cvCompPA').checked?275:0;
  const llDrvCb=$('cvLLDriver');
  const llDrv=llDrvCb&&llDrvCb.checked?50*llP:0;
  const llEmpCb=$('cvLLEmployee');
  const llEmp=llEmpCb&&llEmpCb.checked?50:0;

  const months=Math.min(12,Math.max(1,parseInt($('cvPolicyMonths').value)||12));
  const effM=ct==='TP'?12:months;
  let spF=1;
  if(effM<=1)spF=.20;else if(effM<=2)spF=.30;else if(effM<=3)spF=.40;
  else if(effM<=4)spF=.50;else if(effM<=5)spF=.60;else if(effM<=6)spF=.70;
  else if(effM<=7)spF=.80;else if(effM<=8)spF=.90;else spF=1;
  const isShort=effM<12&&ct!=='TP';
  const spLbl=$('cvSpLabel');
  if(spLbl){
    if(isShort){spLbl.style.display='block';spLbl.textContent=`Short period: ${effM} month${effM>1?'s':''} → ${(spF*100).toFixed(0)}% of annual OD premium`;}
    else spLbl.style.display='none';
  }

  const netOD_sp=netOD*spF;
  const imt23Cb=$('cvIMT23');
  const imt23Base=imt23Cb&&imt23Cb.checked?baseOD*0.15:0;
  const imt23=imt23Base*(1-Math.min(100,getV('cvOdDisc'))/100)*spF;
  const cvOdFactor=ct!=='TP'&&baseOD>0?netOD/baseOD:1;
  const elecPrem=ct!=='TP'?getV('cvElecVal')*0.04*cvOdFactor:0;
  const nonElecPrem=ct!=='TP'?getV('cvNonElecVal')*0.04*cvOdFactor:0;
  const towAmt=getV('cvTowingAmt');
  const towPrem=ct!=='TP'?(Math.min(towAmt,10000)*0.05+Math.max(0,Math.min(towAmt,20000)-10000)*0.075):0;
  const netTP_sp=netTP*spF;
  const geoExt=$('cvGeoExt')&&$('cvGeoExt').checked;
  const geoOD=geoExt&&ct!=='TP'?400:0;  // fixed rate, no OD discount applied
  const geoTP=geoExt?100:0;
  // Short-period factor applied to TP-category items (basic TP already in netTP_sp); geoTP charged in full
  const llDrv_sp=llDrv*spF;
  const llEmp_sp=llEmp*spF;
  const pa_sp=pa*spF;

  let addons=0; const cov=[]; const _adLines=[];
  if(ct!=='TP') cov.push('Own Damage Cover');
  cov.push('Third Party Liability');
  if(pa) cov.push('Owner-Driver PA — ₹15L');
  if(llDrv) cov.push('LL — Paid Driver/Crew');
  if(llEmp) cov.push('LL — Employees');
  if(isD&&$('cvOverturning')?.checked) cov.push('Overturning Risk Cover');
  const aOn2=id=>{const c=$('cv_'+id);return c&&!c.disabled&&c.checked;};
  const dsc2=id=>{const e=$('cv_disc_'+id);return e?Math.min(100,Math.max(0,getV('cv_disc_'+id))):0;};

  if(aOn2('nilDep')){
    // u7500: fixed 5-bracket (was missing yr4=1.14); 7500to20000 covers 7501–20000 kg; over40000: fixed order
    const nilR={u7500:[0.53,0.70,0.89,1.14,1.49],'7500to20000':[0.71,0.90,1.12,1.44,1.88],'20000to40000':[0.47,0.64,0.84,1.07,1.40],over40000:[0.96,1.27,1.61,2.07,2.71],C1a_C2:[1.02,1.54,2.05,2.66,3.51],other_pass:[0.29,0.44,0.59,0.76,1.01]};
    let nk=isGoods?(gvwBand==='u7500'?'u7500':gvwBand==='over40000'?'over40000':gvwBand==='20000to40000'?'20000to40000':'7500to20000'):(cl==='C1a'||cl==='C2')?'C1a_C2':'other_pass';
    const yrBr=Math.min(Math.ceil(yrF||1),5);
    const rate=(nilR[nk]||nilR.u7500)[yrBr-1]||0;
    const _a=((rate/100)*idv)*(1-dsc2('nilDep')/100);addons+=_a;_adLines.push({l:'Nil Depreciation',a:_a});cov.push('Nil Depreciation');
  }
  if(aOn2('consumables')){
    const yrBr=Math.min(Math.ceil(yrF||1),5);
    const r=[0.14,0.16,0.18,0.21,0.25][yrBr-1]||0.14;
    const _a=((r/100)*idv)*(1-dsc2('consumables')/100);addons+=_a;_adLines.push({l:'Consumables Cover',a:_a});cov.push('Consumables');
  }
  if(isPass){
    if(aOn2('rti')){const yrBr=Math.min(Math.ceil(yrF||1),3);const r=[0.25,0.49,0.75][yrBr-1]||0;const _a=((r/100)*idv)*(1-dsc2('rti')/100);addons+=_a;_adLines.push({l:'Return to Invoice',a:_a});cov.push('RTI');}
    if(aOn2('engineProtect')){const yrBr=Math.min(Math.ceil(yrF||1),5);const r=[0.30,0.42,0.45,0.52,0.60][yrBr-1]||0;const _a=((r/100)*idv)*(1-dsc2('engineProtect')/100);addons+=_a;_adLines.push({l:'Engine Protect',a:_a});cov.push('Engine Protect');}
    if(aOn2('keyProtect')){addons+=375;_adLines.push({l:'Key Protect Cover',a:375});cov.push('Key Protect');}
    if(aOn2('tyreAlloy')){const yrBr=Math.min(Math.ceil(yrF||1),3);const r=[0.45,0.52,0.60][yrBr-1]||0;const _a=((r/100)*idv)*(1-dsc2('tyreAlloy')/100);addons+=_a;_adLines.push({l:'Tyre & Alloy Cover',a:_a});cov.push('Tyre & Alloy');}
  }
  if(aOn2('warRisk')){const v=Math.max(500,Math.round((netOD_sp+addons)*0.05));addons+=v;_adLines.push({l:'War Risk Cover (5% of net OD+addons, min ₹500)',a:v});cov.push('War Risk Cover');}

  const wrap=$('cvAddonsWrap');
  if(wrap){
    wrap.innerHTML=_adLines.length>0?_adLines.map(it=>`<div class="qrow acc-r" style="font-size:.73rem;padding:4px 0;border-bottom:1px dashed var(--border-lt)"><span class="qlbl">↳ ${it.l}</span><span class="qval">₹ ${it.a.toFixed(2)}</span></div>`).join('')
      :`<div class="qrow acc-r"><span class="qlbl">Add-on Covers</span><span class="qval">₹ 0.00</span></div>`;
    const tr=$('cvAddonsTotalRow'); if(tr) tr.style.display=_adLines.length>0?'flex':'none';
  }

  let grand, gstOD=0, gstTP=0;
  if(isGoods){
    const odP=netOD_sp+imt23+elecPrem+nonElecPrem+towPrem+geoOD+addons;
    const tpLiabilityP=netTP_sp+llDrv_sp+llEmp_sp+geoTP; // TP liability only — 5% GST
    // PA is a personal accident cover → 18% GST even for Goods vehicles
    gstOD=odP*0.18; gstTP=tpLiabilityP*0.05+pa_sp*0.18;
    const tpP=tpLiabilityP+pa_sp;
    grand=Math.round(odP+tpP+gstOD+gstTP);
  } else {
    const base=netOD_sp+netTP_sp+pa_sp+llDrv_sp+llEmp_sp+addons+imt23+elecPrem+nonElecPrem+towPrem+geoOD+geoTP;
    grand=Math.round(base*1.18);
  }

  const setT=(id,v)=>{const e=$(id);if(e)e.textContent=v;};
  setT('cv_lbl_tp',isShort?tp.toFixed(2)+' → ₹'+netTP_sp.toFixed(2):netTP_sp.toFixed(2));
  setT('cv_lbl_hevDisc',hevDisc.toFixed(2));setT('cv_lbl_pa',pa_sp.toFixed(2));
  setT('cv_lbl_llDriver',llDrv_sp.toFixed(2));setT('cv_lbl_llEmp',llEmp_sp.toFixed(2));
  setT('cv_lbl_addons',addons.toFixed(2));setT('cv_lbl_netOD',netOD.toFixed(2));
  setT('cv_lbl_imt23',imt23.toFixed(2));setT('cv_lbl_elec',elecPrem.toFixed(2));
  setT('cv_lbl_nonElec',nonElecPrem.toFixed(2));setT('cv_lbl_towing',towPrem.toFixed(2));
  setT('cv_lbl_geo',geoOD.toFixed(2));setT('cv_lbl_geo_tp',geoTP.toFixed(2));
  sd('cvSpRow',isShort);sd('cvSpNetRow',isShort);
  if(isShort){setT('cv_lbl_spFactor',(spF*100).toFixed(0)+'% ('+effM+' mths)');setT('cv_lbl_netOD_sp',netOD_sp.toFixed(2));}
  sd('cvImt23Row',imt23>0);sd('cvElecRow',elecPrem>0);sd('cvNonElecRow',nonElecPrem>0);
  sd('cvTowingRow',towPrem>0);sd('cvGeoRow',geoOD>0);sd('cvGeoTPRow',geoTP>0);
  sd('cv_hevRow',hevDisc>0);
  const gstLbl=$('cv_gst_lbl'), gstNote=$('cv_gst_note');
  if(isGoods){
    if(gstLbl) gstLbl.innerHTML='Total Premium<br>OD@18% + TP@5% GST';
    if(gstNote) gstNote.textContent=`OD GST ₹${Math.round(gstOD).toLocaleString('en-IN')} · TP GST ₹${Math.round(gstTP).toLocaleString('en-IN')}`;
  } else {
    if(gstLbl) gstLbl.innerHTML='Total Premium<br>Incl. 18% GST';
    if(gstNote) gstNote.textContent='All discounts applied';
  }
  const tpNote=$('cvTpFullNote'); if(tpNote) tpNote.style.display=isShort?'inline':'none';
  animateCounter('cv_lbl_grand',grand);

  // ── CV Agent Commission (Goods A1/A2/A3/A4 and Class D) ─────────
  {
    const sT=(id,v)=>{const e=$(id);if(e)e.textContent=v;};
    if(isGoods||isD){
      let odPct=0, tpPct=0, basis='', incentivePct=0, incentiveLabel='';
      if(isD){
        odPct=10; tpPct=2.5; basis='Misc & Special Types (Class D)';
        incentivePct=30;
        incentiveLabel='30% on Net OD+TP — Applicable only for Agricultural Tractor';
      } else if(exactGVW<=2000){
        odPct=50; tpPct=50; basis='GVW ≤2,000 kg';
      } else if(exactGVW<=7500){
        odPct=35; tpPct=25; basis='GVW 2,001–7,500 kg';
      } else {
        odPct=10; tpPct=2.5; basis='GVW >7,500 kg';
        if(exactGVW<=30000){ incentivePct=4; incentiveLabel='4% on Net OD+TP (GCV >7,500 & ≤30,000 kg)'; }
      }
      const commOD=(odPct/100)*(netOD_sp+addons);
      const commTP=(tpPct/100)*netTP_sp;
      const commBase=commOD+commTP;
      const incentive=(incentivePct/100)*(netOD_sp+addons+netTP_sp);
      const commGrand=commBase+incentive;
      sT('cvCommODPct',odPct); sT('cvCommTPPct',tpPct);
      sT('cvCommOD',commOD.toFixed(2)); sT('cvCommTP',commTP.toFixed(2));
      sT('cvCommTotal',commBase.toFixed(2));
      sT('cvCommBasis',basis);
      const inclEl=$('cvCommIncentive');
      if(inclEl) inclEl.innerHTML=`<strong>Incentive (${incentivePct}% on Net OD+TP):</strong> ₹ <span id="cvCommIncentiveAmt">${incentive.toFixed(2)}</span> &nbsp;·&nbsp; <strong>Total incl. incentive:</strong> ₹ <span id="cvCommGrandTotal">${commGrand.toFixed(2)}</span>${isD?'<br><span style="font-size:.74rem;margin-top:3px;display:block;color:#15803d">ℹ️ '+incentiveLabel+'</span>':''}`;
      sd('cvCommODRow',ct!=='TP'&&odPct>0);
      sd('cvCommTPRow',tpPct>0);
      sd('cvCommIncentive',incentivePct>0);
      sd('cvCommPanel',true);
    } else {
      sd('cvCommPanel',false);
    }
  }

  const clEl=$('cvClass'), zEl=$('cvZone');
  buildPrintDoc({
    mode:'CV',
    date:new Date().toLocaleDateString('en-IN',{day:'2-digit',month:'long',year:'numeric'}),
    custName:($('cvCustName')&&$('cvCustName').value)||'',
    regNo:($('cvRegNo')&&$('cvRegNo').value)||'',
    makeModel:($('cvMakeModel')&&$('cvMakeModel').value)||'',
    covType:ct==='PKG'?'Package Policy':'TP Only',
    vehType:'Commercial Vehicle',
    spec:clEl?clEl.options[clEl.selectedIndex].text:'',
    zone:zEl?zEl.options[zEl.selectedIndex].text:'',
    idv:ct!=='TP'?Math.round(idv).toLocaleString('en-IN'):'N/A',
    age:$('cvAgeDisplay')?$('cvAgeDisplay').value:'—',
    ncbPct,
    od:{show:ct!=='TP',base:(baseOD-gvwLoad-otLoad),gvwLoad,otLoad,discOD:finalOdDisc||0,discNCB:finalNcb||0,
        net:netOD||0,imt23,spFactor:isShort?spF:null,netSP:netOD_sp,
        elec:elecPrem,nonElec:nonElecPrem,tow:towPrem,geo:geoOD,acc:0},
    tp:{show:true,base:isShort?netTP_sp:tp,hev:isShort?0:hevDisc,pa:pa_sp,pillion:0,ll:llDrv_sp,llEmp:llEmp_sp,geo:geoTP},
    addons:{items:_adLines,total:addons},
    gst:{split:isGoods,odGst:Math.round(gstOD),tpGst:Math.round(gstTP),total:isGoods?Math.round(gstOD+gstTP):grand-Math.round(netOD_sp+netTP_sp+pa_sp+llDrv_sp+llEmp_sp+addons+imt23+elecPrem+nonElecPrem+towPrem+geoOD+geoTP)},
    grand, cov, policyMonths:effM
  });
}

// ─── BUILD PRINT DOC ───────────────────────────────────────────────────────
function buildPrintDoc(d){
  const ag=getAgent();
  const today=new Date();
  const validity=new Date(today); validity.setDate(validity.getDate()+30);
  const fmtD=dt=>dt.toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'});
  const cur=n=>n==null?'—':'₹'+Number(n).toLocaleString('en-IN',{minimumFractionDigits:0,maximumFractionDigits:2});
  const seq=String(today.getMonth()+1).padStart(2,'0')+String(today.getDate()).padStart(2,'0');
  const yr=String(today.getFullYear()).slice(-2);
  const quoteRef='NIA/SBL/M/'+yr+'-'+seq;
  const policyLabel=d.mode+' — '+(d.covType||'Package');

  let odRows='', tpRows='';
  const showOD=d.od&&d.od.show;
  const showTP=d.tp&&d.tp.show;
  const idvNum=d.idv&&d.idv!=='N/A'?Number(String(d.idv).replace(/,/g,'')):0;

  if(showOD){
    const o=d.od;
    odRows+=`<tr><td>Base OD <span class="val-sub">IDV ${idvNum?cur(idvNum):''}</span></td><td class="val">${cur(o.base)}</td></tr>`;
    if(o.gvwLoad)  odRows+=`<tr><td>GVW Loading</td><td class="val">${cur(o.gvwLoad)}</td></tr>`;
    if(o.otLoad)   odRows+=`<tr><td>Overturning Loading</td><td class="val">${cur(o.otLoad)}</td></tr>`;
    if(o.elec)     odRows+=`<tr><td>Elec. Accessories (4%)</td><td class="val">${cur(o.elec)}</td></tr>`;
    if(o.nonElec)  odRows+=`<tr><td>Non-Elec. Accessories (3%)</td><td class="val">${cur(o.nonElec)}</td></tr>`;
    if(o.tow)      odRows+=`<tr><td>Additional Towing</td><td class="val">${cur(o.tow)}</td></tr>`;
    if(o.acc)      odRows+=`<tr><td>Accessories</td><td class="val">${cur(o.acc)}</td></tr>`;
    if(o.discOD)   odRows+=`<tr class="disc-row"><td>OD Discount</td><td class="val">-${cur(Math.abs(o.discOD)).slice(1)}</td></tr>`;
    if(o.antiTheft)odRows+=`<tr class="disc-row"><td>Anti-theft Disc. (2.5%)</td><td class="val">-${cur(Math.abs(o.antiTheft)).slice(1)}</td></tr>`;
    if(o.discNCB)  odRows+=`<tr class="disc-row"><td>NCB (${d.ncbPct}%)</td><td class="val">-${cur(Math.abs(o.discNCB)).slice(1)}</td></tr>`;
    if(o.imt23)    odRows+=`<tr><td>IMT-23 Add-on (15%)</td><td class="val">${cur(o.imt23)}</td></tr>`;
    if(o.spFactor!=null){
      odRows+=`<tr><td>Net OD (annual)</td><td class="val">${cur(o.net)}</td></tr>`;
      odRows+=`<tr class="net-row"><td>NET OD PREMIUM</td><td class="val">${cur(o.netSP)}</td></tr>`;
    }else{
      odRows+=`<tr class="net-row"><td>NET OD PREMIUM</td><td class="val">${cur(o.net||o.netSP)}</td></tr>`;
    }
    if(d.addons&&d.addons.items&&d.addons.items.length){
      odRows+=`<tr class="sub-head"><td colspan="2">ADD-ON COVERS</td></tr>`;
      d.addons.items.forEach(it=>{odRows+=`<tr><td>${it.l}</td><td class="val">${cur(it.a)}</td></tr>`;});
      odRows+=`<tr class="net-row"><td>TOTAL ADD-ONS</td><td class="val">${cur(d.addons.total)}</td></tr>`;
    }
  }

  if(showTP){
    const t=d.tp;
    tpRows+=`<tr><td>Base TP Premium</td><td class="val">${cur(t.base)}</td></tr>`;
    if(t.hev)     tpRows+=`<tr class="disc-row"><td>HEV/EV Concession</td><td class="val">-${cur(Math.abs(t.hev)).slice(1)}</td></tr>`;
    if(t.pa)      tpRows+=`<tr><td>PA — Owner-Driver <span class="val-sub">GR-36A</span></td><td class="val">${cur(t.pa)}</td></tr>`;
    if(t.pillion) tpRows+=`<tr><td>PA — Pillion <span class="val-sub">GR-36B</span></td><td class="val">${cur(t.pillion)}</td></tr>`;
    if(t.ll)      tpRows+=`<tr><td>LL — Paid Driver <span class="val-sub">IMT-28</span></td><td class="val">${cur(t.ll)}</td></tr>`;
    if(t.llEmp)   tpRows+=`<tr><td>LL — Employees</td><td class="val">${cur(t.llEmp)}</td></tr>`;
    const netTP=(t.base||0)-(t.hev||0)+(t.pa||0)+(t.pillion||0)+(t.ll||0)+(t.llEmp||0);
    tpRows+=`<tr class="net-row"><td>NET TP PREMIUM</td><td class="val">${cur(netTP)}</td></tr>`;
    tpRows+=`<tr class="sub-head"><td colspan="2">TAXES</td></tr>`;
    if(d.gst.split){
      tpRows+=`<tr><td>GST on OD <span class="val-sub">18%</span></td><td class="val">${cur(d.gst.odGst)}</td></tr>`;
      tpRows+=`<tr><td>GST on TP <span class="val-sub">5%</span></td><td class="val">${cur(d.gst.tpGst)}</td></tr>`;
      tpRows+=`<tr class="net-row"><td>TOTAL GST</td><td class="val">${cur(d.gst.odGst+d.gst.tpGst)}</td></tr>`;
    }else{
      tpRows+=`<tr><td>GST <span class="val-sub">18%</span></td><td class="val">${cur(d.gst.total)}</td></tr>`;
    }
  }

  const pillsHTML=(d.cov||[]).map(c=>`<span class="q-pill">${c}</span>`).join('');
  const vehDesc=[d.vehType,d.spec,d.zone].filter(Boolean).join(' · ');

  const premHtml=(()=>{
    if(showOD&&showTP) return `<div class="q-two-col"><div class="q-col-od"><div class="col-head">OWN DAMAGE</div><table class="q-col-table"><tbody>${odRows}</tbody></table></div><div class="q-col-tp"><div class="col-head">THIRD PARTY <span class="col-head-sub">STATUTORY</span></div><table class="q-col-table"><tbody>${tpRows}</tbody></table></div></div>`;
    if(showOD) return `<div class="q-single-col"><div class="col-head">OWN DAMAGE</div><table class="q-col-table"><tbody>${odRows}</tbody></table></div>`;
    return `<div class="q-single-col"><div class="col-head">THIRD PARTY <span class="col-head-sub">STATUTORY</span></div><table class="q-col-table"><tbody>${tpRows}</tbody></table></div>`;
  })();

  const html='<!DOCTYPE html>\n<html lang="en"><head><meta charset="UTF-8">\n<title>Motor Insurance Premium Quotation</title>\n<style>'+_printCSS()+'</style>\n</head><body>\n<div class="page">\n'+
  '<div class="q-header"><div class="q-logo-wrap"><div class="q-brand"><h1>The New India</h1><p>Sambhal &middot; UP 38 &middot; Agency Office</p></div></div><div class="q-title-right"><div class="q-type">Motor Insurance</div><div class="q-title">Premium Quotation</div></div></div>\n'+
  '<div class="q-meta"><div class="q-meta-cell"><span class="mlabel">Quote Ref</span><div class="mval">'+quoteRef+'</div></div><div class="q-meta-cell"><span class="mlabel">Quote Date</span><div class="mval">'+fmtD(today)+'</div></div><div class="q-meta-cell"><span class="mlabel">Valid Till</span><div class="mval">'+fmtD(validity)+'</div></div><div class="q-meta-cell"><span class="mlabel">Policy</span><div class="mval">'+policyLabel+'</div></div></div>\n'+
  '<div class="q-parties"><div><div class="q-party-label">Prepared For</div><div class="q-customer-name">'+(d.custName||'Customer')+'</div>'+(d.regNo?'<div class="q-contact">Reg. No. &mdash; '+d.regNo+'</div>':'')+'</div><div class="q-agency-wrap"><div class="q-party-label">Prepared By</div><div class="q-agency-name">Sambhal (UP 38) Agency</div></div></div>\n'+
  '<div class="q-info-row"><div class="q-info-box"><span class="q-info-label">Make / Model</span><div class="q-info-val">'+(d.makeModel||'—')+'</div></div><div class="q-info-box"><span class="q-info-label">IDV</span><div class="q-info-val">'+(d.idv&&d.idv!=='N/A'?'₹'+d.idv:'N/A (TP Only)')+'</div></div><div class="q-info-box"><span class="q-info-label">NCB</span><div class="q-info-val">'+(d.ncbPct?d.ncbPct+'%':'—')+'</div></div><div class="q-info-box"><span class="q-info-label">Zone</span><div class="q-info-val">'+(d.zone||'—')+'</div></div></div>\n'+
  (vehDesc?'<div class="q-veh-desc">'+vehDesc+'</div>\n':'')+
  '<div class="q-section-head"><div class="sh-title">Premium Breakdown</div><div class="sh-bar"></div></div>\n'+
  premHtml+'\n'+
  '<div class="q-total-box"><div class="q-total-left"><div class="q-total-main-lbl">Total Premium Payable</div><div class="q-total-sub">Inclusive of GST &middot; OD + Add-ons + Third Party</div></div><div class="q-total-right"><div class="q-total-amt">₹'+Number(d.grand).toLocaleString('en-IN')+'</div><div class="q-total-save">per year &middot; incl. all taxes</div></div></div>\n'+
  '<div class="q-section-head" style="padding-top:10px"><div class="sh-title">Coverage Includes</div><div class="sh-bar"></div></div>\n'+
  '<div class="q-coverage">'+pillsHTML+'</div>\n'+
  '<div class="q-notes"><div>* TP premium is statutory (IRDAI) and non-negotiable.</div><div>* Add-on covers available on comprehensive policies only.</div><div>* Final premium subject to vehicle inspection and underwriting.</div><div>* GST applicable as per prevailing tax laws.</div><div>* This quotation does not constitute a contract of insurance.</div></div>\n'+
  '<div class="q-footer-bar">Computer-generated quotation &middot; The New India &mdash; Sambhal (UP 38) &middot; '+fmtD(today)+'</div>\n'+
  '</div><script>window.onload=()=>setTimeout(()=>window.print(),600);<\/script>\n</body></html>';

  _motorPrintHTML = html;
}

let _motorPrintHTML = '';
function motorOpenPrint() {
  if (!_motorPrintHTML) { alert('Please calculate premium first.'); return; }
  const w = window.open('','_blank','width=880,height=960');
  if (!w) { alert('Please allow popups to print the quotation.'); return; }
  w.document.write(_motorPrintHTML);
  w.document.close();
}


// ─── ANIMATE COUNTER ──────────────────────────────────────────────────────
function animateCounter(id,target){
  const el=$('lbl_'+id)||$(id);
  if(!el||!target) return;
  const start=0, dur=600, step=16;
  let cur=start, t=0;
  const tick=()=>{
    t+=step; cur=Math.round(target*(t/dur));
    if(t>=dur){ el.textContent='₹'+Math.round(target).toLocaleString('en-IN'); return; }
    el.textContent='₹'+cur.toLocaleString('en-IN');
    setTimeout(tick,step);
  };
  tick();
}

// ─── INIT ─────────────────────────────────────────────────────────────────
window.onload = function(){
  loadSettings();
};

