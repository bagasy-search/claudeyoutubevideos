// OleBookPage — una PÁGINA REAL del libro (png) como papel físico sobre la mesa de madera, con luz de farol,
// y una cámara que hace ZOOM PUNTO POR PUNTO (keys) + subrayados a lápiz naranja que se dibujan (marks).
// La página se dibuja con su tamaño real en pantalla (no con transform: scale) para que el navegador la muestree
// desde el png nativo y el texto se LEA en los zoom.
// También exporta OleBed (metraje vivo de fondo con Ken-Burns + velo claro) que usan las tarjetas del grupo C.
import React from "react";
import { AbsoluteFill, Easing, Img, OffthreadVideo, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { OLE, LABEL, SERIF, hexA, rnd, woodBg } from "./OleTheme";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const asset = (p: string) => (/^(https?:|data:|\/)/.test(p) ? p : staticFile(p));

// ── Fondo vivo: jpg/png o mp4, Ken-Burns leve, velo claro (≤0,35) ─────────────────────────────
export const OleBed: React.FC<{ src: string; veil?: number; veilColor?: string; push?: number; blur?: number }> = ({ src, veil = 0.3, veilColor = OLE.cream, push = 0.06, blur = 0 }) => {
  const f = useCurrentFrame(); const { durationInFrames } = useVideoConfig();
  const s = interpolate(f, [0, durationInFrames], [1.02, 1.02 + push], cl);
  const isVid = /\.(mp4|webm|mov)$/i.test(src);
  const st: React.CSSProperties = { position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", scale: String(s), filter: blur ? `blur(${blur}px)` : undefined };
  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: OLE.kraftL }}>
      {isVid ? <OffthreadVideo src={asset(src)} muted style={st} /> : <Img src={asset(src)} style={st} />}
      <AbsoluteFill style={{ backgroundColor: hexA(veilColor, Math.min(0.35, veil)) }} />
    </AbsoluteFill>
  );
};

// ── Coordenadas medidas en pagina_metodo.png (1445x1870): centros de las 8 reglas (fracción 0-1) ────────
// x,y = centro del bloque (número + título + cuerpo); top/bottom = alto del bloque; hx0/hx1/hy = subrayado del título.
export const METODO_RULES: { n: number; x: number; y: number; top: number; bottom: number; hx0: number; hx1: number; hy: number }[] = [
  [1, 505, 607, 577, 532], [2, 629, 770, 633, 656], [3, 793, 925, 538, 819], [4, 956, 1094, 468, 982],
  [5, 1117, 1218, 443, 1143], [6, 1240, 1342, 557, 1267], [7, 1367, 1505, 592, 1393], [8, 1528, 1623, 472, 1554],
].map(([n, t, b, hx1, hy]) => ({ n, x: 713 / 1445, y: (t + b) / 2 / 1870, top: t / 1870, bottom: b / 1870, hx0: 190 / 1445, hx1: (hx1 + 6) / 1445, hy: hy / 1870 }));
// Otras zonas útiles de la pág. 7 (título, intro) y de la pág. 12 (frijoles)
export const METODO_SPOTS = { title: { x: 0.40, y: 0.10 }, intro: { x: 0.485, y: 0.205 }, whole: { x: 0.5, y: 0.5 } };
export const FRIJOLES_SPOTS = { photo: { x: 0.5, y: 0.14 }, title: { x: 0.30, y: 0.33 }, ingredients: { x: 0.21, y: 0.51 }, method: { x: 0.65, y: 0.55 }, trick: { x: 0.50, y: 0.735 }, mistakes: { x: 0.50, y: 0.83 } };

export type PageKey = [number, number, number, number]; // [t s, x, y, scale]
export type PageMark = { t: number; x0: number; y0: number; x1: number; y1: number; dur?: number; color?: string };
// Atajos para el montaje: zoom a la regla n y subrayar su título
export const ruleKey = (n: number, t: number, scale = 2.7): PageKey => { const r = METODO_RULES[n - 1]; return [t, r.x, r.y, scale]; };
export const ruleMark = (n: number, t: number): PageMark => { const r = METODO_RULES[n - 1]; return { t, x0: r.hx0, y0: r.hy, x1: r.hx1, y1: r.hy }; };

const BASE_H = 940; // alto de la página en pantalla a scale 1

