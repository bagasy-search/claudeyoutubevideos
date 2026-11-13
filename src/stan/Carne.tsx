// Kit de carnicería de Stan (stan12): papel rosa de carnicero, etiqueta kraft con hilo, pizarra de precios, lápiz graso rojo, comandas en el pincho.
// PURO CSS y DOM: sin SVG, sin texturas PNG, sin blur, sin backdrop-filter. Las fotos van enteras (Photo/Fondo del Kit).
import React from "react";
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, Easing } from "remotion";
import { loadFont as loadMark } from "@remotion/google-fonts/PermanentMarker";
import { loadFont as loadType } from "@remotion/google-fonts/SpecialElite";
import { Photo, Fondo, FONTS, CL, hash, useIn, useOut, shadow } from "./Kit";

const { fontFamily: MARK } = loadMark("normal", { weights: ["400"], subsets: ["latin"] });
const { fontFamily: TYPE } = loadType("normal", { weights: ["400"], subsets: ["latin"] });
const { SERIF, SANS, HAND } = FONTS;
export const C = { papel: "#EDC9B6", papel2: "#E2B39C", kraft: "#CDAA7C", kraft2: "#B88F5C", ink: "#2A1A12", red: "#B3261E", chalk: "#F3F0E4", board: "#1F2B27", board2: "#162019", tile: "#F4F1EA", steel: "#B9BEC2" };
const cl = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const ease = Easing.out(Easing.cubic);
const sp = (f: number, d = 0, damping = 14) => spring({ frame: f - d, fps: 30, config: { damping, mass: 0.8 } });

// hoja de papel de carnicero (borde serrado arriba, como cortada del rollo)
export const Hoja: React.FC<{ style?: React.CSSProperties; children?: React.ReactNode; kraft?: boolean }> = ({ style, children, kraft }) => (
  <div style={{ position: "relative", background: kraft ? `linear-gradient(175deg, ${C.kraft} 0%, ${C.kraft2} 100%)` : `linear-gradient(175deg, ${C.papel} 0%, ${C.papel2} 100%)`, boxShadow: "0 26px 60px rgba(0,0,0,0.5), 0 2px 6px rgba(0,0,0,0.25)", ...style }}>
    <div style={{ position: "absolute", left: 0, right: 0, top: -11, height: 12, background: `linear-gradient(135deg, transparent 8px, ${kraft ? C.kraft : C.papel} 0) 0 0 / 16px 12px repeat-x, linear-gradient(225deg, transparent 8px, ${kraft ? C.kraft : C.papel} 0) 8px 0 / 16px 12px repeat-x` }} />
    <div style={{ position: "relative" }}>{children}</div>
  </div>
);

// etiqueta de precio kraft con ojal e hilo
export const Tag: React.FC<{ w?: number; style?: React.CSSProperties; children?: React.ReactNode; hilo?: number }> = ({ w = 520, style, children, hilo = 220 }) => (
  <div style={{ position: "relative", width: w, ...style }}>
    <div style={{ position: "absolute", left: w / 2 - 2, top: -hilo, width: 4, height: hilo + 34, background: "linear-gradient(90deg,#8E6B3E,#D8C19A 50%,#8E6B3E)", borderRadius: 2 }} />
    <div style={{ background: `linear-gradient(170deg, ${C.kraft} 0%, ${C.kraft2} 100%)`, clipPath: "polygon(12% 0, 88% 0, 100% 11%, 100% 100%, 0 100%, 0 11%)", padding: "74px 40px 40px", boxShadow: "0 18px 40px rgba(0,0,0,0.45)" }}>
      <div style={{ position: "absolute", left: w / 2 - 17, top: 22, width: 34, height: 34, borderRadius: "50%", background: "#2B211A", boxShadow: "0 0 0 7px #E9DCC2" }} />
      {children}
    </div>
  </div>
);

const Typed: React.FC<{ txt: string; at: number; speed?: number; style?: React.CSSProperties }> = ({ txt, at, speed = 1, style }) => {
  const f = useCurrentFrame(); const n = Math.round(interpolate(f, [at, at + txt.length * speed], [0, txt.length], CL));
  return <span style={style}>{txt.slice(0, n)}<span style={{ opacity: 0 }}>{txt.slice(n)}</span></span>;
};

// sello del canal
export const Sello: React.FC<{ delay?: number; style?: React.CSSProperties; txt?: string; sub?: string; size?: number }> = ({ delay = 8, style, txt = "STAN'S MEATS", sub = "CHICAGO · SINCE 1961", size = 1 }) => {
  const f = useCurrentFrame(); const p = sp(f, delay, 10);
  return (
    <div style={{ position: "absolute", border: `${6 * size}px double ${C.red}`, color: C.red, padding: `${10 * size}px ${22 * size}px`, borderRadius: 8, textAlign: "center", opacity: 0.88 * cl(p * 1.5), transform: `rotate(-8deg) scale(${interpolate(p, [0, 1], [2.1, 1])})`, ...style }}>
      <div style={{ fontFamily: SANS, fontWeight: 600, letterSpacing: 5 * size, fontSize: 30 * size }}>{txt}</div>
      {sub && <div style={{ fontFamily: SANS, fontWeight: 600, letterSpacing: 4 * size, fontSize: 17 * size, marginTop: 2 }}>{sub}</div>}
    </div>
  );
};

