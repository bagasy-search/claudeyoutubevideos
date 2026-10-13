// jpasco · escenas héroe (Claudio en Japón, ep. 7). Capas: cama (foto desenfocada) → material real (fotos impresas, la página del libro)
// → marcas (círculo rojo, notas en papel, chips) → contador sólo cuando dice un tiempo o número → grade + grano.
// Todos los tiempos (t, t1…) son segundos ABSOLUTOS de la voz; a = segundo de entrada de la escena, d = cuadros.
import React from "react";
import { AbsoluteFill, Img, useCurrentFrame } from "remotion";
import { SERIF, LABEL, HAND, fr, cl, ez, eo, img, C, Grade, Grain, Mark, Print, Chip, Bed, sp } from "./Base";

type P<T> = React.FC<T & { a: number; d: number }>;
const useT = (a: number) => { const f = useCurrentFrame(); return { f, at: (t: number) => fr(t) - fr(a) }; };
type Cam = { x: number; y: number; s: number; t: number };
// cámara por claves (x,y en píxeles del lienzo 1920x1080, s = zoom); eased entre claves
const camAt = (f: number, at: (t: number) => number, K: Cam[], dur = 1.2): Cam => {
  if (!K.length) return { x: 960, y: 540, s: 1, t: 0 };
  const ks = K.map((k) => ({ ...k, f: at(k.t) }));
  if (f <= ks[0].f) return { x: ks[0].x, y: ks[0].y, s: ks[0].s, t: 0 };
  for (let i = 0; i < ks.length - 1; i++) {
    const A = ks[i], B = ks[i + 1];
    if (f <= B.f) { const u = ez((f - A.f) / Math.max(1, Math.min(B.f - A.f, dur * 30))); return { x: A.x + (B.x - A.x) * u, y: A.y + (B.y - A.y) * u, s: A.s + (B.s - A.s) * u, t: 0 }; }
  }
  const L = ks[ks.length - 1]; return { x: L.x, y: L.y, s: L.s, t: 0 };
};
const camStyle = (c: Cam): React.CSSProperties => ({ transformOrigin: "0 0", transform: `translate(${960 - c.x * c.s}px, ${540 - c.y * c.s}px) scale(${c.s})` });
const cardTxt = "0 6px 26px rgba(0,0,0,0.65)";
const note = (txt: string, o: number, rot = -2) => (
  <div style={{ background: "#FBF3DC", color: "#2B2620", fontFamily: HAND, fontSize: 64, lineHeight: 1.1, padding: "14px 26px", boxShadow: "0 12px 26px rgba(0,0,0,0.35)", transform: `rotate(${rot}deg)`, opacity: o, maxWidth: 620 }}>{txt}</div>
);
const word = (txt: string, o: number, size = 150) => (
  <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: size, color: C.porc, opacity: o, textShadow: cardTxt, lineHeight: 1 }}>{txt}</div>
);

// ── 1. LidSpray (ítem 1): baño abierto → arco rojo "tapa abierta" → tapa cerrada + chip "SIEMPRE ABAJO" ──
export const LidSpray: P<{ open: string; shut: string; t1: number; t2: number; t3: number }> = ({ a, d, open, shut, t1, t2, t3 }) => {
  const { f, at } = useT(a);
  const cam = camAt(f, at, [{ x: 960, y: 540, s: 1.02, t: a }, { x: 760, y: 700, s: 1.25, t: t1 }, { x: 760, y: 700, s: 1.25, t: t2 }], 1.4);
  const arc = eo((f - at(t1)) / 30), ok = sp(f, at(t2), 13, 170), shutOp = cl((f - at(t2) - 6) / 14);
  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#000" }}>
      <Bed k={open} f={f} T={d} dim={0.5} />
      <AbsoluteFill style={camStyle(cam)}>
        <Img src={img(open)} style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, objectFit: "cover" }} />
        {arc > 0 ? <svg style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, overflow: "visible" }}>
          <path d="M 760 640 C 980 380, 1150 380, 1330 560" fill="none" stroke="rgba(192,57,43,0.85)" strokeWidth={22} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - arc} style={{ filter: "blur(3px)" }} />
          <path d="M 760 640 C 980 380, 1150 380, 1330 560" fill="none" stroke="rgba(255,190,170,0.5)" strokeWidth={6} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - arc} />
        </svg> : null}
      </AbsoluteFill>
      <div style={{ position: "absolute", left: 1040, top: 180, opacity: cl((f - at(t1)) / 12) }}>{note("¿Con la tapa abierta?", 1, -3)}</div>
      {shutOp > 0 ? <div style={{ position: "absolute", left: 1160, top: 560, opacity: shutOp, transform: "translate(-50%,-50%)" }}>
        <Print k={shut} w={560} h={360} f={f} mat={14} /></div> : null}
      <div style={{ position: "absolute", right: 150, bottom: 170, opacity: ok, transform: `translateY(${(1 - ok) * 30}px)` }}>
        <Chip txt="SIEMPRE ABAJO" size={72} bg="#2E7D4F" color="#fff" rot={-2} />
      </div>
      <Mark kind="circle" x={120} y={120} w={520} h={300} f={f} at={at(t3)} />
      <Grade vig={0.32} />
      <Grain />
    </AbsoluteFill>
  );
};

