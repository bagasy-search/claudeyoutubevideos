// CLIP C · «Can 2 People Restart Humanity?» (30 s). Paleta humanidad: atardecer naranja-rosa, acento AMARILLO.
// 2 planos: los dos caminan solos hacia la cabaña (POPULATION 2) → fundido → +75 YEARS junto al fuego, llegan los nietos.
import React from "react";
import { AbsoluteFill, useVideoConfig } from "remotion";
import { Clave, enPantalla, mira, useF } from "../camara";
import { Actor, posRuta } from "../actor";
import { Escena } from "../escena";
import { Montaje } from "../montaje";
import { Calendario, Contador, Globo, MarcaCorto, TextoMano } from "../pantalla";
import { PALETAS } from "../paletas";
import { Look } from "../personaje";
import { Atardecer, ATARDECER_PISO, ATARDECER_PUNTOS } from "../sets/atardecer";

const pal = PALETAS.humanidad;
const ESC = 1.15;
const P = ATARDECER_PISO;
export const ADAM: Look = { estilo: "palo", camisa: "#f05a1f", manga: "larga", pantalon: "#3a3550", zapatos: "#efe6d6", accesorios: [{ t: "capucha", color: "#e0521c" }] };
export const EVA: Look = { estilo: "palo", camisa: "#ffc93c", manga: "corta", pantalon: "#5a4a6a", zapatos: "#efe6d6", accesorios: [{ t: "pelo", forma: "bob", color: "#17100d" }] };
const NIETO = (camisa: string, pelo: "corto" | "cola" | "punta"): Look => ({ estilo: "palo", camisa, manga: "corta", pantalon: "#3a3550", alto: 0.7, accesorios: [{ t: "pelo", forma: pelo, color: "#17100d" }] });
const sol = { lado: 1 as const, color: "#ffd59a", fuerza: 0.95 };
const fuego = (lado: 1 | -1) => ({ lado, color: "#ff9a3a", fuerza: 1 });

// ---------- 1 · solos en el mundo: caminan al atardecer ----------
const CAM1: Clave[] = [mira(0, 1150, 600, 0.82), mira(90, 1050, 680, 1.12), mira(420, 1850, 690, 1.22, { curva: "inout" })];
const RUTA_EVA = [{ f: 0, x: 640, y: P + 30 }, { f: 400, x: 1700, y: P + 30, curva: "lineal" as const }];
const Camino: React.FC = () => {
  const f = useF();
  const { fps } = useVideoConfig();
  const ev = posRuta(RUTA_EVA, 190);
  const g = enPantalla(CAM1, 190, fps, ev.x, P - 300);
  return (
    <Escena
      Set={Atardecer} pal={pal} seed={7} claves={CAM1} mano={2.5}
      medio={
        <>
          <Actor look={EVA} escala={ESC} seed={2} luz={sol} ruta={RUTA_EVA}
            poses={[{ f: 0, v: {} }, { f: 300, v: { hI: 30, cI: 60 } }]}
            caras={[{ f: 0, v: "neutral" }, { f: 150, v: "duda" }, { f: 300, v: "feliz" }]}
            miradas={[{ f: 0, v: { x: 0.6, y: 0 } }, { f: 140, v: { x: 0.9, y: -0.1 } }]} giros={[{ f: 0, v: 0 }, { f: 150, v: 0.4 }]}
            habla={[[160, 215]]} />
          <Actor look={ADAM} escala={ESC * 1.05} seed={3} luz={sol}
            ruta={[{ f: 0, x: 820, y: P + 30 }, { f: 230, x: 1430, y: P + 30, curva: "lineal" }, { f: 270, x: 1450, y: P + 30, curva: "out" }, { f: 290, x: 1450, y: P + 30 }, { f: 420, x: 2050, y: P + 30, curva: "in" }]}
            dir={[{ f: 0, v: 1 }, { f: 236, v: -1 }, { f: 300, v: 1 }]}
            poses={[{ f: 0, v: {} }, { f: 236, v: "encogerse" }, { f: 280, v: { hD: 30, cD: 60 } }]}
            caras={[{ f: 0, v: "neutral" }, { f: 236, v: "duda" }, { f: 290, v: "feliz" }]}
            miradas={[{ f: 0, v: { x: 0.8, y: -0.2 } }, { f: 236, v: { x: 0.9, y: 0 } }]} />
        </>
      }
      hud={
        <>
          <Contador lineas={[{ etiqueta: "POPULATION", claves: 2, color: pal.acento }, { etiqueta: "EVERYONE ELSE", claves: "gone", color: "#ffb08a" }]} desde={14} />
          <Calendario texto="YEAR 1" x={1620} y={60} desde={20} acento={pal.acento} />
          <Globo texto="So… it's just us?" x={g.x + 40} y={g.y - 30} desde={160} hasta={232} tam={42} />
          <Globo texto="Guess we start from zero." x={1160} y={300} desde={250} hasta={330} tam={40} />
        </>
      }
    />
  );
};

