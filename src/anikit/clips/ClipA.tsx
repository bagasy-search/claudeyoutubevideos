// CLIP A · serie zombie «30 Days Locked Inside a Supermarket» (30 s). Paleta zombi: pizarra fría + ROJO.
// 3 planos, 2 transiciones invisibles: calle (huye) → cortina → súper (barricada, miedo, 47 latas) → fundido → DAY 2.
import React from "react";
import { AbsoluteFill } from "remotion";
import { golpe, mira, useF } from "../camara";
import { Actor } from "../actor";
import { Escena } from "../escena";
import { Montaje } from "../montaje";
import { Calendario, Contador, MarcaCorto, TextoMano } from "../pantalla";
import { PALETAS } from "../paletas";
import { Look, Pose } from "../personaje";
import { Carrito, Lata } from "../props";
import { CalleNoche } from "../sets/calle";
import { Supermercado, SUPER_PISO } from "../sets/super";
import { CALLE_PISO, CALLE_PUNTOS } from "../sets/calle";

const pal = PALETAS.zombi;
const ESC = 1.15;
export const SAM: Look = { estilo: "palo", camisa: "#c8463a", manga: "larga", pantalon: "#2b3338", zapatos: "#e9e3d6", accesorios: [{ t: "mochila", color: "#46553f" }, { t: "gorra", color: "#2b3338", atras: true }] };
const ZOMBI = (camisa: string): Look => ({ estilo: "zombi", camisa, manga: "corta", pantalon: "#34392f" });
const rim = { lado: 1 as const, color: pal.luz, fuerza: 0.85 };
const rimFrio = { lado: -1 as const, color: pal.luzFria, fuerza: 0.6 };
// los zombis tambalean: tronco y cabeza se mecen fuera de fase
const tambaleo = (seed: number) => (p: Pose, f: number): Pose => ({ ...p, tronco: p.tronco + 6 * Math.sin(f / 9 + seed), cabeza: p.cabeza + 10 * Math.sin(f / 13 + seed * 2), hI: p.hI + 8 * Math.sin(f / 7 + seed), hD: p.hD + 8 * Math.sin(f / 8 + seed * 3) });

// ---------- 1 · calle: camina con miedo, oye algo, ve la horda y corre al mercado ----------
const Calle: React.FC = () => {
  const f = useF();
  const P = CALLE_PISO;
  return (
    <Escena
      Set={CalleNoche} pal={pal} setProps={{ variante: "zombi" }} seed={1}
      claves={[mira(0, 1100, 560, 0.88), mira(80, 990, 690, 1.3), mira(140, 640, 700, 1.05), mira(165, 900, 700, 1.05), mira(195, 1900, 690, 1.12), mira(260, 2780, 690, 1.18)]}
      medio={
        <>
          {[0, 1, 2].map((k) => (
            <Actor key={k} look={ZOMBI(["#4f5b52", "#6a5248", "#3e4c5a"][k])} escala={ESC * (0.95 + k * 0.05)} seed={k + 3}
              ruta={[{ f: 0, x: -420 - k * 170, y: P }, { f: 70 + k * 10, x: 120 - k * 170, y: P, curva: "lineal" }, { f: 300, x: 1150 - k * 170, y: P, curva: "lineal" }]}
              poses={[{ f: 0, v: "zombi" }]} caras={[{ f: 0, v: "zombi" }]} luz={rimFrio} ajuste={tambaleo(k)} />
          ))}
          <Actor look={SAM} escala={ESC} seed={1} luz={rim}
            ruta={[{ f: 0, x: 640, y: P }, { f: 95, x: 1010, y: P, curva: "out" }, { f: 128, x: 1010, y: P }, { f: 250, x: CALLE_PUNTOS.mercado - 40, y: P, curva: "in" }, { f: 300, x: CALLE_PUNTOS.mercado + 60, y: P, curva: "out" }]}
            dir={[{ f: 0, v: 1 }, { f: 100, v: -1 }, { f: 124, v: 1 }]}
            poses={[{ f: 0, v: "encogerse" }, { f: 30, v: { hI: 20, cI: 60, hD: 25, cD: 60, cabeza: 8 } }, { f: 100, v: { tronco: -10, cabeza: -6, hI: 30, cI: 40, hD: 40, cD: 50 } }, { f: 124, v: {} }]}
            caras={[{ f: 0, v: "miedo" }, { f: 40, v: "duda" }, { f: 100, v: "sorpresa" }, { f: 112, v: "miedo" }]}
            miradas={[{ f: 0, v: { x: 0.4, y: 0 } }, { f: 50, v: { x: -0.3, y: -0.2 } }, { f: 100, v: { x: 0.8, y: 0 } }, { f: 130, v: { x: 0.6, y: 0 } }]} />
        </>
      }
      hud={
        <>
          <Calendario texto="DAY 1" x={1630} y={60} desde={10} acento={pal.acento} />
          <Contador lineas={[{ etiqueta: "FOOD", claves: "0 cans", color: pal.acento }, { etiqueta: "NIGHTS LEFT", claves: 30, color: "#e6efe9" }]} desde={18} />
        </>
      }
    />
  );
};

