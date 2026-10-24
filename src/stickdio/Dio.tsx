import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { loadFont as oswald } from "@remotion/google-fonts/Oswald";
import { CamaraMano } from "../kits/camara/CamaraMano";
import { Cam, F, FPS, SUELO, aPantalla, andar, at, clamp, desenfoque, lerp, recorrido, rnd, seco, suave } from "../stickcine/lib";
import { Borde, Figura, Look, PARADO, Pose, SENTADO, caminar, con, giros, secuencia } from "../stickcine/rig";

oswald("normal", { weights: ["700"], subsets: ["latin"] });

// Prueba "diorama de papel iluminado": el tramo 18,0–43,1 s de la voz de la cafetería.
// Mundo = maqueta de cartulina en capas, UNA luz (arriba a la izquierda), marionetas de cartulina negra.
export const T0 = 18.0;
export const DUR = 753; // 25,1 s

const ERNESTO: Look = { color: "#17130f", ancho: 11, papel: true };
const MATON: Look = { color: "#0f0d0b", ancho: 14, escala: 1.22, gorra: true, papel: true };
const MARTA: Look = { color: "#1a1511", ancho: 10, rodete: true, delantal: "#e9dccb", papel: true };
const JOVEN: Look = { color: "#141318", ancho: 10, vincha: "#c8302a", guantes: "#c8302a", papel: true };
const RIVAL: Look = { color: "#18161c", ancho: 10.5, guantes: "#2f5fc8", papel: true };
const REFERI: Look = { color: "#1a1a1e", ancho: 9.5, mono: "#f2f2f2", papel: true };

// luz cálida de la lámpara (arriba a la izquierda) → canto iluminado sólo de ese lado
const CANTO: Borde[] = [{ dx: -2.6, dy: -2.6, color: "#ffcf8a", op: 0.85 }];
const CANTO_FRIO: Borde[] = [{ dx: -2.4, dy: -2.8, color: "#cfdcff", op: 0.85 }];

const V = {
  entro: at("entro alguien"),
  grande: at("un tipo grande"),
  todo: at("todo el mundo"),
  mire: at("mire"),
  patea: at("pateo la silla"),
  tira: at("tiro el cafe encima"),
  rie: at("se rio"),
  ernesto: at("ernesto se limpio"),
  limpio: at("se limpio la mano"),
  despacio: at("despacio"),
  pie: at("se puso de pie"),
  noSabia: at("lo que ese tipo"),
  campeon: at("campeon sudamericano"),
  n32: at("32 peleas"),
  derrota: at("ni una sola derrota"),
};

// planos (segundos globales de la voz)
const P2 = 21.0; // contrapicado
const P3 = 25.6; // plano medio: patada
const P4 = 27.0; // inserto de la taza
const P5 = 29.0; // risa → mano → se para → dolly al cuadro (un solo movimiento)
const PORTAL = [36.5, 37.15] as const; // corte por forma: el cuadro se abre y es el ring
const FIN = 43.1;

// ---------- capa con imágenes HTML (Remotion espera a <Img>; <image> de SVG no) ----------
type Foto = { src: string; x: number; y: number; w: number; h: number };
const Lam: React.FC<{
  D: number;
  cam: Cam;
  fotos?: Foto[];
  children?: React.ReactNode;
  extra?: number;
  sombra?: boolean;
  filtro?: string;
  opacidad?: number;
  mezcla?: React.CSSProperties["mixBlendMode"];
}> = ({ D, cam, fotos = [], children, extra = 0, sombra, filtro = "", opacidad = 1, mezcla }) => {
  const dist = D - cam.cz;
  const cerca = clamp((dist - 70) / 150, 0, 1);
  if (cerca <= 0 || opacidad <= 0) return null;
  const k = F / D;
  const m = D / dist;
  const b = desenfoque(D, cam) + extra;
  // sombra dura de cartulina: la luz viene de arriba a la izquierda → cae abajo a la derecha
  const sh = sombra ? ` drop-shadow(${(9 * m).toFixed(1)}px ${(6 * m).toFixed(1)}px ${(1.2 * m).toFixed(1)}px rgba(38,16,6,0.5))` : "";
  const W = 12000;
  const H = 6000;
  return (
    <AbsoluteFill style={{ filter: `blur(${b.toFixed(2)}px)${sh} ${filtro}`, opacity: opacidad * cerca, mixBlendMode: mezcla }}>
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          transformOrigin: "0 0",
          transform: `translate(960px,540px) scale(${m}) translate(${-cam.cx * k}px,${-cam.cy * k}px)`,
        }}
      >
        {fotos.map((f, i) => (
          <Img key={i} src={staticFile(f.src)} style={{ position: "absolute", left: f.x - f.w / 2, top: f.y - f.h / 2, width: f.w, height: f.h }} />
        ))}
        <svg width={W} height={H} viewBox={`${-W / 2} ${-H / 2} ${W} ${H}`} style={{ position: "absolute", left: -W / 2, top: -H / 2, overflow: "visible" }}>
          {children}
        </svg>
      </div>
    </AbsoluteFill>
  );
};

