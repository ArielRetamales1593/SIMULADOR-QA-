# Guía de retest Sprint 2 y validación Sprint 3

## Preparación

1. Abrir `AgroTrace_Simulator_QA_Sprint3.html` en Edge.
2. Presionar **Restaurar datos demo** y aceptar.
3. Registrar fecha, tester, versión `v3.0.0` y evidencia en la matriz QA.

## Retest prioritario del Sprint 2

1. CP-NSAN-004: usar fecha aplicada `2026-10-02` y próxima fecha
   `2026-10-01`. Debe rechazarse y mostrar el motivo.
2. CP-NMOV-002: elegir CL-OSO-0001, origen PR-OSO-002 y destino PR-OSO-001.
   Debe bloquearse sin cambiar ubicación, stock o historial.
3. CP-NMOV-004: preparar un movimiento válido y presionar **Cancelar** en el
   diálogo. Debe conservarse el estado anterior.
4. Retestar CP-NSAN-001/002/003 y CP-NMOV-001 para confirmar los mensajes de
   éxito visibles.

## Validación del Sprint 3

- Alertas: ejecutar CP-NALE-001 a CP-NALE-003.
- Reportes: ejecutar CP-NREP-001 a CP-NREP-004.
- Carga masiva: ejecutar CP-NDAT-001 a CP-NDAT-006.
- API mock: ejecutar CP-NAPI-001 y CP-NAPI-002.
- Roles y UX: ejecutar CP-NROL-001/002 y CP-NUX-001/002.

## Evidencia mínima para Jira

- Captura del dato de entrada.
- Captura del mensaje o resultado.
- Confirmación de que tabla, stock e historial no cambiaron en pruebas
  negativas.
- Archivo CSV descargado cuando corresponda.
- Enlace al caso y al bug original.

## Criterio de cierre sugerido

Cerrar cada bug solo cuando el retest manual esté aprobado y su evidencia esté
enlazada. La validación automática de este paquete sirve como baseline técnico,
no como sustituto de la ejecución manual.
