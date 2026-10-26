import React from "react";
import { Composition, registerRoot } from "remotion";
import { Muestrario, MuestrarioLooks } from "./anikit/Muestrario";
import { PruebaSets } from "./anikit/Sets";
import { ClipA } from "./anikit/clips/ClipA";
import { ClipB } from "./anikit/clips/ClipB";
import { ClipC } from "./anikit/clips/ClipC";
import { ClipD } from "./anikit/clips/ClipD";
import * as EX from "./anikit/ExplicaDemo";
import * as UT from "./anikit/UtileriaDemo";

const DEMOS: [string, React.FC][] = [["Ex-Cuerpo", EX.ExCuerpo], ["Ex-Grafico", EX.ExGrafico], ["Ex-Comparacion", EX.ExComparacion], ["Ex-Cortina", EX.ExComparacionCortina], ["Ex-Mapa", EX.ExMapa], ["Ex-Plano", EX.ExPlano], ["Ex-Causa", EX.ExCausa], ["Ex-Medidor", EX.ExMedidor], ["Ex-Linea", EX.ExLinea], ["Ex-Lupa", EX.ExLupa], ["Ex-Multitud", EX.ExMultitud], ["Ex-Reacciones", EX.ExReacciones], ["Ut-Catalogo1", UT.UtCatalogo1], ["Ut-Catalogo2", UT.UtCatalogo2], ["Ut-Inserto", UT.UtInserto], ["Ut-Inserto2", UT.UtInserto2], ["Ut-Encuadre", UT.UtEncuadre], ["Ut-Noche", UT.UtNoche], ["Ut-Lluvia", UT.UtLluvia], ["Ut-Amanecer", UT.UtAmanecer], ["Ut-Escena", UT.UtEscena]];

const Root = () => (
  <>
    <Composition id="Sets" component={PruebaSets as any} durationInFrames={60} fps={30} width={1920} height={1080} defaultProps={{ set: "calle", x: 400, y: 0, zoom: 1, paleta: "awaken" }} />
    <Composition id="Muestrario" component={Muestrario} durationInFrames={60} fps={30} width={1920} height={1080} />
    <Composition id="MuestrarioLooks" component={MuestrarioLooks} durationInFrames={60} fps={30} width={1920} height={1080} />
    <Composition id="ClipA" component={ClipA} durationInFrames={900} fps={30} width={1920} height={1080} />
    <Composition id="ClipB" component={ClipB} durationInFrames={900} fps={30} width={1920} height={1080} />
    <Composition id="ClipC" component={ClipC} durationInFrames={900} fps={30} width={1920} height={1080} />
    {DEMOS.map(([id, C]) => <Composition key={id} id={id} component={C} durationInFrames={240} fps={30} width={1920} height={1080} />)}
    <Composition id="ClipD" component={ClipD} durationInFrames={900} fps={30} width={1920} height={1080} />
  </>
);
registerRoot(Root);
