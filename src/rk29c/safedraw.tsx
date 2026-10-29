// rk29c · dibujos base (SVG/CSS con volumen) del garage: la caja fuerte, la losa de concreto, el portón con ventanitas,
// el tablero de herramientas, el carro rojo, las latas de pintura, el termotanque, la caja de cartón. heroesA/B arman cada mecanismo con esto.
import React from "react";

export const AMB = "#ffb257", RED = "#ff5a4a", ICE = "#8fd6ff", GRN = "#6fe39a", TX = "#f7f4ee", STEEL = "#9aa1aa", CONC = "#8d8a84";
export const rnd = (i: number) => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };

export const At: React.FC<{ x: number; y: number; s?: number; rot?: number; o?: number; z?: number; children: React.ReactNode }> = ({ x, y, s = 1, rot = 0, o = 1, z, children }) => (
  <div style={{ position: "absolute", left: x, top: y, zIndex: z, transform: `translate(-50%,-50%) rotate(${rot}deg) scale(${s})`, opacity: o }}>{children}</div>
);

// caja fuerte de frente con lateral en perspectiva: dial, manija, bisagras; open 0..1 abre la puerta; bolts = pernos al piso; handles = manijas de mudanza
export const Safe: React.FC<{ w?: number; open?: number; col?: string; bolts?: number; handles?: number; glowBolts?: number; dent?: number }> = ({ w = 300, open = 0, col = "#3a3f46", bolts = 0, handles = 0, glowBolts = 0, dent = 0 }) => {
  const h = w * 1.2, side = w * 0.22;
  return <div style={{ width: w + side, height: h + 30, position: "relative" }}>
    <div style={{ position: "absolute", left: w, top: side * 0.5, width: side, height: h - side * 0.5, background: `linear-gradient(90deg, #22262b, #15181c)`, transform: "skewY(-26deg)", transformOrigin: "0 0" }} />
    <div style={{ position: "absolute", left: 0, top: 0, width: w, height: h, borderRadius: 8, background: `linear-gradient(160deg, ${col}, #1c1f24 80%)`, boxShadow: "0 50px 70px rgba(0,0,0,.65), inset 0 2px 0 rgba(255,255,255,.14)" }}>
      {open > 0.02 && <div style={{ position: "absolute", left: w * 0.08, top: w * 0.08, width: w * 0.84, height: h - w * 0.16, background: "linear-gradient(180deg,#5b4a36,#2c241a)", boxShadow: "inset 0 10px 30px rgba(0,0,0,.8)" }}>
        {[0.33, 0.66].map((y, i) => <div key={i} style={{ position: "absolute", left: 0, right: 0, top: `${y * 100}%`, height: 6, background: "#1a140e" }} />)}</div>}
      <div style={{ position: "absolute", left: w * 0.06, top: w * 0.06, width: w * 0.88, height: h - w * 0.12, borderRadius: 6, background: `linear-gradient(150deg, #4a5059, #262a30)`, boxShadow: "inset 0 0 0 3px rgba(0,0,0,.35), 0 0 0 2px rgba(255,255,255,.05)", transformOrigin: "0 50%", transform: `perspective(900px) rotateY(${-100 * open}deg)` }}>
        <div style={{ position: "absolute", left: "50%", top: "34%", width: w * 0.3, height: w * 0.3, borderRadius: "50%", transform: "translate(-50%,-50%)", background: "radial-gradient(circle at 35% 30%, #d9dde2, #6d737b 60%, #2a2e33)", boxShadow: "0 6px 12px rgba(0,0,0,.6)" }}>
          {Array.from({ length: 12 }, (_, i) => <div key={i} style={{ position: "absolute", left: "50%", top: 3, width: 2, height: 8, background: "#222", transformOrigin: `1px ${w * 0.15 - 3}px`, transform: `rotate(${i * 30}deg)` }} />)}</div>
        <div style={{ position: "absolute", left: "50%", top: "62%", width: w * 0.36, height: w * 0.07, borderRadius: w * 0.04, transform: "translate(-50%,-50%)", background: "linear-gradient(180deg,#e2e5e9,#80868e)", boxShadow: "0 5px 8px rgba(0,0,0,.6)" }} />
        {dent > 0 && Array.from({ length: Math.round(9 * dent) }, (_, i) => <div key={i} style={{ position: "absolute", right: -2 + rnd(i) * 8, top: `${8 + rnd(i + 9) * 80}%`, width: 30 + rnd(i + 3) * 50, height: 3, background: "rgba(220,225,230,.85)", transform: `rotate(${-20 + rnd(i + 5) * 40}deg)` }} />)}
      </div>
      {[0.2, 0.8].map((y, i) => <div key={i} style={{ position: "absolute", left: -6, top: `${y * 100}%`, width: 10, height: w * 0.12, borderRadius: 3, background: "#6d737b" }} />)}
      {handles > 0.02 && [-1, 1].map((d) => <div key={d} style={{ position: "absolute", top: h * 0.4, left: d < 0 ? -w * 0.2 * handles : w, width: w * 0.2 * handles, height: w * 0.22, border: `${w * 0.035}px solid #c9ccd1`, borderLeft: d < 0 ? undefined : "none", borderRight: d > 0 ? undefined : "none", borderRadius: d < 0 ? `${w * 0.1}px 0 0 ${w * 0.1}px` : `0 ${w * 0.1}px ${w * 0.1}px 0`, boxSizing: "border-box" }} />)}
    </div>
    {bolts > 0.02 && [0.12, 0.88].map((x, i) => <div key={i} style={{ position: "absolute", left: w * x - 16, top: h - 12, width: 32, height: 24 * bolts + 4, borderRadius: 4, background: glowBolts > 0 ? `rgba(255,178,87,${0.5 + 0.5 * glowBolts})` : "#c9ccd1", boxShadow: glowBolts > 0 ? `0 0 ${30 * glowBolts}px ${AMB}` : "0 4px 6px rgba(0,0,0,.6)" }} />)}
  </div>;
};

