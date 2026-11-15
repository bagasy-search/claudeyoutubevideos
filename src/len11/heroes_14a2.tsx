// Héroes de len14a — parte 2. CSS/DOM puro (kit hk14).
import React from "react";
import { AbsoluteFill } from "remotion";
import { H, F, K, SLAB, SANS, HAND, cl, lerp, eio, eout, pr, spr, useT, WOOD, PALEWOOD, TILE, PAPER, CORK, STEEL, PEG, CHALK, CLOTH, NIGHT, Box, Tx, Stage, Card, Pin, Rubber, chain } from "./hk14";

// ── WATER_BILL: la boleta del agua sale de una máquina de escribir de oficina; la columna se tipea y el total se duplica / baja
const BILLS: [string, string, string, string, string][] = [
  ["MRS. K · BERWYN · 1994", "MARCH  $38.20", "APRIL  $41.10", "MAY    $79.60", "DOUBLED"],
  ["A RUNNING TOILET", "1 DAY   200 GAL", "1 WEEK 1,400 GAL", "1 MONTH 6,000 GAL", "EPA WATERSENSE"],
  ["12-FLAT · PILSEN · 2008", "BEFORE  $1,180", "9 FLAPPERS", "AFTER   $640", "ALMOST HALF"],
];
export const water_bill: H = ({ dur, v = 0 }) => {
  const t = useT(), B = BILLS[v] ?? BILLS[0], roll = eio(pr(t, 0.2, 2.4));
  return (<F dur={dur}><Stage rx={22} ry={Math.sin(t * 0.4) * 4} bg={WOOD}>
    <Box x={560} y={120 + (1 - roll) * 360} w={800} h={700} z={0} style={{ ...PAPER, boxShadow: "0 30px 40px rgba(0,0,0,0.4)", borderTop: "14px solid #4f7aa3" }}>
      <div style={{ fontFamily: "Courier New, monospace", fontWeight: 700, fontSize: 40, color: K.ink, padding: "40px 50px", lineHeight: 1.7, whiteSpace: "pre" }}>
        {B.slice(0, 4).map((l, i) => <div key={i} style={{ opacity: cl((t - 0.4 - i * 0.45) * 4), color: i === 3 ? K.red : K.ink }}>{l}</div>)}
      </div>
    </Box>
    <Box x={460} y={760} w={1000} h={260} z={60} style={{ background: "linear-gradient(180deg,#3a3f44,#15181b)", borderRadius: "30px 30px 10px 10px", boxShadow: "0 -10px 30px rgba(0,0,0,0.4)" }}>
      {Array.from({ length: 22 }, (_, i) => <div key={i} style={{ position: "absolute", left: 60 + (i % 11) * 82, top: 60 + Math.floor(i / 11) * 80, width: 56, height: 56, borderRadius: 28, background: "#e9e4d8", border: "4px solid #222", transform: `translateY(${((Math.floor(t * 9) + i * 3) % 11 === 0 && t < 2.4) ? 8 : 0}px)` }} />)}
    </Box>
    <Rubber t={t} at={2.6} x={1250} y={560} text={B[4]} s={v === 1 ? 40 : 56} />
  </Stage></F>);
};

