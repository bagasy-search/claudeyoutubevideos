// btgm1 — minuto de prueba del estilo doc-ilustrado-btg con los números MEDIDOS (D:/claude-brain/estilos/doc-ilustrado-btg/MEDIDO.md).
// Usa el kit btg SOLO lectura y agrega lo que el kit no tiene: Build (frase palabra a palabra arriba), Scribble (anotación a mano amarilla),
// DiagSplit (pantalla partida en diagonal), Aside (chiste chico), Label (especie arriba-izq), BigWord. Sólo stills locales; el video, en el farm.
import React from "react";
import { AbsoluteFill, Img, Sequence, staticFile, useCurrentFrame } from "remotion";
import { loadFont } from "@remotion/google-fonts/Montserrat";
import { Beast, Person, PhotoCards, Real, SunsetStage, ease } from "../kits/btg/kit";

const { fontFamily: F } = loadFont("normal", { weights: ["700", "800", "900"], subsets: ["latin"] });
const S = (s: number) => Math.round(s * 30);
const INK = "#f0ebe5", RED = "#f14536", ORA = "#edb269", GOLD = "#e9c762";
const A = "apex04/";
const CROC1 = { img: A + "cut/croc_07d46510.png", ar: 463 / 107 };
const CROC2 = { img: A + "cut/croc_47c9ac61.png", ar: 438 / 132 };
const VID = A + "real/anim_11968386.mp4";
const FOTO = ["foto/croc_0247d9d3.jpg", "foto/croc_03e95b6e.jpg", "foto/croc_044d01ee.jpg", "foto/croc_0ed90eb0.jpg"].map((p) => A + p);

