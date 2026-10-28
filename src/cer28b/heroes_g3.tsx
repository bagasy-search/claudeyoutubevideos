// cer28 · componentes únicos de VENTANAS (cer28b): riel con el palo, hoja que se levanta y el tornillo, vidrio con película,
// banderola de tiras, grava y rosal, reja con tornillos por fuera, malla del sótano, pestillo de chapa que se dobla, planilla del recorrido.
import React from "react";
import { AMB, DIM, GRN, HAND, Head, ICE, MARK, Photo, RED, Shadow, Sheen, Stage, TX, Tag, cl, eIn, eio, phys } from "./hkit";
import type { HP } from "./heroes_g1";

const alu = "linear-gradient(180deg,#e9edf0,#a7afb5 55%,#7b848b)";
const Glass: React.FC<{ w: number; h: number; p?: number }> = ({ w, h, p = 0 }) => (
  <div style={{ position: "absolute", left: 18, top: 18, width: w - 36, height: h - 36, background: "linear-gradient(135deg, rgba(170,210,240,.45), rgba(90,130,170,.2) 60%, rgba(200,230,255,.35))", overflow: "hidden" }}><Sheen p={p} o={0.35} /></div>);

// ---------- 37 · EL RIEL Y EL PALO: la hoja corre por el canal vacío; cae el palo y la hoja choca ----------
export const HRail: React.FC<HP> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const st = h.stickAt ?? 2.4, open1 = eio(tt, 0.7, 1.6) * (1 - eio(tt, 1.8, 2.3)), drop = phys(tt, st, 6, 0.45), tryO = tt > st + 1 ? Math.max(0, Math.sin((tt - st - 1) * 9)) * 14 * Math.exp(-(tt - st - 1)) : 0;
  const x = 380 + 560 * open1 + tryO, W = 680, Hh = 620;
  return <>
    <div style={{ position: "absolute", left: 340, top: 220, width: 1360, height: Hh + 40, border: "22px solid #c9cfd4", boxSizing: "border-box", boxShadow: "0 50px 100px rgba(0,0,0,.6)" }} />
    <div style={{ position: "absolute", left: 1000, top: 240, width: W, height: Hh, background: alu, boxShadow: "inset 0 0 0 4px #8a939a" }}><Glass w={W} h={Hh} p={0.3} /></div>
    <div style={{ position: "absolute", left: x, top: 250, width: W, height: Hh, background: alu, boxShadow: "inset 0 0 0 4px #8a939a, 20px 0 30px rgba(0,0,0,.35)" }}><Glass w={W} h={Hh} p={(tt * 0.2) % 1} /></div>
    <div style={{ position: "absolute", left: 340, top: 870, width: 1360, height: 60, background: "linear-gradient(180deg,#d6dbdf,#8d969c)", boxShadow: "inset 0 10px 14px rgba(0,0,0,.35)" }} />
    <div style={{ position: "absolute", left: 1062 + 0, top: 870 - (1 - drop) * 500, width: 620, height: 42, borderRadius: 21, background: `linear-gradient(180deg,${h.col ?? "#f4f4f2"},#cfcfcb)`, boxShadow: "0 10px 18px rgba(0,0,0,.45)", opacity: cl(drop * 3), transform: `rotate(${(1 - cl(drop)) * -8}deg)` }} />
    <div style={{ position: "absolute", left: 1062 + 620, top: 840, borderLeft: `4px solid ${AMB}`, height: 90, opacity: cl(tt - st - 0.6) }} />
    <Tag tt={tt} at={st + 0.8} x={1380} y={980} txt={h.lab ?? "LARGO DEL CANAL − 1 CM"} col={AMB} size={44} />
    {tt > st + 1 && <div style={{ position: "absolute", left: 1040, top: 880, fontFamily: MARK, fontSize: 60, color: GRN, transform: "translate(-50%,-110%) rotate(-6deg)", opacity: cl((tt - st - 1) * 2) }}>¡TOC!</div>}
    <Tag tt={tt} at={0.6} x={680} y={170} txt={h.lab0 ?? "EL CANAL VACÍO"} col={DIM} size={38} />
  </>;
}}</Stage>;

