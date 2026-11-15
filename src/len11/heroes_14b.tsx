// Héroes de len14b (ducha) — parte 1. CSS/DOM puro (kit hk14).
import React from "react";
import { Img, staticFile } from "remotion";
import { H, F, K, SLAB, SANS, HAND, cl, lerp, eio, eout, pr, useT, WOOD, PALEWOOD, TILE, PAPER, CORK, STEEL, CHALK, NIGHT, Box, Tx, Stage, Card, Pin, Rubber } from "./hk14";

const tg = (c: string = K.ink, s = 40): React.CSSProperties => ({ fontFamily: SANS, fontWeight: 900, fontSize: s, color: c });
const WTILE: React.CSSProperties = { backgroundColor: "#eef0ee", backgroundImage: "linear-gradient(rgba(150,150,150,0.55) 3px, transparent 3px), linear-gradient(90deg, rgba(150,150,150,0.55) 3px, transparent 3px)", backgroundSize: "110px 110px" };
const SODA = "#f7f5ef", SALT = "#dfe3e6";

// ── LAYER_CUP: taza medidora de vidrio que se llena con dos capas como arte de arena (bicarbonato abajo, sal arriba)
const CUPT = [["ONE CUP", "dry · straight down the drain"], ["THAT'S THE ONE CUP", "half and half"], ["THE CUP", "mix with a spoon · dry"], ["WHAT IS THE CUP?", "two boxes from the baking aisle"]];
export const layer_cup: H = ({ dur, v = 0 }) => {
  const t = useT(), a = eio(pr(t, 0.2, 1.4)), b = eio(pr(t, 1.3, 2.5)), [h1, h2] = CUPT[v] ?? CUPT[0];
  return (<F dur={dur}><Stage rx={10} ry={Math.sin(t * 0.4) * 12} bg={PALEWOOD}>
    <Box x={720} y={260} w={480} h={600} z={0} style={{ border: "10px solid rgba(255,255,255,0.9)", borderTop: "none", borderRadius: "0 0 40px 40px", background: "rgba(255,255,255,0.15)", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 270 * a, backgroundColor: SODA, backgroundImage: "radial-gradient(circle, rgba(0,0,0,0.06) 1px, transparent 2px)", backgroundSize: "9px 9px" }} />
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 270 * a, height: 270 * b, backgroundColor: SALT, backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.9) 1.5px, transparent 2.5px)", backgroundSize: "7px 7px" }} />
      {[0.25, 0.5, 0.75, 1].map((y) => <div key={y} style={{ position: "absolute", right: 0, width: 90, top: 560 * (1 - y) + 10, borderTop: `5px solid ${K.red}` }} />)}
    </Box>
    <Box x={1200} y={300} w={120} h={260} z={-10} style={{ border: "18px solid rgba(255,255,255,0.85)", borderLeft: "none", borderRadius: "0 80px 80px 0" }} />
    <Tx x={470} y={720} w={460} s={40} c={K.navy} wt={900} o={a}>½ BAKING SODA</Tx>
    <Tx x={470} y={460} w={460} s={40} c={K.navy} wt={900} o={b}>½ TABLE SALT</Tx>
    <Tx x={960} y={70} s={80} c={K.navy} f={SLAB} wt={900}>{h1}</Tx>
    <Tx x={960} y={920} s={48} c={K.red} wt={900} o={cl((t - 2.4) * 2)}>{h2}</Tx>
  </Stage></F>);
};

