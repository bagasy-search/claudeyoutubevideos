// gb01 v2 · el HUB: el monje RECORTADO (reel_alfa.webm = RVM en el farm) en el centro sobre negro, un mandala de neón
// detrás y lo que va nombrando flotando a su alrededor en 3 anillos con profundidad (los de atrás chicos y desenfocados,
// los de adelante grandes y pasando por delante del monje). Cada objeto sale del pecho del monje EXACTO con su palabra.
// El portal: al final de la ventana la cámara se zambulle en UN objeto y adentro ya está viva la escena siguiente
// (Video.tsx arma las capas). Todo en px de pantalla 1920x1080.
import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, Sequence, staticFile } from "remotion";
import { FPS, N, BlurDef, NeonPath, clamp, ease, easeOut, lerp, neonOn, pop, ramp, respira, useSvgId } from "../../kits/neon/base";
import { interpolate } from "remotion";
import { P, Ventana } from "./datos";

export type P2 = [number, number];

// ───────── anillos de órbita ─────────
// θ en grados: 90 = adelante-abajo (más cerca), 270 = atrás-arriba (más lejos). profundidad = sin θ.
export const ANILLOS = [
  { cx: 960, cy: 540, rx: 600, ry: 140, w: 9 }, // 0 · ancho, lento
  { cx: 960, cy: 430, rx: 430, ry: 105, w: -13 }, // 1 · medio, al revés
  { cx: 960, cy: 720, rx: 720, ry: 220, w: 6 }, // 2 · bien adelante (pasa por delante del monje)
] as const;
export const CENTRO: P2 = [960, 520];
export const PECHO: P2 = [960, 760];

export type Orb = {
  id: string;
  t: number; // aparece (palabra)
  ang: number; // grados en t
  anillo?: 0 | 1 | 2;
  tam?: number; // px del objeto a profundidad 0
  t1?: number; // se va (opcional)
  D: React.FC<{ t: number; t0: number; on: number; tam: number }>; // dibujo centrado en (0,0), cabe en ±tam/2
  png?: string; // objeto de vidrio (public/gb01/png/<png>.png) en lugar del dibujo
};
export type HubSpec = { orbs: Orb[]; portal: string; Pantalla?: React.FC<{ t: number }> };

export const posOrb = (o: Orb, t: number, congela?: number) => {
  const a = ANILLOS[o.anillo ?? 0];
  const tt = congela !== undefined ? Math.min(t, congela) : t;
  const th = ((o.ang + a.w * (tt - o.t)) * Math.PI) / 180;
  const prof = Math.sin(th);
  const esc = (0.82 + 0.3 * prof) * 1.45;
  return { x: a.cx + a.rx * Math.cos(th), y: a.cy + a.ry * prof, prof, esc, r: ((o.tam ?? 200) * esc) / 2 };
};

// ───────── el monje recortado ─────────
const MON = { esc: 1.62, w: 832, h: 464 };
export const MonjeHub: React.FC<{ v: Ventana; t: number }> = ({ v, t }) => {
  const W = MON.w * MON.esc, Hh = MON.h * MON.esc;
  const on = Math.min(ramp(t, v.t0 - 0.14, 0.2), 1 - ramp(t, v.t1 - 0.2, 0.2));
  if (on <= 0.001) return null;
  const pre = 0.25; // arranca un poco antes para que el decodificador ya esté en el cuadro justo
  const from = Math.max(0, Math.round((v.t0 - pre) * FPS));
  const start = Math.max(0, Math.round((v.r0 - (v.t0 * FPS - from) / FPS) * FPS));
  const dur = Math.round((v.t1 - v.t0 + pre + 0.1) * FPS);
  const k = ramp(t, v.t0 - 0.14, 0.5, easeOut);
  return (
    <div style={{ position: "absolute", left: 960 - W / 2, top: 1080 - Hh + 40, width: W, height: Hh, opacity: on, transform: `scale(${0.96 + 0.04 * k})`, transformOrigin: "50% 100%" }}>
      <Sequence from={from} durationInFrames={dur} layout="none">
        <AbsoluteFill>{/* avatar nítido: sin halo, sin fundido ni desenfoque (orden del creador 21-oct) */}
          <OffthreadVideo src={staticFile("gb01es/reel_alfa.webm")} transparent muted startFrom={start} style={{ width: "100%", height: "100%" }} />
        </AbsoluteFill>
      </Sequence>
    </div>
  );
};

