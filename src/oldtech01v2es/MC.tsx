// oldtech01v2 · BLOQUE C (605,14–733,31 s, línea de 20 min) — el borde frío: Britania. Fishbourne, Chedworth, Bignor,
// Aquae Sulis, Chesters en el Muro de Adriano y Vindolanda (la tablilla de las medias). Cierra con la pregunta que abre M6.
import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import { FPS, W, H } from "./lib";
import { ShotLayer, Shot } from "./Shots";
import { ClayMap } from "./ClayMap";
import { Place, ThermalDefs, BigWord, TempSplit, Readout, Letterbox } from "./comps";
import { WaxTablet } from "./comps3";

export const OFFC = 605.135;
const T = "oldtech01v2/t2v/", R = "oldtech01v2/real/", F = "oldtech01v2/foto/";
type SC = Shot & { k?: string };
const ABS: SC[] = [
  { a: 605.135, b: 608.6, v: R + "r3264587", from: 1, rate: 1, out: { type: "dissolve", d: 0.4 } },
  { a: 608.6, b: 613.04, comp: "britmap", cam: [1.0, 0.5, 0.5, 1.03, 0.5, 0.5], out: { type: "dissolve", d: 0.5 } },
  { a: 613.04, b: 616.0, img: F + "09c41168.jpg", out: { type: "dissolve", d: 0.35 } },
  { a: 616.0, b: 618.74, img: F + "1752d36e.jpg", cam: [1.05, 0.5, 0.5, 1.25, 0.5, 0.5], out: { type: "whip", vx: 1 } },
  { a: 618.74, b: 621.46, img: F + "421fedec.jpg", cam: [1.2, 0.5, 0.5, 1.04, 0.5, 0.5], out: { type: "white", d: 0.4 } },
  { a: 621.46, b: 624.6, img: F + "f47d74a4.jpg", out: { type: "dissolve", d: 0.4 } },
  { a: 624.6, b: 627.28, img: F + "2564def3.jpg", cam: [1.04, 0.4, 0.5, 1.18, 0.6, 0.5], out: { type: "dissolve", d: 0.35 } },
  { a: 627.28, b: 630.1, img: F + "0a0c9fd8.jpg", cam: [1.05, 0.5, 0.5, 1.22, 0.5, 0.55], out: { type: "whip", vx: -1 } },
  { a: 630.1, b: 632.82, img: F + "701ac20f.jpg", cam: [1.0, 0.5, 0.5, 1.2, 0.5, 0.65], out: { type: "flash" } },
  { a: 632.82, b: 636.0, img: F + "5cfdedd1.jpg", cam: [1.05, 0.5, 0.45, 1.25, 0.5, 0.42], out: { type: "dissolve", d: 0.4 } },
  { a: 636.0, b: 640.18, img: F + "ca0d95c3.jpg", cam: [1.0, 0.3, 0.5, 1.15, 0.7, 0.5], out: { type: "zoom", fx: 0.5, fy: 0.55 } },
  { a: 640.18, b: 645.06, img: F + "91df6d1e.jpg", cam: [1.0, 0.5, 0.5, 1.3, 0.5, 0.6], out: { type: "white", d: 0.4 } },
  { a: 645.06, b: 648.4, img: F + "f2b48d22.jpg", out: { type: "dissolve", d: 0.4 } },
  { a: 648.4, b: 651.4, img: F + "ac769a27.jpg", out: { type: "dissolve", d: 0.35 } },
  { a: 651.4, b: 654.4, img: F + "3507167c.jpg", cam: [1.04, 0.5, 0.5, 1.2, 0.5, 0.55], out: { type: "whip", vx: 1 } },
  { a: 654.4, b: 657.3, img: F + "e5b8d9b7.jpg", cam: [1.2, 0.5, 0.5, 1.05, 0.5, 0.5], out: { type: "dissolve", d: 0.35 } },
  { a: 657.3, b: 659.9, img: F + "3f2e2bd1.jpg", cam: [1.05, 0.5, 0.5, 1.24, 0.5, 0.6], out: { type: "flash" } },
  { a: 659.9, b: 663.6, img: F + "2daeb976.jpg", k: "spring", out: { type: "sweep", d: 0.5 } },
  { a: 663.6, b: 666.4, v: R + "r18581449", from: 2, rate: 1, out: { type: "dissolve", d: 0.4 } },
  { a: 666.4, b: 670.0, img: F + "dabb664a.jpg", out: { type: "dissolve", d: 0.35 } },
  { a: 670.0, b: 672.6, img: F + "bfcbb5e6.jpg", cam: [1.04, 0.5, 0.5, 1.2, 0.4, 0.55], out: { type: "whip", vx: -1 } },
  { a: 672.6, b: 675.05, img: F + "06a96d56.jpg", cam: [1.05, 0.5, 0.5, 1.22, 0.5, 0.45], out: { type: "dissolve", d: 0.35 } },
  { a: 675.05, b: 677.8, img: F + "17ccf45d.jpg", cam: [1.0, 0.5, 0.5, 1.2, 0.5, 0.6], out: { type: "white", d: 0.4 } },
  { a: 677.8, b: 680.9, comp: "wallmap", cam: [1.0, 0.5, 0.5, 1.03, 0.5, 0.5], out: { type: "dissolve", d: 0.5 } },
  { a: 680.9, b: 683.5, img: F + "86abef84.jpg", cam: [1.04, 0.5, 0.5, 1.2, 0.5, 0.55], out: { type: "dissolve", d: 0.35 } },
  { a: 683.5, b: 687.0, img: F + "61ff8ae7.jpg", cam: [1.0, 0.5, 0.5, 1.18, 0.5, 0.5], out: { type: "whip", vx: 1 } },
  { a: 687.0, b: 690.6, img: F + "d9f412e0.jpg", cam: [1.05, 0.5, 0.5, 1.25, 0.45, 0.4], out: { type: "dissolve", d: 0.35 } },
  { a: 690.6, b: 693.0, img: F + "32d245bc.jpg", cam: [1.0, 0.5, 0.5, 1.15, 0.5, 0.5], out: { type: "zoom", fx: 0.5, fy: 0.5 } },
  { a: 693.0, b: 697.3, img: F + "304ea23d.jpg", out: { type: "dissolve", d: 0.4 } },
  { a: 697.3, b: 701.6, img: F + "7db146ca.jpg", grade: "blur(9px) brightness(.42)", k: "socks", out: { type: "white", d: 0.4 } },
  { a: 701.6, b: 705.0, v: R + "r3264587", from: 7, rate: 1, out: { type: "dissolve", d: 0.35 } },
  { a: 705.0, b: 707.3, v: R + "r4828773", from: 8, rate: 1, out: { type: "dissolve", d: 0.35 } },
  { a: 707.3, b: 709.7, v: R + "r18582612", from: 1, rate: 1, out: { type: "whip", vx: 1 } },
  { a: 709.7, b: 713.9, img: F + "5c4646bc.jpg", out: { type: "dissolve", d: 0.4 } },
  { a: 713.9, b: 718.4, img: F + "e96bcd54.jpg", cam: [1.04, 0.5, 0.5, 1.2, 0.5, 0.6], out: { type: "white", d: 0.4 } },
  { a: 718.4, b: 726.4, comp: "split", cam: [1.0, 0.5, 0.5, 1.03, 0.5, 0.5], out: { type: "dissolve", d: 0.5 } },
  { a: 726.4, b: 729.5, v: R + "r3264587", from: 10.5, rate: 1, out: { type: "zoom", fx: 0.5, fy: 0.5 } },
  { a: 729.5, b: 733.308, comp: "dark", cam: [1.0, 0.5, 0.5, 1.03, 0.5, 0.5] },
];
export const SHOTSC: SC[] = ABS.map((s) => ({ ...s, a: s.a - OFFC, b: s.b - OFFC }));
export const MC_FRAMES = Math.round((733.308 - OFFC) * FPS);

