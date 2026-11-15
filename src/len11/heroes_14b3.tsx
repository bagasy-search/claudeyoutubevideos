// Héroes de len14b (ducha) — parte 3. CSS/DOM puro (kit hk14).
import React from "react";
import { H, F, K, SLAB, SANS, HAND, cl, lerp, eio, eout, pr, useT, WOOD, PALEWOOD, PAPER, CORK, STEEL, CHALK, NIGHT, Box, Tx, Stage, Rubber } from "./hk14";

const tg = (c: string = K.ink, s = 40): React.CSSProperties => ({ fontFamily: SANS, fontWeight: 900, fontSize: s, color: c });
const WTILE: React.CSSProperties = { backgroundColor: "#eef0ee", backgroundImage: "linear-gradient(rgba(150,150,150,0.55) 3px, transparent 3px), linear-gradient(90deg, rgba(150,150,150,0.55) 3px, transparent 3px)", backgroundSize: "110px 110px" };
const CHROME = "radial-gradient(circle at 40% 35%, #ffffff, #b9c1c5 60%, #7d868b)";

// ── STOPPER_TRAY: bandeja de herramientas con compartimentos; v0 cuatro tapones de bañera distintos se acomodan en sus huecos; v1 se levanta uno y debajo cuelga el mechón del poste
const ST = ["LIFT-AND-TURN", "PUSH-PULL", "TOE-TOUCH", "TRIP LEVER"];
export const stopper_tray: H = ({ dur, v = 0 }) => {
  const t = useT(), up = eio(pr(t, 0.3, 1.2));
  return (<F dur={dur}><Stage rx={v === 0 ? 46 : 14} persp={1300} bg={WOOD}>
    {v === 0 ? <>
      <Box x={260} y={300} w={1400} h={520} z={0} style={{ background: "#a3241a", borderRadius: 20, boxShadow: "inset 0 0 0 20px #7f1c14" }} />
      {ST.map((s, i) => { const p = eout(pr(t, 0.2 + i * 0.25, 0.6 + i * 0.25));
        return <React.Fragment key={s}>
          <Box x={300 + i * 335} y={340} w={310} h={440} z={0} style={{ background: "#5d140e", borderRadius: 12 }} />
          <Box x={355 + i * 335} y={420} w={200} h={200} z={lerp(260, 20, p)} o={cl(p * 2)} style={{ borderRadius: i === 3 ? 20 : 100, background: CHROME }} />
          <Tx x={455 + i * 335} y={680} w={320} s={32} c="#f3ead6" wt={900} o={p}>{s}</Tx>
        </React.Fragment>; })}
      <Tx x={960} y={110} s={70} c="#fff" wt={900}>A FEW KINDS</Tx>
    </> : <>
      <Box x={760} y={lerp(560, 200, up)} w={400} h={140} z={40} style={{ borderRadius: 70, background: CHROME }} />
      <div style={{ position: "absolute", left: 945, top: lerp(700, 340, up), width: 30, height: 340, background: "#9aa3a8" }}>
        <div style={{ position: "absolute", left: -90, top: 120, width: 210, height: 180 }}>{Array.from({ length: 40 }, (_, i) => <div key={i} style={{ position: "absolute", left: (i * 31) % 190, top: (i * 43) % 170, width: 120, height: 3, background: "#3a2a1c", transform: `rotate(${(i * 67) % 180}deg)` }} />)}</div>
      </div>
      <Box x={600} y={720} w={720} h={60} z={0} style={{ background: "#f2f2ee", borderRadius: 30 }} />
      <Tx x={960} y={70} s={66} c="#fff" wt={900}>HAIR WRAPPED AROUND THE POST</Tx>
    </>}
  </Stage></F>);
};

