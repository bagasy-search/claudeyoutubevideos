// build_cmegenerador.mjs — MONTAJE del video `cmegenerador` (Claudio Mendoza Constructor).
//   "Los Generadores para Toda la Casa son Carísimos. Haz Esto en su Lugar"
//
// Lee   _v3/cmegenerador_moments_ms.json  (micro-momentos YA anclados al ms por _v3/cmeg_anclar.py)
//     + _v3/cmegenerador_movs.json        (los 16 movimientos: anchor, actos y assets)
// Emite src/cmegenerador/{cues_cmegenerador.gen.tsx, Main_cmegenerador.tsx}
//     + src/index_cmegenerador.tsx + _cmegenerador_assets.txt
//
// ⛔ LO QUE NO SE TOCA (cada línea costó un render en los videos anteriores del canal):
//  · El AVATAR es el FONDO GARANTIZADO: base full SIEMPRE, y cada contenido cubre sólo su cobertura
//    real. Así nunca se ve fondo muerto (regla anti-hueco del pipeline).
//  · El avatar es PARCIAL (818,96 s de un video de ~25 min) -> va EN BUCLE desde LOOP_START. Después
//    de AVATAR_END el lipsync ya no vale: ahí el avatar es piso, nunca plano.
//  · El audio es UN SOLO <Audio> con el master completo y el <Video> del avatar va MUTEADO.
//  · El build NO re-ancla: consume los ms ya verificados (si re-anclara, los anchors ambiguos
//    mandarían un relleno 280 s antes, que ya pasó).
//  · COMPUERTA DE FPS: todo clip y el avatar a 30/1 CFR o hay TIRÓN en todo el metraje.
//  · Los ICONO van ENCIMA y NO ocultan la capa de abajo. Su duración sale del TEXTO, no del slot.
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const SLUG = "cmegenerador", COMP = "Cmegenerador", UP = "CMEGENERADOR";
const FPS = 30;
const AVATAR_S = 818.965;            // mp4 del avatar, medido con ffprobe
const AVATAR_END_MS = 818870;        // hasta acá el lipsync es REAL (última palabra de Whisper)
const LOOP_GAP_MS = 350;             // aire antes de que el mp4 vuelva a 0
const LOOP_START_MS = AVATAR_END_MS + LOOP_GAP_MS;

const FFPROBE = "C:/Users/bauti/AppData/Local/Microsoft/WinGet/Links/ffprobe.exe";
const probe = (rel, entries) => {
  try {
    return execFileSync(FFPROBE, ["-v", "error", "-select_streams", "v", "-show_entries",
      `stream=${entries}`, "-of", "csv=p=0", path.join("public", rel)], { encoding: "utf8" }).trim();
  } catch { return ""; }
};
const durDe = (rel) => {
  try {
    return parseFloat(execFileSync(FFPROBE, ["-v", "error", "-show_entries", "format=duration",
      "-of", "csv=p=0", path.join("public", rel)], { encoding: "utf8" }).trim()) || 0;
  } catch { return 0; }
};

// ── duración total = el wav master (⛔ nunca cortar la última frase) ────────────
const WAV_S = durDe(`${SLUG}.wav`);
if (!WAV_S) { console.error(`⛔ falta public/${SLUG}.wav (el master)`); process.exit(1); }
const TOTAL_S = WAV_S + 0.6;
const TOTAL_FRAMES = Math.ceil(TOTAL_S * FPS);
const f = (ms) => Math.round((ms / 1000) * FPS);

// ── entrada ────────────────────────────────────────────────────────────────────
const rd = (p) => JSON.parse(fs.readFileSync(p, "utf8").replace(/^\uFEFF/, ""));
const MM = rd("_v3/cmegenerador_moments_ms.json");
const MOVS = rd("_v3/cmegenerador_movs.json");