// ── TUB_ROW (dato con fuente real): 200 galones = cinco bañeras de hierro que entran en fila y se llenan
export const tub_row: H = ({ dur }) => {
  const t = useT();
  return (<F dur={dur}><Stage rx={18} ry={-8 + Math.sin(t * 0.3) * 4} bg={TILE}>
    {[0, 1, 2, 3, 4].map((i) => { const p = eout(pr(t, 0.2 + i * 0.3, 0.7 + i * 0.3)), fill = eio(pr(t, 1.4 + i * 0.25, 2.4 + i * 0.25));
      return <Box key={i} x={150 + i * 340} y={420} w={300} h={260} z={lerp(-500, 0, p)} o={p} style={{ background: "linear-gradient(180deg,#ffffff,#d9d6cc)", borderRadius: "30px 30px 120px 120px", boxShadow: "0 30px 30px rgba(0,0,0,0.3)", overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 18, right: 18, bottom: 18, height: 180 * fill, borderRadius: "10px 10px 100px 100px", background: "linear-gradient(180deg,#8fc6e6,#4e8fbf)" }} />
        <div style={{ position: "absolute", bottom: -40, left: 40, width: 36, height: 50, background: "#b08d57", borderRadius: 8 }} /><div style={{ position: "absolute", bottom: -40, right: 40, width: 36, height: 50, background: "#b08d57", borderRadius: 8 }} />
        <div style={{ position: "absolute", top: 90, width: "100%", textAlign: "center", fontFamily: SANS, fontWeight: 900, fontSize: 36, color: K.navy, opacity: fill }}>40 GAL</div>
      </Box>; })}
    <Tx x={960} y={110} s={92} c={K.navy} f={SLAB} wt={900}>~200 GALLONS A DAY</Tx>
    <Tx x={960} y={830} s={40} c={K.ink} wt={700} o={cl((t - 2) * 2)}>a toilet that keeps running · source: EPA WaterSense</Tx>
  </Stage></F>);
};

// ── FOLDING_RULE: metro plegable de carpintero que se despliega por tramos junto al tubo y marca la medida
const RULES: [string, string, number][] = [["1 INCH BELOW THE TOP", "about the width of your thumb", 1], ["2\" OR 3\"?", "measure across the inside of the seat", 3], ["1 INCH ABOVE THE OVERFLOW", "the mark on the new fill valve", 1], ["MEASURE FIRST", "2-inch or 3-inch", 3]];
export const folding_rule: H = ({ dur, v = 0 }) => {
  const t = useT(), [a, b, inch] = RULES[v] ?? RULES[0];
  return (<F dur={dur}><Stage rx={12} ry={Math.sin(t * 0.5) * 6} bg={TILE}>
    <Box x={300} y={430} w={1320} h={120} z={0} style={{ transformStyle: "preserve-3d" }}>
      {Array.from({ length: 6 }, (_, i) => { const p = eout(pr(t, 0.2 + i * 0.22, 0.6 + i * 0.22));
        return <div key={i} style={{ position: "absolute", left: i * 220, top: 0, width: 220, height: 90, background: "linear-gradient(180deg,#f3e2a8,#d9bf6d)", border: "2px solid #8a6b20", transformOrigin: "0 50%", transform: `rotateY(${(1 - p) * (i % 2 ? 170 : -170)}deg)`, opacity: p > 0.02 ? 1 : 0 }}>
          {Array.from({ length: 11 }, (_, k) => <div key={k} style={{ position: "absolute", left: k * 20, top: 0, width: 2, height: k % 4 === 0 ? 40 : 22, background: "#3b2a08" }} />)}
          <div style={{ position: "absolute", left: 8, bottom: 6, fontFamily: SANS, fontWeight: 800, fontSize: 26, color: K.red }}>{i + 1}</div>
        </div>; })}
    </Box>
    <Box x={300} y={350} w={220 * inch / 1} h={30} z={40} o={cl((t - 1.6) * 3)} style={{ borderLeft: `6px solid ${K.red}`, borderRight: `6px solid ${K.red}`, borderBottom: `6px solid ${K.red}` }} />
    <Tx x={960} y={110} s={78} c={K.navy} wt={900}>{a}</Tx>
    <Tx x={960} y={700} s={50} c={K.red} f={SLAB} wt={700} o={cl((t - 1.8) * 2)}>{b}</Tx>
  </Stage></F>);
};

