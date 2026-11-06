// ola1_C · ARQUETIPOS de componentes 2.5D (sin three: nada de bloom/NaN/z-fighting en el farm). Cada video usa cada uno UNA vez
// (heroes.tsx: toma C → arquetipo + datos). Vara: objeto/foto que se entiende sin leer, elementos de a uno con resorte con peso,
// cámara curva (Stage), entrada/salida fundida con máscara distinta, texto mínimo y grande, nada en la esquina superior izquierda.
import React from "react";
import { Img } from "remotion";
import { ARQ2 } from "./arq2";
import { Stage, phys, cl, eio, img, TX, DIM, AMB, RED, GRN, HAND, MARK, FONT, type H, type Mode } from "./hkit";

type P = { t: number; h: H };
const ICE = "#8fd6ff";
const sh = "0 4px 0 rgba(0,0,0,.85), 0 10px 30px rgba(0,0,0,.8)";
const card = "0 40px 90px rgba(0,0,0,.65), 0 0 0 1px rgba(255,255,255,.08)";
const dur = (h: H) => Math.max(2, h.out - h.at);
// reparte n apariciones a lo largo de la pieza (deja 1/4 final para respirar)
const stag = (h: H, i: number, n: number, d0 = 0.35) => d0 + (i * Math.max(0.35, (dur(h) * 0.72 - d0))) / Math.max(1, n);
const Big: React.FC<{ s: number; children: React.ReactNode; size?: number; col?: string; style?: React.CSSProperties }> = ({ s, children, size = 90, col = TX, style }) =>
  <div style={{ opacity: cl(s * 1.8), transform: `translateY(${(1 - s) * 40}px) scale(${0.85 + 0.15 * s})`, fontWeight: 900, fontSize: size, color: col, textShadow: sh, lineHeight: 1.05, ...style }}>{children}</div>;
