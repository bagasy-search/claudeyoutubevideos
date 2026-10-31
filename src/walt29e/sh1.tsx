// walt29e · componentes únicos 1-16 (min 0-13). Cada uno es el OBJETO de la idea, dentro del escenario Stage (foto del momento atrás).
import React from "react";
import { AMB, DIM, GRN, H, HAND, Head, ICE, MARK, Photo, RED, Stage, TX, Tag, cl, eio, phys } from "./hkit";

const PAPER = "#f3ecdc", INK = "#2b2620", MEAT = "#e89a8c", MEATD = "#c96f63", FAT = "#f6eadb", BONE = "#efe3c8";
const sh = (d = 40) => `0 ${d}px ${d * 2}px rgba(0,0,0,.6)`;

// chuleta vista de arriba (svg): grasa, ojo del lomo, hueso en T. cook 0..1 la dora
const ChopTop: React.FC<{ w: number; cook?: number; gray?: number }> = ({ w, cook = 0, gray = 0 }) => {
  const m = gray > 0 ? `rgb(${232 - 70 * gray},${154 - 10 * gray},${140 + 0 * gray})` : MEAT;
  const crust = `rgba(110,58,24,${0.85 * cook})`;
  return <svg width={w} height={w * 0.72} viewBox="0 0 400 290">
    <path d="M40 150 C40 60 140 20 230 30 C330 40 380 110 370 170 C360 240 280 270 200 265 C110 260 40 230 40 150 Z" fill={FAT} stroke="rgba(0,0,0,.15)" strokeWidth={3} />
    <path d="M70 150 C72 85 150 55 225 62 C305 70 345 120 338 168 C330 222 270 240 205 236 C130 232 68 208 70 150 Z" fill={m} />
    <path d="M70 150 C72 85 150 55 225 62 C305 70 345 120 338 168 C330 222 270 240 205 236 C130 232 68 208 70 150 Z" fill={crust} />
    <path d="M250 64 L262 236 L282 236 L270 66 Z" fill={BONE} opacity={0.95} />
    <ellipse cx={180} cy={150} rx={70} ry={45} fill="rgba(255,255,255,.08)" />
  </svg>;
};

// ---- 0:51 · EL TICKET: la impresora de la caja escupe $40.00 y al lado cae la etiqueta de carnicería $6 ----
export const HReceipt: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const pr = eio(tt, 0.4, 2.6), tag = phys(tt, 3.0, 6.5, 0.4), lit = cl(tt - 3.4);
  const rows: [string, string][] = [["PORK CHOP", "38.00"], ["SIDE", "0.00"], ["TAX", "2.00"]];
  return <>
    <div style={{ position: "absolute", left: 560, top: 150, width: 420, height: 90, background: "linear-gradient(180deg,#3a3a3f,#202024)", borderRadius: 16, boxShadow: sh(30) }} />
    <div style={{ position: "absolute", left: 590, top: 210, width: 360, height: 640 * pr, overflow: "hidden", transformOrigin: "50% 0", transform: `rotate(${-1.5 + 1.5 * Math.sin(tt * 0.6)}deg)` }}>
      <div style={{ width: 360, height: 640, background: PAPER, padding: "40px 34px", fontFamily: "Courier New, monospace", color: INK, boxShadow: sh(20), position: "absolute", bottom: 0 }}>
        <div style={{ fontWeight: 900, fontSize: 30, textAlign: "center", letterSpacing: 3 }}>STEAKHOUSE</div>
        <div style={{ fontSize: 22, textAlign: "center", marginBottom: 30 }}>DOWNTOWN · TABLE 12</div>
        {rows.map(([a, b]) => <div key={a} style={{ display: "flex", justifyContent: "space-between", fontSize: 28, marginBottom: 14 }}><span>{a}</span><span>{b}</span></div>)}
        <div style={{ borderTop: "3px dashed #8a7f6a", margin: "24px 0 18px" }} />
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 46, fontWeight: 900 }}><span>TOTAL</span><span style={{ color: "#b2261b" }}>$40.00</span></div>
      </div>
    </div>
    <div style={{ position: "absolute", left: 1120, top: 470, transform: `translateY(${(1 - tag) * -620}px) rotate(${8 - 14 * (1 - tag)}deg)`, opacity: cl(tag * 3) }}>
      <div style={{ width: 420, padding: "26px 30px", background: "#fffdf6", border: "4px solid #c7342a", borderRadius: 10, boxShadow: sh(30), fontFamily: "Courier New, monospace", color: INK }}>
        <div style={{ fontWeight: 900, fontSize: 26, letterSpacing: 2 }}>WALT'S BACKYARD</div>
        <div style={{ fontSize: 24 }}>1 CENTER CUT CHOP</div>
        <div style={{ fontSize: 24 }}>1.5 IN · BONE IN</div>
        <div style={{ fontWeight: 900, fontSize: 72, color: "#c7342a", textShadow: `0 0 ${30 * lit}px rgba(255,90,74,${0.5 * lit})` }}>$6.00</div>
      </div>
    </div>
    <Tag tt={tt} at={3.8} x={1330} y={880} txt="SAME CHOP" col={AMB} size={54} />
  </>;
}}</Stage>;

