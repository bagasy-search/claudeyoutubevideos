// c8pb · componentes únicos de rm8pb (Ramón: 12 Camry features). Inglés. Objetos en código.
import React from "react";
import { DIM, eio, H, MZ, RED, Stage, Tag, TX, VER } from "./ckit";
import { ab, Car, CHROME, cl, Finger, Hand, HAND, lerp, phys, rnd, SHAD, STEEL, txt, YEL } from "./r8";
type C = React.FC<{ t: number; h: H }>;
const LCD = "'Courier New', monospace";

// 1 · cinta métrica: seis pulgadas de la mano a la palanca
const Regla: C = ({ t, h }) => <Stage t={t} h={h} mode="drop" tone="#20242b">{(tt) => {
  const k = eio(tt, 0.4, 2.0), w = k * 1040;
  return <>
    <div style={ab(150, 330, { width: 300, height: 520, borderRadius: 150, background: "linear-gradient(90deg,#b9845e,#dcaa82 45%,#b07a55)", boxShadow: SHAD, transform: "rotate(-8deg)" })} />
    <div style={ab(400, 360, { width: 170, height: 170, borderRadius: 28, background: "linear-gradient(#d9b320,#a48413)", boxShadow: SHAD, zIndex: 3 })}><div style={ab(45, 45, { width: 80, height: 80, borderRadius: "50%", background: "#26282c" })} /></div>
    <div style={ab(560, 410, { width: w, height: 90, background: "linear-gradient(#f4d34c,#d9b320)", overflow: "hidden", boxShadow: "0 12px 20px rgba(0,0,0,.45)" })}>{Array.from({ length: 7 }, (_, i) => <React.Fragment key={i}><div style={ab(i * 173, 0, { width: 6, height: 54, background: "#1b1b1b" })} /><div style={{ ...txt(i * 173 + 14, 42, 42, "#1b1b1b") }}>{i}</div></React.Fragment>)}</div>
    <div style={ab(1540, 300, { width: 220, height: 220, borderRadius: "50%", background: "radial-gradient(circle at 38% 34%,#5c6168,#16181b)", boxShadow: `${SHAD}, 0 0 ${k * 90}px rgba(255,214,120,${k * .8})` })}><div style={{ ...txt(0, 54, 112, MZ), width: 220, textAlign: "center" }}>S</div></div>
    <div style={ab(1610, 520, { width: 80, height: 420, background: "linear-gradient(90deg,#26282c,#55595f,#26282c)" })} />
  </>;
}}</Stage>;

// 2 · etiqueta de ventanilla: sello «PAID»
const SelloPaid: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" tone="#23262c">{(tt) => {
  const dn = eio(tt, 0.9, 1.25), up = eio(tt, 1.55, 2.2), hit = tt > 1.25, sh = hit ? Math.exp(-(tt - 1.25) * 9) * 10 : 0;
  return <>
    <div style={ab(490, 90 + sh, { width: 940, height: 860, background: "linear-gradient(170deg,#fbfaf3,#ebe7d8)", boxShadow: SHAD })}>
      <div style={ab(0, 0, { width: 940, height: 92, background: "#2f4a74" })} />
      {Array.from({ length: 13 }, (_, i) => <React.Fragment key={i}><div style={ab(60, 150 + i * 50, { width: 330 + rnd(i) * 180, height: 12, background: "#b7b7ae" })} /><div style={ab(760, 150 + i * 50, { width: 110, height: 12, background: "#8e8e86" })} /></React.Fragment>)}
      {hit && <div style={{ ...txt(130, 300, 230, "rgba(186,36,30,.88)"), transform: "rotate(-11deg)", border: "16px solid rgba(186,36,30,.88)", padding: "14px 40px", borderRadius: 22 }}>PAID</div>}
    </div>
    <div style={ab(790, -640 + dn * 860 - up * 860, { width: 340, height: 520 })}><div style={ab(120, 0, { width: 100, height: 300, background: "linear-gradient(90deg,#54351c,#8a5d33,#54351c)" })} /><div style={ab(0, 280, { width: 340, height: 170, borderRadius: 30, background: "linear-gradient(90deg,#54351c,#8a5d33,#54351c)" })} /><div style={ab(20, 450, { width: 300, height: 70, background: "#8e231c" })} /></div>
  </>;
}}</Stage>;

// 3 · el triangulito del medidor empuja la tapa del tanque
const Triangulito: C = ({ t, h }) => <Stage t={t} h={h} mode="ring" tone="#191d24" mesa={false}>{(tt) => {
  const p = eio(tt, 0.9, 1.6), op = eio(tt, 1.9, 2.8), pl = 1 + 0.1 * Math.sin(tt * 6) * cl(tt - 0.9), nd = -38 + 10 * Math.sin(tt * 0.8);
  return <>
    <div style={ab(170, 180, { width: 720, height: 720, borderRadius: "50%", background: "radial-gradient(#22262c,#0c0d10)", boxShadow: "0 0 0 16px #5b626a," + SHAD })}>
      <div style={{ ...txt(90, 390, 80, RED) }}>E</div><div style={{ ...txt(570, 390, 80, TX) }}>F</div>
      <svg width="130" height="130" viewBox="0 0 24 24" style={{ position: "absolute", left: 295, top: 470 }}><path d="M4 21V5a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v16zM6.5 5.5v5h6v-5zM15 12h2a2 2 0 0 1 2 2v3a1 1 0 0 0 2 0V9l-3-3" fill="#e8e6dc" stroke="#e8e6dc" strokeWidth=".6" /></svg>
      <div style={ab(352, 110, { width: 16, height: 262, background: RED, transformOrigin: "50% 100%", transform: `rotate(${nd}deg)`, borderRadius: 8 })} /><div style={ab(320, 330, { width: 80, height: 80, borderRadius: "50%", background: CHROME })} />
      <svg width="90" height="90" viewBox="0 0 90 90" style={{ position: "absolute", left: 470, top: 505, transform: `scale(${(1 + p * 0.9) * pl})`, filter: `drop-shadow(0 0 ${p * 22}px #ffcf6a)` }}><path d="M12 45 L78 10 L78 80 Z" fill={p > 0.1 ? MZ : "#a7a59a"} transform="rotate(180 45 45)" /></svg>
    </div>
    <Car x={1460} y={930} w={830} c="#b4b9c0" />
    <div style={ab(1090, 660, { width: 92, height: 92, perspective: 500 })}><div style={{ width: 92, height: 92, borderRadius: 12, background: "radial-gradient(#151618,#3a3d42)" }} /><div style={{ position: "absolute", left: 0, top: 0, width: 92, height: 92, borderRadius: 12, background: "linear-gradient(135deg,#d0d5da,#7f868e)", transformOrigin: "0 50%", transform: `rotateY(${-op * 112}deg)`, boxShadow: "0 0 0 3px #4d5258" }} /></div>
  </>;
}}</Stage>;

// 4 · perilla que se aprieta y gira el tambor de la pantalla
const Perilla: C = ({ t, h }) => <Stage t={t} h={h} mode="split" tone="#171a20" mesa={false}>{(tt) => {
  const L = ["TRIP A", "TRIP B", "RANGE", "AVG MPG", "INSTANT"], times = [0.9, 1.8, 2.7, 3.6], step = times.reduce((s, a) => s + eio(tt, a, a + 0.35), 0), press = Math.max(0, ...times.map((a) => Math.sin(cl((tt - a) / 0.42) * Math.PI)));
  return <>
    <div style={ab(0, 0, { width: 1920, height: 1080, background: "linear-gradient(#20232a,#0b0c0f)" })} />
    <div style={ab(330, 270, { width: 1260, height: 330, borderRadius: 30, background: "#0a1116", boxShadow: "inset 0 0 0 10px #3b4047, 0 0 40px rgba(120,200,255,.18)", overflow: "hidden" })}>
      <div style={{ position: "absolute", left: 0, top: 75 - step * 180, width: 1260 }}>{L.map((s, i) => <div key={i} style={{ height: 180, textAlign: "center", fontFamily: LCD, fontWeight: 900, fontSize: 150, lineHeight: "180px", color: i === Math.round(step) ? "#8fe4ff" : "#2b5163" }}>{s}</div>)}</div>
    </div>
    <div style={ab(860, 650, { width: 200, height: 200 })}><div style={ab(60, 0, { width: 80, height: 90 - press * 46, background: "linear-gradient(90deg,#3a3f46,#b4bac1,#3a3f46)", marginTop: press * 46 })} /><div style={ab(0, 76 + press * 46, { width: 200, height: 200, borderRadius: "50%", background: "radial-gradient(circle at 38% 34%,#7a8088,#1c1e22)", boxShadow: SHAD })} /></div>
    <div style={{ position: "absolute", inset: 0, transform: `translateY(${press * 46 + (1 - eio(tt, 0.2, 0.8)) * 500}px) rotate(180deg)`, transformOrigin: "960px 760px" }}><Finger x={960} y={640} w={140} /></div>
  </>;
}}</Stage>;