const Ph: React.FC<{ id?: string; w: number; h: number; style?: React.CSSProperties; z?: number }> = ({ id, w, h, style, z = 1.12 }) =>
  <div style={{ width: w, height: h, borderRadius: 14, overflow: "hidden", background: "#1b1b1e", boxShadow: card, ...style }}>{id && <Img src={img(id)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${z})`, transformOrigin: "0% 0%" }} />}</div>;
const abs = (x: number, y: number, extra: React.CSSProperties = {}): React.CSSProperties => ({ position: "absolute", left: x, top: y, ...extra });

// 1 · contador: el número sube dentro de un anillo que se completa
export const Contador: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const k = eio(tt, 0.3, Math.min(3.2, dur(h) * 0.6)), n = Math.round((h.n ?? 100) * k), R = 230, C = 2 * Math.PI * R;
  return <>
    <svg width={620} height={620} style={abs(650, 160)}><circle cx={310} cy={310} r={R} stroke="rgba(255,255,255,.1)" strokeWidth={34} fill="none" />
      <circle cx={310} cy={310} r={R} stroke={h.col ?? AMB} strokeWidth={34} fill="none" strokeDasharray={C} strokeDashoffset={C * (1 - k)} strokeLinecap="round" transform="rotate(-90 310 310)" /></svg>
    <div style={abs(960, 470, { transform: "translate(-50%,-50%)", textAlign: "center" })}><Big s={phys(tt, 0.2, 6, 0.5)} size={170}>{(h.pre ?? "") + n.toLocaleString("en-US") + (h.unit ?? "")}</Big></div>
    <div style={abs(960, 850, { transform: "translateX(-50%)", whiteSpace: "nowrap" })}><Big s={phys(tt, 0.9, 6, 0.5)} size={58} col={h.col ?? AMB}>{h.label}</Big></div>
  </>; }}</Stage>;

// 2 · versus: dos fotos que caen con peso, una gana (✓) y la otra se apaga (✗)
export const Versus: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const [a, b] = h.imgs ?? [], win = h.win ?? 1, j = eio(tt, 1.6, 2.4);
  return <>{[a, b].map((id, i) => { const s = phys(tt, 0.3 + i * 0.4, 6, 0.45), good = i === win;
    return <div key={i} style={abs(250 + i * 760, 210, { transform: `translateY(${(1 - s) * -500}px) rotate(${(i ? 2 : -2) * s}deg) scale(${good ? 1 + 0.05 * j : 1 - 0.05 * j})`, filter: good ? undefined : `grayscale(${j}) brightness(${1 - 0.45 * j})` })}>
      <Ph id={id} w={660} h={440} />
      <div style={{ marginTop: 26, textAlign: "center", fontWeight: 900, fontSize: 52, color: good ? GRN : RED, textShadow: sh }}>{(good ? "✓ " : "✗ ") + (h.labels?.[i] ?? "")}</div>
    </div>; })}
    <div style={abs(960, 430, { transform: `translate(-50%,-50%) scale(${phys(tt, 0.9, 7, 0.4)})`, fontFamily: MARK, fontSize: 90, color: AMB, textShadow: sh })}>VS</div></>; }}</Stage>;

// 3 · lista que se tilda renglón por renglón (tilde dibujado)
export const Tildes: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const rows: string[] = h.rows ?? [];
  return <div style={abs(420, 1080 / 2 - rows.length * 62, {})}>{rows.map((r, i) => { const a = stag(h, i, rows.length), s = phys(tt, a, 7, 0.5), c = eio(tt, a + 0.3, a + 0.7);
    return <div key={i} style={{ display: "flex", alignItems: "center", gap: 36, height: 124, opacity: cl(s * 2), transform: `translateX(${(1 - s) * -80}px)` }}>
      <svg width={84} height={84}><rect x={4} y={4} width={76} height={76} rx={16} fill="rgba(255,255,255,.08)" stroke="rgba(255,255,255,.5)" strokeWidth={4} />
        <path d="M18 44 L36 62 L68 22" stroke={GRN} strokeWidth={10} fill="none" strokeLinecap="round" strokeDasharray={80} strokeDashoffset={80 * (1 - c)} /></svg>
      <div style={{ fontWeight: 900, fontSize: 62, color: TX, textShadow: sh }}>{r}</div></div>; })}</div>; }}</Stage>;

// 4 · sello: la foto cae sobre la mesa y un sello golpea encima
export const Sello: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const s = phys(tt, 0.2, 6, 0.5), a = Math.min(1.6, dur(h) * 0.35), k = phys(tt, a, 9, 0.55), o = cl((tt - a) * 8);
  return <>
    <div style={abs(960, 520, { transform: `translate(-50%,-50%) rotate(${-3 + 2 * s}deg) translateY(${(1 - s) * -300}px)` })}><Ph id={h.imgs?.[0]} w={1080} h={640} z={1.15} /></div>
    <div style={abs(960, 520, { opacity: o, transform: `translate(-50%,-50%) rotate(-11deg) scale(${2.6 - 1.6 * cl(k)})`, border: `14px solid ${h.col ?? RED}`, borderRadius: 18, padding: "8px 44px", fontFamily: FONT, fontWeight: 900, fontSize: 130, color: h.col ?? RED, letterSpacing: 6, background: "rgba(20,0,0,.25)", whiteSpace: "nowrap", textShadow: "0 4px 12px rgba(0,0,0,.6)" })}>{h.word}</div>
  </>; }}</Stage>;

// 5 · línea de tiempo: la cámara la recorre y cada año se clava con su rótulo
export const Linea: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const it: { y: string; l: string }[] = h.items ?? [], n = it.length, x0 = 260, W = 1400;
  return <><div style={abs(x0, 560, { width: W * eio(tt, 0.2, 1.2), height: 8, borderRadius: 4, background: `linear-gradient(90deg, ${AMB}, ${ICE})` })} />
    {it.map((q, i) => { const a = stag(h, i, n, 0.6), s = phys(tt, a, 7, 0.45), x = x0 + (W * (i + 0.5)) / n, up = i % 2 === 0;
      return <div key={i} style={abs(x, 560, { transform: `translate(-50%,-50%)`, opacity: cl(s * 2) })}>
        <div style={{ width: 44, height: 44, borderRadius: 22, background: AMB, boxShadow: `0 0 30px ${AMB}`, transform: `scale(${s})`, margin: "0 auto" }} />
        <div style={{ position: "absolute", left: "50%", top: up ? -190 : 70, transform: `translateX(-50%) translateY(${(1 - s) * (up ? -40 : 40)}px)`, textAlign: "center", whiteSpace: "nowrap" }}>
          <div style={{ fontWeight: 900, fontSize: 76, color: TX, textShadow: sh }}>{q.y}</div><div style={{ fontWeight: 800, fontSize: 36, color: DIM }}>{q.l}</div></div></div>; })}</>; }}</Stage>;

// 6 · manómetro: la aguja tiembla y se clava en el valor
export const Manometro: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const v = h.v ?? 0.8, k = phys(tt, 0.5, 5, 0.32), ang = -120 + 240 * v * k + 1.5 * Math.sin(tt * 9) * cl(tt - 1);
  return <>
    <svg width={720} height={600} style={abs(600, 150)}><defs><linearGradient id="gz" x1="0" x2="1"><stop offset="0" stopColor={GRN} /><stop offset=".55" stopColor={AMB} /><stop offset="1" stopColor={RED} /></linearGradient></defs>
      <circle cx={360} cy={360} r={330} fill="#16181c" stroke="#c9ced4" strokeWidth={18} />
      <path d={`M ${360 - 260 * Math.sin(2.094)} ${360 + 260 * Math.cos(2.094)} A 260 260 0 1 1 ${360 + 260 * Math.sin(2.094)} ${360 + 260 * Math.cos(2.094)}`} stroke="url(#gz)" strokeWidth={36} fill="none" />
      <g transform={`rotate(${ang} 360 360)`}><path d="M352 360 L360 120 L368 360 Z" fill={RED} /></g><circle cx={360} cy={360} r={30} fill="#d9dde1" />
      <text x={130} y={560} fill={DIM} fontSize={40} fontWeight={800} fontFamily={FONT}>{h.lo ?? "LOW"}</text><text x={590} y={560} textAnchor="end" fill={DIM} fontSize={40} fontWeight={800} fontFamily={FONT}>{h.hi ?? "HIGH"}</text></svg>
    <div style={abs(960, 880, { transform: "translateX(-50%)", whiteSpace: "nowrap" })}><Big s={phys(tt, 1.4, 6, 0.5)} size={64} col={AMB}>{h.label}</Big></div></>; }}</Stage>;

// 7 · polaroids que caen sobre la mesa con su epígrafe a mano
export const Polaroids: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const ids: string[] = (h.imgs ?? []).slice(0, 3), cap: string[] = h.caps ?? [];
  return <>{ids.map((id, i) => { const s = phys(tt, stag(h, i, ids.length, 0.2), 6, 0.45), r = [-8, 4, -3][i];
    return <div key={i} style={abs(230 + i * 520, 190 + (i % 2) * 70, { padding: "22px 22px 90px", background: "#f4f1ea", boxShadow: card, transform: `translateY(${(1 - s) * -700}px) rotate(${r * s + (1 - s) * 30}deg)` })}>
      <Ph id={id} w={420} h={400} style={{ borderRadius: 2, boxShadow: "none" }} /><div style={{ position: "absolute", left: 0, right: 0, bottom: 18, textAlign: "center", fontFamily: HAND, fontWeight: 700, fontSize: 52, color: "#26262a" }}>{cap[i]}</div></div>; })}</>; }}</Stage>;

// 8 · lupa: recorre la foto y agranda el detalle
export const Lupa: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => {
  const k = eio(tt, 0.6, Math.min(3, dur(h) * 0.6)), x = 300 + (h.x ?? 0.6) * 1300 * k + 200 * (1 - k), y = 280 + (h.y ?? 0.5) * 520 * k, R = 210;
  return <><div style={abs(160, 110)}><Ph id={h.imgs?.[0]} w={1600} h={860} z={1.12} /></div>
    <div style={abs(x - R, y - R, { width: 2 * R, height: 2 * R, borderRadius: R, overflow: "hidden", border: "16px solid #2a2a2e", boxShadow: "0 30px 70px rgba(0,0,0,.7), inset 0 0 40px rgba(0,0,0,.5)" })}>
      <Img src={img(h.imgs?.[0] ?? "")} style={{ position: "absolute", width: 1600 * 2.2 * 1.12, height: 860 * 2.2 * 1.12, left: -(x - 160) * 2.2 * 1.12 + R, top: -(y - 110) * 2.2 * 1.12 + R, objectFit: "cover" }} /></div>
    <div style={abs(x - 16, y + R - 10, { width: 34, height: 190, borderRadius: 16, background: "#2a2a2e", transform: "rotate(-40deg)", transformOrigin: "top" })} />
    {h.label && <div style={abs(960, 960, { transform: "translateX(-50%)", whiteSpace: "nowrap" })}><Big s={phys(tt, 1.8, 6, 0.5)} size={60} col={AMB}>{h.label}</Big></div>}</>; }}</Stage>;

// 9 · pasos: tarjetas numeradas que caen en cascada
export const Pasos: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const st: string[] = h.steps ?? [], n = st.length, W = Math.min(380, 1600 / n - 30);
  return <>{st.map((x, i) => { const s = phys(tt, stag(h, i, n), 6, 0.45);
    return <div key={i} style={abs(160 + i * (W + 30) + (1600 - n * (W + 30)) / 2, 300 + (i % 2) * 60, { width: W, height: 420, borderRadius: 26, background: "linear-gradient(180deg,#24272d,#16181c)", boxShadow: card, padding: 30, opacity: cl(s * 2), transform: `perspective(1400px) rotateY(${(1 - s) * 70}deg) translateY(${(1 - s) * 80}px)` })}>
      <div style={{ fontFamily: MARK, fontSize: 120, color: AMB, lineHeight: 1 }}>{i + 1}</div><div style={{ marginTop: 30, fontWeight: 900, fontSize: W > 300 ? 46 : 38, color: TX, lineHeight: 1.15 }}>{x}</div></div>; })}</>; }}</Stage>;

// 10 · reloj de pared: las agujas giran el tiempo que dura la cosa
export const Reloj: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const k = eio(tt, 0.4, Math.min(3.4, dur(h) * 0.7)), m = (h.min ?? 10) * k, R = 270;
  return <><svg width={640} height={640} style={abs(330, 210)}><circle cx={320} cy={320} r={R + 26} fill="#3a2a1a" /><circle cx={320} cy={320} r={R} fill="#f6f1e6" />
      <path d={`M320 320 L320 ${320 - R + 20} A ${R - 20} ${R - 20} 0 ${m / 60 > 0.5 ? 1 : 0} 1 ${320 + (R - 20) * Math.sin(m / 60 * 2 * Math.PI)} ${320 - (R - 20) * Math.cos(m / 60 * 2 * Math.PI)} Z`} fill={(h.col ?? AMB) + "88"} />
      {Array.from({ length: 12 }, (_, i) => <line key={i} x1={320 + (R - 20) * Math.sin(i * 0.5236)} y1={320 - (R - 20) * Math.cos(i * 0.5236)} x2={320 + (R - 46) * Math.sin(i * 0.5236)} y2={320 - (R - 46) * Math.cos(i * 0.5236)} stroke="#222" strokeWidth={i % 3 ? 5 : 11} />)}
      <line x1={320} y1={320} x2={320 + 220 * Math.sin(m / 60 * 2 * Math.PI)} y2={320 - 220 * Math.cos(m / 60 * 2 * Math.PI)} stroke="#111" strokeWidth={12} strokeLinecap="round" />
      <line x1={320} y1={320} x2={320 + 150 * Math.sin(m / 720 * 2 * Math.PI)} y2={320 - 150 * Math.cos(m / 720 * 2 * Math.PI)} stroke="#111" strokeWidth={18} strokeLinecap="round" /><circle cx={320} cy={320} r={16} fill={RED} /></svg>
    <div style={abs(1080, 420)}><Big s={phys(tt, 0.6, 6, 0.5)} size={150}>{Math.round(m)} {h.unit ?? "MIN"}</Big><Big s={phys(tt, 1.1, 6, 0.5)} size={52} col={AMB} style={{ marginTop: 14, maxWidth: 700 }}>{h.label}</Big></div></>; }}</Stage>;

// 11 · barras que crecen desde el piso, la última en color
export const Barras: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const b: { l: string; v: number }[] = h.bars ?? [], mx = Math.max(...b.map((x) => x.v), 1), n = b.length, W = Math.min(260, 1400 / n - 40);
  return <>{b.map((x, i) => { const a = stag(h, i, n), s = phys(tt, a, 5, 0.5), hh = 560 * (x.v / mx) * cl(s), last = i === (h.hl ?? n - 1);
    return <div key={i} style={abs(260 + i * (1400 / n) + (1400 / n - W) / 2, 860 - hh, { width: W, height: hh, borderRadius: "16px 16px 4px 4px", background: last ? `linear-gradient(180deg, ${h.col ?? RED}, #6a1a12)` : "linear-gradient(180deg,#8a93a0,#3e444c)", boxShadow: card })}>
      <div style={{ position: "absolute", top: -84, width: "100%", textAlign: "center", fontWeight: 900, fontSize: 60, color: TX, textShadow: sh, opacity: cl(s * 2) }}>{x.v}{h.unit ?? ""}</div>
      <div style={{ position: "absolute", top: hh + 20, width: "100%", textAlign: "center", fontWeight: 800, fontSize: 34, color: DIM }}>{x.l}</div></div>; })}</>; }}</Stage>;