// ---- 1:32 · LA POLAROID DE 1972: cae, se revela (de blanco a la foto) y el año rueda 2026 → 1972 ----
export const HPolaroid: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const f = phys(tt, 0.2, 4.5, 0.45), dev = eio(tt, 1.0, 4.0), yr = Math.round(2026 - 54 * eio(tt, 0.4, 2.4));
  return <>
    <div style={{ position: "absolute", left: 960, top: 520, transform: `translate(-50%,-50%) translateY(${(1 - f) * -700}px) rotate(${-5 + (1 - f) * 25 + 1.2 * Math.sin(tt * 0.5)}deg)` }}>
      <div style={{ background: "#f4f1e8", padding: "26px 26px 120px", boxShadow: sh(50) }}>
        <div style={{ position: "relative", width: 640, height: 470 }}>
          <Photo id={h.img} w={640} h={470} r={0} style={{ filter: `sepia(${0.35}) saturate(${0.6 + 0.4 * dev})` }} />
          <div style={{ position: "absolute", inset: 0, background: "#e9e6dc", opacity: 1 - dev }} />
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 26, textAlign: "center", fontFamily: HAND, fontWeight: 700, fontSize: 64, color: "#3a3226" }}>Maxwell St.</div>
      </div>
    </div>
    <div style={{ position: "absolute", left: 1500, top: 300, fontWeight: 900, fontSize: 150, color: TX, textShadow: "0 12px 40px rgba(0,0,0,.7)", fontVariantNumeric: "tabular-nums" }}>{yr}</div>
    <Tag tt={tt} at={2.6} x={1590} y={430} txt="I'M 19" col={AMB} size={50} />
  </>;
}}</Stage>;

// ---- 2:00 · EL CALIBRE: la mordaza de bronce se abre de ½" a 1½" sobre el canto de la chuleta ----
export const HCaliper: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const op = eio(tt, 1.6, 3.6), th = 0.5 + op, px = 90 + 180 * op, ok = phys(tt, 3.8, 7, 0.4);
  return <>
    <Head tt={tt} kick="WHAT TO ASK FOR" title="CENTER CUT · BONE IN" />
    {/* la chuleta de canto: el grosor crece con el calibre */}
    <div style={{ position: "absolute", left: 960 - 330, top: 640 - px / 2, width: 660, height: px, borderRadius: px / 3, background: `linear-gradient(180deg, ${FAT} 0 14%, ${MEAT} 14% 86%, ${FAT} 86%)`, boxShadow: sh(30) }} />
    <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
      <rect x={1040} y={260} width={44} height={760} rx={8} fill="#b8935a" stroke="#6e5530" strokeWidth={3} />
      {Array.from({ length: 30 }, (_, i) => <line key={i} x1={1040} x2={1040 + (i % 5 ? 14 : 26)} y1={300 + i * 22} y2={300 + i * 22} stroke="#4a3920" strokeWidth={2} />)}
      <rect x={1084} y={640 - px / 2 - 26} width={150} height={26} rx={4} fill="#c9a66b" stroke="#6e5530" strokeWidth={3} />
      <rect x={1084} y={640 + px / 2} width={150} height={26} rx={4} fill="#c9a66b" stroke="#6e5530" strokeWidth={3} />
    </svg>
    <div style={{ position: "absolute", left: 1290, top: 640, transform: "translateY(-50%)", fontWeight: 900, fontSize: 130, color: ok > 0.2 ? GRN : TX, fontVariantNumeric: "tabular-nums" }}>{th.toFixed(1)}<span style={{ fontSize: 60, color: DIM }}> IN</span></div>
    <Tag tt={tt} at={0.8} x={420} y={900} txt="HALF INCH = SCRAP BIN" col={RED} size={40} anchor="l" />
  </>;
}}</Stage>;

// ---- 2:21 · EL RELOJ DE LA CHULETA: dos cortes (fina / gruesa) con el calor entrando por los bordes; la fina se seca en 40 s ----
export const HDoneness: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const s = eio(tt, 0.8, 5.0), sec = Math.round(40 * s);
  const slab = (x: number, hh: number, label: string, dry: number) => <div style={{ position: "absolute", left: x, top: 560 - hh / 2, width: 560, height: hh, borderRadius: 18, overflow: "hidden", boxShadow: sh(30),
    background: `linear-gradient(180deg, #6e3a18 0%, #a85a30 ${6 + 30 * dry}%, ${MEAT} ${8 + 44 * dry}%, ${MEAT} ${92 - 44 * dry}%, #a85a30 ${94 - 30 * dry}%, #6e3a18 100%)` }}>
    <div style={{ position: "absolute", inset: 0, background: `rgba(160,150,140,${dry > 0.8 ? (dry - 0.8) * 3 : 0})` }} />
    <div style={{ position: "absolute", left: 0, right: 0, bottom: -70, textAlign: "center", fontWeight: 900, fontSize: 34, color: DIM }}>{label}</div>
  </div>;
  return <>
    {slab(260, 90, "", Math.min(1, s * 1.15))}
    {slab(1100, 270, "", s * 0.42)}
    <Tag tt={tt} at={0.3} x={540} y={720} txt="HALF INCH" col={DIM} size={36} />
    <Tag tt={tt} at={0.5} x={1380} y={790} txt="INCH AND A HALF" col={DIM} size={36} />
    <div style={{ position: "absolute", left: 960, top: 210, transform: "translateX(-50%)", fontWeight: 900, fontSize: 120, color: sec > 34 ? RED : TX, fontVariantNumeric: "tabular-nums" }}>0:{String(sec).padStart(2, "0")}</div>
    <Tag tt={tt} at={4.6} x={540} y={420} txt="DRY" col={RED} size={60} />
    <Tag tt={tt} at={5.0} x={1380} y={330} txt="STILL TIME" col={GRN} size={50} />
  </>;
}}</Stage>;

