// rk29d · dibujos base (SVG/CSS con volumen) de la camioneta y la casa de noche: la pickup de costado y desde arriba,
// la llave con su ojito, el gancho de la puerta, la casa en corte, el volante con la barra amarilla, el hombre de la calle.
import React from "react";

export const AMB = "#ffb257", RED = "#ff5a4a", ICE = "#8fd6ff", GRN = "#6fe39a", TX = "#f7f4ee", YEL = "#ffd23a", NIGHT = "#0d1220";
export const rnd = (i: number) => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };

export const At: React.FC<{ x: number; y: number; s?: number; rot?: number; o?: number; z?: number; children: React.ReactNode }> = ({ x, y, s = 1, rot = 0, o = 1, z, children }) => (
  <div style={{ position: "absolute", left: x, top: y, zIndex: z, transform: `translate(-50%,-50%) rotate(${rot}deg) scale(${s})`, opacity: o }}>{children}</div>
);

// pickup de costado (mira a la derecha; flip la da vuelta). lights 0..1 faros; tail 0..1 luces de atrás; door 0..1 puerta abierta; bed = lo que va en la caja
export const Pickup: React.FC<{ w?: number; col?: string; lights?: number; tail?: number; door?: number; flip?: boolean; dew?: number; bed?: React.ReactNode; ghost?: number; wheelRot?: number }> = ({ w = 520, col = "#8a2f2a", lights = 0, tail = 0, door = 0, flip, dew = 0, bed, ghost = 0, wheelRot = 0 }) => {
  const h = w * 0.42;
  const body = ghost > 0 ? "none" : `url(#pk${col.slice(1)})`;
  return <div style={{ width: w, height: h, position: "relative", transform: flip ? "scaleX(-1)" : undefined, opacity: ghost > 0 ? 1 - ghost * 0.4 : 1 }}>
    {bed && <div style={{ position: "absolute", left: w * 0.05, bottom: h * 0.52, width: w * 0.46, height: h * 0.5 }}>{bed}</div>}
    <svg width={w} height={h} viewBox="0 0 400 168" style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
      <defs>
        <linearGradient id={`pk${col.slice(1)}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={col} stopOpacity=".95" /><stop offset=".55" stopColor={col} /><stop offset="1" stopColor="#120c0b" /></linearGradient>
        <linearGradient id="pkglass" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#4d6a86" /><stop offset="1" stopColor="#141c26" /></linearGradient>
        <radialGradient id="pkbeam"><stop offset="0" stopColor="#fff6d8" stopOpacity=".9" /><stop offset="1" stopColor="#fff6d8" stopOpacity="0" /></radialGradient>
      </defs>
      {lights > 0 && <path d="M392 92 L700 50 L700 160 Z" fill="url(#pkbeam)" opacity={lights * 0.55} />}
      <ellipse cx="200" cy="160" rx="190" ry="9" fill="rgba(0,0,0,.55)" />
      {/* caja + cabina + capó */}
      <path d="M10 70 L190 70 L190 40 Q196 22 222 20 L282 20 Q300 22 312 46 L330 66 L382 72 Q394 74 396 92 L396 122 L10 122 Z" fill={body} stroke={ghost > 0 ? `rgba(255,255,255,${0.5 * ghost})` : "rgba(0,0,0,.5)"} strokeWidth={ghost > 0 ? 3 : 2} strokeDasharray={ghost > 0 ? "10 8" : undefined} />
      {ghost === 0 && <>
        <path d="M10 70 L190 70" stroke="rgba(255,255,255,.35)" strokeWidth="3" />
        <path d="M200 44 Q204 30 222 28 L262 28 L262 64 L200 64 Z" fill="url(#pkglass)" />
        <path d="M270 28 L282 28 Q296 30 306 48 L318 64 L270 64 Z" fill="url(#pkglass)" />
        {dew > 0 && Array.from({ length: 26 }, (_, i) => <circle key={i} cx={204 + rnd(i) * 110} cy={32 + rnd(i + 40) * 30} r={1.2 + rnd(i + 9) * 1.8} fill="rgba(220,240,255,.8)" opacity={dew} />)}
        <g style={{ transformOrigin: "268px 64px", transform: `perspective(400px) rotateY(${-70 * door}deg)` }}>
          <path d="M266 66 L320 66 L330 116 L266 116 Z" fill={body} stroke="rgba(0,0,0,.45)" strokeWidth="2" />
          <rect x="300" y="74" width="16" height="5" rx="2" fill="#d9d4cc" />
        </g>
        <path d="M196 66 L264 66 L264 116 L196 116 Z" fill="none" stroke="rgba(0,0,0,.45)" strokeWidth="2" />
        <rect x="384" y="84" width="12" height="12" rx="3" fill={lights > 0 ? "#fff3cc" : "#cfd3d8"} />
        <rect x="6" y="76" width="8" height="18" rx="2" fill={tail > 0 ? "#ff3b2f" : "#5a1c18"} />
        {tail > 0 && <circle cx="6" cy="85" r="22" fill="rgba(255,60,40,.35)" opacity={tail} />}
        <rect x="360" y="106" width="38" height="10" rx="3" fill="#b9bcc1" />
        <rect x="2" y="110" width="20" height="8" rx="2" fill="#7b7f85" />
      </>}
      {[86, 318].map((cx) => <g key={cx} transform={`rotate(${wheelRot} ${cx} 128)`}>
        <circle cx={cx} cy="128" r="30" fill={ghost > 0 ? "none" : "#121212"} stroke={ghost > 0 ? `rgba(255,255,255,${0.5 * ghost})` : "#000"} strokeWidth="3" strokeDasharray={ghost > 0 ? "8 6" : undefined} />
        {ghost === 0 && <><circle cx={cx} cy="128" r="15" fill="#9a9ea4" />{[0, 72, 144, 216, 288].map((a) => <circle key={a} cx={cx + 8 * Math.cos(a * Math.PI / 180)} cy={128 + 8 * Math.sin(a * Math.PI / 180)} r="2.4" fill="#3a3c40" />)}</>}
      </g>)}
    </svg>
  </div>;
};

// pickup desde arriba (frente hacia arriba); bar = barra amarilla en el volante que se ve por el parabrisas
export const PickupTop: React.FC<{ w?: number; col?: string; bar?: number; lights?: number; dim?: number }> = ({ w = 150, col = "#5d6670", bar = 0, lights = 0, dim = 0 }) => {
  const h = w * 2.3;
  return <div style={{ width: w, height: h, position: "relative", filter: dim > 0 ? `brightness(${1 - 0.6 * dim})` : undefined }}>
    {lights > 0 && <div style={{ position: "absolute", left: -w * 0.4, top: -h * 0.6, width: w * 1.8, height: h * 0.62, background: "radial-gradient(ellipse at 50% 100%, rgba(255,246,216,.6), transparent 70%)", opacity: lights }} />}
    <div style={{ position: "absolute", inset: 0, borderRadius: `${w * 0.22}px ${w * 0.22}px ${w * 0.08}px ${w * 0.08}px`, background: `linear-gradient(90deg, #0d0d0f, ${col} 18%, ${col} 82%, #0d0d0f)`, boxShadow: "0 30px 40px rgba(0,0,0,.6)" }} />
    <div style={{ position: "absolute", left: w * 0.12, top: h * 0.22, width: w * 0.76, height: h * 0.14, borderRadius: 10, background: "linear-gradient(180deg,#5a7590,#1a2330)" }}>
      {bar > 0 && <div style={{ position: "absolute", left: "18%", top: "38%", width: `${64 * bar}%`, height: "24%", borderRadius: 6, background: YEL, boxShadow: `0 0 ${24 * bar}px ${YEL}` }} />}
    </div>
    <div style={{ position: "absolute", left: w * 0.14, top: h * 0.38, width: w * 0.72, height: h * 0.14, borderRadius: 6, background: "rgba(0,0,0,.25)" }} />
    <div style={{ position: "absolute", left: w * 0.1, top: h * 0.55, width: w * 0.8, height: h * 0.4, borderRadius: 6, background: "rgba(0,0,0,.35)", boxShadow: "inset 0 0 0 4px rgba(255,255,255,.08)" }} />
  </div>;
};

// la llave inteligente: cuerpo negro, botones, un ojito que se prende (awake) o duerme
export const KFob: React.FC<{ s?: number; awake?: number; press?: number; cut?: number; ball?: number }> = ({ s = 1, awake = 0, press = 0, cut = 0, ball = 0 }) => (
  <div style={{ width: 120 * s, height: 210 * s, position: "relative" }}>
    <div style={{ position: "absolute", left: 36 * s, top: -34 * s, width: 48 * s, height: 48 * s, borderRadius: "50%", border: `${8 * s}px solid #c8ccd2`, boxSizing: "border-box" }} />
    <div style={{ position: "absolute", inset: 0, borderRadius: 50 * s, background: "linear-gradient(150deg,#3b3f46,#121418 70%)", boxShadow: `0 ${20 * s}px ${40 * s}px rgba(0,0,0,.6), inset 0 ${2 * s}px 0 rgba(255,255,255,.18)` }} />
    {[0, 1, 2].map((i) => <div key={i} style={{ position: "absolute", left: 30 * s, top: (54 + i * 46) * s + (i === 0 ? press * 4 * s : 0), width: 60 * s, height: 34 * s, borderRadius: 12 * s, background: i === 0 && press > 0 ? "#3d4a5a" : "#24272d", boxShadow: i === 0 && press > 0 ? "inset 0 3px 6px rgba(0,0,0,.6)" : `0 ${3 * s}px 0 #070809` }}>
      <div style={{ position: "absolute", left: "50%", top: "50%", width: 16 * s, height: 16 * s, transform: "translate(-50%,-50%)", border: `${3 * s}px solid #8a9099`, borderRadius: i === 2 ? "50%" : 4 * s, boxSizing: "border-box" }} /></div>)}
    <div style={{ position: "absolute", left: 52 * s, top: 22 * s, width: 16 * s, height: 16 * s, borderRadius: "50%", background: awake > 0 ? `rgba(120,220,255,${0.4 + 0.6 * awake})` : "#2a2e34", boxShadow: awake > 0 ? `0 0 ${30 * awake * s}px ${ICE}` : "none" }} />
    {cut > 0 && <div style={{ position: "absolute", left: 14 * s, top: 46 * s, width: 92 * s, height: 140 * s, borderRadius: 30 * s, background: "linear-gradient(180deg,#1f4a2c,#0f2a18)", opacity: cut, boxShadow: "inset 0 0 0 2px #3c8a52" }}>
      <div style={{ position: "absolute", left: 14 * s, top: 18 * s, width: 64 * s, height: 22 * s, borderRadius: 11 * s, background: "rgba(255,255,255,.12)", boxShadow: "inset 0 0 0 2px rgba(255,255,255,.4)" }}>
        <div style={{ position: "absolute", left: (4 + 40 * ball) * s, top: 3 * s, width: 16 * s, height: 16 * s, borderRadius: "50%", background: "radial-gradient(circle at 35% 30%, #fff, #9aa2ac)" }} /></div>
      {[0, 1, 2].map((i) => <div key={i} style={{ position: "absolute", left: (18 + i * 22) * s, top: 66 * s, width: 14 * s, height: 30 * s, background: "#151515", borderRadius: 2 * s }} />)}
      <div style={{ position: "absolute", left: 20 * s, top: 108 * s, width: 52 * s, height: 18 * s, borderRadius: 4 * s, background: "linear-gradient(90deg,#d8d8d8,#8f8f8f)" }} />
    </div>}
  </div>
);

// gancho de llaves junto a la puerta
export const Hook: React.FC<{ s?: number; keys?: number; awake?: number }> = ({ s = 1, keys = 1, awake = 0 }) => (
  <div style={{ width: 180 * s, height: 240 * s, position: "relative" }}>
    <div style={{ position: "absolute", left: 0, top: 0, width: 180 * s, height: 46 * s, borderRadius: 8 * s, background: "linear-gradient(180deg,#8a6844,#5a4128)", boxShadow: "0 10px 20px rgba(0,0,0,.5)" }} />
    {[0.25, 0.5, 0.75].map((x, i) => <div key={i} style={{ position: "absolute", left: 180 * s * x - 5 * s, top: 30 * s, width: 10 * s, height: 30 * s, borderRadius: `0 0 ${8 * s}px ${8 * s}px`, background: "#c9ccd1" }}>
      {i < keys && <div style={{ position: "absolute", left: -20 * s, top: 26 * s }}><KFob s={0.42 * s} awake={awake} /></div>}</div>)}
  </div>
);

// volante visto desde el asiento; bar 0..1 = barra amarilla trabada de lado a lado
export const Wheel: React.FC<{ s?: number; bar?: number; rot?: number }> = ({ s = 1, bar = 0, rot = 0 }) => (
  <div style={{ width: 380 * s, height: 380 * s, position: "relative" }}>
    <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: `${34 * s}px solid #1b1c1f`, boxShadow: `inset 0 0 0 ${3 * s}px #36383d, 0 ${30 * s}px ${50 * s}px rgba(0,0,0,.6)`, boxSizing: "border-box", transform: `rotate(${rot}deg)` }}>
      <div style={{ position: "absolute", left: "50%", top: "50%", width: 120 * s, height: 100 * s, transform: "translate(-50%,-50%)", borderRadius: 26 * s, background: "linear-gradient(160deg,#2c2e33,#121316)" }} />
      {[0, 90, 270].map((a) => <div key={a} style={{ position: "absolute", left: "50%", top: "50%", width: 140 * s, height: 26 * s, transformOrigin: "0 50%", transform: `rotate(${a}deg) translateY(-50%)`, background: "#1b1c1f" }} />)}
    </div>
    {bar > 0 && <div style={{ position: "absolute", left: -20 * s, top: 150 * s, width: 420 * s * bar, height: 54 * s, borderRadius: 14 * s, background: `linear-gradient(180deg, #ffe58a, ${YEL} 40%, #c79a08)`, boxShadow: `0 0 ${40 * bar * s}px rgba(255,210,58,.6), 0 ${12 * s}px ${20 * s}px rgba(0,0,0,.5)` }}>
      <div style={{ position: "absolute", right: 30 * s, top: -24 * s, width: 60 * s, height: 100 * s, borderRadius: 12 * s, background: "#1c1c1c", opacity: bar > 0.9 ? 1 : 0 }} /></div>}
  </div>
);