// piso de tiras de cartulina: cada tira a su profundidad, con el borde de arriba cortado a mano
const suelo = (D: number) => (SUELO * F) / D;
const Tira: React.FC<{ D: number; color: string; canto: string; seed: number }> = ({ D, color, canto, seed }) => {
  const r = rnd(seed);
  const y0 = suelo(D) - 4;
  const pts: string[] = [];
  for (let x = -4000; x <= 4000; x += 70) pts.push(`${x},${(y0 + (r() - 0.5) * 3).toFixed(1)}`);
  return (
    <g>
      <polygon points={`-4000,2400 ${pts.join(" ")} 4000,2400`} fill={color} />
      <polyline points={pts.join(" ")} stroke={canto} strokeWidth={3} fill="none" />
    </g>
  );
};
const PISO: [number, string, string][] = [
  [1400, "#9a5636", "#c98a5e"],
  [1250, "#8a4a2e", "#bf7c52"],
  [1120, "#7c4029", "#b26e48"],
  [1000, "#6e3824", "#a5623f"],
];

// la luz-linterna: lo que la voz nombra queda iluminado, el resto cae en penumbra cálida
const Linterna: React.FC<{ x: number; y: number; r: number; osc: number; frio?: boolean }> = ({ x, y, r, osc, frio }) => {
  const c = frio ? [36, 44, 70] : [70, 38, 24];
  const col = `rgb(${lerp(255, c[0], osc).toFixed(0)},${lerp(250, c[1], osc).toFixed(0)},${lerp(240, c[2], osc).toFixed(0)})`;
  return (
    <AbsoluteFill
      style={{
        mixBlendMode: "multiply",
        background: `radial-gradient(ellipse ${r * 1.25}px ${r}px at ${960 + x}px ${540 + y}px, rgb(255,250,240) 0%, rgb(255,250,240) 32%, ${col} 100%)`,
      }}
    />
  );
};

// ---------- utilería de cartulina ----------
const Silla: React.FC<{ x: number; rot?: number; dx?: number }> = ({ x, rot = 0, dx = 0 }) => {
  const X = x + dx;
  return (
    <g transform={`rotate(${rot} ${X - 40} ${SUELO})`}>
      <path d={`M${X - 40},${SUELO} L${X - 34},${236} M${X + 36},${SUELO} L${X + 30},${236}`} stroke="#5e2617" strokeWidth={8} strokeLinecap="round" />
      <path d={`M${X - 36},${236} L${X - 40},${112} Q${X - 40},${92} ${X - 22},${96}`} stroke="#8e3f27" strokeWidth={9} fill="none" strokeLinecap="round" />
      <rect x={X - 46} y={226} width={92} height={14} rx={6} fill="#8e3f27" />
      <path d={`M${X - 44},${227} L${X + 44},${227}`} stroke="#d98a5a" strokeWidth={2.5} strokeLinecap="round" />
    </g>
  );
};
const Mesa: React.FC<{ x: number }> = ({ x }) => (
  <g>
    <path d={`M${x - 46},${SUELO} Q${x},${SUELO - 14} ${x + 46},${SUELO} Z`} fill="#24303a" />
    <rect x={x - 6} y={204} width={12} height={SUELO - 204} fill="#24303a" />
    <rect x={x - 70} y={200} width={140} height={6} fill="#b5532f" />
    <rect x={x - 72} y={194} width={144} height={7} rx={3} fill="#d9a441" />
    <path d={`M${x - 70},${194.5} L${x + 70},${194.5}`} stroke="#f5d48a" strokeWidth={2} />
  </g>
);
const TazaMesa: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <g>
    <ellipse cx={x} cy={y} rx={17} ry={3} fill="#efe3cc" />
    <path d={`M${x - 11},${y - 17} L${x + 11},${y - 17} L${x + 8},${y - 1} L${x - 8},${y - 1} Z`} fill="#efe3cc" />
    <rect x={x - 11} y={y - 12} width={22} height={4} fill="#b5532f" />
    <path d={`M${x + 10},${y - 14} q9,1 6,8 q-2,4 -8,3`} stroke="#efe3cc" strokeWidth={3} fill="none" />
  </g>
);
const Sombra: React.FC<{ x: number; w?: number; D?: number }> = ({ x, w = 46, D = F }) => (
  <ellipse cx={x + 10} cy={suelo(D) + 2} rx={w} ry={6} fill="#2a1206" opacity={0.45} />
);
// la foto del cuadro: el boxeador joven en guardia, en papel de foto viejo (se planta desde el plano 1)
const FOTO = { x: -232, y: -246, w: 144, h: 214 };
const FotoBoxeador: React.FC<{ t: number }> = ({ t }) => {
  const G = con(PARADO, { brazo: [40, 30], ante: [150, 140], torso: 8, muslo: [14, -10], pierna: [4, -10], y: SUELO - 122 });
  return (
    <g>
      <rect x={FOTO.x - FOTO.w / 2} y={FOTO.y - FOTO.h / 2} width={FOTO.w} height={FOTO.h} fill="#e3cfa6" />
      <rect x={FOTO.x - FOTO.w / 2} y={FOTO.y + 54} width={FOTO.w} height={FOTO.h / 2 - 54} fill="#cdb284" />
      <g transform={`translate(${FOTO.x - 8},${FOTO.y + 72}) scale(0.44) translate(0,${-SUELO})`}>
        <Figura x={0} P={G} mira={1} look={{ ...JOVEN, vincha: "#7a3a2a", guantes: "#7a3a2a" }} t={t} cara={{ giro: 0.2, sonrisa: 0, parpado: 0, enojo: 0.6 }} />
      </g>
      {[FOTO.y + 14, FOTO.y + 37].map((y, i) => (
        <line key={i} x1={FOTO.x - FOTO.w / 2} x2={FOTO.x + FOTO.w / 2} y1={y} y2={y} stroke="#8a3a2a" strokeWidth={5} opacity={0.85} />
      ))}
    </g>
  );
};