// ── NIGHT_BOARD: tablero de juego de mesa pintado a mano; un peón avanza por las casillas de la rutina (v1); v0 tres casillas tachadas
const SQ = ["BEDTIME", "HAIR OUT", "THE CUP", "NOBODY", "HOT 2 MIN"];
export const night_board: H = ({ dur, v = 0 }) => {
  const t = useT(), step = v === 1 ? Math.min(4, Math.floor(t * 1.4)) : -1, frac = v === 1 ? eio(cl(t * 1.4 - Math.floor(t * 1.4))) : 0;
  const cells = v === 0 ? ["CHEMICALS", "SNAKE", "PLUMBER"] : SQ;
  const cx = (i: number) => 960 + (i - (cells.length - 1) / 2) * 330;
  return (<F dur={dur}><Stage rx={38} persp={1300} bg={WOOD}>
    <Box x={160} y={240} w={1600} h={640} z={0} style={{ background: "#1f3550", borderRadius: 30, boxShadow: "inset 0 0 0 16px #c9a14a, 0 30px 50px rgba(0,0,0,0.45)" }} />
    {cells.map((c, i) => { const p = eout(pr(t, 0.2 + i * 0.15, 0.6 + i * 0.15));
      return <Box key={c} x={cx(i) - 140} y={430} w={280} h={240} z={10} o={p} style={{ background: i % 2 ? "#f2d27a" : "#f4ecd9", borderRadius: 18, boxShadow: "0 8px 0 rgba(0,0,0,0.25)" }}>
        <div style={{ ...tg(K.navy, 38), textAlign: "center", paddingTop: 90 }}>{c}</div>
        {v === 0 && t > 0.9 + i * 0.35 && <div style={{ position: "absolute", inset: 0, fontFamily: HAND, fontSize: 240, color: K.red, textAlign: "center", lineHeight: "240px" }}>✗</div>}
      </Box>; })}
    {v === 1 && <div style={{ position: "absolute", left: lerp(cx(step), cx(Math.min(4, step + 1)), step < 4 ? frac * 0 : 0) - 40, top: 320 - Math.abs(Math.sin(frac * Math.PI)) * 60, width: 80, height: 130, transform: "translateZ(60px)" }}>
      <div style={{ margin: "0 auto", width: 60, height: 60, borderRadius: 30, background: "radial-gradient(circle at 35% 30%, #ff8a73, #b0261a)" }} />
      <div style={{ margin: "-8px auto 0", width: 80, height: 70, background: "linear-gradient(90deg,#b0261a,#ff6a52,#b0261a)", clipPath: "polygon(30% 0,70% 0,100% 100%,0 100%)" }} />
    </div>}
    <Tx x={960} y={100} s={70} c={K.cream} wt={900}>{v === 0 ? "NO CHEMICALS · NO SNAKE · NO PLUMBER" : "THE WHOLE ROUTINE"}</Tx>
  </Stage></F>);
};

// ── CORE_SAMPLE: una broca hueca saca un testigo cilíndrico del caño y lo apoya: las capas tienen nombre (v0); v1 suma una capa por día
const LAY: [string, string][] = [["MINERALS", "#8c8f8a"], ["SOAP", "#c9c6bb"], ["BODY OIL", "#d8c38a"], ["CONDITIONER", "#b9b0c9"]];
export const core_sample: H = ({ dur, v = 0 }) => {
  const t = useT(), lift = eio(pr(t, 0.2, 1.3)), n = v === 1 ? Math.min(12, Math.floor(t * 4)) : 4;
  return (<F dur={dur}><Stage rx={12} ry={-16 + Math.sin(t * 0.3) * 6} bg={TILE}>
    <Box x={260} y={640} w={1400} h={200} z={0} style={{ background: "linear-gradient(180deg,#9aa0a4,#cfd4d6 40%,#7d8488)", borderRadius: 30 }} />
    <Box x={790} y={lerp(560, 140, lift)} w={340} h={560} z={30} r={lerp(0, -90, eio(pr(t, 1.3, 2)))} style={{ borderRadius: 30, overflow: "hidden", boxShadow: "0 30px 40px rgba(0,0,0,0.35)" }}>
      {(v === 1 ? Array.from({ length: n }, (_, i) => LAY[i % 4]) : LAY).map(([nm, c], i, arr) => <div key={i} style={{ height: 560 / arr.length, background: c, borderBottom: "2px solid rgba(0,0,0,0.15)", ...tg("#2a2a2a", v ? 22 : 36), display: "flex", alignItems: "center", justifyContent: "center" }}>{v ? "" : nm}</div>)}
    </Box>
    <Tx x={960} y={60} s={68} c={K.navy} wt={900}>{v === 0 ? "NOT A PLUG — A COAT" : "A LITTLE EVERY SINGLE DAY"}</Tx>
    {v === 1 && <Tx x={960} y={900} s={60} c={K.red} wt={900}>DAY {n}</Tx>}
  </Stage></F>);
};

// ── CANDLE_PAIR: dos velas de cera en candeleros: la de 15 MIN se consume enseguida, la de 8 HOURS sigue alumbrando
export const candle_pair: H = ({ dur }) => {
  const t = useT(), grow = eout(pr(t, 0, 0.6)), shortH = lerp(300, 60, eio(pr(t, 0.9, 2.6))) * grow, longH = lerp(480, 440, pr(t, 0.9, 4)) * grow;
  const candle = (x: number, h: number, lab: string, on: boolean) => <>
    <Box x={x - 60} y={820 - h} w={120} h={h} z={0} style={{ background: "linear-gradient(90deg,#efe6cf,#fffaf0,#e3d8bb)", borderRadius: "10px 10px 4px 4px" }} />
    {on && <div style={{ position: "absolute", left: x - 22, top: 820 - h - 90 + Math.sin(t * 9) * 3, width: 44, height: 80, borderRadius: "50% 50% 50% 50% / 70% 70% 30% 30%", background: "radial-gradient(ellipse at 50% 70%, #fff6c8, #ffb63c 55%, rgba(255,120,30,0) 75%)" }} />}
    <Box x={x - 130} y={820} w={260} h={50} z={0} style={{ background: "linear-gradient(180deg,#d9b66a,#8a6424)", borderRadius: 25 }} />
    <Tx x={x} y={890} w={560} s={66} c="#ffe1a0" wt={900} o={grow}>{lab}</Tx>
  </>;
  return (<F dur={dur}><Stage rx={4} ry={Math.sin(t * 0.3) * 8} bg={NIGHT}>
    {candle(620, shortH, "15 MINUTES", shortH > 75)}{candle(1300, longH, "8 HOURS", true)}
    <Tx x={960} y={80} s={68} c="#e8eef6" wt={900}>AT NIGHT, NOBODY WASHES IT AWAY</Tx>
  </Stage></F>);
};

