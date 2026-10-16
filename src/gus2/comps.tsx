// gus2 · componentes PROPIOS del video del moho de la ducha (Gm*). Mundo del conserje: orden de trabajo a máquina,
// microscopio sobre la pastina, sello de la EPA, manómetro de humedad del baño de vapor, temporizador de cocina, frasco marrón.
// Multicapa: foto real desenfocada → superficie con textura real (acero, azulejo, papel de informe, recibo) → sombra
// proyectada → objeto/foto → datos → acento animado con resorte. 2 familias: DM Serif Display + Courier Prime.
// Paleta = la ducha: blanco azulejo, gris pastina, negro moho, ámbar del agua oxigenada, verde azulado, amarillo de aviso.
import React from "react";
import { AbsoluteFill, Img } from "remotion";
import { loadFont as loadSerif } from "@remotion/google-fonts/DMSerifDisplay";
import { loadFont as loadMono } from "@remotion/google-fonts/CourierPrime";
import { img, sp, useT, type P } from "../lkit/core";

const SF = loadSerif("normal", { weights: ["400"], subsets: ["latin"] }).fontFamily;
const MO = loadMono("normal", { weights: ["400", "700"], subsets: ["latin"] }).fontFamily;
const K = { tile: "#F4F6F5", grout: "#8C918F", mold: "#1B1D1C", amber: "#8A4B12", amberL: "#C9822E", teal: "#2F6F6B", tealD: "#1F4A47", warn: "#F2C230", red: "#B8322A", ink: "#1A1C1E", paper: "#FBFAF5", steel: "#C9CED2", green: "#3E7C4F" };
const cl = (x: number) => Math.max(0, Math.min(1, x));
const ez = (x: number) => { const t = cl(x); return t * t * (3 - 2 * t); };

