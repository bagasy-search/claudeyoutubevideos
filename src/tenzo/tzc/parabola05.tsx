// tz05 · LA PARÁBOLA (106,0-200,2 s): el circo de Kioto, la elefanta y la soga. Mundo cálido, sin HUD.
// Cada plano = la frase de ese segundo (plan D:/rtmp/tz05_PLAN_MxM.md, acto 3). Exporta los planos con su tramo en
// SEGUNDOS ABSOLUTOS de la voz; el video los encadena con `planosDe()`.
import React from "react";
import { interpolate } from "remotion";
import { mira, useF } from "../../anikit/camara";
import { Actor } from "../../anikit/actor";
import { Escena } from "../../anikit/escena";
import { Halo } from "../../anikit/luz";
import { F_HUD, TextoMano } from "../../anikit/pantalla";
import { PALETAS } from "../../anikit/paletas";
import { Look } from "../../anikit/personaje";
import { Circo, CIRCO_PISO, CIRCO_PUNTOS as C } from "../sets/circo";
import { Elefanta, Estaca, Soga, tobillo } from "../sets/elefanta";
import { TramoS } from "./tramos";

const pal = PALETAS.parabola;
const P = CIRCO_PISO;
const ESC = 1.2;
const CALIDA = { lado: 1 as const, color: "#ffcf84", fuerza: 0.85 };
const ELX = C.elefanta;
const TOB = tobillo(ELX, P, 1, 1);
const TOBC = tobillo(ELX, P, 0.38, 1, true);

export const TENZO_NINO: Look = { estilo: "frijol", piel: "#f1d8b4", camisa: "#8d857a", alto: 0.72, accesorios: [{ t: "pelo", forma: "calvo", color: "#e9d2ae" }] };
const ENTRENADOR: Look = { estilo: "frijol", piel: "#e2c19a", camisa: "#6b4a38", pantalon: "#4a3a30", accesorios: [{ t: "sombrero", color: "#c9a46a" }, { t: "barba", color: "#d9d2c4" }] };
const CHICOS: Look[] = [
  { estilo: "frijol", piel: "#f0d6b0", camisa: "#d9604a", alto: 0.72, accesorios: [{ t: "pelo", forma: "corto", color: "#2a2018" }] },
  { estilo: "frijol", piel: "#ecd1a8", camisa: "#e9b243", alto: 0.72, accesorios: [{ t: "pelo", forma: "bob", color: "#1e1812" }] },
  { estilo: "frijol", piel: "#f3dcb8", camisa: "#5a8a6a", alto: 0.72, accesorios: [{ t: "pelo", forma: "cola", color: "#2a2018" }] },
];

// pipa del entrenador con humo que sube
const Pipa: React.FC<{ f: number }> = ({ f }) => (
  <g transform="rotate(-20)">
    <rect x={-2} y={-4} width={34} height={6} rx={3} fill="#3a2414" />
    <path d="M30,-14 L44,-14 L42,6 Q37,10 32,6 Z" fill="#6a3e20" />
    {[0, 1, 2].map((k) => {
      const u = ((f + k * 18) % 54) / 54;
      return <circle key={k} cx={37 + Math.sin(f / 9 + k) * 6} cy={-18 - u * 70} r={5 + u * 10} fill="#efe6d6" opacity={0.35 * (1 - u)} />;
    })}
  </g>
);