// ── DRAIN_TREE: árbol de tiza en pizarra: las ramas terminan en ducha, piletas, bañera e inodoro; el tronco es la cañería principal
const TT = ["SHOWER OR MAIN LINE?", "YOUR DRAINS ARE A TREE", "ONE TRUNK: THE MAIN LINE", "A SLOW TRUNK: NO CUP FIXES IT", "IT BACKS UP INTO THE LOWEST DRAIN"];
export const drain_tree: H = ({ dur, v = 0 }) => {
  const t = useT(), grow = eio(pr(t, 0.1, 1.4));
  const BR: [string, number, number, number][] = [["SHOWER", 460, 330, -38], ["SINK", 760, 230, -14], ["TUB", 1160, 230, 14], ["TOILET", 1460, 330, 38]];
  const back = v === 4 ? eio(pr(t, 0.8, 2.6)) : 0;
  return (<F dur={dur}><Stage rx={4} ry={Math.sin(t * 0.3) * 6} bg={CHALK}>
    <div style={{ position: "absolute", left: 940, top: 520, width: 40, height: 460 * grow, background: v >= 2 ? "#ffd37a" : "#ece8dc", borderRadius: 20, opacity: 0.9 }} />
    {BR.map(([n, x, y, a], i) => { const p = eio(pr(t, 0.4 + i * 0.15, 1.2 + i * 0.15));
      return <React.Fragment key={n}>
        <div style={{ position: "absolute", left: 960, top: 540, width: 560 * p, height: 14, background: "#ece8dc", borderRadius: 7, transformOrigin: "0 50%", transform: `rotate(${180 + a * (x < 960 ? -1 : 1) + (x < 960 ? 0 : -180)}deg)`, opacity: 0.85 }} />
        <div style={{ position: "absolute", left: x - 120, top: y - 50, width: 240, ...tg(i === 0 && (v === 0 || v === 4) ? "#ffd37a" : "#ece8dc", 40), textAlign: "center", fontFamily: HAND, opacity: p }}>{n}</div>
      </React.Fragment>; })}
    {v === 4 && <div style={{ position: "absolute", left: 380, top: 280 + (1 - back) * 260, width: 160, height: 60 * back, background: "rgba(120,170,220,0.7)", borderRadius: 30 }} />}
    {v === 3 && <Rubber t={t} at={1.6} x={960} y={860} text="NO CUP" c={K.red} />}
    <Tx x={960} y={60} s={66} c="#ece8dc" f={HAND} wt={700}>{TT[v] ?? TT[0]}</Tx>
  </Stage></F>);
};

// ── PRICE_TAGS: etiqueta de cartón con ojal colgando de un hilo; se da vuelta y muestra el precio
const PT: [string, string][] = [["THE FIX", "$3"], ["PLASTIC STICK", "≈ $3"], ["ONE CUP", "A FEW DIMES"], ["NEW RUBBER RING", "A FEW $"], ["HAIR CATCHER", "≈ $4"], ["MAIN LINE + CAMERA", "$200 +"]];
export const price_tags: H = ({ dur, v = 0 }) => {
  const t = useT(), flip = eio(pr(t, 0.5, 1.2)), swing = Math.sin(t * 2.4) * 8 * Math.exp(-t * 0.6), [n, p] = PT[v] ?? PT[0];
  const tag = (x: number, front: string, backTxt: string, c: string) => <div style={{ position: "absolute", left: x - 200, top: 140, width: 400, transformOrigin: "50% 0", transform: `rotate(${swing}deg)` }}>
    <div style={{ margin: "0 auto", width: 4, height: 180, background: "#f3eee0" }} />
    <div style={{ position: "relative", width: 400, height: 520, transformStyle: "preserve-3d", transform: `rotateY(${flip * 180}deg)` }}>
      <div style={{ position: "absolute", inset: 0, ...PAPER, backgroundColor: "#e8d6a8", clipPath: "polygon(20% 0,80% 0,100% 15%,100% 100%,0 100%,0 15%)", backfaceVisibility: "hidden", ...tg(K.navy, 46), textAlign: "center", paddingTop: 220 }}>{front}</div>
      <div style={{ position: "absolute", inset: 0, ...PAPER, backgroundColor: "#e8d6a8", clipPath: "polygon(20% 0,80% 0,100% 15%,100% 100%,0 100%,0 15%)", backfaceVisibility: "hidden", transform: "rotateY(180deg)", ...tg(c, backTxt.length > 6 ? 70 : 140), textAlign: "center", paddingTop: 190 }}>{backTxt}</div>
      <div style={{ position: "absolute", left: 180, top: 40, width: 40, height: 40, borderRadius: 20, background: "#2a2a2a", transform: "translateZ(1px)" }} />
    </div>
  </div>;
  return (<F dur={dur}><Stage rx={4} ry={Math.sin(t * 0.3) * 8} bg={WOOD}>
    {v === 0 ? <>{tag(620, n, p, K.green)}{tag(1300, "THE MAIN LINE", "A CALL", K.red)}</> : tag(960, n, p, v === 5 ? K.red : K.green)}
  </Stage></F>);
};

