const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {JSDOM}=require('jsdom');

const html=fs.readFileSync(path.join(__dirname,'..','AgroTrace_Simulator_QA_Sprint3.html'),'utf8');

function app(){
  const dom=new JSDOM(html,{runScripts:'dangerously',url:'http://agrotrace.local/',pretendToBeVisual:true,beforeParse(window){
    window.confirm=()=>true;
    window.print=()=>{};
    window.URL.createObjectURL=()=> 'blob:test';
    window.URL.revokeObjectURL=()=>{};
    window.HTMLDialogElement.prototype.showModal=function(){this.open=true};
    window.HTMLDialogElement.prototype.close=function(){this.open=false};
  }});
  return dom.window;
}

function setValue(w,selector,value){
  const el=w.document.querySelector(selector);
  el.value=value;
  el.dispatchEvent(new w.Event('change',{bubbles:true}));
}

function submit(w,selector){
  w.document.querySelector(selector).dispatchEvent(new w.Event('submit',{bubbles:true,cancelable:true}));
}

function health(w,{date='2026-10-01',dueDate='',description='Control QA'}={}){
  setValue(w,'#healthForm [name=animalId]','a1');
  setValue(w,'#healthForm [name=kind]','Vacuna');
  setValue(w,'#healthForm [name=description]',description);
  setValue(w,'#healthForm [name=date]',date);
  setValue(w,'#healthForm [name=dueDate]',dueDate);
}

function movement(w,{origin='f1',destination='f2'}={}){
  setValue(w,'#movementForm [name=animalId]','a1');
  setValue(w,'#movementForm [name=originId]',origin);
  setValue(w,'#movementForm [name=destinationId]',destination);
  setValue(w,'#movementForm [name=date]','2026-08-12');
}

test('Sprint 2: confirma evento sanitario válido',()=>{
  const w=app();health(w);submit(w,'#healthForm');
  assert.match(w.document.querySelector('#healthMsg').textContent,/registrado en el historial/i);
});

test('Sprint 2: acepta fechas sanitarias iguales',()=>{
  const w=app();health(w,{date:'2026-10-01',dueDate:'2026-10-01'});submit(w,'#healthForm');
  assert.match(w.document.querySelector('#healthMsg').className,/success/);
});

test('Sprint 2: rechaza fecha sanitaria anterior sin alta',()=>{
  const w=app();const before=w.document.querySelectorAll('#healthRows tr').length;
  health(w,{date:'2026-10-02',dueDate:'2026-10-01'});submit(w,'#healthForm');
  assert.match(w.document.querySelector('#healthMsg').textContent,/no puede ser anterior/i);
  assert.equal(w.document.querySelectorAll('#healthRows tr').length,before);
});

test('Sprint 2: rechaza origen incorrecto sin movimiento',()=>{
  const w=app();movement(w,{origin:'f2',destination:'f1'});submit(w,'#movementForm');
  assert.match(w.document.querySelector('#movementMsg').textContent,/pertenece actualmente a PR-OSO-001/);
  assert.match(w.document.querySelector('#movementRows').textContent,/Sin movimientos/);
});

test('Sprint 2: cancelar confirmación conserva el estado',()=>{
  const w=app();movement(w);submit(w,'#movementForm');
  assert.equal(w.document.querySelector('#movementDialog').open,true);
  w.document.querySelector('#cancelMovement').click();
  assert.match(w.document.querySelector('#movementMsg').textContent,/No se realizaron cambios/);
  assert.match(w.document.querySelector('#movementRows').textContent,/Sin movimientos/);
});

test('Sprint 2: confirmar movimiento actualiza y avisa',()=>{
  const w=app();movement(w);submit(w,'#movementForm');w.document.querySelector('#confirmMovement').click();
  assert.match(w.document.querySelector('#movementMsg').textContent,/ubicación actualizada correctamente/);
  assert.match(w.document.querySelector('#movementRows').textContent,/PR-OSO-002/);
});

test('Sprint 3: genera alerta solo para fecha vencida',()=>{
  const w=app();health(w,{date:'2026-01-01',dueDate:'2026-01-02',description:'Evento vencido'});submit(w,'#healthForm');
  assert.match(w.document.querySelector('#alertRows').textContent,/Evento vencido/);
  assert.match(w.document.querySelector('#alertRows').textContent,/Vencido/);
});

test('Sprint 3: reporte recalcula stock tras movimiento',()=>{
  const w=app();movement(w);submit(w,'#movementForm');w.document.querySelector('#confirmMovement').click();
  const rows=[...w.document.querySelectorAll('#stockRows tr')].map(x=>x.textContent.replace(/\s+/g,' '));
  assert.match(rows[0],/1$/);assert.match(rows[1],/1$/);
});

test('Sprint 3: carga CSV válida crea tres animales',()=>{
  const w=app();setValue(w,'#bulkForm [name=format]','csv');
  setValue(w,'#bulkForm [name=content]','code,farmCode\nCL-QA-1001,PR-OSO-001\nCL-QA-1002,PR-OSO-002\nCL-QA-1003,PR-OSO-001');
  submit(w,'#bulkForm');assert.match(w.document.querySelector('#bulkMsg').textContent,/3 animales cargados correctamente/);
});

test('Sprint 3: duplicado rechaza el lote completo',()=>{
  const w=app();setValue(w,'#bulkForm [name=content]','code,farmCode\nCL-QA-2001,PR-OSO-001\nCL-OSO-0001,PR-OSO-002');
  submit(w,'#bulkForm');assert.match(w.document.querySelector('#bulkMsg').textContent,/código duplicado/i);
  assert.doesNotMatch(w.document.querySelector('#animalRows').textContent,/CL-QA-2001/);
});

test('Sprint 3: API mock retorna status 200',()=>{
  const w=app();setValue(w,'#apiForm [name=endpoint]','/animals');submit(w,'#apiForm');
  const result=JSON.parse(w.document.querySelector('#apiOutput').textContent);
  assert.equal(result.mock,true);assert.equal(result.status,200);assert.equal(result.endpoint,'/animals');
});

test('Sprint 3: selector de rol genera aviso accesible',()=>{
  const w=app();setValue(w,'#roleSelect','vet');
  assert.match(w.document.querySelector('#liveStatus').textContent,/Veterinario/);
});
