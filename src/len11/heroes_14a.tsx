// Héroes de len14a (running toilet, 12 fixes) — parte 1. CSS/DOM puro (kit hk14). Mecanismos en D:/rtmp/len14_COMPONENTES.md.
import React from "react";
import { AbsoluteFill } from "remotion";
import { H, F, K, SLAB, SANS, HAND, cl, lerp, eio, eout, pr, spr, useT, WOOD, PALEWOOD, TILE, PAPER, CORK, STEEL, PEG, CHALK, CLOTH, NIGHT, Box, Tx, Stage, Card, Pin, Rubber, chain } from "./hk14";

// ── TANK_DIORAMA (hilo conductor): caja de sombras de madera con el tanque en capas de papel recortado a distintas profundidades.
// v0 las 4 piezas · v1 por arriba (flotador) · v2 por abajo (cadena/flapper) · v3 en el tanque · v4 las 4 piezas con su trabajo
// v5 el ciclo completo · v6 la respuesta: arriba o abajo · v7 tubo de recarga sifonando · v8 repaso: tapa afuera, mirar
const LBL4: [string, string, number, number][] = [["FILL VALVE", "brings water in", 560, 300], ["OVERFLOW TUBE", "the tall open pipe", 960, 250], ["FLAPPER", "seals the hole", 960, 860], ["CHAIN", "handle to flapper", 1300, 330]];
export const tank_diorama: H = ({ dur, v = 0 }) => {
  const t = useT();
  const sway = Math.sin(t * 0.6) * 6, tilt = 4 + Math.sin(t * 0.4) * 2;
  // nivel de agua (px desde abajo de la caja de 700)
  let lvl = 430, spill = 0, leak = 0, flapUp = 0, chainLift = 0, floatY = 0, siphon = 0;
  if (v === 1) { lvl = lerp(430, 520, eio(pr(t, 0.3, 1.6))); spill = pr(t, 1.4, 1.8); }
  if (v === 2 || v === 6) leak = 1;
  if (v === 5) { const c = t % 6; flapUp = c < 0.6 ? eout(c / 0.6) : c < 2 ? 1 : 1 - eio((c - 2) / 0.5); chainLift = flapUp; lvl = c < 0.6 ? 430 : c < 2 ? lerp(430, 60, eio((c - 0.6) / 1.4)) : lerp(60, 430, eio((c - 2.5) / 3)); }
  if (v === 7) { siphon = 1; lvl = 430 - (t % 3) * 25; }
  floatY = 700 - lvl - 60;
  const showLbl = v === 0 || v === 4;
  const cap = ["FOUR PARTS", "OVER THE TOP", "OUT THE BOTTOM", "IN THE TANK", "THE WHOLE MACHINE", "ONE FLUSH", "WHERE IS THE WATER GOING?", "A SIPHON", "LID OFF · LOOK"][v] ?? "";
  const sub = ["", "→ THE FLOAT IS SET TOO HIGH", "→ THE CHAIN OR THE FLAPPER", "NOT THE WALL · NOT THE FLOOR", "", "HANDLE · ARM · CHAIN · FLAPPER · REFILL", "OVER THE TOP — OR — OUT THE BOTTOM", "THE REFILL TUBE IS BELOW THE WATER", "OVER THE TOP, OR OUT THE BOTTOM"][v] ?? "";
  return (<F dur={dur}><Stage rx={tilt} ry={sway} bg={{ background: "#2a1d12" }}>
    {/* caja de madera */}
    <Box x={360} y={130} w={1200} h={820} z={-60} style={{ ...WOOD, borderRadius: 8, boxShadow: "inset 0 0 0 26px #5a3a1f, inset 0 0 60px #000a" }} />
    {/* fondo: azulejo menta de papel */}
    <Box x={400} y={170} w={1120} h={740} z={-40} style={{ ...TILE, backgroundSize: "80px 80px, 80px 80px, 100% 100%" }} />
    {/* tanque de papel blanco */}
    <Box x={560} y={210} w={800} h={700} z={0} style={{ background: "linear-gradient(90deg,#f2efe6,#fffdf7 40%,#e9e4d6)", borderRadius: "18px 18px 30px 30px", boxShadow: "0 30px 50px rgba(0,0,0,0.45)", overflow: "hidden" }}>
      {/* agua */}
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: lvl, background: "linear-gradient(180deg, rgba(120,180,215,0.75), rgba(70,130,180,0.85))", borderTop: "4px solid rgba(255,255,255,0.8)" }} />
      {/* válvula de llenado */}
      <div style={{ position: "absolute", left: 90, bottom: 40, width: 70, height: 520, background: "linear-gradient(90deg,#ddd,#fafafa,#ccc)", borderRadius: 10 }} />
      <div style={{ position: "absolute", left: 60, bottom: 40 + 700 - floatY - 120, width: 130, height: 90, background: "linear-gradient(180deg,#f7f7f7,#c9c9c9)", borderRadius: 16, transform: `translateY(${0}px)` }} />
      {/* tubo de rebalse */}
      <div style={{ position: "absolute", left: 370, bottom: 120, width: 70, height: 440, background: "linear-gradient(90deg,#d6d6d6,#ffffff,#c4c4c4)", borderRadius: "8px 8px 0 0" }} />
      {spill > 0 && <div style={{ position: "absolute", left: 392, bottom: 130, width: 26, height: 430 * spill, background: "rgba(140,195,230,0.9)" }} />}
      {/* asiento + flapper */}
      <div style={{ position: "absolute", left: 320, bottom: 40, width: 170, height: 40, background: "#e0dcd2", borderRadius: 8 }} />
      <div style={{ position: "absolute", left: 300, bottom: 70, width: 210, height: 46, background: "linear-gradient(180deg,#c0392b,#7d1f16)", borderRadius: "50% 50% 12px 12px", transformOrigin: "0% 100%", transform: `rotate(${-flapUp * 55}deg)` }} />
      {leak > 0 && [0, 1, 2].map((k) => { const ph = ((t * 0.9 + k / 3) % 1); return <div key={k} style={{ position: "absolute", left: 330 + k * 60, bottom: 40 - ph * 40, width: 14, height: 18, borderRadius: "50% 50% 50% 50%", background: "#5fa8d8", opacity: 1 - ph }} />; })}
      {/* cadena y brazo */}
      <div style={{ position: "absolute", left: 470, top: 40, width: 280, height: 22, background: "#bdbdbd", borderRadius: 6, transformOrigin: "100% 50%", transform: `rotate(${chainLift * 14}deg)` }} />
      <div style={{ position: "absolute", left: 480, top: 60 - chainLift * 60, display: "flex", flexDirection: "column", alignItems: "center" }}>{chain(Math.round(22 - chainLift * 4), 14)}</div>
      {/* tubo de recarga */}
      <div style={{ position: "absolute", left: 160, top: 150, width: 240, height: 10, background: "#222", borderRadius: 5, transformOrigin: "0 50%", transform: `rotate(${siphon ? 38 : 8}deg)` }} />
      {siphon > 0 && [0, 1, 2, 3].map((k) => { const ph = (t * 1.2 + k / 4) % 1; return <div key={k} style={{ position: "absolute", left: 400, top: 300 + ph * 260, width: 12, height: 12, borderRadius: 6, background: "#fff", opacity: 0.8 * (1 - ph) }} />; })}
    </Box>
    {/* etiquetas de papel colgando */}
    {showLbl && LBL4.map(([a, b, x, y], i) => { const p = spr(t, 0.4 + i * 0.55); return p > 0.01 && (
      <Card key={a} x={x - 150} y={y - 60} w={300} h={v === 4 ? 120 : 84} z={90} r={-4 + i * 3} o={cl(p)} style={{ transform: `translateZ(90px) rotate(${-4 + i * 3}deg) translateY(${(1 - cl(p)) * -40}px)` }}>
        <Tx x={150} y={14} w={290} s={34} c={K.navy} f={SANS} wt={900}>{a}</Tx>
        {v === 4 && <Tx x={150} y={62} w={290} s={28} c={K.red} f={SLAB} wt={600}>{b}</Tx>}
      </Card>); })}
    {v === 6 && <>
      <Card x={250} y={430} w={320} h={150} z={120} r={-5} o={cl(spr(t, 0.3))}><Tx x={160} y={22} w={300} s={40} c={K.navy}>OVER THE TOP</Tx><Tx x={160} y={80} w={300} s={30} c={K.red} f={SLAB} wt={600}>float</Tx></Card>
      <Card x={1350} y={640} w={340} h={150} z={120} r={4} o={cl(spr(t, 1.0))}><Tx x={170} y={22} w={320} s={40} c={K.navy}>OUT THE BOTTOM</Tx><Tx x={170} y={80} w={320} s={30} c={K.red} f={SLAB} wt={600}>chain · flapper</Tx></Card>
    </>}
    <Tx x={960} y={40} s={70} c={K.cream} f={SANS} wt={900} z={140} ls={3}>{cap}</Tx>
    {sub && <Tx x={960} y={968} s={42} c="#f3d38a" f={SANS} wt={800} z={140} o={cl((t - 0.8) * 2)}>{sub}</Tx>}
  </Stage></F>);
};

