// kit neon — estilo "Explicador neón" (explicador-neon). Ficha: D:/claude-brain/estilos/explicador-neon/ESTILO.md
// Base compartida: paleta, fuentes, tiempo anclado a la PALABRA, cámara continua del escenario, encendido de neón e
// hilo de luz. Todo en segundos absolutos del video (nada de Sequence por escena: un solo plano, sin cortes).
import React from "react";
import { Easing, interpolate, spring, useCurrentFrame } from "remotion";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadSerif } from "@remotion/google-fonts/InstrumentSerif";

export const { fontFamily: SANS } = loadInter("normal", { weights: ["600", "700", "800", "900"], subsets: ["latin"] });
export const { fontFamily: SERIF } = loadSerif("italic", { weights: ["400"], subsets: ["latin"] });
loadSerif("normal", { weights: ["400"], subsets: ["latin"] });

// ───────── lienzo 16:9 partido: escenario 2/3 izquierdo + columna del avatar 9:16 a alto completo ─────────
export const FPS = 30;
export const W = 1920, H = 1080;
export const COL_W = 608; // 9:16 exacto a 1080 de alto (~1/3 del ancho)
export const ESC_W = W - COL_W; // 1312

export const N = {
  bg: "#050506",
  rojo: "#ff2a48", rojoTubo: "#d81a36", rojoHondo: "#7c0618", rojoBorde: "#ffc4cd", rojoPatron: "#ffd2da",
  blanco: "#f6f7fb", gris: "rgba(255,255,255,.22)", texto2: "rgba(255,255,255,.62)",
  oro: "#f4c24a", oroClaro: "#fff0b3", oroHondo: "#8a5d06", oroNegro: "#1a1206",
  verde: "#8dffa0", fosfo: "#39ff14", violeta: "#b77bff", violetaHondo: "#3a1d7a", cian: "#27e3ff", cianClaro: "#cbfbff",
};

// ───────── utilidades ─────────
export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
export const ease = Easing.bezier(0.65, 0, 0.35, 1);
export const easeOut = Easing.bezier(0.22, 1, 0.36, 1);
export const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
export const ramp = (t: number, t0: number, d = 0.4, e = ease) => interpolate(t, [t0, t0 + d], [0, 1], { ...clamp, easing: e });
// 0→1 al entrar en t0 y 1→0 al salir en t1 (ambos con duración d)
export const win = (t: number, t0: number, t1: number, d = 0.4) => Math.min(ramp(t, t0, d), 1 - ramp(t, t1 - d, d));
export const vis = (t: number, t0: number, t1 = Infinity, m = 0.1) => t >= t0 - m && t <= t1 + m;
export const pop = (t: number, t0: number, damping = 12, stiffness = 170) =>
  spring({ frame: (t - t0) * FPS, fps: FPS, config: { damping, stiffness, mass: 0.6 } });
export const rnd = (i: number, s = 1) => { const x = Math.sin(i * 127.1 + s * 311.7) * 43758.5453; return x - Math.floor(x); };
export const useT = () => useCurrentFrame() / FPS;
// id seguro para filtros/gradientes SVG (useId trae ":" que rompen url(#…))
export const useSvgId = (p: string) => p + React.useId().replace(/[^a-zA-Z0-9_-]/g, "");

// Encendido de tubo de neón: parpadea ~0,4 s (un valor por cuadro) y queda prendido. Antes de t0 = apagado.
const PARPADEO = [0, 0.85, 0.1, 0.75, 0.25, 1, 0.5, 1, 1, 0.65, 1, 1, 1];
export const neonOn = (t: number, t0: number) => {
  const d = t - t0;
  if (d < 0) return 0;
  if (d >= 0.42) return 1;
  return PARPADEO[Math.min(PARPADEO.length - 1, Math.floor((d / 0.42) * PARPADEO.length))];
};
// respiración del brillo cuando ya está prendido (vida sin moverse)
export const respira = (t: number, fase = 0, amp = 0.08) => 1 - amp + amp * Math.sin(t * 2.1 + fase);
// balanceo de objeto colgado: golpe al nacer que se amortigua + vaivén leve permanente
export const balanceo = (t: number, t0: number, golpe = 7, fase = 0) =>
  (t < t0 ? 0 : golpe * Math.exp(-2.4 * (t - t0)) * Math.sin(6 * (t - t0))) + 1.1 * Math.sin(t * 1.05 + fase);