// 5 · la pantalla con ojos que la juzga
const Juez: C = ({ t, h }) => <Stage t={t} h={h} mode="diag" tone="#1a1e26" mesa={false}>{(tt) => {
  const v = lerp(23, 27, eio(tt, 1.6, 3.4)), lid = 0.25 + 0.35 * cl(tt - 0.6) - 0.28 * eio(tt, 3.2, 3.6), lk = 26 * Math.sin(tt * 1.4);
  const Eye: React.FC<{ x: number; mir: number }> = ({ x, mir }) => <div style={ab(x, 140, { width: 340, height: 340, borderRadius: "50%", background: "radial-gradient(#fff,#d7d5cd)", overflow: "hidden", boxShadow: SHAD })}><div style={ab(90 + lk, 110, { width: 150, height: 150, borderRadius: "50%", background: "radial-gradient(circle at 40% 36%,#3f6b5a,#0c1512 60%)" })} /><div style={ab(-20, -30, { width: 380, height: 150 + lid * 190, background: "linear-gradient(#b58b6e,#83604a)", borderBottom: "8px solid #4c3627", transform: `rotate(${mir * 10}deg)` })} /></div>;
  return <>
    <Eye x={530} mir={1} /><Eye x={1050} mir={-1} />
    <div style={ab(420, 540, { width: 1080, height: 380, borderRadius: 28, background: "#090f12", boxShadow: "inset 0 0 0 12px #383c43," + SHAD })}><div style={{ fontFamily: LCD, fontWeight: 900, position: "absolute", left: 0, width: 1080, top: 70, textAlign: "center", fontSize: 230, lineHeight: 1, color: "#8fe4ff" }}>{v.toFixed(1)}</div></div>
    <Tag tt={tt} at={3.4} x={960} y={985} txt="MPG" col={MZ} size={96} />
  </>;
}}</Stage>;

// 6 · el auto desde arriba y una llanta floja
const CuatroPres: C = ({ t, h }) => <Stage t={t} h={h} mode="blinds" tone="#20262e" mesa={false}>{(tt) => {
  const V = [["35", 590, 200, 0.5], ["35", 1330, 200, 1.0], ["35", 590, 880, 1.5], ["26", 1330, 880, 2.1]] as const;
  return <>
    <div style={ab(0, 0, { width: 1920, height: 1080, background: "linear-gradient(#55585d,#3a3c41)" })} />
    <div style={ab(960 - 260, 90, { width: 520, height: 900 })}>
      {[[-44, 130], [-44 + 508, 130], [-44, 640], [-44 + 508, 640]].map(([x, y], i) => <div key={i} style={ab(x, y, { width: 96, height: 190, borderRadius: 18, background: "linear-gradient(90deg,#111,#3a3a3d,#111)", boxShadow: i === 3 && tt > 2.1 ? `0 0 ${(38 + 16 * Math.sin(tt * 7))}px ${RED}` : undefined })} />)}
      <div style={ab(0, 0, { width: 520, height: 900, borderRadius: "90px 90px 70px 70px", background: "linear-gradient(90deg,#8f949b,#dfe3e8 45%,#8f949b)", boxShadow: SHAD })}><div style={ab(60, 200, { width: 400, height: 170, borderRadius: "40px 40px 12px 12px", background: "#1b2632" })} /><div style={ab(70, 590, { width: 380, height: 130, borderRadius: "12px 12px 34px 34px", background: "#1b2632" })} /></div>
    </div>
    {V.map(([n, x, y, a], i) => { const k = phys(tt, a, 8, 0.45); return <div key={i} style={ab(x - 150, y - 80, { width: 300, height: 170, borderRadius: 26, opacity: cl(k * 2), transform: `scale(${k})`, background: "#0a1014", boxShadow: "inset 0 0 0 8px #3c4148," + SHAD })}><div style={{ fontFamily: LCD, fontWeight: 900, position: "absolute", width: 300, textAlign: "center", top: 18, fontSize: 138, color: n === "26" ? "#ff6a54" : "#8fe4ff" }}>{n}</div></div>; })}
  </>;
}}</Stage>;

// 7 · la llanta cocinándose en el comal
const Comal: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe" tone="#2a1a14" mesa={false}>{(tt) => {
  const hot = cl(tt / 3);
  return <>
    {Array.from({ length: 16 }, (_, i) => { const f = 90 + 80 * Math.abs(Math.sin(tt * 7 + i * 2.1)); return <div key={i} style={ab(340 + i * 80, 990 - f, { width: 62, height: f, borderRadius: "50% 50% 20% 20%", background: "linear-gradient(#ffd166,#f2701d 60%,#a2280e)", filter: "blur(3px)" })} />; })}
    <div style={ab(260, 760, { width: 1400, height: 160, borderRadius: "50%", background: `radial-gradient(hsl(14 ${30 + hot * 30}% ${16 + hot * 16}%),#0f0f10)`, boxShadow: SHAD })} />
    <div style={ab(560, 390, { width: 800, height: 450 })}><div style={ab(0, 90, { width: 800, height: 280, background: "linear-gradient(#28292c,#121316 60%,#2c2d30)" })} /><div style={ab(0, 0, { width: 800, height: 190, borderRadius: "50%", background: "repeating-conic-gradient(#2c2d30 0 7deg,#141517 7deg 14deg)" })}><div style={ab(190, 44, { width: 420, height: 102, borderRadius: "50%", background: "radial-gradient(#7c8188,#2b2d31)" })} /></div><div style={ab(0, 280, { width: 800, height: 96, borderRadius: "50%", background: "#141517" })} /></div>
    {[0, 1, 2, 3, 4].map((i) => <div key={i} style={ab(640 + i * 150 + 22 * Math.sin(tt * 1.6 + i), 60 + (((tt * 0.5 + i * 0.2) % 1) * -40), { width: 60, height: 330, borderRadius: 30, background: "rgba(210,210,215,.3)", filter: "blur(24px)", opacity: hot })} />)}
    <Tag tt={tt} at={2.3} x={1560} y={260} txt="I-35" col={MZ} size={100} />
  </>;
}}</Stage>;

// 8 · la palanca baja a D y se corre a S
const PalancaS: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" tone="#191c22" mesa={false}>{(tt) => {
  const dn = eio(tt, 0.5, 1.7), sd = eio(tt, 2.1, 2.7), y = 190 + dn * 500, x = 780 + sd * 262, lit = cl((tt - 2.6) * 3);
  return <>
    <div style={ab(470, 80, { width: 980, height: 920, borderRadius: 44, background: "linear-gradient(#2b2e34,#121316)", boxShadow: SHAD })} />
    <div style={ab(748, 180, { width: 64, height: 560, background: "#050506", borderRadius: 30 })} /><div style={ab(748, 680, { width: 400, height: 64, background: "#050506", borderRadius: 30 })} />
    {["P", "R", "N", "D"].map((s, i) => <div key={s} style={{ ...txt(610, 160 + i * 166, 112, "#dfe1e4") }}>{s}</div>)}
    <div style={{ ...txt(1190, 650, 170, lit > 0 ? MZ : "#737579"), textShadow: `0 0 ${lit * 50}px #ffcf6a` }}>S</div>
    <div style={ab(x - 15, y - 60, { width: 130, height: 200, borderRadius: 64, background: "radial-gradient(circle at 40% 28%,#6b7077,#1b1c20)", boxShadow: "0 28px 40px rgba(0,0,0,.65)" })}><div style={ab(45, 18, { width: 40, height: 16, background: "#c8ccd1", borderRadius: 8 })} /></div>
  </>;
}}</Stage>;

// 9 · bajada larga: el disco se pone al rojo
const CuestaDisco: C = ({ t, h }) => <Stage t={t} h={h} mode="diag" tone="#1e2632" mesa={false}>{(tt) => {
  const heat = cl((tt - 0.6) / 3), x = 480 + tt * 110, sp = tt * 500;
  return <>
    <div style={ab(-200, 0, { width: 2320, height: 1200, background: "linear-gradient(#34495f,#1b2531)" })} />
    <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transform: "rotate(10deg)", transformOrigin: "20% 60%" }}>
      <div style={ab(-400, 690, { width: 2800, height: 700, background: "linear-gradient(#4b4b4f,#232326)" })} />
      <Car x={x} y={740} w={720} c="#c5c9ce" spin={sp} />
    </div>
    <div style={ab(1160, 180, { width: 640, height: 640, borderRadius: "50%", background: `conic-gradient(hsl(14 ${10 + heat * 86}% ${44 + heat * 12}%),hsl(22 ${10 + heat * 88}% ${60 + heat * 8}%),hsl(14 ${10 + heat * 86}% ${44 + heat * 12}%),hsl(22 ${10 + heat * 88}% ${58 + heat * 8}%))`, boxShadow: `${SHAD}, 0 0 ${heat * 150}px rgba(255,90,20,${heat * .85})`, transform: `rotate(${sp * 1.4}deg)` })}><div style={ab(190, 190, { width: 260, height: 260, borderRadius: "50%", background: "radial-gradient(#3a3d42,#17181b)" })} />{Array.from({ length: 22 }, (_, i) => <div key={i} style={ab(314, 18, { width: 12, height: 150, background: "rgba(0,0,0,.25)", transformOrigin: "6px 302px", transform: `rotate(${i * 16.4}deg)` })} />)}</div>
    <div style={ab(1240, 40, { width: 480, height: 280, borderRadius: "40px 40px 10px 10px", background: "linear-gradient(#b52a24,#6b1511)", boxShadow: "0 20px 34px rgba(0,0,0,.6)" })} />
  </>;
}}</Stage>;

