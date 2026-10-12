// sucarne · tramo 60 s -> 400 s (R5), desde edl_60_fin.json revisado.
// APERT_OFFSET_S: offset único de la apertura (miniatura viva). 0 hasta que exista hook.wav + clip.
// Avatar = Sequence vacía (se llena con el reel). Candidatos rechazados en revisión R5:
//   l_joven_mostrador_90s (cartel en inglés), n_calculadora_precio (teléfono y caja con marca).
//   Las fotos L son Claudio: mirar a cámara está bien (l_picadora_v2 aprobada).
// CTA: texto de CANAL.md §2 (guía "Las 40 trampas del súper"). PerKilo lleva chip EJEMPLO.
import React from "react";
import { AbsoluteFill, Sequence, staticFile } from "remotion";
import { fr, Grade, Grain } from "./Base";
import { Push, Min1 } from "./Min1";
import { AvatarWins } from "./Avatar";
import { ClockDeal, CountCard, PerKilo, Cta, Lupa, OfferPoster, BeforeAfter, Chip2 } from "../repkit/Kit";

// chip "EJEMPLO" visible durante todo el PerKilo (precios de ejemplo, CANAL.md §2)
const Ejemplo: React.FC<{ a: number; b: number }> = ({ a, b }) => (
  <Sequence from={fr(T(a))} durationInFrames={fr(b) - fr(a)}>
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ position: "absolute", top: 90, right: 110 }}><Chip2 txt="EJEMPLO" size={44} bg="#C0392B" color="#fff" rot={-3} /></div>
    </AbsoluteFill>
  </Sequence>
);

export const APERT_OFFSET_S = 0;
const T = (x: number) => x + APERT_OFFSET_S;
const IMG = (n: string) => `img/sucarne/${n}.png`;
const VID = (n: string) => `broll/sucarne/${n}.mp4`;

const Still: React.FC<{ a: number; b: number; name: string }> = ({ a, b, name }) => (
  <Sequence from={fr(T(a))} durationInFrames={fr(b) - fr(a)}>
    <AbsoluteFill><Push dur={b - a} src={staticFile(IMG(name))} /></AbsoluteFill>
    <Grade /><Grain />
  </Sequence>
);
const Clip: React.FC<{ a: number; b: number; name: string }> = ({ a, b, name }) => (
  <Sequence from={fr(T(a))} durationInFrames={fr(b) - fr(a)}>
    <AbsoluteFill><Push dur={b - a} src={staticFile(VID(name))} vid /></AbsoluteFill>
    <Grade /><Grain />
  </Sequence>
);

export const Rest400: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#000" }}>
    <Sequence from={0} durationInFrames={fr(60)}><Min1 /></Sequence>

    <ClockDeal from={T(60)} dur={6} bg={IMG("n_vitrina_rojo_19")} hourFrom={19.5} hourTo={19.5} tSpin={T(60)} tArrive={T(60.1)} label="19:30 · REBAJAS" />
    <Still a={66} b={72} name="n_bandejas_etiqueta_roja" />
    <CountCard from={T(72)} dur={8} n={11} of={11} word="OFERTA" title="La vitrina a las 19:30" bg={IMG("n_vitrina_rojo_19")} t={T(72.5)} />
    <Still a={92} b={108} name="n_balanza_carne" />
    <Clip a={108} b={120} name="carniceria_mostrador" />
    <Clip a={135} b={150} name="wow_quesos_15s" />
    <Still a={162} b={175} name="n_bandejas_etiqueta_roja" />
    <Lupa from={T(175)} dur={13} bg={IMG("n_bandejas_etiqueta_roja")} zoom={2.2} path={[{ x: 1000, y: 420, t: T(176) }, { x: 1180, y: 520, t: T(184) }]} />
    <Still a={205} b={221} name="n_corte_puntos" />
    <BeforeAfter from={T(221)} dur={17} a={IMG("n_carne_cortada_tabla")} b={IMG("n_hueso_costillar")} tWipe={T(230)} labels={["ENTERO", "CORTADO"]} />
    <Cta from={T(249)} dur={13} t={T(250)} title="Las 40 trampas del súper" cover={IMG("n_pack_familiar")} bg={IMG("n_puerta_deposito")} />
    <PerKilo from={T(262)} dur={28} tA={T(264)} tB={T(267)} tCalc={T(272)} tWin={T(275)}
      left={{ img: IMG("n_balanza_carne"), name: "recortes para guiso", price: 6000, grams: 1000 }}
      bg={IMG("n_balanza_carne")}
      right={{ img: IMG("n_carne_cortada_tabla"), name: "bife angosto", price: 8600, grams: 1000 }} />
    <Ejemplo a={262} b={290} />
    <OfferPoster from={T(313)} dur={25} bg={IMG("n_pollo_entero")} big="POLLO" small="ENTERO vs PRESAS" tIn={T(314)} tPeel={T(320)} under={[{ txt: "entero", t: T(322) }, { txt: "presas", t: T(330), hl: true }]} />
    <PerKilo from={T(338)} dur={37} tA={T(340)} tB={T(350)} tCalc={T(360)} tWin={T(366)}
      left={{ img: IMG("n_pollo_entero"), name: "pollo entero", price: 5200, grams: 1000 }}
      bg={IMG("n_pollo_entero")}
      right={{ img: IMG("n_presas_bandeja"), name: "presas", price: 7400, grams: 1000 }} />
    <Ejemplo a={338} b={375} />
    <AvatarWins from={60} to={400} />
    <Grade /><Grain />
  </AbsoluteFill>
);