// losa de concreto en corte: piedritas adentro, espesor visible; children van ARRIBA de la losa
export const Slab: React.FC<{ w?: number; h?: number; crack?: number; cables?: number; hum?: number; children?: React.ReactNode }> = ({ w = 1200, h = 170, crack = 0, cables = 0, hum = 0, children }) => (
  <div style={{ width: w, height: h, position: "relative", borderRadius: 4, background: `linear-gradient(180deg, #a19d96, ${CONC} 18%, #6c6964)`, boxShadow: "0 40px 60px rgba(0,0,0,.6), inset 0 3px 0 rgba(255,255,255,.25)" }}>
    {Array.from({ length: Math.round(w / 14) }, (_, i) => <div key={i} style={{ position: "absolute", left: rnd(i) * (w - 14), top: 20 + rnd(i + 77) * (h - 34), width: 6 + rnd(i + 5) * 12, height: 5 + rnd(i + 11) * 9, borderRadius: "40%", background: `rgba(${70 + rnd(i) * 40},${68 + rnd(i) * 40},${64 + rnd(i) * 40},.8)` }} />)}
    {cables > 0 && [0.45, 0.7].map((y, i) => <div key={i} style={{ position: "absolute", left: 0, width: w * cables, top: h * y + Math.sin(hum * 40 + i) * 2 * (hum > 0 ? 1 : 0), height: 9, borderRadius: 5, background: "linear-gradient(180deg,#ffd27a,#9c6a20)", boxShadow: `0 0 ${18 * cables}px rgba(255,190,90,.7)` }} />)}
    {crack > 0 && <svg width={w} height={h} style={{ position: "absolute", left: 0, top: 0 }}><path d={`M${w * 0.58} 0 L${w * 0.6} ${h * 0.3} L${w * 0.57} ${h * 0.55} L${w * 0.61} ${h * crack}`} stroke="#2a2826" strokeWidth={5} fill="none" /></svg>}
    <div style={{ position: "absolute", left: 0, bottom: h, width: w }}>{children}</div>
  </div>
);