// ───────── tiempo anclado a la palabra (words.json de la voz) ─────────
export type Palabra = { text: string; startMs: number; endMs: number };
export const norm = (s: string) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/g, "");
export type Tiempo = ReturnType<typeof makeTiempo>;
export const makeTiempo = (words: Palabra[]) => {
  const PW = words.map((w) => ({ raw: w.text, n: norm(w.text), s: w.startMs / 1000, e: w.endMs / 1000 })).filter((w) => w.n);
  const memo = new Map<string, number>();
  const idx = (phrase: string, after: number) => {
    const k = phrase + "@" + after;
    const m = memo.get(k);
    if (m !== undefined) return m;
    const toks = phrase.split(/\s+/).map(norm).filter(Boolean);
    for (let i = 0; i < PW.length; i++) {
      if (PW[i].s < after) continue;
      let ok = true;
      for (let j = 0; j < toks.length; j++) if (PW[i + j]?.n !== toks[j]) { ok = false; break; }
      if (ok) { memo.set(k, i); return i; }
    }
    throw new Error(`frase no encontrada en words: "${phrase}" después de ${after}`);
  };
  // at("frase") = segundo en que EMPIEZA esa frase (primera aparición después de `after`). Si no está, rompe el still.
  const at = (phrase: string, after = 0) => PW[idx(phrase, after)].s;
  const atEnd = (phrase: string, after = 0) => {
    const i = idx(phrase, after);
    return PW[Math.min(PW.length - 1, i + phrase.split(/\s+/).map(norm).filter(Boolean).length - 1)].e;
  };
  const speaking = (t: number) => { for (const w of PW) { if (t < w.s - 0.05) return false; if (t <= w.e + 0.08) return true; } return false; };
  // la palabra que se está diciendo (para el subtítulo de UNA palabra); queda 0,25 s después de terminar
  const palabraEn = (t: number) => {
    for (let i = 0; i < PW.length; i++) {
      const w = PW[i], nx = PW[i + 1];
      if (t < w.s - 0.02) return null;
      const fin = nx ? Math.min(nx.s - 0.02, w.e + 0.25) : w.e + 0.25;
      if (t <= fin) return { ...w, i };
    }
    return null;
  };
  return { at, atEnd, speaking, palabraEn, palabras: PW, fin: PW.length ? PW[PW.length - 1].e : 0 };
};

// Palabras SINTÉTICAS desde un guion (antes de tener la voz): sirve para planificar y para la escena de prueba.
// ~4,6 sílabas/s, pausas en coma (0,22 s) y en punto/dos puntos/pregunta (0,45 s). Con la voz real se usa words.json.
export const palabrasDeGuion = (texto: string, inicio = 0.4): Palabra[] => {
  const out: Palabra[] = [];
  let t = inicio;
  for (const raw of texto.split(/\s+/).filter(Boolean)) {
    const sil = Math.max(1, (norm(raw).match(/[aeiou]+/g) || []).length);
    const d = 0.07 + 0.165 * sil;
    out.push({ text: raw, startMs: Math.round(t * 1000), endMs: Math.round((t + d) * 1000) });
    t += d + 0.045;
    if (/[,;]$/.test(raw)) t += 0.22;
    if (/[.:?!…]$/.test(raw)) t += 0.45;
  }
  return out;
};