// ---------- personajes de la cafetería ----------
const ERNESTO_X = 0;
const MESA_X = 150;
const MATON_X = -150;
const MARTA_X = 400;

const ernesto = (t: number) => {
  const TAZA_ABAJO: Pose = con(SENTADO, { brazo: [26, 14], ante: [110, 64] });
  const SORBO: Pose = con(SENTADO, { brazo: [22, 14], ante: [168, 64], cabeza: -8 });
  const APOYA: Pose = con(SENTADO, { brazo: [62, 14], ante: [78, 64], torso: 6 });
  const SACUDE: Pose = con(SENTADO, { torso: 22, cabeza: 14, brazo: [70, 40], ante: [110, 90] });
  const MOJADO: Pose = con(SENTADO, { brazo: [40, 14], ante: [96, 64], torso: 10, cabeza: 16 });
  const LIMPIA: Pose = con(SENTADO, { brazo: [30, 38], ante: [92 + 9 * Math.sin(t * 5), 104 - 9 * Math.sin(t * 5)], torso: 6, cabeza: 18 });
  const QUIETO: Pose = con(SENTADO, { brazo: [30, 34], ante: [92, 100], torso: 2, cabeza: 4 });
  const JUNTA: Pose = con(SENTADO, { torso: 28, brazo: [20, 20], ante: [40, 40], cabeza: 6 });
  const respira = Math.sin(t * 1.7) * 1.2;
  const PIE: Pose = con(PARADO, { brazo: [14, 10], ante: [40, 34], torso: -2 + respira * 0.5, cabeza: -4 });
  const P = secuencia(
    t,
    [
      [0, TAZA_ABAJO],
      [18.6, SORBO, 0.45],
      [19.4, TAZA_ABAJO, 0.4],
      [20.1, APOYA, 0.45],
      [V.patea + 0.24, SACUDE, 0.14],
      [V.patea + 0.8, APOYA, 0.5],
      [V.tira + 0.3, MOJADO, 0.2],
      [V.ernesto + 0.2, MOJADO, 0.3],
      [V.limpio + 0.1, LIMPIA, 0.4],
      [V.despacio, QUIETO, 0.4],
      [V.pie - 0.1, JUNTA, 0.35],
      [V.pie + 0.45, PIE, 0.5],
    ],
    true,
  );
  const g = giros(t, 1, [[V.pie + 0.15, -1]], 0.25);
  const taza = t < 20.0 ? 0 : undefined;
  const x = ERNESTO_X - 14 * suave(t, V.pie, V.pie + 0.5) + 26 * seco(t, V.patea + 0.1, V.patea + 0.35);
  const mirada = suave(t, V.ernesto - 0.1, V.ernesto + 0.3) * (1 - suave(t, V.limpio + 0.2, V.limpio + 0.5));
  return { x, P, mira: g.mira, taza, cara: { giro: g.bump * 0.9 + 0.1, sonrisa: 0, parpado: mirada * 0.5, enojo: 0.35 * suave(t, V.pie, V.pie + 0.4) } };
};