// ── TILE_LAY: doce azulejos blancos se asientan de a uno sobre la mezcla gris, cada uno con su número pintado
export const tile_lay: H = ({ dur }) => {
  const t = useT();
  return (<F dur={dur}><Stage rx={48} persp={1300} bg={{ background: "linear-gradient(180deg,#8d8a83,#6f6c66)" }}>
    {Array.from({ length: 12 }, (_, i) => { const p = eout(pr(t, 0.1 + i * 0.22, 0.45 + i * 0.22));
      return <Box key={i} x={300 + (i % 4) * 340} y={250 + Math.floor(i / 4) * 230} w={310} h={210} z={lerp(260, 0, p)} o={cl(p * 2)} style={{ background: "linear-gradient(135deg,#ffffff,#e6e6e0)", borderRadius: 8, boxShadow: `0 ${lerp(40, 4, p)}px ${lerp(40, 6, p)}px rgba(0,0,0,0.35)` }}>
        <div style={{ fontFamily: SLAB, fontWeight: 900, fontSize: 130, color: "#2f6fa5", textAlign: "center", lineHeight: "210px" }}>{i + 1}</div>
      </Box>; })}
    <Tx x={960} y={40} s={70} c="#fff" wt={900}>TWELVE STEPS · SKIP TO YOURS</Tx>
  </Stage></F>);
};

// ── BKB_FAN: el libro se abre en abanico como un mazo de cartas; la página citada sale del abanico hacia cámara (imagen real)
const BPG = [124, 125, 127, 133, 134, 135, 143, 126, 109, 153, 124];
export const bkb_fan: H = ({ dur, v = 0 }) => {
  const t = useT(), fan = eio(pr(t, 0.1, 0.9)), out = eout(pr(t, 0.9, 1.6)), pg = BPG[v] ?? 124;
  return (<F dur={dur}><Stage rx={14} persp={1500} bg={{ background: "linear-gradient(180deg,#30404f,#18222c)" }}>
    {Array.from({ length: 9 }, (_, i) => <div key={i} style={{ position: "absolute", left: 760, top: 300, width: 400, height: 540, ...PAPER, transformOrigin: "50% 120%", transform: `rotate(${(i - 4) * 9 * fan}deg) translateZ(${i}px)`, boxShadow: "0 4px 10px rgba(0,0,0,0.25)", borderRadius: 4 }} />)}
    <div style={{ position: "absolute", left: 660, top: lerp(300, 120, out), width: 600, height: 780, transform: `translateZ(${out * 200}px) rotate(${lerp(0, -3, out)}deg)`, opacity: cl(out * 3), boxShadow: "0 30px 50px rgba(0,0,0,0.5)", background: "#fff" }}>
      <Img src={staticFile(`len14b/book/p${String(pg).padStart(3, "0")}.jpg`)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }} />
    </div>
    <Box x={1360} y={180} w={260} h={120} z={260} o={cl((t - 1.4) * 3)} style={{ background: "#e2a91e", borderRadius: 10 }}><div style={{ ...tg("#2a1a05", 60), textAlign: "center", paddingTop: 22 }}>p.{pg}</div></Box>
  </Stage></F>);
};