// ── LINKAGE: la bañera en corte por detrás de la pared: la palanca de rebalse mueve una varilla con un émbolo de bronce; v1 queda bajo; v2 la tuerca se afloja y se acorta ¼"
export const linkage: H = ({ dur, v = 0 }) => {
  const t = useT(), lever = Math.sin(t * 1.6) * (v === 0 ? 1 : 0.6), shorten = v === 2 ? eio(pr(t, 0.8, 2)) : 0;
  const plY = v === 1 ? 700 : lerp(560, 640, (lever + 1) / 2) - shorten * 50;
  return (<F dur={dur}><Stage rx={4} ry={-8 + Math.sin(t * 0.3) * 6} bg={{ background: "linear-gradient(180deg,#d6cdbd,#b8ac97)" }}>
    <Box x={200} y={300} w={600} h={600} z={0} style={{ background: "#f6f4ee", borderRadius: "0 0 60px 60px", boxShadow: "inset 0 -10px 0 #ddd" }} />
    <Box x={800} y={220} w={260} h={860} z={0} style={{ ...WOOD }} />
    <Box x={1060} y={240} w={140} h={820} z={0} style={{ background: "rgba(215,232,240,0.5)", border: "8px solid rgba(255,255,255,0.85)" }} />
    <div style={{ position: "absolute", left: 1000, top: 330, width: 120, height: 40, background: "#c9cfd2", borderRadius: 10, transformOrigin: "0 50%", transform: `rotate(${lever * 20}deg)` }} />
    <div style={{ position: "absolute", left: 1124, top: 360, width: 12, height: plY - 360 - shorten * 0, background: "#9aa3a8" }} />
    {v === 2 && <div style={{ position: "absolute", left: 1106, top: 460, width: 48, height: 36, background: "#b8933e", transform: `rotate(${shorten * 180}deg)` }} />}
    <Box x={1080} y={plY} w={100} h={130} z={0} style={{ borderRadius: 16, background: "linear-gradient(90deg,#8a6424,#e2b04a,#8a6424)" }} />
    <Tx x={1500} y={340} w={600} s={46} c={K.navy} wt={900}>{v === 2 ? "LOOSEN · SHORTEN ¼\" · TIGHTEN" : "THE BRASS PLUNGER"}</Tx>
    {v === 1 && <Rubber t={t} at={1.2} x={1500} y={640} text="SET TOO LOW" c={K.red} s={56} />}
    {v === 0 && <Tx x={1500} y={420} w={600} s={36} c="#6b4a2a" wt={900}>up inside the pipe, behind the wall</Tx>}
  </Stage></F>);
};

// ── CABINET_DOOR: puerta del bajo-mesada pintada que se abre en bisagra 3D: adentro, la cosa número n; una cinta roja la cruza
const CB: [string, string, string][] = [["1", "CHEMICAL DRAIN CLEANER", "#2c6e9e"], ["2", "BAKING SODA + VINEGAR", "#d9d4c4"], ["3", "BOILING WATER", "#9aa3a8"], ["4", "\"DISSOLVES HAIR OVERNIGHT\"", "#7b4aa0"], ["5", "MIXING ANYTHING", "#3a8a4e"]];
export const cabinet_door: H = ({ dur, v = 0 }) => {
  const t = useT(), open = eio(pr(t, 0.2, 1)), x = cl((t - 1.3) * 2), [n, s, c] = CB[v] ?? CB[0];
  return (<F dur={dur}><Stage rx={6} ry={-6} persp={1400} bg={{ background: "linear-gradient(180deg,#e8e2d2,#cfc6b0)" }}>
    <Box x={560} y={220} w={800} h={700} z={0} style={{ background: "#3a2e22", boxShadow: "inset 0 0 0 20px #f4efe4" }}>
      <div style={{ position: "absolute", left: 270, top: 200, width: 260, height: 400, borderRadius: "40px 40px 16px 16px", background: `linear-gradient(90deg, ${c}, #fff 45%, ${c})` }} />
      <div style={{ position: "absolute", left: 120, top: 360, width: 560 * x, height: 60, background: K.red, transform: "rotate(-20deg)", transformOrigin: "0 50%" }} />
    </Box>
    <div style={{ position: "absolute", left: 560, top: 220, width: 800, height: 700, background: "#f4efe4", boxShadow: "inset 0 0 0 30px #e8e0cf", transformOrigin: "0 50%", transform: `rotateY(${-open * 105}deg)` }}>
      <div style={{ position: "absolute", right: 60, top: 320, width: 30, height: 90, borderRadius: 15, background: CHROME }} />
    </div>
    <Tx x={300} y={160} w={300} s={180} c={K.red} f={SLAB} wt={900}>{n}</Tx>
    <Tx x={960} y={960} s={60} c={K.navy} wt={900}>{s}</Tx>
  </Stage></F>);
};