const maton = (t: number) => {
  const PECHO: Pose = con(PARADO, { torso: -7, brazo: [32, 30], ante: [-34, -30], cabeza: -6 });
  const CARGA: Pose = con(PECHO, { muslo: [-24, -4], pierna: [-40, -4], torso: 4 });
  const PATADA: Pose = con(PARADO, { muslo: [44, -6], pierna: [54, -8], torso: -12, y: SUELO - 126 });
  const RISA: Pose = con(PARADO, { torso: -16 + 4 * Math.sin(t * 16), brazo: [28, 34], ante: [-30, -36], cabeza: -14 + 3 * Math.sin(t * 16) });
  const DUDA: Pose = con(PARADO, { torso: -12, brazo: [20, 24], ante: [10, 20], cabeza: -4 });
  const mov = andar(t, [
    [V.entro + 0.1, -1150],
    [21.5, MATON_X],
  ]);
  const W = { ...caminar(mov.dist / 70, mov.amp), torso: -4 };
  const P = secuencia(
    t,
    [
      [0, W],
      [21.7, PECHO, 0.35],
      [V.patea - 0.05, CARGA, 0.25],
      [V.patea + 0.12, PATADA, 0.13],
      [V.patea + 0.6, PECHO, 0.35],
      [V.rie + 0.15, RISA, 0.25],
      [V.pie + 0.2, RISA, 0.1],
      [V.pie + 0.6, DUDA, 0.35],
    ],
    true,
  );
  const risa = suave(t, V.rie, V.rie + 0.2) * (1 - suave(t, V.pie + 0.2, V.pie + 0.5));
  return { x: mov.x, P: t < 21.6 ? W : P, cara: { giro: 0.15, sonrisa: 0, parpado: 0, enojo: 0.7 * (1 - risa), boca: risa * (0.6 + 0.3 * Math.sin(t * 16)) } };
};

// ---------- cámaras ----------
const camCafe = (t: number): Cam => {
  if (t < P2) return { ...recorrido(t, [[18.0, -130, -50, 270], [P2, -100, -40, 360]]), foco: F, ap: 6 };
  if (t < P4) {
    const r = recorrido(t, [[P3, -50, -10, 350], [P4, -75, -20, 395]]);
    // el golpe de la patada sacude la maqueta (una vez, se apaga rápido)
    const u = t - (V.patea + 0.12);
    const sac = u > 0 ? Math.exp(-u * 9) * Math.sin(u * 60) * 7 : 0;
    return { ...r, cy: r.cy + sac, foco: F, ap: 10 };
  }
  const r = recorrido(t, [
    [P5, -175, -40, 470],
    [29.9, -125, -30, 500],
    [31.0, -15, 0, 560],
    [31.9, -5, 0, 575],
    [32.6, -20, -40, 520],
    [33.9, -70, -100, 420],
    [34.9, -150, -190, 430],
    [36.1, -260, -300, 640],
    [37.3, -330, -350, 820],
  ]);
  return { ...r, foco: t < 33.9 ? F : lerp(F, 1400, suave(t, 34.2, 35.6)), ap: 12 };
};
const camBajo = (t: number): Cam => ({ ...recorrido(t, [[P2, -30, 90, 540], [23.0, -10, 80, 570], [P3, 0, 60, 600]]), foco: F, ap: 5 });
const camInserto = (t: number): Cam => ({ ...recorrido(t, [[P4, -60, 0, 40], [P5, -90, -5, 170]]), foco: 1400, ap: 4 });
const camRing = (t: number): Cam => ({
  ...recorrido(t, [
    [PORTAL[0], -190, 120, 600],
    [37.5, -140, 80, 540],
    [39.3, -70, 40, 480],
    [41.3, -50, 40, 490],
    [FIN, -40, 55, 520],
  ]),
  foco: F,
  ap: 4,
});

