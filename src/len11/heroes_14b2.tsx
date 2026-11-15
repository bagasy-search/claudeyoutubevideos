// Héroes de len14b (ducha) — parte 2. CSS/DOM puro (kit hk14).
import React from "react";
import { H, F, K, SLAB, SANS, HAND, cl, lerp, eio, eout, pr, useT, WOOD, PALEWOOD, TILE, PAPER, CORK, STEEL, CHALK, NIGHT, CLOTH, Box, Tx, Stage, Rubber } from "./hk14";

const tg = (c: string = K.ink, s = 40): React.CSSProperties => ({ fontFamily: SANS, fontWeight: 900, fontSize: s, color: c });
const WTILE: React.CSSProperties = { backgroundColor: "#eef0ee", backgroundImage: "linear-gradient(rgba(150,150,150,0.55) 3px, transparent 3px), linear-gradient(90deg, rgba(150,150,150,0.55) 3px, transparent 3px)", backgroundSize: "110px 110px" };
const HAIR = (n: number, w = 200, h = 120, seed = 1) => Array.from({ length: n }, (_, i) => <div key={i} style={{ position: "absolute", left: (i * 37 * seed) % w, top: (i * 53) % h, width: 110, height: 3, background: "#3a2a1c", transform: `rotate(${(i * 47 * seed) % 180}deg)` }} />);

// ── BARB_STICK: la tira plástica con dientes (en vista lateral gigante) baja por un tubo de acrílico y al subir arrastra el nido de pelo; v1: un dedo empuja y el nido se compacta abajo
export const barb_stick: H = ({ dur, v = 0 }) => {
  const t = useT(), down = eio(pr(t, 0.2, 1.1)), up = eio(pr(t, 1.4, 2.4));
  const y = v === 0 ? lerp(-500, 80, down) - 520 * up : 0, push = v === 1 ? eio(pr(t, 0.3, 1.6)) : 0;
  return (<F dur={dur}><Stage rx={6} ry={-14 + Math.sin(t * 0.3) * 8} bg={WTILE}>
    <Box x={800} y={160} w={320} h={820} z={0} style={{ background: "rgba(215,232,240,0.45)", border: "10px solid rgba(255,255,255,0.85)", borderTop: "none" }}>
      <div style={{ position: "absolute", left: 50, top: v === 1 ? lerp(380, 560, push) : 520, width: 220, height: v === 1 ? lerp(160, 90, push) : 160, opacity: v === 0 ? 1 - up * 0.95 : 1 }}>{HAIR(36, 200, v === 1 ? 70 : 150)}</div>
    </Box>
    {v === 0 && <div style={{ position: "absolute", left: 935, top: 160 + y, width: 50, height: 760, background: "#1d1d1d", borderRadius: 6 }}>
      {Array.from({ length: 18 }, (_, i) => <React.Fragment key={i}>
        <div style={{ position: "absolute", left: -26, top: 120 + i * 34, width: 30, height: 10, background: "#1d1d1d", transform: "rotate(-35deg)" }} />
        <div style={{ position: "absolute", right: -26, top: 120 + i * 34, width: 30, height: 10, background: "#1d1d1d", transform: "rotate(35deg)" }} />
      </React.Fragment>)}
      <div style={{ position: "absolute", left: -40, top: 640, width: 130, height: 120, opacity: up }}>{HAIR(24, 120, 110, 2)}</div>
    </div>}
    {v === 1 && <div style={{ position: "absolute", left: 900, top: lerp(-160, 240, push), width: 120, height: 300, borderRadius: "60px 60px 20px 20px", background: "linear-gradient(90deg,#d9a487,#f2c4a8,#d9a487)" }} />}
    <Tx x={400} y={260} w={600} s={50} c={K.navy} wt={900}>{v === 0 ? "BARBS GRAB, PULL UP" : "PUSHING IT DOWN"}</Tx>
    {v === 0 && <Tx x={400} y={340} w={600} s={42} c={K.green} wt={900} o={up}>≈ $3 · hardware store</Tx>}
    {v === 1 && <Rubber t={t} at={1.7} x={1470} y={560} text="PACKS IT TIGHTER" c={K.red} s={54} />}
  </Stage></F>);
};

