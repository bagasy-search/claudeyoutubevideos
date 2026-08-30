// MovLana.tsx — S15 · EL PAYOFF DEL BUCLE GRANDE
// "La caja te da doce decibeles la primera noche y seis a la tercera semana, sin que nadie toque nada.
//  No es la madera, no son los tornillos: ES LA LANA."
//
// UN SOLO MOVIMIENTO de 55,6 s (1668 frames), 5 actos, UNA `<Sequence>`, UNA atmósfera, UNA cámara
// que entra por la junta de la caja y NO vuelve a salir: termina en macro extremo sobre la fibra
// apelmazada. El avatar va EN BUCLE debajo: esto es lo único que se ve, de borde a borde.
//
// ── LA IDEA QUE TIENE QUE QUEDAR ─────────────────────────────────────────────────────────────
// Lo que absorbe NO es la fibra: es el AIRE ATRAPADO ENTRE las fibras. Adentro de la caja pasan
// tres cosas a la vez — la HUMEDAD (condensa en la superficie más fría, que es la lana), el ACEITE
// (el respiradero del cárter suelta neblina y se pega) y el POLVO (entra con el aire de
// refrigeración, un río por minuto). La lana se apelmaza, se vuelve fieltro duro, y el sonido que
// antes moría adentro ahora REBOTA y sale, como en la caja vacía.
//
// ── CÓMO ESTÁ CONSTRUIDA LA FIBRA (no es un dibujito plano) ──────────────────────────────────
// CINCO capas de filamentos a z = −250 / −130 / −10 / +130 / +280, cada una con su escala, su
// desenfoque y su cantidad, montadas como `<Plane>` dentro de la MISMA `<Layers>`. La luz fría entra
// de costado y les pinta el canto de arriba a todas. Entre las capas, a z = −70, viven LOS HUECOS:
// bolsas negras irregulares con dos motas de aire orbitando adentro — eso es literalmente el aire
// atrapado. La fibra es UNA sola instancia desde el frame 46 hasta el final (nunca se remonta): lo
// que cambia son sus cuatro estados (`humedo`, `grasa`, `polvo`, `cierre`), que avanzan acto a acto.
// Al principio RESPIRA (los hilos ondulan, los huecos laten, las motas orbitan). Al final está
// MUERTA (hilos alineados y gruesos, huecos cerrados, motas apagadas, plancha de fieltro).
//
// ⛔ Nada de Math.random(): todo sale de `rnd(k)` (el farm rinde en 60 chunks).
// ⛔ `light()` sólo con claves de `V`. La rampa de 3 paradas del color de la fibra va con
//    `interpolateColors` de Remotion (no es una función del Stage, no la estoy duplicando).
//
import React from "react";
import { AbsoluteFill, Sequence, interpolateColors, useCurrentFrame } from "remotion";
import {
  V, F_DISPLAY, clamp01, lerp, eio, rnd, rgba, gcam, light,
  VoltAtmos, SoundField, Layers, Plane, MediaCard, PhotoPlane, IconPng,
  SeamOcclude, SeamWipeMatter, zoomThrough,
  Kick, Head, Body, Em, Bed,
} from "./VoltStage";

// ── EL RELOJ DEL MOVIMIENTO ─────────────────────────────────────────────────────────────────
const END = 1668;
const A2 = 332, A3 = 632, A4 = 959, A5 = 1309;   // arranque narrativo de cada acto

// COSTURAS (una por unión; ninguna es un fundido). Cada una cae DENTRO del solape de sus actos.
const ZT = 58;      // zoom-through por la junta de la caja (entrada del movimiento)
const S_JUNTA = 74; // occluder: el espesor del contrachapado cruzando el lente
const S12 = 330;    // herencia de luz: el frente ámbar se APAGA cruzando el cuadro
const S23 = 640;    // occluder de materia: la manguerita de goma del respiradero
const S34 = 962;    // wipe de materia: el río de polvo entra y detrás ya está la boca de aire
const S45 = 1314;   // metamorfosis: los huecos negros SON las celdas verde-voltio

const LN = (g: number, a: number, b: number) => clamp01((g - a) / Math.max(1, b - a));
const ES = (g: number, a: number, b: number) => eio(0, 1, LN(g, a, b));

// ── LOS RÓTULOS DE ESTADO — UNA sola instancia que cambia de texto (nunca se remonta) ────────
const ESTADOS = [
  { at: 98, t: "FIBRA ABIERTA" },
  { at: 452, t: "FIBRA HÚMEDA" },
  { at: 782, t: "FIBRA GRASA" },
  { at: 1078, t: "LOS HUECOS SE ESTÁN LLENANDO" },
  { at: 1432, t: "SIN AIRE, NO ABSORBE" },
];

const Estado: React.FC<{ g: number; color: string }> = ({ g, color }) => {
  let cur = ESTADOS[0];
  for (let i = 0; i < ESTADOS.length; i++) if (g >= ESTADOS[i].at) cur = ESTADOS[i];
  if (g < ESTADOS[0].at) return null;
  const p = LN(g, cur.at, cur.at + 16);
  return (
    <div style={{
      position: "absolute", left: 150, bottom: 118,
      padding: "13px 24px", borderRadius: 8,
      background: "linear-gradient(180deg, rgba(8,9,6,0.88) 0%, rgba(8,9,6,0.66) 100%)",
      boxShadow: `0 14px 40px rgba(0,0,0,0.6), inset 0 0 0 1px ${rgba(color, 0.28)}`,
      clipPath: `inset(0 ${(100 - p * 100).toFixed(1)}% 0 0)`,
    }}>
      <div style={{
        fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 30, letterSpacing: 5.4,
        color, textTransform: "uppercase", whiteSpace: "nowrap",
      }}>{cur.t}</div>
    </div>
  );
};

// ── TITULAR — entra por barrido (clip-path), NUNCA por fade ─────────────────────────────────
const Titular: React.FC<{
  g: number; at: number; out?: number; kick: string; children: React.ReactNode; top?: number; color?: string;
}> = ({ g, at, out = 999999, kick, children, top = 128, color = V.volt }) => {
  const inP = ES(g, at, at + 18);
  const outP = ES(g, out, out + 15);
  if (inP <= 0 || outP >= 1) return null;
  const p = clamp01(inP - outP);
  return (
    <div style={{
      position: "absolute", left: 150, top,
      transform: `translateY(${((1 - inP) * 26 - outP * 20).toFixed(1)}px)`,
      clipPath: `inset(0 ${(100 - p * 100).toFixed(1)}% -34% 0)`,
      maxWidth: 1180,
    }}>
      <Bed pad={24}>
        <Kick color={color}>{kick}</Kick>
        <div style={{ height: 9 }} />
        {children}
      </Bed>
    </div>
  );
};

