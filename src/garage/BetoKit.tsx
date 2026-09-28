// BetoKit.tsx — componentes PROPIOS de "Beto's Garage" (EN), encima del kit de Cole (GarageKit.tsx).
// Look: el mismo "bay" grafito de Cole, pero con el acento del TALLER DE MONTERREY: letras pintadas a
// mano (Alfa Slab One) en rojo ladrillo y azul sobre pared de cal, y el odómetro de tambor como firma.
// Todo componente recibe `totalF` (= duración real del cue); las imágenes llegan por staticFile().
// ⛔ Sin <Video>, sin sfx en runtime, sin textos por defecto de otro video.
import React from "react";
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { loadFont as loadSlab } from "@remotion/google-fonts/AlfaSlabOne";
import { G, BayBg, FloatPhoto, Lamp, type LampIcon, useIO, lerp, fmt, cl, MONO, BARLOW, INTER, ANTON } from "./GarageKit";

const { fontFamily: SLAB } = loadSlab();

const B = {
  cal: "#EFE6D2",        // pared de cal
  ladrillo: "#B8322A",   // rojo de letrero pintado
  azul: "#1F4E8C",       // azul de letrero pintado
  verde: "#2E8B57",
  sombra: "rgba(0,0,0,0.72)",
};

// ───────────────────────── BRule — "RULE #N", letrero pintado a mano ─────────────────────────

export const BRule: React.FC<{ totalF: number; index: number; title: string; sub?: string; image: string; icon?: LampIcon }> = ({ totalF, index, title, sub, image, icon = "wrench" }) => {
  const { f, a } = useIO(totalF, 10, 10);
  const { fps } = useVideoConfig();
  const board = spring({ frame: f - 2, fps, config: { damping: 13, stiffness: 140 } });
  const slam = spring({ frame: f - 8, fps, config: { damping: 10, stiffness: 180 } });
  // la pintura del título "se pinta" de izquierda a derecha, como un letrero hecho a pincel
  const paint = lerp(f, 16, 38, 0, 100);
  const swing = Math.sin(f / 22) * 0.6 * (1 - lerp(f, 0, 90, 0, 0.7));
  return (
    <AbsoluteFill style={{ opacity: a }}>
      <BayBg image={image} totalF={totalF} tint={B.ladrillo} />
      <FloatPhoto src={image} w={760} h={500} x={1060} y={300} delay={12} tilt={-6} tag={`RULE ${index} OF 7`} tagColor={B.ladrillo} />
      {/* letrero de chapa pintado, colgado con dos alambres */}
      <div style={{ position: "absolute", left: 110, top: 150, width: 860, transformOrigin: "50% -60px", transform: `translateY(${((1 - board) * -520).toFixed(0)}px) rotate(${(swing + (1 - board) * -8).toFixed(2)}deg)` }}>
        <svg width={860} height={70} style={{ position: "absolute", top: -70, left: 0 }}>
          <path d="M140 70 L430 4 L720 70" stroke="#9a9a9a" strokeWidth={4} fill="none" />
        </svg>
        <div style={{ background: B.cal, padding: "40px 50px 46px", borderRadius: 8, boxShadow: `0 50px 110px ${B.sombra}, inset 0 0 60px rgba(120,90,40,0.28)`, border: "6px solid #2b2b2b", position: "relative", overflow: "hidden" }}>
          {/* óxido / manchas de la chapa */}
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 88% 18%, rgba(140,70,20,0.22), transparent 22%), radial-gradient(circle at 6% 92%, rgba(90,60,20,0.25), transparent 26%)" }} />
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <Lamp icon={icon} size={58} color={B.azul} />
            <div style={{ fontFamily: SLAB, fontSize: 44, color: B.azul, letterSpacing: 3 }}>DAD'S SHOP RULES</div>
          </div>
          <div style={{ fontFamily: SLAB, fontSize: 250, lineHeight: 0.95, color: B.ladrillo, transform: `scale(${(2.2 - 1.2 * slam).toFixed(3)})`, transformOrigin: "left center", textShadow: "4px 4px 0 rgba(0,0,0,0.18)", marginTop: 6 }}>
            #{index}
          </div>
          <div style={{ fontFamily: SLAB, fontSize: title.length > 26 ? 60 : 72, lineHeight: 1.04, color: "#1d1d1d", marginTop: 8, clipPath: `inset(0 ${(100 - paint).toFixed(1)}% 0 0)` }}>
            {title}
          </div>
          {sub ? <div style={{ fontFamily: INTER, fontWeight: 600, fontSize: 32, color: "#4a4136", marginTop: 16, opacity: lerp(f, 34, 48, 0, 1) }}>{sub}</div> : null}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ───────────────────────── BOdometer — el tablero que cuenta ─────────────────────────

const DrumLive: React.FC<{ value: number; place: number; size: number }> = ({ value, place, size }) => {
  // tambor continuo: la cifra de `place` (1, 10, 100…) rueda suave como en un odómetro mecánico
  const h = size * 1.12;
  const v = value / place;
  const digit = Math.floor(v) % 10;
  const frac = place === 1 ? v - Math.floor(v) : Math.max(0, (v - Math.floor(v) - 0.9) * 10); // sólo gira al pasar
  const pos = digit + frac;
  return (
    <div style={{ width: size * 0.64, height: h, overflow: "hidden", position: "relative", background: place === 1 ? "linear-gradient(#e9e4d6,#fffaf0 50%,#e9e4d6)" : "linear-gradient(#050506,#1c1e22 50%,#050506)", borderRadius: 6, margin: "0 3px", boxShadow: "inset 0 12px 20px rgba(0,0,0,0.85), inset 0 -12px 20px rgba(0,0,0,0.85)" }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: -pos * h, fontFamily: MONO, fontWeight: 700, fontSize: size, lineHeight: `${h}px`, color: place === 1 ? G.ink : G.white, textAlign: "center" }}>
        {Array.from({ length: 11 }).map((_, k) => <div key={k} style={{ height: h }}>{k % 10}</div>)}
      </div>
    </div>
  );
};

