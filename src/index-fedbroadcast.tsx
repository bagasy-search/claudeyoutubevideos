import React from "react";
import { registerRoot, Composition } from "remotion";
import { BroadcastDemo } from "./VideoEdit/kit/federer_broadcast";
import { PremiumDemo } from "./VideoEdit/kit/federer_premium";
import { FedererSample, ColdOpenRevelation } from "./VideoEdit/kit/federer_cinematic";

// Entry LIMPIO — solo los componentes broadcast de Dr. Federer, uno por comp.
const FedRoot: React.FC = () => (
  <>
    <Composition id="1-LowerThird-Federer" component={BroadcastDemo} durationInFrames={90} fps={30} width={1920} height={1080} defaultProps={{ which: "lowerthird" }} />
    <Composition id="2-Alerta-Esquina" component={BroadcastDemo} durationInFrames={90} fps={30} width={1920} height={1080} defaultProps={{ which: "alerta" }} />
    <Composition id="3-Ticker" component={BroadcastDemo} durationInFrames={120} fps={30} width={1920} height={1080} defaultProps={{ which: "ticker" }} />
    <Composition id="4-Antes-Despues" component={BroadcastDemo} durationInFrames={90} fps={30} width={1920} height={1080} defaultProps={{ which: "antesdespues" }} />
    <Composition id="5-Mito-vs-Realidad" component={BroadcastDemo} durationInFrames={90} fps={30} width={1920} height={1080} defaultProps={{ which: "mito" }} />
    <Composition id="6-Dato-Clave" component={BroadcastDemo} durationInFrames={90} fps={30} width={1920} height={1080} defaultProps={{ which: "dato" }} />
    <Composition id="7-Callout-Flecha" component={BroadcastDemo} durationInFrames={90} fps={30} width={1920} height={1080} defaultProps={{ which: "callout" }} />
    {/* ── LÍNEA PREMIUM (estatus) ── */}
    <Composition id="PREMIUM-1-LowerThird" component={PremiumDemo} durationInFrames={120} fps={30} width={1920} height={1080} defaultProps={{ which: "lowerthird" }} />
    <Composition id="PREMIUM-2-StatRing" component={PremiumDemo} durationInFrames={120} fps={30} width={1920} height={1080} defaultProps={{ which: "stat" }} />
    <Composition id="PREMIUM-3-Quote" component={PremiumDemo} durationInFrames={120} fps={30} width={1920} height={1080} defaultProps={{ which: "quote" }} />
    <Composition id="PREMIUM-4-Chapter" component={PremiumDemo} durationInFrames={120} fps={30} width={1920} height={1080} defaultProps={{ which: "chapter" }} />
    <Composition id="PREMIUM-5-Protocol" component={PremiumDemo} durationInFrames={300} fps={30} width={1920} height={1080} defaultProps={{ which: "protocol" }} />
    <Composition id="PREMIUM-6-AvatarExplica" component={PremiumDemo} durationInFrames={180} fps={30} width={1920} height={1080} defaultProps={{ which: "avatar" }} />
    <Composition id="PREMIUM-7-AvatarTexto" component={PremiumDemo} durationInFrames={180} fps={30} width={1920} height={1080} defaultProps={{ which: "avatartext" }} />
    {/* MUESTRA cine — cold open teaser + cámara viva (Ken Burns) */}
    <Composition id="SAMPLE-Cinematic" component={FedererSample} durationInFrames={270} fps={30} width={1920} height={1080} />
    <Composition id="SAMPLE-Revelation" component={ColdOpenRevelation} durationInFrames={150} fps={30} width={1920} height={1080} />
  </>
);

registerRoot(FedRoot);
