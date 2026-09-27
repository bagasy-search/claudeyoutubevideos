// TfbProof — banco de prueba de los componentes src/tfb/ sobre fotos reales del set, para verlos rendidos en el farm
// antes de usarlos en un video (compuerta de componentes nuevos: nunca se validan de memoria). Cada pieza, ~3,5 s.
import React from "react";
import { AbsoluteFill, Img, Sequence, staticFile } from "remotion";
import { TfbCamera } from "./TfbCamera";
import { TfbZoomCircle } from "./TfbZoomCircle";
import { TfbMark } from "./TfbMark";
import { TfbWord } from "./TfbWord";
import { TfbStep } from "./TfbStep";
import { TfbPlasticID } from "./TfbPlasticID";
import { TfbCrackStop } from "./TfbCrackStop";
import { TfbWeldSection } from "./TfbWeldSection";
import { TfbLeakTest } from "./TfbLeakTest";
import { TfbTriptych } from "./TfbTriptych";
import { TfbWipe } from "./TfbWipe";
import { TfbDropTest } from "./TfbDropTest";
import { TfbTeaser } from "./TfbTeaser";
import { TfbList } from "./TfbList";
import { TfbLamina } from "./TfbLamina";
import { TfbCta } from "./TfbCta";
import { TfbFlash } from "./TfbFlash";

const D = 105;
const BG = "img/tfbtanque/proof_bg.jpg";
const items: [string, (d: number) => React.ReactNode][] = [
  ["zoom", (d) => <TfbZoomCircle dur={d} kind="image" src={BG} track={[{ f: 0, x: 72, y: 38 }]} zoom={2.4} />],
  ["mark", (d) => <TfbMark dur={d} items={[{ kind: "circle", x: 72, y: 38, w: 14, h: 18, from: 2 }, { kind: "arrow", x: 50, y: 15, x2: 66, y2: 32, from: 12, color: "#FFD21F" }, { kind: "label", x: 42, y: 12, text: "la grieta", from: 18 }]} />],
  ["word", (d) => <><TfbWord dur={d} text="$2" sub="en materiales" variant="yellow" y={70} size={170} /></>],
  ["word2", (d) => <TfbWord dur={d} text="pegamento" variant="white" strike y={72} />],
  ["step", (d) => <TfbStep dur={d} n={4} total={10} label="Agujeritos" />],
  ["plastic", (d) => <TfbPlasticID dur={d} items={[{ code: "2", letters: "PE", name: "polietileno", ok: true, at: 0 }, { code: "4", letters: "PE", name: "polietileno", ok: true, at: 8 }, { code: "5", letters: "PP", name: "polipropileno", ok: false, at: 16 }]} focus={[{ f: 40, i: 2 }]} />],
  ["crack", (d) => <TfbCrackStop dur={d} holesAt={50} holeLabel="3 mm" pressureLabel="el agua empuja" stopLabel="SE FRENA" />],
  ["weld", (d) => <TfbWeldSection dur={d * 2} at={{ v: 5, fill: 35, mesh: 90, cover: 130, inside: 170 }} labels={{ v: "En V", fill: "Relleno fundido", mesh: "Malla a media altura", cover: "Capa de cierre", inside: "Adentro: sin malla", outside: "AFUERA", water: "AGUA" }} />],
  ["leak", (d) => <TfbLeakTest dur={d} hours={24} label="Prueba de llenado" okLabel="SECO" />],
  ["triptych", (d) => <TfbTriptych dur={d} panels={[{ src: "img/tfbtanque/proof_jet.jpg", focusX: 60 }, { src: "img/tfbtanque/proof_mesh.jpg", mark: "circle", mx: 55, my: 55 }, { src: "img/tfbtanque/proof_ok.jpg", mark: "arrow", mx: 60, my: 60, focusX: 70 }]} />],
  ["wipe", (d) => <TfbWipe dur={d} before={{ src: "img/tfbtanque/proof_jet.jpg" }} after={{ src: "img/tfbtanque/proof_ok.jpg" }} beforeLabel="ANTES" afterLabel="DESPUÉS" />],
  ["drop", (d) => <TfbDropTest dur={d} leftLabel="MADERA" rightLabel="POLIETILENO" leftNote="la moja" rightNote="ni la moja" />],
  ["teaser", (d) => <TfbTeaser dur={d} kicker="AL FINAL DEL VIDEO" text="Por qué el pegamento no sirve" />],
  ["list", (d) => <TfbList dur={d} title="LOS 3 ERRORES" rows={[{ text: "Otro plástico", at: 6 }, { text: "Sin agujeritos", at: 30 }, { text: "Fundir solo la tira", at: 55 }]} />],
  ["lamina", (d) => <TfbLamina dur={d} src="img/tfbtanque/lamina_0.png" points={[{ f: 0, x: 50, y: 50, z: 1 }, { f: 40, x: 30, y: 55, z: 1.9, box: [14, 28, 40, 58] }, { f: 80, x: 85, y: 85, z: 2.1, box: [69, 72, 29, 24] }]} />],
  ["cta", (d) => <TfbCta dur={d} qr="img/tfbtanque/qr_tfbtanque.png" cover="img/tfbtanque/portada-coleccion.jpg" kicker="LA GUÍA DEL CANAL" line="Escanea con tu teléfono" />],
];
export const PROOF_FRAMES = items.reduce((a, [k]) => a + (k === "weld" ? 2 * D : D), 0);

export const TfbProof: React.FC = () => {
  let t = 0;
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <TfbCamera events={[{ f: 20, dur: 10, kind: "punch", amt: 0.12 }, { f: 3 * D - 8, dur: 16, kind: "whip", dir: 1 }, { f: 60, dur: 30, kind: "shake", amt: 1 }]}>
        <Img src={staticFile(BG)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </TfbCamera>
      {items.map(([k, el]) => { const d = k === "weld" ? 2 * D : D; const s = t; t += d; return <Sequence key={k} from={s} durationInFrames={d} layout="none">{el(d)}</Sequence>; })}
      <Sequence from={20} durationInFrames={6} layout="none"><TfbFlash dur={6} /></Sequence>
    </AbsoluteFill>
  );
};
