// Demo «Día D»: 6 tomas Veo encadenadas (Hitler dormido en los Alpes -> sale por la ventana -> nubes -> la flota
// sobre el Canal -> adentro de la lancha -> cae la rampa -> se eleva sobre la playa) + capas encima (nieve y ceniza
// en profundidad, humo que cruza, cifras y fechas en el espacio, formato cine). Narrador Fish steel_es_narr.
// ⛔ 24 fps (fuente Veo). Audio final = public/dday_mix.wav (voz + ambiente Veo con duck + golpes), armado con ffmpeg.
import React from "react";
import { AbsoluteFill } from "remotion";
import { TomaClips, Toma, largoTomas } from "./TomaClips";
import { Particulas, HumoPaso, Cifra, Fecha, Franjas } from "./Capas";

const D = "dday/";
export const TOMAS_DD: Toma[] = ["d1", "d2", "d3", "d4", "d5", "d6"].map((id, i) => ({ src: D + id + ".mp4", desde: i ? 1 / 24 : 0, dura: (i ? 189 : 190) / 24, vol: 0 }));
export const LARGO_DD = largoTomas(TOMAS_DD);

export const DiaD: React.FC = () => (
  <AbsoluteFill style={{ background: "#000" }}>
    <TomaClips tomas={TOMAS_DD} />
    <Particulas desde={0} hasta={13.5} n={110} viento={-25} caida={70} semilla={7} />
    <Fecha desde={0.8} hasta={6.6} texto="5 DE JUNIO DE 1944" sub="Berghof, Alpes bávaros · 00:40" y={0.74} />
    <Cifra desde={19.2} hasta={24.2} valor={6939} sufijo="barcos" x={0.3} y={0.47} />
    <Cifra desde={20.9} hasta={25.4} valor={156000} sufijo="hombres" x={0.7} y={0.47} />
    <Fecha desde={34.4} hasta={38.8} texto="06:30" sub="Normandía · 6 de junio" y={0.3} tam={96} />
    <HumoPaso desde={32} hasta={47.3} src={D + "nube.png"} tinte={0.5} n={5} semilla={4} />
    <Particulas desde={33} hasta={47.3} n={70} color="#9a948a" viento={40} caida={-12} semilla={11} />
    <Fecha desde={42.6} hasta={47.2} texto="EL PRINCIPIO DEL FIN" y={0.78} tam={56} />
    <Franjas />
  </AbsoluteFill>
);
