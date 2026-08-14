# Release Notes — AgroTrace Sprint 3 v3.0.0

Fecha: 2026-08-13

## Correcciones de Sprint 2

| Caso | Defecto reportado | Corrección aplicada |
|---|---|---|
| CP-NSAN-001 | Sin confirmación al guardar sin próxima fecha | Mensaje de éxito visible y aviso accesible. |
| CP-NSAN-002 | Sin confirmación al guardar con próxima fecha futura | Mensaje de éxito visible y actualización del historial. |
| CP-NSAN-003 | Sin confirmación cuando ambas fechas son iguales | Se acepta el límite y se confirma el registro. |
| CP-NSAN-004 | Permitía próxima fecha anterior | Se rechaza antes de modificar sanidad o historial. |
| CP-NMOV-001 | Movimiento válido sin mensaje final | Mensaje explícito de ubicación actualizada. |
| CP-NMOV-002 | Permitía origen distinto al predio actual | Se valida el predio actual y se bloquea sin cambios. |
| CP-NMOV-004 | No existía cancelación clara | Se agregó diálogo accesible con Cancelar y Confirmar. |

## Alcance consolidado de Sprint 3

- Alertas automáticas para fechas estrictamente anteriores al día actual.
- Reporte de stock derivado de los animales por predio.
- Reporte sanitario y exportaciones CSV con BOM UTF-8.
- Impresión del reporte mediante el navegador para guardar como PDF.
- Carga masiva transaccional por CSV y JSON.
- Rechazo total ante formato, duplicados o predios inexistentes.
- API mock local para animales, predios, vacunas, movimientos y controles.
- Selector de Administrador, Veterinario y Operador con aviso accesible.
- Navegación por teclado, foco visible y diseño responsive.

## Corrección adicional encontrada durante Sprint 3

El lector CSV dividía el texto buscando los caracteres literales `\\n` en vez
de saltos de línea reales. Se corrigió el parser a `\r?\n` y también la
generación de archivos CSV con finales de línea reales.

## Resultado técnico

- Sintaxis JavaScript: aprobada.
- Validaciones automatizadas DOM: 12 aprobadas, 0 fallidas.
- Playwright: scripts preparados; ejecución pendiente en un entorno con
  navegador Chromium instalado.