export const BOdometer: React.FC<{ totalF: number; to: number; from?: number; unit?: string; label?: string; sub?: string; image: string }> = ({ totalF, to, from = 0, unit = "KM", label, sub, image }) => {
  const { f, a } = useIO(totalF);
  const { fps } = useVideoConfig();
  const pop = spring({ frame: f - 2, fps, config: { damping: 16, stiffness: 110 } });
  const t1 = Math.max(40, Math.min(totalF - 30, 110));
  const val = interpolate(f, [8, t1], [from, to], { ...cl, easing: Easing.bezier(0.3, 0, 0.2, 1) });
  const digits = Math.max(6, String(Math.round(to)).length);
  const places = Array.from({ length: digits }).map((_, i) => 10 ** (digits - 1 - i));
  const needle = interpolate(f, [8, t1], [-120, 40], { ...cl, easing: Easing.out(Easing.cubic) }) + Math.sin(f / 3) * (f < t1 ? 2 : 0.4);
  return (
    <AbsoluteFill style={{ opacity: a }}>
      <BayBg image={image} totalF={totalF} tint={G.amber} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
        {label ? <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 30, letterSpacing: 8, color: G.amber, marginBottom: 26, opacity: lerp(f, 0, 12, 0, 1) }}>{label.toUpperCase()}</div> : null}
        {/* cluster: velocímetro en arco + ventanita del odómetro */}
        <div style={{ position: "relative", width: 1100, height: 560, borderRadius: "560px 560px 60px 60px", background: "radial-gradient(ellipse at 50% 70%, #1b1d22 0%, #0b0c0e 70%)", border: "3px solid rgba(255,255,255,0.12)", boxShadow: `0 0 90px ${G.amber}1f, 0 50px 110px rgba(0,0,0,0.8)`, transform: `scale(${(0.85 + 0.15 * pop).toFixed(3)})`, opacity: pop }}>
          <svg width={1100} height={560} style={{ position: "absolute", inset: 0 }}>
            {Array.from({ length: 13 }).map((_, i) => {
              const ang = (-120 + i * 20) * Math.PI / 180;
              const r1 = 440, r2 = i % 2 ? 410 : 390;
              return <line key={i} x1={550 + r1 * Math.sin(ang)} y1={520 - r1 * Math.cos(ang)} x2={550 + r2 * Math.sin(ang)} y2={520 - r2 * Math.cos(ang)} stroke={i > 9 ? G.red : G.white} strokeWidth={i % 2 ? 4 : 8} strokeLinecap="round" />;
            })}
          </svg>
          <div style={{ position: "absolute", left: 550 - 6, top: 520 - 400, width: 12, height: 400, background: `linear-gradient(${G.red}, #7a1510)`, borderRadius: 6, transformOrigin: "50% 100%", transform: `rotate(${needle.toFixed(2)}deg)`, boxShadow: `0 0 18px ${G.red}88` }} />
          <div style={{ position: "absolute", left: 550 - 36, top: 520 - 36, width: 72, height: 72, borderRadius: "50%", background: "#26282d", border: "4px solid #444" }} />
          <div style={{ position: "absolute", left: "50%", top: 250, transform: "translateX(-50%)", display: "flex", alignItems: "center", padding: "14px 16px", background: "#000", borderRadius: 10, border: "2px solid #333" }}>
            {places.map((p) => <DrumLive key={p} value={val} place={p} size={96} />)}
            <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 44, color: G.dim, marginLeft: 16 }}>{unit}</div>
          </div>
        </div>
        {sub ? <div style={{ marginTop: 34, fontFamily: BARLOW, fontWeight: 800, fontSize: 64, color: G.white, textTransform: "uppercase", textAlign: "center", maxWidth: 1500, opacity: lerp(f, t1 - 6, t1 + 10, 0, 1) }}>{sub}</div> : null}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ───────────────────────── BVersus — 100K contra 500K ─────────────────────────