// ── COVER_FLIP: tres tipos de tapa de desagüe en relieve sobre el piso; la elegida gira de canto y muestra cómo se saca
const CV: [string, string][] = [["SNAP-IN GRATE", "PRY UP WITH A FLAT SCREWDRIVER"], ["LINEAR DRAIN", "LIFT THE LONG GRATE OUT"], ["TUB STOPPER", "STEP NINE"]];
export const cover_flip: H = ({ dur, v = 0 }) => {
  const t = useT(), rise = eio(pr(t, 0.4, 1.4)), [a, b] = CV[v] ?? CV[0];
  const face: React.CSSProperties = v === 1
    ? { width: 1100, height: 120, borderRadius: 10, background: "repeating-linear-gradient(90deg,#c9cfd2 0 30px,#4a4f54 30px 40px)" }
    : v === 2 ? { width: 340, height: 340, borderRadius: 170, background: "radial-gradient(circle at 40% 35%, #f4f6f7, #a9b1b5 70%)", boxShadow: "inset 0 0 0 16px #8c9196" }
      : { width: 380, height: 380, borderRadius: 18, background: "repeating-linear-gradient(0deg,#c9cfd2 0 22px,#4a4f54 22px 30px), #c9cfd2" };
  const w = (face.width as number), h = (face.height as number);
  return (<F dur={dur}><Stage rx={52} persp={1300} bg={{ backgroundColor: "#f5f5f1", backgroundImage: "linear-gradient(60deg, rgba(150,150,150,0.4) 2px, transparent 2px), linear-gradient(-60deg, rgba(150,150,150,0.4) 2px, transparent 2px)", backgroundSize: "60px 104px" }}>
    <div style={{ position: "absolute", left: 960 - w / 2, top: 560 - h / 2, width: w, height: h, background: "#222", borderRadius: face.borderRadius }} />
    <div style={{ position: "absolute", left: 960 - w / 2, top: 560 - h / 2, ...face, transformOrigin: "50% 0", transform: `translateZ(${rise * 30}px) rotateX(${-rise * 75}deg)`, boxShadow: "0 10px 20px rgba(0,0,0,0.35)" }} />
    <Tx x={960} y={70} s={78} c={K.navy} wt={900}>{a}</Tx>
    <Tx x={960} y={900} s={46} c="#2f6fa5" wt={900} o={cl((t - 1.3) * 3)}>{b}</Tx>
  </Stage></F>);
};

// ── FUNNEL_PAIR: dos embudos de cocina sobre frascos: uno gotea lento (SLOW), el otro no deja pasar nada (STOPPED)
export const funnel_pair: H = ({ dur }) => {
  const t = useT();
  const fun = (x: number, stopped: boolean, lab: string, c: string) => <>
    <Box x={x - 170} y={280} w={340} h={240} z={0} style={{ background: "linear-gradient(90deg,#b9c1c5,#eef1f2,#9aa3a8)", clipPath: "polygon(0 0,100% 0,58% 100%,42% 100%)" }} />
    <div style={{ position: "absolute", left: x - 160, top: 290, width: 320, height: 60, borderRadius: "50%", background: "rgba(120,170,210,0.75)" }} />
    <Box x={x - 20} y={520} w={40} h={100} z={0} style={{ ...STEEL }} />
    {!stopped && [0, 1, 2].map((k) => <div key={k} style={{ position: "absolute", left: x - 8, top: 630 + ((t * 140 + k * 70) % 200), width: 16, height: 24, borderRadius: 8, background: "#7fc3ef" }} />)}
    <Box x={x - 150} y={640} w={300} h={300} z={-10} style={{ border: "8px solid rgba(255,255,255,0.85)", borderTop: "none", borderRadius: "0 0 30px 30px", background: "rgba(220,235,240,0.3)" }}>
      {!stopped && <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 40 + t * 18, background: "rgba(143,193,221,0.7)" }} />}
    </Box>
    <Tx x={x} y={180} w={500} s={60} c={c} wt={900}>{lab}</Tx>
  </>;
  return (<F dur={dur}><Stage rx={6} ry={Math.sin(t * 0.3) * 8} bg={PALEWOOD}>
    {fun(600, false, "SLOW", K.green)}{fun(1320, true, "STOPPED", K.red)}
    <Tx x={960} y={70} s={52} c={K.navy} wt={900}>STANDING WATER = NOT THIS FIX</Tx>
  </Stage></F>);
};