// rótulo recto y chico de lugar
const Rotulo: React.FC<{ texto: string; desde: number; hasta: number }> = ({ texto, desde, hasta }) => {
  const f = useF();
  const o = interpolate(f, [desde, desde + 12, hasta - 12, hasta], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return <div style={{ position: "absolute", left: 92, bottom: 86, fontFamily: F_HUD, fontWeight: 600, fontSize: 40, letterSpacing: 8, color: "#fff4dc", opacity: o, textShadow: "0 3px 10px rgba(40,20,10,0.6)" }}>{texto}</div>;
};

const Ele: React.FC<Partial<React.ComponentProps<typeof Elefanta>>> = (p) => {
  const f = useF();
  return <Elefanta x={ELX} y={P} f={f} {...p} />;
};
const EstacaSoga: React.FC<{ cria?: boolean; tension?: number; mueve?: number }> = ({ cria, tension = 0.25, mueve = 0 }) => (
  <>
    <Soga a={cria ? TOBC : TOB} b={{ x: C.estaca, y: P + 10 }} tension={tension} grosor={cria ? 4 : 4} />
    <Estaca x={C.estaca} y={P + 10} inclina={mueve} />
  </>
);

// ---------- planos ----------
// 106,0-114,0 · «Kyoto… a big tent, red and gold… music, lanterns, children everywhere»
const Kioto: React.FC = () => (
  <Escena Set={Circo} pal={pal} seed={51} mano={2}
    claves={[mira(0, 800, 520, 0.8), mira(240, 1350, 540, 0.86, { curva: "inout" })]}
    medio={<>
      {CHICOS.map((lk, i) => (
        <Actor key={i} look={lk} escala={ESC} seed={60 + i} luz={CALIDA} correr={i === 1 ? 1 : 0.6}
          ruta={[{ f: i * 30, x: -200 + i * 120, y: P }, { f: 200 + i * 20, x: 1600 + i * 160, y: P, curva: "lineal" }]}
          poses={[{ f: 0, v: i === 2 ? "saludar" : "parado" }]} caras={[{ f: 0, v: i === 0 ? "risa" : "feliz" }]} />
      ))}
    </>}
    hud={<Rotulo texto="KYOTO" desde={6} hasta={230} />}
  />
);

// 114,0-122,0 · «behind the tent, in the mud, a little boy with a shaved head… looking at something he cannot understand»
const Detras: React.FC = () => (
  <Escena Set={Circo} pal={pal} seed={52} mano={2}
    claves={[mira(0, 1900, 520, 0.95), mira(150, C.nino + 60, P - 170, 1.7, { curva: "inout" }), mira(240, C.nino + 80, P - 165, 1.8)]}
    medio={<>
      <Ele balanceo={5} />
      <EstacaSoga />
      <Actor look={TENZO_NINO} escala={ESC} seed={53} luz={CALIDA}
        ruta={[{ f: 0, x: 1820, y: P }, { f: 110, x: C.nino, y: P }]}
        poses={[{ f: 0, v: "parado" }, { f: 120, v: "firme" }]} caras={[{ f: 0, v: "neutral" }, { f: 130, v: "sorpresa" }]}
        miradas={[{ f: 0, v: { x: 0.6, y: 0 } }, { f: 130, v: { x: 0.9, y: -0.6 } }]} dir={[{ f: 0, v: 1 }]} />
    </>}
  />
);

// 122,0-130,0 · «An elephant… taller than the tent pole… ears like the sails of a boat» (sube del chico a la cabeza)
const Revela: React.FC = () => (
  <Escena Set={Circo} pal={pal} seed={54} mano={2}
    claves={[mira(0, C.nino + 120, P - 160, 1.7), mira(150, ELX + 120, 470, 0.95, { curva: "inout" }), mira(240, ELX - 300, 470, 0.7, { curva: "inout" })]}
    medio={<>
      <Ele balanceo={6} oreja={0.9} />
      <EstacaSoga />
      <Actor look={TENZO_NINO} escala={ESC} seed={53} luz={CALIDA} ruta={[{ f: 0, x: C.nino, y: P }]} dir={[{ f: 0, v: 1 }]}
        poses={[{ f: 0, v: "firme" }]} caras={[{ f: 0, v: "sorpresa" }]} miradas={[{ f: 0, v: { x: 0.8, y: -0.9 } }]} />
    </>}
  />
);

// 130,0-139,7 · «around one of its back legs… a thin rope… a stake the boy could pull out with his own two hands»
const LaEstaca: React.FC = () => (
  <Escena Set={Circo} pal={pal} seed={55} mano={1.6}
    claves={[mira(0, ELX - 100, 460, 0.85), mira(150, TOB.x - 40, P - 70, 1.9, { curva: "inout" }), mira(290, C.estaca + 40, P - 70, 2.4, { curva: "inout" })]}
    medio={<>
      <Ele balanceo={4} />
      <EstacaSoga />
      <Actor look={TENZO_NINO} escala={ESC} seed={53} luz={CALIDA}
        ruta={[{ f: 0, x: C.nino, y: P }, { f: 150, x: C.estaca - 110, y: P }]} dir={[{ f: 0, v: 1 }]}
        poses={[{ f: 0, v: "firme" }, { f: 160, v: "agacharse" }, { f: 220, v: { ...{ tronco: 38, pI: 70, rI: 115, pD: 80, rD: 120, cabeza: -20 }, hD: 75, cD: 10, hI: 60, cI: 20 } }]}
        caras={[{ f: 0, v: "duda" }, { f: 220, v: "sorpresa" }]} miradas={[{ f: 0, v: { x: 0.9, y: 0.6 } }]} />
    </>}
  />
);

// 139,9-147,9 · «The elephant does not pull… swaying a little, eating hay, as if the rope were a wall of iron»
const NoTira: React.FC = () => {
  const f = useF();
  const tr = interpolate(f, [20, 70, 120, 170, 200, 240], [0, 1, 1, 0.2, 1, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <Escena Set={Circo} pal={pal} seed={56} mano={2}
      claves={[mira(0, ELX + 80, 520, 1.05), mira(240, ELX + 20, 540, 1.12, { curva: "inout" })]}
      medio={<>
        <Ele balanceo={12} trompa={tr} oreja={0.5} />
        <EstacaSoga tension={0.1} />
      </>}
    />
  );
};

// 147,9-152,1 · «The boy finds the old trainer, sitting on a bucket, smoking a pipe»
const Busca: React.FC = () => (
  <Escena Set={Circo} pal={pal} seed={57} mano={2}
    claves={[mira(0, 2900, P - 220, 1.0), mira(126, C.balde - 150, P - 200, 1.3, { curva: "inout" })]}
    medio={<>
      <Ele balanceo={6} />
      <EstacaSoga />
      <ActorEntrenador habla={[]} cara="neutral" />
      <Actor look={TENZO_NINO} escala={ESC} seed={53} luz={CALIDA}
        ruta={[{ f: 0, x: C.estaca - 60, y: P }, { f: 110, x: C.balde - 260, y: P }]}
        poses={[{ f: 0, v: "parado" }]} caras={[{ f: 0, v: "neutral" }]} miradas={[{ f: 80, v: { x: 0.8, y: -0.3 } }]} />
    </>}
  />
);

const ActorEntrenador: React.FC<{ habla: [number, number][]; cara?: string; caras?: { f: number; v: string }[]; poses?: { f: number; v: any }[] }> = ({ habla, cara = "neutral", caras, poses }) => (
  <Actor look={ENTRENADOR} escala={ESC * 1.05} seed={58} luz={{ lado: -1, color: "#ffcf84", fuerza: 0.85 }}
    ruta={[{ f: 0, x: C.balde, y: P }]} dir={[{ f: 0, v: -1 }]} asiento={[{ f: 0, v: 70 }]}
    poses={poses ?? [{ f: 0, v: { ...{ tronco: 6, pI: 80, rI: 82, pD: 88, rD: 86 }, hD: 40, cD: 120, hI: 20, cI: 60 } }]}
    caras={caras ?? [{ f: 0, v: cara }]} miradas={[{ f: 0, v: { x: -0.8, y: 0.2 } }]} habla={habla}
    enManoD={(ff) => <Pipa f={ff} />} />
);

// 152,3-157,5 · «Sir. Why doesn't the elephant run away? It could break that rope like a piece of grass.»
const Pregunta: React.FC = () => (
  <Escena Set={Circo} pal={pal} seed={59} mano={2}
    claves={[mira(0, C.balde - 260, P - 160, 2.1), mira(156, C.balde - 240, P - 170, 2.25, { curva: "inout" })]}
    medio={<>
      <ActorEntrenador habla={[]} />
      <Actor look={TENZO_NINO} escala={ESC} seed={53} luz={CALIDA} ruta={[{ f: 0, x: C.balde - 260, y: P }]} dir={[{ f: 0, v: 1 }, { f: 40, v: -1 }, { f: 100, v: 1 }]}
        poses={[{ f: 0, v: "parado" }, { f: 40, v: "señalar" }, { f: 100, v: { hD: 60, cD: 60, hI: 50, cI: 60 } }]}
        caras={[{ f: 0, v: "duda" }, { f: 90, v: "sorpresa" }]} habla={[[0, 150]]} miradas={[{ f: 0, v: { x: 0.8, y: -0.4 } }, { f: 40, v: { x: -0.9, y: 0 } }, { f: 100, v: { x: 0.8, y: -0.4 } }]} />
    </>}
  />
);

// 157,5-161,2 · «The trainer smiles. He has heard this question many times.»
const Sonrie: React.FC = () => (
  <Escena Set={Circo} pal={pal} seed={60} mano={1.6}
    claves={[mira(0, C.balde - 10, P - 250, 2.3), mira(110, C.balde - 10, P - 255, 2.45, { curva: "inout" })]}
    medio={<ActorEntrenador habla={[]} caras={[{ f: 0, v: "neutral" }, { f: 18, v: "feliz" }]} />}
  />
);

// 161,2-182,2 · la cría: «When this elephant was a baby… she pulled… all day, all night… she cried… she stopped pulling»
// tres tramos con fundido: día (tira), noche (llora), día (deja de tirar)
const Cria: React.FC<{ tramo: "tira" | "noche" | "rinde" }> = ({ tramo }) => {
  const f = useF();
  const tira = tramo !== "rinde";
  const lag = tramo === "noche" ? ((f % 90) / 90) : 0;
  const tens = tira ? 0.85 + 0.15 * Math.sin(f / 6) : 0.1;
  return (
    <Escena Set={Circo} pal={pal} setProps={{ variante: tramo === "noche" ? "noche" : undefined }} seed={61} mano={1.6}
      claves={tramo === "rinde"
        ? [mira(0, ELX + 20, P - 120, 1.7), mira(200, ELX + 40, P - 120, 1.95, { curva: "inout" })]
        : [mira(0, ELX - 60, P - 130, 1.45), mira(260, ELX - 20, P - 120, 1.6, { curva: "inout" })]}
      medio={<>
        <g transform={`translate(${tira ? 10 + 8 * Math.sin(f / 6) : 0},0)`}>
          <Elefanta x={ELX} y={P} s={0.38} cria f={f} balanceo={tira ? 0 : 2} fase={tira ? f / 26 : undefined}
            cabeza={tramo === "rinde" ? interpolate(f, [30, 120], [0, 16], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : tira ? -6 : 0}
            trompa={tira ? 0.55 + 0.25 * Math.sin(f / 7) : 0} lagrima={lag} ojo={tramo === "rinde" ? interpolate(f, [60, 140], [1, 0.45], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 1} />
        </g>
        <Soga a={{ x: TOBC.x + (tira ? 10 + 8 * Math.sin(f / 6) : 0), y: TOBC.y }} b={{ x: C.estaca, y: P + 10 }} tension={tens} />
        <Estaca x={C.estaca} y={P + 10} />
        {tramo === "noche" && <Halo x={ELX + 200} y={P - 500} r={500} color="#9fb4ff" fuerza={0.18} />}
      </>}
    />
  );
};

// 182,4-184,5 · «The trainer taps his pipe on the bucket.»
const Golpea: React.FC = () => (
  <Escena Set={Circo} pal={pal} seed={62} mano={1.4}
    claves={[mira(0, C.balde - 70, P - 130, 2.6)]}
    medio={<ActorEntrenador habla={[]} poses={[{ f: 0, v: { tronco: 14, pI: 80, rI: 82, pD: 88, rD: 86, hD: 70, cD: 30, hI: 20, cI: 60 } }, { f: 12, v: { tronco: 16, pI: 80, rI: 82, pD: 88, rD: 86, hD: 95, cD: 30, hI: 20, cI: 60 } }, { f: 24, v: { tronco: 14, pI: 80, rI: 82, pD: 88, rD: 86, hD: 70, cD: 30, hI: 20, cI: 60 } }, { f: 36, v: { tronco: 16, pI: 80, rI: 82, pD: 88, rD: 86, hD: 95, cD: 30, hI: 20, cI: 60 } }]} />}
  />
);

// 184,5-188,7 · «She grew up. She grew so big she could pull down this whole tent.»
const Crecio: React.FC = () => (
  <Escena Set={Circo} pal={pal} seed={63} mano={2}
    claves={[mira(0, 1900, 430, 0.72), mira(126, 1950, 440, 0.76, { curva: "inout" })]}
    medio={<>
      <Ele balanceo={6} oreja={0.6} />
      <EstacaSoga />
      <ActorEntrenador habla={[[0, 126]]} />
    </>}
  />
);

// 188,9-196,1 · «in her head she is still that baby… She still believes the rope is stronger… So she never tries again.»
// la sombra en la lona de la carpa: de adulta a cría
const Sombra: React.FC = () => {
  const f = useF();
  const u = interpolate(f, [40, 130], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <Escena Set={Circo} pal={pal} seed={64} mano={1.6}
      claves={[mira(0, 1500, 560, 1.15), mira(216, 1520, 590, 1.3, { curva: "inout" })]}
      medio={<>
        <g opacity={0.34 * (1 - u)}><Elefanta x={1450} y={P - 20} s={0.95} f={f} balanceo={6} piel="#4a1a16" luz="#4a1a16" /></g>
        <g opacity={0.34 * u}><Elefanta x={1450} y={P - 20} s={0.95 * 0.45} cria f={f} balanceo={2} cabeza={14} piel="#4a1a16" luz="#4a1a16" /></g>
      </>}
    />
  );
};

// 196,2-200,1 · «The rope does not hold her, boy. The memory of the rope holds her.» (el ojo)
const Ojo: React.FC = () => {
  const f = useF();
  return (
    <Escena Set={Circo} pal={pal} seed={65} mano={1.2}
      claves={[mira(0, ELX + 395, 395, 2.4), mira(117, ELX + 395, 395, 2.75, { curva: "inout" })]}
      medio={<><Ele balanceo={1.5} ojo={interpolate(f, [40, 80], [1, 0.75], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} /></>}
      hud={<TextoMano texto={"the memory of the rope holds her."} x={960} y={930} centro desde={60} color="#fbf4e6" tam={76} vel={1.6} rot={0} brillo={false} />}
    />
  );
};

export const PARABOLA05: TramoS[] = [
  { t0: 106.0, t1: 114.0, el: <Kioto />, trans: { tipo: "luz", d: 20, color: "#ffcf84" } },
  { t0: 114.0, t1: 122.0, el: <Detras /> },
  { t0: 122.0, t1: 130.0, el: <Revela /> },
  { t0: 130.0, t1: 139.8, el: <LaEstaca /> },
  { t0: 139.8, t1: 147.9, el: <NoTira /> },
  { t0: 147.9, t1: 152.2, el: <Busca /> },
  { t0: 152.2, t1: 157.5, el: <Pregunta /> },
  { t0: 157.5, t1: 161.2, el: <Sonrie /> },
  { t0: 161.2, t1: 170.0, el: <Cria tramo="tira" />, trans: { tipo: "fundido", d: 20 } },
  { t0: 170.0, t1: 176.0, el: <Cria tramo="noche" />, trans: { tipo: "fundido", d: 18 } },
  { t0: 176.0, t1: 182.3, el: <Cria tramo="rinde" />, trans: { tipo: "fundido", d: 18 } },
  { t0: 182.3, t1: 184.5, el: <Golpea />, trans: { tipo: "fundido", d: 10 } },
  { t0: 184.5, t1: 188.8, el: <Crecio /> },
  { t0: 188.8, t1: 196.1, el: <Sombra /> },
  { t0: 196.1, t1: 200.2, el: <Ojo /> },
];