// ---------- escena: cafetería (planos 1, 3, 5, 6) ----------
const Cafeteria: React.FC<{ t: number; cam: Cam }> = ({ t, cam }) => {
  const E = ernesto(t);
  const B = maton(t);
  const sillaRot = -84 * seco(t, V.pie + 0.25, V.pie + 0.6);
  const sillaDx = 26 * seco(t, V.patea + 0.1, V.patea + 0.35) - 30 * suave(t, V.pie + 0.1, V.pie + 0.5);
  const tazaEnMesa = t >= 20.0 && t < V.tira + 0.2;
  const puerta = suave(t, V.entro - 0.2, V.entro + 0.4) * (1 - suave(t, 21.6, 22.6));
  const mP = secuencia(t, [
    [0, con(PARADO, { brazo: [40, -3], ante: [95 + 12 * Math.sin(t * 3), 2] })],
    [V.patea + 0.4, con(PARADO, { brazo: [20, -3], ante: [30, 2], torso: -6 }), 0.3],
  ]);
  const sCafe: Foto = { src: "stickdio/cafe_fondo.jpg", x: 0, y: -40, w: 2624 * 0.8, h: 1472 * 0.8 };
  return (
    <AbsoluteFill style={{ backgroundColor: "#2a160c" }}>
      <Lam D={1400} cam={cam} fotos={[sCafe]} filtro="brightness(0.92) saturate(0.9)">
        <FotoBoxeador t={t} />
      </Lam>
      <Lam D={1400} cam={cam}>
        <Tira D={1400} color={PISO[0][1]} canto={PISO[0][2]} seed={1} />
      </Lam>
      <Lam D={1250} cam={cam}>
        <Tira D={1250} color={PISO[1][1]} canto={PISO[1][2]} seed={2} />
      </Lam>
      {/* Marta detrás de la barra */}
      <Lam D={1180} cam={cam} sombra>
        <g transform={`translate(0,${suelo(1180) - SUELO})`}>
          <Figura x={MARTA_X} P={mP} mira={-1} look={MARTA} t={t} cara={{ giro: 0.15 + 0.7 * suave(t, V.patea + 0.3, V.patea + 0.6), sonrisa: 0, parpado: 0, boca: 0.4 * suave(t, V.patea + 0.3, V.patea + 0.6) }} bordes={CANTO} />
        </g>
      </Lam>
      <Lam D={1150} cam={cam} sombra fotos={[{ src: "stickdio/cafe_barra.png", x: 560, y: suelo(1150) + 8 - 144, w: 650, h: 288 }]} />
      <Lam D={1120} cam={cam}>
        <Tira D={1120} color={PISO[2][1]} canto={PISO[2][2]} seed={3} />
      </Lam>
      <Lam D={1000} cam={cam}>
        <Tira D={1000} color={PISO[3][1]} canto={PISO[3][2]} seed={4} />
        <Sombra x={E.x} />
        <Sombra x={B.x} w={56} />
        <Sombra x={MESA_X} w={50} />
      </Lam>
      {/* la puerta abierta tira una cuña de luz fría por el piso (difusa, se apaga hacia adentro) */}
      <Lam D={1000} cam={cam} extra={14} mezcla="screen" opacidad={puerta}>
        <defs>
          <linearGradient id="cuna" x1="0" y1="0" x2="1" y2="0.4">
            <stop offset="0" stopColor="#9fb8e8" stopOpacity={0.55} />
            <stop offset="1" stopColor="#9fb8e8" stopOpacity={0} />
          </linearGradient>
        </defs>
        <polygon points="-1250,-380 -900,-380 -250,330 -1300,330" fill="url(#cuna)" />
      </Lam>
      <Lam D={1000} cam={cam} sombra>
        <Silla x={ERNESTO_X} rot={sillaRot} dx={sillaDx} />
        <Figura x={B.x} P={B.P} mira={1} look={MATON} t={t} cara={B.cara} bordes={CANTO} />
        <Figura x={E.x} P={E.P} mira={E.mira} look={ERNESTO} t={t} cara={E.cara} taza={E.taza} vapor={t < 19.6} bordes={CANTO} />
        <Mesa x={MESA_X} />
        {tazaEnMesa && <TazaMesa x={MESA_X - 30} y={194} />}
        {t >= V.tira + 0.2 &&
          [
            [-36, 5],
            [-8, 8],
            [22, 4],
          ].map(([dx, r], i) => <ellipse key={i} cx={MESA_X + dx} cy={194} rx={r * 1.8} ry={1.6} fill="#3b2014" />)}
      </Lam>
      <Lam D={820} cam={cam} sombra fotos={[{ src: "stickdio/cafe_planta.png", x: 860, y: suelo(820) + 10 - 334, w: 280, h: 669 }]} />
    </AbsoluteFill>
  );
};

// ---------- plano 2: contrapicado del grandote ----------
const Contrapicado: React.FC<{ t: number }> = ({ t }) => {
  const cam = camBajo(t);
  const PECHO: Pose = con(PARADO, { torso: -9, muslo: [16, -16], pierna: [12, -12], y: SUELO - 122, brazo: [48, -40], ante: [-70, 70], cabeza: -10 + 6 * suave(t, V.mire - 0.3, V.mire + 0.2) });
  const mov = andar(t, [
    [P2, -420],
    [21.9, 0],
  ]);
  const W = { ...caminar(mov.dist / 70, mov.amp), torso: -4 };
  const P = secuencia(t, [
    [0, W],
    [22.2, PECHO, 0.4],
  ], true);
  // mira a todos de a uno y a "mire" clava los ojos en la cámara
  const barrido = suave(t, V.todo - 0.2, V.todo + 0.6) * (1 - suave(t, V.mire - 0.3, V.mire));
  const giro = 0.15 + 0.5 * barrido * (0.5 + 0.5 * Math.sin(t * 3)) + 0.85 * suave(t, V.mire - 0.3, V.mire + 0.1);
  const [lx, ly] = aPantalla(0, -40, F, cam);
  return (
    <AbsoluteFill style={{ backgroundColor: "#2a160c" }}>
      <Lam D={1500} cam={cam} fotos={[{ src: "stickdio/techo.jpg", x: 0, y: -365, w: 2624 * 1.1, h: 1472 * 1.1 }]} filtro="brightness(0.95)" />
      <Lam D={1250} cam={cam}>
        <Tira D={1250} color={PISO[1][1]} canto={PISO[1][2]} seed={2} />
      </Lam>
      <Lam D={1000} cam={cam}>
        <Tira D={1000} color={PISO[3][1]} canto={PISO[3][2]} seed={4} />
        <Sombra x={mov.x} w={56} />
      </Lam>
      <Lam D={1000} cam={cam} sombra>
        <Figura x={mov.x} P={P} mira={1} look={MATON} t={t} cara={{ giro: Math.min(1, giro), sonrisa: 0, parpado: 0, enojo: 0.8 }} bordes={CANTO} />
      </Lam>
      <Linterna x={lx} y={ly} r={620} osc={0.5} />
    </AbsoluteFill>
  );
};

