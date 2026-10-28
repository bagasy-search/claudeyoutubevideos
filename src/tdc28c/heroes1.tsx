// componentes únicos de tdc28c (briquetas de carbón y barro) · 1-16 (minutos 0-10). Cada uno = lo que se dice en ese segundo, dibujado en código.
import React from "react";
import { AMB, DIM, GRN, H, HAND, Head, ICE, RED, Stage, TX, Tag, cl, eio, phys } from "./hkit";

// ---------- piezas comunes ----------
// briqueta parada (cilindro corto de carbón prensado), centrada en x,y. glow 0..1 = brasa roja
export const Briq: React.FC<{ x: number; y: number; w?: number; h?: number; glow?: number; hole?: boolean; rot?: number; op?: number; crack?: number }> = ({ x, y, w = 110, h = 150, glow = 0, hole, rot = 0, op = 1, crack = 0 }) => (
  <div style={{ position: "absolute", left: x - w / 2, top: y - h / 2, width: w, height: h, transform: `rotate(${rot}deg)`, opacity: op }}>
    <div style={{ position: "absolute", left: -w * 0.1, bottom: -h * 0.12, width: w * 1.2, height: h * 0.22, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(0,0,0,.6), transparent 70%)", filter: "blur(6px)" }} />
    <div style={{ position: "absolute", left: 0, top: w * 0.14, width: w, height: h - w * 0.14, borderRadius: `0 0 ${w / 2}px ${w / 2}px / 0 0 ${w * 0.14}px ${w * 0.14}px`, background: `linear-gradient(90deg, #0d0d0e, #3a3836 38%, #222120 62%, #070708)`, overflow: "hidden" }}>
      {Array.from({ length: 16 }, (_, i) => <div key={i} style={{ position: "absolute", left: `${(i * 41) % 90}%`, top: `${(i * 67) % 92}%`, width: 3 + (i % 3) * 2, height: 3 + (i % 3) * 2, borderRadius: "50%", background: i % 4 === 0 ? "rgba(150,70,40,.55)" : "rgba(255,255,255,.12)" }} />)}
      {glow > 0 && <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at 50% 70%, rgba(255,110,40,${0.85 * glow}), rgba(200,40,10,${0.5 * glow}) 55%, transparent 90%)`, mixBlendMode: "screen" }} />}
      {crack > 0 && <svg width={w} height={h} style={{ position: "absolute", left: 0, top: 0 }}><path d={`M${w * 0.45} 0 L${w * 0.6} ${h * 0.3} L${w * 0.38} ${h * 0.5} L${w * 0.62} ${h * 0.82}`} stroke="#000" strokeWidth={5} fill="none" strokeDasharray={h * 1.2} strokeDashoffset={h * 1.2 * (1 - crack)} /></svg>}
    </div>
    <div style={{ position: "absolute", left: 0, top: 0, width: w, height: w * 0.28, borderRadius: "50%", background: glow > 0 ? `radial-gradient(ellipse, rgba(255,140,60,${0.4 + 0.5 * glow}), #2a2624)` : "radial-gradient(ellipse at 45% 40%, #4a4744, #1d1c1b)" }}>
      {hole && <div style={{ position: "absolute", left: "38%", top: "28%", width: "24%", height: "44%", borderRadius: "50%", background: "#000" }} />}
    </div>
  </div>
);
// balde visto de costado (x,y = centro de la boca), fill 0..1 con el color pedido
export const Bucket: React.FC<{ x: number; y: number; w?: number; h?: number; fill?: number; col?: string; label?: string; children?: React.ReactNode }> = ({ x, y, w = 300, h = 360, fill = 0, col = "#141414", label, children }) => (
  <div style={{ position: "absolute", left: x - w / 2, top: y, width: w, height: h }}>
    <div style={{ position: "absolute", inset: 0, clipPath: "polygon(0 0, 100% 0, 88% 100%, 12% 100%)", background: "linear-gradient(90deg, #8a8f96, #e3e6ea 30%, #b5bac0 62%, #6c7076)" }} />
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: `${fill * 96}%`, clipPath: `polygon(${(1 - fill) * 12 + 2}% 0, ${100 - (1 - fill) * 12 - 2}% 0, 88% 100%, 12% 100%)`, background: col, opacity: 0.94 }}>{children}</div>
    <div style={{ position: "absolute", left: -6, top: -10, width: w + 12, height: 24, borderRadius: "50%", border: "6px solid #c9ccd1", boxSizing: "border-box" }} />
    {label && <div style={{ position: "absolute", left: 0, right: 0, top: h * 0.38, textAlign: "center", fontWeight: 900, fontSize: 36, color: "#1b1b1b" }}>{label}</div>}
  </div>
);
const Grains: React.FC<{ n: number; x: number; y: number; w: number; h: number; col: string; s?: number; seed?: number; tt?: number }> = ({ n, x, y, w, h, col, s = 8, seed = 1, tt = 0 }) => <>
  {Array.from({ length: n }, (_, i) => { const k = (i * 97 + seed * 31) % 1000 / 1000, q = (i * 61 + seed * 17) % 1000 / 1000; return <div key={i} style={{ position: "absolute", left: x + k * w, top: y + q * h + Math.sin(tt * 2 + i) * 1.5, width: s * (0.6 + (i % 3) * 0.3), height: s * (0.6 + (i % 3) * 0.3), borderRadius: "40%", background: col }} />; })}
</>;
const Cross: React.FC<{ x: number; y: number; s: number; p: number; col?: string }> = ({ x, y, s, p, col = RED }) => <svg width={s} height={s} style={{ position: "absolute", left: x - s / 2, top: y - s / 2 }}>
  <path d={`M${s * 0.15} ${s * 0.15} L${s * 0.85} ${s * 0.85}`} stroke={col} strokeWidth={s * 0.11} strokeLinecap="round" strokeDasharray={s} strokeDashoffset={s * (1 - cl(p * 2))} />
  <path d={`M${s * 0.85} ${s * 0.15} L${s * 0.15} ${s * 0.85}`} stroke={col} strokeWidth={s * 0.11} strokeLinecap="round" strokeDasharray={s} strokeDashoffset={s * (1 - cl(p * 2 - 1))} />
