// ─────────────────────────────────────────────────────────────────────────────
// LORETTA'S CLEAN HOME · kit de edición premium para `cltoilet` (10-oct-2026)
//
// Idea madre: cada momento del guion se resuelve como UN MOVIMIENTO, no como una
// tarjeta. Un movimiento = UNA atmósfera + UNA cámara continua + materia REAL
// (las fotos `k###`/`p###` y los clips del propio video) adentro de vidrio,
// papel y porcelana, con profundidad y luz de la escena.
//
// · La atmósfera es un FOTOGRAMA CONGELADO del propio vlog (`_st/sNN.jpg`) con su
//   gemelo pre-desenfocado (`_st/sNNb.jpg`) en disco: nunca un clip corriendo con
//   cortes adentro → se terminaron los destellos que dejaba la cama vieja.
// · La cámara es función del frame GLOBAL del momento: ningún acto la reinicia.
// · Toda tarjeta lleva material real adentro (foto o clip). Nada de forma+texto.
// · Las costuras entre actos son por materia: barrido del vidrio, oclusión de la
//   toalla, match-shape de la porcelana, corte en el beat. Nunca un fundido.
// ─────────────────────────────────────────────────────────────────────────────
import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { SERIF, LABEL, HAND } from "../claudio/ClTheme";

// ── palette: la casa de Loretta (porcelana, azulejo, lila, cromo, madera vieja) ──
export const L = {
  porc: "#FBF8F2",
  tile: "#EDE9E0",
  grout: "#D3CBBB",
  lilac: "#B4A2C6",
  lilacDeep: "#6B5786",
  lilacPale: "#E5DCEF",
  chrome: "#C6CDD4",
  chromeDark: "#7C848C",
  wood: "#8E6B45",
  woodDark: "#4E3A24",
  woodLight: "#C09565",
  ink: "#2B2620",
  inkSoft: "#6B6257",
  red: "#B93A2B",
  sage: "#4E7A50",
  cream: "#F5EBD8",
  shadow: "rgba(38,28,16,0.42)",
};

// ── helpers — todo función pura del frame (el farm rinde en chunks) ───────────
export const cl01 = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);
export const ez = (x: number) => { const t = cl01(x); return t * t * (3 - 2 * t); };
export const lin = (f: number, a: number, b: number, from = 0, to = 1) =>
  interpolate(f, [a, b], [from, to], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
export const rnd = (seed: number) => {
  let t = (Math.imul((seed * 2654435761) | 0, 1) + 0x6d2b79f5) | 0;
  t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
export const pop = (f: number, fps: number, at = 0, damping = 14, stiffness = 120) =>
  spring({ frame: f - at, fps, config: { damping, stiffness, mass: 0.8 } });
const pad = (n: number) => String(n).padStart(2, "0");
const K: Record<string, number> = { label: 0.52, serif: 0.56, hand: 0.44 };
export const fit = (t: string, maxW: number, base: number, fam: "label" | "serif" | "hand" = "label", min = 20) =>
  Math.max(min, Math.min(base, maxW / Math.max(1, (t || "").length * K[fam])));
// "k012" → foto del video · "img/x.jpg" → archivo de public tal cual
export const src = (k?: string) => (!k ? undefined : k.includes("/") || k.includes(".") ? k : `img/cltoilet/${k}.png`);

// ── cámara continua: claves [frame, {x,y,z,rot}] interpoladas con suavizado ────
export type Cam = { x: number; y: number; z: number; rot: number };
export const camAt = (keys: [number, Partial<Cam>][], fg: number): Cam => {
  let a = keys[0], b = keys[keys.length - 1];
  for (let i = 0; i < keys.length - 1; i++) if (fg >= keys[i][0] && fg <= keys[i + 1][0]) { a = keys[i]; b = keys[i + 1]; break; }
  const t = ez(a[0] === b[0] ? 0 : (fg - a[0]) / (b[0] - a[0]));
  const g = (k: keyof Cam, d: number) => { const p = (a[1][k] as number) ?? d, q = (b[1][k] as number) ?? d; return p + (q - p) * t; };
  return { x: g("x", 0), y: g("y", 0), z: g("z", 1), rot: g("rot", 0) };
};
// el momento declara su cámara una vez; todos los actos la comparten en el frame global
export const useCam = (keys: [number, Partial<Cam>][], f0: number): Cam => {
  const f = useCurrentFrame();
  return camAt(keys, f + f0);
};

// ── la atmósfera: el baño de Loretta congelado, con profundidad de 6 planos ────
export const Atmos: React.FC<{ st: number; cam: Cam; dim?: number; fore?: "wood" | "towel" | "none"; warm?: number }> =
  ({ st, cam, dim = 0.1, fore = "wood", warm = 1 }) => {
    const f = useCurrentFrame();
    const sharp = `img/cltoilet/_st/s${pad(st)}.jpg`, plate = `img/cltoilet/_st/s${pad(st)}b.jpg`;
    const motes = Array.from({ length: 26 }, (_, i) => i);
    return (
      <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#1C1710" }}>
        {/* 1 · placa de fondo: el mismo baño desenfocado en disco, parallax lento */}
        <AbsoluteFill style={{ transform: `translate(${-cam.x * 0.22}px, ${-cam.y * 0.22}px) scale(${1.16 + (cam.z - 1) * 0.3})` }}>
          <Img src={staticFile(plate)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </AbsoluteFill>
        {/* 2 · luz de ventana que respira (no salta: evoluciona) */}
        <AbsoluteFill style={{ background: `radial-gradient(ellipse 62% 78% at ${28 + 6 * Math.sin(f / 90)}% ${8 + 4 * Math.cos(f / 120)}%, rgba(255,236,197,${0.3 * warm}), rgba(255,236,197,0) 62%)` }} />
        {/* 3 · el mundo nítido, en un panel con canto: el "vidrio de la escena" */}
        <div style={{ position: "absolute", left: "50%", top: "50%", width: 1806, height: 1016, translate: "-50% -50%",
          transform: `translate(${-cam.x}px, ${-cam.y}px) scale(${cam.z}) rotate(${cam.rot}deg)`, borderRadius: 10, overflow: "hidden",
          boxShadow: "0 80px 150px rgba(14,9,5,0.66), 0 0 0 1px rgba(255,244,224,0.2), inset 0 0 120px rgba(28,18,8,0.42)" }}>
          <Img src={staticFile(sharp)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: "scale(1.02)" }} />
          {dim > 0 ? <AbsoluteFill style={{ backgroundColor: `rgba(255,250,240,${dim})` }} /> : null}
        </div>
        {/* 4 · polvo en el aire (hold vivo: nunca nada quieto) */}
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          {motes.map((i) => {
            const sx = rnd(i * 3 + 1), sy = rnd(i * 5 + 2), sp = 0.25 + 0.5 * rnd(i * 7 + 3), ph = 6 * rnd(i * 11 + 4);
            const x = 40 + sx * 1840 + Math.sin(f / (70 + 40 * sy) + ph) * 26;
            const y = 980 - ((f * sp * 1.6 + sy * 1000) % 1060);
            return <div key={i} style={{ position: "absolute", left: x, top: y, width: 3 + 4 * rnd(i * 13 + 5), height: 3 + 4 * rnd(i * 13 + 5), borderRadius: 99, background: "rgba(255,246,225,0.55)", opacity: 0.10 + 0.16 * rnd(i * 17 + 6) }} />;
          })}
        </AbsoluteFill>
        {/* 5 · primer plano: la mesada / la toalla, fuera de foco, cruza el borde */}
        {fore !== "none" ? (
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: fore === "wood" ? 172 : 210, overflow: "hidden" }}>
            <Img src={staticFile(plate)} style={{ position: "absolute", left: "-6%", top: 0, width: "114%", height: 900, objectFit: "cover",
              transform: "scale(1.9)", transformOrigin: "50% 8%", filter: "brightness(0.62) saturate(0.9)" }} />
            <div style={{ position: "absolute", inset: 0, background: fore === "wood"
              ? "linear-gradient(180deg, rgba(20,13,6,0) 0%, rgba(24,15,7,0.55) 42%, rgba(28,18,9,0.86) 100%)"
              : "linear-gradient(180deg, rgba(20,13,6,0) 0%, rgba(240,236,226,0.5) 45%, rgba(232,226,212,0.85) 100%)" }} />
          </div>
        ) : null}
        {/* 6 · grade: luz cálida arriba, sombra fría abajo, viñeta */}
        <AbsoluteFill style={{ pointerEvents: "none", background:
          "linear-gradient(180deg, rgba(255,238,204,0.10) 0%, rgba(255,238,204,0) 34%, rgba(20,16,34,0.16) 100%), radial-gradient(ellipse at 50% 46%, rgba(0,0,0,0) 52%, rgba(18,14,30,0.34) 100%)" }} />
        {/* 7 · grano: PNG propio en mosaico, estático (coste cero por frame) */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: `url(${staticFile("img/cltoilet/_st/grain.png")})`, backgroundRepeat: "repeat", opacity: 0.055, mixBlendMode: "overlay" }} />
      </AbsoluteFill>
    );
  };