// 10 · el olor entra por la rejilla
const Rejilla: C = ({ t, h }) => <Stage t={t} h={h} mode="ring" tone="#16181c" mesa={false}>{(tt) => {
  const s = cl((tt - 0.5) / 2.2);
  return <>
    <div style={ab(0, 0, { width: 1920, height: 1080, background: "linear-gradient(#26282e,#0c0d10)" })} />
    <div style={ab(360, 470, { width: 1200, height: 460, borderRadius: 40, background: "#0a0b0d", boxShadow: "inset 0 0 0 14px #3c4047," + SHAD })}>{Array.from({ length: 7 }, (_, i) => <div key={i} style={ab(30, 26 + i * 60, { width: 1140, height: 40, borderRadius: 8, background: "linear-gradient(#5e636a,#23252a)", transform: `perspective(700px) rotateX(${-28 + 6 * Math.sin(tt * 2 + i)}deg)` })} />)}</div>
    <svg width="1600" height="900" viewBox="0 0 1600 900" style={{ position: "absolute", left: 160, top: 0, opacity: s, overflow: "visible" }}>{Array.from({ length: 7 }, (_, i) => <path key={i} d={`M${240 + i * 180} 700 C ${140 + i * 180} 520, ${350 + i * 180} 380, ${240 + i * 180} 220 C ${160 + i * 180} 120, ${320 + i * 180} 70, ${250 + i * 180} -30`} fill="none" stroke={`rgba(226,214,196,${0.55 - i * 0.03})`} strokeWidth={46 - i * 2} strokeLinecap="round" pathLength={1} strokeDasharray=".5 .5" strokeDashoffset={-tt * 0.36 - i * 0.14} style={{ filter: "blur(14px)" }} />)}</svg>
    <Tag tt={tt} at={2.4} x={960} y={180} txt="EVERY SUNDAY" col={MZ} size={92} />
  </>;
}}</Stage>;

// 11 · la pickup verde del 62 bajando la sierra
const Pickup62: C = ({ t, h }) => <Stage t={t} h={h} mode="blinds" tone="#3a2a1a" mesa={false}>{(tt) => {
  const f = tt * 60, x = 300 + tt * 180, sp = tt * 420;
  const sier = (o: number, c: string, y: number) => <svg width="3000" height="640" viewBox="0 0 3000 640" style={{ position: "absolute", left: -f * o, top: y }}><path d="M0 640 L0 360 L220 180 L440 320 L700 90 L980 300 L1240 150 L1500 340 L1780 120 L2120 300 L2460 150 L3000 360 L3000 640 Z" fill={c} /></svg>;
  return <>
    <div style={ab(0, 0, { width: 1920, height: 1080, background: "linear-gradient(#e0a860,#f2d9a0 70%)" })} />
    {sier(0.25, "#b58b64", 150)}{sier(0.5, "#7e6549", 260)}{sier(0.9, "#4b3b2c", 380)}
    <div style={ab(0, 760, { width: 1920, height: 320, background: "linear-gradient(#b89b72,#7a6444)" })} />
    <Car x={x} y={870} w={880} c="#2f6b45" pick spin={sp} />
    <div style={ab(x - 880 / 2 + 880 * 0.355, 870 - 880 * 0.42 + 880 * 0.42 * 0.48, { width: 880 * 0.125, height: 880 * 0.42 * 0.27, background: "linear-gradient(#f6f3e8,#c9c5b5)", borderRadius: 4 })} />
    <div style={{ position: "absolute", inset: 0, background: "rgba(120,80,30,.16)" }} />
    <Tag tt={tt} at={1.9} x={1380} y={230} txt="SIERRA MADRE" col="#2a1d0f" size={84} />
  </>;
}}</Stage>;

// 12 · del fob sale la llave de metal
const FobLlave: C = ({ t, h }) => <Stage t={t} h={h} mode="drop" tone="#20252c">{(tt) => {
  const sl = eio(tt, 0.7, 1.2), k = eio(tt, 1.2, 2.4), g = cl(tt - 2.3);
  return <>
    <div style={ab(960 - 58, 600 - k * 500, { width: 116, height: 560, background: "linear-gradient(90deg,#858d96,#f1f4f7 45%,#7a828a)", clipPath: "polygon(30% 0,100% 0,100% 74%,70% 78%,100% 82%,70% 86%,100% 90%,70% 96%,0 100%,0 8%)", filter: `drop-shadow(0 0 ${g * 26}px #fff0c0)` })} />
    <div style={ab(960 - 240, 470, { width: 480, height: 540, borderRadius: 100, background: "linear-gradient(115deg,#2d2f34,#0f1012 55%,#26282c)", boxShadow: SHAD })}>
      {[0, 1, 2].map((i) => <div key={i} style={ab(160, 130 + i * 118, { width: 160, height: 90, borderRadius: 24, background: "#1b1d20", boxShadow: "inset 0 0 0 3px #4a4d52" })} />)}
      <div style={ab(-20 + sl * 48, 250, { width: 66, height: 150, borderRadius: 14, background: CHROME })} />
    </div>
    <div style={{ position: "absolute", inset: 0, transform: `translateX(${sl * 48 - 40 + (1 - eio(tt, 0.1, 0.7)) * -400}px) rotate(90deg)`, transformOrigin: "550px 790px" }}><Finger x={550} y={790} w={130} /></div>
    <Tag tt={tt} at={2.7} x={1480} y={350} txt="REAL METAL" col={MZ} size={88} />
  </>;
}}</Stage>;