// ── SOAP_BAR: una barra de jabón nueva gira en 3D sobre la jabonera; el número del paso está grabado en relieve y el título cae debajo
const STEPS = ["Why at night", "What's in your drain", "Pull the hair first", "The cup", "All night, nobody showers", "The morning", "The puddle test", "The smell", "The tub stopper", "Never at night", "The $4 catcher", "The routine, and when to call"];
export const soap_bar: H = ({ dur, v = 1 }) => {
  const t = useT(), spin = lerp(-120, 0, eout(pr(t, 0, 1))) + Math.sin(t * 0.8) * 6;
  return (<F dur={dur}><Stage rx={22} persp={1400} bg={WTILE}>
    <Box x={610} y={640} w={700} h={60} z={0} style={{ ...STEEL, borderRadius: 30 }} />
    <div style={{ position: "absolute", left: 710, top: 300, width: 500, height: 340, transformStyle: "preserve-3d", transform: `rotateY(${spin}deg) rotateX(14deg)` }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: 90, background: "radial-gradient(ellipse at 35% 30%, #fffef6, #f1d9c6 60%, #d9b8a0)", boxShadow: "inset 0 -20px 30px rgba(0,0,0,0.12)", transform: "translateZ(40px)" }}>
        <div style={{ fontFamily: SLAB, fontWeight: 900, fontSize: 210, color: "#e7c8b0", textAlign: "center", lineHeight: "340px", textShadow: "-3px -3px 2px rgba(255,255,255,0.9), 4px 4px 4px rgba(120,80,50,0.35)" }}>{v}</div>
      </div>
    </div>
    <Tx x={960} y={110} s={44} c="#2f6fa5" wt={900} ls={8}>STEP {v} OF 12</Tx>
    <Tx x={960} y={790} s={78} c={K.navy} f={SLAB} wt={900} o={cl((t - 0.7) * 3)}>{STEPS[v - 1] ?? ""}</Tx>
  </Stage></F>);
};

// ── PLACE_TICKET: boleto de tren de cartón con el lugar y el año; el guarda lo pica y queda el agujero
const PLC: [string, string, string][] = [["TOLEDO, OHIO", "1979", "MONROE ST · ROOMING HOUSE"], ["ALBANY PARK", "CHICAGO", "A REMODEL"], ["ROGERS PARK", "1998", "THREE DAUGHTERS · ONE BATHROOM"], ["JEFFERSON PARK", "2019", "A RETIRED MAILMAN"]];
export const place_ticket: H = ({ dur, v = 0 }) => {
  const t = useT(), slide = eout(pr(t, 0.1, 0.8)), punch = pr(t, 1.3, 1.45), [a, b, c] = PLC[v] ?? PLC[0];
  return (<F dur={dur}><Stage rx={20} ry={Math.sin(t * 0.3) * 8} bg={CORK}>
    <Box x={lerp(-900, 360, slide)} y={330} w={1200} h={420} z={0} r={-3} style={{ background: "linear-gradient(90deg,#f0e2b6,#f7ecd0)", borderRadius: 18, boxShadow: "0 24px 36px rgba(0,0,0,0.4)", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 240, background: "#b9432f", ...tg("#f7ecd0", 34), writingMode: "vertical-rl", textAlign: "center", padding: 30 }}>ADMIT ONE</div>
      <div style={{ position: "absolute", left: 290, top: 50, ...tg(K.navy, 92), fontFamily: SLAB }}>{a}</div>
      <div style={{ position: "absolute", left: 290, top: 170, ...tg(K.red, 80) }}>{b}</div>
      <div style={{ position: "absolute", left: 290, top: 290, ...tg(K.ink, 40) }}>{c}</div>
      {punch > 0 && <div style={{ position: "absolute", right: 120, top: 160, width: 90 * punch, height: 90 * punch, borderRadius: 45, background: "#b98a55", boxShadow: "inset 0 4px 8px rgba(0,0,0,0.4)" }} />}
    </Box>
    <Pin x={960} y={340} />
  </Stage></F>);
};

// ── HALF_HOUSE: casita de muñecas en corte; v0 de día: canillas abiertas en cada piso lavan el polvo; v1 de noche: ventanas oscuras, el polvo queda
export const half_house: H = ({ dur, v = 0 }) => {
  const t = useT(), night = v === 1;
  return (<F dur={dur}><Stage rx={6} ry={-12 + Math.sin(t * 0.3) * 6} bg={night ? NIGHT : { background: "linear-gradient(180deg,#a8d4f0,#e8f4fb)" }}>
    <Box x={560} y={160} w={800} h={820} z={0} style={{ background: night ? "#3a3530" : "#f3e8d2", clipPath: "polygon(50% 0,100% 22%,100% 100%,0 100%,0 22%)", boxShadow: "inset 0 0 0 14px #7a4a2a" }} />
    {[0, 1].map((fl) => <Box key={fl} x={620} y={420 + fl * 270} w={680} h={10} z={10} style={{ background: "#7a4a2a" }} />)}
    <Box x={1180} y={260} w={30} h={720} z={20} style={{ background: "#8c9196" }} />
    {[0, 1, 2].map((r) => <React.Fragment key={r}>
      {!night && <div style={{ position: "absolute", left: 1100, top: 300 + r * 230, width: 80, height: 16, background: "#8c9196" }}>{[0, 1, 2].map((k) => <div key={k} style={{ position: "absolute", left: 70, top: 16 + ((t * 120 + k * 30) % 90), width: 10, height: 18, borderRadius: 5, background: "#7fc3ef" }} />)}</div>}
      <div style={{ position: "absolute", left: 680, top: 300 + r * 230, width: 160, height: 110, background: night ? "#151a24" : "#ffe9a8", boxShadow: "inset 0 0 0 8px #e9dcc4" }} />
    </React.Fragment>)}
    <div style={{ position: "absolute", left: 1186, top: lerp(880, night ? 880 : 1100, night ? 0 : (t * 0.6) % 1), width: 18, height: 30, borderRadius: 6, background: "#fff", opacity: night ? 1 : 1 - ((t * 0.6) % 1) }} />
    <Tx x={960} y={40} s={68} c={night ? "#e8eef6" : K.navy} wt={900}>{night ? "AT NIGHT, THE HOUSE IS ASLEEP" : "IN THE DAYTIME, SOMEBODY ALWAYS RUNS THE WATER"}</Tx>
  </Stage></F>);
};