// ---------- (3) apertura de capítulo: la foto del pavo entera + la etiqueta de precio que cae colgando del hilo y se hamaca
export const ChapS: React.FC<{ n: number; N: number; title: string; sub?: string; src: string; dur: number; label?: string; big?: string }> = ({ n, N, title, sub, src, dur, label, big }) => {
  const f = useCurrentFrame(); const o = useOut(dur, 8);
  const drop = sp(f, 4, 11);
  const sw = Math.sin(f / 9) * 7 * Math.exp(-f / 45);
  const right = n % 2 === 0;
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Photo src={src} seed={n * 7 + 3} dur={dur} />
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.28) 0%, rgba(0,0,0,0) 40%)" }} />
      <div style={{ position: "absolute", top: 240, ...(right ? { right: 150 } : { left: 150 }), transformOrigin: "50% -220px", transform: `translateY(${(1 - drop) * -900}px) rotate(${sw + (right ? 2 : -2)}deg)` }}>
        <Tag w={620}>
          <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 26, letterSpacing: 7, color: C.ink, opacity: 0.75, textAlign: "center" }}>{label ?? `TURKEY ${n} OF ${N}`}</div>
          <div style={{ fontFamily: MARK, fontSize: big && big.length > 3 ? 120 : 210, lineHeight: 0.95, color: C.red, textAlign: "center", margin: "6px 0 0" }}>{big ?? `#${n}`}</div>
          <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 70, color: C.ink, lineHeight: 1.05, textAlign: "center", minHeight: 150 }}><Typed txt={title} at={16} speed={1.1} /></div>
          {sub && <div style={{ fontFamily: TYPE, fontSize: 28, color: C.ink, opacity: interpolate(f, [40, 52], [0, 0.8], CL), textAlign: "center", marginTop: 8 }}>{sub}</div>}
        </Tag>
      </div>
    </AbsoluteFill>
  );
};

// ---------- (2) progreso: 10 etiquetitas arriba a la DERECHA, la del pavo actual en rojo
export const ProgS: React.FC<{ n: number; N: number; title: string; dur: number; unit?: string }> = ({ n, N, title, dur, unit = "TURKEY" }) => {
  const asc = unit === "STEP";
  const f = useCurrentFrame(); const o = interpolate(f, [0, 8, dur - 8, dur], [0, 1, 1, 0], CL);
  return (
    <div style={{ position: "absolute", right: 54, top: 40, opacity: o, display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
      <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 21, letterSpacing: 3, color: "#FFF8EA", textShadow: shadow }}>{unit} {asc ? `${n} OF ${N}` : `#${n}`} · {title.toUpperCase()}</div>
      <div style={{ display: "flex", gap: 6 }}>
        {N > 12 ? null : Array.from({ length: N }, (_, i) => { const k = asc ? i + 1 : N - i; const done = asc ? k < n : k > n, cur = k === n; return (
          <div key={i} style={{ width: 34, height: 44, clipPath: "polygon(22% 0, 78% 0, 100% 22%, 100% 100%, 0 100%, 0 22%)", background: cur ? C.red : done ? C.kraft : "rgba(255,246,230,0.38)", display: "flex", alignItems: "flex-end", justifyContent: "center", paddingBottom: 3, fontFamily: SANS, fontWeight: 600, fontSize: 17, color: cur ? "#FFF3E0" : done ? C.ink : "rgba(255,255,255,0.85)" }}>{k}</div>
        ); })}
      </div>
    </div>
  );
};