// ---- 3:15 · LA LUPA: la bandeja del súper con su etiqueta; la lupa pasa y agranda la letra chica ----
export const HLoupe: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => {
  const mv = eio(tt, 0.8, 3.0), lx = 640 + 520 * mv, ly = 610 - 60 * Math.sin(mv * Math.PI), z = cl(tt - 2.6);
  const label = (big: number) => <div style={{ width: 760, padding: "26px 34px", background: "#fff", borderRadius: 8, fontFamily: "Arial, sans-serif", color: "#222", fontSize: 30 * big }}>
    <div style={{ fontWeight: 900, fontSize: 40 * big }}>PORK TENDERLOIN</div>
    <div style={{ marginTop: 8 }}>NET WT 1.25 LB · $4.99/LB</div>
    <div style={{ marginTop: 14, fontSize: 19 * big, color: "#555" }}>ENHANCED WITH UP TO <b style={{ color: "#c22" }}>12% SOLUTION</b> OF WATER, SALT, SODIUM PHOSPHATE</div>
  </div>;
  return <>
    <div style={{ position: "absolute", left: 960, top: 560, transform: "translate(-50%,-50%) rotate(-3deg)", width: 980, height: 620, borderRadius: 30, background: "linear-gradient(160deg,#fafafa,#d9d9d9)", boxShadow: sh(40) }}>
      <div style={{ position: "absolute", left: 60, top: 50, width: 860, height: 300, borderRadius: 20, overflow: "hidden" }}><Photo id={h.img} w={860} h={300} r={20} /></div>
      <div style={{ position: "absolute", left: 110, top: 380 }}>{label(1)}</div>
    </div>
    {/* lente */}
    <div style={{ position: "absolute", left: lx - 190, top: ly - 190, width: 380, height: 380, borderRadius: "50%", overflow: "hidden", border: "16px solid #2b2b2e", boxShadow: "0 30px 70px rgba(0,0,0,.6), inset 0 0 40px rgba(255,255,255,.35)" }}>
      <div style={{ position: "absolute", left: -(lx - 600) * 1.9 - 120, top: -(ly - 760) * 1.9 - 520, transform: "scale(1.9) rotate(-3deg)", transformOrigin: "0 0" }}>{label(1)}</div>
    </div>
    <div style={{ position: "absolute", left: lx + 120, top: ly + 120, width: 46, height: 230, background: "#2b2b2e", borderRadius: 20, transform: "rotate(-45deg)", transformOrigin: "50% 0" }} />
    <Tag tt={tt} at={3.2} x={960} y={950} txt="12% IS SALT WATER" col={RED} size={56} />
    <div style={{ opacity: z }} />
  </>;
}}</Stage>;

// ---- 3:38 · LA BANDEJA QUE GOTEA: la carne de la bandeja suelta su 12 % en un vaso que se llena ----
export const HDrain: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const f = eio(tt, 1.0, 4.4), drop = (tt * 2.2) % 1;
  return <>
    <Head tt={tt} kick="YOU PAY FOR IT" title="12% OF THE PACKAGE" col={ICE} />
    <div style={{ position: "absolute", left: 470, top: 360, transform: `rotate(${-10 * f}deg)`, transformOrigin: "100% 100%" }}>
      <div style={{ width: 640, height: 300, borderRadius: 30, background: "linear-gradient(160deg,#fbfbfb,#d6d6d6)", boxShadow: sh(30), display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ transform: `scale(${1 - 0.12 * f})` }}><ChopTop w={440} /></div>
      </div>
    </div>
    {f > 0.02 && f < 0.98 && <div style={{ position: "absolute", left: 1110, top: 640 + drop * 200, width: 18, height: 26, borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%", background: "rgba(200,225,255,.85)" }} />}
    <div style={{ position: "absolute", left: 1030, top: 640, width: 200, height: 300, borderRadius: "0 0 26px 26px", border: "6px solid rgba(255,255,255,.6)", borderTop: "none", overflow: "hidden", boxShadow: "0 30px 60px rgba(0,0,0,.5)" }}>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 270 * f * 0.55, background: "linear-gradient(180deg,rgba(170,205,255,.75),rgba(120,160,220,.85))" }} />
    </div>
    <div style={{ position: "absolute", left: 1290, top: 760, fontWeight: 900, fontSize: 120, color: ICE }}>{Math.round(12 * f)}%</div>
    <Tag tt={tt} at={3.9} x={1400} y={900} txt="SALT WATER" col={DIM} size={40} />
  </>;
}}</Stage>;

