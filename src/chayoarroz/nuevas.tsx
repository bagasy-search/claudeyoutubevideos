// arroz rojo y tortillas · PIEZAS NUEVAS de este par de videos (mismo lenguaje de rancho: barro, guinda, maíz, letra a mano),
// cada una clavada a la voz con at(). Las de arriba son del arroz, las de abajo de las tortillas.
import React from "react";
import { Img, staticFile } from "remotion";
import { CH, HAND, P, SERIF, e, spr } from "./lib";

type B = { t: number; at: number; out: number };
const vis = (t: number, at: number, out: number) => ({ k: Math.min(1.1, spr(t, at, 1.1)), o: e(t, at, at + 0.12) * (1 - e(t, out, out + 0.3)) });
const DARK = "rgba(38,16,10,.9)";
const ring = (c = CH.maiz) => `0 26px 50px rgba(0,0,0,.55), inset 0 0 0 3px ${c}88`;
const box = (x: number, y: number, o: number, k: number, extra: React.CSSProperties = {}): React.CSSProperties => ({ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) scale(${0.7 + 0.3 * k})`, padding: "22px 30px", borderRadius: 20, background: DARK, boxShadow: ring(), textAlign: "center", ...extra });
const Hd: React.FC<{ s?: number; c?: string; f?: string; children: React.ReactNode }> = ({ s = 52, c = CH.crema, f = SERIF, children }) => <div style={{ fontFamily: f, fontWeight: f === SERIF ? 900 : 700, fontSize: s, color: c, lineHeight: 1.08 }}>{children}</div>;

// ======================= ARROZ =======================
// el agua de lavar: cuatro tazones que van de atole a transparente, uno por enjuague
export const AguaClara: React.FC<B & { x: number; y: number; steps: number[] }> = ({ t, at, out, x, y, steps }) => {
  const { k, o } = vis(t, at, out);
  if (o <= 0.01) return null;
  return <div style={box(x, y, o, k)}>
    <div style={{ display: "flex", gap: 26, alignItems: "flex-end" }}>{steps.map((a, i) => {
      const on = Math.min(1.1, spr(t, a, 1.2)), milk = 0.92 - i * 0.29;
      return <div key={i} style={{ transform: `scale(${on})`, opacity: Math.min(1, on * 2) }}>
        <svg width={150} height={120} viewBox="0 0 150 120"><path d="M 10 40 Q 10 112 75 112 Q 140 112 140 40 Z" fill="#a3502a" /><ellipse cx={75} cy={42} rx={62} ry={13} fill={`rgba(246,242,232,${milk})`} stroke="#7a3a1a" strokeWidth={4} />
          <ellipse cx={75} cy={42} rx={62} ry={13} fill="#7fb0c2" opacity={0.35 * (1 - milk)} /></svg>
        <Hd s={40} f={HAND} c={i === steps.length - 1 ? "#bfe88a" : CH.crema}>{i === 0 ? "atole" : i === steps.length - 1 ? "¡clarita!" : `${i + 1}ª`}</Hd>
      </div>; })}</div>
  </div>;
};
// el sonido del arroz que se fríe: onda que pasa de lisa a "arenita"
export const Arena: React.FC<B & { x: number; y: number; sandAt: number }> = ({ t, at, out, x, y, sandAt }) => {
  const { k, o } = vis(t, at, out);
  if (o <= 0.01) return null;
  const s = e(t, sandAt, sandAt + 0.8);
  const pts = Array.from({ length: 120 }, (_, i) => { const xx = i * 6, n = Math.sin(i * 12.9898 + Math.floor(t * 20) * 78.233) * 43758.5; const r = n - Math.floor(n); return `${xx},${60 + (2 + 30 * s * r) * Math.sin(i * 1.7 + t * 30) * (i % 3 ? 1 : -1)}`; }).join(" ");
  return <div style={box(x, y, o, k)}>
    <Hd s={46} c={CH.maiz}>{s < 0.5 ? "callado..." : "shhh... ¡como arena!"}</Hd>
    <svg width={720} height={120} viewBox="0 0 720 120"><polyline points={pts} fill="none" stroke={s < 0.5 ? "#c9b8a0" : CH.maiz} strokeWidth={4} strokeLinejoin="round" /></svg>
    <Hd s={38} f={HAND}>de 5 a 6 minutos, moviendo sin parar</Hd>
  </div>;
};
// el grano por dentro: sin freír se revienta; frito queda sellado con su capita
export const Grano: React.FC<B & { x: number; y: number; sealAt: number }> = ({ t, at, out, x, y, sealAt }) => {
  const { k, o } = vis(t, at, out);
  if (o <= 0.01) return null;
  const sl = e(t, sealAt, sealAt + 0.7), burst = e(t, at + 0.6, at + 1.6);
  const g = (sealed: boolean) => <div style={{ textAlign: "center" }}>
    <svg width={300} height={170} viewBox="0 0 300 170">
      {sealed ? <><ellipse cx={150} cy={85} rx={120} ry={46} fill="#f1e6cf" /><ellipse cx={150} cy={85} rx={120} ry={46} fill="none" stroke="#d79a4e" strokeWidth={4 + 10 * sl} /></>
        : <><path d={`M 30 85 Q 60 ${40 - 25 * burst} 150 ${39 - 20 * burst} Q 240 ${40 - 25 * burst} 270 85 Q 240 ${130 + 25 * burst} 150 ${131 + 20 * burst} Q 60 ${130 + 25 * burst} 30 85 Z`} fill="#f6f1e6" />
          {[0, 1, 2, 3].map((i) => <path key={i} d={`M ${90 + i * 40} 60 l ${8 * burst} ${-22 * burst}`} stroke="#c9b8a0" strokeWidth={5} />)}</>}
    </svg>
    <Hd s={44} c={sealed ? "#bfe88a" : "#ff8a6a"}>{sealed ? "FRITO: SELLADO" : "SIN FREÍR"}</Hd>
    <Hd s={36} f={HAND}>{sealed ? "entero y suelto" : "se revienta: engrudo"}</Hd>
  </div>;
  return <div style={box(x, y, o, k, { display: "flex", gap: 40 })}>{g(false)}<div style={{ opacity: e(t, sealAt - 0.2, sealAt + 0.2) }}>{g(true)}</div></div>;
};
// la cuenta del caldo: 1 taza de arroz → 2 de caldo (tazas que se llenan)
export const Proporcion: React.FC<B & { x: number; y: number; arroz: number; caldo: number; dt?: number }> = ({ t, at, out, x, y, arroz, caldo, dt = 0.25 }) => {
  const { k, o } = vis(t, at, out);
  if (o <= 0.01) return null;
  const taza = (c: string, i: number, a0: number) => { const f = e(t, a0 + i * dt, a0 + i * dt + 0.5); return <svg key={i} width={90} height={90} viewBox="0 0 60 60" style={{ opacity: 0.25 + 0.75 * f }}><path d="M 8 14 L 12 52 Q 13 56 18 56 L 38 56 Q 43 56 44 52 L 48 14 Z" fill="#efe0bf" /><rect x={10} y={14 + 38 * (1 - f)} width={36} height={38 * f} fill={c} /><path d="M 48 22 Q 58 24 56 34 Q 54 42 46 42" fill="none" stroke="#efe0bf" strokeWidth={4} /></svg>; };
  return <div style={box(x, y, o, k, { display: "flex", alignItems: "center", gap: 22 })}>
    <div>{Array.from({ length: arroz }, (_, i) => taza("#f4efe2", i, at + 0.2))}<Hd s={40} f={HAND}>arroz</Hd></div>
    <Hd s={90} c={CH.maiz}>→</Hd>
    <div>{Array.from({ length: caldo }, (_, i) => taza("#d9a35a", i, at + 0.5 + arroz * dt))}<Hd s={40} f={HAND}>caldo caliente</Hd></div>
  </div>;
};
// la superficie del arroz vista de arriba: aparecen los hoyitos por donde respira
export const Hoyitos: React.FC<B & { x: number; y: number; holesAt: number }> = ({ t, at, out, x, y, holesAt }) => {
  const { k, o } = vis(t, at, out);
  if (o <= 0.01) return null;
  const h = e(t, holesAt, holesAt + 1.4);
  return <div style={box(x, y, o, k)}>
    <svg width={420} height={300} viewBox="0 0 420 300"><ellipse cx={210} cy={150} rx={195} ry={135} fill="#7a3a1a" /><ellipse cx={210} cy={145} rx={175} ry={118} fill="#d06a32" />
      {Array.from({ length: 18 }, (_, i) => { const a = i * 2.39, r = 25 + (i * 37) % 130, cx = 210 + Math.cos(a) * r, cy = 145 + Math.sin(a) * r * 0.62, ph = (t * 1.1 + i * 0.37) % 1;
        return <g key={i} opacity={h}><ellipse cx={cx} cy={cy} rx={7} ry={5} fill="#3a1408" /><circle cx={cx} cy={cy - 10 - 40 * ph} r={6 + 10 * ph} fill="#fff" opacity={0.35 * (1 - ph)} /></g>; })}
      {Array.from({ length: 10 }, (_, i) => <circle key={"p" + i} cx={70 + (i * 61) % 280} cy={90 + (i * 43) % 120} r={7} fill="#4f9a2a" />)}</svg>
    <Hd s={44} c={CH.maiz}>{h < 0.5 ? "que suelte el hervor" : "¡los hoyitos! → fuego mínimo y tapa"}</Hd>
  </div>;
};
// la servilleta bajo la tapa: sin ella las gotas caen; con ella se las chupa
export const Servilleta: React.FC<B & { x: number; y: number; okAt: number }> = ({ t, at, out, x, y, okAt }) => {
  const { k, o } = vis(t, at, out);
  if (o <= 0.01) return null;
  const ok = e(t, okAt, okAt + 0.5);
  const pan = (good: boolean) => <div style={{ textAlign: "center", opacity: good ? ok : 1 }}>
    <svg width={300} height={230} viewBox="0 0 300 230"><path d="M 30 110 Q 30 210 150 210 Q 270 210 270 110 Z" fill="#7a3a1a" /><ellipse cx={150} cy={112} rx={118} ry={20} fill="#d06a32" />
      <path d="M 20 70 Q 150 10 280 70 Z" fill="#5a3a2a" />{good && <path d="M 30 72 Q 150 24 270 72 L 262 84 Q 150 40 38 84 Z" fill="#efe7d8" />}
      {Array.from({ length: 5 }, (_, i) => { const ph = (t * 0.9 + i * 0.2) % 1; return good ? <circle key={i} cx={70 + i * 40} cy={84} r={4} fill="#9fd0ff" opacity={1 - ph} /> : <circle key={i} cx={70 + i * 40} cy={80 + 32 * ph} r={5} fill="#9fd0ff" />; })}</svg>
    <Hd s={42} c={good ? "#bfe88a" : "#ff8a6a"}>{good ? "CON SERVILLETA" : "SIN SERVILLETA"}</Hd>
    <Hd s={34} f={HAND}>{good ? "se chupa el vapor: suelto" : "gotas encima: aguado"}</Hd>
  </div>;
  return <div style={box(x, y, o, k, { display: "flex", gap: 40 })}>{pan(false)}{pan(true)}</div>;
};

// ======================= TORTILLAS =======================
// la prueba de la bolita: orillas cuarteadas (le falta agua) contra orillas lisas
export const Bolita: React.FC<B & { x: number; y: number; goodAt: number }> = ({ t, at, out, x, y, goodAt }) => {
  const { k, o } = vis(t, at, out);
  if (o <= 0.01) return null;
  const ok = e(t, goodAt, goodAt + 0.5);
  const disc = (good: boolean) => <div style={{ textAlign: "center", opacity: good ? ok : 1 }}>
    <svg width={240} height={200} viewBox="0 0 240 200"><circle cx={120} cy={95} r={80} fill="#e2cf98" />
      {!good && Array.from({ length: 12 }, (_, i) => { const a = i * 0.52; return <path key={i} d={`M ${120 + Math.cos(a) * 80} ${95 + Math.sin(a) * 80} L ${120 + Math.cos(a + 0.05) * 58} ${95 + Math.sin(a + 0.05) * 58}`} stroke="#8a6a3a" strokeWidth={4} />; })}
      {good && <circle cx={120} cy={95} r={80} fill="none" stroke="#c9b27a" strokeWidth={3} />}</svg>
    <Hd s={42} c={good ? "#bfe88a" : "#ff8a6a"}>{good ? "ORILLAS LISAS" : "SE CUARTEA"}</Hd>
    <Hd s={34} f={HAND}>{good ? "lista, como plastilina" : "le falta agua"}</Hd>
  </div>;
  return <div style={box(x, y, o, k, { display: "flex", gap: 40 })}>{disc(false)}{disc(true)}</div>;
};
// el grueso de la tortilla: delgada se rompe, gruesa es sope, 2 mm es la buena
export const Grosor: React.FC<B & { x: number; y: number; okAt: number }> = ({ t, at, out, x, y, okAt }) => {
  const { k, o } = vis(t, at, out);
  if (o <= 0.01) return null;
  const ok = e(t, okAt, okAt + 0.4);
  const rows: [string, number, string][] = [["muy delgada", 4, "#ff8a6a"], ["2 mm", 12, "#bfe88a"], ["muy gruesa: sope", 30, "#ff8a6a"]];
  return <div style={box(x, y, o, k)}>{rows.map(([l, h, c], i) => <div key={i} style={{ display: "flex", alignItems: "center", gap: 24, margin: "10px 0", opacity: i === 1 ? 0.4 + 0.6 * ok : 1, transform: i === 1 ? `scale(${1 + 0.08 * ok})` : undefined }}>
    <div style={{ width: 360, height: h, borderRadius: h, background: "#e2cf98", boxShadow: i === 1 ? `0 0 ${20 * ok}px #bfe88a` : undefined }} /><Hd s={42} f={HAND} c={c}>{l}</Hd></div>)}</div>;
};
// las tres vueltas en el comal, con su tiempo y el inflado al final
export const Vueltas: React.FC<B & { x: number; y: number; marks: { at: number; label: string; sub: string }[] }> = ({ t, at, out, x, y, marks }) => {
  const { k, o } = vis(t, at, out);
  if (o <= 0.01) return null;
  return <div style={box(x, y, o, k, { display: "flex", gap: 22 })}>{marks.map((m, i) => { const on = Math.min(1.1, spr(t, m.at, 1.2)); return <div key={i} style={{ transform: `scale(${on})`, opacity: Math.min(1, on * 2), padding: "12px 18px", borderRadius: 16, background: "rgba(255,255,255,.06)" }}>
    <Hd s={70} c={CH.maiz}>{i + 1}</Hd><Hd s={40}>{m.label}</Hd><Hd s={34} f={HAND}>{m.sub}</Hd></div>; })}</div>;
};
// el comal: con poco fuego la gota se queda quieta; bien caliente BAILA
export const Gotas: React.FC<B & { x: number; y: number; hotAt: number }> = ({ t, at, out, x, y, hotAt }) => {
  const { k, o } = vis(t, at, out);
  if (o <= 0.01) return null;
  const hot = e(t, hotAt, hotAt + 0.5);
  const c = (h: boolean) => <div style={{ textAlign: "center", opacity: h ? hot : 1 }}><svg width={280} height={170} viewBox="0 0 280 170"><ellipse cx={140} cy={110} rx={125} ry={42} fill="#1c1a19" /><ellipse cx={140} cy={104} rx={125} ry={42} fill="#2c2826" />
    {Array.from({ length: 6 }, (_, i) => { const ph = (t * 3 + i * 0.37) % 1; return <ellipse key={i} cx={60 + i * 32 + (h ? 14 * Math.sin(t * 9 + i) : 0)} cy={100 - (h ? 18 * Math.abs(Math.sin(ph * 6.28)) : 0)} rx={8} ry={h ? 7 : 4} fill="#cfe9ff" />; })}</svg>
    <Hd s={40} c={h ? "#bfe88a" : "#ff8a6a"}>{h ? "BAILAN: ¡LISTO!" : "SE QUEDAN: FRÍO"}</Hd></div>;
  return <div style={box(x, y, o, k, { display: "flex", gap: 36 })}>{c(false)}{c(true)}</div>;
};
// cuántas tortillas salen: la canasta se va llenando
export const Rinde: React.FC<B & { x: number; y: number; n: number; label: string; dt?: number }> = ({ t, at, out, x, y, n, label, dt = 0.12 }) => {
  const { k, o } = vis(t, at, out);
  if (o <= 0.01) return null;
  return <div style={box(x, y, o, k)}>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(8, 70px)", gap: 10 }}>{Array.from({ length: n }, (_, i) => { const on = Math.min(1.1, spr(t, at + 0.3 + i * dt, 1.3)); return <svg key={i} width={70} height={70} viewBox="0 0 40 40" style={{ transform: `scale(${on})` }}><circle cx={20} cy={20} r={17} fill="#e8d49c" /><circle cx={14} cy={16} r={2.5} fill="#a8783a" /><circle cx={25} cy={24} r={2} fill="#a8783a" /></svg>; })}</div>
    <Hd s={46} c={CH.maiz}>{label}</Hd>
  </div>;
};
// barras de lo que se gasta al mes
export const Barras: React.FC<B & { x: number; y: number; rows: { at: number; label: string; v: number; c: string }[]; max: number; unit?: string }> = ({ t, at, out, x, y, rows, max, unit = "$" }) => {
  const { k, o } = vis(t, at, out);
  if (o <= 0.01) return null;
  return <div style={box(x, y, o, k, { width: 900, textAlign: "left" })}>{rows.map((r, i) => { const f = e(t, r.at, r.at + 0.9); return <div key={i} style={{ margin: "12px 0" }}>
    <Hd s={40} f={HAND}>{r.label}</Hd>
    <div style={{ display: "flex", alignItems: "center", gap: 16 }}><div style={{ height: 54, width: 640 * (r.v / max) * f, borderRadius: 12, background: r.c }} /><Hd s={52} c={r.c}>{unit}{Math.round(r.v * f)}</Hd></div></div>; })}</div>;
};

