// componentes únicos de tdc28b · 13-24 (minutos 9-17): puerta, patas, base, chimenea, mariposa, hollín, ladrillos
import React from "react";
import { AMB, DIM, GRN, H, HAND, Head, ICE, RED, Stage, TX, Tag, cl, eio, phys } from "./hkit";
import { DrumFace, DrumSide } from "./heroes1";

const Sparks: React.FC<{ x: number; y: number; tt: number; on?: number }> = ({ x, y, tt, on = 1 }) => <>{on > 0.02 && Array.from({ length: 12 }, (_, i) => {
  const ph = (tt * 2.4 + i / 12) % 1, a = -2.6 + (i * 0.67) % 2, d = 30 + ph * 180;
  return <div key={i} style={{ position: "absolute", left: x + Math.cos(a) * d, top: y + Math.sin(a) * d + ph * ph * 110, width: 7, height: 7, borderRadius: 4, background: "#ffd27a", boxShadow: "0 0 10px #ffb040", opacity: on * (1 - ph) }} />;
})}</>;
const Cota: React.FC<{ x1: number; y1: number; x2: number; y2: number; p: number; txt: string; col?: string; dx?: number; dy?: number }> = ({ x1, y1, x2, y2, p, txt, col = AMB, dx = 0, dy = 0 }) => <>
  <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, pointerEvents: "none" }}><line x1={x1} y1={y1} x2={x1 + (x2 - x1) * p} y2={y1 + (y2 - y1) * p} stroke={col} strokeWidth={5} />
    {p > 0.02 && <circle cx={x1} cy={y1} r={8} fill={col} />}{p > 0.98 && <circle cx={x2} cy={y2} r={8} fill={col} />}</svg>
  <div style={{ position: "absolute", left: (x1 + x2) / 2 + dx, top: (y1 + y2) / 2 + dy, transform: "translate(-50%,-50%)", fontFamily: HAND, fontWeight: 700, fontSize: 60, color: col, opacity: cl(p * 2 - 1), whiteSpace: "nowrap", textShadow: "0 4px 16px rgba(0,0,0,.7)" }}>{txt}</div>
</>;
const Smoke: React.FC<{ pts: (ph: number, i: number) => [number, number]; tt: number; n?: number; col?: string; size?: number; on?: number; spd?: number }> = ({ pts, tt, n = 16, col = "rgba(150,150,150,.55)", size = 70, on = 1, spd = 0.5 }) => <>{on > 0.02 && Array.from({ length: n }, (_, i) => {
  const ph = (tt * spd + i / n) % 1, [x, y] = pts(ph, i), s = size * (0.5 + ph);
  return <div key={i} style={{ position: "absolute", left: x - s / 2, top: y - s / 2, width: s, height: s, borderRadius: "50%", background: col, filter: "blur(10px)", opacity: on * Math.sin(ph * Math.PI) }} />;
})}</>;

// ---- 9:00 · MARCAR LA PUERTA: el marcador dibuja el rectángulo de 30 × 25 en la tapa, más arriba de la mitad ----
export const HDoorMark: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const R = 330, cx = 860, cy = 600, w = 300, hh = 250, x0 = cx - w / 2, y0 = cy - 200, per = 2 * (w + hh), d = eio(tt, 0.8, 3.0);
  return <>
    <Head tt={tt} kick="EN LA TAPA REDONDA" title="MARCAR LA PUERTA" />
    <DrumFace x={cx} y={cy} r={R} />
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
      <line x1={cx - R} y1={cy} x2={cx + R} y2={cy} stroke="rgba(255,255,255,.35)" strokeWidth={3} strokeDasharray="12 10" opacity={cl(tt - 0.4)} />
      <rect x={x0} y={y0} width={w} height={hh} fill="none" stroke="#f4efe6" strokeWidth={10} strokeLinejoin="round" strokeDasharray={per} strokeDashoffset={per * (1 - d)} />
      <path d={`M${cx - R + 40} ${cy + 60} A${R - 40} ${R - 40} 0 0 0 ${cx + R - 40} ${cy + 60} Z`} fill="rgba(255,178,87,.12)" opacity={cl(tt - 3.6)} />
    </svg>
    {/* el marcador que recorre el contorno */}
    {d < 1 && (() => { const L = d * per, px = L < w ? x0 + L : L < w + hh ? x0 + w : L < 2 * w + hh ? x0 + w - (L - w - hh) : x0, py = L < w ? y0 : L < w + hh ? y0 + (L - w) : L < 2 * w + hh ? y0 + hh : y0 + hh - (L - 2 * w - hh);
      return <div style={{ position: "absolute", left: px - 14, top: py - 200, width: 28, height: 200, borderRadius: "6px 6px 14px 14px", background: "linear-gradient(90deg,#111,#3a3a3a,#111)", transform: "rotate(18deg)", transformOrigin: "bottom center" }}><div style={{ position: "absolute", bottom: -12, left: 8, width: 12, height: 18, background: "#222", borderRadius: "0 0 6px 6px" }} /></div>; })()}
    <Cota x1={x0} y1={y0 - 50} x2={x0 + w} y2={y0 - 50} p={eio(tt, 3.0, 3.8)} txt="30 cm" dy={-40} />
    <Cota x1={x0 + w + 50} y1={y0} x2={x0 + w + 50} y2={y0 + hh} p={eio(tt, 3.4, 4.2)} txt="25 cm" dx={90} />
    <Tag tt={tt} at={3.8} x={cx} y={cy + 170} txt="ACÁ ABAJO: PARRILLA Y LADRILLOS" col={AMB} size={30} />
    <Tag tt={tt} at={4.6} x={1500} y={y0 + 40} txt="MÁS ARRIBA DE LA MITAD" col={TX} size={36} />
  </>;
}}</Stage>;