// ───────── mandala de neón detrás del monje (gira lento, respira) ─────────
export const Mandala: React.FC<{ t: number; t0: number; color?: string }> = ({ t, t0, color = N.cian }) => {
  const id = useSvgId("md");
  const on = ramp(t, t0 - 0.6, 0.8);
  const R = [250, 330, 410];
  return (
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: on * 0.9 }}>
      <defs>
        <BlurDef id={id} s={6} />
      </defs>
      {R.map((r, i) => {
        const giro = (i % 2 ? -1 : 1) * (t * (6 + i * 3));
        const n = 12 + i * 12;
        const ticks = Array.from({ length: n }, (_, j) => {
          const a = (j / n) * Math.PI * 2;
          const l = j % 3 === 0 ? 16 : 7;
          return `M${Math.cos(a) * r},${Math.sin(a) * r} L${Math.cos(a) * (r - l)},${Math.sin(a) * (r - l)}`;
        }).join(" ");
        return (
          <g key={i} transform={`translate(${CENTRO[0]},${CENTRO[1]}) rotate(${giro}) scale(1,0.92)`} opacity={(0.55 - i * 0.12) * neonOn(t, t0 - 0.5 + i * 0.12)}>
            <NeonPath d={`M${r},0 A${r},${r} 0 1,1 ${-r},0 A${r},${r} 0 1,1 ${r},0`} color={i === 1 ? N.violeta : color} ancho={1.4} blurId={id} />
            <NeonPath d={ticks} color={i === 1 ? N.violeta : color} ancho={0.9} halo={0.5} blurId={id} />
          </g>
        );
      })}
    </svg>
  );
};

// ───────── un objeto en órbita (con su vuelo de salida desde el pecho del monje) ─────────
export const OrbView: React.FC<{ o: Orb; t: number; congela?: number; brillo?: number }> = ({ o, t, congela, brillo = 0 }) => {
  const id = useSvgId("ob");
  if (t < o.t - 0.05) return null;
  const p = posOrb(o, t, congela);
  const k = ramp(t, o.t - 0.05, 0.55, easeOut);
  const x = lerp(PECHO[0], p.x, k), y = lerp(PECHO[1], p.y, k);
  const s = pop(t, o.t - 0.05, 11) * p.esc;
  const out = o.t1 ? 1 - ramp(t, o.t1 - 0.3, 0.3) : 1;
  const blur = p.prof < 0 ? -p.prof * 3.2 : 0;
  const tam = o.tam ?? 200;
  const on = neonOn(t, o.t + 0.05);
  return (
    <div style={{ position: "absolute", left: x, top: y, width: 0, height: 0, opacity: out * (0.62 + 0.38 * (p.prof + 1) / 2), filter: blur > 0.3 ? `blur(${blur.toFixed(1)}px)` : undefined }}>
      {k < 1 && (
        <svg width={1} height={1} style={{ position: "absolute", overflow: "visible" }}>
          <defs><BlurDef id={id} s={4} /></defs>
          <path d={`M${PECHO[0] - x},${PECHO[1] - y} L0,0`} stroke="#fff" strokeWidth={3} opacity={0.5 * (1 - k)} filter={`url(#${id})`} />
        </svg>
      )}
      {brillo > 0 && (
        <div style={{ position: "absolute", left: -tam * 0.75 * s, top: -tam * 0.75 * s, width: tam * 1.5 * s, height: tam * 1.5 * s, borderRadius: "50%", border: `3px solid rgba(203,251,255,${0.85 * brillo})`,
          boxShadow: `0 0 ${40 * brillo}px rgba(39,227,255,${0.6 * brillo}), inset 0 0 ${40 * brillo}px rgba(39,227,255,${0.4 * brillo})`, transform: `scale(${0.9 + 0.1 * respira(t, 1, 0.5)})` }} />
      )}
      <div style={{ position: "absolute", transform: `scale(${s})` }}>
        {o.png
          ? <Img src={staticFile(`gb01/png/${o.png}.png`)} style={{ position: "absolute", width: tam * 1.25, left: -tam * 0.625, top: -tam * 0.625, opacity: on, transform: `rotate(${Math.sin((t - o.t) * 1.1) * 4}deg)`, filter: `brightness(${1 + 0.8 * (1 - ramp(t, o.t, 0.6))}) drop-shadow(0 0 18px rgba(39,227,255,.45))` }} />
          : <o.D t={t} t0={o.t} on={on} tam={tam} />}
      </div>
    </div>
  );
};