// ---------- 2 · +75 años: junto al fuego, la familia llega ----------
const Tronco: React.FC<{ x: number; w?: number }> = ({ x, w = 230 }) => (
  <g>
    <rect x={x - w / 2} y={P + 30 - 66} width={w} height={66} rx={30} fill="#6a4228" />
    <ellipse cx={x + w / 2 - 14} cy={P + 30 - 33} rx={18} ry={31} fill="#b08050" />
    <ellipse cx={x + w / 2 - 14} cy={P + 30 - 33} rx={9} ry={17} fill="#8a5a36" />
  </g>
);
const FX = ATARDECER_PUNTOS.fogata;
const Fuego: React.FC = () => {
  const f = useF();
  const sentado = (x: number, d: 1 | -1, look: Look, seed: number, caras: { f: number; v: string }[], alto = 1) => (
    <Actor look={look} escala={ESC * alto} seed={seed} luz={fuego(d === 1 ? 1 : -1)} ruta={[{ f: 0, x, y: P + 30 }]} dir={[{ f: 0, v: d }]}
      asiento={[{ f: 0, v: 62 }]} poses={[{ f: 0, v: { tronco: 8, pI: 88, rI: 88, pD: 92, rD: 92, hI: 40, cI: 70, hD: 46, cD: 66 } }, { f: 300, v: { tronco: 2, pI: 88, rI: 88, pD: 92, rD: 92, hI: 25, cI: 50, hD: 120, cD: 30 } }]}
      caras={caras} miradas={[{ f: 0, v: { x: 0.7, y: 0.3 } }, { f: 230, v: { x: -0.6, y: -0.1 } }]} />
  );
  return (
    <Escena
      Set={Atardecer} pal={pal} setProps={{ fogata: true, hora: 0.85 }} seed={8} mano={2}
      claves={[mira(0, FX, 700, 1.3), mira(240, FX + 40, 700, 1.25, { curva: "inout" }), mira(480, FX + 170, 690, 1.45, { curva: "inout" })]}
      medio={
        <>
          <Tronco x={FX - 300} />
          <Tronco x={FX + 300} />
          {sentado(FX - 320, 1, { ...ADAM, accesorios: [{ t: "capucha", color: "#e0521c" }, { t: "barba", color: "#e9e3d6" }] }, 3, [{ f: 0, v: "cansado" }, { f: 250, v: "risa" }])}
          {sentado(FX + 300, -1, { ...EVA, accesorios: [{ t: "pelo", forma: "bob", color: "#e9e3d6" }] }, 2, [{ f: 0, v: "feliz" }, { f: 250, v: "risa" }])}
          {[0, 1, 2].map((k) => (
            <Actor key={k} look={NIETO(["#7fc46a", "#5aa0d8", "#ff8aa0"][k], (["corto", "cola", "punta"] as const)[k])} escala={ESC * 0.74} seed={10 + k} luz={fuego(-1)}
              ruta={[{ f: 210 + k * 18, x: FX + 1150 + k * 120, y: P + 30 }, { f: 330 + k * 18, x: FX + 480 + k * 120, y: P + 30, curva: "out" }]}
              poses={[{ f: 0, v: {} }, { f: 340 + k * 18, v: k === 1 ? "saludar" : "celebrar" }]}
              caras={[{ f: 0, v: "feliz" }, { f: 330, v: "risa" }]} miradas={[{ f: 0, v: { x: -0.8, y: 0 } }]} />
          ))}
        </>
      }
      hud={
        <>
          <Calendario texto="+75 YEARS" x={1560} y={60} desde={10} acento={pal.acento} />
          <Contador lineas={[{ etiqueta: "POPULATION", claves: [{ f: 0, v: 2 }, { f: 60, v: 46, d: 60 }], color: pal.acento }, { etiqueta: "GENERATIONS", claves: [{ f: 0, v: 1 }, { f: 60, v: 3, d: 60 }], color: "#ffb08a" }]} />
          <TextoMano texto={"8 kids per couple.\nNo other way."} x={560} y={190} desde={150} color={pal.acento} tam={78} vel={1.5} />
        </>
      }
    />
  );
};

export const ClipC: React.FC = () => (
  <AbsoluteFill style={{ background: "#000" }}>
    <Montaje planos={[{ dur: 420, el: <Camino /> }, { dur: 480, el: <Fuego />, trans: { tipo: "fundido", d: 30 } }]} />
    <MarcaCorto />
  </AbsoluteFill>
);