// ---- 9:40 · EL TRUCO DEL HERRERO: tres lados cortados, bisagras puestas, recién el cuarto; la puerta cierra exacta ----
export const HCutOrder: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const cx = 860, cy = 600, w = 300, hh = 250, x0 = cx - w / 2, y0 = cy - 200;
  const c = [eio(tt, 0.6, 1.5), eio(tt, 1.5, 2.3), eio(tt, 2.3, 3.1)], hg = cl(phys(tt, 3.4, 7, 0.5)), c4 = eio(tt, 4.4, 5.2), open = eio(tt, 5.6, 6.6);
  const seg = [[x0, y0, x0 + w * c[0], y0], [x0, y0, x0, y0 + hh * c[1]], [x0 + w, y0, x0 + w, y0 + hh * c[2]], [x0, y0 + hh, x0 + w * c4, y0 + hh]];
  const tip = c4 > 0 && c4 < 1 ? [x0 + w * c4, y0 + hh] : c[2] > 0 && c[2] < 1 ? [x0 + w, y0 + hh * c[2]] : c[1] > 0 && c[1] < 1 ? [x0, y0 + hh * c[1]] : c[0] > 0 && c[0] < 1 ? [x0 + w * c[0], y0] : null;
  return <>
    <Head tt={tt} kick="EL TRUCO DEL HERRERO" title="NO CORTES LOS 4 LADOS" />
    <DrumFace x={cx} y={cy} r={330}>
      <div style={{ position: "absolute", left: x0 - (cx - 330), top: y0 - (cy - 330), width: w, height: hh, background: "#0b0705", opacity: open }} />
    </DrumFace>
    {/* la puerta (mismo pedazo) que se abre hacia abajo sobre las bisagras */}
    <div style={{ position: "absolute", left: x0, top: y0, width: w, height: hh, perspective: 900 }}>
      <div style={{ width: "100%", height: "100%", transformOrigin: "bottom", transform: `rotateX(${-100 * open}deg)`, background: "radial-gradient(circle at 40% 30%,#b5612f,#74391a)", boxShadow: open > 0 ? "0 20px 40px rgba(0,0,0,.5)" : "none", opacity: open > 0 ? 1 : 0 }} />
    </div>
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>{seg.map(([a, b, cc, d], i) => <line key={i} x1={a} y1={b} x2={cc} y2={d} stroke="#ffcf7a" strokeWidth={7} />)}</svg>
    {tip && <Sparks x={tip[0]} y={tip[1]} tt={tt} />}
    {[x0 + 50, x0 + w - 90].map((x, i) => <div key={i} style={{ position: "absolute", left: x, top: y0 + hh - 22 - (1 - hg) * 140, width: 40, height: 44, borderRadius: 6, background: "linear-gradient(90deg,#666,#ccc,#666)", opacity: hg, boxShadow: "0 8px 14px rgba(0,0,0,.5)" }}><div style={{ position: "absolute", left: 16, top: 0, width: 8, height: 44, background: "#333" }} /></div>)}
    {[["1 · ARRIBA", 0.6], ["2 · 3 · COSTADOS", 1.6], ["BISAGRAS", 3.4], ["4 · RECIÉN AHÍ", 4.4], ["CIERRA EXACTA, SIN LUZ", 6.0]].map(([l, a], i) => <Tag key={i} tt={tt} at={a as number} x={1300} y={330 + i * 90} txt={l as string} col={i === 4 ? GRN : i === 2 ? ICE : TX} size={38} anchor="l" />)}
  </>;
}}</Stage>;