// silueta de hombre (de pie / caminando con la fase ph)
export const Man: React.FC<{ s?: number; col?: string; ph?: number; hood?: boolean }> = ({ s = 1, col = "#0b0b0d", ph = 0, hood }) => {
  const a = 18 * Math.sin(ph);
  return <svg width={90 * s} height={210 * s} viewBox="0 0 90 210" style={{ overflow: "visible" }}>
    <circle cx="45" cy="22" r={hood ? 19 : 16} fill={col} />
    <path d="M24 44 Q45 34 66 44 L70 118 L20 118 Z" fill={col} />
    <g transform={`rotate(${a} 45 116)`}><rect x="30" y="112" width="14" height="94" rx="6" fill={col} /></g>
    <g transform={`rotate(${-a} 45 116)`}><rect x="46" y="112" width="14" height="94" rx="6" fill={col} /></g>
    <g transform={`rotate(${-a * 0.7} 26 48)`}><rect x="16" y="46" width="11" height="70" rx="5" fill={col} /></g>
    <g transform={`rotate(${a * 0.7} 64 48)`}><rect x="63" y="46" width="11" height="70" rx="5" fill={col} /></g>
  </svg>;
};

// casa de frente (de noche): ventanas encendidas 0..1, puerta con farolito
export const NHouse: React.FC<{ w?: number; lit?: number; col?: string; porch?: number }> = ({ w = 520, lit = 0, col = "#4a4038", porch = 0 }) => {
  const h = w * 0.7;
  return <div style={{ width: w, height: h, position: "relative" }}>
    <div style={{ position: "absolute", left: 0, top: h * 0.38, width: w, height: h * 0.62, background: `linear-gradient(180deg, ${col}, #1c1814)`, boxShadow: "0 40px 60px rgba(0,0,0,.6)" }} />
    <div style={{ position: "absolute", left: -w * 0.05, top: 0, width: 0, height: 0, borderLeft: `${w * 0.55}px solid transparent`, borderRight: `${w * 0.55}px solid transparent`, borderBottom: `${h * 0.4}px solid #2a221d` }} />
    {[0.14, 0.62].map((x, i) => <div key={i} style={{ position: "absolute", left: w * x, top: h * 0.52, width: w * 0.22, height: h * 0.2, borderRadius: 4, background: lit > 0 ? `rgba(255,206,130,${0.25 + 0.7 * lit})` : "#151a22", boxShadow: lit > 0 ? `0 0 ${40 * lit}px rgba(255,190,110,.55), inset 0 0 0 5px #2a221d` : "inset 0 0 0 5px #2a221d" }} />)}
    <div style={{ position: "absolute", left: w * 0.42, top: h * 0.6, width: w * 0.14, height: h * 0.4, background: "#24170f", borderRadius: "6px 6px 0 0" }} />
    {porch > 0 && <div style={{ position: "absolute", left: w * 0.3, top: h * 0.48, width: w * 0.4, height: h * 0.6, background: `radial-gradient(ellipse at 50% 20%, rgba(255,214,150,${0.5 * porch}), transparent 70%)` }} />}
  </div>;
};

