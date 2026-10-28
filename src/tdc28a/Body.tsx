// tdc28a (desde tdc30agua) · EL VIDEO ENTERO (locución 0 → final). Un solo mundo (el taller con la salamandra, la olla, el tanque y los serpentines)
// y una sola cámara; el avatar entra y sale por la boca de su estufa (portal); las fotos/clips entran por tramos (plan.json, cada uno
// anclado a su frase); las piezas también vienen de plan.json (piezas.py → frase del ASR). Audio fuera de Remotion (encfin).
import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";
import PLAN from "./plan.json";
import { BigNum, COL, FONT, LowerThird, P, Vid, e, ei, extrude, spr } from "./lib";
import { CheckList, MistakesDeal, Mistake, NextCard, StepTitle, Words } from "./comps2";
import { Avatar, Chip, Clip, Desc, OK, Shot, Stamp, WIN, World } from "./parts";
import { TempChart, TimeBars, Versus } from "./comps2";
import { CamaraMano } from "../kits/camara/CamaraMano";

type Seg = [number, number, string, string];
type Ov = { k: string; at: number; out: number; [x: string]: any };
type Cta = { guide?: number; five?: number; book?: number; page?: number; desc: number; end: number; manual?: string; img?: string; pageTxt?: string };
type Txt = { recapTitle: string; recap: string[]; ask: [string, string, string]; next: [string, string]; lower: [number, number] };
const PL = PLAN as unknown as { segs: Seg[]; ov: Ov[]; cta1: Cta; cta2: Cta; cta3: Cta; end: number; txt: Txt };
export const END = PL.end;
const C: Record<string, string> = { amber: COL.amber, ice: COL.ice, red: COL.red, ink: COL.ink, green: "#7dff9e" };
const EDGE: Record<string, string> = { amber: "#5a2a00", ice: "#0a2a44", red: "#4a0a00", ink: "#3a3026", green: "#0a3a1a" };

// ===== la BASE: foto/clip del tramo (con zoom lento) o el mundo =====
const base = (t: number): React.ReactNode => {
  const g = PL.segs.find(([a, b]) => t >= a && t < b);
  if (!g) return <World t={t} />;
  const [a, , , id] = g;
  // clip de Veo (8 s, ya con movimiento): va entero desde su cuadro 0; si todavía no llegó, el mundo
  if (id.startsWith("v")) return OK.has(id) ? <AbsoluteFill style={{ transform: `scale(${1.02 + 0.04 * e(t, a, a + 8)})` }}><Vid id={"veo/" + id} at={a} /></AbsoluteFill> : <World t={t} />;
  // si llegó el clip LTX de esa foto va el clip; si no, la foto
  return <Clip k={"c_" + id} t={t} a={a}><Shot k={id} t={t} a={a} /></Clip>;
};

// el avatar entra y sale con CORTE SECO (vara fe02): ni portal ni fundido
const Stage: React.FC<{ t: number }> = ({ t }) => (WIN.some((x) => t >= x.ms && t < x.me) ? <Avatar t={t} /> : <>{base(t)}</>);