// ── POWDER_WALL: corte de pared de caño en primer plano con la capa gris mojada; v0 un chorro de agua barre el polvo de largo; v1 el polvo seco cae y se pega como nieve en una pared
export const powder_wall: H = ({ dur, v = 0 }) => {
  const t = useT();
  const grains = Array.from({ length: 60 }, (_, i) => {
    const x0 = 120 + (i * 97) % 1700, d = (i % 10) * 0.08, ph = pr(t, 0.2 + d, 1.4 + d);
    const y = v === 0 ? lerp(-40, 1200, ph) : lerp(-40, 560 + (i % 7) * 12, eout(ph)), x = v === 0 ? x0 + ph * 600 : x0;
    return <div key={i} style={{ position: "absolute", left: x, top: y, width: 14, height: 14, borderRadius: 7, background: "#fbfaf6", boxShadow: "0 1px 2px rgba(0,0,0,0.25)" }} />;
  });
  return (<F dur={dur}><Stage rx={4} ry={Math.sin(t * 0.3) * 6} bg={{ background: "linear-gradient(180deg,#5c6266,#3e4447)" }}>
    <Box x={0} y={600} w={1920} h={480} z={0} style={{ background: "linear-gradient(180deg,#8a8a82,#6c6c66)", borderTop: "14px solid #9b9b93" }} />
    {v === 0 && Array.from({ length: 8 }, (_, i) => <div key={i} style={{ position: "absolute", left: ((t * 900 + i * 260) % 2200) - 200, top: 380 + (i % 4) * 50, width: 300, height: 26, borderRadius: 13, background: "rgba(143,193,221,0.65)" }} />)}
    {grains}
    <Tx x={960} y={80} s={68} c="#fff" wt={900}>{v === 0 ? "WET: IT WASHES RIGHT PAST" : "DRY: IT LANDS AND STICKS"}</Tx>
    <Rubber t={t} at={1.6} x={1520} y={260} text={v === 0 ? "WASTED" : "WORKING"} c={v === 0 ? K.red : K.green} />
  </Stage></F>);
};

// ── SIEVE: un colador de malla sobre la taza: la sal fina cae en cortina por los agujeros
export const sieve: H = ({ dur }) => {
  const t = useT(), shake = Math.sin(t * 22) * 6 * (t > 0.4 ? 1 : 0);
  return (<F dur={dur}><Stage rx={8} ry={Math.sin(t * 0.3) * 8} bg={PALEWOOD}>
    <div style={{ position: "absolute", left: 660 + shake, top: 200, width: 600, height: 300, borderRadius: "0 0 300px 300px", background: "repeating-linear-gradient(0deg, rgba(60,60,60,0.7) 0 2px, transparent 2px 9px), repeating-linear-gradient(90deg, rgba(60,60,60,0.7) 0 2px, transparent 2px 9px), rgba(220,220,215,0.4)", border: "10px solid #9aa3a8" }} />
    <Box x={1250 + shake} y={240} w={380} h={36} z={0} style={{ ...STEEL, borderRadius: 18 }} />
    {Array.from({ length: 70 }, (_, i) => { const ph = ((t * 0.9 + i / 70) % 1); return t > 0.4 ? <div key={i} style={{ position: "absolute", left: 780 + (i * 53) % 360, top: 500 + ph * 260, width: 6, height: 6, background: "#ffffff", opacity: 0.9 }} /> : null; })}
    <Box x={730} y={740} w={460} h={220} z={0} style={{ border: "10px solid rgba(255,255,255,0.9)", borderTop: "none", borderRadius: "0 0 30px 30px" }}>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: lerp(10, 110, pr(t, 0.4, 3)), background: "#dfe3e6" }} />
    </Box>
    <Tx x={960} y={70} s={70} c={K.navy} wt={900}>PLAIN TABLE SALT</Tx>
    <Tx x={1500} y={600} w={500} s={44} c="#2f6fa5" wt={900} o={cl((t - 1) * 3)}>the cheap round box</Tx>
  </Stage></F>);
};