// 13 · el fob toca el botón y despierta
const FobStart: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" tone="#14171c" mesa={false}>{(tt) => {
  const c = eio(tt, 0.6, 1.6), on = cl((tt - 1.9) * 2.5);
  return <>
    <div style={ab(0, 0, { width: 1920, height: 1080, background: "linear-gradient(#272a30,#0c0d10)" })} />
    {[0, 1, 2].map((i) => { const k = ((tt - 1.9 + i * 0.5) % 1.5) / 1.5; return tt > 1.9 && <div key={i} style={ab(800 - k * 340, 380 - k * 340, { width: 320 + k * 680, height: 320 + k * 680, borderRadius: "50%", border: `9px solid rgba(255,190,90,${1 - k})` })} />; })}
    <div style={ab(760, 340, { width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle at 42% 36%,#3a3d44,#101114)", boxShadow: `inset 0 0 0 14px ${on > 0 ? `rgba(255,170,60,${0.4 + on * 0.6})` : "#44484f"}, ${SHAD}` })}><div style={{ ...txt(0, 138, 76, on > 0 ? MZ : "#b0b3b8"), width: 400, textAlign: "center" }}>START</div></div>
    <div style={ab(lerp(1720, 1150, c), 300, { width: 320, height: 480, borderRadius: 80, background: "linear-gradient(115deg,#2f3136,#101114 60%,#26282c)", boxShadow: SHAD, transform: `rotate(${(1 - c) * 18}deg)` })}><div style={ab(80, 170, { width: 160, height: 110, borderRadius: "50%", border: "10px solid #9aa0a7", boxSizing: "border-box" })} /></div>
    <Tag tt={tt} at={2.6} x={960} y={880} txt="DEAD FOB OK" col={MZ} />
  </>;
}}</Stage>;

// 14 · teléfono de pared y papelitos rosa clavados en el pincho
const Telefono31: C = ({ t, h }) => <Stage t={t} h={h} mode="split" tone="#2a2219">{(tt) => {
  const n = Math.round(cl((tt - 0.4) / 3.2) * 31), sh = 4 * Math.sin(tt * 44) * (Math.sin(tt * 5) > 0 ? 1 : 0.2), hh = -160 + cl(tt / 4) * 58;
  return <>
    <div style={ab(190 + sh, 110, { width: 460, height: 620, borderRadius: 30, background: "linear-gradient(115deg,#e9dfc0,#b2a782)", boxShadow: SHAD })}><div style={ab(70, 120, { width: 320, height: 320, borderRadius: "50%", background: "radial-gradient(#fff 28%,#c0b796 30%,#a89e7d)" })}>{Array.from({ length: 10 }, (_, i) => <div key={i} style={ab(136 + 118 * Math.sin(i * 0.56), 136 - 118 * Math.cos(i * 0.56), { width: 48, height: 48, borderRadius: "50%", background: "#3a3730" })} />)}</div></div>
    <div style={ab(110 - sh, 60, { width: 150, height: 560, borderRadius: 66, background: "linear-gradient(90deg,#a89d7a,#ece2c3)", boxShadow: "0 20px 30px rgba(0,0,0,.5)", transform: "rotate(-4deg)" })} />
    <div style={ab(1340, 90, { width: 330, height: 330, borderRadius: "50%", background: "radial-gradient(#fbf9f1,#ddd8c6)", boxShadow: "0 0 0 12px #5e4a2c," + SHAD })}><div style={ab(159, 60, { width: 12, height: 110, background: "#222", transformOrigin: "50% 100%", transform: "rotate(-150deg)" })} /><div style={ab(162, 25, { width: 6, height: 145, background: "#a22", transformOrigin: "50% 100%", transform: `rotate(${hh * 3}deg)` })} /></div>
    <div style={ab(870, 910, { width: 480, height: 40, borderRadius: 14, background: "linear-gradient(#57381d,#2d1d0f)", boxShadow: SHAD })} /><div style={ab(1104, 430, { width: 12, height: 490, background: CHROME })} />
    {Array.from({ length: n }, (_, i) => <div key={i} style={ab(910 + (rnd(i) - 0.5) * 50, 880 - i * 14, { width: 400, height: 110, marginTop: -40, background: "linear-gradient(#f3bcc7,#e69cac)", boxShadow: "0 3px 5px rgba(0,0,0,.28)", transform: `rotate(${(rnd(i + 3) - 0.5) * 14}deg) perspective(600px) rotateX(58deg)` })} />)}
  </>;
}}</Stage>;

// 15 · la pila de 2 dólares encintada en la guantera
const Pila2032: C = ({ t, h }) => <Stage t={t} h={h} mode="drop" tone="#1c1e22" mesa={false}>{(tt) => {
  const d = phys(tt, 0.3, 7, 0.45), spin = (1 - eio(tt, 0.3, 1.3)) * 720, tp = eio(tt, 1.5, 2.2), tp2 = eio(tt, 2.1, 2.7);
  return <>
    <div style={ab(290, 110, { width: 1340, height: 800, background: "linear-gradient(#24262a,#101114)", boxShadow: "inset 0 0 0 26px #2f3136, inset 0 40px 60px #000" })} />
    <div style={ab(330, 620, { width: 560, height: 230, background: "#d8d2c0", transform: "rotate(-3deg)", boxShadow: "0 12px 20px rgba(0,0,0,.5)" })}><div style={{ ...txt(60, 64, 76, "#333") }}>MANUAL</div></div>
    <div style={ab(960 - 240, 270 + (1 - d) * -800, { width: 480, height: 480, borderRadius: "50%", transform: `perspective(1200px) rotateY(${spin}deg)`, background: "conic-gradient(#8e959c,#f0f2f5,#99a0a8,#e6e9ed,#8e959c)", boxShadow: SHAD })}><div style={ab(36, 36, { width: 408, height: 408, borderRadius: "50%", boxShadow: "inset 0 0 0 5px rgba(60,66,72,.35)" })} /><div style={{ ...txt(0, 150, 112, "#3d4248"), width: 480, textAlign: "center" }}>CR</div><div style={{ ...txt(0, 256, 100, "#3d4248"), width: 480, textAlign: "center" }}>2032</div></div>
    <div style={ab(620, 470, { width: 680 * tp, height: 96, background: "rgba(232,218,160,.72)", transform: "rotate(-24deg)", transformOrigin: "0 50%" })} /><div style={ab(640, 330, { width: 640 * tp2, height: 96, background: "rgba(232,218,160,.72)", transform: "rotate(22deg)", transformOrigin: "0 50%" })} />
    <Tag tt={tt} at={2.7} x={1530} y={260} txt="$2" col={MZ} size={150} />
  </>;
}}</Stage>;

// 16 · dos clics y se cae la toalla
const Toalla: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe" tone="#23252a" mesa={false}>{(tt) => {
  const y = eio(tt, 0.7, 1.05) * 110 + eio(tt, 1.45, 1.8) * 110, f = Math.max(0, tt - 2.1), ty = 620 * f * f;
  return <>
    <div style={ab(0, 0, { width: 1920, height: 1080, background: "linear-gradient(115deg,#2d3037,#16171b)" })} />
    <div style={ab(500, 0, { width: 300, height: 1080, background: "linear-gradient(90deg,#4f535a,#868b92,#3c4046)", boxShadow: SHAD })}>{[0, 1, 2, 3, 4].map((i) => <div key={i} style={ab(94, 200 + i * 110, { width: 112, height: 16, borderRadius: 8, background: "#2a2c30" })} />)}</div>
    <svg width="1920" height="1080" style={{ position: "absolute", left: 0, top: 0 }}><path d={`M650 ${210 + y} L1700 1120`} stroke="#23252a" strokeWidth="118" /><path d={`M650 ${210 + y} L1700 1120`} stroke="#3a3d43" strokeWidth="100" strokeDasharray="4 12" /></svg>
    <div style={ab(560, 160 + y, { width: 180, height: 110, borderRadius: 20, background: CHROME, boxShadow: "0 14px 24px rgba(0,0,0,.55)" })} />
    <div style={ab(860, 470 + y * 0.9 + ty, { width: 420, height: 220, transform: `rotate(${38 + f * 60}deg)`, borderRadius: 10, opacity: 1 - cl(f - 0.55), background: "repeating-linear-gradient(90deg,#f2e8d2 0 26px,#d84a4a 26px 40px)", boxShadow: "0 16px 28px rgba(0,0,0,.45)" })} />
    <Tag tt={tt} at={2.5} x={1420} y={220} txt="17 YEARS" col={MZ} size={110} />
  </>;
}}</Stage>;

// 17 · espejo con 3 casitas: el control se cae y el portón sube en el reflejo
const HomeLink: C = ({ t, h }) => <Stage t={t} h={h} mode="ring" tone="#1a1d23" mesa={false}>{(tt) => {
  const f = Math.max(0, tt - 0.5), y = Math.min(830, 90 + 1500 * f * f), door = eio(tt, 2.3, 3.8), lit = Math.floor(cl((tt - 1.4) / 0.9) * 3);
  const Ho: React.FC<{ x: number; on: boolean }> = ({ x, on }) => <div style={ab(x, 660, { width: 150, height: 120, borderRadius: 16, background: on ? "#3b3119" : "#17181b", boxShadow: `inset 0 0 0 4px #4a4d52${on ? ", 0 0 30px #ffcf6a" : ""}` })}><svg width="150" height="120" viewBox="0 0 150 120"><path d="M75 22 L118 62 L104 62 L104 98 L46 98 L46 62 L32 62 Z" fill={on ? MZ : "#8d9096"} /></svg></div>;
  return <>
    <div style={ab(0, 0, { width: 1920, height: 300, background: "linear-gradient(#b7ad98,#8c8370)" })} />
    <div style={ab(330, 190, { width: 1260, height: 470, borderRadius: "90px 90px 120px 120px", background: "#111", padding: 18, boxShadow: SHAD })}>
      <div style={{ position: "relative", width: 1224, height: 434, borderRadius: "76px 76px 106px 106px", overflow: "hidden", background: "linear-gradient(#6a8099,#c8c1ac)" }}>
        <div style={ab(320, 40, { width: 620, height: 394, background: "#1c1d21" })} />
        <div style={ab(320, 40 - door * 370, { width: 620, height: 394, background: "repeating-linear-gradient(#e2ddcf 0 74px,#a59f90 74px 80px)" })} />
      </div>
    </div>
    <Ho x={690} on={lit > 0} /><Ho x={885} on={lit > 1} /><Ho x={1080} on={lit > 2} />
    <div style={ab(200, y, { width: 220, height: 130, borderRadius: 18, background: "linear-gradient(#55585e,#26282c)", boxShadow: SHAD, transform: `rotate(${Math.min(30, f * 70)}deg)` })}><div style={ab(70, 34, { width: 80, height: 60, borderRadius: 12, background: "#7c2c26" })} /></div>
  </>;
}}</Stage>;

// 18 · la manija que brilla en la cajuela oscura
const ManijaGlow: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" tone="#08090b" mesa={false}>{(tt) => {
  const g = 0.55 + 0.45 * Math.sin(tt * 2.4), op = eio(tt, 3.0, 4.0);
  return <>
    <div style={ab(0, 0, { width: 1920, height: 1080, background: "linear-gradient(#050506,#121316)" })} />
    <div style={ab(0, 0, { width: 1920, height: op * 400, background: "linear-gradient(#fff5d8,#e9dcb8 70%,rgba(233,220,184,0))", opacity: op })} />
    <div style={ab(600, 780, { width: 720, height: 300, background: "linear-gradient(#26282c,#0d0e10)" })} />
    <div style={ab(948, 0, { width: 24, height: 330, background: "#34373c" })} />
    <div style={ab(700, 320, { width: 520, height: 130, borderRadius: 60, background: "#d6f2c2", boxShadow: `0 0 ${40 + g * 110}px rgba(190,250,160,${0.5 + g * 0.45})` })} /><div style={ab(900, 420, { width: 120, height: 280, borderRadius: 40, background: "#d6f2c2", boxShadow: `0 0 ${30 + g * 80}px rgba(190,250,160,${0.4 + g * 0.4})` })} />
    <svg width="160" height="200" viewBox="0 0 24 30" style={{ position: "absolute", left: 880, top: 460 }}><g fill="#20371a"><circle cx="14" cy="4" r="3" /><path d="M9 9h7l3 7 4 1v2l-6-1-2-3-2 6 4 3v5h-2v-4l-5-4-2 3-5 1v-2l4-1 3-7-2-2-3 3-2-1z" /></g></svg>
  </>;
}}</Stage>;