// ---- 4:31 · LA BALANZA DE AGUJA: el dial gira y cobra el agua (enhanced) contra la carne natural ----
export const HDial: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const a = phys(tt, 0.9, 3.2, 0.32), b = phys(tt, 2.6, 3.2, 0.32);
  const dial = (x: number, ang: number, lab: string, price: string, col: string, on: number) => <div style={{ position: "absolute", left: x, top: 260 }}>
    <svg width={520} height={520} viewBox="0 0 520 520">
      <circle cx={260} cy={260} r={240} fill="#f1ede3" stroke="#3a3a3e" strokeWidth={22} />
      {Array.from({ length: 41 }, (_, i) => { const r0 = (-120 + i * 6) * Math.PI / 180; return <line key={i} x1={260 + Math.sin(r0) * 200} y1={260 - Math.cos(r0) * 200} x2={260 + Math.sin(r0) * (i % 5 ? 184 : 168)} y2={260 - Math.cos(r0) * (i % 5 ? 184 : 168)} stroke="#2b2620" strokeWidth={i % 5 ? 3 : 6} />; })}
      <g transform={`rotate(${-120 + ang} 260 260)`}><line x1={260} y1={280} x2={260} y2={80} stroke="#c22" strokeWidth={8} strokeLinecap="round" /></g>
      <circle cx={260} cy={260} r={22} fill="#3a3a3e" />
    </svg>
    <div style={{ position: "absolute", left: 0, right: 0, top: 560, textAlign: "center", fontWeight: 900, fontSize: 40, color: col }}>{lab}</div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 330, textAlign: "center", fontWeight: 900, fontSize: 70, color: "#2b2620", opacity: on }}>{price}</div>
  </div>;
  return <>
    {dial(330, 150 * a, "ENHANCED", "$4.99", ICE, cl(a))}
    {dial(1070, 140 * b, "NATURAL", "$5.29", GRN, cl(b))}
    <Tag tt={tt} at={3.8} x={960} y={190} txt="NOT PAYING FOR WATER" col={AMB} size={50} />
  </>;
}}</Stage>;

// ---- 5:05 · EL BALDE DE MAMÁ: el balde gris abollado; cucharadas de sal y azúcar caen de a una con su cuenta ----
export const HBucket: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const spoons = [1.0, 1.7, 2.4, 3.1], cups = cl(eio(tt, 0.3, 1.2));
  return <>
    <Head tt={tt} kick="MOTHER'S RECIPE" title="1 CUP · 1 SALT · 1 SUGAR" />
    <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
      <defs><linearGradient id="bk" x1="0" x2="1"><stop offset="0" stopColor="#6f747a" /><stop offset=".45" stopColor="#c9ced3" /><stop offset="1" stopColor="#5d6268" /></linearGradient></defs>
      <path d="M700 430 L1220 430 L1170 930 L750 930 Z" fill="url(#bk)" stroke="#43474c" strokeWidth={6} />
      <path d="M1010 640 q 30 20 10 60" stroke="#43474c" strokeWidth={5} fill="none" />
      <ellipse cx={960} cy={430} rx={260} ry={46} fill="#3d4a55" stroke="#43474c" strokeWidth={6} />
      <ellipse cx={960} cy={436} rx={238} ry={38} fill={`rgba(160,200,230,${0.55 * cups})`} />
      <path d="M700 430 Q 960 160 1220 430" stroke="#555a60" strokeWidth={8} fill="none" />
    </svg>
    {spoons.map((s0, i) => { const p = eio(tt, s0, s0 + 0.5), salt = i % 2 === 0; return p > 0 && p < 1 ? <div key={i} style={{ position: "absolute", left: 900 + (i % 2) * 60, top: 120 + 300 * p, width: 70, height: 70, borderRadius: "50%", background: salt ? "radial-gradient(#fff,#ddd)" : "radial-gradient(#fff8e6,#e8d9b0)", boxShadow: "0 10px 20px rgba(0,0,0,.4)" }} /> : null; })}
    <Tag tt={tt} at={1.0} x={460} y={600} txt="SALT" col={TX} size={58} />
    <Tag tt={tt} at={1.7} x={1460} y={600} txt="SUGAR" col={AMB} size={58} />
    <div style={{ position: "absolute", left: 960, top: 960, transform: "translateX(-50%)", fontFamily: HAND, fontWeight: 700, fontSize: 70, color: TX, opacity: cl(tt - 3.4) }}>4 cups · 4 Tbsp · 4 Tbsp</div>
  </>;
}}</Stage>;