// ── ZERO_JAR: tarro de vidrio de las monedas del arreglo; las monedas caen y rebotan afuera: el arreglo no cuesta nada
export const zero_jar: H = ({ dur }) => {
  const t = useT();
  return (<F dur={dur}><Stage rx={6} ry={Math.sin(t * 0.5) * 5} bg={PALEWOOD}>
    <Box x={760} y={300} w={400} h={520} z={0} style={{ borderRadius: "40px 40px 60px 60px", background: "linear-gradient(90deg, rgba(255,255,255,0.35), rgba(255,255,255,0.08) 40%, rgba(255,255,255,0.3))", border: "6px solid rgba(255,255,255,0.7)", boxShadow: "0 30px 40px rgba(0,0,0,0.3)" }} />
    <Box x={780} y={260} w={360} h={60} z={10} style={{ ...STEEL, borderRadius: 10 }} />
    {[0, 1, 2].map((k) => { const a = 0.4 + k * 0.5, p = pr(t, a, a + 0.7); const y = lerp(-80, 240, eio(p)), x = 900 + k * 40 + p * (k - 1) * 260;
      return p > 0 && p < 1 && <Box key={k} x={x} y={y + (p > 0.9 ? -40 : 0)} w={70} h={70} z={30} style={{ borderRadius: 35, background: "radial-gradient(circle at 35% 35%, #fff3c4, #c99a2e 60%, #7a5a14)", boxShadow: "0 6px 8px rgba(0,0,0,0.4)" }} />; })}
    <Tx x={960} y={520} s={150} c={K.green} f={SLAB} wt={900} z={20} o={cl((t - 1.9) * 3)}>$0</Tx>
    <Tx x={960} y={120} s={68} c={K.navy} wt={900}>MOST OF THE TIME</Tx>
    <Tx x={960} y={900} s={52} c={K.ink} wt={800} o={cl((t - 2.2) * 2)}>IT COSTS YOU NOTHING</Tx>
  </Stage></F>);
};

