// CLIP D · parábolas antiguas aplicadas a vicios modernos: «The Two Wolves» (30 s). Paleta parabola: gris carbón
// + UN acento rosa neón (el demonio, el celular, la letra a mano). Estilo Monk Mode: personajes «frijol».
// 2 planos: calle con lluvia (camina mirando el celular, el demonio lo sigue; SEEN 1,388 / KNOWN 0) → cortina →
// aula gris (el viejo maestro dibuja los dos lobos; el chico deja el celular).
import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { mira, useF } from "../camara";
import { Actor } from "../actor";
import { Escena } from "../escena";
import { Montaje } from "../montaje";
import { Halo } from "../luz";
import { Contador, F_MANO, MarcaCorto, TextoMano } from "../pantalla";
import { PALETAS } from "../paletas";
import { Look, LOOKS } from "../personaje";
import { Celular } from "../props";
import { CalleNoche, CALLE_PISO } from "../sets/calle";
import { Aula, AULA_PISO, PIZARRON } from "../sets/aula";
import { Silla } from "../sets/cocina";

const pal = PALETAS.parabola;
const ROSA = pal.acento;
const ESC = 1.2;
export const KAI: Look = { ...LOOKS.monk, accesorios: [{ t: "capucha", color: "#bdb6a6" }] };
const MAESTRO: Look = { ...LOOKS.monk, piel: "#e6dcc6", camisa: "#8a7d6a", accesorios: [{ t: "pelo", forma: "calvo", color: "#e9e3d6" }, { t: "barba", color: "#f1ede4" }] };
const DEMONIO: Look = { ...LOOKS.demonio, neon: ROSA };
const flota = (p: any, f: number) => ({ ...p, tronco: p.tronco + 4 * Math.sin(f / 14), cabeza: p.cabeza + 6 * Math.sin(f / 19) });
const tel = (encendido = true) => <Celular brillo={ROSA} prendido={encendido} s={1.3} />;

// ---------- 1 · calle con lluvia: el celular lo lleva ----------
const Calle: React.FC = () => {
  const f = useF();
  const P = CALLE_PISO;
  const kx = interpolate(f, [0, 420], [520, 2120]);
  return (
    <Escena
      Set={CalleNoche} pal={pal} setProps={{ variante: "lluvia" }} seed={11} mano={2.5}
      claves={[mira(0, 900, 560, 0.9), mira(170, 1180, 690, 1.35), mira(262, 1450, 650, 2.0, { curva: "inout" }), mira(330, 1700, 650, 2.0), mira(420, 2180, 690, 1.35, { curva: "inout" })]}
      medio={
        <>
          {/* el celular ilumina la cara de rosa */}
          <Halo x={kx + 30} y={P - 200} r={190} color={ROSA} fuerza={0.35} />
          <Actor look={DEMONIO} escala={ESC * 1.08} seed={13} luz={{ lado: 1, color: ROSA, fuerza: 1 }}
            ruta={[{ f: 0, x: 120, y: P - 20 }, { f: 240, x: 1220, y: P - 20, curva: "lineal" }, { f: 420, x: 1960, y: P - 20, curva: "lineal" }]}
            poses={[{ f: 0, v: { hD: 60, cD: 40, hI: 20, cI: 30 } }, { f: 230, v: { hD: 95, cD: 25, tronco: 12, cabeza: 10 } }]}
            caras={[{ f: 0, v: "picaro" }, { f: 230, v: "feliz" }]} miradas={[{ f: 0, v: { x: 0.8, y: 0.3 } }]} ajuste={flota} />
          <Actor look={KAI} escala={ESC} seed={12} luz={{ lado: -1, color: pal.luz, fuerza: 0.7 }}
            ruta={[{ f: 0, x: 520, y: P }, { f: 420, x: 2120, y: P, curva: "lineal" }]}
            poses={[{ f: 0, v: "celular" }]} caras={[{ f: 0, v: "cansado" }, { f: 300, v: "neutral" }]}
            miradas={[{ f: 0, v: { x: 0.5, y: 0.9 } }]} enManoD={tel()} />
        </>
      }
      hud={
        <Contador lineas={[{ etiqueta: "SEEN", claves: [{ f: 0, v: 212 }, { f: 30, v: 1388, d: 330 }], color: ROSA }, { etiqueta: "KNOWN", claves: 0, color: ROSA }]} desde={10} />
      }
    />
  );
};