// ---------- plano 4: inserto de la taza ----------
const PLATO = { x: (990 - 1312) * 0.82, y: (727 - 736) * 0.82 };
const Inserto: React.FC<{ t: number }> = ({ t }) => {
  const cam = camInserto(t);
  // la mano pasa barriendo de izquierda a derecha
  const ida = seco(t, V.tira - 0.05, V.tira + 0.4);
  const hx = lerp(-1500, 1100, ida);
  const hy = -70 + 60 * Math.sin(ida * Math.PI) * -0.5;
  const tGolpe = V.tira - 0.05 + 0.4 * 0.32; // la mano llega al plato a ~1/3 del recorrido (curva seca)
  const u = Math.max(0, t - tGolpe);
  const vuela = t > tGolpe;
  const cx = PLATO.x + (vuela ? 1900 * u : 0);
  const cy = PLATO.y - 70 + (vuela ? -700 * u + 2600 * u * u : 0);
  const crot = vuela ? 760 * u : 0;
  const r = rnd(77);
  const gotas = Array.from({ length: 11 }, () => ({ vx: 500 + r() * 1300, vy: -900 + r() * 500, s: 9 + r() * 16, mesa: 70 + r() * 90 }));
  const [lx, ly] = aPantalla(PLATO.x, PLATO.y, 1400, cam);
  return (
    <AbsoluteFill style={{ backgroundColor: "#2a160c" }}>
      <Lam D={1400} cam={cam} fotos={[{ src: "stickdio/insert_mesa.jpg", x: 0, y: 0, w: 2624 * 0.82, h: 1472 * 0.82 }]}>
        {!vuela && <ellipse cx={PLATO.x + 16} cy={PLATO.y + 2} rx={120} ry={18} fill="#3a1e10" opacity={0.35} />}
        {vuela &&
          gotas.map((g, i) => {
            const gx = PLATO.x + g.vx * u;
            const gy = PLATO.y - 110 + g.vy * u + 2600 * u * u;
            const piso = PLATO.y + g.mesa;
            return gy < piso ? (
              <circle key={i} cx={gx} cy={gy} r={g.s} fill="#3b2014" />
            ) : (
              <ellipse key={i} cx={gx} cy={piso} rx={g.s * 2.2} ry={g.s * 0.5} fill="#3b2014" />
            );
          })}
        <g transform={`rotate(${crot} ${cx} ${cy})`}>
          <path d={`M${cx - 105},${cy - 75} L${cx + 105},${cy - 75} L${cx + 80},${cy + 72} L${cx - 80},${cy + 72} Z`} fill="#efe3cc" />
          <path d={`M${cx - 105},${cy - 75} L${cx - 80},${cy + 72}`} stroke="#fff7e6" strokeWidth={6} />
          <rect x={cx - 98} y={cy - 30} width={196} height={30} fill="#b5532f" />
          <ellipse cx={cx} cy={cy - 75} rx={105} ry={20} fill="#efe3cc" />
          <ellipse cx={cx} cy={cy - 73} rx={88} ry={14} fill="#3b2014" />
          <path d={`M${cx + 96},${cy - 50} q70,6 46,66 q-14,26 -62,22`} stroke="#efe3cc" strokeWidth={22} fill="none" />
        </g>
        {/* el brazo del grandote: cartulina negra con canto cálido arriba */}
        <g>
          <path d={`M${hx - 1400},${hy - 520} L${hx},${hy}`} stroke="#ffcf8a" strokeWidth={96} strokeLinecap="round" opacity={0.7} transform="translate(-4,-5)" />
          <path d={`M${hx - 1400},${hy - 520} L${hx},${hy}`} stroke="#0f0d0b" strokeWidth={96} strokeLinecap="round" />
          <circle cx={hx - 700} cy={hy - 260} r={14} fill="#9c8a6c" stroke="#3a2c1c" strokeWidth={2} />
        </g>
      </Lam>
      <Linterna x={lx} y={ly} r={720} osc={0.4} />
    </AbsoluteFill>
  );
};