// ---------- 2 · súper: entra, empuja el carrito contra la puerta, golpes en el vidrio, primer plano de miedo ----------
const GOLPES = [168, 186, 199, 214];
const Super: React.FC = () => {
  const f = useF();
  const P = SUPER_PISO;
  const cx = f < 70 ? 860 : f > 132 ? 300 : 860 - (560 * (1 - Math.cos(((f - 70) / 62) * Math.PI))) / 2; // carrito
  const g = GOLPES.reduce((a, t) => a + golpe(f, t, 7), 0);
  return (
    <Escena
      Set={Supermercado} pal={pal} setProps={{ variante: "zombi" }} seed={2} mano={3}
      claves={[mira(0, 480, 700, 1.2), mira(60, 700, 700, 1.15), mira(135, 420, 700, 1.15), mira(165, 430, 690, 1.6), mira(232, 690, 650, 2.4, { curva: "inout" }), mira(250, 690, 650, 2.4), mira(290, 1060, 710, 1.2)]}
      detras={
        <>
          {/* horda afuera, detrás del vidrio (tinte + parantes encima) */}
          {[0, 1, 2, 3].map((k) => (
            <Actor key={k} look={ZOMBI(["#4f5b52", "#6a5248", "#3e4c5a", "#585248"][k])} escala={ESC * (0.92 + (k % 2) * 0.08)} seed={k + 9}
              ruta={[{ f: 100 + k * 9, x: -620 + k * 40, y: P }, { f: 165 + k * 6, x: -330 + k * 170, y: P }]}
              poses={[{ f: 0, v: "zombi" }, ...GOLPES.map((t, i) => ({ f: t - 4 + ((i + k) % 2) * 3, v: i % 2 ? "zombi" : { hI: 110, cI: 30, hD: 115, cD: 25, tronco: 14, cabeza: 20 } }))]}
              caras={[{ f: 0, v: "zombi" }]} luz={rimFrio} ajuste={tambaleo(k + 2)} />
          ))}
          <rect x={-500} y={P - 720} width={900} height={720} fill={pal.luzFria} opacity={0.16 + 0.04 * Math.abs(g)} />
          {[-260, 0, 260].map((x) => <rect key={x} x={x - 6} y={P - 720} width={12} height={720} fill="#c9cfd2" />)}
          {/* manos apoyadas en el vidrio cuando golpean */}
          
        </>
      }
      medio={
        <>
          <Carrito x={cx} y={P} dir={-1} rueda={cx * 0.9} />
          <Actor look={SAM} escala={ESC} seed={1} luz={rim}
            ruta={[{ f: -6, x: 40, y: P }, { f: 34, x: 560, y: P, curva: "out" }, { f: 48, x: 600, y: P }, { f: 66, x: 1075, y: P }, { f: 70, x: 1075, y: P }, { f: 132, x: 515, y: P }, { f: 150, x: 735, y: P, curva: "out" }, { f: 262, x: 735, y: P }, { f: 330, x: 1320, y: P }]}
            dir={[{ f: 0, v: 1 }, { f: 36, v: -1 }, { f: 52, v: 1 }, { f: 68, v: -1 }, { f: 262, v: 1 }]}
            poses={[{ f: 0, v: {} }, { f: 70, v: "empujar" }, { f: 132, v: { tronco: -6, hI: 40, cI: 70, hD: 45, cD: 75 } }, { f: 150, v: "encogerse" }, { f: 240, v: { cabeza: -4 } }, { f: 262, v: {} }]}
            caras={[{ f: 0, v: "miedo" }, { f: 70, v: "determinado" }, { f: 140, v: "sorpresa" }, { f: 160, v: "miedo" }, { f: 244, v: "determinado" }]}
            miradas={[{ f: 0, v: { x: -0.6, y: 0 } }, { f: 150, v: { x: -0.9, y: -0.1 } }, { f: 244, v: { x: 0.9, y: 0 } }]}
            ajuste={(p, ff) => (ff > 160 && ff < 240 ? { ...p, tronco: p.tronco + 1.5 * Math.sin(ff * 1.7) } : p)} />
        </>
      }
      hud={
        <>
          <Calendario texto="DAY 1" x={1630} y={60} acento={pal.acento} />
          <Contador lineas={[{ etiqueta: "FOOD", claves: [{ f: 0, v: 0 }, { f: 268, v: 47, d: 26 }], color: pal.acento }, { etiqueta: "NIGHTS LEFT", claves: 30, color: "#e6efe9" }]} />
        </>
      }
    />
  );
};