const Bed: React.FC<{ k: string; f: number; d: number; blur?: number; dim?: number }> = ({ k, f, d, blur = 14, dim = 0.45 }) => (
  <AbsoluteFill style={{ overflow: "hidden", background: K.ink }}>
    <Img src={img(k)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1.1 + 0.06 * (f / Math.max(1, d))})`, filter: `blur(${blur}px) brightness(${dim}) saturate(0.8)` }} />
    <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(20,40,40,0.15), rgba(5,10,10,0.45))" }} />
  </AbsoluteFill>
);
const Tex: React.FC<{ k: string; style?: React.CSSProperties; tint?: string; children?: React.ReactNode }> = ({ k, style, tint, children }) => (
  <div style={{ position: "absolute", overflow: "hidden", ...style }}>
    <Img src={img(k)} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
    {tint ? <div style={{ position: "absolute", inset: 0, background: tint }} /> : null}
    {children}
  </div>
);
const Pic: React.FC<{ k: string; x: number; y: number; w: number; h: number; rot?: number; f: number; at: number; r?: number; pos?: string }> = ({ k, x, y, w, h, rot = 0, f, at, r = 18, pos = "50% 50%" }) => {
  const s = sp(f, at, 16, 120);
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: h, opacity: cl(s * 1.5), transform: `translateY(${(1 - s) * 50}px) rotate(${rot}deg) scale(${0.95 + 0.05 * s})`, borderRadius: r, overflow: "hidden", boxShadow: "0 30px 60px rgba(0,0,0,0.55), 0 0 0 8px rgba(255,255,255,0.9)" }}>
      <Img src={img(k)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: pos }} />
    </div>
  );
};
const In: React.FC<{ f: number; at: number; children: React.ReactNode; style?: React.CSSProperties; from?: number; x?: number }> = ({ f, at, children, style, from = 22, x = 0 }) => {
  const s = sp(f, at, 16, 150);
  return <div style={{ opacity: cl(s * 1.6), transform: `translate(${(1 - s) * x}px, ${(1 - s) * from}px)`, ...style }}>{children}</div>;
};
const Type: React.FC<{ f: number; at: number; txt: string; cps?: number; style?: React.CSSProperties }> = ({ f, at, txt, cps = 1.4, style }) => {
  const n = Math.max(0, Math.floor((f - at) * cps));
  return <div style={{ fontFamily: MO, fontWeight: 700, whiteSpace: "pre", opacity: f >= at ? 1 : 0, ...style }}>{txt.slice(0, n)}<span style={{ opacity: n < txt.length && Math.floor(f / 8) % 2 ? 1 : 0 }}>▌</span></div>;
};
const Draw: React.FC<{ d: string; f: number; at: number; dur?: number; color?: string; w?: number; len?: number; vb?: string; style?: React.CSSProperties }> = ({ d, f, at, dur = 12, color = K.red, w = 8, len = 2600, vb = "0 0 1920 1080", style }) => {
  const p = ez((f - at) / dur);
  return (
    <svg viewBox={vb} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", overflow: "visible", ...style }}>
      <path d={d} fill="none" stroke={color} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={len} strokeDashoffset={len * (1 - p)} opacity={p > 0 ? 0.95 : 0} />
    </svg>
  );
};
const Ser: React.FC<{ children: React.ReactNode; size: number; color?: string; style?: React.CSSProperties }> = ({ children, size, color = K.ink, style }) => (
  <div style={{ fontFamily: SF, fontSize: size, color, lineHeight: 1.04, ...style }}>{children}</div>
);
const Mono: React.FC<{ children: React.ReactNode; size: number; color?: string; style?: React.CSSProperties; b?: boolean }> = ({ children, size, color = K.ink, style, b = true }) => (
  <div style={{ fontFamily: MO, fontWeight: b ? 700 : 400, fontSize: size, color, lineHeight: 1.15, letterSpacing: 1, ...style }}>{children}</div>
);
const Badge: React.FC<{ f: number; at: number; txt: string; bg?: string; color?: string; size?: number; style?: React.CSSProperties }> = ({ f, at, txt, bg = K.teal, color = "#fff", size = 54, style }) => {
  const s = sp(f, at, 12, 190);
  return <div style={{ position: "absolute", opacity: cl(s * 2), transform: `scale(${0.7 + 0.3 * s})`, background: bg, color, fontFamily: MO, fontWeight: 700, fontSize: size, padding: "10px 30px", borderRadius: 999, boxShadow: "0 14px 30px rgba(0,0,0,0.45)", whiteSpace: "nowrap", ...style }}>{txt}</div>;
};
const Mark: React.FC<{ f: number; at: number; ok?: boolean; size?: number }> = ({ f, at, ok = true, size = 64 }) => {
  const p = ez((f - at) / 9);
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" style={{ flex: "none" }}>
      <circle cx={32} cy={32} r={28} fill={ok ? K.teal : K.red} opacity={0.15 + 0.85 * p} />
      {ok ? <path d="M18 33 L28 43 L47 22" fill="none" stroke="#fff" strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={60} strokeDashoffset={60 * (1 - p)} />
          : <path d="M21 21 L43 43 M43 21 L21 43" stroke="#fff" strokeWidth={7} strokeLinecap="round" strokeDasharray={70} strokeDashoffset={70 * (1 - p)} />}
    </svg>
  );
};
const usd = (n: number) => "$" + Math.round(n).toLocaleString("en-US");

// ═══ 1 · Calendario de pared: DOMINGO (blanco) → 9 DÍAS DESPUÉS (negro), cortina que barre ═══
export const GmDays: P<{ k: string; k2: string; t: number; t2: number }> = ({ a, d, k, k2, t, t2 }) => {
  const { f, at } = useT(a);
  const wipe = ez((f - at(t)) / 22);
  const day = Math.min(9, Math.round(9 * ez((f - at(t)) / 30)));
  return (
    <AbsoluteFill style={{ background: K.ink }}>
      <AbsoluteFill><Img src={img(k)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1.05 + 0.04 * f / d})` }} /></AbsoluteFill>
      <AbsoluteFill style={{ clipPath: `inset(0 0 0 ${100 - wipe * 100}%)` }}><Img src={img(k2)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1.05 + 0.04 * f / d})` }} /></AbsoluteFill>
      <div style={{ position: "absolute", top: 0, bottom: 0, left: `${100 - wipe * 100}%`, width: 8, background: K.warn, opacity: wipe > 0 && wipe < 1 ? 1 : 0, boxShadow: "0 0 30px rgba(242,194,48,0.8)" }} />
      <div style={{ position: "absolute", left: 90, top: 80, width: 330, background: K.paper, borderRadius: 10, boxShadow: "0 24px 50px rgba(0,0,0,0.55)", overflow: "hidden" }}>
        <div style={{ background: K.red, padding: "10px 0", textAlign: "center" }}><Mono size={40} color="#fff">{wipe < 0.5 ? "SUNDAY" : "+ DAYS"}</Mono></div>
        <Ser size={190} color={K.ink} style={{ textAlign: "center", padding: "6px 0 16px" }}>{wipe < 0.05 ? "0" : day}</Ser>
      </div>
      <Badge f={f} at={0} txt="BLEACHED" bg={K.tile} color={K.ink} style={{ left: 120, bottom: 110 }} />
      <Badge f={f} at={at(t2)} txt="BLACK AGAIN" bg={K.mold} color="#fff" size={64} style={{ right: 110, bottom: 110 }} />
    </AbsoluteFill>
  );
};

// ═══ 2 · Presupuesto del contratista $1.200 → tachado → tubo de silicona $8 ═══
export const GmEstimate: P<{ k: string; t: number; t2: number; t3: number }> = ({ a, d, k, t, t2, t3 }) => {
  const { f, at } = useT(a);
  const n = 1200 * ez((f - at(t)) / 24);
  const tub = sp(f, at(t3), 13, 150);
  return (
    <AbsoluteFill>
      <Bed k={k} f={f} d={d} dim={0.4} />
      <In f={f} at={at(t) - 8} style={{ position: "absolute", left: 170, top: 110 }}>
        <div style={{ width: 900, height: 860, background: K.paper, boxShadow: "0 40px 90px rgba(0,0,0,0.6)", transform: "rotate(-2deg)", padding: "50px 60px", position: "relative" }}>
          <Mono size={36} color={K.grout}>ESTIMATE #0417</Mono>
          <Ser size={72} color={K.ink} style={{ marginTop: 8 }}>Bathroom remodel</Ser>
          {[["Demo tub surround", "$280"], ["New tile + labor", "$760"], ["Fixtures, haul away", "$160"]].map((r, i) => (
            <In key={i} f={f} at={at(t) + i * 6} style={{ display: "flex", justifyContent: "space-between", borderBottom: "2px dashed #BFC3C1", padding: "22px 0 10px" }}>
              <Mono size={40} b={false}>{r[0]}</Mono><Mono size={40}>{r[1]}</Mono></In>
          ))}
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 40 }}><Mono size={50}>TOTAL</Mono><Ser size={120} color={K.ink}>{usd(n)}</Ser></div>
          <Draw f={f} at={at(t2)} dur={12} color={K.red} w={16} vb="0 0 900 860" d="M 60 660 L 840 560" />
          <Draw f={f} at={at(t2) + 6} dur={12} color={K.red} w={16} vb="0 0 900 860" d="M 60 560 L 840 680" />
        </div>
      </In>
      <div style={{ position: "absolute", left: 1180, top: 300 + (1 - tub) * 80, opacity: cl(tub * 1.5), transform: `rotate(${-14 + 4 * (1 - tub)}deg)` }}>
        <div style={{ width: 560, height: 150, borderRadius: "20px 75px 75px 20px", background: "linear-gradient(180deg,#FFFFFF,#D9DEE0)", boxShadow: "0 30px 60px rgba(0,0,0,0.55)", position: "relative" }}>
          <div style={{ position: "absolute", right: -120, top: 55, width: 140, height: 40, background: "linear-gradient(90deg,#E8ECEE,#B8BEC2)", clipPath: "polygon(0 0,100% 40%,100% 60%,0 100%)" }} />
          <div style={{ position: "absolute", left: 40, top: 30, right: 80, bottom: 30, background: K.teal, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}><Mono size={40} color="#fff">SILICONE</Mono></div>
        </div>
        <Ser size={160} color={K.warn} style={{ marginTop: 20, marginLeft: 120, textShadow: "0 8px 24px rgba(0,0,0,0.7)" }}>$8</Ser>
      </div>
    </AbsoluteFill>
  );
};

// ═══ 3 · Orden de trabajo a máquina: 7 renglones, el 5 se encierra en rojo ═══
export const GmOrder7: P<{ k: string; t: number; t2: number; items: string[] }> = ({ a, d, k, t, t2, items }) => {
  const { f, at } = useT(a);
  const span = Math.max(30, at(t2) - at(t) - 10);
  return (
    <AbsoluteFill style={{ background: K.ink }}>
      <Tex k={k} style={{ inset: 0 }} tint="rgba(10,20,20,0.35)" />
      <div style={{ position: "absolute", left: 460, top: 50, width: 1000, height: 980, background: K.paper, boxShadow: "0 40px 90px rgba(0,0,0,0.7)", padding: "50px 70px" }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}><Mono size={34} color={K.grout}>THE LAFAYETTE · MAINTENANCE</Mono><Mono size={34} color={K.red}>WORK ORDER</Mono></div>
        <Ser size={74} style={{ marginTop: 10 }}>Shower mold — 7 steps</Ser>
        <div style={{ height: 3, background: K.ink, margin: "16px 0 10px" }} />
        {items.map((it, i) => (
          <div key={i} style={{ position: "relative", height: 100, display: "flex", alignItems: "center", gap: 30, borderBottom: "1px solid #D7DAD8" }}>
            <Mono size={46} color={K.teal}>{i + 1}.</Mono>
            <Type f={f} at={at(t) + (i * span) / items.length} txt={it} cps={1.6} style={{ fontSize: 46, color: K.ink }} />
            {i === 4 ? <Draw f={f} at={at(t2)} dur={16} color={K.red} w={7} vb="0 0 860 100" d="M 40 50 C 40 -6, 700 -6, 700 48 C 700 104, 30 104, 52 30" /> : null}
          </div>
        ))}
        <Badge f={f} at={at(t2) + 12} txt="THE ONE NOBODY DOES" bg={K.red} size={40} style={{ right: 50, bottom: 40 }} />
      </div>
    </AbsoluteFill>
  );
};

// ═══ 4 · Grilla de azulejos: 212 duchas que se encienden + el baño de vapor ═══
export const GmTiles: P<{ k: string; num: number; t: number; t2: number }> = ({ a, d, k, num, t, t2 }) => {
  const { f, at } = useT(a);
  const n = Math.round(num * ez((f - at(t)) / 40));
  const steam = ez((f - at(t2)) / 20);
  return (
    <AbsoluteFill>
      <Bed k={k} f={f} d={d} dim={0.35} />
      <div style={{ position: "absolute", left: 110, top: 150, width: 1060, height: 780, display: "grid", gridTemplateColumns: "repeat(20, 1fr)", gap: 6, padding: 20, background: K.grout, borderRadius: 14, boxShadow: "0 40px 80px rgba(0,0,0,0.6)" }}>
        {Array.from({ length: 220 }).map((_, i) => (
          <div key={i} style={{ background: i < n ? K.tile : "#5E6462", borderRadius: 3, boxShadow: i < n ? "inset 0 -3px 0 rgba(0,0,0,0.12)" : "none", opacity: i >= num ? 0.25 : 1 }} />
        ))}
      </div>
      <div style={{ position: "absolute", left: 1260, top: 220, width: 600 }}>
        <Ser size={220} color={K.tile} style={{ textShadow: "0 10px 30px rgba(0,0,0,0.7)" }}>{n}</Ser>
        <Mono size={50} color={K.tile}>SHOWERS</Mono>
        <In f={f} at={at(t2)} style={{ marginTop: 50, background: K.teal, padding: "20px 30px", borderRadius: 14, position: "relative", overflow: "hidden" }}>
          <Mono size={46} color="#fff">+ 1 STEAM ROOM</Mono>
          {[0, 1, 2, 3].map((i) => <div key={i} style={{ position: "absolute", left: 60 + i * 120, top: 60 - 40 * steam - i * 6, width: 90, height: 90, borderRadius: 45, background: "rgba(255,255,255,0.35)", filter: "blur(14px)", opacity: steam }} />)}
        </In>
      </div>
    </AbsoluteFill>
  );
};

// ═══ 5 · La tira de silicona de la 602: blanca arriba, negra adentro (corte con lupa) ═══
export const GmStrip: P<{ k: string; t: number; t2: number; t3: number }> = ({ a, d, k, t, t2, t3 }) => {
  const { f, at } = useT(a);
  const flip = ez((f - at(t2)) / 20), lens = sp(f, at(t3), 14, 120);
  return (
    <AbsoluteFill>
      <Bed k={k} f={f} d={d} dim={0.35} />
      <Mono size={40} color={K.tile} style={{ position: "absolute", left: 120, top: 90 }}>ROOM 602 · TUB CAULK · 1981</Mono>
      <div style={{ position: "absolute", left: 160, top: 360, width: 1600, height: 200, perspective: 1600 }}>
        <div style={{ position: "absolute", inset: 0, transformStyle: "preserve-3d", transform: `rotateX(${flip * 180}deg)` }}>
          <div style={{ position: "absolute", inset: 0, borderRadius: 100, background: "linear-gradient(180deg,#FFFFFF,#E3E6E4)", boxShadow: "0 30px 60px rgba(0,0,0,0.5)", backfaceVisibility: "hidden" }} />
          <div style={{ position: "absolute", inset: 0, borderRadius: 100, background: "radial-gradient(ellipse at 30% 50%, #2A2C2B, #111 70%)", transform: "rotateX(180deg)", backfaceVisibility: "hidden", overflow: "hidden" }}>
            {Array.from({ length: 40 }).map((_, i) => <div key={i} style={{ position: "absolute", left: (i * 97) % 1560, top: (i * 53) % 170, width: 24, height: 24, borderRadius: 12, background: "#3B3F3D" }} />)}
          </div>
        </div>
      </div>
      <In f={f} at={at(t)} style={{ position: "absolute", left: 200, top: 620 }}><Ser size={86} color={K.tile}>white on top…</Ser></In>
      <In f={f} at={at(t2) + 10} style={{ position: "absolute", left: 900, top: 620 }}><Ser size={86} color={K.warn}>black all the way through</Ser></In>
      <div style={{ position: "absolute", left: 1400, top: 160, opacity: cl(lens * 1.5), transform: `scale(${0.6 + 0.4 * lens})` }}>
        <div style={{ width: 300, height: 300, borderRadius: 150, border: "16px solid #3A3D3C", background: "radial-gradient(circle, #1E201F 60%, #000)", boxShadow: "0 20px 40px rgba(0,0,0,0.6)", overflow: "hidden", position: "relative" }}>
          {Array.from({ length: 14 }).map((_, i) => <div key={i} style={{ position: "absolute", left: 40 + (i * 37) % 220, top: 30 + (i * 61) % 240, width: 3, height: 60, background: "#6B726F", transform: `rotate(${i * 27}deg)` }} />)}
        </div>
        <div style={{ position: "absolute", left: 230, top: 250, width: 40, height: 160, background: "#3A3D3C", borderRadius: 20, transform: "rotate(-40deg)" }} />
      </div>
    </AbsoluteFill>
  );
};

// ═══ 6 · Microscopio: el punto negro arriba y las hifas (raíces) que bajan dentro de la pastina ═══
export const GmRoots: P<{ k: string; t: number; t2: number; t3: number }> = ({ a, d, k, t, t2, t3 }) => {
  const { f, at } = useT(a);
  const g = ez((f - at(t)) / 40), lab = ez((f - at(t3)) / 14);
  const roots = Array.from({ length: 14 }).map((_, i) => {
    const x0 = 330 + i * 28, dx = Math.sin(i * 1.7) * 160, dy = 180 + (i % 5) * 70;
    return `M ${x0} 330 C ${x0 + dx * 0.3} ${330 + dy * 0.4}, ${x0 + dx * 0.8} ${330 + dy * 0.7}, ${x0 + dx} ${330 + dy}`;
  });
  return (
    <AbsoluteFill>
      <Bed k={k} f={f} d={d} dim={0.35} />
      <div style={{ position: "absolute", left: 160, top: 90, width: 900, height: 900, borderRadius: 450, overflow: "hidden", boxShadow: "0 0 0 26px #2B2E2D, 0 0 0 34px #6B7270, 0 40px 90px rgba(0,0,0,0.7)" }}>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,#F1F3F2 0 33%, #9A9F9C 33%, #A7ACA9 100%)" }} />
        {Array.from({ length: 160 }).map((_, i) => <div key={i} style={{ position: "absolute", left: (i * 131) % 900, top: 300 + ((i * 71) % 600), width: 10 + (i % 4) * 4, height: 8 + (i % 3) * 4, borderRadius: 6, background: "rgba(80,86,83,0.35)" }} />)}
        <svg viewBox="0 0 900 900" style={{ position: "absolute", inset: 0 }}>
          {roots.map((p, i) => <path key={i} d={p} fill="none" stroke="#1E2120" strokeWidth={5 - (i % 3)} strokeLinecap="round" strokeDasharray={600} strokeDashoffset={600 * (1 - g)} />)}
          <ellipse cx={450} cy={318} rx={170} ry={34} fill="#1B1D1C" />
        </svg>
        <div style={{ position: "absolute", left: 0, right: 0, top: 296, height: 4, background: "rgba(255,255,255,0.6)" }} />
      </div>
      <div style={{ position: "absolute", left: 1150, top: 200, width: 680 }}>
        <In f={f} at={at(t) - 6}><Mono size={44} color={K.warn}>WHAT YOU SEE</Mono><Ser size={84} color={K.tile}>the spot on top</Ser></In>
        <In f={f} at={at(t2)} style={{ marginTop: 50 }}><Mono size={44} color={K.warn}>WHERE IT LIVES</Mono><Ser size={84} color={K.tile}>roots in the grout</Ser></In>
        <div style={{ marginTop: 50, display: "flex", gap: 16, flexWrap: "wrap", opacity: lab }}>
          {["GROUT", "CAULK", "WOOD"].map((w) => <div key={w} style={{ background: K.teal, padding: "8px 22px", borderRadius: 999 }}><Mono size={40} color="#fff">{w} = POROUS</Mono></div>)}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ═══ 7 · Cloro: el pigmento se blanquea arriba, la raíz sigue viva abajo ═══
export const GmFade: P<{ k: string; t: number; t2: number; t3: number }> = ({ a, d, k, t, t2, t3 }) => {
  const { f, at } = useT(a);
  const wh = ez((f - at(t)) / 24), pulse = 0.5 + 0.5 * Math.sin((f - at(t3)) / 6);
  return (
    <AbsoluteFill>
      <Bed k={k} f={f} d={d} dim={0.4} />
      <div style={{ position: "absolute", left: 140, top: 140, width: 1640, height: 800, borderRadius: 24, overflow: "hidden", boxShadow: "0 40px 80px rgba(0,0,0,0.6)" }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 300, background: K.tile }} />
        <div style={{ position: "absolute", left: 0, right: 0, top: 300, bottom: 0, background: "linear-gradient(180deg,#A3A8A5,#7F8582)" }} />
        {Array.from({ length: 9 }).map((_, i) => (
          <React.Fragment key={i}>
            <div style={{ position: "absolute", left: 120 + i * 170, top: 250, width: 110, height: 60, borderRadius: 30, background: `rgb(${27 + 220 * wh},${29 + 218 * wh},${28 + 218 * wh})` }} />
            <svg viewBox="0 0 120 480" style={{ position: "absolute", left: 115 + i * 170, top: 300, width: 120, height: 480 }}>
              <path d={`M 60 0 C ${30 + i * 5} 120, ${90 - i * 4} 260, ${50 + (i % 3) * 10} 460`} stroke="#1B1D1C" strokeWidth={6} fill="none" opacity={0.6 + 0.4 * (f >= at(t3) ? pulse : 0)} />
              <path d={`M 60 60 C 20 140, 30 220, 10 300`} stroke="#1B1D1C" strokeWidth={4} fill="none" opacity={0.7} />
            </svg>
          </React.Fragment>
        ))}
        <In f={f} at={at(t) + 8} style={{ position: "absolute", left: 60, top: 40 }}><Mono size={50} color={K.ink}>CHLORINE: COLOR GONE ✓</Mono></In>
        <In f={f} at={at(t2)} style={{ position: "absolute", left: 60, top: 340 }}><Mono size={50} color="#fff">STAYS ON TOP · ROOTS UNTOUCHED</Mono></In>
      </div>
      <Badge f={f} at={at(t3)} txt="STILL GROWING" bg={K.red} size={66} style={{ right: 180, bottom: 160 }} />
    </AbsoluteFill>
  );
};

// ═══ 8 · Hoja de la EPA con el renglón subrayado y sello "FIX THE WATER" ═══
export const GmEPA: P<{ k: string; t: number; t2: number }> = ({ a, d, k, t, t2 }) => {
  const { f, at } = useT(a);
  const hl = ez((f - at(t)) / 22), st = sp(f, at(t2), 11, 200);
  return (
    <AbsoluteFill style={{ background: "#25302F" }}>
      <Bed k="n_drips_tile" f={f} d={d} dim={0.3} blur={22} />
      <In f={f} at={0} style={{ position: "absolute", left: 360, top: 60 }}>
        <div style={{ width: 1200, height: 960, transform: "rotate(-1deg)", boxShadow: "0 40px 90px rgba(0,0,0,0.7)", position: "relative" }}>
          <Tex k={k} style={{ inset: 0 }} />
          <div style={{ position: "absolute", left: 80, top: 60, right: 80 }}>
            <Mono size={30} color={K.grout}>U.S. ENVIRONMENTAL PROTECTION AGENCY</Mono>
            <Ser size={70} style={{ marginTop: 10 }}>Mold Cleanup in Your Home</Ser>
            <div style={{ height: 3, background: K.ink, opacity: 0.6, margin: "20px 0 30px" }} />
            {[0, 1, 2].map((i) => <div key={i} style={{ height: 22, background: "#D4D6D0", borderRadius: 4, margin: "18px 0", width: `${90 - i * 8}%` }} />)}
            <div style={{ position: "relative", marginTop: 40 }}>
              <div style={{ position: "absolute", left: -12, top: 0, height: 140, width: `${hl * 102}%`, background: "rgba(242,194,48,0.55)", borderRadius: 6 }} />
              <Ser size={52} style={{ position: "relative", lineHeight: 1.35 }}>“…the use of a chemical or biocide that kills organisms such as chlorine bleach is not recommended as a routine practice…”</Ser>
            </div>
            {[0, 1].map((i) => <div key={i} style={{ height: 22, background: "#D4D6D0", borderRadius: 4, margin: "30px 0", width: `${80 - i * 10}%` }} />)}
          </div>
          <div style={{ position: "absolute", right: 90, bottom: 110, opacity: cl(st * 2), transform: `rotate(-9deg) scale(${1.5 - 0.5 * st})`, border: `8px solid ${K.teal}`, borderRadius: 14, padding: "10px 30px", mixBlendMode: "multiply" }}>
            <Mono size={74} color={K.teal}>FIX THE WATER</Mono>
          </div>
        </div>
      </In>
    </AbsoluteFill>
  );
};

// ═══ 9 · Manómetro de humedad del baño de vapor: aguja en rojo → ventilador → verde ═══
export const GmGauge: P<{ k: string; t: number; t2: number; t3: number }> = ({ a, d, k, t, t2, t3 }) => {
  const { f, at } = useT(a);
  const v = 95 - 50 * ez((f - at(t2)) / 30);
  const ang = -120 + (v / 100) * 240;
  const fan = (f - at(t)) * 14;
  return (
    <AbsoluteFill>
      <Bed k={k} f={f} d={d} dim={0.4} />
      <div style={{ position: "absolute", left: 220, top: 170, width: 740, height: 740, borderRadius: 370, background: "radial-gradient(circle at 40% 35%, #FFFFFF, #DADFDD)", boxShadow: "0 40px 90px rgba(0,0,0,0.6), inset 0 0 0 26px #3A3F3D, inset 0 0 0 34px #A9B0AD" }}>
        <svg viewBox="0 0 740 740" style={{ position: "absolute", inset: 0 }}>
          <path d="M 150 520 A 250 250 0 0 1 270 160" stroke={K.teal} strokeWidth={34} fill="none" />
          <path d="M 270 160 A 250 250 0 0 1 470 160" stroke={K.warn} strokeWidth={34} fill="none" />
          <path d="M 470 160 A 250 250 0 0 1 590 520" stroke={K.red} strokeWidth={34} fill="none" />
        </svg>
        <div style={{ position: "absolute", left: 360, top: 140, width: 20, height: 240, borderRadius: 10, background: K.ink, transformOrigin: "10px 230px", transform: `rotate(${ang}deg)` }} />
        <div style={{ position: "absolute", left: 330, top: 340, width: 80, height: 80, borderRadius: 40, background: K.ink }} />
        <Mono size={46} style={{ position: "absolute", width: 740, textAlign: "center", top: 470 }}>HUMIDITY</Mono>
        <Ser size={110} style={{ position: "absolute", width: 740, textAlign: "center", top: 520 }}>{Math.round(v)}%</Ser>
      </div>
      <div style={{ position: "absolute", left: 1120, top: 200, width: 700 }}>
        <In f={f} at={at(t)} style={{ display: "flex", alignItems: "center", gap: 30 }}>
          <div style={{ width: 200, height: 200, borderRadius: 30, background: "#E8ECEB", boxShadow: "0 20px 40px rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg viewBox="0 0 100 100" width={160} height={160} style={{ transform: `rotate(${fan}deg)` }}>{[0, 1, 2, 3].map((i) => <ellipse key={i} cx={50} cy={25} rx={12} ry={22} fill={K.tealD} transform={`rotate(${i * 90} 50 50)`} />)}<circle cx={50} cy={50} r={8} fill="#333" /></svg>
          </div>
          <div><Mono size={46} color={K.warn}>BIGGER FAN</Mono><Ser size={64} color={K.tile}>on 1 hour after</Ser></div>
        </In>
        <In f={f} at={at(t2) + 10} style={{ marginTop: 60 }}><Mono size={46} color={K.tile}>6 MONTHS · GROUT STILL CLEAN</Mono></In>
        <In f={f} at={at(t3)} style={{ marginTop: 40, background: K.teal, padding: "18px 30px", borderRadius: 14 }}><Ser size={70} color="#fff">The water was the problem.</Ser></In>
      </div>
    </AbsoluteFill>
  );
};

// ═══ 10 · Prueba del hisopo: blanquea rápido = MOHO · sigue negro = MUGRE ═══
export const GmSwab: P<{ k: string; t: number; t2: number }> = ({ a, d, k, t, t2 }) => {
  const { f, at } = useT(a);
  const Card = ({ at0, ok, h, sub, spot }: any) => {
    const fade = ez((f - at0 - 8) / 30);
    return (
      <In f={f} at={at0} style={{ width: 760, background: K.paper, borderRadius: 20, padding: 36, boxShadow: "0 30px 60px rgba(0,0,0,0.5)" }}>
        <div style={{ height: 300, borderRadius: 14, background: K.tile, position: "relative", overflow: "hidden", boxShadow: "inset 0 0 0 6px #DADDDB" }}>
          <div style={{ position: "absolute", left: 300, top: 110, width: 160, height: 80, borderRadius: 40, background: spot === "mold" ? `rgb(${27 + 215 * fade},${29 + 213 * fade},${28 + 213 * fade})` : "#4A4743" }} />
          <div style={{ position: "absolute", left: 380, top: -40, width: 18, height: 200, background: "#F2EBDA", transform: "rotate(25deg)", borderRadius: 9 }} />
          <div style={{ position: "absolute", left: 340, top: 120, width: 60, height: 50, borderRadius: 25, background: "#FFFFFF", transform: "rotate(25deg)", boxShadow: "0 4px 8px rgba(0,0,0,0.2)" }} />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 20, marginTop: 24 }}><Mark f={f} at={at0 + 30} ok={ok} size={76} /><div><Ser size={64}>{h}</Ser><Mono size={34} color={K.grout} b={false}>{sub}</Mono></div></div>
      </In>
    );
  };
  return (
    <AbsoluteFill>
      <Bed k={k} f={f} d={d} dim={0.4} />
      <Mono size={44} color={K.warn} style={{ position: "absolute", left: 140, top: 80 }}>TEST 1 · THE SWAB · WAIT 2 MINUTES</Mono>
      <div style={{ position: "absolute", left: 140, top: 180, display: "flex", gap: 120 }}>
        <Card at0={at(t)} ok h="Goes white fast" sub="= mold or mildew" spot="mold" />
        <Card at0={at(t2)} ok={false} h="Stays black" sub="= dirt or soap scum" spot="dirt" />
      </div>
    </AbsoluteFill>
  );
};

// ═══ 11 · Prueba de la uña: corte de la silicona, negro ARRIBA (se limpia) vs ADENTRO (se corta) ═══
export const GmNail: P<{ k: string; t: number; t2: number }> = ({ a, d, k, t, t2 }) => {
  const { f, at } = useT(a);
  const Sec = ({ at0, inside, h, sub }: any) => (
    <In f={f} at={at0} style={{ width: 780 }}>
      <div style={{ height: 300, position: "relative", borderRadius: 16, background: "#D9DDDB", overflow: "hidden", boxShadow: "0 30px 60px rgba(0,0,0,0.5)" }}>
        <div style={{ position: "absolute", left: 60, right: 60, top: 70, height: 180, borderRadius: "90px 90px 20px 20px", background: "linear-gradient(180deg,#FFFFFF,#E7EAE8)" }} />
        {!inside ? <div style={{ position: "absolute", left: 140, right: 140, top: 66, height: 20, borderRadius: 10, background: "#1B1D1C", opacity: 1 - 0.8 * ez((f - at0 - 20) / 20) }} />
          : Array.from({ length: 16 }).map((_, i) => <div key={i} style={{ position: "absolute", left: 110 + (i * 89) % 540, top: 110 + (i * 37) % 120, width: 26, height: 26, borderRadius: 13, background: "#1B1D1C" }} />)}
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 50, background: "#B9BEBB" }} />
      </div>
      <Ser size={66} color={K.tile} style={{ marginTop: 20 }}>{h}</Ser>
      <Mono size={40} color={inside ? K.warn : K.tile}>{sub}</Mono>
    </In>
  );
  return (
    <AbsoluteFill>
      <Bed k={k} f={f} d={d} dim={0.38} />
      <Mono size={44} color={K.warn} style={{ position: "absolute", left: 120, top: 80 }}>TEST 2 · YOUR FINGERNAIL</Mono>
      <div style={{ position: "absolute", left: 120, top: 200, display: "flex", gap: 120 }}>
        <Sec at0={at(t)} h="Wipes off the top" sub="on the surface → clean it" />
        <Sec at0={at(t2)} inside h="Down inside the caulk" sub="under the shine → trick #5" />
      </div>
    </AbsoluteFill>
  );
};

// ═══ 12 · Temporizador de cocina a cuerda: 60:00 que corre ═══
export const GmTimer: P<{ k: string; mins: number; t: number; t2: number }> = ({ a, d, k, mins, t, t2 }) => {
  const { f, at } = useT(a);
  const p = ez((f - at(t)) / Math.max(20, at(t2) - at(t)));
  const left = mins * (1 - p);
  const mm = Math.floor(left), ss = Math.floor((left - mm) * 60);
  return (
    <AbsoluteFill>
      <Bed k={k} f={f} d={d} dim={0.42} />
      <div style={{ position: "absolute", left: 260, top: 180, width: 700, height: 700, borderRadius: 350, background: `conic-gradient(${K.amberL} ${(1 - p) * 360}deg, #E8EBEA 0)`, boxShadow: "0 40px 90px rgba(0,0,0,0.6)" }}>
        <div style={{ position: "absolute", inset: 60, borderRadius: 300, background: "radial-gradient(circle at 40% 35%, #FFFFFF, #E2E6E4)", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
          <Mono size={150} color={K.ink}>{String(mm).padStart(2, "0")}:{String(ss).padStart(2, "0")}</Mono>
          <Mono size={40} color={K.grout}>VINEGAR · HANDS OFF</Mono>
        </div>
        <div style={{ position: "absolute", left: 320, top: -60, width: 60, height: 90, borderRadius: 12, background: "#555B59" }} />
      </div>
      <div style={{ position: "absolute", left: 1080, top: 260, width: 760 }}>
        <In f={f} at={at(t)}><Ser size={110} color={K.tile}>One full hour.</Ser></In>
        <In f={f} at={at(t) + 12}><Mono size={46} color={K.warn} style={{ marginTop: 20 }}>no wiping · no rinsing</Mono></In>
        <In f={f} at={at(t2)} style={{ marginTop: 50, display: "flex", gap: 20, alignItems: "center" }}><Mark f={f} at={at(t2) + 4} size={76} /><Ser size={64} color={K.tile}>then scrub, rinse, dry</Ser></In>
      </div>
    </AbsoluteFill>
  );
};

// ═══ 13 · Frasco marrón: los rayos de luz rebotan, no entran ═══
export const GmBrown: P<{ k: string; t: number; t2: number }> = ({ a, d, k, t, t2 }) => {
  const { f, at } = useT(a);
  const rays = ez((f - at(t)) / 20), sh = sp(f, at(t2), 12, 160);
  return (
    <AbsoluteFill>
      <Bed k={k} f={f} d={d} dim={0.38} />
      <div style={{ position: "absolute", left: 720, top: 230, width: 300, height: 640, opacity: 1 }}>
        <div style={{ position: "absolute", left: 100, top: 0, width: 100, height: 90, background: "#EDEDED", borderRadius: "10px 10px 0 0" }} />
        <div style={{ position: "absolute", left: 0, top: 80, width: 300, height: 560, borderRadius: "70px 70px 30px 30px", background: `linear-gradient(90deg, #4E2A0C, ${K.amberL} 40%, #5A300E)`, boxShadow: `0 30px 60px rgba(0,0,0,0.6), 0 0 ${60 * sh}px rgba(201,130,46,${0.7 * sh})` }}>
          <div style={{ position: "absolute", left: 40, right: 40, top: 160, height: 200, background: "rgba(255,255,255,0.88)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
            <Ser size={64} color={K.ink}>H₂O₂</Ser><Mono size={34}>3%</Mono></div>
        </div>
      </div>
      {[0, 1, 2, 3, 4].map((i) => {
        const y = 300 + i * 100, p = rays;
        return (
          <svg key={i} viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
            <path d={`M 200 ${y - 120} L 700 ${y}`} stroke={K.warn} strokeWidth={10} strokeDasharray={600} strokeDashoffset={600 * (1 - p)} strokeLinecap="round" />
            <path d={`M 700 ${y} L 420 ${y + 160}`} stroke={K.warn} strokeWidth={10} strokeDasharray={400} strokeDashoffset={400 * (1 - ez((f - at(t) - 16) / 16))} strokeLinecap="round" opacity={0.7} />
          </svg>
        );
      })}
      <div style={{ position: "absolute", left: 1150, top: 300, width: 680 }}>
        <In f={f} at={at(t)}><Mono size={48} color={K.warn}>LIGHT BREAKS IT DOWN</Mono></In>
        <In f={f} at={at(t2)}><Ser size={96} color={K.tile} style={{ marginTop: 20 }}>Keep it in the brown bottle.</Ser></In>
        <In f={f} at={at(t2) + 14}><Mono size={42} color={K.tile} style={{ marginTop: 20 }}>just screw on a spray top</Mono></In>
      </div>
    </AbsoluteFill>
  );
};

// ═══ 14 · Separados: VINAGRE → enjuagar → secar → AGUA OXIGENADA (nunca juntos) ═══
export const GmApart: P<{ k: string; t: number; t2: number }> = ({ a, d, k, t, t2 }) => {
  const { f, at } = useT(a);
  const steps = [{ txt: "VINEGAR", c: K.tile, tc: K.ink }, { txt: "RINSE", c: "#BFE0E7", tc: K.ink }, { txt: "DRY", c: "#F3E9D2", tc: K.ink }, { txt: "PEROXIDE", c: K.amberL, tc: "#fff" }];
  return (
    <AbsoluteFill style={{ background: K.ink }}>
      <Tex k={k} style={{ inset: 0 }} tint="rgba(10,20,20,0.55)" />
      <In f={f} at={at(t)} style={{ position: "absolute", left: 0, width: "100%", top: 110, textAlign: "center" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 30, background: K.red, padding: "16px 40px", borderRadius: 14 }}>
          <Mono size={58} color="#fff">VINEGAR + PEROXIDE IN ONE BOTTLE</Mono><Mark f={f} at={at(t) + 8} ok={false} size={70} /></div>
      </In>
      <div style={{ position: "absolute", top: 440, width: "100%", display: "flex", justifyContent: "center", alignItems: "center", gap: 26 }}>
        {steps.map((s, i) => {
          const sI = sp(f, at(t2) + i * 8, 13, 150);
          return (
            <React.Fragment key={i}>
              <div style={{ width: 330, height: 260, borderRadius: 24, background: s.c, boxShadow: "0 26px 50px rgba(0,0,0,0.55)", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", opacity: cl(sI * 1.6), transform: `translateY(${(1 - sI) * 60}px)` }}>
                <Mono size={34} color={s.tc} b={false}>{i + 1}</Mono><Mono size={56} color={s.tc}>{s.txt}</Mono></div>
              {i < 3 ? <Mono size={70} color={K.warn} style={{ opacity: cl(sI * 1.5) }}>→</Mono> : null}
            </React.Fragment>
          );
        })}
      </div>
      <In f={f} at={at(t2) + 36} style={{ position: "absolute", top: 800, width: "100%", textAlign: "center" }}><Ser size={70} color={K.tile}>Separate bottles. One after the other.</Ser></In>
    </AbsoluteFill>
  );
};

// ═══ 15 · Proporción 3:1 en cucharas + flechas arriba-abajo sobre la pastina ═══
export const GmRatio: P<{ k: string; t: number; t2: number; t3: number }> = ({ a, d, k, t, t2, t3 }) => {
  const { f, at } = useT(a);
  const Spoon = ({ at0, col, lab }: any) => {
    const s = sp(f, at0, 12, 160);
    return <div style={{ width: 150, height: 210, opacity: cl(s * 1.6), transform: `translateY(${(1 - s) * -80}px)` }}>
      <div style={{ width: 150, height: 110, borderRadius: "75px 75px 75px 75px", background: "linear-gradient(160deg,#EEF1F2,#9EA5A9)", boxShadow: "0 10px 20px rgba(0,0,0,0.45)", position: "relative" }}>
        <div style={{ position: "absolute", left: 18, right: 18, top: 14, height: 70, borderRadius: 40, background: col }} /></div>
      <div style={{ width: 26, height: 100, margin: "0 auto", background: "linear-gradient(90deg,#B9C0C4,#8D9498)", borderRadius: 13 }} />
      <Mono size={30} color={K.tile} style={{ textAlign: "center" }}>{lab}</Mono></div>;
  };
  const arr = ez((f - at(t3)) / 20);
  return (
    <AbsoluteFill>
      <Bed k={k} f={f} d={d} dim={0.4} />
      <div style={{ position: "absolute", left: 140, top: 180, display: "flex", gap: 40, alignItems: "flex-end" }}>
        <Spoon at0={at(t)} col="#FFFFFF" lab="soda" /><Spoon at0={at(t) + 6} col="#FFFFFF" lab="soda" /><Spoon at0={at(t) + 12} col="#FFFFFF" lab="soda" />
        <Mono size={90} color={K.warn} style={{ marginBottom: 90 }}>+</Mono>
        <Spoon at0={at(t2)} col="#BFE0E7" lab="water" />
      </div>
      <In f={f} at={at(t2) + 10} style={{ position: "absolute", left: 160, top: 520 }}><Ser size={96} color={K.tile}>3 : 1 · thick paste</Ser></In>
      <div style={{ position: "absolute", left: 1120, top: 140, width: 640, height: 800, borderRadius: 20, overflow: "hidden", boxShadow: "0 30px 60px rgba(0,0,0,0.55)" }}>
        <Tex k="t_tile" style={{ inset: 0 }} />
        {[0, 1].map((i) => <div key={i} style={{ position: "absolute", left: 200 + i * 240, top: 0, bottom: 0, width: 18, background: "rgba(120,126,123,0.9)" }} />)}
        {[0, 1].map((i) => (
          <svg key={i} viewBox="0 0 640 800" style={{ position: "absolute", inset: 0 }}>
            <path d={`M ${209 + i * 240} 700 L ${209 + i * 240} ${700 - 560 * arr}`} stroke={K.teal} strokeWidth={14} strokeLinecap="round" />
            <path d={`M ${189 + i * 240} ${170 + 560 * (1 - arr)} L ${209 + i * 240} ${140 + 560 * (1 - arr)} L ${229 + i * 240} ${170 + 560 * (1 - arr)}`} stroke={K.teal} strokeWidth={14} fill="none" strokeLinecap="round" opacity={arr} />
          </svg>
        ))}
        <div style={{ position: "absolute", bottom: 30, left: 0, right: 0, textAlign: "center", opacity: arr }}><Mono size={44} color={K.ink} style={{ background: "rgba(255,255,255,0.9)", display: "inline-block", padding: "6px 20px" }}>UP & DOWN</Mono></div>
      </div>
    </AbsoluteFill>
  );
};

// ═══ 16 · El guante blanco de Mrs. Ashford: punta gris → punta blanca ═══
export const GmGlove: P<{ k: string; t: number; t2: number }> = ({ a, d, k, t, t2 }) => {
  const { f, at } = useT(a);
  const swipe = ez((f - at(t)) / 24), clean = ez((f - at(t2)) / 16);
  const Glove = ({ x, gray, lab, at0 }: any) => (
    <In f={f} at={at0} style={{ position: "absolute", left: x, top: 420 }}>
      <svg viewBox="0 0 300 420" width={300} height={420}>
        <path d="M 60 400 L 60 200 L 40 90 Q 40 60 65 62 Q 85 64 88 90 L 100 180 L 105 50 Q 108 20 135 22 Q 160 24 160 52 L 158 175 L 175 40 Q 180 12 206 18 Q 230 24 226 52 L 210 180 L 232 90 Q 240 64 262 72 Q 282 80 275 110 L 240 260 L 240 400 Z" fill="#FBFBF8" stroke="#C9CCCB" strokeWidth={4} />
        <ellipse cx={132} cy={40} rx={24} ry={20} fill={gray} />
      </svg>
      <Mono size={42} color={K.tile} style={{ textAlign: "center", width: 300 }}>{lab}</Mono>
    </In>
  );
  return (
    <AbsoluteFill>
      <Bed k={k} f={f} d={d} dim={0.4} />
      <Pic k={k} x={140} y={140} w={760} h={240} f={f} at={0} r={14} />
      <div style={{ position: "absolute", left: 160, top: 250, width: 720 * swipe, height: 10, background: "rgba(255,255,255,0.85)", borderRadius: 5 }} />
      <Glove x={220} gray={`rgba(90,95,92,${0.85})`} lab="bleached grout" at0={at(t) + 14} />
      <Glove x={620} gray={`rgba(200,203,201,${0.35 * (1 - clean)})`} lab="soda + peroxide" at0={at(t2)} />
      <div style={{ position: "absolute", left: 1060, top: 260, width: 760 }}>
        <In f={f} at={at(t) - 4}><Mono size={44} color={K.warn}>MRS. ASHFORD · PHILADELPHIA</Mono></In>
        <In f={f} at={at(t) + 6}><Ser size={90} color={K.tile} style={{ marginTop: 20 }}>20 springs. One white glove.</Ser></In>
        <Badge f={f} at={at(t2) + 14} txt="FOR THE GROUT MAN · $5" bg={K.teal} size={46} style={{ left: 0, top: 360 }} />
      </div>
    </AbsoluteFill>
  );
};

// ═══ 17 · Cartel de PELIGRO amarillo (triángulo) con las 3 mezclas prohibidas ═══
export const GmDanger: P<{ k: string; rows: { txt: string; t: number }[]; tg: number }> = ({ a, d, k, rows, tg }) => {
  const { f, at } = useT(a);
  const gas = ez((f - at(tg)) / 24);
  return (
    <AbsoluteFill style={{ background: K.ink }}>
      <Tex k={k} style={{ inset: 0 }} tint="rgba(15,10,5,0.55)" />
      <In f={f} at={0} style={{ position: "absolute", left: 140, top: 160 }}>
        <svg viewBox="0 0 600 540" width={600} height={540}>
          <path d="M 300 20 L 580 510 L 20 510 Z" fill={K.warn} stroke={K.ink} strokeWidth={22} strokeLinejoin="round" />
          <rect x={278} y={170} width={44} height={200} rx={16} fill={K.ink} />
          <circle cx={300} cy={430} r={28} fill={K.ink} />
        </svg>
      </In>
      <div style={{ position: "absolute", left: 860, top: 170, width: 960 }}>
        <Ser size={100} color={K.warn}>Never mix</Ser>
        {rows.map((r, i) => (
          <In key={i} f={f} at={at(r.t)} x={60} from={0} style={{ display: "flex", alignItems: "center", gap: 26, marginTop: 30, background: "rgba(255,255,255,0.08)", padding: "16px 24px", borderRadius: 12, borderLeft: `10px solid ${K.red}` }}>
            <Mark f={f} at={at(r.t) + 6} ok={false} size={70} /><Mono size={56} color={K.tile}>{r.txt}</Mono>
          </In>
        ))}
        <div style={{ marginTop: 40, opacity: gas, display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ width: 120, height: 80, borderRadius: 40, background: "rgba(214,232,150,0.45)", filter: "blur(10px)" }} />
          <Mono size={50} color={K.warn}>= GAS THAT BURNS YOUR LUNGS</Mono>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ═══ 18 · 10 pies cuadrados: el cuadrado de 3×3 se dibuja sobre la pared ═══
export const GmSquare: P<{ k: string; t: number; t2: number }> = ({ a, d, k, t, t2 }) => {
  const { f, at } = useT(a);
  return (
    <AbsoluteFill>
      <Img src={img(k)} style={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1.04 + 0.04 * f / d})`, filter: "brightness(0.75)" }} />
      <Draw f={f} at={at(t)} dur={26} color={K.warn} w={12} d="M 620 200 L 1300 200 L 1300 880 L 620 880 Z" />
      <In f={f} at={at(t2)} style={{ position: "absolute", left: 620, top: 130, width: 680, textAlign: "center" }}><Mono size={50} color={K.warn}>3 FT</Mono></In>
      <In f={f} at={at(t2) + 4} style={{ position: "absolute", left: 1320, top: 510 }}><Mono size={50} color={K.warn}>3 FT</Mono></In>
      <In f={f} at={at(t) + 8} style={{ position: "absolute", left: 100, top: 380, width: 480 }}>
        <div style={{ background: "rgba(20,24,24,0.85)", padding: "26px 30px", borderRadius: 16, borderTop: `8px solid ${K.warn}` }}>
          <Ser size={120} color={K.tile}>10 sq ft</Ser><Mono size={40} color={K.tile} b={false}>bigger than this?</Mono><Mono size={46} color={K.warn} style={{ marginTop: 10 }}>CALL A PRO</Mono></div>
      </In>
    </AbsoluteFill>
  );
};

// ═══ 19 · Pasos del recambio de silicona en riel de acero (el 3, secado, se enciende) ═══
export const GmSteps: P<{ k: string; rows: { txt: string; sub: string; t: number; hot?: boolean }[] }> = ({ a, d, k, rows }) => {
  const { f, at } = useT(a);
  return (
    <AbsoluteFill style={{ background: K.ink }}>
      <Tex k={k} style={{ inset: 0 }} tint="rgba(10,15,15,0.35)" />
      <div style={{ position: "absolute", left: 140, right: 140, top: 520, height: 16, background: "linear-gradient(90deg,#9EA5A9,#E3E7E9,#9EA5A9)", borderRadius: 8 }} />
      <div style={{ position: "absolute", left: 140, right: 140, top: 230, display: "flex", justifyContent: "space-between" }}>
        {rows.map((r, i) => {
          const s = sp(f, at(r.t), 13, 150);
          const glow = r.hot ? 0.5 + 0.5 * Math.sin((f - at(r.t)) / 8) : 0;
          return (
            <div key={i} style={{ width: 480, opacity: cl(s * 1.6), transform: `translateY(${(1 - s) * 60}px)`, textAlign: "center" }}>
              <div style={{ margin: "0 auto", width: 230, height: 230, borderRadius: 115, background: r.hot ? K.warn : K.tile, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 20px 40px rgba(0,0,0,0.5), 0 0 ${50 * glow}px rgba(242,194,48,0.8)`, border: `10px solid ${K.ink}` }}>
                <Ser size={130} color={K.ink}>{i + 1}</Ser></div>
              <Mono size={56} color={r.hot ? K.warn : K.tile} style={{ marginTop: 100 }}>{r.txt}</Mono>
              <Mono size={38} color={K.tile} b={false}>{r.sub}</Mono>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ═══ 20 · Cartel en la puerta "NO SHOWER · 24 h" + reloj de curado ═══
export const GmCure: P<{ k: string; t: number; t2: number }> = ({ a, d, k, t, t2 }) => {
  const { f, at } = useT(a);
  const p = ez((f - at(t)) / 50);
  return (
    <AbsoluteFill>
      <Bed k={k} f={f} d={d} dim={0.42} />
      <Pic k={k} x={140} y={170} w={800} h={560} f={f} at={0} />
      <In f={f} at={at(t)} style={{ position: "absolute", left: 1040, top: 150 }}>
        <div style={{ width: 720, background: K.paper, padding: "40px 50px", boxShadow: "0 30px 60px rgba(0,0,0,0.55)", transform: "rotate(2deg)", borderTop: `16px solid ${K.red}` }}>
          <Mono size={60} color={K.red}>DO NOT USE</Mono>
          <Ser size={96} style={{ marginTop: 10 }}>caulk curing</Ser>
          <div style={{ marginTop: 30, height: 40, background: "#E3E6E4", borderRadius: 20, overflow: "hidden" }}><div style={{ width: `${p * 100}%`, height: "100%", background: K.teal }} /></div>
          <Mono size={50} style={{ marginTop: 14 }}>{Math.round(24 * p)} / 24 HRS</Mono>
        </div>
      </In>
      <Badge f={f} at={at(t2)} txt="READ THE TUBE" bg={K.teal} size={50} style={{ left: 1140, top: 760 }} />
    </AbsoluteFill>
  );
};

// ═══ 21 · Gota sobre la pastina: PERLA (sellada) vs SE CHUPA (sellar) ═══
export const GmBead: P<{ k: string; t: number; t2: number }> = ({ a, d, k, t, t2 }) => {
  const { f, at } = useT(a);
  const soak = ez((f - at(t2) - 10) / 30);
  const Panel = ({ at0, x, sealed, h, sub }: any) => {
    const drop = sp(f, at0, 12, 140);
    return (
      <In f={f} at={at0 - 6} style={{ position: "absolute", left: x, top: 170, width: 760 }}>
        <div style={{ height: 520, borderRadius: 20, overflow: "hidden", position: "relative", boxShadow: "0 30px 60px rgba(0,0,0,0.55)" }}>
          <Tex k="t_tile" style={{ inset: 0 }} />
          <div style={{ position: "absolute", left: 0, right: 0, top: 260, height: 40, background: sealed ? "#8E9491" : `rgb(${142 - 50 * soak},${148 - 50 * soak},${145 - 50 * soak})` }} />
          <div style={{ position: "absolute", left: 330, top: 120 + 110 * drop, width: sealed ? 110 : 110 + 120 * soak, height: sealed ? 90 : 90 - 70 * soak, borderRadius: "50%", background: "radial-gradient(circle at 35% 30%, rgba(255,255,255,0.95), rgba(140,200,220,0.55))", boxShadow: "0 8px 14px rgba(0,0,0,0.25)", transform: `translateX(${sealed ? 0 : -60 * soak}px)`, opacity: sealed ? 1 : 1 - 0.6 * soak }} />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 18, marginTop: 20 }}><Mark f={f} at={at0 + 20} ok={sealed} size={70} /><div><Ser size={64} color={K.tile}>{h}</Ser><Mono size={38} color={K.tile} b={false}>{sub}</Mono></div></div>
      </In>
    );
  };
  return (
    <AbsoluteFill>
      <Bed k={k} f={f} d={d} dim={0.38} />
      <Panel at0={at(t)} x={140} sealed h="Beads up" sub="sealer still good" />
      <Panel at0={at(t2)} x={1020} sealed={false} h="Soaks in, darker" sub="time to seal again" />
    </AbsoluteFill>
  );
};

// ═══ 22 · El extractor: hélice que gira + barra de 30 minutos que se llena después de la ducha ═══
export const GmFan: P<{ k: string; mins: number; t: number; t2: number }> = ({ a, d, k, mins, t, t2 }) => {
  const { f, at } = useT(a);
  const p = ez((f - at(t)) / 40);
  return (
    <AbsoluteFill>
      <Bed k={k} f={f} d={d} dim={0.4} />
      <div style={{ position: "absolute", left: 220, top: 200, width: 640, height: 640, borderRadius: 40, background: "linear-gradient(160deg,#F7F8F8,#C9CFCD)", boxShadow: "0 40px 90px rgba(0,0,0,0.6)" }}>
        {Array.from({ length: 12 }).map((_, i) => <div key={i} style={{ position: "absolute", left: 60, right: 60, top: 70 + i * 42, height: 16, borderRadius: 8, background: "#AEB5B2" }} />)}
        <svg viewBox="0 0 200 200" style={{ position: "absolute", left: 170, top: 170, width: 300, height: 300, transform: `rotate(${f * 24}deg)`, opacity: 0.55 }}>{[0, 1, 2, 3, 4].map((i) => <ellipse key={i} cx={100} cy={45} rx={22} ry={44} fill={K.tealD} transform={`rotate(${i * 72} 100 100)`} />)}</svg>
      </div>
      <div style={{ position: "absolute", left: 980, top: 220, width: 820 }}>
        <In f={f} at={0}><Mono size={46} color={K.warn}>FAN ON THE WHOLE SHOWER</Mono></In>
        <In f={f} at={at(t)}><Ser size={110} color={K.tile} style={{ marginTop: 16 }}>+ {mins} min after</Ser></In>
        <div style={{ marginTop: 30, height: 60, borderRadius: 30, background: "rgba(255,255,255,0.2)", overflow: "hidden" }}><div style={{ width: `${p * 100}%`, height: "100%", background: K.teal }} /></div>
        <Mono size={48} color={K.tile} style={{ marginTop: 10 }}>{Math.round(mins * p)}:00</Mono>
        <In f={f} at={at(t2)} style={{ marginTop: 40, background: K.red, padding: "14px 28px", borderRadius: 12, display: "inline-block" }}><Mono size={46} color="#fff">MOST PEOPLE TURN IT OFF HERE ✗</Mono></In>
      </div>
    </AbsoluteFill>
  );
};

// ═══ 23 · Prueba del papel higiénico frente al extractor: se pega ✓ / cuelga ✗ ═══
export const GmTissue: P<{ k: string; t: number; t2: number }> = ({ a, d, k, t, t2 }) => {
  const { f, at } = useT(a);
  const stick = ez((f - at(t)) / 14);
  const Sq = ({ x, stuck, at0, h }: any) => {
    const sw = stuck ? 0 : Math.sin((f - at0) / 7) * 6;
    return (
      <In f={f} at={at0 - 6} style={{ position: "absolute", left: x, top: 160, width: 700 }}>
        <div style={{ height: 160, borderRadius: 20, background: "linear-gradient(180deg,#F7F8F8,#CDD3D1)", boxShadow: "0 20px 40px rgba(0,0,0,0.5)", position: "relative" }}>
          {Array.from({ length: 4 }).map((_, i) => <div key={i} style={{ position: "absolute", left: 60, right: 60, top: 24 + i * 30, height: 12, borderRadius: 6, background: "#AEB5B2" }} />)}
        </div>
        <div style={{ margin: "0 auto", marginTop: stuck ? -10 - 20 * stick : 30, width: 260, height: 260, background: "#FFFFFF", boxShadow: "0 10px 20px rgba(0,0,0,0.3)", transformOrigin: "50% 0", transform: `rotate(${sw}deg) skewX(${stuck ? 0 : 3}deg)`, backgroundImage: "radial-gradient(circle, rgba(0,0,0,0.05) 2px, transparent 3px)", backgroundSize: "18px 18px" }} />
        <div style={{ display: "flex", alignItems: "center", gap: 18, marginTop: 40 }}><Mark f={f} at={at0 + 16} ok={stuck} size={70} /><Ser size={60} color={K.tile}>{h}</Ser></div>
      </In>
    );
  };
  return (
    <AbsoluteFill>
      <Bed k={k} f={f} d={d} dim={0.38} />
      <Sq x={140} stuck at0={at(t)} h="Sticks = it's pulling" />
      <Sq x={1060} stuck={false} at0={at(t2)} h="Hangs = only noise" />
    </AbsoluteFill>
  );
};

// ═══ 24 · Recibo largo de la ferretería que se imprime + el aerosol de $6/mes tachado ═══
export const GmTally: P<{ k: string; rows: (string | number)[][]; spray: string; t3: number }> = ({ a, d, k, rows, spray, t3 }) => {
  const { f, at } = useT(a);
  const shown = rows.filter((r) => f >= at(r[2] as number) - 2).length;
  const tot = rows.slice(0, shown).reduce((m, r) => m + Number(String(r[1]).replace("$", "")), 0);
  const H = 220 + 96 * shown + (f >= at(t3) ? 160 : 0);
  return (
    <AbsoluteFill style={{ background: "#202726" }}>
      <Bed k="n_spray_shelf" f={f} d={d} dim={0.3} blur={22} />
      <div style={{ position: "absolute", left: 1080, top: 140, width: 680 }}>
        <div style={{ background: "rgba(255,255,255,0.08)", padding: 30, borderRadius: 16 }}>
          <Mono size={40} color={K.tile}>THE SPRAY BOTTLE</Mono>
          <Ser size={92} color={K.tile} style={{ textDecoration: "line-through", textDecorationColor: K.red, textDecorationThickness: 8 }}>{spray}</Ser>
        </div>
      </div>
      <div style={{ position: "absolute", left: 220, top: 40, width: 700, height: Math.min(1000, H), overflow: "hidden", boxShadow: "0 30px 70px rgba(0,0,0,0.65)" }}>
        <Tex k={k} style={{ inset: 0 }} />
        <div style={{ position: "absolute", left: 50, right: 50, top: 40 }}>
          <Mono size={38} style={{ textAlign: "center" }}>GUS'S SHOPPING LIST</Mono>
          <div style={{ borderBottom: "3px dashed #9AA09D", margin: "16px 0" }} />
          {rows.slice(0, shown).map((r, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", height: 96, alignItems: "center" }}><Mono size={40} b={false}>{r[0]}</Mono><Mono size={44}>{r[1]}</Mono></div>
          ))}
          {f >= at(t3) ? <div style={{ borderTop: "3px dashed #9AA09D", marginTop: 10, paddingTop: 20, display: "flex", justifyContent: "space-between" }}><Mono size={50}>TOTAL</Mono><Ser size={90}>${tot}</Ser></div> : null}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ═══ 25 · Planilla de control en tablilla de metal: los 7 renglones se tildan ═══
export const GmCheck: P<{ k: string; items: { txt: string; t: number }[] }> = ({ a, d, k, items }) => {
  const { f, at } = useT(a);
  return (
    <AbsoluteFill style={{ background: "#1F2625" }}>
      <Bed k="n_shower_clean" f={f} d={d} dim={0.35} />
      <div style={{ position: "absolute", left: 400, top: 30, width: 1120, height: 1020 }}>
        <Tex k={k} style={{ inset: 0, borderRadius: 24, boxShadow: "0 40px 90px rgba(0,0,0,0.7)" }} />
        <div style={{ position: "absolute", left: 410, top: -10, width: 300, height: 70, borderRadius: 12, background: "linear-gradient(180deg,#DDE1E3,#8F969A)" }} />
        <div style={{ position: "absolute", left: 60, top: 90, right: 60, bottom: 40, background: K.paper, padding: "30px 46px" }}>
          <Ser size={64}>Shower check · Gus</Ser>
          <div style={{ height: 3, background: K.ink, margin: "10px 0 6px" }} />
          {items.map((it, i) => (
            <div key={i} style={{ height: 112, display: "flex", alignItems: "center", gap: 22, borderBottom: "1px solid #D5D8D6" }}>
              <Mark f={f} at={at(it.t) + 4} size={64} />
              <Mono size={38} color={K.teal}>{i + 1}</Mono>
              <In f={f} at={at(it.t)} x={30} from={0}><Mono size={44} color={K.ink}>{it.txt}</Mono></In>
            </div>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};
