# HANDOFF — mecaceite (Claudio el Mecánico #6 · serie "El auto de Doña Elena" ep. 6: los 9 errores después de cambiar el aceite)
Estado: ✅ ENTREGADO 8-oct (job 806, tarjeta plan-own-1791434693203-5 del row 311 → "Video listo · subir", sin YouTube).
mp4: https://github.com/bagasy-search/claudeyoutubevideos/releases/download/mecaceite/mecaceite.mp4?v=1 (15:26, 27.769 cuadros, sha256 b914422d…) · local D:/videosdeclaude/mecaceite_entrega.mp4.
Auditor: min1 34 cortes / 0 silencios · negro 0 · congelados 0 · -14,0 LUFS / TP -1,8. Farm 40 tramos fijos (FARM_FIXED_CHUNKS=1 + FARM_REF) + encfin 40.
Rama `mecaceite-render`, sale de `mecmillon-render` (en paralelo con mecvinagre y mecbebe; gotchas comunes en `git show mecvinagre-render:HANDOFF.md`).
Worktree en DESKTOP-CRNK37J: `D:/rtmp/wt-mecaceite`. **El ep. 7 (`mecnafta`) sale de la rama de integración `mec456-integracion`** (tiene el kit de los 3).

## Qué cambia respecto de mecmillon
- Guion `guiones/mecaceite_filmado.txt` 13.634 car (tú neutro) · Truco 6 de fixes.json = pág. 14. Los 9 errores de fixes.json (de más, de menos,
  grado, norma, filtro sin aceitar, goma vieja pegada, tapón sin arandela nueva, acelerar en frío, no revisar fugas) + la luz roja (apagar YA,
  no volver a arrancar, grúa) + resetear el aviso y la etiqueta + guardar la factura + el repaso de 5 minutos. Seguridad: nunca debajo del auto
  con sólo el gato (rampas o torres); el excedente se sacó con bomba por el tubo de la varilla. Loop del minuto 1: la luz de los segundos
  (pago ~8:54). Gancho al ep. 7 (`mecnafta`): Elena anota la gasolina en la libreta, va a cargar más seguido que Don Ernesto, y en la
  gasolinera Claudio ve "el error que hace casi todo el mundo cada vez que carga" (ClVideoRef th_mecnafta).
- Kit propio `src/claudio/ClMec_mecaceite.tsx`: ClDipstick (over/ok/low/how — ⛔ la PUNTA a la derecha: MIN cerca de la punta, MAX más arriba) ·
  ClCrankFoam (high/ok) · ClDoubleGasket (ok/double, three.js) · ClOilLabel (grade 0W-20 / norm API SP) · ClOilLight (red APAGA YA / amber) ·
  ClCrushWasher (new/reused). Banco `src/index_mekit_mecaceite.tsx` (27).
- La apertura es una foto de Claudio (gpt con su cara) mostrando la varilla chorreando: agnes-image sin ref no lograba "el aceite muy arriba"
  y metía a otra persona.

## Números
- Voz claudio_definitiva 17 bloques (regenerados b001 por continuidad, b012 "hace unas semanas", b015-b016 por largo), 927,8 s → 924,9 s.
  Alineación 0,976 + fix_wordms (3 tramos que Whisper se comió).
- Timeline 247 tomas · 27.769 cuadros (15:26) · minuto 1: 34 cortes, toma máx 3,1 s · cara a los 0,95 s.
- Avatar 54 ventanas, reel 237,2 s, US$0,25 (1 /run), lag -0,10..0 · avatar 24,3 % · real 28,2 % (stock 10,7 + camas 17,5) · agnes 3/9 (0,8 %).
- Imágenes 3 con cara (gpt) + 152 sin cara (agnes-image), 16 rehechas a ojo · stock 6 rondas (29 rechazados de una: duplicados con los otros
  dos videos) · sonido 228 efectos, 97 ambientes, -14,0 LUFS / TP -1,8.
- Manual: mención 1 ~3:14 (la frase, ClBookPage pág. 14) · 2 ~6:12 (ClBookPage pág. 14, "los 9 errores") · 3 ~14:17 (QR /r + US$27).

## Gotchas nuevos
- Continuidad: el aceite ya se había cambiado en el ep. 3 → en este ep. Elena lo ADELANTA antes de la playa (b001 regenerado).
- Pexels: "engine oil" trae una y otra vez la tapa "2.8L CRD" (Jeep) y consolas de lujo: rechazar. El % real salió con camas de consultas
  temáticas ("motor oil change", "mechanic under car", "oil drain pan") + 1 ronda de camas genéricas para los componentes sin cama.
