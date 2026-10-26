// Demos de los componentes de explicación, cada uno dentro de un set de verdad (para juzgarlos en contexto con
// stills). Una comp por componente: Ex_Cuerpo, Ex_Grafico, Ex_Comparacion, Ex_Mapa, Ex_Causa, Ex_Medidor, Ex_Linea,
// Ex_Lupa, Ex_Multitud, Ex_Reacciones. Sirven de MOLDE: copiar el bloque y cambiar los datos.
import React from "react";
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { mira } from "./camara";
import { Actor } from "./actor";
import { Escena } from "./escena";
import { Contador, F_HUD, F_MANO, MarcaCorto } from "./pantalla";
import { PALETAS } from "./paletas";
import { LOOKS, Look } from "./personaje";
import { CalleNoche, CALLE_PISO } from "./sets/calle";
import { Cocina, COCINA_PISO } from "./sets/cocina";
import { Lab, LAB_PISO } from "./sets/lab";
import { Aula, AULA_PISO, PIZARRON } from "./sets/aula";
import { Atardecer, ATARDECER_PISO } from "./sets/atardecer";
import { CausaEfecto, Comparacion, Velo, conReaccion, CorteCuerpo, Grafico, LineaTiempo, Lupa, Mapa, Medidor, Multitud, Reaccion, ReaccionFx } from "./explica";

const LEO: Look = { estilo: "palo", camisa: "#f1ece2", manga: "corta", pantalon: "#3a4a5a", zapatos: "#f05a1f", accesorios: [{ t: "pelo", forma: "punta", color: "#17100d" }] };
const luzC = { lado: 1 as const, color: "#ffe0a0", fuerza: 0.9 };

// el presentador que señala / mira el componente: así la escena tiene personaje ACTUANDO y no un gráfico suelto
const Presenta: React.FC<{ x: number; piso: number; dir?: 1 | -1; look?: Look; cara?: string }> = ({ x, piso, dir = 1, look = LEO, cara = "determinado" }) => (
  <Actor look={look} escala={1.15} seed={4} luz={luzC} ruta={[{ f: 0, x: x - dir * 120, y: piso }, { f: 40, x, y: piso }]} dir={[{ f: 0, v: dir }]}
    poses={[{ f: 0, v: {} }, { f: 44, v: "señalar" }, { f: 120, v: "hablar" }]} caras={[{ f: 0, v: "neutral" }, { f: 44, v: cara }]}
    miradas={[{ f: 0, v: { x: dir * 0.8, y: -0.2 } }]} habla={[[50, 110]]} />
);