// 19 · el interruptor que corre el cerrojo
const ValetCerrojo: C = ({ t, h }) => <Stage t={t} h={h} mode="split" tone="#1c1e23" mesa={false}>{(tt) => {
  const sw = eio(tt, 1.0, 1.4), lock = eio(tt, 1.4, 2.4);
  return <>
    <div style={ab(180, 240, { width: 520, height: 600, borderRadius: 26, background: "linear-gradient(#2b2d32,#111215)", boxShadow: SHAD })}>
      <div style={ab(110, 70, { width: 300, height: 460, borderRadius: 20, background: "#080809" })}><div style={ab(20, 20 + sw * 210, { width: 260, height: 210, borderRadius: 16, background: "linear-gradient(#5b6067,#2b2d32)" })} /></div>
      <div style={{ ...txt(0, 548, 40, DIM), width: 520, textAlign: "center" }}>TRUNK</div>
    </div>
    <div style={ab(900, 200, { width: 800, height: 680, background: "linear-gradient(115deg,#6f6a5d,#3e3b32)", boxShadow: SHAD, borderRadius: 12 })}>
      <div style={ab(40 + lock * 310, 270, { width: 460, height: 130, borderRadius: 18, background: CHROME, boxShadow: "0 14px 24px rgba(0,0,0,.5)" })} /><div style={ab(240 + lock * 310, 180, { width: 56, height: 120, borderRadius: 16, background: CHROME })} />
      <div style={ab(560, 210, { width: 180, height: 250, background: "#26262a", borderRadius: 10, boxShadow: `0 0 ${lock * 60}px rgba(255,190,90,${lock * .75})` })}><div style={ab(20, 60, { width: 150, height: 130, background: "#0a0a0b" })} /></div>
    </div>
    <div style={ab(1140, 700, { width: 240, height: 190, transform: `rotate(${6 * Math.sin(tt * 3)}deg)`, background: "linear-gradient(#f4d264,#d7a92e)", borderRadius: 10, opacity: cl(tt - 1.5) })}><div style={{ ...txt(0, 72, 56, "#231a07"), width: 240, textAlign: "center" }}>VALET</div></div>
  </>;
}}</Stage>;

// 20 · radar desde arriba: te meten autos en la distancia
const Radar: C = ({ t, h }) => <Stage t={t} h={h} mode="blinds" tone="#22252a" mesa={false}>{(tt) => {
  const eg = 340 - eio(tt, 1.6, 2.3) * 60 - eio(tt, 3.0, 3.7) * 60;
  const Top: React.FC<{ x: number; y: number; c: string; r?: number }> = ({ x, y, c, r = 0 }) => <div style={ab(x, y, { width: 300, height: 150, borderRadius: 34, background: `linear-gradient(${c},#26282c)`, boxShadow: "0 16px 24px rgba(0,0,0,.45)", transform: `rotate(${r}deg)` })}><div style={ab(190, 20, { width: 70, height: 110, borderRadius: 12, background: "#16202a" })} /><div style={ab(40, 24, { width: 60, height: 102, borderRadius: 12, background: "#16202a" })} /></div>;
  const a = eio(tt, 1.1, 2.0), b = eio(tt, 2.5, 3.4);
  return <>
    <div style={ab(0, 180, { width: 1920, height: 720, background: "linear-gradient(#43454b,#2c2e33)" })} />
    {[300, 540, 780].map((y) => <div key={y} style={{ position: "absolute", left: 0, top: y, width: 1920, height: 14, backgroundImage: "repeating-linear-gradient(90deg,#e6e2d6 0 110px,transparent 110px 240px)", backgroundPosition: `${-tt * 180}px 0` }} />)}
    <div style={ab(eg + 300, 430, { width: 1640 - eg, height: 260, background: "linear-gradient(90deg,rgba(255,214,120,.5),rgba(255,214,120,0))", clipPath: "polygon(0 44%,100% 0,100% 100%,0 56%)" })} />
    <Top x={eg} y={485} c="#c4c9cf" /><Top x={1560} y={485} c="#5b6a7f" />
    <Top x={lerp(1200, 1090, a)} y={lerp(690, 485, a)} c="#a54438" r={(1 - a) * -24 * (a > 0 ? 1 : 0)} />
    <Top x={lerp(960, 760, b)} y={lerp(240, 485, b)} c="#caa43b" r={(1 - b) * 24 * (b > 0 ? 1 : 0)} />
    {[1, 2, 3].map((i) => <div key={i} style={ab(1520 + i * 54, 110 - i * 20, { width: 36, height: i * 20 + 20, background: tt > 3.8 ? MZ : "#dadde0", borderRadius: 6 })} />)}
  </>;
}}</Stage>;

// 21 · la sombra del puente: frena sola
const SombraPuente: C = ({ t, h }) => <Stage t={t} h={h} mode="drop" tone="#3f5c78" mesa={false}>{(tt) => {
  const k = cl(tt / 2.4), yS = 560 + k * 320, sz = 0.25 + k * 1.25, br = tt > 1.9 && tt < 3.7, dip = br ? Math.sin(cl((tt - 1.9) * 5) * Math.PI / 2) * 22 : 0;
  return <>
    <div style={ab(0, 0, { width: 1920, height: 560, background: "linear-gradient(#7fb3d8,#e2e5d2)" })} />
    <div style={ab(0, 540, { width: 1920, height: 540, background: "linear-gradient(#6d7b57,#353f2d)" })} /><div style={ab(0, 540, { width: 1920, height: 540, clipPath: "polygon(46% 0,54% 0,100% 100%,0 100%)", background: "linear-gradient(#55565a,#26272a)" })} />
    <div style={ab(0, yS, { width: 1920, height: 120 * sz, clipPath: "polygon(30% 0,70% 0,92% 100%,8% 100%)", background: "rgba(10,12,16,.82)" })} />
    <div style={ab(960 - 660 * sz, yS - 300 * sz - 170, { width: 1320 * sz, height: 80 * sz, background: "linear-gradient(#a7a59d,#67655e)", boxShadow: "0 8px 20px rgba(0,0,0,.4)" })} />
    <div style={ab(620, 590 + dip, { width: 680, height: 360, borderRadius: "70px 70px 26px 26px", background: "linear-gradient(#cdd1d6,#71767d)", boxShadow: SHAD })}><div style={ab(70, 34, { width: 540, height: 130, borderRadius: "40px 40px 10px 10px", background: "#1b2632" })} />{[50, 520].map((x) => <div key={x} style={ab(x, 200, { width: 110, height: 56, borderRadius: 14, background: br ? "#ff3524" : "#7d1812", boxShadow: br ? "0 0 60px #ff3524" : undefined })} />)}</div>
    <Tag tt={tt} at={2.5} x={1560} y={260} txt="A SHADOW" col={TX} />
  </>;
}}</Stage>;

// 22 · cuatro seguros que bajan y suben al ritmo de la palanca
const Seguros: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe" tone="#191c21" mesa={false}>{(tt) => {
  const ring = cl((tt - 0.3) / 1.5), cyc = Math.max(0, tt - 1.9), ph = Math.floor(cyc / 1.0) % 2 === 0;
  return <>
    <div style={ab(200, 620, { width: 1520, height: 110, background: "linear-gradient(#3a3d43,#1a1b1f)", boxShadow: SHAD, borderRadius: 16 })} />
    {[0, 1, 2, 3].map((i) => { const k = tt < 1.9 ? 0 : ph ? cl(((cyc % 1) - i * 0.08) * 8) : 1 - cl(((cyc % 1) - i * 0.08) * 8); return <div key={i} style={ab(370 + i * 370, 330 + k * 250, { width: 84, height: 330, borderRadius: "40px 40px 6px 6px", background: "linear-gradient(90deg,#7c848c,#eff2f5 45%,#747c84)", clipPath: "inset(0 0 " + (k * 250) + "px 0)" })} />; })}
    <div style={ab(780, 780, { width: 360, height: 220, borderRadius: 22, background: "#16181b", boxShadow: SHAD })}><div style={ab(30, 30, { width: 300, height: 160, borderRadius: 14, background: `conic-gradient(${MZ} ${ring * 360}deg,#34373c 0)` })}><div style={ab(16, 16, { width: 268, height: 128, borderRadius: 10, background: "#22252a" })}><div style={{ ...txt(0, 30, 70, TX), width: 268, textAlign: "center" }}>LOCK</div></div></div></div>
    <Tag tt={tt} at={2.5} x={960} y={200} txt="HEB PARKING" col={MZ} />
  </>;
}}</Stage>;