// 12 · ticket que se imprime renglón por renglón, el total se marca
export const Ticket: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const rows: { i: string; p: string }[] = h.rows ?? [], n = rows.length, out = eio(tt, 0.2, 0.2 + 0.5 * (n + 1));
  return <div style={abs(960, 120, { transform: `translateX(-50%) rotate(-2deg)`, width: 640, height: 150 + (n + 1) * 92 * out, overflow: "hidden", background: "#f7f4ec", boxShadow: card, padding: "40px 46px", fontFamily: "'Courier New', monospace", color: "#222" })}>
    <div style={{ fontWeight: 900, fontSize: 40, textAlign: "center", letterSpacing: 4 }}>{h.title ?? "RECEIPT"}</div><div style={{ borderTop: "3px dashed #999", margin: "18px 0" }} />
    {rows.map((r, i) => <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 40, fontWeight: 700, height: 92, alignItems: "center" }}><span>{r.i}</span><span>{r.p}</span></div>)}
    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 52, fontWeight: 900, height: 92, alignItems: "center", background: `rgba(255,214,10,${0.6 * eio(tt, 0.5 * n + 0.6, 0.5 * n + 1)})`, borderTop: "3px solid #222" }}><span>TOTAL</span><span>{h.total}</span></div></div>; }}</Stage>;

