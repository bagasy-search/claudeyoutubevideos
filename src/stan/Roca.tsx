// Kit "Roca" del Constructor Libre (cl19f, piedras falsas con bolsas de basura y cemento): balancín de pesos, pila de kilos sobre la roca,
// cáscara de huevo vs cáscara de tela, cita en un bastidor de teatro bajo un cañón de luz, perfil de la base (torta vs enterrada, cuerda),
// corte de capas, tejas que suben con lluvia, testigo negro, grieta que se dibuja, polvos que caen, gota sobre tela, trama con granitos,
// chorro de pasta, bolsas pelota vs almohada, equipo de seguridad, cotas, balanza de baño. PURO CSS y DOM: sin SVG, sin blur grande,
// sin backdrop-filter. Lecciones del EVALUADOR (fb14): legible desde el primer cuadro, placas opacas, letra secundaria ≥ 46 px,
// una idea por pantalla, siempre algo en movimiento, nada cortado contra el borde, sin rótulos arriba a la izquierda.
import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, Easing } from "remotion";
import { Photo, FONTS, CL } from "./Kit";

const { SERIF, SANS, HAND } = FONTS as any;
const R = { gris: "#9C9893", grisD: "#6B6762", grisL: "#C9C5BE", ocre: "#E0A82E", ocreL: "#F2C94C", ink: "#1E1C1A", ok: "#3E9A55", no: "#D23F2E", crema: "#F3F1EC", tierra: "#5A4330", noche: "rgba(16,15,14,0.9)" };
const cl = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const sp = (f: number, d = 0, damping = 15) => spring({ frame: f - d, fps: 30, config: { damping, mass: 0.6 } });
const out = (f: number, dur: number, len = 8) => interpolate(f, [dur - len, dur], [1, 0], CL);
const tsh = "0 3px 14px rgba(0,0,0,0.8), 0 1px 2px rgba(0,0,0,0.9)";
// piedra hecha con gradientes: granito gris con motas
const STONE = "radial-gradient(circle at 30% 25%, rgba(255,255,255,0.35), transparent 40%), radial-gradient(circle at 70% 80%, rgba(0,0,0,0.35), transparent 50%), repeating-radial-gradient(circle at 40% 40%, #A8A49E 0 3px, #8F8B85 3px 5px, #B5B1AA 5px 9px), linear-gradient(160deg,#B9B5AE,#77736D)";
const BLOB = "58% 42% 46% 54% / 62% 58% 42% 38%";
const Fondo: React.FC<{ bg?: string; dur: number; side?: "left" | "right" | "all"; k?: number }> = ({ bg, dur, side = "left", k = 0.8 }) => {
  const g = side === "all" ? `rgba(16,15,14,${k * 0.62})` : `linear-gradient(${side === "left" ? 90 : 270}deg, rgba(16,15,14,${k}) 0%, rgba(16,15,14,${k * 0.6}) 45%, transparent 78%)`;
  return <AbsoluteFill>{bg ? <Photo src={bg} seed={5} dur={dur} /> : <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 30%, #3B3833, #161513 75%)" }} />}<AbsoluteFill style={{ background: g }} /></AbsoluteFill>;
};
const Taller: React.FC = () => <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 20%, #3E3A35 0%, #1B1917 70%)" }}><div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 210, background: "linear-gradient(180deg,#4B3A2A,#2B2119)" }} /></AbsoluteFill>;
const Kick: React.FC<{ txt: string; color?: string; style?: React.CSSProperties }> = ({ txt, color = R.ocreL, style }) => <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 48, letterSpacing: 3, color, textShadow: tsh, ...style }}>{txt}</div>;
const Titulo: React.FC<{ txt: string; size?: number; color?: string; f0?: number; style?: React.CSSProperties }> = ({ txt, size = 88, color = "#FFFBF2", f0 = 0, style }) => {
  const f = useCurrentFrame(); const p = sp(f, f0, 16);
  return <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: size, lineHeight: 1.06, color, textShadow: tsh, opacity: cl(p * 1.6), transform: `translateY(${(1 - p) * 18}px)`, ...style }}>{txt}</div>;
};
const Chip: React.FC<{ txt: string; c?: string; on?: number; style?: React.CSSProperties }> = ({ txt, c = R.ocre, on = 1, style }) => <div style={{ display: "inline-block", background: R.noche, borderLeft: `10px solid ${c}`, padding: "12px 26px", fontFamily: SANS, fontWeight: 600, fontSize: 50, color: "#FFF6E6", opacity: cl(on), transform: `translateY(${(1 - cl(on)) * 16}px)`, boxShadow: "0 16px 30px rgba(0,0,0,0.5)", ...style }}>{txt}</div>;
const Rock: React.FC<{ w: number; h: number; style?: React.CSSProperties; shape?: string }> = ({ w, h, style, shape = BLOB }) => <div style={{ width: w, height: h, borderRadius: shape, background: STONE, boxShadow: "inset -18px -22px 40px rgba(0,0,0,0.45), inset 14px 12px 30px rgba(255,255,255,0.18), 0 26px 40px rgba(0,0,0,0.5)", ...style }} />;