// ── BALANCE_PANS: balanza de dos platos de laboratorio; v0 bicarbonato y vinagre burbujean y quedan nivelados en AGUA SALADA; v1 vinagre vs SOAP SCUM: la balanza ni se mueve
export const balance_pans: H = ({ dur, v = 0 }) => {
  const t = useT(), tilt = v === 0 ? Math.sin(t * 3) * 10 * Math.exp(-t * 0.8) : 0;
  const pan = (side: number, lab: string) => <div style={{ position: "absolute", left: 960 + side * 380 - 170, top: 520 + side * tilt * 8, width: 340 }}>
    <div style={{ margin: "0 auto", width: 4, height: 120, background: "#8c9196" }} />
    <div style={{ width: 340, height: 70, borderRadius: "0 0 170px 170px", background: "linear-gradient(180deg,#e2b04a,#8a6424)" }} />
    <div style={{ ...tg(K.navy, 40), textAlign: "center", marginTop: 20 }}>{lab}</div>
    {v === 0 && t < 2.2 && Array.from({ length: 6 }, (_, i) => { const ph = (t * 1.2 + i / 6) % 1; return <div key={i} style={{ position: "absolute", left: 60 + i * 40, top: 110 - ph * 120, width: 20, height: 20, borderRadius: 10, border: "3px solid #fff", opacity: 1 - ph }} />; })}
  </div>;
  return (<F dur={dur}><Stage rx={6} ry={Math.sin(t * 0.3) * 8} bg={PALEWOOD}>
    <Box x={940} y={360} w={40} h={560} z={0} style={{ ...STEEL }} />
    <Box x={760} y={900} w={400} h={60} z={0} style={{ ...STEEL, borderRadius: 10 }} />
    <div style={{ position: "absolute", left: 580, top: 380, width: 760, height: 20, background: "#9aa3a8", transform: `rotate(${tilt}deg)` }} />
    {pan(-1, v === 0 ? "BAKING SODA" : "VINEGAR")}{pan(1, v === 0 ? "VINEGAR" : "SOAP SCUM + OIL")}
    <Tx x={960} y={80} s={62} c={K.navy} wt={900}>{v === 0 ? "THEY CANCEL OUT" : "IT DOES VERY LITTLE"}</Tx>
    {v === 0 && <Rubber t={t} at={2.4} x={960} y={820} text="= SALTY WATER" c={K.red} s={52} r={-4} />}
  </Stage></F>);
};

// ── MESH_DOME: el colador cae sobre la tapa del desagüe; v0 domo de acero que atrapa pelos al pasar el agua; v1 los dos tipos lado a lado con regla debajo
export const mesh_dome: H = ({ dur, v = 0 }) => {
  const t = useT(), drop = eout(pr(t, 0.1, 0.6));
  const dome = (x: number, steel: boolean, w = 380) => <div style={{ position: "absolute", left: x - w / 2, top: lerp(100, 400, drop), width: w, height: w * 0.55, borderRadius: `${w / 2}px ${w / 2}px 20px 20px`, background: steel ? "repeating-linear-gradient(45deg, rgba(90,95,100,0.9) 0 2px, transparent 2px 9px), repeating-linear-gradient(-45deg, rgba(90,95,100,0.9) 0 2px, transparent 2px 9px), rgba(230,233,235,0.5)" : "radial-gradient(circle, #2a2a2a 7px, transparent 8px) 0 0/34px 34px, #c64b3a", boxShadow: "0 12px 18px rgba(0,0,0,0.3)" }} />;
  return (<F dur={dur}><Stage rx={36} persp={1300} bg={{ backgroundColor: "#f5f5f1", backgroundImage: "linear-gradient(60deg, rgba(150,150,150,0.4) 2px, transparent 2px), linear-gradient(-60deg, rgba(150,150,150,0.4) 2px, transparent 2px)", backgroundSize: "60px 104px" }}>
    {v === 0 ? <>
      <Box x={810} y={520} w={300} h={80} z={0} style={{ borderRadius: 150, background: "#3a3f44" }} />
      {dome(960, true)}
      {t > 0.8 && Array.from({ length: 14 }, (_, i) => <div key={i} style={{ position: "absolute", left: 820 + (i * 23) % 260, top: 420 + (i * 17) % 80, width: 90, height: 3, background: "#3a2a1c", transform: `rotate(${(i * 51) % 180}deg)`, opacity: cl((t - 0.8 - i * 0.08) * 4) }} />)}
      <Tx x={960} y={80} s={78} c={K.navy} wt={900}>A $4 HAIR CATCHER</Tx>
    </> : <>
      {dome(620, true)}{dome(1300, false, 340)}
      <Tx x={620} y={760} w={500} s={44} c={K.navy} wt={900}>STAINLESS DOME</Tx>
      <Tx x={1300} y={760} w={500} s={44} c={K.navy} wt={900}>SOFT RUBBER</Tx>
      <Box x={360} y={880} w={1200} h={80} z={0} style={{ background: "#f2d27a", backgroundImage: "repeating-linear-gradient(90deg, #1d1d1d 0 2px, transparent 2px 40px)", backgroundSize: "40px 30px", backgroundRepeat: "repeat-x" }} />
      <Tx x={960} y={80} s={66} c={K.navy} wt={900}>BOTH WORK · BUY IT A LITTLE WIDER</Tx>
    </>}
  </Stage></F>);
};