// ---------- 2 · aula gris: los dos lobos ----------
// tiza que se escribe sola (revela con una máscara que avanza, en coordenadas del mundo)
const Tiza: React.FC<{ texto: string; x: number; y: number; desde: number; dur: number; tam?: number; color?: string }> = ({ texto, x, y, desde, dur, tam = 64, color = "#ece8de" }) => {
  const f = useF();
  const u = interpolate(f, [desde, desde + dur], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const id = `tz${texto.length}${x}${y}`;
  const w = texto.length * tam * 0.5;
  return (
    <g>
      <defs><clipPath id={id}><rect x={x - 10} y={y - tam} width={w * u + 10} height={tam * 1.4} /></clipPath></defs>
      <text x={x} y={y} fontFamily={F_MANO} fontWeight={700} fontSize={tam} fill={color} opacity={0.93} clipPath={`url(#${id})`}>{texto}</text>
    </g>
  );
};
// lobo de tiza: cabeza de perfil en un solo trazo que se dibuja (strokeDasharray)
const Lobo: React.FC<{ x: number; y: number; desde: number; color: string; dir?: 1 | -1; s?: number }> = ({ x, y, desde, color, dir = 1, s = 1 }) => {
  const f = useF();
  const L = 900;
  const u = interpolate(f, [desde, desde + 40], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <g transform={`translate(${x},${y}) scale(${dir * s},${s})`}>
      <path d="M-70,60 L-60,-10 L-80,-70 L-35,-35 L0,-40 L20,-80 L35,-30 Q70,-15 95,10 L100,22 Q80,30 60,24 L40,30 Q20,60 -10,70 Z M50,-2 l6,0"
        fill="none" stroke={color} strokeWidth={6} strokeLinejoin="round" strokeLinecap="round" strokeDasharray={L} strokeDashoffset={L * (1 - u)} />
    </g>
  );
};

const Aula2: React.FC = () => {
  const f = useF();
  const P = AULA_PISO;
  const B = PIZARRON;
  const fuera = interpolate(f, [330, 380], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <Escena
      Set={Aula} pal={pal} setProps={{ variante: "gris", pizarra: (
        <g>
          <Tiza texto="Two wolves." x={B.x + 70} y={B.y + 100} desde={20} dur={40} tam={70} />
          <Lobo x={B.x + 300} y={B.y + 290} desde={70} color="#ece8de" />
          <Lobo x={B.x + 800} y={B.y + 290} desde={110} color={ROSA} dir={-1} />
          <Tiza texto="calm" x={B.x + 240} y={B.y + 430} desde={120} dur={20} tam={50} />
          <Tiza texto="hungry" x={B.x + 720} y={B.y + 430} desde={140} dur={24} tam={50} color={ROSA} />
          <Tiza texto="Which one wins?" x={B.x + 560} y={B.y + 100} desde={200} dur={40} tam={58} />
        </g>
      ) }} seed={14} mano={2}
      claves={[mira(0, 1150, 520, 1.05), mira(160, 1100, 480, 1.12, { curva: "inout" }), mira(270, 1380, 640, 1.6, { curva: "inout" }), mira(400, 1420, 660, 1.9, { curva: "inout" }), mira(480, 1420, 660, 1.95)]}
      medio={
        <>
          <Actor look={MAESTRO} escala={ESC * 1.15} seed={15} luz={{ lado: 1, color: pal.luz, fuerza: 0.8 }}
            ruta={[{ f: 0, x: 520, y: P }, { f: 100, x: 520, y: P }, { f: 150, x: 600, y: P }]} dir={[{ f: 0, v: 1 }]}
            poses={[{ f: 0, v: "señalar" }, { f: 60, v: { hD: 120, cD: 10 } }, { f: 180, v: "hablar" }, { f: 260, v: "pensar" }]}
            caras={[{ f: 0, v: "neutral" }, { f: 180, v: "picaro" }]} miradas={[{ f: 0, v: { x: 0.9, y: -0.4 } }, { f: 180, v: { x: 0.9, y: 0 } }]}
            habla={[[10, 60], [175, 250]]} />
          <Silla x={1480} piso={P} dir={-1} color="#5a5048" />
          <Actor look={DEMONIO} escala={ESC * 1.05} seed={16} luz={{ lado: 1, color: ROSA, fuerza: 1 }} opacidad={() => fuera}
            ruta={[{ f: 0, x: 1650, y: P - 30 }, { f: 360, x: 1720, y: P - 30 }]} dir={[{ f: 0, v: -1 }]}
            poses={[{ f: 0, v: { hD: 100, cD: 30, tronco: 14 } }, { f: 300, v: { hD: 30, cD: 40, tronco: -10 } }]}
            caras={[{ f: 0, v: "picaro" }, { f: 300, v: "enojo" }]} ajuste={flota} />
          <Actor look={KAI} escala={ESC} seed={12} luz={{ lado: 1, color: pal.luz, fuerza: 0.8 }}
            ruta={[{ f: 0, x: 1480, y: P }]} dir={[{ f: 0, v: -1 }]} asiento={[{ f: 0, v: 56 }]}
            poses={[{ f: 0, v: { tronco: 10, cabeza: 18, pI: 82, rI: 72, pD: 86, rD: 76, hD: 30, cD: 125, hI: 20, cI: 60 } }, { f: 300, v: { tronco: -2, cabeza: -6, pI: 82, rI: 72, pD: 86, rD: 76, hD: 10, cD: 30, hI: 20, cI: 50 } }]}
            caras={[{ f: 0, v: "cansado" }, { f: 240, v: "sorpresa" }, { f: 320, v: "determinado" }]}
            miradas={[{ f: 0, v: { x: 0.3, y: 0.9 } }, { f: 240, v: { x: 0.9, y: -0.5 } }]}
            enManoD={(ff) => tel(ff < 300)} />
        </>
      }
      hud={
        <>
          <Contador lineas={[{ etiqueta: "SEEN", claves: 1388, color: ROSA }, { etiqueta: "KNOWN", claves: [{ f: 0, v: 0 }, { f: 330, v: 1 }], color: ROSA }]} />
          <TextoMano texto={"The one you feed."} x={1000} y={180} desde={360} color={ROSA} tam={92} vel={1.4} />
        </>
      }
    />
  );
};

export const ClipD: React.FC = () => (
  <AbsoluteFill style={{ background: "#000" }}>
    <Montaje planos={[{ dur: 420, el: <Calle /> }, { dur: 480, el: <Aula2 />, trans: { tipo: "cortina", d: 18, color: "#060607", lado: 1 } }]} />
    <MarcaCorto />
  </AbsoluteFill>
);
