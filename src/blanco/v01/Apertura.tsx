// b01 · LA APERTURA (vara del creador 28-oct): abre los ojos en el barro, todo negro → parpadea → se aclara, la cámara
// arranca pegada a su cara y se aleja hasta mostrar una Londres viva; en cada segundo pasa algo, pero limpio.
// Todo va clavado a la PALABRA (tiempos del ASR de cada idioma, en segundos), no a fracciones del bloque.
import React from "react";
import { AbsoluteFill, interpolate, spring, useVideoConfig } from "remotion";
import { mira, useF } from "../../anikit/camara";
import { F_MANO } from "../../anikit/pantalla";
import { PasoGuion } from "../../stickman3d/acciones";
import { Personaje } from "../capa3d";
import { ROPA } from "../elenco";
import { Dato, EscenaB, Idioma } from "../escena";
import { Simbolo } from "../simbolos";
import { CalleMedieval, Gallina, Gato, PAL_LONDRES as PAL, PISO, Rata } from "../sets/londres";
import { Despertar, Haz, Humo, Moscas, Niebla, Pajaros, PasaFrente, Polvo, Salpicon, transeuntes } from "../vida";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
// palabra → segundo (b01_es.json / b01_en.json). EN arranca con 5 s de «So I sent a stickman to London. The year is 1348»
const T = {
  es: { ojos: 0.5, olor: 2.2, humo: 3.0, barro: 3.6, peor: 4.6, levanta: 5.5, gente: 6.0, raro: 7.1, muy: 7.6, porque: 8.6, pies: 9.5, zapas: 10.4, londres: 11.6, anio: 12.5, dias: 14.4, plaga: 16.5, peste: 17.6, mitad: 19.6, ciudad: 20.2, dinero: 21.2, casa: 22.2, hablas: 22.8, ventaja: 24.7, sabes: 25.7, pasar: 26.3, cuanto: 29.1, hora: 31.4 },
  en: { ojos: 5.4, olor: 9.4, humo: 10.5, barro: 11.4, peor: 13.1, levanta: 13.8, gente: 14.2, raro: 15.3, muy: 15.9, porque: 16.7, pies: 17.6, zapas: 19.3, londres: 24.7, anio: 25.2, dias: 20.7, plaga: 22.1, peste: 22.6, mitad: 27.5, ciudad: 28.0, dinero: 29.4, casa: 30.3, hablas: 31.6, ventaja: 34.7, sabes: 35.9, pasar: 36.5, cuanto: 40.4, hora: 38.8 },
};
const X = 1500; // donde despierta: frente al puesto de repollos, con casas a los dos lados y la catedral atrás
const CARA: [number, number] = [X - 300, PISO - 36]; // la cara cuando está tirado (rz 90, pivote en los pies)

