import React from "react";
import { AbsoluteFill, interpolate, Easing, useCurrentFrame, useVideoConfig } from "remotion";
import { CamaraMano } from "../kits/camara/CamaraMano";

// Prueba "stickman de cine": todo dibujado por código, sin una sola imagen.
// Mundo 2.5D de cámara estenopeica: cada capa vive a una distancia D; la cámara tiene (cx, cy, cz).
// Un punto p dibujado "en reposo" en la capa D cae en pantalla en (p - c·F/D) · D/(D - cz)  → paralaje y dolly reales.
// Desenfoque por capa = apertura · |D - foco| / (D - cz)  → profundidad de campo con cambio de foco.

export const DUR = 600; // 20 s a 30 fps
const F = 1000;
const SUELO = 300; // altura del piso en el plano del personaje (D = F)

type Cam = { cx: number; cy: number; cz: number; foco: number; ap: number };

// ---------- utilidades ----------
const rnd = (seed: number) => {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};
const lerp = (a: number, b: number, u: number) => a + (b - a) * u;
const suave = (t: number, a: number, b: number) =>
  interpolate(t, [a, b], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.45, 0, 0.25, 1) });

// Hermite con tangentes Catmull-Rom: la cámara pasa por los puntos SIN frenar en cada uno (nada robótico)
const curva = (t: number, ks: [number, number][]) => {
  const n = ks.length;
  if (t <= ks[0][0]) return ks[0][1];
  if (t >= ks[n - 1][0]) return ks[n - 1][1];
  let i = 0;
  while (t > ks[i + 1][0]) i++;
  const pend = (j: number) => (j === 0 || j === n - 1 ? 0 : (ks[j + 1][1] - ks[j - 1][1]) / (ks[j + 1][0] - ks[j - 1][0]));
  const [t0, v0] = ks[i];
  const [t1, v1] = ks[i + 1];
  const h = t1 - t0;
  const u = (t - t0) / h;
  const m0 = pend(i) * h;
  const m1 = pend(i + 1) * h;
  const u2 = u * u;
  const u3 = u2 * u;
  return (2 * u3 - 3 * u2 + 1) * v0 + (u3 - 2 * u2 + u) * m0 + (-2 * u3 + 3 * u2) * v1 + (u3 - u2) * m1;
};

const camara = (t: number): Cam => ({
  cx: curva(t, [[0, -350], [3, -80], [6, 300], [8.5, 560], [11, 660], [14, 705], [20, 730]]),
  cy: curva(t, [[0, 0], [6, 10], [9, 60], [12, 120], [20, 132]]),
  cz: curva(t, [[0, 0], [5, 60], [8, 140], [12, 470], [16, 540], [20, 578]]),
  // cambio de foco: arranca en el pasto de adelante y viaja al personaje
  foco: lerp(430, F, suave(t, 0.5, 2.3)),
  ap: curva(t, [[0, 14], [2.5, 4.5], [7, 5], [12, 15], [20, 17]]),
});

const desenfoque = (D: number, c: Cam) => Math.min(42, (c.ap * Math.abs(D - c.foco)) / Math.max(40, D - c.cz));

// Capa a distancia D. Lo de adentro se dibuja en coordenadas "de reposo" (centro de pantalla = 0,0).
const Capa: React.FC<{
  D: number;
  cam: Cam;
  children: React.ReactNode;
  sinDesenfoque?: boolean;
  extra?: number;
  opacidad?: number;
  mezcla?: React.CSSProperties["mixBlendMode"];
}> = ({ D, cam, children, sinDesenfoque, extra = 0, opacidad = 1, mezcla }) => {
  const k = F / D;
  const m = D / (D - cam.cz);
  const b = (sinDesenfoque ? 0 : desenfoque(D, cam)) + extra;
  const W = 9000;
  const H = 5000;
  return (
    <AbsoluteFill style={{ filter: b > 0.25 ? `blur(${b.toFixed(2)}px)` : undefined, opacity: opacidad, mixBlendMode: mezcla }}>
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          transformOrigin: "0 0",
          transform: `translate(960px,540px) scale(${m}) translate(${-cam.cx * k}px,${-cam.cy * k}px)`,
        }}
      >
        <svg
          width={W}
          height={H}
          viewBox={`${-W / 2} ${-H / 2} ${W} ${H}`}
          style={{ position: "absolute", left: -W / 2, top: -H / 2, overflow: "visible" }}
        >
          {children}
        </svg>
      </div>
    </AbsoluteFill>
  );
};

// posición en pantalla (relativa al centro) de un punto de la capa D
const aPantalla = (x: number, y: number, D: number, c: Cam) => {
  const k = F / D;
  const m = D / (D - c.cz);
  return [(x - c.cx * k) * m, (y - c.cy * k) * m];
};