// ---- 10:45 · LA MANIJA CON RESORTE: dos manijas al fuego; la pelada se pone al rojo, la del resorte queda tibia ----
export const HSpring: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const heat = eio(tt, 1.0, 4.4), a = Math.round(20 + 180 * heat), b = Math.round(20 + 40 * heat);
  const Hd = ({ x, spring, v }: { x: number; spring: boolean; v: number }) => <div style={{ position: "absolute", left: x, top: 380 }}>
    <svg width={420} height={360} viewBox="0 0 420 360"><path d="M40 330 L40 120 Q40 40 120 40 L300 40 Q380 40 380 120 L380 330" stroke={spring ? "#7a7a80" : `rgb(${120 + 135 * heat},${120 - 60 * heat},${120 - 90 * heat})`} strokeWidth={34} fill="none" strokeLinecap="round" style={{ filter: spring ? "none" : `drop-shadow(0 0 ${30 * heat}px rgba(255,90,40,${heat}))` }} />
      {spring && Array.from({ length: 16 }, (_, i) => <ellipse key={i} cx={120 + i * 12} cy={40} rx={8} ry={30} fill="none" stroke="#c9c9d0" strokeWidth={7} />)}</svg>
    <div style={{ textAlign: "center", fontWeight: 900, fontSize: 96, color: v > 100 ? RED : GRN, marginTop: 10 }}>{v}°</div>
    <div style={{ textAlign: "center", fontWeight: 900, fontSize: 34, color: DIM }}>{spring ? "CON RESORTE" : "PELADA"}</div>
  </div>;
  return <>
    <Head tt={tt} kick="TE CAMBIA LA VIDA" title="LA MANIJA CON RESORTE" />
    <div style={{ position: "absolute", left: 0, right: 0, top: 860, height: 220, background: `radial-gradient(ellipse 50% 60% at 50% 100%, rgba(255,120,40,${0.45 * heat}), transparent)` }} />
    <Hd x={330} spring={false} v={a} /><Hd x={1170} spring v={b} />
    <Tag tt={tt} at={4.8} x={1380} y={300} txt="EL AIRE DEL RESORTE AÍSLA" col={GRN} size={34} />
  </>;
}}</Stage>;

// ---- 11:10 · LAS CUNAS: el tambor baja y se apoya en dos cunas de hierro ángulo, 20 cm de aire abajo ----
export const HCradle: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const c = cl(phys(tt, 0.4, 6, 0.6)), d = phys(tt, 1.4, 5.5, 0.42), floorY = 900, drumY = 560 - (1 - d) * 340, gap = eio(tt, 2.6, 3.4);
  const opts = (h.opts as number[] | undefined) ?? [h.at + 4, h.at + 5, h.at + 6];
  return <>
    <Head tt={tt} kick="UN TAMBOR ACOSTADO RUEDA" title="LAS PATAS: DOS CUNAS" />
    <div style={{ position: "absolute", left: 0, right: 0, top: floorY, height: 10, background: "rgba(255,255,255,.25)" }} />
    {[600, 1140].map((x, i) => <svg key={i} width={260} height={300} style={{ position: "absolute", left: x - 130, top: floorY - 300 + (1 - c) * 60, opacity: c }}><path d="M30 300 L30 120 Q130 260 230 120 L230 300" stroke="#7d7d84" strokeWidth={26} fill="none" strokeLinejoin="round" /><path d="M30 300 L30 120 Q130 260 230 120 L230 300" stroke="rgba(255,255,255,.25)" strokeWidth={6} fill="none" /></svg>)}
    <DrumSide x={870} y={drumY} w={860} h={320} tone="burnt" />
    <Cota x1={1420} y1={floorY} x2={1420} y2={floorY - 200} p={gap} txt="20 cm" dx={110} />
    <div style={{ position: "absolute", left: 1530, top: 330, display: "flex", flexDirection: "column", gap: 18 }}>{["CUNAS SOLDADAS", "ÁNGULOS ATORNILLADOS", "DOS HILERAS DE LADRILLOS"].map((l, i) => { const on = cl((tt - (opts[i] - h.at)) * 3); return <div key={i} style={{ fontWeight: 900, fontSize: 30, padding: "10px 18px", borderRadius: 12, border: `3px solid ${on ? AMB : "rgba(255,255,255,.15)"}`, color: on ? TX : DIM, opacity: 0.3 + 0.7 * on, transform: `translateX(${(1 - on) * 40}px)` }}>{l}</div>; })}</div>
  </>;
}}</Stage>;