// portón seccional de garage visto de frente: 4 paneles, fila de ventanitas arriba; down 0..1 = cerrado; lit = luz adentro
export const GDoor: React.FC<{ w?: number; down?: number; lit?: number; inside?: React.ReactNode; frost?: number }> = ({ w = 760, down = 1, lit = 0, inside, frost = 0 }) => {
  const h = w * 0.62, ph = h / 4, shown = h * down;
  return <div style={{ width: w + 60, height: h + 50, position: "relative", background: "linear-gradient(180deg,#5e4f45,#3d332c)", borderRadius: 6, padding: 30, boxSizing: "border-box", boxShadow: "0 50px 80px rgba(0,0,0,.6)" }}>
    <div style={{ position: "absolute", left: 30, top: 30, width: w, height: h, overflow: "hidden", background: lit > 0 ? `radial-gradient(ellipse at 50% 30%, rgba(255,214,150,${0.35 * lit + 0.1}), #1d1812 75%)` : "#141110" }}>
      {inside}
      <div style={{ position: "absolute", left: 0, top: 0, width: w, height: shown, overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 0, bottom: 0, width: w, height: h }}>
          {[0, 1, 2, 3].map((i) => <div key={i} style={{ position: "absolute", left: 0, top: i * ph, width: w, height: ph - 3, background: "linear-gradient(180deg,#f2efe9,#cfcac1)", boxShadow: "inset 0 -4px 6px rgba(0,0,0,.18)" }}>
            {i > 0 && [0.08, 0.53].map((x, j) => <div key={j} style={{ position: "absolute", left: `${x * 100}%`, top: ph * 0.18, width: "39%", height: ph * 0.58, borderRadius: 4, boxShadow: "inset 0 0 0 3px rgba(0,0,0,.08)" }} />)}
            {i === 0 && [0, 1, 2, 3].map((j) => <div key={j} style={{ position: "absolute", left: w * (0.06 + j * 0.235), top: ph * 0.2, width: w * 0.2, height: ph * 0.56, borderRadius: 4, overflow: "hidden", background: lit > 0 ? `rgba(255,214,140,${0.25 + 0.65 * lit})` : "#2a3038", boxShadow: lit > 0 ? `0 0 ${30 * lit}px rgba(255,200,120,.6), inset 0 0 0 4px #e8e4dc` : "inset 0 0 0 4px #e8e4dc" }}>
              {frost > 0 && <div style={{ position: "absolute", inset: 0, background: `rgba(240,244,248,${0.85 * frost})`, backgroundImage: "repeating-linear-gradient(45deg, rgba(255,255,255,.25) 0 3px, transparent 3px 7px)" }} />}
            </div>)}
          </div>)}
        </div>
      </div>
    </div>
  </div>;
};

// herramientas en silueta (para el tablero): crowbar, sledge, grinder, pry, cutters, hammer
export const Tool: React.FC<{ k: string; s?: number; col?: string; glow?: number }> = ({ k, s = 1, col = "#c9ccd1", glow = 0 }) => {
  const f = glow > 0 ? `drop-shadow(0 0 ${16 * glow}px ${AMB})` : "drop-shadow(0 10px 10px rgba(0,0,0,.6))";
  const P: Record<string, React.ReactNode> = {
    crowbar: <path d="M20 10 Q4 10 6 26 L14 28 Q14 18 22 18 L22 230 L30 230 L30 14 Q30 10 20 10Z" fill={col} />,
    pry: <path d="M18 20 L32 20 L32 200 Q40 214 30 222 L20 222 Q12 214 18 200Z" fill={col} />,
    sledge: <><rect x="4" y="10" width="52" height="34" rx="4" fill={col} /><rect x="24" y="44" width="11" height="186" rx="4" fill="#a8743f" /></>,
    hammer: <><path d="M6 12 L50 12 L54 26 L6 26Z" fill={col} /><rect x="24" y="26" width="10" height="130" rx="4" fill="#a8743f" /></>,
    grinder: <><circle cx="30" cy="40" r="28" fill="#8a8f96" stroke={col} strokeWidth="4" /><rect x="18" y="62" width="24" height="120" rx="10" fill="#2d6fb3" /><rect x="22" y="182" width="16" height="44" rx="4" fill="#1d1f23" /></>,
    cutters: <><path d="M24 10 L30 10 L30 70 L24 70Z M32 10 L38 10 L38 70 L32 70Z" fill={col} /><path d="M26 70 L10 226 L20 228 L30 76Z M36 70 L52 226 L42 228 L32 76Z" fill={RED} /></>,
  };
  return <svg width={60 * s} height={240 * s} viewBox="0 0 60 240" style={{ overflow: "visible", filter: f }}>{P[k]}</svg>;
};

// tablero perforado marrón con agujeritos; children = herramientas
export const Peg: React.FC<{ w?: number; h?: number; children?: React.ReactNode }> = ({ w = 900, h = 520, children }) => (
  <div style={{ width: w, height: h, position: "relative", borderRadius: 6, background: "#8a6542", backgroundImage: "radial-gradient(circle, #3a2716 3px, transparent 3.5px)", backgroundSize: "34px 34px", boxShadow: "0 40px 70px rgba(0,0,0,.6), inset 0 0 0 10px #6d4e31" }}>{children}</div>
);