// 23 · reloj de arena: los 15 minutos del vendedor
const ArenaEntrega: C = ({ t, h }) => <Stage t={t} h={h} mode="diag" tone="#241f18">{(tt) => {
  const k = cl((tt - 0.3) / 3.6), sw = 12 * Math.sin(tt * 2.7);
  return <>
    <div style={ab(540, 90, { width: 840, height: 840 })}>
      <div style={ab(120, 0, { width: 600, height: 50, borderRadius: 24, background: "linear-gradient(#7c5430,#3d2815)" })} /><div style={ab(120, 800, { width: 600, height: 50, borderRadius: 24, background: "linear-gradient(#7c5430,#3d2815)" })} />
      <svg width="840" height="850" viewBox="0 0 840 850" style={{ position: "absolute", left: 0, top: 0 }}>
        <defs><clipPath id="hg"><path d="M180 50 L660 50 C660 240 450 340 450 425 C450 510 660 610 660 800 L180 800 C180 610 390 510 390 425 C390 340 180 240 180 50Z" /></clipPath></defs>
        <path d="M180 50 L660 50 C660 240 450 340 450 425 C450 510 660 610 660 800 L180 800 C180 610 390 510 390 425 C390 340 180 240 180 50Z" fill="rgba(210,230,240,.2)" stroke="rgba(235,245,250,.8)" strokeWidth="9" />
        <g clipPath="url(#hg)"><rect x="150" y={80 + k * 345} width="540" height={345 * (1 - k)} fill="#e0b76b" /><path d={`M170 800 L420 ${800 - 44 - k * 280} L670 800 Z`} fill="#d2a65a" /><rect x="412" y="400" width="16" height="400" fill="#e0b76b" /></g>
      </svg>
    </div>
    <div style={ab(1500, 150, { transform: `rotate(${sw}deg)`, transformOrigin: "50% 0" })}><div style={ab(-60, 0, { width: 120, height: 120, borderRadius: "50%", border: "26px solid #c9b264", boxSizing: "border-box" })} /><div style={ab(-18, 108, { width: 36, height: 280, background: "linear-gradient(90deg,#8b7b42,#efe0a0,#8b7b42)" })} /></div>
    <Tag tt={tt} at={1.8} x={290} y={500} txt="15 MINUTES" col={MZ} />
  </>;
}}</Stage>;

// 24 · perilla de sensibilidad: el bip se achica
const DialBip: C = ({ t, h }) => <Stage t={t} h={h} mode="ring" tone="#1e2228" mesa={false}>{(tt) => {
  const k = eio(tt, 1.5, 2.8), a = -100 + k * 150, sw = 110 + 40 * Math.sin(tt * 1.1);
  return <>
    <div style={ab(1050, 0, { width: 870, height: 1080, background: "linear-gradient(#46484d,#2d2e33)" })} /><div style={{ position: "absolute", left: 1460, top: 0, width: 16, height: 1080, backgroundImage: "repeating-linear-gradient(180deg,#e7c95f 0 90px,transparent 90px 190px)", backgroundPosition: `0 ${tt * 300}px` }} />
    <div style={ab(1120 + sw, 370, { width: 240, height: 440, borderRadius: 60, background: "linear-gradient(90deg,#888d94,#dde1e6 45%,#888d94)", boxShadow: SHAD })}><div style={ab(36, 70, { width: 168, height: 96, borderRadius: 18, background: "#1b2632" })} /></div>
    {[0, 1, 2].map((i) => { const p = ((tt + i * 0.34) % 1); const s = (1 - k * 0.72) * (0.5 + p * 1.6); return <div key={i} style={ab(1465 - 120 * s, 590 - 120 * s, { width: 240 * s, height: 240 * s, borderRadius: "50%", border: `8px solid rgba(255,195,90,${(1 - p) * (1 - k * 0.5)})` })} />; })}
    <div style={ab(190, 210, { width: 660, height: 660, borderRadius: "50%", background: "radial-gradient(#2b2e33,#0e0f12)", boxShadow: "0 0 0 16px #5d646c," + SHAD })}><div style={ab(170, 170, { width: 320, height: 320, borderRadius: "50%", background: "conic-gradient(#3d4047,#a7adb4,#4c5056,#aab0b7,#3d4047)", transform: `rotate(${a}deg)` })}><div style={ab(150, 14, { width: 20, height: 100, background: MZ, borderRadius: 10 })} /></div><div style={{ ...txt(60, 540, 62, TX) }}>LOW</div><div style={{ ...txt(500, 540, 62, TX) }}>HIGH</div></div>
  </>;
}}</Stage>;

// 25 · el pie se levanta y el pedal se queda
const FrenoSolo: C = ({ t, h }) => <Stage t={t} h={h} mode="split" tone="#191b20" mesa={false}>{(tt) => {
  const up = eio(tt, 1.0, 1.9), gr = tt > 3.5, fr = gr ? eio(tt, 3.6, 4.1) : 0;
  return <>
    <div style={ab(0, 870, { width: 1920, height: 210, background: "linear-gradient(#202227,#0b0c0e)" })} />
    <div style={ab(470, 470, { width: 44, height: 430, background: STEEL, transformOrigin: "50% 100%", transform: `rotate(${-14 + fr * 22}deg)` })}><div style={ab(-120, -40, { width: 290, height: 92, borderRadius: 16, background: "repeating-linear-gradient(90deg,#141518 0 16px,#3c3f45 16px 22px)" })} /></div>
    <div style={{ position: "absolute", inset: 0, transform: `translate(${-up * 80}px,${-up * 330}px) rotate(${-up * 8}deg)`, transformOrigin: "300px 480px" }}>
      <div style={ab(250, 310, { width: 520, height: 210, borderRadius: "90px 180px 60px 50px", background: "linear-gradient(#6b4525,#3d2612)", boxShadow: SHAD })}><div style={ab(10, 190, { width: 500, height: 34, borderRadius: 14, background: "#191512" })} /></div><div style={ab(230, -40, { width: 240, height: 420, background: "linear-gradient(90deg,#2d3648,#4b5a78,#2d3648)" })} />
    </div>
    <div style={ab(1380, 120, { width: 300, height: 760, borderRadius: 50, background: "linear-gradient(#26282b,#0f1012)", boxShadow: SHAD })}>{[["#ff3524", !gr], ["#3a2d12", false], ["#32e07c", gr]].map(([c, on], i) => <div key={i} style={ab(50, 44 + i * 230, { width: 200, height: 200, borderRadius: "50%", background: on ? (c as string) : "#1b1c1f", boxShadow: on ? `0 0 90px ${c}` : "inset 0 8px 18px #000" })} />)}</div>
    <Tag tt={tt} at={2.1} x={980} y={620} txt="IT STAYS PUT" col={MZ} size={84} />
  </>;
}}</Stage>;

// 26 · ECO = pantufla, SPORT = zapatilla
const PantuflaSport: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" tone="#1d2026" mesa={false}>{(tt) => {
  const s = eio(tt, 2.1, 2.7), a = -44 + s * 88, flip = s < 0.5 ? 1 - s * 2 : (s - 0.5) * 2;
  return <>
    <div style={ab(1180, 220, { width: 560, height: 560, borderRadius: "50%", background: "radial-gradient(#2b2e34,#0e0f12)", boxShadow: "0 0 0 14px #5d646c," + SHAD })}><div style={ab(130, 130, { width: 300, height: 300, borderRadius: "50%", background: "conic-gradient(#3d4047,#a7adb4,#4c5056,#aab0b7,#3d4047)", transform: `rotate(${a}deg)` })}><div style={ab(138, 12, { width: 24, height: 100, background: MZ, borderRadius: 10 })} /></div><div style={{ ...txt(50, 60, 54, s < 0.5 ? VER : DIM) }}>ECO</div><div style={{ ...txt(380, 60, 54, s >= 0.5 ? RED : DIM) }}>SPORT</div></div>
    <div style={ab(180, 760, { width: 760, height: 90, borderRadius: 14, background: "repeating-linear-gradient(90deg,#141518 0 20px,#3c3f45 20px 28px)", boxShadow: SHAD, transform: "rotate(-6deg)" })} />
    <div style={ab(220, 400, { width: 720, height: 340, transform: `scaleY(${flip})`, transformOrigin: "50% 100%" })}>
      {s < 0.5 ? <div style={{ width: 720, height: 340, borderRadius: "160px 260px 100px 100px", background: "repeating-linear-gradient(45deg,#6e3d6b 0 34px,#a8679f 34px 68px)", boxShadow: SHAD }}><div style={ab(0, 262, { width: 720, height: 78, borderRadius: 40, background: "#f0e6d4" })} /></div>
        : <div style={{ width: 720, height: 340, borderRadius: "120px 300px 60px 60px", background: "linear-gradient(#e4382f,#9d1711)", boxShadow: SHAD }}><div style={ab(0, 270, { width: 720, height: 70, borderRadius: 16, background: "#fff" })} />{[0, 1, 2, 3].map((i) => <div key={i} style={ab(320 + i * 72, 110 + i * 22, { width: 90, height: 16, borderRadius: 8, background: "#fff", transform: "rotate(24deg)" })} />)}</div>}
    </div>
  </>;
}}</Stage>;