// ───────── cámara del escenario: [t, x, y, zoom, rot°] en px del mundo ─────────
// Entre tomas: ease + zoom logarítmico + arco (se aleja un poco) en traslados largos. Encima, una respiración
// permanente: la cámara NUNCA queda quieta (pedido del molde: "se mueve sola").
// 6º valor opcional = cómo se llega a la llave siguiente: "io" (default, arranca y frena suave), "lin" (velocidad
// pareja: vuelos a lo largo del bucle), "in" (acelera y llega lanzada), "out" (sale lanzada y frena).
export type Curva = "io" | "lin" | "in" | "out";
export type Toma = [number, number, number, number, number?, Curva?];
export type Cam = { x: number; y: number; z: number; rot: number };
const CURVAS: Record<Curva, (k: number) => number> = { io: ease, lin: (k) => k, in: Easing.bezier(0.55, 0, 0.9, 0.6), out: Easing.bezier(0.1, 0.4, 0.45, 1) };
export const makeCam = (tomas: Toma[], respiro = 1) => {
  const K = [...tomas].sort((a, b) => a[0] - b[0]);
  return (t: number): Cam => {
    let i = 0;
    while (i < K.length - 2 && t > K[i + 1][0]) i++;
    const a = K[i], b = K[Math.min(K.length - 1, i + 1)];
    const k = b[0] === a[0] ? 1 : CURVAS[a[5] ?? "io"](Math.min(1, Math.max(0, (t - a[0]) / (b[0] - a[0]))));
    const z = Math.exp(lerp(Math.log(a[3]), Math.log(b[3]), k));
    const dist = Math.hypot(b[1] - a[1], b[2] - a[2]) * Math.min(a[3], b[3]);
    const arc = dist > 1400 ? 1 - Math.min(0.45, dist / 9000) * Math.sin(Math.PI * k) : 1;
    const bx = respiro * (7 * Math.sin(t * 0.41) + 3 * Math.sin(t * 0.93 + 1.7));
    const by = respiro * (5 * Math.sin(t * 0.33 + 0.6) + 2 * Math.sin(t * 0.77 + 2.1));
    const zz = z * arc * (1 + respiro * 0.008 * Math.sin(t * 0.27 + 0.4));
    return { x: lerp(a[1], b[1], k) + bx / zz, y: lerp(a[2], b[2], k) + by / zz, z: zz, rot: lerp(a[4] ?? 0, b[4] ?? 0, k) + respiro * 0.3 * Math.sin(t * 0.21 + 1.1) };
  };
};
// toma quieta con empuje lento (push-in): dos llaves con el mismo encuadre y un poco más de zoom al final
export const quieta = (t0: number, t1: number, x: number, y: number, z = 1, empuje = 0.05, rot = 0): Toma[] => [[t0, x, y, z, rot], [t1, x, y, z * (1 + empuje), rot]];

// ───────── trazos de neón en SVG ─────────
// Un trazo de neón = halo ancho difuso + tubo de color + alma casi blanca. `k` = cuánto está dibujado (0..1).
export const NeonPath: React.FC<{ d: string; color: string; ancho?: number; on?: number; k?: number; len?: number; alma?: string; halo?: number; fill?: string; blurId?: string }> = ({ d, color, ancho = 4, on = 1, k = 1, len = 4000, alma = "#fff", halo = 1, fill = "none", blurId }) => {
  if (on <= 0.001) return null;
  const dash = k >= 0.999 ? undefined : `${len * k} ${len}`;
  const common = { d, fill: "none", strokeLinecap: "round" as const, strokeLinejoin: "round" as const, strokeDasharray: dash };
  return (
    <g opacity={on}>
      {fill !== "none" && <path d={d} fill={fill} opacity={k} />}
      <path {...common} stroke={color} strokeWidth={ancho * 4.5} opacity={0.28 * halo} filter={blurId ? `url(#${blurId})` : undefined} />
      <path {...common} stroke={color} strokeWidth={ancho * 1.6} opacity={0.9} />
      <path {...common} stroke={alma} strokeWidth={ancho * 0.55} opacity={0.95} />
    </g>
  );
};
export const BlurDef: React.FC<{ id: string; s: number }> = ({ id, s }) => (
  <filter id={id} x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation={s} /></filter>
);