// ── piezas de materia ─────────────────────────────────────────────────────────
// impresión enmarcada: marco con bisel + paspartú + foto real con Ken-Burns + barrido
export const Pane: React.FC<{ img?: string; x: number; y: number; w: number; h?: number; rot?: number; z?: number;
  o?: number; s?: number; f?: number; T?: number; dim?: number; mat?: string; sweep?: boolean; kb?: number }> =
  ({ img, x, y, w, h, rot = 0, z = 0, o = 1, s = 1, f = 1, T = 150, dim = 0, mat = "#FFFFFF", sweep = true, kb = 0.06 }) => {
    const H = h ?? w * 0.72, frame = Math.max(10, w * 0.026), mt = Math.max(8, w * 0.022);
    const u = src(img);
    const k = cl01(f / Math.max(1, T));
    return (
      <div style={{ position: "absolute", left: x, top: y, translate: "-50% -50%", transform: `perspective(1400px) translateZ(${z}px) rotate(${rot}deg) scale(${s})`, opacity: o }}>
        <div style={{ background: mat, padding: `${frame}px ${frame}px ${frame * 1.15}px`, borderRadius: 4,
          boxShadow: `0 46px 80px ${L.shadow}, 0 8px 18px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.9)` }}>
          <div style={{ position: "relative", width: w, height: H, overflow: "hidden", background: "#D9D2C4", borderRadius: 2,
            boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.16), inset 0 2px 6px rgba(0,0,0,0.18)" }}>
            {u ? <Img src={staticFile(u)} style={{ width: "100%", height: "100%", objectFit: "cover",
              transform: `scale(${1 + kb}) translateY(${(-kb * 40 * (k - 0.5))}px)` }} /> : null}
            {dim > 0 ? <AbsoluteFill style={{ backgroundColor: `rgba(24,26,30,${dim})` }} /> : null}
            <AbsoluteFill style={{ background: "linear-gradient(155deg, rgba(255,246,222,0.14), rgba(0,0,0,0) 44%, rgba(16,22,40,0.22))" }} />
            {sweep ? <Sweep f={f} /> : null}
          </div>
        </div>
      </div>
    );
  };
// barrido especular del vidrio (lo que hace que la impresión se lea como objeto)
export const Sweep: React.FC<{ f: number; o?: number; wide?: number }> = ({ f, o = 0.5, wide = 1 }) => (
  <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
    <div style={{ position: "absolute", top: "-40%", bottom: "-40%", width: `${26 * wide}%`,
      left: `${-40 + ((f * 1.1) % 200)}%`, transform: "rotate(14deg)",
      background: `linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,${0.34 * o}) 48%, rgba(255,255,255,0) 100%)` }} />
  </div>
);
// la tarjeta de VIDRIO: lámina translúcida con canto vivo y sombra larga (sin backdrop-filter)
export const Glass: React.FC<{ x: number; y: number; w: number; h: number; rot?: number; z?: number; o?: number; s?: number;
  children?: React.ReactNode; tone?: number }> = ({ x, y, w, h, rot = 0, z = 0, o = 1, s = 1, children, tone = 0.16 }) => (
  <div style={{ position: "absolute", left: x, top: y, translate: "-50% -50%", width: w, height: h, borderRadius: 10,
    transform: `perspective(1400px) translateZ(${z}px) rotate(${rot}deg) scale(${s})`, opacity: o, overflow: "hidden",
    background: `linear-gradient(133deg, rgba(255,255,255,${tone + 0.2}) 0%, rgba(255,255,255,${tone * 0.5}) 34%, rgba(228,236,240,${tone * 0.28}) 66%, rgba(255,255,255,${tone + 0.14}) 100%)`,
    boxShadow: `0 50px 90px ${L.shadow}, inset 0 2px 0 rgba(255,255,255,0.95), inset 0 -3px 0 rgba(120,130,140,0.4), inset 3px 0 0 rgba(255,255,255,0.6), inset -3px 0 0 rgba(255,255,255,0.45)` }}>
    {children}
  </div>
);
// etiqueta de papel con cinta (el rótulo del canal: nunca texto flotando solo)
export const Chip: React.FC<{ x: number; y: number; txt: string; rot?: number; o?: number; size?: number; maxW?: number;
  color?: string; bg?: string; tape?: boolean; z?: number; s?: number }> =
  ({ x, y, txt, rot = -1.6, o = 1, size = 44, maxW = 900, color = L.ink, bg = "#FFFDF4", tape = true, z = 0, s = 1 }) => (
    <div style={{ position: "absolute", left: x, top: y, translate: "-50% -50%", opacity: o, transform: `perspective(1200px) translateZ(${z}px) rotate(${rot}deg) scale(${s})` }}>
      <div style={{ position: "relative", background: bg, padding: "10px 30px 12px", borderRadius: 3, boxShadow: `0 26px 44px ${L.shadow}, 0 2px 6px rgba(0,0,0,0.18)` }}>
        <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: fit(txt, maxW, size, "hand"), color, lineHeight: 1.02, whiteSpace: "nowrap" }}>{txt}</div>
        {tape ? <Tape x={-26} y={-18} rot={-8} w={132} /> : null}
      </div>
    </div>
  );