// carro de herramientas rojo con cajones; out = cuánto sale un cajón (0..1)
export const Chest: React.FC<{ w?: number; out?: number; dents?: number }> = ({ w = 320, out = 0, dents = 1 }) => {
  const h = w * 1.25;
  return <div style={{ width: w, height: h + 40, position: "relative" }}>
    <div style={{ position: "absolute", left: 0, top: 0, width: w, height: h, borderRadius: 10, background: "linear-gradient(160deg,#d1382c,#7e1b14 85%)", boxShadow: "0 40px 60px rgba(0,0,0,.6), inset 0 3px 0 rgba(255,255,255,.25)" }}>
      {Array.from({ length: 6 }, (_, i) => <div key={i} style={{ position: "absolute", left: w * 0.06, top: h * (0.06 + i * 0.152), width: w * 0.88, height: h * 0.13, borderRadius: 5, background: "linear-gradient(180deg,#c7342a,#9a2219)", boxShadow: "0 3px 0 rgba(0,0,0,.35)", transform: i === 2 ? `translateY(${out * 14}px) scale(${1 + out * 0.06})` : undefined }}>
        <div style={{ position: "absolute", left: "30%", top: "38%", width: "40%", height: "24%", borderRadius: 4, background: "linear-gradient(180deg,#e9ebee,#8f959c)" }} /></div>)}
      {dents > 0 && [[0.2, 0.3], [0.7, 0.62], [0.4, 0.85]].map(([x, y], i) => <div key={i} style={{ position: "absolute", left: `${x * 100}%`, top: `${y * 100}%`, width: 26, height: 14, borderRadius: "50%", background: "radial-gradient(rgba(0,0,0,.45), transparent 70%)" }} />)}
    </div>
    {[0.1, 0.82].map((x, i) => <div key={i} style={{ position: "absolute", left: w * x, top: h + 4, width: 34, height: 34, borderRadius: "50%", background: "radial-gradient(#555,#111)" }} />)}
  </div>;
};

// lata de pintura vieja con chorreado
export const Can: React.FC<{ w?: number; col?: string; dull?: number }> = ({ w = 110, col = "#6a8fb0", dull = 0 }) => (
  <div style={{ width: w, height: w * 1.1, position: "relative", filter: dull > 0 ? `saturate(${1 - 0.7 * dull})` : undefined }}>
    <div style={{ position: "absolute", inset: 0, top: w * 0.08, borderRadius: `${w * 0.08}px ${w * 0.08}px ${w * 0.12}px ${w * 0.12}px`, background: "linear-gradient(90deg,#7c8086,#d7dade 40%,#8a8e94)", boxShadow: "0 18px 24px rgba(0,0,0,.55)" }} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: w * 0.18, borderRadius: "50%", background: "radial-gradient(#b8bcc1,#6c7076)" }} />
    <div style={{ position: "absolute", left: w * 0.3, top: w * 0.1, width: w * 0.16, height: w * 0.45, borderRadius: w * 0.08, background: col }} />
    <div style={{ position: "absolute", left: 0, right: 0, top: w * 0.4, height: w * 0.36, background: "linear-gradient(90deg,#d8cfbf,#f2ece0 40%,#cfc5b3)", opacity: 0.9 }} />
  </div>
);

// termotanque de pie con caños
export const Heater: React.FC<{ w?: number }> = ({ w = 180 }) => (
  <div style={{ width: w, height: w * 2.6, position: "relative" }}>
    {[0.3, 0.7].map((x, i) => <div key={i} style={{ position: "absolute", left: w * x - 7, top: 0, width: 14, height: w * 0.4, background: "linear-gradient(90deg,#9c5a2c,#e09a5c,#9c5a2c)" }} />)}
    <div style={{ position: "absolute", left: 0, top: w * 0.35, width: w, height: w * 2.15, borderRadius: `${w * 0.18}px ${w * 0.18}px 10px 10px`, background: "linear-gradient(90deg,#8d9096,#e6e8eb 40%,#9a9ea4)", boxShadow: "0 40px 50px rgba(0,0,0,.55)" }}>
      <div style={{ position: "absolute", left: "30%", top: "72%", width: "40%", height: "12%", borderRadius: 6, background: "#1d1f23" }} /></div>
  </div>
);

// caja de cartón grande con la foto de la caja fuerte impresa en el costado
export const Box: React.FC<{ w?: number; pic?: number; flat?: number }> = ({ w = 360, pic = 1, flat = 0 }) => (
  <div style={{ width: w, height: w * 1.15 * (1 - 0.82 * flat), position: "relative", borderRadius: 4, background: "linear-gradient(160deg,#c89a62,#9c7040)", boxShadow: "0 40px 60px rgba(0,0,0,.55), inset 0 0 0 3px rgba(0,0,0,.08)" }}>
    <div style={{ position: "absolute", left: 0, right: 0, top: "48%", height: 18, background: "rgba(220,190,140,.6)" }} />
    {pic > 0 && flat < 0.5 && <div style={{ position: "absolute", left: "26%", top: "16%", opacity: pic, transform: `scale(${w / 520})`, transformOrigin: "0 0" }}><Safe w={260} /></div>}
  </div>
);