// noche con estrellas fijas (sembradas) y farol de calle
export const NightSky: React.FC<{ tt: number; moon?: boolean }> = ({ tt, moon = true }) => <>
  <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, #070a14, ${NIGHT} 60%, #161a24)` }} />
  {Array.from({ length: 60 }, (_, i) => <div key={i} style={{ position: "absolute", left: rnd(i) * 1920, top: rnd(i + 99) * 520, width: 2 + rnd(i + 3) * 2, height: 2 + rnd(i + 3) * 2, borderRadius: "50%", background: "#dfe6ff", opacity: 0.25 + 0.35 * (0.5 + 0.5 * Math.sin(tt * 0.6 + i)) }} />)}
  {moon && <div style={{ position: "absolute", left: 1600, top: 110, width: 110, height: 110, borderRadius: "50%", background: "radial-gradient(circle at 40% 40%, #fffbe8, #c9c4b0)", boxShadow: "0 0 80px rgba(255,250,220,.35)" }} />}
</>;

export const Lamp: React.FC<{ h?: number; on?: number }> = ({ h = 520, on = 1 }) => (
  <div style={{ width: 300, height: h, position: "relative" }}>
    <div style={{ position: "absolute", left: 140, top: 0, width: 16, height: h, background: "linear-gradient(90deg,#1a1c20,#3a3d44,#1a1c20)" }} />
    <div style={{ position: "absolute", left: 100, top: -6, width: 96, height: 26, borderRadius: "40px 40px 6px 6px", background: "#2c2e33" }} />
    <div style={{ position: "absolute", left: -60, top: 18, width: 420, height: h, background: `radial-gradient(ellipse 50% 90% at 50% 0%, rgba(255,214,140,${0.32 * on}), transparent 70%)` }} />
  </div>
);