// ---------- 38 · LA HOJA QUE SE LEVANTA: palanca abajo, la hoja sube y sale del riel; con el tornillo arriba, no sube ----------
export const HLift: React.FC<HP> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const sc = h.screwAt ?? 3.2, up1 = eio(tt, 0.8, 1.6) * (1 - eio(tt, 2.2, 2.7)), out1 = eio(tt, 1.6, 2.1) * (1 - eio(tt, 2.2, 2.7)), scr = phys(tt, sc, 6, 0.5), up2 = tt > sc + 1 ? Math.max(0, Math.sin((tt - sc - 1) * 8)) * 10 * Math.exp(-(tt - sc - 1) * 1.2) : 0;
  const y = 260 - up1 * 46 - up2, rot = out1 * -9, W = 760, Hh = 600;
  return <>
    <div style={{ position: "absolute", left: 540, top: 200, width: 840, height: 40, background: "linear-gradient(180deg,#8d969c,#d6dbdf)", boxShadow: "inset 0 -8px 10px rgba(0,0,0,.35)" }} />
    <div style={{ position: "absolute", left: 540, top: 880, width: 840, height: 50, background: "linear-gradient(180deg,#d6dbdf,#8d969c)" }} />
    <div style={{ position: "absolute", left: 580, top: y, width: W, height: Hh, background: alu, boxShadow: "inset 0 0 0 4px #8a939a, 0 30px 60px rgba(0,0,0,.5)", transform: `rotateX(${rot}deg) translateZ(${out1 * 120}px)`, transformOrigin: "50% 0%" }}><Glass w={W} h={Hh} p={(tt * 0.2) % 1} /></div>
    <div style={{ position: "absolute", left: 920, top: 236 - 30 * (1 - cl(scr)), width: 60, height: 30, opacity: cl(scr * 3) }}>
      <div style={{ width: 60, height: 22, borderRadius: "50% 50% 6px 6px", background: "radial-gradient(circle at 40% 30%, #fff, #9aa0a5)", boxShadow: "0 6px 10px rgba(0,0,0,.45)" }} />
    </div>
    {up1 > 0.05 && <div style={{ position: "absolute", left: 900, top: 900, width: 240, height: 22, borderRadius: 6, background: "linear-gradient(90deg,#444,#bbb)", transform: `rotate(${-14 * up1}deg)` }} />}
    <Tag tt={tt} at={1.4} x={1650} y={420} txt={h.a ?? "LA SACAN ENTERA"} col={RED} size={44} />
    <Tag tt={tt} at={sc + 0.8} x={1650} y={560} txt={h.b ?? "TORNILLO: NO SUBE"} col={GRN} size={42} />
  </>;
}}</Stage>;

// ---------- 39 · EL VIDRIO CON PELÍCULA: golpe, se raja en telaraña y no se cae; el contador de golpes sube ----------
export const HCrack: React.FC<HP> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const hits = [1.0, 1.9, 2.7, 3.4, 4.0].filter((x) => tt > x).length, c = { x: 960, y: 520 }, cr = eio(tt, 1.0, 3.8);
  const lines = Array.from({ length: 14 }, (_, i) => { const a = (i / 14) * Math.PI * 2 + 0.2 * Math.sin(i * 3), L = 160 + (i * 97) % 260; return { a, L }; });
  const shake = tt > 1 ? Math.sin(tt * 60) * 6 * Math.exp(-((tt - [1.0, 1.9, 2.7, 3.4, 4.0][Math.max(0, hits - 1)]) * 8)) : 0;
  return <>
    <div style={{ position: "absolute", left: 460 + shake, top: 140, width: 1000, height: 760, border: "26px solid #5b3d22", boxSizing: "border-box", boxShadow: "0 50px 100px rgba(0,0,0,.6)", background: "linear-gradient(135deg, rgba(170,210,240,.35), rgba(90,130,170,.15) 60%, rgba(200,230,255,.3))", overflow: "hidden" }}>
      <svg width={1000} height={760} style={{ position: "absolute", left: -26, top: -26 }}>
        {lines.map((l, i) => <path key={i} d={`M ${c.x - 460} ${c.y - 140} l ${Math.cos(l.a) * l.L * 0.5} ${Math.sin(l.a) * l.L * 0.5} l ${Math.cos(l.a + 0.2) * l.L * 0.5} ${Math.sin(l.a + 0.2) * l.L * 0.5}`} stroke="rgba(255,255,255,.85)" strokeWidth={3} fill="none" pathLength={1} strokeDasharray={`${cr} 1`} />)}
        {[60, 120, 190].map((r, i) => <circle key={i} cx={c.x - 460} cy={c.y - 140} r={r} stroke="rgba(255,255,255,.55)" strokeWidth={2.5} fill="none" pathLength={1} strokeDasharray={`${cl(cr * 1.6 - i * 0.3)} 1`} />)}
      </svg>
      <Sheen p={(tt * 0.2) % 1} o={0.2} />
    </div>
    <div style={{ position: "absolute", left: 1560, top: 380, fontWeight: 900, fontSize: 170, color: AMB }}>{hits}<span style={{ fontSize: 50, color: DIM }}> GOLPES</span></div>
    <Tag tt={tt} at={4.4} x={1650} y={640} txt={h.lab ?? "Y NO SE CAE"} col={GRN} size={48} />
  </>;
}}</Stage>;