// ── ROOM_DOORS: pasillo de hotel con 9 puertas numeradas en perspectiva; en cada una cae un colador y se apaga la lucecita de "service"
export const room_doors: H = ({ dur }) => {
  const t = useT();
  return (<F dur={dur}><Stage rx={0} ry={0} persp={900} bg={{ background: "linear-gradient(180deg,#5a3a2a,#2a1c14)" }}>
    {Array.from({ length: 9 }, (_, i) => { const side = i % 2 ? 1 : -1, depth = Math.floor(i / 2), p = pr(t, 0.3 + i * 0.25, 0.6 + i * 0.25);
      return <div key={i} style={{ position: "absolute", left: 960 + side * 520 - 140, top: 260, width: 280, height: 560, transformOrigin: side < 0 ? "100% 50%" : "0 50%", transform: `translateZ(${-depth * 520}px) rotateY(${side * -70}deg)`, background: "#7a4a2a", boxShadow: "inset 0 0 0 14px #5a3420" }}>
        <div style={{ ...tg("#e2b04a", 70), textAlign: "center", marginTop: 60, fontFamily: SLAB }}>{i + 1}</div>
        <div style={{ margin: "40px auto 0", width: 40, height: 40, borderRadius: 20, background: p > 0.5 ? "#3fd36a" : "#ff5a3c" }} />
        <div style={{ ...tg("#9fd39a", 46), textAlign: "center", marginTop: 20, opacity: p }}>$4 CATCHER</div>
      </div>; })}
    <Tx x={960} y={60} s={62} c="#f3ead6" wt={900}>WICKER PARK · 2012 · NINE ROOMS</Tx>
    <Tx x={960} y={940} s={52} c="#ffe1a0" wt={900} o={cl((t - 1.6) * 2)}>NO CALL FOR OVER A YEAR</Tx>
  </Stage></F>);
};

// ── TRAP_DRY: la U de vidrio con su sello de agua; v0 el agua tapa el paso y el olor rebota; v1 el agua baja día a día y el olor sube; v2 sin agua: SEWER
export const trap_dry: H = ({ dur, v = 0 }) => {
  const t = useT(), lvl = v === 0 ? 1 : v === 1 ? 1 - eio(pr(t, 0.3, 3)) : 0;
  const smell = (on: boolean) => on && [0, 1, 2].map((k) => { const ph = ((t * 0.7 + k / 3) % 1); return <div key={k} style={{ position: "absolute", left: 640 + k * 40, top: 200 - ph * 160, width: 30, height: 120, borderLeft: "8px solid #7f8a3a", borderRadius: "50%", opacity: 1 - ph, transform: `skewY(${Math.sin(t * 4 + k) * 20}deg)` }} />; });
  return (<F dur={dur}><Stage rx={6} ry={Math.sin(t * 0.3) * 8} bg={{ background: "linear-gradient(180deg,#cfd6d8,#a9b3b6)" }}>
    <Box x={560} y={260} w={140} h={420} z={0} style={{ border: "12px solid rgba(255,255,255,0.85)", borderBottom: "none", background: "rgba(220,235,240,0.3)" }} />
    <Box x={560} y={600} w={560} h={300} z={0} style={{ border: "12px solid rgba(255,255,255,0.85)", borderTop: "none", borderRadius: "0 0 280px 280px", background: "rgba(220,235,240,0.3)", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 260 * lvl, background: "rgba(110,170,210,0.75)" }} />
    </Box>
    <Box x={980} y={260} w={140} h={420} z={0} style={{ border: "12px solid rgba(255,255,255,0.85)", borderBottom: "none", background: "rgba(220,235,240,0.3)" }} />
    {v === 0 && <Tx x={1500} y={760} w={600} s={44} c="#2f6fa5" wt={900}>A LITTLE WATER = A SEAL</Tx>}
    {v === 1 && <Tx x={1500} y={760} w={600} s={50} c={K.navy} wt={900}>DAY {1 + Math.floor(pr(t, 0.3, 3) * 20)}</Tx>}
    {smell(lvl < 0.25)}
    {v === 2 && <Rubber t={t} at={0.8} x={1500} y={420} text="ROTTEN EGGS" c={K.red} s={56} />}
    <Tx x={960} y={70} s={60} c={K.navy} wt={900}>{v === 2 ? "SEWER SMELL: THE TRAP WATER IS GONE" : "THE U-SHAPED TRAP"}</Tx>
  </Stage></F>);
};

// ── PIPE_ENDS: los cortes de dos caños vistos de frente, como monedas; v0 el 1½" viejo; v1 aparece el 2" de hoy y se ve el área extra
export const pipe_ends: H = ({ dur, v = 0 }) => {
  const t = useT(), g = eout(pr(t, 0.2, 0.9));
  const end = (x: number, d: number, lab: string, c: string, o = 1) => <>
    <div style={{ position: "absolute", left: x - d / 2, top: 540 - d / 2, width: d, height: d, borderRadius: d / 2, background: "#1d1d1d", boxShadow: `0 0 0 ${d * 0.09}px ${c}, 0 20px 30px rgba(0,0,0,0.4)`, opacity: o, transform: `scale(${g})` }} />
    <Tx x={x} y={540 + d / 2 + 60} w={500} s={60} c={K.navy} f={SLAB} wt={900} o={o}>{lab}</Tx>
  </>;
  return (<F dur={dur}><Stage rx={6} ry={Math.sin(t * 0.3) * 8} bg={PALEWOOD}>
    {end(v === 0 ? 960 : 620, 300, "1½\"", "#9aa3a8")}
    {v === 1 && end(1300, 400, "2\"", "#e8e2d2", cl((t - 0.4) * 3))}
    <Tx x={960} y={80} s={56} c={K.navy} wt={900}>{v === 0 ? "BEFORE THE '70s–'80s: ONE AND A HALF INCHES" : "TODAY'S CODE: TWO INCHES"}</Tx>
    {v === 1 && <Tx x={960} y={970} s={48} c={K.red} wt={900} o={cl((t - 1.2) * 3)}>ALMOST TWICE THE ROOM</Tx>}
  </Stage></F>);
};