// ---------- el personaje ----------
type Pose = {
  x: number;
  y: number; // cadera
  torso: number;
  muslo: [number, number];
  pierna: [number, number];
  brazo: [number, number];
  ante: [number, number];
  cabeza: number;
};
const rad = Math.PI / 180;
const p = (x: number, y: number, a: number, L: number): [number, number] => [x + L * Math.sin(a * rad), y + L * Math.cos(a * rad)];

const caminar = (fase: number, amp: number, x: number): Pose => {
  const s = Math.sin(fase);
  const c = Math.cos(fase);
  const sw = 24 * amp;
  const mL = sw * s;
  const mR = -sw * s;
  const alto = 124 * Math.cos(sw * Math.abs(s) * rad);
  return {
    x,
    y: SUELO - alto - 2 + 2.5 * amp * Math.cos(2 * fase),
    torso: 5 * amp,
    muslo: [mL, mR],
    pierna: [mL - 4 - 38 * amp * Math.max(0, c) ** 1.3, mR - 4 - 38 * amp * Math.max(0, -c) ** 1.3],
    brazo: [-18 * amp * s + 3, 18 * amp * s + 3],
    ante: [-18 * amp * s + 15 + 18 * amp * Math.max(0, -s), 18 * amp * s + 15 + 18 * amp * Math.max(0, s)],
    cabeza: 2 * amp * Math.sin(2 * fase),
  };
};
const SENTADO: Omit<Pose, "x"> = {
  y: 226,
  torso: -7,
  muslo: [86, 84],
  pierna: [4, -3],
  brazo: [8, 14],
  ante: [55, 62],
  cabeza: -4,
};
const mezclar = (a: Pose, b: Omit<Pose, "x">, u: number): Pose => ({
  x: a.x,
  y: lerp(a.y, b.y, u),
  torso: lerp(a.torso, b.torso, u),
  muslo: [lerp(a.muslo[0], b.muslo[0], u), lerp(a.muslo[1], b.muslo[1], u)],
  pierna: [lerp(a.pierna[0], b.pierna[0], u), lerp(a.pierna[1], b.pierna[1], u)],
  brazo: [lerp(a.brazo[0], b.brazo[0], u), lerp(a.brazo[1], b.brazo[1], u)],
  ante: [lerp(a.ante[0], b.ante[0], u), lerp(a.ante[1], b.ante[1], u)],
  cabeza: lerp(a.cabeza, b.cabeza, u),
});

type Cara = { giro: number; sonrisa: number; parpado: number };

const esqueleto = (P: Pose) => {
  const cuello = p(P.x, P.y, 180 - P.torso, 112);
  const hombro = p(P.x, P.y, 180 - P.torso, 96);
  const cab = p(cuello[0], cuello[1], 180 - P.torso - P.cabeza, 36);
  const piernas = [0, 1].map((i) => {
    const rod = p(P.x, P.y, P.muslo[i], 62);
    const pie = p(rod[0], rod[1], P.pierna[i], 62);
    return { rod, pie };
  });
  const brazos = [0, 1].map((i) => {
    const codo = p(hombro[0], hombro[1], P.brazo[i], 50);
    const mano = p(codo[0], codo[1], P.ante[i], 48);
    return { codo, mano };
  });
  return { cuello, hombro, cab, piernas, brazos };
};

const Figura: React.FC<{ P: Pose; color: string; ancho: number; cara?: Cara; sombrero?: boolean }> = ({ P, color, ancho, cara, sombrero }) => {
  const e = esqueleto(P);
  const linea = { stroke: color, strokeWidth: ancho, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, fill: "none" };
  const pierna = (i: number) => {
    const { rod, pie } = e.piernas[i];
    return <path key={"p" + i} d={`M${P.x},${P.y} L${rod[0]},${rod[1]} L${pie[0]},${pie[1]} l9,0`} {...linea} />;
  };
  const brazo = (i: number) => {
    const { codo, mano } = e.brazos[i];
    return <path key={"b" + i} d={`M${e.hombro[0]},${e.hombro[1]} L${codo[0]},${codo[1]} L${mano[0]},${mano[1]}`} {...linea} />;
  };
  return (
    <g>
      {/* lado lejano primero: da volumen */}
      {pierna(1)}
      {brazo(1)}
      <path d={`M${P.x},${P.y} L${e.cuello[0]},${e.cuello[1]}`} {...linea} />
      {pierna(0)}
      {brazo(0)}
      <circle cx={e.cab[0]} cy={e.cab[1]} r={33} fill={color} />
      {sombrero && (
        <g transform={`translate(${e.cab[0]},${e.cab[1]}) rotate(${-P.torso})`}>
          <rect x={-46} y={-30} width={92} height={9} rx={4} fill={color} />
          <rect x={-27} y={-62} width={54} height={36} rx={7} fill={color} />
        </g>
      )}
      {cara && <Rostro x={e.cab[0]} y={e.cab[1]} c={cara} inclin={-P.torso - P.cabeza} />}
    </g>
  );
};