// dibujos de las tarjetas de Comparacion (coordenadas locales: 560 de ancho, ~340 de alto bajo la franja)
const Cama: React.FC<{ revuelta?: boolean }> = ({ revuelta }) => (
  <g>
    <rect x={70} y={250} width={420} height={18} rx={6} fill="#6b4a33" />
    <rect x={70} y={150} width={26} height={120} rx={8} fill="#6b4a33" />
    <rect x={470} y={200} width={20} height={70} rx={8} fill="#6b4a33" />
    <rect x={92} y={212} width={384} height={44} rx={14} fill="#e9e1d2" />
    <path d={revuelta ? "M170,214 q60,-34 120,-6 q60,26 110,-10 q40,-14 76,6 L476,250 L170,250 Z" : "M180,206 Q330,186 476,206 L476,250 L180,250 Z"} fill="#7d9bc4" />
  </g>
);
// los dibujos de antes/después más grandes (1,16x: la cama ya llega casi al borde de la tarjeta)
const Grande: React.FC<{ children: React.ReactNode }> = ({ children }) => <g transform="translate(280,140) scale(1.16) translate(-280,-135)">{children}</g>;
const DuermeBien: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <g>
      <rect x={340} y={30} width={150} height={110} rx={10} fill="#22304f" />
      <circle cx={438} cy={70} r={24} fill="#fff3c0" /><circle cx={450} cy={62} r={22} fill="#22304f" />
      {[[372, 52], [404, 112], [470, 118]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={3} fill="#fff" opacity={0.6 + 0.4 * Math.sin(f / 9 + i * 2)} />)}
      <Cama />
      <ellipse cx={150} cy={198} rx={44} ry={24} fill="#fff" />
      <circle cx={146} cy={176} r={30} fill="#1a1410" />
      <path d="M134,176 q6,5 12,0 M152,176 q6,5 12,0" stroke="#fff" strokeWidth={3.5} fill="none" strokeLinecap="round" />
      {[0, 1, 2].map((i) => {
        const t = ((f + i * 22) % 66) / 66;
        return <text key={i} x={186 + t * 70 + i * 6} y={150 - t * 110} fontFamily="Fredoka, sans-serif" fontWeight={600} fontSize={26 + t * 22} fill="#8a6a9a" opacity={Math.sin(t * Math.PI)}>z</text>;
      })}
    </g>
  );
};
const DuermeMal: React.FC = () => {
  const f = useCurrentFrame();
  const tiembla = Math.sin(f * 2.2) * 5;
  return (
    <g>
      <g transform={`translate(${440 + tiembla * 0.6},96) rotate(${tiembla})`}>
        <circle r={40} fill="#e8473c" /><circle r={31} fill="#fff" />
        <path d="M0,0 L0,-20 M0,0 L14,8" stroke="#2a2420" strokeWidth={5} strokeLinecap="round" />
        <circle cx={-28} cy={-38} r={13} fill="#e8473c" /><circle cx={28} cy={-38} r={13} fill="#e8473c" />
        {[-1, 1].map((sd) => <path key={sd} d={`M${sd * 54},-20 l${sd * 14},-8 M${sd * 58},0 l${sd * 16},0 M${sd * 54},20 l${sd * 14},8`} stroke="#e8473c" strokeWidth={4} strokeLinecap="round" opacity={0.5 + 0.5 * Math.sin(f * 1.3)} />)}
      </g>
      <Cama revuelta />
      <rect x={128} y={166} width={58} height={70} rx={20} fill="#fff" transform="rotate(-8 157 200)" />
      <circle cx={158} cy={140} r={32} fill="#1a1410" />
      <circle cx={148} cy={138} r={8} fill="#fff" /><circle cx={170} cy={138} r={8} fill="#fff" />
      <circle cx={149} cy={139} r={3.5} fill="#1a1410" /><circle cx={171} cy={139} r={3.5} fill="#1a1410" />
      <path d="M139,150 q9,6 18,0 M161,150 q9,6 18,0" stroke="#9b7fb0" strokeWidth={3.5} fill="none" strokeLinecap="round" />
      <path d="M150,160 q8,-4 16,0" stroke="#fff" strokeWidth={3} fill="none" strokeLinecap="round" />
      <rect x={196} y={178} width={30} height={50} rx={6} fill="#2a2420" transform="rotate(14 211 203)" />
      <rect x={200} y={183} width={22} height={38} rx={3} fill="#9fd6ff" opacity={0.85 + 0.15 * Math.sin(f / 4)} transform="rotate(14 211 203)" />
    </g>
  );
};

// gente en la tarjeta: n figuritas en grilla (el AÑO 200 llena la tarjeta)
const Gente: React.FC<{ n: number; c: string; cols?: number; max?: number }> = ({ n, c, cols: C, max = 110 }) => {
  const cols = C ?? Math.ceil(Math.sqrt(n * 2.2)), filas = Math.ceil(n / cols);
  const cw = Math.min(max, 470 / cols, 290 / (filas * 1.7)), s = (cw / 40) * 0.9;
  return (
    <g transform={`translate(${260 - (cols * cw) / 2},${150 - (filas * cw * 1.7) / 2})`}>
      {Array.from({ length: n }).map((_, i) => (
        <g key={i} transform={`translate(${(i % cols) * cw + cw / 2},${Math.floor(i / cols) * cw * 1.7 + cw * 1.2}) scale(${s})`}>
          <circle cy={-30} r={10} fill={c} /><path d="M-13,14 L-13,-6 Q-13,-17 0,-17 Q13,-17 13,-6 L13,14 Z" fill={c} />
        </g>
      ))}
    </g>
  );
};

const W: React.FC<{ children: React.ReactNode }> = ({ children }) => <AbsoluteFill style={{ background: "#000" }}>{children}<MarcaCorto /></AbsoluteFill>;

export const ExCuerpo: React.FC = () => (
  <W>
    <Escena Set={Lab} pal={PALETAS.whatif} seed={6} mano={2} claves={[mira(0, 1150, 620, 1.0), mira(200, 1180, 640, 1.06, { curva: "inout" })]}
      medio={<Presenta x={560} piso={LAB_PISO} />}
      hud={<><Velo /><CorteCuerpo x={900} y={600} s={1} organo="corazon" desde={10} rotulo="YOUR HEART" dato="+40 BPM" acento={PALETAS.whatif.acento} /></>} />
  </W>
);

