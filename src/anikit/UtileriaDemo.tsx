// Demos de lo nuevo del kit (utilería, inserto, encuadre seguro, momentos del día, figurantes vivos).
// Cada comp es MOLDE: copiar el bloque y cambiar los datos.
import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { useF } from "./camara";
import { Inserto } from "./inserto";
import { PALETAS } from "./paletas";
import { Look, LOOKS } from "./personaje";
import { Actor, posRuta } from "./actor";
import { Escena } from "./escena";
import { generalCorto, planoSeguro, seguirSeguro } from "./encuadre";
import { Figurante, Figurantes, respirar } from "./figurante";
import { luzMomento } from "./momento";
import { CalleNoche, CALLE_PISO } from "./sets/calle";
import { Cocina, COCINA_PISO } from "./sets/cocina";
import { Atardecer, ATARDECER_PISO } from "./sets/atardecer";
import { F_HUD, MarcaCorto } from "./pantalla";
import { CATEGORIAS, Prop, UTILERIA } from "./utileria";

const W: React.FC<{ children: React.ReactNode }> = ({ children }) => <AbsoluteFill style={{ background: "#000" }}>{children}<MarcaCorto /></AbsoluteFill>;

// catálogo: todas las piezas en grilla, entrando de a una (pág. 1 y 2)
const TODAS = Object.values(CATEGORIAS).flat();
const Catalogo: React.FC<{ pag: number }> = ({ pag }) => {
  const lista = TODAS.slice(pag * 45, pag * 45 + 45);
  return (
    <W>
      <AbsoluteFill style={{ background: "#efe6d4" }}>
        <svg width={1920} height={1080}>
          {lista.map((k, i) => {
            const d = UTILERIA[k], cx = 160 + (i % 9) * 200, cy = 70 + Math.floor(i / 9) * 196;
            const s = Math.min(1, 118 / d.h, 160 / d.w);
            return (
              <g key={k}>
                <rect x={cx - 92} y={cy - 4} width={184} height={184} rx={18} fill="#f8f2e6" />
                <Prop name={k} x={cx} y={cy + 140 - (k === "arana" ? 40 : 0)} s={s} desde={i * 2} />
                <text x={cx} y={cy + 170} textAnchor="middle" fontFamily={F_HUD} fontWeight={600} fontSize={20} fill="#6b5a4a">{k}</text>
              </g>
            );
          })}
        </svg>
      </AbsoluteFill>
    </W>
  );
};
export const UtCatalogo1: React.FC = () => <Catalogo pag={0} />;
export const UtCatalogo2: React.FC = () => <Catalogo pag={1} />;

// ---------------- INSERTO ----------------
const LEO: Look = { estilo: "palo", camisa: "#f1ece2", manga: "corta", pantalon: "#3a4a5a", zapatos: "#f05a1f", accesorios: [{ t: "pelo", forma: "punta", color: "#17100d" }] };
const MONJE: Look = { estilo: "frijol", piel: "#ece5d3", camisa: "#8a6a4a", manga: "larga", accesorios: [] };
// el mensaje que aparece en la pantalla del celular (coordenadas del objeto: base en 0, ~146 de alto)
const Mensaje: React.FC = () => {
  const f = useF();
  const u = interpolate(f, [34, 44], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <g opacity={u} transform={`translate(0,${-74 + (1 - u) * 8})`}>
      <rect x={-30} y={-22} width={60} height={40} rx={6} fill="#fff" />
      <rect x={-24} y={-14} width={34} height={6} rx={3} fill="#ff5aa0" />
      <rect x={-24} y={-3} width={46} height={5} rx={2.5} fill="#9a9ab0" />
      <rect x={-24} y={6} width={30} height={5} rx={2.5} fill="#9a9ab0" />
    </g>
  );
};
export const UtInserto: React.FC = () => (
  <W><Inserto objeto="phone" look={LEO} pal={PALETAS.awaken} accion="tocar" encima={<Mensaje />} caras={[{ f: 0, v: "neutral" }, { f: 46, v: "sorpresa" }, { f: 110, v: "feliz" }]} /></W>
);
export const UtInserto2: React.FC = () => (
  <W><Inserto objeto="needle" look={MONJE} pal={PALETAS.parabola} accion="girar" esquina="der" caras={[{ f: 0, v: "duda" }, { f: 60, v: "determinado" }]} /></W>
);