// ---- 5:40 · RELOJ DE ARENA: 1 hora = tierna · 24 horas = jamón (la chuleta se vuelve rosada y esponjosa) ----
export const HSand: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const s = eio(tt, 0.6, 4.6), ham = cl((s - 0.35) / 0.65);
  return <>
    <svg width={420} height={620} viewBox="0 0 420 620" style={{ position: "absolute", left: 750, top: 230, transform: `rotate(${1.5 * Math.sin(tt * 0.7)}deg)` }}>
      <rect x={30} y={0} width={360} height={36} rx={10} fill="#7a5530" /><rect x={30} y={584} width={360} height={36} rx={10} fill="#7a5530" />
      <path d="M70 36 Q 70 250 205 310 Q 70 370 70 584 L350 584 Q 350 370 215 310 Q 350 250 350 36 Z" fill="rgba(220,235,255,.12)" stroke="rgba(255,255,255,.5)" strokeWidth={5} />
      <path d={`M${90 + 100 * s} ${60 + 230 * s} Q 210 ${260} ${330 - 100 * s} ${60 + 230 * s} L 215 300 Z`} fill="#e6c88a" />
      <path d={`M80 584 Q 210 ${584 - 230 * s} 340 584 Z`} fill="#e6c88a" />
      <line x1={210} y1={300} x2={210} y2={584} stroke="#e6c88a" strokeWidth={3} opacity={s < 0.99 ? 0.8 : 0} />
    </svg>
    <div style={{ position: "absolute", left: 1300, top: 380 }}><ChopTop w={420} gray={0} /></div>
    <div style={{ position: "absolute", left: 1300, top: 380, opacity: ham, filter: "saturate(2.2) hue-rotate(-12deg) brightness(1.15)" }}><ChopTop w={420} /></div>
    <div style={{ position: "absolute", left: 220, top: 420, fontWeight: 900, fontSize: 130, color: ham > 0.4 ? RED : GRN, fontVariantNumeric: "tabular-nums" }}>{Math.max(1, Math.round(24 * s))}<span style={{ fontSize: 56, color: DIM }}> HR</span></div>
    <Tag tt={tt} at={0.8} x={1510} y={760} txt={ham > 0.5 ? "HAM" : "TENDER"} col={ham > 0.5 ? RED : GRN} size={64} />
  </>;
}}</Stage>;

// ---- 6:20 · EL TIMER DE COCINA: la perilla gira a 60, corre y al llegar a 0 suena y salta ----
export const HTimer: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const set = eio(tt, 0.4, 1.6), run = eio(tt, 1.8, 4.4), v = 60 * set * (1 - run), ring = tt > 4.4 ? Math.sin(tt * 40) * 6 * cl(5.6 - tt) : 0;
  return <>
    <div style={{ position: "absolute", left: 960, top: 560, transform: `translate(-50%,-50%) rotate(${ring}deg)` }}>
      <svg width={560} height={560} viewBox="0 0 560 560">
        <circle cx={280} cy={300} r={240} fill="#f4f1ea" stroke="#d8d2c4" strokeWidth={10} />
        <g transform={`rotate(${-v * 6} 280 300)`}>
          {Array.from({ length: 12 }, (_, i) => { const r = (i * 30) * Math.PI / 180; return <text key={i} x={280 + Math.sin(r) * 180} y={300 - Math.cos(r) * 180 + 14} textAnchor="middle" fontSize={40} fontWeight={900} fill="#2b2620">{i * 5}</text>; })}
          {Array.from({ length: 60 }, (_, i) => { const r = (i * 6) * Math.PI / 180; return <line key={i} x1={280 + Math.sin(r) * 228} y1={300 - Math.cos(r) * 228} x2={280 + Math.sin(r) * 214} y2={300 - Math.cos(r) * 214} stroke="#2b2620" strokeWidth={3} />; })}
        </g>
        <path d="M280 52 L262 20 L298 20 Z" fill={RED} />
        <rect x={250} y={30} width={60} height={40} rx={10} fill="#d8d2c4" />
      </svg>
    </div>
    {tt > 4.4 && [0, 1, 2].map((i) => <div key={i} style={{ position: "absolute", left: 960 - 360 - i * 50, top: 360 - i * 40, width: 60 + i * 30, height: 8, background: AMB, borderRadius: 4, transform: `rotate(${-30 - i * 10}deg)`, opacity: 0.7 * cl(5.8 - tt) }} />)}
    <Tag tt={tt} at={0.5} x={1500} y={420} txt="ONE HOUR" col={AMB} size={64} />
    <Tag tt={tt} at={4.4} x={1500} y={540} txt="OUT. RINSE." col={TX} size={48} />
  </>;
}}</Stage>;

// ---- 7:28 · EL PAPEL QUE CHUPA: gotas sobre la chuleta que el papel absorbe de a una (la mancha crece en la hoja) ----
export const HTowel: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const press = phys(tt, 1.2, 5, 0.6), lift = eio(tt, 3.6, 4.6), drops = 14;
  return <>
    <Head tt={tt} kick="NUMBER FOUR" title="BONE DRY" col={ICE} />
    <div style={{ position: "absolute", left: 960, top: 600, transform: "translate(-50%,-50%)" }}><ChopTop w={700} /></div>
    {Array.from({ length: drops }, (_, i) => { const x = 700 + (i * 137) % 520, y = 470 + (i * 89) % 260, gone = cl((tt - 1.3 - i * 0.12) * 3);
      return <div key={i} style={{ position: "absolute", left: x, top: y, width: 26, height: 20, borderRadius: "50%", background: "radial-gradient(circle at 35% 35%, #fff, rgba(190,220,255,.6) 40%, rgba(120,170,230,.4))", opacity: 1 - gone, transform: `scale(${1 - 0.5 * gone})` }} />; })}
    <div style={{ position: "absolute", left: 960 - 380, top: 600 - 260 - 700 * (1 - press) - 500 * lift, width: 760, height: 520, background: "repeating-linear-gradient(90deg,#fbfbf8 0 38px,#f1f1ec 38px 40px)", borderRadius: 6, boxShadow: sh(30), opacity: 0.96, overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 140, top: 110, width: 480 * cl(tt - 1.4), height: 300 * cl(tt - 1.4), borderRadius: "50%", background: "rgba(214,140,130,.35)", filter: "blur(18px)" }} />
    </div>
    <Tag tt={tt} at={4.6} x={960} y={950} txt="FINGER COMES AWAY DRY" col={GRN} size={50} />
  </>;
}}</Stage>;