// número de temperatura que corre de a → b (con el termómetro de color)
const TempRun: React.FC<{ t: number; at: number; out: number; a: number; b: number; sub: string; col: string }> = ({ t, at, out, a, b, sub, col }) => {
  const o = e(t, at, at + 0.12) * (1 - e(t, out, out + 0.3)); if (o <= 0.01) return null;
  const k = Math.min(1, spr(t, at, 0.9)), v = Math.round(a + (b - a) * ei(t, at + 0.25, at + 1.6));
  const fill = Math.max(0.06, Math.min(1, v / 75));
  return <div style={{ position: "absolute", left: 1380, top: 520, opacity: o, transform: `translate(-50%,-50%) perspective(1200px) translateZ(${(1 - k) * -700}px) rotateY(-10deg)`, display: "flex", alignItems: "center", gap: 34, fontFamily: FONT }}>
    <div style={{ position: "relative", width: 64, height: 420, borderRadius: 32, background: "rgba(255,255,255,.14)", border: "5px solid rgba(255,255,255,.75)", boxShadow: "0 30px 60px rgba(0,0,0,.6)", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: `${fill * 100}%`, background: `linear-gradient(0deg, ${COL.ice}, ${v > 35 ? COL.amber : COL.ice}, ${v > 55 ? COL.red : v > 35 ? COL.amber : COL.ice})` }} />
    </div>
    <div style={{ textAlign: "left" }}>
      <div style={{ fontSize: 46, fontWeight: 800, color: COL.dim, letterSpacing: 4, textShadow: extrude(3, "#000") }}>{a} °C →</div>
      <div style={{ fontSize: 210, fontWeight: 900, lineHeight: 1, color: C[col] ?? COL.amber, textShadow: extrude(16, EDGE[col] ?? "#5a2a00") }}>{v} °C</div>
      <div style={{ fontSize: 38, fontWeight: 800, color: COL.ink, letterSpacing: 4, maxWidth: 760, textShadow: extrude(3, "#000") }}>{sub}</div>
    </div>
  </div>;
};

// el reloj del día de julio (arriba a la derecha): las agujas corren a cada hora que nombra
const DayClock: React.FC<{ t: number; at: number; out: number; marks: [number, number][] }> = ({ t, at, out, marks }) => {
  const o = e(t, at, at + 0.3) * (1 - e(t, out, out + 0.4)); if (o <= 0.01) return null;
  let h = marks[0][1];
  for (let i = 1; i < marks.length; i++) h += (marks[i][1] - marks[i - 1][1]) * ei(t, marks[i][0], marks[i][0] + 1.2);
  const hh = Math.floor(h), mm = Math.round((h - hh) * 60);
  const ang = (x: number) => x * 30, mAng = (h % 1) * 360;
  const day = h >= 8 && h < 18.5;
  return <div style={{ position: "absolute", right: 90, top: 70, opacity: o, display: "flex", alignItems: "center", gap: 22, padding: "16px 26px", borderRadius: 26, background: "rgba(10,14,22,.9)", boxShadow: "0 24px 50px rgba(0,0,0,.6)", fontFamily: FONT }}>
    <svg width={130} height={130} viewBox="-65 -65 130 130">
      <circle r={60} fill="#f4efe6" stroke={day ? COL.amber : COL.ice} strokeWidth={6} />
      {Array.from({ length: 12 }, (_, i) => <line key={i} x1={0} y1={-50} x2={0} y2={-42} stroke="#333" strokeWidth={4} transform={`rotate(${i * 30})`} />)}
      <line x1={0} y1={8} x2={0} y2={-30} stroke="#1a1a1a" strokeWidth={7} strokeLinecap="round" transform={`rotate(${ang(h % 12)})`} />
      <line x1={0} y1={10} x2={0} y2={-46} stroke="#1a1a1a" strokeWidth={4} strokeLinecap="round" transform={`rotate(${mAng})`} />
      <circle r={5} fill={COL.red} />
    </svg>
    <div>
      <div style={{ fontWeight: 900, fontSize: 64, color: COL.ink, lineHeight: 1 }}>{String(hh).padStart(2, "0")}:{String(mm).padStart(2, "0")}</div>
      <div style={{ fontWeight: 800, fontSize: 26, color: day ? COL.amber : COL.ice, letterSpacing: 4 }}>{day ? "☀ SOL" : "🔥 SALAMANDRA"}</div>
    </div>
  </div>;
};