// ---------------- ENCUADRE SEGURO + FIGURANTES ----------------
// general de la cuadra ≤2 s → entra solo a plano seguro y acompaña a Leo; la gente del café lo sigue con la mirada
const RUTA_LEO = [{ f: 0, x: 700, y: CALLE_PISO + 30 }, { f: 200, x: 1700, y: CALLE_PISO + 30, curva: "lineal" as const }];
const PROTA_LEO = { look: LEO, escala: 1.15, ruta: RUTA_LEO };
const luzCalle = { lado: 1 as const, color: "#ffe0a0", fuerza: 0.9 };
export const UtEncuadre: React.FC = () => (
  <W>
    <Escena Set={CalleNoche} pal={PALETAS.awaken} seed={2} mano={2}
      claves={[...generalCorto(0, { x: 1250, y: 600, zoom: 0.62 }, PROTA_LEO, { frac: 0.5 }), ...seguirSeguro(90, 230, PROTA_LEO, { frac: 0.52, paso: 36 })]}
      medio={<>
        <Figurantes atiende={(f) => ({ x: posRuta(RUTA_LEO, f).x, y: CALLE_PISO - 280 })} lista={[
          { look: LOOKS.awakenGorra, x: 1040, piso: CALLE_PISO - 46, escala: 0.8, luz: luzCalle },
          { look: { estilo: "palo", camisa: "#5aa0d8", manga: "larga", accesorios: [{ t: "pelo", forma: "bob", color: "#17100d" }] }, x: 1170, piso: CALLE_PISO - 46, escala: 0.78, luz: luzCalle, pose: "brazosCruzados" },
          { look: { estilo: "palo", camisa: "#f1c24a", manga: "corta", accesorios: [{ t: "barba", color: "#17100d" }] }, x: 1980, piso: CALLE_PISO - 4, escala: 1.0, luz: luzCalle, reacciones: [{ f: 150, cara: "sorpresa" }] },
        ]} />
        <Actor look={LEO} escala={1.15} seed={4} luz={luzCalle} ruta={RUTA_LEO} caras={[{ f: 0, v: "determinado" }]} />
      </>} />
  </W>
);

// ---------------- MOMENTOS DEL DÍA ----------------
const Quieto: React.FC<{ x: number; piso: number; m: "noche" | "lluvia" | "amanecer"; cara?: string; pose?: string; dir?: 1 | -1 }> = ({ x, piso, m, cara = "neutral", pose = "hablar", dir = 1 }) => (
  <Actor look={LEO} escala={1.15} seed={4} luz={luzMomento(m)} ruta={[{ f: 0, x, y: piso }]} dir={[{ f: 0, v: dir }]} poses={[{ f: 0, v: pose }]} caras={[{ f: 0, v: cara }]} ajuste={respirar(4)} habla={[[20, 90]]} />
);
export const UtNoche: React.FC = () => (
  <W>
    <Escena Set={Cocina} pal={PALETAS.whatif} momento="noche" zLejos={0.85} seed={5} mano={2} claves={[planoSeguro(0, { look: LEO, escala: 1.15, x: 1000, piso: COCINA_PISO }, { frac: 0.55, lado: -0.4 })]}
      medio={<><Quieto x={1000} piso={COCINA_PISO} m="noche" cara="cansado" /><Prop name="taza" x={1250} y={COCINA_PISO - 210} desde={10} /></>} />
  </W>
);
export const UtLluvia: React.FC = () => (
  <W>
    <Escena Set={Atardecer} pal={PALETAS.humanidad} momento="lluvia" seed={7} mano={2} claves={[planoSeguro(0, { look: LEO, escala: 1.15, x: 1300, piso: ATARDECER_PISO }, { frac: 0.5, lado: 0.3 })]}
      medio={<><Quieto x={1300} piso={ATARDECER_PISO} m="lluvia" cara="triste" pose="encogerse" /></>} />
  </W>
);
export const UtAmanecer: React.FC = () => (
  <W>
    <Escena Set={CalleNoche} pal={PALETAS.awaken} momento="amanecer" seed={2} mano={2} claves={generalCorto(0, { x: 1700, y: 380, zoom: 0.5 }, { look: LEO, escala: 1.15, x: 1760, piso: CALLE_PISO }, { frac: 0.45, lado: 0.35 })}
      medio={<Quieto x={1760} piso={CALLE_PISO} m="amanecer" cara="alivio" />} />
  </W>
);

// ---------------- UTILERÍA EN ESCENA: la voz nombra y el objeto cae en ese segundo ----------------
export const UtEscena: React.FC = () => (
  <W>
    <Escena Set={Cocina} pal={PALETAS.whatif} zLejos={0.85} seed={5} mano={2} claves={[planoSeguro(0, { look: LEO, escala: 1.15, x: 860, piso: COCINA_PISO }, { frac: 0.55, lado: -0.45 })]}
      medio={<>
        <Figurante look={LOOKS.awakenGorra} x={600} piso={COCINA_PISO - 6} escala={0.95} seed={9} atiende={(f) => ({ x: f < 44 ? 1030 : f < 70 ? 1170 : 1310, y: COCINA_PISO - 260 })} reacciones={[{ f: 50, cara: "sorpresa" }, { f: 100, cara: "duda", pose: "pensar" }]} luz={luzC2} />
        <Actor look={LEO} escala={1.15} seed={4} luz={luzC2} ruta={[{ f: 0, x: 860, y: COCINA_PISO }]} poses={[{ f: 0, v: "hablar" }, { f: 30, v: "señalar" }]} caras={[{ f: 0, v: "neutral" }, { f: 30, v: "sorpresa" }]} miradas={[{ f: 0, v: { x: 0.9, y: 0.2 } }]} ajuste={respirar(4)} habla={[[0, 28]]} />
        <Prop name="needle" x={1030} y={COCINA_PISO - 210} desde={20} />
        <Prop name="rope" x={1170} y={COCINA_PISO - 210} desde={44} entra="cae" />
        <Prop name="coat" x={1310} y={COCINA_PISO - 210} desde={70} entra="desliza" lado={1} s={0.8} />
      </>} />
  </W>
);
const luzC2 = { lado: 1 as const, color: "#ffe0a0", fuerza: 0.9 };