// ── HUNDRED_GRID: pared de 100 azulejos; 99 se dan vuelta y muestran TANK, uno solo queda: WALL/FLOOR
export const hundred_grid: H = ({ dur }) => {
  const t = useT();
  return (<F dur={dur}><Stage rx={10} ry={Math.sin(t * 0.4) * 6} bg={{ background: "#e9e3d4" }}>
    {Array.from({ length: 100 }, (_, i) => { const r = Math.floor(i / 10), c = i % 10, last = i === 77; const at = 0.2 + ((r * 7 + c * 3) % 17) * 0.09; const p = last ? 0 : eout(pr(t, at, at + 0.35));
      return <Box key={i} x={560 + c * 82} y={150 + r * 76} w={74} h={68} z={0} style={{ transformStyle: "preserve-3d", transform: `rotateY(${p * 180}deg)`, background: p > 0.5 ? K.navy : "#cfe5da", border: "2px solid #fff", borderRadius: 4 }}>
        {p > 0.5 && <div style={{ transform: "rotateY(180deg)", color: K.cream, fontFamily: SANS, fontWeight: 900, fontSize: 18, textAlign: "center", marginTop: 22 }}>TANK</div>}
        {last && <div style={{ color: K.red, fontFamily: SANS, fontWeight: 900, fontSize: 16, textAlign: "center", marginTop: 24 }}>WALL</div>}
      </Box>; })}
    <Tx x={960} y={40} s={74} c={K.navy} f={SLAB} wt={800}>IF YOU MADE ME GUESS…</Tx>
    <Tx x={960} y={950} s={58} c={K.red} wt={900} o={cl((t - 1.9) * 2)}>99 OUT OF 100: INSIDE THE TANK</Tx>
  </Stage></F>);
};

