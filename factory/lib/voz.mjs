// voz.mjs — verificación del máster de Fish POR BLOQUE.
//
// ⛔ POR QUÉ EXISTE (medido en tfbduchapelo, 18-sep-2026):
// `fish_factory.py` sólo caza el loop de s2.1 por DURACIÓN (>1.5x / <0.6x). Eso deja pasar el otro
// defecto del proveedor: el bloque GARBLED, que sale con el largo correcto y adentro trae ruido
// silábico ("A que ven menta, ni mena pifuitas") o tramos mudos. Medido: b004 con dur/esperado 0.98
// y b001 con 1.02 — los dos basura. El ASR los transcribe con confianza de piso o directamente no
// oye nada, y recién ahí aparece el daño: anclaje 83 % y el guion sin la mitad de sus palabras.
//
// ⛔ Y EL CONTADOR DE BUCLES MENTÍA POR 20×: `detectarBucles` cuenta n-gramas de 6 palabras
// SOLAPADOS, así que UN solo tramo repetido 6 veces se reporta como 20 "bucles" (medido: t=1140,6 s
// era el único sitio real). Un número inflado 20× no es una compuerta: hace regenerar de más y
// esconde cuál es el tramo. Acá se cuentan SITIOS distintos, con su segundo.
//
// Las dos funciones son puras (words + manifest) y no cuestan una sola llamada de ASR extra:
// reusan la transcripción del máster que 20_asr ya hizo.

const txt = (w) => String(w.text ?? w.word ?? "").trim().toLowerCase();
const seg = (w) => (w.startMs != null ? w.startMs / 1000 : (w.start ?? w.ini ?? 0));

/**
 * Sitios REALES de bucle: una ventana de `n` palabras que se repite CONSECUTIVAMENTE.
 * Devuelve un sitio por tramo (no una fila por cada ventana solapada).
 */
export function sitiosDeBucle(words, { n = 6, minRep = 3 } = {}) {
  const W = words.map((w) => ({ t: seg(w), w: txt(w) })).filter((x) => x.w);
  const sitios = [];
  for (let i = 0; i + 2 * n <= W.length; i++) {
    const a = W.slice(i, i + n).map((x) => x.w).join(" ");
    let rep = 1, k = i + n;
    while (k + n <= W.length && W.slice(k, k + n).map((x) => x.w).join(" ") === a) { rep++; k += n; }
    if (rep >= minRep) { sitios.push({ segundo: +W[i].t.toFixed(1), veces: rep, texto: a }); i = k - 1; }
  }
  return sitios;
}

/**
 * Salud de cada bloque del máster, atribuyendo las palabras del ASR por ventana de tiempo
 * (el máster es la concatenación de los bloques en orden, así que el corte es exacto).
 *
 * garbled si: oyó menos del `minOidasPct` de las palabras que le tocan por tamaño,
 *          o  más del `maxConfBajaPct` de lo que oyó viene con confianza de piso.
 */
export function bloquesGarbled({ words, manifest, palabrasGuion, minOidasPct = 75, maxConfBajaPct = 15, confPiso = 0.25 }) {
  const ent = Object.entries(manifest);
  const charsTot = ent.reduce((a, [, v]) => a + (v.chars || 0), 0) || 1;
  const W = words.map((w) => ({ t: seg(w), c: w.confidence ?? null })).filter((x) => Number.isFinite(x.t));
  const hayConf = W.some((x) => x.c != null);
  let acc = 0;
  const filas = ent.map(([k, v]) => {
    const a = acc, b = acc + (v.dur || 0); acc = b;
    const dentro = W.filter((x) => x.t >= a && x.t < b);
    const esperadas = Math.max(1, Math.round((palabrasGuion * (v.chars || 0)) / charsTot));
    const oidasPct = Math.round((100 * dentro.length) / esperadas);
    const confBaja = hayConf && dentro.length ? Math.round((100 * dentro.filter((x) => x.c != null && x.c < confPiso).length) / dentro.length) : 0;
    const motivos = [];
    // un bloque de cola de 2 s tiene 3-4 palabras esperadas: ahí "oyó 0%" es ruido del método, no un defecto
    if (esperadas >= 8 && oidasPct < minOidasPct) motivos.push(`oyó ${oidasPct}% de sus palabras`);
    if (dentro.length > 20 && confBaja > maxConfBajaPct) motivos.push(`${confBaja}% con confianza <${confPiso}`);
    return { bloque: k, desde: +a.toFixed(1), hasta: +b.toFixed(1), oidasPct, confBaja, inflacion: +((v.dur || 0) / (v.esperado || 1)).toFixed(2), motivos };
  });
  return { filas, malos: filas.filter((f) => f.motivos.length), inspeccionados: filas.length };
}