// ---- Build: una palabra cada 0,5 s (medido), 96 px, tercio de arriba, *clave* de color; sale con blur ----
// lines = renglones; el 2º renglón suele ser la palabra clave en MAYÚSCULA y más grande
const Build: React.FC<{ a?: number; lines: string[]; out?: number; x?: number; y?: number; size?: number; color?: string; center?: boolean }> = ({ a = 6, lines, out, x = 420, y = 130, size = 96, color = RED, center = true }) => {
  const f = useCurrentFrame();
  const o = out ? ease(f, out, out + 9, 1, 0) : 1;
  let k = 0;
  return (
    <div style={{ position: "absolute", left: center ? 0 : x, right: center ? 0 : undefined, top: y, textAlign: center ? "center" : "left", fontFamily: F, opacity: o, filter: `blur(${(1 - o) * 10}px)` }}>
      {lines.map((l, li) => (
        <div key={li} style={{ fontSize: li && lines[li].startsWith("*") ? size * 1.25 : size, fontWeight: 800, lineHeight: 1.12, color: INK, textShadow: "0 4px 18px rgba(0,0,0,.55)" }}>
          {l.split(" ").map((w, i) => {
            const t = ease(f, a + k * 15, a + k++ * 15 + 6);
            const key = w.startsWith("*");
            return <span key={i} style={{ display: "inline-block", marginRight: size * 0.25, opacity: t, transform: `translateY(${(1 - t) * 10}px)`, color: key ? color : undefined, fontWeight: key ? 900 : 800 }}>{w.replace(/\*/g, "")}</span>;
          })}
        </div>
      ))}
    </div>
  );
};
const BigWord: React.FC<{ a: number; w: string; color?: string; size?: number; x?: number; y?: number }> = ({ a, w, color = RED, size = 260, x, y = 360 }) => {
  const f = useCurrentFrame();
  const t = ease(f, a, a + 7);
  return <div style={{ position: "absolute", left: x ?? 0, right: x === undefined ? 0 : undefined, top: y, textAlign: x === undefined ? "center" : "left", fontFamily: F, fontWeight: 900, fontSize: size, color, opacity: t, transform: `scale(${1.15 - 0.15 * t})`, textShadow: `0 0 40px ${color}55, 0 8px 30px rgba(0,0,0,.6)` }}>{w}</div>;
};
const Label: React.FC<{ a?: number; t: string }> = ({ a = 4, t }) => {
  const f = useCurrentFrame();
  const o = ease(f, a, a + 8);
  return (
    <div style={{ position: "absolute", left: 96, top: 76, fontFamily: F, fontWeight: 700, fontSize: 52, color: "rgba(240,235,229,.9)", opacity: o, transform: `translateX(${(1 - o) * -20}px)`, textShadow: "0 2px 10px rgba(0,0,0,.6)" }}>
      {t}<div style={{ height: 3, width: 140 * o, background: "rgba(240,235,229,.8)", marginTop: 6 }} />
    </div>
  );
};
// anotación a mano: círculo irregular que se dibuja + flecha + texto en letra a mano, amarillo
const Scribble: React.FC<{ a: number; cx: number; cy: number; rx: number; ry: number; text: string; tx: number; ty: number }> = ({ a, cx, cy, rx, ry, text, tx, ty }) => {
  const f = useCurrentFrame();
  const p = ease(f, a, a + 14), q = ease(f, a + 10, a + 20), r = ease(f, a + 16, a + 24);
  const circ = `M${cx + rx},${cy} C${cx + rx},${cy - ry * 1.1} ${cx - rx * 1.05},${cy - ry} ${cx - rx},${cy + ry * 0.1} C${cx - rx * 0.95},${cy + ry * 1.1} ${cx + rx * 1.1},${cy + ry} ${cx + rx * 0.92},${cy - ry * 0.25}`;
  const ax = cx + rx * 0.7, ay = cy - ry * 0.9;
  const arrow = `M${tx + 40},${ty + 30} Q${(tx + ax) / 2 + 60},${ty + 10} ${ax},${ay} M${ax},${ay} l38,-6 M${ax},${ay} l10,34`;
  return (
    <AbsoluteFill>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, filter: "drop-shadow(0 2px 4px rgba(0,0,0,.6))" }}>
        <path d={circ} fill="none" stroke={GOLD} strokeWidth={12} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />
        <path d={arrow} fill="none" stroke={GOLD} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - q} />
      </svg>
      <div style={{ position: "absolute", left: tx - 120, top: ty - 40, fontFamily: "'Segoe Print','Comic Sans MS','Bradley Hand',cursive", fontWeight: 700, fontSize: 84, color: GOLD, opacity: r, transform: `rotate(-6deg) scale(${0.9 + 0.1 * r})`, textShadow: "0 3px 8px rgba(0,0,0,.7)" }}>{text}</div>
    </AbsoluteFill>
  );
};
const Aside: React.FC<{ a: number; t: string; x: number; y: number }> = ({ a, t, x, y }) => {
  const f = useCurrentFrame();
  const o = ease(f, a, a + 6);
  return (
    <div style={{ position: "absolute", left: x, top: y, padding: "12px 20px", borderRadius: 18, background: "rgba(250,248,244,.95)", color: "#1b1d22", fontFamily: F, fontWeight: 700, fontSize: 46, opacity: o, transform: `scale(${0.8 + 0.2 * o})`, transformOrigin: "0 100%", boxShadow: "0 8px 20px rgba(0,0,0,.35)" }}>
      {t}<div style={{ position: "absolute", left: 26, bottom: -16, width: 0, height: 0, borderLeft: "14px solid transparent", borderRight: "14px solid transparent", borderTop: "18px solid rgba(250,248,244,.95)" }} />
    </div>
  );
};
// pantalla partida en diagonal que barre: izquierda = una opción, derecha = la otra
const DiagSplit: React.FC<{ a: number; l: string; r: string; wl: string; wr: string }> = ({ a, l, r, wl, wr }) => {
  const f = useCurrentFrame();
  const w = ease(f, a, a + 12) * 100;
  const ph = ease(f, 0, 120);
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <AbsoluteFill style={{ filter: "saturate(.75) brightness(.8)" }}><Img src={staticFile(l)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1.05 + ph * 0.04})` }} /></AbsoluteFill>
      <AbsoluteFill style={{ clipPath: `polygon(${108 - w * 0.56}% 0, 100% 0, 100% 100%, ${100 - w * 0.56 + 8 - 16}% 100%)` }}>
        <Img src={staticFile(r)} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "saturate(.75) brightness(.8)", transform: `scale(${1.08 - ph * 0.04})` }} />
      </AbsoluteFill>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}><line x1={1920 * (1.08 - w * 0.0056)} y1={0} x2={1920 * (0.92 - w * 0.0056)} y2={1080} stroke="#f0ebe5" strokeWidth={6} opacity={w > 2 ? 1 : 0} /></svg>
      <BigWord a={4} w={wl} color={INK} size={130} x={110} y={150} />
      <BigWord a={a + 10} w={wr} color={RED} size={130} x={1230} y={150} />
    </AbsoluteFill>
  );
};
const Vig: React.FC = () => <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 50%, transparent 52%, rgba(0,0,0,.6) 100%)" }} />;
const R: React.FC<{ v: string; dur: number; from?: number; children?: React.ReactNode }> = ({ v, dur, from, children }) => (
  <AbsoluteFill><Real v={v} dur={S(dur)} from={from} z={[1.03, 1.08]} /><Vig />{children}</AbsoluteFill>
);

// plan: gancho 0-24 s a ~2,2 s por plano (medido 0-60 s) y luego una ilustrada larga que explica (mediana 6,9 s, se anima por dentro)
export const PLAN: { a: number; d: number; k: "real" | "ilus" | "g"; el: React.ReactNode; sfx?: string }[] = [];
const add = (d: number, k: "real" | "ilus" | "g", el: React.ReactNode, sfx?: string) => PLAN.push({ a: PLAN.reduce((s, p) => s + p.d, 0), d, k, el, sfx });
add(2.4, "real", <R v={VID} dur={2.4}><Build lines={["we hunt *animals.*"]} /></R>);
add(2.0, "real", <R v={FOTO[0]} dur={2.0} />);
add(6.2, "ilus", (
  <SunsetStage tree="mangrove" water horizon={600} night={0.6} pan={0.3}>
    <Person x={760} y={612} s={0.6} walk />
    <Beast img={CROC2.img} ar={CROC2.ar} x={1040} y={720} w={520} flip rim="#1f5a64" eye={[0.82, 0.32]} bob={2} />
    <Build a={10} lines={["DO NOT", "*HUNT* *US.*"]} />
  </SunsetStage>
), "revelacion");
add(1.8, "real", <R v={FOTO[1]} dur={1.8} />);
add(1.6, "real", <R v={VID} from={4} dur={1.6} />);
add(3.0, "g", (
  <SunsetStage tree="mangrove" water horizon={620} night={1} pan={0.1}>
    <Beast img={CROC1.img} ar={CROC1.ar} x={560} y={720} w={800} rim="#ff8a2a" eye={[0.86, 0.36]} />
    <BigWord a={8} w="FOUR." y={170} />
  </SunsetStage>
), "revelacion");
add(4.0, "g", <DiagSplit a={30} l={FOTO[2]} r={FOTO[3]} wl="LEAVE." wr="STAY." />);
add(3.4, "real", <R v={FOTO[2]} dur={3.4}><Label t="Saltwater Crocodile" /><Scribble a={14} cx={1060} cy={560} rx={300} ry={150} text="bag of calories." tx={560} ty={250} /></R>);
add(12.0, "ilus", <Orilla />);
add(4.5, "g", <AbsoluteFill><PhotoCards a={4} bg={FOTO[0]} cards={[FOTO[1], FOTO[3]]} /><BigWord a={20} w="99%" color={ORA} size={170} x={70} y={430} /></AbsoluteFill>);
add(3.2, "real", <R v={VID} from={8} dur={3.2}><Build a={4} lines={["a straight-up", "*ASSASSINATION.*"]} size={88} /></R>, "revelacion");
export const M1_FRAMES = S(PLAN.reduce((s, p) => s + p.d, 0));

// ilustrada larga (12 s): la orilla de día, el pescador llega, el agua se queda quieta… y algo se acerca. Siempre algo se mueve.
function Orilla() {
  const f = useCurrentFrame();
  const px = 380 + Math.min(f, 120) * 2.4;
  return (
    <SunsetStage tree="acacia" water horizon={560} pan={0.35}>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <path d="M0,600 L760,600 Q880,640 920,760 L980,1080 L0,1080 Z" fill="#4a3426" />
      </svg>
      <Person x={px} y={606} s={0.55} walk={f < 120} arms={f > 150 ? "spear" : "down"} />
      <Beast img={CROC2.img} ar={CROC2.ar} x={1500 - ease(f, 40, 330) * 380} y={700} w={420} flip rim="#1f5a64" eye={[0.82, 0.32]} bob={2} />
      <Build a={60} lines={["to consume your *calories.*"]} out={300} />
      <Aside a={200} t="ready or not..." x={1180} y={450} />
    </SunsetStage>
  );
}

export const M1: React.FC = () => (
  <AbsoluteFill style={{ background: "#000" }}>
    {PLAN.map((p, i) => <Sequence key={i} from={S(p.a)} durationInFrames={S(p.d)}>{p.el}</Sequence>)}
  </AbsoluteFill>
);