// ── UNA CAPA DE FILAMENTOS ──────────────────────────────────────────────────────────────────
// Hilos cruzados de verdad: cada uno con su ángulo, su largo, su espesor y su canto iluminado por
// la luz fría lateral. `resp` es la respiración (se apaga con `cierre`: la fibra muerta no ondula).
const Capa: React.FC<{
  g: number; seed: number; n: number; sc: number; blur: number; op: number;
  col: string; frio: string; grasa: number; polvo: number; cierre: number;
}> = ({ g, seed, n, sc, blur, op, col, frio, grasa, polvo, cierre }) => (
  <div style={{
    position: "absolute", inset: 0, opacity: op,
    filter: blur > 0.05 ? `blur(${blur.toFixed(2)}px)` : undefined,
  }}>
    {Array.from({ length: n }, (_, i) => {
      const k = seed + i * 3.77;
      const y0 = 3 + rnd(k) * 94;
      // al apelmazarse los hilos se juntan hacia la banda central: la lana BAJA de altura
      const y = lerp(y0, 50 + (y0 - 50) * 0.27, cierre);
      const x = -6 + rnd(k * 1.9) * 88;
      const ang0 = -36 + rnd(k * 2.3) * 72;
      const ang = lerp(ang0, ang0 * 0.09, cierre);            // y se ALINEAN: fieltro, no lana
      const len = (26 + rnd(k * 3.1) * 48) * (1 + 0.42 * cierre);
      const th = (3.2 + rnd(k * 4.3) * 5.4) * sc * (1 + 0.32 * grasa + 0.46 * polvo + 1.25 * cierre);
      const resp = Math.sin(g / (32 + rnd(k * 5.1) * 32) + i * 1.7) * (1 - cierre) * 3.4 * sc;
      return (
        <div key={i} style={{
          position: "absolute", left: `${x.toFixed(2)}%`, top: `${y.toFixed(2)}%`,
          width: `${len.toFixed(1)}%`, height: th, marginTop: -th / 2,
          transform: `rotate(${ang.toFixed(2)}deg) translateY(${resp.toFixed(2)}px)`,
          transformOrigin: "0% 50%", borderRadius: th,
          background: `linear-gradient(90deg, rgba(0,0,0,0) 0%, ${rgba(col, 0.42)} 8%, ${col} 30%, ${col} 68%, ${rgba(col, 0.42)} 92%, rgba(0,0,0,0) 100%)`,
          boxShadow: `0 ${Math.max(1, Math.round(th * 0.5))}px ${Math.max(2, Math.round(th * 1.6))}px ${rgba(V.ink0, 0.62)}`,
        }}>
          {/* el canto de arriba: la luz fría lateral atravesando la fibra. Con aceite, ESPEJEA. */}
          <div style={{
            position: "absolute", left: "7%", right: "13%", top: Math.max(0.6, th * 0.15),
            height: Math.max(1, th * 0.24), borderRadius: th,
            background: rgba(frio, 0.2 + 0.52 * grasa),
            opacity: 0.55 + 0.45 * grasa,
          }} />
          {/* el polvo que se quedó pegado ENCIMA del aceite */}
          {polvo > 0.02 && Array.from({ length: 5 }, (_, d) => {
            const dk = k * 1.3 + d * 2.11;
            const s = (1.6 + rnd(dk) * 2.6) * sc;
            return (
              <div key={d} style={{
                position: "absolute", left: `${(9 + d * 17 + rnd(dk * 1.7) * 9).toFixed(1)}%`,
                top: Math.max(0, th * (0.1 + rnd(dk * 2.3) * 0.7) - s / 2),
                width: s, height: s, borderRadius: "50%",
                background: rgba(V.concrete, 0.34 + 0.5 * polvo),
              }} />
            );
          })}
        </div>
      );
    })}
  </div>
);

// Las cinco capas: distinta profundidad, distinto tamaño, distinto desenfoque.
const CAPAS = [
  { z: -250, n: 14, sc: 0.5, blur: 3.4, op: 0.40, seed: 11.3 },
  { z: -130, n: 12, sc: 0.72, blur: 1.5, op: 0.66, seed: 27.1 },
  { z: -10, n: 11, sc: 1.0, blur: 0, op: 1, seed: 43.9 },
  { z: 130, n: 8, sc: 1.42, blur: 2.4, op: 0.8, seed: 61.7 },
  { z: 280, n: 5, sc: 2.1, blur: 7.0, op: 0.42, seed: 83.5 },
];

// ── LOS HUECOS — el aire atrapado ENTRE las fibras (el corazón del movimiento) ───────────────
// Bolsas negras irregulares con DOS motas orbitando adentro. `relleno` las va tapando (acto 4),
// `marca` las enciende en verde-voltio (acto 5) y cada una se apaga en SU propio frame.
const N_HUECOS = 24;
const Huecos: React.FC<{ g: number; relleno: number; marca: number; cierre: number }> = ({
  g, relleno, marca, cierre,
}) => (
  <div style={{ position: "absolute", inset: 0 }}>
    {Array.from({ length: N_HUECOS }, (_, i) => {
      const k = 7.3 + i * 2.93;
      const x = 4 + rnd(k) * 88;
      const y = 8 + rnd(k * 1.7) * 80;
      const late = 1 + Math.sin(g / (44 + rnd(k * 3.1) * 34) + i * 0.9) * 0.09 * (1 - cierre);
      // el hueco se cierra: primero lo rellena la mugre, después lo aplasta el peso
      const s = (46 + rnd(k * 2.1) * 92) * late * (1 - 0.24 * relleno) * (1 - 0.88 * cierre);
      const apagaAt = 1392 + rnd(k * 4.7) * 168;                    // se apagan UNO A UNO
      const viva = clamp01(marca) * (1 - LN(g, apagaAt, apagaAt + 26));
      const r1 = (36 + rnd(k * 5.3) * 34).toFixed(0);
      const r2 = (38 + rnd(k * 6.1) * 32).toFixed(0);
      if (s < 3) return null;
      return (
        <div key={i} style={{
          position: "absolute", left: `${x.toFixed(2)}%`, top: `${y.toFixed(2)}%`,
          width: s, height: s * (0.66 + rnd(k * 7.7) * 0.4), marginLeft: -s / 2, marginTop: -s / 2,
          borderRadius: `${r1}% ${r2}% ${r2}% ${r1}% / ${r2}% ${r1}% ${r2}% ${r1}%`,
          background:
            `radial-gradient(closest-side, ${rgba(V.ink0, 0.94 * (1 - 0.5 * relleno))} 0%, ${rgba(V.ink0, 0.5 * (1 - 0.5 * relleno))} 58%, rgba(0,0,0,0) 78%), ` +
            `radial-gradient(closest-side, ${rgba(V.concrete, 0.5 * relleno)} 0%, rgba(0,0,0,0) 74%)`,
          boxShadow: viva > 0.01
            ? `inset 0 0 0 1.6px ${rgba(V.volt, 0.72 * viva)}, inset 0 0 ${Math.round(s * 0.4)}px ${rgba(V.volt, 0.34 * viva)}, 0 0 ${Math.round(s * 0.5)}px ${rgba(V.volt, 0.26 * viva)}`
            : "none",
        }}>
          {/* EL AIRE: dos motas orbitando muy despacio adentro del hueco. Se apagan con el hueco. */}
          {[0, 1].map((m) => {
            const ph = g / (58 + rnd(k * 8.3 + m) * 46) + m * 3.1 + i;
            const rr = s * (0.14 + rnd(k * 9.1 + m) * 0.16);
            const vivo = (1 - cierre) * (1 - 0.55 * relleno);
            if (vivo <= 0.02) return null;
            return (
              <div key={m} style={{
                position: "absolute", left: "50%", top: "50%",
                width: 3.4, height: 3.4, marginLeft: -1.7, marginTop: -1.7, borderRadius: "50%",
                transform: `translate(${(Math.cos(ph) * rr).toFixed(2)}px, ${(Math.sin(ph * 0.8) * rr * 0.7).toFixed(2)}px)`,
                background: rgba(V.white, 0.34 * vivo + 0.3 * viva),
                boxShadow: `0 0 7px ${rgba(V.white, 0.24 * vivo)}`,
              }} />
            );
          })}
        </div>
      );
    })}
  </div>
);