// la cara: de perfil (mirando a la derecha, giro 0) a de frente (giro 1)
const Rostro: React.FC<{ x: number; y: number; c: Cara; inclin: number }> = ({ x, y, c, inclin }) => {
  const g = c.giro;
  const ry = 4.2 * (1 - c.parpado * 0.9);
  const ojo1 = lerp(17, -11, g);
  const ojo2 = lerp(27, 11, g);
  const bx = lerp(15, 0, g);
  const bw = lerp(9, 13, g) * (0.8 + 0.3 * c.sonrisa);
  const curvaB = 3 + 9 * c.sonrisa;
  return (
    <g transform={`translate(${x},${y}) rotate(${inclin})`}>
      <ellipse cx={ojo1} cy={-5} rx={3.6} ry={ry} fill="#fff6e8" />
      <ellipse cx={ojo2} cy={-5} rx={3.6 * Math.min(1, g * 1.4)} ry={ry} fill="#fff6e8" opacity={Math.min(1, g * 1.6)} />
      <path
        d={`M${bx - bw},${9} Q${bx},${9 + curvaB} ${bx + bw},${9 - 1.5 * c.sonrisa}`}
        stroke="#fff6e8"
        strokeWidth={3.4}
        strokeLinecap="round"
        fill="none"
      />
    </g>
  );
};

// ---------- escenografía ----------
const Arbol: React.FC<{ x: number; alto: number; seed: number; t: number; oscuro: string; borde: string; escala?: number }> = ({
  x,
  alto,
  seed,
  t,
  oscuro,
  borde,
  escala = 1,
}) => {
  const r = rnd(seed);
  const top = SUELO - alto;
  const vaiven = Math.sin(t * 0.9 + seed) * 4;
  const bolas = Array.from({ length: 9 }, () => ({
    dx: (r() - 0.5) * 230 * escala,
    dy: (r() - 0.5) * 150 * escala,
    rr: (60 + r() * 60) * escala,
  }));
  return (
    <g>
      <path
        d={`M${x - 14 * escala},${SUELO} C${x - 10},${SUELO - alto * 0.4} ${x + 8},${top + 120} ${x + vaiven * 0.4},${top + 60}
            L${x + 10 * escala + vaiven * 0.4},${top + 60} C${x + 16},${top + 120} ${x + 6},${SUELO - alto * 0.4} ${x + 16 * escala},${SUELO} Z`}
        fill={oscuro}
      />
      <g transform={`translate(${vaiven},0)`}>
        {bolas.map((b, i) => (
          <circle key={"r" + i} cx={x + b.dx} cy={top + b.dy} r={b.rr} fill={borde} />
        ))}
        {bolas.map((b, i) => (
          <circle key={"o" + i} cx={x + b.dx - 6 * escala} cy={top + b.dy + 5 * escala} r={b.rr} fill={oscuro} />
        ))}
      </g>
    </g>
  );
};

const Pasto: React.FC<{ seed: number; desde: number; hasta: number; n: number; y: number; alto: number; color: string; luz: string; t: number }> = ({
  seed,
  desde,
  hasta,
  n,
  y,
  alto,
  color,
  luz,
  t,
}) => {
  const r = rnd(seed);
  const hojas = Array.from({ length: n }, () => ({ x: lerp(desde, hasta, r()), h: alto * (0.35 + r() * 0.65), b: (r() - 0.5) * 18, dy: r() * 10, f: r() * 6 }));
  return (
    <g>
      {hojas.map((h, i) => {
        const v = h.b + Math.sin(t * 1.3 + h.f) * 3;
        const y0 = y + h.dy;
        return (
          <g key={i}>
            <path d={`M${h.x + 1.5},${y0} Q${h.x + v * 0.3 + 1.5},${y0 - h.h * 0.6} ${h.x + v + 1.5},${y0 - h.h}`} stroke={luz} strokeWidth={2.4} fill="none" strokeLinecap="round" />
            <path d={`M${h.x},${y0} Q${h.x + v * 0.3},${y0 - h.h * 0.6} ${h.x + v},${y0 - h.h}`} stroke={color} strokeWidth={2.6} fill="none" strokeLinecap="round" />
          </g>
        );
      })}
    </g>
  );
};

