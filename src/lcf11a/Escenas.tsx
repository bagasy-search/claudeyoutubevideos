// Escenas sobre fotos reales · lcf11a (ideas en D:/rtmp/lcf11a/ideas.md). Sin componentes hechos ni dibujos: sólo la foto y su geometría.
import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, Easing } from "remotion";

const CL = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.inOut(Easing.cubic);
const S = (n: string) => staticFile(`lcf11a/g/${n}.png`);
const full: React.CSSProperties = { position: "absolute", left: 0, top: 0, width: 1920, height: 1080, objectFit: "fill" };
const hand: React.CSSProperties = { position: "absolute", fontFamily: "Kalam, cursive", fontWeight: 700, color: "#fff", textShadow: "0 3px 14px rgba(0,0,0,0.85)" };

// ---------- 1 · el plato se vuelve el cuarto de dólar (mismo borde) y la cámara se aleja hasta las tres monedas
export const Plato60: React.FC<{ dur: number; fCost: number; fSixty: number }> = ({ dur, fCost, fSixty }) => {
  const f = useCurrentFrame();
  const P = { x: 942, y: 525, r: 387 }, Q = { x: 932, y: 507, r: 278 };
  const k0 = P.r / Q.r; // 1,39: el canto del cuarto coincide con el borde del plato
  const push = interpolate(f, [0, fCost], [1.0, 1.06], { ...CL, easing: io });
  const swap = interpolate(f, [fCost - 4, fCost + 8], [0, 1], CL); // la moneda aparece dentro del borde
  const open = interpolate(f, [fCost + 10, Math.max(fCost + 30, fSixty + 6)], [0, 1], { ...CL, easing: io });
  const k = k0 + (1 - k0) * open; // escala de la foto de la moneda: de calzar en el plato a su tamaño real
  const tx = (P.x - Q.x * k0) * (1 - open), ty = (P.y - Q.y * k0) * (1 - open);
  const rad = interpolate(open, [0, 1], [P.r * push, 1400]);
  const txt = interpolate(f, [fSixty, fSixty + 10], [0, 1], CL);
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#000" }}>
      <div style={{ ...full, transform: `scale(${push})`, transformOrigin: `${P.x}px ${P.y}px` }}><Img src={S("e_plato")} style={full} /></div>
      <div style={{ ...full, overflow: "hidden", opacity: swap, clipPath: `circle(${rad}px at ${P.x}px ${P.y}px)` }}>
        <div style={{ ...full, transform: `translate(${tx}px, ${ty}px) scale(${k})`, transformOrigin: "0 0" }}><Img src={S("e_moneda")} style={full} /></div>
      </div>
      <div style={{ ...hand, left: 1420, top: 250, fontSize: 120, opacity: txt, transform: `translateY(${(1 - txt) * 30}px)` }}>60¢</div>
    </AbsoluteFill>
  );
};

// ---------- 2 · el vidrio de la lupa real muestra la costra y después el interior; luego la cena servida
export const Patty: React.FC<{ dur: number; fCrispy: number; fSoft: number; fWith: number; fForty: number }> = ({ dur, fCrispy, fSoft, fWith, fForty }) => {
  const f = useCurrentFrame();
  const L = { x: 895, y: 567, r: 240 };
  const zin = interpolate(f, [0, fCrispy, fSoft + 20], [1.0, 1.08, 1.55], { ...CL, easing: io });
  const cA = interpolate(f, [fCrispy - 3, fCrispy + 8], [0, 1], CL);
  const cB = interpolate(f, [fSoft - 3, fSoft + 8], [0, 1], CL);
  const outL = interpolate(f, [fWith - 10, fWith + 6], [1, 0], CL); // la lupa vuelve a mostrar la sartén
  const dish = interpolate(f, [fWith - 4, fWith + 10], [0, 1], CL);
  const dz = interpolate(f, [fWith, dur], [1.0, 1.07], CL);
  const kx = 0.5; // el macro dentro del vidrio
  const macro = (n: string, o: number) => (
    <div style={{ ...full, opacity: o }}>
      <div style={{ ...full, transform: `translate(${L.x - 960 * kx}px, ${L.y - 540 * kx}px) scale(${kx})`, transformOrigin: "0 0" }}><Img src={S(n)} style={full} /></div>
    </div>
  );
  const t = interpolate(f, [fForty, fForty + 10], [0, 1], CL);
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#000" }}>
      <div style={{ ...full, transform: `scale(${zin})`, transformOrigin: `${L.x}px ${L.y}px` }}>
        <Img src={S("e_lupa")} style={full} />
        <div style={{ ...full, overflow: "hidden", clipPath: `circle(${L.r}px at ${L.x}px ${L.y}px)`, opacity: outL }}>
          {macro("e_costra", cA * (1 - cB))}
          {macro("e_dentro", cB)}
        </div>
      </div>
      {f >= fWith - 4 && (
        <div style={{ ...full, opacity: dish, transform: `scale(${dz})`, transformOrigin: "760px 360px" }}><Img src={S("e_lun")} style={full} /></div>
      )}
      {f >= fForty && <div style={{ ...hand, left: 1530, top: 120, fontSize: 110, opacity: t }}>40¢</div>}
    </AbsoluteFill>
  );
};