// ── LAS GOTAS — nacen en los cruces de los hilos y las que engordan RESBALAN ─────────────────
const N_GOTAS = 30;
const Gotas: React.FC<{ g: number; on: number; turbio: number }> = ({ g, on, turbio }) => {
  if (on <= 0.01) return null;
  const vidrio = light(turbio, "sky", "copper");
  return (
    <div style={{ position: "absolute", inset: 0 }}>
      {Array.from({ length: N_GOTAS }, (_, i) => {
        const k = 3.9 + i * 4.13;
        const nace = 366 + rnd(k) * 186;
        const t = LN(g, nace, nace + 96);
        if (t <= 0) return null;
        const r = (3 + rnd(k * 1.7) * 9) * t * on;
        if (r < 0.8) return null;
        // las gordas resbalan hacia abajo por la fibra y se frenan en el hilo de abajo
        const gorda = clamp01((r - 6.5) / 4);
        const cae = gorda * 34 * LN(g, nace + 60, nace + 190);
        return (
          <div key={i} style={{
            position: "absolute", left: `${(5 + rnd(k * 2.3) * 88).toFixed(2)}%`,
            top: `${(9 + rnd(k * 3.1) * 78).toFixed(2)}%`,
            width: r * 2, height: r * 2.24, marginLeft: -r, marginTop: -r,
            transform: `translateY(${cae.toFixed(2)}px)`,
            borderRadius: "50% 50% 52% 52% / 46% 46% 54% 54%",
            background: `radial-gradient(38% 32% at 34% 28%, ${rgba(V.white, 0.72 - 0.34 * turbio)} 0%, ${rgba(vidrio, 0.3)} 46%, ${rgba(V.ink0, 0.42)} 100%)`,
            boxShadow: `inset 0 -1px 3px ${rgba(V.white, 0.2)}, 0 2px 6px ${rgba(V.ink0, 0.6)}`,
            opacity: on * (0.55 + 0.45 * t),
          }} />
        );
      })}
    </div>
  );
};

// ── EL RESPIRADERO DEL CÁRTER — una boquilla de goma con su manguerita, LATIENDO ─────────────
const Respiradero: React.FC<{ g: number; on: number; luz: string }> = ({ g, on, luz }) => {
  if (on <= 0.01) return null;
  const late = Math.pow(clamp01(Math.sin((g / 54) * Math.PI * 2) * 0.5 + 0.5), 3);
  return (
    <div style={{ position: "absolute", left: "13%", top: "58%", width: 520, height: 300, opacity: on }}>
      {/* la manguerita de goma negra */}
      <div style={{
        position: "absolute", left: 0, top: 140, width: 300, height: 34, borderRadius: 18,
        transform: "rotate(-13deg)",
        background: `linear-gradient(180deg, ${rgba(V.steel, 0.22)} 0%, ${V.ink2} 34%, ${rgba(V.ink0, 0.95)} 100%)`,
        boxShadow: `0 10px 26px ${rgba(V.ink0, 0.8)}`,
      }} />
      {/* la abrazadera */}
      <div style={{
        position: "absolute", left: 236, top: 118, width: 30, height: 62, borderRadius: 6,
        transform: "rotate(-13deg)",
        background: `linear-gradient(180deg, ${rgba(V.white, 0.5)} 0%, ${V.steel} 40%, ${rgba(V.ink0, 0.9)} 100%)`,
      }} />
      {/* la boquilla: se dilata en cada latido */}
      <div style={{
        position: "absolute", left: 262, top: 108, width: 96, height: 82, borderRadius: "24px 40px 40px 24px",
        transform: `rotate(-9deg) scaleY(${(1 + late * 0.13).toFixed(3)})`,
        background: `linear-gradient(168deg, ${rgba(V.steel, 0.34)} 0%, ${V.ink2} 46%, ${rgba(V.ink0, 0.98)} 100%)`,
        boxShadow: `inset 0 2px 0 ${rgba(luz, 0.32)}, 0 14px 34px ${rgba(V.ink0, 0.86)}`,
      }} />
      {/* la boca, iluminada de costado */}
      <div style={{
        position: "absolute", left: 344, top: 126, width: 26, height: 44, borderRadius: "50%",
        background: `radial-gradient(closest-side, ${rgba(V.ink0, 0.98)} 40%, ${rgba(luz, 0.3 + 0.4 * late)} 100%)`,
        boxShadow: `0 0 ${Math.round(14 + 40 * late)}px ${rgba(luz, 0.24 * late)}`,
      }} />
    </div>
  );
};

// ── LA NEBLINA DE ACEITE — sale del respiradero, viaja, y SE PEGA (no rebota) ────────────────
const N_NEBLA = 44;
const Neblina: React.FC<{ g: number; on: number; luz: string }> = ({ g, on, luz }) => {
  if (on <= 0.01) return null;
  return (
    <div style={{ position: "absolute", inset: 0, opacity: on }}>
      {Array.from({ length: N_NEBLA }, (_, i) => {
        const k = 5.7 + i * 1.97;
        const pulso = Math.floor(i / 8);
        const nace = S23 + 26 + pulso * 54 + rnd(k) * 16;
        const t = LN(g, nace, nace + 132);
        if (t <= 0) return null;
        const tx = 34 + rnd(k * 1.9) * 52;                    // dónde se PEGA
        const ty = 16 + rnd(k * 2.7) * 66;
        const x = lerp(20, tx, ES(g, nace, nace + 118));
        const y = lerp(74, ty, ES(g, nace, nace + 118)) + Math.sin(t * 5 + i) * 3.4 * (1 - t);
        const s = lerp(4, 15 + rnd(k * 3.3) * 12, Math.min(1, t * 2.6)) * (1 - 0.45 * t);
        return (
          <div key={i} style={{
            position: "absolute", left: `${x.toFixed(2)}%`, top: `${y.toFixed(2)}%`,
            width: s, height: s, marginLeft: -s / 2, marginTop: -s / 2, borderRadius: "50%",
            background: `radial-gradient(closest-side, ${rgba(luz, 0.3 * (1 - t * 0.62))}, rgba(0,0,0,0) 70%)`,
            filter: "blur(2.4px)",
          }} />
        );
      })}
    </div>
  );
};

