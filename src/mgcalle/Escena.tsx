// Escena completa en el estilo del original: fondo ilustrado + familia y zombi riggeados (cutout) + contador 100 personitas,
// etiquetas HUMANS / ZOMBIES / REMOVED y el escobazo. Todo ilustración + código, cero clips de IA.
import React from "react";
import { AbsoluteFill, Img, staticFile, interpolate, spring, useCurrentFrame, useVideoConfig, Easing } from "remotion";
import { loadFont } from "@remotion/google-fonts/Baloo2";
import { Muneco, Rig, PoseMuneco } from "./Muneco";
import rAbuela from "./rigs/abuela.json";
import rPadre from "./rigs/padre.json";
import rNene from "./rigs/nene.json";
import rChica from "./rigs/chica.json";
import rZombi from "./rigs/zombi_auto.json";

const { fontFamily } = loadFont("normal", { weights: ["800"], subsets: ["latin"] });
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const lerp = (f: number, a: number[], b: number[], ease?: (t: number) => number) => interpolate(f, a, b, { ...clamp, easing: ease });
const pop = (f: number, at: number, fps: number) => spring({ frame: f - at, fps, config: { damping: 11, stiffness: 170, mass: 0.7 } });

// ───────── tiempos (cuadros a 30 fps)
const T = {
  panel: 4, fillA: 18, fillB: 64, humans: 62, zIn: 78, zStop: 190, zombies: 104, zGreen: 110,
  scared: 150, girlGo: 196, windUp: 206, swing: 224, hit: 232, removed: 240, grey: 246,
};
const WORDS: [string, number][] = [
  ["Their", 6], ["model", 16], ["has", 28], ["three", 34], ["groups:", 44], ["humans,", 62],
  ["zombies,", 104], ["and", 214], ["the", 226], ["removed.", 238],
];
const PISO = 1492;
const PIERNA_SENTADO = 82; // giro de las piernas del zombi al quedar sentado (signo a confirmar en stills)

// ───────── contador: 100 personitas, como el original (contorno celeste fino, se llenan de azul)
const Icono: React.FC<{ x: number; y: number; color: string | null; s: number }> = ({ x, y, color, s }) => (
  <g transform={`translate(${x},${y})`}>
    <g stroke="#3f8fe0" strokeWidth={1.6} fill="none" opacity={0.85}>
      <circle cx={0} cy={-34} r={9} /><path d="M-13,20 L-13,-10 Q-13,-22 0,-22 Q13,-22 13,-10 L13,20 Z" />
    </g>
    {color && (
      <g transform={`translate(0,0) scale(${s})`} fill={color}>
        <circle cx={0} cy={-34} r={9.5} /><path d="M-13.5,20.5 L-13.5,-10 Q-13.5,-22.5 0,-22.5 Q13.5,-22.5 13.5,-10 L13.5,20.5 Z" />
      </g>
    )}
  </g>
);
const COL0 = 77, PASO_X = 34.4, FILA0 = 222, PASO_Y = 95;
const Panel: React.FC<{ f: number; fps: number }> = ({ f, fps }) => {
  const a = lerp(f, [T.panel, T.panel + 10], [0, 1]);
  const iconos = [];
  for (let i = 0; i < 100; i++) {
    const r = Math.floor(i / 25), c = i % 25;
    const at = T.fillA + (i / 99) * (T.fillB - T.fillA);
    let color: string | null = f >= at ? "#3d9fe8" : null;
    let s = color ? pop(f, at, fps) : 0;
    if (i === 99 && f >= T.zGreen) { color = "#a3e04a"; s = pop(f, T.zGreen, fps) * (1 + (f < T.zGreen + 12 ? 0.3 * Math.sin(((f - T.zGreen) / 12) * Math.PI) : 0)); }
    if (i === 99 && f >= T.grey) { color = "#8d8f9e"; s = pop(f, T.grey, fps); }
    iconos.push(<Icono key={i} x={COL0 + c * PASO_X} y={FILA0 + r * PASO_Y} color={color} s={s} />);
  }
  return (
    <svg width={1080} height={700} style={{ position: "absolute", opacity: a }}>
      <rect x={47} y={165} width={888} height={390} rx={26} fill="#24125e" opacity={0.62} />
      {iconos}
    </svg>
  );
};