// ── FLOAT_PAIR: dos cajones de muestrario de ferretería con dos tipos de flotador, cada uno en su hueco de espuma
export const float_pair: H = ({ dur }) => {
  const t = useT();
  return (<F dur={dur}><Stage rx={36} persp={1300} bg={WOOD}>
    {["BALL ON AN ARM", "CUP ON THE TOWER"].map((s, i) => { const p = eout(pr(t, 0.3 + i * 0.7, 1 + i * 0.7));
      return <Box key={s} x={240 + i * 760} y={260} w={680} h={560} z={lerp(-200, 0, p)} o={cl(p * 1.5)} style={{ background: "#1f2a35", borderRadius: 14, boxShadow: "inset 0 0 0 18px #6b4a2a, 0 30px 40px rgba(0,0,0,0.4)" }}>
        {i === 0 ? <><div style={{ position: "absolute", left: 90, top: 250, width: 360, height: 22, background: "linear-gradient(180deg,#d9b66a,#8a6424)", borderRadius: 11 }} /><div style={{ position: "absolute", left: 420, top: 170, width: 180, height: 180, borderRadius: 90, background: "radial-gradient(circle at 35% 30%, #f2c28c, #b0612a 70%)" }} /></>
          : <><div style={{ position: "absolute", left: 300, top: 70, width: 80, height: 400, background: "linear-gradient(90deg,#ccc,#fff,#bbb)", borderRadius: 10 }} /><div style={{ position: "absolute", left: 250, top: 250, width: 180, height: 110, background: "linear-gradient(180deg,#f3f3f3,#bdbdbd)", borderRadius: 18 }} /></>}
        <div style={{ position: "absolute", bottom: 26, width: "100%", textAlign: "center", fontFamily: SANS, fontWeight: 900, fontSize: 40, color: K.cream }}>{s}</div>
        <div style={{ position: "absolute", top: 26, width: "100%", textAlign: "center", fontFamily: SLAB, fontWeight: 700, fontSize: 34, color: "#e7c27a" }}>{i ? "the newer kind" : "the old kind"}</div>
      </Box>; })}
    <Tx x={960} y={60} s={66} c={K.cream} wt={900}>TWO KINDS OF FLOAT</Tx>
  </Stage></F>);
};

// ── METRONOME: metrónomo de madera; cada golpe del péndulo dice un paso: ½ INCH · FLUSH · LOOK
export const metronome: H = ({ dur }) => {
  const t = useT(), ang = Math.sin(t * Math.PI * 1.25) * 28, beat = Math.floor(t * 1.25 + 0.5);
  const W3 = ["½ INCH", "FLUSH", "LOOK"];
  return (<F dur={dur}><Stage rx={6} ry={Math.sin(t * 0.4) * 8} bg={{ background: "#e8dfcb" }}>
    <Box x={760} y={220} w={400} h={680} z={0} style={{ ...WOOD, clipPath: "polygon(30% 0, 70% 0, 100% 100%, 0 100%)", boxShadow: "0 30px 40px rgba(0,0,0,0.4)" }} />
    <div style={{ position: "absolute", left: 952, top: 260, width: 16, height: 560, background: "linear-gradient(90deg,#999,#eee,#999)", transformOrigin: "50% 100%", transform: `rotate(${ang}deg)` }}>
      <div style={{ position: "absolute", left: -34, top: 120, width: 84, height: 60, background: "#c9a14a", borderRadius: 8 }} />
    </div>
    {W3.map((w, i) => <Tx key={w} x={i === 1 ? 960 : i === 0 ? 420 : 1500} y={480} w={500} s={84} c={beat % 3 === i ? K.red : "#b9ad93"} wt={900}>{w}</Tx>)}
    <Tx x={960} y={70} s={70} c={K.navy} wt={900}>SMALL MOVES</Tx>
  </Stage></F>);
};