// ---------- 40 · LA BANDEROLA: las tiras de vidrio se deslizan de a una; con silicona en los clips, no salen ----------
export const HLouvers: React.FC<HP> = ({ t, h }) => <Stage t={t} h={h} mode="shutter" bg="linear-gradient(180deg,#e6e1d6,#b8b0a2)">{(tt) => {
  const sil = h.silAt ?? 3.6, n = 6;
  return <>
    <div style={{ position: "absolute", left: 1000, top: 160, width: 640, height: 760, border: "24px solid #f2f2ef", boxSizing: "border-box", background: "#1a1d22", boxShadow: "0 40px 90px rgba(0,0,0,.45)" }}>
      {Array.from({ length: n }, (_, i) => { const out = tt < sil ? eIn(tt, 0.8 + i * 0.4, 1.3 + i * 0.4) : 1 - eio(tt, sil, sil + 0.6); const dot = tt > sil + 0.6 ? cl(phys(tt, sil + 0.6 + i * 0.18, 8, 0.5)) : 0;
        return <div key={i} style={{ position: "absolute", left: -10 + out * 760, top: 14 + i * 118, width: 612, height: 100, background: "linear-gradient(180deg, rgba(210,235,255,.75), rgba(140,180,215,.45))", transform: `rotate(-6deg) translateZ(${out * 80}px)`, boxShadow: "0 8px 12px rgba(0,0,0,.3)", opacity: 1 - out * 0.4 }}>
          {[0, 1].map((s) => <div key={s} style={{ position: "absolute", top: 30, [s ? "right" : "left"]: -18, width: 30, height: 40, background: "#9aa0a5", borderRadius: 4 }}>{dot > 0 && <div style={{ position: "absolute", left: 4, top: 6, width: 22, height: 26, borderRadius: "50%", background: "rgba(255,255,255,.9)", transform: `scale(${dot})` }} />}</div>)}
        </div>; })}
    </div>
    <Tag tt={tt} at={1.4} x={520} y={420} txt={h.a ?? "SE SACAN DE A UNA"} col="#9e1f16" size={58} />
    <Tag tt={tt} at={sil + 0.8} x={520} y={560} txt={h.b ?? "SILICONA EN LOS CLIPS"} col="#1e6b3e" size={58} />
  </>;
}}</Stage>;