// 13 · nota a mano en papel, clavada con una chinche (palabras del propio narrador)
export const Nota: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => {
  const s = phys(tt, 0.2, 5, 0.45), w: string[] = String(h.note ?? "").split(" "), k = eio(tt, 0.6, Math.min(dur(h) * 0.7, 0.6 + w.length * 0.22));
  return <div style={abs(960, 540, { transform: `translate(-50%,-50%) rotate(${-2 + 1.2 * Math.sin(tt * 0.6)}deg) scale(${0.8 + 0.2 * s})`, width: 1100, minHeight: 520, padding: "90px 80px", background: "linear-gradient(180deg,#fff9d8,#f1e7b8)", boxShadow: card, opacity: cl(s * 2) })}>
    <div style={{ position: "absolute", top: 26, left: "50%", width: 46, height: 46, borderRadius: 23, background: RED, boxShadow: "0 8px 14px rgba(0,0,0,.5)" }} />
    <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 84, color: "#1d2a4a", lineHeight: 1.15 }}>{w.slice(0, Math.ceil(w.length * k)).join(" ")}</div></div>; }}</Stage>;

// 14 · postal de la ciudad y el año (la historia arranca acá)
export const Postal: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const s = phys(tt, 0.2, 5, 0.45), f = eio(tt, 1.2, 2.2);
  return <div style={abs(960, 540, { transform: `translate(-50%,-50%) perspective(1600px) rotateY(${(1 - s) * -60 + 6 * Math.sin(tt * 0.3)}deg) rotate(-3deg)`, width: 1200, height: 760, background: "#efe6d2", boxShadow: card, padding: 34 })}>
    <Ph id={h.imgs?.[0]} w={1132} h={560} style={{ borderRadius: 4, filter: `sepia(${0.35 * (1 - f)})` }} />
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginTop: 26 }}><div style={{ fontFamily: MARK, fontSize: 74, color: "#7a2a1a" }}>{h.city}</div><div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 80, color: "#1d2a4a" }}>{h.year}</div></div></div>; }}</Stage>;

// 15 · antes / después: una cortina corta la foto en dos
export const Cortina: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const k = eio(tt, 0.8, Math.min(3, dur(h) * 0.6)), [a, b] = h.imgs ?? [];
  return <div style={abs(160, 120, { width: 1600, height: 840, borderRadius: 18, overflow: "hidden", boxShadow: card })}>
    <div style={abs(0, 0)}><Ph id={a} w={1600} h={840} style={{ borderRadius: 0, filter: "grayscale(.5) brightness(.8)" }} /></div>
    <div style={abs(0, 0, { width: 1600, height: 840, clipPath: `inset(0 0 0 ${100 - 100 * k}%)` })}><Ph id={b} w={1600} h={840} style={{ borderRadius: 0 }} /></div>
    <div style={abs(1600 - 1600 * k - 6, 0, { width: 12, height: 840, background: "#fff", boxShadow: "0 0 30px #fff" })} />
    <div style={abs(40, 740, { fontWeight: 900, fontSize: 56, color: RED, textShadow: sh, opacity: 1 - k })}>{h.labels?.[0]}</div>
    <div style={abs(1560, 740, { transform: "translateX(-100%)", fontWeight: 900, fontSize: 56, color: GRN, textShadow: sh, opacity: k, whiteSpace: "nowrap" })}>{h.labels?.[1]}</div></div>; }}</Stage>;

// 16 · termómetro que se llena hasta la marca
export const Termo: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const k = eio(tt, 0.5, Math.min(3, dur(h) * 0.6)), v = (h.from ?? 70) + ((h.to ?? 350) - (h.from ?? 70)) * k, fr = (v - (h.min ?? 0)) / ((h.max ?? 500) - (h.min ?? 0));
  return <><svg width={260} height={840} style={abs(520, 120)}><rect x={90} y={20} width={80} height={660} rx={40} fill="#e8ecef" /><rect x={106} y={36 + 628 * (1 - fr)} width={48} height={628 * fr + 20} rx={24} fill={RED} /><circle cx={130} cy={730} r={95} fill={RED} stroke="#e8ecef" strokeWidth={16} />
      {[0.25, 0.5, 0.75].map((q) => <line key={q} x1={176} y1={36 + 628 * (1 - q)} x2={220} y2={36 + 628 * (1 - q)} stroke="#e8ecef" strokeWidth={6} />)}</svg>
    <div style={abs(860, 380)}><Big s={phys(tt, 0.4, 6, 0.5)} size={180}>{Math.round(v)}{h.unit ?? "°F"}</Big><Big s={phys(tt, 1.2, 6, 0.5)} size={56} col={AMB} style={{ maxWidth: 900, marginTop: 10 }}>{h.label}</Big></div></>; }}</Stage>;

// 17 · almanaque: las hojas se arrancan y vuelan hasta el número
export const Almanaque: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const N = h.n ?? 8, k = eio(tt, 0.4, Math.min(3, dur(h) * 0.6)), cur = Math.round(1 + (N - 1) * k);
  return <><div style={abs(520, 190, { width: 520, height: 600, borderRadius: 18, background: "#fbfaf6", boxShadow: card, overflow: "hidden" })}>
      <div style={{ height: 130, background: RED, color: "#fff", fontWeight: 900, fontSize: 58, textAlign: "center", lineHeight: "130px", letterSpacing: 6 }}>{h.head ?? "DAY"}</div>
      <div style={{ textAlign: "center", fontWeight: 900, fontSize: 300, color: "#222", lineHeight: "440px" }}>{cur}</div></div>
    {Array.from({ length: 4 }, (_, i) => { const p = ((tt * 1.6 + i / 4) % 1) * (k < 1 ? 1 : 0); return p > 0.02 && <div key={i} style={abs(520 + 400 * p, 320 - 260 * p + 500 * p * p, { width: 520, height: 470, background: "#f1efe8", opacity: 1 - p, transform: `rotate(${50 * p}deg)`, boxShadow: card })} />; })}
    <div style={abs(1130, 430)}><Big s={phys(tt, 1, 6, 0.5)} size={58} col={AMB} style={{ maxWidth: 560 }}>{h.label}</Big></div></>; }}</Stage>;