</svg>;
export const Check: React.FC<{ x: number; y: number; s: number; p: number; col?: string }> = ({ x, y, s, p, col = GRN }) => <svg width={s} height={s} style={{ position: "absolute", left: x - s / 2, top: y - s / 2 }}>
  <circle cx={s / 2} cy={s / 2} r={s * 0.44} fill="none" stroke={col} strokeWidth={s * 0.07} strokeDasharray={s * 2.8} strokeDashoffset={s * 2.8 * (1 - cl(p * 1.5))} />
  <path d={`M${s * 0.28} ${s * 0.52} L${s * 0.45} ${s * 0.68} L${s * 0.74} ${s * 0.34}`} stroke={col} strokeWidth={s * 0.09} fill="none" strokeLinecap="round" strokeLinejoin="round" strokeDasharray={s} strokeDashoffset={s * (1 - cl(p * 1.5 - 0.5))} />
</svg>;
export { Cross, Grains };

// ---- 0:08 · EL POLVITO DEL FONDO: la bolsa se vacía, el polvo va a la basura (X) y se desvía a una briqueta ----
export const HDustBag: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const tilt = eio(tt, 0.6, 1.6), pour = cl((tt - 1.4) / 2), x1 = cl(tt - 2.6), turn = eio(tt, 3.6, 4.6), bq = phys(tt, 4.6, 6, 0.5);
  return <>
    <Head tt={tt} kick="LO QUE CASI TODOS TIRAN" title="EL POLVO DEL FONDO DE LA BOLSA" />
    {/* bolsa de papel marrón que se inclina */}
    <div style={{ position: "absolute", left: 470, top: 330, width: 300, height: 400, transformOrigin: "80% 90%", transform: `rotate(${tilt * 62}deg)`, borderRadius: "8px 8px 18px 18px", background: "linear-gradient(90deg,#7a5634,#c69a66 40%,#a07a4e 70%,#5e4127)", boxShadow: "0 30px 60px rgba(0,0,0,.5)" }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 40, background: "repeating-linear-gradient(90deg,#8d6840 0 14px,#6e4f30 14px 28px)" }} />
      <div style={{ position: "absolute", left: 40, right: 40, top: 150, height: 90, border: "4px solid rgba(40,25,10,.6)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 44, color: "rgba(40,25,10,.75)" }}>CARBÓN</div>
    </div>
    {/* chorro de polvo: primero hacia la basura, después gira hacia la briqueta */}
    {Array.from({ length: 60 }, (_, i) => { const ph = ((tt * 0.9 + i / 60) % 1); if (pour <= 0 || ph > pour * 1.4) return null;
      const tx = 980 + (1 - turn) * 0 + turn * 420, ty = 820; const sx = 800, sy = 560;
      return <div key={i} style={{ position: "absolute", left: sx + (tx - sx) * ph + Math.sin(i) * 18 * ph, top: sy + (ty - sy) * ph * ph + 40 * Math.sin(ph * 3) * (1 - turn), width: 7 + (i % 4) * 3, height: 7 + (i % 4) * 3, borderRadius: "50%", background: "#141313", opacity: 0.9 }} />; })}
    {/* tacho de basura */}
    <div style={{ position: "absolute", left: 900, top: 800, width: 170, height: 230, clipPath: "polygon(0 0,100% 0,90% 100%,10% 100%)", background: "linear-gradient(90deg,#3d4a3f,#76877a 40%,#4c5a4f)", opacity: 1 - turn * 0.5 }} />
    <Cross x={985} y={900} s={170} p={x1} />
    <Tag tt={tt} at={2.8} x={985} y={760} txt="A LA BASURA" col={RED} size={32} />
    {/* la briqueta que sale de ese mismo polvo */}
    <div style={{ position: "absolute", left: 0, top: 0, opacity: cl(bq * 2), transform: `translateY(${(1 - cl(bq)) * 60}px)` }}><Briq x={1440} y={760} w={170} h={230} glow={0.25 + 0.25 * Math.sin(tt * 1.6)} /></div>
    <Tag tt={tt} at={5.1} x={1440} y={560} txt="UNA BRIQUETA" col={GRN} size={40} />
  </>;
}}</Stage>;

// ---- 0:33 · TRES HORAS DE BRASA PAREJA: brasero con un puñado y el reloj que da tres vueltas de hora ----
export const HThreeH: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const hrs = cl((tt - 1.2) / 4.2) * 3, g = 0.65 + 0.12 * Math.sin(tt * 1.3);
  return <>
    <Head tt={tt} kick="UN PUÑADO EN EL BRASERO" title="TRES HORAS DE BRASA" />
    {/* brasero de chapa */}
    <div style={{ position: "absolute", left: 360, top: 700, width: 560, height: 170, clipPath: "polygon(0 0,100% 0,86% 100%,14% 100%)", background: "linear-gradient(180deg,#3b3632,#151312)" }} />
    <div style={{ position: "absolute", left: 360, top: 680, width: 560, height: 46, borderRadius: "50%", background: "radial-gradient(ellipse,#5a1e0c,#1a0e08)" }} />
    {[[480, 640], [560, 630], [640, 636], [720, 628], [800, 640], [520, 600], [600, 592], [680, 596], [760, 600]].map(([x, y], i) => <Briq key={i} x={x} y={y + 30} w={74} h={96} glow={g * (0.7 + 0.3 * Math.sin(tt * 2 + i))} />)}
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>{[0, 1, 2].map((i) => <path key={i} d={`M${520 + i * 120} 560 q 20 -60 0 -120 q -20 -60 0 -120`} stroke="rgba(255,190,120,.18)" strokeWidth={14} fill="none" transform={`translate(0 ${-(tt * 30 % 60)})`} />)}</svg>
    {/* reloj: tres vueltas marcadas */}
    <svg width={520} height={520} style={{ position: "absolute", left: 1150, top: 300 }}>
      <circle cx={260} cy={260} r={220} fill="#14110f" stroke="#e8e2d6" strokeWidth={10} />
      {Array.from({ length: 12 }, (_, i) => <line key={i} x1={260 + 190 * Math.sin(i * Math.PI / 6)} y1={260 - 190 * Math.cos(i * Math.PI / 6)} x2={260 + 206 * Math.sin(i * Math.PI / 6)} y2={260 - 206 * Math.cos(i * Math.PI / 6)} stroke="#e8e2d6" strokeWidth={6} />)}
      {[0, 1, 2].map((k) => { const f = cl(hrs - k); if (f <= 0) return null; const r = 150 - k * 34, a = f * 2 * Math.PI; const big = f > 0.5 ? 1 : 0;
        return <path key={k} d={f >= 0.999 ? `M260 ${260 - r} A${r} ${r} 0 1 1 259.9 ${260 - r}` : `M260 ${260 - r} A${r} ${r} 0 ${big} 1 ${260 + r * Math.sin(a)} ${260 - r * Math.cos(a)}`} stroke={["#ff8a3d", "#ff6a2a", "#ff4a1a"][k]} strokeWidth={24} fill="none" strokeLinecap="round" />; })}
      <line x1={260} y1={260} x2={260 + 170 * Math.sin(hrs * 2 * Math.PI)} y2={260 - 170 * Math.cos(hrs * 2 * Math.PI)} stroke={TX} strokeWidth={8} strokeLinecap="round" />
      <circle cx={260} cy={260} r={14} fill={AMB} />
    </svg>
    <div style={{ position: "absolute", left: 1410, top: 870, transform: "translateX(-50%)", fontWeight: 900, fontSize: 88, color: AMB }}>{Math.floor(hrs)} h {String(Math.floor((hrs % 1) * 60)).padStart(2, "0")}</div>
    <Tag tt={tt} at={2.4} x={640} y={940} txt="SIN LLAMA · SIN CHISPAS" col={TX} size={34} />
  </>;
}}</Stage>;