// 27 · timer de cocina con llave inglesa: suena y no es emergencia
const TimerCocina: C = ({ t, h }) => <Stage t={t} h={h} mode="drop" tone="#2a241c">{(tt) => {
  const ring = tt > 2.6, sh = ring ? 7 * Math.sin(tt * 52) : 0, a = lerp(-250, 0, eio(tt, 0.2, 2.6));
  return <>
    <div style={ab(610 + sh, 180, { width: 700, height: 700, borderRadius: "50%", background: "radial-gradient(circle at 40% 30%,#fff,#d8d3c3)", boxShadow: SHAD })}>
      {Array.from({ length: 24 }, (_, i) => <div key={i} style={ab(346, 20, { width: 8, height: i % 2 ? 26 : 50, background: "#3a3a3a", transformOrigin: "4px 330px", transform: `rotate(${i * 15}deg)` })} />)}
      <div style={ab(170, 170, { width: 360, height: 360, borderRadius: "50%", background: "linear-gradient(135deg,#e04f3d,#a02a1e)", transform: `rotate(${a}deg)`, boxShadow: "0 16px 30px rgba(0,0,0,.45)" })}><div style={ab(160, 30, { width: 40, height: 300, borderRadius: 18, background: "#7e1f15" })} /><div style={ab(164, 34, { width: 32, height: 70, background: "#fff", borderRadius: 10 })} /></div>
    </div>
    {ring && [0, 1, 2].map((i) => { const p = ((tt + i * 0.25) % 0.75) / 0.75; return <svg key={i} width="1400" height="900" viewBox="0 0 1400 900" style={{ position: "absolute", left: 260, top: 80, opacity: 1 - p }}><path d={`M${130 - p * 70} ${300} Q${50 - p * 70} 450 ${130 - p * 70} 600`} fill="none" stroke={MZ} strokeWidth="14" strokeLinecap="round" /><path d={`M${1270 + p * 70} 300 Q${1350 + p * 70} 450 ${1270 + p * 70} 600`} fill="none" stroke={MZ} strokeWidth="14" strokeLinecap="round" /></svg>; })}
    <Tag tt={tt} at={3.0} x={960} y={970} txt="A REMINDER" col={MZ} />
  </>;
}}</Stage>;

// 28 · guiones que se vuelven ceros en la pantalla mientras el dedo aprieta
const Guarismos: C = ({ t, h }) => <Stage t={t} h={h} mode="wipe" tone="#14171b" mesa={false}>{(tt) => {
  const n = Math.floor(cl((tt - 1.0) / 2.6) * 6);
  return <>
    <div style={ab(0, 0, { width: 1920, height: 1080, background: "linear-gradient(#25282e,#0b0c0f)" })} />
    <div style={ab(280, 200, { width: 1360, height: 400, borderRadius: 26, background: "#0a1116", boxShadow: "inset 0 0 0 12px #383c43," + SHAD })}><div style={{ fontFamily: LCD, fontWeight: 900, position: "absolute", width: 1360, textAlign: "center", top: 90, fontSize: 230, letterSpacing: 26, color: "#8fe4ff" }}>{"000000".slice(0, n) + "------".slice(n)}</div></div>
    <div style={ab(860, 680, { width: 200, height: 130, borderRadius: 26, background: "linear-gradient(#5d6268,#222428)", boxShadow: SHAD })}><div style={{ ...txt(0, 44, 46, TX), width: 200, textAlign: "center" }}>TRIP</div></div>
    <div style={{ position: "absolute", inset: 0, transform: `translateY(${(1 - eio(tt, 0, 0.6)) * 400}px) rotate(180deg)`, transformOrigin: "960px 770px" }}><Finger x={960} y={700} w={150} /></div>
  </>;
}}</Stage>;

// 29 · el horno apagado y el pollo crudo
const PolloCrudo: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" tone="#1d1d20" mesa={false}>{(tt) => {
  const o = eio(tt, 0.5, 1.6), bl = 0.5 + 0.5 * Math.sin(tt * 3);
  return <>
    <div style={ab(330, 110, { width: 1260, height: 880, borderRadius: 34, background: "linear-gradient(#c9ccd1,#85898f)", boxShadow: SHAD })}>
      <div style={ab(60, 40, { width: 1140, height: 90, borderRadius: 16, background: "#121316" })}><div style={{ ...txt(0, 20, 54, "#3a5f68", 1 - cl((tt - 1.7) * 3)), width: 1140, textAlign: "center" }}>OFF</div></div>
      <div style={ab(90, 170, { width: 1080, height: 650, borderRadius: 26, background: "#161719", boxShadow: "inset 0 0 40px #000" })}>
        <div style={ab(60, 480, { width: 960, height: 12, background: "#5a5d62" })} />
        <svg width="620" height="400" viewBox="0 0 620 400" style={{ position: "absolute", left: 230, top: 100 }}><g fill="#f0cfbb" stroke="#c49c86" strokeWidth="5"><rect x="480" y="190" width="120" height="60" rx="28" transform="rotate(-24 480 190)" /><rect x="20" y="190" width="120" height="60" rx="28" transform="rotate(24 140 190)" /><ellipse cx="310" cy="220" rx="225" ry="150" /></g><ellipse cx="240" cy="170" rx="80" ry="42" fill="#f8e2d3" /></svg>
      </div>
      <div style={ab(90, 170, { width: 1080, height: 650, borderRadius: 26, background: "linear-gradient(115deg,rgba(255,255,255,.17),rgba(255,255,255,.02) 38%,rgba(255,255,255,.12))", transformOrigin: "50% 100%", transform: `perspective(1600px) rotateX(${-o * 12}deg)` })} />
    </div>
    <div style={{ ...txt(0, 150, 84, RED, cl(tt - 2.1) * (0.7 + bl * 0.3)), width: 1920, textAlign: "center" }}>STILL RAW</div>
  </>;
}}</Stage>;

// 30 · llavero con 12 chapitas: el resumen
const Llavero12: C = ({ t, h }) => <Stage t={t} h={h} mode="ring" tone="#20232a" mesa={false}>{(tt) => {
  const rot = tt * 14, on = Math.floor(cl(tt / 4.8) * 12);
  return <>
    <div style={ab(960 - 130, 540 - 130, { width: 260, height: 260, borderRadius: "50%", border: "28px solid", borderColor: "#c6ccd3", boxSizing: "border-box", boxShadow: SHAD })} />
    {Array.from({ length: 12 }, (_, i) => { const a = i * 30 + rot, k = phys(tt, 0.06 * i, 8, 0.5), lit = i === Math.min(11, on), d = 370 * k, r = a * Math.PI / 180; return <div key={i} style={ab(960 + d * Math.sin(r) - 84, 540 - d * Math.cos(r) - 84, { width: 168, height: 168, borderRadius: "50%", transform: `scale(${lit ? 1.22 : 1})`, background: lit ? "linear-gradient(#f4d264,#d7a92e)" : "conic-gradient(#858d96,#e4e8ec,#7c848c,#d8dde2,#858d96)", boxShadow: lit ? "0 0 60px rgba(255,214,120,.8)" : "0 16px 24px rgba(0,0,0,.5)" })}><div style={{ ...txt(0, 44, 80, "#1d1a14"), width: 168, textAlign: "center" }}>{i + 1}</div></div>; })}
  </>;
}}</Stage>;

// 31 · el manual: se le despega el plástico
const Plastico: C = ({ t, h }) => <Stage t={t} h={h} mode="drop" tone="#23211c">{(tt) => {
  const k = eio(tt, 0.8, 3.0), x = 1 - k;
  return <>
    <div style={ab(540, 120, { width: 840, height: 860, borderRadius: 10, background: "linear-gradient(120deg,#1e3254,#0f1b30)", boxShadow: SHAD })}><div style={ab(70, 140, { width: 700, height: 8, background: "#c8b878" })} /><div style={{ ...txt(0, 220, 112, "#e9dfb6"), width: 840, textAlign: "center" }}>OWNER'S</div><div style={{ ...txt(0, 354, 112, "#e9dfb6"), width: 840, textAlign: "center" }}>MANUAL</div><div style={ab(70, 530, { width: 700, height: 8, background: "#c8b878" })} /></div>
    <div style={ab(525, 105, { width: 870, height: 890, clipPath: `polygon(0 ${(1 - x) * 100}%,${x * 100}% 100%,0 100%)`, background: "linear-gradient(115deg,rgba(255,255,255,.45),rgba(255,255,255,.06) 30%,rgba(255,255,255,.36) 62%,rgba(255,255,255,.07))" })} />
    <div style={ab(525, 105, { width: 870, height: 890, opacity: x, clipPath: `polygon(${x * 100}% 100%,100% ${(1 - x) * 100}%,100% 100%)`, background: "rgba(255,255,255,.14)" })} />
    {k > 0.02 && k < 0.98 && <div style={ab(525 + 870 * x - 120, 105 + 890 * (1 - x) - 120, { width: 240, height: 240, background: "linear-gradient(135deg,rgba(255,255,255,.75),rgba(255,255,255,.16))", clipPath: "polygon(0 0,100% 100%,0 100%)", filter: "drop-shadow(0 12px 14px rgba(0,0,0,.5))" })} />}
    <Tag tt={tt} at={2.9} x={1560} y={500} txt="20 MINUTES" col={MZ} />
  </>;
}}</Stage>;