// ---- 12:12 · LA BASE QUE SOBRESALE: se abre la puerta, cae una brasa y aterriza sobre los ladrillos, no sobre la madera ----
export const HHearth: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const base = eio(tt, 0.5, 1.6), door = eio(tt, 2.2, 2.8) * (1 - eio(tt, 5.4, 6)), e = cl((tt - 2.8) / 1.1), ex = 1250 + 260 * e, ey = 640 + 300 * e * e - 160 * e, land = tt > 3.9;
  return <>
    <Head tt={tt} kick="LA BRASA SIEMPRE CAE" title="LA BASE SOBRESALE 45 cm" />
    <div style={{ position: "absolute", left: 0, right: 0, top: 940, height: 140, background: "repeating-linear-gradient(90deg,#6b4628 0 160px,#5a3a20 160px 164px)" }} />
    <div style={{ position: "absolute", left: 360, top: 900, width: 1240 * base, height: 50, display: "flex", overflow: "hidden" }}>{Array.from({ length: 12 }, (_, i) => <div key={i} style={{ flex: "0 0 100px", marginRight: 4, background: "linear-gradient(180deg,#c36a3f,#8d4426)", borderRadius: 3 }} />)}</div>
    <DrumSide x={800} y={680} w={860} h={330} tone="burnt" />
    <div style={{ position: "absolute", left: 1230, top: 610, width: 36, height: 120, background: "#0b0705", borderRadius: 6 }}><div style={{ position: "absolute", inset: 6, borderRadius: 6, background: "radial-gradient(ellipse at 50% 80%,#ffd27a,#ff7a1a 50%,transparent 75%)", opacity: door }} /></div>
    <div style={{ position: "absolute", left: 1266, top: 610, width: 30, height: 120, background: "#33241d", transformOrigin: "left", transform: `perspective(500px) rotateY(${-75 * door}deg)` }} />
    {tt > 2.8 && <div style={{ position: "absolute", left: land ? 1510 : ex, top: land ? 885 : ey, width: 28, height: 22, borderRadius: "50%", background: "radial-gradient(circle,#fff0b0,#ff8a20 60%,#a83a10)", boxShadow: "0 0 30px #ff8a20" }} />}
    <Cota x1={1230} y1={1010} x2={1600} y2={1010} p={eio(tt, 4.2, 5.0)} txt="45 cm" dy={-46} />
    {land && <Tag tt={tt} at={4.1} x={1560} y={800} txt="CAE SOBRE LADRILLO ✓" col={GRN} size={34} />}
    <Tag tt={tt} at={1.2} x={300} y={1010} txt="NUNCA MADERA NI ALFOMBRA" col={RED} size={30} anchor="l" />
  </>;
}}</Stage>;

// ---- 12:50 · CORTE EN PIZZA: el círculo del caño se corta en cruz, los triangulitos se doblan y el caño entra ajustado ----
export const HPizza: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const cx = 860, cy = 600, r = 220, ring = eio(tt, 0.4, 1.2), cut = eio(tt, 1.3, 2.6), fold = eio(tt, 2.9, 3.9), pipe = cl(phys(tt, 4.2, 5, 0.6)), sc = [cl(phys(tt, 5.4, 8, 0.4)), cl(phys(tt, 5.7, 8, 0.4)), cl(phys(tt, 6.0, 8, 0.4))];
  return <>
    <Head tt={tt} kick="EL AGUJERO DE LA CHIMENEA" title="SE CORTA COMO UNA PIZZA" />
    <div style={{ position: "absolute", left: cx - 470, top: cy - 420, width: 940, height: 840, borderRadius: 40, background: "radial-gradient(circle at 40% 30%,#5a4136,#33241d 60%,#1a120e)", boxShadow: "0 40px 100px rgba(0,0,0,.6)" }} />
    <div style={{ position: "absolute", left: cx - r, top: cy - r, width: 2 * r, height: 2 * r, borderRadius: "50%", background: fold > 0.2 ? "#050302" : "transparent", border: `6px dashed rgba(244,239,230,${ring})` }} />
    {Array.from({ length: 8 }, (_, i) => { const a = (i + 0.5) * 45; return <div key={i} style={{ position: "absolute", left: cx, top: cy, width: 0, height: 0, transform: `rotate(${a}deg)` }}>
      <div style={{ position: "absolute", left: 0, top: -r * Math.tan(Math.PI / 8), width: r, height: 2 * r * Math.tan(Math.PI / 8), clipPath: "polygon(0 50%, 100% 0, 100% 100%)", background: "linear-gradient(90deg,#4a3428,#6e4e3c)", transformOrigin: "right center", transform: `perspective(600px) rotateY(${-95 * fold}deg)`, opacity: pipe > 0.7 ? 0 : 1 }} />
    </div>; })}
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>{[0, 45, 90, 135].map((a, i) => { const k = cl(cut * 4 - i); const dx = Math.cos(a * Math.PI / 180) * r * k, dy = Math.sin(a * Math.PI / 180) * r * k; return <line key={i} x1={cx - dx} y1={cy - dy} x2={cx + dx} y2={cy + dy} stroke="#ffcf7a" strokeWidth={6} opacity={fold > 0.5 ? 0 : 1} />; })}</svg>
    {pipe > 0.02 && <div style={{ position: "absolute", left: cx - r + 10, top: cy - r + 10, width: 2 * r - 20, height: 2 * r - 20, borderRadius: "50%", background: "radial-gradient(circle,#050505 52%,#7a7a82 54%,#d0d0d8 64%,#5a5a62 74%)", transform: `scale(${0.4 + 0.6 * pipe})`, opacity: pipe, boxShadow: "0 20px 50px rgba(0,0,0,.6)" }} />}
    {[0, 120, 240].map((a, i) => <div key={i} style={{ position: "absolute", left: cx + Math.cos((a - 90) * Math.PI / 180) * (r + 50) - 18, top: cy + Math.sin((a - 90) * Math.PI / 180) * (r + 50) - 18, width: 36, height: 36, borderRadius: "50%", background: "radial-gradient(circle at 40% 40%,#eee,#888)", transform: `scale(${sc[i]})`, boxShadow: "0 6px 10px rgba(0,0,0,.5)" }}><div style={{ position: "absolute", left: 8, top: 16, width: 20, height: 4, background: "#555" }} /></div>)}
    {[["MARCÁS CON EL CAÑO", 0.6], ["CORTÁS EN CRUZ", 1.6], ["DOBLÁS LOS TRIANGULITOS", 3.0], ["3 AUTOPERFORANTES", 5.4]].map(([l, a], i) => <Tag key={i} tt={tt} at={a as number} x={1420} y={380 + i * 100} txt={l as string} size={36} anchor="l" col={i === 3 ? AMB : TX} />)}
  </>;
}}</Stage>;