// ── EL CODO DE LÁMINA GALVANIZADA — la boca de entrada del aire de refrigeración ─────────────
const Codo: React.FC<{ on: number; luz: string }> = ({ on, luz }) => {
  if (on <= 0.01) return null;
  return (
    <div style={{ position: "absolute", left: "-4%", top: "34%", width: 560, height: 520, opacity: on }}>
      <div style={{
        position: "absolute", left: 0, top: 0, width: 360, height: 250,
        transform: "skewY(11deg)",
        background: `linear-gradient(102deg, ${rgba(V.white, 0.28)} 0%, ${V.steel} 22%, ${rgba(V.ink2, 0.95)} 78%, ${rgba(V.ink0, 0.98)} 100%)`,
        boxShadow: `0 20px 60px ${rgba(V.ink0, 0.86)}`,
      }} />
      <div style={{
        position: "absolute", left: 118, top: 172, width: 330, height: 300,
        transform: "skewY(-24deg)",
        background: `linear-gradient(84deg, ${rgba(V.steel, 0.7)} 0%, ${rgba(V.ink2, 0.92)} 62%, ${rgba(V.ink0, 0.98)} 100%)`,
      }} />
      {/* la BOCA: el agujero negro por el que entra el río */}
      <div style={{
        position: "absolute", left: 268, top: 196, width: 210, height: 250, borderRadius: "50%",
        background: `radial-gradient(closest-side, ${rgba(V.ink0, 0.99)} 52%, ${rgba(luz, 0.26)} 96%)`,
        boxShadow: `inset 0 0 60px ${rgba(V.ink0, 0.95)}, 0 0 44px ${rgba(V.ink0, 0.8)}`,
      }} />
      {/* la junta remachada de la lámina */}
      {Array.from({ length: 7 }, (_, i) => (
        <div key={i} style={{
          position: "absolute", left: 122 + i * 8, top: 176 + i * 42, width: 7, height: 7,
          borderRadius: "50%", background: rgba(V.white, 0.3),
        }} />
      ))}
    </div>
  );
};

// ── EL RÍO DE AIRE — miles de partículas que entran y SE FRENAN contra la fibra grasa ────────
const N_RIO = 130;
const Rio: React.FC<{ g: number; on: number; luz: string }> = ({ g, on, luz }) => {
  if (on <= 0.01) return null;
  return (
    <div style={{ position: "absolute", inset: 0, opacity: on }}>
      {Array.from({ length: N_RIO }, (_, i) => {
        const k = 2.3 + i * 1.31;
        const vel = 0.0042 + rnd(k) * 0.0072;
        const fase = (((g - S34) * vel + rnd(k * 1.7)) % 1 + 1) % 1;
        const choca = 0.3 + rnd(k * 2.3) * 0.52;              // dónde se queda pegada
        const pegada = fase > choca;
        const x = lerp(2, 100, pegada ? choca : fase);
        const yBase = 22 + rnd(k * 3.1) * 62;
        const y = yBase + Math.sin(fase * 7 + i) * (pegada ? 0 : 5.5);
        const s = 1.8 + rnd(k * 4.3) * 3.4;
        const a = pegada ? 0.5 : 0.24 + 0.5 * (1 - fase);
        return (
          <div key={i} style={{
            position: "absolute", left: `${x.toFixed(2)}%`, top: `${y.toFixed(2)}%`,
            width: s * (pegada ? 1.3 : 1), height: s * (pegada ? 1.3 : 1),
            marginLeft: -s / 2, marginTop: -s / 2, borderRadius: "50%",
            background: pegada ? rgba(V.concrete, a) : rgba(luz, a),
            boxShadow: pegada ? "none" : `-${Math.round(10 + s * 4)}px 0 ${Math.round(8 + s * 3)}px -6px ${rgba(luz, a * 0.5)}`,
          }} />
        );
      })}
    </div>
  );
};

// ── LA PLANCHA DE FIELTRO — lo que queda cuando la fibra se cerró ────────────────────────────
const Fieltro: React.FC<{ g: number; on: number }> = ({ g, on }) => {
  if (on <= 0.01) return null;
  const brillo = LN(g, 1480, 1560);
  return (
    <div style={{
      position: "absolute", left: "-10%", right: "-10%", top: `${lerp(52, 40, on)}%`,
      height: lerp(90, 360, on), opacity: on,
      background: `linear-gradient(178deg, ${rgba(V.concrete, 0.16)} 0%, ${rgba(V.concrete, 0.5)} 12%, ${rgba(V.ink2, 0.94)} 62%, ${rgba(V.ink0, 0.98)} 100%)`,
      boxShadow: `inset 0 2px 0 ${rgba(V.bone, 0.24 + 0.3 * brillo)}, 0 -22px 60px ${rgba(V.ink0, 0.7)}`,
    }}>
      {/* la textura prensada: hilos aplastados uno contra el otro, ya sin huecos */}
      <div style={{
        position: "absolute", inset: 0, opacity: 0.3, mixBlendMode: "overlay",
        backgroundImage: "repeating-linear-gradient(96deg, rgba(255,255,255,.42) 0 1px, rgba(0,0,0,.5) 1px 5px)",
      }} />
      {/* el barrido especular del instante del REBOTE: el sonido pega y vuelve */}
      {brillo > 0 && brillo < 1 && (
        <div style={{
          position: "absolute", left: 0, right: 0, top: 0, height: 6,
          background: `linear-gradient(90deg, rgba(0,0,0,0) 0%, ${rgba(V.white, 0.6 * Math.sin(brillo * Math.PI))} 50%, rgba(0,0,0,0) 100%)`,
        }} />
      )}
    </div>
  );
};