// ══ VARA DE EDICIÓN: LIMPIO Y PROFESIONAL ═════════════════════════════════════
// ⛔ Corrección del creador sobre el render entregado: "no se puede ver tranquilo de tanta edición
// basura, debe ser limpio y profesional". Medido en esa versión: movimientos 63 % del video, planos
// sueltos 30 %, y **44 de los 64 íconos caían ENCIMA de un movimiento** (gráfico sobre gráfico).
// Entraba un elemento nuevo cada 7,8 s durante 24 minutos y él aparecía solo el 7 % del tiempo.
// El grueso del video tiene que ser ÉL hablando; el gráfico puntúa, no carga.
// ⛔ SACAR MOVIMIENTOS ENTEROS NO SIRVE: sus tramos no tienen planos propios (a los directores de
// sección se les prohibió escribir ahí), así que dejan huecos de casi un minuto. Medido: quitar
// DiezAnos, Faltan y TresDias abría pozos de 54 y 57 s. Lo que sí sirve es CORTARLOS ANTES: el
// gráfico llega a su última idea, aterriza, y le devuelve la pantalla al que habla.
// ⛔⛔ SEGUNDA CORRECCIÓN DEL CREADOR, sobre la versión ya "limpia": *"la edición sigue siendo
// malísima — menos edición basura sobrecargada y más tomas completas reales y casuales de Claudio o
// de lo que explica"*. O sea: el problema no era la DENSIDAD, era la NATURALEZA de lo que se ve.
// Un gráfico animado —por bueno que sea— no es una toma; y 16 movimientos ocupando el 57 % del
// video hacen que casi nunca se vea ni a él ni a la cosa real de la que habla.
//
// Los tres cambios de esta pasada:
//  1. LOS MOVIMIENTOS SE CAEN POR NOMBRE, no todos por igual. Se quedan los que SON un mecanismo
//     (el ciclo del compresor, los tres números, la cuenta a diez años); se van enteros los que
//     eran una lista o una etiqueta leída en voz alta — eso se ve mejor con la foto de la cosa.
//  2. EL BANCO DE TOMAS REALES. Cada movimiento tiene 4-6 assets propios (foto + clip de 5,1 s)
//     que hoy viven ENCERRADOS dentro de una tarjeta de vidrio. Son exactamente la toma real de
//     lo que se está explicando en ese segundo. Los actos que se cortan LIBERAN sus assets, y
//     esos assets salen a PANTALLA COMPLETA a tapar el hueco que dejó el gráfico.
//  3. ANTES DEL BUCLE EL HUECO ES ÉL. Hasta 818,9 s el lipsync es real, así que un hueco no es un
//     defecto: es Claudio hablando a cámara, que es la toma más real y más casual que tiene el
//     video. Sólo se rellena si el hueco se pasa de TOPE_HABLA.
const MOV_ACTOS = {
  Papel: 3,          // el presupuesto que se desarma — abre el video
  Trescientos: 3,    // los 308 W en la pinza: LA cifra
  Desglose: 0,       // era una LISTA de seis piezas -> se ven las piezas
  DiezAnos: 2,
  Etiqueta: 0,       // era leer una etiqueta -> se ve la etiqueta
  Suma: 2,
  Faltan: 0,         // otra lista -> se ven los aparatos
  Ciclo: 3,          // EL CORAZÓN del video (8 de cada 30 minutos)
  DosPreguntas: 2,
  TresNumeros: 4,    // ⛔ NO TOCAR: 771->831 es lo único que tapa el salto del bucle en 818,9
  Escalones: 2,
  Llave: 2,
  TresDias: 0,
  Peligro: 3,        // las tres que matan — se queda entero por lo que es
  Cuenta: 3,         // 12.500 contra 1.900
  Cierre: 5,         // ⛔ NO TOCAR, ENTERO: el QR entra recién en el acto 4 (f1326)
};
const PLANOS_QUEDA = 0.52;
const TOPE_HABLA = 34;     // s hablando seguido a cámara antes de meter una toma
const RELLENO_MIN = 4.5;   // hueco (s) a partir del cual el banco entra a taparlo
// Los ÚNICOS rótulos que quedan: las cifras que SON el argumento del video. Por id, no por texto.
const ICONOS_CLAVE = new Set([
  "s1_h01",    // $9.400        el presupuesto
  "s1_e01",    // 22.000 vatios lo que le vendían
  "s1_e02",    // 70 veces más  la comparación que abre el video
  "s4_e22",    // 308 vatios    LA cifra
  "s4_e24",    // pico 1.450    el peor instante
  "s6_e03",    // 8 de cada 30  el corazón
  "s6_e09",    // 3 kWh por día lo que de verdad cuesta
  "s11_e19",   // $12.500       la cuenta a diez años
  "s11_e20",   // $1.900        lo que hicimos
  "s11_e21",   // $10.600       la diferencia
]);

// ⛔⛔ COMPUERTA DEL QR — costó un render entero. `MovCierre` dibuja el QR recién en el ACTO 4
// (QR_IN=f1326 ≈ 44 s dentro del movimiento) y lo deja clavado hasta el final. Cortar Cierre a 3
// actos lo borra del video **sin que falle nada**: compila, rinde en verde, blackdetect no lo ve, y
// el CTA del canal desaparece. Sólo se detecta decodificando el QR del mp4 ya rendido.
if ((MOV_ACTOS.Cierre ?? 9) < 4) {
  console.error("⛔ MovCierre con menos de 4 actos: el QR de la guía NO llega a entrar en pantalla.");
  process.exit(1);
}