export const Tape: React.FC<{ x: number; y: number; rot?: number; w?: number; o?: number }> = ({ x, y, rot = -6, w = 130, o = 0.8 }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, height: 32, opacity: o, rotate: `${rot}deg`,
    background: "linear-gradient(100deg, rgba(246,236,206,0.92), rgba(228,214,178,0.86))", boxShadow: "0 3px 7px rgba(0,0,0,0.16)" }} />
);
// tira de rótulo (franja lila con filete) — el "título" del momento
export const Bar: React.FC<{ x: number; y: number; txt: string; o?: number; size?: number; maxW?: number; color?: string; z?: number }> =
  ({ x, y, txt, o = 1, size = 46, maxW = 1100, color = L.lilacDeep, z = 0 }) => (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `perspective(1200px) translateZ(${z}px)`, display: "inline-flex", alignItems: "center", gap: 16 }}>
      <div style={{ width: 14, height: 66, background: color, borderRadius: 3 }} />
      <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: fit(txt, maxW, size, "label"), color: L.ink, letterSpacing: 2.5, textTransform: "uppercase", whiteSpace: "nowrap", textShadow: "0 2px 14px rgba(255,250,240,0.85)" }}>{txt}</div>
    </div>
  );
// marca a mano: ✓ / ✗ / subrayado / círculo
export const Ink: React.FC<{ kind: "si" | "no" | "circle" | "under"; k: number; size: number; x: number; y: number; color?: string; w?: number }> =
  ({ kind, k, size, x, y, color, w }) => {
    const c = color ?? (kind === "no" ? L.red : L.sage);
    const st = { strokeLinecap: "round" as const, strokeLinejoin: "round" as const, fill: "none", stroke: c };
    const dash = kind === "si" ? 92 : kind === "no" ? 130 : kind === "circle" ? 360 : 200;
    const sw = Math.max(6, size / 12);
    return (
      <svg width={size} height={size} viewBox="0 0 100 100" style={{ position: "absolute", left: x - size / 2, top: y - size / 2, overflow: "visible", filter: "drop-shadow(0 5px 8px rgba(0,0,0,0.3))" }}>
        {kind === "si" ? <path d="M22 53 L42 72 L80 27" {...st} strokeWidth={sw} strokeDasharray={dash} strokeDashoffset={dash * (1 - ez(k))} />
          : kind === "no" ? <g {...st} strokeWidth={sw}><path d="M27 27 L73 73" strokeDasharray={66} strokeDashoffset={66 * (1 - ez(cl01(k * 2)))} /><path d="M73 27 L27 73" strokeDasharray={66} strokeDashoffset={66 * (1 - ez(cl01(k * 2 - 1)))} /></g>
            : kind === "circle" ? <ellipse cx={50} cy={50} rx={42} ry={38} {...st} strokeWidth={sw} strokeDasharray={dash} strokeDashoffset={dash * (1 - ez(k))} transform="rotate(-8 50 50)" />
              : <path d={`M6 50 L${6 + (w ?? 88) * ez(k)} 50`} {...st} strokeWidth={sw} />}
      </svg>
    );
  };
// alfiler de latón: el punto EXACTO donde hay que mirar
export const Pin: React.FC<{ x: number; y: number; k: number; s?: number; pulse?: boolean; f?: number; label?: string }> =
  ({ x, y, k, s = 1, pulse = true, f = 0, label }) => (
    <div style={{ position: "absolute", left: x, top: y, translate: "-50% -100%", opacity: cl01(k * 1.4), transform: `scale(${s * (0.6 + 0.4 * ez(k))})` }}>
      <div style={{ position: "absolute", left: "50%", top: 4, translate: "-50% 0", width: 84 * s, height: 84 * s, borderRadius: 99,
        border: `4px solid ${L.red}`, opacity: pulse ? 0.35 + 0.4 * Math.abs(Math.sin(f / 12)) : 0.3, transform: `scale(${1 + 0.16 * Math.abs(Math.sin(f / 12))})` }} />
      <svg width={46 * s} height={64 * s} viewBox="0 0 46 64" style={{ filter: "drop-shadow(0 8px 10px rgba(0,0,0,0.42))" }}>
        <ellipse cx={23} cy={17} rx={17} ry={17} fill={L.chrome} stroke={L.chromeDark} strokeWidth={2} />
        <circle cx={23} cy={17} r={7} fill={L.woodDark} opacity={0.5} />
        <path d="M23 33 L23 62" stroke={L.red} strokeWidth={5} strokeLinecap="round" />
      </svg>
      {label ? <div style={{ position: "absolute", left: 34 * s, top: -6, whiteSpace: "nowrap", fontFamily: LABEL, fontWeight: 700, fontSize: 30, color: L.porc, background: L.red, padding: "2px 12px", borderRadius: 5 }}>{label}</div> : null}
    </div>
  );