// ---------- 41 · GRAVA Y ROSAL: cada paso suena «crunch» y el rosal con espinas crece bajo la ventana ----------
export const HGravel: React.FC<HP> = ({ t, h }) => <Stage t={t} h={h} mode="wipe" bg="linear-gradient(180deg,#0f1420,#1a2030 55%,#0d0f14)">{(tt) => {
  const rose = eio(tt, h.roseAt ?? 3.4, (h.roseAt ?? 3.4) + 1.4);
  return <>
    <div style={{ position: "absolute", left: 1120, top: 200, width: 460, height: 400, border: "20px solid #c9c2b4", boxSizing: "border-box", background: "linear-gradient(180deg,#ffd9a0,#c98a3c)", boxShadow: "0 0 80px rgba(255,200,120,.3)" }} />
    <div style={{ position: "absolute", left: 0, top: 790, width: 1920, height: 290, background: "radial-gradient(circle at 20% 30%, #6c665c 0 3px, transparent 4px) 0 0/22px 18px, radial-gradient(circle at 60% 70%, #8b8476 0 4px, transparent 5px) 0 0/30px 24px, #3c3934" }} />
    {Array.from({ length: 5 }, (_, i) => { const a = 0.6 + i * 0.55, k = cl(phys(tt, a, 8, 0.6)), x = 200 + i * 210, y = 860 + (i % 2) * 50;
      return <React.Fragment key={i}><svg width={80} height={130} viewBox="0 0 90 150" style={{ position: "absolute", left: x, top: y, transform: "rotate(-80deg)", opacity: k * 0.85 }}><ellipse cx={45} cy={50} rx={34} ry={46} fill="rgba(20,18,15,.8)" /><ellipse cx={45} cy={122} rx={24} ry={24} fill="rgba(20,18,15,.8)" /></svg>
        <div style={{ position: "absolute", left: x + 10, top: y - 90, fontFamily: MARK, fontSize: 44, color: AMB, opacity: cl((tt - a) * 4) * (1 - cl((tt - a - 0.6) * 2)), transform: `translateY(${-(tt - a) * 40}px)` }}>CRUNCH</div></React.Fragment>; })}
    <svg width={700} height={420} viewBox="0 0 700 420" style={{ position: "absolute", left: 1000, top: 450 }}>
      {Array.from({ length: 7 }, (_, i) => { const x = 60 + i * 95, hh = (180 + (i * 53) % 120) * rose; return <g key={i}><path d={`M ${x} 400 Q ${x + 30} ${400 - hh / 2} ${x + 10} ${400 - hh}`} stroke="#2f5a2c" strokeWidth={10} fill="none" />
        {Array.from({ length: 4 }, (_, j) => <path key={j} d={`M ${x + 14} ${400 - hh * (0.25 + j * 0.2)} l 18 -8 l -16 -4 Z`} fill="#c9d7a5" opacity={rose} />)}
        <circle cx={x + 10} cy={400 - hh} r={26 * rose} fill="#d43a4a" /></g>; })}
    </svg>
    <Tag tt={tt} at={(h.roseAt ?? 3.4) + 1.2} x={1350} y={160} txt={h.lab ?? "CON ESPINAS, NO SE PARA"} col={GRN} size={44} />
  </>;
}}</Stage>;

// ---------- 42 · LA REJA CON TORNILLOS POR FUERA: el destornillador los saca y la reja se cae como un cuadro ----------
export const HBars: React.FC<HP> = ({ t, h }) => <Stage t={t} h={h} mode="blinds" bg="linear-gradient(180deg,#d9d2c4,#a69c8a)">{(tt) => {
  const sc = [0.9, 1.5, 2.1, 2.7], loose = sc.filter((x) => tt > x + 0.4).length, fall = eIn(tt, 3.3, 4.0), ep = h.epoxyAt ?? 4.6, back = eio(tt, ep, ep + 0.6);
  const off = fall * (1 - back), pos = [[0, 0], [1, 0], [0, 1], [1, 1]];
  return <>
    <div style={{ position: "absolute", left: 460, top: 200, width: 600, height: 680, background: "#20252c", boxShadow: "inset 0 0 0 20px #f2f2ef" }} />
    <div style={{ position: "absolute", left: 420, top: 160 + off * 360, width: 680, height: 760, transform: `rotate(${off * 12}deg) translateZ(${off * 140}px)`, transformOrigin: "50% 100%" }}>
      {Array.from({ length: 6 }, (_, i) => <div key={i} style={{ position: "absolute", left: 40 + i * 116, top: 0, width: 22, height: 760, background: "linear-gradient(90deg,#111,#555,#111)" }} />)}
      {[0, 1, 2].map((i) => <div key={"h" + i} style={{ position: "absolute", left: 0, top: 40 + i * 330, width: 680, height: 22, background: "linear-gradient(180deg,#111,#555,#111)" }} />)}
      {pos.map(([px, py], i) => { const tw = cl((tt - sc[i]) * 2.5), gone = tt > sc[i] + 0.4 && back < 0.5;
        return <div key={i} style={{ position: "absolute", left: px ? 630 : 10, top: py ? 690 : 30, width: 44, height: 44, borderRadius: "50%", background: "radial-gradient(circle at 35% 30%, #eee, #888)", transform: `rotate(${tw * 720}deg) translateZ(${gone ? 60 : 0}px)`, opacity: gone ? 0 : 1 }}>
          <div style={{ position: "absolute", left: 20, top: 6, width: 4, height: 32, background: "#333" }} />{back > 0 && <div style={{ position: "absolute", inset: -6, borderRadius: "50%", background: "#c8b98a", transform: `scale(${back})` }} />}</div>; })}
    </div>
    <div style={{ position: "absolute", left: 1360, top: 330, fontWeight: 900, fontSize: 150, color: RED }}>{loose}<span style={{ fontSize: 44, color: "#3a3226" }}> / 4</span></div>
    <Tag tt={tt} at={3.6} x={1520} y={580} txt={h.a ?? "5 MINUTOS, EN SILENCIO"} col="#3a3226" size={48} />
    <Tag tt={tt} at={ep + 0.6} x={1520} y={670} txt={h.b ?? "EPOXI: YA NO GIRA"} col="#1e6b3e" size={52} />
  </>;
}}</Stage>;