const Etiqueta: React.FC<{ txt: string; bg: string; borde: string; fg: string; x: number; y: number; at: number; f: number; fps: number }> = ({ txt, bg, borde, fg, x, y, at, f, fps }) => {
  if (f < at) return null;
  const p = pop(f, at, fps);
  return (
    <div style={{
      position: "absolute", left: x, top: y, transform: `scale(${p})`, transformOrigin: "50% 50%",
      background: bg, color: fg, fontFamily, fontWeight: 800, fontSize: 56, letterSpacing: 1, padding: "4px 22px 0",
      borderRadius: 8, boxShadow: `0 6px 0 ${borde}`, lineHeight: "70px",
    }}>{txt}</div>
  );
};

const Subtitulo: React.FC<{ f: number; fps: number }> = ({ f, fps }) => {
  let idx = -1;
  WORDS.forEach(([, at], i) => { if (f >= at) idx = i; });
  if (idx < 0) return null;
  const [w, at] = WORDS[idx];
  const p = pop(f, at, fps);
  return (
    <div style={{
      position: "absolute", top: 1468, width: "100%", textAlign: "center", fontFamily, fontWeight: 800, fontSize: 76, color: "#fff",
      transform: `scale(${0.75 + 0.25 * p})`, WebkitTextStroke: "3px #1a0f3a", paintOrder: "stroke fill",
      textShadow: "0 5px 0 #1a0f3a",
    }}>{w}</div>
  );
};

// sombra suave en la vereda
const Sombra: React.FC<{ x: number; w: number; o?: number }> = ({ x, w, o = 1 }) => (
  <div style={{ position: "absolute", left: x - w / 2, top: PISO - 14, width: w, height: 26, borderRadius: "50%", background: "#2a1060", opacity: 0.35 * o, filter: "blur(5px)" }} />
);

// escoba en la mano de la chica: el agarre va en la muñeca y el palo sigue la dirección del antebrazo
const Escoba: React.FC<{ rig: Rig; giro?: number }> = ({ rig, giro = 0 }) => {
  const [mx, my] = rig.puntos!.munecaI, [cx, cy] = rig.puntos!.codoI;
  const ang = (Math.atan2(my - cy, mx - cx) * 180) / Math.PI - 90;
  const s = 0.7, gx = 233 * s, gy = 230 * s;
  const ax = mx + (mx - cx) * 0.25, ay = my + (my - cy) * 0.25; // centro del puño
  return (
    <Img src={staticFile("mgcalle/escoba.png")} style={{
      position: "absolute", left: ax - gx, top: ay - gy, width: 466 * s, height: 1423 * s,
      transformOrigin: `${gx}px ${gy}px`, transform: `rotate(${ang + giro}deg)`,
    }} />
  );
};