// ---------- plano 7: el ring (recuerdo, luz fría) ----------
const Cartel: React.FC<{ x: number; y: number; texto: string; color: string; t: number; t0: number }> = ({ x, y, texto, color, t, t0 }) => {
  const u = interpolate(t, [t0 - 0.45, t0 + 0.1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.back(1.7)) });
  if (u <= 0) return null;
  const Y = lerp(y - 900, y, u);
  const tt = t - (t0 + 0.1);
  const rot = tt > 0 ? 5 * Math.exp(-tt * 2.6) * Math.sin(tt * 8) : 0;
  return (
    <g transform={`rotate(${rot} ${x} ${Y - 600})`}>
      <line x1={x - 178} y1={Y - 1600} x2={x - 178} y2={Y - 62} stroke="#d8c8a8" strokeWidth={3} />
      <line x1={x + 178} y1={Y - 1600} x2={x + 178} y2={Y - 62} stroke="#d8c8a8" strokeWidth={3} />
      <path d={`M${x - 205},${Y - 72} L${x + 203},${Y - 76} L${x + 208},${Y + 74} L${x - 200},${Y + 78} Z`} fill="#c99a5e" />
      <path d={`M${x - 205},${Y - 72} L${x + 203},${Y - 76}`} stroke="#ecc58a" strokeWidth={4} />
      <circle cx={x - 178} cy={Y - 56} r={7} fill="#5a4024" />
      <circle cx={x + 178} cy={Y - 58} r={7} fill="#5a4024" />
      <text x={x} y={Y + 34} textAnchor="middle" fontFamily="Oswald" fontWeight={700} fontSize={72} fill={color}>
        {texto}
      </text>
    </g>
  );
};
const Ring: React.FC<{ t: number }> = ({ t }) => {
  const cam = camRing(t);
  const c0 = V.campeon + 0.6;
  const golpes = [c0, c0 + 0.45, c0 + 0.9];
  const G = (s: number): Pose => con(PARADO, { brazo: [40, 30], ante: [150, 140], torso: 8 + Math.sin(s * 7) * 2, muslo: [14, -10], pierna: [4, -10], y: SUELO - 122 });
  const g0 = G(t);
  const JAB = con(g0, { brazo: [95, 30], ante: [92, 140], torso: 14 });
  const RECTO = con(g0, { brazo: [40, 95], ante: [150, 92], torso: 20 });
  const GANCHO = con(g0, { brazo: [110, 30], ante: [40, 140], torso: 22 });
  const ARRIBA = con(PARADO, { brazo: [6, 148], ante: [10, 158] });
  const dTiempo = at("derrota", V.derrota);
  const eP = secuencia(
    t,
    [
      [0, g0],
      [golpes[0], JAB, 0.09],
      [golpes[0] + 0.2, g0, 0.15],
      [golpes[1], RECTO, 0.09],
      [golpes[1] + 0.2, g0, 0.15],
      [golpes[2], GANCHO, 0.1],
      [golpes[2] + 0.4, g0, 0.3],
      [dTiempo + 0.1, ARRIBA, 0.45],
    ],
    true,
  );
  const ex = -200 + 14 * Math.sin(t * 3) * (1 - suave(t, dTiempo - 0.4, dTiempo));
  const pega = golpes.map((g) => Math.sin(clamp((t - g - 0.06) / 0.3, 0, 1) * Math.PI));
  const cae = seco(t, golpes[2] + 0.15, golpes[2] + 0.75);
  const rP = con(G(t + 1.3), { torso: 8 - 20 * (pega[0] + pega[1]) - 30 * pega[2], cabeza: -20 * (pega[0] + pega[1] + pega[2]) });
  const rx = -40 + 18 * (pega[0] + pega[1]) + 40 * cae;
  const refX = 290 - 370 * suave(t, dTiempo - 0.9, dTiempo - 0.1);
  const refP = secuencia(t, [[0, PARADO], [dTiempo + 0.1, con(PARADO, { brazo: [6, 130], ante: [10, 140] }), 0.4]]);
  const gana = suave(t, dTiempo, dTiempo + 0.4);
  const [lx, ly] = aPantalla(-90, 120, F, cam);
  return (
    <AbsoluteFill style={{ backgroundColor: "#0b1020" }}>
      <Lam D={1700} cam={cam} fotos={[{ src: "stickdio/ring_fondo.jpg", x: 0, y: 150, w: 2624, h: 1472 }]} filtro="brightness(0.85) saturate(0.85)" />
      <Lam D={1150} cam={cam} sombra>
        <g transform="translate(-360,-140) scale(0.72)">
          <Cartel x={0} y={0} texto="32 PELEAS" color="#2a1a10" t={t} t0={V.n32} />
        </g>
        <g transform="translate(260,-140) scale(0.72)">
          <Cartel x={0} y={0} texto="0 DERROTAS" color="#a3241c" t={t} t0={dTiempo} />
        </g>
      </Lam>
      <Lam D={F} cam={cam} sombra>
        {[ex, rx, refX].map((sx, i) => (
          <ellipse key={i} cx={sx + 8} cy={SUELO + 2} rx={i === 1 ? 46 + 60 * cae : 42} ry={6} fill="#0a0c18" opacity={0.5} />
        ))}
        <Figura x={refX} P={refP} mira={-1} look={REFERI} t={t} cara={{ giro: 0.3, sonrisa: 0, parpado: 0 }} bordes={CANTO_FRIO} />
        <Figura x={rx} P={rP} mira={-1} look={RIVAL} rot={88 * cae} t={t} cara={{ giro: 0, sonrisa: 0, parpado: cae > 0.5 ? 1 : 0, enojo: 0.6 * (1 - cae) }} bordes={CANTO_FRIO} />
        <Figura x={ex} P={eP} mira={1} look={JOVEN} t={t} cara={{ giro: gana * 0.8, sonrisa: 0, parpado: 0, enojo: 0.7 * (1 - gana), boca: 0.5 * gana }} bordes={CANTO_FRIO} />
      </Lam>
      {/* la lona va ADELANTE: las cuerdas pasan por delante de los peleadores */}
      <Lam D={F} cam={cam} sombra fotos={[{ src: "stickdio/ring_lona.png", x: -60, y: 300 - 531 * 0.46 + (1086 * 0.46) / 2, w: 1524 * 0.46, h: 1086 * 0.46 }]} />
      <Linterna x={lx} y={ly} r={700} osc={0.55} frio />
    </AbsoluteFill>
  );
};