// ── PEGBOARD: tablero perforado del taller; cuelgan tres cadenas en ganchos con su rótulo (v0); v1 la buena con ½" de juego medida con una regla
export const pegboard: H = ({ dur, v = 0 }) => {
  const t = useT();
  const items: [string, number, number][] = v === 0 ? [["TOO TIGHT", 6, 0], ["TOO LONG", 26, 1], ["TANGLED", 14, 2]] : [["½ INCH OF SLACK", 13, 1]];
  return (<F dur={dur}><Stage rx={5} ry={Math.sin(t * 0.45) * 7} bg={PEG}>
    {items.map(([s, n, k], i) => { const x = v === 0 ? 420 + i * 540 : 960, p = spr(t, 0.3 + i * 0.4);
      return <div key={s} style={{ position: "absolute", left: x - 120, top: 180, width: 240, opacity: cl(p), transform: `translateZ(40px) rotate(${Math.sin(t * 2 + i) * 2}deg)`, transformOrigin: "50% 0" }}>
        <div style={{ margin: "0 auto", width: 40, height: 40, borderRadius: 6, background: "#888" }} />
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", transform: k === 2 ? "rotate(18deg)" : undefined }}>{chain(n, 20)}</div>
        {k === 1 && v === 0 && <div style={{ margin: "-30px auto 0", width: 120, height: 60, border: "4px solid #8c9196", borderRadius: 60 }} />}
        <div style={{ marginTop: 20, ...PAPER, padding: "10px 0", textAlign: "center", fontFamily: SANS, fontWeight: 900, fontSize: 36, color: v ? K.green : K.red, border: "2px solid #a68d5d" }}>{s}</div>
      </div>; })}
    {v === 1 && <><Box x={1130} y={430} w={50} h={280} z={60} o={cl((t - 1) * 2)} style={{ background: "linear-gradient(90deg,#f3e2a8,#d9bf6d)", border: "2px solid #8a6b20" }} /><Tx x={1400} y={520} w={400} s={44} c={K.navy} wt={900} o={cl((t - 1.4) * 2)}>2–3 LINKS OF SAG</Tx></>}
    <Tx x={960} y={60} s={66} c={K.navy} wt={900}>{v === 0 ? "THE CHAIN CAN BE WRONG THREE WAYS" : "THE RIGHT SETTING"}</Tx>
  </Stage></F>);
};

// ── PLUMB_BOB: plomada de bronce; v0 el hilo tira en diagonal y la tapa de goma se levanta torcida; v1 el hilo cae a plomo, sella
export const plumb_bob: H = ({ dur, v = 0 }) => {
  const t = useT(), ang = v === 0 ? 24 + Math.sin(t * 2) * 3 : lerp(24, 0, eout(pr(t, 0.3, 1.4))) + Math.sin(t * 3) * Math.exp(-t * 2) * 6;
  return (<F dur={dur}><Stage rx={4} ry={Math.sin(t * 0.4) * 5} bg={TILE}>
    <Box x={940} y={120} w={40} h={40} z={10} style={{ ...STEEL, borderRadius: 20 }} />
    <div style={{ position: "absolute", left: 958, top: 140, width: 4, height: 560, background: "#f5f0e0", transformOrigin: "50% 0", transform: `translateZ(30px) rotate(${ang}deg)` }}>
      <div style={{ position: "absolute", left: -50, top: 540, width: 104, height: 150, background: "linear-gradient(90deg,#9a6d26,#f0cb7a,#9a6d26)", clipPath: "polygon(0 0,100% 0,100% 50%,50% 100%,0 50%)" }} />
    </div>
    <Box x={760} y={880} w={400} h={60} z={0} style={{ background: "#ddd", borderRadius: 10 }} />
    <Box x={740} y={840} w={440} h={50} z={20} style={{ background: "linear-gradient(180deg,#c0392b,#7d1f16)", borderRadius: "50% 50% 12px 12px", transformOrigin: "0 100%", transform: `translateZ(20px) rotate(${v === 0 ? -8 : 0}deg)` }} />
    <Tx x={960} y={40} s={68} c={K.navy} wt={900}>{v === 0 ? "PULLING SIDEWAYS = CROOKED" : "STRAIGHT UP = IT SEALS"}</Tx>
    {v === 1 && <Rubber t={t} at={1.6} x={1460} y={600} text="RIGHT ABOVE" c={K.green} s={48} />}
  </Stage></F>);
};