// ---- 1:29 · VEINTE INTENTOS: 20 casilleros del cuaderno; 19 tachados (polvo, no prende, humo) y el último en verde ----
export const HTwenty: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="blinds" bg="linear-gradient(160deg,#e9e1cf,#cfc3a8)">{(tt) => {
  const n = Math.min(20, Math.floor(cl((tt - 0.8) / 4.4) * 20) + (tt > 0.8 ? 1 : 0)), fails = ["SE DESARMA", "NO PRENDE", "HUMO"];
  return <>
    <div style={{ position: "absolute", inset: 0, backgroundImage: "repeating-linear-gradient(180deg, transparent 0 46px, rgba(70,110,170,.25) 46px 48px)" }} />
    <div style={{ position: "absolute", left: 150, top: 0, bottom: 0, width: 3, background: "rgba(200,60,60,.5)" }} />
    <div style={{ position: "absolute", left: 200, top: 70, fontFamily: HAND, fontWeight: 700, fontSize: 84, color: "#1f2a44" }}>Briquetas · tandas de prueba</div>
    {Array.from({ length: 20 }, (_, i) => { const on = i < n, last = i === 19, c = i % 5, r = Math.floor(i / 5), x = 230 + c * 300, y = 260 + r * 190, s = phys(tt, 0.8 + i * 0.22, 8, 0.5);
      return on ? <div key={i} style={{ position: "absolute", left: x, top: y, width: 260, height: 160, transform: `scale(${0.7 + 0.3 * cl(s)}) rotate(${((i * 7) % 5) - 2}deg)`, opacity: cl(s * 2), borderRadius: 12, background: last ? "rgba(111,227,154,.25)" : "rgba(255,255,255,.5)", border: `3px solid ${last ? "#1f8a4c" : "rgba(31,42,68,.4)"}` }}>
        <div style={{ position: "absolute", left: 14, top: 8, fontFamily: HAND, fontWeight: 700, fontSize: 40, color: "#1f2a44" }}>#{i + 1}</div>
        <div style={{ position: "absolute", left: 14, bottom: 12, fontFamily: HAND, fontWeight: 700, fontSize: 36, color: last ? "#1f8a4c" : "#a3332b" }}>{last ? "¡ESTA!" : fails[i % 3]}</div>
        {!last && <svg width={260} height={160} style={{ position: "absolute", inset: 0 }}><path d="M20 140 L240 20" stroke="#a3332b" strokeWidth={6} strokeLinecap="round" strokeDasharray={260} strokeDashoffset={260 * (1 - cl((s - 0.6) * 3))} /></svg>}
      </div> : null; })}
    {n >= 20 && <div style={{ position: "absolute", left: 1690, top: 1010, transform: `translate(-50%,-50%) scale(${cl(phys(tt, 5.6, 7, 0.4))})`, fontFamily: HAND, fontWeight: 700, fontSize: 56, color: "#1f8a4c", whiteSpace: "nowrap" }}>1 de 20</div>}
  </>;
}}</Stage>;