// ---------- el video ----------
export const Full: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const cam = camara(t);

  // --- personaje: camina, frena, se sienta, mira el atardecer, se da vuelta, sonríe y saluda
  const X0 = -1270;
  const V = 240;
  const tFreno = 7.2;
  const durFreno = 1.2;
  const avance =
    t < tFreno ? V * t : V * tFreno + V * Math.min(t - tFreno, durFreno) - (V / (2 * durFreno)) * Math.min(t - tFreno, durFreno) ** 2;
  const x = X0 + avance;
  const amp = t < tFreno ? 1 : Math.max(0, 1 - (t - tFreno) / durFreno);
  const fase = (2 * Math.PI * avance) / 210;
  const sentarse = suave(t, 8.5, 9.7);
  let P = mezclar(caminar(fase, amp, x), SENTADO, sentarse);
  // respiración sentado
  const resp = Math.sin(t * 2.1) * sentarse;
  P = { ...P, torso: P.torso + resp * 1.2, y: P.y - resp * 0.6 };
  // saludo a cámara
  const subeMano = suave(t, 16.6, 17.2) * (1 - suave(t, 19.25, 19.85));
  const vaiven = Math.sin((t - 16.6) * 9) * 22 * subeMano;
  P = {
    ...P,
    brazo: [P.brazo[0], lerp(P.brazo[1], 150, subeMano)],
    ante: [P.ante[0], lerp(P.ante[1], 175 + vaiven, subeMano)],
    cabeza: P.cabeza + lerp(0, -6, suave(t, 15.2, 16)),
  };
  const parpadeos = [4.1, 11.2, 14.0, 18.2];
  const parp = Math.max(0, ...parpadeos.map((b) => 1 - Math.abs(t - b) / 0.08));
  const cara: Cara = {
    giro: suave(t, 15.2, 16.0),
    sonrisa: lerp(0.35, 1, suave(t, 15.6, 16.5)),
    parpado: Math.min(1, parp),
  };

  // --- luz del atardecer
  const solY = lerp(118, 168, t / 20);
  const sol = { x: 520, y: solY };
  const farol = t < 13.6 ? 0 : t < 14.3 ? [0, 0.7, 0.1, 0.9, 0.3, 1][Math.floor((t - 13.6) / 0.12)] ?? 1 : 1;
  const noche = suave(t, 4, 20); // el cielo se va apagando arriba
  const cieloArriba = `rgb(${lerp(46, 22, noche)},${lerp(48, 30, noche)},${lerp(98, 72, noche)})`;
  const ciudadLuz = (i: number) => suave(t, 5 + (i % 23) * 0.45, 5.6 + (i % 23) * 0.45);

  // pantalla del sol (capa muy lejana: casi no se mueve)
  const [sx, sy] = aPantalla(sol.x, sol.y, 1e6, cam);
  const SX = 960 + sx;
  const SY = 540 + sy;

  // --- transeúnte con sombrero que cruza muy cerca de cámara (D = 760)
  const Dt = 760;
  const uT = (t - 10.4) / 2.8;
  const kT = F / Dt;
  const mT = Dt / (Dt - cam.cz);
  const pantallaX = lerp(1250, -1250, uT);
  const xT = pantallaX / mT + cam.cx * kT;
  const pieT = 620 / mT + cam.cy * kT;
  const faseT = (2 * Math.PI * (uT * 2.8 * 260)) / 210;
  const PT0 = caminar(faseT, 1, 0);
  // camina hacia la izquierda: se espeja alrededor de su cadera
  const PT: Pose = { ...PT0, x: 0, y: PT0.y - SUELO };

  // --- partículas
  const r1 = rnd(7);
  const polvo = Array.from({ length: 70 }, () => ({ x: lerp(-1400, 2600, r1()), y: lerp(-500, 420, r1()), v: 6 + r1() * 14, f: r1() * 6, s: 1.2 + r1() * 2.4 }));
  const r2 = rnd(19);
  const luciernagas = Array.from({ length: 26 }, () => ({ x: lerp(300, 1250, r2()), y: lerp(-40, 290, r2()), f: r2() * 6, w: 0.6 + r2() * 0.8 }));
  const r3 = rnd(31);
  const edificios = Array.from({ length: 60 }, (_, i) => ({ x: -2200 + i * 72 + r3() * 30, w: 40 + r3() * 50, h: 20 + r3() ** 2 * 120 }));
  const ventanas = edificios.flatMap((b, i) =>
    Array.from({ length: 3 }, (_, j) => ({ x: b.x + 10 + r3() * (b.w - 20), y: 205 - 10 - r3() * (b.h - 18), i: i * 3 + j })),
  );

  const fundido = interpolate(t, [0, 0.7], [1, 0], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: "#0b0b14" }}>
      <CamaraMano intensidad={1.15} seed={3}>
        {/* cielo */}
        <AbsoluteFill
          style={{
            background: `linear-gradient(180deg, ${cieloArriba} 0%, #5a4a8a 34%, #c9667a 56%, #f39563 68%, #ffcf8a 76%, #ffe2a8 82%)`,
          }}
        />
        {/* nubes */}
        <Capa D={60000} cam={cam} extra={1.5}>
          <defs>
            <linearGradient id="nube" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#7d5f9c" />
              <stop offset="1" stopColor="#ff9f7a" />
            </linearGradient>
          </defs>
          {[
            [-700, -330, 520, 26],
            [-150, -250, 760, 20],
            [380, -380, 600, 30],
            [900, -200, 420, 16],
            [-1200, -180, 500, 18],
            [150, -90, 900, 10],
          ].map(([cxn, cyn, w, h], i) => (
            <ellipse key={i} cx={cxn + t * 7} cy={cyn} rx={w / 2} ry={h} fill="url(#nube)" opacity={0.8} />
          ))}
        </Capa>
        {/* sol */}
        <Capa D={1e6} cam={cam} sinDesenfoque>
          <defs>
            <radialGradient id="halo">
              <stop offset="0" stopColor="#fff3cf" stopOpacity="1" />
              <stop offset="0.12" stopColor="#ffd08a" stopOpacity="0.9" />
              <stop offset="0.4" stopColor="#ff9a5c" stopOpacity="0.35" />
              <stop offset="1" stopColor="#ff7a50" stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle cx={sol.x} cy={sol.y} r={520} fill="url(#halo)" />
          <circle cx={sol.x} cy={sol.y} r={46} fill="#fff8e2" />
        </Capa>
        {/* ciudad lejana + sus luces como bokeh */}
        <Capa D={14000} cam={cam}>
          {edificios.map((b, i) => (
            <rect key={i} x={b.x} y={205 - b.h} width={b.w} height={b.h + 400} fill="#7a5f8f" />
          ))}
          <rect x={-3000} y={150} width={7000} height={500} fill="url(#neblina)" />
          <defs>
            <linearGradient id="neblina" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#ffc290" stopOpacity="0" />
              <stop offset="0.35" stopColor="#ffb98a" stopOpacity="0.55" />
              <stop offset="1" stopColor="#c27a86" stopOpacity="0.2" />
            </linearGradient>
          </defs>
        </Capa>
        <Capa D={14000} cam={cam} sinDesenfoque mezcla="screen">
          {ventanas.map((w) => {
            const b = desenfoque(14000, cam);
            const on = ciudadLuz(w.i);
            const rr = Math.max(1.6, b * 0.85) / (14000 / (14000 - cam.cz));
            return <circle key={w.i} cx={w.x} cy={w.y} r={rr} fill="#ffd9a0" opacity={on * Math.min(0.9, 2.2 / Math.max(1, b * 0.45))} />;
          })}
        </Capa>
        {/* pájaros */}
        <Capa D={9000} cam={cam}>
          {[0, 1, 2].map((i) => {
            const bx = lerp(1300, -1500, (t - 1.5 - i * 0.35) / 9) + i * 40;
            const by = -180 - i * 22 + Math.sin(t * 1.4 + i) * 10;
            const al = Math.sin(t * 11 + i * 2) * 7;
            return (
              <path key={i} d={`M${bx - 12},${by} Q${bx - 6},${by - al} ${bx},${by + 2} Q${bx + 6},${by - al} ${bx + 12},${by}`} stroke="#3a2a4a" strokeWidth={2.4} fill="none" />
            );
          })}
        </Capa>
        {/* sierras lejanas */}
        <Capa D={6000} cam={cam}>
          <path
            d={`M-3000,210 ${Array.from({ length: 61 }, (_, i) => {
              const xx = -3000 + i * 100;
              return `L${xx},${195 - 22 * Math.sin(i * 0.7) - 12 * Math.sin(i * 1.9 + 1)}`;
            }).join(" ")} L3000,900 L-3000,900 Z`}
            fill="#8a6290"
          />
          <rect x={-3000} y={170} width={6000} height={80} fill="#ffb08a" opacity={0.25} />
        </Capa>
        {/* rayos de sol (detrás de lo cercano: los tapa la silueta) */}
        <AbsoluteFill style={{ mixBlendMode: "screen", filter: "blur(14px)", opacity: 0.55 }}>
          <svg width={1920} height={1080} style={{ overflow: "visible" }}>
            <defs>
              <radialGradient id="rayo" cx={SX} cy={SY} r={1500} gradientUnits="userSpaceOnUse">
                <stop offset="0" stopColor="#ffe3b0" stopOpacity="0.9" />
                <stop offset="1" stopColor="#ffb070" stopOpacity="0" />
              </radialGradient>
            </defs>
            {[200, 214, 226, 241, 256, 272, 288, 300, 318, 335].map((a, i) => {
              const ang = (a + Math.sin(t * 0.25 + i) * 2.2) * rad;
              const ab = (2.2 + (i % 3)) * rad;
              const L = 1700;
              return (
                <polygon
                  key={i}
                  points={`${SX},${SY} ${SX + L * Math.cos(ang - ab)},${SY + L * Math.sin(ang - ab)} ${SX + L * Math.cos(ang + ab)},${SY + L * Math.sin(ang + ab)}`}
                  fill="url(#rayo)"
                  opacity={0.18 + 0.12 * Math.sin(t * 0.7 + i * 1.7)}
                />
              );
            })}
          </svg>
        </AbsoluteFill>
        {/* lomas medias */}
        <Capa D={2500} cam={cam}>
          <path
            d={`M-3000,240 ${Array.from({ length: 61 }, (_, i) => `L${-3000 + i * 100},${232 - 16 * Math.sin(i * 0.35 + 2) - 6 * Math.sin(i * 1.3)}`).join(" ")} L3000,1600 L-3000,1600 Z`}
            fill="#4a3a5a"
          />
          {[-1500, -1100, -380, 120, 980, 1400, 1900].map((xx, i) => (
            <Arbol key={i} x={xx} alto={190 + (i % 3) * 40} seed={50 + i} t={t} oscuro="#3c3049" borde="#a86a6a" escala={0.45} />
          ))}
          <rect x={-3000} y={150} width={6000} height={140} fill="#ffb08a" opacity={0.12} />
        </Capa>
        {/* polvo lejano en la luz */}
        <Capa D={1400} cam={cam} mezcla="screen">
          {polvo.slice(0, 35).map((d, i) => (
            <circle key={i} cx={d.x + Math.sin(t * 0.5 + d.f) * 20} cy={d.y - t * d.v} r={d.s} fill="#ffe2b0" opacity={0.35 + 0.35 * Math.sin(t * 1.5 + d.f)} />
          ))}
        </Capa>
        {/* luciérnagas de atrás */}
        <Capa D={1300} cam={cam} mezcla="screen" opacidad={suave(t, 13.8, 16)}>
          {luciernagas.slice(0, 13).map((l, i) => (
            <circle key={i} cx={l.x + Math.sin(t * l.w + l.f) * 30} cy={l.y + Math.cos(t * l.w * 1.3 + l.f) * 18} r={4} fill="#e9ff9a" opacity={0.4 + 0.6 * Math.max(0, Math.sin(t * 2 * l.w + l.f))} />
          ))}
        </Capa>

        {/* PLANO DEL PERSONAJE */}
        <Capa D={F} cam={cam}>
          <defs>
            <linearGradient id="suelo" x1="0" y1={SUELO - 4} x2="0" y2={SUELO + 520} gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#8a6240" />
              <stop offset="0.04" stopColor="#4a3626" />
              <stop offset="0.22" stopColor="#262019" />
              <stop offset="1" stopColor="#100f0c" />
            </linearGradient>
            <linearGradient id="reflejo" x1="0" x2="1">
              <stop offset="0" stopColor="#ff9a5a" stopOpacity="0" />
              <stop offset="0.75" stopColor="#ffb070" stopOpacity="0.35" />
              <stop offset="1" stopColor="#ffb070" stopOpacity="0" />
            </linearGradient>
            <filter id="pileta" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="14" />
            </filter>
            <radialGradient id="luzFarol">
              <stop offset="0" stopColor="#ffe6a8" stopOpacity="0.95" />
              <stop offset="0.25" stopColor="#ffc670" stopOpacity="0.4" />
              <stop offset="1" stopColor="#ff9a40" stopOpacity="0" />
            </radialGradient>
            <filter id="brillo" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="4" />
            </filter>
            <filter id="sombra" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3.5" />
            </filter>
          </defs>
          <rect x={-3000} y={SUELO - 4} width={7000} height={2000} fill="url(#suelo)" />
          {/* el sol rasante pinta el borde del piso del lado derecho */}
          <rect x={-1500} y={SUELO - 4} width={4200} height={26} fill="url(#reflejo)" filter="url(#sombra)" />
          {[-380, 120, 880, 1650, -1500].map((bx, i) => (
            <g key={i}>
              {[0, 1, 2, 3].map((j) => (
                <circle key={j} cx={bx + j * 26 - 40 + 2} cy={SUELO - 14 - (j % 2) * 12 - 1} r={24 - (j % 3) * 4} fill="#c47a44" />
              ))}
              {[0, 1, 2, 3].map((j) => (
                <circle key={j} cx={bx + j * 26 - 40} cy={SUELO - 14 - (j % 2) * 12 + 2} r={24 - (j % 3) * 4} fill="#18170f" />
              ))}
            </g>
          ))}
          <Pasto seed={3} desde={-2600} hasta={3000} n={1400} y={SUELO + 1} alto={13} color="#17170f" luz="#d58c50" t={t} />
          <Pasto seed={4} desde={-2600} hasta={3000} n={500} y={SUELO + 30} alto={22} color="#100f0b" luz="#7a5434" t={t} />

          <Arbol x={-720} alto={560} seed={11} t={t} oscuro="#1a1c15" borde="#d48a4c" />
          <Arbol x={1560} alto={600} seed={23} t={t} oscuro="#1a1c15" borde="#d48a4c" />

          {/* sombras largas hacia la izquierda (el sol está bajo a la derecha) */}
          <g transform={`matrix(1,0,2.1,-0.13,${-2.1 * SUELO},${SUELO * 1.13})`} filter="url(#sombra)" opacity={0.5}>
            <Figura P={P} color="#0a0a08" ancho={10} />
            <path d="M520,232 L720,232 M535,228 L520,150 M540,238 L536,300 M700,238 L706,300" stroke="#0a0a08" strokeWidth={12} />
          </g>
          <ellipse cx={P.x + 8} cy={SUELO + 4} rx={46 * (1 - sentarse * 0.3)} ry={6} fill="#000" opacity={0.45} filter="url(#sombra)" />

          {/* farol */}
          <g>
            <circle cx={490} cy={10} r={240} fill="url(#luzFarol)" opacity={farol * 0.85} />
            <ellipse cx={490} cy={SUELO + 10} rx={260} ry={30} fill="#ffcf80" opacity={farol * 0.28} filter="url(#pileta)" />
            <path d="M470,300 L470,0 Q470,-22 490,-22 L494,-22" stroke="#d48a4c" strokeWidth={11} fill="none" transform="translate(2,-1)" />
            <path d="M470,300 L470,0 Q470,-22 490,-22 L494,-22" stroke="#15130f" strokeWidth={10} fill="none" />
            <rect x={458} y={286} width={24} height={16} rx={3} fill="#15130f" />
            <path d="M478,-14 L502,-14 L498,12 L482,12 Z" fill={farol > 0.05 ? "#fff1c4" : "#2a2620"} opacity={0.4 + 0.6 * Math.max(farol, 0.2)} />
            <path d="M476,-18 L504,-18 L500,-12 L480,-12 Z" fill="#15130f" />
            <circle cx={490} cy={0} r={30} fill="#ffe8b0" opacity={farol * 0.6} filter="url(#brillo)" />
          </g>

          {/* banco */}
          <g>
            <path d="M520,232 L720,232 M535,228 L520,150 M540,238 L536,300 M700,238 L706,300 M524,170 L540,226" stroke="#d48a4c" strokeWidth={12} strokeLinecap="round" transform="translate(2,-2)" />
            <path d="M520,232 L720,232 M535,228 L520,150 M540,238 L536,300 M700,238 L706,300 M524,170 L540,226" stroke="#16120d" strokeWidth={12} strokeLinecap="round" />
          </g>

          {/* el personaje: luz de borde cálida del sol (derecha) y del farol (izquierda) */}
          <g transform="translate(3,-2.4)" filter="url(#brillo)" opacity={0.9}>
            <Figura P={P} color="#ffb05a" ancho={12} />
          </g>
          <g transform="translate(2.2,-1.6)">
            <Figura P={P} color="#ffc27a" ancho={10.5} />
          </g>
          <g transform="translate(-2.4,-1)" opacity={farol * 0.9}>
            <Figura P={P} color="#ffe2a0" ancho={10.5} />
          </g>
          <Figura P={P} color="#141318" ancho={10} cara={cara} />
        </Capa>

        {/* luciérnagas de adelante */}
        <Capa D={900} cam={cam} mezcla="screen" opacidad={suave(t, 14, 16.5)}>
          {luciernagas.slice(13).map((l, i) => (
            <g key={i}>
              <circle cx={l.x + Math.sin(t * l.w + l.f) * 30} cy={l.y + Math.cos(t * l.w * 1.3 + l.f) * 18} r={9} fill="#d8ff80" opacity={0.25 * Math.max(0, Math.sin(t * 2 * l.w + l.f))} />
              <circle cx={l.x + Math.sin(t * l.w + l.f) * 30} cy={l.y + Math.cos(t * l.w * 1.3 + l.f) * 18} r={3.5} fill="#f4ffc0" opacity={0.5 + 0.5 * Math.max(0, Math.sin(t * 2 * l.w + l.f))} />
            </g>
          ))}
        </Capa>

        {/* transeúnte con sombrero, muy cerca de cámara */}
        {uT > -0.05 && uT < 1.05 && (
          <Capa D={Dt} cam={cam} extra={4}>
            <g transform={`translate(${xT},${pieT}) scale(-1.05,1.05)`}>
              <g transform={`translate(-3,-2)`}>
                <Figura P={PT} color="#ffb05a" ancho={11} sombrero />
              </g>
              <Figura P={PT} color="#100f12" ancho={10} sombrero />
            </g>
          </Capa>
        )}

        {/* polvo cercano */}
        <Capa D={650} cam={cam} mezcla="screen" opacidad={1 - suave(t, 10, 12.5)}>
          {polvo.slice(35).map((d, i) => (
            <circle key={i} cx={d.x * 0.7 + Math.sin(t * 0.5 + d.f) * 24} cy={d.y - t * d.v} r={d.s * 1.4} fill="#ffe8c0" opacity={0.3 + 0.3 * Math.sin(t * 1.3 + d.f)} />
          ))}
        </Capa>

        {/* pasto y flores en primer plano: la cámara las atraviesa */}
        <Capa D={430} cam={cam} opacidad={1 - suave(cam.cz, 170, 320)}>
          {[-1700, -1050, -380, 380, 1150, 1850].map((xx, i) => (
            <g key={i}>
              <Pasto seed={100 + i} desde={xx - 260} hasta={xx + 260} n={70} y={720} alto={330} color="#0e100b" luz="#d8894a" t={t} />
              {[0, 1, 2].map((j) => {
                const fx = xx - 120 + j * 110 + ((i * 37) % 50);
                const fy = 450 - ((i + j) % 3) * 60;
                return (
                  <g key={j}>
                    <path d={`M${fx},${fy} Q${fx + 10},${fy + 120} ${fx + 4},${720}`} stroke="#0e100b" strokeWidth={4} fill="none" />
                    {[0, 72, 144, 216, 288].map((a) => (
                      <ellipse key={a} cx={fx + 13 * Math.cos(a * rad)} cy={fy + 13 * Math.sin(a * rad)} rx={11} ry={6.5} transform={`rotate(${a} ${fx + 13 * Math.cos(a * rad)} ${fy + 13 * Math.sin(a * rad)})`} fill="#ff8f5e" opacity={0.92} />
                    ))}
                    <circle cx={fx} cy={fy} r={6} fill="#ffd27a" />
                  </g>
                );
              })}
            </g>
          ))}
        </Capa>

        {/* óptica: halo sobre todo, destello anamórfico y fantasmas del lente */}
        <AbsoluteFill style={{ mixBlendMode: "screen", pointerEvents: "none" }}>
          <svg width={1920} height={1080} style={{ overflow: "visible" }}>
            <defs>
              <radialGradient id="bloom">
                <stop offset="0" stopColor="#ffd9a0" stopOpacity="0.55" />
                <stop offset="1" stopColor="#ff9050" stopOpacity="0" />
              </radialGradient>
              <linearGradient id="estria" x1="0" x2="1">
                <stop offset="0" stopColor="#8fb8ff" stopOpacity="0" />
                <stop offset="0.5" stopColor="#ffe9c8" stopOpacity="0.7" />
                <stop offset="1" stopColor="#8fb8ff" stopOpacity="0" />
              </linearGradient>
              <filter id="suaveLente">
                <feGaussianBlur stdDeviation="2.5" />
              </filter>
            </defs>
            <circle cx={SX} cy={SY} r={420} fill="url(#bloom)" opacity={0.7} />
            <rect x={SX - 420} y={SY - 5} width={840} height={10} fill="url(#estria)" filter="url(#suaveLente)" opacity={0.3} />
            {[
              [0.55, 26, "#ffcf8a", 0.16],
              [0.95, 64, "#9fb6ff", 0.07],
              [1.3, 14, "#ffe2b0", 0.2],
              [1.65, 90, "#ff9f7a", 0.05],
            ].map(([u, rr, col, op], i) => (
              <circle
                key={i}
                cx={SX + (960 - SX) * 2 * (u as number)}
                cy={SY + (540 - SY) * 2 * (u as number)}
                r={rr as number}
                fill={col as string}
                opacity={op as number}
                filter="url(#suaveLente)"
              />
            ))}
          </svg>
        </AbsoluteFill>
      </CamaraMano>
      <AbsoluteFill style={{ backgroundColor: "#000", opacity: fundido }} />
    </AbsoluteFill>
  );
};