// la bolsita de tela metálica (pouch) con su tapa
export const Bag: React.FC<{ s?: number; open?: number; crease?: number; leak?: number }> = ({ s = 1, open = 0, crease = 0, leak = 0 }) => (
  <div style={{ width: 200 * s, height: 280 * s, position: "relative" }}>
    <div style={{ position: "absolute", inset: 0, borderRadius: 18 * s, background: "linear-gradient(150deg,#3a3c40,#16171a)", boxShadow: `0 ${24 * s}px ${40 * s}px rgba(0,0,0,.6)`, backgroundImage: "repeating-linear-gradient(45deg, rgba(255,255,255,.05) 0 2px, transparent 2px 6px)" }} />
    <div style={{ position: "absolute", left: 0, top: 0, width: 200 * s, height: 90 * s, borderRadius: `${18 * s}px ${18 * s}px ${8 * s}px ${8 * s}px`, background: "linear-gradient(180deg,#4a4c52,#26272b)", transformOrigin: "50% 0", transform: `perspective(500px) rotateX(${-160 * open}deg)` }} />
    {crease > 0 && <svg width={200 * s} height={280 * s} style={{ position: "absolute", left: 0, top: 0 }}>
      <path d={`M0 ${140 * s} L${200 * s} ${140 * s}`} stroke={`rgba(230,230,230,${0.7 * crease})`} strokeWidth={3 * s} strokeDasharray={`${6 * s} ${4 * s}`} />
      {leak > 0 && Array.from({ length: 5 }, (_, i) => <circle key={i} cx={(30 + i * 36) * s} cy={140 * s} r={(4 + 10 * leak) * s} fill={ICE} opacity={0.4 * leak} />)}
    </svg>}
  </div>
);
