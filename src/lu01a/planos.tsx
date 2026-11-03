// lu01a · LOS COMPONENTES por id. FXI = tramo de fx.json (tools/fx_lu01a.py, anclado a la voz); FXR = id → cómo se dibuja en t.
import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { Rot, Stage } from "./base";
import { type Fi, BorsaF, StradaF, MatitaF, BoomF, VedovaF, FruttaF, UnaF, CanguroF, DieciF, PolliceF, CucinaF, SolangeF } from "./compsF";
import FX from "./fx.json";

export const FXI: Record<string, Fi> = Object.fromEntries((FX as Fi[]).map((f) => [f.id, f]));
FXI.thumb0 = { id: "thumb0", a: 0, b: 0.8 };
const Falta: React.FC<{ t: number; f: Fi }> = ({ t, f }) => <Stage t={t} a={f.a} b={f.b}><Rot t={t} at={f.a + 0.2} out={f.b - 0.3} text={f.id} x={960} y={540} /></Stage>;
export const FXR: Record<string, (t: number, f: Fi) => React.ReactNode> = {};
for (const f of FX as Fi[]) FXR[f.id] = /^(borsa0|hilo\d+)$/.test(f.id) ? (t, f) => <BorsaF t={t} f={f} /> : (t, f) => <Falta t={t} f={f} />;
const C: Record<string, React.FC<{ t: number; f: Fi }>> = { strada: StradaF, matita: MatitaF, boom: BoomF, vedova: VedovaF, frutta: FruttaF, una: UnaF, canguro: CanguroF, dieci: DieciF, pollice: PolliceF, cucina: CucinaF, solange: SolangeF };
for (const [k, Co] of Object.entries(C)) FXR[k] = (t, f) => <Co t={t} f={f} />;
// cuadro 0 = la miniatura elegida SIN texto; empuje leve hasta el avatar en 0,8 s
FXR.thumb0 = (t) => <AbsoluteFill style={{ background: "#0b0907" }}><Img src={staticFile("lu01a/thumb0.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1 + 0.03 * Math.min(1, t / 0.8)})` }} /></AbsoluteFill>;