// ── EL TERMÓMETRO — objeto de la escena, no gráfico: cae de caliente a frío ──────────────────
const Termometro: React.FC<{ g: number; on: number }> = ({ g, on }) => {
  if (on <= 0.01) return null;
  const cae = ES(g, S12 - 6, S12 + 92);
  const col = light(cae, "amber", "sky");
  return (
    <div style={{ position: "absolute", right: 168, top: "24%", width: 74, height: 430, opacity: on }}>
      <div style={{
        position: "absolute", left: 22, top: 0, width: 30, height: 372, borderRadius: 15,
        background: `linear-gradient(94deg, ${rgba(V.white, 0.2)} 0%, ${rgba(V.ink0, 0.82)} 40%, ${rgba(V.ink0, 0.95)} 100%)`,
        boxShadow: `inset 0 0 0 1px ${rgba(V.bone, 0.26)}, 0 14px 40px ${rgba(V.ink0, 0.8)}`,
        overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", left: 7, right: 7, bottom: 0, top: `${lerp(12, 78, cae).toFixed(1)}%`,
          borderRadius: 10, background: `linear-gradient(180deg, ${col} 0%, ${rgba(col, 0.7)} 100%)`,
          boxShadow: `0 0 22px ${rgba(col, 0.44)}`,
        }} />
      </div>
      {/* el bulbo */}
      <div style={{
        position: "absolute", left: 12, top: 352, width: 50, height: 50, borderRadius: "50%",
        background: `radial-gradient(38% 34% at 34% 30%, ${rgba(V.white, 0.36)} 0%, ${col} 46%, ${rgba(V.ink0, 0.9)} 100%)`,
        boxShadow: `0 0 26px ${rgba(col, 0.4)}, 0 10px 26px ${rgba(V.ink0, 0.8)}`,
      }} />
      {/* las marcas */}
      {Array.from({ length: 9 }, (_, i) => (
        <div key={i} style={{
          position: "absolute", left: 0, top: 22 + i * 40, width: 17, height: 2,
          background: rgba(V.bone, 0.34),
        }} />
      ))}
    </div>
  );
};