// trazo a lápiz con temblor (determinista)
function pencilPath(x0: number, y0: number, x1: number, y1: number, seed: number) {
  const n = 7; const pts: string[] = [];
  for (let i = 0; i <= n; i++) {
    const k = i / n; const x = x0 + (x1 - x0) * k; const y = y0 + (y1 - y0) * k + (rnd(seed + i) - 0.5) * 3.2 + Math.sin(k * Math.PI) * 1.6;
    pts.push(`${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`);
  }
  return pts.join(" ");
}

export const OleBookPage: React.FC<{
  src?: string; aspect?: number; keys?: PageKey[]; marks?: PageMark[]; trans?: number;
  label?: string; sub?: string; bed?: string; rot?: number;
}> = ({ src = "img/ole/pagina_metodo.png", aspect = 1445 / 1870, keys, marks = [], trans = 1.0, label = "A PAGE FROM THE BOOK", sub, bed, rot = -1.6 }) => {
  const f = useCurrentFrame(); const { fps, width, height, durationInFrames } = useVideoConfig();
  const t = f / fps;
  const ks: PageKey[] = (keys && keys.length ? [...keys] : [[0, 0.5, 0.5, 1] as PageKey]).sort((a, b) => a[0] - b[0]);
  if (ks[0][0] > 0) ks.unshift([0, 0.5, 0.5, 1]);

  // cámara: tramo actual; la transición hacia la key i empieza en su t y dura min(trans, hueco)
  let x = ks[0][1], y = ks[0][2], s = ks[0][3];
  for (let i = 1; i < ks.length; i++) {
    const [t1, x1, y1, s1] = ks[i]; const [, x0, y0, s0] = ks[i - 1];
    if (t < t1) break;
    const gap = i + 1 < ks.length ? ks[i + 1][0] - t1 : 99;
    const d = Math.max(0.25, Math.min(trans, gap * 0.9));
    const p = interpolate(t, [t1, t1 + d], [0, 1], { ...cl, easing: Easing.inOut(Easing.cubic) });
    const dist = Math.hypot(x1 - x0, y1 - y0);
    const dip = 1 - 0.28 * Math.sin(Math.PI * p) * Math.min(1, dist * 2.2) * (Math.min(s0, s1) > 1.4 ? 1 : 0.4);
    x = x0 + (x1 - x0) * p; y = y0 + (y1 - y0) * p;
    s = Math.exp(Math.log(s0) + (Math.log(s1) - Math.log(s0)) * p) * dip;
  }
  // entrada física: la página cae sobre la mesa
  const inP = spring({ frame: f, fps, config: { damping: 16, stiffness: 90, mass: 0.9 } });
  const breath = 1 + 0.012 * (f / Math.max(1, durationInFrames));
  s *= breath;

  const ph = BASE_H * s, pw = ph * aspect;
  const cx = width / 2, cy = height / 2 + 10;
  // con zoom fuerte, la cámara no se sale de la página (nada de mesa vacía detrás del texto)
  if (ph > height + 40) { const m = (height / 2 + 10) / ph; y = Math.max(m, Math.min(1 - m, y)); }
  if (pw > width + 40) { const m = (width / 2 + 10) / pw; x = Math.max(m, Math.min(1 - m, x)); }
  const left = cx - x * pw, top = cy - y * ph + (1 - inP) * 70;
  const pageRot = rot * Math.max(0, Math.min(1, (2 - s) / 1)) + (1 - inP) * 2.5;
  const lift = 1 - Math.min(1, (s - 1) / 2) * 0.5;

  const labelIn = interpolate(f, [8, 22], [0, 1], { ...cl, easing: Easing.out(Easing.cubic) }) * interpolate(s, [1.25, 1.6], [1, 0], cl);

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      {/* mesa (se mueve con la cámara) */}
      {bed ? <OleBed src={bed} veil={0.32} /> : (
        <div style={{ position: "absolute", left: 0, top: 0, width: 1, height: 1, transformOrigin: "0 0", transform: `translate(${left}px, ${cy - y * ph}px) scale(${s})` }}>
          <div style={{ position: "absolute", left: -2600, top: -1600, width: 6400, height: 4200, ...woodBg("#B88A57") }} />
        </div>
      )}
      {/* hoja de abajo (otra página del libro, sin texto) */}
      <div style={{ position: "absolute", left: left + pw * 0.03, top: top + ph * 0.012, width: pw, height: ph, rotate: `${pageRot + 2.6}deg`, opacity: 1,
        background: "#EFE6D0", boxShadow: `0 ${10 * lift}px ${30 * lift}px rgba(60,35,15,0.28)` }} />
      {/* la página */}
      <div style={{ position: "absolute", left, top, width: pw, height: ph, rotate: `${pageRot}deg`, opacity: 1,
        boxShadow: `0 ${18 * lift}px ${46 * lift}px rgba(55,32,12,0.36), 0 2px 4px rgba(55,32,12,0.25), ${14 * lift}px ${26 * lift}px ${30 * lift}px -12px rgba(55,32,12,0.35)` }}>
        <Img src={asset(src)} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />
        {/* curvatura del papel: sombra junto al lomo, brillo a la derecha, esquina levantada */}
        <div style={{ position: "absolute", inset: 0, background:
          "linear-gradient(90deg, rgba(80,50,20,0.16) 0%, rgba(80,50,20,0.05) 3.5%, transparent 9%, transparent 84%, rgba(255,250,235,0.16) 93%, rgba(80,50,20,0.08) 100%)," +
          "linear-gradient(0deg, rgba(80,50,20,0.10) 0%, transparent 5%, transparent 96%, rgba(80,50,20,0.06) 100%)", mixBlendMode: "multiply" }} />
        {/* fibra y manchas leves del papel */}
        <div style={{ position: "absolute", inset: 0, opacity: 0.55, mixBlendMode: "multiply", background:
          "radial-gradient(ellipse at 86% 8%, rgba(190,140,70,0.16), transparent 11%)," +
          "radial-gradient(ellipse at 10% 92%, rgba(190,140,70,0.12), transparent 14%)," +
          "repeating-linear-gradient(93deg, rgba(120,90,40,0.025) 0 2px, transparent 2px 6px)" }} />
        {/* subrayados a lápiz */}
        <svg viewBox={`0 0 1000 ${1000 / aspect}`} preserveAspectRatio="none" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", overflow: "visible" }}>
          {marks.map((m, i) => {
            const d = m.dur ?? 0.6;
            const p = interpolate(t, [m.t, m.t + d], [0, 1], { ...cl, easing: Easing.inOut(Easing.quad) });
            if (p <= 0) return null;
            const H = 1000 / aspect;
            const path = pencilPath(m.x0 * 1000, m.y0 * H, m.x1 * 1000, m.y1 * H, 40 + i * 13);
            const L = Math.hypot((m.x1 - m.x0) * 1000, (m.y1 - m.y0) * H) * 1.15 + 20;
            return (
              <g key={i}>
                <path d={path} fill="none" stroke={m.color ?? OLE.fire} strokeWidth={3.6} strokeLinecap="round" opacity={0.88}
                  strokeDasharray={L} strokeDashoffset={L * (1 - p)} />
                <path d={pencilPath(m.x0 * 1000 + 4, m.y0 * H + 2.2, m.x1 * 1000 - 8, m.y1 * H + 2, 90 + i * 7)} fill="none" stroke={m.color ?? OLE.fire}
                  strokeWidth={1.8} strokeLinecap="round" opacity={0.55} strokeDasharray={L} strokeDashoffset={L * (1 - Math.max(0, p * 1.25 - 0.25))} />
              </g>
            );
          })}
        </svg>
      </div>
      {/* luz de farol: cálida arriba a la izquierda, caída suave (sin viñeta negra) */}
      <AbsoluteFill style={{ pointerEvents: "none", mixBlendMode: "soft-light", background: "radial-gradient(ellipse at 22% 12%, rgba(255,196,120,0.55), transparent 55%)" }} />
      <AbsoluteFill style={{ pointerEvents: "none", mixBlendMode: "multiply", background: "radial-gradient(ellipse at 45% 40%, transparent 55%, rgba(120,72,30,0.16) 100%)" }} />
      {/* rótulo */}
      {label ? (
        <div style={{ position: "absolute", left: 64, top: 56, opacity: labelIn, translate: `${(1 - labelIn) * -40}px 0`, rotate: "-1.5deg",
          background: OLE.cream, padding: "14px 26px 12px", borderLeft: `8px solid ${OLE.fire}`, boxShadow: `0 10px 24px ${OLE.shadow}` }}>
          <div style={{ fontFamily: LABEL, fontWeight: 600, fontSize: 30, letterSpacing: 6, color: OLE.forest, lineHeight: 1 }}>{label}</div>
          {sub ? <div style={{ fontFamily: SERIF, fontStyle: "italic", fontWeight: 600, fontSize: 30, color: OLE.fire, marginTop: 6 }}>{sub}</div> : null}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