// ---------- 3 · el plato gira como bandeja giratoria y en cada día trae servida otra cena
const PL = [
  { n: "e_dom", x: 982, y: 540, r: 517, d: "Sunday" },
  { n: "e_lun", x: 999, y: 555, r: 576, d: "Monday" },
  { n: "e_mar", x: 917, y: 532, r: 552, d: "Tuesday" },
];
export const Semana: React.FC<{ dur: number; fSun: number; fMon: number; fTue: number }> = ({ dur, fSun, fMon, fTue }) => {
  const f = useCurrentFrame();
  const T = 16; // media vuelta de ida + media de vuelta
  const marks = [fSun, fMon, fTue];
  let cur = -1; marks.forEach((m, i) => { if (f >= m - T / 2) cur = i; });
  const nb = interpolate(f, [0, fSun], [1.0, 1.07], { ...CL, easing: io });
  const layers: React.ReactNode[] = [];
  // fondo: la libreta hasta el domingo, después la mesa del día (fundido mientras gira)
  layers.push(<div key="nb" style={{ ...full, transform: `scale(${nb})`, transformOrigin: "1400px 600px" }}><Img src={S("e_cuaderno")} style={full} /></div>);
  PL.forEach((p, i) => {
    const m = marks[i]; if (f < m - T / 2) return;
    const o = interpolate(f, [m - T / 2, m + T / 2], [0, 1], CL);
    const z = interpolate(f, [m, (marks[i + 1] ?? dur) + T / 2], [1.0, 1.05], CL);
    layers.push(<div key={p.n} style={{ ...full, opacity: o, transform: `scale(${z})`, transformOrigin: `${p.x}px ${p.y}px` }}><Img src={S(p.n)} style={full} /></div>);
  });
  // el plato que gira: en la ida rota el plato que se va, en la vuelta llega el nuevo
  let disc: React.ReactNode = null;
  if (cur >= 0) {
    const m = marks[cur], a = (f - (m - T / 2)) / T;
    if (a >= 0 && a <= 1) {
      const e = io(Math.min(1, Math.max(0, a)));
      const from = cur > 0 ? PL[cur - 1] : null, to = PL[cur];
      const src = e < 0.5 ? from : to;
      if (src) {
        const ang = e < 0.5 ? e * 360 : (e - 1) * 360; // 0→180 y -180→0
        const cx = from ? from.x + (to.x - from.x) * e : to.x, cy = from ? from.y + (to.y - from.y) * e : to.y;
        const r = from ? from.r + (to.r - from.r) * e : to.r * (0.6 + 0.4 * e);
        disc = (
          <div style={{ ...full, overflow: "hidden", clipPath: `circle(${r}px at ${cx}px ${cy}px)`, filter: "drop-shadow(0 10px 24px rgba(0,0,0,0.45))" }}>
            <div style={{ ...full, transform: `translate(${cx - src.x}px, ${cy - src.y}px) rotate(${ang}deg)`, transformOrigin: `${src.x}px ${src.y}px` }}><Img src={S(src.n)} style={full} /></div>
          </div>
        );
      }
    }
  }
  const day = cur >= 0 ? PL[cur].d : "";
  const dt = cur >= 0 ? interpolate(f, [marks[cur], marks[cur] + 8], [0, 1], CL) : 0;
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#000" }}>
      {layers}
      {disc}
      {cur >= 0 && <div style={{ ...hand, right: 90, bottom: 70, fontSize: 104, opacity: dt }}>{day}</div>}
    </AbsoluteFill>
  );
};

export const ESC_LCF11A = { plato60: Plato60, patty: Patty, semana: Semana } as Record<string, React.FC<any>>;