export const BVersus: React.FC<{ totalF: number; leftLabel: string; leftValue: number; rightLabel: string; rightValue: number; unit?: string; title?: string; image: string; leftSub?: string; rightSub?: string }> = ({ totalF, leftLabel, leftValue, rightLabel, rightValue, unit = "MILES", title, image, leftSub, rightSub }) => {
  const { f, a } = useIO(totalF);
  const max = Math.max(leftValue, rightValue);
  const W = 1300;
  const pL = lerp(f, 12, 40, 0, 1), pR = lerp(f, 30, 90, 0, 1);
  const row = (label: string, value: number, p: number, color: string, sub: string | undefined, y: number, d: number) => {
    const w = (value / max) * W * p;
    return (
      <div style={{ position: "absolute", left: 300, top: y, width: W + 20, opacity: lerp(f, d, d + 10, 0, 1) }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 20, marginBottom: 14 }}>
          <div style={{ fontFamily: BARLOW, fontWeight: 800, fontSize: 54, color: G.white, textTransform: "uppercase" }}>{label}</div>
          {sub ? <div style={{ fontFamily: INTER, fontWeight: 500, fontSize: 28, color: G.dim }}>{sub}</div> : null}
        </div>
        <div style={{ position: "relative", height: 96, background: "rgba(255,255,255,0.06)", borderRadius: 8, overflow: "hidden", border: "1px solid rgba(255,255,255,0.12)" }}>
          <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: w, background: `linear-gradient(90deg, ${color}aa, ${color})`, boxShadow: `0 0 40px ${color}66` }} />
          {/* marcas cada 100K como una regla de carretera */}
          {Array.from({ length: Math.floor(max / 100000) }).map((_, i) => (
            <div key={i} style={{ position: "absolute", left: ((i + 1) * 100000 / max) * W - 2, top: 0, bottom: 0, width: 3, background: "rgba(0,0,0,0.45)" }} />
          ))}
          <div style={{ position: "absolute", left: Math.max(16, w - 330), top: 12, fontFamily: MONO, fontWeight: 700, fontSize: 64, color: G.ink }}>{fmt(Math.round(value * p))}</div>
        </div>
      </div>
    );
  };
  return (
    <AbsoluteFill style={{ opacity: a }}>
      <BayBg image={image} totalF={totalF} tint={G.green} />
      {title ? <div style={{ position: "absolute", left: 300, top: 150, fontFamily: MONO, fontWeight: 700, fontSize: 32, letterSpacing: 8, color: G.amber }}>{title.toUpperCase()}</div> : null}
      {row(leftLabel, leftValue, pL, G.red, leftSub, 250, 4)}
      {row(rightLabel, rightValue, pR, G.green, rightSub, 560, 22)}
      <div style={{ position: "absolute", left: 300, top: 860, fontFamily: MONO, fontWeight: 700, fontSize: 30, color: G.dim, letterSpacing: 4 }}>{unit}</div>
      <div style={{ position: "absolute", right: 170, top: 820, fontFamily: ANTON, fontSize: 120, color: G.green, opacity: lerp(f, 88, 100, 0, 1), transform: `scale(${lerp(f, 88, 100, 1.4, 1).toFixed(3)})` }}>{`×${Math.round(rightValue / Math.max(1, leftValue))}`}</div>
    </AbsoluteFill>
  );
};

// ───────────────────────── BMap — Monterrey → Texas ─────────────────────────

