// Prueba del mundo de Tenzo Films: un plano por set (SetTenzo) y el elenco en sus lugares (ElencoTenzo, ElencoParabolas).
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { CapaSVG, mira, Plano } from "../anikit/camara";
import { Actor } from "../anikit/actor";
import { Escena } from "../anikit/escena";
import { AMRAPALI, BUDA, LOTO, ESC, LEO, MARA, MONJE_JOVEN, PAL, PAL_ANT, PAL_DIA, REY, SIDDHARTHA, TENZO, ORO, VIEJO, CHANNA } from "./elenco";
import { HudTenzo, ManoLeo, ManoMara } from "./hud";
import { FarolMano, Tel, Carroza } from "./utileria";
import { Lavadero, LAV_PISO, LAV_PUNTOS } from "./sets/lavadero";
import { Broadway } from "./sets/broadway";
import { Cuarto } from "./sets/cuarto";
import { Vaishali, VAI_PISO, VAI_PUNTOS } from "./sets/vaishali";
import { Kapilavastu, KAP_PISO, KAP_PUNTOS } from "./sets/kapilavastu";

const SETS: Record<string, React.FC<any>> = { lavadero: Lavadero, broadway: Broadway, cuarto: Cuarto, vaishali: Vaishali, kapilavastu: Kapilavastu };
const PALS = { noche: PAL, dia: PAL_DIA, ant: PAL_ANT };
export const SetTenzo: React.FC<{ set: string; x: number; y: number; zoom: number; pal: keyof typeof PALS; sp?: Record<string, unknown> }> = ({ set, x, y, zoom, pal, sp = {} }) => {
  const f = useCurrentFrame();
  const S = SETS[set];
  const p = { f, pal: PALS[pal], ...sp };
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Plano claves={[{ ...mira(0, x, y, zoom), foco: 1 }]} mano={0}>
        <CapaSVG z={0.25} desenfoqueMax={3}><S capa="lejos" {...p} /></CapaSVG>
        <CapaSVG z={1}><S capa="medio" {...p} /></CapaSVG>
        <CapaSVG z={1.4} desenfoqueMax={6}><S capa="frente" {...p} /></CapaSVG>
      </Plano>
    </AbsoluteFill>
  );
};

const rimOro = { lado: -1 as const, color: ORO, fuerza: 0.8 };
const rimFrio = { lado: 1 as const, color: "#8fb4e8", fuerza: 0.5 };
// el lavadero a las 3 AM: Leo sentado con el celular, Tenzo en la mesa con el farol, Mara encima de Leo
export const ElencoTenzo: React.FC = () => {
  const P = LAV_PISO;
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Escena Set={Lavadero} pal={PAL} setProps={{ girando: [3, 7, 12], nieve: true, farol: false }} seed={1}
        claves={[mira(0, 1450, 640, 0.95)]}
        medio={<>
          <Actor look={MARA} escala={ESC * 1.1} seed={5} ruta={[{ f: 0, x: LAV_PUNTOS.leo - 160, y: P - 40 }]} dir={[{ f: 0, v: 1 }]} poses={[{ f: 0, v: { hD: 60, cD: 60, hI: 40, cI: 70, cabeza: 14 } }]} caras={[{ f: 0, v: "feliz" }]} opacidad={() => 0.92} />
          <Actor look={LEO} escala={ESC} seed={1} luz={rimFrio} ruta={[{ f: 0, x: LAV_PUNTOS.leo, y: P }]} dir={[{ f: 0, v: 1 }]} asiento={[{ f: 0, v: 66 }]} poses={[{ f: 0, v: "celular" }, { f: 0, v: { ...{ tronco: 6, pI: 88, rI: 88, pD: 92, rD: 92 }, hD: 30, cD: 125, cabeza: 22 } }]} caras={[{ f: 0, v: "triste" }]} miradas={[{ f: 0, v: { x: 0.3, y: 0.6 } }]} enManoD={<Tel />} />
          <Actor look={TENZO} escala={ESC} seed={2} luz={rimOro} ruta={[{ f: 0, x: LAV_PUNTOS.tenzo, y: P }]} dir={[{ f: 0, v: -1 }]} poses={[{ f: 0, v: { hD: 10, cD: 10, hI: 20, cI: 80 } }]} caras={[{ f: 0, v: "feliz" }]} miradas={[{ f: 0, v: { x: -0.6, y: 0.1 } }]} enManoD={<FarolMano />} />
        </>}
        hud={<>
          <HudTenzo min={582} dia={1} estado="sube" />
          <ManoLeo texto="just one more scroll" x={300} y={880} desde={-200} />
          <ManoMara texto="stay." x={980} y={240} desde={-200} />
        </>}
      />
    </AbsoluteFill>
  );
};