// ── BENCH_PIPES: dos tramos de caño sobre el banco a contraluz de una ventana; el de toda la noche deja pasar la luz, el de 15 minutos no
export const bench_pipes: H = ({ dur, v = 0 }) => {
  const t = useT(), clean = v === 0 ? eio(pr(t, 0.4, 2)) : eio(pr(t, 0.4, 2)) * 0.35;
  return (<F dur={dur}><Stage rx={6} ry={Math.sin(t * 0.3) * 6} bg={{ background: "linear-gradient(180deg,#fdf6e0,#d8c9a4)" }}>
    <Box x={0} y={760} w={1920} h={320} z={0} style={{ ...WOOD }} />
    <Box x={660} y={180} w={600} h={600} z={-60} style={{ borderRadius: 300, background: "radial-gradient(circle, #fffbe8 30%, #f4e3b0 70%)" }} />
    <Box x={710} y={230} w={500} h={500} z={0} style={{ borderRadius: 250, background: "linear-gradient(180deg,#9aa0a4,#5f666a)", boxShadow: "0 30px 40px rgba(0,0,0,0.35)" }}>
      <div style={{ position: "absolute", inset: 60, borderRadius: 200, background: `radial-gradient(circle, rgba(255,251,232,${clean}) ${40 + clean * 50}%, #3a3836 ${42 + clean * 52}%)` }} />
    </Box>
    <Tx x={960} y={60} s={66} c={K.navy} wt={900}>{v === 0 ? "ALL NIGHT: IT LET GO IN SHEETS" : "FIFTEEN MINUTES: A LOT STAYED"}</Tx>
    <Rubber t={t} at={2} x={1500} y={480} text={v === 0 ? "OVERNIGHT" : "15 MIN"} c={v === 0 ? K.green : K.red} />
  </Stage></F>);
};

// ── DRAIN_CUT: maqueta de acrílico del desagüe en corte; v0 nido de pelo arriba; v1 baja la capa gris hasta la curva; v2 los dos problemas apilados; v3 el limo de la tapa
export const drain_cut: H = ({ dur, v = 0 }) => {
  const t = useT(), p = eio(pr(t, 0.2, 1.8));
  const hairs = Array.from({ length: 30 }, (_, i) => <div key={i} style={{ position: "absolute", left: 30 + ((i * 37) % 160), top: 20 + ((i * 53) % 120), width: 120, height: 3, background: "#3a2a1c", transform: `rotate(${(i * 47) % 180}deg)`, opacity: v === 1 ? 0.4 : 1 }} />);
  return (<F dur={dur}><Stage rx={6} ry={-10 + Math.sin(t * 0.3) * 8} bg={WTILE}>
    <Box x={0} y={160} w={1920} h={60} z={0} style={{ background: "linear-gradient(180deg,#f2f2ee,#d4d4cc)" }} />
    <Box x={820} y={140} w={280} h={40} z={20} style={{ ...STEEL, borderRadius: 8, background: v === 3 ? "linear-gradient(180deg,#9aa3a8,#4a5a3a)" : undefined }} />
    <Box x={850} y={220} w={220} h={420} z={0} style={{ background: "rgba(220,235,240,0.5)", border: "8px solid rgba(255,255,255,0.8)", overflow: "hidden" }}>
      {(v === 0 || v === 2) && <div style={{ position: "absolute", left: 0, top: 0, width: 220, height: 170, opacity: v === 0 ? p : 1 }}>{hairs}</div>}
      {(v >= 1) && <div style={{ position: "absolute", left: 0, top: v === 3 ? 0 : 170, bottom: 0, width: 30 * (v === 3 ? 1 : p), background: v === 3 ? "#3d4a2a" : "#7f7f78" }} />}
      {(v >= 1) && <div style={{ position: "absolute", right: 0, top: v === 3 ? 0 : 170, bottom: 0, width: 30 * (v === 3 ? 1 : p), background: v === 3 ? "#3d4a2a" : "#7f7f78" }} />}
    </Box>
    <Box x={850} y={640} w={500} h={260} z={0} style={{ border: "8px solid rgba(255,255,255,0.8)", borderTop: "none", borderRadius: "0 0 130px 130px", background: "rgba(150,190,210,0.4)" }}>
      {v >= 1 && v !== 3 && <div style={{ position: "absolute", inset: 0, borderRadius: "0 0 130px 130px", boxShadow: `inset 0 0 0 ${26 * p}px #7f7f78` }} />}
    </Box>
    <Tx x={420} y={300} w={600} s={46} c={K.navy} wt={900} o={v === 0 || v === 2 ? p : 0}>HAIR · LIKE A BIRD'S NEST</Tx>
    <Tx x={1520} y={520} w={600} s={46} c={K.navy} wt={900} o={v === 1 || v === 2 ? p : 0}>SOFT GRAY COAT</Tx>
    <Tx x={1520} y={220} w={600} s={46} c="#3d4a2a" wt={900} o={v === 3 ? p : 0}>SLIME: THE SMELL</Tx>
    {v === 2 && <Tx x={960} y={960} s={56} c={K.red} wt={900}>TWO PROBLEMS, STACKED</Tx>}
  </Stage></F>);
};