const assets = new Set();
const faltan = [];
const existe = (rel) => fs.existsSync(path.join("public", rel));
const add = (rel) => { assets.add(rel); return rel; };

// ── los MOVIMIENTOS: UNA sola Sequence por movimiento, NO una por acto ─────────
// ⛔ Montar una <Sequence> por ACTO reinicia `useCurrentFrame()` en cada frontera, y con eso
// saltan el polvo de la atmósfera, la deriva de las tarjetas y el barrido especular — justo en
// la costura, que es lo único que este video no puede permitirse. Con una sola Sequence por
// movimiento el reloj interno corre continuo y `gFrame` coincide con el frame local.
// Los movimientos reciben `acto={0}` = "dibujá el movimiento entero": los dos que gatean por
// acto (MovPapel, MovEscalones) lo deducen de gFrame.
const actos = [];
const banco = [];   // tomas REALES liberadas por los actos que se cortaron
for (const [k, v] of Object.entries(MOVS)) {
  const nActos = MOV_ACTOS[k] ?? v.actos.length;
  const base = (MM.movimientos[k] ?? v.ms0 / 1000) * 1000;   // ms REAL del anchor
  const plan0 = v.ms0 / 1000;
  const usados = v.actos.slice(0, nActos);
  const cortados = v.actos.slice(nActos);
  if (usados.length) {
    const fin = Math.max(...usados.map((a) => a.to));
    actos.push({ id: `mv_${k}`, mov: `Mov${k}`, acto: 0, ms: base, dur: fin - plan0, ms0: base });
  }
  // ── EL BANCO ──────────────────────────────────────────────────────────────────
  // Los assets de un movimiento están escritos acto por acto: el asset i-ésimo pertenece al acto
  // i-ésimo (así los repartió el DIRECTOR). Cuando un acto se cae, su toma real queda libre, y su
  // hora sigue siendo la hora del acto: es la imagen de lo que él está diciendo AHÍ.
  const lista = v.assets || [];
  for (let i = 0; i < lista.length; i++) {
    const as = lista[i];
    const acto = v.actos[Math.min(i, v.actos.length - 1)];
    const libre = i >= usados.length || !usados.some((a) => a.n === acto.n);
    const foto = `img/${SLUG}/cmeg_mv_${as.n}.jpg`;
    const clip = `broll/${SLUG}/cmeg_mv_${as.n}.mp4`;
    if (!existe(foto)) faltan.push(foto); else add(foto);
    if (!existe(clip)) faltan.push(clip); else add(clip);
    if (!libre || !existe(foto)) continue;
    // el ms del acto, corrido por la MISMA deriva que el anchor del movimiento
    const msActo = base + (acto.from - plan0) * 1000;
    banco.push({ n: as.n, ms: msActo, foto, clip: existe(clip) ? clip : null, mov: k });
  }
  for (const [lam] of (v.laminas || [])) {
    const p = `img/${SLUG}/${lam}.png`;
    if (!existe(p)) faltan.push(p); else add(p);
  }
}
banco.sort((a, b) => a.ms - b.ms);
console.log(`banco de tomas reales liberadas: ${banco.length} (de ${Object.entries(MOV_ACTOS).filter(([, n]) => n === 0).length} movimientos caídos + los actos cortados)`);

// ── cues ───────────────────────────────────────────────────────────────────────
const cues = [];
for (const a of actos) {
  cues.push({ key: JSON.stringify(a.id), start: f(a.ms), dur: Math.round(a.dur * FPS), capa: "base",
    el: `<${a.mov} acto={${a.acto}} gFrame={frame - ${f(a.ms0)}} />` });
}
const movsUsados = [...new Set(actos.map((a) => a.mov))].sort();

// ⛔ Un micro-momento que caiga DENTRO del tramo de un movimiento lo partiría en dos: el tileo
// recorta cada cue al arranque del siguiente, así que un plano de 4 s clavado en el medio dejaría
// al movimiento de 60 s en 12. Los momentos que pisan un movimiento se DESCARTAN de la capa base
// (los ICONO no, que son overlay y flotan encima sin robar tiempo).
const tramos = actos.map((a) => [a.ms, a.ms + a.dur * 1000]);
const pisaMov = (ms) => tramos.some(([a, b]) => ms >= a - 200 && ms < b - 200);
let descartados = 0, iconosFuera = 0, iconosPuestos = 0, planosFuera = 0;