// ---- 2:47 · MISMA ENERGÍA, SIN FORMA: balanza con un trozo grande y un montón de polvo, quedan iguales ----
export const HEnergy: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const drop = phys(tt, 0.7, 5, 0.3), tilt = 9 * Math.sin(tt * 3) * Math.exp(-tt * 0.7) * cl(tt - 0.7);
  return <>
    <Head tt={tt} kick="LA CARBONILLA" title="MISMA ENERGÍA · SIN FORMA" />
    <div style={{ position: "absolute", left: 950, top: 520, width: 20, height: 380, background: "linear-gradient(90deg,#6b5a3a,#d6b46a,#6b5a3a)" }} />
    <div style={{ position: "absolute", left: 860, top: 890, width: 200, height: 30, borderRadius: 8, background: "#8c7448" }} />
    <div style={{ position: "absolute", left: 960, top: 520, transform: `rotate(${tilt}deg)` }}>
      <div style={{ position: "absolute", left: -420, top: -6, width: 840, height: 12, borderRadius: 6, background: "linear-gradient(180deg,#f1d58e,#9c7b3c)" }} />
      {[-400, 400].map((x, i) => <div key={i} style={{ position: "absolute", left: x - 150, top: 0 }}>
        <svg width={300} height={200}><path d="M150 0 L30 150 M150 0 L270 150" stroke="#b8975a" strokeWidth={3} /><path d="M10 150 Q150 230 290 150 Z" fill="#c9a865" /></svg>
      </div>)}
      {/* trozo grande */}
      <div style={{ position: "absolute", left: -480, top: 60 - 140 * (1 - cl(drop)), width: 160, height: 110, clipPath: "polygon(10% 30%,40% 0,85% 12%,100% 55%,78% 100%,18% 92%,0 60%)", background: "linear-gradient(135deg,#4a4846,#121212 60%)" }} />
      {/* montón de polvo */}
      <div style={{ position: "absolute", left: 300, top: 110 - 140 * (1 - cl(drop)), width: 200, height: 60, borderRadius: "50% 50% 10% 10% / 100% 100% 10% 10%", background: "radial-gradient(ellipse at 50% 30%,#3a3836,#0e0e0e)" }} />
      <Grains n={30} x={300} y={150 - 140 * (1 - cl(drop))} w={200} h={14} col="#151515" s={6} />
    </div>
    <Tag tt={tt} at={1.4} x={560} y={830} txt="UN TROZO" size={38} />
    <Tag tt={tt} at={1.7} x={1360} y={830} txt="EL MISMO PESO EN POLVO" size={38} />
    <Tag tt={tt} at={3.6} x={960} y={990} txt="LE FALTA FORMA, NO CALOR" col={AMB} size={44} />
  </>;
}}</Stage>;

// ---- 3:19 · UN BALDE POR MES: almanaque de invierno, el balde se llena mes a mes ----
export const HBucketMonth: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const months = ["MAYO", "JUNIO", "JULIO", "AGOSTO"], m = cl((tt - 0.8) / 4.4) * 4;
  return <>
    <Head tt={tt} kick="SACUDO CADA BOLSA ADENTRO" title="UN BALDE POR MES" />
    {months.map((mo, i) => { const f = cl(m - i), s = phys(tt, 0.6 + i * 0.25, 7, 0.5);
      return <div key={i} style={{ position: "absolute", left: 210 + i * 400, top: 330, transform: `translateY(${(1 - cl(s)) * 60}px)`, opacity: cl(s * 2) }}>
        <div style={{ width: 300, height: 70, borderRadius: "14px 14px 0 0", background: f >= 1 ? "#c23b2c" : "#5a5550", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 36, letterSpacing: 4 }}>{mo}</div>
        <div style={{ position: "relative", width: 300, height: 480, background: "#efe9dc", borderRadius: "0 0 14px 14px" }}>
          <Bucket x={150} y={90} w={200} h={250} fill={f * 0.92} col="linear-gradient(180deg,#2a2a2a,#0c0c0c)" />
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 30, textAlign: "center", fontFamily: HAND, fontWeight: 700, fontSize: 46, color: f >= 1 ? "#1f8a4c" : "#6a645c" }}>{f >= 1 ? "lleno" : `${Math.round(f * 20)} L`}</div>
        </div>
      </div>; })}
    <Tag tt={tt} at={5.4} x={960} y={950} txt="SIN HACER NADA ESPECIAL" col={AMB} size={42} />
  </>;
}}</Stage>;

// ---- 3:55 · TAPABOCAS Y EL VIENTO A LA ESPALDA: silueta trasvasando, la nube de polvo se va para adelante ----
export const HWind: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe" bg="linear-gradient(180deg,#9fb9cf,#dfe7ec 60%,#8c8a7c 61%,#5d5a50)">{(tt) => {
  const m = phys(tt, 1.0, 6, 0.5);
  return <>
    <Head tt={tt} kick="SIEMPRE AFUERA" title="EL VIENTO A LA ESPALDA" col={ICE} />
    {/* flechas de viento desde atrás (izquierda) */}
    {Array.from({ length: 7 }, (_, i) => { const x = ((tt * 260 + i * 290) % 1900) - 100, y = 320 + (i * 97) % 380; return <svg key={i} width={200} height={40} style={{ position: "absolute", left: x, top: y, opacity: 0.6 }}><path d="M0 20 Q50 0 100 20 T200 20" stroke="#ffffff" strokeWidth={5} fill="none" strokeLinecap="round" /></svg>; })}
    {/* silueta */}
    <svg width={400} height={600} style={{ position: "absolute", left: 470, top: 380 }}>
      <circle cx={200} cy={80} r={56} fill="#22262b" />
      <path d="M130 150 Q200 130 270 150 L300 360 L250 360 L240 560 L160 560 L150 360 L100 360 Z" fill="#22262b" />
      <path d="M270 170 L380 300" stroke="#22262b" strokeWidth={34} strokeLinecap="round" />
      {/* tapabocas */}
      <rect x={210} y={82} width={58} height={40} rx={12} fill="#f2f2f2" opacity={cl(m)} />
      <path d="M212 90 L170 78 M212 112 L172 116" stroke="#f2f2f2" strokeWidth={4} opacity={cl(m)} />
    </svg>
    {/* balde y nube de polvo que se va para la derecha, lejos de la cara */}
    <div style={{ position: "absolute", left: 820, top: 700, width: 150, height: 170, clipPath: "polygon(0 0,100% 0,88% 100%,12% 100%)", background: "linear-gradient(90deg,#8a8f96,#e3e6ea,#6c7076)" }} />
    {Array.from({ length: 26 }, (_, i) => { const ph = (tt * 0.35 + i / 26) % 1, s = 40 + ph * 160; return <div key={i} style={{ position: "absolute", left: 880 + ph * 900 - s / 2, top: 690 - ph * 180 + 30 * Math.sin(i * 1.7) - s / 2, width: s, height: s, borderRadius: "50%", background: "rgba(30,30,30,.5)", filter: "blur(18px)", opacity: Math.sin(ph * Math.PI) }} />; })}
    <Tag tt={tt} at={1.4} x={720} y={330} txt="TAPABOCAS" col="#1b1b1b" size={40} />
    <Tag tt={tt} at={2.6} x={1460} y={330} txt="EL POLVO, PARA ADELANTE" col="#1b1b1b" size={40} />
  </>;
}}</Stage>;