// el repaso: las 11 formas se encienden una por una + los 5 errores
const NAMES = PL.txt.recap;
const Recap: React.FC<{ t: number; at: number; out: number; rows: number[] }> = ({ t, at, out, rows }) => {
  const o = e(t, at, at + 0.3) * (1 - e(t, out, out + 0.4)); if (o <= 0.01) return null;
  return <AbsoluteFill style={{ opacity: o }}>
    <AbsoluteFill style={{ background: "rgba(6,8,12,.62)" }} />
    <div style={{ position: "absolute", left: 960, top: 545, transform: "translate(-50%,-50%) perspective(1500px) rotateX(6deg)", width: 1640, fontFamily: FONT }}>
      <div style={{ textAlign: "center", fontWeight: 900, fontSize: 64, letterSpacing: 10, color: COL.amber, textShadow: extrude(6, "#5a2a00"), marginBottom: 24 }}>{PL.txt.recapTitle}</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px 40px" }}>
        {NAMES.map((n, i) => {
          const k = Math.min(1, spr(t, rows[i], 1.1)), on = t >= rows[i];
          const cur = on && (i === NAMES.length - 1 ? t < rows[i + 1] : t < rows[i + 1]);
          return <div key={i} style={{ display: "flex", alignItems: "center", gap: 20, padding: "10px 22px", borderRadius: 16, background: cur ? "rgba(255,178,87,.22)" : "rgba(255,255,255,.06)", boxShadow: cur ? `0 0 0 3px ${COL.amber}` : undefined, opacity: on ? 1 : 0.32, transform: `scale(${on ? 0.96 + 0.04 * k : 0.96})` }}>
            <div style={{ width: 66, height: 66, borderRadius: 14, background: on ? COL.amber : "rgba(255,255,255,.2)", color: "#1a1006", fontWeight: 900, fontSize: 40, display: "flex", alignItems: "center", justifyContent: "center" }}>{i + 1}</div>
            <div style={{ fontWeight: 900, fontSize: 42, color: COL.ink }}>{n}</div>
          </div>;
        })}
        <div style={{ display: "flex", alignItems: "center", gap: 20, padding: "10px 22px", borderRadius: 16, background: t >= rows[NAMES.length] ? "rgba(255,74,61,.25)" : "rgba(255,255,255,.06)", opacity: t >= rows[NAMES.length] ? 1 : 0.32 }}>
          <div style={{ width: 66, height: 66, borderRadius: 14, background: COL.red, color: "#fff", fontWeight: 900, fontSize: 40, display: "flex", alignItems: "center", justifyContent: "center" }}>5</div>
          <div style={{ fontWeight: 900, fontSize: 42, color: COL.ink }}>Los 5 errores</div>
        </div>
      </div>
    </div>
  </AbsoluteFill>;
};

// tarjeta de comentario que pide la respuesta del espectador
const AskCard: React.FC<{ t: number; at: number; out: number }> = ({ t, at, out }) => {
  const o = e(t, at, at + 0.2) * (1 - e(t, out, out + 0.3)); if (o <= 0.01) return null;
  const k = Math.min(1, spr(t, at, 0.9));
  return <div style={{ position: "absolute", left: 960, top: 300, opacity: o, transform: `translate(-50%,-50%) scale(${0.7 + 0.3 * k})`, background: "rgba(18,20,24,.95)", borderRadius: 26, padding: "26px 40px", width: 1180, fontFamily: FONT, boxShadow: "0 50px 100px rgba(0,0,0,.7)" }}>
    <div style={{ color: "rgba(255,255,255,.6)", fontWeight: 800, fontSize: 28, letterSpacing: 3 }}>💬 {PL.txt.ask[0]}</div>
    <div style={{ color: "#fff", fontWeight: 900, fontSize: 52, marginTop: 10, lineHeight: 1.15 }}>{PL.txt.ask[1]}</div>
    <div style={{ color: COL.ice, fontWeight: 800, fontSize: 38, marginTop: 8 }}>{PL.txt.ask[2]}</div>
  </div>;
};