// ---- 8:20 · EL TERMÓMETRO DE LA SARTÉN: el aceite sube de frío a «shimmer» y aparece el primer hilo de humo ----
export const HShimmer: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const v = eio(tt, 0.6, 4.0), deg = Math.round(70 + 330 * v), smoke = cl((v - 0.85) * 7);
  return <>
    <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
      <ellipse cx={820} cy={640} rx={420} ry={150} fill="#1a1a1c" stroke="#333" strokeWidth={14} />
      <ellipse cx={820} cy={630} rx={380} ry={124} fill={`rgba(210,170,70,${0.35 + 0.35 * v})`} />
      {Array.from({ length: 8 }, (_, i) => <ellipse key={i} cx={560 + i * 70} cy={630 + 20 * Math.sin(i)} rx={40} ry={6} fill="rgba(255,240,190,.5)" opacity={v * (0.5 + 0.5 * Math.sin(tt * 5 + i * 1.7))} />)}
      <rect x={1240} y={600} width={420} height={50} rx={22} fill="#1a1a1c" />
      {[0, 1].map((i) => <path key={i} d={`M ${760 + i * 120} 520 c -30 -50 30 -100 0 -150 c -30 -50 30 -100 0 -150`} stroke="rgba(230,230,230,.5)" strokeWidth={10} fill="none" strokeLinecap="round" pathLength={1} strokeDasharray="0.4 0.6" strokeDashoffset={-((tt * 0.3 + i * 0.4) % 1)} opacity={smoke} />)}
      <rect x={1460} y={200} width={60} height={420} rx={30} fill="#eee" stroke="#999" strokeWidth={4} />
      <rect x={1474} y={600 - 380 * v} width={32} height={380 * v} rx={16} fill={v > 0.85 ? RED : AMB} />
      <circle cx={1490} cy={640} r={50} fill={v > 0.85 ? RED : AMB} />
    </svg>
    <div style={{ position: "absolute", left: 1560, top: 300, fontWeight: 900, fontSize: 90, color: TX, fontVariantNumeric: "tabular-nums" }}>{deg}°</div>
    <Tag tt={tt} at={3.6} x={820} y={300} txt="SHIMMER + WISP" col={AMB} size={56} />
    <Tag tt={tt} at={0.4} x={820} y={870} txt="5 MINUTES EMPTY" col={DIM} size={36} />
  </>;
}}</Stage>;

// ---- 8:40 · EL CRONÓMETRO DE 3 MINUTOS: la aguja da la vuelta; la chuleta se suelta sola y se da vuelta en el aire ----
export const HFlip: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const s = eio(tt, 0.4, 3.6), fl = eio(tt, 3.6, 4.6), y = -260 * Math.sin(fl * Math.PI);
  return <>
    <svg width={460} height={460} viewBox="0 0 460 460" style={{ position: "absolute", left: 1310, top: 230 }}>
      <circle cx={230} cy={230} r={200} fill="#f4f1ea" stroke="#2b2b2e" strokeWidth={18} />
      <path d={`M230 230 L230 40 A190 190 0 ${s > 0.5 ? 1 : 0} 1 ${230 + 190 * Math.sin(s * 2 * Math.PI)} ${230 - 190 * Math.cos(s * 2 * Math.PI)} Z`} fill="rgba(255,178,87,.45)" />
      <line x1={230} y1={230} x2={230 + 170 * Math.sin(s * 2 * Math.PI)} y2={230 - 170 * Math.cos(s * 2 * Math.PI)} stroke={RED} strokeWidth={8} strokeLinecap="round" />
      <circle cx={230} cy={230} r={16} fill="#2b2b2e" />
    </svg>
    <div style={{ position: "absolute", left: 1540, top: 720, transform: "translateX(-50%)", fontWeight: 900, fontSize: 90, color: TX, fontVariantNumeric: "tabular-nums" }}>{Math.floor(3 * s)}:{String(Math.floor((180 * s) % 60)).padStart(2, "0")}</div>
    <svg width={900} height={300} style={{ position: "absolute", left: 230, top: 640 }}><ellipse cx={450} cy={150} rx={430} ry={120} fill="#1a1a1c" stroke="#333" strokeWidth={14} /></svg>
    <div style={{ position: "absolute", left: 680 - 230, top: 560 + y, transform: `rotateX(${fl * 180}deg)` }}><ChopTop w={460} cook={fl > 0.5 ? 1 : 0.15 + 0.2 * s} /></div>
    <Tag tt={tt} at={0.5} x={680} y={220} txt="HANDS OFF" col={AMB} size={64} />
    <Tag tt={tt} at={3.7} x={680} y={320} txt="IT LETS GO BY ITSELF" col={GRN} size={44} />
  </>;
}}</Stage>;