// azulejo de porcelana con el número grabado (materia real, no una etiqueta de cartón)
export const Tile: React.FC<{ num: string; unidad?: string; x: number; y: number; rot?: number; o?: number; s?: number; w?: number; alerta?: boolean }> =
  ({ num, unidad, x, y, rot = -2, o = 1, s = 1, w = 470, alerta = false }) => {
    const h = w * 0.98, c = alerta ? L.red : L.lilacDeep;
    return (
      <div style={{ position: "absolute", left: x, top: y, translate: "-50% -50%", opacity: o, transform: `perspective(1500px) rotateX(6deg) rotate(${rot}deg) scale(${s})` }}>
        <div style={{ width: w, height: h, background: `linear-gradient(150deg, ${L.porc} 0%, #F1EDE4 48%, #E3DED2 100%)`, borderRadius: 8,
          boxShadow: `0 54px 78px ${L.shadow}, inset 0 3px 0 rgba(255,255,255,0.95), inset 0 -4px 0 rgba(150,142,126,0.5), inset 0 0 0 2px rgba(255,255,255,0.5)` }}>
          <div style={{ position: "absolute", inset: 14, border: `3px solid rgba(160,152,136,0.55)`, borderRadius: 4 }} />
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: fit(num, w * 0.62, w * 0.62, "serif", 90), color: c, lineHeight: 0.92,
              textShadow: "0 2px 0 rgba(255,255,255,0.9), 0 -2px 3px rgba(90,80,64,0.45)" }}>{num}</div>
            {unidad ? <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: fit(unidad, w * 0.7, w * 0.13, "label", 26), color: L.inkSoft, letterSpacing: 4, textTransform: "uppercase", marginTop: 6, textAlign: "center" }}>{unidad}</div> : null}
          </div>
          <Sweep f={0} o={0.34} />
        </div>
      </div>
    );
  };
// cordel de algodón con broches de madera y etiquetas (la casa de Loretta)
export const Line: React.FC<{ w: number; y: number; n: number; sag?: number; o?: number }> = ({ w, y, n, sag = 46, o = 1 }) => (
  <div style={{ position: "absolute", left: (1920 - w) / 2, top: y, opacity: o, pointerEvents: "none" }}>
    <svg width={w} height={sag + 40} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
      <path d={`M0 ${sag * 0.6} Q ${w / 2} ${sag * 0.6 + sag} ${w} ${sag * 0.6}`} stroke="#D9CFBA" strokeWidth={5} fill="none" strokeLinecap="round" />
      {Array.from({ length: n }, (_, i) => { const t = (i + 0.5) / n; const yy = sag * 0.6 + sag * 2 * t * (1 - t) * 2; return <line key={i} x1={w * t} y1={yy} x2={w * t} y2={yy + 30} stroke="#B7A98C" strokeWidth={3} />; })}
    </svg>
  </div>
);