// ---------- balancín: la piedra falsa (35 kg) contra una real del mismo tamaño (300+ kg); la viga se vence hacia la real
export const RBalanzaN: React.FC<{ a: { t: string; v: string }; b: { t: string; v: string }; title: string; dur: number }> = ({ a, b, title, dur }) => {
  const f = useCurrentFrame(); const p = sp(f, 8, 7); const tilt = interpolate(p, [0, 1], [0, 13]);
  const Side = ({ x, big, s }: { x: number; big: boolean; s: { t: string; v: string } }) => (
    <div style={{ position: "absolute", left: x, bottom: 34, width: 520, display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: big ? 104 : 92, color: big ? "#FFD6C8" : R.ocreL, textShadow: tsh }}>{s.v}</div>
      <Rock w={big ? 330 : 300} h={big ? 230 : 205} style={{ filter: big ? "brightness(0.85)" : "none" }} />
      <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 50, color: "#EFEAE2", marginTop: 10, textShadow: tsh }}>{s.t}</div>
    </div>
  );
  return (
    <AbsoluteFill style={{ opacity: out(f, dur) }}>
      <Taller />
      <Titulo txt={title} size={86} style={{ position: "absolute", top: 70, width: "100%", textAlign: "center" }} />
      <div style={{ position: "absolute", left: 300, top: 360, width: 1320, height: 560, transformOrigin: "50% 92%", transform: `rotate(${tilt}deg)` }}>
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 34, borderRadius: 10, background: "linear-gradient(180deg,#8A6A45,#5C4429)", boxShadow: "0 10px 20px rgba(0,0,0,0.5)" }} />
        <Side x={20} big={false} s={a} /><Side x={780} big s={b} />
      </div>
      <div style={{ position: "absolute", left: 900, top: 900, width: 0, height: 0, borderLeft: "60px solid transparent", borderRight: "60px solid transparent", borderBottom: "120px solid #6E5236" }} />
    </AbsoluteFill>
  );
};

// ---------- pila de kilos: bloques que caen sobre la piedra, el contador suma y la piedra no se mueve
export const RPilaN: React.FC<{ rows: { t: string; kg: number; f: number }[]; total: string; sub: string; dur: number }> = ({ rows, total, sub, dur }) => {
  const f = useCurrentFrame(); let acc = 0; let y = 0;
  const blocks = rows.map((r, i) => { const p = sp(f, r.f, 11); const h = 70 + r.kg * 1.6; const el = <div key={i} style={{ position: "absolute", left: 360 - (i ? 250 : 210), bottom: 560 + y, width: i ? 500 : 420, height: h, padding: "0 20px", textAlign: "center", lineHeight: 1.05, borderRadius: 14, background: i ? "linear-gradient(170deg,#E7DCC2,#BFAE8A)" : "linear-gradient(170deg,#7E8FA3,#4E5D70)", transform: `translateY(${(1 - p) * -700}px)`, opacity: cl(p * 3), display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SANS, fontWeight: 700, fontSize: i ? 46 : 58, color: i ? R.ink : "#F4F6F8", boxShadow: "0 16px 26px rgba(0,0,0,0.5)" }}>{r.t} · {r.kg} kg</div>; y += h + 6; if (f >= r.f + 6) acc += r.kg; return el; });
  const land = rows.reduce((m, r) => Math.max(m, cl((f - r.f - 6) / 4)), 0);
  const shake = rows.some((r) => f > r.f + 6 && f < r.f + 12) ? Math.sin(f * 3) * 2 : 0;
  return (
    <AbsoluteFill style={{ opacity: out(f, dur) }}>
      <Taller />
      <div style={{ position: "absolute", left: 120, top: 0, width: 760, height: 1080 }}>
        {blocks}
        <Rock w={600} h={360} style={{ position: "absolute", left: 80, bottom: 200, transform: `translateY(${shake}px)` }} />
      </div>
      <div style={{ position: "absolute", left: 1040, top: 260, width: 800 }}>
        <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 230, lineHeight: 1, color: R.ocreL, textShadow: tsh }}>{acc}<span style={{ fontSize: 110 }}> kg</span></div>
        {total.replace(/\D/g, "") === String(rows.reduce((m, r) => m + r.kg, 0)) ? null : <Titulo txt={total} size={86} f0={rows[rows.length - 1].f + 8} style={{ marginTop: 18 }} />}
        <Chip txt={sub} c={R.ok} on={land > 0.5 && f > rows[rows.length - 1].f + 20 ? 1 : 0} style={{ marginTop: 26 }} />
      </div>
    </AbsoluteFill>
  );
};

// ---------- cáscara: un huevo y el corte de la piedra; la fuerza baja por la curva (flechas que recorren el borde)
export const RHuevoN: React.FC<{ title: string; sub: string; a: string; b: string; dur: number }> = ({ title, sub, a, b, dur }) => {
  const f = useCurrentFrame(); const p = sp(f, 0, 13); const run = (f % 60) / 60;
  const arrows = [0, 1, 2, 3, 4].map((i) => { const t = (run + i / 5) % 1; const ang = interpolate(t, [0, 1], [-80, 80]); return <div key={i} style={{ position: "absolute", left: 230, top: 260, width: 0, height: 0, transformOrigin: "0 0", transform: `rotate(${ang}deg) translateY(-238px)`, opacity: Math.sin(t * Math.PI) }}><div style={{ marginLeft: -14, width: 0, height: 0, borderLeft: "14px solid transparent", borderRight: "14px solid transparent", borderTop: `24px solid ${R.ocreL}`, transform: `rotate(${ang > 0 ? 90 : -90}deg)` }} /></div>; });
  return (
    <AbsoluteFill style={{ opacity: out(f, dur) }}>
      <Taller />
      <div style={{ position: "absolute", left: 200, top: 260, width: 460, height: 560, transform: `scale(${0.85 + 0.15 * p})` }}>
        <div style={{ position: "absolute", inset: 0, borderRadius: "50% 50% 48% 48% / 60% 60% 40% 40%", background: "radial-gradient(circle at 35% 30%, #FFFDF6, #EDE1C8 70%)", boxShadow: "0 30px 50px rgba(0,0,0,0.5)" }} />
        <div style={{ position: "absolute", left: 0, top: 0, width: 460, height: 560 }}>{arrows}</div>
        <div style={{ position: "absolute", left: 0, right: 0, bottom: -90, textAlign: "center", fontFamily: SANS, fontWeight: 600, fontSize: 52, color: "#EFEAE2", textShadow: tsh }}>{a}</div>
      </div>
      <div style={{ position: "absolute", left: 760, top: 300, width: 560, height: 420, transform: `translateX(${(1 - sp(f, 10, 14)) * 120}px)`, opacity: cl(sp(f, 10) * 2) }}>
        <div style={{ position: "absolute", inset: 0, borderRadius: "50% 50% 8% 8% / 80% 80% 8% 8%", background: STONE, boxShadow: "0 30px 50px rgba(0,0,0,0.5)" }} />
        <div style={{ position: "absolute", left: 34, right: 34, top: 34, bottom: 0, borderRadius: "50% 50% 4% 4% / 80% 80% 4% 4%", background: "radial-gradient(ellipse at 50% 70%, #262321, #121110)" }} />
        {[0, 1, 2].map((i) => <div key={i} style={{ position: "absolute", left: 10 + i * 8, right: 10 + i * 8, top: 10 + i * 8, bottom: 0, borderRadius: "50% 50% 6% 6% / 80% 80% 6% 6%", border: `3px dashed rgba(235,215,170,${0.55 - i * 0.12})`, borderBottom: "none" }} />)}
        <div style={{ position: "absolute", left: 0, right: 0, bottom: -90, textAlign: "center", fontFamily: SANS, fontWeight: 600, fontSize: 52, color: "#EFEAE2", textShadow: tsh }}>{b}</div>
      </div>
      <div style={{ position: "absolute", left: 1380, top: 300, width: 480 }}>
        <Titulo txt={title} size={78} f0={14} />
        <Chip txt={sub} on={sp(f, 26)} style={{ marginTop: 26 }} />
      </div>
    </AbsoluteFill>
  );
};