// ---- 4:27 · EL CARBÓN SE HUNDE, LA CENIZA FLOTA: corte de un balde con agua ----
export const HFloat: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris" bg="radial-gradient(ellipse at 50% 40%, #20323f, #070b10 80%)">{(tt) => {
  const s = eio(tt, 0.8, 4.2);
  return <>
    <Head tt={tt} kick="EL TRUCO DEL BALDE CON AGUA" title="LO NEGRO VA AL FONDO" col={ICE} />
    <div style={{ position: "absolute", left: 610, top: 300, width: 700, height: 660, clipPath: "polygon(0 0,100% 0,90% 100%,10% 100%)", background: "linear-gradient(90deg,rgba(255,255,255,.22),rgba(255,255,255,.06) 30%,rgba(255,255,255,.18))", boxShadow: "inset 0 0 0 6px rgba(255,255,255,.35)" }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 90, bottom: 0, background: "linear-gradient(180deg,rgba(120,170,210,.35),rgba(60,100,140,.45))" }} />
      {Array.from({ length: 70 }, (_, i) => { const x = 80 + (i * 83) % 540, y0 = 120 + (i * 41) % 300, ash = i % 3 === 0; const y = ash ? y0 + (70 - y0) * s + Math.sin(tt * 1.4 + i) * 4 : y0 + (600 - (i * 13) % 50 - y0) * s;
        return <div key={i} style={{ position: "absolute", left: x + Math.sin(i + tt) * 6 * (1 - s), top: y, width: ash ? 18 : 12, height: ash ? 10 : 12, borderRadius: ash ? "40%" : "30%", background: ash ? "#b9b5ad" : "#0f0f0f" }} />; })}
    </div>
    <Tag tt={tt} at={3.2} x={1360} y={410} txt="CENIZA: FLOTA" col="#d6d2c9" size={40} anchor="l" />
    <Tag tt={tt} at={3.8} x={1340} y={880} txt="CARBÓN: AL FONDO" col={AMB} size={40} anchor="l" />
  </>;
}}</Stage>;

// ---- 4:46 · NADA MÁS GRANDE QUE UN GRANO DE ARROZ: nuez, uña, arroz y el mosquitero que deja pasar ----
export const HRice: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => {
  const a = phys(tt, 0.6, 6, 0.5), b = phys(tt, 1.2, 6, 0.5), c = phys(tt, 1.8, 6, 0.5), x2 = cl(tt - 2.6), x1 = cl(tt - 3.0), mesh = phys(tt, 3.6, 5, 0.6);
  const Lump = ({ x, s, p, lbl }: { x: number; s: number; p: number; lbl: string }) => <>
    <div style={{ position: "absolute", left: x - s / 2, top: 560 - s / 2, width: s, height: s * 0.8, transform: `scale(${cl(p)})`, clipPath: "polygon(12% 28%,42% 0,84% 10%,100% 52%,80% 100%,22% 94%,0 62%)", background: "linear-gradient(135deg,#565350,#111 65%)" }} />
    <Tag tt={tt} at={p > 0 ? 0 : 99} x={x} y={720} txt={lbl} size={36} />
  </>;
  return <>
    <Head tt={tt} kick="LO MUELO CON MARTILLO" title="NADA MÁS GRANDE QUE UN ARROZ" />
    <Lump x={420} s={230} p={a} lbl="UNA NUEZ" /><Lump x={860} s={110} p={b} lbl="UNA UÑA" /><Lump x={1220} s={30} p={c} lbl="UN ARROZ" />
    <Cross x={420} y={560} s={240} p={x1} /><Cross x={860} y={560} s={150} p={x2} />
    <Check x={1220} y={470} s={110} p={cl(tt - 3.2)} />
    {/* mosquitero */}
    <div style={{ position: "absolute", left: 1400, top: 360, width: 380, height: 380, transform: `scale(${cl(mesh)}) rotate(-4deg)`, borderRadius: 20, border: "10px solid #8a6a44", backgroundImage: "linear-gradient(rgba(220,220,220,.7) 2px, transparent 2px), linear-gradient(90deg, rgba(220,220,220,.7) 2px, transparent 2px)", backgroundSize: "18px 18px", backgroundColor: "rgba(30,30,30,.5)" }} />
    {Array.from({ length: 30 }, (_, i) => { const ph = (tt * 0.6 + i / 30) % 1; return mesh > 0.9 ? <div key={i} style={{ position: "absolute", left: 1440 + (i * 53) % 300, top: 740 + ph * 220, width: 6, height: 6, borderRadius: 2, background: "#111", opacity: 1 - ph }} /> : null; })}
    <Tag tt={tt} at={4.2} x={1590} y={320} txt="LO QUE PASA, SIRVE" col={GRN} size={34} />
  </>;
}}</Stage>;

// ---- 5:18 · NO CUALQUIER BARRO PEGA: tres montones (tierra negra, arena, arcilla) con su veredicto ----
export const HSoil: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const items = [{ n: "TIERRA NEGRA", sub: "raíces · hojas", c1: "#3a2a1c", c2: "#140d07", ok: false }, { n: "ARENA", sub: "no pega nada", c1: "#e2c88e", c2: "#a3864f", ok: false }, { n: "ARCILLA", sub: "se pega en las botas", c1: "#c4643a", c2: "#7a3519", ok: true }];
  return <>
    <Head tt={tt} kick="EL SECRETO QUE NADIE EXPLICA" title="NO CUALQUIER BARRO PEGA" />
    {items.map((it, i) => { const s = phys(tt, 0.7 + i * 0.6, 6, 0.45), v = cl(tt - (2.6 + i * 0.6)), x = 400 + i * 560;
      return <React.Fragment key={i}>
        <div style={{ position: "absolute", left: x - 210, top: 560 + (1 - cl(s)) * 80, width: 420, height: 230, opacity: cl(s * 2), borderRadius: "50% 50% 12% 12% / 90% 90% 10% 10%", background: `radial-gradient(ellipse at 45% 30%, ${it.c1}, ${it.c2})`, boxShadow: "0 30px 60px rgba(0,0,0,.5)" }}>
          {i === 0 && [[90, 60], [250, 90], [170, 140]].map(([a, b], j) => <div key={j} style={{ position: "absolute", left: a, top: b, width: 60, height: 6, borderRadius: 3, background: "#6b5a3a", transform: `rotate(${j * 40 - 20}deg)` }} />)}
          {i === 1 && <Grains n={80} x={30} y={40} w={360} h={170} col="rgba(255,255,255,.35)" s={5} />}
          {i === 2 && <div style={{ position: "absolute", inset: 0, borderRadius: "inherit", background: "linear-gradient(160deg, rgba(255,255,255,.25), transparent 40%)" }} />}
        </div>
        <Tag tt={tt} at={0.9 + i * 0.6} x={x} y={880} txt={it.n} size={42} col={it.ok ? AMB : TX} />
        <Tag tt={tt} at={1.2 + i * 0.6} x={x} y={935} txt={it.sub} size={28} col={DIM} />
        {it.ok ? <Check x={x} y={450} s={140} p={v} /> : <Cross x={x} y={450} s={130} p={v} />}
      </React.Fragment>; })}
  </>;
}}</Stage>;