export const BMap: React.FC<{ totalF: number; from: string; to: string; fromSub?: string; toSub?: string; distance?: string; image: string }> = ({ totalF, from, to, fromSub, toSub, distance, image }) => {
  const { f, a } = useIO(totalF);
  const draw = lerp(f, 16, 70, 0, 1);
  // mapa estilizado (no es cartografía exacta): Monterrey abajo, el río Bravo en el medio, Texas arriba
  const P0 = { x: 760, y: 820 }, P1 = { x: 1180, y: 260 };
  const path = `M${P0.x} ${P0.y} C ${P0.x + 30} ${P0.y - 170}, ${P0.x + 160} ${P0.y - 260}, 960 520 S ${P1.x - 60} ${P1.y + 120}, ${P1.x} ${P1.y}`;
  const pin = (x: number, y: number, name: string, sub: string | undefined, d: number, color: string, right: boolean) => {
    const s = lerp(f, d, d + 12, 0, 1);
    return (
      <div style={{ position: "absolute", left: x, top: y, opacity: s }}>
        <div style={{ position: "absolute", left: -22, top: -22, width: 44, height: 44, borderRadius: "50%", background: color, boxShadow: `0 0 0 ${(10 + 8 * Math.sin(f / 6)).toFixed(1)}px ${color}33` }} />
        <div style={{ position: "absolute", [right ? "left" : "right"]: 44, top: -46, whiteSpace: "nowrap", textAlign: right ? "left" : "right" } as React.CSSProperties}>
          <div style={{ fontFamily: SLAB, fontSize: 64, color: G.white, textShadow: "0 6px 20px rgba(0,0,0,0.8)" }}>{name}</div>
          {sub ? <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 26, color: G.dim, letterSpacing: 3 }}>{sub.toUpperCase()}</div> : null}
        </div>
      </div>
    );
  };
  return (
    <AbsoluteFill style={{ opacity: a }}>
      <BayBg image={image} totalF={totalF} tint={B.azul} />
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <linearGradient id="rio" x1="0" x2="1"><stop offset="0" stopColor="#5BC8F5" stopOpacity="0.2" /><stop offset="0.5" stopColor="#5BC8F5" stopOpacity="0.8" /><stop offset="1" stopColor="#5BC8F5" stopOpacity="0.2" /></linearGradient>
        </defs>
        {/* río Bravo / Rio Grande: la frontera */}
        <path d="M380 700 C 620 640, 760 600, 900 560 S 1240 470, 1560 330" stroke="url(#rio)" strokeWidth={10} fill="none" strokeDasharray="2400" strokeDashoffset={2400 * (1 - lerp(f, 0, 30, 0, 1))} />
        <text x={430} y={745} fill="#5BC8F5" fillOpacity={0.8} fontFamily={MONO} fontSize={26} letterSpacing={4}>RIO GRANDE</text>
        <text x={560} y={930} fill="#fff" fillOpacity={0.35} fontFamily={MONO} fontSize={34} letterSpacing={10}>MEXICO</text>
        <text x={1320} y={200} fill="#fff" fillOpacity={0.35} fontFamily={MONO} fontSize={34} letterSpacing={10}>TEXAS</text>
        <path d={path} stroke={G.amber} strokeWidth={9} fill="none" strokeLinecap="round" strokeDasharray="1400" strokeDashoffset={1400 * (1 - draw)} style={{ filter: `drop-shadow(0 0 12px ${G.amber})` }} />
      </svg>
      {pin(P0.x, P0.y, from, fromSub, 6, B.ladrillo, false)}
      {pin(P1.x, P1.y, to, toSub, 62, B.azul, true)}
      {distance ? <div style={{ position: "absolute", left: 1010, top: 560, fontFamily: MONO, fontWeight: 700, fontSize: 36, color: G.amber, opacity: lerp(f, 50, 64, 0, 1) }}>{distance}</div> : null}
    </AbsoluteFill>
  );
};

// ───────────────────────── BCost — etiqueta de costo (OVERLAY) ─────────────────────────

