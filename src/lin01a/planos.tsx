// lin01a · LOS COMPONENTES por id. FXI = el tramo de fx.json (a, b, wow, n/k, momentos internos mo — todo sale de la voz, en
// tools/fx_plan.py); FXR = id → cómo se dibuja en el segundo t. Body recorta lo que pisa al avatar/pausas/ráfagas y la pieza
// sigue al salir (f.a/f.b son los del tramo entero, no los del pedazo).
import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { Rot, Stage } from "./base";
import { ValijaFX, type Fi } from "./valija";
import { Pin, Lupa, Tobogan, Escalera, Pie } from "./comps_a";
import { Cintura, Bandeja } from "./comps_b";
import { Cartera, Capas } from "./comps_c";
import { Errores, Ruedo, Perfume, Gatecheck } from "./comps_d";
import { Libreta, Pregunta, Tsa, Mapa, Postal } from "./comps_e";
import { IndexCard, Termometro, Carta, Bodega, Caminata, AlasPar } from "./comps_f";
import { Maniqui, Recap, Percha } from "./comps_g";
import FX from "./fx.json";

export const FXI: Record<string, Fi> = Object.fromEntries((FX as Fi[]).map((f) => [f.id, f]));
FXI.thumb0 = { id: "thumb0", a: 0, b: 0.8 };
const Falta: React.FC<{ t: number; f: Fi }> = ({ t, f }) => <Stage t={t} a={f.a} b={f.b}><Rot t={t} at={f.a + 0.2} out={f.b - 0.3} text={f.id} x={960} y={540} /></Stage>;

export const FXR: Record<string, (t: number, f: Fi) => React.ReactNode> = {};
for (const f of FX as Fi[]) FXR[f.id] = /^(valija0|hilo\d+)$/.test(f.id) ? (t, f) => <ValijaFX t={t} f={f} /> : (t, f) => <Falta t={t} f={f} />;
const C: Record<string, React.FC<{ t: number; f: Fi }>> = { pin: Pin, lupa: Lupa, tobogan: Tobogan, escalera: Escalera, pie: Pie, cintura: Cintura, bandeja: Bandeja, cartera: Cartera, capas: Capas, ruedo: Ruedo, perfume: Perfume, gatecheck: Gatecheck, tsa: Tsa, mapa: Mapa, postal: Postal, indexcard: IndexCard, termometro: Termometro, carta: Carta, bodega: Bodega, caminata: Caminata, alas: AlasPar, maniqui: Maniqui, recap: Recap, percha: Percha };
for (let k = 0; k < 6; k++) C["errores" + k] = Errores;
for (let k = 0; k < 5; k++) C["libreta" + k] = Libreta;
for (let k = 0; k < 6; k++) C["pregunta" + k] = Pregunta;
for (const [k, Co] of Object.entries(C)) FXR[k] = (t, f) => <Co t={t} f={f} />;
// cuadro 0 = la miniatura elegida (ChatGPT web) SIN texto ni flecha; empuje leve hasta el avatar en 0,8 s
FXR.thumb0 = (t) => <AbsoluteFill style={{ background: "#0b0907" }}><Img src={staticFile("lin01a/thumb0.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1 + 0.03 * Math.min(1, t / 0.8)})` }} /></AbsoluteFill>;