// ---- 6:15 · DÓNDE APARECE: corte del patio con regla; negro arriba, a los 60 cm la tierra colorada ----
export const HLayers: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop" bg="linear-gradient(180deg,#1b2a3a,#0b0f14)">{(tt) => {
  const dig = eio(tt, 0.6, 3.4), y0 = 330, cm = 5.4;
  return <>
    <Head tt={tt} kick="CAVÁS UN POZO EN EL PATIO" title="A LOS 60 CM CAMBIA" />
    <div style={{ position: "absolute", left: 300, top: y0 - 26, width: 1100, height: 30, background: "linear-gradient(180deg,#3f6b2f,#2a4a20)" }} />
    <div style={{ position: "absolute", left: 300, top: y0, width: 1100, height: 60 * cm, background: "linear-gradient(180deg,#2b1d12,#3a2818)", clipPath: `inset(0 0 ${(1 - cl(dig * 1.6)) * 100}% 0)` }}>
      {[[120, 40], [380, 90], [700, 60], [900, 150]].map(([a, b], i) => <div key={i} style={{ position: "absolute", left: a, top: b, width: 120, height: 5, background: "#6b5a3a", transform: `rotate(${i * 30}deg)` }} />)}
    </div>
    <div style={{ position: "absolute", left: 300, top: y0 + 60 * cm, width: 1100, height: 40 * cm, background: "linear-gradient(180deg,#b5532b,#8f3b1b)", clipPath: `inset(0 0 ${(1 - cl(dig * 1.6 - 0.6)) * 100}% 0)` }} />
    {/* regla */}
    <div style={{ position: "absolute", left: 1450, top: y0, width: 70, height: 100 * cm * cl(dig * 1.2), background: "#f2d24b", overflow: "hidden" }}>
      {Array.from({ length: 11 }, (_, i) => <div key={i} style={{ position: "absolute", left: 0, top: i * 10 * cm, width: i % 5 === 0 ? 50 : 30, height: 4, background: "#1b1b1b" }} />)}
    </div>
    {[0, 50, 100].map((v, i) => <div key={i} style={{ position: "absolute", left: 1540, top: y0 + v * cm - 22, fontWeight: 900, fontSize: 36, opacity: cl(dig * 1.2 - v / 100) }}>{v} cm</div>)}
    <div style={{ position: "absolute", left: 300, top: y0 + 60 * cm, width: 1240 * cl(tt - 3.2), height: 5, background: AMB, boxShadow: `0 0 18px ${AMB}` }} />
    <Tag tt={tt} at={3.4} x={1650} y={y0 + 60 * cm} txt="60 CM" col={AMB} size={44} anchor="l" />
    <Tag tt={tt} at={1.6} x={850} y={y0 + 30 * cm} txt="NEGRA · NO SIRVE" col="rgba(255,255,255,.75)" size={40} />
    <Tag tt={tt} at={3.8} x={850} y={y0 + 80 * cm} txt="COLORADA, PESADA · ESA" col="#fff3e0" size={44} />
  </>;
}}</Stage>;

// ---- 6:27 · LA PRUEBA DEL CHORIZO: dos rollitos colgando; uno se desgrana, el otro se dobla en anillo ----
export const HSausage: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const hang = eio(tt, 1.0, 2.2), brk = cl((tt - 2.6) / 1.2), ring = eio(tt, 3.6, 5.4);
  return <>
    <Head tt={tt} kick="UN MINUTO · NO FALLA" title="LA PRUEBA DEL CHORIZO" />
    {/* izquierda: arena, se quiebra en pedacitos que caen */}
    <div style={{ position: "absolute", left: 560, top: 330, width: 70, height: 60, borderRadius: 20, background: "#e6c4a4" }} />
    {Array.from({ length: 8 }, (_, i) => { const fall = brk > i / 8 ? (brk - i / 8) * 8 : 0, y = 390 + i * 52 * (0.4 + 0.6 * hang) + fall * fall * 40, r = fall * (i % 2 ? 40 : -40);
      return <div key={i} style={{ position: "absolute", left: 572 + (fall ? (i % 2 ? 1 : -1) * fall * 14 : 0), top: y, width: 46, height: 54, borderRadius: 14, transform: `rotate(${r}deg)`, background: "linear-gradient(90deg,#9a6d45,#c99a6a,#8a5f3a)", opacity: cl(1.6 - fall * 0.2) }} />; })}
    <Tag tt={tt} at={2.8} x={560} y={900} txt="SE DESGRANA · ARENA" col={RED} size={36} />
    {/* derecha: arcilla, cuelga entero y se dobla en anillo */}
    <svg width={700} height={700} style={{ position: "absolute", left: 1000, top: 300 }}>
      <path d={ring < 0.02 ? `M300 60 L300 ${60 + 420 * (0.4 + 0.6 * hang)}` : `M300 60 C ${300 + 260 * ring} ${80 + 200 * (1 - ring)}, ${300 + 260 * ring} ${420 - 60 * ring}, 300 ${480 - 120 * ring} C ${300 - 260 * ring} ${420 - 60 * ring}, ${300 - 260 * ring} ${100}, ${300 - 10 * ring} ${60 + 20 * ring}`}
        stroke="url(#szg)" strokeWidth={50} fill="none" strokeLinecap="round" />
      <defs><linearGradient id="szg" x1="0" x2="1"><stop offset="0" stopColor="#7a3519" /><stop offset=".5" stopColor="#c4643a" /><stop offset="1" stopColor="#7a3519" /></linearGradient></defs>
      <rect x={265} y={20} width={70} height={60} rx={20} fill="#e6c4a4" />
    </svg>
    <Tag tt={tt} at={5.0} x={1340} y={900} txt="SE DOBLA ENTERO · ESA" col={GRN} size={36} />
  </>;
}}</Stage>;