// ---- 9:15 · EL CORTE EN CAPAS: la chuleta de canto se separa en grasa / carne / hueso y la grasa se ilumina ----
export const HLayers: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const sp = eio(tt, 0.8, 2.6), glow = cl((tt - 2.8) * 1.5) * (0.6 + 0.4 * Math.sin(tt * 2));
  const L: [string, string, string, number][] = [["FAT CAP", FAT, AMB, -1], ["LOIN", MEAT, TX, 0], ["BONE", BONE, DIM, 1]];
  return <>
    {L.map(([n, c, tc, k], i) => <div key={n} style={{ position: "absolute", left: 960 - 380 + k * 0, top: 520 + k * (70 + 110 * sp) - (i === 1 ? 70 : 30), width: 760, height: i === 1 ? 140 : 60, borderRadius: 30, background: c,
      boxShadow: i === 0 ? `0 0 ${80 * glow}px rgba(255,200,120,${0.8 * glow}), ${sh(20)}` : sh(20), transform: `perspective(1400px) rotateX(${28 - 10 * sp}deg) translateX(${k * 40 * sp}px)` }}>
      <div style={{ position: "absolute", right: -260, top: "50%", transform: "translateY(-50%)", fontWeight: 900, fontSize: 46, color: tc, opacity: sp }}>{n}</div>
    </div>)}
    <Tag tt={tt} at={3.0} x={960} y={200} txt="THE FREE PART" col={AMB} size={70} />
  </>;
}}</Stage>;

// ---- 10:46 · LA REGLA VIEJA: la tarjeta «160°F» se rompe en dos y debajo aparece «145°F + 3 MIN REST» ----
export const HRule: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const r = eio(tt, 1.8, 3.0), n = phys(tt, 2.6, 6, 0.45);
  const card = (txt: string, sub: string, col: string) => <div style={{ width: 760, height: 420, background: PAPER, borderRadius: 14, boxShadow: sh(40), display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: INK }}>
    <div style={{ fontWeight: 800, fontSize: 32, letterSpacing: 6, color: "#7a6f5a" }}>{sub}</div>
    <div style={{ fontWeight: 900, fontSize: 190, color: col, lineHeight: 1 }}>{txt}</div>
  </div>;
  return <>
    <div style={{ position: "absolute", left: 960 - 380, top: 330, transform: `scale(${0.85 + 0.15 * n})`, opacity: cl(n * 2) }}>{card("145°F", "PORK CHOPS · 3 MIN REST", "#2f8f4f")}</div>
    {r < 1 && <>
      <div style={{ position: "absolute", left: 960 - 380, top: 330, clipPath: "polygon(0 0, 52% 0, 46% 100%, 0 100%)", transform: `translate(${-520 * r}px, ${260 * r * r}px) rotate(${-22 * r}deg)`, opacity: 1 - r * 0.6 }}>{card("160°F", "THE OLD RULE", "#b2261b")}</div>
      <div style={{ position: "absolute", left: 960 - 380, top: 330, clipPath: "polygon(52% 0, 100% 0, 100% 100%, 46% 100%)", transform: `translate(${520 * r}px, ${260 * r * r}px) rotate(${22 * r}deg)`, opacity: 1 - r * 0.6 }}>{card("160°F", "THE OLD RULE", "#b2261b")}</div>
    </>}
    <Tag tt={tt} at={3.4} x={960} y={860} txt="PINK IS CORRECT" col={GRN} size={58} />
  </>;
}}</Stage>;

// ---- 11:22 · LA SONDA: el termómetro entra de costado, marca 140, se saca; en el reposo sube solo a 145 ----
export const HProbe: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const ins = eio(tt, 0.4, 1.4), v = 70 + 70 * eio(tt, 1.4, 3.2) + 5 * eio(tt, 4.0, 5.6), rest = cl((tt - 3.6) * 2);
  return <>
    <div style={{ position: "absolute", left: 560, top: 480, width: 760, height: 220, borderRadius: 60, background: `linear-gradient(180deg,#6e3a18 0 10%,${MEAT} 22% 78%,#6e3a18 90%)`, boxShadow: sh(30) }} />
    <div style={{ position: "absolute", left: 1320 + 380 * (1 - ins), top: 575, width: 520, height: 22, borderRadius: 11, background: "linear-gradient(180deg,#eee,#9a9a9a)" }} />
    <div style={{ position: "absolute", left: 1640 + 380 * (1 - ins), top: 480, width: 230, height: 210, borderRadius: 30, background: "#ffd23f", boxShadow: sh(20), display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 180, height: 100, background: "#1f2a1f", borderRadius: 10, color: "#9dff9d", fontFamily: "Courier New, monospace", fontWeight: 900, fontSize: 72, display: "flex", alignItems: "center", justifyContent: "center" }}>{Math.round(v)}</div>
    </div>
    <Tag tt={tt} at={2.8} x={940} y={360} txt="140 · OFF THE HEAT" col={AMB} size={56} />
    <div style={{ position: "absolute", left: 940, top: 820, transform: "translateX(-50%)", fontWeight: 900, fontSize: 64, color: GRN, opacity: rest }}>RESTS UP TO 145</div>
  </>;
}}</Stage>;