// ── LA ESCENA ───────────────────────────────────────────────────────────────────────────────
const Lana: React.FC<{ g: number }> = ({ g }) => {
  // ── LA CÁMARA: UNA sola, desciende y se acerca. Los empujones se SUMAN, nunca reinician. ──
  const cam = gcam(g, { z0: -300, z1: 250, panX: -78, panY: 34, ry: 6, rx: -2.6, dur: END });
  const retro = -92 * Math.sin(Math.PI * LN(g, 636, 908));        // acto 3: retrocede un palmo y vuelve
  const macro = lerp(0, 210, ES(g, 1430, END));                   // acto 5: el empujón al macro extremo
  const giro = lerp(0, -13, ES(g, 966, 1156)) + lerp(0, 9, ES(g, 1322, 1560)); // acto 4 encara la boca
  const camT = `${cam.transform} translateZ(${(retro + macro).toFixed(1)}px) rotateY(${giro.toFixed(2)}deg)`;

  // ── LOS CUATRO ESTADOS DE LA FIBRA (continuos: la fibra NUNCA se remonta) ─────────────────
  const humedo = ES(g, 368, 596);
  const grasa = ES(g, 700, 934);
  const polvo = ES(g, 1000, 1290);
  const cierre = ES(g, 1330, 1600);
  const carga = clamp01(humedo * 0.2 + grasa * 0.44 + polvo * 0.56);
  // la rampa de color de la lana: ocre → marrón sucio → gris parda
  const colFibra = interpolateColors(carga, [0, 0.36, 1], [V.amber, V.copper, V.concrete]);

  // ── LA LUZ: sky frío (venimos del patio de noche) → ámbar (el motor calienta) → el chasquido
  //    la apaga → frío otra vez → un guiño volt en el marcado → frío duro en el cierre. ───────
  const calor = clamp01(ES(g, 336, S12) - ES(g, S12, S12 + 46) * 0.84 - 0.16 * ES(g, 1000, 1210));
  const voltP = clamp01(Math.min(LN(g, S45 - 26, S45 + 40), 1 - LN(g, 1568, 1652)));
  const tintA = light(calor, "sky", "amber");
  const tint2A = light(voltP, "sky", "volt");
  const frio = light(clamp01(0.3 + 0.7 * voltP - 0.3 * calor), "sky", "volt");
  const keyFrom = clamp01(0.28 + 0.34 * ES(g, 120, 980) - 0.3 * ES(g, 1150, 1620));
  const inten = lerp(0.76, 1.04, ES(g, 40, 1180));
  const piso = lerp(0.48, 0.8, ES(g, 300, 1560));

  // ── LA COSTURA DE ENTRADA: la cámara ENTRA por la junta de la caja ────────────────────────
  const zt = zoomThrough(g, ZT, 28, 50, 55);
  const luzJunta = LN(g, 8, ZT + 18);

  // ── VENTANAS DE LOS ACTOS (por RANGO de g, con solape de 26-28 cuadros) ───────────────────
  const vAfuera = g < 96;
  const vA1 = g < 352;
  const vA2 = g >= 326 && g < 656;
  const vA3 = g >= 630 && g < 984;
  const vA4 = g >= 956 && g < 1334;
  const vA5 = g >= 1306;

  // la escala extra del macro extremo final (sobre las capas, para que se lea EXTREMO)
  const escFibra = lerp(1, 2.35, ES(g, 1440, 1664));
  const fibraOn = g >= 46;

  return (
    <AbsoluteFill style={{ backgroundColor: V.ink0, overflow: "hidden" }}>
      {/* ── ATMÓSFERA: se monta UNA vez, arriba de todo, y no se remonta jamás ─────────────── */}
      <VoltAtmos tint={tintA} tint2={tint2A} keyFrom={keyFrom} intensity={inten} floor={piso} />

      <Layers cam={camT}>
        {/* ═══ ACTO 1 · AFUERA: la tapa de noche, las dos tarjetas, y la JUNTA ═══════════════ */}
        {vAfuera && (
          <Plane z={-40}>
            <div style={{
              position: "absolute", inset: 0,
              transform: zt.out === "none" ? undefined : zt.out,
              opacity: zt.opacity, transformStyle: "preserve-3d",
            }}>
              <PhotoPlane src="img/cmesilencio/cms_s15_palma_tapa_noche.jpg" kind="photo"
                z={-260} scale={1.16} dim={0.5} tint={V.sky} />
              {/* las dos hojas de contrachapado y, entre ellas, LA JUNTA */}
              <div style={{
                position: "absolute", left: "-14%", right: "-14%", top: "-18%", height: "70%",
                background: `linear-gradient(184deg, ${rgba(V.ink0, 0.9)} 0%, ${rgba(V.paper, 0.2)} 62%, ${rgba(V.paper, 0.34)} 100%)`,
                boxShadow: `0 26px 60px ${rgba(V.ink0, 0.9)}`,
              }}>
                <div style={{
                  position: "absolute", inset: 0, opacity: 0.26, mixBlendMode: "overlay",
                  backgroundImage: "repeating-linear-gradient(93deg, rgba(255,255,255,.5) 0 2px, rgba(0,0,0,.5) 2px 11px)",
                }} />
              </div>
              <div style={{
                position: "absolute", left: "-14%", right: "-14%", top: "56%", bottom: "-18%",
                background: `linear-gradient(4deg, ${rgba(V.ink0, 0.92)} 0%, ${rgba(V.paper, 0.18)} 58%, ${rgba(V.paper, 0.3)} 100%)`,
              }}>
                <div style={{
                  position: "absolute", inset: 0, opacity: 0.24, mixBlendMode: "overlay",
                  backgroundImage: "repeating-linear-gradient(87deg, rgba(255,255,255,.5) 0 2px, rgba(0,0,0,.5) 2px 13px)",
                }} />
              </div>
              {/* la ranura: lo que se ve por adentro empieza a filtrarse */}
              <div style={{
                position: "absolute", left: "-14%", right: "-14%", top: "52%", height: `${lerp(4, 9, luzJunta).toFixed(2)}%`,
                background: `linear-gradient(180deg, rgba(0,0,0,0.98) 0%, ${rgba(V.ink0, 0.94)} 42%, rgba(0,0,0,0.98) 100%)`,
                boxShadow: `0 0 ${Math.round(20 + 90 * luzJunta)}px ${rgba(V.sky, 0.2 * luzJunta)}, inset 0 0 40px ${rgba(V.amber, 0.14 * luzJunta)}`,
              }} />
              {/* las dos tarjetas que se apagan y se hunden: NO es la madera, NO son los tornillos */}
              <MediaCard
                src="broll/cmesilencio/cms_s15_tres_materiales_banco.mp4" kind="video"
                w={520} h={310} x={lerp(30, 25, ES(g, 6, 70))} y={lerp(30, 25, ES(g, 6, 70))}
                z={lerp(180, -140, ES(g, 8, 74))} ry={12} rot={-2}
                lit={lerp(0.95, 0.16, ES(g, 12, 72))} litColor={V.sky}
                opacity={clamp01(1 - ES(g, 20, 78))} label="LA MADERA Y LOS TORNILLOS" sheenAt={10}
              />
              <MediaCard
                src="img/cmesilencio/cms_s15_nudillo_madera_lana.jpg" kind="photo"
                w={480} h={290} x={lerp(72, 77, ES(g, 6, 70))} y={lerp(36, 30, ES(g, 6, 70))}
                z={lerp(140, -170, ES(g, 8, 74))} ry={-13} rot={2}
                lit={lerp(0.9, 0.14, ES(g, 12, 72))} litColor={V.sky}
                opacity={clamp01(1 - ES(g, 26, 84))} label="EL NUDILLO EN LA TAPA" sheenAt={18}
              />
            </div>
          </Plane>
        )}

        {/* ═══ LA FIBRA — UNA sola instancia del frame 46 al final. CINCO capas a distinta z ══ */}
        {fibraOn && (
          <>
            {/* la luz fría lateral que ATRAVIESA las capas (detrás de todo, para verlas a contraluz) */}
            <Plane z={-330}>
              <div style={{
                position: "absolute", left: "-20%", right: "-20%", top: "-10%", bottom: "-10%",
                background: `linear-gradient(96deg, ${rgba(frio, 0.24 + 0.12 * voltP)} 0%, rgba(0,0,0,0) 46%), radial-gradient(78% 60% at 12% 34%, ${rgba(frio, 0.2)} 0%, rgba(0,0,0,0) 68%)`,
              }} />
            </Plane>

            {CAPAS.map((c) => (
              <Plane key={c.z} z={c.z} style={{
                transform: `translateZ(${c.z}px) scale(${escFibra.toFixed(3)})`,
                transformStyle: "preserve-3d",
              }}>
                <Capa g={g} seed={c.seed} n={c.n} sc={c.sc} blur={c.blur} op={c.op}
                  col={colFibra} frio={frio} grasa={grasa} polvo={polvo} cierre={cierre} />
              </Plane>
            ))}

            {/* LOS HUECOS: entre las capas del medio. Esto es el aire atrapado. */}
            <Plane z={-70} style={{
              transform: `translateZ(-70px) scale(${escFibra.toFixed(3)})`, transformStyle: "preserve-3d",
            }}>
              <Huecos g={g} relleno={polvo * 0.86 + grasa * 0.14} marca={voltP} cierre={cierre} />
            </Plane>

            {/* el agua en los cruces (acto 2 en adelante; se enturbia con el aceite) */}
            <Plane z={30}>
              <Gotas g={g} on={humedo * (1 - 0.5 * cierre)} turbio={grasa} />
            </Plane>

            {/* la plancha de fieltro: lo que queda cuando ya no hay huecos */}
            <Plane z={60}>
              <Fieltro g={g} on={ES(g, 1400, 1596)} />
            </Plane>
          </>
        )}

        {/* ═══ ACTO 2 · LA HUMEDAD ══════════════════════════════════════════════════════════ */}
        {vA2 && (
          <Plane z={-190}>
            {/* el aire caliente del motor subiendo en ondas (se apaga con el chasquido) */}
            {Array.from({ length: 5 }, (_, i) => {
              const on = clamp01(calor * 1.3);
              if (on <= 0.02) return null;
              const yy = ((g * (0.5 + i * 0.13) + i * 130) % 640) / 640;
              return (
                <div key={i} style={{
                  position: "absolute", left: `${6 + i * 19}%`, width: "20%",
                  top: `${(104 - yy * 118).toFixed(1)}%`, height: 190,
                  background: `radial-gradient(60% 50% at 50% 50%, ${rgba(V.amber, 0.16 * on * (1 - yy))}, rgba(0,0,0,0) 72%)`,
                  filter: "blur(9px)",
                }} />
              );
            })}
          </Plane>
        )}

        {/* ═══ ACTO 3 · EL ACEITE ═══════════════════════════════════════════════════════════ */}
        {vA3 && (
          <>
            <Plane z={-160}>
              <Respiradero g={g} on={clamp01(LN(g, 646, 690) - LN(g, 930, 972))} luz={frio} />
            </Plane>
            <Plane z={0}>
              <Neblina g={g} on={clamp01(LN(g, 660, 700) - LN(g, 940, 980))} luz={V.bone} />
            </Plane>
          </>
        )}

        {/* ═══ ACTO 4 · EL POLVO ════════════════════════════════════════════════════════════ */}
        {vA4 && (
          <>
            <Plane z={-210}>
              <Codo on={clamp01(LN(g, 968, 1010) - LN(g, 1276, 1326))} luz={frio} />
            </Plane>
            <Plane z={-40}>
              <Rio g={g} on={clamp01(LN(g, 974, 1016) - LN(g, 1290, 1332))} luz={V.bone} />
            </Plane>
          </>
        )}

        {/* ═══ POLVO EN PRIMER PLANO — parallax fuerte, hold vivo (todo el movimiento) ═══════ */}
        <Plane z={330} style={{ transform: "translateZ(330px)", transformStyle: "preserve-3d" }}>
          {Array.from({ length: 13 }, (_, i) => {
            const sp = 0.4 + rnd(i * 11.3) * 1.3;
            const yy = (((rnd(i * 4.4) * 134 - (g * sp) / 11) % 134) + 134) % 134;
            const s = 3 + rnd(i * 7.9) * 6;
            return (
              <div key={i} style={{
                position: "absolute", left: `${(rnd(i * 2.2) * 112 - 6).toFixed(2)}%`, top: `${(yy - 14).toFixed(2)}%`,
                width: s, height: s, borderRadius: "50%",
                background: rgba(V.white, 0.05 + rnd(i * 5.1) * 0.09),
              }} />
            );
          })}
        </Plane>
      </Layers>

      {/* ═══ MATERIAL REAL Y TIPOGRAFÍA (fuera del parallax, siempre legibles) ═══════════════ */}

      {/* ACTO 1 — la fibra sana, y el anillo que entra y SE MUERE adentro */}
      {vA1 && g > 100 && (
        <SoundField db={63} x={3} y={51} on={clamp01(LN(g, 150, 176) - LN(g, 300, 340))}
          tint={V.sky} speed={0.8} spread={30} />
      )}
      {vA1 && (
        <Titular g={g} at={112} out={286} kick="NO ES LA MADERA, NO SON LOS TORNILLOS" color={V.sky}>
          <Head size={80}>ES LA <Em color={V.volt}>LANA</Em></Head>
          <div style={{ height: 10 }} />
          <Body size={31}>Entre hilo e hilo hay huecos. Ahí adentro está el aire.</Body>
        </Titular>
      )}

      {/* ACTO 2 — el agua */}
      {vA2 && (
        <>
          <Termometro g={g} on={clamp01(LN(g, 338, 376) - LN(g, 616, 652))} />
          <MediaCard
            src="broll/cmesilencio/cms_s15_puno_lana_oscura.mp4" kind="video"
            w={470} h={288} x={78} y={26} z={0} ry={-11} rot={1.6}
            lit={0.9} litColor={V.sky} label="LA MISMA LANA, MOJADA" sheenAt={392}
            opacity={clamp01(LN(g, 372, 400) - LN(g, 612, 646))}
          />
          <IconPng src="img/cmesilencio/cms_ic_gota.png" x={64} y={44} size={92}
            z={0} opacity={clamp01(LN(g, 430, 462) - LN(g, 612, 640))} rot={-6} glow={V.ink0} />
          <Titular g={g} at={352} out={620} kick="PRIMERO, LA HUMEDAD" color={V.sky} top={126}>
            <Head size={74}>EL AGUA CONDENSA EN LO <Em color={V.sky}>MÁS FRÍO</Em></Head>
          </Titular>
        </>
      )}

      {/* ACTO 3 — el aceite */}
      {vA3 && (
        <>
          <MediaCard
            src="broll/cmesilencio/cms_s15_escape_junto_lana.mp4" kind="video"
            w={500} h={300} x={79} y={72} z={0} ry={-13} rot={-2}
            lit={0.92} litColor={V.amber} label="EL RESPIRADERO DEL CÁRTER" sheenAt={700}
            opacity={clamp01(LN(g, 676, 706) - LN(g, 936, 970))}
          />
          <IconPng src="img/cmesilencio/cms_ic_aceite.png" x={62} y={26} size={96}
            z={0} opacity={clamp01(LN(g, 790, 822) - LN(g, 936, 964))} rot={5} glow={V.ink0} />
          <Titular g={g} at={664} out={944} kick="DESPUÉS, EL ACEITE" color={V.amber} top={126}>
            <Head size={72}>UNA NEBLINA QUE <Em color={V.amber}>SE PEGA</Em></Head>
          </Titular>
        </>
      )}

      {/* ACTO 4 — el polvo */}
      {vA4 && (
        <>
          <MediaCard
            src="broll/cmesilencio/cms_s15_caja_pasto_seco.mp4" kind="video"
            w={480} h={292} x={79} y={24} z={0} ry={-12} rot={1.4}
            lit={0.88} litColor={V.sky} label="EL AIRE QUE ENTRA" sheenAt={1010}
            opacity={clamp01(LN(g, 990, 1020) - LN(g, 1286, 1320))}
          />
          {/* las tres capas apiladas como objetos sobre el borde de la lana */}
          {[
            { src: "img/cmesilencio/cms_ic_gota.png", y: 42, at: 1046 },
            { src: "img/cmesilencio/cms_ic_aceite.png", y: 55, at: 1092 },
            { src: "img/cmesilencio/cms_ic_polvo.png", y: 68, at: 1138 },
          ].map((it, i) => (
            <IconPng key={i} src={it.src} x={62} y={it.y} size={84} z={0}
              opacity={clamp01(LN(g, it.at, it.at + 26) - LN(g, 1288, 1318))}
              rot={i === 1 ? 4 : -4} glow={V.ink0} />
          ))}
          <Titular g={g} at={996} out={1294} kick="Y EL POLVO" color={V.sky} top={126}>
            <Head size={74}>UN RÍO DE AIRE <Em color={V.sky}>POR MINUTO</Em></Head>
          </Titular>
        </>
      )}

      {/* ACTO 5 — la fibra se cierra, y LA PRUEBA en el mismo plano */}
      {vA5 && (
        <>
          {/* el anillo entra… y contra la fibra abierta se moría adentro (el muro absorbe) */}
          <SoundField db={64} x={4} y={50} wall={46}
            on={clamp01(LN(g, 1336, 1360) - LN(g, 1440, 1470))}
            tint={V.sky} speed={0.9} spread={40} />
          {/* …y contra el fieltro duro REBOTA y sale entero por donde vino */}
          <SoundField db={76} x={44} y={50}
            on={clamp01(LN(g, 1482, 1506) - LN(g, 1616, 1656))}
            tint={V.volt} speed={1.5} spread={112} />
          <MediaCard
            src="broll/cmesilencio/cms_s15_dos_muestras_lana.mp4" kind="video"
            w={430} h={264} x={81} y={70} z={0} ry={-14} rot={-2}
            lit={0.9} litColor={V.volt} label="ABIERTA / APELMAZADA" sheenAt={1360}
            opacity={clamp01(LN(g, 1330, 1362) - LN(g, 1592, 1628))}
          />
          <MediaCard
            src="broll/cmesilencio/cms_s15_corta_lana_nueva.mp4" kind="video"
            w={352} h={214} x={82} y={26} z={0} ry={-12} rot={2}
            lit={0.82} litColor={V.sky} label="COMO ERA LA PRIMERA NOCHE" sheenAt={1400}
            opacity={clamp01(LN(g, 1372, 1402) - LN(g, 1560, 1594))}
          />
          <Titular g={g} at={1330} out={1600} kick="LO QUE ABSORBE" color={V.volt} top={124}>
            <Head size={72}>NO ES LA FIBRA: ES EL <Em color={V.volt}>AIRE DE ADENTRO</Em></Head>
          </Titular>
        </>
      )}

      {/* EL RÓTULO DE ESTADO — una sola instancia, cambia de texto acto a acto */}
      <Estado g={g} color={voltP > 0.4 ? V.volt : V.bone} />

      {/* ═══ LAS COSTURAS ═════════════════════════════════════════════════════════════════════
          Ninguna es un fundido. Cada una cae dentro del solape de los dos actos que une. */}

      {/* ENTRADA · el ESPESOR DEL CONTRACHAPADO cruzando el lente mientras la cámara entra */}
      <SeamOcclude at={S_JUNTA} dur={20} color={V.paper} angle={6} lit={0.3} />

      {/* 1→2 · HERENCIA DE LUZ: el chasquido. El ámbar se apaga de un lado al otro del cuadro y
          detrás ya está el azul frío de la noche. No hay fade: hay un FRENTE que cruza. */}
      {g > S12 - 14 && g < S12 + 52 && (
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <AbsoluteFill style={{
            background: `linear-gradient(94deg, ${rgba(V.sky, 0.2)} 0%, ${rgba(V.sky, 0.05)} 60%, rgba(0,0,0,0) 100%)`,
            clipPath: `inset(0 ${(100 - LN(g, S12 - 10, S12 + 40) * 100).toFixed(1)}% 0 0)`,
          }} />
          <div style={{
            position: "absolute", top: 0, bottom: 0,
            left: `${lerp(-6, 106, LN(g, S12 - 10, S12 + 40)).toFixed(1)}%`,
            width: 160, marginLeft: -80,
            background: `linear-gradient(90deg, rgba(0,0,0,0) 0%, ${rgba(V.amber, 0.22)} 42%, ${rgba(V.ink0, 0.5)} 58%, rgba(0,0,0,0) 100%)`,
            filter: "blur(7px)",
          }} />
        </AbsoluteFill>
      )}

      {/* 2→3 · OCCLUDER DE MATERIA: la manguerita de goma negra del respiradero pasa pegada al
          lente. Goma OSCURA: `lit` la SUBE a luminancia media o esto sería un fundido a negro. */}
      <SeamOcclude at={S23} dur={16} color={V.ink2} angle={-11} lit={0.3} />

      {/* 3→4 · WIPE DE MATERIA: el río de polvo entra y detrás ya está la boca de aire */}
      <SeamWipeMatter at={S34} dur={24} tint={V.concrete} />

      {/* 4→5 · METAMORFOSIS: no hace falta tapar nada. Los MISMOS huecos negros del acto 4 se
          encienden en verde-voltio en el acto 5 (`voltP` sube alrededor de S45): la forma que
          venía siendo mugre acumulada se convierte en la forma de lo que absorbe. La instancia de
          <Huecos> es la misma a los dos lados de la frontera. */}

      {/* viñeta de cierre: la caja se cierra sobre el macro y entrega el plano al video */}
      <AbsoluteFill style={{
        background: `radial-gradient(126% 96% at 50% 52%, rgba(0,0,0,0) 40%, ${rgba(V.ink0, lerp(0.46, 0.9, ES(g, 1560, END)))} 100%)`,
        pointerEvents: "none",
      }} />
    </AbsoluteFill>
  );
};