// ── ABACUS: ábaco de madera; las cuentas corren: 100 pelos × 4 personas × 365 días
export const abacus: H = ({ dur }) => {
  const t = useT(), rows = [["50–100", "HAIRS A DAY"], ["× 4", "PEOPLE"], ["× 365", "DAYS"], ["73,000+", "A YEAR"]];
  return (<F dur={dur}><Stage rx={10} ry={Math.sin(t * 0.3) * 8} bg={PALEWOOD}>
    <Box x={160} y={180} w={1200} h={720} z={0} style={{ border: "40px solid #6b4a2a", borderRadius: 16, background: "rgba(255,255,255,0.08)" }} />
    {rows.map(([n, l], r) => { const p = eio(pr(t, 0.3 + r * 0.55, 0.9 + r * 0.55));
      return <React.Fragment key={r}>
        <div style={{ position: "absolute", left: 200, top: 300 + r * 160, width: 1120, height: 8, background: "#c9b48a" }} />
        {Array.from({ length: 10 }, (_, k) => <div key={k} style={{ position: "absolute", left: lerp(220 + k * 56, 1240 - (9 - k) * 56 - (r === 3 ? 0 : 300), p * (k < 6 + r ? 1 : 0)), top: 274 + r * 160, width: 52, height: 60, borderRadius: 26, background: r === 3 ? "radial-gradient(circle at 35% 30%, #ff8a73, #a0261a)" : "radial-gradient(circle at 35% 30%, #f3d27a, #a0761a)" }} />)}
        <Tx a="left" x={1400} y={270 + r * 160} w={480} s={r === 3 ? 60 : 50} c={r === 3 ? K.red : K.navy} wt={900} o={p}>{n} {l}</Tx>
      </React.Fragment>; })}
  </Stage></F>);
};

// ── LAZY_SUSAN: bandeja giratoria de cocina con 7 cosas de la ducha; gira y deja al frente el del ranking
const LZ: [string, string][] = [["CONDITIONER", "#b9b0c9"], ["BODY OILS", "#d8c38a"], ["BAR SOAP", "#f1d9c6"], ["SHAVING CREAM", "#e9f0f4"], ["THE DOG", "#b08d57"], ["SAND", "#e4cf9a"], ["BATH BOMBS", "#f2a7c3"]];
export const lazy_susan: H = ({ dur, v = 0 }) => {
  const t = useT(), target = v === 0 ? 0 : v === 1 ? 0 : v === 2 ? 2 : v === 3 ? 3 : v === 4 ? 4 : v === 5 ? 5 : 6;
  const ang = v === 0 ? t * 50 : lerp((target - 1) * (360 / 7), target * (360 / 7), eio(pr(t, 0.1, 1)));
  return (<F dur={dur}><Stage rx={34} persp={1400} bg={WTILE}>
    <div style={{ position: "absolute", left: 960, top: 640, transformStyle: "preserve-3d", transform: "rotateX(70deg)" }}>
      <div style={{ position: "absolute", left: -560, top: -560, width: 1120, height: 1120, borderRadius: 560, ...WOOD, transform: `rotateZ(${-ang}deg)` }} />
    </div>
    <div style={{ position: "absolute", left: 960, top: 520, transformStyle: "preserve-3d", transform: `rotateY(${-ang}deg)` }}>
      {LZ.map(([n, c], i) => <div key={n} style={{ position: "absolute", left: -110, top: -160, width: 220, height: 300, transform: `rotateY(${i * (360 / 7)}deg) translateZ(430px)`, background: `linear-gradient(90deg, ${c}, #fff 45%, ${c})`, borderRadius: "40px 40px 18px 18px", boxShadow: "0 18px 26px rgba(0,0,0,0.3)" }}>
        <div style={{ position: "absolute", top: 110, width: "100%", textAlign: "center", ...tg(K.ink, 28) }}>{i + 1}. {n}</div>
      </div>)}
    </div>
    <Tx x={960} y={950} s={66} c={K.navy} wt={900}>{v === 0 ? "WORST TO LEAST" : `#${target + 1} · ${LZ[target][0]}`}</Tx>
  </Stage></F>);
};