// ── BOX_FLIP: una caja de cartón naranja sin marca gira en 3D sobre la mesada y muestra sus seis caras con lo que importa
export const box_flip: H = ({ dur }) => {
  const t = useT(), ry = lerp(-200, 20, eout(pr(t, 0, 1.6))), W = 340, D = 200, Hh = 480;
  const faceS = (txt: string, c: string): React.CSSProperties => ({ position: "absolute", background: c, ...tg("#fff", 40), display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", boxShadow: "inset 0 0 0 6px rgba(0,0,0,0.12)" });
  return (<F dur={dur}><Stage rx={10} persp={1400} bg={PALEWOOD}>
    <div style={{ position: "absolute", left: 960 - W / 2, top: 300, width: W, height: Hh, transformStyle: "preserve-3d", transform: `rotateY(${ry}deg) rotateX(-8deg)` }}>
      <div style={{ ...faceS("", "#e46a1f"), width: W, height: Hh, transform: `translateZ(${D / 2}px)` }}><div><div style={{ fontSize: 64 }}>BAKING</div><div style={{ fontSize: 64 }}>SODA</div><div style={{ fontSize: 28, marginTop: 20 }}>1 LB</div></div></div>
      <div style={{ ...faceS("", "#d45d18"), width: W, height: Hh, transform: `rotateY(180deg) translateZ(${D / 2}px)` }}>PLAIN</div>
      <div style={{ ...faceS("", "#c95515"), width: D, height: Hh, left: (W - D) / 2, transform: `rotateY(90deg) translateZ(${W / 2}px)`, fontSize: 30 }}>BAKING AISLE</div>
      <div style={{ ...faceS("", "#c95515"), width: D, height: Hh, left: (W - D) / 2, transform: `rotateY(-90deg) translateZ(${W / 2}px)`, fontSize: 30 }}>NOT A CLEANER</div>
      <div style={{ ...faceS("", "#f08a3a"), width: W, height: D, top: (Hh - D) / 2, transform: `rotateX(90deg) translateZ(${Hh / 2}px)` }} />
    </div>
    <Tx x={960} y={70} s={70} c={K.navy} wt={900}>PLAIN BAKING SODA</Tx>
    <Tx x={960} y={880} s={46} c="#2f6fa5" wt={900} o={cl((t - 1.5) * 3)}>the same box you bake with</Tx>
  </Stage></F>);
};

// ── HANDLE_TAPE: manija cruzada de la ducha; una tira de cinta de enmascarar se estira y la cruza; v1 suma el cartelito escrito a mano
export const handle_tape: H = ({ dur, v = 0 }) => {
  const t = useT(), tape = eio(pr(t, 0.3, 1.2)), sign = eout(pr(t, 1.2, 1.8));
  return (<F dur={dur}><Stage rx={6} ry={Math.sin(t * 0.3) * 8} bg={WTILE}>
    <Box x={760} y={300} w={400} h={400} z={0} style={{ borderRadius: 200, background: "radial-gradient(circle at 40% 35%, #ffffff, #b9c1c5 65%, #7d868b)" }} />
    {[0, 90].map((a) => <Box key={a} x={920} y={260} w={80} h={480} z={20} r={a + 20} style={{ borderRadius: 40, background: "linear-gradient(90deg,#9aa3a8,#f3f5f6,#9aa3a8)" }} />)}
    <Box x={700} y={470} w={520 * tape} h={70} z={40} r={-12} style={{ background: "#e9dca5", backgroundImage: "repeating-linear-gradient(90deg, rgba(0,0,0,0.04) 0 2px, transparent 2px 6px)" }} />
    {v === 1 && <Box x={1180} y={560} w={420} h={260} z={60} r={4} o={sign} style={{ ...PAPER, boxShadow: "0 10px 20px rgba(0,0,0,0.3)" }}><div style={{ fontFamily: HAND, fontSize: 64, color: K.red, textAlign: "center", paddingTop: 70 }}>Lenny says no</div></Box>}
    <Tx x={960} y={70} s={66} c={K.navy} wt={900}>{v === 0 ? "A TOWEL, A PIECE OF TAPE, A NOTE" : "THE FOURTH NIGHT"}</Tx>
  </Stage></F>);
};

// ── SHEEP_COUNT: dormitorio de noche; ovejitas de algodón saltan una valla de madera y un contador de horas sube de 0 a 8
export const sheep_count: H = ({ dur }) => {
  const t = useT(), hrs = Math.min(8, Math.floor(t * 2.6));
  return (<F dur={dur}><Stage rx={4} ry={Math.sin(t * 0.3) * 6} bg={NIGHT}>
    <Box x={0} y={760} w={1920} h={320} z={0} style={{ background: "#16202c" }} />
    <Box x={900} y={560} w={120} h={210} z={0} style={{ ...WOOD, boxShadow: "inset 0 40px 0 #6b4a2a, inset 0 -40px 0 #6b4a2a" }} />
    {Array.from({ length: 4 }, (_, i) => { const ph = ((t * 0.6 + i * 0.25) % 1), x = lerp(300, 1620, ph), y = 640 - Math.sin(ph * Math.PI) * 260 * (Math.abs(ph - 0.47) < 0.35 ? 1 : 0.2);
      return <div key={i} style={{ position: "absolute", left: x - 70, top: y - 60, width: 140, height: 90, borderRadius: 45, background: "radial-gradient(circle at 30% 30%, #ffffff, #d9d9d0)", boxShadow: "0 6px 0 rgba(0,0,0,0.2)" }}>
        <div style={{ position: "absolute", right: -26, top: 14, width: 44, height: 40, borderRadius: 18, background: "#2a2a2a" }} />
      </div>; })}
    <Tx x={960} y={110} s={150} c="#ffe1a0" f={SLAB} wt={900}>{hrs} HOURS</Tx>
    <Tx x={960} y={300} s={50} c="#cfd8e3" wt={900}>OF NOBODY RUNNING THAT WATER</Tx>
  </Stage></F>);
};

// ── PIPE_JOIN: dos caños de cobre (ducha y pileta) se unen en una Y debajo del piso; el agua de la pileta llega al cruce y arrastra la taza
export const pipe_join: H = ({ dur }) => {
  const t = useT(), flow = pr(t, 0.6, 2.6);
  const CU: React.CSSProperties = { background: "linear-gradient(90deg,#8a4e1f,#e09a5f,#9a5527)", borderRadius: 30 };
  return (<F dur={dur}><Stage rx={10} ry={Math.sin(t * 0.3) * 8} bg={{ background: "linear-gradient(180deg,#d8cbb2,#b9a98a)" }}>
    <Box x={0} y={200} w={1920} h={40} z={0} style={{ ...WOOD }} />
    <Box x={500} y={240} w={60} h={420} z={0} style={CU} />
    <Box x={1360} y={240} w={60} h={300} z={0} style={CU} />
    <Box x={940} y={520} w={60} h={600} z={0} r={0} style={CU} />
    <div style={{ position: "absolute", left: 530, top: 640, width: 470, height: 60, ...CU, transformOrigin: "0 50%", transform: "rotate(-8deg)" }} />
    <div style={{ position: "absolute", left: 980, top: 520, width: 420, height: 60, ...CU, transformOrigin: "0 50%", transform: "rotate(-5deg)" }} />
    {Array.from({ length: 6 }, (_, i) => { const ph = cl(flow * 1.6 - i * 0.12); return <div key={i} style={{ position: "absolute", left: lerp(1380, 960, ph), top: lerp(540, 900, ph * ph), width: 28, height: 28, borderRadius: 14, background: "#7fc3ef", opacity: ph > 0 && ph < 1 ? 1 : 0 }} />; })}
    {Array.from({ length: 10 }, (_, i) => <div key={i} style={{ position: "absolute", left: 950 + (i * 7) % 40, top: lerp(700, 1080, cl(flow * 1.3 - 0.4)) + (i * 13) % 50, width: 12, height: 12, borderRadius: 6, background: "#f7f5ef" }} />)}
    <Tx x={530} y={160} w={400} s={44} c={K.navy} wt={900}>SHOWER</Tx>
    <Tx x={1390} y={160} w={400} s={44} c={K.navy} wt={900}>SINK</Tx>
    <Tx x={1380} y={860} w={700} s={48} c={K.red} wt={900} o={cl(flow * 2 - 0.6)}>WASHES THE CUP THROUGH</Tx>
  </Stage></F>);
};

// ── WHIRL_TOP: vista cenital del desagüe; v0 2:00 de agua caliente con vapor que sube en anillos; v1 remolino limpio; v2 charco plano que baja lento
export const whirl_top: H = ({ dur, v = 0 }) => {
  const t = useT();
  return (<F dur={dur}><Stage rx={0} ry={0} bg={{ backgroundColor: "#f5f5f1", backgroundImage: "linear-gradient(60deg, rgba(150,150,150,0.4) 2px, transparent 2px), linear-gradient(-60deg, rgba(150,150,150,0.4) 2px, transparent 2px)", backgroundSize: "60px 104px" }}>
    {v === 2 && <div style={{ position: "absolute", left: 960 - 460 * lerp(1, 0.75, pr(t, 0, 4)), top: 560 - 300 * lerp(1, 0.75, pr(t, 0, 4)), width: 920 * lerp(1, 0.75, pr(t, 0, 4)), height: 600 * lerp(1, 0.75, pr(t, 0, 4)), borderRadius: "50%", background: "rgba(150,170,175,0.55)" }} />}
    <div style={{ position: "absolute", left: 800, top: 400, width: 320, height: 320, borderRadius: 160, background: "repeating-radial-gradient(circle, #c9cfd2 0 16px, #3a3f44 16px 24px)", transform: v === 1 ? `rotate(${t * 240}deg)` : undefined }} />
    {v === 1 && Array.from({ length: 3 }, (_, i) => <div key={i} style={{ position: "absolute", left: 960 - (220 - i * 50), top: 560 - (220 - i * 50), width: 2 * (220 - i * 50), height: 2 * (220 - i * 50), borderRadius: "50%", border: "10px solid rgba(110,170,210,0.7)", borderLeftColor: "transparent", borderBottomColor: "transparent", transform: `rotate(${t * (300 + i * 120)}deg)` }} />)}
    {v === 0 && Array.from({ length: 4 }, (_, i) => { const ph = (t * 0.5 + i / 4) % 1; return <div key={i} style={{ position: "absolute", left: 960 - 200 - ph * 300, top: 560 - 200 - ph * 300, width: 400 + ph * 600, height: 400 + ph * 600, borderRadius: "50%", border: "14px solid rgba(255,255,255,0.8)", opacity: 1 - ph }} />; })}
    {v === 0 && <Tx x={960} y={120} s={150} c={K.red} f={SLAB} wt={900}>{`${Math.min(2, Math.floor(t / 1.6))}:${String(Math.floor(((t / 1.6) % 1) * 60)).padStart(2, "0")}`}</Tx>}
    <Tx x={960} y={v === 0 ? 900 : 90} s={64} c={K.navy} wt={900}>{v === 0 ? "AS HOT AS IT GOES · TWO FULL MINUTES" : v === 1 ? "A LITTLE WHIRLPOOL · NO PUDDLE" : "A FLAT PUDDLE: STILL COATED"}</Tx>
  </Stage></F>);
};

// ── HANDLE_STOP: la manija sacada de su lugar muestra el anillo dentado de plástico por dentro; se gira un diente y la aguja llega a HOT
export const handle_stop: H = ({ dur }) => {
  const t = useT(), lift = eio(pr(t, 0.2, 1)), turn = eio(pr(t, 1.4, 2.4));
  return (<F dur={dur}><Stage rx={30} persp={1300} bg={WTILE}>
    <Box x={710} y={280} w={500} h={500} z={0} style={{ borderRadius: 250, background: "radial-gradient(circle at 40% 35%, #ffffff, #b9c1c5 65%, #7d868b)" }} />
    <div style={{ position: "absolute", left: 810, top: 380, width: 300, height: 300, borderRadius: 150, background: `repeating-conic-gradient(from ${turn * 30}deg, #f0f0ea 0 6deg, #c9c9c0 6deg 12deg)`, boxShadow: "inset 0 0 0 40px #e8e2d2" }} />
    <div style={{ position: "absolute", left: 950, top: 400, width: 20, height: 130, background: K.red, borderRadius: 10, transformOrigin: "50% 100%", transform: `rotate(${lerp(-40, 50, turn)}deg)` }} />
    <Box x={710} y={280} w={500} h={500} z={lerp(10, 300, lift)} o={1 - lift * 0.85} style={{ borderRadius: 250, background: "radial-gradient(circle at 40% 35%, #ffffff, #c9cfd2 70%)" }} />
    <Tx x={560} y={500} w={300} s={52} c="#2f6fa5" wt={900}>COLD</Tx>
    <Tx x={1380} y={500} w={300} s={52} c={K.red} wt={900}>HOT</Tx>
    <Tx x={960} y={80} s={60} c={K.navy} wt={900}>A LITTLE STOP INSIDE THE HANDLE</Tx>
  </Stage></F>);
};

// ── GLUG_BOTTLE: botella de vidrio volcada que larga agua a borbotones; burbujas grandes entran en el cuello y la palabra GLUG late con cada una
export const glug_bottle: H = ({ dur }) => {
  const t = useT(), beat = Math.floor(t * 2.2), ph = (t * 2.2) % 1;
  return (<F dur={dur}><Stage rx={6} ry={Math.sin(t * 0.3) * 8} bg={PALEWOOD}>
    <div style={{ position: "absolute", left: 560, top: 300, width: 700, height: 300, transform: "rotate(28deg)" }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: 500, height: 300, borderRadius: 60, background: "rgba(140,190,170,0.35)", border: "10px solid rgba(255,255,255,0.8)", overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: lerp(260, 120, pr(t, 0, 4)), background: "rgba(110,170,210,0.7)" }} />
        {[0, 1].map((k) => <div key={k} style={{ position: "absolute", left: 480 - ((ph + k * 0.5) % 1) * 460, top: 160, width: 70, height: 70, borderRadius: 35, border: "6px solid #fff" }} />)}
      </div>
      <div style={{ position: "absolute", left: 490, top: 100, width: 200, height: 100, background: "rgba(140,190,170,0.35)", border: "10px solid rgba(255,255,255,0.8)", borderRadius: 20 }} />
    </div>
    {[0, 1, 2].map((k) => <div key={k} style={{ position: "absolute", left: 1180 + k * 10, top: 640 + ((t * 300 + k * 80) % 300), width: 40, height: 60, borderRadius: 20, background: "#7fc3ef" }} />)}
    {Array.from({ length: Math.min(4, beat + 1) }, (_, i) => <Tx key={i} x={420 + i * 360} y={820} w={360} s={i === beat % 4 ? lerp(110, 80, ph) : 80} c={K.red} f={SLAB} wt={900}>GLUG</Tx>)}
    <Tx x={960} y={70} s={62} c={K.navy} wt={900}>A COATED DRAIN TALKS</Tx>
  </Stage></F>);
};

// ── MIRROR_TAPE: espejo del baño con una tira de cinta; los segundos se escriben con lápiz graso; v1 tacha 45 y escribe 8; v2/v3 el reloj pulsera y la marca mensual
const MT = ["WRITE THE NUMBER DOWN", "YOU JUST WATCHED IT WORK", "A WRISTWATCH AND A GREASE PENCIL", "EVERY MONTH, TIME IT AGAIN"];
export const mirror_tape: H = ({ dur, v = 0 }) => {
  const t = useT(), w1 = cl((t - 0.4) * 2), w2 = cl((t - 1.4) * 2);
  return (<F dur={dur}><Stage rx={4} ry={Math.sin(t * 0.3) * 8} bg={WTILE}>
    <Box x={420} y={140} w={1080} h={760} z={0} style={{ borderRadius: 20, background: "linear-gradient(135deg,#dfe8ec,#b9c7cd 40%,#e8eff2 60%,#aebcc2)", boxShadow: "0 0 0 18px #c9cfd2, 0 30px 40px rgba(0,0,0,0.3)" }}>
      {v !== 2 && <div style={{ position: "absolute", left: 120, top: 120, width: 520, height: 110, background: "#e9dca5", transform: "rotate(-3deg)", ...(v === 3 ? {} : {}) }}>
        <div style={{ fontFamily: HAND, fontSize: 80, color: "#1d1d1d", paddingLeft: 30, clipPath: `inset(0 ${100 - w1 * 100}% 0 0)` }}>{v === 3 ? "JAN 9 · FEB 8" : "45 sec"}</div>
        {v === 1 && <div style={{ position: "absolute", left: 20, top: 52, width: 260 * w2, height: 8, background: K.red }} />}
      </div>}
      {v === 1 && <div style={{ position: "absolute", left: 640, top: 250, fontFamily: HAND, fontSize: 130, color: K.green, clipPath: `inset(0 ${100 - w2 * 100}% 0 0)` }}>8 sec</div>}
      {v === 2 && <>
        <div style={{ position: "absolute", left: 180, top: 200, width: 320, height: 320, borderRadius: 160, background: "#f6f2e6", boxShadow: "0 0 0 22px #b8933e" }}>
          <div style={{ position: "absolute", left: 155, top: 40, width: 10, height: 120, background: "#1d1d1d", transformOrigin: "50% 100%", transform: `rotate(${t * 60}deg)` }} />
        </div>
        <div style={{ position: "absolute", left: 600, top: 300, fontFamily: HAND, fontSize: 120, color: "#1d1d1d", clipPath: `inset(0 ${100 - w1 * 100}% 0 0)` }}>40 sec</div>
      </>}
      {v === 3 && <div style={{ position: "absolute", left: 140, top: 300, fontFamily: HAND, fontSize: 90, color: "#2f6fa5", clipPath: `inset(0 ${100 - w2 * 100}% 0 0)` }}>MAR 9 · ✓</div>}
    </Box>
    <Tx x={960} y={950} s={56} c={K.navy} wt={900}>{MT[v] ?? MT[0]}</Tx>
  </Stage></F>);
};

// ── BRUSH_DIVE: un cepillo de botella baja al desagüe en corte, sale con mugre y unas líneas onduladas de olor suben de las cerdas
export const brush_dive: H = ({ dur }) => {
  const t = useT(), d = eio(pr(t, 0.1, 0.7)) - eio(pr(t, 0.8, 1.4));
  return (<F dur={dur}><Stage rx={6} ry={-10 + Math.sin(t * 0.3) * 6} bg={WTILE}>
    <Box x={820} y={420} w={280} h={660} z={0} style={{ background: "rgba(215,232,240,0.45)", border: "10px solid rgba(255,255,255,0.85)", borderTop: "none", boxShadow: "inset 26px 0 0 #3d4a2a, inset -26px 0 0 #3d4a2a" }} />
    <div style={{ position: "absolute", left: 950, top: lerp(-200, 380, d), width: 20, height: 500, background: "#9aa3a8" }} />
    <div style={{ position: "absolute", left: 890, top: lerp(-200, 380, d) + 460, width: 140, height: 200, borderRadius: 30, background: `repeating-linear-gradient(0deg, ${t > 0.8 ? "#4a5a3a" : "#f2f2ee"} 0 6px, transparent 6px 10px)` }} />
    {t > 1.3 && [0, 1, 2].map((k) => { const ph = ((t - 1.3) * 0.8 + k / 3) % 1; return <div key={k} style={{ position: "absolute", left: 900 + k * 50, top: 200 - ph * 160, width: 30, height: 120, borderLeft: "8px solid #6a7a3a", borderRadius: "50%", opacity: 1 - ph, transform: `skewY(${Math.sin(t * 4 + k) * 20}deg)` }} />; })}
    <Tx x={960} y={70} s={66} c={K.navy} wt={900}>PULL IT OUT. SMELL THE BRUSH.</Tx>
  </Stage></F>);
};

// ── PADLOCK: dos frascos sin etiqueta sobre la mesada; una cadena de eslabones los une a cada uno y un candado se cierra en el medio
export const padlock: H = ({ dur }) => {
  const t = useT(), close = eout(pr(t, 0.8, 1.2)), ch = eio(pr(t, 0.1, 0.8));
  const jar = (x: number, c: string) => <Box x={x} y={360} w={260} h={420} z={0} style={{ borderRadius: "40px 40px 24px 24px", background: `linear-gradient(90deg, ${c}, #fff 45%, ${c})`, boxShadow: "inset 0 60px 0 #8c9196" }} />;
  return (<F dur={dur}><Stage rx={8} ry={Math.sin(t * 0.3) * 8} bg={PALEWOOD}>
    {jar(420, "#e7c94a")}{jar(1240, "#7fb7e0")}
    {Array.from({ length: 12 }, (_, i) => <div key={i} style={{ position: "absolute", left: 680 + i * 46, top: 560, width: 58, height: 30, borderRadius: 15, border: "8px solid #8c9196", opacity: cl(ch * 12 - i) }} />)}
    <div style={{ position: "absolute", left: 880, top: lerp(500, 470, close), width: 160, height: 120, borderRadius: "80px 80px 0 0", border: "22px solid #9aa3a8", borderBottom: "none" }} />
    <Box x={850} y={560} w={220} h={190} z={10} style={{ borderRadius: 24, background: "linear-gradient(180deg,#e2b04a,#9a7322)" }}><div style={{ margin: "70px auto 0", width: 30, height: 50, borderRadius: 15, background: "#3a2a10" }} /></Box>
    <Tx x={960} y={80} s={78} c={K.red} wt={900}>NEVER MIX TWO CLEANERS</Tx>
  </Stage></F>);
};