// ---------- (1) carrusel: las 10 fotos pasan en profundidad (perspective/translateZ) y terminan en abanico sobre el papel
export const CarruselS: React.FC<{ cards: { n: number; title: string; src: string }[]; bg?: string; head: string; dur: number }> = ({ cards, bg, head, dur }) => {
  const f = useCurrentFrame(); const o = useOut(dur, 10); const N = cards.length;
  const fan0 = Math.max(60, dur - 70); const k = (fan0 - 14) / N;
  const fan = ease(cl((f - fan0) / 22));
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Fondo src={bg} seed={909} dur={dur} />
      <div style={{ position: "absolute", top: 78, width: "100%", textAlign: "center", fontFamily: MARK, fontSize: 70, lineHeight: 1.3, zIndex: 500, color: "#FFF4E2", textShadow: shadow, opacity: cl(f / 10) }}>{head}</div>
      <AbsoluteFill style={{ perspective: 1600 }}>
        {cards.map((c, i) => {
          const t = (f - 10 - i * k) / k; // 0..1 = su turno al frente
          const inn = ease(cl(t * 2.2)), out = ease(cl((t - 0.82) * 4));
          const xF = -780 + (i % 5) * 390, yF = i < 5 ? -40 : 250, rF = (hash(i + 3) % 9) - 4;
          const x = interpolate(fan, [0, 1], [interpolate(inn, [0, 1], [1500, 0]) - out * 1500, xF]);
          const y = interpolate(fan, [0, 1], [40, yF]);
          const z = interpolate(fan, [0, 1], [interpolate(inn, [0, 1], [-900, 0]) - out * 700, -520]);
          const ry = interpolate(fan, [0, 1], [interpolate(inn, [0, 1], [-48, 0]) + out * 48, 0]);
          const vis = fan > 0 ? 1 : cl(t * 6) * (1 - cl((t - 1) * 6));
          return (
            <div key={i} style={{ position: "absolute", left: 960 - 330, top: 540 - 250, width: 660, opacity: vis, transform: `translate3d(${x}px, ${y}px, ${z}px) rotateY(${ry}deg) rotateZ(${fan * rF}deg)`, zIndex: fan > 0 ? i : 100 - Math.abs(Math.round((t - 0.5) * 50)) }}>
              <div style={{ background: C.tile, padding: 14, boxShadow: "0 30px 70px rgba(0,0,0,0.6)" }}>
                <div style={{ width: 632, height: 370, overflow: "hidden" }}><Img src={staticFile(c.src)} style={{ width: "100%", height: "100%", objectFit: "cover" }} /></div>
                <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "10px 6px 2px" }}>
                  <span style={{ fontFamily: MARK, fontSize: 62, color: C.red, lineHeight: 1 }}>#{c.n}</span>
                  <span style={{ fontFamily: HAND, fontWeight: 700, fontSize: 46, color: C.ink, lineHeight: 1 }}>{c.title}</span>
                </div>
              </div>
            </div>
          );
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ---------- la etiqueta del envoltorio (texto nuestro, impreso a máquina) con la frase clave rodeada con lápiz graso
export const LabelS: React.FC<{ head: string; lines: { txt: string; hl?: boolean; small?: boolean }[]; note?: string; bg?: string; mark: number; dur: number; seed?: number }> = ({ head, lines, note, bg, mark, dur, seed = 1 }) => {
  const f = useCurrentFrame(); const o = useOut(dur, 8); const p = sp(f, 0, 16);
  const ring = ease(cl((f - mark) / 14));
  const tilt = (hash(seed) % 2 ? 1 : -1) * 1.4;
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Fondo src={bg} seed={seed * 13} dur={dur} />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <div style={{ width: 1280, background: "linear-gradient(180deg,#FDFBF6,#F2EEE3)", borderRadius: 26, padding: "40px 70px 50px", boxShadow: "0 30px 70px rgba(0,0,0,0.55), inset 0 0 0 5px #C9C3B4", transform: `translateY(${(1 - p) * 700}px) rotate(${tilt}deg) scale(${1 + 0.02 * (f / Math.max(1, dur))})`, position: "relative" }}>
          <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 24, letterSpacing: 7, color: "#6B655A", borderBottom: "3px solid #2A2A2A", paddingBottom: 12 }}>{head}</div>
          <div style={{ marginTop: 22 }}>
            {lines.map((l, i) => (
              <div key={i} style={{ position: "relative", display: "table", margin: "6px 0", padding: l.hl ? "8px 26px" : "2px 0" }}>
                <span style={{ fontFamily: TYPE, fontSize: l.small ? 30 : l.hl ? 58 : 44, color: "#1E1E1E", lineHeight: 1.2, opacity: l.small ? 0.75 : 1 }}>{l.txt}</span>
                {l.hl && <div style={{ position: "absolute", inset: "-8px -10px", border: `7px solid ${C.red}`, borderRadius: "50%", transform: "rotate(-1.5deg)", WebkitMask: `conic-gradient(from -60deg, #000 ${ring * 360}deg, transparent 0)`, mask: `conic-gradient(from -60deg, #000 ${ring * 360}deg, transparent 0)` }} />}
              </div>
            ))}
          </div>
          {note && <div style={{ position: "absolute", right: 50, bottom: -64, fontFamily: MARK, fontSize: 54, color: C.red, transform: "rotate(-4deg)", opacity: cl((f - mark - 12) / 8), textShadow: "0 2px 0 rgba(255,255,255,0.6)", background: C.papel, padding: "6px 26px", boxShadow: "0 10px 24px rgba(0,0,0,0.4)" }}>{note}</div>}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ---------- la comanda del pavo: los 4 datos + la nota con sello
export const TicketS: React.FC<{ n: number; title: string; rows: [string, string][]; score: string; scoreNote?: string; bg?: string; markScore: number; dur: number }> = ({ n, title, rows, score, scoreNote, bg, markScore, dur }) => {
  const f = useCurrentFrame(); const o = useOut(dur, 8); const p = sp(f, 0, 17);
  const st = sp(f, markScore, 9);
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Fondo src={bg} seed={n * 17 + 5} dur={dur} />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <Hoja style={{ width: 1380, padding: "36px 330px 46px 70px", transform: `translateY(${(1 - p) * 760}px) rotate(${n % 2 ? -1.2 : 1.2}deg) scale(${1 + 0.015 * (f / Math.max(1, dur))})` }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 26, borderBottom: `4px dashed rgba(42,26,18,0.4)`, paddingBottom: 10 }}>
            <span style={{ fontFamily: MARK, fontSize: 96, color: C.red, lineHeight: 1 }}>#{n}</span>
            <span style={{ fontFamily: HAND, fontWeight: 700, fontSize: 72, color: C.ink, lineHeight: 1 }}>{title}</span>
          </div>
          {rows.map(([a, b], i) => { const q = sp(f, 8 + i * 6, 18); return (
            <div key={i} style={{ display: "flex", gap: 24, alignItems: "baseline", marginTop: 18, opacity: q, transform: `translateX(${(1 - q) * 40}px)` }}>
              <span style={{ fontFamily: SANS, fontWeight: 600, fontSize: 24, letterSpacing: 4, color: C.red, width: 210, flex: "none" }}>{a}</span>
              <span style={{ fontFamily: HAND, fontWeight: 700, fontSize: 44, color: C.ink, lineHeight: 1.12 }}>{b}</span>
            </div>
          ); })}
          <div style={{ position: "absolute", right: -300, bottom: -30, width: 270, height: 270, borderRadius: "50%", border: `12px solid ${C.red}`, boxShadow: `inset 0 0 0 6px ${C.papel}, inset 0 0 0 10px ${C.red}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: C.red, background: "rgba(237,201,182,0.92)", opacity: cl(st * 1.6), transform: `rotate(-12deg) scale(${interpolate(st, [0, 1], [2.4, 1])})` }}>
            <div style={{ fontFamily: MARK, fontSize: score.length > 2 ? 104 : 140, lineHeight: 0.95 }}>{score}</div>
            <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 24, letterSpacing: 5 }}>OUT OF 10</div>
            {scoreNote && <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 16, letterSpacing: 2, marginTop: 4, maxWidth: 220, textAlign: "center" }}>{scoreNote}</div>}
          </div>
        </Hoja>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ---------- pizarra de precios (tiza): un precio en rango, o la lista entera
export const BoardS: React.FC<{ title: string; rows: { name: string; price: string; f: number; hl?: boolean }[]; foot?: string; dur: number }> = ({ title, rows, foot, dur }) => {
  const f = useCurrentFrame(); const o = useOut(dur, 8); const p = sp(f, 0, 18); const one = rows.length === 1;
  return (
    <AbsoluteFill style={{ opacity: o, background: "#EDEAE2", backgroundImage: "linear-gradient(#D5D0C4 4px, transparent 4px), linear-gradient(90deg, #D5D0C4 4px, transparent 4px)", backgroundSize: "170px 86px" }}>
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", transform: `scale(${1 + 0.02 * (f / Math.max(1, dur))})` }}>
        <div style={{ width: one ? 1380 : 1560, padding: 26, background: "linear-gradient(180deg,#8A5A34,#6B4226)", boxShadow: "0 30px 70px rgba(0,0,0,0.45)", transform: `translateY(${(1 - p) * -900}px) rotate(${(1 - p) * 5 - 0.6}deg)` }}>
          <div style={{ background: `linear-gradient(160deg, ${C.board} 0%, ${C.board2} 100%)`, padding: one ? "50px 70px 60px" : "30px 60px 36px", boxShadow: "inset 0 0 60px rgba(0,0,0,0.5)" }}>
            <div style={{ fontFamily: MARK, fontSize: one ? 60 : 50, color: C.chalk, opacity: 0.92, borderBottom: "4px solid rgba(243,240,228,0.5)", paddingBottom: 10, letterSpacing: 2 }}>{title}</div>
            {rows.map((r, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginTop: one ? 40 : 9, opacity: cl((f - r.f) / 6), color: r.hl ? "#FFD98A" : C.chalk }}>
                <span style={{ fontFamily: HAND, fontWeight: 700, fontSize: one ? 84 : 44 }}>{r.name}</span>
                <span style={{ flex: 1, borderBottom: "4px dotted rgba(243,240,228,0.35)", margin: "0 22px", transform: "translateY(-10px)" }} />
                <span style={{ fontFamily: MARK, fontSize: one ? 110 : 50 }}><Typed txt={r.price} at={r.f + 2} speed={1.4} /></span>
              </div>
            ))}
            <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: one ? 44 : 32, color: C.chalk, opacity: 0.7, marginTop: one ? 34 : 14, textAlign: "right" }}>{foot || "per pound · where I shop"}</div>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ---------- balanza colgante: la aguja sube hasta las libras por persona
export const ScaleS: React.FC<{ a: number; b?: number; big: string; sub: string; bg?: string; dur: number }> = ({ a, b, big, sub, bg, dur }) => {
  const f = useCurrentFrame(); const o = useOut(dur, 8); const p = sp(f, 0, 16);
  const t = sp(f, 8, 9); const max = 3; const v = (b ?? a) * t; const ang = -130 + (v / max) * 260 + Math.sin(f / 5) * 1.2 * Math.exp(-f / 30);
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Fondo src={bg} seed={333} dur={dur} />
      <AbsoluteFill style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 90 }}>
        <div style={{ width: 620, height: 620, borderRadius: "50%", background: "radial-gradient(circle at 35% 30%, #FFFFFF, #E9E5DA 70%)", boxShadow: "0 0 0 22px #9BA1A6, 0 0 0 30px #5E6468, 0 34px 70px rgba(0,0,0,0.55)", position: "relative", transform: `scale(${0.7 + 0.3 * p})`, opacity: p }}>
          <div style={{ position: "absolute", inset: 26, borderRadius: "50%", background: "repeating-conic-gradient(from -130deg, #2A2A2A 0deg 1.2deg, transparent 1.2deg 21.666deg)", WebkitMask: "radial-gradient(circle, transparent 0 62%, #000 62% 70%, transparent 70%)", mask: "radial-gradient(circle, transparent 0 62%, #000 62% 70%, transparent 70%)" }} />
          {[0, 1, 2, 3].map((n) => { const an = (-130 + (n / max) * 260) * Math.PI / 180; return <div key={n} style={{ position: "absolute", left: 310 + Math.sin(an) * 170 - 30, top: 310 - Math.cos(an) * 170 - 34, width: 60, textAlign: "center", fontFamily: SERIF, fontWeight: 700, fontSize: 56, color: "#2A2A2A" }}>{n}</div>; })}
          <div style={{ position: "absolute", left: 250, top: 400, width: 120, textAlign: "center", fontFamily: SANS, fontWeight: 600, fontSize: 22, letterSpacing: 4, color: "#6B655A" }}>POUNDS</div>
          <div style={{ position: "absolute", left: 304, top: 70, width: 12, height: 250, background: C.red, borderRadius: 6, transformOrigin: "50% 240px", transform: `rotate(${ang}deg)`, boxShadow: "0 3px 6px rgba(0,0,0,0.35)" }} />
          <div style={{ position: "absolute", left: 282, top: 282, width: 56, height: 56, borderRadius: "50%", background: "#3A3A3A" }} />
        </div>
        <div style={{ maxWidth: 820, opacity: cl((f - 10) / 10) }}>
          <div style={{ fontFamily: MARK, fontSize: 130, lineHeight: 1, color: "#FFF4E2", textShadow: shadow }}>{big}</div>
          <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 66, color: "#FFE7C4", textShadow: shadow, marginTop: 14, lineHeight: 1.1 }}>{sub}</div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ---------- almanaque de taco: los días de heladera contados hacia atrás desde el jueves
export const WeekS: React.FC<{ head: string; days: { d: string; note?: string; on?: boolean; star?: boolean }[]; foot: string; bg?: string; dur: number }> = ({ head, days, foot, bg, dur }) => {
  const f = useCurrentFrame(); const o = useOut(dur, 8); const N = days.length;
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Fondo src={bg} seed={612} dur={dur} />
      <div style={{ position: "absolute", top: 90, width: "100%", textAlign: "center", fontFamily: MARK, fontSize: 84, color: "#FFF4E2", textShadow: shadow, opacity: cl(f / 8) }}>{head}</div>
      <AbsoluteFill style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 22, top: 40 }}>
        {days.map((d, i) => { const q = sp(f, 6 + i * 5, 13); const x = sp(f, 22 + i * 7, 12); return (
          <div key={i} style={{ width: Math.min(260, 1700 / N - 22), background: "#FBF8F0", boxShadow: "0 22px 46px rgba(0,0,0,0.5)", transform: `translateY(${(1 - q) * -700}px) rotate(${(hash(i + 9) % 5) - 2}deg)`, position: "relative" }}>
            <div style={{ background: d.star ? C.red : "#3A2A20", color: "#FFF3E0", fontFamily: SANS, fontWeight: 600, fontSize: 30, letterSpacing: 4, textAlign: "center", padding: "12px 0" }}>{d.d}</div>
            <div style={{ height: 210, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 10px", textAlign: "center", fontFamily: HAND, fontWeight: 700, fontSize: 38, color: C.ink, lineHeight: 1.05 }}>{d.note || ""}</div>
            {d.on && <div style={{ position: "absolute", left: "12%", right: "12%", top: 118, height: 10, background: C.red, borderRadius: 5, transformOrigin: "0 50%", transform: `rotate(-24deg) scaleX(${x})`, opacity: 0.9 }} />}
          </div>
        ); })}
      </AbsoluteFill>
      <div style={{ position: "absolute", bottom: 110, width: "100%", textAlign: "center", fontFamily: HAND, fontWeight: 700, fontSize: 62, color: "#FFE7C4", textShadow: shadow, opacity: cl((f - 30) / 10) }}>{foot}</div>
    </AbsoluteFill>
  );
};

// ---------- la palabra de la etiqueta como calcomanía + el veredicto sellado
export const WordS: React.FC<{ word: string; means: string; verdict: string; good?: boolean; bg?: string; markV: number; dur: number; seed?: number }> = ({ word, means, verdict, good, bg, markV, dur, seed = 1 }) => {
  const f = useCurrentFrame(); const o = useOut(dur, 8); const p = sp(f, 0, 12); const s = sp(f, markV, 9);
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Fondo src={bg} seed={seed * 7 + 2} dur={dur} />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <div style={{ position: "relative", transform: `scale(${interpolate(p, [0, 1], [0.3, 1]) * (1 + 0.02 * f / Math.max(1, dur))}) rotate(${(hash(seed) % 7) - 3}deg)` }}>
          <div style={{ background: good ? "#F7F4E8" : "#FFF7D6", border: `10px solid ${good ? "#2F6B3A" : "#C8961E"}`, borderRadius: good ? "50%" : 40, padding: good ? "120px 90px" : "46px 90px", boxShadow: "0 30px 70px rgba(0,0,0,0.55)", textAlign: "center", minWidth: 760 }}>
            <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 130, color: good ? "#2F6B3A" : "#3A2A12", lineHeight: 1 }}>{word}</div>
            <div style={{ fontFamily: TYPE, fontSize: 38, color: "#2A2A2A", marginTop: 22, maxWidth: 900, lineHeight: 1.25, opacity: cl((f - 14) / 8) }}>{means}</div>
          </div>
          <div style={{ position: "absolute", right: -160, bottom: -80, border: `9px double ${good ? "#2F6B3A" : C.red}`, color: good ? "#2F6B3A" : C.red, background: "rgba(255,250,240,0.94)", padding: "12px 30px", borderRadius: 10, fontFamily: MARK, fontSize: 64, opacity: cl(s * 1.6), transform: `rotate(-9deg) scale(${interpolate(s, [0, 1], [2.3, 1])})`, boxShadow: "0 12px 26px rgba(0,0,0,0.35)", whiteSpace: "nowrap" }}>{verdict}</div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ---------- comandas en el pincho del mostrador: la pregunta escrita a mano
export const SlipS: React.FC<{ q: string; kicker?: string; n?: number; bg?: string; dur: number }> = ({ q, kicker = "FROM THE COUNTER", n = 1, bg, dur }) => {
  const f = useCurrentFrame(); const o = useOut(dur, 8); const p = sp(f, 0, 12);
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Fondo src={bg} seed={n * 31} dur={dur} />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <div style={{ position: "relative", transform: `translateY(${(1 - p) * -900}px) rotate(${(n % 2 ? -2.5 : 2.5) + (1 - p) * 14}deg)` }}>
          {[2, 1].map((k) => <div key={k} style={{ position: "absolute", left: k * 16, top: k * 12, width: 1020, height: "100%", background: "#EFE9D8", transform: `rotate(${k * 2.2}deg)`, boxShadow: "0 10px 24px rgba(0,0,0,0.3)" }} />)}
          <div style={{ position: "relative", width: 1020, background: "#FBF7EA", padding: "110px 70px 70px", boxShadow: "0 30px 60px rgba(0,0,0,0.5)", backgroundImage: "repeating-linear-gradient(180deg, transparent 0 67px, rgba(60,90,140,0.25) 67px 69px)", backgroundPosition: "0 118px" }}>
            <div style={{ position: "absolute", left: 505, top: -150, width: 10, height: 230, background: "linear-gradient(90deg,#7C8388,#E3E7EA 50%,#7C8388)", borderRadius: "5px 5px 0 0" }} />
            <div style={{ position: "absolute", left: 494, top: 64, width: 32, height: 14, borderRadius: "50%", background: "#3B342C" }} />
            <div style={{ position: "absolute", left: 70, top: 34, fontFamily: SANS, fontWeight: 600, fontSize: 24, letterSpacing: 6, color: C.red }}>{kicker}</div>
            <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: q.length > 60 ? 64 : 80, color: "#23375E", lineHeight: "69px", minHeight: 207 }}><Typed txt={q} at={10} speed={0.8} /></div>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ---------- cuenta con lápiz graso sobre el papel
export const SumS: React.FC<{ parts: { txt: string; f: number; big?: boolean }[]; foot?: string; bg?: string; dur: number }> = ({ parts, foot, bg, dur }) => {
  const f = useCurrentFrame(); const o = useOut(dur, 8); const p = sp(f, 0, 16);
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Fondo src={bg} seed={818} dur={dur} />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <Hoja style={{ width: 1500, padding: "70px 80px 60px", transform: `translateY(${(1 - p) * 700}px) rotate(-1deg)` }}>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "baseline", gap: "10px 34px", justifyContent: "center" }}>
            {parts.map((x, i) => <span key={i} style={{ fontFamily: MARK, fontSize: x.big ? 150 : 104, color: x.big ? C.red : C.ink, lineHeight: 1.1, opacity: cl((f - x.f) / 4), transform: `scale(${interpolate(cl((f - x.f) / 6), [0, 1], [1.5, 1])})`, display: "inline-block" }}>{x.txt}</span>)}
          </div>
          {foot && <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 54, color: C.ink, textAlign: "center", marginTop: 26, opacity: cl((f - parts[parts.length - 1].f - 8) / 8) }}>{foot}</div>}
        </Hoja>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ---------- lista sobre papel de carnicero (4 cosas, 4 preguntas, 3 reglas, repaso): cada renglón sobre su palabra
export const ListaS: React.FC<{ head: string; title: string; rows: { a?: string; txt: string; f: number; sub?: string }[]; bg?: string; dur: number; kraft?: boolean; sello?: boolean; dense?: boolean }> = ({ head, title, rows, bg, dur, kraft, sello, dense }) => {
  const f = useCurrentFrame(); const o = useOut(dur, 8); const p = sp(f, 0, 17);
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Fondo src={bg} seed={1212 + rows.length} dur={dur} />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <Hoja kraft={kraft} style={{ width: dense ? 1660 : 1380, padding: dense ? "30px 60px 34px" : "44px 80px 54px", transform: `translateY(${(1 - p) * 760}px) rotate(0.7deg) scale(${1 + 0.012 * (f / Math.max(1, dur))})` }}>
          <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 24, letterSpacing: 7, color: C.red }}>{head}</div>
          <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: dense ? 60 : 78, color: C.ink, lineHeight: 1.05, margin: "4px 0 14px", borderBottom: "4px dashed rgba(42,26,18,0.35)", paddingBottom: 10 }}>{title}</div>
          {rows.map((r, i) => { const on = cl((f - r.f) / 6); return (
            <div key={i} style={{ display: "flex", gap: 22, alignItems: "baseline", marginTop: dense ? 5 : 16, opacity: 0.16 + 0.84 * on }}>
              {r.a && <span style={{ fontFamily: MARK, fontSize: dense ? 46 : 66, color: C.red, width: dense ? 80 : 110, flex: "none", lineHeight: 1 }}>{r.a}</span>}
              <span style={{ fontFamily: HAND, fontWeight: 700, fontSize: dense ? 40 : 58, color: C.ink, lineHeight: 1.08 }}>{r.txt}{r.sub && <span style={{ fontFamily: TYPE, fontWeight: 400, fontSize: dense ? 27 : 32, opacity: 0.8 }}>{"  "}{r.sub}</span>}</span>
            </div>
          ); })}
          {sello && <Sello delay={rows[rows.length - 1].f + 14} style={{ right: 36, top: 26 }} />}
        </Hoja>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ---------- hoja de almanaque del plan (domingo / miércoles / jueves)
export const DiaS: React.FC<{ day: string; what: string; n: number; N: number; bg?: string; dur: number }> = ({ day, what, n, N, bg, dur }) => {
  const f = useCurrentFrame(); const o = useOut(dur, 8); const p = sp(f, 0, 11);
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Fondo src={bg} seed={n * 91} dur={dur} />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", perspective: 1400 }}>
        <div style={{ width: 900, background: "#FBF8F0", boxShadow: "0 34px 70px rgba(0,0,0,0.55)", transformOrigin: "50% 0", transform: `rotateX(${(1 - p) * -80}deg) rotate(-1.5deg)` }}>
          <div style={{ background: C.red, color: "#FFF3E0", fontFamily: SANS, fontWeight: 600, fontSize: 34, letterSpacing: 8, textAlign: "center", padding: "20px 0" }}>STEP {n} OF {N} · THANKSGIVING WEEK</div>
          <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 150, color: C.ink, textAlign: "center", lineHeight: 1, padding: "46px 20px 10px" }}>{day}</div>
          <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 62, color: C.red, textAlign: "center", padding: "0 40px 50px", lineHeight: 1.1, opacity: cl((f - 10) / 8) }}>{what}</div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ---------- dos reglas de medir: tiempo de cría (4 meses vs 7) o lo que haga falta comparar
export const BarrasS: React.FC<{ head: string; rows: { name: string; val: number; label: string; f: number }[]; max: number; unit: string; foot?: string; bg?: string; dur: number }> = ({ head, rows, max, unit, foot, bg, dur }) => {
  const f = useCurrentFrame(); const o = useOut(dur, 8);
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Fondo src={bg} seed={555} dur={dur} />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <Hoja style={{ width: 1560, padding: "44px 70px 54px", transform: "rotate(-0.6deg)" }}>
          <div style={{ fontFamily: MARK, fontSize: 64, color: C.ink }}>{head}</div>
          {rows.map((r, i) => { const g = ease(cl((f - r.f) / 26)); return (
            <div key={i} style={{ marginTop: 34 }}>
              <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 54, color: C.ink }}>{r.name}</div>
              <div style={{ position: "relative", height: 74, width: 1000, background: "rgba(42,26,18,0.08)" }}>
                <div style={{ position: "absolute", left: 0, top: 0, height: 74, width: 1000 * (r.val / max) * g, background: i ? C.red : "#E7C98B", backgroundImage: "repeating-linear-gradient(90deg, rgba(42,26,18,0.55) 0 3px, transparent 3px " + 1000 / max + "px)", boxShadow: "0 6px 12px rgba(0,0,0,0.25)" }} />
                <div style={{ position: "absolute", left: 1000 * (r.val / max) * g + 18, top: 2, fontFamily: MARK, fontSize: 58, color: C.ink, whiteSpace: "nowrap", opacity: cl(g * 2) }}>{r.label}</div>
              </div>
            </div>
          ); })}
          <div style={{ fontFamily: TYPE, fontSize: 30, color: C.ink, opacity: 0.75, marginTop: 26 }}>{foot || unit}</div>
        </Hoja>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ---------- «fresh» = nunca bajo 26 °F: termómetro de cámara con dos marcas
export const FreshS: React.FC<{ fA: number; fB: number; bg?: string; dur: number }> = ({ fA, fB, bg, dur }) => {
  const f = useCurrentFrame(); const o = useOut(dur, 8); const p = sp(f, 0, 16);
  const y = (deg: number) => 640 - ((deg - 14) / 28) * 600; const t = ease(cl((f - 6) / 40)); const cur = 42 - 16 * t;
  const Mark: React.FC<{ deg: number; txt: string; sub: string; at: number; col: string }> = ({ deg, txt, sub, at, col }) => (
    <div style={{ position: "absolute", left: 150, top: y(deg) - 3, opacity: cl((f - at) / 6) }}>
      <div style={{ width: 420, height: 6, background: col }} />
      <div style={{ position: "absolute", left: 440, top: -62, whiteSpace: "nowrap" }}>
        <span style={{ fontFamily: MARK, fontSize: 96, color: col, textShadow: "0 2px 10px rgba(0,0,0,0.5)" }}>{txt}</span>
        <span style={{ fontFamily: HAND, fontWeight: 700, fontSize: 56, color: "#FFF4E2", textShadow: shadow, marginLeft: 24 }}>{sub}</span>
      </div>
    </div>
  );
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Fondo src={bg} seed={2626} dur={dur} />
      <div style={{ position: "absolute", left: 330, top: 150, width: 1300, height: 760, opacity: p }}>
        <div style={{ position: "absolute", left: 0, top: 20, width: 110, height: 640, borderRadius: 55, background: "#FBF8F0", boxShadow: "0 20px 44px rgba(0,0,0,0.5)" }} />
        <div style={{ position: "absolute", left: 38, top: y(cur), width: 34, height: 640 - y(cur) + 40, borderRadius: 17, background: "#3F7FBF" }} />
        <div style={{ position: "absolute", left: -25, top: 620, width: 160, height: 160, borderRadius: "50%", background: "#3F7FBF", boxShadow: "0 20px 44px rgba(0,0,0,0.5)" }} />
        <Mark deg={32} txt="32°F" sub="water freezes" at={fB} col="#9FD0FF" />
        <Mark deg={26} txt="26°F" sub="still labeled “fresh”" at={fA} col="#FFD98A" />
        <div style={{ position: "absolute", left: 150, top: 700, fontFamily: SANS, fontWeight: 500, fontSize: 28, color: "#F4E6D0", textShadow: shadow }}>Source: USDA FSIS poultry labeling terms (“fresh” = never below 26°F)</div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- tres tiempos sobre la foto oscurecida (la sal seca: sale el agua → se disuelve → vuelve a entrar)
export const PasosS: React.FC<{ head: string; steps: { txt: string; f: number }[]; foot?: string; bg?: string; dur: number }> = ({ head, steps, foot, bg, dur }) => {
  const f = useCurrentFrame(); const o = useOut(dur, 8);
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Fondo src={bg} seed={4747} dur={dur} />
      <div style={{ position: "absolute", top: 120, width: "100%", textAlign: "center", fontFamily: MARK, fontSize: 78, color: "#FFF4E2", textShadow: shadow, opacity: cl(f / 8) }}>{head}</div>
      <AbsoluteFill style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 30 }}>
        {steps.map((s, i) => { const q = sp(f, s.f, 12); return (
          <React.Fragment key={i}>
            {i > 0 && <div style={{ fontFamily: MARK, fontSize: 120, color: "#FFD98A", textShadow: shadow, opacity: cl(q * 2) }}>→</div>}
            <div style={{ transform: `scale(${interpolate(q, [0, 1], [0.4, 1])}) rotate(${(i - 1) * 2}deg)`, opacity: cl(q * 2) }}>
              <Hoja style={{ width: 460, padding: "34px 30px", textAlign: "center" }}>
                <div style={{ fontFamily: MARK, fontSize: 70, color: C.red, lineHeight: 1 }}>{i + 1}</div>
                <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 50, color: C.ink, lineHeight: 1.08, marginTop: 6 }}>{s.txt}</div>
              </Hoja>
            </div>
          </React.Fragment>
        ); })}
      </AbsoluteFill>
      {foot && <div style={{ position: "absolute", bottom: 120, width: "100%", textAlign: "center", fontFamily: HAND, fontWeight: 700, fontSize: 66, color: "#FFE7C4", textShadow: shadow, opacity: cl((f - steps[steps.length - 1].f - 16) / 8) }}>{foot}</div>}
    </AbsoluteFill>
  );
};

// ---------- tres chapitas con los nombres de las razas
export const RazasS: React.FC<{ names: { txt: string; f: number }[]; bg?: string; dur: number }> = ({ names, bg, dur }) => {
  const f = useCurrentFrame(); const o = useOut(dur, 8);
  return (
    <AbsoluteFill style={{ opacity: o }}>
      {bg ? <Photo src={bg} seed={71} dur={dur} /> : null}
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.05) 30%, rgba(0,0,0,0.5) 100%)" }} />
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 70, display: "flex", justifyContent: "center", gap: 46, alignItems: "flex-end" }}>
        {names.map((n, i) => { const q = sp(f, n.f, 10); return (
          <div key={i} style={{ transformOrigin: "50% -180px", transform: `translateY(${(1 - q) * 500}px) rotate(${Math.sin((f + i * 20) / 11) * 3 * Math.exp(-Math.max(0, f - n.f) / 50) + (i - 1) * 2}deg)` }}>
            <Tag w={470} hilo={120}><div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 62, color: C.ink, textAlign: "center", lineHeight: 1.05 }}>{n.txt}</div></Tag>
          </div>
        ); })}
      </div>
    </AbsoluteFill>
  );
};

// ---------- cierre: lo que viene (sin link)
export const NextS: React.FC<{ title: string; src: string; dur: number }> = ({ title, src, dur }) => {
  const f = useCurrentFrame(); const p = sp(f, 4, 13);
  return (
    <AbsoluteFill>
      <Photo src={src} seed={99} dur={dur} />
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,0,0,0) 40%, rgba(0,0,0,0.55) 100%)" }} />
      <div style={{ position: "absolute", left: 120, bottom: 110, transform: `translateX(${(1 - p) * -900}px) rotate(-1.5deg)` }}>
        <Hoja style={{ padding: "26px 54px 34px", maxWidth: 1200 }}>
          <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 26, letterSpacing: 7, color: C.red }}>NEXT TIME AT THE COUNTER</div>
          <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 74, color: C.ink, lineHeight: 1.05, marginTop: 6 }}>{title}</div>
        </Hoja>
      </div>
      <Sello delay={30} size={1.25} style={{ right: 130, top: 110, background: "rgba(255,248,236,0.9)" }} />
    </AbsoluteFill>
  );
};

// ---------- las 13 costillas (stan12m): chuck 1-5 · rib 6-12 · el mismo músculo cruza la línea de la sierra. etapa 1 = contar; etapa 2 = la soga, la sierra y los precios
export const RibsS: React.FC<{ stage: number; m: number[]; bg?: string; dur: number }> = ({ stage, m, bg, dur }) => {
  const f = useCurrentFrame(); const o = useOut(dur, 8); const p = sp(f, 0, 16);
  const BW = 104, GAP = 10, X0 = 24, s2 = stage === 2;
  const x = (i: number) => X0 + i * (BW + GAP);
  const on = (k: number, d = 6) => cl((f - (m[k] ?? 9999)) / d);
  const chuck = s2 ? 1 : on(0), rib = s2 ? 1 : on(1), seven = s2 ? 0 : on(2);
  const grow = s2 ? interpolate(cl((f - m[0]) / 36), [0, 1], [0, 1], { easing: ease }) : 0;
  const ext = s2 ? interpolate(cl((f - m[1]) / 44), [0, 1], [0, 1], { easing: ease }) : 0;
  const saw = s2 ? interpolate(cl((f - m[2]) / 10), [0, 1], [0, 1], { easing: ease }) : 0;
  const ribL = x(5), ribR = x(12) + BW, left = ribL - ext * (ribL - x(1) - 20);
  const col = (i: number) => (i < 5 ? C.kraft2 : i < 12 ? C.red : "#8C8A84");
  const vis = (i: number) => (s2 ? 1 : cl((f - 10 - i * 3) / 6));
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Fondo src={bg} seed={1313} dur={dur} />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <Hoja style={{ width: 1640, padding: "50px 60px 46px", transform: `translateY(${(1 - p) * 760}px) rotate(-0.6deg)` }}>
          <div style={{ fontFamily: TYPE, fontSize: 40, letterSpacing: 5, color: C.red }}>{s2 ? "ONE MUSCLE · TWO PRICES" : "THE BUTCHER COUNTS FROM THE FRONT"}</div>
          <div style={{ fontFamily: MARK, fontSize: 84, color: C.ink, lineHeight: 1.05, marginTop: 4 }}>{s2 ? "It doesn’t stop at rib six" : "13 ribs on each side"}</div>
          <div style={{ position: "relative", height: 520, marginTop: 26 }}>
            <div style={{ position: "absolute", left: X0, top: 0, fontFamily: TYPE, fontSize: 30, color: C.ink, opacity: 0.75 }}>← FRONT · the shoulder</div>
            <div style={{ position: "absolute", right: 24, top: 0, fontFamily: TYPE, fontSize: 30, color: C.ink, opacity: 0.75 }}>the back →</div>
            {s2 && <div style={{ position: "absolute", left, top: 52, width: (ribR - left) * (ext > 0 ? 1 : grow), height: 62, borderRadius: 31, background: "linear-gradient(180deg,#C4433A 0%,#8E1F19 100%)", boxShadow: "0 6px 14px rgba(0,0,0,0.35)" }} />}
            {s2 && <div style={{ position: "absolute", left: x(7), top: 62, width: 560, fontFamily: HAND, fontWeight: 700, fontSize: 40, color: C.chalk, opacity: cl((f - m[0] - 26) / 8), whiteSpace: "nowrap" }}>the ribeye muscle</div>}
            {Array.from({ length: 13 }, (_, i) => (
              <div key={i} style={{ position: "absolute", left: x(i), top: 136, width: BW, height: 150, borderRadius: 10, background: col(i), opacity: vis(i) * (i < 5 ? 0.35 + 0.65 * chuck : i < 12 ? 0.35 + 0.65 * rib : 0.6), display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 5px 12px rgba(0,0,0,0.3)", transform: `translateY(${(1 - vis(i)) * 30}px)` }}>
                <span style={{ fontFamily: MARK, fontSize: 62, color: C.chalk }}>{i + 1}</span>
              </div>
            ))}
            <div style={{ position: "absolute", left: x(0), top: 300, width: x(4) + BW - x(0), borderTop: `6px solid ${C.ink}`, opacity: chuck }} />
            <div style={{ position: "absolute", left: x(0), top: 312, width: x(4) + BW - x(0), textAlign: "center", opacity: chuck }}>
              <div style={{ fontFamily: MARK, fontSize: 70, color: C.ink, lineHeight: 1 }}>CHUCK</div>
              <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 40, color: C.ink }}>ribs 1 to 5</div>
              {s2 && <div style={{ fontFamily: MARK, fontSize: 88, color: C.red, lineHeight: 1, marginTop: 6, opacity: on(4), transform: `scale(${interpolate(on(4), [0, 1], [1.5, 1])})` }}>about $8 a pound</div>}
            </div>
            <div style={{ position: "absolute", left: x(5), top: 300, width: x(11) + BW - x(5), borderTop: `6px solid ${C.red}`, opacity: rib }} />
            <div style={{ position: "absolute", left: x(5), top: 312, width: x(11) + BW - x(5), textAlign: "center", opacity: rib }}>
              <div style={{ fontFamily: MARK, fontSize: 70, color: C.red, lineHeight: 1 }}>RIB · the prime rib</div>
              <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 40, color: C.ink }}>ribs 6 to 12{seven > 0 ? <span style={{ opacity: seven }}> · seven bones</span> : null}</div>
              {s2 && <div style={{ fontFamily: MARK, fontSize: 88, color: C.ink, lineHeight: 1, marginTop: 6, opacity: on(3), transform: `scale(${interpolate(on(3), [0, 1], [1.5, 1])})` }}>$15 to $20 a pound</div>}
            </div>
            {s2 && <div style={{ position: "absolute", left: x(5) - GAP / 2 - 4, top: 30, width: 0, height: 270 * saw, borderLeft: `8px dashed ${C.ink}` }} />}
            {s2 && <div style={{ position: "absolute", left: x(5) - 110, top: -10, width: 220, textAlign: "center", fontFamily: TYPE, fontSize: 32, letterSpacing: 3, color: C.ink, background: C.papel, opacity: cl((f - m[2] - 6) / 6) }}>THE SAW</div>}
          </div>
          {s2 && <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 52, color: C.ink, textAlign: "center", marginTop: 4, opacity: on(5, 8) }}>Same muscle. Two inches away.</div>}
        </Hoja>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