// ── CHORE_WHEEL: la rueda de tareas de cartón en la puerta del baño; gira y la flecha fija señala la frecuencia
const CW: [string, string][] = [["EVERY SHOWER", "tissue pinch"], ["EVERY WEEK", "one pull · the stick"], ["ONCE A MONTH", "the cup at bedtime"], ["IF IT'S SLOW", "the cup 2-3 nights + puddle test"]];
export const chore_wheel: H = ({ dur, v = 0 }) => {
  const t = useT(), ang = lerp((v - 1) * 90, v * 90, eio(pr(t, 0.1, 0.9)));
  return (<F dur={dur}><Stage rx={4} ry={Math.sin(t * 0.3) * 8} bg={{ ...WOOD }}>
    <div style={{ position: "absolute", left: 560, top: 140, width: 800, height: 800, borderRadius: 400, transform: `rotate(${-ang}deg)`, background: "conic-gradient(from -45deg, #f2d27a 0 90deg, #a8d4f0 90deg 180deg, #f4b8a0 180deg 270deg, #c7e3b5 270deg 360deg)", boxShadow: "0 0 0 16px #f4ecd9, 0 30px 40px rgba(0,0,0,0.4)" }}>
      {CW.map(([a, b], i) => <div key={a} style={{ position: "absolute", left: 400 - 200, top: 400 - 200, width: 400, height: 400, transform: `rotate(${i * 90}deg)` }}>
        <div style={{ position: "absolute", top: -150, width: 400, textAlign: "center", ...tg(K.navy, 40) }}>{a}</div>
        <div style={{ position: "absolute", top: -95, width: 400, textAlign: "center", fontFamily: HAND, fontSize: 34, color: K.ink }}>{b}</div>
      </div>)}
      <div style={{ position: "absolute", left: 360, top: 360, width: 80, height: 80, borderRadius: 40, background: CHROME }} />
    </div>
    <div style={{ position: "absolute", left: 930, top: 90, width: 60, height: 90, background: K.red, clipPath: "polygon(0 0,100% 0,50% 100%)" }} />
  </Stage></F>);
};

// ── PLUNGER_FLAT: sopapa de copa chata en corte; v0 sella y empuja: la flecha de presión baja; v1 chata vs con faldón; v2 el aire se escapa por el rebalse si no se tapa; v3 vuelve la chata
export const plunger_flat: H = ({ dur, v = 0 }) => {
  const t = useT(), pump = Math.max(0, Math.sin(t * 4)) * (v === 1 || v === 3 ? 0 : 1);
  const cup = (x: number, flange: boolean, lab: string, c: string) => <>
    <div style={{ position: "absolute", left: x - 15, top: 160 + pump * 40, width: 30, height: 420, background: "linear-gradient(90deg,#8a5a2a,#c99a5a,#8a5a2a)" }} />
    <div style={{ position: "absolute", left: x - 170, top: 560 + pump * 40, width: 340, height: 160, borderRadius: "170px 170px 20px 20px", background: "radial-gradient(circle at 40% 30%, #ff7a5c, #a0261a)", transform: `scaleY(${1 - pump * 0.25})` }} />
    {flange && <div style={{ position: "absolute", left: x - 70, top: 700, width: 140, height: 80, borderRadius: "0 0 40px 40px", background: "#8a1e14" }} />}
    <Tx x={x} y={860} w={500} s={46} c={c} wt={900}>{lab}</Tx>
  </>;
  return (<F dur={dur}><Stage rx={6} ry={Math.sin(t * 0.3) * 8} bg={WTILE}>
    {(v === 0 || v === 2) && <Box x={0} y={720} w={1920} h={360} z={0} style={{ background: "rgba(150,175,185,0.6)" }} />}
    {v === 1 ? <>{cup(620, false, "FLAT-BOTTOM CUP", K.green)}{cup(1300, true, "TOILET (FLANGE)", K.red)}</> : cup(960, false, v === 3 ? "SMALL · FLAT-BOTTOM" : "", K.green)}
    {v === 0 && <div style={{ position: "absolute", left: 930, top: 800, width: 60, height: 200 * pump, background: "#2f6fa5", clipPath: "polygon(30% 0,70% 0,70% 70%,100% 70%,50% 100%,0 70%,30% 70%)" }} />}
    {v === 2 && Array.from({ length: 5 }, (_, i) => { const ph = ((t * 1.2 + i / 5) % 1); return <div key={i} style={{ position: "absolute", left: 1480 + i * 10, top: 700 - ph * 500, width: 40, height: 40, borderRadius: 20, border: "5px solid #fff", opacity: 1 - ph }} />; })}
    {v === 2 && <Tx x={1500} y={160} w={600} s={46} c={K.red} wt={900}>AIR OUT THE OVERFLOW</Tx>}
    <Tx x={960} y={70} s={60} c={K.navy} wt={900}>{v === 0 ? "STOPPED? THE PLUNGER, DONE RIGHT" : v === 1 ? "NOT THE TOILET ONE" : v === 2 ? "COVER THE OVERFLOW WITH A WET RAG" : "THE ONE THAT WORKS BETTER THAN ANY POUR"}</Tx>
  </Stage></F>);
};