const Clip: React.FC<{ v: string; at: number; from?: number; rate?: number }> = ({ v, at, from = 0, rate = 1.25 }) => (
  <Sequence from={Math.round(at * FPS)} layout="none">
    <OffthreadVideo src={staticFile(`${v}.mp4`)} startFrom={Math.round(from * FPS)} playbackRate={rate} muted style={{ width: W, height: H, objectFit: "cover" }} />
  </Sequence>
);

export const MC: React.FC<{ farm?: boolean }> = () => {
  const f = useCurrentFrame(), t = f / FPS, ta = t + OFFC;
  const L = (x: number) => x - OFFC;
  const renderComp = (s: Shot) => {
    switch (s.comp) {
      case "britmap": return <ClayMap t0={L(608.4)} keys={[
        { at: 0, pos: [-20, 26, 6], look: [-24, 0, -12], fov: 36 }, { at: 4.6, pos: [-23, 15, -2], look: [-24.5, 0, -12.5], fov: 36 },
      ]} pins={[{ at: 0.6, out: 4.4, lon: -2.0, lat: 53.0, label: "BRITANNIA", sub: "el borde más frío y más húmedo" }]} />;
      case "wallmap": return <ClayMap t0={L(677.6)} keys={[
        { at: 0, pos: [-25.5, 12, -10], look: [-25.5, 0, -17.0], fov: 34 }, { at: 3.3, pos: [-25.4, 4.2, -13.4], look: [-25.5, 0.6, -17.0], fov: 34 },
      ]} pins={[{ at: 0.3, out: 3.0, lon: -2.36, lat: 54.99, label: "VINDOLANDA", sub: "a pocos kilómetros de Chesters" }]} />;
      case "split": return <TempSplit t={t} a={L(718.4)} b={L(726.4)}
        left={<><Img src={staticFile(F + "8adb19d1.jpg")} style={{ width: W, height: H, objectFit: "cover" }} />
          <Readout t={ta} a={718.6} b={726.2} x={130} y={660} label="PARA LA ÉLITE · UN SÍMBOLO DE" value="ESTATUS" /></>}
        right={<><Clip v={R + "r4828773"} at={L(718.2)} from={1} rate={1} />
          <Readout t={ta} a={723.7} b={726.2} x={1110} y={660} label="PARA UN SOLDADO" value="SUPERVIVENCIA" hot /></>} />;
      case "dark": return <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, #1d1a1c 0%, #070607 75%)" }} />;
    }
    return null;
  };
  const cur = SHOTSC.find((s) => t >= s.a && t < s.b);
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <ThermalDefs />
      {SHOTSC.map((s, i) => <ShotLayer key={i} S={SHOTSC} i={i} t={t} renderComp={renderComp} />)}
      <AbsoluteFill style={{ zIndex: 900, pointerEvents: "none" }}>
        <Place t={ta} a={605.4} b={608.5} text="EL BORDE DEL IMPERIO" />
        <Place t={ta} a={613.3} b={618.6} text="FISHBOURNE" sub="un palacio en la costa sur · h. 75 d. C." />
        <Place t={ta} a={618.9} b={621.3} text="SUELOS DE MOSAICO · SALAS CALEFACCIONADAS" />
        <Place t={ta} a={621.7} b={627.1} text="CHEDWORTH" sub="una casa de campo con dos conjuntos de baños" />
        <Place t={ta} a={627.5} b={630.0} text="CALOR HÚMEDO · CALOR SECO" />
        <Place t={ta} a={630.3} b={632.7} text="TODAVÍA EN PIE" sub="sus pilares y canales" />
        <Place t={ta} a={633.0} b={639.9} text="BIGNOR" sub="suelos calefaccionados bajo los mejores mosaicos" />
        <Place t={ta} a={640.4} b={644.9} text="MIRA HACIA ABAJO POR EL SUELO" />
        <Place t={ta} a={648.6} b={654.3} text="AQUAE SULIS" sub="Bath · el agua caliente brota sola" />
        <Place t={ta} a={654.6} b={659.8} text="Y AUN ASÍ · SUELOS ELEVADOS" sub="salas calefaccionadas junto al gran estanque" />
        {cur?.k === "spring" && <>
          <Readout t={ta} a={660.1} b={663.5} x={140} y={640} label="EL MANANTIAL" value="≈ 46 °C" hot />
          <Readout t={ta} a={661.4} b={663.5} x={1160} y={640} label="EL AIRE" value="TODAVÍA FRÍO" />
        </>}
        <Place t={ta} a={663.8} b={666.3} text="MURO DE ADRIANO" />
        <Place t={ta} a={666.6} b={672.5} text="CHESTERS" sub="uno de los baños militares mejor conservados" />
        <Place t={ta} a={672.8} b={677.7} text="EL VESTUARIO · LAS SALAS CALIENTES" />
        <Place t={ta} a={681.1} b={683.4} text="LA CASA DEL COMANDANTE" sub="sus propias salas calefaccionadas" />
        <Place t={ta} a={683.7} b={692.8} text="LAS TABLILLAS DE VINDOLANDA" sub="cartas y listas, escritas con tinta sobre madera fina" />
        <Place t={ta} a={693.3} b={697.2} text="UN PAQUETE EN CAMINO" />
        {cur?.k === "socks" && <WaxTablet t={ta} a={697.35} b={701.55} papyrus author="VINDOLANDA" work="Tablilla 346" dur={1.4}
          lines={["pares de calcetines,", "dos pares de sandalias,", "dos pares de calzoncillos"]} hot={["socks", "underpants"]} en="una carta a un soldado de la frontera" />}
        <Place t={ta} a={701.8} b={707.2} text="LLUVIA · VIENTO · FRÍO" sub="un frío que nunca terminaba de irse" />
        <Place t={ta} a={707.5} b={709.6} text="ESPERANDO CALCETINES" />
        <Place t={ta} a={709.9} b={713.8} text="UN FUEGO ENCENDIDO TODO EL DÍA" />
        <Place t={ta} a={714.1} b={718.2} text="UN BANCO DE PIEDRA TIBIO" />
        <BigWord t={ta} a={729.7} b={733.2} text="¿QUÉ TAN CALIENTE?" hot />
      </AbsoluteFill>
      <AbsoluteFill style={{ zIndex: 1000, pointerEvents: "none" }}><Letterbox open={0} /></AbsoluteFill>
    </AbsoluteFill>
  );
};