// ── 2. OneMeter (ítem 2): medida de inodoro a vaso (30 cm, rojo) → cepillos en otro cuarto → chip "+1 METRO" ──
export const OneMeter: P<{ bath: string; apart: string; t1: number; t2: number; t3: number }> = ({ a, d, bath, apart, t1, t2, t3 }) => {
  const { f, at } = useT(a);
  const line = eo((f - at(t1)) / 30), num = sp(f, at(t2), 13, 170), chip = sp(f, at(t3), 13, 170);
  const sw = cl((f - at(t2)) / 18);
  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#000" }}>
      <Bed k={bath} f={f} T={d} dim={0.5} />
      <AbsoluteFill style={camStyle({ x: 960, y: 560, s: 1.05, t: 0 })}>
        <Img src={img(bath)} style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, objectFit: "cover" }} />
      </AbsoluteFill>
      <svg style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, overflow: "visible" }}>
        <line x1={700} y1={820} x2={1280} y2={560} stroke={C.red} strokeWidth={10} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - line} style={{ filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.5))" }} />
        <circle cx={700} cy={820} r={14} fill={C.red} opacity={line} /><circle cx={1280} cy={560} r={14} fill={C.red} opacity={line} />
      </svg>
      <div style={{ position: "absolute", left: 960, top: 640, opacity: num, transform: `translate(-50%,0) translateY(${(1 - num) * 20}px)` }}>{word("30 cm", num, 110)}</div>
      {sw > 0 ? <div style={{ position: "absolute", right: 140, top: 150, opacity: sw }}>
        <Print k={apart} w={520} h={330} f={f} mat={14} /></div> : null}
      <div style={{ position: "absolute", right: 150, bottom: 150, opacity: chip, transform: `translateY(${(1 - chip) * 26}px)` }}><Chip txt="+1 METRO" size={76} bg={C.red} color="#fff" /></div>
      <Grade vig={0.3} />
      <Grain />
    </AbsoluteFill>
  );
};

// ── 3. TowelDays (ítem 3): cuatro toallas con nombre (una por persona) + anillo "3 DÍAS" en su palabra ──
export const TowelDays: P<{ bed: string; names: string[]; t1: number; t2: number; dayT: number; days: number }> = ({ a, d, bed, names, t1, t2, dayT, days }) => {
  const { f, at } = useT(a);
  const ring = eo((f - at(dayT)) / (days * 30));
  const R = 170, Cc = 2 * Math.PI * R;
  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#000" }}>
      <Bed k={bed} f={f} T={d} dim={0.55} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 200, display: "flex", justifyContent: "center", gap: 46 }}>
        {names.map((n, i) => {
          const u = sp(f, at(t1) + i * 0.5, 13, 170);
          return <div key={i} style={{ opacity: u, transform: `translateY(${(1 - u) * 60}px) rotate(${i % 2 ? 2 : -2}deg)` }}>
            <Print k={bed} w={300} h={380} f={f} mat={12} /><div style={{ marginTop: -26, textAlign: "center" }}><Chip txt={n} size={54} /></div></div>;
        })}
      </div>
      <div style={{ position: "absolute", right: 140, bottom: 140, opacity: sp(f, at(dayT), 13, 170) }}>
        <svg width={420} height={420} style={{ overflow: "visible" }}>
          <circle cx={210} cy={210} r={R} fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth={22} />
          <circle cx={210} cy={210} r={R} fill="none" stroke={C.red} strokeWidth={22} strokeLinecap="round" strokeDasharray={Cc} strokeDashoffset={Cc * (1 - ring)} transform="rotate(-90 210 210)" />
        </svg>
        <div style={{ position: "absolute", left: 0, top: 0, width: 420, height: 420, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SERIF, fontWeight: 900, fontSize: 110, color: C.porc, textShadow: cardTxt }}>{days}</div>
      </div>
      <div style={{ position: "absolute", left: 140, bottom: 170, opacity: sp(f, at(t2), 13, 170) }}>{word("3 DÍAS", 1, 120)}</div>
      <Grade vig={0.3} />
      <Grain />
    </AbsoluteFill>
  );
};

