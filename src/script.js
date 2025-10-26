// app.js — lógica del simulador y guardado local
document.addEventListener('DOMContentLoaded', () => {
  const pm25 = document.getElementById('pm25');
  const pm10 = document.getElementById('pm10');
  const temp = document.getElementById('temp');
  const pm25Val = document.getElementById('pm25Val');
  const pm10Val = document.getElementById('pm10Val');
  const tempVal = document.getElementById('tempVal');
  const icaOut = document.getElementById('ica');
  const icaFull = document.getElementById('icaFull');
  const log = document.getElementById('simLog');

  function calcICA_reduced(p){
    // ICA ≈ 23.52 + 2.236*PM2.5
    return 23.52 + 2.236 * p;
  }
  function calcICA_full(pm10v, pm25v, tv){
    // ICA = 23.52 - 0.0053*PM10 + 2.236*PM2.5 - 0.046*T
    return 23.52 - 0.0053*pm10v + 2.236*pm25v - 0.046*tv;
  }

  function refreshUI(){
    pm25Val.textContent = pm25.value;
    pm10Val.textContent = pm10.value;
    tempVal.textContent = temp.value;
    const ica = calcICA_reduced(Number(pm25.value));
    icaOut.textContent = ica.toFixed(2);
    const icaF = calcICA_full(Number(pm10.value), Number(pm25.value), Number(temp.value));
    icaFull.textContent = icaF.toFixed(2);
  }

  pm25.addEventListener('input', refreshUI);
  pm10.addEventListener('input', refreshUI);
  temp.addEventListener('input', refreshUI);
  refreshUI();

  document.getElementById('calcBtn').addEventListener('click', () => {
    const p = Number(pm25.value);
    const ica = calcICA_reduced(p);
    const msg = `PM2.5=${p} → ICA(reducido)=${ica.toFixed(2)} (ecuación: 23.52 + 2.236·${p})`;
    log.innerHTML = `<div>${msg}</div>` + log.innerHTML;
  });

  document.getElementById('consistencyBtn').addEventListener('click', () => {
    // Simule 5 escenarios: bajo, medio, alto, pico, feriado (bajo)
    const scenarios = [5, 12, 25, 45, 8];
    let out = '';
    scenarios.forEach(s => {
      const ica = calcICA_reduced(s);
      out += `PM2.5=${s} → ICA=${ica.toFixed(2)}\n`;
    });
    log.innerHTML = `<pre>${out}</pre>` + log.innerHTML;
  });

  // Guardar respuestas localmente
  document.getElementById('saveBtn').addEventListener('click', () => {
    const data = {
      b: document.getElementById('ansB').value,
      c: document.getElementById('ansC').value,
      d: document.getElementById('ansD').value,
      e: document.getElementById('ansE').value,
      f: document.getElementById('ansF').value,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem('ficha_modelo', JSON.stringify(data));
    document.getElementById('status').textContent = 'Respuestas guardadas en localStorage.';
  });

  document.getElementById('exportBtn').addEventListener('click', () => {
    const data = localStorage.getItem('ficha_modelo') || '{}';
    const blob = new Blob([data], {type:'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'ficha_modelo.json'; a.click();
    URL.revokeObjectURL(url);
  });

  // cargar guardado si existe
  const saved = localStorage.getItem('ficha_modelo');
  if(saved){
    try{
      const j = JSON.parse(saved);
      document.getElementById('ansB').value = j.b || '';
      document.getElementById('ansC').value = j.c || '';
      document.getElementById('ansD').value = j.d || '';
      document.getElementById('ansE').value = j.e || '';
      document.getElementById('ansF').value = j.f || '';
      document.getElementById('status').textContent = 'Ficha cargada desde localStorage.';
    }catch(e){}
  }
});
