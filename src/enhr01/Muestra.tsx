// fe01 · muestrario de las piezas firma del canal (sólo para stills de QC; no va al video)
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Ficha, Mapa, Recibo, Refrendo, Cuenta, FotoVieja, Capitulo, Dicho, Lugar, FE } from "./funerario";

export const Muestra: React.FC = () => {
  const t = useCurrentFrame() / 30;
  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at 40% 40%, #3a3028, ${FE.noche})` }}>
      <Ficha t={t} at={0} out={4} kicker="PANTEÓN DE MEZQUITÁN" title="Abrió un Día de Muertos" dato="1896" sub="2 de noviembre" />
      <Mapa t={t} at={5} out={9} city="gdl" pins={[{ at: 5.6, l: "analco" }, { at: 6.2, l: "mezquitan" }]} route={{ at: 6.6, from: "analco", to: "mezquitan" }} />
      <Recibo t={t} at={10} out={14} title="Título de fosa" folio="Nº 004127" rows={[{ at: 10.3, tx: "Derecho de uso", v: "Temporal" }, { at: 10.6, tx: "Lápida de mármol", v: "$18,500", tacha: 12 }, { at: 10.9, tx: "Foto en porcelana", v: "$2,400", tacha: 12.5 }, { at: 11.2, tx: "Refrendo", v: "10 años", ok: 13 }]} total={{ at: 11.6, tx: "Total", v: "$—" }} sello={{ at: 13.2, tx: "ESPERE" }} />
      <Refrendo t={t} at={15} out={19} from={2016} years={10} venceAt={17.6} />
      <Cuenta t={t} at={20} out={24} to={11000} suf=" USD" sub="LO QUE LE COTIZARON A LA SEÑORA DELGADO" />
      <FotoVieja t={t} at={25} out={29} src="fe01/refugio_tmp.jpg" pie="Don Refugio · 1999" />
      <Capitulo t={t} at={30} out={34} n="4" title="Quién cuida el panteón de noche" sub="el velador, la reja, la lámpara" />
      <Dicho t={t} at={35} out={39} text="La tierra se echa despacio, como si la familia todavía estuviera viendo." />
      <Lugar t={t} at={40} out={44} tx="Panteón de Mezquitán" sub="GUADALAJARA · 1 DE NOVIEMBRE DE 1999" />
    </AbsoluteFill>
  );
};