// ── CARRUSEL: aro de 12 fichas de cartón en un carrusel 3D que gira y se frena en la primera (el listado)
const FIX12 = ["The two-minute look", "Turn the float down", "The chain", "The flapper", "The refill tube", "Clean the fill valve", "The phantom flush", "The loose handle", "The weak flush", "Replace the fill valve", "Leaks outside the tank", "The once-a-year check"];
export const carrusel: H = ({ dur }) => {
  const t = useT(); const rot = -lerp(0, 360 * 1.5, eio(pr(t, 0, Math.min(5, dur / 30 - 0.6))));
  return (<F dur={dur}><Stage rx={-8} bg={{ background: "radial-gradient(ellipse at 50% 60%, #34506e, #101a28)" }}>
    <AbsoluteFill style={{ transformStyle: "preserve-3d", transform: `translateZ(-700px) rotateY(${rot}deg)` }}>
      {FIX12.map((s, i) => (
        <div key={i} style={{ position: "absolute", left: 960 - 170, top: 360, width: 340, height: 420, transform: `rotateY(${i * 30}deg) translateZ(820px)`, ...PAPER, borderRadius: 10, border: "3px solid #c8b896", backfaceVisibility: "hidden" }}>
          <div style={{ fontFamily: SLAB, fontWeight: 900, fontSize: 140, color: K.red, textAlign: "center", marginTop: 20 }}>{i + 1}</div>
          <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 38, color: K.navy, textAlign: "center", padding: "0 20px" }}>{s}</div>
        </div>))}
    </AbsoluteFill>
    <Tx x={960} y={70} s={72} c={K.cream} wt={900} ls={4}>12 FIXES · IN THE ORDER I CHECK THEM</Tx>
  </Stage></F>);
};

// ── DRAWER_PULL: el cajón de la cocina se abre hacia la cámara y adentro está todo el equipo, cada cosa con su etiqueta de cartón
const TOOLS8: [string, string][] = [["OLD TOWEL", "#5b7fa6"], ["FLASHLIGHT", "#333"], ["FOOD COLORING", "#2f6fd1"], ["GREEN SCRUB PAD", "#3f8f4e"], ["PLASTIC CUP", "#d9e4ea"], ["SPONGE", "#e4c34a"], ["WIRE CUTTERS", "#b8322a"], ["PAPER TOWELS", "#f2f2f2"]];
export const drawer_pull: H = ({ dur }) => {
  const t = useT(), open = eout(pr(t, 0.1, 1.1));
  return (<F dur={dur}><Stage rx={32} persp={1400} bg={{ background: "#e9e1cf" }}>
    <Box x={300} y={200} w={1320} h={700} z={lerp(-300, 60, open)} style={{ ...PALEWOOD, borderRadius: 10, boxShadow: "inset 0 0 0 22px #9c7448, 0 40px 60px rgba(0,0,0,0.35)" }}>
      {TOOLS8.map(([s, c], i) => { const p = spr(t, 0.9 + i * 0.22); const x = 70 + (i % 4) * 300, y = 80 + Math.floor(i / 4) * 300;
        return <div key={s} style={{ position: "absolute", left: x, top: y, width: 260, height: 240, opacity: cl(p), transform: `translateZ(${30 * cl(p)}px)` }}>
          <div style={{ width: 200, height: 110, margin: "0 auto", borderRadius: 18, background: c, boxShadow: "0 10px 14px rgba(0,0,0,0.35)" }} />
          <div style={{ marginTop: 18, background: "#f6eedb", border: "2px solid #b99d6b", fontFamily: SANS, fontWeight: 900, fontSize: 28, color: K.navy, textAlign: "center", padding: "8px 4px", transform: `rotate(${(i % 3) - 1}deg)` }}>{s}</div>
        </div>; })}
    </Box>
    <Tx x={960} y={60} s={66} c={K.navy} wt={900}>IT ALL FITS IN ONE KITCHEN DRAWER</Tx>
    <Rubber t={t} at={2.8} x={1500} y={960} text="NO SPECIAL TOOLS" s={44} />
  </Stage></F>);
};

