// Canales del stickman blanco · video 1 «Londres 1348». Una animación, dos renders (ES / EN).
import React from "react";
import { Composition, registerRoot } from "remotion";
import { largoLondres, Londres1348 } from "./blanco/v01/Londres1348";
import { Banner, Perfil } from "./blanco/Marca";
import { Apertura } from "./blanco/v01/Apertura";
import { Elenco } from "./blanco/elenco";
import { AbsoluteFill } from "remotion";

// sólo la apertura (primeros ~21 s ES) para revisar con el creador
const AperturaSola: React.FC<{ idioma: "es" | "en" }> = ({ idioma }) => <AbsoluteFill style={{ background: "#000" }}><Apertura D={974} L={idioma} /></AbsoluteFill>;

// cuadros de voz por bloque (D:/rtmp/blanco/v01/voz/dur.json × 30)
const DUR_ES = [962, 946, 822, 891, 815, 1013, 752, 733, 912, 684, 806, 832, 733, 1004];
const DUR_EN = [1255, 1235, 1181, 1121, 1044, 1264, 1009, 946, 1209, 985, 1002, 1133, 896, 1289];

const Root = () => (
  <>
    <Composition id="Blanco01ES" component={Londres1348 as any} durationInFrames={largoLondres(DUR_ES)} fps={30} width={1920} height={1080} defaultProps={{ idioma: "es", durs: DUR_ES }} />
    <Composition id="Blanco01EN" component={Londres1348 as any} durationInFrames={largoLondres(DUR_EN)} fps={30} width={1920} height={1080} defaultProps={{ idioma: "en", durs: DUR_EN }} />
    <Composition id="Blanco01Apertura" component={AperturaSola as any} durationInFrames={660} fps={30} width={1920} height={1080} defaultProps={{ idioma: "es" }} />
    <Composition id="BlancoElenco" component={Elenco} durationInFrames={60} fps={30} width={1920} height={1080} />
    <Composition id="BlancoPerfil" component={Perfil} durationInFrames={1} fps={30} width={800} height={800} />
    <Composition id="BlancoBannerES" component={Banner as any} durationInFrames={1} fps={30} width={1920} height={1080} defaultProps={{ idioma: "es" }} />
    <Composition id="BlancoBannerEN" component={Banner as any} durationInFrames={1} fps={30} width={1920} height={1080} defaultProps={{ idioma: "en" }} />
  </>
);
registerRoot(Root);