// ---- 7:03 · LA PRUEBA DEL FRASCO: tres capas que se asientan (1 minuto / 1 hora / 1 día) y la regla del cuarto ----
export const HJar: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris" bg="linear-gradient(180deg,#d9dfe2,#9aa6ad)">{(tt) => {
  const L = [{ n: "ARENA", t: "1 minuto", c: "#cfae6e", a: 1.2, hh: 150 }, { n: "LIMO", t: "1 hora", c: "#8b7a5e", a: 2.8, hh: 90 }, { n: "ARCILLA", t: "1 día", c: "#b05a34", a: 4.4, hh: 80 }];
  let base = 860;
  const turb = 1 - eio(tt, 0.6, 5.6);
  return <>
    <div style={{ position: "absolute", left: 110, top: 80, fontWeight: 800, fontSize: 24, letterSpacing: 5, color: "#33404a" }}>DOS DEDOS DE TIERRA · AGUA · UNA PIZCA DE SAL</div>
    <div style={{ position: "absolute", left: 110, top: 116, fontWeight: 900, fontSize: 60, color: "#16212a" }}>LA PRUEBA DEL FRASCO</div>
    <div style={{ position: "absolute", left: 640, top: 280, width: 420, height: 620, borderRadius: "40px 40px 50px 50px", background: "linear-gradient(90deg,rgba(255,255,255,.55),rgba(255,255,255,.12) 30%,rgba(255,255,255,.35))", boxShadow: "inset 0 0 0 6px rgba(255,255,255,.7), 0 30px 60px rgba(0,0,0,.25)", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 70, bottom: 0, background: `rgba(140,100,70,${0.15 + 0.6 * turb})` }} />
      {L.map((l, i) => { const f = eio(tt, l.a - 0.6, l.a + 0.8), y = base - l.hh; base = y; return <div key={i} style={{ position: "absolute", left: 0, right: 0, top: y - 280, height: l.hh * f, transform: `translateY(${l.hh * (1 - f)}px)`, background: l.c }} />; })}
    </div>
    <div style={{ position: "absolute", left: 620, top: 250, width: 460, height: 50, borderRadius: 14, background: "linear-gradient(180deg,#d4a017,#8a6a10)" }} />
    {(() => { let b2 = 860; return L.map((l, i) => { const y = b2 - l.hh / 2; b2 -= l.hh; return <React.Fragment key={i}>
      <Tag tt={tt} at={l.a + 0.4} x={1110} y={y} txt={l.n} col="#16212a" size={40} anchor="l" />
      <Tag tt={tt} at={l.a + 0.6} x={1360} y={y} txt={l.t} col="#4a5862" size={34} anchor="l" />
    </React.Fragment>; }); })()}
    {/* la regla: arcilla ≥ 1/4 */}
    <div style={{ position: "absolute", left: 230, top: 520, transform: `scale(${cl(phys(tt, 6.0, 6, 0.5))})`, width: 340, padding: "20px 24px", borderRadius: 18, background: "#16212a", color: TX, fontWeight: 900, fontSize: 36, lineHeight: 1.2, textAlign: "center" }}>ARCILLA<br /><span style={{ fontSize: 84, color: AMB }}>≥ ¼</span><br />SIRVE</div>
  </>;
}}</Stage>;

// ---- 7:38 · EL HORNERO DEL CAMPO: un horno de barro dibujado y el sello «tiene liga / no tiene liga» ----
export const HOven: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop" bg="linear-gradient(180deg,#f0d9a8,#c9935a 60%,#6d4a2a 61%,#3d2a18)">{(tt) => {
  const d = eio(tt, 0.5, 2.6), s1 = phys(tt, 3.0, 8, 0.35), s2 = phys(tt, 4.0, 8, 0.35);
  return <>
    <div style={{ position: "absolute", left: 110, top: 80, fontWeight: 800, fontSize: 24, letterSpacing: 5, color: "#5a3a1c" }}>ALLÁ POR EL NOVENTA Y PICO</div>
    <div style={{ position: "absolute", left: 110, top: 116, fontWeight: 900, fontSize: 60, color: "#2a1a0c" }}>EL QUE HACÍA HORNOS DE BARRO</div>
    <svg width={900} height={600} style={{ position: "absolute", left: 300, top: 330 }}>
      <path d="M80 480 Q 80 80 450 70 Q 820 80 820 480 Z" fill="#a8582e" stroke="#4a2410" strokeWidth={8} strokeDasharray={2600} strokeDashoffset={2600 * (1 - d)} fillOpacity={cl(d * 1.4 - 0.4)} />
      <path d="M350 480 Q 350 300 450 300 Q 550 300 550 480 Z" fill="#1a0c06" opacity={cl(d * 2 - 1)} />
      <rect x={40} y={480} width={820} height={60} fill="#7a7068" opacity={cl(d * 2 - 1)} />
      <path d="M450 300 q -30 -50 0 -100 q 30 -50 0 -100" stroke="rgba(255,255,255,.4)" strokeWidth={14} fill="none" opacity={cl(d * 2 - 1)} transform={`translate(0 ${-(tt * 20 % 40)})`} />
    </svg>
    {[{ x: 1430, y: 480, txt: "TIENE LIGA", c: "#1f6b3a", s: s1, r: -8 }, { x: 1470, y: 720, txt: "NO TIENE LIGA", c: "#a3332b", s: s2, r: 6 }].map((st, i) => <div key={i} style={{ position: "absolute", left: st.x, top: st.y, transform: `translate(-50%,-50%) rotate(${st.r}deg) scale(${1.8 - 0.8 * cl(st.s)})`, opacity: cl(st.s * 3), padding: "12px 26px", border: `7px solid ${st.c}`, borderRadius: 12, color: st.c, fontWeight: 900, fontSize: 52, letterSpacing: 3, whiteSpace: "nowrap" }}>{st.txt}</div>)}
  </>;
}}</Stage>;

