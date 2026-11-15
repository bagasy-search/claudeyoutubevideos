// HÃ©roes de len14a â€” parte 3. CSS/DOM puro (kit hk14).
import React from "react";
import { Img, staticFile } from "remotion";
import { H, F, K, SLAB, SANS, HAND, cl, lerp, eio, eout, pr, spr, useT, WOOD, PALEWOOD, TILE, PAPER, CORK, STEEL, PEG, CHALK, CLOTH, NIGHT, Box, Tx, Stage, Card, Pin, Rubber } from "./hk14";

const tag = (c: string = K.ink, s = 40): React.CSSProperties => ({ fontFamily: SANS, fontWeight: 900, fontSize: s, color: c });

// â”€â”€ RECEIPT_SPIKE: pinche de mostrador; caen tres tickets de flapper (2011) y se ensartan uno sobre otro
export const receipt_spike: H = ({ dur }) => {
  const t = useT();
  return (<F dur={dur}><Stage rx={20} ry={Math.sin(t * 0.4) * 6} bg={WOOD}>
    <Box x={930} y={240} w={16} h={560} z={0} style={{ background: "linear-gradient(90deg,#777,#eee,#777)", borderRadius: "8px 8px 0 0" }} />
    <Box x={820} y={780} w={240} h={50} z={0} style={{ ...STEEL, borderRadius: 25 }} />
    {["FEB", "JUN", "OCT"].map((m, i) => { const p = eout(pr(t, 0.3 + i * 0.6, 0.8 + i * 0.6));
      return <Card key={m} x={790} y={lerp(-500, 520 - i * 70, p)} w={300} h={360} r={(i - 1) * 7} z={10 + i * 4}>
        <div style={{ fontFamily: "Courier New, monospace", fontWeight: 700, fontSize: 30, color: K.ink, padding: 24, lineHeight: 1.5 }}>OAK PARK HDW<br />{m} 2011<br />1 FLAPPER<br /><span style={{ color: K.red }}>$7.98</span></div>
      </Card>; })}
    <Tx x={960} y={60} s={78} c={K.cream} f={SLAB} wt={900}>THREE FLAPPERS IN ONE YEAR</Tx>
  </Stage></F>);
};