// ---------- la frase de don Aníbal: bastidor de teatro con cañón de luz; la cita aparece palabra por palabra, a mano
export const RCitaN: React.FC<{ txt: string; who: string; dur: number }> = ({ txt, who, dur }) => {
  const f = useCurrentFrame(); const w = txt.split(" "); const on = Math.floor(interpolate(f, [10, Math.min(dur - 40, 10 + w.length * 7)], [0, w.length], CL));
  const flick = 0.92 + Math.sin(f * 0.7) * 0.02 + Math.sin(f * 2.3) * 0.015;
  return (
    <AbsoluteFill style={{ opacity: out(f, dur), background: "#0D0C0B" }}>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 46% 60% at 50% 50%, rgba(255,226,170,${0.42 * flick}), rgba(255,226,170,0.06) 60%, transparent 75%)` }} />
      <div style={{ position: "absolute", left: 260, top: 150, width: 1400, height: 760, background: "linear-gradient(170deg,#D9CBAE,#BBA982)", border: "26px solid #6B4E2E", boxShadow: "0 40px 80px rgba(0,0,0,0.7)", transform: `rotate(-1.2deg)`, filter: `brightness(${flick})` }}>
        <div style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(90deg, rgba(0,0,0,0.04) 0 2px, transparent 2px 7px), repeating-linear-gradient(0deg, rgba(0,0,0,0.04) 0 2px, transparent 2px 7px)" }} />
        <div style={{ position: "absolute", left: 90, top: 110, right: 90, fontFamily: HAND, fontSize: 104, lineHeight: 1.22, color: "#2A2016" }}>
          {w.map((x, i) => <span key={i} style={{ opacity: i < on ? 1 : 0 }}>{x} </span>)}
        </div>
        <div style={{ position: "absolute", right: 90, bottom: 70, fontFamily: SANS, fontWeight: 600, fontSize: 52, color: "#5A4330", opacity: cl((f - 10 - w.length * 7) / 12) }}>— {who}</div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- tres reglas de las piedras de verdad: tres paneles con su silueta; cada uno se enciende cuando se nombra
export const RReglasN: React.FC<{ items: { t: string; f: number }[]; dur: number }> = ({ items, dur }) => {
  const f = useCurrentFrame();
  const shapes = [
    <div style={{ position: "absolute", left: 90, bottom: 120, width: 360, height: 220, clipPath: "polygon(8% 100%, 92% 100%, 78% 30%, 58% 0, 30% 8%, 18% 40%)", background: STONE }} />,
    <div style={{ position: "absolute", left: 100, bottom: 120, width: 340, height: 240, clipPath: "polygon(4% 100%, 96% 100%, 88% 52%, 70% 12%, 44% 0, 20% 18%, 10% 58%)", background: STONE }} />,
    <><div style={{ position: "absolute", left: 90, bottom: 110, width: 360, height: 240, borderRadius: BLOB, background: STONE }} /><div style={{ position: "absolute", left: 30, right: 30, bottom: 60, height: 100, background: "linear-gradient(180deg,#6A4E35,#3F2E1F)", borderRadius: "40% 40% 0 0 / 30% 30% 0 0" }} /></>,
  ];
  return (
    <AbsoluteFill style={{ opacity: out(f, dur) }}>
      <Taller />
      {items.map((it, i) => { const p = sp(f, it.f, 12); const lit = f >= it.f; return (
        <div key={i} style={{ position: "absolute", left: 80 + i * 600, top: 140, width: 560, height: 760, background: lit ? "rgba(40,37,33,0.95)" : "rgba(30,28,26,0.7)", border: `4px solid ${lit ? R.ocre : "#3A3632"}`, borderRadius: 18, transform: `translateY(${(1 - p) * 60}px)`, opacity: cl(0.35 + p), boxShadow: lit ? "0 30px 60px rgba(0,0,0,0.6)" : "none" }}>
          <div style={{ position: "absolute", left: 30, top: 24, fontFamily: SERIF, fontWeight: 700, fontSize: 120, color: lit ? R.ocreL : "#57524C" }}>{i + 1}</div>
          {shapes[i]}
          <div style={{ position: "absolute", left: 30, right: 30, bottom: 26, fontFamily: SANS, fontWeight: 600, fontSize: 50, lineHeight: 1.1, color: "#F4EFE6", textAlign: "center" }}>{it.t}</div>
        </div>); })}
    </AbsoluteFill>
  );
};

// ---------- cotas: silueta de la piedra y las líneas de medida que se estiran (largo, ancho, alto) + peso
export const RCotaN: React.FC<{ marks: { t: string; f: number }[]; title: string; dur: number }> = ({ marks, title, dur }) => {
  const f = useCurrentFrame(); const g = (i: number) => sp(f, marks[i]?.f ?? 0, 14);
  const Line = ({ l, t, w, h, p, lab, vert }: any) => <div style={{ position: "absolute", left: l, top: t, width: vert ? 6 : w * p, height: vert ? h * p : 6, background: R.ocreL, boxShadow: "0 0 10px rgba(242,201,76,0.6)" }}><div style={{ position: "absolute", left: vert ? 24 : w * p / 2 - 110, top: vert ? 30 : -84, width: 260, fontFamily: SANS, fontWeight: 700, fontSize: 64, color: R.ocreL, textShadow: tsh, opacity: cl(p * 2 - 1) }}>{lab}</div></div>;
  return (
    <AbsoluteFill style={{ opacity: out(f, dur) }}>
      <Taller />
      <Rock w={860} h={500} style={{ position: "absolute", left: 300, top: 360 }} />
      <Line l={300} t={900} w={860} p={g(0)} lab={marks[0]?.t} />
      <Line l={1220} t={360} h={500} p={g(2)} lab={marks[2]?.t} vert />
      <div style={{ position: "absolute", left: 1170, top: 880, width: 300 * g(1), height: 6, background: R.ocreL, transformOrigin: "0 0", transform: "rotate(-32deg)" }}><div style={{ position: "absolute", left: 120, top: 26, fontFamily: SANS, fontWeight: 700, fontSize: 64, color: R.ocreL, textShadow: tsh, opacity: cl(g(1) * 2 - 1), transform: "rotate(32deg)", whiteSpace: "nowrap" }}>{marks[1]?.t}</div></div>
      <Titulo txt={title} size={84} style={{ position: "absolute", left: 300, top: 120 }} />
    </AbsoluteFill>
  );
};

// ---------- bolsa a reventar (pelota que rebota y no se deja) vs a tres cuartos (almohada que se queda donde la empujás)
export const RBolsaN: React.FC<{ a: string; b: string; dur: number }> = ({ a, b, dur }) => {
  const f = useCurrentFrame(); const bounce = Math.abs(Math.sin(f / 8)) * 60; const push = cl((f - 20) / 18); const dent = interpolate(push, [0, 1], [0, 1], { easing: Easing.out(Easing.cubic) });
  const bag = "radial-gradient(circle at 35% 30%, #4A4A4C, #151516 65%)";
  return (
    <AbsoluteFill style={{ opacity: out(f, dur) }}>
      <Taller />
      <div style={{ position: "absolute", left: 260, top: 520 - bounce, width: 420, height: 420, borderRadius: "50%", background: bag, boxShadow: "inset 20px 20px 50px rgba(255,255,255,0.12)" }}><div style={{ position: "absolute", left: 180, top: -50, width: 60, height: 70, background: "#1A1A1B", borderRadius: "40% 40% 20% 20%" }} /></div>
      <div style={{ position: "absolute", left: 1150, top: 560, width: 560 + dent * 60, height: 360 - dent * 70, marginTop: dent * 70, borderRadius: `46% 54% 40% 40% / ${60 - dent * 25}% ${60 - dent * 10}% 40% 40%`, background: bag, boxShadow: "inset 20px 20px 50px rgba(255,255,255,0.12)" }} />
      <div style={{ position: "absolute", left: 1350, top: 360 + dent * 190, width: 150, height: 150, borderRadius: "40% 40% 30% 30%", background: "linear-gradient(170deg,#4D7BD1,#2A4E95)", opacity: cl(f / 10), boxShadow: "0 16px 26px rgba(0,0,0,0.5)" }} />
      <Chip txt={a} c={R.no} style={{ position: "absolute", left: 150, top: 110 }} />
      <Chip txt={b} c={R.ok} on={sp(f, 14)} style={{ position: "absolute", left: 1040, top: 110 }} />
    </AbsoluteFill>
  );
};

// ---------- la prueba del agua sobre la tela: en el algodón la gota se mete y oscurece; en la sintética queda en perla
export const RGotaTelaN: React.FC<{ a: string; b: string; dur: number }> = ({ a, b, dur }) => {
  const f = useCurrentFrame(); const fall = interpolate(f, [6, 24], [-200, 0], CL); const soak = cl((f - 24) / 30);
  const weave = (c1: string, c2: string) => `repeating-linear-gradient(0deg, ${c1} 0 6px, ${c2} 6px 12px), repeating-linear-gradient(90deg, ${c1} 0 6px, ${c2} 6px 12px)`;
  const Sw = ({ x, ok, lab }: { x: number; ok: boolean; lab: string }) => (
    <div style={{ position: "absolute", left: x, top: 220, width: 720, height: 620 }}>
      <div style={{ position: "absolute", inset: 0, background: ok ? weave("#C8B48D", "#B39C72") : weave("#2E3B33", "#26302A"), backgroundBlendMode: "multiply", boxShadow: "0 30px 50px rgba(0,0,0,0.55)" }} />
      {ok ? <div style={{ position: "absolute", left: 360 - 170 * soak, top: 300 - 130 * soak, width: 340 * soak, height: 260 * soak, borderRadius: "48% 52% 45% 55%", background: "radial-gradient(circle, rgba(70,52,30,0.75), rgba(70,52,30,0.35) 70%, transparent)" }} /> : null}
      <div style={{ position: "absolute", left: 320, top: 260 + (ok ? fall : fall), width: 80, height: ok ? 80 * (1 - soak) : 64, borderRadius: "50%", opacity: ok ? 1 - soak : 1, background: "radial-gradient(circle at 35% 30%, #FFFFFF, rgba(170,210,235,0.85) 40%, rgba(90,140,180,0.8))", transform: ok ? "none" : `scale(${1 + Math.sin(f / 6) * 0.04 * cl((f - 24) / 10)}, ${1 - Math.sin(f / 6) * 0.04 * cl((f - 24) / 10)})`, boxShadow: "0 6px 6px rgba(0,0,0,0.25)" }} />
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, background: R.noche, padding: "16px 24px", fontFamily: SERIF, fontWeight: 700, fontSize: 60, color: ok ? "#C9F2D2" : "#FFD3C9", textAlign: "center" }}>{lab}</div>
    </div>
  );
  return <AbsoluteFill style={{ opacity: out(f, dur) }}><Taller /><Sw x={150} ok lab={a} /><Sw x={1050} ok={false} lab={b} /></AbsoluteFill>;
};

// ---------- equipo de seguridad: cuatro piezas hechas con CSS que se encienden cuando se nombran
export const REppN: React.FC<{ items: { t: string; f: number }[]; title: string; dur: number }> = ({ items, title, dur }) => {
  const f = useCurrentFrame();
  const icons = [
    <div style={{ width: 120, height: 200, borderRadius: "60px 60px 20px 20px", background: "linear-gradient(170deg,#4D7BD1,#2A4E95)", position: "relative" }}><div style={{ position: "absolute", left: -40, top: 60, width: 50, height: 100, borderRadius: 25, background: "#3B64B3", transform: "rotate(-25deg)" }} /></div>,
    <div style={{ display: "flex", gap: 18, alignItems: "center" }}>{[0, 1].map((i) => <div key={i} style={{ width: 110, height: 90, borderRadius: 30, border: "10px solid #2A2A2A", background: "rgba(190,225,240,0.45)" }} />)}</div>,
    <div style={{ width: 90, height: 230, borderRadius: 30, background: "linear-gradient(170deg,#6E7D3F,#4A5629)" }} />,
    <div style={{ width: 200, height: 120, borderRadius: "30px 30px 70px 70px", background: "linear-gradient(170deg,#FFFFFF,#D9D9D9)", boxShadow: "inset 0 -10px 0 rgba(0,0,0,0.08)" }} />,
  ];
  return (
    <AbsoluteFill style={{ opacity: out(f, dur) }}>
      <Taller />
      <Titulo txt={title} size={84} style={{ position: "absolute", top: 80, width: "100%", textAlign: "center" }} />
      {items.map((it, i) => { const p = sp(f, it.f, 11); const lit = f >= it.f; return (
        <div key={i} style={{ position: "absolute", left: 90 + i * 445, top: 280, width: 410, height: 600, borderRadius: 24, background: lit ? "rgba(46,42,37,0.96)" : "rgba(34,31,28,0.6)", border: `4px solid ${lit ? R.ocre : "#3A3632"}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-between", padding: "60px 10px 40px", transform: `scale(${0.9 + 0.1 * p})`, opacity: cl(0.35 + p) }}>
          <div style={{ height: 260, display: "flex", alignItems: "center" }}>{icons[i]}</div>
          <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 56, color: lit ? "#FFF6E6" : "#77716A", textAlign: "center", lineHeight: 1.08 }}>{it.t}</div>
          <div style={{ width: 70, height: 70, borderRadius: "50%", background: lit ? R.ok : "#3A3632", color: "#FFF", fontFamily: SANS, fontWeight: 700, fontSize: 50, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${lit ? p : 0.6})` }}>✓</div>
        </div>); })}
    </AbsoluteFill>
  );
};

// ---------- la trama de la tela vista de cerca: la arena rebota arriba, la pasta sin arena se mete en cada hueco
export const RTramaN: React.FC<{ a: string; b: string; dur: number }> = ({ a, b, dur }) => {
  const f = useCurrentFrame(); const fill = cl((f - 20) / 50);
  const Grid = ({ x, sand }: { x: number; sand: boolean }) => (
    <div style={{ position: "absolute", left: x, top: 200, width: 760, height: 640, overflow: "hidden", background: "#1C1A18", boxShadow: "0 30px 50px rgba(0,0,0,0.55)" }}>
      {Array.from({ length: 7 }).map((_, r) => Array.from({ length: 8 }).map((__, c) => <div key={r + "_" + c} style={{ position: "absolute", left: c * 96 + 14, top: r * 92 + 14, width: 70, height: 66, background: sand ? "transparent" : `rgba(150,146,140,${fill})`, borderRadius: 6 }} />))}
      <div style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(90deg, #C7B38B 0 14px, transparent 14px 96px), repeating-linear-gradient(0deg, #B49E75 0 14px, transparent 14px 92px)" }} />
      {sand ? Array.from({ length: 22 }).map((_, i) => { const t0 = (i * 7) % 40; const y = interpolate(f - t0, [0, 18, 26, 34], [-60, 40 + (i % 5) * 8, 20 + (i % 5) * 8, 40 + (i % 5) * 8], CL); return <div key={i} style={{ position: "absolute", left: 20 + ((i * 97) % 720), top: y, width: 30 + (i % 3) * 8, height: 26 + (i % 4) * 6, borderRadius: "45% 55% 50% 50%", background: "radial-gradient(circle at 35% 30%, #D9B989, #8C6A42)" }} />; }) : null}
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, background: R.noche, padding: "16px 24px", fontFamily: SERIF, fontWeight: 700, fontSize: 58, color: sand ? "#FFD3C9" : "#C9F2D2", textAlign: "center" }}>{sand ? a : b}</div>
    </div>
  );
  return <AbsoluteFill style={{ opacity: out(f, dur) }}><Taller /><Grid x={140} sand /><Grid x={1020} sand={false} /></AbsoluteFill>;
};

// ---------- el chorro: la pasta cae gruesa y se amontona un segundo antes de aplanarse (consistencia de yogur)
export const RChorroN: React.FC<{ title: string; no: string[]; dur: number }> = ({ title, no, dur }) => {
  const f = useCurrentFrame(); const cyc = f % 75; const pile = interpolate(cyc, [10, 40, 60, 74], [0, 1, 0.6, 0.3], CL); const stream = cyc < 45 ? 1 : cl(1 - (cyc - 45) / 10);
  return (
    <AbsoluteFill style={{ opacity: out(f, dur) }}>
      <Taller />
      <div style={{ position: "absolute", left: 380, top: 110, width: 70, height: 360, borderRadius: 14, background: "linear-gradient(90deg,#8A6A45,#B48D5E,#8A6A45)", boxShadow: "0 10px 20px rgba(0,0,0,0.5)" }} />
      <div style={{ position: "absolute", left: 368, top: 420, width: 94, height: 80, borderRadius: "40% 40% 50% 50%", background: "radial-gradient(circle at 35% 30%, #C9C5BE, #8F8B85)" }} />
      <div style={{ position: "absolute", left: 395, top: 490, width: 40, height: 330 * stream, borderRadius: 20, background: "linear-gradient(90deg,#8F8B85,#C9C5BE,#8F8B85)" }} />
      <div style={{ position: "absolute", left: 415 - 180 * (0.6 + pile * 0.4), top: 900 - 140 * pile, width: 360 * (0.6 + pile * 0.4), height: 60 + 140 * pile, borderRadius: "50% 50% 12% 12% / 80% 80% 12% 12%", background: "radial-gradient(circle at 40% 30%, #D2CEC7, #8F8B85 70%)" }} />
      <div style={{ position: "absolute", left: 160, top: 960, width: 520, height: 30, borderRadius: 8, background: "#57534E" }} />
      <div style={{ position: "absolute", left: 900, top: 230, width: 900 }}>
        <Titulo txt={title} size={92} />
        {no.map((t, i) => <Chip key={i} txt={t} c={R.no} on={sp(f, 24 + i * 16)} style={{ display: "block", marginTop: 26, width: "fit-content" }} />)}
      </div>
    </AbsoluteFill>
  );
};

// ---------- perfil de la base: "torta" (se abre como una falda) contra "enterrada" (la base se mete y deja sombra); la cuerda la aprieta
export const RPerfilN: React.FC<{ mode: "torta" | "cuerda"; a: string; b: string; dur: number }> = ({ mode, a, b, dur }) => {
  const f = useCurrentFrame(); const k = mode === "cuerda" ? cl((f - 18) / 30) : 1; const ease = Easing.inOut(Easing.cubic)(k);
  const Prof = ({ x, buried, lab, c }: { x: number; buried: boolean; lab: string; c: string }) => {
    const pinch = buried ? 14 * ease : 0;
    return (
      <div style={{ position: "absolute", left: x, top: 180, width: 760, height: 760 }}>
        <div style={{ position: "absolute", left: 40, right: 40, top: 120, height: 420, clipPath: buried ? `polygon(${8 + pinch}% 100%, ${92 - pinch}% 100%, 96% 70%, 88% 30%, 64% 4%, 34% 0, 12% 22%, 4% 64%)` : "polygon(0 100%, 100% 100%, 92% 86%, 90% 60%, 80% 24%, 60% 4%, 36% 0, 16% 20%, 8% 62%, 6% 86%)", background: STONE }} />
        {buried ? <div style={{ position: "absolute", left: 40 + 680 * (0.08 + pinch / 100) - 20, right: 40 + 680 * (0.08 + pinch / 100) - 20, top: 500, height: 40, background: "linear-gradient(180deg, rgba(0,0,0,0), rgba(0,0,0,0.75))", opacity: buried ? (mode === "cuerda" ? ease : 1) : 0 }} /> : null}
        {mode === "cuerda" && buried ? <div style={{ position: "absolute", left: 40 + 680 * (0.04 + pinch / 140), right: 40 + 680 * (0.04 + pinch / 140), top: 470, height: 14, borderRadius: 7, background: "repeating-linear-gradient(45deg,#F3EDE0 0 8px,#CFC6B3 8px 14px)", boxShadow: "0 3px 4px rgba(0,0,0,0.4)" }} /> : null}
        <div style={{ position: "absolute", left: 0, right: 0, top: 536, height: 120, background: "linear-gradient(180deg,#6A4E35,#3F2E1F)", borderRadius: buried ? "0" : "0" }}>{Array.from({ length: 9 }).map((_, i) => <div key={i} style={{ position: "absolute", left: 20 + i * 82, top: -26, width: 10, height: 34, background: "#4F8A3A", borderRadius: 4, transform: `rotate(${(i % 3) * 10 - 10}deg)` }} />)}</div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 680, textAlign: "center" }}><Chip txt={lab} c={c} /></div>
      </div>
    );
  };
  return <AbsoluteFill style={{ opacity: out(f, dur) }}><Taller /><Prof x={130} buried={false} lab={a} c={R.no} /><Prof x={1030} buried lab={b} c={R.ok} /></AbsoluteFill>;
};

// ---------- corte de la cáscara: tres capas de tela dentro del cemento (≈ 1 cm), o dos capas que se funden vs se despegan
export const RCapasN: React.FC<{ mode: "tres" | "humedo"; title: string; a?: string; b?: string; dur: number }> = ({ mode, title, a, b, dur }) => {
  const f = useCurrentFrame(); const p = cl((f - 10) / 30);
  if (mode === "tres") return (
    <AbsoluteFill style={{ opacity: out(f, dur) }}>
      <Taller />
      <div style={{ position: "absolute", left: 160, top: 380, width: 1100, height: 330, background: "linear-gradient(180deg,#A9A49D,#7F7B75)", boxShadow: "0 30px 50px rgba(0,0,0,0.55)", borderRadius: 12 }}>
        {[0, 1, 2].map((i) => <div key={i} style={{ position: "absolute", left: 30, width: 1040 * cl(p * 3 - i), top: 70 + i * 90, height: 22, background: i === 2 ? "repeating-linear-gradient(90deg,#1E1E1E 0 16px,#3A3A3A 16px 24px)" : "repeating-linear-gradient(90deg,#C8B48D 0 16px,#9C8661 16px 24px)", borderRadius: 4 }} />)}
      </div>
      <div style={{ position: "absolute", left: 1300, top: 380, width: 8, height: 330 * p, background: R.ocreL }} />
      <div style={{ position: "absolute", left: 1340, top: 480, fontFamily: SANS, fontWeight: 700, fontSize: 110, color: R.ocreL, textShadow: tsh, opacity: cl(p * 2 - 1) }}>≈ 1 cm</div>
      <Titulo txt={title} size={84} style={{ position: "absolute", left: 160, top: 160 }} />
    </AbsoluteFill>
  );
  const gap = interpolate(f, [10, 50], [0, 60], CL);
  const Two = ({ x, fuse, lab, c }: { x: number; fuse: boolean; lab: string; c: string }) => (
    <div style={{ position: "absolute", left: x, top: 280, width: 720, height: 560 }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: fuse ? 160 : 160 - gap, height: 110, background: fuse ? "linear-gradient(180deg,#A9A49D,#8E8A84)" : "linear-gradient(180deg,#B6B1AA,#9A958F)", borderRadius: fuse ? "10px 10px 0 0" : 10, transform: fuse ? "none" : `rotate(${-gap / 12}deg)` }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 270, height: 110, background: "linear-gradient(180deg,#8E8A84,#77736D)", borderRadius: fuse ? "0 0 10px 10px" : 10 }} />
      {!fuse ? Array.from({ length: 6 }).map((_, i) => <div key={i} style={{ position: "absolute", left: 60 + i * 110, top: 262 - gap / 2, width: 18, height: 18, transform: "rotate(45deg)", background: "rgba(200,230,255,0.9)", opacity: cl((f - 40) / 10) }} />) : null}
      <div style={{ position: "absolute", left: 0, right: 0, top: 440, textAlign: "center" }}><Chip txt={lab} c={c} /></div>
    </div>
  );
  return <AbsoluteFill style={{ opacity: out(f, dur) }}><Taller /><Titulo txt={title} size={84} style={{ position: "absolute", top: 90, width: "100%", textAlign: "center" }} /><Two x={150} fuse lab={a || ""} c={R.ok} /><Two x={1050} fuse={false} lab={b || ""} c={R.no} /></AbsoluteFill>;
};

// ---------- tejas: las tiras se apoyan de abajo hacia arriba, cada una pisa a la de abajo; después baja la lluvia por encima
export const RTejasN: React.FC<{ title: string; sub: string; dur: number }> = ({ title, sub, dur }) => {
  const f = useCurrentFrame(); const rows = 6; const rain = cl((f - 70) / 10);
  return (
    <AbsoluteFill style={{ opacity: out(f, dur) }}>
      <Taller />
      <div style={{ position: "absolute", left: 160, top: 120, width: 900, height: 860, transform: "perspective(1400px) rotateX(18deg)" }}>
        {Array.from({ length: rows }).map((_, r) => Array.from({ length: 3 }).map((__, c) => { const k = (rows - 1 - r) * 3 + c; const p = sp(f, 6 + k * 3.4, 13); return <div key={r + "_" + c} style={{ position: "absolute", left: c * 290 + (r % 2) * 60 - 20, top: r * 120, width: 320, height: 170, borderRadius: 14, background: "linear-gradient(180deg,#9E9993,#77736D)", boxShadow: "0 -10px 16px rgba(0,0,0,0.35)", transform: `translateY(${(1 - p) * 120}px)`, opacity: cl(p * 2), zIndex: rows - r }}><div style={{ position: "absolute", inset: 10, background: "repeating-linear-gradient(90deg, rgba(0,0,0,0.08) 0 4px, transparent 4px 10px)" }} /></div>; }))}
        {Array.from({ length: 10 }).map((_, i) => { const y = ((f * 14 + i * 97) % 900); return <div key={i} style={{ position: "absolute", left: 60 + i * 84, top: y, width: 10, height: 60, borderRadius: 5, background: "rgba(190,225,250,0.85)", opacity: rain, zIndex: 20 }} />; })}
      </div>
      <div style={{ position: "absolute", left: 1140, top: 300, width: 700 }}>
        <Titulo txt={title} size={88} />
        <Chip txt={sub} on={sp(f, 70)} style={{ marginTop: 26 }} />
      </div>
    </AbsoluteFill>
  );
};

// ---------- testigo negro: las tiras negras tapan la capa gris; los huecos que quedan laten en amarillo y se tapan al final
export const RTestigoN: React.FC<{ title: string; sub: string; dur: number }> = ({ title, sub, dur }) => {
  const f = useCurrentFrame(); const holes = [5, 11, 16]; const total = 20; const last = 30 + total * 3;
  return (
    <AbsoluteFill style={{ opacity: out(f, dur) }}>
      <Taller />
      <div style={{ position: "absolute", left: 140, top: 160, width: 1040, height: 760, borderRadius: "30% 30% 10% 10% / 40% 40% 10% 10%", background: "linear-gradient(180deg,#A9A49D,#8E8A84)", overflow: "hidden", boxShadow: "0 30px 50px rgba(0,0,0,0.55)" }}>
        {Array.from({ length: total }).map((_, i) => { const r = Math.floor(i / 5), c = i % 5; const hole = holes.includes(i); const cover = hole ? f > last + 20 : f > 30 + i * 3; return <div key={i} style={{ position: "absolute", left: c * 210 - 10, top: 760 - (r + 1) * 200, width: 240, height: 220, borderRadius: 16, background: "linear-gradient(180deg,#2A2A2A,#141414)", opacity: cover ? 1 : 0, transform: `translateY(${cover ? 0 : 30}px)`, boxShadow: "0 -8px 12px rgba(0,0,0,0.4)" }} />; })}
        {holes.map((i) => { const r = Math.floor(i / 5), c = i % 5; const on = f > last && f <= last + 20; return <div key={i} style={{ position: "absolute", left: c * 210 + 50, top: 760 - (r + 1) * 200 + 50, width: 120, height: 120, borderRadius: "50%", border: `8px solid ${R.ocreL}`, opacity: on ? 0.6 + 0.4 * Math.sin(f / 3) : 0 }} />; })}
      </div>
      <div style={{ position: "absolute", left: 1260, top: 300, width: 600 }}>
        <Titulo txt={title} size={84} />
        <Chip txt={sub} on={f > last ? 1 : 0} style={{ marginTop: 26 }} />
      </div>
    </AbsoluteFill>
  );
};

// ---------- la grieta: se dibuja en zigzag sobre la piel fresca, se abre en dos y se corta de golpe
export const RGrietaN: React.FC<{ title: string; sub: string; dur: number }> = ({ title, sub, dur }) => {
  const f = useCurrentFrame();
  const segs = [[260, 300, 140, 28], [380, 366, 120, -34], [480, 300, 150, 22], [616, 358, 110, -40], [700, 288, 160, 18], [850, 338, 90, 50], [560, 330, 130, 70], [640, 450, 80, 20]];
  return (
    <AbsoluteFill style={{ opacity: out(f, dur) }}>
      <div style={{ position: "absolute", inset: 0, background: STONE }} />
      <AbsoluteFill style={{ background: "linear-gradient(90deg, transparent 50%, rgba(16,15,14,0.85) 75%)" }} />
      {segs.map(([x, y, l, a], i) => { const p = cl((f - 8 - i * 6) / 7); return <div key={i} style={{ position: "absolute", left: x, top: y, width: l * p, height: i > 5 ? 7 : 11, background: "#1F1D1B", borderRadius: 6, transformOrigin: "0 50%", transform: `rotate(${a}deg)`, boxShadow: "0 2px 0 rgba(255,255,255,0.25)" }} />; })}
      <div style={{ position: "absolute", left: 1180, top: 320, width: 640 }}>
        <Titulo txt={title} size={88} />
        <Chip txt={sub} on={sp(f, 50)} style={{ marginTop: 26 }} />
      </div>
    </AbsoluteFill>
  );
};

// ---------- los polvos: blanco, gris y ocre caen de arriba sobre la piedra húmeda y dejan manchas desparejas
export const RPolvosN: React.FC<{ items: { t: string; c: string; f: number }[]; dur: number }> = ({ items, dur }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ opacity: out(f, dur) }}>
      <Taller />
      <div style={{ position: "absolute", left: 360, top: 470, width: 1200, height: 460, borderRadius: "50% 50% 8% 8% / 90% 90% 8% 8%", background: "linear-gradient(180deg,#8F8B85,#6B6762)", overflow: "hidden", boxShadow: "0 30px 50px rgba(0,0,0,0.55)" }}>
        {items.map((it, i) => { const p = cl((f - it.f - 10) / 25); return [0, 1, 2].map((j) => <div key={i + "_" + j} style={{ position: "absolute", left: 120 + i * 340 + j * 70 - 40, top: 40 + ((i + j) % 3) * 90, width: 220 * p, height: 150 * p, borderRadius: "48% 52% 40% 60%", background: `radial-gradient(circle, ${it.c}, transparent 70%)`, opacity: 0.85 }} />); })}
      </div>
      {items.map((it, i) => { const on = f >= it.f; return (
        <React.Fragment key={i}>
          {Array.from({ length: 18 }).map((_, k) => { const t = f - it.f - (k % 6) * 2; const y = interpolate(t, [0, 24], [180, 560 + (k % 4) * 30], CL); return <div key={k} style={{ position: "absolute", left: 420 + i * 340 + ((k * 37) % 160), top: y, width: 10 + (k % 3) * 4, height: 10 + (k % 3) * 4, borderRadius: "50%", background: it.c, opacity: t > 0 && t < 26 ? 0.9 : 0 }} />; })}
          <Chip txt={it.t} c={it.c} on={on ? sp(f, it.f) : 0} style={{ position: "absolute", left: 360 + i * 400, top: 90 }} />
        </React.Fragment>); })}
    </AbsoluteFill>
  );
};

// ---------- balanza de baño: la aguja/rodillo de números sube hasta el total y queda latiendo
export const RBasculaN: React.FC<{ kg: number; title: string; sub: string; dur: number }> = ({ kg, title, sub, dur }) => {
  const f = useCurrentFrame(); const v = Math.round(interpolate(f, [6, 50], [0, kg], { ...CL, easing: Easing.out(Easing.cubic) })); const done = f > 52;
  return (
    <AbsoluteFill style={{ opacity: out(f, dur) }}>
      <Taller />
      <div style={{ position: "absolute", left: 220, top: 300, width: 640, height: 640, borderRadius: 60, background: "linear-gradient(160deg,#F3F2EE,#CFCCC5)", boxShadow: "0 40px 70px rgba(0,0,0,0.6), inset 0 -16px 0 rgba(0,0,0,0.08)" }}>
        <div style={{ position: "absolute", left: 120, top: 90, width: 400, height: 170, borderRadius: 18, background: "#16201A", boxShadow: "inset 0 0 30px rgba(0,0,0,0.9)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "monospace", fontWeight: 700, fontSize: 130, color: "#9CFFB5", textShadow: "0 0 18px rgba(156,255,181,0.7)", opacity: done ? 0.75 + 0.25 * Math.sin(f / 5) : 1 }}>{v}</div>
        {[0, 1].map((i) => <div key={i} style={{ position: "absolute", left: 90 + i * 260, top: 330, width: 200, height: 260, borderRadius: "90px 90px 60px 60px", background: "rgba(0,0,0,0.07)" }} />)}
      </div>
      <div style={{ position: "absolute", left: 1000, top: 330, width: 820 }}>
        <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 200, lineHeight: 1, color: R.ocreL, textShadow: tsh }}>{v} kg</div>
        <Titulo txt={title} size={80} f0={20} style={{ marginTop: 18 }} />
        <Chip txt={sub} c={R.ok} on={done ? 1 : 0} style={{ marginTop: 26 }} />
      </div>
    </AbsoluteFill>
  );
};