// partículas de luz adelante (capa más cercana, desenfocadas) para que haya profundidad
// las órbitas mismas: elipses finas punteadas que giran (la mitad de atrás va detrás del monje)
export const Orbitas: React.FC<{ t: number; t0: number; mitad: "atras" | "adelante" }> = ({ t, t0, mitad }) => {
  const on = ramp(t, t0 - 0.5, 0.8);
  return (
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: on * 0.55 }}>
      {ANILLOS.map((a, i) => {
        const y0 = a.cy;
        const d = mitad === "atras" ? `M${a.cx - a.rx},${y0} A${a.rx},${a.ry} 0 0,1 ${a.cx + a.rx},${y0}` : `M${a.cx - a.rx},${y0} A${a.rx},${a.ry} 0 0,0 ${a.cx + a.rx},${y0}`;
        const col = [N.cian, N.violeta, N.oro][i];
        return <path key={i} d={d} fill="none" stroke={col} strokeWidth={mitad === "adelante" ? 1.6 : 1.1} strokeDasharray="2 12" strokeDashoffset={-t * 18 * (a.w > 0 ? 1 : -1)} strokeLinecap="round" opacity={mitad === "adelante" ? 0.8 : 0.45} style={{ filter: `drop-shadow(0 0 4px ${col})` }} />;
      })}
    </svg>
  );
};

export const Polvo: React.FC<{ t: number; semilla: number }> = ({ t, semilla }) => (
  <>
    {Array.from({ length: 9 }).map((_, i) => {
      const r = (n: number) => { const x = Math.sin((i + 1) * 91.7 + semilla * 13.3 + n * 7.1) * 9999; return x - Math.floor(x); };
      const x = (r(1) * 2200 - 140 + t * (12 + r(2) * 18)) % 2200 - 140;
      const y = 120 + r(3) * 860 + 14 * Math.sin(t * 0.6 + i);
      const d = 6 + r(4) * 22;
      return <div key={i} style={{ position: "absolute", left: x, top: y, width: d, height: d, borderRadius: "50%", background: i % 3 ? "rgba(203,251,255,.5)" : "rgba(244,194,74,.45)", filter: `blur(${2 + d / 4}px)`, opacity: 0.5 + 0.3 * Math.sin(t + i) }} />;
    })}
  </>
);

// ───────── el hub completo de una ventana ─────────
// zambu: estado del portal de salida (0..1) — Video.tsx escala esta capa hacia el objeto portal.
export const Hub: React.FC<{ v: Ventana; spec: HubSpec; t: number; i: number; congela?: number; brilloPortal?: number }> = ({ v, spec, t, i, congela, brilloPortal = 0 }) => {
  const atras = spec.orbs.filter((o) => posOrb(o, t, congela).prof < 0);
  const adelante = spec.orbs.filter((o) => posOrb(o, t, congela).prof >= 0).sort((a, b) => posOrb(a, t, congela).prof - posOrb(b, t, congela).prof);
  return (
    <AbsoluteFill style={{ background: N.bg }}>
      <AbsoluteFill style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,.06) 1px, transparent 1.6px)", backgroundSize: "56px 56px", backgroundPosition: `${(t * 6) % 56}px 0px` }} />
      <Mandala t={t} t0={v.t0} color={i % 2 ? N.cian : N.violeta} />
      <Orbitas t={t} t0={v.t0} mitad="atras" />
      {atras.map((o) => <OrbView key={o.id} o={o} t={t} congela={congela} brillo={o.id === spec.portal ? brilloPortal : 0} />)}
      <MonjeHub v={v} t={t} />
      <Orbitas t={t} t0={v.t0} mitad="adelante" />
      {adelante.map((o) => <OrbView key={o.id} o={o} t={t} congela={congela} brillo={o.id === spec.portal ? brilloPortal : 0} />)}
      <Polvo t={t} semilla={i} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 48%, transparent 58%, rgba(0,0,0,.6) 100%)" }} />
      {spec.Pantalla && <spec.Pantalla t={t} />}
    </AbsoluteFill>
  );
};

export const rampa = (t: number, a: number, b: number) => interpolate(t, [a, b], [0, 1], { ...clamp, easing: ease });