// ── EGG_TIMER: temporizador de cocina de cuerda; v0 «la mejor prueba gratis» y se le da cuerda; v1 corre 10 minutos con la nota DON'T FLUSH
export const egg_timer: H = ({ dur, v = 0 }) => {
  const t = useT(), wind = v === 0 ? eio(pr(t, 0.3, 1.5)) * 60 : 60 - (t / (dur / 30)) * 20;
  return (<F dur={dur}><Stage rx={14} ry={Math.sin(t * 0.5) * 6} bg={PALEWOOD}>
    <Box x={760} y={300} w={400} h={400} z={0} style={{ borderRadius: 200, background: "radial-gradient(circle at 35% 30%, #fff, #e8e2d2 60%, #b9b2a0)", boxShadow: "0 30px 40px rgba(0,0,0,0.35)" }}>
      <div style={{ position: "absolute", inset: 50, borderRadius: 150, transform: `rotate(${-wind * 6}deg)`, background: "repeating-conic-gradient(#333 0 1deg, transparent 1deg 6deg)", WebkitMaskImage: "radial-gradient(circle, transparent 62%, #000 63%)" }} />
      <div style={{ position: "absolute", left: 190, top: 20, width: 20, height: 60, background: K.red, borderRadius: 4 }} />
      <div style={{ position: "absolute", width: "100%", top: 160, textAlign: "center", fontFamily: SLAB, fontWeight: 900, fontSize: 80, color: K.navy }}>{Math.max(0, Math.round(v === 0 ? wind / 6 : 10 - (t / (dur / 30)) * 3))}′</div>
    </Box>
    {v === 1 && <Card x={1240} y={360} w={420} h={220} z={40} r={5}><Tx x={210} y={30} w={400} s={56} c={K.red} f={HAND} wt={700}>DON'T FLUSH!</Tx><Tx x={210} y={120} w={400} s={40} c={K.navy} f={HAND} wt={700}>back in 10 min</Tx></Card>}
    <Tx x={960} y={80} s={68} c={K.navy} wt={900}>{v === 0 ? "THE BEST FREE TEST IN PLUMBING" : "WAIT ABOUT TEN MINUTES"}</Tx>
  </Stage></F>);
};

// ── WICK_STRIP: una tira de papel de cocina baja al agua de la taza y el color sube por el papel (capilaridad) hasta la línea
export const wick_strip: H = ({ dur }) => {
  const t = useT(), dip = eio(pr(t, 0.2, 1)), wick = eio(pr(t, 1, 3.2));
  return (<F dur={dur}><Stage rx={8} ry={Math.sin(t * 0.4) * 8} bg={TILE}>
    <Box x={0} y={700} w={1920} h={380} z={0} style={{ background: "linear-gradient(180deg,#9ccbe0,#5f9fc2)" }} />
    <Box x={860} y={lerp(80, 300, dip)} w={200} h={620} z={40} style={{ ...CLOTH, backgroundColor: "#fbfaf6", boxShadow: "8px 0 20px rgba(0,0,0,0.2)", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 620 * 0.62 * wick, background: "linear-gradient(0deg, rgba(40,90,200,0.85), rgba(40,90,200,0.35) 80%, rgba(40,90,200,0))" }} />
    </Box>
    <Tx x={960} y={40} s={64} c={K.navy} wt={900}>ANY COLOR IN THE BOWL?</Tx>
    <Tx x={1500} y={420} w={640} s={50} c={K.red} wt={900} o={cl((t - 2.4) * 2)}>→ IT'S GETTING PAST THE FLAPPER</Tx>
  </Stage></F>);
};

// ── ERASER_SMUDGE: una goma de borrar vieja se pasa por un papel y deja negro; al lado, una goma nueva estirada vuelve sola
export const eraser_smudge: H = ({ dur }) => {
  const t = useT(), x = lerp(0, 700, eio(pr(t, 0.3, 1.8)));
  return (<F dur={dur}><Stage rx={30} persp={1300} bg={WOOD}>
    <Box x={260} y={260} w={1400} h={560} z={0} style={{ ...PAPER, boxShadow: "0 30px 40px rgba(0,0,0,0.35)" }}>
      <div style={{ position: "absolute", left: 100, top: 220, width: x, height: 70, background: "linear-gradient(90deg, rgba(20,20,20,0.6), rgba(40,40,40,0.25))", borderRadius: 30 }} />
      <div style={{ position: "absolute", left: 60 + x, top: 180, width: 180, height: 150, background: "linear-gradient(180deg,#d98a8a,#9a4a4a)", borderRadius: 18, transform: `rotate(${Math.sin(t * 12) * 4}deg)` }} />
      <div style={{ position: "absolute", left: 100, top: 40, fontFamily: SANS, fontWeight: 900, fontSize: 44, color: K.red }}>OLD: HARD · LEAVES BLACK</div>
      <div style={{ position: "absolute", right: 80, top: 40, fontFamily: SANS, fontWeight: 900, fontSize: 44, color: K.green, opacity: cl((t - 1.8) * 2) }}>NEW: SOFT · SMOOTH</div>
      <div style={{ position: "absolute", right: 150, top: 260, width: lerp(200, 330, Math.abs(Math.sin(t * 2.2))), height: 50, border: "14px solid #c2913c", borderRadius: 40, opacity: cl((t - 1.8) * 2) }} />
    </Box>
    <Tx x={960} y={80} s={64} c={K.cream} wt={900}>RUB IT BETWEEN YOUR FINGERS</Tx>
  </Stage></F>);
};

// ── SESAME_SEED: macro del borde del asiento; una semilla de sésamo apoyada levanta el borde de la goma y el agua se cuela por la luz
export const sesame_seed: H = ({ dur }) => {
  const t = useT(), lift = eout(pr(t, 0.8, 1.4));
  return (<F dur={dur}><Stage rx={10} ry={Math.sin(t * 0.4) * 6} bg={{ background: "linear-gradient(180deg,#7fb3d4,#4b84ab)" }}>
    <Box x={160} y={620} w={1600} h={260} z={0} style={{ background: "linear-gradient(180deg,#f5f2ea,#cfcabd)", borderRadius: 20 }} />
    <Box x={900} y={570} w={70} h={44} z={20} o={cl(t * 3)} style={{ borderRadius: "50%", background: "radial-gradient(circle at 40% 35%, #fff6dc, #e4c88e 70%)" }} />
    <Box x={160} y={lerp(560, 500, lift)} w={1600} h={80} z={30} style={{ background: "linear-gradient(180deg,#c0392b,#6e1a12)", borderRadius: 20, transformOrigin: "0 100%", transform: `translateZ(30px) rotate(${-lift * 1.2}deg)` }} />
    {[0, 1, 2, 3, 4].map((k) => { const ph = (t * 1.3 + k / 5) % 1; return lift > 0.5 && <div key={k} style={{ position: "absolute", left: 880 + ph * 160, top: 600 + ph * 30, width: 22, height: 14, borderRadius: 7, background: "#dff1ff", opacity: 1 - ph }} />; })}
    <Tx x={960} y={100} s={70} c={K.cream} wt={900}>A BUMP THE SIZE OF A SESAME SEED</Tx>
    <Tx x={960} y={920} s={48} c="#fff2c4" wt={800} o={cl((t - 1.4) * 2)}>is enough to let the water through</Tx>
  </Stage></F>);
};