// ── OPEN_FIX (apertura de cada ítem): una chapa de bronce estampada cuelga de un gancho sobre el azulejo y se balancea hasta quedar quieta
export const open_fix: H = ({ dur, v = 1 }) => {
  const t = useT(), sw = Math.exp(-t * 1.6) * Math.cos(t * 6) * 22;
  return (<F dur={dur}><Stage rx={4} ry={Math.sin(t * 0.5) * 4} bg={TILE}>
    <Box x={930} y={120} w={60} h={60} z={10} style={{ ...STEEL, borderRadius: 30 }} />
    <div style={{ position: "absolute", left: 960 - 330, top: 150, width: 660, height: 600, transformOrigin: "50% 0", transform: `translateZ(40px) rotate(${sw}deg)` }}>
      <div style={{ position: "absolute", left: 318, top: 0, width: 24, height: 130, background: "#777", borderRadius: 4 }} />
      <div style={{ position: "absolute", left: 30, top: 120, width: 600, height: 440, borderRadius: 40, background: "linear-gradient(135deg, #e7c27a, #b88a3a 50%, #8a6420)", boxShadow: "0 30px 40px rgba(0,0,0,0.35), inset 0 0 0 10px rgba(255,240,200,0.35)" }}>
        <div style={{ textAlign: "center", fontFamily: SANS, fontWeight: 900, fontSize: 52, color: "#5a3e10", marginTop: 40, letterSpacing: 10 }}>FIX</div>
        <div style={{ textAlign: "center", fontFamily: SLAB, fontWeight: 900, fontSize: 200, color: "#4a320a", lineHeight: 1, textShadow: "0 2px 0 rgba(255,235,190,0.6)" }}>{v}</div>
        <div style={{ textAlign: "center", fontFamily: SANS, fontWeight: 900, fontSize: 40, color: "#4a320a", padding: "0 30px" }}>{FIX12[v - 1]?.toUpperCase()}</div>
      </div>
    </div>
    <Tx x={960} y={930} s={44} c={K.navy} wt={900} o={cl((t - 0.6) * 2)}>{v} / 12</Tx>
  </Stage></F>);
};