// camioneta de costado
export const Truck: React.FC<{ w?: number; col?: string }> = ({ w = 420, col = "#4a5a6a" }) => (
  <svg width={w} height={w * 0.42} viewBox="0 0 200 84" style={{ overflow: "visible", filter: "drop-shadow(0 18px 16px rgba(0,0,0,.55))" }}>
    <path d="M6 58 L6 40 L100 40 L100 22 Q104 14 116 14 L148 14 Q156 14 162 24 L178 40 L194 44 L194 62 L6 62Z" fill={col} />
    <path d="M116 20 L146 20 Q152 20 156 28 L166 40 L116 40Z" fill="#9fc3dd" />
    {[44, 156].map((x) => <g key={x}><circle cx={x} cy="64" r="15" fill="#151515" /><circle cx={x} cy="64" r="6" fill="#8d9096" /></g>)}
  </svg>
);

// silueta de persona simple (cabeza + cuerpo)
export const Person: React.FC<{ s?: number; col?: string }> = ({ s = 1, col = "#d9d2c4" }) => (
  <div style={{ width: 90 * s, height: 200 * s, position: "relative" }}>
    <div style={{ position: "absolute", left: 25 * s, top: 0, width: 40 * s, height: 40 * s, borderRadius: "50%", background: col }} />
    <div style={{ position: "absolute", left: 8 * s, top: 46 * s, width: 74 * s, height: 150 * s, borderRadius: `${36 * s}px ${36 * s}px ${12 * s}px ${12 * s}px`, background: col }} />
  </div>
);

// casa con garage (de frente) para calles y mapas
export const GHouse: React.FC<{ w?: number; col?: string; lit?: number }> = ({ w = 420, col = "#9a6a52", lit = 0 }) => (
  <svg width={w} height={w * 0.6} viewBox="0 0 200 120" style={{ overflow: "visible", filter: "drop-shadow(0 22px 22px rgba(0,0,0,.55))" }}>
    <path d="M4 52 L70 14 L136 52Z" fill="#3b3330" /><rect x="12" y="50" width="116" height="68" fill={col} />
    <rect x="128" y="62" width="68" height="56" fill={col} /><path d="M124 64 L162 40 L200 64Z" fill="#3b3330" />
    <rect x="136" y="74" width="52" height="44" fill="#ece8e0" />{[0, 1, 2, 3].map((i) => <rect key={i} x={139 + i * 12.5} y="78" width="9" height="6" fill={lit > 0 ? `rgba(255,210,140,${0.4 + 0.6 * lit})` : "#2b3440"} />)}
    <rect x="30" y="68" width="26" height="22" fill={lit > 0 ? `rgba(255,214,140,${0.3 + 0.5 * lit})` : "#2b3440"} /><rect x="80" y="80" width="22" height="38" fill="#4a2a20" />
  </svg>
);

// anclaje: "wedge" (perno de expansión de acero) o "sleeve" (taquito de plástico)
export const Anchor: React.FC<{ k?: "wedge" | "sleeve"; len?: number; w?: number; spread?: number }> = ({ k = "wedge", len = 240, w = 34, spread = 0 }) => k === "wedge"
  ? <div style={{ width: w + 30, height: len, position: "relative" }}>
    <div style={{ position: "absolute", left: 15, top: 30, width: w, height: len - 30, borderRadius: 4, background: "repeating-linear-gradient(180deg,#c9ccd1 0 6px,#8d9096 6px 10px)" }} />
    <div style={{ position: "absolute", left: 15 - 4 * spread, bottom: 0, width: w + 8 * spread, height: 40, borderRadius: 4, background: "linear-gradient(90deg,#9ea3aa,#e1e4e8,#9ea3aa)" }} />
    <div style={{ position: "absolute", left: 0, top: 0, width: w + 30, height: 30, borderRadius: 4, background: "linear-gradient(180deg,#e1e4e8,#80868e)" }} /></div>
  : <div style={{ width: w, height: len * 0.4, borderRadius: `4px 4px ${w / 2}px ${w / 2}px`, background: "linear-gradient(90deg,#d8d2c2,#fffaf0,#d8d2c2)", boxShadow: "0 8px 10px rgba(0,0,0,.4)" }} />;

// gota de agua
export const Drop: React.FC<{ s?: number }> = ({ s = 30 }) => <div style={{ width: s, height: s * 1.3, borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%", background: "radial-gradient(circle at 35% 35%, #e6f6ff, #4aa8e0 60%, #1d6aa0)", transform: "rotate(180deg)", boxShadow: "0 6px 10px rgba(0,0,0,.35)" }} />;