export const ExGrafico: React.FC = () => (
  <W>
    <Escena Set={Cocina} pal={PALETAS.whatif} zLejos={0.85} seed={5} mano={2} claves={[mira(0, 1100, 640, 1.1), mira(200, 1140, 650, 1.15, { curva: "inout" })]}
      medio={<Presenta x={560} piso={COCINA_PISO} />}
      hud={<><Velo /><Grafico x={900} y={170} desde={10} tipo="ambos" titulo="SUGAR PER DAY" unidad="g" destacar={4}
        datos={[{ rotulo: "1900", v: 18 }, { rotulo: "1950", v: 40 }, { rotulo: "1980", v: 62 }, { rotulo: "2000", v: 78 }, { rotulo: "TODAY", v: 94 }]} acento="#ff8a3d" /></>} />
  </W>
);

export const ExComparacion: React.FC = () => (
  <W>
    <Escena Set={Atardecer} pal={PALETAS.humanidad} seed={7} mano={2} claves={[mira(0, 1300, 560, 1.0)]}
      hud={<><Velo /><Comparacion x={960} y={540} desde={8} acento={PALETAS.humanidad.acento}
        izq={{ titulo: "BEFORE", dato: "8 h", sub: "of deep sleep", color: "#8a6a9a", contenido: <Grande><DuermeBien /></Grande> }}
        der={{ titulo: "AFTER", dato: "4 h", sub: "and a 6 a.m. alarm", contenido: <Grande><DuermeMal /></Grande> }} /></>} />
  </W>
);

export const ExComparacionCortina: React.FC = () => (
  <W>
    <Escena Set={Atardecer} pal={PALETAS.humanidad} seed={7} mano={2} claves={[mira(0, 1300, 560, 1.0)]}
      hud={<><Velo /><Comparacion modo="cortina" x={960} y={560} w={520} h={520} desde={8} acento={PALETAS.humanidad.acento}
        izq={{ titulo: "YEAR 1", dato: "2", sub: "people", color: "#8a6a9a", contenido: <Gente n={2} cols={2} max={150} c="#8a6a9a" /> }}
        der={{ titulo: "YEAR 200", dato: "1,200", sub: "people", contenido: <Gente n={36} cols={9} c="#d9a21c" /> }} /></>} />
  </W>
);

export const ExMapa: React.FC = () => (
  <W>
    <Escena Set={CalleNoche} pal={PALETAS.zombi} setProps={{ variante: "zombi" }} seed={3} mano={2} claves={[mira(0, 1500, 600, 1.0)]}
      hud={<><Velo /><Mapa x={960} y={540} desde={8} titulo="ROUTE TO THE STORE" distancia={{ total: 2.4, unidad: "mi", dec: 1 }} acento={PALETAS.zombi.acento}
        puntos={[{ x: 170, y: 430, rotulo: "HOME" }, { x: 380, y: 300, via: true }, { x: 600, y: 380, via: true }, { x: 800, y: 190, rotulo: "STORE" }]} /></>} />
  </W>
);

export const ExPlano: React.FC = () => (
  <W>
    <Escena Set={CalleNoche} pal={PALETAS.zombi} setProps={{ variante: "zombi" }} seed={3} mano={2} claves={[mira(0, 1500, 600, 1.0)]}
      hud={<><Velo /><Mapa x={960} y={540} desde={8} estilo="plano" titulo="BOWLING ALLEY" acento={PALETAS.zombi.acento}
        ambientes={[
          { x: 60, y: 90, w: 520, h: 440, rotulo: "LANES", puertas: [{ lado: "s", pos: 0.17 }, { lado: "e", pos: 0.28 }],
            dibujo: <g stroke="#cfe0ff" strokeOpacity={0.55} strokeWidth={3} fill="none">{[0, 1, 2, 3, 4].map((i) => <g key={i}><rect x={250 + i * 52} y={60} width={34} height={300} rx={4} />{[0, 1, 2].map((k) => <circle key={k} cx={267 + i * 52 + (k - 1) * 8} cy={80 - (k % 2) * 8} r={3} fill="#cfe0ff" />)}</g>)}{/* bancos y estante de zapatos */}{[0, 1].map((i) => <rect key={`b${i}`} x={40} y={70 + i * 70} width={150} height={30} rx={8} />)}<rect x={40} y={210} width={124} height={50} rx={6} />{[0, 1, 2].map((i) => <path key={`z${i}`} d={`M${52 + i * 36},244 q0,-14 12,-14 l10,8 l6,6 Z`} />)}</g> },
          { x: 600, y: 90, w: 320, h: 200, rotulo: "SNACK BAR", puertas: [{ lado: "s", pos: 0.5 }],
            dibujo: <g fill="none" stroke="#cfe0ff" strokeOpacity={0.55} strokeWidth={3}><rect x={60} y={64} width={220} height={34} rx={6} />{[0, 1, 2, 3].map((i) => <circle key={i} cx={86 + i * 56} cy={124} r={11} />)}</g> },
          { x: 600, y: 310, w: 320, h: 220, rotulo: "FREEZER", puertas: [{ lado: "n", pos: 0.5 }],
            dibujo: <g fill="none" stroke="#9fd6ff" strokeOpacity={0.7} strokeWidth={3}>{[0, 1, 2].map((i) => <rect key={i} x={28 + i * 96} y={130} width={74} height={60} rx={6} />)}</g> },
        ]}
        puntos={[{ x: 150, y: 470, rotulo: "DOOR" }, { x: 300, y: 300, via: true }, { x: 590, y: 213, via: true }, { x: 700, y: 236, via: true }, { x: 760, y: 300, via: true }, { x: 800, y: 470, rotulo: "FOOD", lado: "der" }]} /></>} />
  </W>
);