for (const e of MM.momentos) {
  const start = f(e.ms);
  const K = JSON.stringify(e.id);
  if (e.tipo !== "ICONO" && pisaMov(e.ms)) { descartados++; continue; }
  if (e.tipo === "CLIP") {
    const r = `broll/${SLUG}/${e.nombre}.mp4`;
    if (!existe(r)) { faltan.push(r); continue; }
    add(r);
    // ⛔ EL CLIP SE JUEGA ENTERO. Antes se recortaba al `dur` que había planeado el director de
    // sección (a veces 2 s), y una toma real cortada a los 2 s no es una toma: es un parpadeo.
    // "Tomas completas" = el clip corre sus 5,1 s salvo que el cue siguiente lo pise, y de eso se
    // encarga el piso entre arranques.
    const real = durDe(r);
    const cov = Math.max(2, Math.round((real - 0.1) * FPS));
    cues.push({ key: K, start, dur: cov, capa: "base", el: `<Clip src=${JSON.stringify(r)} />` });
  } else if (e.tipo === "FOTO") {
    const r = `img/${SLUG}/${e.nombre}.jpg`;
    if (!existe(r)) { faltan.push(r); continue; }
    add(r);
    // piso de 5 s: una foto que dura 3 s es un flash, no un plano.
    cues.push({ key: K, start, dur: Math.max(Math.round(5 * FPS), Math.round(e.dur * FPS)), capa: "base",
      el: `<Foto src=${JSON.stringify(r)} seed={${start}} />` });
  } else if (e.tipo === "ICONO") {
    // ⛔ NUNCA encima de un movimiento: el movimiento ya trae su propia tipografía y sus cifras.
    // Estampar un ícono ahí es texto sobre texto — 44 de los 64 lo hacían en la versión anterior.
    if (pisaMov(e.ms)) { iconosFuera++; continue; }
    // ...y de los que quedan, sólo las cifras que SON el argumento del video.
    if (!ICONOS_CLAVE.has(e.id)) { iconosFuera++; continue; }
    iconosPuestos++;
    const r = `img/${SLUG}/${e.icono}.png`;
    if (!existe(r)) { faltan.push(r); continue; }
    add(r);
    // ⛔ TIEMPO DE LECTURA: el piso sale del TEXTO, no del slot. 2,0 s + 0,28 s por palabra
    // arriba de 3. Los overlay FLOTAN: pueden pasarse del slot sin robarle tiempo a nadie.
    const pal = String(e.texto || "").trim().split(/\s+/).filter(Boolean).length;
    const piso = Math.round((2.0 + Math.max(0, pal - 3) * 0.28) * FPS);
    cues.push({ key: K, start, dur: Math.max(Math.round(e.dur * FPS), piso), capa: "over",
      el: `<IconoNum src=${JSON.stringify(r)} texto={${JSON.stringify(e.texto || "")}} />` });
  }
}

if (faltan.length) {
  console.error(`⛔ ${faltan.length} assets faltan en disco:`);
  [...new Set(faltan)].slice(0, 25).forEach((x) => console.error("   " + x));
  process.exit(1);
}

// ⛔⛔ COMPUERTA DE FPS — el defecto que NINGUNA otra compuerta ve (ni blackdetect, ni tsc, ni el
// auditor de visión, ni density_gate). Los clips a 24 y el avatar a 25 en una comp de 30 hacen que
// Remotion repita y saltee cuadros de forma IRREGULAR: TIRÓN en todo el metraje. Sólo se ve
// reproduciendo, y ya costó un video entero re-rendeado.
{
  const malos = [];
  for (const rel of [...assets].filter((a) => a.endsWith(".mp4")).concat([`${SLUG}_opt.mp4`])) {
    const r = probe(rel, "r_frame_rate");
    if (r !== `${FPS}/1`) malos.push(`${rel} -> ${r || "?"}`);
  }
  if (malos.length) {
    console.error(`⛔ ${malos.length} videos NO están a ${FPS}/1 CFR (tiemblan en la comp):`);
    malos.slice(0, 12).forEach((x) => console.error("   " + x));
    console.error("   Conformalos: minterpolate=fps=30:mi_mode=mci:mc_mode=aobmc:me_mode=bidir:vsbmc=1");
    process.exit(1);
  }
  console.log(`fps ✓ ${[...assets].filter((a) => a.endsWith(".mp4")).length} clips + el avatar a ${FPS}/1 CFR`);
}