// ===== CTA: la guía en 3D sobre el banco → el manual avanza → la página REAL (2D, el libro 3D abierto queda negro) + QR =====
const QR: React.FC<{ t: number; at: number; out: number; x?: number; y?: number }> = ({ t, at, out, x = 560, y = 560 }) => {
  const o = e(t, at, at + 0.25) * (1 - e(t, out, out + 0.3)); if (o <= 0.01) return null;
  const k = Math.min(1, spr(t, at, 0.9));
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) perspective(1300px) rotateY(${(1 - k) * 50 + 8}deg) scale(${0.8 + 0.2 * k})`, background: "#fff", borderRadius: 24, padding: 22, width: 400, textAlign: "center", fontFamily: FONT, boxShadow: "0 50px 100px rgba(0,0,0,.7)" }}>
    <Img src={staticFile(P + "qr.png")} style={{ width: 356, height: 356, imageRendering: "pixelated", display: "block" }} />
    <div style={{ fontWeight: 900, fontSize: 30, color: "#1a1006", marginTop: 10, letterSpacing: 1 }}>📷 ESCANEA CON LA CÁMARA</div>
    <div style={{ fontWeight: 800, fontSize: 22, color: "#5a4a36", marginTop: 6, lineHeight: 1.25 }}>El link está en la primera línea de la descripción</div>
  </div>;
};
const GuidePage: React.FC<{ t: number; at: number; out: number; img: string }> = ({ t, at, out, img }) => {
  const o = e(t, at, at + 0.3) * (1 - e(t, out, out + 0.4)); if (o <= 0.01) return null;
  const k = Math.min(1, spr(t, at, 0.8)), z = 1 + 0.06 * e(t, at, out);
  return <AbsoluteFill style={{ opacity: o }}>
    <AbsoluteFill style={{ background: "rgba(6,4,3,.55)" }} />
    <div style={{ position: "absolute", left: 1270, top: 545, perspective: 1600 }}>
      <div style={{ transform: `translate(-50%,-50%) translateZ(${(1 - k) * -700}px) rotateY(${-14 + 6 * k}deg) rotateX(4deg) rotateZ(1.5deg) scale(${z})`, width: 700, boxShadow: "0 60px 120px rgba(0,0,0,.8)", borderRadius: 8, overflow: "hidden" }}>
        <Img src={staticFile(P + img + ".jpg")} style={{ width: "100%", display: "block" }} />
        {/* el título de la página, resaltado */}
        <div style={{ position: "absolute", left: "7%", right: "6%", top: "7.6%", height: "4.8%", background: "rgba(255,214,10,.38)", borderRadius: 6, transformOrigin: "0 50%", transform: `scaleX(${e(t, at + 0.8, at + 1.4)})` }} />
      </div>
    </div>
  </AbsoluteFill>;
};
const CTA: React.FC<{ t: number; c: Cta; manual: string; img: string; pageTxt: string }> = ({ t, c, manual, img, pageTxt }) => <>
  {c.guide !== undefined && <Chip t={t} at={c.guide} out={(c.book ?? c.page ?? c.desc) - 0.15} text="📘 EL INVIERNO SIN GAS · 5 MANUALES DEL TALLER" />}
  {c.book !== undefined && <Chip t={t} at={c.book} out={c.desc - 0.15} text={manual} col={COL.ice} />}
  {c.page !== undefined && <GuidePage t={t} at={c.page} out={c.end - 0.4} img={img} />}
  {c.page !== undefined && <Chip t={t} at={c.page + 0.4} out={c.end - 0.4} text={pageTxt} x={110} y={200} />}
  {c.page !== undefined && <QR t={t} at={c.page + 1.2} out={c.end - 0.4} />}
  <Desc t={t} at={c.desc} out={c.end - 0.3} x={c.page !== undefined ? 1180 : avOn(c.desc, c.end) ? 480 : 960} scale={avOn(c.desc, c.end) && c.page === undefined ? 0.6 : 0.78} />
</>;

// sobre el avatar, el rótulo de paso y la descripción van a la izquierda y más chicos: nunca tapan la cara
const avOn = (a: number, b: number) => WIN.some((w) => a < w.me && b > w.ms);
const Piece: React.FC<{ t: number; o: Ov }> = ({ t, o }) => {
  if (t < o.at - 0.6 || t > o.out + 0.8) return null;
  const col = C[o.col] ?? COL.amber;
  switch (o.k) {
    case "chip": return <Chip t={t} at={o.at} out={o.out} text={o.txt} col={col} />;
    case "big": return <BigNum t={t} at={o.at} out={o.out} text={o.txt} sub={o.sub || undefined} x={1350} y={470} size={o.txt.length > 7 ? 150 : 210} col={col} edge={EDGE[o.col] ?? "#5a2a00"} />;
    case "words": return <Words t={t} items={o.items.map((x: any) => ({ at: x.at, txt: x.txt, col: C[x.col] ?? COL.ink }))} out={o.out} y={200} size={96} />;
    case "stamp": return <Stamp t={t} at={o.at} out={o.out} text={o.txt} x={960} y={250} size={o.txt.length > 22 ? 64 : 80} />;
    case "step": return <StepTitle t={t} at={o.at} out={o.out} n={o.n} name={o.name} {...(avOn(o.at, o.out) ? { x: 470, y: 540, sc: 0.62 } : {})} />;
    case "mistake": return <Mistake t={t} at={o.at} out={o.out} n={o.n} txt={o.txt} />;
    case "check": return <CheckList t={t} title={o.title} rows={o.rows} out={o.out} />;
    case "temp": return <TempRun t={t} at={o.at} out={o.out} a={o.a} b={o.b} sub={o.sub} col={o.col} />;
    case "deal": return <MistakesDeal t={t} at={o.at} out={o.out} />;
    case "clock": return <DayClock t={t} at={o.at} out={o.out} marks={o.marks} />;
    case "recap": return <Recap t={t} at={o.at} out={o.out} rows={o.rows} />;
    case "bars": return <TimeBars t={t} rows={o.rows} out={o.out} y={o.y ?? 300} />;
    case "chart": return <TempChart t={t} at={o.at} pts={o.pts} nb={o.nb} out={o.out} />;
    case "versus": return <Versus t={t} at={o.at} out={o.out} L={o.L} R={o.R} title={o.title} />;
    case "ask": return <AskCard t={t} at={o.at} out={o.out} />;
    case "next": return <NextCard t={t} at={o.at} subAt={o.at + 1.6} out={o.out}><div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 60, color: COL.amber, textShadow: extrude(6, "#5a2a00") }}>{PL.txt.next[0]}</div><div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 32, color: COL.ink }}>{PL.txt.next[1]}</div></NextCard>;
  }
  return null;
};

export const Body: React.FC = () => {
  const t = useCurrentFrame() / 30;
  const fade = e(t, END - 1.4, END - 0.1);
  return <AbsoluteFill style={{ background: "#000" }}>
    {/* cámara a mano virtual (balanceo lento, no temblor) sobre todo lo que se filma: mundo, fotos, clips y avatar */}
    <CamaraMano intensidad={0.8}><Stage t={t} /></CamaraMano>
    <LowerThird t={t} at={PL.txt.lower[0]} out={PL.txt.lower[1]} name="CLAUDIO" l2="TALLER DE CLAUDIO · MENDOZA" l2at={PL.txt.lower[0] + 1} />
    <CTA t={t} c={PL.cta1} manual={PL.cta1.manual ?? ""} img={PL.cta1.img ?? ""} pageTxt={PL.cta1.pageTxt ?? ""} />
    <CTA t={t} c={PL.cta2} manual={PL.cta2.manual ?? ""} img={PL.cta2.img ?? ""} pageTxt={PL.cta2.pageTxt ?? ""} />
    <CTA t={t} c={PL.cta3} manual="" img="" pageTxt="" />
    {PL.ov.map((o, i) => <Piece key={i} t={t} o={o} />)}
    <AbsoluteFill style={{ background: "#000", opacity: fade }} />
  </AbsoluteFill>;
};