// ── FRIDGE_NOTES: puerta de heladera blanca con imanes; notas adhesivas amarillas se pegan una a una con "CALL A PLUMBER IF…"
const FN = [["STILL STOPPED", "after hair + plunger"], ["NO CHANGE", "3 nights + puddle test"]];
export const fridge_notes: H = ({ dur, v = 0 }) => {
  const t = useT(), shown = v === 0 ? 1 : 2;
  return (<F dur={dur}><Stage rx={4} ry={Math.sin(t * 0.3) * 8} bg={{ background: "linear-gradient(90deg,#e9ecec,#ffffff 40%,#dfe3e3)" }}>
    <Box x={1700} y={200} w={40} h={600} z={0} style={{ background: CHROME, borderRadius: 20 }} />
    <Tx x={860} y={120} s={60} c={K.navy} wt={900}>CALL A PLUMBER IF…</Tx>
    {FN.slice(0, shown).map(([a, b], i) => { const p = eout(pr(t, (v === 1 && i === 0 ? -1 : 0.2) + i * 0.1, 0.6 + i * 0.1));
      return <Box key={a} x={360 + i * 640} y={300} w={520} h={460} z={lerp(200, 0, p)} r={i ? 3 : -4} o={cl(p * 2)} style={{ background: "#f7e27a", boxShadow: "0 18px 24px rgba(0,0,0,0.25)" }}>
        <div style={{ position: "absolute", left: 230, top: -20, width: 60, height: 60, borderRadius: 30, background: i ? "#2f6fa5" : K.red }} />
        <div style={{ ...tg(K.ink, 56), textAlign: "center", paddingTop: 120 }}>{a}</div>
        <div style={{ fontFamily: HAND, fontSize: 48, color: K.ink, textAlign: "center", marginTop: 30 }}>{b}</div>
      </Box>; })}
  </Stage></F>);
};

// ── PNEUMATIC_TUBE: tubo neumático de banco: la cápsula baja por el caño, se abre y sale la pregunta en un papelito enrollado
const PQ = ["QUESTIONS FROM THE COMMENTS", "WHAT IS THE CUP?", "CAN BAKING SODA CAKE UP IN A PIPE?", "DRAIN PLUNGERS WORK BETTER?", "SAFE ON A SEPTIC TANK?", "THE BATHROOM SINK TOO?", "EVERY NIGHT, TO BE SAFE?", "IT SMELLS LIKE SEWER", "WHY NOT VINEGAR OVERNIGHT?"];
export const pneumatic_tube: H = ({ dur, v = 0 }) => {
  const t = useT(), fall = eio(pr(t, 0.05, 0.6)), roll = eout(pr(t, 0.7, 1.3));
  return (<F dur={dur}><Stage rx={4} ry={Math.sin(t * 0.3) * 8} bg={{ background: "linear-gradient(180deg,#2c3e36,#1a2620)" }}>
    <Box x={300} y={0} w={140} h={760} z={0} style={{ background: "linear-gradient(90deg, rgba(255,255,255,0.15), rgba(255,255,255,0.4) 40%, rgba(255,255,255,0.1))", border: "6px solid rgba(255,255,255,0.5)" }} />
    <Box x={260} y={760} w={220} h={160} z={0} style={{ ...STEEL, borderRadius: 16 }} />
    <div style={{ position: "absolute", left: 320, top: lerp(-260, 560, fall), width: 100, height: 220, borderRadius: 50, background: "linear-gradient(90deg,#8a6424,#e2b04a,#8a6424)", opacity: 1 - roll }} />
    <div style={{ position: "absolute", left: 560, top: 360, width: 1200 * roll, height: 340, overflow: "hidden", ...PAPER, boxShadow: "0 20px 30px rgba(0,0,0,0.4)", borderRight: `${30 * (1 - roll) + 6}px solid #e8dcc0` }}>
      <div style={{ ...tg(K.navy, PQ[v]?.length > 26 ? 60 : 76), width: 1140, textAlign: "center", paddingTop: 120, fontFamily: SLAB, whiteSpace: "nowrap" }}>{PQ[v] ?? PQ[0]}</div>
    </div>
    <Tx x={1160} y={180} s={40} c="#cfe3d6" wt={900} ls={6} o={roll}>{v === 0 ? "YOU ASKED" : `QUESTION ${v}`}</Tx>
  </Stage></F>);
};