// ---------- 3 · DAY 2: sentado contra la pirámide, come de la lata; se escribe la cuenta ----------
const Dia2: React.FC = () => {
  const f = useF();
  const P = SUPER_PISO;
  const bocado = (t: number) => Math.max(0, Math.sin(((t - 30) / 70) * Math.PI * 2)); // lleva la cuchara a la boca cada ~2 s
  return (
    <Escena
      Set={Supermercado} pal={pal} setProps={{ variante: "zombi" }} seed={3} mano={2}
      claves={[mira(0, 2400, 700, 1.3), mira(270, 2330, 760, 1.75, { curva: "inout" })]}
      medio={
        <Actor look={SAM} escala={ESC} seed={1} luz={rim} ruta={[{ f: 0, x: 2300, y: P + 30 }]} dir={[{ f: 0, v: 1 }]}
          asiento={[{ f: 0, v: 8 }]}
          poses={[{ f: 0, v: { ...{ tronco: -6, pI: 85, rI: 0, pD: 70, rD: 95, hI: 20, cI: 70 }, hD: 40, cD: 70 } }]}
          ajuste={(p, ff) => { const b = bocado(ff); return { ...p, hD: 40 - 15 * b, cD: 70 + 75 * b, cabeza: p.cabeza + 6 * b }; }}
          caras={[{ f: 0, v: "cansado" }, { f: 150, v: "triste" }, { f: 230, v: "determinado" }]}
          miradas={[{ f: 0, v: { x: 0.3, y: 0.3 } }, { f: 140, v: { x: 0.9, y: -0.2 } }]}
          enManoD={<Lata color="#e0563a" s={0.9} rot={90} />} enManoI={<Lata color="#c9c9c4" s={0.6} />} />
      }
      hud={
        <>
          <Calendario texto="DAY 2" x={1630} y={60} desde={8} acento={pal.acento} />
          <Contador lineas={[{ etiqueta: "FOOD", claves: [{ f: 0, v: 47 }, { f: 70, v: 46 }], color: pal.acento }, { etiqueta: "NIGHTS LEFT", claves: [{ f: 0, v: 30 }, { f: 20, v: 29 }], color: "#e6efe9" }]} />
          <TextoMano texto={"47 cans.\n30 days."} x={1290} y={400} desde={120} color="#ffd27a" tam={96} vel={1.4} brillo={false} />
        </>
      }
    />
  );
};

export const ClipA: React.FC = () => (
  <AbsoluteFill style={{ background: "#000" }}>
    <Montaje planos={[{ dur: 300, el: <Calle /> }, { dur: 330, el: <Super />, trans: { tipo: "cortina", d: 16, color: "#05080a", lado: -1 } }, { dur: 270, el: <Dia2 />, trans: { tipo: "fundido", d: 24 } }]} />
    <MarcaCorto />
  </AbsoluteFill>
);