// ── 4. Genkan (ítem 4): entrada completa (cámara baja al escalón) → pantuflas del baño en la puerta + nota "SÓLO AQUÍ" ──
export const Genkan: P<{ entry: string; slip: string; t1: number; t2: number }> = ({ a, d, entry, slip, t1, t2 }) => {
  const { f, at } = useT(a);
  const cam = camAt(f, at, [{ x: 960, y: 420, s: 1.0, t: a }, { x: 960, y: 760, s: 1.3, t: t1 }], 2.0);
  const pr = sp(f, at(t2), 13, 170);
  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#000" }}>
      <Bed k={entry} f={f} T={d} dim={0.45} />
      <AbsoluteFill style={camStyle(cam)}><Img src={img(entry)} style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, objectFit: "cover" }} /></AbsoluteFill>
      <div style={{ position: "absolute", right: 150, top: 150, opacity: pr, transform: `translateY(${(1 - pr) * 30}px) rotate(3deg)` }}>
        <Print k={slip} w={460} h={300} f={f} mat={14} /></div>
      <div style={{ position: "absolute", right: 170, top: 560, opacity: pr }}>{note("SÓLO AQUÍ", pr, 3)}</div>
      <Grade vig={0.3} />
      <Grain />
    </AbsoluteFill>
  );
};

// ── 5. BrushDrip (ítem 6): cepillo mojado en vaso (aro rojo en el agua) → cepillo goteando en el asiento (aro = temporizador) → chip ──
export const BrushDrip: P<{ wet: string; drip: string; t1: number; t2: number; t3: number; t4: number }> = ({ a, d, wet, drip, t1, t2, t3, t4 }) => {
  const { f, at } = useT(a);
  const ring = eo((f - at(t1)) / 30), pa = sp(f, at(t2), 13, 170), tm = cl((f - at(t3)) / (fr(t4) - fr(t3)));
  const Cc = 2 * Math.PI * 150;
  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#000" }}>
      <Bed k={wet} f={f} T={d} dim={0.5} />
      <div style={{ position: "absolute", left: 180, top: 170, opacity: pa }}><Print k={wet} w={620} h={420} f={f} mat={16}>
        <svg style={{ position: "absolute", left: 200, top: 280, overflow: "visible" }} width={260} height={120}>
          <ellipse cx={130} cy={60} rx={120} ry={36} fill="none" stroke={C.red} strokeWidth={8} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - ring} />
        </svg></Print></div>
      <div style={{ position: "absolute", right: 170, top: 160, opacity: pa, transform: `rotate(2deg)` }}><Print k={drip} w={520} h={380} f={f} mat={14} /></div>
      <div style={{ position: "absolute", right: 150, bottom: 150, opacity: pa }}>
        <svg width={320} height={320}>
          <circle cx={160} cy={160} r={150} fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth={18} />
          <circle cx={160} cy={160} r={150} fill="none" stroke={C.red} strokeWidth={18} strokeLinecap="round" strokeDasharray={Cc} strokeDashoffset={Cc * (1 - tm)} transform="rotate(-90 160 160)" />
        </svg></div>
      <div style={{ position: "absolute", left: 180, bottom: 170, opacity: sp(f, at(t4), 13, 170) }}><Chip txt="SECO, LUEGO ADENTRO" size={64} bg="#FFFDF4" /></div>
      <Grade vig={0.3} />
      <Grain />
    </AbsoluteFill>
  );
};