// ---- 8:27 · COLADO EN SECO: sol 3 días → martillo → mosquitero → polvo como harina ----
export const HDrySieve: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => {
  const steps = [{ n: "AL SOL", s: "2 · 3 días" }, { n: "MARTILLO", s: "en la arpillera" }, { n: "MOSQUITERO", s: "la misma malla" }, { n: "ARCILLA PURA", s: "como harina" }];
  return <>
    <Head tt={tt} kick="COLAR EL BARRO" title="EN SECO" />
    {steps.map((st, i) => { const s = phys(tt, 0.7 + i * 1.3, 6, 0.5), x = 300 + i * 440;
      return <React.Fragment key={i}>
        <div style={{ position: "absolute", left: x - 170, top: 370, width: 340, height: 340, borderRadius: 30, background: "#1c1916", boxShadow: "0 30px 70px rgba(0,0,0,.5), 0 0 0 1px rgba(255,255,255,.08)", transform: `translateY(${(1 - cl(s)) * 70}px) rotateY(${(1 - cl(s)) * 40}deg)`, opacity: cl(s * 2), overflow: "hidden" }}>
          {i === 0 && <><div style={{ position: "absolute", left: 110, top: 40, width: 120, height: 120, borderRadius: "50%", background: "radial-gradient(circle,#fff3b0,#ffb43a)", boxShadow: "0 0 60px #ffb43a" }} /><div style={{ position: "absolute", left: 40, right: 40, bottom: 50, height: 70, background: "#a0522d", clipPath: "polygon(0 40%,20% 10%,40% 50%,60% 0,80% 40%,100% 20%,100% 100%,0 100%)" }} /></>}
          {i === 1 && <><div style={{ position: "absolute", left: 40, right: 40, bottom: 50, height: 110, borderRadius: 16, background: "repeating-linear-gradient(45deg,#a88a5c 0 8px,#8a6e44 8px 16px)" }} /><div style={{ position: "absolute", left: 150, top: 40 + 50 * Math.abs(Math.sin(tt * 4)), width: 40, height: 150, background: "#7a5a34", borderRadius: 6 }}><div style={{ position: "absolute", left: -40, top: -10, width: 120, height: 50, borderRadius: 8, background: "linear-gradient(180deg,#9aa0a6,#4a4f55)" }} /></div></>}
          {i === 2 && <div style={{ position: "absolute", left: 40, top: 60, width: 260, height: 200, backgroundImage: "linear-gradient(rgba(220,220,220,.7) 2px, transparent 2px), linear-gradient(90deg, rgba(220,220,220,.7) 2px, transparent 2px)", backgroundSize: "16px 16px", border: "8px solid #8a6a44", borderRadius: 10 }} />}
          {i === 3 && <div style={{ position: "absolute", left: 50, right: 50, bottom: 60, height: 150, borderRadius: "50% 50% 12% 12% / 100% 100% 12% 12%", background: "radial-gradient(ellipse at 45% 30%,#e9a77e,#b56a42)" }} />}
        </div>
        <Tag tt={tt} at={1.0 + i * 1.3} x={x} y={780} txt={st.n} size={40} col={i === 3 ? AMB : TX} />
        <Tag tt={tt} at={1.2 + i * 1.3} x={x} y={830} txt={st.s} size={28} col={DIM} />
        {i < 3 && <div style={{ position: "absolute", left: x + 180, top: 530, width: 80 * cl(s), height: 6, background: AMB }} />}
      </React.Fragment>; })}
  </>;
}}</Stage>;

// ---- 9:16 · COLADO EN HÚMEDO: el chocolatado se asienta; agua clara arriba, la crema fina en el medio y la arenosa abajo ----
export const HSettle: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split" bg="radial-gradient(ellipse at 50% 40%, #2a2219, #0a0806 80%)">{(tt) => {
  const s = eio(tt, 0.8, 3.6), pour = eio(tt, 4.0, 5.6);
  return <>
    <Head tt={tt} kick="EN HÚMEDO · UNA NOCHE Y UN DÍA" title="LA CREMA ES EL PEGAMENTO" />
    <div style={{ position: "absolute", left: 960, top: 300, transform: `rotate(${-pour * 14}deg)`, transformOrigin: "100% 100%" }}>
      <div style={{ position: "absolute", left: -320, top: 0, width: 640, height: 620, clipPath: "polygon(0 0,100% 0,88% 100%,12% 100%)", background: "linear-gradient(90deg,#7d838a,#d7dadf 30%,#a9aeb4 62%,#5f646a)" }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 60 + pour * 140, height: 200 * s * (1 - pour * 0.9), background: "rgba(170,140,110,.45)" }} />
        <div style={{ position: "absolute", left: 0, right: 0, top: 60 + 200 * s, bottom: 0, background: `linear-gradient(180deg, rgba(110,62,38,${1 - s * 0.2}), #6a3a22)` }} />
        <div style={{ position: "absolute", left: 0, right: 0, top: 260 + 160 * s, bottom: 0, background: "#c06a3e", opacity: s }} />
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 120 * s, background: "repeating-linear-gradient(45deg,#8a6a4a 0 6px,#6e5236 6px 12px)" }} />
      </div>
    </div>
    <Tag tt={tt} at={2.6} x={1340} y={420} txt="AGUA CLARA · SE TIRA" col={ICE} size={34} anchor="l" />
    <Tag tt={tt} at={3.2} x={1340} y={640} txt="ARRIBA: LA QUE MÁS PEGA" col={AMB} size={34} anchor="l" />
    <Tag tt={tt} at={3.8} x={1300} y={860} txt="ABAJO: ARENOSA" col={DIM} size={32} anchor="l" />
  </>;
}}</Stage>;