export const ExCausa: React.FC = () => (
  <W>
    <Escena Set={Aula} pal={PALETAS.parabola} setProps={{ variante: "gris", pizarra: <text x={PIZARRON.x + PIZARRON.w - 50} y={PIZARRON.y + 96} textAnchor="end" fontFamily={F_MANO} fontWeight={700} fontSize={84} fill="#fffbe8">the sleep loop</text> }} seed={14} mano={2} claves={[mira(0, 950, 520, 1.0)]}
      hud={<><Velo /><CausaEfecto desde={8} acento={PALETAS.parabola.acento} tema="oscuro"
        nodos={[
          { texto: "Phone at night", x: 960, y: 300, icono: <g><rect x={-15} y={-24} width={30} height={48} rx={6} fill="#eef2f8" /><rect x={-11} y={-18} width={22} height={34} rx={2} fill="#7fc8ff" /></g> },
          { texto: "Less sleep", x: 1440, y: 565, icono: <g><circle r={20} fill="#fff3c0" /><circle cx={9} cy={-7} r={17} fill="#1d2438" /></g> },
          { texto: "More cravings", x: 960, y: 830, sub: "+300 kcal", icono: <g><circle r={21} fill="#e9a35a" /><circle r={15} fill="#ff7fb0" /><circle r={7} fill="#1d2438" /></g> },
          { texto: "Tired & low", x: 480, y: 565, icono: <g><rect x={-22} y={-12} width={40} height={24} rx={5} fill="none" stroke="#eef2f8" strokeWidth={4} /><rect x={19} y={-5} width={5} height={10} rx={2} fill="#eef2f8" /><rect x={-17} y={-7} width={9} height={14} rx={2} fill="#ff5a4a" /></g> },
        ]}
        flechas={[{ de: 0, a: 1, etiqueta: "blue light", curva: -60 }, { de: 1, a: 2, curva: -60 }, { de: 2, a: 3, etiqueta: "sugar crash", curva: -60 }, { de: 3, a: 0, etiqueta: "scroll more", curva: -60 }]} /></>} />
  </W>
);

export const ExMedidor: React.FC = () => (
  <W>
    <Escena Set={Lab} pal={PALETAS.whatif} seed={6} mano={2} claves={[mira(0, 1400, 620, 1.05)]}
      medio={<Presenta x={1700} piso={LAB_PISO} dir={-1} cara="sorpresa" />}
      hud={<><Velo /><Medidor x={650} y={560} desde={8} rotulo="STRESS LEVEL" unidad="%" claves={[{ f: 0, v: 12 }, { f: 30, v: 45 }, { f: 80, v: 93 }]} acento="#ffffff" /></>} />
  </W>
);

export const ExLinea: React.FC = () => (
  <W>
    <Escena Set={Atardecer} pal={PALETAS.humanidad} setProps={{ hora: 0.7 }} seed={7} mano={2} claves={[mira(0, 1300, 560, 1.0)]}
      hud={<><Velo /><LineaTiempo y={560} desde={8} acento={PALETAS.humanidad.acento}
        eventos={[{ año: "YEAR 1", texto: "Just the two of us" }, { año: "YEAR 20", texto: "First village" }, { año: "YEAR 75", texto: "46 people" }, { año: "YEAR 300", texto: "A small town" }, { año: "YEAR 1000", texto: "A nation" }]} /></>} />
  </W>
);