export const BCost: React.FC<{ totalF: number; item: string; left: string; leftLabel?: string; right: string; rightLabel?: string; side?: "left" | "right" }> = ({ totalF, item, left, leftLabel = "DO IT YOURSELF", right, rightLabel = "AT THE SHOP", side = "right" }) => {
  const { f, a } = useIO(totalF, 12, 10);
  const { fps } = useVideoConfig();
  const s = spring({ frame: f, fps, config: { damping: 15, stiffness: 120 } });
  const s2 = spring({ frame: f - 12, fps, config: { damping: 14, stiffness: 140 } });
  const x = side === "right" ? { right: 80 } : { left: 80 };
  const tag = (label: string, val: string, color: string, p: number, rot: number) => (
    <div style={{ display: "flex", alignItems: "stretch", marginTop: 14, transform: `translateX(${((1 - p) * (side === "right" ? 500 : -500)).toFixed(0)}px) rotate(${rot}deg)`, opacity: p, filter: "drop-shadow(0 18px 30px rgba(0,0,0,0.6))" }}>
      <div style={{ background: color, color: "#fff", fontFamily: MONO, fontWeight: 700, fontSize: 24, letterSpacing: 3, padding: "14px 18px", display: "flex", alignItems: "center" }}>{label}</div>
      <div style={{ background: B.cal, color: G.ink, fontFamily: SLAB, fontSize: 58, padding: "4px 26px", display: "flex", alignItems: "center" }}>{val}</div>
    </div>
  );
  return (
    <AbsoluteFill style={{ opacity: a }}>
      <div style={{ position: "absolute", top: 110, ...x, display: "flex", flexDirection: "column", alignItems: side === "right" ? "flex-end" : "flex-start" }}>
        <div style={{ fontFamily: BARLOW, fontWeight: 800, fontSize: 46, color: G.white, textTransform: "uppercase", textShadow: "0 4px 18px rgba(0,0,0,0.9)", opacity: s }}>{item}</div>
        {tag(leftLabel, left, B.verde, s, -1.2)}
        {tag(rightLabel, right, B.ladrillo, s2, 1)}
      </div>
    </AbsoluteFill>
  );
};

// ───────────────────────── BPayMath — la reparación en cuotas ─────────────────────────

export const BPayMath: React.FC<{ totalF: number; repair: number; payment: number; image: string; note?: string }> = ({ totalF, repair, payment, image, note }) => {
  const { f, a } = useIO(totalF);
  const { fps } = useVideoConfig();
  const n = repair / payment;
  const full = Math.floor(n), part = n - full;
  const slots = Math.ceil(n);
  const card = spring({ frame: f - 2, fps, config: { damping: 16, stiffness: 110 } });
  return (
    <AbsoluteFill style={{ opacity: a }}>
      <BayBg image={image} totalF={totalF} tint={G.green} />
      <div style={{ position: "absolute", left: 140, top: 170, transform: `translateY(${((1 - card) * 300).toFixed(0)}px)`, opacity: card }}>
        <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 28, letterSpacing: 6, color: G.dim }}>REPAIR ESTIMATE</div>
        <div style={{ fontFamily: SLAB, fontSize: 170, color: G.white, lineHeight: 1 }}>${fmt(repair)}</div>
        <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 28, letterSpacing: 6, color: G.dim, marginTop: 40 }}>AVERAGE NEW CAR PAYMENT</div>
        <div style={{ fontFamily: SLAB, fontSize: 110, color: B.ladrillo, lineHeight: 1 }}>${fmt(payment)}<span style={{ fontSize: 50, color: G.dim }}> / MO</span></div>
      </div>
      {/* los cupones de pago que "llenan" la reparación */}
      <div style={{ position: "absolute", right: 140, top: 200, display: "flex", flexDirection: "column", gap: 22, alignItems: "flex-end" }}>
        {Array.from({ length: slots }).map((_, i) => {
          const p = lerp(f, 30 + i * 12, 44 + i * 12, 0, 1);
          const w = i < full ? 1 : part;
          return (
            <div key={i} style={{ width: 620, height: 120, border: "3px dashed rgba(255,255,255,0.35)", borderRadius: 10, position: "relative", overflow: "hidden", opacity: lerp(f, 24 + i * 10, 32 + i * 10, 0, 1) }}>
              <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${(w * p * 100).toFixed(1)}%`, background: G.green, boxShadow: `0 0 30px ${G.green}66` }} />
              <div style={{ position: "absolute", left: 26, top: 30, fontFamily: MONO, fontWeight: 700, fontSize: 48, color: G.ink }}>PAYMENT {i + 1}</div>
            </div>
          );
        })}
        <div style={{ fontFamily: ANTON, fontSize: 120, color: G.green, opacity: lerp(f, 40 + slots * 12, 52 + slots * 12, 0, 1) }}>= {n.toFixed(1)} PAYMENTS</div>
      </div>
      {note ? <div style={{ position: "absolute", left: 140, bottom: 90, fontFamily: INTER, fontWeight: 500, fontSize: 30, color: G.dim, opacity: lerp(f, 60, 74, 0, 1) }}>{note}</div> : null}
    </AbsoluteFill>
  );
};