// ── BEAKER: vaso de precipitado con un mechón de pelo; se vuelca el polvo, burbujea, y el pelo sigue entero
export const beaker: H = ({ dur }) => {
  const t = useT(), pour = eio(pr(t, 0.4, 1.4)), fizz = pr(t, 1.2, 2.6);
  return (<F dur={dur}><Stage rx={6} ry={Math.sin(t * 0.4) * 10} bg={{ background: "linear-gradient(180deg,#e8eef0,#c8d2d6)" }}>
    <Box x={760} y={300} w={400} h={560} z={0} style={{ border: "10px solid rgba(255,255,255,0.9)", borderTop: "none", borderRadius: "0 0 30px 30px", background: "rgba(200,225,235,0.35)", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 300, background: "rgba(170,205,220,0.6)" }} />
      {Array.from({ length: 24 }, (_, i) => <div key={i} style={{ position: "absolute", left: 80 + ((i * 41) % 220), top: 330 + ((i * 29) % 160), width: 160, height: 3, background: "#2a1c12", transform: `rotate(${(i * 61) % 180 + Math.sin(t * 2 + i) * 4}deg)` }} />)}
      {fizz > 0 && Array.from({ length: 12 }, (_, i) => { const ph = (t * 0.8 + i / 12) % 1; return <div key={i} style={{ position: "absolute", left: 40 + ((i * 53) % 300), top: 540 - ph * 300, width: 14, height: 14, borderRadius: 7, border: "2px solid #fff", opacity: (1 - ph) * (1 - pr(t, 2.6, 3.2)) }} />; })}
      <div style={{ position: "absolute", left: 0, right: 0, top: 260 - 40 * pour, height: 40 * pour, background: SODA }} />
    </Box>
    {[0, 1, 2, 3, 4].map((k) => <div key={k} style={{ position: "absolute", left: 940 + k * 6, top: lerp(160, 560, ((t * 1.5 + k / 5) % 1)), width: 8, height: 8, borderRadius: 4, background: "#fff", opacity: t < 1.4 ? 1 : 0 }} />)}
    <Tx x={960} y={60} s={66} c={K.navy} wt={900}>NO POWDER DISSOLVES HAIR</Tx>
    <Rubber t={t} at={2.7} x={1460} y={520} text="STILL THERE" c={K.red} s={52} />
  </Stage></F>);
};

// ── SCREW_DROP: el tornillo de la rejilla sale girando; v ok cae en el vaso de papel; la sombra del desagüe espera al lado
export const screw_drop: H = ({ dur }) => {
  const t = useT(), out = eio(pr(t, 0.2, 1)), fall = eio(pr(t, 1.1, 1.7));
  return (<F dur={dur}><Stage rx={44} persp={1300} bg={{ backgroundColor: "#f4f4f0", backgroundImage: "radial-gradient(circle at 50% 50%, transparent 40px, rgba(0,0,0,0) 41px), linear-gradient(60deg, rgba(150,150,150,0.4) 2px, transparent 2px), linear-gradient(-60deg, rgba(150,150,150,0.4) 2px, transparent 2px)", backgroundSize: "100% 100%, 60px 104px, 60px 104px" }}>
    <Box x={560} y={360} w={400} h={400} z={0} style={{ borderRadius: 200, background: "repeating-radial-gradient(circle, #c9cfd2 0 18px, #3a3f44 18px 26px)" }} />
    <div style={{ position: "absolute", left: lerp(740, 1330, fall), top: lerp(lerp(540, 380, out), 520, fall), width: 40, height: 90, background: "repeating-linear-gradient(-20deg,#d9d9d9 0 8px,#8c9196 8px 12px)", borderRadius: "16px 16px 4px 4px", transform: `translateZ(${lerp(20, 120, out) * (1 - fall)}px) rotate(${t * 360 * (1 - fall)}deg)` }} />
    <Box x={1240} y={480} w={220} h={260} z={10} style={{ background: "linear-gradient(90deg,#e8e2d2,#fff,#ddd6c4)", clipPath: "polygon(0 0,100% 0,88% 100%,12% 100%)" }} />
    <Tx x={960} y={60} s={66} c={K.navy} wt={900}>THE SCREW GOES IN THE CUP</Tx>
    <Tx x={760} y={820} w={600} s={42} c={K.red} wt={900}>not down the drain</Tx>
  </Stage></F>);
};