// ---------- 43 · LA VENTANITA DEL SÓTANO: el marco de la cabeza dice si pasa un cuerpo; la malla se teje ----------
export const HMesh: React.FC<HP> = ({ t, h }) => <Stage t={t} h={h} mode="iris" bg="linear-gradient(180deg,#2a241c,#14110c)">{(tt) => {
  const head = phys(tt, 0.9, 5, 0.55), mesh = eio(tt, h.meshAt ?? 3.0, (h.meshAt ?? 3.0) + 1.4), W = 600, Hh = 420, X = 660, Y = 330;
  return <>
    <div style={{ position: "absolute", left: 0, top: Y + Hh + 30, width: 1920, height: 300, background: "#4a3d2a" }} />
    <div style={{ position: "absolute", left: X - 24, top: Y - 24, width: W + 48, height: Hh + 48, background: "#8e8576", boxShadow: "0 30px 60px rgba(0,0,0,.6)" }} />
    <div style={{ position: "absolute", left: X, top: Y, width: W, height: Hh, background: "radial-gradient(ellipse at 50% 60%, #39342b, #0d0c0a)" }}>
      <svg width={W} height={Hh} style={{ position: "absolute" }}>
        <ellipse cx={W / 2} cy={Hh / 2 + 40} rx={110 * cl(head)} ry={140 * cl(head)} fill="rgba(255,190,120,.18)" stroke={AMB} strokeWidth={5} strokeDasharray="12 10" />
        {Array.from({ length: 16 }, (_, i) => <line key={i} x1={i * 40} y1={0} x2={i * 40 + Hh} y2={Hh} stroke="#b9b9b9" strokeWidth={5} pathLength={1} strokeDasharray={`${cl(mesh * 1.4 - i * 0.03)} 1`} />)}
        {Array.from({ length: 16 }, (_, i) => <line key={"b" + i} x1={i * 40} y1={Hh} x2={i * 40 + Hh} y2={0} stroke="#9a9a9a" strokeWidth={5} pathLength={1} strokeDasharray={`${cl(mesh * 1.4 - i * 0.03 - 0.2)} 1`} />)}
      </svg>
    </div>
    <Tag tt={tt} at={1.6} x={X + W / 2} y={Y - 70} txt={h.a ?? "PASA UNA CABEZA, PASA UN CUERPO"} col={AMB} size={42} />
    <Tag tt={tt} at={(h.meshAt ?? 3.0) + 1.2} x={960} y={Y + Hh + 130} txt={h.b ?? "+20 × 30 CM = MALLA"} col={GRN} size={60} />
  </>;
}}</Stage>;