// 32 · la nota amarilla al lado de la virgencita
const NotaVirgen: C = ({ t, h }) => <Stage t={t} h={h} mode="diag" tone="#22201a" mesa={false}>{(tt) => {
  const s = phys(tt, 0.6, 8, 0.4), w = eio(tt, 1.3, 3.2);
  return <>
    <div style={ab(0, 720, { width: 1920, height: 360, background: "linear-gradient(#3b3d42,#14151a)" })} />
    <div style={ab(0, 0, { width: 1920, height: 730, background: "linear-gradient(#9fc2d6,#e2dcc6)", opacity: 0.55 })} />
    <div style={ab(180, 410, { width: 380, height: 330, background: YEL, transform: "rotate(-5deg)", boxShadow: "0 16px 26px rgba(0,0,0,.45)" })}><Hand x={36} y={60} s={62} rot={0}>check tires</Hand><Hand x={36} y={150} s={62} rot={0}>oil – May</Hand></div>
    <svg width="220" height="470" viewBox="0 0 220 470" style={{ position: "absolute", left: 640, top: 290 }}><path d="M110 76 C 40 130 26 330 14 450 L206 450 C 194 330 180 130 110 76Z" fill="#4e86c4" /><path d="M110 150 C 90 240 86 350 80 450 L140 450 C 134 350 130 240 110 150Z" fill="#f3efe3" /><circle cx="110" cy="62" r="46" fill="#ecd3b9" /><path d="M58 70 C 56 12 164 12 162 70 C 150 30 70 30 58 70Z" fill="#4e86c4" /><rect x="10" y="450" width="200" height="20" fill="#d6c98f" /></svg>
    <div style={ab(960, 160 + (1 - s) * -620, { width: 780, height: 590, background: YEL, transform: `rotate(${3 - (1 - s) * 18}deg)`, boxShadow: SHAD })}><Hand x={50} y={140} s={150} k={w * 2}>It's been</Hand><Hand x={50} y={320} s={150} k={w * 2 - 1}>waiting.</Hand></div>
  </>;
}}</Stage>;

// 33 · gancho al próximo: el motorcito naranja titila
const LamparaMotor: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" tone="#0a0b0d" mesa={false}>{(tt) => {
  const fl = tt < 2.4 ? (Math.sin(tt * 21) > 0.15 && Math.sin(tt * 7.3) > -0.4 ? 1 : 0.12) : 1, g = fl;
  return <>
    <div style={ab(0, 0, { width: 1920, height: 1080, background: "linear-gradient(#17191d,#060709)" })} />
    <svg width="1100" height="760" viewBox="0 0 110 76" style={{ position: "absolute", left: 410, top: 150, filter: `drop-shadow(0 0 ${g * 44}px rgba(255,150,30,${g * .95}))` }}><path d="M30 8h22v8h-7v5h15l8 8h8v-7h7v36h-7v-7h-9l-9 11H31l-9-9h-8v-12H7v16H1V27h6v14h7V27l9-6h7v-5h-7z" fill={`rgba(255,${140 + g * 30},${20 + g * 20},${0.14 + g * 0.86})`} /></svg>
    <Tag tt={tt} at={2.6} x={960} y={950} txt="SIX YEARS" col={MZ} size={96} />
  </>;
}}</Stage>;

// E1 · la cuenta de 600 se desenrolla al lado del café y el surtidor
const Recibo600: C = ({ t, h }) => <Stage t={t} h={h} mode="split" tone="#201b15" mesa={false}>{(tt) => {
  const r = eio(tt, 0.4, 2.0), b = phys(tt, 1.6, 7, 0.45), st = (i: number) => ((tt * 0.45 + i * 0.27) % 1);
  return <>
    <div style={ab(0, 900, { width: 1920, height: 180, background: "linear-gradient(#70512e,#3b2813)" })} />
    <div style={ab(250, 30, { width: 520, height: 110, borderRadius: 55, background: "linear-gradient(#efe9d8,#a9a28b)", boxShadow: SHAD })} />
    <div style={ab(280, 88, { width: 460, height: 40 + r * 800, overflow: "hidden", background: "linear-gradient(170deg,#fbf8ee,#e6dfca)", boxShadow: SHAD })}>{Array.from({ length: 9 }, (_, i) => <div key={i} style={ab(40, 50 + i * 62, { width: 240 + (i % 3) * 40, height: 14, background: "#a8a292" })} />)}<div style={{ ...txt(0, 640, 118, RED), width: 460, textAlign: "center" }}>$600</div></div>
    <div style={ab(1020, 900 - 340 - (1 - b) * 900, { width: 310, height: 340, borderRadius: "16px 16px 90px 90px", background: "linear-gradient(90deg,#c9c4b5,#fbf9f3 45%,#b9b4a5)", boxShadow: SHAD })} />
    <div style={ab(1320, 620 - (1 - b) * 900, { width: 110, height: 170, borderRadius: 60, border: "26px solid #e7e3d6", boxSizing: "border-box" })} />
    {[0, 1, 2].map((i) => <div key={i} style={ab(1090 + i * 70 + 18 * Math.sin(tt * 2 + i), 520 - st(i) * 260, { width: 34, height: 110, borderRadius: 20, background: "rgba(235,235,235,.5)", filter: "blur(12px)", opacity: (1 - st(i)) * b })} />)}
    <Tag tt={tt} at={2.7} x={1250} y={260} txt="AND A COFFEE" col={MZ} size={64} />
  </>;
}}</Stage>;

// E2 · 5 de la mañana: el auto sale sin despertar a nadie
const Vecinos: C = ({ t, h }) => <Stage t={t} h={h} mode="iris" tone="#0b1120" mesa={false}>{(tt) => {
  const x = lerp(1180, 1650, eio(tt, 0.6, 4.2)), zz = (i: number) => ((tt * 0.5 + i * 0.33) % 1);
  return <>
    <div style={ab(0, 0, { width: 1920, height: 1080, background: "linear-gradient(#0a1230,#23305a 70%,#3b4166)" })} />
    {Array.from({ length: 34 }, (_, i) => <div key={i} style={ab(rnd(i) * 1900, rnd(i + 9) * 460, { width: 5, height: 5, borderRadius: "50%", background: "#eef", opacity: 0.35 + 0.5 * Math.abs(Math.sin(tt * 1.3 + i)) })} />)}
    <div style={ab(1560, 90, { width: 140, height: 140, borderRadius: "50%", background: "radial-gradient(circle at 36% 40%,#fff8dd,#d8cf9f)", boxShadow: "0 0 70px rgba(255,245,200,.6)" })} />
    <div style={ab(170, 480, { width: 780, height: 470, background: "linear-gradient(#2c3347,#181d2c)", boxShadow: SHAD })}>{[0, 1, 2].map((i) => <div key={i} style={ab(70 + i * 240, 120, { width: 160, height: 200, background: "#0b0e18", boxShadow: "inset 0 0 0 10px #3c445b" })} />)}</div>
    <div style={ab(100, 240, { width: 920, height: 240, background: "linear-gradient(#262c3e,#191e2d)", clipPath: "polygon(50% 0,100% 100%,0 100%)" })} />
    {[0, 1, 2].map((i) => <div key={i} style={{ ...txt(440 + zz(i) * 120, 450 - zz(i) * 300, 64 + zz(i) * 50, "#d5dcff", (1 - zz(i)) * 0.8, HAND) }}>z</div>)}
    <div style={ab(0, 950, { width: 1920, height: 130, background: "linear-gradient(#26293a,#10121a)" })} />
    <Car x={x} y={960} w={640} c="#a9b0ba" />
    <Tag tt={tt} at={2.9} x={1260} y={520} txt="5 AM" col={MZ} size={110} />
  </>;
}}</Stage>;

export const TEC: Record<string, C> = { recibo600: Recibo600, vecinos: Vecinos, regla: Regla, sellopaid: SelloPaid, triangulito: Triangulito, perilla: Perilla, juez: Juez, cuatropres: CuatroPres, comal: Comal, palancas: PalancaS, cuestadisco: CuestaDisco, rejilla: Rejilla, pickup62: Pickup62, foblave: FobLlave, fobstart: FobStart, telefono31: Telefono31, pila2032: Pila2032, toalla: Toalla, homelink: HomeLink, manijaglow: ManijaGlow, valetcerrojo: ValetCerrojo, radar: Radar, sombrapuente: SombraPuente, seguros: Seguros, arenaentrega: ArenaEntrega, dialbip: DialBip, frenosolo: FrenoSolo, pantuflasport: PantuflaSport, timercocina: TimerCocina, guarismos: Guarismos, pollocrudo: PolloCrudo, llavero12: Llavero12, plastico: Plastico, notavirgen: NotaVirgen, lamparamotor: LamparaMotor };