// 18 · etiqueta de precio colgando de un hilo, se balancea
export const Precio: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => {
  const s = phys(tt, 0.2, 5, 0.3), sw = 9 * Math.exp(-0.7 * tt) * Math.sin(tt * 4) + 2 * Math.sin(tt * 0.9);
  return <><div style={abs(960, -40, { transformOrigin: "50% 0%", transform: `rotate(${sw}deg) translateY(${(1 - s) * -400}px)` })}>
      <div style={{ width: 4, height: 260, background: "#ccc", margin: "0 auto" }} />
      <div style={{ transform: "translateX(-50%)", marginLeft: 2, position: "relative", width: 640, height: 360, background: h.col ?? "#ffd25a", borderRadius: "30px 30px 30px 30px", clipPath: "polygon(16% 0, 100% 0, 100% 100%, 16% 100%, 0 50%)", boxShadow: card, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
        <div style={{ fontWeight: 900, fontSize: 150, color: "#1b1b1e", marginLeft: 70 }}>{h.price}</div><div style={{ fontWeight: 800, fontSize: 40, color: "#3b3320", marginLeft: 70 }}>{h.sub}</div></div></div>
    <div style={abs(960, 880, { transform: "translateX(-50%)", whiteSpace: "nowrap" })}><Big s={phys(tt, 1.2, 6, 0.5)} size={58} col={TX}>{h.label}</Big></div></>; }}</Stage>;

// 19 · palabras que caen con peso, una por una, la última en color
export const Caen: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const w: string[] = h.words ?? [], n = w.length;
  return <div style={abs(960, 540, { transform: "translate(-50%,-50%)", display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "10px 40px", width: 1600 })}>
    {w.map((x, i) => { const s = phys(tt, stag(h, i, n, 0.2), 8, 0.42); return <div key={i} style={{ fontWeight: 900, fontSize: h.size ?? 130, color: i === n - 1 ? (h.col ?? AMB) : TX, textShadow: sh, opacity: cl(s * 3), transform: `translateY(${(1 - s) * -260}px) rotate(${(1 - s) * (i % 2 ? 8 : -8)}deg)` }}>{x}</div>; })}</div>; }}</Stage>;

// 20 · ranking: los números se apilan como fichas, el actual se ilumina
export const Ranking: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const N = h.n ?? 7, cur = h.cur ?? 1;
  return <>{Array.from({ length: N }, (_, i) => { const num = N - i, s = phys(tt, 0.15 + i * 0.12, 7, 0.45), on = num === cur;
    return <div key={i} style={abs(960 - (N * 190) / 2 + i * 190, 360, { width: 160, height: 220, borderRadius: 24, background: on ? (h.col ?? RED) : "#25282e", boxShadow: on ? `0 0 60px ${(h.col ?? RED)}99, ${card}` : card, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: MARK, fontSize: 110, color: on ? "#fff" : "rgba(255,255,255,.35)", transform: `translateY(${(1 - s) * 400 + (on ? -40 * phys(tt, 1, 6, 0.4) : 0)}px) scale(${on ? 1 + 0.15 * phys(tt, 1, 6, 0.4) : 1})` })}>{num}</div>; })}
    <div style={abs(960, 720, { transform: "translateX(-50%)", whiteSpace: "nowrap" })}><Big s={phys(tt, 1.3, 6, 0.5)} size={80} col={TX}>{h.label}</Big></div></>; }}</Stage>;

// 21 · interruptor que cambia de estado (antes → después)
export const Llave: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const f = phys(tt, Math.min(1.8, dur(h) * 0.4), 8, 0.5), on = cl(f);
  return <><div style={abs(960, 420, { transform: "translate(-50%,-50%)", width: 520, height: 240, borderRadius: 120, background: on > 0.5 ? GRN : "#4a4f57", boxShadow: `inset 0 6px 20px rgba(0,0,0,.5), ${card}`, transition: "none" })}>
      <div style={abs(20 + 260 * on, 20, { width: 200, height: 200, borderRadius: 100, background: "#f4f6f8", boxShadow: "0 10px 30px rgba(0,0,0,.5)" })} /></div>
    <div style={abs(960, 640, { transform: "translateX(-50%)", textAlign: "center", whiteSpace: "nowrap" })}>
      <div style={{ fontWeight: 900, fontSize: 84, color: RED, textShadow: sh, opacity: 1 - on, textDecoration: on > 0.3 ? "line-through" : "none" }}>{h.a}</div>
      <div style={{ fontWeight: 900, fontSize: 84, color: GRN, textShadow: sh, opacity: on, marginTop: -100 + 100 * on }}>{h.b}</div></div></>; }}</Stage>;

// 22 · torta: el porcentaje se llena como una rebanada
export const Torta: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const p = (h.pct ?? 50) / 100 * eio(tt, 0.4, Math.min(2.6, dur(h) * 0.55)), R = 280, a = p * 2 * Math.PI;
  return <><svg width={640} height={640} style={abs(300, 220)}><circle cx={320} cy={320} r={R} fill="#2a2d33" />
      {p > 0.001 && <path d={`M320 320 L320 ${320 - R} A ${R} ${R} 0 ${p > 0.5 ? 1 : 0} 1 ${320 + R * Math.sin(a)} ${320 - R * Math.cos(a)} Z`} fill={h.col ?? AMB} />}<circle cx={320} cy={320} r={R * 0.45} fill="#16181c" /></svg>
    <div style={abs(1040, 400)}><Big s={phys(tt, 0.4, 6, 0.5)} size={190}>{Math.round(p * 100)}%</Big><Big s={phys(tt, 1, 6, 0.5)} size={58} col={AMB} style={{ maxWidth: 760 }}>{h.label}</Big></div></>; }}</Stage>;

// 23 · grilla de 4 fotos: tres se apagan, una se agranda
export const Grilla: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => {
  const ids: string[] = (h.imgs ?? []).slice(0, 4), pick = h.pick ?? 0, k = eio(tt, 1.6, 2.6);
  return <>{ids.map((id, i) => { const s = phys(tt, 0.2 + i * 0.18, 6, 0.5), on = i === pick, x = 260 + (i % 2) * 720, y = 110 + Math.floor(i / 2) * 440;
    return <div key={i} style={abs(x, y, { opacity: cl(s * 2) * (on ? 1 : 1 - 0.65 * k), transform: `scale(${(0.8 + 0.2 * s) * (on ? 1 + 0.12 * k : 1 - 0.06 * k)})`, zIndex: on ? 2 : 1, filter: on ? undefined : `grayscale(${k})` })}>
      <Ph id={id} w={680} h={400} style={{ boxShadow: on ? `0 0 0 ${8 * k}px ${h.col ?? GRN}, ${card}` : card }} />
      {h.caps?.[i] && <div style={abs(24, 330, { fontWeight: 900, fontSize: 44, color: TX, textShadow: sh })}>{h.caps[i]}</div>}</div>; })}</>; }}</Stage>;