// ── CHI_MAP (mapa animado del lugar): mapa de papel doblado sobre la mesa; un alfiler cae en el barrio y un hilo rojo lo une al anterior
const PLACES: Record<number, [string, string, number, number, number, number]> = {
  0: ["TOLEDO, OHIO", "1979", 1500, 640, 520, 380], 1: ["BERWYN", "1994", 640, 560, 960, 470], 2: ["OAK PARK", "2011", 700, 420, 960, 470], 3: ["LOGAN SQUARE", "2015", 900, 330, 960, 470], 4: ["PILSEN", "2008", 1000, 600, 960, 470],
};
export const chi_map: H = ({ dur, v = 0 }) => {
  const t = useT(); const [name, year, x, y, x0, y0] = PLACES[v] ?? PLACES[0]; const drop = spr(t, 0.4);
  const cam = 1 + eio(pr(t, 0.2, 2.5)) * 0.25;
  const dx = x - x0, dy = y - y0, len = Math.hypot(dx, dy) * eio(pr(t, 0.9, 1.8)), ang = Math.atan2(dy, dx) * 180 / Math.PI;
  return (<F dur={dur}><Stage rx={28} ry={-6} bg={WOOD}>
    <AbsoluteFill style={{ transform: `scale(${cam})`, transformOrigin: `${x}px ${y}px`, transformStyle: "preserve-3d" }}>
      <Box x={180} y={120} w={1560} h={840} z={0} style={{ background: "#efe7d2", backgroundImage: "linear-gradient(90deg, rgba(0,0,0,0.06) 1px, transparent 1px), linear-gradient(rgba(0,0,0,0.06) 1px, transparent 1px), linear-gradient(90deg, transparent 49.8%, rgba(0,0,0,0.12) 50%, transparent 50.2%)", backgroundSize: "70px 70px, 70px 70px, 100% 100%", boxShadow: "0 30px 50px rgba(0,0,0,0.4)" }}>
        <div style={{ position: "absolute", right: 0, top: 0, width: 330, height: 840, background: "linear-gradient(90deg,#9cc3dd,#7fb0d0)" }} />
        <div style={{ position: "absolute", right: 60, top: 380, fontFamily: SLAB, fontStyle: "italic", fontSize: 34, color: "#2b5e86", transform: "rotate(-90deg)" }}>Lake Michigan</div>
        {[[200, 200, 700], [100, 470, 900], [500, 80, 640]].map(([a, b, w], i) => <div key={i} style={{ position: "absolute", left: a, top: b, width: w, height: 8, background: "#e0b85a", transform: `rotate(${i * 25 - 10}deg)` }} />)}
      </Box>
      {v !== 0 && <div style={{ position: "absolute", left: x0, top: y0, width: len, height: 5, background: K.red, transformOrigin: "0 50%", transform: `translateZ(20px) rotate(${ang}deg)` }} />}
      {v !== 0 && <Pin x={x0} y={y0} c={K.navy} />}
      <div style={{ position: "absolute", left: x - 14, top: y - 14 - (1 - cl(drop)) * 200, transform: "translateZ(30px)" }}><Pin x={14} y={14} /></div>
      <Card x={x + 30} y={y - 120} w={420} h={110} z={40} r={-3} o={cl(drop)}><Tx x={210} y={12} w={400} s={44} c={K.navy} wt={900}>{name}</Tx><Tx x={210} y={62} w={400} s={34} c={K.red} f={SLAB} wt={700}>{year}</Tx></Card>
    </AbsoluteFill>
  </Stage></F>);
};

// ── MEMO_GUS (recuerdo como objeto): un bordado en punto cruz sobre tela que se borda solo con la frase de Gus
const GUS = "TAKE THE LID OFF BEFORE YOU OPEN YOUR MOUTH";
export const memo_gus: H = ({ dur }) => {
  const t = useT(), n = Math.round(GUS.length * eio(pr(t, 0.3, 2.6)));
  return (<F dur={dur}><Stage rx={8} ry={Math.sin(t * 0.5) * 6} bg={WOOD}>
    <Box x={360} y={200} w={1200} h={640} z={0} style={{ ...CLOTH, borderRadius: 600, boxShadow: "0 0 0 34px #a07a4e, 0 0 0 40px #6b4c2a, 0 40px 60px rgba(0,0,0,0.45)" }}>
      <div style={{ position: "absolute", left: 140, right: 140, top: 190, fontFamily: "Courier New, monospace", fontWeight: 900, fontSize: 64, lineHeight: 1.25, color: K.red, letterSpacing: 6, textAlign: "center", textShadow: "1px 1px 0 #6b1a12" }}>{GUS.slice(0, n)}</div>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 110, textAlign: "center", fontFamily: HAND, fontSize: 40, color: K.navy, opacity: cl((t - 2.8) * 2) }}>— Gus, Toledo, 1979</div>
    </Box>
  </Stage></F>);
};