// ---- 13:20 · EL ERROR DE LA CHIMENEA: caño corto y horizontal (el humo vuelve) contra caño vertical de 3-4 m (tira) ----
export const HDraft: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const s = cl(phys(tt, 0.4, 6, 0.6)), r = cl(phys(tt, 3.2, 6, 0.6)), ruler = eio(tt, 4.2, 5.4);
  return <>
    <Head tt={tt} kick="DONDE CASI TODOS SE EQUIVOCAN" title="EL HUMO SUBE SI EL CAÑO SUBE" col={RED} />
    {/* MAL: caño corto y largo horizontal */}
    <div style={{ opacity: s }}>
      <DrumSide x={430} y={850} w={360} h={150} tone="burnt" />
      <div style={{ position: "absolute", left: 330, top: 640, width: 40, height: 140, background: "linear-gradient(90deg,#3a3a3e,#9a9aa2,#4a4a50)" }} />
      <div style={{ position: "absolute", left: 330, top: 620, width: 420, height: 40, background: "linear-gradient(180deg,#3a3a3e,#9a9aa2,#4a4a50)" }} />
      <Smoke tt={tt} on={cl(tt - 0.8)} pts={(ph, i) => ph < 0.35 ? [350, 760 - ph * 380] : ph < 0.6 ? [350 + (ph - 0.35) * 900, 640] : [580 - (ph - 0.6) * 900 + Math.sin(i) * 20, 640 + (ph - 0.6) * 520]} col="rgba(120,120,120,.6)" />
      <div style={{ position: "absolute", left: 420, top: 420, transform: "translateX(-50%)", fontWeight: 900, fontSize: 44, color: RED }}>✗ VUELVE ADENTRO</div>
    </div>
    {/* BIEN: vertical alto */}
    <div style={{ opacity: r }}>
      <DrumSide x={1500} y={880} w={360} h={150} tone="burnt" />
      <div style={{ position: "absolute", left: 1400, top: 300, width: 40, height: 510, background: "linear-gradient(90deg,#3a3a3e,#9a9aa2,#4a4a50)" }} />
      <Smoke tt={tt} on={r} spd={0.8} pts={(ph, i) => [1420 + Math.sin(ph * 5 + i) * 30 * ph, 290 - ph * 220]} col="rgba(200,200,200,.45)" size={50} />
      <div style={{ position: "absolute", left: 1500, top: 960, transform: "translateX(-50%)", fontWeight: 900, fontSize: 44, color: GRN }}>✓ TIRA FUERTE</div>
    </div>
    <div style={{ position: "absolute", left: 1530, top: 810 - 510 * ruler, width: 20, height: 510 * ruler, background: `repeating-linear-gradient(180deg, ${AMB} 0 4px, transparent 4px 51px)`, borderLeft: `4px solid ${AMB}` }} />
    <div style={{ position: "absolute", left: 1580, top: 520, fontFamily: HAND, fontWeight: 700, fontSize: 70, color: AMB, opacity: ruler }}>3 a 4 m</div>
  </>;
}}</Stage>;