// ── 6. SatoMinute (ítem 10): foto de Sato-san + su frase → reloj de 1:00 que corre mientras 3 impresos llegan en sus palabras ──
export const SatoMinute: P<{ sato: string; bed: string; quote: string; prints: [string, number][]; t1: number; tEnd: number; chipT: number }> = ({ a, d, sato, bed, quote, prints, t1, tEnd, chipT }) => {
  const { f, at } = useT(a);
  const q = sp(f, at(t1), 13, 170);
  const tm = cl((f - at(t1)) / (fr(tEnd) - fr(t1)));
  const Cc = 2 * Math.PI * 170;
  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#000" }}>
      <Bed k={bed} f={f} T={d} dim={0.5} />
      <div style={{ position: "absolute", left: 150, top: 160, opacity: q, transform: `translateY(${(1 - q) * 30}px)` }}><Print k={sato} w={500} h={600} f={f} mat={14} /></div>
      <div style={{ position: "absolute", left: 720, top: 220, width: 900, opacity: q }}>
        <div style={{ fontFamily: SERIF, fontStyle: "italic", fontWeight: 700, fontSize: 70, color: C.porc, textShadow: cardTxt, lineHeight: 1.2 }}>{quote}</div>
      </div>
      {prints.map(([k, t], i) => { const u = sp(f, at(t), 13, 170); return (
        <div key={i} style={{ position: "absolute", right: 150 + i * 24, bottom: 430 - i * 170, opacity: u, transform: `translateX(${(1 - u) * 260}px) rotate(${i ? 2 : -2}deg)` }}>
          <Print k={k} w={360} h={230} f={f} mat={12} /></div>); })}
      <div style={{ position: "absolute", right: 160, top: 170 }}>
        <svg width={360} height={360}>
          <circle cx={180} cy={180} r={170} fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth={20} />
          <circle cx={180} cy={180} r={170} fill="none" stroke={C.red} strokeWidth={20} strokeLinecap="round" strokeDasharray={Cc} strokeDashoffset={Cc * (1 - tm)} transform="rotate(-90 180 180)" />
        </svg>
        <div style={{ position: "absolute", left: 0, top: 0, width: 360, height: 360, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SERIF, fontWeight: 900, fontSize: 84, color: C.porc, textShadow: cardTxt }}>1:00</div>
      </div>
      <div style={{ position: "absolute", left: 150, bottom: 160, opacity: sp(f, at(chipT), 13, 170) }}><Chip txt="1 MINUTO · CADA DÍA" size={64} bg={C.red} color="#fff" /></div>
      <Grade vig={0.3} />
      <Grain />
    </AbsoluteFill>
  );
};

// ── 7. PageFifteen (cierre): página 15 del libro impresa sobre cama de papel + marcas de verificación en los hábitos nombrados + chip ──
export const PageFifteen: P<{ page: string; bed: string; checks: [string, number][]; chipT: number }> = ({ a, d, page, bed, checks, chipT }) => {
  const { f, at } = useT(a);
  const pg = sp(f, at(a), 13, 150);
  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#000" }}>
      <Bed k={bed} f={f} T={d} dim={0.4} />
      <div style={{ position: "absolute", left: 300, top: 60, opacity: pg, transform: `translateY(${(1 - pg) * 40}px) rotate(-1deg)` }}>
        <Print k={page} w={520} h={740} f={f} mat={12} /></div>
      {checks.map(([txt, t], i) => { const u = sp(f, at(t), 13, 170); return (
        <div key={i} style={{ position: "absolute", left: 920, top: 210 + i * 110, fontFamily: HAND, fontSize: 60, color: C.porc, opacity: u, textShadow: cardTxt, transform: `translateX(${(1 - u) * -30}px)` }}>
          <span style={{ color: "#6FCF8A", fontSize: 72 }}>✓</span> {txt}</div>); })}
      <div style={{ position: "absolute", left: 920, bottom: 170, opacity: sp(f, at(chipT), 13, 170) }}><Chip txt="REGLA 7 · PÁGINA 15" size={60} bg={C.red} color="#fff" /></div>
      <Grade vig={0.3} />
      <Grain />
    </AbsoluteFill>
  );
};

export const NEW: Record<string, React.FC<any>> = { LidSpray, OneMeter, TowelDays, Genkan, BrushDrip, SatoMinute, PageFifteen };
