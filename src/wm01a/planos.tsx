// wm01a · LOS COMPONENTES por id. FXI = el tramo de fx.json (a, b, wow, n, momentos internos mo — todo sale de la voz, en
// D:/rtmp_wm01a/tools/fx_plan.py); FXR = id → cómo se dibuja en el segundo t. Body recorta lo que pisa al avatar/pausas/ráfagas.
import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { Rot, Stage } from "./base";
import { PercheroFX, HILO_RE, type Fi } from "./perchero";
import { CuelloFX, BallenasFX, PliegueFX, TirantesFX, PisacorbataFX } from "./comps_a";
import { RecibosFX, MarcadorFX, NavajaFX, CalendarioFX } from "./comps_b";
import FX from "./fx.json";

export const FXI: Record<string, Fi> = Object.fromEntries((FX as Fi[]).map((f) => [f.id, f]));
FXI.thumb0 = { id: "thumb0", a: 0, b: 0.8 };
const Falta: React.FC<{ t: number; f: Fi }> = ({ t, f }) => <Stage t={t} a={f.a} b={f.b}><Rot t={t} at={f.a + 0.2} out={f.b - 0.3} text={f.id} x={960} y={540} /></Stage>;

export const FXR: Record<string, (t: number, f: Fi) => React.ReactNode> = {};
for (const f of FX as Fi[]) FXR[f.id] = HILO_RE.test(f.id) ? (t, f) => <PercheroFX t={t} f={f} /> : (t, f) => <Falta t={t} f={f} />;
const C: Record<string, React.FC<{ t: number; f: Fi }>> = { cuello: CuelloFX, ballenas: BallenasFX, pliegue: PliegueFX, tirantes: TirantesFX, pisacorbata: PisacorbataFX,
  recibos: RecibosFX, marcador: MarcadorFX, navaja: NavajaFX, calendario: CalendarioFX };
for (const [k, Co] of Object.entries(C)) FXR[k] = (t, f) => <Co t={t} f={f} />;
// cuadro 0 = la miniatura SIN texto; la cámara entra en ella (se arrima a la foto de joven) hasta el primer corte
FXR.thumb0 = (t) => <AbsoluteFill style={{ background: "#0b0907", overflow: "hidden" }}>
  <Img src={staticFile("wm01a/thumb0.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", transformOrigin: "25% 45%", transform: `scale(${1 + 0.12 * Math.min(1, t / 0.8)})` }} />
</AbsoluteFill>;