// ---- 14:00 · 60 cm SOBRE EL TECHO: el viento pega en el techo y empuja el humo de la chimenea baja; la alta con sombrerete lo larga ----
export const HRoofWind: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe" bg="radial-gradient(ellipse at 50% 30%, #1d2a3c, #070a10 75%)">{(tt) => {
  const hi = eio(tt, 3.0, 4.2), cap = cl(phys(tt, 4.6, 7, 0.5)), chH = 90 + 190 * hi, rx = 1300, ry = 400 + (rx - 960) * 0.658;
  return <>
    <Head tt={tt} kick="LA SALIDA" title="60 cm POR ENCIMA DEL TECHO" />
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}><path d="M200 900 L960 400 L1720 900 Z" fill="#3a2f2a" /><path d="M160 920 L960 390 L1760 920" stroke="#8a8a92" strokeWidth={18} fill="none" /></svg>
    <div style={{ position: "absolute", left: rx, top: ry - chH, width: 50, height: chH + 40, background: "linear-gradient(90deg,#3a3a3e,#9a9aa2,#4a4a50)" }} />
    <div style={{ position: "absolute", left: rx - 30, top: ry - chH - 60 + (1 - cap) * -80, width: 110, height: 50, clipPath: "polygon(50% 0, 100% 100%, 0 100%)", background: "#b0b0b8", opacity: cap }} />
    {Array.from({ length: 5 }, (_, i) => { const ph = (tt * 0.7 + i / 5) % 1; return <svg key={i} width={220} height={40} style={{ position: "absolute", left: 120 + ph * 900, top: 440 + i * 50 - ph * 40, opacity: Math.sin(ph * Math.PI) * 0.8 }}><path d="M0 20 Q50 0 100 20 T200 20" stroke={ICE} strokeWidth={6} fill="none" /></svg>; })}
    <Smoke tt={tt} on={1} pts={(ph, i) => hi < 0.5 ? [rx + 25 - ph * 80, ry - chH - ph * 30 + ph * ph * 380] : [rx + 25 + ph * 360, ry - chH - 40 - ph * 120 + Math.sin(i) * 20]} col={hi < 0.5 ? "rgba(110,110,110,.6)" : "rgba(200,200,200,.45)"} />
    <Cota x1={rx + 120} y1={ry} x2={rx + 120} y2={ry - chH} p={hi} txt="+60 cm" dx={110} />
    <Tag tt={tt} at={1.2} x={600} y={300} txt="BAJA: EL VIENTO LO EMPUJA ADENTRO" col={RED} size={34} />
    <Tag tt={tt} at={5.0} x={1500} y={300} txt="SOMBRERETE ✓" col={GRN} size={36} />
  </>;
}}</Stage>;

// ---- 14:15 · EL PASACHAPA: corte del techo; el caño caliente nunca toca la madera, queda un collar de aire ----
export const HCollar: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="blinds">{(tt) => {
  const bad = 1 - eio(tt, 3.6, 4.6), toast = eio(tt, 0.8, 3.2) * bad, cx = 900;
  return <>
    <Head tt={tt} kick="DONDE ATRAVIESA EL TECHO" title="NUNCA TOCA LA MADERA" />
    <div style={{ position: "absolute", left: 200, top: 560, width: 1400, height: 40, background: "linear-gradient(180deg,#a0a0a8,#5a5a62)" }} />
    <div style={{ position: "absolute", left: cx - 60 - 26 - 260 - bad * -0, top: 600, width: 260 - 80 * (1 - bad), height: 120, borderRadius: 6, background: `linear-gradient(180deg, rgb(${150 - 110 * toast},${100 - 80 * toast},${60 - 50 * toast}), rgb(${110 - 90 * toast},${70 - 60 * toast},${40 - 35 * toast}))`, boxShadow: toast > 0.6 ? `0 0 ${40 * toast}px rgba(255,90,30,${toast - 0.5})` : "none", transform: `translateX(${(1 - bad) * -80}px)` }}><div style={{ position: "absolute", left: 0, right: 0, top: 46, textAlign: "center", fontWeight: 900, fontSize: 26, color: "#f4efe6" }}>VIGA</div></div>
    <div style={{ position: "absolute", left: cx - 60, top: 280, width: 120, height: 700, background: "linear-gradient(90deg,#7a3a1a,#ff9a4a 45%,#8a3a1a)", boxShadow: "0 0 60px rgba(255,120,40,.5)" }} />
    {/* collar con aire */}
    <div style={{ position: "absolute", left: cx - 120, top: 520, width: 240, height: 120, border: `10px solid #c0c0c8`, borderTop: "none", borderBottom: "none", opacity: 1 - bad }} />
    {Array.from({ length: 6 }, (_, i) => { const ph = (tt * 0.9 + i / 6) % 1; return <div key={i} style={{ position: "absolute", left: cx + (i % 2 ? 72 : -96), top: 660 - ph * 160, width: 20, height: 34, borderRadius: 10, background: ICE, opacity: (1 - bad) * Math.sin(ph * Math.PI) }} />; })}
    {Array.from({ length: 5 }, (_, i) => <svg key={i} width={60} height={200} style={{ position: "absolute", left: cx - 140 - i * 26, top: 520, opacity: bad * 0.6 }}><path d={`M30 ${200 - ((tt * 80 + i * 40) % 200)} q-14 -20 0 -40 q14 -20 0 -40`} stroke="#ffb257" strokeWidth={5} fill="none" /></svg>)}
    <Tag tt={tt} at={1.2} x={1280} y={380} txt={bad > 0.5 ? "PEGADO: SE TUESTA Y UN DÍA PRENDE" : "COLLAR DE AIRE ✓"} col={bad > 0.5 ? RED : GRN} size={34} anchor="l" />
    <Tag tt={tt} at={4.8} x={1280} y={460} txt="SELLADOR DE ALTA TEMPERATURA" col={DIM} size={28} anchor="l" />
  </>;
}}</Stage>;