// ---------- montaje ----------
export const Dio: React.FC = () => {
  const t = T0 + useCurrentFrame() / FPS;
  const cam = camCafe(t);
  // la linterna: punto del mundo [x, y, D] + radio + cuánto oscurece el resto
  let luz: [number, number, number] = [0, 120, F];
  let r = 560;
  let osc = 0.5;
  if (t < P2) {
    luz = [lerp(0, -300, suave(t, V.entro, V.entro + 0.8)), 110, F];
    r = 560 + 260 * suave(t, V.entro, V.entro + 0.8);
  } else if (t < P4) {
    luz = [-70, 120, F];
    r = 760;
    osc = 0.42;
  } else {
    const a = suave(t, V.noSabia - 0.1, 36.0);
    const pE: [number, number] = [lerp(-150, 0, suave(t, 29.6, 31.0)), 120];
    const sp = aPantalla(pE[0], pE[1], F, cam);
    const fp = aPantalla(FOTO.x, FOTO.y, 1400, cam);
    luz = [0, 0, F];
    // la luz se va de los personajes al cuadro mientras la sala se apaga
    const lx = lerp(sp[0], fp[0], a);
    const ly = lerp(sp[1], fp[1], a);
    return (
      <Montaje t={t} cam={cam} luzPant={[lx, ly]} r={lerp(640, 420, a)} osc={lerp(0.5, 0.88, a)} />
    );
  }
  const lp = aPantalla(luz[0], luz[1], luz[2], cam);
  return <Montaje t={t} cam={cam} luzPant={lp as [number, number]} r={r} osc={osc} />;
};

const Montaje: React.FC<{ t: number; cam: Cam; luzPant: [number, number]; r: number; osc: number }> = ({ t, cam, luzPant, r, osc }) => {
  const enCafe = t < P2 || (t >= P3 && t < P4) || (t >= P5 && t < PORTAL[1]);
  const portal = suave(t, PORTAL[0], PORTAL[1]);
  // rectángulo del hueco del cuadro en pantalla (el portal arranca ahí y crece hasta la pantalla entera)
  const a = aPantalla(FOTO.x - FOTO.w / 2, FOTO.y - FOTO.h / 2, 1400, cam);
  const b = aPantalla(FOTO.x + FOTO.w / 2, FOTO.y + FOTO.h / 2, 1400, cam);
  const top = lerp(540 + a[1], 0, portal);
  const left = lerp(960 + a[0], 0, portal);
  const bottom = lerp(540 - b[1], 0, portal);
  const right = lerp(960 - b[0], 0, portal);
  const fin = 1 - suave(t, FIN - 0.45, FIN - 0.05);
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <AbsoluteFill style={{ opacity: fin }}>
        <CamaraMano intensidad={1.0} seed={5}>
          {enCafe && <CafeteriaLuz t={t} cam={cam} luzPant={luzPant} r={r} osc={osc} />}
          {t >= P2 && t < P3 && <Contrapicado t={t} />}
          {t >= P4 && t < P5 && <Inserto t={t} />}
          {t >= PORTAL[0] && (
            <AbsoluteFill style={{ clipPath: portal < 0.999 ? `inset(${top}px ${right}px ${bottom}px ${left}px)` : undefined }}>
              <Ring t={t} />
            </AbsoluteFill>
          )}
        </CamaraMano>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const CafeteriaLuz: React.FC<{ t: number; cam: Cam; luzPant: [number, number]; r: number; osc: number }> = ({ t, cam, luzPant, r, osc }) => (
  <AbsoluteFill>
    <Cafeteria t={t} cam={cam} />
    <Linterna x={luzPant[0]} y={luzPant[1]} r={r} osc={osc} />
  </AbsoluteFill>
);
