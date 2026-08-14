# AgroTrace Simulator QA — Sprint 3 v3.0.0

Versión construida a partir de la ejecución registrada en
`Casos_de_Prueba_AgroTrace_CTFL.xlsm`.

## Resultado entregado

- Se corrigieron los siete defectos abiertos identificados en Sanidad y
  Movimientos durante el Sprint 2.
- Se consolidó el alcance de Sprint 3: alertas, reportes, carga masiva,
  API mock, contexto de roles y mejoras de accesibilidad/UX.
- Se corrigió adicionalmente el procesamiento de saltos de línea en CSV.
- La validación automatizada local obtuvo 12/12 casos aprobados.

## Cómo abrir el producto

Abrir `AgroTrace_Simulator_QA_Sprint3.html` con Edge o Chrome. Es un archivo
autónomo y no requiere instalación.

## Cómo ejecutar la automatización

1. Abrir esta carpeta en VS Code.
2. Ejecutar `npm install`.
3. Para la validación local sin navegador, ejecutar `npm run test:dom`.
4. Para Playwright, ejecutar `npx playwright install chromium` y luego
   `npm test`.

La instalación del navegador Playwright no pudo completarse en el entorno de
generación. Los scripts se entregan listos para ejecutarse en el equipo local.

## Documentación

- `docs/RELEASE_NOTES_SPRINT_3.md`
- `docs/GUIA_RETEST_SPRINT_2_Y_QA_SPRINT_3.md`
- `docs/RESULTADO_VALIDACION_AUTOMATIZADA.json`

## Limitaciones declaradas

- El API es un mock local, no un servicio HTTP real.
- El selector de roles comunica contexto, pero no implementa autorización de
  seguridad porque la matriz de permisos sigue sin definición.
- La salida PDF depende del diálogo de impresión del navegador.
- Los resultados automáticos no reemplazan el retest manual ni la evidencia
  en Jira.