// ── BATH_SCALE: balanza de baño mecánica: sube la tapa del tanque y la aguja gira; después una bola de bowling, la misma marca
export const bath_scale: H = ({ dur }) => {
  const t = useT(), a = spr(t, 0.4) * 150, b = pr(t, 1.8, 2.2);
  return (<F dur={dur}><Stage rx={34} persp={1300} bg={TILE}>
    <Box x={610} y={300} w={700} h={620} z={0} style={{ background: "linear-gradient(180deg,#f4f4f2,#d6d6d2)", borderRadius: 60, boxShadow: "0 40px 60px rgba(0,0,0,0.35)" }}>
      <div style={{ position: "absolute", left: 230, top: 40, width: 240, height: 120, borderRadius: "120px 120px 0 0", background: "#fffdf2", border: "6px solid #555", overflow: "hidden" }}>
        {Array.from({ length: 13 }, (_, i) => <div key={i} style={{ position: "absolute", left: 117, top: 4, width: 3, height: 22, background: "#333", transformOrigin: "50% 116px", transform: `rotate(${-90 + i * 15}deg)` }} />)}
        <div style={{ position: "absolute", left: 116, top: 14, width: 6, height: 104, background: K.red, transformOrigin: "50% 100%", transform: `rotate(${-90 + a}deg)` }} />
      </div>
      <Box x={110} y={250} w={480} h={150} z={60 * (1 - b)} o={1 - b} style={{ background: "linear-gradient(180deg,#ffffff,#dcd8cc)", borderRadius: 16, boxShadow: "0 18px 20px rgba(0,0,0,0.3)" }} />
      <Box x={240} y={200} w={220} h={220} z={60} o={b} style={{ borderRadius: 110, background: "radial-gradient(circle at 35% 30%, #5d7fb8, #1b2f5a 70%)" }} />
    </Box>
    <Tx x={960} y={70} s={70} c={K.navy} wt={900}>SOLID PORCELAIN</Tx>
    <Tx x={960} y={170} s={48} c={K.red} f={SLAB} wt={700} o={cl((t - 2) * 2)}>as heavy as a bowling ball</Tx>
  </Stage></F>);
};

// ── CASSETTE_DECK: tres casetes rotulados a mano (el oído diagnostica); entra el del sonido y los carretes giran
const TAPES: [string, string][] = [["STEADY HISS", "never stops → float or fill valve"], ["LITTLE TRICKLE", "like a tiny creek → over the top or past the flapper"], ["QUIET… THEN 5 s REFILL", "every 20 minutes → slow leak, the flapper"]];
export const cassette_deck: H = ({ dur, v = 0 }) => {
  const t = useT(), [a, b] = TAPES[v] ?? TAPES[0], ins = eout(pr(t, 0.2, 0.9)), spin = t * 220 * (v === 2 ? (Math.floor(t * 0.7) % 2) : 1);
  return (<F dur={dur}><Stage rx={20} ry={Math.sin(t * 0.4) * 5} bg={PALEWOOD}>
    <Box x={460} y={420} w={1000} h={440} z={0} style={{ ...STEEL, borderRadius: 24, boxShadow: "0 40px 50px rgba(0,0,0,0.4)" }}>
      <div style={{ position: "absolute", left: 200, top: 40, width: 600, height: 300, background: "#1a1a1a", borderRadius: 12 }} />
    </Box>
    <Box x={560} y={lerp(80, 470, ins)} w={800} h={260} z={30} style={{ background: "#2a2a2a", borderRadius: 16, boxShadow: "0 16px 20px rgba(0,0,0,0.45)" }}>
      <div style={{ position: "absolute", left: 30, top: 20, right: 30, height: 80, ...PAPER, borderRadius: 4, fontFamily: HAND, fontSize: 46, color: K.navy, textAlign: "center", lineHeight: "80px" }}>{a}</div>
      {[200, 600].map((x) => <div key={x} style={{ position: "absolute", left: x - 55, top: 120, width: 110, height: 110, borderRadius: 55, background: "repeating-conic-gradient(#ddd 0 20deg, #888 20deg 40deg)", transform: `rotate(${spin}deg)` }} />)}
    </Box>
    <Tx x={960} y={60} s={62} c={K.navy} wt={900}>CLOSE THE DOOR · LISTEN</Tx>
    <Tx x={960} y={920} s={44} c={K.red} f={SLAB} wt={700} o={cl((t - 1) * 2)}>{b}</Tx>
  </Stage></F>);
};