// ---- 12:44 · LA CINTA PLATEADA: la membrana se pela del lomo como el papel de un sticker, en una tira larga ----
export const HPeel: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const p = eio(tt, 0.8, 3.8), lift = Math.sin(p * Math.PI) * 120;
  return <>
    <Head tt={tt} kick="NUMBER EIGHT" title="SILVER SKIN" col={ICE} />
    <div style={{ position: "absolute", left: 300, top: 520, width: 1320, height: 190, borderRadius: 95, background: `linear-gradient(180deg,#e7a092,${MEAT} 40%,${MEATD})`, boxShadow: sh(30) }} />
    <div style={{ position: "absolute", left: 300 + 1320 * p, top: 540, width: 1320 * (1 - p), height: 40, borderRadius: 20, background: "linear-gradient(90deg,#dfe6ee,#ffffff,#b9c4cf)", opacity: 0.9 }} />
    <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
      <path d={`M ${300 + 1320 * p} 560 Q ${300 + 1320 * p - 200} ${520 - lift} ${300 + 1320 * p - 380 * p - 60} ${430 - lift * 0.6}`} stroke="url(#sv)" strokeWidth={36} fill="none" strokeLinecap="round" opacity={p > 0.02 ? 1 : 0} />
      <defs><linearGradient id="sv" x1="0" x2="1"><stop offset="0" stopColor="#b9c4cf" /><stop offset=".5" stopColor="#fff" /><stop offset="1" stopColor="#dfe6ee" /></linearGradient></defs>
    </svg>
    <Tag tt={tt} at={3.9} x={960} y={860} txt="ONE LONG STRIP" col={TX} size={58} />
  </>;
}}</Stage>;

// ---- 13:17 · EL MAPA DE CHICAGO: la ruta de 52 años (Archer Ave → Maxwell St → Rush St → Adams St) con pines que caen ----
export const HRoute: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe" bg="radial-gradient(ellipse 80% 70% at 50% 50%, #26221b, #0c0a08 75%)">{(tt) => {
  const d = eio(tt, 0.6, 4.2);
  const P: [number, number, string, string][] = [[420, 820, "ARCHER AVE", "1961"], [760, 600, "MAXWELL ST", "1972"], [1180, 300, "RUSH ST", "EDDIE"], [1500, 470, "ADAMS ST", "THE BERGHOFF"]];
  const path = "M 420 820 C 560 760 640 640 760 600 S 1040 380 1180 300 S 1420 380 1500 470";
  return <>
    <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
      {Array.from({ length: 12 }, (_, i) => <line key={"h" + i} x1={0} x2={1920} y1={90 + i * 90} y2={90 + i * 90} stroke="rgba(255,220,160,.06)" strokeWidth={i % 3 ? 2 : 5} />)}
      {Array.from({ length: 20 }, (_, i) => <line key={"v" + i} y1={0} y2={1080} x1={60 + i * 100} x2={60 + i * 100} stroke="rgba(255,220,160,.06)" strokeWidth={i % 4 ? 2 : 5} />)}
      <path d="M 1700 0 C 1650 300 1760 600 1680 1080 L 1920 1080 L 1920 0 Z" fill="rgba(110,160,210,.18)" />
      <path d={path} fill="none" stroke={AMB} strokeWidth={9} strokeLinecap="round" pathLength={1} strokeDasharray={`${d} 1`} />
    </svg>
    {P.map(([x, y, n, s], i) => { const k = phys(tt, 0.6 + i * 1.1, 7, 0.4); return <div key={n} style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-100%) translateY(${(1 - k) * -200}px)`, opacity: cl(k * 3) }}>
      <svg width={56} height={76} viewBox="0 0 70 96" style={{ display: "block", margin: "0 auto" }}><path d="M35 94 C 35 94 4 52 4 33 A 31 31 0 1 1 66 33 C 66 52 35 94 35 94 Z" fill={RED} /><circle cx={35} cy={33} r={12} fill="#fff" /></svg>
      <div style={{ position: "absolute", left: "50%", top: 84, transform: "translateX(-50%)", whiteSpace: "nowrap", textAlign: "center" }}><div style={{ fontWeight: 900, fontSize: 34 }}>{n}</div><div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 38, color: AMB }}>{s}</div></div>
    </div>; })}
    <div style={{ position: "absolute", left: 200, top: 180, transform: `rotate(-5deg) translateY(${(1 - phys(tt, 4.0, 4.5, 0.45)) * -500}px)`, background: "#f1ead9", padding: "14px 14px 56px", boxShadow: sh(40) }}>
      <Photo id={h.img} w={360} h={250} r={2} />
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 8, textAlign: "center", fontFamily: HAND, fontWeight: 700, fontSize: 40, color: "#3a3226" }}>Gus, 1979</div>
    </div>
  </>;
}}</Stage>;