export const Escena: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = f / fps;

  // cámara: empuje lento + mano virtual lenta (0,4-0,8 Hz) + golpe de zoom en el impacto
  const punch = f >= T.hit ? 0.03 * Math.exp(-(f - T.hit) / 8) : 0;
  const zoom = 1.02 + lerp(f, [0, 360], [0, 0.05], Easing.inOut(Easing.quad)) + punch;
  const sx = 6 * Math.sin(t * Math.PI * 2 * 0.5) + 2.5 * Math.sin(t * Math.PI * 2 * 0.8 + 1);
  const sy = 4 * Math.sin(t * Math.PI * 2 * 0.42 + 2);
  const rot = 0.3 * Math.sin(t * Math.PI * 2 * 0.37);

  // estados de la familia
  const susto = lerp(f, [T.scared - 18, T.scared], [0, 1]) * (1 - lerp(f, [T.removed + 6, T.removed + 24], [0, 1]));
  const festejo = lerp(f, [T.removed + 6, T.removed + 20], [0, 1], Easing.out(Easing.back(2)));
  const resp = (o: number) => 1.6 * Math.sin(f / 15 + o);
  const quieto = (o: number, extra: PoseMuneco = {}): PoseMuneco => ({
    brazoFrente: -3 + resp(o) - 18 * susto, brazoAtras: 3 - resp(o) + 10 * susto,
    antebrazoFrente: -6 - 40 * susto, antebrazoAtras: -4,
    cabeza: resp(o + 1) * 0.8 - 5 * susto, cuerpo: -5 * susto, bob: resp(o) * 1.5, ...extra,
  });

  // zombi: entra caminando desde la derecha y frena; el escobazo lo tira hacia atrás
  const camina = lerp(f, [T.zIn, T.zStop], [0, 1], Easing.out(Easing.quad));
  const zx = interpolate(camina, [0, 1], [1290, 830]);
  const vel = f >= T.zIn && f < T.zStop ? 1 - camina : 0;
  const ph = f * 0.19;
  const paso = Math.sin(ph) * Math.min(1, vel * 3);
  const caida = lerp(f, [T.hit, T.hit + 16], [0, 1], Easing.out(Easing.bounce));
  const HUNDE = 205; // cadera al piso (0,47 × 467 px de tobillo a cadera, menos un poco)
  const zPose: PoseMuneco = {
    piernaFrente: 16 * paso + PIERNA_SENTADO * caida, piernaAtras: -16 * paso + (PIERNA_SENTADO - 8) * caida,
    brazoFrente: 8 + 4 * Math.sin(f / 9) - 30 * caida, brazoAtras: 52 + 4 * Math.sin(f / 9 + 1.3) - 70 * caida,
    antebrazoFrente: 50 + 5 * Math.sin(f / 7), antebrazoAtras: 30 + 5 * Math.sin(f / 7 + 1),
    cabeza: -4 + 4 * Math.sin(f / 14) * (1 - caida) + 14 * caida, cuerpo: -7 + 1.5 * Math.sin(ph * 2) * (1 - caida) + 24 * caida,
    bob: -14 * Math.abs(Math.sin(ph)) * Math.min(1, vel * 3),
  };

  // chica: da dos pasos, levanta la escoba por detrás y la baja sobre el zombi
  const avanza = lerp(f, [T.girlGo, T.swing], [0, 1], Easing.inOut(Easing.quad));
  const gx = 455 + 175 * avanza;
  const pasoG = f >= T.girlGo && f < T.swing ? Math.sin((f - T.girlGo) * 0.42) : 0;
  const carga = lerp(f, [T.windUp, T.swing], [0, 1], Easing.out(Easing.quad));
  const golpe = lerp(f, [T.swing, T.hit], [0, 1], Easing.in(Easing.cubic));
  const asienta = lerp(f, [T.hit + 2, T.hit + 26], [0, 1], Easing.out(Easing.back(1.6)));
  const brazoG = f < T.windUp ? -3 : f < T.swing ? -3 + 68 * carga : f <= T.hit ? 65 - 130 * golpe : -65 + 30 * asienta;
  const giroEscoba = f < T.windUp ? 0 : f < T.swing ? 75 * carga : f <= T.hit ? 75 - 105 * golpe : -30 + 22 * asienta;
  const chicaPose: PoseMuneco = f < T.girlGo ? quieto(3) : {
    brazoFrente: brazoG, brazoAtras: brazoG * 0.6, antebrazoFrente: f < T.hit ? -25 * carga : -10, antebrazoAtras: -30,
    piernaFrente: -22 * pasoG, piernaAtras: 22 * pasoG,
    cuerpo: f < T.swing ? -8 * carga : f <= T.hit ? -8 + 20 * golpe : 12 - 8 * asienta, cabeza: 4 * golpe,
    bob: -10 * Math.abs(pasoG),
  };

  const impacto = { x: zx - 60, y: 1080 };
  const estallido = f >= T.hit && f < T.hit + 14 ? lerp(f, [T.hit, T.hit + 14], [0, 1]) : -1;
  const gris = lerp(f, [T.grey, T.grey + 14], [0, 0.85]);

  return (
    <AbsoluteFill style={{ background: "#1b1550", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `translate(${sx}px,${sy}px) scale(${zoom}) rotate(${rot}deg)`, transformOrigin: "50% 65%" }}>
        <Img src={staticFile("mgcalle/fondo_calle.png")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />

        {/* escoba apoyada contra la cerca hasta que la chica la agarra */}
        {f < T.girlGo && (
          <Img src={staticFile("mgcalle/escoba.png")} style={{ position: "absolute", left: 600, top: PISO - 330, width: 466 * 0.26, height: 1423 * 0.26,
            transformOrigin: "50% 100%", transform: "rotate(14deg)" }} />
        )}
        {/* familia, de atrás hacia adelante */}
        <Sombra x={265} w={200} /><Sombra x={110} w={190} /><Sombra x={360} w={160} /><Sombra x={gx} w={190} />
        <Muneco rig={rPadre as Rig} carpeta="mgcalle/padre" x={250} y={PISO - 6} escala={0.43}
          pose={quieto(1.2, { brazoFrente: -3 + resp(1.2) - 18 * susto - 70 * festejo, antebrazoFrente: -6 - 40 * susto - 45 * festejo })} />
        <Muneco rig={rAbuela as Rig} carpeta="mgcalle/abuela" x={105} y={PISO} escala={0.405}
          pose={quieto(0, { brazoFrente: -3 + resp(0) - 18 * susto - 35 * festejo, antebrazoFrente: -6 - 40 * susto - 60 * festejo })} />
        <Muneco rig={rNene as Rig} carpeta="mgcalle/nene" x={350} y={PISO + 4} escala={0.375}
          pose={quieto(2.1, { brazoFrente: -3 - 18 * susto - 75 * festejo, brazoAtras: 3 + 10 * susto + 70 * festejo, antebrazoFrente: -6 - 40 * susto - 40 * festejo,
            bob: resp(2.1) * 1.5 - 30 * festejo * Math.abs(Math.sin(f / 5)) })} />
        <Muneco rig={rChica as Rig} carpeta="mgcalle/chica" x={gx} y={PISO + 8} escala={0.415} pose={chicaPose}
          enMano={f >= T.girlGo ? { pieza: "antebrazoFrente", nodo: <Escoba rig={rChica as Rig} giro={giroEscoba} /> } : undefined} />

        {/* rastro del escobazo */}
        {f >= T.swing + 2 && f < T.hit + 8 && (
          <svg width={1080} height={1920} style={{ position: "absolute" }}>
            <path d={`M${gx - 40},${930} A300,300 0 0 1 ${gx + 300},${1090}`} stroke="#fff" strokeWidth={28} fill="none" strokeLinecap="round"
              opacity={0.4 * (1 - lerp(f, [T.hit, T.hit + 8], [0, 1]))} />
          </svg>
        )}

        {/* zombi */}
        {f >= T.zIn && (
          <div style={{ position: "absolute", inset: 0, filter: `grayscale(${gris}) brightness(${1 - gris * 0.15})`,
            opacity: 1 }}>
            <Sombra x={zx - 40 * caida} w={200 + 140 * caida} />
            <div style={{ position: "absolute", inset: 0, transform: `translate(${40 * caida}px, ${HUNDE * caida}px)` }}>
              <Muneco rig={rZombi as Rig} carpeta="mgcalle/zombi_auto" x={zx} y={PISO + 4} escala={0.47} pose={zPose} />
            </div>
          </div>
        )}

        {estallido >= 0 && (
          <svg width={1080} height={1920} style={{ position: "absolute" }}>
            <g transform={`translate(${impacto.x},${impacto.y})`} opacity={1 - estallido}>
              {Array.from({ length: 10 }, (_, i) => {
                const a = (i / 10) * Math.PI * 2 + 0.3, r0 = 30 + 60 * estallido, r1 = 70 + 130 * estallido;
                return <line key={i} x1={Math.cos(a) * r0} y1={Math.sin(a) * r0} x2={Math.cos(a) * r1} y2={Math.sin(a) * r1}
                  stroke="#fff6c4" strokeWidth={12 * (1 - estallido) + 2} strokeLinecap="round" />;
              })}
              <circle r={50 * (1 - estallido) + 10} fill="#fff6c4" opacity={0.7} />
            </g>
          </svg>
        )}

        <Panel f={f} fps={fps} />
        <Etiqueta txt="HUMANS" bg="#3d9fe8" borde="#2a6fb0" fg="#fff" x={150} y={590} at={T.humans} f={f} fps={fps} />
        <Etiqueta txt="ZOMBIES" bg="#8ad43e" borde="#5c9a22" fg="#173307" x={565} y={590} at={T.zombies} f={f} fps={fps} />
        <Etiqueta txt="REMOVED" bg="#8d8f9e" borde="#62647a" fg="#fff" x={565} y={694} at={T.removed} f={f} fps={fps} />
        {f >= T.zombies && (
          <svg width={1080} height={800} style={{ position: "absolute" }}>
            <polyline points={`900,${600} 900,${FILA0 + 3 * PASO_Y + 24} ${COL0 + 24 * PASO_X},${FILA0 + 3 * PASO_Y + 24}`} stroke="#a3e04a" strokeWidth={4} fill="none"
              strokeDasharray="200" strokeDashoffset={200 * (1 - lerp(f, [T.zombies + 4, T.zombies + 14], [0, 1]))} />
          </svg>
        )}
      </AbsoluteFill>
      <Subtitulo f={f} fps={fps} />
    </AbsoluteFill>
  );
};