// mundo cálido: el Buda bajo el árbol, el monje joven, Amrapali en su pabellón; y Kapilavastu con Siddhartha, el rey y Channa
export const ElencoParabolas: React.FC<{ cual: "vaishali" | "kapilavastu" }> = ({ cual }) => {
  if (cual === "vaishali") {
    const P = VAI_PISO;
    return (
      <AbsoluteFill style={{ background: "#000" }}>
        <Escena Set={Vaishali} pal={PAL_ANT} setProps={{ murmullo: 0.6 }} seed={3} claves={[mira(0, 5300, 620, 0.85)]}
          medio={<>
            <Actor look={BUDA} escala={ESC} seed={1} ruta={[{ f: 0, x: VAI_PUNTOS.buda, y: P }]} asiento={[{ f: 0, v: 8 }]} poses={[{ f: 0, v: LOTO }]} caras={[{ f: 0, v: "feliz" }]} dir={[{ f: 0, v: -1 }]} />
            <Actor look={MONJE_JOVEN} escala={ESC} seed={2} ruta={[{ f: 0, x: VAI_PUNTOS.buda - 420, y: P }]} poses={[{ f: 0, v: "hablar" }]} caras={[{ f: 0, v: "duda" }]} dir={[{ f: 0, v: 1 }]} />
            <Actor look={AMRAPALI} escala={ESC} seed={3} ruta={[{ f: 0, x: VAI_PUNTOS.buda + 520, y: P }]} poses={[{ f: 0, v: "parado" }]} caras={[{ f: 0, v: "feliz" }]} dir={[{ f: 0, v: -1 }]} />
          </>}
        />
      </AbsoluteFill>
    );
  }
  const P = KAP_PISO;
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Escena Set={Kapilavastu} pal={PAL_ANT} setProps={{ portonAbierto: 0.7 }} seed={4} claves={[mira(0, 3500, 620, 0.8)]}
        medio={<>
          <Carroza x={3500} piso={P} dir={1} />
          <Actor look={SIDDHARTHA} escala={ESC} seed={1} ruta={[{ f: 0, x: 3300, y: P }]} poses={[{ f: 0, v: "parado" }]} caras={[{ f: 0, v: "sorpresa" }]} dir={[{ f: 0, v: 1 }]} />
          <Actor look={CHANNA} escala={ESC} seed={2} ruta={[{ f: 0, x: 3180, y: P }]} poses={[{ f: 0, v: "parado" }]} caras={[{ f: 0, v: "duda" }]} dir={[{ f: 0, v: 1 }]} />
          <Actor look={VIEJO} escala={ESC * 0.95} seed={3} ruta={[{ f: 0, x: KAP_PUNTOS.viejo, y: P }]} poses={[{ f: 0, v: { tronco: 26, cabeza: 10, hD: 40, cD: 30 } }]} caras={[{ f: 0, v: "triste" }]} dir={[{ f: 0, v: -1 }]} />
          <Actor look={REY} escala={ESC} seed={4} ruta={[{ f: 0, x: 2700, y: P }]} poses={[{ f: 0, v: "brazosCruzados" }]} caras={[{ f: 0, v: "enojo" }]} dir={[{ f: 0, v: 1 }]} />
        </>}
      />
    </AbsoluteFill>
  );
};