// ---- 14:50 · LA MARIPOSA: el disco gira adentro del caño y el fuego de abajo se aviva o se calma; tope antes de cerrar ----
export const HDamper: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const ang = 90 * eio(tt, 1.6, 3.0) - 20 * eio(tt, 4.6, 5.4) + 18 * eio(tt, 5.8, 6.4), open = 1 - ang / 90, fl = 0.4 + 0.6 * open;
  const wrong = tt > 4.4 && tt < 5.8;
  return <>
    <Head tt={tt} kick="LA LLAVE DE TIRO" title="LA MARIPOSA" />
    <div style={{ position: "absolute", left: 800, top: 230, width: 200, height: 560, background: "linear-gradient(90deg,#2a2a2e,#8a8a92 30%,#5a5a62 70%,#2a2a2e)", borderRadius: 8 }}>
      <div style={{ position: "absolute", left: 20, right: 20, top: 0, bottom: 0, background: "rgba(0,0,0,.55)" }} />
      <div style={{ position: "absolute", left: 20, top: 260, width: 160, height: 160, perspective: 500 }}><div style={{ width: "100%", height: "100%", borderRadius: "50%", background: "radial-gradient(circle at 40% 40%,#d0d0d8,#6a6a72)", transform: `rotateX(${90 - ang}deg)`, boxShadow: "0 0 0 4px #333" }} /></div>
      <div style={{ position: "absolute", left: 180, top: 330, width: 120, height: 16, background: "#bbb", borderRadius: 8 }} />
      <div style={{ position: "absolute", left: 290, top: 300, width: 16, height: 76, background: AMB, borderRadius: 8, transform: `rotate(${ang}deg)`, transformOrigin: "50% 50%" }} />
    </div>
    {Array.from({ length: 6 }, (_, i) => { const ph = (tt * (0.4 + 0.6 * open) + i / 6) % 1; return <div key={i} style={{ position: "absolute", left: 880 + Math.sin(i + ph * 4) * 20, top: 760 - ph * 520, width: 40, height: 40, borderRadius: "50%", background: "rgba(170,170,170,.5)", filter: "blur(8px)", opacity: Math.sin(ph * Math.PI) * (ph > 0.5 ? open + 0.15 : 1) }} />; })}
    <div style={{ position: "absolute", left: 760, top: 800, width: 280, height: 200, borderRadius: 30, background: "#120d0b" }}>
      <div style={{ position: "absolute", left: 140 - 90 * fl, bottom: 20, width: 180 * fl, height: 170 * fl * (0.92 + 0.08 * Math.sin(tt * 8)), borderRadius: "50% 50% 40% 40%", background: "radial-gradient(ellipse at 50% 85%,#fff3b8,#ff9a2a 45%,rgba(255,80,20,0) 75%)" }} />
    </div>
    <div style={{ position: "absolute", left: 1260, top: 380, fontWeight: 900, fontSize: 64, color: open > 0.7 ? AMB : wrong ? RED : GRN }}>{open > 0.7 ? "ABIERTA: TIRA FUERTE" : wrong ? "CERRADA: ✗ NUNCA" : "A LA MITAD ✓"}</div>
    <div style={{ position: "absolute", left: 1260, top: 470, fontWeight: 800, fontSize: 34, color: DIM }}>{open > 0.7 ? "" : "el calor se queda en el tambor"}</div>
  </>;
}}</Stage>;