// ── TILEO DE LA CAPA BASE ──────────────────────────────────────────────────────
//  1. RECORTAR al siguiente: un cue no puede seguir vivo después de que arranca el que sigue.
//  2. ESTIRAR para tapar huecos DESPUÉS del bucle: ahí el lipsync ya no coincide, así que cada
//     hueco es un instante con la boca desfasada. Antes del bucle el hueco está BIEN.
//  3. Cerrar los huecos de 1-2 frames: `start` y `dur` se redondean por separado, así que dos cues
//     que deberían ser contiguos dejan 33 ms de fondo asomando. `blackdetect` NO lo ve.
const LOOP_F = f(AVATAR_END_MS);
const TOPE_ESTIRO = Math.round(6.5 * FPS);   // ⛔ 11 s maquillaba la cobertura (93% falso vs 81% real)
// ⛔ ADELGAZAR LOS PLANOS SUELTOS. Con un plano cada 4 s el espectador no puede seguir al que
// habla: la imagen le pide la atención todo el tiempo. Se queda una fracción, repartida pareja
// (se descarta 1 de cada N), y el que queda se estira hasta el siguiente: el aire lo cubre ÉL.
// ⛔ Los MOVIMIENTOS nunca se tocan acá.
{
  const sueltos = cues.filter((c) => c.capa === "base" && !/^"?mv_/.test(c.key)).sort((a, b) => a.start - b.start);
  const paso = 1 / (1 - PLANOS_QUEDA);
  const fuera = new Set();
  let acc = 0;
  for (const c of sueltos) { acc += 1; if (acc >= paso) { acc -= paso; fuera.add(c.key); } }
  for (let i = cues.length - 1; i >= 0; i--) if (fuera.has(cues[i].key)) { cues.splice(i, 1); planosFuera++; }
}

let base = cues.filter((c) => c.capa === "base").sort((a, b) => a.start - b.start || a.dur - b.dur);

// ⛔ EL PLANO APLASTADO: dos momentos anclados a 1,5 s de distancia dejan al primero en 1,5 s, y con
// 18 de esos el % de planos >=5 s se cae aunque la mediana esté bien. No se arregla estirando (el
// tileo recorta igual): se arregla SACANDO el momento que aplasta. El anterior se estira solo hasta
// el siguiente, así que la cobertura no baja — sube la duración de los dos lados.
// ⛔ Un MOVIMIENTO nunca se descarta: manda él.
{
  const PISO = Math.round(4.0 * FPS);   // ⛔ 2,4 s dejaba 8 planos de menos de 3 s
  const out = [];
  let borrados = 0;
  for (const c of base) {
    const prev = out[out.length - 1];
    const esMov = /^mv_/.test(JSON.parse(c.key));
    if (prev && !esMov && c.start - prev.start < PISO) { borrados++; continue; }
    out.push(c);
  }
  console.log(`planos aplastados descartados: ${borrados} (piso ${(PISO / FPS).toFixed(1)}s entre arranques)`);
  base = out;
  const keep = new Set(base.map((c) => c.key));
  for (let i = cues.length - 1; i >= 0; i--) if (cues[i].capa === "base" && !keep.has(cues[i].key)) cues.splice(i, 1);
}
let recort = 0, recortF = 0, estir = 0, estirF = 0, micro = 0;
const tilear = () => {
  base.sort((a, b) => a.start - b.start);
  for (let i = 0; i < base.length; i++) {
    const sig = i + 1 < base.length ? base[i + 1].start : TOTAL_FRAMES;
    const fin = base[i].start + base[i].dur;
    if (fin > sig) { recortF += fin - sig; recort++; base[i].dur = Math.max(2, sig - base[i].start); }
    else if (fin < sig && base[i].start >= LOOP_F) {
      const h = sig - fin;
      if (h <= TOPE_ESTIRO) { estirF += h; estir++; base[i].dur = sig - base[i].start; }
    } else if (fin < sig && sig - fin <= 2) { micro++; base[i].dur = sig - base[i].start; }
  }
};
tilear();

// ── EL BANCO ENTRA A TAPAR LOS HUECOS ─────────────────────────────────────────
// Un hueco DESPUÉS del bucle es la boca desfasada: hay que taparlo sí o sí. Un hueco ANTES del
// bucle es Claudio hablando a cámara — la toma más real que tiene el video — y sólo se corta si
// se hace demasiado largo (TOPE_HABLA). Cada hueco se llena con las tomas del banco más cercanas
// EN EL TIEMPO, que son las que muestran lo que él está diciendo justo ahí.
{
  const usadas = new Set();
  const nuevos = [];
  const tomar = (msObj) => {
    let mejor = null, dist = Infinity;
    for (const b of banco) {
      if (usadas.has(b.n)) continue;
      const d = Math.abs(b.ms - msObj);
      if (d < dist) { dist = d; mejor = b; }
    }
    if (mejor) usadas.add(mejor.n);
    return mejor;
  };
  const huecos = () => {
    const ocup = new Uint8Array(TOTAL_FRAMES);
    for (const c of base) for (let x = c.start; x < Math.min(TOTAL_FRAMES, c.start + c.dur); x++) ocup[x] = 1;
    const out = []; let ini = -1;
    for (let x = 0; x <= TOTAL_FRAMES; x++) {
      const lleno = x >= TOTAL_FRAMES || ocup[x];
      if (!lleno && ini < 0) ini = x;
      if (lleno && ini >= 0) { out.push([ini, x]); ini = -1; }
    }
    return out;
  };
  for (const [a, b] of huecos()) {
    const largo = (b - a) / FPS;
    const post = a >= LOOP_F;
    if (post ? largo < RELLENO_MIN : largo <= TOPE_HABLA) continue;
    // post-bucle: se tapa entero. pre-bucle: se corta la charla con UNA toma en el medio.
    const slots = post ? Math.max(1, Math.round(largo / 8.5)) : 1;
    for (let k = 0; k < slots; k++) {
      const desde = post ? a + Math.round((b - a) * k / slots) : Math.round((a + b) / 2 - 3.5 * FPS);
      const hasta = post ? a + Math.round((b - a) * (k + 1) / slots) : desde + Math.round(7 * FPS);
      const t = tomar((desde / FPS) * 1000);
      if (!t) break;
      const slot = hasta - desde;
      // el CLIP sólo si entra completo (5,1 s): una toma real cortada a la mitad no es una toma.
      const real = t.clip ? durDe(t.clip) : 0;
      const usaClip = t.clip && real > 0 && slot >= Math.round((real - 0.1) * FPS);
      nuevos.push(usaClip
        ? { key: JSON.stringify(`bk_${t.n}`), start: desde, dur: Math.round((real - 0.1) * FPS), capa: "base",
            el: `<Clip src=${JSON.stringify(t.clip)} />` }
        : { key: JSON.stringify(`bk_${t.n}`), start: desde, dur: Math.max(Math.round(4.5 * FPS), slot), capa: "base",
            el: `<Foto src=${JSON.stringify(t.foto)} seed={${desde}} />` });
    }
  }
  for (const c of nuevos) { base.push(c); cues.push(c); }
  console.log(`banco: ${nuevos.length} tomas reales puestas a pantalla completa (${banco.length - usadas.size} quedaron sin usar)`);
  tilear();
}

// ── COBERTURA (el anti-hueco da 0 siempre porque el avatar es el piso: hay que medir aparte) ──
{
  const ocupado = new Uint8Array(TOTAL_FRAMES);
  for (const c of base) for (let x = c.start; x < Math.min(TOTAL_FRAMES, c.start + c.dur); x++) ocupado[x] = 1;
  let cub = 0; for (let x = 0; x < TOTAL_FRAMES; x++) cub += ocupado[x];
  const huecos = [];
  let ini = -1;
  for (let x = 0; x < TOTAL_FRAMES; x++) {
    if (!ocupado[x] && ini < 0) ini = x;
    if ((ocupado[x] || x === TOTAL_FRAMES - 1) && ini >= 0) {
      if ((x - ini) / FPS >= 6) huecos.push([ini / FPS, (x - ini) / FPS]);
      ini = -1;
    }
  }
  console.log(`cobertura: ${(100 * cub / TOTAL_FRAMES).toFixed(1)}%  ·  huecos >=6s: ${huecos.length}`);
  huecos.slice(0, 12).forEach(([s, d]) => console.log(`   hueco ${Math.floor(s / 60)}:${(s % 60).toFixed(0).padStart(2, "0")} de ${d.toFixed(1)}s`));
}

// ── PACING (sobre los ARRANQUES de cue de la capa base: un overlay NO es un corte) ──
{
  const d = [];
  for (let i = 0; i < base.length - 1; i++) d.push((base[i + 1].start - base[i].start) / FPS);
  d.sort((a, b) => a - b);
  const med = d[Math.floor(d.length / 2)], p75 = d[Math.floor(d.length * 0.75)];
  const largos = 100 * d.filter((x) => x >= 5).length / d.length;
  console.log(`pacing: mediana ${med.toFixed(2)}s · p75 ${p75.toFixed(2)}s · >=5s ${largos.toFixed(1)}%`);
  if (med < 3.2 || p75 < 4.6) console.log("   ⚠️ metrónomo: la mediana y el p75 están muy juntos");
}

// ── cues_<slug>.gen.tsx ────────────────────────────────────────────────────────
const imports = movsUsados.map((m) => `import { ${m} } from "./${m}";`).join("\n");
fs.writeFileSync(`src/${SLUG}/cues_${SLUG}.gen.tsx`,
`// cues_${SLUG}.gen.tsx — GENERADO por build_${SLUG}.mjs. NO editar a mano.
import React from "react";
import { Clip, Foto, IconoNum } from "./Piezas";
${imports}

export type Cue = { key: string; start: number; dur: number; capa: "base" | "over"; el: (frame: number) => React.ReactNode };

export const CUES_${UP}: Cue[] = [
${cues.sort((a, b) => a.start - b.start).map((c) =>
  `  { key: ${c.key}, start: ${c.start}, dur: ${c.dur}, capa: ${JSON.stringify(c.capa)}, el: (frame: number) => ${c.el} },`).join("\n")}
];
`);

// ── Main ───────────────────────────────────────────────────────────────────────
fs.writeFileSync(`src/${SLUG}/Main_${SLUG}.tsx`,
`// Main_${SLUG}.tsx — GENERADO por build_${SLUG}.mjs. NO editar a mano.
import React from "react";
import { AbsoluteFill, Audio, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import { CUES_${UP} } from "./cues_${SLUG}.gen";

export const TOTAL_FRAMES_${UP} = ${TOTAL_FRAMES};
const AVATAR_FRAMES = ${Math.round(AVATAR_S * FPS)};
const LOOP_START = ${f(LOOP_START_MS)};

/** El avatar es el FONDO GARANTIZADO. Va MUTEADO: el audio sale del master.
 *  Después de AVATAR_END el lipsync no vale -> arriba siempre hay contenido tapándolo.
 *
 *  ⛔⛔ OffthreadVideo, NUNCA el componente Video. Medido sobre el render: con Video la
 *  diferencia entre cuadros consecutivos de la cara saltaba de 1,99 a 14,33, mientras el archivo
 *  fuente daba 3,5-4,2 parejo. No son cuadros REPETIDOS (por eso una métrica de "cuadros iguales"
 *  da 0% y miente): son cuadros DESORDENADOS — el elemento video del navegador, en un render por
 *  chunks que arranca en un frame arbitrario de un mp4 de 13 minutos, entrega el cuadro que tenga
 *  a mano. Ése es el "se ve todo lageado" que el creador marcó en TODOS los videos de este canal.
 *
 *  ⛔ Y el avatar va SIN transform. Un scale() sobre un video de 1920 lo re-muestrea en cada
 *  cuadro y lo ablanda justo en el plano que más se mira. La regla de "avatar nunca estático" la
 *  cumple él solo: está hablando. */
const AvatarPiso: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#0A0B08", overflow: "hidden" }}>
    <Sequence from={0} durationInFrames={AVATAR_FRAMES}>
      <OffthreadVideo src={staticFile("${SLUG}_opt.mp4")} muted
        style={{ width: "100%", height: "100%", objectFit: "cover" }} />
    </Sequence>
    <Sequence from={LOOP_START} durationInFrames={TOTAL_FRAMES_${UP} - LOOP_START}>
      <OffthreadVideo src={staticFile("${SLUG}_opt.mp4")} muted
        style={{ width: "100%", height: "100%", objectFit: "cover" }} />
    </Sequence>
  </AbsoluteFill>
);

export const Main${COMP}: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: "#0A0B08" }}>
      <AvatarPiso />
      {CUES_${UP}.filter((c) => c.capa === "base").map((c) => (
        <Sequence key={c.key} from={c.start} durationInFrames={c.dur} layout="none">
          <AbsoluteFill>{c.el(frame)}</AbsoluteFill>
        </Sequence>
      ))}
      {CUES_${UP}.filter((c) => c.capa === "over").map((c) => (
        <Sequence key={c.key} from={c.start} durationInFrames={c.dur} layout="none">
          <AbsoluteFill>{c.el(frame)}</AbsoluteFill>
        </Sequence>
      ))}
      <Audio src={staticFile("${SLUG}.wav")} />
    </AbsoluteFill>
  );
};
`);

// ── entry propio (SIN esto el farm usa src/index.tsx COMPARTIDO de otra sesión) ──
fs.writeFileSync(`src/index_${SLUG}.tsx`,
`import "./index.css";
import { Composition, registerRoot } from "remotion";
import React from "react";
import { Main${COMP}, TOTAL_FRAMES_${UP} } from "./${SLUG}/Main_${SLUG}";
const Root${COMP}: React.FC = () => (
  <Composition id="${COMP}" component={Main${COMP}} durationInFrames={TOTAL_FRAMES_${UP}} fps={${FPS}} width={1920} height={1080} />
);
registerRoot(Root${COMP});
`);

// ⛔⛔ LOS MOVIMIENTOS TIENEN SUS RUTAS HARDCODEADAS ADENTRO DEL .tsx. El escaneo de cues NO las ve,
// así que sin esto el tar sale corto y CADA chunk que monte un movimiento muere con 404 — y el error
// MIENTE: Chrome dice "EncodingError: The source image cannot be decoded". La pista buena es la
// línea de al lado: "Error loading image with src:".
let deMovs = 0;
for (const fn of fs.readdirSync(`src/${SLUG}`).filter((n) => n.endsWith(".tsx"))) {
  const crudo = fs.readFileSync(path.join("src", SLUG, fn), "utf8");
  const src = crudo
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, " ")
    .replace(/\/\*[\s\S]*?\*\//g, " ")
    .replace(/^[ \t]*\/\/.*$/gm, " ")
    .replace(/([^:])\/\/[^\n"'`]*$/gm, "$1 ");
  for (const m of src.matchAll(/["'`]((?:broll|img|sfx|med)\/[^"'`\s]+\.(?:mp4|png|jpg|jpeg|webm|mp3|wav))["'`]/g)) {
    const r = m[1];
    if (!existe(r)) { console.error(`⛔ ${fn}: NO EXISTE public/${r}`); process.exit(1); }
    if (!assets.has(r)) { assets.add(r); deMovs++; }
  }
  for (const m of src.matchAll(/`[^`]*(?:broll|img)\/[^`]*\$\{/g)) {
    console.error(`⛔ ${fn}: ruta por TEMPLATE LITERAL, el tar no la empaqueta: ${m[0].slice(0, 60)}`);
    process.exit(1);
  }
}
console.log(`assets extra tomados de los Mov*.tsx: ${deMovs}`);

// ── RED DE SEGURIDAD: todas las imágenes del slug viajan (pesan poco y evitan el 404) ──
// ⛔ SOLO los .jpg y los PNG que de verdad necesitan alfa (iconos + QR): los PNG originales de las
// fotos pesan 1 GB y ya no los referencia nadie. Meterlos en el tar lo llevaba a ~1,5 GB, que es
// donde el upload se corta y el release queda EN BORRADOR (invisible para el runner).
for (const n of fs.readdirSync(`public/img/${SLUG}`)) {
  if (/_blur\.jpg$/i.test(n)) continue;
  const alfa = n.startsWith("cmeg_ic_") || n.startsWith("cmeg_qr");
  if (/\.jpg$/i.test(n) || (alfa && /\.png$/i.test(n))) assets.add(`img/${SLUG}/${n}`);
}

// ── lista de assets para el tar del farm (+ los _blur de cada imagen) ───────────
const lista = [...assets].sort();
const conBlur = [];
const sinBlur = [];
for (const a of lista) {
  conBlur.push(a);
  if (/\.(png|jpg)$/i.test(a)) {
    const b = a.replace(/\.(png|jpg)$/i, "_blur.jpg");
    if (fs.existsSync(path.join("public", b))) conBlur.push(b);
    else sinBlur.push(b);
  }
}
if (sinBlur.length) console.log(`⚠️ ${sinBlur.length} imágenes sin _blur.jpg — corré \`node preblur.mjs\` antes de farmear`);
fs.writeFileSync(`_${SLUG}_assets.txt`, conBlur.join("\n") + "\n");

console.log(`cues ${cues.length} (base ${base.length} · over ${cues.length - base.length})`);
console.log(`LIMPIEZA: ${Object.values(MOV_ACTOS).filter((n) => n === 0).length} movimientos caídos · ${planosFuera} planos sueltos fuera · ` +
  `${iconosFuera} iconos fuera (quedan ${iconosPuestos}) · ${descartados} momentos que pisaban un movimiento`);
console.log(`movimientos: ${movsUsados.length} · momentos: ${MM.momentos.length}`);
console.log(`assets: ${assets.size} (+blur = ${conBlur.length})`);
console.log(`duración: ${TOTAL_FRAMES} frames = ${(TOTAL_FRAMES / FPS / 60).toFixed(2)} min (wav ${WAV_S.toFixed(2)}s)`);