// 24 · regla que se despliega y mide
export const Regla: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const k = eio(tt, 0.4, Math.min(2.4, dur(h) * 0.5)), L = 1400 * (h.frac ?? 0.7) * k;
  return <><div style={abs(260, 480, { width: 1400, height: 140, background: "linear-gradient(180deg,#f2d64a,#d9b52a)", borderRadius: 10, boxShadow: card, clipPath: `inset(0 ${100 - 100 * Math.min(1, k * 1.4)}% 0 0)` })}>
      {Array.from({ length: 57 }, (_, i) => <div key={i} style={abs(i * 25, 0, { width: 3, height: i % 4 ? 36 : 70, background: "#222" })} />)}</div>
    <div style={abs(260, 400, { width: L, height: 10, background: RED, borderRadius: 5, boxShadow: `0 0 20px ${RED}` })} />
    <div style={abs(260 + L, 300, { transform: "translateX(-50%)", whiteSpace: "nowrap" })}><Big s={phys(tt, 0.8, 6, 0.5)} size={92}>{h.val}</Big></div>
    <div style={abs(960, 720, { transform: "translateX(-50%)", whiteSpace: "nowrap" })}><Big s={phys(tt, 1.4, 6, 0.5)} size={58} col={AMB}>{h.label}</Big></div></>; }}</Stage>;

// 25 · lista negra: cada renglón se tacha con un trazo rojo
export const Tachar: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const it: string[] = h.items ?? [], n = it.length;
  return <div style={abs(960, 540, { transform: "translate(-50%,-50%)", textAlign: "center" })}>{it.map((x, i) => { const a = stag(h, i, n), s = phys(tt, a, 7, 0.5), c = eio(tt, a + 0.4, a + 0.8);
    return <div key={i} style={{ position: "relative", fontWeight: 900, fontSize: 80, color: c > 0.5 ? "rgba(247,244,238,.45)" : TX, textShadow: sh, opacity: cl(s * 2), height: 118, whiteSpace: "nowrap" }}>{x}
      <div style={{ position: "absolute", left: -20, top: 52, height: 12, width: `calc(${108 * c}% )`, background: RED, borderRadius: 6, transform: "rotate(-2deg)", boxShadow: `0 0 16px ${RED}` }} /></div>; })}</div>; }}</Stage>;

// 26 · recorrido: un punto viaja por las paradas y cada una se enciende
export const Recorrido: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const st: string[] = h.stops ?? [], n = st.length, pts = st.map((_, i) => [420 + (1080 * i) / Math.max(1, n - 1), 540 + (i % 2 ? -170 : 170)]), k = eio(tt, 0.5, Math.min(dur(h) * 0.75, 0.5 + n * 0.9)) * (n - 1);
  const j = Math.min(n - 2, Math.floor(k)), f = k - j, px = pts[j][0] + (pts[j + 1][0] - pts[j][0]) * f, py = pts[j][1] + (pts[j + 1][1] - pts[j][1]) * f;
  return <><svg width={1920} height={1080} style={abs(0, 0)}><polyline points={pts.map((p) => p.join(",")).join(" ")} fill="none" stroke="rgba(255,255,255,.25)" strokeWidth={8} strokeDasharray="20 18" /></svg>
    {pts.map((p, i) => { const on = k >= i - 0.05; return <div key={i} style={abs(p[0], p[1], { transform: "translate(-50%,-50%)", textAlign: "center" })}>
      <div style={{ width: 70, height: 70, borderRadius: 35, background: on ? (h.col ?? AMB) : "#3a3d44", boxShadow: on ? `0 0 40px ${h.col ?? AMB}` : undefined, margin: "0 auto" }} />
      <div style={{ position: "absolute", left: "50%", top: i % 2 ? -110 : 90, transform: "translateX(-50%)", fontWeight: 900, fontSize: 40, color: on ? TX : DIM, textShadow: sh, whiteSpace: "nowrap" }}>{st[i]}</div></div>; })}
    <div style={abs(px, py, { transform: "translate(-50%,-50%)", width: 40, height: 40, borderRadius: 20, background: "#fff", boxShadow: "0 0 30px #fff" })} /></>; }}</Stage>;

// 27 · carta que se da vuelta: el mito / la verdad
export const Carta: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const f = eio(tt, Math.min(1.8, dur(h) * 0.4), Math.min(2.6, dur(h) * 0.4 + 0.8)), r = 180 * f, front = r < 90;
  return <div style={abs(960, 520, { transform: `translate(-50%,-50%) perspective(1800px) rotateY(${r + 4 * Math.sin(tt * 0.6)}deg) scale(${0.9 + 0.1 * phys(tt, 0.1, 5, 0.5)})`, width: 900, height: 560, borderRadius: 34, background: front ? "linear-gradient(160deg,#3a2224,#1c1416)" : "linear-gradient(160deg,#173326,#0f1f18)", boxShadow: card, display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", padding: 60 })}>
    <div style={{ transform: front ? undefined : "scaleX(-1)" }}><div style={{ fontWeight: 800, fontSize: 40, letterSpacing: 8, color: front ? RED : GRN }}>{front ? (h.ka ?? "WHAT PEOPLE THINK") : (h.kb ?? "THE TRUTH")}</div>
      <div style={{ fontWeight: 900, fontSize: 86, color: TX, marginTop: 24, lineHeight: 1.1 }}>{front ? h.a : h.b}</div></div></div>; }}</Stage>;

// 28 · embudo: muchos puntos entran, pocos salen
export const Embudo: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  return <><svg width={1920} height={1080} style={abs(0, 0)}><path d="M560 200 L1360 200 L1040 620 L1040 860 L880 860 L880 620 Z" fill="rgba(255,255,255,.07)" stroke="rgba(255,255,255,.4)" strokeWidth={6} />
      {Array.from({ length: 40 }, (_, i) => { const p = ((tt * 0.45 + i / 40) % 1), thr = i % (h.keep ?? 8) === 0, x0 = 600 + (i * 97) % 720, x = p < 0.55 ? x0 + (960 - x0) * (p / 0.55) : 960, y = 120 + p * 820;
        return (p < 0.55 || thr) && <circle key={i} cx={x} cy={y} r={14} fill={thr ? (h.col ?? GRN) : "#c9ced4"} opacity={p < 0.06 ? p / 0.06 : 1} />; })}</svg>
    <div style={abs(960, 120, { transform: "translateX(-50%)", whiteSpace: "nowrap" })}><Big s={phys(tt, 0.3, 6, 0.5)} size={56}>{h.top}</Big></div>
    <div style={abs(1100, 720)}><Big s={phys(tt, 1, 6, 0.5)} size={56} col={h.col ?? GRN} style={{ maxWidth: 560 }}>{h.bottom}</Big></div></>; }}</Stage>;