// ---- 15:25 · EL HOLLÍN: el caño visto en corte se va cerrando mes a mes; se pone al rojo; el cepillo lo deja limpio ----
export const HSoot: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const build = eio(tt, 0.6, 3.0), fire = cl((tt - 3.0) * 1.4) * (1 - eio(tt, 4.6, 5.2)), brush = eio(tt, 4.6, 5.8), th = 110 * build * (1 - brush), R = 260;
  const M = ["JUNIO", "JULIO", "AGOSTO"], mi = Math.min(2, Math.floor(build * 3));
  return <>
    <Head tt={tt} kick="UNA VEZ POR MES" title="EL HOLLÍN SE PRENDE" />
    <div style={{ position: "absolute", left: 860 - R, top: 600 - R, width: 2 * R, height: 2 * R, borderRadius: "50%", background: "radial-gradient(circle,#b8b8c0 70%,#5a5a62 74%,#2a2a2e)", boxShadow: `0 0 ${120 * fire}px rgba(255,80,20,${0.8 * fire}), 0 40px 90px rgba(0,0,0,.6)` }}>
      <div style={{ position: "absolute", inset: 22, borderRadius: "50%", background: fire > 0.1 ? `radial-gradient(circle, #0b0b0c ${100 - (th / (R - 22)) * 100}%, rgb(${60 + 195 * fire},${40 + 60 * fire},20) ${100 - (th / (R - 22)) * 100}%)` : `radial-gradient(circle, #0b0b0c ${100 - (th / (R - 22)) * 100}%, #141210 ${100 - (th / (R - 22)) * 100}%)` }} />
    </div>
    {brush > 0 && brush < 1 && <div style={{ position: "absolute", left: 860 - 30, top: 600 - 30, width: 60, height: 60, transform: `rotate(${brush * 1080}deg)` }}>{Array.from({ length: 16 }, (_, i) => <div key={i} style={{ position: "absolute", left: 28, top: 30, width: 4, height: R - 30, background: "#d8c49a", transform: `rotate(${i * 22.5}deg)`, transformOrigin: "top" }} />)}</div>}
    <div style={{ position: "absolute", left: 1300, top: 400, fontWeight: 900, fontSize: 72, color: fire > 0.3 ? RED : brush > 0.5 ? GRN : TX }}>{fire > 0.3 ? "FUEGO DE CHIMENEA" : brush > 0.5 ? "LIMPIO ✓" : M[mi]}</div>
    <div style={{ position: "absolute", left: 1300, top: 500, fontWeight: 800, fontSize: 34, color: DIM }}>{fire > 0.3 ? "ruge y pone el caño al rojo" : brush > 0.5 ? "cepillo atado a una caña" : "el hollín se acumula"}</div>
  </>;
}}</Stage>;

// ---- 16:40 · LA CAMA DE LADRILLOS: corte del tambor; arena de 5 cm y los ladrillos que caen siguiendo la curva ----
export const HBrickBed: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const cx = 860, cy = 590, R = 340, sand = eio(tt, 0.6, 1.6);
  const bed = Array.from({ length: 9 }, (_, i) => { const a = Math.PI / 2 + (i - 4) * 0.21; return { x: cx + Math.cos(a) * (R - 60), y: cy + Math.sin(a) * (R - 60), r: (a - Math.PI / 2) * 57.3, at: 1.8 + i * 0.16 }; });
  const side = Array.from({ length: 6 }, (_, i) => { const L = i < 3, k = i % 3, a = L ? Math.PI / 2 + 1.1 + k * 0.22 : Math.PI / 2 - 1.1 - k * 0.22; return { x: cx + Math.cos(a) * (R - 46), y: cy + Math.sin(a) * (R - 46), r: (a - Math.PI / 2) * 57.3, at: 3.6 + i * 0.18 }; });
  const B = (b: { x: number; y: number; r: number; at: number }, i: number) => { const s = phys(tt, b.at, 7, 0.45); if (s <= 0) return null; return <div key={i} style={{ position: "absolute", left: b.x - 62, top: b.y - 30 - (1 - cl(s)) * 300, width: 124, height: 60, borderRadius: 4, transform: `rotate(${b.r}deg)`, background: "linear-gradient(180deg,#e8c99a,#c09060 60%,#9a6c40)", boxShadow: "inset 0 -6px 0 rgba(0,0,0,.15), 0 8px 14px rgba(0,0,0,.4)", opacity: cl(s * 3) }} />; };
  return <>
    <Head tt={tt} kick="EL PREMIO" title="LADRILLOS ADENTRO" />
    <div style={{ position: "absolute", left: cx - R - 20, top: cy - R - 20, width: 2 * R + 40, height: 2 * R + 40, borderRadius: "50%", border: "20px solid #4a342a", background: "radial-gradient(circle,#140e0b,#070504)", boxShadow: "0 40px 100px rgba(0,0,0,.7)" }} />
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}><defs><clipPath id="bbc"><circle cx={cx} cy={cy} r={R} /></clipPath></defs>
      <rect x={cx - R} y={cy + R - 36 * sand - 6} width={2 * R} height={60} fill="#d9c08a" clipPath="url(#bbc)" /></svg>
    {bed.map(B)}{side.map((b, i) => B(b, i + 20))}
    <Tag tt={tt} at={0.9} x={cx} y={cy + R + 60} txt="5 cm DE ARENA SECA" col="#e9d29a" size={32} />
    <Tag tt={tt} at={2.8} x={1250} y={460} txt="ACOSTADOS, SIGUIENDO LA CURVA" col={TX} size={27} anchor="l" />
    <Tag tt={tt} at={4.6} x={1280} y={540} anchor="l" txt="COSTADOS: HASTA 1/3" col={AMB} size={36} />
  </>;
}}</Stage>;