// ───────── hilo de luz: une un objeto con el anterior (nadie aparece de la nada) ─────────
// Se dibuja de a → b con una chispa en la punta; después un paquete de luz recorre el hilo cada ~2,4 s.
type P2 = [number, number];
const bez = (a: P2, c: P2, b: P2, k: number): P2 => [(1 - k) * (1 - k) * a[0] + 2 * (1 - k) * k * c[0] + k * k * b[0], (1 - k) * (1 - k) * a[1] + 2 * (1 - k) * k * c[1] + k * k * b[1]];
export const Hilo: React.FC<{ a: P2; b: P2; t0: number; t1?: number; dur?: number; sag?: number; color?: string; ancho?: number; pulso?: boolean }> = ({ a, b, t0, t1 = Infinity, dur = 0.4, sag = 0, color = "#ffffff", ancho = 2.2, pulso = true }) => {
  const t = useT();
  const gid = useSvgId("hilo");
  if (!vis(t, t0, t1)) return null;
  const mid: P2 = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  const len0 = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
  const c: P2 = [mid[0] - ((b[1] - a[1]) / len0) * sag, mid[1] + ((b[0] - a[0]) / len0) * sag];
  const pts: P2[] = Array.from({ length: 41 }, (_, i) => bez(a, c, b, i / 40));
  let L = 0; for (let i = 1; i < pts.length; i++) L += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
  const pad = 40;
  const x0 = Math.min(...pts.map((p) => p[0])) - pad, y0 = Math.min(...pts.map((p) => p[1])) - pad;
  const x1 = Math.max(...pts.map((p) => p[0])) + pad, y1 = Math.max(...pts.map((p) => p[1])) + pad;
  const d = `M${a[0] - x0},${a[1] - y0} Q${c[0] - x0},${c[1] - y0} ${b[0] - x0},${b[1] - y0}`;
  const k = ramp(t, t0, dur, easeOut);
  const op = t1 === Infinity ? 1 : 1 - ramp(t, t1 - 0.3, 0.3);
  const head = bez(a, c, b, k);
  const ciclo = 2.4, fase = ((t - t0 - dur) % ciclo) / ciclo;
  return (
    <svg width={x1 - x0} height={y1 - y0} style={{ position: "absolute", left: x0, top: y0, overflow: "visible", opacity: op, pointerEvents: "none" }}>
      <defs><BlurDef id={gid} s={ancho * 1.6} /></defs>
      <path d={d} fill="none" stroke={color} strokeWidth={ancho * 4} opacity={0.3} filter={`url(#${gid})`} strokeDasharray={`${L * k} ${L}`} />
      <path d={d} fill="none" stroke={color} strokeWidth={ancho} opacity={0.85} strokeLinecap="round" strokeDasharray={`${L * k} ${L}`} />
      {pulso && k >= 1 && t > t0 + dur && (
        <path d={d} fill="none" stroke="#fff" strokeWidth={ancho * 2.2} strokeLinecap="round" opacity={0.9 * Math.sin(Math.PI * fase)} filter={`url(#${gid})`}
          strokeDasharray={`${L * 0.1} ${L * 2}`} strokeDashoffset={-L * (fase * 1.1 - 0.1)} />
      )}
      {k > 0 && k < 1 && (
        <g transform={`translate(${head[0] - x0},${head[1] - y0})`}>
          <circle r={ancho * 5} fill={color} opacity={0.35} filter={`url(#${gid})`} />
          <circle r={ancho * 1.6} fill="#fff" />
        </g>
      )}
    </svg>
  );
};

// ───────── texto con *itálica serif* (la marca del molde: sans negra + UNA palabra en itálica serif) ─────────
// "Así funciona *la trampa*" → "Así funciona" en sans negra y "la trampa" en itálica serif más grande.
export const partes = (s: string) => s.split(/(\*[^*]+\*)/).filter(Boolean).map((p) => (p.startsWith("*") ? { it: true, s: p.slice(1, -1) } : { it: false, s: p }));