// â”€â”€ DRIP_DIVE: corte del tubo de rebalse; el tubito de relleno se mete adentro (DIVE âœ—) y luego sube y queda goteando por encima (DRIP âœ“)
export const drip_dive: H = ({ dur }) => {
  const t = useT(), up = eio(pr(t, 1.6, 2.4)), tipY = lerp(560, 330, up);
  return (<F dur={dur}><Stage rx={6} ry={Math.sin(t * 0.4) * 6} bg={{ background: "linear-gradient(180deg,#cfe6f0,#8fbfd8)" }}>
    <Box x={860} y={340} w={200} h={680} z={0} style={{ background: "linear-gradient(90deg,#d9d9d9,#fff,#c9c9c9)", borderRadius: "10px 10px 0 0" }}>
      <div style={{ position: "absolute", left: 30, right: 30, top: 0, bottom: 0, background: "#3a5a6e", opacity: 0.25 }} />
    </Box>
    <div style={{ position: "absolute", left: 360, top: 300, width: 600, height: 26, background: "#222", borderRadius: 13, transformOrigin: "0 50%", transform: `rotate(${lerp(18, 3, up)}deg)` }} />
    <div style={{ position: "absolute", left: 940, top: tipY, width: 26, height: 80, background: "#222", borderRadius: 13 }} />
    {up > 0.9 && [0, 1, 2].map((k) => { const ph = (t * 1.6 + k / 3) % 1; return <div key={k} style={{ position: "absolute", left: 944, top: tipY + 80 + ph * 140, width: 18, height: 24, borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%", background: "#e4f4ff", opacity: 1 - ph }} />; })}
    <Rubber t={t} at={0.6} x={600} y={620} text="DIVE âœ—" c={K.red} />
    <Rubber t={t} at={2.4} x={1400} y={420} text="DRIP âœ“" c={K.green} />
  </Stage></F>);
};

// â”€â”€ GRIT_RIDE: corte de caÃ±o; granos de arena y Ã³xido viajan por el caÃ±o y se meten todos por el agujerito de la vÃ¡lvula
export const grit_ride: H = ({ dur }) => {
  const t = useT();
  return (<F dur={dur}><Stage rx={14} ry={-6 + Math.sin(t * 0.3) * 5} bg={{ background: "#e9e1cf" }}>
    <Box x={0} y={460} w={1500} h={160} z={0} style={{ background: "linear-gradient(180deg,#8d9499,#c9cfd2 30%,#7a8186)", borderRadius: 20 }}>
      <div style={{ position: "absolute", inset: "24px 0", background: "linear-gradient(180deg,#bfe0ef,#9ccbe0)" }} />
    </Box>
    <Box x={1480} y={300} w={180} h={480} z={0} style={{ background: "linear-gradient(90deg,#ddd,#fff,#ccc)", borderRadius: 14 }}>
      <div style={{ position: "absolute", left: -10, top: 220, width: 30, height: 30, borderRadius: 15, background: "#222" }} />
    </Box>
    {Array.from({ length: 26 }, (_, i) => { const ph = cl((t - i * 0.12) / 2.6); if (ph <= 0) return null; const x = lerp(-40, 1490, eio(ph)), y = 500 + ((i * 37) % 80) * (1 - ph) + 235 * 0 + ph * 0;
      return <div key={i} style={{ position: "absolute", left: x, top: lerp(y, 532, ph), width: 10 + (i % 3) * 5, height: 8 + (i % 4) * 4, borderRadius: 3, background: i % 3 ? "#8a5a2a" : "#c9b48a", opacity: ph > 0.98 ? 0 : 1 }} />; })}
    <Tx x={760} y={130} s={68} c={K.navy} wt={900}>AFTER THE CITY WORKS ON THE MAIN</Tx>
    <Tx x={1570} y={830} w={500} s={44} c={K.red} wt={900} o={cl((t - 2) * 2)}>FIRST STOP: THE TINY HOLE</Tx>
  </Stage></F>);
};

// â”€â”€ GEYSER_CUP: la torre de la vÃ¡lvula vista de costado; un vaso boca abajo encima; un chorro sube, golpea el fondo del vaso y la mugre cae afuera
export const geyser_cup: H = ({ dur }) => {
  const t = useT(), on = pr(t, 0.6, 0.9) * (1 - pr(t, 3.2, 3.5)), jet = on * (0.8 + Math.sin(t * 30) * 0.05);
  return (<F dur={dur}><Stage rx={4} ry={Math.sin(t * 0.4) * 8} bg={TILE}>
    <Box x={880} y={540} w={160} h={480} z={0} style={{ background: "linear-gradient(90deg,#ccc,#fff,#bbb)", borderRadius: 12 }} />
    <div style={{ position: "absolute", left: 930, top: 540 - 300 * jet, width: 60, height: 300 * jet, background: "linear-gradient(0deg,#cfeeff,#ffffff)", borderRadius: 30 }} />
    <Box x={800} y={160} w={320} h={240} z={30} style={{ background: "linear-gradient(90deg,rgba(255,255,255,0.35),rgba(255,255,255,0.75),rgba(255,255,255,0.3))", border: "6px solid rgba(255,255,255,0.9)", borderRadius: "40px 40px 10px 10px", clipPath: "polygon(8% 0,92% 0,100% 100%,0 100%)" }} />
    {Array.from({ length: 12 }, (_, i) => { const ph = cl((t - 0.9 - i * 0.12) / 1.2); if (ph <= 0 || ph >= 1) return null; const side = i % 2 ? 1 : -1;
      return <div key={i} style={{ position: "absolute", left: 960 + side * (180 + ph * 160), top: 400 + ph * ph * 520, width: 14, height: 10, borderRadius: 3, background: "#7a4a1f" }} />; })}
    <Tx x={960} y={50} s={70} c={K.navy} wt={900}>FIVE SECONDS Â· A LITTLE WATER</Tx>
    <Tx x={1500} y={620} w={600} s={48} c={K.red} wt={900} o={cl((t - 2) * 2)}>the grit blows out</Tx>
  </Stage></F>);
};

// â”€â”€ OVER_UNDER: tarjeta de encuesta de la ferreterÃ­a con dos casillas de lÃ¡piz; una mano tilda una (v0); v1 cuatro casillas
export const over_under: H = ({ dur, v = 0 }) => {
  const t = useT(), opts = v === 0 ? ["OVER THE TOP", "OUT THE BOTTOM"] : ["THE FLOAT", "THE CHAIN", "THE FLAPPER", "SOMETHING ELSE"];
  const pick = Math.floor(t * 0.9) % opts.length;
  return (<F dur={dur}><Stage rx={28} persp={1400} bg={CORK}>
    <Card x={460} y={140} w={1000} h={800} z={0} r={-2}>
      <div style={{ ...tag(K.navy, 60), textAlign: "center", marginTop: 50 }}>TELL ME IN THE COMMENTS</div>
      {opts.map((o, i) => <div key={o} style={{ display: "flex", alignItems: "center", gap: 40, margin: `${v ? 36 : 70}px 0 0 120px`, opacity: cl((t - 0.3 - i * 0.25) * 3) }}>
        <div style={{ width: 80, height: 80, border: `6px solid ${K.ink}`, position: "relative" }}>{pick === i && <div style={{ position: "absolute", left: 6, top: -30, fontFamily: HAND, fontSize: 120, color: K.red, lineHeight: 1 }}>âœ“</div>}</div>
        <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 72, color: K.ink }}>{o}</div>
      </div>)}
    </Card>
    <Pin x={960} y={170} />
  </Stage></F>);
};

// â”€â”€ GHOST_SHEET: tanque de noche; una sÃ¡bana-fantasma de papel recortado sube del tanque, el nivel baja y el relleno se prende solo
export const ghost_sheet: H = ({ dur }) => {
  const t = useT(), rise = eout(pr(t, 0.4, 1.8));
  return (<F dur={dur}><Stage rx={6} ry={Math.sin(t * 0.3) * 6} bg={NIGHT}>
    <Box x={660} y={520} w={600} h={460} z={0} style={{ background: "linear-gradient(180deg,#e8edf2,#9aa7b3)", borderRadius: 18 }} />
    <div style={{ position: "absolute", left: 760, top: lerp(560, 140, rise), width: 400, height: 420, background: "#f6f8fb", borderRadius: "200px 200px 30px 30px", clipPath: "polygon(0 0,100% 0,100% 88%,88% 100%,75% 88%,62% 100%,50% 88%,38% 100%,25% 88%,12% 100%,0 88%)", opacity: rise * 0.92, transform: `translateZ(60px) rotate(${Math.sin(t * 2) * 3}deg)` }}>
      <div style={{ position: "absolute", left: 110, top: 140, width: 50, height: 70, borderRadius: 25, background: "#1b2533" }} /><div style={{ position: "absolute", left: 240, top: 140, width: 50, height: 70, borderRadius: 25, background: "#1b2533" }} />
    </div>
    <Tx x={960} y={60} s={84} c="#e8eef6" f={SLAB} wt={900}>"PHANTOM FLUSH"</Tx>
    <Tx x={960} y={1000} s={44} c="#ffd37a" wt={800} o={cl((t - 1.6) * 2)}>2:14 AM Â· nobody touched it</Tx>
  </Stage></F>);
};

// â”€â”€ LEAK_PATHS: corte del tanque con tres salidas numeradas; una gota recorre cada una (v0); v1 las tilda en orden 1-2-3
export const leak_paths: H = ({ dur, v = 0 }) => {
  const t = useT();
  const P: [string, number, number][] = [["1 Â· PAST THE FLAPPER", 820, 860], ["2 Â· DOWN THE REFILL TUBE", 1080, 520], ["3 Â· OUT THE BOTTOM", 640, 1000]];
  return (<F dur={dur}><Stage rx={10} ry={Math.sin(t * 0.4) * 6} bg={TILE}>
    <Box x={560} y={240} w={800} h={620} z={0} style={{ background: "linear-gradient(180deg,#f8f8f4,#d7d3c8)", borderRadius: 20, boxShadow: "0 30px 40px rgba(0,0,0,0.3)" }}>
      <div style={{ position: "absolute", left: 30, right: 30, top: 140, bottom: 30, background: "linear-gradient(180deg,#a9d3e6,#6aa6c6)", borderRadius: 10 }} />
    </Box>
    {P.map(([s, x, y], i) => { const a = v === 0 ? 0.3 + i * 0.9 : 0.3 + i * 0.5, p = pr(t, a, a + 0.8);
      return <React.Fragment key={s}>
        {v === 0 && p > 0 && p < 1 && <div style={{ position: "absolute", left: x - 12, top: lerp(y - 220, y, p), width: 24, height: 32, borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%", background: "#3d8fd1" }} />}
        <div style={{ position: "absolute", left: i === 1 ? 1390 : 80, top: 300 + i * 200, width: 460, ...PAPER, padding: "14px 20px", ...tag(K.navy, 38), opacity: cl((t - a) * 3), boxShadow: "0 10px 18px rgba(0,0,0,0.3)" }}>{s}{v === 1 && <span style={{ color: K.green, marginLeft: 16 }}>{t > a + 0.4 ? "âœ“" : ""}</span>}</div>
      </React.Fragment>; })}
    <Tx x={960} y={60} s={68} c={K.navy} wt={900}>{v === 0 ? "ONLY THREE PLACES IT CAN GO" : "CHECK THEM IN THAT ORDER"}</Tx>
  </Stage></F>);
};

// â”€â”€ BUILDING_12: fachada de ladrillo de Pilsen de noche; las 12 ventanas se prenden de a una con un "SSHHH" de inodoro
export const building_12: H = ({ dur }) => {
  const t = useT();
  return (<F dur={dur}><Stage rx={-6} ry={Math.sin(t * 0.3) * 8} bg={NIGHT}>
    <Box x={560} y={120} w={800} h={900} z={0} style={{ backgroundColor: "#7a3b2a", backgroundImage: "linear-gradient(rgba(0,0,0,0.25) 2px, transparent 2px), linear-gradient(90deg, rgba(0,0,0,0.2) 2px, transparent 2px)", backgroundSize: "60px 22px, 60px 44px", boxShadow: "0 0 0 10px #4a2318" }}>
      {Array.from({ length: 12 }, (_, i) => { const r = Math.floor(i / 3), c = i % 3, on = ((Math.floor(t * 4) * 7 + i * 5) % 12) < 3 + Math.floor(t);
        return <div key={i} style={{ position: "absolute", left: 90 + c * 230, top: 90 + r * 200, width: 160, height: 130, background: on ? "linear-gradient(180deg,#ffe8a8,#f2b84b)" : "#1d2430", boxShadow: "inset 0 0 0 8px #e9dcc4" }}>
          {on && <div style={{ position: "absolute", width: "100%", top: 40, textAlign: "center", fontFamily: HAND, fontSize: 34, fontWeight: 700, color: "#5a3a10" }}>sshhh</div>}
        </div>; })}
    </Box>
    <Tx x={960} y={30} s={64} c="#ffd37a" wt={900}>PILSEN Â· 2008 Â· 12 APARTMENTS</Tx>
  </Stage></F>);
};

// â”€â”€ LEFTY_NUT: tuerca grande en un perno; una mano de tiza gira hacia la izquierda y la tuerca BAJA (aprieta); un espejo de mano refleja la flecha
export const lefty_nut: H = ({ dur }) => {
  const t = useT(), rot = -eio(pr(t, 0.6, 2.6)) * 540;
  return (<F dur={dur}><Stage rx={8} ry={Math.sin(t * 0.4) * 6} bg={CHALK}>
    <Box x={500} y={180} w={80} h={700} z={0} style={{ background: "repeating-linear-gradient(-20deg,#c9cfd2 0 10px,#7a8186 10px 16px)", borderRadius: 10 }} />
    <Box x={400} y={lerp(300, 560, -rot / 540)} w={280} h={140} z={20} style={{ background: "linear-gradient(180deg,#ececec,#b5b5b5)", clipPath: "polygon(15% 0,85% 0,100% 50%,85% 100%,15% 100%,0 50%)", transform: `translateZ(20px) rotateY(${rot}deg)` }} />
    <Tx x={540} y={110} w={600} s={110} c="#f4f1e8" f={HAND} wt={700}>âŸ²</Tx>
    <Box x={1100} y={260} w={520} h={520} z={10} style={{ borderRadius: 260, background: "radial-gradient(circle at 40% 35%, #f3f7fa, #aab6be 70%)", boxShadow: "0 0 0 24px #b08d57" }}>
      <div style={{ position: "absolute", width: "100%", top: 150, textAlign: "center", fontFamily: SANS, fontWeight: 900, fontSize: 70, color: K.navy, transform: "scaleX(-1)" }}>RIGHTY TIGHTY</div>
      <div style={{ position: "absolute", width: "100%", top: 280, textAlign: "center", fontFamily: SANS, fontWeight: 900, fontSize: 56, color: K.red, opacity: cl((t - 1.4) * 2) }}>NOT HERE</div>
    </Box>
    <Tx x={960} y={950} s={56} c="#f4f1e8" f={HAND} wt={700} o={cl((t - 1) * 2)}>left-hand thread: counterclockwise = tight</Tx>
  </Stage></F>);
};

// â”€â”€ HALF_JUG: jarra medidora de vidrio que se llena solo hasta la mitad mientras la lÃ­nea FULL queda seca
export const half_jug: H = ({ dur }) => {
  const t = useT(), f = eio(pr(t, 0.3, 2.4)) * 0.5;
  return (<F dur={dur}><Stage rx={6} ry={Math.sin(t * 0.4) * 10} bg={PALEWOOD}>
    <Box x={700} y={220} w={520} h={680} z={0} style={{ border: "10px solid rgba(255,255,255,0.85)", borderTop: "none", borderRadius: "0 0 50px 50px", background: "rgba(255,255,255,0.18)", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 680 * f, background: "linear-gradient(180deg,#9fd0e8,#5d9ec4)" }} />
      {[0.25, 0.5, 0.75, 0.95].map((y) => <div key={y} style={{ position: "absolute", left: 0, width: y === 0.95 ? 220 : 120, top: 680 * (1 - y), borderTop: `5px solid ${y === 0.95 ? K.red : "#333"}` }} />)}
      <div style={{ position: "absolute", left: 240, top: 10, ...tag(K.red, 44) }}>FULL</div>
    </Box>
    <Tx x={960} y={60} s={74} c={K.navy} wt={900}>VALVE HALF CLOSED = HALF FLUSH</Tx>
    <Tx x={1520} y={560} w={500} s={46} c={K.ink} wt={800} o={cl((t - 1.8) * 2)}>slow fill Â· weak flush</Tx>
  </Stage></F>);
};

// â”€â”€ SPRING_COIL: una tuerca de plÃ¡stico sobre una losa de porcelana; un resorte (fuerza) se comprime; al pasarse, la losa se marca
export const spring_coil: H = ({ dur }) => {
  const t = useT(), squeeze = eio(pr(t, 0.3, 1.6)), over = pr(t, 1.6, 1.9);
  return (<F dur={dur}><Stage rx={14} ry={Math.sin(t * 0.4) * 6} bg={TILE}>
    <Box x={460} y={700} w={1000} h={200} z={0} style={{ background: "linear-gradient(180deg,#ffffff,#d8d4c9)", borderRadius: 14 }}>
      {over > 0 && <div style={{ position: "absolute", left: 500, top: 0, width: 4, height: 200 * over, background: "#333", transform: "rotate(14deg)" }} />}
    </Box>
    <Box x={860} y={600} w={200} h={100} z={20} style={{ background: "linear-gradient(180deg,#f6f6f6,#cfcfcf)", borderRadius: 14 }}><div style={{ ...tag("#666", 30), textAlign: "center", marginTop: 30 }}>PLASTIC</div></Box>
    <div style={{ position: "absolute", left: 900, top: lerp(160, 330, squeeze), height: lerp(440, 270, squeeze), width: 120, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
      {Array.from({ length: 10 }, (_, i) => <div key={i} style={{ height: 10, borderRadius: 5, background: "#8c9196", transform: `skewY(${i % 2 ? 8 : -8}deg)` }} />)}
    </div>
    <Tx x={960} y={60} s={78} c={K.navy} wt={900}>PLASTIC ON PORCELAIN</Tx>
    <Rubber t={t} at={1.9} x={1440} y={420} text="CRACK" c={K.red} />
  </Stage></F>);
};

// â”€â”€ EGG_VISE: un huevo en una morsa de banco; un cuarto de vuelta lo sostiene; otro y se quiebra â€” la porcelana no perdona
export const egg_vise: H = ({ dur }) => {
  const t = useT(), close = eio(pr(t, 0.2, 1.1)) * 0.6 + eio(pr(t, 1.5, 1.9)) * 0.4, broke = t > 1.9;
  return (<F dur={dur}><Stage rx={16} ry={Math.sin(t * 0.4) * 8} bg={WOOD}>
    <Box x={lerp(420, 560, close)} y={360} w={300} h={360} z={0} style={{ ...STEEL, background: "linear-gradient(180deg,#4f6b8a,#2c3e52)", borderRadius: 10 }} />
    <Box x={lerp(1200, 1060, close)} y={360} w={300} h={360} z={0} style={{ background: "linear-gradient(180deg,#4f6b8a,#2c3e52)", borderRadius: 10 }} />
    {!broke ? <Box x={860} y={400} w={200} h={280} z={10} style={{ borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%", background: "radial-gradient(circle at 38% 30%, #fff, #efe6d6 60%, #cdbfa6)" }} />
      : [0, 1, 2, 3].map((k) => <Box key={k} x={860 + (k % 2) * 100} y={400 + Math.floor(k / 2) * 140 + (t - 1.9) * 300 * (k + 1) * 0.3} w={100} h={140} z={10} r={(k - 1.5) * 30 * (t - 1.9)} style={{ background: "#f3ece0", clipPath: k % 2 ? "polygon(0 10%,100% 0,90% 100%,10% 80%)" : "polygon(10% 0,100% 15%,80% 100%,0 90%)" }} />)}
    <Tx x={960} y={110} s={66} c={K.cream} wt={900}>{t < 1.5 ? "A QUARTER TURN: SNUG" : "ONE MORE: GONE"}</Tx>
    <Tx x={960} y={880} s={60} c="#ffd37a" f={SLAB} wt={900} o={cl((t - 2.1) * 2)}>PORCELAIN DOESN'T FORGIVE</Tx>
  </Stage></F>);
};

// â”€â”€ KEY_RING: llavero de portero con 6 llaves con etiqueta de cartÃ³n; v0 se presenta; v1..v6 la llave i se adelanta; v7 todas giran: ONCE A YEAR
const KEYS = ["WATER LEVEL 1\"", "CHAIN Â½\" SLACK", "FLAPPER: SOFT?", "DYE TEST", "SHUTOFF OPEN", "DRY TOWEL"];
export const key_ring: H = ({ dur, v = 0 }) => {
  const t = useT(), sel = v >= 1 && v <= 6 ? v - 1 : -1, spin = v === 7 ? t * 40 : Math.sin(t * 1.2) * 6;
  return (<F dur={dur}><Stage rx={18} persp={1300} bg={PEG}>
    <div style={{ position: "absolute", left: 860, top: 160, width: 200, height: 200, borderRadius: 100, border: "14px solid #c9a14a", transform: `translateZ(40px)` }} />
    <div style={{ position: "absolute", left: 960, top: 260, transformStyle: "preserve-3d", transform: `rotateY(${spin}deg)` }}>
      {KEYS.map((k, i) => { const a = -60 + i * 24, front = i === sel, p = front ? eout(pr(t, 0.2, 0.7)) : 0;
        return <div key={k} style={{ position: "absolute", left: -40, top: 0, width: 80, transformOrigin: "50% 0", transform: `rotate(${a * (1 - p)}deg) translateZ(${p * 200}px) scale(${1 + p * 0.5})`, opacity: sel >= 0 && !front ? 0.45 : 1 }}>
          <div style={{ margin: "0 auto", width: 34, height: 220, background: "linear-gradient(90deg,#9a7a30,#e8c873,#9a7a30)", borderRadius: "16px 16px 4px 4px" }} />
          <div style={{ marginLeft: -60, width: 200, ...PAPER, padding: "8px 6px", textAlign: "center", ...tag(K.navy, 24), border: "2px solid #a68d5d" }}>{k}</div>
        </div>; })}
    </div>
    <Tx x={960} y={40} s={64} c={K.navy} wt={900}>{v === 0 ? "FIVE MINUTES PER TOILET" : v === 7 ? "ONCE A YEAR Â· FIVE MINUTES" : `CHECK ${v} OF 6`}</Tx>
  </Stage></F>);
};

// â”€â”€ COUNTER_BELL: timbre de mostrador; al tocarlo, la pantalla roja de turnos NOW SERVING salta al nÃºmero; ticket con la pregunta
const QS = ["QUESTIONS FROM THE COUNTER", "VALVES THAT WON'T TURN", "BOILING WATER IN THE TOILET?", "THE NEW SUPPLY LINE", "WHY A 2-INCH HOLE?"];
export const counter_bell: H = ({ dur, v = 0 }) => {
  const t = useT(), hit = pr(t, 0.3, 0.45), shake = Math.sin(t * 50) * Math.exp(-(t - 0.4) * 6) * (t > 0.4 ? 4 : 0);
  return (<F dur={dur}><Stage rx={22} ry={Math.sin(t * 0.4) * 6} bg={WOOD}>
    <Box x={300} y={600} w={300} h={110} z={0} style={{ background: "linear-gradient(180deg,#333,#111)", borderRadius: 14 }} />
    <Box x={330} y={440} w={240} h={180} z={10} r={shake} style={{ borderRadius: "120px 120px 20px 20px", background: "radial-gradient(circle at 35% 25%, #fff6cf, #d9b04a 50%, #8a6a1a)" }} />
    <Box x={430} y={lerp(380, 410, hit)} w={40} h={60} z={20} style={{ background: "#222", borderRadius: 10 }} />
    <Box x={820} y={180} w={760} h={300} z={0} style={{ background: "#14100e", borderRadius: 16, boxShadow: "0 0 0 14px #3a3a3a" }}>
      <div style={{ ...tag("#ff5a3c", 40), textAlign: "center", marginTop: 26, letterSpacing: 6 }}>NOW SERVING</div>
      <div style={{ fontFamily: "Courier New, monospace", fontWeight: 900, fontSize: 150, color: "#ff5a3c", textAlign: "center", lineHeight: 1 }}>{t < 0.4 ? (v === 0 ? "--" : String(v).padStart(2, "0")) : String(v + 1).padStart(2, "0")}</div>
    </Box>
    <Card x={820} y={560} w={760} h={230} z={30} r={-2} o={cl((t - 0.5) * 3)}><div style={{ ...tag(K.navy, v ? 54 : 50), textAlign: "center", padding: "70px 30px" }}>{QS[v] ?? QS[0]}</div></Card>
  </Stage></F>);
};

// â”€â”€ BRICK_WALL: dos botellas (TOILET CLEANER / BLEACH) y un muro de ladrillos que se levanta hilada por hilada entre ellas
export const brick_wall: H = ({ dur }) => {
  const t = useT();
  const bottle = (x: number, lab: string, c: string) => <Box x={x} y={360} w={240} h={480} z={0} style={{ background: `linear-gradient(90deg, ${c}, #fff8 45%, ${c})`, borderRadius: "60px 60px 20px 20px" }}><div style={{ position: "absolute", top: 200, left: 20, right: 20, ...PAPER, padding: 10, textAlign: "center", ...tag(K.ink, 30) }}>{lab}</div></Box>;
  return (<F dur={dur}><Stage rx={10} ry={Math.sin(t * 0.4) * 10} bg={TILE}>
    {bottle(360, "TOILET CLEANER", "#2f7fb8")}{bottle(1320, "BLEACH", "#e8e8e8")}
    {Array.from({ length: 30 }, (_, i) => { const row = Math.floor(i / 3), col = i % 3, p = eout(pr(t, 0.2 + i * 0.07, 0.5 + i * 0.07));
      return <div key={i} style={{ position: "absolute", left: 770 + col * 130 + (row % 2) * 30 - 15, top: 860 - row * 52 - (1 - p) * 300, width: 124, height: 46, background: "linear-gradient(180deg,#b5553a,#8a3a24)", borderRadius: 3, opacity: p, boxShadow: "0 3px 0 #d8cfc0" }} />; })}
    <Tx x={960} y={60} s={84} c={K.red} wt={900}>NEVER MIX. EVER.</Tx>
  </Stage></F>);
};

// â”€â”€ BALL_VALVE: corte de una vÃ¡lvula de cuarto de vuelta; la manija gira 90Â° y la esfera con agujero rota: abierto â†’ cerrado
export const ball_valve: H = ({ dur }) => {
  const t = useT(), q = eio(pr(t, 1, 1.8)), ang = q * 90;
  return (<F dur={dur}><Stage rx={10} ry={Math.sin(t * 0.4) * 8} bg={PALEWOOD}>
    <Box x={260} y={480} w={1400} h={180} z={0} style={{ background: "linear-gradient(180deg,#d9b66a,#a07a2a 50%,#7a5a1a)", borderRadius: 30 }}>
      <div style={{ position: "absolute", inset: "40px 0", background: q < 0.5 ? "linear-gradient(90deg,#9fd0e8,#5d9ec4)" : "linear-gradient(90deg,#9fd0e8 0 47%, #3a2a10 47% 100%)" }} />
    </Box>
    <Box x={810} y={420} w={300} h={300} z={10} style={{ borderRadius: 150, background: "radial-gradient(circle at 35% 30%, #fff, #c9c9c9 60%, #888)", transform: `translateZ(10px) rotate(${ang}deg)` }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 110, height: 80, background: "#5d9ec4" }} />
    </Box>
    <div style={{ position: "absolute", left: 950, top: 240, width: 20, height: 200, background: "#555" }} />
    <div style={{ position: "absolute", left: 960, top: 230, width: 420, height: 60, background: "linear-gradient(180deg,#e04a2a,#9a2a12)", borderRadius: 30, transformOrigin: "0 50%", transform: `rotate(${-ang}deg)` }} />
    <Tx x={960} y={50} s={74} c={K.navy} wt={900}>ONE QUARTER TURN</Tx>
    <Tx x={960} y={800} s={64} c={q < 0.5 ? K.green : K.red} wt={900}>{q < 0.5 ? "OPEN" : "CLOSED"}</Tx>
  </Stage></F>);
};

// â”€â”€ GALLON_POUR: dos baldes de pintor marcados; el viejo vuelca 3.5 gal por un agujero de 2"; el nuevo 1.6 gal por uno de 3" en el mismo tiempo
export const gallon_pour: H = ({ dur }) => {
  const t = useT(), p = eio(pr(t, 0.5, 2.6));
  const pail = (x: number, gal: string, hole: number, lvl: number, lab: string) => <>
    <Box x={x} y={260} w={420} h={460} z={0} style={{ background: "linear-gradient(90deg,#d8d8d8,#fff,#cfcfcf)", borderRadius: "10px 10px 40px 40px", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 440 * lvl * (1 - p), background: "linear-gradient(180deg,#9fd0e8,#5d9ec4)" }} />
      <div style={{ position: "absolute", width: "100%", top: 30, textAlign: "center", ...tag(K.navy, 56) }}>{gal}</div>
    </Box>
    <div style={{ position: "absolute", left: x + 210 - hole * 20, top: 720, width: hole * 40, height: 300 * (p > 0 && p < 1 ? 1 : 0), background: "linear-gradient(180deg,#9fd0e8,#5d9ec4)" }} />
    <Tx x={x + 210} y={180} w={500} s={42} c={K.ink} wt={900}>{lab}</Tx>
  </>;
  return (<F dur={dur}><Stage rx={6} ry={Math.sin(t * 0.4) * 6} bg={TILE}>
    {pail(360, "3.5 GAL", 2, 0.95, "OLD Â· 2-INCH HOLE")}{pail(1140, "1.6 GAL", 3, 0.45, "NEW Â· 3-INCH HOLE")}
    <Tx x={960} y={40} s={64} c={K.navy} wt={900}>LESS WATER, BIGGER HOLE, FASTER DUMP</Tx>
  </Stage></F>);
};

// â”€â”€ FLAPPER_CARDS: gancho de exhibiciÃ³n de ferreterÃ­a con flappers en blÃ­ster; v0 el mÃ¡s barato sin ajuste se cae del gancho; v1 el ajustable se adelanta
export const flapper_cards: H = ({ dur, v = 0 }) => {
  const t = useT(), L: [string, string][] = [["BASIC FLAT", "$4.97"], ["ADJUSTABLE", "$6.98"], ["UNIVERSAL", "$7.48"]];
  return (<F dur={dur}><Stage rx={8} ry={Math.sin(t * 0.4) * 8} bg={PEG}>
    <div style={{ position: "absolute", left: 360, top: 200, width: 1200, height: 18, background: "linear-gradient(180deg,#eee,#888)", borderRadius: 9 }} />
    {L.map(([n, pz], i) => { const me = v === 0 ? i === 0 : i === 1, drop = v === 0 && me ? eio(pr(t, 1.2, 2)) : 0, fwd = v === 1 && me ? eout(pr(t, 0.4, 1)) : 0;
      return <div key={n} style={{ position: "absolute", left: 440 + i * 380, top: 230 + drop * 900, width: 320, height: 460, transform: `translateZ(${fwd * 220}px) rotate(${drop * 40}deg)`, opacity: v === 1 && !me ? 0.5 : 1 }}>
        <div style={{ width: "100%", height: "100%", background: "linear-gradient(180deg,#f3d24a,#e2a91e)", borderRadius: 12, boxShadow: "0 18px 26px rgba(0,0,0,0.35)" }}>
          <div style={{ margin: "26px auto 0", width: 40, height: 18, borderRadius: 9, background: "#7a5a10" }} />
          <div style={{ margin: "30px auto 0", width: 200, height: 160, borderRadius: "50%", background: "radial-gradient(circle at 40% 30%, #e05a4a, #7a1a12)", boxShadow: "inset 0 0 0 6px rgba(255,255,255,0.4)" }} />
          {i > 0 && <div style={{ margin: "-60px auto 0", width: 60, height: 60, borderRadius: 30, background: "#222", border: "4px solid #ddd" }} />}
          <div style={{ ...tag(K.ink, 34), textAlign: "center", marginTop: i ? 30 : 90 }}>{n}</div>
          <div style={{ ...tag(K.red, 46), textAlign: "center" }}>{pz}</div>
        </div>
      </div>; })}
    <Tx x={960} y={60} s={66} c={K.navy} wt={900}>{v === 0 ? "THE ONE I NEVER BUY" : "THE ONE I BUY"}</Tx>
  </Stage></F>);
};

// â”€â”€ FLAPPER_SLIDER: corte del flapper ajustable con su perilla; un fader de mezcladora SOONER â†” LATER mueve cuÃ¡nto tarda en cerrar
export const flapper_slider: H = ({ dur }) => {
  const t = useT(), pos = 0.5 + Math.sin(t * 1.1) * 0.45, close = (Math.sin(t * 3) + 1) / 2;
  return (<F dur={dur}><Stage rx={14} ry={Math.sin(t * 0.3) * 6} bg={{ background: "linear-gradient(180deg,#cfe6f0,#8fbfd8)" }}>
    <Box x={300} y={460} w={600} h={60} z={0} style={{ background: "#ddd", borderRadius: 10 }} />
    <div style={{ position: "absolute", left: 340, top: 400, width: 520, height: 70, borderRadius: "50% 50% 20px 20px", background: "linear-gradient(180deg,#c0392b,#6e1a12)", transformOrigin: "0 100%", transform: `rotate(${-close * 50 * (1.2 - pos)}deg)` }} />
    <Box x={1180} y={240} w={140} h={620} z={0} style={{ background: "#1a1a1a", borderRadius: 14 }}>
      <div style={{ position: "absolute", left: 62, top: 40, width: 16, height: 540, background: "#444", borderRadius: 8 }} />
      <div style={{ position: "absolute", left: 10, top: 40 + pos * 480, width: 120, height: 60, background: "linear-gradient(180deg,#eee,#999)", borderRadius: 8 }} />
    </Box>
    <Tx x={1580} y={250} w={400} s={52} c={K.navy} wt={900}>SOONER</Tx>
    <Tx x={1580} y={790} w={400} s={52} c={K.navy} wt={900}>LATER</Tx>
    <Tx x={960} y={60} s={66} c={K.navy} wt={900}>TURN THE DIAL ON THE FLAPPER</Tx>
  </Stage></F>);
};

// â”€â”€ BLOCK_STACK: bloques de madera de juguete con precios pintados; cada variante suma uno a la torre
const BLK: [string, string][] = [["TRIP FEE", "$100â€“200"], ["FLAPPER, PLUMBER", "$150â€“250"], ["FILL VALVE", "$200â€“300"], ["WAX RING + RESET", "$250â€“400"]];
export const block_stack: H = ({ dur, v = 0 }) => {
  const t = useT();
  return (<F dur={dur}><Stage rx={12} ry={-14 + Math.sin(t * 0.4) * 8} bg={PALEWOOD}>
    {BLK.slice(0, v + 1).map(([a, b], i) => { const p = i === v ? eout(pr(t, 0.2, 0.8)) : 1, sq = i === v ? Math.sin(cl((t - 0.8) * 4) * Math.PI) * 0.06 : 0;
      return <Box key={a} x={560} y={lerp(-300, 840 - i * 190, p)} w={800} h={180} z={0} style={{ background: ["#c0392b", "#2f6fa5", "#e2a91e", "#3c8a4a"][i], borderRadius: 10, transform: `scaleY(${1 - sq})`, boxShadow: "inset 0 -14px 0 rgba(0,0,0,0.2), 0 10px 0 rgba(0,0,0,0.25)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", padding: "50px 50px", ...tag("#fff", 60) }}><span>{a}</span><span>{b}</span></div>
      </Box>; })}
    {v === 1 && <Rubber t={t} at={1} x={1600} y={300} text="PART: $6â€“10" c={K.navy} s={52} />}
    <Tx x={960} y={40} s={66} c={K.navy} wt={900}>WHAT THE CALL COSTS</Tx>
  </Stage></F>);
};

// â”€â”€ IN_OUT_TRAY: bandejas de escritorio YOU / CALL; las tarjetas de arreglos caen en la que corresponde
export const in_out_tray: H = ({ dur, v = 0 }) => {
  const t = useT(), items: [string, number][] = v === 0 ? [["FLOAT", 0], ["CHAIN", 0], ["FLAPPER", 0], ["CUP TRICK", 0]] : [["WAX RING", 1], ["STUCK VALVE", 1]];
  return (<F dur={dur}><Stage rx={34} persp={1300} bg={WOOD}>
    {["YOU Â· $0", "CALL HIM"].map((s, j) => <Box key={s} x={300 + j * 760} y={460} w={560} h={360} z={0} style={{ background: j ? "#3a3f44" : "#2f6a3f", borderRadius: 14, boxShadow: "inset 0 30px 0 rgba(0,0,0,0.25)" }}><div style={{ position: "absolute", bottom: 24, width: "100%", textAlign: "center", ...tag("#fff", 54) }}>{s}</div></Box>)}
    {items.map(([n, j], i) => { const p = eio(pr(t, 0.2 + i * 0.4, 0.8 + i * 0.4));
      return <Card key={n} x={lerp(810, 360 + j * 760 + (i % 2) * 120, p)} y={lerp(80, 480 + i * 18, p)} w={320} h={120} z={20 + i * 3} r={lerp(0, (i % 2 ? 6 : -5), p)}><div style={{ ...tag(K.navy, 46), textAlign: "center", paddingTop: 30 }}>{n}</div></Card>; })}
    {v === 0 && <Tx x={960} y={60} s={64} c={K.cream} wt={900}>YOU JUST SAVED THE WHOLE BILL</Tx>}
    {v === 1 && <Tx x={960} y={60} s={60} c={K.cream} wt={900}>NOW YOU KNOW WHAT TO TELL HIM</Tx>}
  </Stage></F>);
};

// â”€â”€ PARTS_BIN: gabinete de cajoncitos de ferreterÃ­a; el cajÃ³n de la pieza sale hacia cÃ¡mara con su etiqueta de precio y tiempo
const BINS: [string, string, string][] = [["FLAPPER", "$6â€“10", "5 MIN"], ["FILL VALVE SEAL", "â‰ˆ $9", "STRETCHES ON"], ["REFILL TUBE", "$1â€“2", "BRING THE OLD ONE"], ["CUP TRICK", "$0", "YOU SAVED $12â€“15"], ["HANDLE", "$8â€“12", "SAME BACKWARDS NUT"], ["BOLTS + WASHERS", "$8â€“12", "Â½ HOUR Â· p.73"], ["QUARTER-TURN VALVE", "$10â€“15", "BEST THING IN AN OLD HOUSE"]];
export const parts_bin: H = ({ dur, v = 0 }) => {
  const t = useT(), out = eout(pr(t, 0.3, 1)), [n, pz, note] = BINS[v] ?? BINS[0];
  return (<F dur={dur}><Stage rx={10} ry={-10 + Math.sin(t * 0.3) * 6} bg={TILE}>
    <Box x={460} y={140} w={1000} h={800} z={0} style={{ background: "#2d4b6a", borderRadius: 10, boxShadow: "0 30px 40px rgba(0,0,0,0.35)" }}>
      {Array.from({ length: 20 }, (_, i) => { const me = i === 7 + (v % 5); return <div key={i} style={{ position: "absolute", left: 30 + (i % 4) * 240, top: 30 + Math.floor(i / 4) * 150, width: 220, height: 130, background: "linear-gradient(180deg,#e9edf0,#b6c0c8)", borderRadius: 6, opacity: me ? 1 - out : 1 }}><div style={{ margin: "50px auto 0", width: 70, height: 16, borderRadius: 8, background: "#555" }} /></div>; })}
    </Box>
    <Box x={lerp(510 + ((7 + (v % 5)) % 4) * 240, 560, out)} y={lerp(170 + Math.floor((7 + (v % 5)) / 4) * 150, 330, out)} w={lerp(220, 800, out)} h={lerp(130, 440, out)} z={out * 300} style={{ background: "linear-gradient(180deg,#e9edf0,#b6c0c8)", borderRadius: 10, boxShadow: "0 40px 50px rgba(0,0,0,0.4)" }}>
      <div style={{ opacity: cl((t - 0.9) * 3), padding: 40, textAlign: "center" }}>
        <div style={{ ...tag(K.navy, 64) }}>{n}</div><div style={{ ...tag(K.red, 110) }}>{pz}</div><div style={{ ...tag(K.ink, 42) }}>{note}</div>
      </div>
    </Box>
  </Stage></F>);
};

// â”€â”€ BKA_LECTERN: el libro abierto sobre un atril de madera; las hojas pasan en 3D y aterriza en la pÃ¡gina citada (imagen real de la pÃ¡gina)
const PAGES = [17, 17, 26, 21, 61, 78, 0, 60, 363, 32];
export const bka_lectern: H = ({ dur, v = 0 }) => {
  const t = useT(), pg = PAGES[v] ?? 17, flips = 5;
  return (<F dur={dur}><Stage rx={26} persp={1500} bg={{ background: "linear-gradient(180deg,#3b2a1c,#1d140d)" }}>
    <Box x={300} y={820} w={1320} h={120} z={-40} style={{ ...WOOD, borderRadius: 10 }} />
    <Box x={360} y={160} w={1200} h={700} z={0} style={{ background: "#5a1f1a", borderRadius: 14 }} />
    <Box x={390} y={180} w={570} h={660} z={4} style={{ ...PAPER, padding: 0, overflow: "hidden" }}>
      <div style={{ ...tag(K.navy, 40), padding: 40, lineHeight: 1.4 }}>THE TEN DOLLAR PLUMBER<br /><span style={{ fontFamily: SLAB, fontSize: 30, color: K.ink }}>Lenny's shop book</span></div>
    </Box>
    <Box x={960} y={180} w={570} h={660} z={4} style={{ background: "#fff", overflow: "hidden" }}>
      <Img src={staticFile(`len14a/book/p${String(pg).padStart(3, "0")}.jpg`)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }} />
    </Box>
    {Array.from({ length: flips }, (_, i) => { const p = eio(pr(t, 0.1 + i * 0.16, 0.5 + i * 0.16)); if (p >= 1) return null;
      return <div key={i} style={{ position: "absolute", left: 960, top: 180, width: 570, height: 660, ...PAPER, transformOrigin: "0 50%", transform: `translateZ(${8 + i}px) rotateY(${-p * 180}deg)`, backfaceVisibility: "hidden", boxShadow: "0 0 20px rgba(0,0,0,0.25)" }} />; })}
    <Box x={1380} y={110} w={210} h={110} z={30} o={cl((t - 1) * 3)} style={{ background: "#e2a91e", borderRadius: 10, boxShadow: "0 10px 18px rgba(0,0,0,0.4)" }}><div style={{ ...tag("#2a1a05", 56), textAlign: "center", paddingTop: 22 }}>p.{pg}</div></Box>
  </Stage></F>);
};

// â”€â”€ BKA_RECEIPT: la impresora de tickets de la caja escupe un ticket largo; al final viene el QR de lennys-plumbing.vercel.app/tank
export const bka_receipt: H = ({ dur }) => {
  const t = useT(), len = eio(pr(t, 0.2, 2.2));
  return (<F dur={dur}><Stage rx={18} ry={Math.sin(t * 0.3) * 6} bg={WOOD}>
    <Box x={660} y={720} w={600} h={240} z={0} style={{ background: "linear-gradient(180deg,#3a3f44,#15181b)", borderRadius: 20 }} />
    <Box x={710} y={720 - 640 * len} w={500} h={640 * len} z={10} style={{ background: "#fbfaf4", overflow: "hidden", boxShadow: "0 10px 20px rgba(0,0,0,0.3)" }}>
      <div style={{ position: "absolute", top: 0, width: "100%", textAlign: "center", fontFamily: "Courier New, monospace", fontWeight: 700, fontSize: 30, color: K.ink, lineHeight: 1.5, paddingTop: 20 }}>
        LENNY'S PLUMBING<br />THE TEN DOLLAR PLUMBER<br />RUNNING TOILET Â· p.17â€“32<br />--------------------
        <Img src={staticFile("len14a/book/qr_tank.png")} style={{ display: "block", margin: "16px auto", width: 260, height: 260 }} />
        FIRST LINK BELOW
      </div>
    </Box>
    <Tx x={1500} y={480} w={600} s={48} c={K.cream} wt={900} o={cl((t - 2) * 2)}>link in the description</Tx>
  </Stage></F>);
};

// â”€â”€ BKA_TOOLBOX: la caja de herramientas metÃ¡lica se abre en sus bandejas escalonadas; el libro cae en la bandeja de arriba
export const bka_toolbox: H = ({ dur }) => {
  const t = useT(), open = eio(pr(t, 0.2, 1.2)), drop = eout(pr(t, 1.3, 2));
  return (<F dur={dur}><Stage rx={30} ry={Math.sin(t * 0.3) * 8} persp={1400} bg={TILE}>
    <Box x={520} y={560} w={880} h={380} z={0} style={{ background: "linear-gradient(180deg,#c0392b,#7d1f16)", borderRadius: 14 }} />
    {[0, 1].map((k) => <Box key={k} x={520 + (k ? 1 : -1) * open * 160 * (k + 1) * 0.5 + (k ? 440 : 0)} y={560 - open * 80 * (k + 1)} w={440} h={110} z={20 + k * 10} style={{ background: "linear-gradient(180deg,#d64a3a,#8a2418)", borderRadius: 8 }} />)}
    <Box x={760} y={lerp(-400, 300, drop)} w={400} h={300} z={60} r={lerp(-30, -4, drop)} style={{ background: "linear-gradient(90deg,#1f3550,#2f5a86)", borderRadius: 8, boxShadow: "0 20px 30px rgba(0,0,0,0.4)" }}>
      <div style={{ ...tag("#f2d27a", 40), textAlign: "center", paddingTop: 70, lineHeight: 1.2 }}>THE TEN<br />DOLLAR<br />PLUMBER</div>
    </Box>
    <Tx x={960} y={60} s={64} c={K.navy} wt={900}>KEEP IT WITH YOUR TOOLS</Tx>
  </Stage></F>);
};