// ── PASTE_TRAP: una caja entera cae en la U llena de agua quieta y se vuelve pasta blanca que se asienta en el fondo
export const paste_trap: H = ({ dur }) => {
  const t = useT(), pour = pr(t, 0.2, 1.4), set = eio(pr(t, 1.2, 2.6));
  return (<F dur={dur}><Stage rx={6} ry={Math.sin(t * 0.3) * 8} bg={{ background: "linear-gradient(180deg,#cfd6d8,#a9b3b6)" }}>
    <Box x={700} y={70} w={240} h={300} z={0} r={lerp(0, 135, eio(pr(t, 0, 0.4)))} style={{ background: "#e46a1f", borderRadius: 10 }} />
    {Array.from({ length: 30 }, (_, i) => <div key={i} style={{ position: "absolute", left: 780 + (i * 13) % 60, top: lerp(300, 620, ((t * 1.4 + i / 30) % 1)), width: 10, height: 10, background: "#fbfaf6", opacity: pour > 0 && pour < 1 ? 1 : 0 }} />)}
    <Box x={700} y={360} w={140} h={320} z={0} style={{ border: "12px solid rgba(255,255,255,0.85)", borderBottom: "none", background: "rgba(110,170,210,0.6)" }} />
    <Box x={700} y={600} w={560} h={300} z={0} style={{ border: "12px solid rgba(255,255,255,0.85)", borderTop: "none", borderRadius: "0 0 280px 280px", background: "rgba(110,170,210,0.6)", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 180 * set, background: "#ecebe4", borderRadius: "40% 40% 0 0" }} />
    </Box>
    <Box x={1120} y={360} w={140} h={320} z={0} style={{ border: "12px solid rgba(255,255,255,0.85)", borderBottom: "none", background: "rgba(110,170,210,0.6)" }} />
    <Tx x={960} y={60} s={60} c={K.navy} wt={900}>A WHOLE BOX INTO STANDING WATER</Tx>
    <Rubber t={t} at={2.4} x={1560} y={760} text="WET PASTE" c={K.red} s={56} />
  </Stage></F>);
};

// ── PILL_BOX: pastillero semanal gigante de 31 tapitas (un mes); solo la tapa del día 1 se abre y adentro está la taza
export const pill_box: H = ({ dur }) => {
  const t = useT(), open = eio(pr(t, 0.6, 1.3));
  return (<F dur={dur}><Stage rx={40} persp={1400} bg={PALEWOOD}>
    {Array.from({ length: 31 }, (_, i) => { const x = 220 + (i % 8) * 190, y = 200 + Math.floor(i / 8) * 190, first = i === 0;
      return <div key={i} style={{ position: "absolute", left: x, top: y, width: 170, height: 170, borderRadius: 18, background: first ? "#2f6fa5" : "#a8d4f0", boxShadow: "0 8px 0 rgba(0,0,0,0.2)" }}>
        {first && <div style={{ position: "absolute", left: 35, top: 40, width: 100, height: 90, borderRadius: "0 0 30px 30px", background: "#f7f5ef", boxShadow: "inset 0 30px 0 #dfe3e6" }} />}
        <div style={{ position: "absolute", inset: 0, borderRadius: 18, background: first ? "#4a8ac0" : "#c4e2f5", transformOrigin: "50% 0", transform: first ? `rotateX(${open * 110}deg)` : undefined, ...tg(K.navy, 44), display: "flex", alignItems: "center", justifyContent: "center" }}>{i + 1}</div>
      </div>; })}
    <Tx x={960} y={60} s={66} c={K.navy} wt={900}>ONCE A MONTH IS ENOUGH</Tx>
  </Stage></F>);
};