// lo que se mira con la lupa: una etiqueta de ingredientes dibujada en pantalla
const Etiqueta: React.FC = () => (
  <g>
    <rect x={560} y={230} width={800} height={620} rx={24} fill="#f8f3e8" stroke="#2a2420" strokeWidth={5} />
    <text x={600} y={300} fontFamily="Fredoka" fontWeight={600} fontSize={44} fill="#2a2420">NUTRITION FACTS</text>
    <rect x={600} y={318} width={720} height={8} fill="#2a2420" />
    {["Calories ........ 240", "Total Fat ....... 9 g", "Sodium ......... 380 mg", "Sugars .......... 32 g", "Protein ......... 2 g"].map((t, i) => (
      <text key={i} x={600} y={380 + i * 56} fontFamily="Fredoka" fontWeight={500} fontSize={34} fill="#2a2420">{t}</text>
    ))}
    <text x={600} y={704} fontFamily="Fredoka" fontWeight={500} fontSize={30} fill="#5a524a">INGREDIENTS: water, corn syrup,</text>
    <text x={600} y={752} fontFamily="Fredoka" fontWeight={500} fontSize={30} fill="#5a524a">citric acid, red 40, yellow 5.</text>
  </g>
);
export const ExLupa: React.FC = () => (
  <W>
    <Escena Set={Cocina} pal={PALETAS.whatif} zLejos={0.85} seed={5} mano={1.5} claves={[mira(0, 1150, 600, 1.0)]}
      hud={<><Velo /><Lupa desde={6} acento="#ff8a3d" notaX={1400} banda={52} mango={18} velo={{ x: 563, y: 233, w: 794, h: 614, rx: 22 }} ruta={[{ f: 22, x: 800, y: 536, nota: "32 g of sugar" }, { f: 90, x: 948, y: 692, nota: "corn syrup = more sugar" }, { f: 160, x: 785, y: 740, nota: "artificial dye" }]}><Etiqueta /></Lupa></>} />
  </W>
);

export const ExMultitud: React.FC = () => (
  <W>
    <Escena Set={CalleNoche} pal={PALETAS.parabola} setProps={{ variante: "lluvia" }} seed={11} mano={1.5} claves={[mira(0, 1500, 560, 1.0)]}
      hud={<><Velo /><Multitud x={960} y={470} desde={6} n={1000} rotulo="YOU" contador="PEOPLE" acento={PALETAS.parabola.acento}
        marcados={{ cada: 10, color: "#5ec8ff", desde: 120, etiqueta: "1 in 10 can't stop scrolling" }} /></>} />
  </W>
);

const REAC: Reaccion[] = ["sorpresa", "asco", "miedo", "alivio"];
export const ExReacciones: React.FC = () => (
  <W>
    <Escena Set={CalleNoche} pal={PALETAS.humanidad} seed={2} mano={1.5} claves={[mira(0, 1350, 690, 1.25)]}
      medio={
        <>
          {REAC.map((t, i) => {
            const x = 780 + i * 380, f0 = 20 + i * 6;
            const look: Look = i % 2 ? { ...LOOKS.awakenNaranja } : LEO;
            return (
              <React.Fragment key={t}>
                <Actor {...conReaccion({ look, escala: 1.35, seed: 20 + i, luz: luzC, ruta: [{ f: 0, x, y: CALLE_PISO }], dir: [{ f: 0, v: 1 }], poses: [{ f: 0, v: {} }], caras: [{ f: 0, v: "neutral" }], miradas: [{ f: 0, v: { x: 0.5, y: 0 } }] }, t, f0, 90)} />
                <ReaccionFx tipo={t} f0={f0} x={x + 10} y={CALLE_PISO - 400} s={1.2} />
              </React.Fragment>
            );
          })}
        </>
      }
      hud={<RotulosReac />} />
  </W>
);

// rótulo de cada reacción en la calle, debajo de su actor (pantalla: x = 960 + (mundo - 1350) * 1.25)
const RotulosReac: React.FC = () => {
  const f = useCurrentFrame(), { fps } = useVideoConfig();
  return (
    <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
      {REAC.map((t, i) => {
        const e = spring({ frame: f - (24 + i * 6), fps, config: { damping: 12 } });
        const x = 960 + (780 + i * 380 - 1350) * 1.25, txt = t === "sorpresa" ? "SURPRISE" : t === "asco" ? "DISGUST" : t === "miedo" ? "FEAR" : "RELIEF";
        const w = txt.length * 24 + 56;
        return (
          <g key={t} transform={`translate(${x},950) scale(${e})`}>
            <rect x={-w / 2} y={-34} width={w} height={64} rx={32} fill="#16131c" opacity={0.88} />
            <text y={10} textAnchor="middle" fontFamily={F_HUD} fontWeight={600} fontSize={36} fill={["#fff3c0", "#9fd86a", "#9fd6ff", "#ffffff"][i]}>{txt}</text>
          </g>
        );
      })}
    </svg>
  );
};
void ATARDECER_PISO; void AULA_PISO;
