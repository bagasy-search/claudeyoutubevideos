// Banco de prueba del kit Ole* (grupo A). Cada ítem = [duración en cuadros, elemento].
import React from "react";
import { OleDutchOven3D } from "./OleDutchOven3D";
import { OleBeanHole3D } from "./OleBeanHole3D";

export const ITEMS_A: [number, React.ReactNode][] = [
  // 1) pozo de bean-hole beans: secuencia completa (~20 s), cámara que baja del claro nevado al corte
  [600, <OleBeanHole3D camera="descend" clockFrom="Sat 9 PM" clockTo="Sun 6 AM" />],
  // 2) versión corta: brasas → olla → tapar → noche (cámara fija, rótulos propios)
  [270, <OleBeanHole3D camera="static" stages={[{ at: 0, stage: "coals" }, { at: 1.6, stage: "pot" }, { at: 3.6, stage: "bury" }, { at: 5.6, stage: "night" }]}
    labels={[{ at: 0.3, text: "2 feet of coals", target: "coals" }, { at: 2.4, text: "Flour paste seal", target: "seam" }, { at: 4.0, text: "Wet burlap", target: "burlap" }, { at: 6.2, text: "All night long", target: "none" }]} clockLabel="low and slow" />],
  // 3) hervor fuerte 10 min → susurro, la tapa se levanta y deja ver los porotos
  [300, <OleDutchOven3D on="stove" lidOpen lidAt={1} states={[{ at: 0, mode: "rolling" }, { at: 6, mode: "whisper" }]}
    labels={[{ at: 0.4, text: "Rolling boil", sub: "10 full minutes" }, { at: 6, text: "A whisper", sub: "one lazy bubble" }]} timer={{ from: 10, to: 0 }} />],
  // 4) la tapa torcida (throttle) sobre el susurro
  [180, <OleDutchOven3D on="stove" lidCracked lidAt={1.5} states={[{ at: 0, mode: "whisper" }]} label="Lid cracked" sub="just a finger's width" timer={{ from: 90, to: 120, label: "1½ to 2 hours" }} />],
  // 5) sobre brasas, hervor fuerte con tapa abierta desde el inicio, nivel que baja
  [180, <OleDutchOven3D on="coals" lidOpen lidAt={0} states={[{ at: 0, mode: "rolling" }, { at: 4, mode: "still" }]} level={[{ at: 0, level: 0.8 }, { at: 5.5, level: 0.62 }]} label="Over the coals" />],
  // 6) agua fría, sin vapor
  [120, <OleDutchOven3D on="stove" lidOpen lidAt={0} states={[{ at: 0, mode: "cold" }]} level={0.85} label="Cold water" sub="no soaking" push={0.6} />],
];
