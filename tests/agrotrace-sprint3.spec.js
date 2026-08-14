const {test,expect}=require('@playwright/test');

test.beforeEach(async({page})=>{
  await page.goto('/');
  page.once('dialog',dialog=>dialog.accept());
  await page.getByRole('button',{name:'Restaurar datos demo'}).click();
});

test('smoke: carga Sprint 3 v3.0.0',async({page})=>{
  await expect(page.getByRole('heading',{name:/AgroTrace Simulator QA/})).toBeVisible();
  await expect(page.getByText('Sprint 3 · v3.0.0')).toBeVisible();
});

async function openHealth(page){
  await page.getByRole('button',{name:'Vacunas y controles'}).click();
  await page.locator('#healthForm [name=animalId]').selectOption('a1');
  await page.locator('#healthForm [name=kind]').selectOption('Vacuna');
  await page.locator('#healthForm [name=description]').fill('Control QA');
}

test('S2 CP-NSAN-001 muestra confirmación sin próxima fecha',async({page})=>{
  await openHealth(page);
  await page.locator('#healthForm [name=date]').fill('2026-08-10');
  await page.locator('#healthForm [name=dueDate]').fill('');
  await page.locator('#healthForm button').click();
  await expect(page.locator('#healthMsg')).toContainText('Evento sanitario registrado');
});

test('S2 CP-NSAN-003 acepta fechas iguales y confirma',async({page})=>{
  await openHealth(page);
  await page.locator('#healthForm [name=date]').fill('2026-10-01');
  await page.locator('#healthForm [name=dueDate]').fill('2026-10-01');
  await page.locator('#healthForm button').click();
  await expect(page.locator('#healthMsg')).toHaveClass(/success/);
});

test('S2 CP-NSAN-004 rechaza fecha anterior sin registrar',async({page})=>{
  await openHealth(page);
  const before=await page.locator('#healthRows tr').count();
  await page.locator('#healthForm [name=date]').fill('2026-10-02');
  await page.locator('#healthForm [name=dueDate]').fill('2026-10-01');
  await page.locator('#healthForm button').click();
  await expect(page.locator('#healthMsg')).toContainText('no puede ser anterior');
  await expect(page.locator('#healthRows tr')).toHaveCount(before);
});

async function prepareMovement(page,origin='f1',destination='f2'){
  await page.getByRole('button',{name:'Movimientos'}).click();
  await page.locator('#movementForm [name=animalId]').selectOption('a1');
  await page.locator('#movementForm [name=originId]').selectOption(origin);
  await page.locator('#movementForm [name=destinationId]').selectOption(destination);
  await page.locator('#movementForm [name=date]').fill('2026-08-12');
}

test('S2 CP-NMOV-001 confirma movimiento y muestra mensaje',async({page})=>{
  await prepareMovement(page);
  await page.locator('#movementForm button').click();
  await page.getByRole('button',{name:'Confirmar movimiento',exact:true}).click();
  await expect(page.locator('#movementMsg')).toContainText('ubicación actualizada correctamente');
  await expect(page.locator('#movementRows')).toContainText('PR-OSO-002');
});

test('S2 CP-NMOV-002 bloquea origen distinto al actual',async({page})=>{
  await prepareMovement(page,'f2','f1');
  const before=await page.locator('#movementRows tr').count();
  await page.locator('#movementForm button').click();
  await expect(page.locator('#movementMsg')).toContainText('pertenece actualmente a PR-OSO-001');
  await expect(page.locator('#movementRows tr')).toHaveCount(before);
});

test('S2 CP-NMOV-004 permite cancelar sin cambios',async({page})=>{
  await prepareMovement(page);
  await page.locator('#movementForm button').click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.getByRole('button',{name:'Cancelar'}).click();
  await expect(page.locator('#movementMsg')).toContainText('No se realizaron cambios');
  await expect(page.locator('#movementRows')).toContainText('Sin movimientos');
});

test('S3 CP-NALE-001 muestra evento vencido',async({page})=>{
  await openHealth(page);
  await page.locator('#healthForm [name=date]').fill('2026-01-01');
  await page.locator('#healthForm [name=dueDate]').fill('2026-01-02');
  await page.locator('#healthForm button').click();
  await page.getByRole('button',{name:'Alertas sanitarias'}).click();
  await expect(page.locator('#alertRows')).toContainText('Control QA');
  await expect(page.locator('#alertRows')).toContainText('Vencido');
});

test('S3 CP-NREP-001 mantiene stock coherente tras movimiento',async({page})=>{
  await prepareMovement(page);
  await page.locator('#movementForm button').click();
  await page.getByRole('button',{name:'Confirmar movimiento',exact:true}).click();
  await page.getByRole('button',{name:'Reportes'}).click();
  const rows=page.locator('#stockRows tr');
  await expect(rows.nth(0)).toContainText('1');
  await expect(rows.nth(1)).toContainText('1');
});

test('S3 CP-NDAT-001 carga CSV transaccional válido',async({page})=>{
  await page.getByRole('button',{name:'Carga masiva'}).click();
  await page.locator('#bulkForm [name=format]').selectOption('csv');
  await page.locator('#bulkForm [name=content]').fill('code,farmCode\nCL-QA-1001,PR-OSO-001\nCL-QA-1002,PR-OSO-002\nCL-QA-1003,PR-OSO-001');
  await page.locator('#bulkForm button').click();
  await expect(page.locator('#bulkMsg')).toContainText('3 animales cargados correctamente');
});

test('S3 CP-NDAT-004 rechaza lote completo con duplicado',async({page})=>{
  await page.getByRole('button',{name:'Carga masiva'}).click();
  await page.locator('#bulkForm [name=content]').fill('code,farmCode\nCL-QA-2001,PR-OSO-001\nCL-OSO-0001,PR-OSO-002');
  await page.locator('#bulkForm button').click();
  await expect(page.locator('#bulkMsg')).toContainText('código duplicado');
  await page.getByRole('button',{name:'Animales'}).click();
  await expect(page.locator('#animalRows')).not.toContainText('CL-QA-2001');
});

test('S3 CP-NAPI-001 devuelve respuesta mock 200',async({page})=>{
  await page.getByRole('button',{name:'API mock'}).click();
  await page.locator('#apiForm [name=endpoint]').selectOption('/animals');
  await page.locator('#apiForm button').click();
  await expect(page.locator('#apiOutput')).toContainText('"status": 200');
  await expect(page.locator('#apiOutput')).toContainText('"mock": true');
});

test('S3 CP-NROL-001 cambia contexto y genera aviso',async({page})=>{
  await page.locator('#roleSelect').selectOption('vet');
  await expect(page.locator('#liveStatus')).toContainText('Veterinario');
});
