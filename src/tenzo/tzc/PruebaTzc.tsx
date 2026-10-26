// Prueba de los sets de tz-c (circo + elefanta, ágora + barril): un plano general por set.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { CapaSVG, Plano } from "../../anikit/camara";
import { PALETAS } from "../../anikit/paletas";
import { Circo, CIRCO_PISO } from "../sets/circo";
import { Agora, AGORA_PISO, Barril } from "../sets/agora";
import { Elefanta, Estaca, Soga, tobillo } from "../sets/elefanta";

export const PruebaTzc: React.FC<{ set: string; x: number; y: number; zoom: number; variante?: string }> = ({ set, x, y, zoom, variante }) => {
  const f = useCurrentFrame();
  const pal = PALETAS.parabola;
  const S = set === "agora" ? Agora : Circo;
  const P = set === "agora" ? AGORA_PISO : CIRCO_PISO;
  const t = tobillo(2500, P, 1, 1);
  return (
    <AbsoluteFill>
      <Plano claves={[{ f: 0, x: (x - 960) * zoom, y: (y - 540) * zoom, zoom, foco: 1 }]} mano={0}>
        <CapaSVG z={0.25} desenfoqueMax={3}><S capa="lejos" f={f} pal={pal} variante={variante} /></CapaSVG>
        <CapaSVG z={1}>
          <S capa="medio" f={f} pal={pal} variante={variante} />
          {set === "agora" ? (
            <><Barril x={2600} y={P} capa="atras" /><Barril x={2600} y={P} capa="boca" /></>
          ) : (
            <>
              <Elefanta x={2500} y={P} f={f} trompa={0.6} />
              <Estaca x={2260} y={P + 10} />
              <Soga a={t} b={{ x: 2260, y: P + 10 }} />
              <Elefanta x={1300} y={P} s={0.38} cria f={f} lagrima={0.5} />
            </>
          )}
        </CapaSVG>
        <CapaSVG z={1.4} desenfoqueMax={6}><S capa="frente" f={f} pal={pal} variante={variante} /></CapaSVG>
      </Plano>
    </AbsoluteFill>
  );
};