export const MovLana: React.FC<{ acto?: number; gFrame?: number }> = ({ acto = 0, gFrame }) => {
  void acto;                       // el build usa `acto` para saber qué monta; el dibujo sale de `g`
  const localF = useCurrentFrame();
  const g0 = gFrame ?? localF;
  // Los componentes del Stage leen useCurrentFrame(). Con este Sequence, adentro
  // useCurrentFrame() === gFrame: las costuras, el SoundField, la deriva de las tarjetas y el polvo
  // de la atmósfera quedan CONTINUOS aunque el montaje corte los actos en pedazos distintos.
  const off = Math.round(localF - g0);
  const g = Math.max(0, Math.min(END, g0));
  return (
    <Sequence from={off} layout="none">
      <Lana g={g} />
    </Sequence>
  );
};

/*
  ── TABLA DE ENTRADA Y SALIDA DE LOS ACTOS ─────────────────────────────────────────────────────
  Movimiento: 1668 frames (55,6 s). Ventanas con solape de 26-28 cuadros. La cámara nunca vuelve a
  cero: `gcam(g, z0:-300 → z1:250, dur:1668)` + retroceso del acto 3 + giro del acto 4 + macro final.

  ACTO | FRAMES (dibujo)   | ENTRA (encuadre + luz)                       | SALE (encuadre + luz)                          | COSTURA hacia el siguiente
  -----|-------------------|----------------------------------------------|------------------------------------------------|------------------------------------------------
   —   | (MovDieciocho)    | patio de noche, plano largo, luz sky fría    | la cámara ya insinúa el descenso a la caja     | —
   1   | 0 → 352           | z −300, afuera: la tapa y las dos tarjetas,  | macro DENTRO de la caja, fibra abierta          | f 58-86 ZOOM-THROUGH por la junta +
       |                   | luz sky fría heredada del patio              | respirando, huecos vivos, luz sky fría          | f 74-94 OCCLUDER del espesor (V.paper, lit .30)
       |                   |                                              |                                                | f 330 → 1→2 HERENCIA DE LUZ (el chasquido)
   2   | 326 → 656         | macro en la fibra, el aire se pone ÁMBAR    | fibra mojada, gotas en los cruces,              | f 640 OCCLUDER DE MATERIA: la manguerita
       |                   | (el motor calentando), z ≈ −190              | luz sky fría otra vez (el ámbar se apagó)       | de goma negra (V.ink2, lit .30 la SUBE)
   3   | 630 → 984         | la cámara retrocede un palmo (z −92),        | fibra grasa y ocre apagado a marrón,            | f 962-986 WIPE DE MATERIA: el río de polvo
       |                   | entra el respiradero, luz fría + resto ámbar | la neblina ya pegada, luz casi fría             | cruza y detrás ya está la boca de aire
   4   | 956 → 1334        | la cámara gira −13° y encara el codo de      | huecos rellenos de gris, tres capas apiladas,   | f 1288-1354 METAMORFOSIS: los MISMOS
       |                   | lámina; el río entra; luz fría dura          | luz fría, sin ámbar                             | huecos negros se encienden en verde-voltio
   5   | 1306 → 1668       | los huecos marcados en volt, la fibra empieza| MACRO EXTREMO sobre el fieltro apelmazado,      | — (sale a planos sueltos: el incendio
       |                   | a comprimirse; z + macro +210, escala 2,35×  | luz fría y dura, cámara pegada a la fibra       | y la solución)

  COSTURAS USADAS (5 uniones, 5 costuras distintas, ninguna es un fundido):
    entrada  f 58  ZOOM-THROUGH por la junta (+ occluder de contrachapado a f 74)
    1→2      f 330 HERENCIA DE LUZ — un frente cruza el cuadro y apaga el ámbar
    2→3      f 640 OCCLUDER DE MATERIA — la manguerita de goma (materia OSCURA, `lit` la sube)
    3→4      f 962 WIPE DE MATERIA — el río de polvo
    4→5      f 1314 METAMORFOSIS — la mugre acumulada en los huecos SE CONVIERTE en lo que absorbe
*/