// 29 · balanza: el platillo pesado baja
export const Balanza: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const tilt = (h.right ? 1 : -1) * 14 * phys(tt, 1.2, 4, 0.3), rad = (tilt * Math.PI) / 180;
  const pan = (sd: number, lbl: string) => { const x = 960 + sd * 420 * Math.cos(rad), y = 330 + sd * 420 * Math.sin(rad);
    return <div style={abs(x, y, { transform: "translateX(-50%)", textAlign: "center" })}><div style={{ width: 4, height: 180, background: "#c9ced4", margin: "0 auto" }} />
      <div style={{ width: 380, height: 40, borderRadius: "0 0 190px 190px", background: "linear-gradient(180deg,#d9b55a,#8a6a2a)" }} /><div style={{ marginTop: 18, fontWeight: 900, fontSize: 56, color: TX, textShadow: sh, whiteSpace: "nowrap" }}>{lbl}</div></div>; };
  return <><div style={abs(960, 330, { width: 900, height: 18, borderRadius: 9, background: "#d9b55a", transform: `translate(-50%,-50%) rotate(${tilt}deg)` })} />
    <div style={abs(950, 330, { width: 20, height: 560, background: "#8a6a2a" })} /><div style={abs(800, 880, { width: 320, height: 40, borderRadius: 20, background: "#8a6a2a" })} />{pan(-1, h.l)}{pan(1, h.r)}</>; }}</Stage>;

// 30 · foto con un aro de luz sobre el detalle y su rótulo
export const Aro: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const k = phys(tt, 0.9, 5, 0.5), x = 160 + (h.x ?? 0.5) * 1600, y = 110 + (h.y ?? 0.5) * 860;
  return <><div style={abs(160, 110, { filter: `brightness(${1 - 0.35 * cl(k)})` })}><Ph id={h.imgs?.[0]} w={1600} h={860} /></div>
    <div style={abs(x, y, { transform: `translate(-50%,-50%) scale(${0.3 + 0.7 * cl(k)})`, width: 340, height: 340, borderRadius: 170, border: `10px solid ${h.col ?? AMB}`, boxShadow: `0 0 60px ${h.col ?? AMB}, inset 0 0 60px ${h.col ?? AMB}55` })} />
    <div style={abs(960, 880, { transform: "translateX(-50%)", whiteSpace: "nowrap" })}><Big s={phys(tt, 1.4, 6, 0.5)} size={64} col={TX}>{h.label}</Big></div></>; }}</Stage>;

// 31 · notas adhesivas que se pegan en la pared una a una
export const Pegotes: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => {
  const ns: string[] = h.notes ?? [], n = ns.length, cols = ["#ffe066", "#a8e6a1", "#ffb3a7", "#9ad7ff", "#f7c6ff", "#ffd59a"];
  return <>{ns.map((x, i) => { const s = phys(tt, stag(h, i, n, 0.2), 7, 0.4), c = i % 3, r = Math.floor(i / 3);
    return <div key={i} style={abs(300 + c * 460, 130 + r * 420, { width: 400, height: 360, background: cols[i % 6], boxShadow: card, padding: 30, transform: `rotate(${[-4, 3, -2, 5, -3, 2][i % 6]}deg) scale(${0.6 + 0.4 * s})`, opacity: cl(s * 2), fontFamily: HAND, fontWeight: 700, fontSize: 60, color: "#26262a", lineHeight: 1.05 })}>{x}</div>; })}</>; }}</Stage>;

// 32 · foco que se prende con la idea
export const Foco: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const on = eio(tt, 0.8, 1.2) * (0.95 + 0.05 * Math.sin(tt * 6));
  return <><div style={abs(960, 380, { transform: "translate(-50%,-50%)", width: 900, height: 900, borderRadius: 450, background: `radial-gradient(circle, rgba(255,214,120,${0.45 * on}), transparent 62%)` })} />
    <svg width={300} height={420} style={abs(810, 150)}><circle cx={150} cy={140} r={120} fill={on > 0.3 ? "#ffe9a8" : "#5a5d63"} stroke="#d9d9d9" strokeWidth={6} opacity={0.95} />
      <path d="M110 170 Q150 110 190 170" stroke={on > 0.3 ? "#ff9a2a" : "#333"} strokeWidth={8} fill="none" /><rect x={95} y={250} width={110} height={110} rx={14} fill="#9aa1a8" />{[275, 305, 335].map((y) => <line key={y} x1={95} y1={y} x2={205} y2={y} stroke="#6a7178" strokeWidth={6} />)}</svg>
    <div style={abs(960, 700, { transform: "translateX(-50%)", whiteSpace: "nowrap" })}><Big s={phys(tt, 1.1, 6, 0.5)} size={92} col={on > 0.3 ? AMB : TX}>{h.word}</Big></div></>; }}</Stage>;

// 33 · batería / tanque que se vacía o se llena
export const Bateria: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const k = eio(tt, 0.5, Math.min(3, dur(h) * 0.6)), v = (h.from ?? 1) + ((h.to ?? 0.1) - (h.from ?? 1)) * k, c = v > 0.5 ? GRN : v > 0.25 ? AMB : RED;
  return <><div style={abs(360, 320, { width: 900, height: 380, borderRadius: 40, border: "16px solid #d9dde1", padding: 18 })}><div style={{ width: `${100 * v}%`, height: "100%", borderRadius: 20, background: c, boxShadow: `0 0 50px ${c}` }} /></div>
    <div style={abs(1270, 440, { width: 50, height: 140, borderRadius: 10, background: "#d9dde1" })} />
    <div style={abs(810, 760, { transform: "translateX(-50%)", whiteSpace: "nowrap", textAlign: "center" })}><Big s={phys(tt, 0.6, 6, 0.5)} size={110}>{Math.round(v * 100)}%</Big><Big s={phys(tt, 1.2, 6, 0.5)} size={52} col={AMB}>{h.label}</Big></div></>; }}</Stage>;