// ── 1 · EL HILO DE LOS CINCO PUNTOS (trapos con broche: cada punto con SU foto) ─
export const LSpots: React.FC<{ st: number; f0: number; title?: string; tags: { img: string; txt: string }[]; note?: string; dur?: number }> =
  ({ st, f0, title, tags, note }) => {
    const f = useCurrentFrame(); const { fps, durationInFrames: T } = useVideoConfig();
    const cam = useCam([[f0, { z: 1.16, x: -120, y: 40, rot: 0.6 }], [f0 + T * 0.44, { z: 1.02, x: -30, y: 8, rot: 0.1 }], [f0 + T, { z: 1.10, x: 90, y: -26, rot: -0.5 }]], f0);
    const n = Math.min(5, tags.length);
    return (
      <AbsoluteFill>
        <Atmos st={st} cam={cam} dim={0.06} fore="towel" />
        <Line w={1560} y={168} n={n} sag={54} o={lin(f, 2, 16)} />
        {tags.slice(0, n).map((t, i) => {
          const x = 1920 / 2 - 780 + (i + 0.5) * (1560 / n);
          const at = 8 + i * Math.round(T * 0.1);
          const p = pop(f, fps, at, 12), k = cl01(p * 1.4);
          const yy = 168 + 54 * 0.6 + 30 + Math.sin(f / 26 + i * 1.4) * 7;
          return (
            <div key={i} style={{ position: "absolute", left: x, top: yy, translate: "-50% 0", opacity: k, transform: `perspective(1400px) rotate(${-4 + 8 * rnd(i + 3)}deg) scale(${0.66 + 0.34 * p})` }}>
              <div style={{ width: 6, height: 26, margin: "0 auto", background: L.woodLight, borderRadius: 3, boxShadow: "0 3px 5px rgba(0,0,0,0.3)" }} />
              <div style={{ background: "#FFFDF6", padding: "14px 14px 40px", borderRadius: 3, boxShadow: `0 40px 66px ${L.shadow}, 0 4px 12px rgba(0,0,0,0.22)` }}>
                <div style={{ width: 246, height: 178, overflow: "hidden", background: "#D9D2C4", borderRadius: 2 }}>
                  <Img src={staticFile(src(t.img)!)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1.05 + 0.04 * Math.sin(f / 70 + i)})` }} />
                </div>
                <div style={{ position: "absolute", left: 0, right: 0, bottom: 8, textAlign: "center", fontFamily: HAND, fontWeight: 700, fontSize: 30, color: L.ink }}>{t.txt}</div>
                <div style={{ position: "absolute", left: -18, top: 16, width: 54, height: 54, borderRadius: 27, background: L.red, color: "#fff", fontFamily: LABEL, fontWeight: 700, fontSize: 30, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 8px 14px rgba(0,0,0,0.32)" }}>{i + 1}</div>
              </div>
            </div>
          );
        })}
        {title ? <Bar x={110} y={98} txt={title} o={lin(f, 4, 20)} /> : null}
        {note ? <Chip x={1500} y={880} txt={note} o={lin(f, T * 0.55, T * 0.55 + 14)} size={54} rot={-2.4} /> : null}
      </AbsoluteFill>
    );
  };

// ── 2 · LA PÁGINA DEL LIBRO (encima de la madera, con lámpara y lupa de mano) ──
export const LPage: React.FC<{ st: number; f0: number; page: string; pageNo?: number; stamp?: string }> = ({ st, f0, page, pageNo, stamp }) => {
  const f = useCurrentFrame(); const { fps, durationInFrames: T } = useVideoConfig();
  const cam = useCam([[f0, { z: 1.14, x: -60, y: 40, rot: 0.7 }], [f0 + T * 0.5, { z: 1.0, x: 0, y: 0, rot: 0 }], [f0 + T, { z: 1.08, x: 50, y: -30, rot: -0.6 }]], f0);
  const p = pop(f, fps, 4, 13), pb = pop(f, fps, 22, 13);
  return (
    <AbsoluteFill>
      <Atmos st={st} cam={cam} dim={0.1} fore="wood" />
      <Pane img={page} x={940} y={560} w={1120} h={760} rot={-2.2} s={0.84 + 0.16 * p} o={cl01(p * 1.6)} f={f} T={T} mat="#F7F1E4" kb={0.05} />
      {/* el lomo del manual asomando detrás (match-shape: la página ES el libro) */}
      <div style={{ position: "absolute", left: 300, top: 96, translate: "-50% 0", opacity: cl01(pb * 1.4), transform: `perspective(1400px) rotate(-5deg) scale(${0.8 + 0.2 * pb})` }}>
        <div style={{ width: 430, height: 560, background: "linear-gradient(160deg,#7A6A9A,#4E4268)", borderRadius: "6px 10px 10px 6px", boxShadow: `0 44px 70px ${L.shadow}` }}>
          <div style={{ margin: "34px 30px", border: "3px solid rgba(240,232,214,0.65)", borderRadius: 4, height: 492, display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", padding: 22 }}>
            <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 46, color: L.cream, lineHeight: 1.1 }}>Clean<br />Home<br />Manual</div>
          </div>
        </div>
      </div>
      {pageNo ? (
        <div style={{ position: "absolute", left: 1436, top: 858, translate: "-50% -50%", opacity: cl01(pb * 1.4), transform: `rotate(${-7 + 2 * pb}deg) scale(${1.5 - 0.5 * pb})` }}>
          <div style={{ background: "rgba(255,255,255,0.6)", border: `6px solid ${L.lilacDeep}`, borderRadius: 8, padding: "4px 26px", fontFamily: LABEL, fontWeight: 700, fontSize: 44, letterSpacing: 6, color: L.lilacDeep, textTransform: "uppercase", whiteSpace: "nowrap" }}>Page {pageNo}</div>
        </div>
      ) : null}
      {stamp ? <Chip x={430} y={790} txt={stamp} o={lin(f, T * 0.5, T * 0.5 + 14)} size={50} rot={-3} color={L.lilacDeep} /> : null}
    </AbsoluteFill>
  );
};

// ── 3 · NO / SÍ (dos impresiones reales, barridas por una varilla de cromo) ────
export const LSplit: React.FC<{ st: number; f0: number; title?: string; no: { img: string; txt: string }; si: { img: string; txt: string } }> =
  ({ st, f0, title, no, si }) => {
    const f = useCurrentFrame(); const { fps, durationInFrames: T } = useVideoConfig();
    const cam = useCam([[f0, { z: 1.14, x: 70, y: 30, rot: -0.6 }], [f0 + T * 0.52, { z: 1.02, x: 0, y: 0, rot: 0 }], [f0 + T, { z: 1.09, x: -60, y: -30, rot: 0.6 }]], f0);
    const pa = pop(f, fps, 3, 13), pb = pop(f, fps, 3 + Math.round(T * 0.26), 13);
    const ka = cl01((f - 16) / 14), kb = cl01((f - 16 - Math.round(T * 0.26)) / 14);
    const wipe = ez(cl01((f - T * 0.56) / (T * 0.3)));   // costura: la varilla barre y deja el mundo limpio
    return (
      <AbsoluteFill>
        <Atmos st={st} cam={cam} dim={0.08 * (1 - wipe) + 0.02} fore="wood" warm={1 + 0.5 * wipe} />
        <Pane img={no.img} x={596} y={566} w={640} h={470} rot={-3.4} s={0.78 + 0.22 * pa} o={cl01(pa * 1.5)} f={f + 10} T={T} dim={0.24 * (1 - ka * 0.4)} kb={0.05} />
        <Pane img={si.img} x={1336} y={546} w={640} h={470} rot={3} s={0.78 + 0.22 * pb} o={cl01(pb * 1.5)} f={f} T={T} kb={0.05} />
        <Ink kind="no" k={ka} size={210} x={418} y={392} />
        <Ink kind="si" k={kb} size={210} x={1158} y={372} />
        <div style={{ position: "absolute", left: 596, top: 900, translate: "-50% -50%", opacity: cl01(pa * 1.4), fontFamily: HAND, fontWeight: 700, fontSize: fit(no.txt, 600, 52, "hand", 30), color: L.ink, background: "rgba(255,253,246,0.92)", padding: "2px 20px", borderRadius: 6, rotate: "-1.6deg" }}>{no.txt}</div>
        <div style={{ position: "absolute", left: 1336, top: 880, translate: "-50% -50%", opacity: cl01(pb * 1.4), fontFamily: HAND, fontWeight: 700, fontSize: fit(si.txt, 600, 52, "hand", 30), color: L.ink, background: "rgba(255,253,246,0.92)", padding: "2px 20px", borderRadius: 6, rotate: "1.4deg" }}>{si.txt}</div>
        {title ? <Bar x={110} y={98} txt={title} o={lin(f, 4, 18)} /> : null}
        {/* varilla de cromo: cruza y ocluye el 100% en 3-4 cuadros (costura válida) */}
        {wipe > 0.001 && wipe < 0.999 ? (
          <div style={{ position: "absolute", top: -60, bottom: -60, left: `${wipe * 116 - 8}%`, width: 26, translate: "-50% 0",
            background: `linear-gradient(90deg, ${L.chromeDark}, ${L.chrome} 40%, #FFFFFF 52%, ${L.chrome} 62%, ${L.chromeDark})`, boxShadow: "0 0 40px rgba(0,0,0,0.45)", rotate: "2deg" }} />
        ) : null}
      </AbsoluteFill>
    );
  };

// ── 4 · LOS PASOS (una mesa de trabajo: el paso activo en grande, la tira abajo) ─
export const LSteps: React.FC<{ st: number; f0: number; title?: string; pasos: { img: string; txt: string }[] }> = ({ st, f0, title, pasos }) => {
  const f = useCurrentFrame(); const { fps, durationInFrames: T } = useVideoConfig();
  const per = Math.max(46, Math.floor(T / Math.min(4, pasos.length)));   // nunca menos de 1,5 s por paso
  const n = Math.max(1, Math.min(Math.min(4, pasos.length), Math.floor(T / per)));
  const act = Math.min(n - 1, Math.floor(f / per));
  const cam = useCam([[f0, { z: 1.18, x: -150, y: 30, rot: 0.8 }], [f0 + T * 0.45, { z: 1.03, x: 0, y: 0, rot: 0 }], [f0 + T, { z: 1.10, x: 130, y: -22, rot: -0.7 }]], f0);
  const kAct = ez(cl01((f - act * per) / 12));
  return (
    <AbsoluteFill>
      <Atmos st={st} cam={cam} dim={0.07} fore="wood" />
      {/* la bandeja de vidrio con el paso activo adentro */}
      <Glass x={960} y={470} w={1180} h={660} rot={-0.8} z={40}>
        {pasos.slice(0, n).map((p, i) => (
          <AbsoluteFill key={i} style={{ opacity: i === act ? 1 : 0 }}>
            <Img src={staticFile(src(p.img)!)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1.02 + 0.05 * ((f - i * per) / per)})` }} />
          </AbsoluteFill>
        ))}
        <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(255,246,224,0.14), rgba(0,0,0,0) 40%, rgba(20,16,30,0.3))" }} />
        <Sweep f={f} o={0.55} wide={1.6} />
      </Glass>
      {/* la tira de negativos delante: cada paso su miniatura, el activo se levanta */}
      {pasos.slice(0, n).map((p, i) => {
        const on = i === act;
        const x = 960 + (i - (n - 1) / 2) * 268;
        return (
          <div key={i} style={{ position: "absolute", left: x, top: 902, translate: "-50% -50%",
            transform: `perspective(1300px) translateZ(${on ? 180 : 60}px) rotate(${on ? 0 : (i % 2 ? 2 : -2)}deg) scale(${on ? 1.1 * (0.9 + 0.1 * kAct) : 0.86})`, opacity: on ? 1 : 0.72 }}>
            <div style={{ background: "#FFFDF6", padding: 10, borderRadius: 3, boxShadow: `0 ${on ? 40 : 20}px ${on ? 60 : 34}px ${L.shadow}` }}>
              <div style={{ width: 196, height: 138, overflow: "hidden", background: "#D9D2C4", borderRadius: 2 }}>
                <Img src={staticFile(src(p.img)!)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
              <div style={{ marginTop: 6, textAlign: "center", fontFamily: HAND, fontWeight: 700, fontSize: fit(p.txt, 190, 26, "hand", 18), color: L.ink, whiteSpace: "nowrap" }}>{p.txt}</div>
            </div>
            <div style={{ position: "absolute", left: -20, top: -20, width: 46, height: 46, borderRadius: 23, background: on ? L.lilacDeep : L.chromeDark, color: "#fff", fontFamily: LABEL, fontWeight: 700, fontSize: 26, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 6px 12px rgba(0,0,0,0.35)" }}>{i + 1}</div>
          </div>
        );
      })}
      {title ? <Bar x={110} y={98} txt={title} o={lin(f, 4, 18)} /> : null}
    </AbsoluteFill>
  );
};

// ── 5 · ANTES / DESPUÉS (un mismo encuadre, barrido por la espátula de goma) ───
export const LBeforeAfter: React.FC<{ st: number; f0: number; antes: string; despues: string; a?: string; b?: string; nota?: string }> =
  ({ st, f0, antes, despues, a = "BEFORE", b = "AFTER", nota }) => {
    const f = useCurrentFrame(); const { fps, durationInFrames: T } = useVideoConfig();
    const cam = useCam([[f0, { z: 1.13, x: -40, y: 34, rot: 0.6 }], [f0 + T * 0.5, { z: 1.01, x: 10, y: -6, rot: -0.15 }], [f0 + T, { z: 1.08, x: 40, y: -26, rot: -0.5 }]], f0);
    const p = pop(f, fps, 3, 13);
    const k = ez(cl01((f - T * 0.3) / (T * 0.42)));
    return (
      <AbsoluteFill>
        <Atmos st={st} cam={cam} dim={0.06 + 0.05 * (1 - k)} fore="wood" warm={1 + 0.6 * k} />
        <div style={{ position: "absolute", left: 960, top: 500, translate: "-50% -50%", transform: `perspective(1600px) rotate(${-1 + 1.4 * k}deg) scale(${0.82 + 0.18 * p})`, opacity: cl01(p * 1.6) }}>
          <div style={{ background: "#FFFDF7", padding: 22, borderRadius: 6, boxShadow: `0 56px 92px ${L.shadow}, inset 0 2px 0 rgba(255,255,255,0.9)` }}>
            <div style={{ position: "relative", width: 1240, height: 720, overflow: "hidden", borderRadius: 3, boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.18)" }}>
              <Img src={staticFile(src(antes)!)} style={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover", filter: "saturate(0.72) brightness(0.9)" }} />
              <div style={{ position: "absolute", inset: 0, clipPath: `inset(0 ${100 - k * 100}% 0 0)` }}>
                <Img src={staticFile(src(despues)!)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1.02 + 0.03 * (f / T)})` }} />
              </div>
              <div style={{ position: "absolute", top: 0, bottom: 0, left: `${k * 100}%`, width: 12, translate: "-50% 0", background: "linear-gradient(90deg,#8E979F,#F2F5F7 45%,#8E979F)", boxShadow: "0 0 22px rgba(0,0,0,0.5)", opacity: k > 0.005 && k < 0.995 ? 1 : 0 }} />
            </div>
          </div>
          <div style={{ position: "absolute", left: 36, top: 40, opacity: cl01(1 - k * 1.5), fontFamily: LABEL, fontWeight: 700, fontSize: 40, letterSpacing: 3, color: "#fff", background: L.red, padding: "3px 18px", borderRadius: 6 }}>{a}</div>
          <div style={{ position: "absolute", right: 36, top: 40, opacity: cl01(k * 1.5 - 0.5), fontFamily: LABEL, fontWeight: 700, fontSize: 40, letterSpacing: 3, color: "#fff", background: L.sage, padding: "3px 18px", borderRadius: 6 }}>{b}</div>
          <Tape x={-30} y={-20} rot={-9} w={150} />
        </div>
        {nota ? <Chip x={1548} y={944} txt={nota} o={lin(f, T * 0.62, T * 0.62 + 14)} size={54} rot={-2.2} /> : null}
      </AbsoluteFill>
    );
  };

// ── 6 · EL NÚMERO EN PORCELANA (con la foto de lo que se cuenta al lado) ───────
export const LNumber: React.FC<{ st: number; f0: number; num: string; unidad?: string; txt?: string; img?: string; alerta?: boolean }> =
  ({ st, f0, num, unidad, txt, img, alerta }) => {
    const f = useCurrentFrame(); const { fps, durationInFrames: T } = useVideoConfig();
    const cam = useCam([[f0, { z: 1.12, x: 60, y: 24, rot: -0.5 }], [f0 + T * 0.5, { z: 1.0, x: -20, y: 4, rot: 0.2 }], [f0 + T, { z: 1.07, x: -70, y: -22, rot: 0.6 }]], f0);
    const p = pop(f, fps, 4, 11), p2 = pop(f, fps, 14, 13);
    const isN = /^\d+([.,]\d+)?$/.test(num.trim());
    const v = parseFloat(num.replace(",", "."));
    const shown = isN ? (Number.isInteger(v) ? String(Math.round(v * ez(cl01((f - 6) / 24)))) : (v * ez(cl01((f - 6) / 24))).toFixed(1)) : num;
    const cx = img ? 1274 : 960;
    return (
      <AbsoluteFill>
        <Atmos st={st} cam={cam} dim={0.08} fore="wood" />
        {img ? <Pane img={img} x={566} y={556} w={700} h={520} rot={-3.6} o={cl01(p2 * 1.5)} s={0.82 + 0.18 * p2} f={f} T={T} kb={0.05} /> : null}
        <Tile num={shown} unidad={unidad} x={cx} y={500} o={cl01(p * 1.5)} s={0.72 + 0.28 * p} rot={-2.2 + 1.4 * p} alerta={alerta} w={530} />
        {txt ? <Chip x={cx} y={836} txt={txt} o={lin(f, 22, 36)} size={58} rot={-2.6} /> : null}
      </AbsoluteFill>
    );
  };

// ── 7 · EL CALENDARIO DE LA COCINA (madera, papel, sello de goma) ──────────────
export const LCalendar: React.FC<{ st: number; f0: number; title?: string; cada: number; dias?: number; txt?: string }> =
  ({ st, f0, title, cada, dias = 28, txt }) => {
    const f = useCurrentFrame(); const { fps, durationInFrames: T } = useVideoConfig();
    const p = pop(f, fps, 3, 12), cw = 132, ch = 96;
    const marcados = Array.from({ length: dias }, (_, i) => i + 1).filter((d) => (d - 1) % Math.max(1, cada) === 0);
    const cam = useCam([[f0, { z: 1.14, x: -70, y: 26, rot: 0.7 }], [f0 + T * 0.5, { z: 1.02, x: 0, y: 0, rot: 0 }], [f0 + T, { z: 1.09, x: 60, y: -24, rot: -0.6 }]], f0);
    return (
      <AbsoluteFill>
        <Atmos st={st} cam={cam} dim={0.07} fore="wood" />
        <div style={{ position: "absolute", left: 900, top: 548, translate: "-50% -50%", opacity: cl01(p * 1.5), transform: `perspective(1600px) rotateX(4deg) rotate(${-1.4 + 1.2 * p}deg) scale(${0.88 + 0.12 * p})` }}>
          {/* barra de madera con dos clavos, como el calendario de la cocina */}
          <div style={{ position: "absolute", left: -34, right: -34, top: -30, height: 34, borderRadius: 5, background: `linear-gradient(180deg, ${L.woodLight}, ${L.wood} 55%, ${L.woodDark})`, boxShadow: "0 10px 18px rgba(0,0,0,0.34)" }} />
          <div style={{ background: "#FFFDF4", padding: "30px 34px 30px", borderRadius: 3, boxShadow: `0 50px 82px ${L.shadow}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", borderBottom: `5px solid ${L.lilacDeep}`, paddingBottom: 8, marginBottom: 12 }}>
              <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: fit(title || "This month", 640, 60, "serif"), color: L.ink }}>{title || "This month"}</div>
              <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 38, color: L.red, letterSpacing: 2 }}>{cada === 1 ? "EVERY DAY" : `EVERY ${cada} DAYS`}</div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: `repeat(7, ${cw}px)` }}>
              {Array.from({ length: dias }, (_, i) => {
                const d = i + 1, mi = marcados.indexOf(d);
                const at = mi < 0 ? 1e9 : 14 + mi * Math.round((T * 0.55) / Math.max(1, marcados.length));
                const k = ez(cl01((f - at) / 9)); const pk = pop(f, fps, at, 8, 200);
                return (
                  <div key={d} style={{ position: "relative", height: ch, borderRight: `2px solid ${L.grout}`, borderBottom: `2px solid ${L.grout}`, fontFamily: LABEL, fontWeight: 600, fontSize: 36, color: L.ink, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {d}
                    {mi >= 0 ? (
                      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", opacity: k, transform: `scale(${1.5 - 0.5 * pk}) rotate(${-6 + 4 * rnd(d)}deg)` }}>
                        <div style={{ width: cw * 0.74, height: ch * 0.7, border: `5px solid ${L.red}`, borderRadius: 3, opacity: 0.9, boxShadow: "inset 0 0 6px rgba(185,58,43,0.28)" }} />
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>
          <Sweep f={f} o={0.3} />
        </div>
        {txt ? <Chip x={1560} y={940} txt={txt} o={lin(f, T * 0.55, T * 0.55 + 14)} size={56} rot={-2} /> : null}
      </AbsoluteFill>
    );
  };

// ── 8 · LA TARJETA DEL QR (apoyada contra el espejo del lavabo) ────────────────
export const LQr: React.FC<{ st: number; f0: number; qr: string; cover?: string; text?: string; kicker?: string }> =
  ({ st, f0, qr, cover, text, kicker }) => {
    const f = useCurrentFrame(); const { fps, durationInFrames: T } = useVideoConfig();
    const p = pop(f, fps, 4, 12), pb = pop(f, fps, 18, 12);
    const cam = useCam([[f0, { z: 1.15, x: -80, y: 30, rot: 0.5 }], [f0 + T * 0.5, { z: 1.0, x: 10, y: 0, rot: 0 }], [f0 + T, { z: 1.08, x: 60, y: -26, rot: -0.55 }]], f0);
    return (
      <AbsoluteFill>
        <Atmos st={st} cam={cam} dim={0.08} fore="none" />
        {cover ? <Pane img={cover} x={470} y={556} w={560} h={700} rot={-4.5} o={cl01(pb * 1.4)} s={0.82 + 0.18 * pb} f={f} T={T} mat="#F7F1E4" kb={0.05} /> : null}
        <Glass x={1276} y={536} w={700} h={760} rot={2.4} z={60} tone={0.2}>
          <div style={{ position: "absolute", inset: 26, background: "#FFFDF7", borderRadius: 4, boxShadow: "0 20px 40px rgba(0,0,0,0.22), inset 0 0 0 1px rgba(0,0,0,0.08)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", opacity: cl01(p * 1.5) }}>
            {kicker ? <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 30, letterSpacing: 4, color: L.lilacDeep, textTransform: "uppercase", marginBottom: 12 }}>{kicker}</div> : null}
            <div style={{ width: 372, height: 372, overflow: "hidden", borderRadius: 4, boxShadow: "inset 0 0 0 2px rgba(0,0,0,0.12)" }}>
              <Img src={staticFile(src(qr)!)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
            {text ? <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: fit(text, 560, 50, "hand", 30), color: L.ink, marginTop: 16 }}>{text}</div> : null}
            {/* el teléfono entrando a escanear (materia que cruza la frontera) */}
            <div style={{ position: "absolute", right: -230 + 148 * ez(cl01((f - T * 0.52) / (T * 0.34))), bottom: -80, width: 196, height: 330, borderRadius: 24, background: "linear-gradient(150deg,#4A4F57,#2A2F35)", boxShadow: "0 30px 50px rgba(0,0,0,0.45)", rotate: "-13deg" }}>
              <div style={{ position: "absolute", inset: 9, borderRadius: 16, background: "#141A1E", boxShadow: "inset 0 0 24px rgba(120,190,255,0.28)" }} />
            </div>
          </div>
        </Glass>
        <Sweep f={f} o={0.5} wide={1.4} />
      </AbsoluteFill>
    );
  };

// ── 9 · EL VIDEO DEL CANAL (la miniatura como impresión real, con etiqueta de papel) ─
export const LChannel: React.FC<{ st: number; f0: number; thumb: string; title: string; tag?: string; next?: boolean }> =
  ({ st, f0, thumb, title, tag }) => {
    const f = useCurrentFrame(); const { fps, durationInFrames: T } = useVideoConfig();
    const p = pop(f, fps, 4, 12), pt = pop(f, fps, 20, 12);
    const cam = useCam([[f0, { z: 1.16, x: 90, y: 26, rot: -0.7 }], [f0 + T * 0.5, { z: 1.02, x: 0, y: 0, rot: 0 }], [f0 + T, { z: 1.10, x: -60, y: -24, rot: 0.6 }]], f0);
    return (
      <AbsoluteFill>
        <Atmos st={st} cam={cam} dim={0.07} fore="wood" />
        <Pane img={thumb} x={960} y={518} w={1240} h={700} rot={-2.6} s={0.8 + 0.2 * p} o={cl01(p * 1.6)} f={f} T={T} kb={0.05} />
        {/* la etiqueta de papel del rótulo, pegada con cinta sobre la esquina */}
        <div style={{ position: "absolute", left: 1290, top: 216, translate: "-50% -50%", opacity: cl01(pt * 1.5), transform: `rotate(${3.4 - 1.6 * pt}deg) scale(${0.84 + 0.16 * pt})` }}>
          <div style={{ position: "relative", background: L.lilacDeep, color: "#fff", padding: "10px 30px 12px", borderRadius: 3, boxShadow: `0 34px 54px ${L.shadow}` }}>
            <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 30, letterSpacing: 5, opacity: 0.85 }}>{tag || "ON THE CHANNEL"}</div>
          </div>
          <Tape x={-30} y={-18} rot={-7} w={140} />
        </div>
        <div style={{ position: "absolute", left: 470, top: 958, translate: "-50% -50%", opacity: cl01(pt * 1.5), fontFamily: HAND, fontWeight: 700, fontSize: fit(title, 900, 60, "hand", 32), color: L.ink, background: "rgba(255,253,246,0.94)", padding: "4px 26px", borderRadius: 6, rotate: "-2deg", boxShadow: `0 20px 34px ${L.shadow}` }}>{title}</div>
      </AbsoluteFill>
    );
  };

// ── 10 · LA LISTA (el bloc de la cocina, con los ítems tildados a mano) ────────
export const LList: React.FC<{ st: number; f0: number; title: string; items: string[] }> = ({ st, f0, title, items }) => {
  const f = useCurrentFrame(); const { fps, durationInFrames: T } = useVideoConfig();
  const p = pop(f, fps, 4, 12);
  const cam = useCam([[f0, { z: 1.14, x: -50, y: 30, rot: 0.6 }], [f0 + T * 0.5, { z: 1.01, x: 0, y: 0, rot: 0 }], [f0 + T, { z: 1.08, x: 50, y: -24, rot: -0.55 }]], f0);
  const n = Math.min(4, items.length);
  return (
    <AbsoluteFill>
      <Atmos st={st} cam={cam} dim={0.07} fore="wood" />
      <div style={{ position: "absolute", left: 960, top: 540, translate: "-50% -50%", opacity: cl01(p * 1.5), transform: `perspective(1600px) rotate(${-1.2 + 1.2 * p}deg) scale(${0.9 + 0.1 * p})` }}>
        <div style={{ width: 1180, background: `repeating-linear-gradient(#FFFDF6 0 84px, #C9D6E4 84px 86px)`, padding: "30px 42px 40px", borderRadius: 3, boxShadow: `0 54px 86px ${L.shadow}` }}>
          <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: fit(title, 1000, 60, "serif"), color: L.ink, lineHeight: "86px" }}>{title}</div>
          {items.slice(0, n).map((t, i) => {
            const at = 22 + i * Math.round(T * 0.13);
            const k = ez(cl01((f - at) / 12));
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 18, height: 86 }}>
                <div style={{ width: 42, height: 42, border: `4px solid ${L.inkSoft}`, borderRadius: 4, position: "relative", background: "rgba(255,255,255,0.6)" }}>
                  <svg width={42} height={42} viewBox="0 0 100 100" style={{ position: "absolute", left: -4, top: -6, overflow: "visible" }}>
                    <path d="M16 54 L40 78 L86 20" fill="none" stroke={L.sage} strokeWidth={13} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={110} strokeDashoffset={110 * (1 - k)} />
                  </svg>
                </div>
                <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: fit(t, 940, 52, "hand", 30), color: L.ink, lineHeight: "86px", opacity: cl01(0.35 + 0.65 * k) }}>{t}</div>
              </div>
            );
          })}
        </div>
        <Tape x={560} y={-22} rot={-6} w={170} />
        <Tape x={-40} y={-18} rot={5} w={150} />
      </div>
    </AbsoluteFill>
  );
};