// ---------- 44 · EL PESTILLO DE CHAPA: la punta del destornillador hace palanca y el ganchito se dobla ----------
export const HLatch: React.FC<HP> = ({ t, h }) => <Stage t={t} h={h} mode="split" bg="radial-gradient(ellipse 70% 60% at 50% 50%, #242a30, #08090b 78%)">{(tt) => {
  const lev = eio(tt, 1.2, 2.4), bend = eio(tt, 1.9, 2.6), slide = eio(tt, 2.8, 3.6);
  return <>
    <div style={{ position: "absolute", left: 300, top: 300, width: 640, height: 480, background: alu, boxShadow: "0 40px 80px rgba(0,0,0,.6)" }} />
    <div style={{ position: "absolute", left: 980 + slide * 160, top: 300, width: 640, height: 480, background: alu, boxShadow: "0 40px 80px rgba(0,0,0,.6)" }} />
    <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
      <path d={`M 860 500 L 990 500 Q ${1010 + 30 * bend} ${500 - 10 * bend} ${1000 + 40 * bend} ${470 - 50 * bend} L ${1000 + 40 * bend} ${430 - 60 * bend}`} stroke="#d9d9d9" strokeWidth={22} fill="none" strokeLinecap="round" />
      <rect x={840} y={470} width={60} height={70} rx={8} fill="#b8b8b8" />
    </svg>
    <div style={{ position: "absolute", left: 960, top: 720 - lev * 160, width: 26, height: 360, borderRadius: 6, background: "linear-gradient(90deg,#666,#ddd,#777)", transform: `rotate(${-8 - lev * 18}deg)`, transformOrigin: "50% 0%" }} />
    <div style={{ position: "absolute", left: 930, top: 1000 - lev * 160, width: 86, height: 200, borderRadius: 20, background: "linear-gradient(90deg,#c4231a,#ff5a4a,#c4231a)", transform: `rotate(${-8 - lev * 18}deg)`, transformOrigin: "50% -280px" }} />
    <Tag tt={tt} at={2.7} x={960} y={200} txt={h.lab ?? "SE DOBLA SIN RUIDO"} col={RED} size={60} />
    <div style={{ position: "absolute", left: 960, top: 800, transform: "translateX(-50%)", fontWeight: 900, fontSize: 140, color: AMB, opacity: cl(tt - 3) }}>{h.v ?? "4"}<span style={{ fontSize: 50, color: DIM }}> s</span></div>
  </>;
}}</Stage>;

// ---------- 45 · LA PLANILLA DEL RECORRIDO: la tabla en la mano; cada ventana se tacha con el lápiz ----------
export const HChecklist: React.FC<HP> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const I = (h.items ?? []) as { t: string; at: number }[], s = phys(tt, 0.1, 4, 0.5);
  return <>
    <div style={{ position: "absolute", left: 960, top: 540, width: 860, height: 980, marginLeft: -430, marginTop: -490, transform: `translateY(${(1 - s) * 700}px) rotate(${-3 + (1 - s) * 10}deg)`, borderRadius: 26, background: "#8a5c32", boxShadow: "0 60px 120px rgba(0,0,0,.7)" }}>
      <div style={{ position: "absolute", left: 300, top: -30, width: 260, height: 80, borderRadius: 16, background: "linear-gradient(180deg,#e6e6e6,#8d8d8d)" }} />
      <div style={{ position: "absolute", left: 40, top: 70, right: 40, bottom: 40, background: "#fbf8f0", padding: "40px 50px", fontFamily: HAND, color: "#2b241b" }}>
        <div style={{ fontSize: 60, fontWeight: 700, marginBottom: 14 }}>{h.title ?? "Mis ventanas"}</div>
        {I.map((c, i) => { const w = cl(phys(tt, c.at, 6, 0.6)), x = eio(tt, c.at + 0.6, c.at + 1.1);
          return <div key={i} style={{ position: "relative", fontSize: 52, fontWeight: 700, height: 100, lineHeight: "100px", borderBottom: "2px solid #cfd8e3", clipPath: `inset(0 ${(1 - w) * 100}% 0 0)` }}>{c.t}
            <div style={{ position: "absolute", left: -10, top: 50, height: 6, width: `${x * 100}%`, background: "#c4231a", borderRadius: 3, transform: "rotate(-1.5deg)" }} /></div>; })}
      </div>
    </div>
  </>;
}}</Stage>;