// ── ROOF_VENT: casa en corte con el caño de ventilación al techo; v0 al vaciar la pileta la U se chupa por falta de aire; v1 el olor vuelve día a día y aparece CALL
export const roof_vent: H = ({ dur, v = 0 }) => {
  const t = useT(), suck = v === 0 ? eio(pr(t, 0.8, 2.2)) : 1;
  return (<F dur={dur}><Stage rx={6} ry={Math.sin(t * 0.3) * 6} bg={{ background: "linear-gradient(180deg,#a8d4f0,#e8f4fb)" }}>
    <Box x={460} y={240} w={1000} h={760} z={0} style={{ background: "#f3e8d2", clipPath: "polygon(50% 0,100% 25%,100% 100%,0 100%,0 25%)", boxShadow: "inset 0 0 0 14px #7a4a2a" }} />
    <Box x={1220} y={80} w={50} h={860} z={10} style={{ background: "#8c9196" }} />
    <div style={{ position: "absolute", left: 1200, top: 70, width: 90, height: 30, background: v === 1 ? "#9a5527" : "#5f666a", opacity: 1 }} />
    {v === 1 && <div style={{ position: "absolute", left: 1185, top: 130, width: 120, height: 80, borderRadius: 30, background: "#6b4a2a" }} />}
    <Box x={700} y={760} w={300} h={120} z={10} style={{ border: "10px solid #8c9196", borderTop: "none", borderRadius: "0 0 150px 150px", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 100 * (1 - suck * 0.9), background: "#7fc3ef" }} />
    </Box>
    {v === 0 && Array.from({ length: 5 }, (_, i) => <div key={i} style={{ position: "absolute", left: lerp(1220, 760, ((t * 0.8 + i / 5) % 1)), top: 880, width: 22, height: 22, borderRadius: 11, background: "#7fc3ef", opacity: t > 0.6 ? 1 : 0 }} />)}
    {suck > 0.8 && [0, 1, 2].map((k) => { const ph = ((t * 0.7 + k / 3) % 1); return <div key={k} style={{ position: "absolute", left: 800 + k * 40, top: 700 - ph * 200, width: 30, height: 120, borderLeft: "8px solid #7f8a3a", borderRadius: "50%", opacity: 1 - ph }} />; })}
    <Tx x={1640} y={140} w={480} s={44} c={K.navy} wt={900}>VENT</Tx>
    <Tx x={960} y={1010} s={52} c={v === 1 ? K.red : K.navy} wt={900}>{v === 0 ? "SOMETHING ELSE DRAINS → THE TRAP GETS SUCKED DRY" : "SMELL KEEPS COMING BACK = A VENT = A CALL"}</Tx>
  </Stage></F>);
};

// ── BKB_TILE: el código QR de la guía armado como pared de azulejos de ducha: los cuadritos negros se colocan fila por fila
const QR: string[] = ["0000000000000000000000000000000", "0111111100110011100110011111110", "0100000100011000100100010000010", "0101110100101000111011010111010", "0101110100101001110000010111010", "0101110100110001111100010111010", "0100000101011100111110010000010", "0111111101010101010101011111110", "0000000000100101001000000000000", "0100101101111011110010101000000", "0010111001001111001101010010010", "0010111110001100001011010011100", "0111010000010010100001001101100", "0010110111110010001001110010110", "0000110011010100001011000000000", "0001111110100001011001011011110", "0110001011101011101111010110100", "0110011101101000011001000000100", "0011001000011110010100111010010", "0100100101001111001100101100110", "0001011001000100111001010000110", "0100010101100100010001111101000", "0000000001010100011001000101110", "0111111100111000001101010100100", "0100000101111101010101000111000", "0101110100111100111001111100000", "0101110101111000011000011111100", "0101110100010011011011100111010", "0100000100100000111111101000100", "0111111101011101101001001010100", "0000000000000000000000000000000"];
export const bkb_tile: H = ({ dur }) => {
  const t = useT(), n = QR.length, sz = Math.floor(760 / n), x0 = 960 - (sz * n) / 2, y0 = 160;
  return (<F dur={dur}><Stage rx={4} ry={Math.sin(t * 0.3) * 6} bg={{ background: "linear-gradient(180deg,#d8dcdc,#b7bdbd)" }}>
    <div style={{ position: "absolute", left: x0 - 40, top: y0 - 40, width: sz * n + 80, height: sz * n + 80, background: "#ffffff", boxShadow: "0 30px 40px rgba(0,0,0,0.3)" }} />
    {QR.map((row, r) => row.split("").map((c, k) => c === "1" ? <div key={`${r}-${k}`} style={{ position: "absolute", left: x0 + k * sz + 1, top: y0 + r * sz + 1, width: sz - 2, height: sz - 2, background: "#1c2430", borderRadius: 2, opacity: cl((t - 0.1 - r * 0.045) * 6), transform: `translateZ(${lerp(80, 0, cl((t - 0.1 - r * 0.045) * 3))}px)` }} /> : null))}
    <Tx x={960} y={y0 + sz * n + 70} s={52} c={K.navy} wt={900} o={cl((t - 1.4) * 3)}>FIRST LINE OF THE DESCRIPTION</Tx>
  </Stage></F>);
};