// ======================= LA GUÍA, de verdad =======================
// la página REAL del recetario (render del PDF): entra la tapa y se voltea a la página; un marcatextos subraya lo que se nombra
export const PaginaReal: React.FC<B & { x: number; y: number; a: string; b?: string; flipAt?: number; w?: number; rot?: number; hl?: { at: number; y0: number; y1: number }[]; cap?: string }> = ({ t, at, out, x, y, a, b, flipAt = 1e9, w = 520, rot = -3, hl = [], cap }) => {
  const { k, o } = vis(t, at, out);
  if (o <= 0.01) return null;
  const f = b ? e(t, flipAt, flipAt + 0.8) : 0, h = w * 1210 / 935;
  const face = (src: string, back: boolean) => <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", transform: back ? "rotateY(180deg)" : undefined, borderRadius: 10, overflow: "hidden", boxShadow: "0 40px 80px rgba(0,0,0,.6)" }}>
    <Img src={staticFile(P + src)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
    {back && hl.map((r, i) => { const m = e(t, r.at, r.at + 0.5); return <div key={i} style={{ position: "absolute", left: "6%", top: `${r.y0 * 100}%`, height: `${(r.y1 - r.y0) * 100}%`, width: `${88 * m}%`, background: "rgba(255,214,60,.38)", mixBlendMode: "multiply", borderRadius: 6 }} />; })}
  </div>;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) translateY(${(1 - Math.min(1, k)) * 300}px) rotate(${rot}deg) scale(${0.85 + 0.15 * k})`, width: w, height: h, perspective: 1800 }}>
    <div style={{ position: "absolute", inset: 0, transformStyle: "preserve-3d", transform: `rotateY(${-180 * f}deg)` }}>{face(a, false)}{b && face(b, true)}</div>
    {cap && <div style={{ position: "absolute", left: "50%", bottom: -70, transform: "translateX(-50%)", whiteSpace: "nowrap", fontFamily: HAND, fontWeight: 700, fontSize: 52, color: CH.maiz, textShadow: "0 4px 14px rgba(0,0,0,.85)" }}>{cap}</div>}
  </div>;
};