// 34 · balde que se llena gota a gota con el contador
export const Balde: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const k = eio(tt, 0.3, Math.min(dur(h) * 0.8, 4)), n = Math.round((h.n ?? 200) * k);
  return <><svg width={600} height={760} style={abs(360, 160)}><path d="M80 240 L520 240 L470 720 L130 720 Z" fill="#9aa3ab" stroke="#d9dde1" strokeWidth={10} />
      <clipPath id="bk"><path d="M90 250 L510 250 L462 712 L138 712 Z" /></clipPath><rect clipPath="url(#bk)" x={80} y={712 - 460 * k} width={460} height={470} fill="#4ab8e0" opacity={0.85} />
      <path d="M80 240 Q300 30 520 240" stroke="#d9dde1" strokeWidth={8} fill="none" />
      {Array.from({ length: 3 }, (_, i) => { const p = (tt * 1.3 + i / 3) % 1; return <ellipse key={i} cx={300} cy={0 + p * (712 - 460 * k)} rx={14} ry={20} fill="#7fd3ff" opacity={1 - p * 0.3} />; })}</svg>
    <div style={abs(1040, 380)}><Big s={phys(tt, 0.4, 6, 0.5)} size={170}>{n.toLocaleString("en-US")}</Big><Big s={phys(tt, 0.9, 6, 0.5)} size={56} col={ICE} style={{ maxWidth: 760 }}>{h.label}</Big></div></>; }}</Stage>;

// 35 · caja de herramientas: cada cosa sube de la caja y se ubica
export const Caja: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const it: string[] = h.items ?? [], n = it.length;
  return <><div style={abs(660, 760, { width: 600, height: 220, borderRadius: 20, background: "linear-gradient(180deg,#c9302a,#7a1a16)", boxShadow: card })}><div style={abs(220, -50, { width: 160, height: 60, border: "14px solid #555", borderBottom: "none", borderRadius: "30px 30px 0 0" })} /></div>
    {it.map((x, i) => { const s = phys(tt, stag(h, i, n, 0.3), 6, 0.45), ang = (-150 + (120 * i) / Math.max(1, n - 1)) * Math.PI / 180, R = 520;
      return <div key={i} style={abs(960 + (R * Math.cos(ang) + 0) * s, 740 + R * 0.95 * Math.sin(ang) * s, { transform: `translate(-50%,-50%) scale(${0.4 + 0.6 * s})`, opacity: cl(s * 2), padding: "16px 30px", borderRadius: 18, background: "rgba(20,22,26,.9)", border: `3px solid ${AMB}`, fontWeight: 900, fontSize: 40, color: TX, whiteSpace: "nowrap" })}>{x}</div>; })}</>; }}</Stage>;

// 36 · capas: tres láminas se apilan en profundidad, cada una con su nombre
export const Capas: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const L: string[] = h.layers ?? [], n = L.length, cols = [GRN, AMB, ICE, RED];
  return <div style={abs(960, 520, { transform: "translate(-50%,-50%)", perspective: 2000 })}>{L.map((x, i) => { const s = phys(tt, stag(h, i, n, 0.3), 6, 0.45);
    return <div key={i} style={{ position: "absolute", left: -450 + i * 40, top: -330 + i * 190, width: 900, height: 170, borderRadius: 30, background: `linear-gradient(135deg, ${cols[i % 4]}cc, ${cols[i % 4]}55)`, border: `4px solid ${cols[i % 4]}`, boxShadow: card,
      transform: `rotateX(28deg) rotateZ(-6deg) translateZ(${i * 40 + (1 - s) * 500}px)`, opacity: cl(s * 2), display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 70, color: "#fff", textShadow: sh }}>{x}</div>; })}</div>; }}</Stage>;

// 37 · semáforo: rojo / amarillo / verde y se queda en uno
export const Semaforo: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const fin = h.luz ?? 2, cur = tt < 0.8 ? 0 : tt < 1.4 ? 1 : fin, cs = [RED, AMB, GRN];
  return <><div style={abs(600, 140, { width: 300, height: 800, borderRadius: 60, background: "#1d1f24", boxShadow: card, padding: 30 })}>{cs.map((c, i) => <div key={i} style={{ width: 240, height: 230, borderRadius: 120, margin: "0 0 15px", background: i === cur ? c : "#2c2f35", boxShadow: i === cur ? `0 0 80px ${c}` : "inset 0 6px 20px #000" }} />)}</div>
    <div style={abs(1000, 420)}><Big s={phys(tt, 1.6, 6, 0.5)} size={110} col={cs[fin]}>{h.word}</Big><Big s={phys(tt, 2, 6, 0.5)} size={46} col={TX} style={{ maxWidth: 620, marginTop: 14 }}>{h.label}</Big></div></>; }}</Stage>;

// 38 · dos lugares: la misma cosa partida en dos casas unidas por una línea
export const DosLugares: React.FC<P> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const k = eio(tt, 1, 2.2), house = (x: number, lbl: string, s: number) => <div style={abs(x, 300, { transform: `translateY(${(1 - s) * 300}px)`, opacity: cl(s * 2), textAlign: "center" })}>
    <svg width={420} height={380}><path d="M30 180 L210 30 L390 180 L390 370 L30 370 Z" fill="#2a2d33" stroke={AMB} strokeWidth={10} /><rect x={170} y={250} width={80} height={120} fill={AMB} opacity={0.8} /></svg>
    <div style={{ fontWeight: 900, fontSize: 52, color: TX, textShadow: sh, whiteSpace: "nowrap", marginTop: 10 }}>{lbl}</div></div>;
  return <>{house(300, h.a, phys(tt, 0.2, 6, 0.45))}{house(1200, h.b, phys(tt, 0.6, 6, 0.45))}
    <svg width={1920} height={1080} style={abs(0, 0)}><path d={`M720 480 Q960 ${300 - 60 * Math.sin(tt)} 1200 480`} fill="none" stroke={GRN} strokeWidth={10} strokeDasharray={600} strokeDashoffset={600 * (1 - k)} /></svg>
    {h.label && <div style={abs(960, 900, { transform: "translateX(-50%)", whiteSpace: "nowrap" })}><Big s={phys(tt, 2.2, 6, 0.5)} size={60} col={GRN}>{h.label}</Big></div>}</>; }}</Stage>;

export const ARQ: Record<string, React.FC<P>> = {
  Contador, Versus, Tildes, Sello, Linea, Manometro, Polaroids, Lupa, Pasos, Reloj, Barras, Ticket, Nota, Postal, Cortina, Termo, Almanaque, Precio, Caen, Ranking,
  Llave, Torta, Grilla, Regla, Tachar, Recorrido, Carta, Embudo, Balanza, Aro, Pegotes, Foco, Bateria, Balde, Caja, Capas, Semaforo, DosLugares, ...ARQ2,
};
export type ModeT = Mode;
