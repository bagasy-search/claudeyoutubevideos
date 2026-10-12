// sucarne · 60-961 s (R6). GENERADO por gen961.py: fijos del EDL + ventanas del avatar (avwin.json) + relleno.
// Ningún plano del relleno dura más de 8 s. Sin huecos negros (verificado por gen961.py).
import React from "react";
import { AbsoluteFill, OffthreadVideo, Sequence, staticFile } from "remotion";
import { fr, Grade, Grain } from "./Base";
import { Push, Min1 } from "./Min1";
import { ClockDeal, CountCard, PerKilo, Cta, Lupa, OfferPoster, BeforeAfter, Chip2, Clipboard, SealDoor, Scanner } from "../repkit/Kit";
import { AvatarWins } from "./Avatar";

const Ejemplo: React.FC<{ a: number; b: number }> = ({ a, b }) => (
  <Sequence from={fr(a)} durationInFrames={fr(b) - fr(a)}>
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ position: "absolute", top: 90, right: 110 }}><Chip2 txt="EJEMPLO" size={44} bg="#C0392B" color="#fff" rot={-3} /></div>
    </AbsoluteFill>
  </Sequence>
);
const IMG = (n: string) => `img/sucarne/${n}.png`;
const VID = (n: string) => `broll/sucarne/${n}.mp4`;
const Still: React.FC<{ a: number; b: number; name: string }> = ({ a, b, name }) => (
  <Sequence from={fr(a)} durationInFrames={fr(b) - fr(a)}>
    <AbsoluteFill><Push dur={b - a} src={staticFile(IMG(name))} /></AbsoluteFill>
    <Grade /><Grain />
  </Sequence>
);
const Clip: React.FC<{ a: number; b: number; name: string }> = ({ a, b, name }) => (
  <Sequence from={fr(a)} durationInFrames={fr(b) - fr(a)}>
    <AbsoluteFill><Push dur={b - a} src={staticFile(VID(name))} vid /></AbsoluteFill>
    <Grade /><Grain />
  </Sequence>
);
// footage con desplazamiento dentro del clip (cortes distintos del mismo archivo)
const ClipOff: React.FC<{ a: number; b: number; name: string; off: number }> = ({ a, b, name, off }) => (
  <Sequence from={fr(a)} durationInFrames={fr(b) - fr(a)}>
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <OffthreadVideo src={staticFile(VID(name))} startFrom={Math.round(off * 30)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
    </AbsoluteFill>
    <Grade /><Grain />
  </Sequence>
);

export const Full961: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#000" }}>
    <Sequence from={0} durationInFrames={fr(60)}><Min1 /></Sequence>
    <ClockDeal from={60} dur={6} bg={IMG("n_vitrina_rojo_19")} hourFrom={19.5} hourTo={19.5} tSpin={60} tArrive={60.1} label="19:30 · REBAJAS" />
    <Still a={66} b={72} name="n_bandejas_etiqueta_roja" />
    <CountCard from={72} dur={8} n={11} of={11} word="OFERTA" title="La vitrina a las 19:30" bg={IMG("n_vitrina_rojo_19")} t={72.5} />
    <Still a={92} b={108} name="n_balanza_carne" />
    <Clip a={108} b={120} name="carniceria_mostrador" />
    <Clip a={135} b={150} name="wow_quesos_15s" />
    <Still a={162} b={175} name="n_bandejas_etiqueta_roja" />
    <Lupa from={175} dur={13} bg={IMG("n_bandejas_etiqueta_roja")} zoom={2.2} path={[{ x: 1000, y: 420, t: 176 }, { x: 1180, y: 520, t: 184 }]} />
    <BeforeAfter from={221} dur={17} a={IMG("n_carne_cortada_tabla")} b={IMG("n_hueso_costillar")} tWipe={230} labels={["ENTERO", "CORTADO"]} />
    <Cta from={249} dur={13} t={250} title="Las 40 trampas del súper" cover={IMG("n_pack_familiar")} bg={IMG("n_puerta_deposito")} />
    <PerKilo from={262} dur={28} tA={264} tB={267} tCalc={272} tWin={275} left={{ img: IMG("n_balanza_carne"), name: "recortes para guiso", price: 6000, grams: 1000 }} right={{ img: IMG("n_carne_cortada_tabla"), name: "bife angosto", price: 8600, grams: 1000 }} bg={IMG("n_balanza_carne")} /><Ejemplo a={262} b={290} />
    <PerKilo from={338} dur={37} tA={340} tB={350} tCalc={360} tWin={366} left={{ img: IMG("n_pollo_entero"), name: "pollo entero", price: 5200, grams: 1000 }} right={{ img: IMG("n_presas_bandeja"), name: "presas", price: 7400, grams: 1000 }} bg={IMG("n_pollo_entero")} /><Ejemplo a={338} b={375} />
    <Clipboard from={417.32} dur={8} title="CAMIÓN: MARTES" lines={[{ txt: "Camión de reparto", t: 417.82 }, { txt: "Rebajas antes del camión", t: 419.32 }]} bg={IMG("n_planilla_camion")} />
    <ClockDeal from={434} dur={25} bg={IMG("n_vitrina_rojo_19")} hourFrom={17.5} hourTo={19.5} label="MARTES 19:30" tSpin={436} tArrive={438} />
    <Clip a={459} b={467} name="sf/carnicero_corta" />
    <Still a={575} b={583} name="n_planilla_camion" />
    <Still a={592} b={600} name="n_hueso_costillar" />
    <PerKilo from={640} dur={33} tA={642} tB={648} tCalc={655} tWin={660} left={{ img: IMG("n_pack_familiar"), name: "pack familiar", price: 9800, grams: 1000 }} right={{ img: IMG("n_presas_bandeja"), name: "paquete chico", price: 11200, grams: 1000 }} bg={IMG("n_pack_familiar")} /><Ejemplo a={640} b={673} />
    <Clip a={696} b={704} name="sf/picadora" />
    <Still a={719} b={727} name="l_picadora_v2" />
    <SealDoor from={743} dur={30} bg={IMG("n_congelador_bolsas")} label="CONGELAR" size={96} tStamp={745} tPush={744.4} />
    <Still a={773} b={781} name="n_porciones_bolsas" />
    <Scanner from={816} dur={29} img={IMG("n_pack_familiar")} price={9800} tBeep={820} />
    <Still a={845} b={853} name="l_pregunta_carnicero" />
    <BeforeAfter from={872} dur={23} a={IMG("n_balanza_carne")} b={IMG("n_cuchillo_tabla")} tWipe={880} labels={["AYER", "HOY"]} />
    <Still a={895} b={903} name="l_cierre_vitrina" />
    {/* relleno: footage real primero, luego fotos N; cada plano <= 8 s */}
    <ClipOff a={120.00} b={128.00} name="sf/carnicero_corta" off={8} />
    <ClipOff a={128.00} b={135.00} name="sf/picadora" off={8} />
    <ClipOff a={150.00} b={158.00} name="sf/camion_reparto" off={0} />
    <ClipOff a={158.00} b={162.00} name="sf/cajas_carton" off={0} />
    <ClipOff a={188.00} b={196.00} name="sf/reponer_gondola" off={0} />
    <ClipOff a={196.00} b={202.68} name="sf/pollo_entero" off={0} />
    <ClipOff a={238.00} b={246.00} name="sf/porciones_bolsas" off={0} />
    <ClipOff a={246.00} b={249.00} name="sf/bandejas_carne" off={0} />
    <ClipOff a={290.00} b={298.00} name="sf/presas_pollo" off={0} />
    <ClipOff a={298.00} b={306.00} name="sf/vitrina_carne" off={0} />
    <ClipOff a={306.00} b={313.38} name="sf/pasillo_super" off={0} />
    <ClipOff a={375.00} b={380.92} name="sf/hueso_corte" off={0} />
    <ClipOff a={425.32} b={429.66} name="sf/congelador" off={0} />
    <ClipOff a={429.66} b={434.00} name="sf/camion_reparto" off={8} />
    <ClipOff a={467.00} b={475.00} name="sf/cajas_carton" off={8} />
    <ClipOff a={475.00} b={483.00} name="sf/carnicero_corta" off={20} />
    <ClipOff a={483.00} b={491.00} name="sf/picadora" off={18} />
    <ClipOff a={491.00} b={499.00} name="sf/pollo_entero" off={7} />
    <ClipOff a={499.00} b={507.00} name="sf/porciones_bolsas" off={6} />
    <ClipOff a={507.00} b={513.30} name="sf/carnicero_corta" off={32} />
    <Still a={543.64} b={551.64} name="n_etiquetadora_mesa" />
    <ClipOff a={551.64} b={559.64} name="sf/carnicero_corta" off={16} />
    <Still a={559.64} b={567.64} name="n_picadora_mesa" />
    <ClipOff a={567.64} b={575.00} name="sf/carnicero_corta" off={24} />
    <Still a={583.00} b={591.00} name="n_presas_bandeja" />
    <Still a={591.00} b={592.00} name="n_puerta_deposito" />
    <Still a={621.22} b={629.22} name="n_pollo_entero" />
    <Still a={629.22} b={637.22} name="n_hueso_costillar" />
    <Still a={637.22} b={640.00} name="n_congelador_bolsas" />
    <Still a={704.00} b={712.00} name="n_porciones_bolsas" />
    <Still a={712.00} b={719.00} name="n_bandejas_etiqueta_roja" />
    <Still a={727.00} b={735.00} name="n_vitrina_rojo_19" />
    <Still a={735.00} b={743.00} name="n_pack_familiar" />
    <Still a={781.00} b={789.00} name="n_planilla_camion" />
    <Still a={789.00} b={797.00} name="n_corte_puntos" />
    <Still a={797.00} b={805.00} name="n_etiquetadora_mesa" />
    <Still a={805.00} b={813.00} name="n_picadora_mesa" />
    <Still a={813.00} b={816.00} name="n_presas_bandeja" />
    <Still a={853.00} b={861.00} name="n_puerta_deposito" />
    <Still a={861.00} b={869.00} name="n_pollo_entero" />
    <Still a={869.00} b={872.00} name="n_hueso_costillar" />
    <Still a={920.15} b={928.15} name="n_congelador_bolsas" />
    <Still a={928.15} b={932.99} name="n_porciones_bolsas" />
    {/* ventanas del avatar (reel RunPod, fijas) */}
    <AvatarWins from={60} to={961} />
    <Grade /><Grain />
  </AbsoluteFill>
);