// el año que rueda hacia atrás 2026 → 1348: cada cifra es un tambor que gira con su propio resorte (de derecha a izquierda)
const Anio: React.FC<{ desde: number; rueda: number; hasta: number; titulo: string; y?: number }> = ({ desde, rueda, hasta, titulo, y = 330 }) => {
  const f = useF();
  const { fps } = useVideoConfig();
  if (f < desde - 2 || f > hasta + 14) return null;
  const ent = spring({ frame: f - desde, fps, config: { damping: 13, stiffness: 120, mass: 0.8 } });
  const sal = interpolate(f, [hasta, hasta + 14], [0, 1], cl);
  const de = [2, 0, 2, 6], a = [1, 3, 4, 8];
  const H = 170;
  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity: 1 - sal }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: y - 150 - (1 - ent) * 40, textAlign: "center", fontFamily: F_MANO, fontWeight: 700, fontSize: 96, color: "#fff6e6", letterSpacing: 10, WebkitTextStroke: "3px #1d1410", textShadow: "0 7px 0 #1d1410", opacity: ent, transform: `translateY(${-sal * 30}px)` }}>{titulo}</div>
      <div style={{ position: "absolute", left: "50%", top: y, transform: `translate(-50%,0) scale(${0.6 + 0.4 * ent}) translateY(${sal * -30}px)`, display: "flex", gap: 14, opacity: ent }}>
        {de.map((d0, i) => {
          // recorrido del tambor: hacia atrás (cifras bajan), más vueltas en las cifras de la derecha
          const vueltas = (3 - i) * 10 + ((d0 - a[i] + 10) % 10);
          const u = spring({ frame: f - rueda - (3 - i) * 4, fps, config: { damping: 18, stiffness: 46, mass: 1.1 } });
          const pos = d0 - u * vueltas; // cifra actual (continua)
          return (
            <div key={i} style={{ width: 132, height: H, overflow: "hidden", position: "relative", background: "linear-gradient(#2a1c12,#4a3424 50%,#2a1c12)", borderRadius: 18, border: "5px solid #1d1410", boxShadow: "0 10px 0 #1d1410, inset 0 18px 22px rgba(0,0,0,.55), inset 0 -18px 22px rgba(0,0,0,.55)" }}>
              {[-1, 0, 1].map((k) => {
                const n = Math.floor(pos) + k;
                const off = (n - pos) * H;
                return <div key={k} style={{ position: "absolute", left: 0, right: 0, top: off, height: H, lineHeight: `${H}px`, textAlign: "center", fontFamily: F_MANO, fontWeight: 700, fontSize: 150, color: u > 0.98 ? "#ffd23c" : "#fff6e6", transform: `scaleY(${1 - Math.min(0.35, Math.abs(off) / H) })` }}>{((n % 10) + 10) % 10}</div>;
              })}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// zapatilla moderna (blanca con franja roja) calzada sobre el pie 3D de Tiza
const Zapa: React.FC<{ x: number; y: number; r?: number; flip?: boolean }> = ({ x, y, r = 0, flip }) => (
  <g transform={`translate(${x},${y}) rotate(${r}) scale(${flip ? -0.42 : 0.42},0.42)`}>
    <path d="M-46 0 Q-48 -34 -18 -38 L12 -32 Q44 -24 50 -6 L50 6 L-46 6 Z" fill="#fafafa" stroke="#1d1410" strokeWidth={6} />
    <path d="M-46 1 H50" stroke="#ff4a3d" strokeWidth={9} /><path d="M-12 -30 l10 10 M2 -30 l10 10" stroke="#3a6ad8" strokeWidth={5} />
  </g>
);

// oscurecimiento de pantalla que se va: el mundo «se aclara» después de abrir los ojos
const Aclara: React.FC<{ desde: number; dur: number }> = ({ desde, dur }) => {
  const f = useF();
  const o = interpolate(f, [desde, desde + dur], [0.62, 0], { ...cl, easing: (u) => 1 - (1 - u) ** 2 });
  return o > 0 ? <AbsoluteFill style={{ background: "#120a04", opacity: o, pointerEvents: "none" }} /> : null;
};

export const Apertura: React.FC<{ D: number; L: Idioma }> = ({ L }) => {
  const f = useF();
  const t = T[L];
  const F = (s: number) => Math.round(s * 30);
  const tx = (es: string, en: string) => (L === "es" ? es : en);
  const sube = t.levanta + 0.15; // empieza a levantarse
  // se levanta: de tirado (90°) a parado con resorte pesado (pasa un poquito y asienta)
  const rzTiza = (s: number) => {
    if (s < sube) return 90 + Math.sin(s * 1.1) * 1.5;
    const u = spring({ frame: (s - sube) * 30, fps: 30, config: { damping: 11, stiffness: 70, mass: 1.2 } });
    return 90 * (1 - u);
  };
  const guionTiza: PasoGuion[] = [
    { t: 0, accion: "idle", expr: "dormido" },
    { t: t.ojos + 0.9, accion: "idle", expr: "confundido", mirada: [0.3, 0.6] },
    { t: t.olor, accion: "idle", expr: "asqueado", mirada: [0.6, 0.2] },
    { t: t.humo, accion: "idle", expr: "confundido", mirada: [-0.6, 0.4] },
    { t: t.peor + 0.15, accion: "idle", expr: "espantado", mirada: [0.8, -0.2] },
    { t: sube, accion: "idle", expr: "confundido", mirada: "camara" },
    { t: t.gente + 0.4, accion: "idle", expr: "nervioso", mirada: [-0.8, 0] },
    { t: t.raro + 0.3, accion: "idle", expr: "nervioso", mirada: [0.8, 0] },
    { t: t.porque, accion: "pensar", expr: "confundido" },
    { t: t.pies, accion: "idle", expr: "sorprendido", mirada: [0, -1] },
    { t: t.zapas + 0.1, accion: "idle", expr: "espantado", mirada: "camara" },
    { t: t.londres, accion: "idle", expr: "sorprendido", mirada: [0.4, 0.8] },
    { t: t.dias, accion: "idle", expr: "nervioso", mirada: [1, 0.2], rotY: 30 },
    { t: t.peste, accion: "asustarse", expr: "espantado", rotY: 40 },
    { t: t.dinero, accion: "encogerse_de_hombros", expr: "triste", rotY: 0 },
    { t: t.hablas, accion: "idle", expr: "confundido" },
    { t: t.ventaja, accion: "explicar", expr: "sonrisa_picara" },
    { t: t.sabes, accion: "pensar", expr: "sonrisa_picara", mirada: "camara" },
    { t: t.cuanto, accion: "cruzarse_de_brazos", expr: "decidido", mirada: "camara" },
  ];
  // la niebla de la peste: llega en «peste» y se clava en la MITAD del cuadro en «mitad» (resorte que se pasa y vuelve)
  const mitadX = X + 700; // centro de cámara en ese momento
  const nb = spring({ frame: f - F(t.peste - 0.4), fps: 30, config: { damping: 30, stiffness: 18, mass: 1.4 } });
  const nb2 = spring({ frame: f - F(t.mitad - 0.3), fps: 30, config: { damping: 9, stiffness: 90, mass: 0.9 } });
  const sale = interpolate(f, [F(t.dinero - 0.3), F(t.dinero + 0.9)], [0, 1], { ...cl, easing: (u) => u * u });
  const borde = interpolate(nb, [0, 1], [X + 3600, X + 1900]) + interpolate(nb2, [0, 1], [0, mitadX - (X + 1900)]) + sale * 3000;
  const vecinos: Personaje[] = [
    // el que viene caminando, se frena al verlo y lo señala
    { x: X + 520, ropa: ROPA.granjero, semilla: 3, prof: -0.6, guion: [{ t: 0, accion: "caminar", rotY: -90 }, { t: t.gente + 0.2, accion: "cruzarse_de_brazos", rotY: -50, expr: "confundido" }, { t: t.raro, accion: "senalar", rotY: -50, expr: "asqueado", objetivo: [-1, -0.3] }, { t: t.zapas, accion: "senalar", rotY: -50, expr: "sorprendido", objetivo: [-1, -1] }, { t: t.peste - 0.2, accion: "correr", rotY: -90, expr: "espantado" }],
      mov: (s) => ({ dx: s < t.gente + 0.2 ? -(t.gente + 0.2 - s) * 120 : s > t.peste - 0.2 ? -(s - t.peste + 0.2) * 520 : 0 }) },
    // la señora del moño: se ríe de él
    { x: X - 430, ropa: ROPA.tabernera, semilla: 41, prof: -0.9, guion: [{ t: 0, accion: "idle", rotY: 40, expr: "neutral" }, { t: t.raro - 0.1, accion: "reir", rotY: 45, expr: "carcajada" }, { t: t.porque + 0.5, accion: "cruzarse_de_brazos", rotY: 40, expr: "sonrisa_picara" }, { t: t.peste - 0.1, accion: "correr", rotY: -90, expr: "espantado" }],
      mov: (s) => ({ dx: s > t.peste - 0.1 ? -(s - t.peste + 0.1) * 480 : 0 }) },
    // el trapero de anteojos, atrás, se da vuelta en «muy raro»
    { x: X + 260, ropa: ROPA.panadero, semilla: 13, prof: -2.4, escala: 0.9, guion: [{ t: 0, accion: "tipear", rotY: 180, expr: "aburrido" }, { t: t.muy, accion: "asustarse", rotY: -20, expr: "sorprendido" }, { t: t.muy + 1, accion: "idle", rotY: -20, expr: "asqueado" }, { t: t.peste, accion: "correr", rotY: -90, expr: "espantado" }],
      mov: (s) => ({ dx: s > t.peste ? -(s - t.peste) * 440 : 0 }) },
  ];
  const gente = transeuntes({ x0: X - 1700, x1: X + 2600, n: 14, seed: "b01", dur: 33 });
  return (
    <>
      <EscenaB Set={CalleMedieval} pal={PAL} momento="amanecer" mano={2.5} seed={11}
        claves={[
          mira(0, CARA[0] + 10, CARA[1] - 8, 5.6),
          mira(F(t.olor), CARA[0] - 6, CARA[1] - 14, 5.0, { curva: "inout" }),
          mira(F(t.peor + 0.1), CARA[0] + 24, CARA[1] - 4, 5.3, { curva: "inout", rot: 1.5 }),
          mira(F(sube + 0.35), X - 150, PISO - 170, 3.1, { curva: "fluida", rot: 0.5 }),
          mira(F(t.gente + 1.1), X + 40, PISO - 260, 1.45, { curva: "fluida" }),
          mira(F(t.porque - 0.2), X + 120, PISO - 320, 0.95, { curva: "fluida", rot: -0.6 }),
          mira(F(t.pies + 0.9), X + 4, PISO - 50, 2.7, { curva: "inout", rot: 0.8 }),
          mira(F(t.zapas + 0.7), X - 4, PISO - 60, 2.5, { curva: "inout" }),
          mira(F(t.anio + 0.9), X + 380, PISO - 620, 0.55, { curva: "fluida", rot: -0.8 }),
          mira(F(t.plaga), X + 640, PISO - 560, 0.6, { curva: "fluida" }),
          mira(F(t.peste + 0.4), X + 760, PISO - 400, 0.78, { curva: "fluida", rot: -0.6 }),
          mira(F(t.mitad + 0.2), mitadX, PISO - 380, 0.82, { curva: "fluida", rot: -1.2 }),
          mira(F(t.casa), X + 30, PISO - 240, 1.55, { curva: "fluida" }),
          mira(F(t.ventaja + 0.4), X, PISO - 270, 1.9, { curva: "fluida" }),
          mira(F(t.pasar + 0.6), X - 10, PISO - 290, 2.7, { curva: "inout" }),
          mira(F(t.cuanto + 0.3), X + 60, PISO - 260, 1.25, { curva: "inout", rot: -0.5 }),
          mira(F(t.hora + 1.5), X + 90, PISO - 250, 1.15, { curva: "out" }),
        ]}
        personajes={[...gente, ...vecinos, { x: X, guion: guionTiza, semilla: 7, ropa: ROPA.tiza, mov: (s) => ({ rz: rzTiza(s), dy: s < sube ? 22 : 22 * Math.max(0, 1 - (s - sube) * 2) }) }]}
        detras={<>
          <Gallina x={X - 900} f={f} /><Gallina x={X + 1300} dir={-1} f={f} fase={2} />
          <Gato x={X - 1250} y={PISO - 300} f={f} s={0.8} enojado={false} />
        </>}
        sobre={<>
          <Haz x={X - 900} ancho={300} o={0.2} /><Haz x={X + 350} ancho={210} inclin={380} o={0.16} /><Haz x={X + 1700} ancho={340} o={0.18} />
          <Polvo x0={X - 900} x1={X + 900} y0={PISO - 900} n={46} o={0.75} />
          {f < F(sube + 1.5) && <Moscas x={CARA[0] + 40} y={CARA[1] - 50} n={4} r={46} />}
          <Simbolo tipo="olor" x={CARA[0] + 8} y={CARA[1] - 70} desde={F(t.olor)} hasta={F(t.humo + 0.2)} s={0.55} />
          <Humo x0={CARA[0] + 220} x1={CARA[0] - 260} y={CARA[1] - 60} desde={F(t.humo - 0.2)} dur={42} r={46} />
          <Salpicon x={CARA[0] + 70} y={PISO} desde={F(t.barro)} fuerza={0.45} seed="barro1" />
          
          {/* lo que cae de la ventana en «algo mucho peor» */}
          {/* «algo mucho peor»: una rata le pasa por encima de la cara */}
          {f >= F(t.peor - 0.35) && f < F(t.peor + 1.2) && <Rata x={CARA[0] + 260 - (f - F(t.peor - 0.35)) * 17} y={CARA[1] + 30 - Math.max(0, 1 - Math.abs((f - F(t.peor + 0.15)) / 9)) * 40} ang={180} f={f * 2} s={1.15} />}
          <Simbolo tipo="!" x={CARA[0] + 10} y={CARA[1] - 64} desde={F(t.peor + 0.1)} hasta={F(sube)} s={0.5} />
          {/* las miradas: un «?» por vecino, uno detrás de otro */}
          <Simbolo tipo="?" x={X + 520} y={PISO - 420} desde={F(t.raro - 0.2)} hasta={F(t.porque + 0.4)} s={0.9} />
          <Simbolo tipo="?" x={X - 430} y={PISO - 420} desde={F(t.raro + 0.2)} hasta={F(t.porque + 0.4)} s={0.75} />
          <Simbolo tipo="!?" x={X + 260} y={PISO - 400} desde={F(t.muy)} hasta={F(t.porque + 0.6)} s={0.7} />
          <Pajaros x0={X - 1400} x1={X + 2600} y={PISO - 1050} desde={F(t.anio - 0.8)} dur={150} n={7} s={1.3} />
          <Pajaros x0={X + 2900} x1={X - 600} y={PISO - 1250} desde={F(t.dias)} dur={130} n={5} s={1} />
          <Simbolo tipo="estrellas" x={X} y={PISO - 30} desde={F(t.zapas - 0.1)} hasta={F(t.zapas + 1.1)} s={0.55} />
          <Simbolo tipo="!" x={X} y={PISO - 420} desde={F(t.zapas + 0.15)} hasta={F(t.londres)} s={0.9} />
          {/* la peste: ratas delante de la niebla, y la niebla que se clava en la mitad */}
          {f > F(t.peste - 0.5) && Array.from({ length: 16 }).map((_, i) => {
            const s0 = F(t.peste - 0.5) + i * 3;
            const xr = borde - 140 - (i % 4) * 90;
            const huye = f > F(t.mitad) ? (f - F(t.mitad)) * (14 + (i % 4) * 3) : 0;
            return f > s0 ? <Rata key={i} x={xr - huye - Math.sin(f * 0.3 + i) * 12} y={PISO + 10 + (i % 3) * 26} ang={180} f={f} fase={i} s={1.9} /> : null;
          })}
          {f > F(t.peste - 0.5) && sale < 1 && <Niebla borde={borde} />}
          {[0, 1, 2, 3].map((k) => <Simbolo key={k} tipo="calavera" x={mitadX + 260 + k * 330} y={PISO - 480 - (k % 2) * 140} desde={F(t.mitad + 0.25) + k * 4} hasta={F(t.dinero - 0.3)} s={1.2} color="#e8e0d0" />)}
          <Simbolo tipo="moneda" x={X} y={PISO - 430} desde={F(t.dinero)} hasta={F(t.casa)} s={0.8} />
          <Simbolo tipo="?" x={X} y={PISO - 430} desde={F(t.hablas)} hasta={F(t.ventaja - 0.2)} s={0.8} />
          <Simbolo tipo="bombilla" x={X} y={PISO - 450} desde={F(t.sabes)} hasta={F(t.cuanto - 0.2)} s={0.9} />
        </>}
        frente={<>
          <PasaFrente tipo="barril" x0={X + 1500} x1={X - 1500} desde={F(sube + 0.5)} dur={40} y={PISO + 330} />
        </>}
        hud={<>
          <Anio desde={F(t.londres)} rueda={F(t.anio - 0.15)} hasta={F(t.dias + 0.4)} titulo={tx("LONDRES", "LONDON")} />
          <Dato texto={tx("LA PESTE NEGRA", "THE BLACK DEATH")} x={960} y={250} desde={F(t.peste)} hasta={F(t.mitad - 0.2)} color="#ff5a3c" tam={120} rot={-3} />
          <Dato texto={tx("¿CUÁNTO DURAS?", "HOW LONG DOES HE LAST?")} x={960} y={250} desde={F(t.cuanto)} hasta={F(t.hora + 1.5)} tam={124} />
          <Aclara desde={F(t.ojos + 1.0)} dur={64} />
          <Despertar f0={F(t.ojos) - 4} fin={44} cx={960} cy={540} />
        </>}
      />
    </>
  );
};
